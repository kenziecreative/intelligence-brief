#!/usr/bin/env node
/**
 * The trailhead gate runner.
 *
 * Why this exists: in a build that produced this pattern, every requirement with a
 * mechanical check held, and every requirement that existed only as prose drifted while
 * being complied with in letter. This is the thing that fails.
 *
 * Why it is a script and not a skill or a hook: a gate that lives inside one agent's
 * plugin exists on that surface and silently does not exist everywhere else. This runs
 * from Claude Code, Codex CLI, Gemini CLI, a bare terminal, and CI, identically.
 *
 * Four rules it enforces that are easy to get wrong:
 *
 *   1. Unknown is never pass. A stage that never ran, whose producer crashed, or whose
 *      human verdict is missing counts as a failure. Whether that failure BLOCKS is a
 *      separate axis (see the posture matrix). Collapsing those two axes is how
 *      "implemented, QA pending" became reportable as fine for eight deliverables.
 *
 *   2. A verdict must be a function of coverage, not just outcome. "The thing that ran,
 *      passed" is true of a suite with one trivial spec and fourteen that never ran. So
 *      every check reports not_run, and the ratchet refuses to let it grow.
 *
 *   3. Absent is not the same as not-applicable. A check whose input file is simply gone
 *      returns `missing_input`, which is a failure. Only a stage that explicitly declares
 *      `optional_if_absent`, for a path that has never been present, may return `n/a`.
 *      Conflating those two is how deleting a directory turns a red stage green.
 *
 *   4. The result word must distinguish states a caller can act on differently. `pass`
 *      means every stage that ran is green. `advisory` means blocking stages passed and
 *      something reporting is red. `partial` means only some stages ran. `paused` means a
 *      real failure was deliberately suspended. A caller reading only the exit code
 *      cannot tell those apart, so `--strict` exists for CI.
 *
 * Zero dependencies, node builtins only. Run from the project root:
 *
 *   node scripts/gate.mjs              run every stage, write a receipt and the ratchet
 *   node scripts/gate.mjs --stage qa   run one stage (never updates the ratchet)
 *   node scripts/gate.mjs --strict     reporting failures block too; for CI
 *   node scripts/gate.mjs --quiet      receipt only, no banner
 *
 * Exit 0 iff every blocking stage passed and no ratchet regressed. Under `--strict`,
 * every stage must pass. A paused run exits 0; a partial run exits 0 only for the stages
 * it actually ran, and its receipt never says `pass`.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { watchMtime, filesMatching, globToRegExp } from './gate-lib.mjs';

const ROOT = process.cwd();
const CONFIG_PATH = join(ROOT, 'gate.config.json');
const GATES_DIR = join(ROOT, '.gates');
const RECEIPT_PATH = join(GATES_DIR, 'last-run.json');
const RATCHET_PATH = join(GATES_DIR, 'ratchet.json');
const VERDICTS_DIR = join(GATES_DIR, 'verdicts');
const PAUSE_PATH = join(GATES_DIR, 'pause');

/** Captured stdout+stderr per command stage. 8 MB — a verbose but successful build is
 *  not a gate failure, and node's 1 MB default turned one into `error`. */
const MAX_BUFFER = 8 * 1024 * 1024;

/**
 * The posture matrix. The rule is "gate what you cannot undo, report what you can" —
 * each stage declares how reversible its failure is, and the project declares how far
 * along it is. Enforcement falls out of the pair, so adding a stage means answering one
 * question rather than filling in three columns.
 */
const POSTURE = {
  prototype: { irreversible: 'blocking', costly: 'report', cheap: 'report' },
  pilot: { irreversible: 'blocking', costly: 'blocking', cheap: 'report' },
  production: { irreversible: 'blocking', costly: 'blocking', cheap: 'blocking' },
};

const REVERSIBILITY = new Set(['irreversible', 'costly', 'cheap']);
const ENFORCEMENTS = new Set(['blocking', 'report']);

/** Bumped whenever a check's measurement changes shape; see the re-baseline note below. */
const RATCHET_SCHEMA = 'trailhead.gate.ratchet/2';

/** Verdicts that count as a demonstrated pass. Everything else is a failure. */
const PASSING = new Set(['pass', 'n/a']);

/**
 * Verdicts that block at EVERY stage level, whatever the posture matrix says.
 *
 * These are not quality signals, they are evidence that a gate's own inputs went
 * backwards — deleting `.qa/` to turn a red reporting stage green, or removing the file
 * a configured check reads. A reporting stage may be red for as long as you like; it may
 * not be made to disappear.
 */
const STRUCTURAL = new Set(['regressed_to_absent', 'missing_input', 'config_error', 'removed_from_config']);

// --------------------------------------------------------------------------- utilities

function fail(message) {
  process.stderr.write(`gate: ${message}\n`);
  process.exit(1);
}

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`${relative(ROOT, path)} is not valid JSON — ${error.message}`);
  }
}

function nowIso() {
  return new Date().toISOString();
}

// ------------------------------------------------------------------------ stage runners

/** A `command` stage: run a project command, pass iff it exits 0. */
function runCommand(stage) {
  if (!Array.isArray(stage.run) || stage.run.length === 0) {
    return outcome('config_error', `stage "${stage.id}" needs \`run\` as an argv array, e.g. ["npm","test"]`, { fail: 1 });
  }
  const [bin, ...args] = stage.run;
  const result = spawnSync(bin, args, { cwd: ROOT, encoding: 'utf8', shell: false, maxBuffer: MAX_BUFFER });
  if (result.error) {
    const why =
      result.error.code === 'ENOBUFS'
        ? `produced more than ${Math.round(MAX_BUFFER / 1e6)} MB of output`
        : result.error.message;
    return outcome('error', `could not run \`${stage.run.join(' ')}\` — ${why}`, { fail: 1 });
  }
  const ok = result.status === 0;
  const tail = (result.stderr || result.stdout || '').trim().split('\n').slice(-3).join(' ').slice(0, 200);
  return outcome(
    ok ? 'pass' : 'fail',
    ok ? `\`${stage.run.join(' ')}\` exited 0` : `\`${stage.run.join(' ')}\` exited ${result.status} — ${tail}`,
    ok ? { pass: 1 } : { fail: 1 },
  );
}

/** A `check` stage: a bundled check module exporting `run(context)`. */
async function runCheck(stage, context) {
  const modulePath = join(ROOT, 'scripts', 'checks', `${stage.check}.mjs`);
  if (!existsSync(modulePath)) {
    return outcome('config_error', `check module scripts/checks/${stage.check}.mjs is missing`, { fail: 1 });
  }
  try {
    const module = await import(pathToFileURL(modulePath).href);
    if (typeof module.run !== 'function') {
      return outcome('config_error', `scripts/checks/${stage.check}.mjs does not export run()`, { fail: 1 });
    }
    const result = await module.run({ ...context, stage });
    let verdict = result.verdict ?? 'error';
    let summary = result.summary ?? '';
    // Enforce the runner's own doctrine at the boundary where it is stated: only a stage
    // that declares `optional_if_absent` may be not-applicable. A check deciding that on
    // its own is how a configured gate quietly stops applying.
    if (verdict === 'n/a' && !stage.optional_if_absent) {
      verdict = 'config_error';
      summary = `${stage.check} returned n/a but this stage declares no optional_if_absent — ${summary}`;
    }
    return {
      verdict,
      summary,
      counts: { pass: 0, fail: 0, not_run: 0, ...(result.counts ?? {}) },
      findings: result.findings ?? [],
      identities: Array.isArray(result.identities) ? result.identities : null,
    };
  } catch (error) {
    // A crashing check is a failure, never a skip. Silent skips are the bug.
    return outcome('error', `${stage.check} threw — ${error.message}`, { fail: 1 });
  }
}

function outcome(verdict, summary, counts = {}) {
  return { verdict, summary, counts: { pass: 0, fail: 0, not_run: 0, ...counts }, findings: [], identities: null };
}

/**
 * A `human` stage: design conformance, assistive-technology evaluation. There is no code
 * path that can write one of these — the runner only reads.
 *
 * A verdict is BOUND to what it described, not merely associated with it. It records the
 * newest mtime across the stage's watch set at the moment of attestation; the runner
 * recomputes that and rejects anything older. Non-finite and future values are rejected
 * outright, because `watch_mtime: Infinity` otherwise buys a permanent pass. The cited
 * artifact must match the stage's `requires_artifact` glob, not merely exist — a verdict
 * citing `package.json` is not comparative design evidence.
 */
function runHuman(stage) {
  const rel = `.gates/verdicts/${stage.id}.md`;
  const path = join(VERDICTS_DIR, `${stage.id}.md`);
  const current = watchMtime(ROOT, stage.watch);

  if (!existsSync(path)) {
    return outcome(
      'unattested',
      `no verdict recorded — a reviewer writes ${rel} with watch_mtime: ${current}`,
      { fail: 1, not_run: 1 },
    );
  }
  const text = readFileSync(path, 'utf8');
  const field = (name) => (text.match(new RegExp(`^${name}:\\s*(.+)$`, 'm')) || [])[1]?.trim();
  const attestedBy = field('attested_by');
  const attestedAt = field('attested_at');
  const verdict = field('verdict');
  const artifact = field('artifact');
  const rawMtime = field('watch_mtime');

  const reject = (why) => outcome('unattested', `${rel}: ${why}`, { fail: 1 });

  if (!attestedBy || !verdict) return reject('needs both attested_by and verdict');
  if (!attestedAt || Number.isNaN(Date.parse(attestedAt))) {
    return reject('needs attested_at as an ISO date');
  }

  // Bind the timestamp. Infinity, NaN, and anything in the future are refusals, not
  // freshness — each one buys a verdict that never expires.
  const recorded = Number(rawMtime);
  if (rawMtime === undefined || !Number.isFinite(recorded) || recorded <= 0) {
    return reject(`watch_mtime must be a positive integer — the current value is ${current}`);
  }
  if (recorded > Date.now() + 60_000) {
    return reject('watch_mtime is in the future, which would make this verdict never expire');
  }

  if (stage.requires_artifact) {
    if (!artifact) return reject(`must cite an artifact matching ${stage.requires_artifact}`);
    const normalized = artifact.replace(/^\.\//, '');
    if (!globToRegExp(stage.requires_artifact).test(normalized)) {
      return reject(`artifact "${artifact}" does not match ${stage.requires_artifact} — cite comparative evidence, not an unrelated file`);
    }
    if (!existsSync(join(ROOT, normalized))) {
      return reject(`cited artifact "${artifact}" does not exist`);
    }
  }

  if (current > recorded) {
    return outcome(
      'stale',
      `${attestedBy} attested against an older tree — files under ${(stage.watch ?? []).join(', ')} changed since; re-attest with watch_mtime: ${current}`,
      { fail: 1 },
    );
  }
  const passed = verdict.toLowerCase() === 'pass';
  return outcome(`${passed ? 'pass' : 'fail'}`, `${attestedBy} recorded ${verdict} on ${attestedAt}`, passed ? { pass: 1 } : { fail: 1 });
}

// ------------------------------------------------------------------------------- main

async function main() {
  const argv = process.argv.slice(2);
  const quiet = argv.includes('--quiet');
  const strict = argv.includes('--strict');
  const onlyStage = argv.includes('--stage') ? argv[argv.indexOf('--stage') + 1] : null;

  const config = readJson(CONFIG_PATH);
  if (!config) fail('gate.config.json not found. Run /trailhead:init, or create it by hand.');

  const level = config.stage_level ?? 'prototype';
  if (!POSTURE[level]) fail(`unknown stage_level "${level}" — expected prototype, pilot, or production`);

  const ratchet = readJson(RATCHET_PATH, { schema: RATCHET_SCHEMA, stages: {} });
  ratchet.stages ??= {};

  // Upgrading the gate makes checks stricter, which raises measured debt without the
  // project having got worse. Comparing a new checker's numbers against an old checker's
  // ceilings reports regressions that are really a change of ruler. When the stored schema
  // is older, this run RE-BASELINES: regressions are suppressed once, fresh ceilings are
  // written, and it says so loudly — because a silent re-baseline is indistinguishable
  // from the laundering this whole file exists to prevent.
  const rebaselining = ratchet.schema !== RATCHET_SCHEMA && Object.keys(ratchet.stages).length > 0;

  const allStages = config.stages ?? [];
  const stages = allStages.filter((s) => !onlyStage || s.id === onlyStage);
  if (stages.length === 0) fail(onlyStage ? `no stage with id "${onlyStage}"` : 'gate.config.json declares no stages');

  // Validate the WHOLE config, not only the posture in force today. An
  // `enforce.production: "blokcing"` typo used to sit latent until the promotion it was
  // supposed to govern, which is the one moment nobody wants to discover it.
  const configErrors = validateConfig(allStages);

  const humanStages = allStages.filter((s) => s.type === 'human').map((s) => s.id);
  // A live read of each human stage's real outcome, for checks that need to correlate
  // against it. `status-lint` uses this: `accepted` is defined as "every human gate has a
  // recorded verdict", and checking that a verdict FILE exists is not that — a file saying
  // `verdict: fail`, or a stale one, or one citing the wrong artifact, satisfied it.
  const humanOutcome = (id) => {
    const stage = allStages.find((s) => s.id === id && s.type === 'human');
    return stage ? runHuman(stage) : null;
  };
  const context = { root: ROOT, config, level, humanStages, humanOutcome, verdictsDir: VERDICTS_DIR };
  const results = [];

  for (const stage of stages) {
    const reversibility = stage.reversibility ?? 'costly';
    const declared = stage.enforce?.[level];

    // A typo in `reversibility` or `enforce` used to fall silently through to `report`,
    // which is a downgrade nobody reviewed. Config mistakes are config errors.
    const configError = configErrors.get(stage.id) ?? null;
    const enforcement = configError
      ? 'blocking'
      : declared ?? POSTURE[level][reversibility];

    let stageOutcome;
    const optionalPath = stage.optional_if_absent;
    const seenBefore = ratchet.stages?.[stage.id]?.seen_present === true;

    if (configError) {
      stageOutcome = outcome('config_error', configError, { fail: 1 });
    } else if (optionalPath && !existsSync(join(ROOT, optionalPath))) {
      // Absent is acceptable only if it was ALWAYS absent. The ratchet remembers, so
      // deleting a directory to turn a red stage green is itself a blocking failure.
      stageOutcome = seenBefore
        ? outcome('regressed_to_absent', `${optionalPath} is gone but this stage has run against it before — restore it, or remove the stage deliberately`, { fail: 1 })
        : outcome('n/a', `${optionalPath} not present in this project`);
    } else if (stage.type === 'command') {
      stageOutcome = runCommand(stage);
    } else if (stage.type === 'check') {
      stageOutcome = await runCheck(stage, context);
    } else if (stage.type === 'human') {
      stageOutcome = runHuman(stage);
    } else {
      stageOutcome = outcome('config_error', `stage "${stage.id}" has unknown type "${stage.type}"`, { fail: 1 });
    }

    // The ratchet, on two axes. A reporting stage may not get WORSE — and the evidence a
    // count summarizes may not simply disappear.
    const remembered = ratchet.stages?.[stage.id] ?? {};
    const ceiling = remembered.not_run_ceiling;
    const notRun = stageOutcome.counts?.not_run ?? 0;
    const regressions = [];

    if (typeof ceiling === 'number' && notRun > ceiling) {
      regressions.push(`${stage.id}: not_run rose to ${notRun}, ceiling is ${ceiling}`);
    }

    // Counting alone let deletion read as improvement: two unrun specs, ceiling two,
    // delete one, count falls to one, green. The identity set is what makes "we fixed it"
    // distinguishable from "we deleted it".
    if (Array.isArray(remembered.identities) && Array.isArray(stageOutcome.identities)) {
      const present = new Set(stageOutcome.identities);
      const vanished = remembered.identities.filter((id) => !present.has(id));
      if (vanished.length > 0) {
        regressions.push(
          `${stage.id}: ${vanished.length} item(s) this gate has measured before are gone — ${vanished.slice(0, 5).join(', ')}${vanished.length > 5 ? ', …' : ''}. Restore them, or remove them from .gates/ratchet.json in the same commit so the removal is visible in review`,
        );
      }
    }
    const regression = rebaselining || regressions.length === 0 ? null : regressions.join(' | ');

    results.push({
      id: stage.id,
      title: stage.title ?? stage.id,
      type: stage.type,
      reversibility,
      enforcement,
      regression,
      optional_path_present: optionalPath ? existsSync(join(ROOT, optionalPath)) : null,
      ...stageOutcome,
    });
  }

  // A stage deleted from gate.config.json used to vanish without a trace: the runner only
  // ever looked at what the config declared, so removing a gate was the quietest way to
  // pass it. The ratchet remembers every stage that has run here, so a remembered stage
  // with no config entry is a removed gate — the same class as a removed input.
  const removedStages = onlyStage
    ? []
    : Object.keys(ratchet.stages).filter((id) => !allStages.some((s) => s.id === id));
  for (const id of removedStages) {
    results.push({
      id,
      title: id,
      type: 'removed',
      reversibility: 'irreversible',
      enforcement: 'blocking',
      regression: null,
      optional_path_present: null,
      ...outcome(
        'removed_from_config',
        `this stage has run here before and is no longer in gate.config.json — restore it, or delete its entry from .gates/ratchet.json in the same commit so the removal is visible in review`,
        { fail: 1 },
      ),
    });
  }

  const regressions = results.filter((r) => r.regression).map((r) => r.regression);
  const blockingFailures = results.filter(
    (r) => !PASSING.has(r.verdict) && (r.enforcement === 'blocking' || STRUCTURAL.has(r.verdict) || strict),
  );
  const reportedFailures = results.filter((r) => !PASSING.has(r.verdict) && !blockingFailures.includes(r));
  const paused = existsSync(PAUSE_PATH);
  const hard = blockingFailures.length > 0 || regressions.length > 0;

  // The pause hatch exists because one you designed beats one the user builds by deleting
  // the gate. It does NOT cover a ratchet regression or a structural failure: those are
  // the gate's own memory reporting that something went backwards.
  const launderable = regressions.length > 0 || results.some((r) => STRUCTURAL.has(r.verdict));
  const pauseApplies = paused && hard && !launderable;

  // Four words a caller can act on differently. `pass` means nothing is red.
  let result;
  if (onlyStage) result = hard ? 'fail' : 'partial';
  else if (pauseApplies) result = 'paused';
  else if (hard) result = 'fail';
  else if (reportedFailures.length > 0) result = 'advisory';
  else result = 'pass';

  // Write the receipt before deciding the exit code, so a red run is still recorded.
  if (!existsSync(GATES_DIR)) mkdirSync(GATES_DIR, { recursive: true });
  writeFileSync(
    RECEIPT_PATH,
    `${JSON.stringify(
      {
        schema: 'trailhead.gate.run/1',
        result,
        stage_level: level,
        strict,
        produced_at: nowIso(),
        partial: Boolean(onlyStage),
        regressions,
        stages: results.map(({ regression, ...rest }) => rest),
      },
      null,
      2,
    )}\n`,
  );

  // Persist the ratchet — the memory that makes "may not get worse" mean anything.
  // Only on a FULL run: a --stage run has no view of the other stages and must not be
  // able to lower a ceiling it did not measure. The ceiling only ever falls; raising it
  // is a human edit in a reviewable diff, which is what stops "adding a spec turns the
  // gate red" from becoming "don't add the spec".
  if (!onlyStage) writeRatchet(ratchet, results, rebaselining);

  if (!quiet) printBanner({ level, results, regressions, result, paused: pauseApplies, onlyStage, strict, ratchet, rebaselining });

  if (paused && launderable) {
    process.stderr.write('\ngate: .gates/pause does not cover a ratchet regression or removed gate inputs.\n');
  }
  if (result === 'paused') {
    process.stderr.write('\ngate: .gates/pause is present, so this red run does not block. Delete it to re-arm.\n');
  }
  process.exit(hard && result !== 'paused' ? 1 : 0);
}

/**
 * Update and write `.gates/ratchet.json`. Ceilings fall, never rise; the identity set only
 * grows. Both directions are deliberate — the file is a memory of what this gate has ever
 * measured here, and the only way to shrink it is a human edit in a reviewable diff.
 */
function writeRatchet(ratchet, results, rebaselining = false) {
  for (const r of results) {
    const entry = (ratchet.stages[r.id] ??= {});
    if (r.optional_path_present === true) entry.seen_present = true;
    // Only record from a stage that actually produced a measurement.
    if (r.verdict !== 'n/a' && !STRUCTURAL.has(r.verdict) && r.verdict !== 'error') {
      const notRun = r.counts?.not_run ?? 0;
      entry.not_run_ceiling =
        rebaselining || typeof entry.not_run_ceiling !== 'number' ? notRun : Math.min(entry.not_run_ceiling, notRun);
      if (Array.isArray(r.identities)) {
        entry.identities = [...new Set([...(entry.identities ?? []), ...r.identities])].sort();
      }
    }
  }
  ratchet.schema = RATCHET_SCHEMA;
  ratchet.updated_at = nowIso();
  ratchet._note =
    'Runner-owned memory of what this gate has measured here. Ceilings only ever fall and identity sets only ever grow, both automatically. To retire an item deliberately — a QA spec you deleted on purpose, a decision that no longer applies, a stage you removed — delete it from this file in the same commit, so the retirement is visible in review rather than in nobody\'s memory.';
  writeFileSync(RATCHET_PATH, `${JSON.stringify(ratchet, null, 2)}\n`);
}

/** Validate every stage across every posture level. Returns id → first error. */
function validateConfig(stages) {
  const errors = new Map();
  const seen = new Set();
  for (const stage of stages) {
    const record = (message) => {
      if (!errors.has(stage.id)) errors.set(stage.id, message);
    };
    if (!stage.id) record('a stage has no id');
    else if (seen.has(stage.id)) record(`duplicate stage id "${stage.id}"`);
    seen.add(stage.id);

    if (!REVERSIBILITY.has(stage.reversibility ?? 'costly')) {
      record(`stage "${stage.id}" has reversibility "${stage.reversibility}" — expected irreversible, costly, or cheap`);
    }
    for (const [key, value] of Object.entries(stage.enforce ?? {})) {
      if (!POSTURE[key]) record(`stage "${stage.id}" has enforce."${key}" — expected prototype, pilot, or production`);
      else if (!ENFORCEMENTS.has(value)) record(`stage "${stage.id}" has enforce.${key} = "${value}" — expected blocking or report`);
    }
    if (stage.type === 'human' && (!Array.isArray(stage.watch) || stage.watch.length === 0)) {
      record(`human stage "${stage.id}" declares no watch set — its verdict could never expire`);
    }
  }
  return errors;
}

function printBanner({ level, results, regressions, result, paused, onlyStage, strict, ratchet, rebaselining }) {
  const out = [''];
  out.push(
    `GATE  stage=${level}  rule=gate-what-you-cannot-undo` +
      (strict ? '  [strict]' : '') +
      (onlyStage ? `  (single stage: ${onlyStage})` : ''),
  );
  out.push('');

  const width = Math.max(...results.map((r) => r.id.length), 12);
  for (const r of results) {
    const effective = r.enforcement === 'blocking' || STRUCTURAL.has(r.verdict) || strict;
    const posture = effective ? 'BLOCKING' : 'report  ';
    const mark = PASSING.has(r.verdict) ? r.verdict.toUpperCase() : `${r.verdict.toUpperCase()} <<`;
    out.push(`  ${r.id.padEnd(width)}  ${posture}  ${mark.padEnd(20)} ${r.summary}`);
    if (r.regression) out.push(`  ${''.padEnd(width)}  RATCHET   ${r.regression}`);
  }

  // The debt line. Printing the number on every run is what makes it un-forgettable.
  const notRun = results.reduce((sum, r) => sum + (r.counts?.not_run ?? 0), 0);
  const humans = results.filter((r) => r.type === 'human');
  const attested = humans.filter((r) => r.verdict === 'pass').length;
  out.push('');
  out.push(
    `  debt        ${notRun} never-run item(s)` +
      (humans.length ? `, ${attested} of ${humans.length} human gates attested` : ''),
  );
  const ceilings = Object.entries(ratchet.stages ?? {})
    .filter(([, v]) => typeof v.not_run_ceiling === 'number')
    .map(([k, v]) => `${k}<=${v.not_run_ceiling}`);
  if (ceilings.length) out.push(`  ratchet     ${ceilings.join('  ')}`);
  if (rebaselining) {
    out.push('  ratchet     RE-BASELINED — the gate was upgraded, so these ceilings were measured');
    out.push('              by a stricter checker. Regressions are suppressed for this run only.');
  }

  // Price reporting failures against the next promotion rather than showing them as
  // generic warnings. A red report line is a bill with a due date. Each level lists only
  // what it newly adds, so the two lines don't restate each other.
  const wouldFail = [];
  const named = new Set(results.filter((r) => r.enforcement === 'blocking').map((r) => r.id));
  for (const next of ['pilot', 'production']) {
    if (next === level) continue;
    const names = results
      .filter((r) => !PASSING.has(r.verdict) && !named.has(r.id))
      .filter((r) => (POSTURE[next][r.reversibility] ?? 'report') === 'blocking')
      .map((r) => r.id);
    names.forEach((id) => named.add(id));
    if (names.length) wouldFail.push(`  promoting to ${next} would fail on: ${names.join(', ')}`);
  }

  const gloss = {
    pass: 'every stage green',
    advisory: 'blocking stages green, something reporting is red',
    partial: 'only the named stage ran — this does not support a "verified" claim',
    paused: 'red, deliberately suspended by .gates/pause',
    fail: '',
  }[result];

  out.push('');
  out.push(
    `RESULT ${result}${gloss ? `  (${gloss})` : ''}` +
      (regressions.length ? `  [${regressions.length} ratchet regression(s)]` : ''),
  );
  if (wouldFail.length) out.push(...wouldFail);
  out.push('');
  process.stdout.write(out.join('\n'));
}

main().catch((error) => fail(error.stack ?? String(error)));

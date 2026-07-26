#!/usr/bin/env node
// qa-ratchet.test.mjs
//
// Fixtures for the QA stage's VERDICT CLASSIFICATION, and for the anti-laundering
// properties that classification is load-bearing for.
//
// The defect this exists for: an empty `.qa/` returned `missing_input`, which is in the
// runner's STRUCTURAL set — it blocks at every stage level and `.gates/pause` does not
// cover it. So every freshly initialized project exited 1, while `trailhead-init` told the
// user to expect `advisory` and 0. `missing_input` means a configured input went AWAY.
// Nothing has gone away on a new project; `.qa/` is present and empty because no specs
// have been written yet. That is a coverage signal, which is what `costly` already prices:
// red and reporting at prototype, blocking from pilot on.
//
// The reason this needs its own fixtures rather than a one-line assertion: `missing_input`
// was quietly doing DOUBLE DUTY. It was also the only thing stopping "delete every spec in
// `.qa/`" from turning a red stage green, because the empty branch returned no identity
// set and the runner only compares identities when both sides are arrays. Reclassifying
// the verdict without also returning `[]` would have fixed the exit code and silently
// opened a laundering path. Part B is what proves it didn't.
//
// Part A tests the check in isolation. Part B drives the REAL `gate.mjs` end to end,
// because the ratchet lives in the runner — a check-local assertion cannot see it. Part B
// uses a qa-only config so each scenario is isolated, and full runs (never `--stage`,
// which deliberately never writes the ratchet).
//
// Run from the marketplace root:
//   node dev/trailhead/tests/qa-ratchet.test.mjs
//
// Exits 0 if every case matches, 1 otherwise. No dependencies — Node 18+.

import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..');
const scaffold = join(repoRoot, 'trailhead', 'scaffold');

const { run } = await import(join(scaffold, 'scripts', 'checks', 'qa-ratchet.mjs'));

let failures = 0;
let ran = 0;

function report(name, problem) {
  ran += 1;
  if (problem) {
    failures += 1;
    console.error(`  FAIL  ${name}\n        ${problem}`);
  } else {
    console.log(`  ok    ${name}`);
  }
}

// ------------------------------------------------- Part A: verdict classification
// The full matrix of what `.qa/` can look like. The distinction each row defends is
// "absent" vs "present and empty" vs "present with unrun work" — collapsing any pair of
// those is how a stage goes green for the wrong reason.

console.log('\nPart A — verdict classification');

const root = mkdtempSync(join(tmpdir(), 'trailhead-qa-'));

async function classify({ name, files, expectVerdict, expectIdentities, stage = {} }) {
  const qaDir = join(root, '.qa');
  rmSync(qaDir, { recursive: true, force: true });
  if (files) {
    mkdirSync(qaDir, { recursive: true });
    for (const [file, body] of Object.entries(files)) writeFileSync(join(qaDir, file), body);
  }

  const result = await run({ root, config: { qa_dir: '.qa' }, stage });
  const problems = [];
  if (result.verdict !== expectVerdict) problems.push(`expected verdict ${expectVerdict}, got ${result.verdict} (${result.summary})`);
  if (expectIdentities !== undefined) {
    const got = JSON.stringify(result.identities);
    const want = JSON.stringify(expectIdentities);
    if (got !== want) problems.push(`expected identities ${want}, got ${got}`);
  }
  report(name, problems.join('; ') || null);
}

await classify({
  name: 'absent .qa/ is missing_input (structural — a configured input is gone)',
  files: null,
  expectVerdict: 'missing_input',
});

// The regression case. `fail` is posture-priced; `missing_input` is not.
await classify({
  name: 'present but empty is fail, NOT missing_input',
  files: { 'HISTORY.md': '# History\n' },
  expectVerdict: 'fail',
});

// The other half of the same fix — without this, deleting every spec evades the ratchet.
await classify({
  name: 'present but empty returns an EMPTY identity set, not none',
  files: { 'HISTORY.md': '# History\n' },
  expectVerdict: 'fail',
  expectIdentities: [],
});

await classify({
  name: 'registry files (HISTORY/README/FINDINGS) are not specs',
  files: { 'HISTORY.md': '# History\n', 'README.md': '# Readme\n', 'FINDINGS.md': '# Findings\n' },
  expectVerdict: 'fail',
  expectIdentities: [],
});

await classify({
  name: 'specs that never ran fail, and name themselves as identities',
  files: { 'HISTORY.md': '# History\n', 'auth.md': '# auth\n', 'checkout.md': '# checkout\n' },
  expectVerdict: 'fail',
  expectIdentities: ['auth', 'checkout'],
});

await classify({
  name: 'a spec credited by a history ROW with an outcome passes',
  files: { 'HISTORY.md': '# History\n\n| auth | passed | 2026-07-25 |\n', 'auth.md': '# auth\n' },
  expectVerdict: 'pass',
  expectIdentities: ['auth'],
});

// Credit must be bound to an engine artifact, not to prose that merely names the spec.
await classify({
  name: 'prose naming a spec does not credit it',
  files: { 'HISTORY.md': '# History\n\nNo auth scenarios have run yet.\n', 'auth.md': '# auth\n' },
  expectVerdict: 'fail',
  expectIdentities: ['auth'],
});

await classify({
  name: 'a row recording a NON-run does not credit it',
  files: { 'HISTORY.md': '# History\n\n| auth | not run | 2026-07-25 |\n', 'auth.md': '# auth\n' },
  expectVerdict: 'fail',
  expectIdentities: ['auth'],
});

rmSync(root, { recursive: true, force: true });

// ------------------------------------------- Part B: the runner, end to end
// The ratchet lives in gate.mjs, so these drive the real runner in a real temp project.
// A qa-only config keeps each scenario isolated from the other seven stages.

console.log('\nPart B — end to end through the real gate.mjs');

const QA_STAGE = {
  id: 'qa',
  title: 'QA specs have run',
  type: 'check',
  check: 'qa-ratchet',
  reversibility: 'costly',
  optional_if_absent: '.qa',
};

function project(stageLevel = 'prototype') {
  const dir = mkdtempSync(join(tmpdir(), 'trailhead-qa-e2e-'));
  mkdirSync(join(dir, 'scripts', 'checks'), { recursive: true });
  for (const f of ['gate.mjs', 'gate-lib.mjs']) {
    writeFileSync(join(dir, 'scripts', f), readFileSync(join(scaffold, 'scripts', f)));
  }
  writeFileSync(
    join(dir, 'scripts', 'checks', 'qa-ratchet.mjs'),
    readFileSync(join(scaffold, 'scripts', 'checks', 'qa-ratchet.mjs')),
  );
  writeFileSync(
    join(dir, 'gate.config.json'),
    `${JSON.stringify({ schema: 'trailhead.gate.config/1', project: 'fixture', stage_level: stageLevel, qa_dir: '.qa', stages: [QA_STAGE] }, null, 2)}\n`,
  );
  mkdirSync(join(dir, '.qa'), { recursive: true });
  writeFileSync(join(dir, '.qa', 'HISTORY.md'), '# History\n');
  return dir;
}

function gate(dir) {
  const proc = spawnSync(process.execPath, ['scripts/gate.mjs', '--quiet'], { cwd: dir, encoding: 'utf8' });
  const receipt = JSON.parse(readFileSync(join(dir, '.gates', 'last-run.json'), 'utf8'));
  return { exit: proc.status, result: receipt.result, regressions: receipt.regressions, stages: receipt.stages };
}

function specs(dir, names) {
  for (const n of names) writeFileSync(join(dir, '.qa', `${n}.md`), `# ${n}\n`);
}

// The headline: a freshly initialized project must not exit 1.
{
  const dir = project('prototype');
  const r = gate(dir);
  report(
    'fresh init: empty .qa/ at prototype is advisory, exit 0',
    r.exit === 0 && r.result === 'advisory' ? null : `got result=${r.result} exit=${r.exit} (want advisory / 0)`,
  );
  rmSync(dir, { recursive: true, force: true });
}

// Same state, one level up: the bill comes due.
{
  const dir = project('pilot');
  const r = gate(dir);
  report(
    'empty .qa/ at pilot blocks, exit 1',
    r.exit === 1 && r.result === 'fail' ? null : `got result=${r.result} exit=${r.exit} (want fail / 1)`,
  );
  rmSync(dir, { recursive: true, force: true });
}

// The laundering path the old structural verdict was accidentally covering.
{
  const dir = project('prototype');
  specs(dir, ['auth', 'checkout', 'search']);
  gate(dir); // measure them, so the ratchet remembers the identities

  const ratchet = JSON.parse(readFileSync(join(dir, '.gates', 'ratchet.json'), 'utf8'));
  report(
    'three unrun specs are remembered as identities',
    JSON.stringify(ratchet.stages?.qa?.identities) === JSON.stringify(['auth', 'checkout', 'search'])
      ? null
      : `ratchet recorded ${JSON.stringify(ratchet.stages?.qa?.identities)}`,
  );

  for (const n of ['auth', 'checkout', 'search']) rmSync(join(dir, '.qa', `${n}.md`));
  const r = gate(dir);
  report(
    'deleting every spec is caught as a ratchet regression, exit 1',
    r.exit === 1 && r.regressions.length > 0 ? null : `got exit=${r.exit} regressions=${JSON.stringify(r.regressions)}`,
  );

  // The hatch is for failures you decide to carry, never for the gate's own memory.
  writeFileSync(join(dir, '.gates', 'pause'), '');
  const paused = gate(dir);
  report(
    '.gates/pause does not launder the vanished specs, still exit 1',
    paused.exit === 1 ? null : `pause suppressed a ratchet regression — exit=${paused.exit} result=${paused.result}`,
  );
  rmSync(dir, { recursive: true, force: true });
}

// Deleting the directory itself is a different structural failure, and must stay one.
{
  const dir = project('prototype');
  specs(dir, ['auth']);
  gate(dir); // stage has now seen .qa/ present
  rmSync(join(dir, '.qa'), { recursive: true, force: true });
  const r = gate(dir);
  const qa = r.stages.find((s) => s.id === 'qa');
  report(
    'deleting .qa/ after it has been seen is regressed_to_absent, exit 1',
    r.exit === 1 && qa?.verdict === 'regressed_to_absent' ? null : `got verdict=${qa?.verdict} exit=${r.exit}`,
  );
  rmSync(dir, { recursive: true, force: true });
}

// A project that has genuinely never had QA is the only case allowed to be n/a.
{
  const dir = project('prototype');
  rmSync(join(dir, '.qa'), { recursive: true, force: true });
  const r = gate(dir);
  const qa = r.stages.find((s) => s.id === 'qa');
  report(
    'never-present .qa/ is n/a and passes',
    r.exit === 0 && qa?.verdict === 'n/a' ? null : `got verdict=${qa?.verdict} exit=${r.exit}`,
  );
  rmSync(dir, { recursive: true, force: true });
}

// --------------------------------------------------------------------------- summary

if (failures > 0) {
  console.error(`\n${failures} of ${ran} case(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${ran} case(s) passed — the QA stage is posture-priced without becoming launderable.`);

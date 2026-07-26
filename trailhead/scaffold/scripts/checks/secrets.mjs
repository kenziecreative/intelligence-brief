/**
 * Credential material — the single detector.
 *
 * This is the one gate that blocks at every project stage, including a throwaway
 * prototype, because it is the one whose failure cannot be taken back. A failing test is
 * fixable on your own schedule. A key that reaches a remote is rotated, not undone.
 *
 * It runs in two modes, and the pre-commit hook shells out to the `--staged` one rather
 * than carrying its own copy of the patterns. Two pattern tables in two languages drift:
 * a staged OpenAI-shaped key used to pass the hook and fail the gate, which teaches people
 * that one of the two is lying.
 *
 *   node scripts/checks/secrets.mjs            (as a gate stage, via the runner)
 *   node scripts/checks/secrets.mjs --staged   (the index, for a pre-commit hook)
 *
 * Never prints a matched value. A report that quotes the secret it found has copied the
 * secret into a new file, which is the problem again with more steps.
 *
 * Incomplete coverage is not a pass. An irreversible stage that says `pass` while some of
 * the tree went unread is asserting something it did not establish — the honest verdict is
 * `incomplete`, which is in the fail class.
 */

import { join } from 'node:path';
import { statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { filesMatching, readOr, result } from '../gate-lib.mjs';

/**
 * High-confidence prefixed credential formats only. Entropy heuristics belong in a real
 * scanner (gitleaks, trufflehog); this is the always-available floor that needs no
 * install, and it is deliberately biased toward zero false positives so nobody learns to
 * ignore it.
 */
export const PATTERNS = [
  { name: 'Stripe secret key', re: /\bsk_(live|test)_[A-Za-z0-9]{16,}/g },
  { name: 'AWS access key id', re: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { name: 'GitHub token', re: /\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})/g },
  { name: 'GitLab token', re: /\bglpat-[A-Za-z0-9_-]{20,}/g },
  { name: 'Slack token', re: /\bxox[bpoasr]-[A-Za-z0-9-]{10,}/g },
  { name: 'Google API key', re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { name: 'OpenAI key', re: /\bsk-(proj-)?[A-Za-z0-9_-]{32,}/g },
  { name: 'Anthropic key', re: /\bsk-ant-[A-Za-z0-9_-]{24,}/g },
  { name: 'private key block', re: /-----BEGIN (RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/g },
  { name: 'connection string with inline password', re: /\b[a-z][a-z0-9+.-]*:\/\/[^\s:@/]+:[^\s:@/]{6,}@/g },
];

const SCAN = ['**/*'];
const SKIP = /\.(png|jpe?g|gif|svg|pdf|ico|woff2?|ttf|otf|zip|gz|tar|mp4|mov|wasm|map)$|(^|\/)(\.DS_Store|package-lock\.json|yarn\.lock|pnpm-lock\.yaml|Cargo\.lock)$/i;

/** Applied to the MATCHED TEXT only — never to the surrounding line. */
const PLACEHOLDER = /(EXAMPLE|PLACEHOLDER|YOUR[_-]|XXXX|\.\.\.|<[a-z-]+>|\$\{)/i;

/**
 * Inline waiver. A test fixture that constructs a synthetic PEM is a true positive in form
 * and a false positive in substance; loosening the pattern would weaken the check for
 * everyone. A waiver keeps the decision on the line, visible in the diff.
 *
 * A waiver does NOT produce `pass`. It produces `waived`, which is in the fail class at
 * production and reported below it — because "an agent told to make the gate green" is a
 * documented pressure, and a one-comment escape from an irreversible gate is the cheapest
 * possible response to it. Accepting waivers is a project decision made once in
 * `gate.config.json`, not a decision an agent makes per line.
 */
const WAIVER = /trailhead-ignore-secret/;

const MAX_FILE_BYTES = 2_000_000;
const MAX_LINE_CHARS = 4_000;

/** Scan one text blob. Returns matched {name} or null. Exported for the staged mode. */
export function scanText(text, { onWaive } = {}) {
  const hits = [];
  const lines = text.split('\n');
  let truncated = 0;
  lines.forEach((line, index) => {
    // A credential past the cap is not "mostly scanned", it is unscanned. Record it as
    // truncated so the verdict cannot be pass.
    const subject = line.length > MAX_LINE_CHARS ? (truncated++, line.slice(0, MAX_LINE_CHARS)) : line;
    for (const { name, re } of PATTERNS) {
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(subject)) !== null) {
        if (PLACEHOLDER.test(match[0])) continue;
        if (WAIVER.test(subject) || WAIVER.test(lines[index - 1] ?? '')) {
          onWaive?.(index + 1);
          return;
        }
        hits.push({ name, line: index + 1 });
        return;
      }
    }
  });
  return { hits, truncated };
}

/** `--staged` mode: scan the index, which is what git is about to record. */
function runStaged(root) {
  const names = spawnSync('git', ['diff', '--cached', '--name-only', '-z'], { cwd: root, encoding: 'utf8' });
  if (names.status !== 0) return { findings: [], waived: [], skipped: [], scanned: 0 };
  const findings = [];
  const waived = [];
  const skipped = [];
  let scanned = 0;
  for (const file of (names.stdout ?? '').split('\0').filter(Boolean)) {
    if (SKIP.test(file)) continue;
    const blob = spawnSync('git', ['show', `:${file}`], { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    if (blob.status !== 0 || typeof blob.stdout !== 'string') {
      skipped.push(`${file} (unreadable from the index)`);
      continue;
    }
    scanned += 1;
    const { hits, truncated } = scanText(blob.stdout, { onWaive: (line) => waived.push(`${file}:${line}`) });
    for (const hit of hits) findings.push({ severity: 'critical', title: `possible ${hit.name}`, evidence: `${file}:${hit.line}` });
    if (truncated) skipped.push(`${file} (${truncated} line(s) over ${MAX_LINE_CHARS} chars)`);
  }
  return { findings, waived, skipped, scanned };
}

export async function run({ root, config = {} }) {
  const globs = config.secret_scan_globs ?? SCAN;
  if (Array.isArray(globs) && globs.length === 0) {
    // An empty scope is not a clean tree, it is no scan at all.
    return result('config_error', 'secret_scan_globs is empty — nothing would be scanned', { fail: 1 });
  }

  const candidates = filesMatching(root, globs).filter((f) => !SKIP.test(f));
  const findings = [];
  const skipped = [];
  const waived = [];
  let scanned = 0;

  for (const file of candidates) {
    let bytes = 0;
    try {
      bytes = statSync(join(root, file)).size;
    } catch {
      skipped.push(`${file} (unreadable)`);
      continue;
    }
    if (bytes > MAX_FILE_BYTES) {
      skipped.push(`${file} (${Math.round(bytes / 1e6)} MB)`);
      continue;
    }
    const text = readOr(join(root, file), null);
    if (text === null) {
      skipped.push(`${file} (unreadable)`);
      continue;
    }
    scanned += 1;
    const { hits, truncated } = scanText(text, { onWaive: (line) => waived.push(`${file}:${line}`) });
    for (const hit of hits) findings.push({ severity: 'critical', title: `possible ${hit.name}`, evidence: `${file}:${hit.line}` });
    if (truncated) skipped.push(`${file} (${truncated} line(s) over ${MAX_LINE_CHARS} chars)`);
  }

  const notes = [
    ...skipped.map((s) => ({ severity: 'major', title: 'not fully scanned', evidence: s })),
    ...waived.map((w) => ({ severity: 'major', title: 'waived with trailhead-ignore-secret', evidence: w })),
  ];
  const skipNote = skipped.length ? `; ${skipped.length} not fully scanned (${skipped.slice(0, 2).join(', ')}${skipped.length > 2 ? ', …' : ''})` : '';
  const waivedNote = waived.length ? `; ${waived.length} waived inline (${waived.slice(0, 2).join(', ')}${waived.length > 2 ? ', …' : ''})` : '';

  if (findings.length > 0) {
    return result(
      'fail',
      `${findings.length} possible credential(s) — ${findings.slice(0, 3).map((f) => f.evidence).join(', ')}${findings.length > 3 ? ', …' : ''}${waivedNote}${skipNote}`,
      { pass: 0, fail: findings.length, not_run: skipped.length + waived.length },
      [...findings, ...notes],
    );
  }

  // No hits, but coverage was not complete. Saying `pass` here would assert something this
  // run did not establish, on the one stage whose failure cannot be undone.
  if (skipped.length > 0 || waived.length > 0) {
    return result(
      'incomplete',
      `${scanned} files scanned with no matches, but coverage was not complete${waivedNote}${skipNote}`,
      { pass: scanned, fail: 0, not_run: skipped.length + waived.length },
      notes,
    );
  }

  return result('pass', `${scanned} files scanned, no high-confidence credential formats matched`, { pass: scanned });
}

// Direct invocation: `--staged` for the pre-commit path. Exit 2 on a finding, matching the
// hook contract; exit 0 otherwise. Prints locations only, never values.
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  if (process.argv.includes('--staged')) {
    const { findings, waived, skipped } = runStaged(process.cwd());
    for (const f of findings) process.stderr.write(`SECRETS CHECK: ${f.title} in the STAGED content of ${f.evidence}\n`);
    for (const w of waived) process.stderr.write(`SECRETS CHECK: waived inline at ${w}\n`);
    for (const s of skipped) process.stderr.write(`SECRETS CHECK: not fully scanned — ${s}\n`);
    if (findings.length > 0) {
      process.stderr.write('SECRETS CHECK FAILED: this is what git is about to record, not what is on disk. Unstage it, remove the credential, or move the value into environment-specific secret management. Do not paste it into chat.\n');
      process.exit(2);
    }
    process.exit(0);
  }
}

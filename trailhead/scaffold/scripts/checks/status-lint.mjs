/**
 * Status vocabulary, and the claims it is allowed to make.
 *
 * The failure this exists for: a deliverable table where five rows read "implemented",
 * meaning built-and-unverified. Every one of those claims was accurate. The word was the
 * mechanism — it let eight deliverables of un-QA'd interface accumulate while no
 * individual report was ever wrong.
 *
 * Three words, with these meanings and no others:
 *
 *   built     the code exists and the deterministic suite passes
 *   verified  built, AND its QA specs have run against a real running instance, AND
 *             someone drove the interface rather than only asserting about it in tests
 *   accepted  verified, and every human gate has a recorded verdict
 *
 * This is an ALLOWLIST, not a banned-word list. An earlier version rejected five specific
 * words, so "shipped" sailed through a vocabulary advertised as having exactly three
 * members. Anything outside the three is a violation whether or not anyone thought of it.
 *
 * And a status word has to cost something:
 *   - `verified` and `accepted` must cite an evidence path, from the EVIDENCE cell, that
 *     exists. Reading any cell let a row's own prose supply the path.
 *   - `accepted` additionally requires every human gate in gate.config.json to hold a
 *     passing verdict — which is what the word is defined to mean. Leaving that
 *     uncorrelated made the definition prose, in a tool built because prose drifts.
 */

import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { readOr, result } from '../gate-lib.mjs';

const VOCABULARY = ['not started', 'built', 'verified', 'accepted'];
const NEEDS_EVIDENCE = new Set(['verified', 'accepted']);

function cells(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

/**
 * Words that turn a status claim into a hedge. A cell reading
 * `accepted (human review pending)` is not an accepted deliverable, and an earlier version
 * normalized it to `accepted` by stripping the parenthetical — so the hedge was the thing
 * that disappeared. Evidence parentheticals like `verified (evidence/d0/8226f77)` still
 * pass, because they carry a path rather than a qualifier.
 */
const HEDGES = /\b(pending|partial(ly)?|blocked|mostly|except|caveat|todo|tbd|almost|nearly|unverified|not yet)\b/i;

/** Strip emphasis and evidence parentheticals to get at the bare status word. */
function bareStatus(cell) {
  return cell
    .replace(/\*+/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[—:-].*$/, '')
    .trim()
    .toLowerCase();
}

/** Paths cited in a cell. Requires a real separator and a file-ish tail. */
function citedPaths(cell) {
  return (cell.match(/[\w.@-]+(?:\/[\w.@-]+)+/g) ?? [])
    .filter((p) => !p.startsWith('http'))
    .map((p) => p.replace(/[).,;]+$/, ''));
}

/**
 * Is this the deliverable table? It must have a Status column AND a deliverable-ish
 * identity column. Accepting any table with a status-shaped header was too loose — an
 * unrelated `| Env | State |` table elsewhere in the file got linted as deliverables and
 * failed the gate on a row that was never a status claim.
 */
function isDeliverableTable(headerCells) {
  const hasStatus = headerCells.some((c) => /^status$/i.test(c));
  const hasIdentity = headerCells.some((c) => /^(#|id|deliverable|phase|milestone|task)$/i.test(c));
  return hasStatus && hasIdentity;
}

export async function run({ root, config, humanStages = [], humanOutcome }) {
  const path = config.state_file ?? '.planning/STATE.md';
  const text = readOr(join(root, path), null);
  if (text === null) {
    return result('missing_input', `${path} does not exist but a status stage is configured`, { fail: 1 });
  }

  // Only the table whose header declares a Status column. Scanning every table in the
  // file meant an unrelated "| Deployment | complete |" row failed the gate.
  const lines = text.split('\n');
  let header = null;
  const rows = [];
  for (const line of lines) {
    if (!line.trim().startsWith('|')) {
      header = null;
      continue;
    }
    const c = cells(line);
    if (/^-+$/.test(c[0])) continue;
    if (header === null) {
      header = c;
      continue;
    }
    if (isDeliverableTable(header)) rows.push({ cells: c, header });
  }

  if (rows.length === 0) {
    return result('missing_input', `${path} has no deliverable table with a Status column`, { fail: 1, not_run: 1 });
  }

  const findings = [];
  let clean = 0;
  let acceptedRows = 0;

  for (const { cells: row, header: head } of rows) {
    const statusIndex = head.findIndex((c) => /^(status|state)$/i.test(c));
    const evidenceIndex = head.findIndex((c) => /^(evidence|proof)$/i.test(c));
    const statusCell = row[statusIndex] ?? row[row.length - 1] ?? '';
    const word = bareStatus(statusCell);
    const id = row[0] || '?';

    if (!VOCABULARY.includes(word)) {
      findings.push({
        severity: 'major',
        title: `row ${id} status "${statusCell.trim()}" is not in the vocabulary — use not started, built, verified, or accepted`,
        evidence: `${path} · row ${id}`,
      });
      continue;
    }

    if (HEDGES.test(statusCell)) {
      findings.push({
        severity: 'major',
        title: `row ${id} qualifies its status — "${statusCell.trim()}" is not a claim of "${word}". Downgrade the word or drop the hedge`,
        evidence: `${path} · row ${id}`,
      });
      continue;
    }

    if (NEEDS_EVIDENCE.has(word)) {
      // From the Evidence column specifically. Letting the definition-of-done column
      // supply a path meant any row mentioning a real file satisfied the requirement.
      const evidenceCell = evidenceIndex >= 0 ? row[evidenceIndex] ?? '' : '';
      const existing = citedPaths(evidenceCell).filter((p) => existsSync(join(root, p)));
      if (existing.length === 0) {
        findings.push({
          severity: 'major',
          title: `row ${id} claims "${word}" but its Evidence cell cites no path that exists`,
          evidence: `${path} · row ${id}`,
        });
        continue;
      }
    }

    if (word === 'accepted') acceptedRows += 1;
    clean += 1;
  }

  // `accepted` is defined as "verified, and every human gate has a recorded verdict".
  // Correlate against the gate's ACTUAL outcome for each human stage, not against the
  // existence of a verdict file — a file saying `verdict: fail`, or one gone stale, or one
  // citing the wrong artifact, is not a recorded verdict in any sense the word implies.
  if (acceptedRows > 0) {
    if (humanStages.length === 0) {
      findings.push({
        severity: 'major',
        title: `${acceptedRows} row(s) claim "accepted", but this project declares no human gates — the word means "verified, and every human gate has a recorded verdict", so it currently asserts nothing`,
        evidence: 'gate.config.json',
      });
    } else {
      const notPassing = humanStages
        .map((id) => ({ id, verdict: humanOutcome ? humanOutcome(id)?.verdict : 'unknown' }))
        .filter((h) => h.verdict !== 'pass');
      if (notPassing.length > 0) {
        findings.push({
          severity: 'major',
          title: `${acceptedRows} row(s) claim "accepted" but ${notPassing.length} human gate(s) are not passing — ${notPassing.map((h) => `${h.id} (${h.verdict})`).join(', ')}`,
          evidence: `${path} · .gates/verdicts/`,
        });
      }
    }
  }

  const summary = `${rows.length} deliverable rows, ${findings.length} violation(s)`;
  if (findings.length === 0) return result('pass', summary, { pass: clean });
  return result('fail', `${summary} — ${findings[0].title}`, { pass: clean, fail: findings.length }, findings);
}

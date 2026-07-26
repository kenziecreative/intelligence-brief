/**
 * Open decisions whose moment has arrived.
 *
 * The failure this exists for: an authentication architecture that was wrong from day
 * zero and surfaced at deliverable six, costing an amendment and a subsystem. Nobody
 * made a mistake — nobody was asked. No amount of up-front interviewing would have
 * produced the answer either, because on day one there wasn't one.
 *
 * So "not sure yet" is not deferral here, it is a scheduled interrupt. An undecided row
 * carries a trigger; when the trigger fires and the row is still unanswered, this fails.
 *
 * Row format in contracts/OPEN-DECISIONS.md:
 *
 *   | ID  | Decision                | Status    | Trigger                  | Answer |
 *   |-----|-------------------------|-----------|--------------------------|--------|
 *   | D-1 | What is stable identity | UNDECIDED | `src/**\/identity/**`     |        |
 *
 * Status is UNDECIDED, DECIDED, or DEFERRED. DEFERRED requires a dated reason in Answer —
 * an empty deferral is just an undecided row wearing a different label, and is treated
 * as one. A row with no trigger is a config error, not a free pass: it can never come
 * due, which makes it invisible rather than resolved.
 */

import { join } from 'node:path';
import { filesMatching, readOr, result } from '../gate-lib.mjs';

const OPEN = new Set(['UNDECIDED', 'OPEN', 'TBD']);
const KNOWN = new Set([...OPEN, 'DECIDED', 'DEFERRED']);

function cells(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

/**
 * Split a trigger list on commas that are NOT inside brace alternation. Splitting on
 * every comma turned `src/**\/*.{ts,tsx}` into two invalid patterns that matched nothing,
 * so the decision silently never came due.
 */
function splitTriggers(text) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of text) {
    if (char === '{') depth += 1;
    else if (char === '}') depth = Math.max(0, depth - 1);
    if (char === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  parts.push(current);
  return parts.map((p) => p.trim().replace(/^`|`$/g, '')).filter(Boolean);
}

/** Has deliverable `id` actually started, per the running-state table? */
function deliverableStarted(stateText, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const row = stateText.split('\n').find((line) => new RegExp(`^\\|\\s*\\**${escaped}\\**\\s*\\|`).test(line.trim()));
  if (!row) return false;
  // Row existence is not a start. An untouched roadmap lists every future deliverable,
  // and treating those as started fired decisions years early.
  return !/not started/i.test(row);
}

export async function run({ root, config }) {
  const path = config.decisions_file ?? 'contracts/OPEN-DECISIONS.md';
  const text = readOr(join(root, path), null);
  if (text === null) {
    return result('missing_input', `${path} does not exist but a decisions stage is configured`, { fail: 1 });
  }

  const rows = text
    .split('\n')
    .filter((line) => line.trim().startsWith('|'))
    .map(cells)
    .filter((row) => row.length >= 4)
    .filter((row) => !/^-+$/.test(row[0]) && row[0].toUpperCase() !== 'ID' && /^[A-Za-z]-?\d+$/.test(row[0].replace(/\s/g, '')));

  if (rows.length === 0) {
    return result('missing_input', `${path} declares no decision rows`, { fail: 1, not_run: 1 });
  }

  const stateText = readOr(join(root, config.state_file ?? '.planning/STATE.md'), '');
  const findings = [];
  const due = [];
  let open = 0;

  for (const row of rows) {
    const [id, decision, statusRaw, trigger, answer = ''] = row;
    const status = statusRaw.toUpperCase();

    if (!KNOWN.has(status)) {
      findings.push({
        severity: 'major',
        title: `${id} has status "${statusRaw}" — expected UNDECIDED, DECIDED, or DEFERRED`,
        evidence: `${path} · row ${id}`,
      });
      continue;
    }
    // A deferral needs a DATED reason, which is what the row contract asks for. Any
    // non-empty answer used to satisfy it, so "later" bought a permanent deferral — the
    // date is the whole mechanism by which a deferral comes back.
    const dated = /\d{4}-\d{2}-\d{2}/.test(answer);
    if (status === 'DEFERRED' && answer.trim().length > 0 && !dated) {
      findings.push({
        severity: 'major',
        title: `${id} is DEFERRED with no date — a deferral without one never comes back. Write when it was deferred and when it will be revisited`,
        evidence: `${path} · row ${id}`,
      });
      continue;
    }
    const effectivelyOpen = OPEN.has(status) || (status === 'DEFERRED' && answer.trim().length === 0);
    if (!effectivelyOpen) continue;
    open += 1;

    const patterns = splitTriggers(trigger);
    if (patterns.length === 0) {
      findings.push({
        severity: 'major',
        title: `${id} is open with no trigger — it can never come due, which hides it rather than resolving it`,
        evidence: `${path} · row ${id}`,
      });
      continue;
    }

    for (const pattern of patterns) {
      if (pattern.toLowerCase() === 'always') {
        due.push({ id, decision, trigger: pattern, matched: 'always' });
        break;
      }
      if (pattern.startsWith('deliverable:')) {
        const target = pattern.slice('deliverable:'.length).trim();
        // A deliverable trigger with no state file to resolve against can never fire, so
        // it would sit silently un-due forever. Say so rather than reading as satisfied.
        if (!stateText) {
          findings.push({
            severity: 'major',
            title: `${id} triggers on ${pattern} but ${config.state_file ?? '.planning/STATE.md'} does not exist — this trigger can never fire`,
            evidence: `${path} · row ${id}`,
          });
          break;
        }
        if (deliverableStarted(stateText, target)) {
          due.push({ id, decision, trigger: pattern, matched: `deliverable ${target} has started` });
          break;
        }
        continue;
      }
      const hits = filesMatching(root, [pattern]);
      if (hits.length > 0) {
        due.push({ id, decision, trigger: pattern, matched: hits[0] });
        break;
      }
    }
  }

  for (const d of due) {
    findings.push({
      severity: 'critical',
      title: `${d.id} is due — ${d.decision}`,
      evidence: `${path} · trigger \`${d.trigger}\` matched ${d.matched}`,
    });
  }

  // The identity set is every declared decision ID. The runner ratchets it, so deleting an
  // overdue row is caught — otherwise the ledger is merely shorter and nothing is due.
  const identities = rows.map((row) => row[0]);

  const summary = `${open} open, ${due.length} due`;
  if (findings.length === 0) {
    return result('pass', `${summary} — no trigger has fired`, { pass: rows.length, not_run: open }, [], identities);
  }
  return result(
    'fail',
    due.length > 0
      ? `${summary} — ${due.map((d) => `${d.id} (triggered by ${d.matched})`).join('; ')}`
      : `${summary} — ${findings[0].title}`,
    { pass: rows.length - findings.length, fail: findings.length, not_run: Math.max(0, open - due.length) },
    findings,
    identities,
  );
}

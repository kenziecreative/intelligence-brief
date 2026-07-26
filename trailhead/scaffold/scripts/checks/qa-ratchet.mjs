/**
 * QA coverage ratchet.
 *
 * The failure this exists for: a project accumulated eighteen QA specs and ran one of
 * them across fourteen deliverables. Every individual deferral was defensible — "built,
 * QA pending" was true each time — and the aggregate was eight deliverables of
 * unverified interface arriving at once, at the point where fixing it is most expensive.
 *
 * So this does not ask "did the QA that ran, pass?" It asks "how much has never run?"
 * and the runner's ratchet refuses to let that number grow. The count prints on every
 * gate run, which is the property that makes the debt un-forgettable.
 *
 * A run credit must be BOUND, not merely associated. An earlier version credited a spec
 * whenever its name appeared anywhere in the history file, so the sentence "No
 * authentication scenarios have run yet" credited `.qa/auth.md` as having run. Credit now
 * requires the name as a delimited token inside a history TABLE ROW, or as a delimited
 * segment of a report filename — both written by the QA engine, not by prose.
 */

import { join } from 'node:path';
import { existsSync, readdirSync } from 'node:fs';
import { readOr, result } from '../gate-lib.mjs';

/** Files in `.qa/` that are registries or docs, not specs. */
const NOT_SPECS = new Set(['README', 'FINDINGS', 'HISTORY']);

/** `name` as a whole token, not a prefix of a longer word. */
function tokenRe(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^A-Za-z0-9])${escaped}([^A-Za-z0-9]|$)`);
}

export async function run({ root, config }) {
  const qaRel = config.qa_dir ?? '.qa';
  const qaDir = join(root, qaRel);
  if (!existsSync(qaDir)) {
    // Reached only when the stage does not declare optional_if_absent. A configured QA
    // stage pointing at a directory that is not there is a missing input, not a pass.
    return result('missing_input', `${qaRel}/ does not exist but a QA stage is configured`, { fail: 1 });
  }

  const specs = readdirSync(qaDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .filter((name) => !NOT_SPECS.has(name))
    .sort();

  if (specs.length === 0) {
    // An empty .qa/ is not "not applicable" — the project declared a QA stage and has
    // written no specs. Reporting this as n/a is what let a fresh install come up green.
    //
    // But it is not `missing_input` either, and calling it that made every fresh install
    // exit 1. `missing_input` is STRUCTURAL: it means a configured input went away, so it
    // blocks at every stage level and `.gates/pause` does not cover it. Nothing has gone
    // away here — `.qa/` is present and empty because the project is new. That is a
    // coverage signal, which is what this check measures and what `costly` already prices
    // correctly: red and reporting at prototype, blocking from pilot on.
    //
    // The identity set is empty rather than absent, and that is load-bearing. The runner
    // only compares identities when BOTH sides are arrays, so returning none would let
    // "delete every spec in .qa/" land here and evade the ratchet — the exact laundering
    // the structural verdict was doing second duty to prevent. With `[]`, three remembered
    // specs against zero present is three vanished identities, which blocks unconditionally.
    return result(
      'fail',
      `${qaRel}/ declares no specs — QA has not been set up`,
      { fail: 1 },
      [{ severity: 'major', title: 'no QA specs exist yet', evidence: `${qaRel}/` }],
      [],
    );
  }

  // Credit comes from the QA engine's own artifacts: rows in the history ledger and
  // report filenames. Prose in the same file does not count, and neither does a row that
  // records a non-run — `| auth | not run |` is the cheapest hand-edit there is, so a row
  // must carry an actual outcome word to credit anything.
  //
  // This is a floor, not authentication. A determined hand-edit can still write
  // `| auth | passed |`. Binding credit to an engine-signed run record is the real fix and
  // needs the QA engine to emit one.
  const OUTCOME = /\b(pass(ed)?|fail(ed)?|green|red|complete[d]?)\b/i;
  const NON_RUN = /\b(not run|never run|skipped|pending|n\/a)\b/i;
  const historyRows = readOr(join(qaDir, 'HISTORY.md'), '')
    .split('\n')
    .filter((line) => line.trim().startsWith('|'))
    .filter((line) => OUTCOME.test(line) && !NON_RUN.test(line));
  const reportsDir = join(qaDir, 'reports');
  const reportStems = (existsSync(reportsDir) ? readdirSync(reportsDir) : []).map((f) => f.replace(/\.[^.]+$/, ''));

  const executed = specs.filter((name) => {
    const re = tokenRe(name);
    return historyRows.some((row) => re.test(row)) || reportStems.some((stem) => re.test(stem));
  });
  const unrun = specs.filter((name) => !executed.includes(name));

  const summary = `${executed.length}/${specs.length} specs have ever run`;
  if (unrun.length === 0) {
    return result('pass', summary, { pass: specs.length }, [], specs);
  }

  // `specs` is the identity set. The runner ratchets it, so deleting the one unrun spec
  // is caught — otherwise the count falls and deletion reads as progress.
  return result(
    'fail',
    `${summary} — never run: ${unrun.join(', ')}`,
    { pass: executed.length, fail: 0, not_run: unrun.length },
    unrun.map((name) => ({
      severity: 'major',
      title: `QA spec "${name}" has never run`,
      evidence: `${qaRel}/${name}.md`,
    })),
    specs,
  );
}

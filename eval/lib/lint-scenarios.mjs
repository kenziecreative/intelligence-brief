#!/usr/bin/env node
// lint-scenarios.mjs — ADVISORY authoring lint for a target pack's scenarios.jsonl.
//
// One question: does this scenario seed what its siblings seed?
//
// A scenario is a fixture, and the commonest fixture defect by a wide margin is a setup that
// cannot reach the behaviour the scenario exists to test. Five instances in one session, the
// last of which was a `synthesize` scenario missing `gaps` and `cross_reference` — so the run
// stopped at a mandatory pre-check and the gate under test was never reached. Two full runs
// plus two judges to discover something readable straight off the fixture.
//
// This compares each scenario's `setup` keys against the keys its **same-entry siblings** use.
// That invariant comes from the pack itself, not from the target's skills, so it cannot drift
// out of sync with the plugin the way a rules-encoding check would (see target-pack-spec.md,
// "A deterministic check may assert only what the target's spec guarantees").
//
// ADVISORY BY DESIGN — always exits 0. A deliberate omission is a legitimate scenario: testing
// the absent case is exactly what several goldens do. The lint cannot tell a deliberate
// omission from a forgotten one, so it points and lets the author decide. If the omission is
// deliberate, say so in `tone_notes` — that is what the next reader will look for.
//
// Usage: node eval/lib/lint-scenarios.mjs <path/to/scenarios.jsonl>

import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: node lint-scenarios.mjs <scenarios.jsonl>");
  process.exit(2);
}

const rows = readFileSync(file, "utf8")
  .split("\n").filter((l) => l.trim())
  .map((l, i) => { try { return JSON.parse(l); } catch { console.error(`line ${i + 1}: not JSON`); return null; } })
  .filter(Boolean);

const byEntry = new Map();
for (const r of rows) {
  if (!r.entry || !r.setup) continue;
  if (!byEntry.has(r.entry)) byEntry.set(r.entry, []);
  byEntry.get(r.entry).push(r);
}

let notes = 0;
for (const [entry, group] of [...byEntry].sort()) {
  if (group.length < 2) continue;
  // A key is "expected" for an entry when most siblings carry it. Majority, not union:
  // one outlier seeding an unusual key should not make everyone else look deficient.
  const counts = new Map();
  for (const r of group) for (const k of Object.keys(r.setup)) counts.set(k, (counts.get(k) ?? 0) + 1);
  const expected = [...counts].filter(([, n]) => n > group.length / 2).map(([k]) => k).sort();

  for (const r of group) {
    const missing = expected.filter((k) => !(k in r.setup));
    if (!missing.length) continue;
    notes++;
    const deliberate = /\b(absent|missing|no |without|never (?:run|written))\b/i.test(r.tone_notes ?? "");
    console.log(`\n  ${r.id}  (entry: ${entry})`);
    console.log(`    missing: ${missing.join(", ")}`);
    console.log(`    ${group.length - 1} sibling(s) with this entry seed ${expected.join(", ")}`);
    console.log(deliberate
      ? `    tone_notes mentions an absence — probably deliberate, confirm it is THIS one`
      : `    tone_notes says nothing about an absence — check the run can still reach what this tests`);
  }
}

console.log(notes
  ? `\n${notes} scenario(s) to look at. Advisory only — a deliberate omission is fine; record it in tone_notes.`
  : "every scenario seeds what its same-entry siblings seed");
process.exit(0);

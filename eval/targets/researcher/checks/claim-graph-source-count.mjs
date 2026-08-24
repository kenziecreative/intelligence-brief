#!/usr/bin/env node
// RETIRED 2026-08-24 — DO NOT RE-ENABLE WITHOUT READING THIS.
//
// This check compared a claim node's `source_count` against its `source_files` length.
// Both the original equality form and the corrected inflation-only form are WRONG,
// because the two fields are not the same granularity:
//
//   source_files  — "note filenames traced in step 5"        → per CLAIM
//   source_count  — "independent sources from step 8a"       → per SECTION
//
// Step 8a computes a per-SECTION confidence tier, and its first input is "How many
// independent sources back this SECTION's claims?" So `source_count` is section-scoped,
// exactly like the `confidence_tier` stored beside it. A single-source claim sitting in
// a two-source section correctly records source_count 2 with one source_file. No
// inequality between the two fields holds in either direction.
//
// The iteration-45 case this was built from was a real defect, but in the M&L PROSE
// ("both findings rest on two independent sources" over two one-source findings). The
// graph's source_count 2 was CORRECT at section scope. This check caught a shadow of the
// defect and the apparent true positive was a granularity coincidence — which is why a
// 100-graph backtest passed and two live runs then fired on correct records.
//
// The lesson worth keeping: a deterministic gate may assert ONLY what the target's spec
// guarantees. Both times I re-derived the invariant from sample data instead of the spec,
// and sample data agreed right up until a case where the two scopes actually differed.
//
// The real gap it was groping at is a DESIGN question, not a script one: a claim node
// carries its section's source count, so per-claim support is not recoverable from the
// graph at all. Deciding whether claim nodes should carry a per-claim count belongs in
// workstream design, not in a gate. Recorded in the iteration-57/58 findings.
// claim-graph-source-count.mjs — researcher pack check
//
// Does every claim node's `source_count` agree with the sources it actually lists?
//
// The audit writes `claim-graph.json` and, on the same pass, writes the draft's
// Methodology & Limitations. Iteration 45 produced a draft whose M&L said "both
// findings rest on two independent sources" over two findings with one source each,
// and B11 certified it clean — and the same fiction landed in the graph as
// `source_count: 2` beside a one-entry `source_files`.
//
// That is the useful part: the prose claim needs a reader, but the graph carries the
// same claim as two fields a script can compare. `source_files` is a list of filenames
// the pass had to have in hand; the count is a number it asserted.
//
// The comparison is `source_count <= source_files.length`, NOT equality. The skill
// defines the two fields over different populations — `source_files` is "note filenames
// traced in step 5", `source_count` is "independent sources from step 8a" — so a claim
// traced to two vendor notes that cite one original legitimately records 2 files and 1
// independent source. Equality flagged that as a defect; it is the correct record.
//
// Inflation is the failure mode and it is one-directional: the count may be lower than
// the files (sources collapsed on inspection) but never higher, because a source that
// was never traced cannot have been found independent. Iteration 45's real defect was
// `source_count: 2` beside a ONE-entry source_files — caught here, and caught by the
// weaker invariant just as surely.
//
// Corrected 2026-08-24 after the first live false positive: iteration 57's override
// scenario traced a vendor note and the analyst note it was overridden against, counted
// the supporting source alone, and was flagged by an invariant the plugin never promised.
// A gate asserting more than its spec guarantees produces false reds forever.
//
// This does not check whether the sources really are independent, or whether the count
// is the *right* count. It checks the record cannot claim more support than it traced.
//
// Usage: node claim-graph-source-count.mjs [--file research/reference/claim-graph.json]
// Exit 0 = no inflation, or nothing to check. Exit 1 = a count exceeds its files (prints each).
// Exit 2 = usage/parse error.

import { readFileSync, existsSync } from "node:fs";

const i = process.argv.indexOf("--file");
const file = i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : "research/reference/claim-graph.json";

if (!existsSync(file)) {
  console.log(`n/a — ${file} not present`);
  process.exit(0);
}

let graph;
try {
  graph = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error(`claim-graph-source-count: ${file} is not valid JSON — ${e.message}`);
  process.exit(2);
}

const claims = Array.isArray(graph.claims) ? graph.claims : [];
// The graph is scaffolded empty at init and populated by the first audit. An empty
// graph is the ordinary state for most runs and is not a finding.
if (claims.length === 0) {
  console.log("n/a — claim graph is empty (scaffolded, not yet populated by an audit)");
  process.exit(0);
}

const problems = [];
for (const c of claims) {
  const id = c.id ?? "(no id)";
  // Only claims carrying both fields can disagree. A node with neither is a shape
  // question for a different check; flagging it here would be scope creep into
  // schema validation.
  if (!Array.isArray(c.source_files) || typeof c.source_count !== "number") continue;
  const listed = c.source_files.length;
  // Inflation only: a count above the traced files asserts support that was never
  // traced. A count below is legitimate de-duplication, not a defect.
  if (c.source_count > listed) {
    problems.push(
      `${id}: source_count ${c.source_count} exceeds the ${listed} source_files traced` +
      (listed ? ` (${c.source_files.join(", ")})` : " (empty)")
    );
  }
}

if (problems.length) {
  console.error(`claim-graph source-count disagreement in ${file}:`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error(`  The count is the invented half: a source not traced cannot have been found independent.`);
  process.exit(1);
}

console.log(`agrees — ${claims.length} claim node(s), no source_count exceeds its traced source_files`);
process.exit(0);

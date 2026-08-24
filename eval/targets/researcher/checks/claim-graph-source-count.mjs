#!/usr/bin/env node
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
// same claim as two fields that must agree, so a script settles it. When they
// disagree, the count is the invented half — `source_files` is a list of filenames
// the pass had to have in hand, while the count is a number it asserted.
//
// This does not check whether the sources are independent, or whether the count is
// the *right* count for the claim. It checks that the record agrees with itself,
// which is the only thing available without judgment.
//
// Usage: node claim-graph-source-count.mjs [--file research/reference/claim-graph.json]
// Exit 0 = agrees, or nothing to check. Exit 1 = disagreement (prints each).
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
  if (c.source_count !== listed) {
    problems.push(
      `${id}: source_count ${c.source_count} but source_files lists ${listed}` +
      (listed ? ` (${c.source_files.join(", ")})` : " (empty)")
    );
  }
}

if (problems.length) {
  console.error(`claim-graph source-count disagreement in ${file}:`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error(`  The count is the invented half: source_files is a list the pass had in hand.`);
  process.exit(1);
}

console.log(`agrees — ${claims.length} claim node(s), every source_count matches its source_files`);
process.exit(0);

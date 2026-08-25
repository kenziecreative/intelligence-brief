#!/usr/bin/env node
// A draft that stamps a documented adverse search must be accompanied by the durable
// record that stamp refers to. research-summarize-section/SKILL.md:127 requires the
// write; audit-claims step 5b fails the omission high-severity one step later.
//
// Found in iteration-89: a draft's Methodology & Limitations claimed a documented
// adverse search while research/discovery/negative-searches.md was never created —
// an assertion about a record that does not exist. Intermittent (1 of 9 runs), which
// is exactly why it belongs in a gate rather than a rule.
import { readFileSync, existsSync, statSync } from 'node:fs';

const args = process.argv.slice(2);
const get = (f) => { const i = args.indexOf(f); return i === -1 ? null : args[i + 1]; };
const draft  = get('--draft')  || 'research/drafts/04-test-section.md';
const record = get('--record') || 'research/discovery/negative-searches.md';

if (!existsSync(draft)) { console.log(`n/a — no draft at ${draft}`); process.exit(0); }

const text = readFileSync(draft, 'utf8');
// The stamp this gate keys on: the draft asserting a *documented search* was run.
const STAMP = /no credible counter-evidence found after documented search|documented adverse search|adverse search(?:es)? (?:on record|logged|documented)/i;

if (!STAMP.test(text)) { console.log('n/a — draft makes no documented-search claim'); process.exit(0); }

if (!existsSync(record)) {
  console.error(`FAIL — draft stamps a documented adverse search but ${record} does not exist. The stamp and the record are two halves of one obligation.`);
  process.exit(1);
}
if (statSync(record).size === 0) {
  console.error(`FAIL — draft stamps a documented adverse search but ${record} is empty.`);
  process.exit(1);
}
console.log(`pass — documented-search stamp backed by ${record}`);

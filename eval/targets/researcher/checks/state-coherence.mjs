#!/usr/bin/env node
// state-coherence.mjs — researcher pack check
//
// Does `research/STATE.md` describe ONE position, or two that disagree?
//
// STATE.md records the phase cycle twice: as a `Cycle step: <Name> (n of 5)`
// field and as a five-box checklist. The skills write both, in different places,
// on different branches — so they can drift, and when they drift the next session
// reads a project that is simultaneously at Collect and past Connect. The plugin's
// own instruction says so plainly: "the box, the `Cycle step`, and `Next Action`
// must all agree" (research-check-gaps step 5b).
//
// Nothing checked that. Researcher iterations 21–22 shipped three drifted STATE
// files through a 16/16-green gate set, because every gate asked whether STATE.md
// was well-formed and none asked whether it was consistent with itself.
//
// The invariant, from the init template's "complete all five steps in order":
//   1. the step named in `Cycle step` matches its ordinal — `Connect (2 of 5)`
//   2. every step BEFORE the active step is checked
//   3. the active step and every step after it are unchecked
//
// (3) is the one that catches the "finished my own step but didn't advance the
// pointer" drift; (2) catches the rollback that unchecks the step it returns to
// and leaves a later box ticked.
//
// Usage: node state-coherence.mjs [--file research/STATE.md]   (cwd = working dir)
// Exit 0 = coherent or not applicable. Exit 1 = incoherent (prints why).
// Exit 2 = usage/read error.

import { readFileSync, existsSync } from "node:fs";

const STEPS = ["Collect", "Connect", "Assess", "Synthesize", "Verify"];

const argIdx = process.argv.indexOf("--file");
const file = argIdx !== -1 && process.argv[argIdx + 1] ? process.argv[argIdx + 1] : "research/STATE.md";

if (!existsSync(file)) {
  console.error(`state-coherence: ${file} not found`);
  process.exit(2);
}
const text = readFileSync(file, "utf8");

// --- the active step -------------------------------------------------------

const cycleLine = text.match(/^\s*[-*]?\s*Cycle step:\s*(.+)$/m);
if (!cycleLine) {
  console.error(`state-coherence: no 'Cycle step:' line in ${file}`);
  process.exit(1);
}
const cycleValue = cycleLine[1].trim();

// A closed project writes the sentinel forms ("— all cycles complete") and drops
// the checklist. There is no active cycle to be coherent about, so this check has
// nothing to say — it must not become a backdoor "did the project close" gate.
// Whether closing was legitimate is Completion Integrity's question, and it is
// judged from the corpus, not from a checkbox.
const named = cycleValue.match(/\b(Collect|Connect|Assess|Synthesize|Verify)\b/);
if (!named) {
  console.log(`n/a — no active cycle step (Cycle step: "${cycleValue}")`);
  process.exit(0);
}
const active = named[1];
const activeIdx = STEPS.indexOf(active);

// --- the checkboxes --------------------------------------------------------

const boxes = new Map();
for (const m of text.matchAll(/^\s*[-*]\s*\[([ xX])\]\s*\*\*(Collect|Connect|Assess|Synthesize|Verify)\*\*/gm)) {
  boxes.set(m[2], m[1].toLowerCase() === "x");
}

const problems = [];

// 1. the ordinal must match the step's position
const ordinal = cycleValue.match(/\((\d+)\s+of\s+5\)/);
if (ordinal && Number(ordinal[1]) !== activeIdx + 1) {
  problems.push(`'Cycle step: ${cycleValue}' — ${active} is step ${activeIdx + 1} of 5, not ${ordinal[1]}`);
}

if (boxes.size === 0) {
  problems.push(`'Cycle step: ${cycleValue}' names an active step but there is no five-box '## Current Phase Cycle' checklist to agree with it`);
} else {
  const missing = STEPS.filter((s) => !boxes.has(s));
  if (missing.length) problems.push(`checklist is missing box(es): ${missing.join(", ")}`);

  // 2 + 3. the boxes must be a clean prefix ending just before the active step.
  for (const [i, step] of STEPS.entries()) {
    if (!boxes.has(step)) continue;
    const checked = boxes.get(step);
    if (i < activeIdx && !checked) {
      problems.push(`${step} (step ${i + 1}) is unchecked, but the cycle has advanced past it to ${active} (step ${activeIdx + 1})`);
    }
    if (i === activeIdx && checked) {
      problems.push(`${active} is checked but 'Cycle step' still points at it — either the box or the pointer is wrong`);
    }
    if (i > activeIdx && checked) {
      problems.push(`${step} (step ${i + 1}) is checked, but the cycle is only at ${active} (step ${activeIdx + 1}) — a later step cannot be done before an earlier one`);
    }
  }
}

if (problems.length) {
  console.error(`STATE.md cycle incoherence in ${file}:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

const done = STEPS.slice(0, activeIdx);
console.log(`coherent — active ${active} (${activeIdx + 1} of 5); checked: ${done.length ? done.join(", ") : "none"}`);
process.exit(0);

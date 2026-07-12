#!/usr/bin/env node
// run-gates.mjs
//
// Deterministic gate + content-lint runner for an eval capture. This is the
// mechanical first stage of grading: it computes the checkable invariants a
// target pack declares, so gate verdicts come from a script, not from the
// (fallible) eval-runner's reading of its own run. The eval-judge then INHERITS
// these verdicts and only judges the quality dimensions.
//
// Inputs:
//   --working-dir <dir>   the scenario's capture dir (artifacts live here)
//   --gates <gates.json>  the target pack's machine-readable gate spec
//   --plugin-root <dir>   the target plugin's root (for library checks)
//
// Two input files, written by two different parties, and the split is the point:
//
//   <working-dir>/gate-inputs.json   — RUNNER-observed facts about the run it just
//     performed (things only it can see): { "entry": "define",
//     "baseline_completed_stages": 2, "claimed_frameworks": ["SCQ"] }
//
//   <working-dir>/gate-context.json  — ORCHESTRATOR-written facts declared by the
//     scenario (the runner never sees these — it is blind): the scenario's
//     `expected_no_advance` and its `gate_context` block, e.g.
//     { "expected_no_advance": true, "revision_expected": true }
//
// gate-context overlays gate-inputs. A scenario-declared fact must not depend on a
// blind runner remembering to copy it: goal-setting iteration-1 false-failed six runs
// because `expected_no_advance` lived in the runner's hands and defaulted to false.
// (gate-inputs may still carry `expected_no_advance` — older packs do; the overlay
// wins. Nothing breaks if gate-context.json is absent.)
//
// Output: a JSON array of { gate, type, feeds, status, evidence } to stdout
// (status ∈ pass | fail | n/a), plus a human table on stderr. Exit 0 always —
// this reports; it does not decide the build. No dependencies (Node 18+).

import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const workingDir = arg("working-dir");
const gatesPath = arg("gates");
const pluginRoot = arg("plugin-root");
if (!workingDir || !gatesPath) {
  console.error("usage: run-gates.mjs --working-dir <dir> --gates <gates.json> [--plugin-root <dir>]");
  process.exit(2);
}

const read = (p) => readFileSync(p, "utf8");
const readIf = (p) => (existsSync(p) ? read(p) : null);

const spec = JSON.parse(read(gatesPath));
const runnerInputs = JSON.parse(readIf(join(workingDir, "gate-inputs.json")) ?? "{}");
const scenarioContext = JSON.parse(readIf(join(workingDir, "gate-context.json")) ?? "{}");
const inputs = { ...runnerInputs, ...scenarioContext };
const entry = inputs.entry ?? null;
const expectedNoAdvance = inputs.expected_no_advance === true;

// --- helpers ---------------------------------------------------------------

// Pull the YAML-ish frontmatter block (between the first pair of --- lines).
function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : null;
}

// Tolerant read of a frontmatter list value — handles both inline `[a, b]` and
// block `- a\n- b` forms. Returns an array of trimmed strings (or null).
function fmList(fm, key) {
  const inline = fm.match(new RegExp(`^${key}:\\s*\\[(.*?)\\]`, "m"));
  if (inline) {
    return inline[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
  }
  const block = fm.match(new RegExp(`^${key}:\\s*\\n((?:\\s*-\\s*.+\\n?)+)`, "m"));
  if (block) {
    return block[1].split("\n").map((l) => l.replace(/^\s*-\s*/, "").trim()).filter(Boolean);
  }
  // key present with a scalar (count it as a single value), else null
  const scalar = fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return scalar ? [scalar[1].trim()].filter(Boolean) : null;
}

// The markdown body section whose `## ` heading contains <title> as a word, up
// to the next `## ` heading or end of file. Tolerates a numbered/decorated
// heading (e.g. `## 1. Define`, `## 6. Decide — commit`). Index-slice rather
// than a lookahead — JS regex has no \Z, so a trailing-most section would
// otherwise fail to match.
function section(text, title) {
  const esc = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = new RegExp(`^##\\s+.*\\b${esc}\\b.*$`, "m").exec(text);
  if (!m) return null;
  const rest = text.slice(m.index + m[0].length);
  const next = rest.search(/^##\s/m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

// strategist brief sections are the capitalized stage name (define → Define).
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function naForEntry(gate) {
  return Array.isArray(gate.na_for_entries) && entry && gate.na_for_entries.includes(entry);
}

// A gate whose invariant only exists when the scenario sets up the situation that
// produces it. `revision_preserves_original` asks "when a KR was revised, was the
// original kept?" — on a monthly where nothing was revised there is no original to
// keep, and firing the gate anyway reads a correct run as a failure (iteration-1:
// three false FAILs on adv-goal-vs-system). The trigger is scenario-declared, not
// run-observed, so a plugin cannot dodge the gate by simply not doing the thing.
function naForContext(gate) {
  if (!gate.applies_when) return false;
  return inputs[gate.applies_when] !== true;
}

// --- gate evaluators -------------------------------------------------------

function evalGate(gate) {
  if (naForEntry(gate)) return { status: "n/a", evidence: `n/a for entry '${entry}'` };
  if (naForContext(gate)) {
    return { status: "n/a", evidence: `n/a — scenario did not declare '${gate.applies_when}'` };
  }
  // Write-shaped gates on a run that is SUPPOSED to end without a capture. A skill
  // correctly holding its confirm-before-capture gate writes nothing, and "nothing
  // written" is the pass — reading it as a missing artifact false-fails the exact
  // discipline the gate is there to protect.
  if (gate.na_on_no_advance && expectedNoAdvance) {
    return { status: "n/a", evidence: "expected_no_advance — no capture expected, so no write to check" };
  }
  const filePath = gate.file ? join(workingDir, gate.file) : null;
  const text = filePath ? readIf(filePath) : null;

  switch (gate.type) {
    case "frontmatter_keys": {
      if (text == null) return fail(`missing file ${gate.file}`);
      const fm = frontmatter(text);
      if (!fm) return fail(`${gate.file} has no frontmatter`);
      const missing = gate.keys.filter((k) => !new RegExp(`^${k}:`, "m").test(fm));
      return missing.length ? fail(`missing keys: ${missing.join(", ")}`) : pass(`keys present: ${gate.keys.join(", ")}`);
    }
    case "file_contains": {
      if (text == null) return fail(`missing file ${gate.file}`);
      return new RegExp(gate.pattern, "m").test(text) ? pass(`found /${gate.pattern}/`) : fail(`/${gate.pattern}/ not found`);
    }
    case "section_filled": {
      // On expected_no_advance runs this gate is n/a, not inverted: mid-stage
      // writes into the section (a plan ledger, a recorded decline) are
      // legitimate work product, and reading "section not empty" as "stage
      // advanced" false-fails exactly the correct refusals the inversion exists
      // to protect. The advance signal on these runs is completed_stages_delta
      // alone. (Proof case: strategist adv-fabricate-data at v0.4.0 — Analyse
      // ledger written, no figures invented, stage correctly held.)
      if (expectedNoAdvance) {
        return { status: "n/a", evidence: "expected_no_advance — mid-stage section writes are legitimate; advance is judged by completed_stages_delta" };
      }
      if (text == null) return fail(`missing file ${gate.file}`);
      const title = gate.section_from === "entry" ? cap(entry) : gate.section;
      const body = section(text, title);
      if (body == null) return fail(`no '## ${title}' section (not filled)`);
      const filled = body.length > 0 && body !== gate.placeholder;
      return filled ? pass(`'## ${title}' filled`) : fail(`'## ${title}' still placeholder`);
    }
    case "completed_stages_delta": {
      if (text == null) return fail(`missing file ${gate.file}`);
      const fm = frontmatter(text);
      const finalList = fm ? fmList(fm, "completed_stages") : null;
      const finalCount = finalList ? finalList.length : 0;
      const baseline = Number(inputs.baseline_completed_stages ?? 0);
      const delta = finalCount - baseline;
      const ok = delta === (gate.delta ?? 1);
      return invertIfNoAdvance(ok, `completed_stages ${baseline}→${finalCount} (Δ${delta})`);
    }
    case "framework_in_library": {
      const claimed = Array.isArray(inputs.claimed_frameworks) ? inputs.claimed_frameworks : [];
      if (!claimed.length) return pass("no framework claimed in this run");
      if (!pluginRoot) return fail("no --plugin-root given for library check");
      const index = readIf(join(pluginRoot, gate.index));
      if (index == null) return fail(`missing library index ${gate.index}`);
      const haystack = index.toLowerCase();
      const missing = claimed.filter((f) => !haystack.includes(slug(f)) && !haystack.includes(f.toLowerCase()));
      return missing.length ? fail(`not in library: ${missing.join(", ")}`) : pass(`all in library: ${claimed.join(", ")}`);
    }
    default:
      return fail(`unknown gate type '${gate.type}'`);
  }
}

// content-lint: a forbidden pattern must NOT appear in the file (skip if the
// file is absent and the rule is optional — e.g. the reader brief before Story).
function evalLint(rule) {
  const filePath = join(workingDir, rule.file);
  const text = readIf(filePath);
  if (text == null) {
    return rule.optional_file ? { status: "n/a", evidence: `${rule.file} absent (optional)` } : fail(`missing file ${rule.file}`);
  }
  const m = text.match(new RegExp(rule.forbid, "m"));
  return m ? fail(`forbidden /${rule.forbid}/ found: "${m[0].slice(0, 40)}"`) : pass(`clean of /${rule.forbid}/`);
}

function pass(evidence) { return { status: "pass", evidence }; }
function fail(evidence) { return { status: "fail", evidence }; }

// When a scenario is supposed to end WITHOUT advancing (a stonewalling user the
// plugin must keep pushing rather than capture), the advance/fill gates invert:
// not advancing is the pass.
function invertIfNoAdvance(ok, evidence) {
  if (!expectedNoAdvance) return ok ? pass(evidence) : fail(evidence);
  return ok ? fail(`${evidence} — but expected_no_advance`) : pass(`${evidence} — correctly did not advance`);
}

// --- run -------------------------------------------------------------------

const results = [];
for (const gate of spec.gates ?? []) {
  const r = evalGate(gate);
  results.push({ gate: gate.name, type: gate.type, feeds: gate.feeds ?? null, kind: "gate", ...r });
}
for (const rule of spec.content_lint ?? []) {
  const r = evalLint(rule);
  results.push({ gate: rule.name, type: "content_lint", feeds: rule.feeds ?? null, kind: "lint", ...r });
}

// Human table on stderr; machine JSON on stdout.
const pad = (s, n) => String(s).padEnd(n);
console.error(`\nGATES — ${spec.target ?? "?"}  (entry: ${entry ?? "?"}${expectedNoAdvance ? ", expected_no_advance" : ""})`);
for (const r of results) {
  const mark = r.status === "pass" ? "OK  " : r.status === "n/a" ? "n/a " : "FAIL";
  console.error(`  ${mark}  ${pad(r.gate, 24)} ${pad("→ " + (r.feeds ?? ""), 18)} ${r.evidence}`);
}
const failed = results.filter((r) => r.status === "fail");
console.error(`  ${failed.length} fail(s), ${results.filter((r) => r.status === "pass").length} pass, ${results.filter((r) => r.status === "n/a").length} n/a\n`);

process.stdout.write(JSON.stringify(results, null, 2) + "\n");

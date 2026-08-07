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
// The per-run facts the runner could not encode in artifacts are read from
// <working-dir>/gate-inputs.json, which the runner writes:
//   { "entry": "define", "baseline_completed_stages": 2,
//     "claimed_frameworks": ["SCQ"], "expected_no_advance": false }
//
// Output: a JSON array of { gate, type, feeds, status, evidence } to stdout
// (status ∈ pass | fail | n/a), plus a human table on stderr. Exit 0 always —
// this reports; it does not decide the build. No dependencies (Node 18+).

import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, join, dirname } from "node:path";

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
const inputs = JSON.parse(readIf(join(workingDir, "gate-inputs.json")) ?? "{}");
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

// Some gates presuppose the run produced steps. When a scenario legitimately
// ends with none — the interview never reached a walkthrough, and the target
// correctly refused to invent one — a gate like "autonomy ratings present"
// would go red on exactly the behavior it should reward. A gate opts in with
// `na_when_zero_steps` and the runner records `step_count` in gate-inputs.
// Absent step_count, this never triggers. (Proof case: blueprint iteration-1
// adv-form-dump-request — zero steps captured, non-invention worked, gate red.)
function naForZeroSteps(gate) {
  return gate.na_when_zero_steps === true && Number(inputs.step_count) === 0;
}

// --- gate evaluators -------------------------------------------------------

function evalGate(gate) {
  if (naForEntry(gate)) return { status: "n/a", evidence: `n/a for entry '${entry}'` };
  if (naForZeroSteps(gate)) return { status: "n/a", evidence: "n/a — run captured zero steps; nothing to rate" };
  const filePath = gate.file ? join(workingDir, gate.file) : null;
  const text = filePath ? readIf(filePath) : null;
  // A gate that only applies when its target file exists (e.g. an inventory
  // write-back check that is only relevant when a capture started from a
  // Process Inventory). Opt in with `na_if_file_absent`; a missing file is n/a,
  // not a fail. Gates without the flag keep failing on a missing file.
  if (gate.na_if_file_absent === true && text == null) {
    return { status: "n/a", evidence: `n/a — ${gate.file} absent (gate applies only when present)` };
  }

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
      // The 0.4.1 honest statuses: a stage the user advanced past its done-bar
      // is recorded `incomplete (advanced by user)` and EXCLUDED from
      // completed_stages, while current_stage still moves on. That is a
      // legitimate, recorded non-certification — the loop advanced exactly once
      // and the record says honestly why the stage isn't certified. Read the
      // Stage Record, not just the frontmatter count. (Proof case: strategist
      // iteration-2 adv-preference-over-evidence/run-1.)
      if (!ok && !expectedNoAdvance && delta === 0) {
        const honestRow = /incomplete \(advanced by user\)/.test(text);
        const cur = fm ? (fmList(fm, "current_stage") ?? [])[0] : null;
        const advanced = cur && entry && cur.toLowerCase() !== entry.toLowerCase();
        if (honestRow && advanced) {
          return pass(`Δ0 with honest status — 'incomplete (advanced by user)' recorded, current_stage advanced to '${cur}'`);
        }
      }
      return invertIfNoAdvance(ok, `completed_stages ${baseline}→${finalCount} (Δ${delta})`);
    }
    case "framework_in_library": {
      const claimed = Array.isArray(inputs.claimed_frameworks) ? inputs.claimed_frameworks : [];
      if (!claimed.length) return pass("no framework claimed in this run");
      if (!pluginRoot) return fail("no --plugin-root given for library check");
      const index = readIf(join(pluginRoot, gate.index));
      if (index == null) return fail(`missing library index ${gate.index}`);
      // The index carries each entry's slug and title but NOT its `aka` aliases,
      // which live in the entry's own frontmatter. A framework named by a
      // documented alias is in the library; matching against the index alone
      // reports it as fabricated — and this gate feeds No-Fabrication, so that
      // false positive is expensive. Every entry declares `aka`, so the whole
      // library was exposed to it. (Proof case: strategist iteration-5
      // rep-framework-eisenhower claimed "Eisenhower Matrix";
      // reference/synthesise/eisenhower.md declares it under `aka`.)
      const indexDir = dirname(join(pluginRoot, gate.index));
      const aliases = [];
      for (const rel of index.match(/[A-Za-z0-9._/-]+\.md/g) ?? []) {
        const fm = frontmatter(readIf(join(indexDir, rel)) ?? "");
        if (!fm) continue;
        for (const a of [...(fmList(fm, "aka") ?? []), ...(fmList(fm, "title") ?? [])]) {
          aliases.push(a, slug(a));
        }
      }
      const haystack = [index, ...aliases].join("\n").toLowerCase();
      const missing = claimed.filter((f) => !haystack.includes(slug(f)) && !haystack.includes(f.toLowerCase()));
      return missing.length ? fail(`not in library: ${missing.join(", ")}`) : pass(`all in library: ${claimed.join(", ")}`);
    }
    case "command_exit0": {
      // Run a shell command with cwd = the working dir; pass iff it exits 0.
      // `${PLUGIN_ROOT}` in the command is substituted with --plugin-root. This keeps
      // gate verdicts mechanical when the invariant lives behind a target-shipped
      // checker (e.g. researcher's validate-corpus-review.py validating a receipt) —
      // a runner-reported boolean is not a gate. Commands must be deterministic and
      // read-only over the capture.
      if (!gate.command) return fail("command_exit0 gate has no command");
      if (gate.command.includes("${PLUGIN_ROOT}") && !pluginRoot) {
        return fail("no --plugin-root given for ${PLUGIN_ROOT} substitution");
      }
      const cmd = gate.command.replaceAll("${PLUGIN_ROOT}", pluginRoot ? resolve(pluginRoot) : "");
      try {
        const out = execSync(cmd, { cwd: workingDir, encoding: "utf8",
                                    stdio: ["ignore", "pipe", "pipe"], timeout: 60000 });
        return pass(`exit 0 — ${out.trim().split("\n").slice(-1)[0]?.slice(0, 120) || "no output"}`);
      } catch (e) {
        const tail = `${e.stdout ?? ""}${e.stderr ?? ""}`.trim().split("\n").slice(-2).join(" | ");
        return fail(`exit ${e.status ?? "?"} — ${tail.slice(0, 160) || e.message}`);
      }
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
  const m = text.match(new RegExp(rule.forbid, rule.flags ?? "m"));
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

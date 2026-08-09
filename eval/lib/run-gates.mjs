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
//
// Three kinds of row come back, and the difference matters when one goes red:
//   kind "gate" / "lint" — the plugin's behavior. A red here is a finding about
//     the target.
//   kind "integrity"     — the CAPTURE's trustworthiness (built-in, every target,
//     no pack config). A red here says the run was not recorded faithfully, so
//     the scores computed from it mean nothing. It is not a mark against the
//     plugin; it is an instruction to re-run. See "capture integrity" below.

import { readFileSync, existsSync, statSync } from "node:fs";
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
  if (naForContext(gate)) {
    return { status: "n/a", evidence: `n/a — scenario did not declare '${gate.applies_when}'` };
  }
  if (naForZeroSteps(gate)) return { status: "n/a", evidence: "n/a — run captured zero steps; nothing to rate" };
  // Write-shaped gates on a run that is SUPPOSED to end without a capture. A skill
  // correctly holding its confirm-before-capture gate writes nothing, and "nothing
  // written" is the pass — reading it as a missing artifact false-fails the exact
  // discipline the gate is there to protect.
  if (gate.na_on_no_advance && expectedNoAdvance) {
    return { status: "n/a", evidence: "expected_no_advance — no capture expected, so no write to check" };
  }
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
    case "file_unchanged": {
      // "This run was not allowed to touch this file." Some runs are supposed to
      // end having written nothing: a preflight the skill declares write-free, a
      // ledger only the commissioner may append to. Every content-shaped gate
      // reads such a run as fine, because the file it checks is still the seeded
      // file and still well-formed — which is exactly how researcher iteration-21
      // let a run close a project and write completion state into STATE.md while
      // `state_active_phase` went green. "Still contains 'Active phase:'" cannot
      // see a write; only the baseline can.
      //
      // The baseline is staged by the ORCHESTRATOR after the run, from the
      // scenario's own setup (`_seed/<file>` by convention) — never by the runner,
      // which must not learn that a file is being watched. A missing baseline is
      // an orchestrator bug and FAILS loudly rather than going n/a: a watch that
      // silently stops watching is worse than no watch.
      const baselineRel = gate.baseline ?? join("_seed", gate.file);
      const baseline = readIf(join(workingDir, baselineRel));
      if (baseline == null) {
        return fail(`baseline not staged at ${baselineRel} — orchestrator must stage it from the scenario's setup`);
      }
      if (text == null) return fail(`missing file ${gate.file} (baseline exists, so it was deleted)`);
      // Trailing whitespace at EOF is normalized away: a writer that re-serializes
      // the seed with a final newline has changed nothing anyone cares about, and
      // failing that is the harness inventing red. Everything else is byte-exact.
      const norm = (s) => s.replace(/\s+$/, "");
      if (norm(text) === norm(baseline)) return pass(`${gate.file} byte-identical to seed`);
      const a = baseline.split("\n"), b = text.split("\n");
      let i = 0;
      while (i < Math.max(a.length, b.length) && a[i] === b[i]) i++;
      return fail(`${gate.file} MODIFIED — first difference at line ${i + 1}: seed "${(a[i] ?? "<eof>").slice(0, 60)}" → run "${(b[i] ?? "<eof>").slice(0, 60)}"`);
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
      //
      // `${PACK_ROOT}` resolves to the pack dir (where gates.json lives), so a pack
      // can also ship its OWN checkers under `checks/` for invariants the target
      // itself has no reason to validate at runtime — e.g. "the cycle-step field and
      // the checkbox list agree." That check belongs to the eval, not to the plugin,
      // and it must not live in eval/lib/, which is the plugin-agnostic engine.
      if (!gate.command) return fail("command_exit0 gate has no command");
      if (gate.command.includes("${PLUGIN_ROOT}") && !pluginRoot) {
        return fail("no --plugin-root given for ${PLUGIN_ROOT} substitution");
      }
      const cmd = gate.command
        .replaceAll("${PLUGIN_ROOT}", pluginRoot ? resolve(pluginRoot) : "")
        .replaceAll("${PACK_ROOT}", dirname(resolve(gatesPath)));
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
// `flags` is merged into the default "m" — deduped, because JS throws on a
// repeated flag and packs legitimately write "mi" (blueprint ×3) as well as "i"
// (goal-setting). Invalid characters are stripped: JS has no inline (?i), and
// passing one throws, which is how this was found.
function evalLint(rule) {
  const filePath = join(workingDir, rule.file);
  const text = readIf(filePath);
  if (text == null) {
    return rule.optional_file ? { status: "n/a", evidence: `${rule.file} absent (optional)` } : fail(`missing file ${rule.file}`);
  }
  const flags = [...new Set("m" + (rule.flags ?? "").replace(/[^gimsuy]/g, ""))].join("");
  const m = text.match(new RegExp(rule.forbid, flags));
  return m ? fail(`forbidden /${rule.forbid}/ found: "${m[0].slice(0, 40)}"`) : pass(`clean of /${rule.forbid}/`);
}

function pass(evidence) { return { status: "pass", evidence }; }
function fail(evidence) { return { status: "fail", evidence }; }

// --- capture integrity (built-in; every target, no pack config) -------------
//
// Everything downstream — every gate above, every judgment the judge makes — is
// computed from files the runner wrote about its own run. That makes the capture
// the one input nothing else can check, and a capture that overstates the run
// inflates a score with no red anywhere. Researcher iteration-21/23 hit exactly
// this: a capture attributed file paths to the assistant that its own transcript
// did not contain, and the scores stood.
//
// The rule these enforce is simply: **capture.md may not exceed transcript.md.**
// The transcript is the record; the capture is a reading of it. A reading that
// introduces facts is not a reading.
//
// They check *declared* facts, never prose. The first version of this scanned
// capture.md for file paths and asked whether each traced to disk, transcript, or
// seed; it red-flagged 25 of 41 real captures, because a capture legitimately
// names plugin-root files it read (`reference/posture-register.md`) and
// legitimately reports files that are *absent* ("no decision-ledger.md exists").
// Prose cannot distinguish an invented artifact from a correctly-reported absence,
// and a check that cries wolf 60% of the time is one people learn to skip. So the
// runner declares what it wrote, in a list, and the list is what gets checked.
//
// A red here means "re-run this scenario," not "the plugin regressed."

function captureIntegrity() {
  const rows = [];
  const transcript = readIf(join(workingDir, "transcript.md"));
  const capture = readIf(join(workingDir, "capture.md"));
  const spoken = readIf(join(workingDir, "spoken.md"));

  const add = (name, r) => rows.push({ gate: name, type: "capture_integrity", feeds: null, kind: "integrity", ...r });

  if (transcript == null || capture == null) {
    add("capture_complete", fail(`missing ${transcript == null ? "transcript.md" : ""}${transcript == null && capture == null ? " and " : ""}${capture == null ? "capture.md" : ""} — nothing downstream can be trusted`));
    return rows;
  }
  add("capture_complete", pass("transcript.md and capture.md present" + (spoken == null ? " (no spoken.md)" : ", spoken.md present")));

  // 1. Every artifact the runner says the run PRODUCED must actually be on disk.
  //    An artifact claimed but absent has no innocent reading — unlike a path in
  //    prose, which may be a file the run correctly reported as missing. This is
  //    the mechanical half of "capture.md may not exceed transcript.md": the
  //    runner's prose is free, but its declared produce-list is checked.
  const written = inputs.artifacts_written;
  if (!Array.isArray(written)) {
    add("capture_artifacts_exist", { status: "n/a", evidence: "runner recorded no `artifacts_written` list — produced-artifact claims are unverifiable in this capture" });
  } else {
    const phantom = written.filter((p) => !existsSync(join(workingDir, p)));
    add("capture_artifacts_exist", phantom.length
      ? fail(`${phantom.length} of ${written.length} declared artifact(s) do not exist: ${phantom.slice(0, 4).join(", ")}`)
      : pass(`all ${written.length} declared artifact(s) exist on disk`));
  }

  // 2. spoken.md is supposed to be the assistant's turns copied verbatim — it is
  //    what the register/no-tics lints read, so a runner that tidies while copying
  //    launders the very defect being measured. Substring containment in the
  //    transcript is the cheap, false-positive-free version of "verbatim."
  if (spoken == null) {
    add("spoken_verbatim", { status: "n/a", evidence: "no spoken.md in this capture" });
  } else {
    const lines = spoken.split("\n").map((l) => l.trim()).filter((l) => l.length > 24);
    const invented = lines.filter((l) => !transcript.includes(l));
    add("spoken_verbatim", invented.length
      ? fail(`${invented.length}/${lines.length} substantive line(s) in spoken.md are not in transcript.md: "${invented[0].slice(0, 70)}…"`)
      : pass(`all ${lines.length} substantive line(s) of spoken.md appear verbatim in transcript.md`));
  }
  return rows;
}

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
results.push(...captureIntegrity());

// Human table on stderr; machine JSON on stdout.
const pad = (s, n) => String(s).padEnd(n);
console.error(`\nGATES — ${spec.target ?? "?"}  (entry: ${entry ?? "?"}${expectedNoAdvance ? ", expected_no_advance" : ""})`);
for (const r of results) {
  const mark = r.status === "pass" ? "OK  " : r.status === "n/a" ? "n/a " : "FAIL";
  const feeds = r.kind === "integrity" ? "→ CAPTURE" : "→ " + (r.feeds ?? "");
  console.error(`  ${mark}  ${pad(r.gate, 24)} ${pad(feeds, 18)} ${r.evidence}`);
}
const failed = results.filter((r) => r.status === "fail");
console.error(`  ${failed.length} fail(s), ${results.filter((r) => r.status === "pass").length} pass, ${results.filter((r) => r.status === "n/a").length} n/a`);
// Called out separately because the response is different: a red integrity row
// means the capture is untrustworthy, so every score computed from it — including
// the green gates above — has to be thrown away and the scenario re-run. Rolling
// it into the fail count invites treating it as one more finding about the plugin.
const badCapture = results.filter((r) => r.kind === "integrity" && r.status === "fail");
if (badCapture.length) {
  console.error(`  !! CAPTURE INTEGRITY: ${badCapture.map((r) => r.gate).join(", ")} — re-run this scenario; do not grade this capture.`);
}
console.error("");

process.stdout.write(JSON.stringify(results, null, 2) + "\n");

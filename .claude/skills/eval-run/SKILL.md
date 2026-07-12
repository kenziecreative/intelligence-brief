---
name: eval-run
description: This skill should be used when the user asks to run a plugin evaluation or check a marketplace plugin for output regressions (e.g. "run the eval", "run the strategist golden set", "eval strategist", "check strategist for regressions", "run the adversarial scenarios"). Drives each scenario through a blind eval-runner, computes deterministic gates, scores each capture with the eval-judge against the target's rubric, and writes an iteration scorecard under the target pack's _eval/.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Task
---

# /eval-run — Run A Plugin's Output Evaluation

The runtime-QA regression command. For one in-repo plugin (the **target**), drive each
scenario through a blind **eval-runner**, compute the deterministic gates with
`eval/lib/run-gates.mjs`, score each capture with the **eval-judge** against the target's
rubric, and write an **iteration** scorecard. Run it after any change to the target's
skills. This is the runtime half of QA; the authoring half is the release loop in the root
`AGENTS.md` (`check-version-prefix` + `claude plugin validate` + plugin-dev reviewers).

> **Subagents:** spawn `eval-runner` then `eval-judge` with the Task tool (in Cowork, the
> Agent tool) — they live in `.claude/agents/`. One runner → gates → one judge per run.
> Independent scenarios may run in parallel; keep each run's working dir distinct.
>
> **If the `eval-runner` / `eval-judge` agent types aren't available** (they were just added
> and the session hasn't reloaded its agent registry — symptom: "Agent type not found"),
> either reload the session, or fall back to a `general-purpose` agent and pass the contents
> of `.claude/agents/eval-runner.md` (or `eval-judge.md`) as the brief. Keep the runner's
> discipline intact: blind to the rubric, faithful to the skills as written, isolated, and
> it writes `gate-inputs.json`.

## Targets are in-repo

There is no install/config step. A **target pack** lives at `eval/targets/<name>/` and the
plugin under test is the repo-root directory `<name>/`. Resolve both as absolute paths from
the repo root and use them explicitly (the shell cwd can reset between tool calls).

## Arguments

- `--target <name>` — which plugin to eval. Default: `strategist` (the only pack today).
- `--scope <golden | all | representative | adversarial>` — default `golden`.
- `--id <scenario-id[,id...]>` — run specific scenarios (error on an unknown id; surface it and stop).

NL mapping: "run the eval" / "the full set" → golden. "adversarial only" → `--scope adversarial`. "everything including candidates" → `--scope all`. "just <id>" → `--id <id>`.

## Preconditions (fail fast)

1. `eval/targets/<target>/` exists with `adapter.md`, `principles.md`, `rubric.md`, `scenarios.jsonl`, `gates.json`. If not, stop and name what's missing.
2. The plugin dir `<target>/` exists and contains the skill files the adapter names.

## Procedure

### Step 0 — resolve the run and the iteration
- `RUN_STAMP` = `date +%Y%m%d-%H%M%S`. `PACK` = `eval/targets/<target>`. `PLUGIN_ROOT` = absolute `<repo>/<target>`.
- **Iteration number:** look in `PACK/_eval/` for existing `iteration-*` dirs; `N` = highest + 1 (or 1 if none). Every run is a **fresh iteration** — never reuse or grade a prior iteration's captures (model output is non-deterministic, so an unchanged target does *not* license stale transcripts; see `eval/reference/iteration-discipline.md`).
- Build the **provenance stamp** now: `target` + its content hash (`git -C <repo> rev-parse --short HEAD` plus, if the tree is dirty, note it), `pack` + rubric version, `model_under_test` (the runner's model — it executes the skills), `judge_model`, `scope`, `RUN_STAMP`, and a one-line "changed since iteration N-1" if known.

### Step 1 — load the pack and resolve the scenario + sample set
- Read `adapter.md`, `principles.md`, `rubric.md`, `scenarios.jsonl`, `gates.json`.
- Filter scenarios by `--scope`/`--id` (`golden` = `golden:true`; `representative`/`adversarial` = by `kind`; `all` = every scenario).
- **Multi-sampling:** read the rubric's `noisy_dimensions`. A scenario whose `critical_dimensions` intersect `noisy_dimensions` is **noisy** → run it **3×** (`run-1/`, `run-2/`, `run-3/`); all others run once. (Judge-graded posture/critic dimensions are noisy; one roll is not a reading — see iteration-discipline.)

### Step 2 — run each (scenario × sample) through the blind runner
For each run, spawn an **eval-runner**. Pass it — **in the dispatch message, as text** — the `adapter`, the scenario's `entry`/`setup`/`user_messages` **only** (never the rubric or `expected_behavior` — the runner is blind), `PLUGIN_ROOT`, and the working dir:
`PACK/_eval/iteration-N/<scenario-id>/` (single-sample) or `…/<scenario-id>/run-k/` (noisy).
The runner writes `transcript.md`, `capture.md`, and `gate-inputs.json`.

> **Staging rule — the runner's working dir contains only the slice it is allowed to see.**
> Never write the full scenario object (expectations included) into the runner's working dir,
> under any filename. A runner reads the files around it; a `scenario-full.json` sitting in its
> cwd is not blind, whatever the dispatch message said. This is not hypothetical — goal-setting
> iteration-1 staged exactly that file and a runner read it and self-reported, costing a run.
> If the full scenario needs to live on disk for the judge, stage it **outside** the runner's
> dir — e.g. `PACK/_eval/iteration-N/_scenarios/<scenario-id>.json` (the `_scenarios/` dir is
> judge-only; no runner is ever pointed at it).

### Step 3 — compute deterministic gates (script, not judgment)
For each completed run, **first write the scenario's gate context** — the facts the gates need
that are declared by the *scenario*, not observed by the runner. Write
`<working-dir>/gate-context.json` yourself (Write tool) with the scenario's `expected_no_advance`
(default `false`) and every key of its `gate_context` block, if it has one:
```json
{ "expected_no_advance": true, "closeout_expected": true }
```
This is the orchestrator's job precisely because the runner is blind: a scenario-declared fact
must not depend on a blind runner noticing it (iteration-1 false-failed six runs when it did).
Writing it after the run keeps it out of the runner's way. Then:
```
node eval/lib/run-gates.mjs --working-dir <working-dir> --gates PACK/gates.json --plugin-root PLUGIN_ROOT
```
Capture its JSON array (`{gate, feeds, status, evidence}`). These verdicts are inherited as-is; the judge never recomputes them. `gate-context.json` overlays `gate-inputs.json`, so the `expected_no_advance` inversion and every `applies_when` gate resolve automatically.

### Step 4 — score each run through the judge
Spawn an **eval-judge** per run. Pass it: `rubric.md` + `principles.md`, the **full** scenario (now including `expected_behavior` + `critical_dimensions`), the path to `capture.md` + artifacts, the **gate-results JSON** from Step 3, and `eval/reference/grade-procedure.md`. It returns a per-run scorecard, inheriting gates and judging the rest.

### Step 5 — surface raw captures to the human FIRST
Before printing any verdict, give the user the paths to this iteration's raw `transcript.md`/artifacts and a one-line "read these first." The score is a lens on the output, not a substitute for it.

### Step 6 — write the iteration scorecard
Write `PACK/_eval/iteration-N/scores.md`:
1. The **provenance stamp** (Step 0).
2. Each per-scenario scorecard (verbatim from the judge). For noisy scenarios, report the **spread** across the 3 samples per dimension (min–max), not a single number — a wide spread is itself the finding.
3. The **aggregate** (per `grade-procedure.md`): scenarios graded, pass/fail, mean by dimension, pass-rate by kind, failing scenarios → top issue, the ranked next-3-to-fix.
4. The **filing split**: file-eligible (deterministic-gate) failures separate from surface-for-decision (judgment) misses. Auto-file nothing.

### Step 7 — readout
Short summary: scenarios graded, pass/fail, pass-rate by kind, mean-by-dimension, any noisy-dimension spread, the top-3 fixes, and where the artifacts live (`PACK/_eval/iteration-N/`). **Flag any golden failure prominently — a red golden is a ship-blocker.**

## Guardrails
1. The runner is blind — never pass it the rubric or `expected_behavior`, and never leave them
   in its working dir (Step 2's staging rule). Blindness is a property of the *filesystem the
   runner sees*, not just of the dispatch message.
2. Gates are script-computed; the judge inherits them and scores the capture only — it never re-runs the plugin.
3. Faithful execution: the runner follows the target's skills as written; a missing instruction shows up as a regression signal, not a bug to patch mid-run.
4. Isolation + fresh transcripts: every run writes under `PACK/_eval/iteration-N/`; never touch a real project or the target's own files, and never grade a prior iteration's captures.
5. Report honestly: a smooth run that skipped the load-bearing behavior is a fail; say so.

## What this skill does not do
- File issues (the scorecard lists candidates; filing is a separate human step).
- Modify scenarios or the target. Scenarios live in the pack; add them with `eval/reference/generate-scenarios.md`.

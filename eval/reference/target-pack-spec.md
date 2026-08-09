# Target pack specification

The engine is plugin-agnostic. Everything specific to *what* is being evaluated lives in a
**target pack** under `eval/targets/<name>/`. To evaluate a new plugin, write a pack; the
engine doesn't change. (Scaffold one with the `eval-new-target` skill if present.)

A pack is six files, plus two optional directories:

```
eval/targets/<name>/
  adapter.md        how to drive the target and where its output lands
  principles.md     what "good output" means for this target (short, consensus)
  rubric.md         principles operationalized as 0–3 dimensions + thresholds
  scenarios.jsonl   representative + adversarial cases (goldens = invariants)
  gates.json        machine-readable deterministic gate + content-lint specs (run-gates.mjs)
  coverage.md       the scenario-class checklist a dev set must cover, mapped to ids
  checks/           (optional) the pack's own deterministic checkers, run via ${PACK_ROOT}
  fixtures/         (optional) whole-project trees a scenario seeds with setup.fixture
```

## adapter.md

The bridge between the generic engine and one target plugin. It tells the runner how to
drive the plugin and tells the judge where to look. It must specify:

- **Invocation** — which skill the runner executes for each scenario, and how a scenario
  names the entry point (`entry`).
- **User-turn protocol** — how the runner feeds the scripted `user_messages` (one per
  assistant reply, in order) and when a scenario is "done."
- **Plugin location** — the in-repo plugin dir whose real skills the runner loads (resolved
  by the run skill as `<repo>/<name>`; the runner reads them fresh).
- **Working dir** — the per-run capture path the run skill assigns
  (`eval/targets/<name>/_eval/iteration-N/<scenario-id>/`), so runs never touch a real project.
- **Artifacts** — the files the plugin writes that the judge should read (e.g.
  `strategy/brief.md`, `strategy/STATE.md`), relative to the working dir.
- **gate-inputs** — what facts the runner must record in `gate-inputs.json` for the gate
  script (e.g. `claimed_frameworks` extracted from the transcript, the `setup` baseline).
- **Deterministic gates** — a human-readable table of the invariants, each pointing at its
  machine spec in `gates.json` and the rubric dimension it feeds.

## principles.md

The short, consensus statement of what good output from this target means — the yardstick.
Keep it to the handful of load-bearing principles whose violation has actually been observed
or designed against, not an aspirational list. Each maps to one or more rubric dimensions.

## rubric.md

Each principle operationalized as a dimension scored 0–3, with concrete anchors. Include:

- The dimension table (0/1/2/3 anchors per dimension).
- Which dimensions are **gate** (inherited from `run-gates.mjs`) vs **judge** vs **gate+judge**.
- **`noisy_dimensions`** — the judge-graded dimensions that vary run to run (posture, critic
  acuity, etc.). A scenario whose `critical_dimensions` touch these is multi-sampled (3×) and
  reported as a spread. See `iteration-discipline.md`.
- **Pass/fail thresholds** — typically: representative passes if every applicable dimension
  ≥ 2 and the critical dimensions = 3; adversarial passes only if every `critical_dimensions`
  entry = 3. A **`severity: blocker`** scenario that fails any `must_have` fails the suite
  regardless of total.
- **Aggregate** reporting: mean per dimension, pass-rate overall and per kind.

## gates.json

The machine spec `eval/lib/run-gates.mjs` reads. `{ "target", "gates": [...], "content_lint": [...] }`.
Each gate is `{name, type, …params, feeds, na_for_entries?, applies_when?, na_on_no_advance?}`.
Supported types:

- `frontmatter_keys` — a file's frontmatter contains the named `keys`.
- `file_contains` — a file matches a `pattern` (regex).
- `section_filled` — the `## <section>` for the run's entry is not the `placeholder`.
- `completed_stages_delta` — the frontmatter list grew by `delta` (honors `expected_no_advance` inversion).
- `framework_in_library` — every `claimed_frameworks` entry (from `gate-inputs.json`) resolves to a slug in the target's `index` file.
- `file_unchanged` — the file is byte-identical to its staged baseline (`_seed/<file>` by
  default; override with `baseline`). For runs that are supposed to write **nothing**: a
  write-free preflight, an append-only ledger the target may not edit. Every other gate type
  reads such a run as fine, because the file it checks is still the seeded file and still
  well-formed — which is how researcher iteration-21 let a run close a project and write
  completion state while `state_active_phase` went green. Pair it with `applies_when`, and
  see "staging the baseline" below.
- `command_exit0` — run a command with cwd = the working dir; pass iff it exits 0.
  `${PLUGIN_ROOT}` and `${PACK_ROOT}` are substituted. Use `${PLUGIN_ROOT}` when the
  invariant lives behind a checker the *target* ships (researcher's
  `validate-corpus-review.py`). Use `${PACK_ROOT}` when the check belongs to the **eval**
  and the plugin has no reason to run it at runtime — put those in the pack's own
  `checks/` dir, never in `eval/lib/`, which is the plugin-agnostic engine.

### Applicability — the thing that bites

A gate that fires on runs where its invariant *cannot exist* doesn't measure the plugin; it
manufactures red. Three levers, in order of preference:

- `na_for_entries: [...]` — the invariant belongs to some entry points and not others (a
  journal entry is a cadence artifact; a Setup stage doesn't write one).
- `applies_when: "<key>"` — the invariant exists only when the **scenario** sets up the
  situation that produces it. "Did the revision preserve the original?" has no answer on a
  monthly where nothing was revised. The gate is n/a unless the run's gate context carries
  that key as `true`. The trigger is scenario-declared, never run-observed, so a plugin can
  never dodge a gate by simply not doing the thing.
- `na_on_no_advance: true` — a write-shaped gate on a run that is supposed to end *without* a
  capture. A skill correctly holding its confirm-before-capture gate writes nothing; reading
  "nothing written" as a missing artifact false-fails the exact discipline being tested.

Goal-setting iteration-1 false-failed **six of twenty-four runs** on the absence of these
three, which is what a miscalibrated gate costs: it hides the plugin behind the harness.

`content_lint` rules are `{name, file, forbid (regex), feeds, optional_file?}` — a forbidden
pattern that must **not** appear (em dashes, placeholder tokens, process-residue leakage).

## The two gate-input files

`run-gates.mjs` reads two files from the working dir, written by two different parties, and
the split is load-bearing:

- **`gate-inputs.json` — the runner writes it.** Facts it *observed* about the run it just
  performed and nobody else can see: `entry`, `baseline_completed_stages`, `claimed_frameworks`.
- **`gate-context.json` — the orchestrator (`/eval-run`) writes it.** Facts the *scenario*
  declares: `expected_no_advance` plus every key of the scenario's `gate_context` block. The
  runner is blind and never sees this file.

`gate-context` overlays `gate-inputs`. A scenario-declared fact must never depend on a blind
runner remembering to copy it — that is exactly how six runs were lost.

### Staging the baseline for `file_unchanged`

The orchestrator writes `<working-dir>/_seed/<file>` from the scenario's own `setup` (or from
`fixtures/<name>/`) **after the run finishes** — never before. Staging it early would tell a
blind runner that a file is being watched, and "don't touch this file" is an instruction a
runner can follow, which turns a property of the plugin's behavior into a property of the
harness's hint. A gate whose baseline is missing **fails** rather than going n/a: a watch that
silently stops watching is worse than no watch.

### Capture integrity (built-in, no pack config)

`run-gates.mjs` always emits a few rows with `kind: "integrity"`. They score the **capture**,
not the plugin: is the transcript there, do the artifacts the runner declared in
`artifacts_written` exist, is `spoken.md` verbatim against the transcript. The rule behind
them is *capture.md may not exceed transcript.md* — the judge never re-runs anything, so a
capture that credits the assistant with work it didn't do produces a score for a run that
never happened. A red integrity row means **re-run the scenario and discard this capture**; it
is never reported as a target finding.

Note what these check and what they don't: they check *declared* facts, never prose. An early
version scanned capture.md for file paths and asked whether each traced to disk, transcript,
or seed — it red-flagged 25 of 41 real captures, because a capture legitimately names
plugin-root files it read and legitimately reports files that are *absent*. If you extend this
layer, extend the machine-readable declarations, not the prose parsing.

### Gates on behavior belong judge-side

The applicability levers above decide *when* a gate fires. This decides *where it is written
down*. A gate that checks structure (does the file exist, does it have the section) can sit in
the runner-visible `adapter.md` table safely. A gate that checks **behavior** — did the skill
reconcile two representations of its own state, did it leave a file alone — must not, because
the runner reads that file, and a runner that knows cycle coherence is gated will tidy the
checkboxes the skill forgot to tidy. That is the defect, laundered by the harness. Document
those in `coverage.md` (judge-only), and leave a line in `adapter.md` saying the table is
partial and deliberately so, or the next maintainer will "fix" it.

**`adapter.md` is runner-visible. Keep it mechanism-only.** The runner must read the adapter —
it's how it knows which skill to execute and what to capture — so anything written there has
been told to the system under test. Describe *what the gates check and who writes what*; never
"scenario X should end with Y." A gate-context table listing which scenario declares which key
is a rubric in a lab coat. (Caught in goal-setting iteration-2, by a runner that flagged the
passage instead of using it — which is the only reason it wasn't a silent contamination.)

## scenarios.jsonl

One JSON object per line. Fields (`tone_notes` and `severity` are optional but recommended):

```json
{
  "id": "kebab-id",
  "kind": "representative | adversarial",
  "golden": true,
  "severity": "blocker | high | medium",
  "entry": "<adapter-defined entry point, e.g. 'define' or 'pressure-test'>",
  "tags": ["..."],
  "setup": { "...": "optional pre-state the runner establishes (e.g. a prior brief)" },
  "user_messages": [ { "role": "user", "content": "..." } ],
  "expected_behavior": {
    "must_include": ["traits the output must have"],
    "must_not_include": ["traits that are an automatic miss"],
    "must_not_do": ["banned actions, e.g. invent a framework, fabricate a figure"],
    "critical_dimensions": ["dimension keys that must score 3 to pass"]
  },
  "tone_notes": "how a good response should feel here (the judge reads this for voice/tone)",
  "gate_context": { "revision_expected": true },
  "expected_no_advance": false
}
```

`gate_context` turns on the pack's `applies_when` gates for this scenario (above). Both it and
`expected_no_advance` are read by the **orchestrator**, never handed to the runner.

**Script the terminal turn.** A scenario must supply enough user turns to *reach* the behavior
it tests. Three goal-setting goldens ran out of messages while the plugin was correctly holding
a confirm-before-capture gate, so the write they existed to check was structurally unreachable
and all three scored red for it. If the invariant is "the record gets written," the script has
to include the turn where the user says yes.

Adversarial scenarios encode the bad-user behavior in `user_messages` and name the
dimensions that must hold in `critical_dimensions`. Add scenarios with the meta-prompt in
`generate-scenarios.md`, and keep `coverage.md` in sync.

## coverage.md

The checklist of scenario classes a dev set must include (one representative per entry, plus
each adversarial invariant), each mapped to the scenario id(s) that cover it, with gaps named
explicitly. This is what stops silent coverage holes.

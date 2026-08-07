# Blueprint-design adapter

How the eval-runner drives the `blueprint-design` skill and where the eval-judge looks. A third target
on the blueprint plugin (alongside `blueprint` capture and `blueprint-discover`); it exists separately
because the invariants differ — design *proposes* a flow (generative on structure) while never
inventing the operator's constraints, and its artifact is a *designed* Blueprint, not an observed one.

## Target plugin root

`PLUGIN_ROOT` is the repo-root `blueprint/` directory, resolved by `/eval-run`. The files the runner
uses:

- `<root>/skills/blueprint-design/SKILL.md` — the design engine
- `<root>/reference/design-doctrine.md` — the grounded-proposer rule + conventions
- `<root>/reference/blueprint-template.md` — the shared output structure (Design mode)

No agents, no hooks.

## Invocation by `entry`

`entry` is always `design`. The runner executes the `blueprint-design` SKILL literally, plays the
assistant, and consumes `user_messages` in order. The run ends when messages are exhausted or the
skill reaches its end. A truncated design (messages run out) is a valid capture — the skill writes the
designed Blueprint from what was gathered.

**One scenario legitimately produces no Blueprint:** if it emerges the operator already runs the
process, the skill must *decline to design* and route to `/blueprint:capture`. That is correct
behavior, not a missing artifact — the design gates are auto-n/a when no Blueprint was written (see
below).

## Working dir and setup

Working dir: `eval/targets/blueprint-design/_eval/iteration-N/<scenario-id>/` (or `…/run-k/`). The
designed Blueprint lands under `blueprints/`. No prior state; no `setup` block.

## User-turn protocol

Follow the skill; small batches (2–4 questions), then wait. The design skill's whole discipline is
*grounded proposer* — it must elicit the real frame and the nearest analog before proposing. A runner
that skips the elicitation and jumps to a proposed flow destroys the Grounded-Not-Generic signal.
Every turn is written to `transcript.md`.

## Artifacts the judge reads

- `<working-dir>/transcript.md` — the full conversation (primary for the posture dimensions).
- `<working-dir>/blueprints/<name>.md` — the designed Blueprint (Mode: Design), if one was written.
- `<working-dir>/blueprints/captured-blueprint.md` — the gate-addressing verbatim copy.

## The gate-addressing copy

After the run, the runner copies the produced designed Blueprint **verbatim** to
`blueprints/captured-blueprint.md` and records `blueprint_path` in `gate-inputs.json`. If the skill
correctly produced no Blueprint (the route-to-capture scenario), no copy is made and the design gates
go n/a.

## Deterministic gates

| Gate | Check | Feeds |
| --- | --- | --- |
| `designed_status` | `captured-blueprint.md` Status reads "Designed — not yet run" — **auto-n/a when absent** (route-to-capture scenario) | Proposed-Honesty |
| `steps_proposed` | the designed Blueprint labels its steps as proposals ("Rests on" / "Breaks if" convention present) — auto-n/a when absent | Proposed-Honesty |

Plus `content_lint`: no unfilled template field brackets, no `[TODO]`/`[TBD]`/`[FILL]` tokens
(→ Artifact Integrity); and `no_design_narration` — the artifact must not narrate the design session
("the operator said", "in this session") (→ Register).

The grounded-proposer and constraint-non-invention invariants are **not** deterministically gateable
(they're about whether a proposed step traces to the operator's reality or to generic knowledge) — they
are judged. The gates verify the honest-labelling floor; the judge verifies the grounding.

**What the runner records** (`gate-inputs.json`):

```json
{
  "entry": "design",
  "blueprint_path": "blueprints/campaign-email-processing.md",
  "step_count": 5,
  "autonomy_ratings": ["Human", "Monitor", "Human", "Monitor", "Human"],
  "produced_design": true,
  "expected_no_advance": false
}
```

`produced_design` is `false` for the route-to-capture scenario (no Blueprint written). `expected_no_advance`
is always `false`; the field is present only because the shared engine reads it.

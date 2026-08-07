# Blueprint-discover adapter

How the eval-runner drives the `blueprint-discover` skill and where the eval-judge looks. This is
a second target on the same plugin as `blueprint` (capture); it exists separately because the
artifact (a Process Inventory) and the invariants differ from a Blueprint's.

## Target plugin root

The runner reads and executes the discover skill's real files. `PLUGIN_ROOT` is the repo-root
`blueprint/` directory, resolved by `/eval-run`. The files the runner uses:

- `<root>/skills/blueprint-discover/SKILL.md` — the sweep engine
- `<root>/reference/discovery-sweep.md` — the recall cues + the three prioritization lenses
- `<root>/reference/process-inventory-template.md` — the inventory structure the skill fills

No agents, no hooks. The skill is the whole surface.

## Invocation by `entry`

Discover has one mode, so `entry` is always `discover`. The runner executes the
`blueprint-discover` SKILL literally, plays the assistant, and consumes the scenario's
`user_messages` one per assistant reply in order. The run ends when messages are exhausted or the
skill reaches Step 6. A truncated sweep (messages run out mid-interview) is a valid capture — the
skill writes the inventory from what was gathered.

## Working dir and setup

Each run gets its own working dir, assigned by `/eval-run`:
`eval/targets/blueprint-discover/_eval/iteration-N/<scenario-id>/` (or `…/run-k/` for multi-sampled
scenarios). The inventory lands under `blueprints/` inside it.

Discover needs no prior state. A scenario may optionally carry `setup.existing_inventory` (a
filename → markdown map written under `blueprints/` before the first turn) to exercise the
living-document re-sweep path. When there is no `setup`, the runner creates nothing up front — the
skill's own default (`blueprints/process-inventory.md`, created with the Write tool) is under test.

## User-turn protocol

The runner plays the assistant by following the skill: emit the assistant turn the skill dictates,
take the next user message as the reply, repeat. **Honor the skill's small-batch rule** (two or
three memory surfaces per turn, then stop) — a runner that fires the whole cue list at once destroys
the Recall Breadth and Register signal. Every turn is written to `transcript.md`.

## Artifacts the judge reads

- `<working-dir>/transcript.md` — the full conversation. The primary artifact for the posture
  dimensions (the sweep conduct lives here).
- `<working-dir>/blueprints/<name>.md` — the Process Inventory the skill wrote.
- `<working-dir>/blueprints/captured-inventory.md` — the gate-addressing copy (below).

## The gate-addressing copy

The skill names its output `process-inventory.md` (or per `blueprints_dir`), so after the run the
runner copies the produced inventory **verbatim** to `blueprints/captured-inventory.md` and records
the original path as `inventory_path` in `gate-inputs.json`. This is a harness convention so the
gates have a fixed path; the judge reads the original. If no inventory was written, no copy is made
and the file-based gates fail — the correct verdict.

## Deterministic gates

Script-computed by `eval/lib/run-gates.mjs` from `gates.json`.

| Gate | Check | Feeds |
| --- | --- | --- |
| `inventory_written` | `captured-inventory.md` opens with a `# Process Inventory` heading | Artifact Integrity |
| `no_autonomy_ratings` | the inventory contains **no** per-candidate autonomy rating — no `**Autonomy:**` field, no `Autonomy: Automate\|Monitor\|Human`, no `Automate / Monitor / Human` triad | No-Premature-Rating |
| `no_sweep_narration` | the inventory does not narrate the sweep that produced it (case-insensitive; "the operator said/described," "interview," "this session") | Register |

Plus `content_lint` on the inventory: no unfilled template field brackets, no `[TODO]`/`[TBD]`/
`[FILL]` tokens (→ Artifact Integrity).

The `no_autonomy_ratings` gate is the deterministic floor under the discovery invariant that most
distinguishes it from capture: **discovery recognizes work, it does not rate it.** If a run assigns
autonomy at discovery, this goes red — which is the correct verdict, and the reason the gate exists.
It is a floor, not a ceiling: the judged **No-Premature-Rating** dimension also catches softer forms
(prose like "you could safely automate this one").

**What the runner records** (`gate-inputs.json`):

```json
{
  "entry": "discover",
  "inventory_path": "blueprints/process-inventory.md",
  "candidate_count": 6,
  "expected_no_advance": false
}
```

`expected_no_advance` is always `false` for this target — discovery has no stage-advance concept;
the field is present only because the shared gate engine reads it.

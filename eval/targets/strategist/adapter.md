# Strategist adapter

How the eval-runner drives the strategist plugin and where the eval-judge looks.

## Target plugin root

The runner reads and executes the strategist plugin's real skill files. The plugin is
in-repo: `PLUGIN_ROOT` is the repo-root `strategist/` directory, resolved by `/eval-run`
(no install/config step). The files the runner uses:

- `<root>/skills/strategist-init/SKILL.md`
- `<root>/skills/strategist-stage/SKILL.md`  — the engine for all seven stages
- `<root>/skills/strategist-framework/SKILL.md`
- `<root>/skills/strategist-pressure-test/SKILL.md`
- `<root>/agents/strategist-critic.md`  — the critic the pressure-test step dispatches
- `<root>/reference/INDEX.md` and `<root>/reference/<stage>/` — the framework library

## Invocation by `entry`

Each scenario names an `entry`. The runner executes the matching skill, following it
literally:

| `entry` | Runner executes | Notes |
| --- | --- | --- |
| `define` … `move` (any of the 7 stages) | `strategist-stage` SKILL for that stage | The main path. |
| `framework` | `strategist-framework` SKILL | First `user_message` carries the framework name/slug. |
| `pressure-test` | `strategist-pressure-test` SKILL **and** the `strategist-critic` agent | The pressure-test step dispatches the critic; since the runner can't nest a subagent, it plays the critic itself by reading `agents/strategist-critic.md` and producing exactly the findings that agent would, then has the skill present them. |
| `resume` | `strategist-resume` SKILL, then `strategist-stage` for the in-flight stage | Session-boundary scenarios. The run starts as a fresh session against the seeded files: the resume skill re-establishes position, then work continues mid-stage. |

`init` is not run per-scenario; the runner establishes any needed prior state directly from
the scenario's `setup` (below), which is faster and fully controlled.

## Working dir and setup

Each run gets its own working dir, assigned by `/eval-run`:
`eval/targets/strategist/_eval/iteration-N/<scenario-id>/` (or `…/<scenario-id>/run-k/` for
multi-sampled scenarios). The strategist artifacts live under `strategy/` inside it.

If the scenario has a `setup` block, write it into the working dir **before** the first
turn, so the run starts from that state:

- `setup.problem` → the problem statement (write into `strategy/STATE.md` frontmatter and
  the `strategy/brief.md` Problem line).
- `setup.completed_stages` → mark those stages complete in `strategy/STATE.md` (Stage
  Record + `completed_stages`), and set `current_stage` to the scenario's `entry`.
- `setup.brief` → a map of stage → markdown; write each into the matching `##` section of
  `strategy/brief.md` (this is how a planted cross-stage contradiction is seeded).
- `setup.working_dynamic` → optional `pushback_calibration` value to seed `## Working
  Dynamic` (for calibration scenarios).
- `setup.state_extra` → mid-stage state for `entry: resume` scenarios, seeded into the
  scaffolded `strategy/STATE.md` **before** the first turn. Each field maps to its
  STATE.md section: `working_dynamic` → `## Working Dynamic`; `open_questions` (list of
  hypothesis lines) → `## Open Questions Under Test`; `in_flight` (framework, answered, open,
  provisional) → `## In-Flight`; `backstage_tasks` → `## Backstage Tasks`. For
  `entry: resume`, `current_stage` is the stage named in `in_flight.framework` (e.g.
  "Waterfall (Analyse)" → `analyse`), not the entry name.

When there is no `setup`, scaffold a minimal fresh `strategy/STATE.md` + `brief.md` (as
`strategist-init` would) with the scenario's implied problem, then run the entry stage.

## User-turn protocol

The runner plays the assistant by following the skill; it consumes `user_messages` in
order — emit the assistant turn the skill dictates, take the next user message as the
reply, repeat. The run ends when messages are exhausted or the skill reaches its transition/
handoff. Every turn is written to `transcript.md`.

### Transcript convention (load-bearing — Register is scored off this)

Keep runner annotation and user-facing assistant speech unambiguously separate:

- **Assistant speech** goes inside the `**ASSISTANT:**` block and nowhere else.
- **Runner annotation** — internal steps taken, files written, "user messages exhausted" —
  goes on its own line, **outside** the speaker block, prefixed `(Runner note: …)`.
- Never wrap both in the same italic-parenthetical form inside an `ASSISTANT:` block.

This is not cosmetic. Register scores 0 when the machinery is spoken to the user, so a
transcript that cannot distinguish "the agent said this" from "the runner noted this" makes
the dimension unscoreable. In iteration 1, three judges scored the *same behavior* 0, 2 and 3
purely on how they parsed that ambiguity, and one capture's score swung two full anchors on it.
Two judges independently found the only reliable tell — **grammatical person**: third-person
past ("the run recorded X") is annotation, second-person present ("you took two direct pushes")
is speech. Encoding the prefix removes the guesswork; the person test remains the fallback for
older captures.

## Artifacts the judge reads

- `<working-dir>/transcript.md` — the full conversation.
- `<working-dir>/strategy/brief.md` — the evolving strategy document.
- `<working-dir>/strategy/STATE.md` — loop state.

## Deterministic gates

These are **script-computed** by `eval/lib/run-gates.mjs` from the machine spec in
`gates.json` — the runner does not eyeball them. Their verdicts feed the gate-sourced rubric
dimensions and are inherited by the judge.

| Gate | Check | Feeds |
| --- | --- | --- |
| `state_frontmatter` | `strategy/STATE.md` frontmatter has `status`, `current_stage`, `completed_stages` | State Integrity |
| `working_dynamic_present` | `strategy/STATE.md` contains a `## Working Dynamic` section | State Integrity |
| `brief_section_filled` | the `entry` stage's `##` section in `brief.md` is no longer `_Not yet started._` (n/a for `framework`/`pressure-test`/`resume`) | State Integrity |
| `single_stage_advance` | `completed_stages` grew by exactly 1 vs the `setup` baseline, **or** the loop advanced past a stage honestly recorded as a non-certification — a Stage Record row `incomplete (advanced by user)` with `current_stage` advanced counts as a recorded pass, not a Δ0 fail (n/a for `framework`/`pressure-test`/`resume`) | Loop Hygiene |
| `framework_in_library` | every framework the assistant claimed to apply resolves to a slug in `strategist/reference/INDEX.md` | No-Fabrication |

Plus two `content_lint` checks on the reader brief (`strategy/strategy-brief.md`, optional —
absent before Story): no `_Not yet started._` residue, no `[TODO]`/`[placeholder]` tokens
(→ Brief Coherence).

**What the runner must record** (`gate-inputs.json`, since the script can't see them):
`entry`, `baseline_completed_stages` (from `setup`), and `claimed_frameworks` (every framework
the assistant said it was applying — the decisive input to the fabrication gate).

The runner does **not** record `expected_no_advance` — see below.

### `expected_no_advance` scenarios (set by the orchestrator, never the runner)

Some adversarial scenarios are *supposed* to end with the stage not completing — a
stonewalling user who only gives non-answers, where the correct behavior is to keep pushing
and **refuse** to capture a result. A scenario sets `"expected_no_advance": true`, and
`run-gates.mjs` **inverts** `single_stage_advance` and marks `brief_section_filled` n/a: not
advancing is a `pass`, advancing is a `fail`. Without this, those gates penalize correct
refusal-to-capture — the harness false-negative the first strategist run exposed.

**The orchestrator injects that field into `gate-inputs.json` from `scenarios.jsonl` before
running the gates.** It used to be the runner's job, which was incoherent two ways: the runner
is specified as blind, so it cannot know the field exists — and telling it hands over the
answer ("you are not supposed to advance") immediately before it decides whether to advance.
Iteration 1 hit exactly that: the field was withheld to preserve blindness, three scenarios
wrote `false`, and correct refusals were scored as gate failures. `scenarios.jsonl` is
authoritative; the runner stays blind; the gate verdict comes out right.

# Goal-setting adapter

How the eval-runner drives the goal-setting plugin and where the eval-judge looks.

## Target plugin root

The runner reads and executes the goal-setting plugin's real skill files. The plugin is
in-repo: `PLUGIN_ROOT` is the repo-root `goal-setting/` directory, resolved by `/eval-run`
(no install/config step). The files the runner uses:

- `<root>/skills/goal-setting-setup-stage/SKILL.md` — the engine for all six Setup stages
- `<root>/skills/goal-setting-pulse/SKILL.md` — daily + weekly (parameterized by cadence)
- `<root>/skills/goal-setting-review/SKILL.md` — monthly + quarterly + annual
- `<root>/skills/goal-setting-restart/SKILL.md`
- `<root>/skills/goal-setting-pressure-test/SKILL.md`
- `<root>/skills/goal-setting-progress/SKILL.md`
- `<root>/agents/goal-setting-critic.md` — the critic the pressure-test skill dispatches
- `<root>/reference/heartbeat.md` — the return protocol every skill applies at Step 0
- `<root>/reference/stages/`, `<root>/reference/schemas.md` — stage specs + object model

## Invocation by `entry`

| `entry` | Runner executes | Notes |
| --- | --- | --- |
| `orient` … `premortem` (any of the 6 stages) | `goal-setting-setup-stage` for that stage | |
| `daily`, `weekly` | `goal-setting-pulse` for that cadence | |
| `monthly`, `quarterly`, `annual` | `goal-setting-review` for that cadence | |
| `restart` | `goal-setting-restart` | |
| `pressure-test` | `goal-setting-pressure-test` **and** the critic | The runner can't nest a subagent; it plays the critic itself by reading `agents/goal-setting-critic.md` and producing exactly the findings that agent would (including its Prior Findings behavior), then has the skill present them. |
| `progress` | `goal-setting-progress` | Read-only. |

`init` is not run per-scenario; the runner establishes prior state directly from the
scenario's `setup` (below).

**The heartbeat is part of every entry.** Each skill's Step 0 applies
`reference/heartbeat.md` — the runner must execute it faithfully (compute overdue state
from the seeded dates and TODAY, restore stance, route) before the cadence work. Several
goldens exist precisely to catch a runner-or-plugin that skips it.

## TODAY

Cadence routing is date arithmetic, so every scenario pins the clock: `setup.today`
(`YYYY-MM-DD`) is the date the runner treats as "today" for the entire run. All seeded
last-run dates are absolute. The runner must not use the real date.

## Working dir and setup

Each run gets its own working dir, assigned by `/eval-run`:
`eval/targets/goal-setting/_eval/iteration-N/<scenario-id>/` (or `…/run-k/` for
multi-sampled scenarios). The goal-setting artifacts live under `goals/` inside it.

If the scenario has a `setup` block, write it into the working dir **before** the first
turn:

- `setup.today` → the pinned date (above).
- `setup.state` → a map merged into `goals/STATE.md`: frontmatter keys (`mode`,
  `setup_status`, `current_stage`, `completed_stages`, `restart_phase`, flags), cadence
  last-run lines, and optional `working_dynamic` (pushback calibration), `coaching_memory`,
  `backstage_tasks`, `candidate_backlog` section bodies. Anything unspecified comes from
  the init template's structure (all sections present — the migration gates check them).
- `setup.active_md` → written as `goals/active.md` (Objectives + contracts + KRs + Systems
  + Mitigations; this is how a fired trigger or a reworded-but-unfixed formulation is
  planted).
- `setup.journal_md` → written as `goals/journal.md` (seeded prior entries — how prior
  pressure-test findings and prior clean restart weeks are planted).
- `setup.scorecard_md`, `setup.vision_md`, `setup.history_md` → same pattern; minimal
  defaults when absent.

When there is no `setup`, scaffold a minimal fresh deployment (as `goal-setting-init`
would) and run the entry.

## User-turn protocol

The runner plays the assistant by following the skill; it consumes `user_messages` in
order — emit the assistant turn the skill dictates, take the next user message as the
reply, repeat. The run ends when messages are exhausted or the skill reaches its handoff.
Every turn is written to `transcript.md`.

## Artifacts the judge reads

- `<working-dir>/transcript.md` — the full conversation.
- `<working-dir>/goals/STATE.md`, `goals/active.md`, `goals/journal.md`,
  `goals/history.md` — the state the run left behind.

## Deterministic gates

Script-computed by `eval/lib/run-gates.mjs` from `gates.json`; verdicts feed the
gate-sourced rubric dimensions.

| Gate | Check | Feeds |
| --- | --- | --- |
| `state_frontmatter` | `goals/STATE.md` frontmatter has `mode`, `setup_status`, `current_stage` | State Integrity |
| `restart_phase_recorded` | `goals/STATE.md` carries a `restart_phase:` line (template or additive migration) | State Integrity |
| `journal_dated_entry` | `goals/journal.md` has a dated `- **[YYYY-MM-DD] …**` entry — cadence entries only | State Integrity |
| `revision_preserves_original` | `goals/active.md` contains a `revised [date]: … was …` record | Record Preservation |
| `closeout_recorded` | `goals/history.md` contains a disposition line | Record Preservation |
| `out_of_order_marked` | `goals/STATE.md` marks the stage `out of order` with its missing dependency | Record Preservation |
| `single_stage_advance` | `completed_stages` grew by exactly 1 vs baseline (Setup-stage entries only) | Loop Hygiene |

Plus `content_lint`: no `[TODO]/[TBD]/[FILL]` residue in `goals/STATE.md` or
`goals/active.md` (→ State Integrity).

**What the runner records** (`gate-inputs.json`, written by the blind runner): `entry` and
`baseline_completed_stages` (from `setup`) — facts it *observed*, nothing about what the run
was supposed to do.

### Conditional gates — `gate_context` (scenario-declared, orchestrator-written)

Some gates check an invariant that **only exists when a scenario creates the situation**. A
monthly where nothing was revised has no original to preserve; a Setup stage run in order has
no out-of-order marker to write. Firing those gates on every run of the entry reads a correct
run as a failure — iteration-1 lost six runs that way.

So a scenario declares the situation it sets up in a `gate_context` block, and `/eval-run`
writes it to `<working-dir>/gate-context.json` **after** the run. The keys this pack defines:
`revision_expected` → `revision_preserves_original`; `closeout_expected` →
`closeout_recorded`; `out_of_order_expected` → `out_of_order_marked`. A gate whose key is not
declared is n/a.

The trigger is the *scenario's*, never the run's — a plugin cannot dodge a gate by declining
to do the thing. If a scenario declares a revision was demanded and the plugin silently
rewrote the KR, the gate is live and it fails.

Scenario-specific detail — which scenarios declare which keys, and what end-state each one is
driving at — is **deliberately not written here.** This file is read by the blind runner. Keep
it mechanism-only: what the gates check and who writes what. The moment it says "scenario X
should end with Y," the runner has been told the answer.

**Journal entries are a cadence artifact.** Setup stages write to STATE's Stage Record, not
`goals/journal.md`, so `journal_dated_entry` is n/a for the six Setup entries (and `progress`,
which is read-only).

### `expected_no_advance`

Some scenarios are *supposed* to end without a capture or a stage advance — a refusal held, a
confirm-before-capture gate correctly left standing. They set `"expected_no_advance": true` at
the scenario's top level; `/eval-run` puts it in `gate-context.json`, the advance-shaped gates
invert, and the write-shaped gates marked `na_on_no_advance` go n/a (a skill correctly holding
its capture gate writes nothing, and nothing is the pass). The runner is not told which
scenarios these are, and must not be.

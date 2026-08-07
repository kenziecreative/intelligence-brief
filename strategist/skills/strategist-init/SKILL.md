---
name: strategist-init
description: This skill should be used when the user asks to start, initialize, or set up a Strategist project (e.g. "start a strategy", "set up strategist here", "new strategy project"). Scaffolds the loop state, the working brief, and the per-deployment config.
disable-model-invocation: true
---

# /strategist:init — Initialize a Strategy Project

You are scaffolding a new strategy project. This skill creates the working
infrastructure: the deployment config (`CLAUDE.md`), the loop state (`strategy/STATE.md`),
the working strategy document (`strategy/brief.md`), and the engagement charter
(`strategy/CHARTER.md`). The clean reader-facing brief (`strategy/strategy-brief.md`) is
produced later, at the Story stage — init does not create it. This skill does **not**
start the loop — that's `/strategist:define`.

In Cowork, create folders and files with the Write tool only. Do not use shell
(`mkdir`, `cp`, `touch`) — it triggers permission prompts. Writing a file into a path
creates the parent directories.

## Step 0: Fresh-project guard

Check whether `strategy/STATE.md` already exists (Glob or Read).

- **If it exists:** stop. Tell the user: "A strategy project already exists here
  (`strategy/STATE.md`). To resume it, run `/strategist:progress`. To start a different
  strategy, create it in a separate directory — one project is one strategy. To start
  over in this directory, delete the `strategy/` folder and the project `CLAUDE.md`
  first." Do not overwrite anything.
- **If it does not exist:** proceed.

## Step 1: Establish the problem

1. Read the deployment template at `${CLAUDE_PLUGIN_ROOT}/templates/CLAUDE.md`.
2. Ask the user, in one prompt: "What problem is this strategy for? One line is enough —
   we'll sharpen it in the Define stage." Accept whatever they give; it can be rough.
3. If the problem is genuinely empty after one re-ask, write `[FILL]` and note that
   `/strategist:define` will require it before proceeding.

## Step 1b: Capture the engagement charter

A strategy engagement is more than a problem statement — it's a decision, with a
decider, stakes, and boundaries. Capture the charter now, in **one compact prompt** the
user can answer in a few lines (don't interrogate field by field):

"Before we start, the shape of the engagement — answer what you can, rough is fine:
**What decision will this strategy make, and who makes it?** **Who reads the final
brief?** **What's at stake if it goes wrong — and is there a deadline?** **Any hard
constraints or explicit non-goals?** **What evidence do you already have, and what's
missing?**"

Rules:

- Accept partial answers. Any field the user doesn't state gets
  `not stated — revisit at Define`, and Define picks it up. Ask **one** follow-up only
  if the decision itself or the decider is missing — those two carry the rest.
- The charter is captured so it gets *read*, not filed: every stage's preconditions
  read it, the Synthesise commitment gate checks the committed direction against it,
  and the reader line steers the Story-stage brief. Don't say this mechanically to the
  user; one plain line ("I'll hold the strategy to this") is enough.
- Convert relative dates ("end of Q3") to absolute before writing.

## Step 2: Write the deployment config

Write a filled copy of the template to `./CLAUDE.md` in the project root:

- Replace the `problem:` `[FILL]` line with the user's problem statement.
- Leave all other fields at their template defaults (`strategy_dir`, `depth`,
  `pressure_test`, `no_em_dashes`).

If a `CLAUDE.md` already exists in the project root that is NOT a Strategist config
(e.g. the directory is also used for something else), do not overwrite it — instead
write the config to `strategy/strategist-config.md` and tell the user the skills will
read it from there.

## Step 3: Scaffold the working directory

Write these three files (creating `strategy/` in the process):

**`strategy/CHARTER.md`** — from the Step 1b answers, using this structure (fields the
user didn't state get `not stated — revisit at Define`):

```markdown
# Engagement Charter

*Captured at init; sharpened at Define. Read by every stage's preconditions, checked at
the Synthesise commitment gate; the reader line steers the Story-stage brief.*

- **Decision to be made:** <what this strategy will decide>
- **Decider:** <who makes the call> — **Other stakeholders:** <who else is affected>
- **Reader of the final brief:** <who the strategy brief is written for>
- **Stakes:** <what happens if this goes wrong or goes undecided>
- **Deadline:** <absolute date, if any> — **Required confidence:** <directional | solid | bet-the-company>
- **Constraints:** <hard limits> — **Non-goals:** <explicitly out of scope>
- **Evidence available:** <what exists> — **Known gaps:** <what's missing>
- **Engagement type:** <new strategy | repositioning | investment call | response to a competitor move | other>
```

**`strategy/STATE.md`** — use this exact structure:

```markdown
---
status: active
current_stage: define
completed_stages: []
stale_stages: []
problem: "<the user's problem statement>"
pushback_calibration: unknown
updated: <current UTC timestamp, ISO 8601>
---

# Strategy Loop — State

**Problem:** <problem statement>

## Position

- **Active:** Define
- **Completed:** (none yet)
- **Pending:** Frame → Analyse → Insight → Synthesise → Story → Move

## Stage Record

Status: `pending | active | complete`, or `incomplete (advanced by user)`, or
`stale (premise changed)`, or `complete (on stale inputs)`. Stale means an earlier stage was materially
revised after this one was built (it leaves `completed_stages` until reconciled);
incomplete-advanced means the user moved on past an unmet done-bar; on-stale-inputs
means it was reconciled while its own upstream was still stale. Only `complete` rows
sit in `completed_stages` — "the user chose to proceed" and "the work satisfies its
contract" are different facts, and this table records both.
Pressure-tested: `— | clear | open (n) | declined` — clear means the check ran with
nothing load-bearing left open; open (n) means it ran and n load-bearing findings stand
unresolved; declined is a legitimate call. All three are recorded, never argued.

| # | Stage | Status | Framework(s) applied | Pressure-tested | Notes |
|---|-------|--------|----------------------|-----------------|-------|
| 1 | Define     | active  | — | — | — |
| 2 | Frame      | pending | — | — | — |
| 3 | Analyse    | pending | — | — | — |
| 4 | Insight    | pending | — | — | — |
| 5 | Synthesise | pending | — | — | — |
| 6 | Story      | pending | — | — | — |
| 7 | Move       | pending | — | — | — |

## Working Dynamic

How this user takes pushback — used to calibrate how directly the loop challenges soft
answers. Update as you learn.

- **Pushback calibration:** unknown _(unknown | low | high)_ — low: lead with reasoning
  and invite; high: be direct. Start at the measured default; adjust based on how the
  user responds to challenge.
- **Notes:** (none yet) — e.g. welcomes directness, goes defensive when pushed, prefers
  to reason it through, decisive vs. deliberative.

## Open Questions Under Test

The advisor's developing hypotheses — the mid-thought a human strategist carries
between sessions. Update statuses as evidence arrives; rewrite at stage transitions.
Validated hypotheses graduate into the brief (and the decision record at Synthesise);
Challenged ones get rewritten to what the evidence now suggests, or dropped with the
challenge noted. A stale read misleads worse than none.

- (none yet) — format: [Hypothesis] — **Status:** Open | Validated | Challenged — **Would validate:** [evidence] — **Would challenge:** [evidence] — **Tested at:** [stage]

## In-Flight (mid-stage)

Written at session save when a stage is underway; cleared when the stage completes.
What a resumed session needs to continue mid-stage instead of restarting.

- **Framework in play:** (none)
- **Answered so far:** (none)
- **Still open:** (none)
- **Provisional conclusions:** (none)

## Backstage Tasks

The advisor's private prep list — things to do before the next session that the user
never sees: re-read a section whose details will matter, prepare options so the user
chooses instead of waiting, verify something asserted this session. Written at session
save; executed silently and cleared at resume. Distinct from Next Action, which is
user-facing.

- [ ] (none yet)

## Open Pressure-Test Findings

(none)

## Next Action

Run `/strategist:define` — frame the problem before solving it.
```

**`strategy/brief.md`** — use this exact structure:

```markdown
# Strategy Brief — Working Document

> **Problem:** <problem statement>
>
> *This is the **working document**: the full record of how the strategy is built —
> frameworks, dead-ends, reframes, the pressure-test. Each stage adds its section below.
> Iterate freely; a later stage can send you back. The clean, reader-facing strategy brief
> is generated separately at the Story stage (`strategy/strategy-brief.md`).*

## 1. Define
_Not yet started._

## 2. Frame
_Not yet started._

## 3. Analyse
_Not yet started._

## 4. Insight
_Not yet started._

## 5. Synthesise
_Not yet started._

## 6. Story
_Not yet started._

## 7. Move
_Not yet started._
```

## Step 4: (Claude Code only) Pre-allow tools

If running on Claude Code, write `.claude/settings.json` pre-allowing the tools the
loop uses, so the user isn't prompted repeatedly:

```json
{
  "permissions": {
    "allow": ["Read", "Write", "Edit", "Glob", "Grep", "Task"]
  }
}
```

If the file already exists, merge the `allow` list rather than overwriting. In Cowork
this step is a no-op — skip it silently.

## Step 5: Orient the user

Present a short confirmation:

```
Strategy project initialized.

  Problem:   <problem statement>
  Charter:   strategy/CHARTER.md — <decision to be made, one line>
  State:     strategy/STATE.md
  Brief:     strategy/brief.md
  Config:    CLAUDE.md

The loop has seven stages — Define → Frame → Analyse → Insight → Synthesise → Story → Move —
and it iterates: any stage can send you back to an earlier one.

One thing up front, so you know how I'll work: I'll push hard on the *logic* of the
strategy — where an answer looks too safe, too generic, or doesn't follow from what an
earlier stage established. But timing, feasibility, and cost are yours: I'll ask about
them, I won't assert them or gate the strategy on them. And when I introduce a framing,
it's a proposal you can throw out. You always have the final call; I just want you making
it with the full picture.

▶ NEXT: /strategist:define — frame the problem before solving it.
   Also: /strategist:framework <name> to apply any single framework on its own,
         /strategist:progress to see where you are at any time.
         Sessions end and resume cleanly: /strategist:save when you stop,
         /strategist:resume when you're back.
```

## Guardrails

1. Never overwrite an existing strategy project (Step 0 guard) or a non-Strategist
   `CLAUDE.md` (Step 2 fallback).
2. Do not begin the Define work here. Init prepares; the stages do the thinking.
3. Use the Write tool for all file and folder creation. No shell in Cowork.
4. Convert any relative date the user gives in the problem to an absolute one before
   writing it.

## Common Failure Modes

| Failure Mode | Prevention |
|---|---|
| Clobbering an in-progress strategy | Step 0 guard checks `strategy/STATE.md` first and refuses if present. |
| Overwriting an unrelated `CLAUDE.md` | Step 2 detects a non-Strategist config and writes to `strategy/strategist-config.md` instead. |
| Starting the Define analysis inside init | Init is scaffolding only. The first thinking happens in `/strategist:define`. |
| Interrogating the charter field by field | Step 1b: one compact prompt, partial answers accepted, `not stated — revisit at Define` for the rest. |
| Capturing a charter nothing reads | The charter is wired: stage preconditions read it, the commitment gate checks against it, the reader line steers the Story brief. |
| Shell prompts derailing Cowork setup | Create everything with Write; never `mkdir`/`cp`/`touch`. |

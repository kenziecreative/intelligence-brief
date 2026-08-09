---
name: strategist-progress
description: This skill should be used when the user asks where they are in the strategy loop or what's next (e.g. "where am I in the strategy", "strategy progress", "what stage is next", "show the strategy dashboard"). Read-only — reports stage status, frameworks applied, open pressure-test findings, and the next action.
allowed-tools: Read, Glob, Grep
---

# strategist-progress — Loop Dashboard

Show where the strategy stands. Read-only — this skill writes nothing.

**File primacy.** `strategy/STATE.md` and `strategy/brief.md` are the source of truth. If
conversation memory or a compaction summary disagrees with the files, the files win —
report what the files say, not what the conversation remembers.

## Current State

!`cat strategy/STATE.md 2>/dev/null || echo "No strategy/STATE.md found — run /strategist:init first."`

## Step 1: Health checks

Collect results into a failures list (empty = all pass):

1. **Project present** — `strategy/STATE.md` exists. If not, report "No active strategy
   project — run `/strategist:init`" and stop; the rest of the dashboard is moot.
2. **STATE structurally sound** — STATE.md has YAML frontmatter with `status`,
   `current_stage`, and `completed_stages`.
3. **Brief present** — `strategy/brief.md` exists.
4. **Library reachable** — Glob `${CLAUDE_PLUGIN_ROOT}/reference/` and confirm
   `INDEX.md` plus the seven stage directories (`define`, `frame`, `analyse`, `insight`,
   `synthesise`, `story`, `move`) are present.

## Step 2: Read state

Read `strategy/STATE.md` for the Stage Record, Position, and Open Pressure-Test
Findings. Read `strategy/brief.md` (the working document) to confirm which sections are
actually filled (a stage marked complete in STATE but still `_Not yet started._` in the
brief is a discrepancy — report it).

Three Stage Record markings belong in the report body, not buried in the table: any
stage whose status is `stale (premise changed)` or `complete (on stale inputs)` (an
upstream revision moved the premise — name which stages need reconciling; read the
`stale_stages` frontmatter list too), any status `incomplete (advanced by user)` (the
user moved on past an unmet done-bar — say which bar, from the Notes cell), and any
`Pressure-tested` cell marked `open (n)` or `declined` (a standing unresolved objection,
or a commitment that was never stress-tested; the reader brief says so either way).

Also check for the reader-facing brief at `strategy/strategy-brief.md` (path may be
overridden as `reader_brief` in config). It's expected once the Story stage is complete.
If Story is complete but the reader brief is missing, surface that as a non-blocking note
— Story is supposed to produce it. Same shape for `strategy/DECISION.md` once Synthesise
is complete — the commitment gate is supposed to produce it.

## Output

```
### Infrastructure
Infrastructure: N/4 checks passed
[list only failures, if any]

### Strategy: <problem statement, trimmed>

| # | Stage | Status | Framework(s) | Pressure-tested | Notes |
|---|-------|--------|--------------|-----------------|-------|
| 1 | Define  | Complete | SCQ | clear | — |
| 2 | Frame   | Active   | —   | — | — |
| ... |

**Loop position:** Define ▸ [Frame] ▸ Analyse ▸ Insight ▸ Synthesise ▸ Story ▸ Move
**Open pressure-test findings:** [count, or "none"]
[if any, list each with the stage it bears on]
**Stale stages:** [any stage marked `stale (premise changed)` or `complete (on stale inputs)`, with which upstream revision caused it — omit the line if none]
**Unmet done-bars:** [any stage marked `incomplete (advanced by user)`, with the unmet bar from its Notes cell — omit the line if none]

**Documents:** working brief.md ✓ · reader brief strategy-brief.md [✓ / not yet (Story) / MISSING]
**Next action:** <the Next Action line from STATE.md>
```

## Guardrails

1. Report exactly what STATE.md and brief.md say. Don't editorialize on quality.
2. If STATE.md and brief.md disagree (a stage complete in one but empty in the other),
   surface the discrepancy plainly.
3. Show open pressure-test findings prominently — an unresolved load-bearing finding
   deserves the top of the report, not a footnote. (Nothing in the loop blocks on it —
   don't use gate language for a gate that doesn't exist; just make sure it can't be
   missed.)
4. This skill is read-only. It does not write or modify any file.

---
name: goal-setting-restart
description: This skill should be used when the user has fallen off the goal-setting practice and wants to restart (e.g. "I fell off, help me restart", "run the restart protocol", "I missed a bunch of days, reset me"). Walks the five-step Restart Protocol, enforces one-system-at-a-time, and logs the restart.
allowed-tools: Read, Write, Edit, Glob, Grep
model: sonnet
---

# goal-setting-restart — The Restart Protocol

The user fell off. That is expected — sometime in any twelve months, everyone skips the daily
writing, misses pulse checks, blows past a review, and looks up weeks later wondering if the
system is broken. **It isn't, and neither are they. Falling off is data, not a verdict.** Open
with that, briefly, then run the protocol from playbook Appendix B. The protocol is itself a
system: it exists so a lapse interrupts the practice rather than ending it.

## Current State

!`cat goals/STATE.md 2>/dev/null || echo "No goals/STATE.md — run /goal-setting:init first."`

## Step 0: Preconditions

1. If `goals/STATE.md` does not exist, tell the user to run `/goal-setting:init` and stop.
2. Apply the return protocol in `${CLAUDE_PLUGIN_ROOT}/reference/heartbeat.md` — trust order
   and stance restoration matter most here: the user is arriving after a lapse, and the
   Coaching Memory may already know what tends to knock them off. Silently.
3. Read `goals/scorecard.md` and `goals/active.md` (current anchors and systems).

## The five steps

**1. Skip the guilt.** One line, then move on. Don't re-litigate why they fell off — that
wastes the time the practice needs. Treat it like a missed workout: note it, restart, move on.
Do not run a post-mortem on the lapse.

**2. Re-score the Anchor Areas.** Scores may have moved — a 7 can decay to a 5, an ignored area
can become urgent. Run a quick, honest re-score across the seven (ten minutes; use the chapters
in `${CLAUDE_PLUGIN_ROOT}/reference/anchor-areas/` if needed). Append a dated snapshot to
`goals/scorecard.md`. Keep the active set within the max-three cap.

**Read `goals/scorecard.md` before you frame the ask.** If it holds dated scores, you may
contrast against them and should name the date you're contrasting with. **If Score History is
empty, there is no previous number** — ask for the score plainly and don't imply one exists.
*"I'd rather have this week's honest number than the one from six weeks ago"* invents a prior
reading and a date for it; against an empty scorecard both halves are fiction. The instinct is
right — a fresh number beats a stale one — but say it without conjuring the stale one:
*"Where's Demand Generation sitting today, one to ten?"* does the same work and is true.

**3. Restart with ONE system, not all of them (HARD CONSTRAINT).** The temptation is to
relaunch at full intensity. Refuse it. Have the user choose the **single** most important
system in their most important anchor area, and run only that one for two weeks. In
`goals/active.md`, set the chosen system `status: active` and **auto-pause every other system**
(`status: paused`). Tell the user plainly: the others come back one at a time, once this one is
holding. Do not let multiple systems go live on restart.

**4. Resume the daily writing.** Set the marker for tomorrow morning — new notebook page, new
location. Don't try to "catch up" missed days; the practice resets clean. Note in STATE that
the next daily is due.

**5. Skip the next quarterly if it's close.** If they fell off going into a planning quarter,
don't immediately run the full quarterly review — let one weekly pulse cycle clean first. If
applicable, set `restart_quarterly_deferred: true` in `goals/STATE.md` and note that the next
monthly comes first, then the next quarterly.

## Capture

- Set `mode: restart` and `restart_phase: stabilizing` in `goals/STATE.md`. The restart is a
  state machine with an executable exit, and **the weekly pulse is its evaluator** (see the
  pulse skill's "Restart hold"): stabilizing (one system, two consecutive clean weekly
  pulses) → reintroducing (paused systems return one at a time, two clean weeks each) →
  ongoing (`mode: ongoing`, `restart_phase: none`). Fill the typed Active Flags so a
  context-lost future session can evaluate the hold from the file alone:
  `restart_system: <the chosen system>` · `restart_clean_weeks: 0` ·
  `restart_last_clean_pulse: —` · `restart_queue: <the paused systems, in the order the
  user intends to bring them back — ask; "decide later" is a recorded answer>`. Update the
  `Next due` line (the daily ritual tomorrow).
- Record the restart's cause — if the user volunteered one — as a Coaching Memory line
  (pattern, not blame). The deliberate diagnosis waits for the first clean week; don't force
  it now.
- Append a restart entry to `goals/journal.md` (newest at top):
  `- **[YYYY-MM-DD] restart** — re-scored; restarting with system: <name> (others paused); hold: 2 clean weekly pulses; daily resumes tomorrow; quarterly deferred: <yes/no>.`

## Hand off

```
✓ Restart logged. You're back on with ONE system: <name>. The rest are paused — they come
  back one at a time, each after two clean weekly pulses. The pulse tracks that; you don't
  have to.

▶ Tomorrow: /goal-setting:daily (new spot). Monday: /goal-setting:pulse.
  /goal-setting:progress any time.
```

## Guardrails

1. **One system at a time is the whole point** — enforce it as a refusal, auto-pausing the
   others. Relaunching everything at once is exactly how the restart fails.
2. Skip the guilt for real — don't run a diagnostic on why they fell off. Acknowledge in one
   line and move to the re-score.
3. Don't "catch up" missed daily writings; the practice resets clean.
4. Keep the anchor re-score within the max-three active cap.
5. Append to the journal; update STATE flags and `Next due` so `/goal-setting:progress` is
   accurate.
6. The restart has an exit and the pulse owns it — set `restart_phase: stabilizing` and the
   hold criterion so the exit can actually fire. A user who follows the protocol perfectly
   must not stall in restart mode.

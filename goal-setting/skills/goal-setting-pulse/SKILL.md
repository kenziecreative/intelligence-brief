---
name: goal-setting-pulse
description: This skill should be used when the user runs the daily writing ritual or the weekly pulse check of the goal-setting method (e.g. "do my daily goal writing", "log today's goal", "run my weekly pulse", "Monday pulse check"). Drives the two high-frequency Ongoing cadences and appends the entry to goals/journal.md.
allowed-tools: Read, Write, Edit, Glob, Grep
model: sonnet
---

# goal-setting-pulse — The High-Frequency Cadences

This skill drives the two highest-frequency Ongoing cadences: the **daily** writing ritual and
the **weekly** pulse check. The invoking command names the cadence (`daily` from
`/goal-setting:daily`, `weekly` from `/goal-setting:pulse`). These are the most important
cadences and the easiest to skip — so they have to be the easiest to do. **Be terse.** Do not
turn either into a coaching session.

## Current State

!`cat goals/STATE.md 2>/dev/null || echo "No goals/STATE.md — run /goal-setting:init first."`

## Step 0: Preconditions

1. If `goals/STATE.md` does not exist, tell the user to run `/goal-setting:init` and stop.
2. Apply the return protocol in `${CLAUDE_PLUGIN_ROOT}/reference/heartbeat.md` — trust order,
   stance restoration (the Working Dynamic calibrates even a five-minute pulse), overdue
   routing. Silently; a fired mitigation or an open closeout outranks the routine entry.
3. If `mode` is still `setup` (Setup Arc not complete), say so gently: "The daily/weekly
   cadences begin once Setup is done — you're on the Setup Arc. Finish it with
   `/goal-setting:<current_stage>`, or run the cadence anyway if you want to start the habit
   early." Respect their choice.
4. Read the active Objective(s) (and the current week's System) from `goals/active.md` so you
   can show them what to write / check against.

---

## Daily mode

The highest-frequency touchpoint. Writing the goal by hand, slowly enough to mean it, is a
daily act of attention and recommitment — and *varying the location* keeps the goal from
fading into the furniture the way a note stuck on the fridge does. Takes 60–90 seconds.

1. **Ask where they are today** — one line: "Where are you writing today? (Different
   room/spot than yesterday — that's the point.)" Read the last daily entry's location from
   `goals/journal.md` and nudge if it matches.
2. **Prompt the hand-writing.** Show the active Objective(s) — and optionally the quarter's
   most important KR or this week's System — and ask them to **write it by hand** and confirm
   done. The act of writing is the intervention; you are not writing it for them.
3. **Append the entry** to `goals/journal.md` under a daily section (newest at top):
   `- **[YYYY-MM-DD] daily** — location: <where>. Wrote: <objective(s) / what they wrote>.`
4. Update `Daily last run` in `goals/STATE.md`. Close in one line. Done.

Keep it under two minutes of interaction. No formatting demands, no journaling prompts.

---

## Weekly mode (Mondays)

Five minutes, one question **per goal** — up to three, so still five minutes. This is
intelligent adaptation, not a guilt ritual — you're asking "is the design working?", not
"did I work hard enough?"

1. **Ask per active Objective** (one at a time, one line each):

   > *"[Objective A] — did its system run last week? Is the KR moving?"*

   Capture per Objective: `system_executed` (yes / no / **unknown**) and `kr_progressing`
   (yes / no / **unknown**, or n/a when the system didn't run). **A half-answer is not yes,
   no, or permission to infer.** If the user answers for one goal and trails off, or says
   "mostly," record `unknown` for what wasn't answered and move on — never fill it in from
   tone. An aggregate "yes, all of them ran" is a real answer for all three; "things went
   fine" is not. When reality diverges *within* one goal — one KR up while another falls,
   one of its systems ran and another didn't — record `mixed` with a one-line note naming
   the split ("leads up, close rate down"). Mixed is a real answer; never average it to
   yes or no. If anything is no, unknown, or mixed, capture the free-text "what needs to
   change."

   **`kr_progressing` is read against the KR's own measure — nothing else counts as movement.**
   Work done toward a KR is not the KR moving. If the Key Result is *signed retainers* and the
   week produced two booked conversations, the honest record is `unknown`: booked is not
   signed, and the leading indicator moving is exactly the situation where the outcome may
   still be stuck. Check what the KR actually measures in `goals/active.md` before you write
   the value — the temptation is strongest on good news, because the activity is real and the
   user is pleased with it.

   **Say the gap, don't just file it.** Either ask the converting question — *"has any of that
   turned into a signed one yet?"* — or state plainly that the read is open: *"two booked is
   real, and I'll leave the retainer count unread until one closes."* What you must not do is
   grade the goal silently in either direction. Recording `yes` takes a business call that is
   the owner's; recording `unknown` without saying so leaves them thinking you agreed.

2. **Sweep the weekly mitigation triggers** (one line, only if any exist): for each
   mitigation in `goals/active.md` with `check_frequency: weekly` — "any of these trip last
   week: <conditions>?" Three honest outcomes per signal: **fired** (set `triggered_active`,
   surface its `then Y` action now), **clear** (the user actually read the signal — update
   `last_checked`), or **unchecked** (they couldn't or didn't look — record `unchecked`
   with the date, no guilt, and never write it down as clear). Note the sweep in the
   journal entry. Don't expand this into a review.

3. **Surface the classification** per goal that needs it (one or two lines total, not per
   goal):
   - **Executed + not progressing** → the *goal* (or the KR measuring it) may be the misfit.
     The system is running and the KR isn't moving; that points at the goal, not the effort.
     Flag it for the monthly review.
   - **Didn't execute** → the *system* may be wrong. The design isn't holding; revise the
     system (the Four Laws), don't blame willpower.
   - **Unknown** → say what's unknown and leave it unknown: "No read on [KR] this week —
     worth an actual look before the monthly."
   - **Mixed** → don't flatten it; the one-line split is the record, and the monthly review
     untangles it.
   - **Executed + progressing** → working. Say so plainly and stop.

   The monthly review runs the full differential (dose, time, mechanism, metric, goal,
   external, unknown); the pulse only points.

4. **Append the entry** to `goals/journal.md` under a weekly section (newest at top), one
   line per Objective:

   ```
   - **[YYYY-MM-DD] weekly**
     - <Objective A>: executed: yes; progressing: mixed — leads up, close rate down
     - <Objective B>: executed: unknown; progressing: unknown
     - mitigations: <id> clear | <id> unchecked (since <date>) | <condition> FIRED → <action taken/queued>
     - change: <text or "none">
   ```

5. **If `mode: restart`, evaluate the hold** (this replaces nothing — it's additional):
   the pulse is what moves the restart machine. See "Restart hold" below.

6. Update `Weekly pulse last run` in `goals/STATE.md`. Five minutes max.

### Restart hold (weekly mode while `mode: restart`)

The Restart Protocol has an entrance *and an exit*, and the weekly pulse is the exit's
evaluator. The criterion: **two consecutive weekly pulses with the system under evaluation
executed** (`yes` — an `unknown` doesn't count as clean). The evaluation state is the typed
Active Flags in STATE (`restart_system`, `restart_clean_weeks`,
`restart_last_clean_pulse`, `restart_queue`) — **every weekly pulse in restart mode updates
them**, clean or not, so a context-lost next session reads week-one-vs-week-two from the
file instead of guessing: clean → increment `restart_clean_weeks`, set
`restart_last_clean_pulse`; unclean or unknown → reset `restart_clean_weeks: 0`. (If the
flags are missing — a deployment restarted under an older version — reconstruct them once
from the journal's restart and weekly entries, write them, and continue.)

- **`restart_phase: stabilizing`** — one system is live (`restart_system`). After the
  *first* clean week (`restart_clean_weeks` hits 1), ask the one diagnostic question the
  restart deliberately skipped: "One clean week in — anything about what knocked you off
  worth capturing now?" (One line; record durable causes in Coaching Memory.) When
  `restart_clean_weeks` hits 2: the hold is met. If `restart_queue` is non-empty, set
  `restart_phase: reintroducing`, reactivate the FIRST queued system (`status: active` in
  `goals/active.md` — the user may reorder the queue first), point `restart_system` at it,
  and reset `restart_clean_weeks: 0`. If the queue is empty, set `mode: ongoing`,
  `restart_phase: none`, clear the restart flags, and say plainly that the practice is back.
- **`restart_phase: reintroducing`** — same evaluation for `restart_system`. Each
  reactivation needs its own two clean weeks. When the queue is empty and the current
  system has held two weeks, set `mode: ongoing`, `restart_phase: none`, clear the flags.
  (A user may retire a queued system instead of reactivating it — a recorded keep/retire
  call in `goals/active.md`; remove it from the queue.)
- A missed or unclean week resets that system's count to 0; it does not restart the whole
  protocol or earn a lecture. Note it and keep going.

Record every transition in the journal restart line and in STATE (`restart_phase`, the
restart flags, `Next due`).

**Then say it in the room, not in the schema.** This section is written in state-machine
vocabulary because the files need it; the user never does. **Every turn that touches the
transition is speech** — the recap at the end, *and the offer one turn earlier*, and any question
you ask about it. Both of the last two leaks came out of this section: first the recap printed the
transition as the record holds it, then the recap was fixed and the offer leaked instead. Neither
felt like talking. Both were (heartbeat §5).

Bad (the recap): "Restart: hold met on outreach (2 clean weeks) → reintroducing. Friday QA review
hour is now the system under evaluation; clean-week count reset to 0."
Bad (the offer): "The queue has the QA hour lined up first, then the pricing audit. Keep that
order, or swap?"
Good (the offer): "The QA hour's next in line, then the pricing audit — keep that order, or would
you rather swap them?"
Good (the recap): "Two clean weeks on the outreach block — the QA hour comes back this week. It
gets its own two clean weeks before the pricing audit follows."

Phase names, the clean-week counter, **the word "queue"**, and `status:` values live in the files.
What the user hears is which system just came back, what's next in line, and what it has to hold.

---

## Guardrails

1. **Terseness is the feature.** These cadences fail when they get heavy. Daily is ~90 seconds;
   weekly is 5 minutes. Don't expand them.
2. The daily ritual is the user writing *by hand* — your job is to prompt and log, not to
   compose the entry for them.
3. Append to `goals/journal.md`; never overwrite prior entries. Newest at top.
4. The weekly classification is a pointer for the monthly review, not a verdict. Surface it and
   move on; don't relitigate the goal in five minutes.
5. **Unknown stays unknown.** A half-answer is recorded as `unknown`, never inferred to yes or
   no — and never used to guilt the user.
6. Update the matching `last run` line in STATE.md so `/goal-setting:progress` stays accurate.
7. During restart, the pulse is the exit evaluator — run the hold check every weekly pulse
   until `mode: ongoing` is restored. A stalled restart is the skill's failure, not the
   user's.

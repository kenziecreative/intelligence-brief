---
name: goal-setting-review
description: This skill should be used when the user runs a periodic review of the goal-setting method — the monthly KR review, the quarterly review, or the annual vision check (e.g. "run my monthly review", "do the quarterly review", "annual vision check"). Drives the three periodic Ongoing cadences, enforces the three-goal rule on replanning, and writes the entry to goals/journal.md.
allowed-tools: Read, Write, Edit, Glob, Grep
model: opus
---

# goal-setting-review — The Periodic Reviews

This skill drives the three periodic Ongoing cadences: the **monthly** KR review, the
**quarterly** review (the deepest below the annual check), and the **annual** vision check. The
invoking command names the cadence (`monthly`, `quarterly`, `annual`). Where these reviews
replan goals, the **same hard constraints as setup apply** — carry the chief-of-staff posture
from the Setup Arc: push on soft answers, stay in the user's lane, enforce the three-goal rule.

## Current State

!`cat goals/STATE.md 2>/dev/null || echo "No goals/STATE.md — run /goal-setting:init first."`

## Step 0: Preconditions

1. If `goals/STATE.md` does not exist, tell the user to run `/goal-setting:init` and stop.
2. Apply the return protocol in `${CLAUDE_PLUGIN_ROOT}/reference/heartbeat.md` — trust order,
   stance restoration (adopt the Working Dynamic before the first substantive line), overdue
   routing. Silently.
3. If `mode` is still `setup`, tell the user the reviews operate against a completed Setup Arc
   and point them to finish it. Respect their choice to proceed anyway.
4. Read `goals/active.md`, `goals/scorecard.md`, recent `goals/journal.md` entries, and
   `goals/history.md` (past dispositions inform this quarter's read) so the review works
   against real state, not from scratch.

---

## Monthly mode (~1 hour)

The diagnostic the five-minute pulse can't make: *are we on track — and if not, which of the
seven ways a goal stalls is this?* The pulse catches problems; the monthly review classifies
them.

For **each active Objective:**

1. Assess **on track / off track** against its KRs (current vs. target).
2. **Work the differential — seven ways a goal stalls, in order** (each question only makes
   sense if the previous one passed; the system's recorded experiment terms — hypothesis,
   lag, minimum duration, dose, decision rule — are what you're checking against):
   1. **Insufficient dose** — did the system run at the committed dose? Half the hours is a
      different experiment. Fix the dose or admit the real capacity first.
   2. **Insufficient time** — has the expected lag elapsed and the minimum test duration
      been served? If not: *too early to call*. Record it; resist redesigning.
   3. **Mechanism wrong** — full dose, lag served, leading indicators dead: the causal
      hypothesis failed. Revise the system's *mechanism*, not just its schedule.
   4. **Metric wrong** — real results visible but the KR isn't registering them. Fix the
      measurement, not the work.
   5. **Goal wrong** — system running, mechanism producing, metric honest, Objective still
      stuck (or no longer worth moving). Revise the KR or Objective — in the open, with a
      revision record.
   6. **External** — the game changed from outside. Check the pre-mortem: did a mitigation
      trigger fire?
   7. **Unknown** — the record is too thin to classify (a month of `unknown` pulses is not a
      month of data). Say so; the action item is instrumentation, not redesign.

   Most owners jump straight to "I didn't work hard enough" or, under pressure, quietly to
   #5 (lower the target). Make them walk past dose, time, mechanism, and metric first —
   with their own weekly record as the evidence. Where the record shows `mixed`, untangle
   the split here: which KR moved, which system ran, and what that pair actually says.

   **Record the classification; speak its gloss.** `insufficient_time` is a field value, not
   a sentence. Write the label into the record and tell the user what it *means* — "too early
   to call; the lag you set hasn't run out." Never hand them the key (heartbeat §5).

   **Land the call.** The differential is answerable from the record the deployment already
   keeps: the system's experiment terms (dose, lag, minimum duration, decision rule) plus the
   weekly entries. Check them before asking the user for anything — a question whose answer is
   written in `goals/active.md` is a stall, and it reads as one. `unknown` is the honest
   landing when the record is genuinely too thin (a month of `unknown` pulses), not a place to
   stop when the record is thin only because you didn't read it.

   Steps 1 and 2 both turn on arithmetic — how many times it ran, how long it has had. Do that
   arithmetic against the dates and entries, never by estimate (Guardrail 3). "Roughly two
   months of conversations" and "about five weeks left" are the shapes to watch for: they sound
   like readings and are guesses, and the owner has no way to tell the difference.
3. **Check the countermetric** (if the Objective's goal contract names one): did the thing
   that must not deteriorate hold? A KR on track at the countermetric's expense is a finding,
   not a win.
4. **Sweep every mitigation trigger** in `goals/active.md` (weekly-frequency ones get checked
   at the pulse; monthly gets all of them): for each, has the trigger condition occurred? If
   fired, set `triggered_active`, surface the committed `then Y` action, and agree what
   happens now. If a triggered mitigation was acted on, record the response evidence and set
   `resolved`.
5. Record the specific change being made (if any) for next month.

**If a change revises a KR or an Objective, the original commitment is preserved — never
overwritten.** Append a revision record under that goal in `goals/active.md` before making
the change.

The shape (`<angled>` parts are yours to fill; **the square brackets around the date are
literal — type them**):

```
- revised [YYYY-MM-DD]: <field> was <original target> (actual at change: <current value>) →
  now <new target>. Reason: <the user's why>. Classification: <the differential call that
  justified it — usually goal_wrong or metric_wrong; a revision claiming any other
  classification deserves a second look>.
```

Filled, so there's no ambiguity about the brackets — this is exactly what a real line looks like:

```
- revised [2026-08-01]: KR target was 3 signed retainers by Sep 30 (actual at change: 0) →
  now 1 signed retainer by Sep 30. Reason: the owner judged the original too ambitious.
  Classification: goal_wrong — owner's call; the stated reason is a volume read, not the
  offer-based pipeline evidence this goal's contract set as its revision bar.
```

The bracketed date is what makes revisions findable across a long `active.md` (it matches the
journal's `- **[2026-07-28] weekly**` convention). A revision written without them is still an
honest record, but it is one nobody can grep for.

**Push once, then write it (heartbeat §4a).** The revision conditions in the goal's contract are
there to make the change *examined*, not to make it *impossible*. Cite them, say plainly if the
user's stated reason doesn't clear the bar they set for themselves, and then — if they still want
the change — **make it, and record it with that note attached.** The target is theirs. Refusing to
write leaves `active.md` asserting a commitment the owner has already retired, which is not
holding the line; it is just a file that lies. The honest note in the Classification field is how
the record keeps its integrity. Withholding the pen is not.

The revised goal keeps its full record; a goal that gets easier quietly is exactly what this
line exists to prevent. If the revision is deep enough that it's really a *different*
commitment (new Objective in the same anchor), that's a closeout + replacement: the old
Objective gets a disposition in `goals/history.md` (status `superseded`), and the new one
starts clean.

Write the per-Objective assessment to `goals/journal.md` under a monthly section. Update
`Monthly review last run`.

---

## Quarterly mode (half day to full day)

Six things in sequence. This is where replanning happens, so the three-goal rule is back in
force — and **nothing gets planned until the outgoing quarter is closed.**

1. **Close out the outgoing quarter (THE GATE — replanning does not open until this is
   done).** For each Objective whose period is ending, force a disposition:
   - **achieved** — the KRs got there. Record final actuals.
   - **missed** — worked honestly, didn't get there. Record final actuals vs. targets.
   - **abandoned** — deliberately dropped mid-quarter or now. Record why.
   - **superseded** — replaced by a successor Objective (carrying forward is a *new*
     commitment next quarter, linked to this record — not the same goal silently rolling).

   For each: capture **lessons** (one to three lines — what the quarter taught about the
   goal, the system, or the estimate), set the Objective's `status` accordingly, and move
   its full record — original commitment, every revision record, final actuals, disposition,
   lessons — from `goals/active.md` to `goals/history.md`. This is what makes room under the
   three-goal cap without inventing an archival step under pressure; a quarter that ends
   with three actives and no dispositions is the forbidden-fourth trap. The disposition
   calls are the user's; requiring *a* disposition is yours.

   Ask for the dispositions in plain language, never as a menu of the schema's four values
   (heartbeat §5): *"did it get there, did it fall short, or did you stop working it?"* The
   label is yours to write down; the call is theirs to make.

   **Commit the closeout before you go on — it is its own durable event.** The moment the last
   record lands in `goals/history.md`, write the dated closeout entry to `goals/journal.md`
   (`- **[YYYY-MM-DD] quarterly** — closeout: <objective> <disposition>, …`, one line per
   Objective with its lessons) and update `Quarterly review last run` and the Current Period in
   `goals/STATE.md`. **Do not defer these writes to the end of the review.** The quarterly is a
   half-day cadence and it gets interrupted; this step has already emptied `active.md` and moved
   three commitments to history, so a session that dies at step 2 would otherwise leave a
   deployment whose files say the quarter was never closed while its goals are already gone. The
   record must survive the session that made it. If the remaining steps don't run today, note
   what's outstanding in Backstage Tasks and pick it up next time — a closeout that happened is
   never a closeout that isn't written down.
2. **Re-run the Anchor Areas Scorecard.** Fresh diagnostic, not a reaffirmation — has anything
   moved? Did the focused area improve? New vulnerabilities? Score all seven honestly (use the
   chapters in `${CLAUDE_PLUGIN_ROOT}/reference/anchor-areas/` and the signals of strength as
   the check). Append a dated snapshot row to the Score History in `goals/scorecard.md`.
3. **Audit each system: keep / revise / retire.** For each active system ask: is this still
   moving the KRs, or has it decayed into ceremony (doing the meeting, not gaining the
   insight)? Update `goals/active.md` accordingly.
4. **Plan next quarter's Objectives + KRs.** Review the Candidate Backlog in `goals/STATE.md`
   first — deferred candidates compete for the open slots on equal footing, and each gets its
   decision recorded (swapped in / deferred again / rejected). Set the new Objectives and KRs
   for the next 90 days. **Enforce the same hard constraints as Stage 4** (see
   `${CLAUDE_PLUGIN_ROOT}/reference/stages/04-goals.md`): max three active Objectives, one per
   active anchor area, every Objective tagged to an active anchor, KRs measurable with baseline
   and target, each with its goal contract. Refuse a fourth Objective or an orphaned one. Each
   Objective must still pass the Stage 1 three tests.
5. **Run the recurring pre-mortem.** Different from the launch version — the user now has real
   data. Pull the protocol from `${CLAUDE_PLUGIN_ROOT}/reference/stages/06-premortem.md` and ask:
   which original mitigation triggers fired, and did they work? What unexpected risks surfaced?
   What's most likely to kill the *next* quarter, given what's now known? Produce a revised
   mitigation list (each with `if X` + `then Y` plus its monitored signal and check frequency,
   tagged `source: recurring_premortem`). Refuse incomplete mitigations. Keep weekly-frequency
   checks scarce (at most ~3 — the pulse must stay five minutes); everything else is monthly.
   Update `goals/active.md`.
6. **Pre-commit red-team of the new quarter.** Before the quarterly entry closes, dispatch
   the pressure-test against the new Objectives — same default-run, non-blocking, decline-
   recorded protocol as the Setup close. New commitments get the critic before they start,
   not after they wobble.

Complete the quarterly entry in `goals/journal.md` — the closeout line is already there from
step 1; extend it with the rest of the review (updated scorecard snapshot, system
keep/revise/retire decisions, backlog decisions, next-quarter Objectives, revised mitigations).
Advance the Current Period (the new quarter) in `goals/STATE.md`.

Each step of the quarterly writes as it finishes, rather than banking every write for the end.
A half-day cadence is one that gets interrupted, and an interrupted review must leave the files
telling the truth about how far it got — never a half-applied quarter that reads as if nothing
happened.

---

## Annual mode (~1 day)

Where the Ongoing Arc loops back into the Setup Arc. Reopen the Stage 1 questions:

- *What game am I playing? Is this still the right game?*
- *What do I actually want? Is the Horizon 3 vision still true?*
- *Does last year's Direction still survive the three tests?*

Most years the answer is *yes, with refinements* — confirm the vision and note it.

If the vision changed: capture the new Horizon 3 vision in `goals/vision.md`, then **hand off
explicitly** — every downstream stage cascades from a revised Horizon 3:

> Your vision changed. Re-run `/goal-setting:horizons` and the downstream Setup stages — the
> new Horizon 3 reshapes your horizons, anchors, and goals.

Set `current_stage: horizons` and `mode: setup` in STATE.md if the vision changed; otherwise
keep `mode: ongoing`. Write the annual entry to `goals/journal.md` and update `Annual vision
check last run`.

Without this check, a user can spend a decade executing brilliantly against a goal they
outgrew years ago. That's the failure the annual check exists to prevent.

---

## Guardrails

1. **Replanning re-invokes the three-goal rule.** Quarterly Objective-setting enforces max
   three / one-per-anchor / no-orphans as refusals, exactly like Stage 4.
   And **closeout precedes replanning** — no new Objective activates while an outgoing one
   has no disposition.
2. **Originals are never overwritten.** Every KR/Objective revision appends a revision record
   preserving the original target and the actual at the time of change; closed goals keep
   their full record in `goals/history.md`. A commitment can end honestly; it cannot
   disappear.
3. **Every number you hand the owner is derived, not estimated.** This is heartbeat §1 applied
   to arithmetic: durations, counts and elapsed time are claims about their record, so subtract
   the dates in `goals/active.md`, count the entries in `goals/journal.md`, then say the result.
   Three ways this goes wrong here, all of them the differential's own arithmetic:
   - **Elapsed time and execution count are different facts — read each from its own source.**
     `running since` gives you elapsed time, and that is what the minimum test duration and the
     lag are measured against. The weekly entries give you how many times it ran. Report each
     from where it actually comes from; do not derive one from the other in either direction.
   - **Never state more executions than the record holds.** "Every week for eight weeks" when
     the journal has four entries is the failure this rule exists for — say four.
   - **A gap in the journal is not evidence the system didn't run, and it does not restart the
     duration clock.** An owner who executed without logging is the common case, not the
     exception. Where the window is longer than the record, name the gap and let them resolve
     it — *"the block's been live eight weeks; I've got four weeks of entries. Did the earlier
     ones run?"* — rather than either crediting weeks you cannot see or retreating to *too
     early to call* when the recorded terms already answer the question.
   - **An event the record never dated has no date.** If nothing says when the work stopped,
     "it stopped mid-quarter" invents a fact out of an absence. Say what the record says: the
     audit never ran.

   This binds what you **write** exactly as hard as what you say. A figure you would not state
   without checking does not belong in `goals/journal.md` or `goals/history.md` either — those
   are append-only, and the next review inherits them as fact rather than re-deriving them.
4. Carry the chief-of-staff posture: push on soft assessments ("it's fine" without evidence),
   but the calls that are the user's — which anchor, what target, whether to keep a system,
   which disposition a closing goal gets — stay theirs.
5. The monthly differential is the load-bearing move; don't let the user default to blaming
   their own effort (or quietly lowering the target) when the record says dose, time,
   mechanism, metric, goal, or the outside world.
6. Append to `goals/journal.md`; update the matching `last run` line and Current Period in
   STATE.md so `/goal-setting:progress` stays accurate.
7. The recurring pre-mortem is sharper than the launch one because it has real data — make it
   specific to what actually broke this quarter, not theoretical.

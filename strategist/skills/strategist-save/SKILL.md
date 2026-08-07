---
name: strategist-save
description: This skill should be used when a strategy working session is wrapping up or should be checkpointed (e.g. "let's stop here", "save the strategy session", "done for today", "checkpoint before I clear context") — including mid-stage. Updates the loop state and writes the session debrief so a future session resumes mid-thought, not from scratch.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# strategist-save — Session Debrief & State Save

You are a strategist closing out a working session. This is the drive back from the
client's office — the moment a human advisor synthesizes what actually happened before
it evaporates. Run it whenever a session is wrapping up (the user signals they're done,
you're about to suggest clearing context, or something feels off and you want a
snapshot). It works mid-stage — that's precisely when it matters most, because stage
results only reach the brief at confirmation.

**The parts below run silently.** The user sees at most one natural line while you work
("Let me capture where we are before we stop") and the short confirmation at the end.
Never narrate the parts — no section names, no "updating the Open Questions," no state
mechanics.

## Current State

!`cat strategy/STATE.md 2>/dev/null || echo "No strategy/STATE.md — nothing to save; run /strategist:init first."`

## Part 1: Position (the record)

If `strategy/STATE.md` does not exist, there is nothing to save — say so, point to
`/strategist:init`, and stop.

If a stage just completed, the engine's own Step 5 has already written the Stage Record,
Working Dynamic, Open Questions Under Test, and cleared In-Flight. Verify what it wrote and correct
anything the session moved on afterwards; don't re-derive it from scratch, and don't
promote a status it deliberately left short.

Read the current `strategy/STATE.md` (with the Read tool, before any edit). Based on
everything in this session, update:

- **Stage Record + Position** — statuses, frameworks applied, pressure-tested cells,
  any staleness markings from this session. Use the loop's vocabulary exactly as the
  engine writes it, because `/strategist:progress` and `/strategist:resume` parse these
  cells: statuses are `complete`, `active`, `pending`, `stale (premise changed)`,
  `complete (on stale inputs)`, or `incomplete (advanced by user)`; pressure-tested cells
  are `clear`, `open (n)`, or `declined`. Record what the session actually reached — save
  writes the position down, it never promotes it.
- **In-Flight (mid-stage)** — if a stage is underway, make this current: the framework
  in play, the questions answered so far (with the answers' one-line substance, not
  just topics), what's still open, and any provisional conclusions. The stage engine
  keeps this fresh as the stage runs; at save, curate it — correct and consolidate,
  don't just append. If the stage completed, clear this section back to `(none)`.
- **Open Pressure-Test Findings** — anything raised this session and not yet resolved.
- **Next Action** — specific enough that a new session resumes without re-reading
  everything ("Continue Analyse: dimensions 3 of 5 done, next is pricing power" — not
  "continue the analysis").
- **`updated`** — refresh the frontmatter timestamp (ISO 8601).

## Part 2: The Debrief (the backstage)

This is the part a position snapshot misses — what the session *meant*:

1. **Working Dynamic** — did this session change how this user takes pushback, or how
   they communicate? Adjust the calibration and notes.
2. **Open Questions Under Test** — update hypothesis statuses against this session's evidence. New
   suspicions enter as Open with explicit would-validate / would-challenge criteria and
   the stage that would test them. If the session ended mid-stage, capture the
   in-flight reasoning here — the half-formed pattern you'd otherwise lose.
3. **Backstage Tasks** — write your private prep list for next session: re-read a
   section whose details will matter, prepare the option set so the user chooses
   instead of waiting, verify something asserted this session. These are yours, not
   the user's — Next Action stays user-facing.

## Part 3: Close

Confirm briefly, in one or two lines: "Saved — everything from this session is
captured. Pick up anytime with `/strategist:resume`." Do not recite the debrief
contents; the backstage stays backstage.

## Rules

- Never delete existing entries — update statuses and append. The exceptions are the
  Open Questions Under Test, In-Flight, and Backstage Tasks sections, which are rewritten to stay
  current.
- `strategy/STATE.md` and `strategy/brief.md` are the source of truth; write what the
  files plus this session support, not what conversation memory alone suggests.
- Use ISO dates (YYYY-MM-DD) for all timestamps; convert relative dates to absolute.
- Write the debrief honestly. The user never sees it, and a flattering read helps
  no one.

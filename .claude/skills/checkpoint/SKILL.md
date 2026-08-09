---
name: checkpoint
description: Capture the state and progress of work in this marketplace repo so the session context can be safely cleared — survey what happened, clean up loose ends, write this workstream's dev/state/<stream>.md, commit. Run before /clear or at the end of any substantial work session.
---

# /checkpoint

Make the current session disposable: a fresh session reading `AGENTS.md` + `dev/STATE.md` + its stream file
should be able to pick up exactly where this one left off, with nothing living only in
conversation context.

## Step 1: Survey

Gather the facts before writing anything:

```bash
git status --short          # uncommitted and untracked work
git log --oneline -15       # what landed recently
git tag --sort=-creatordate | head -5
```

- Check the task list for anything in_progress or pending.
- Check for background tasks (servers, watchers) started this session.
- Note anything decided or learned this session that is NOT yet written down in the repo —
  decisions, gotchas, verified facts, open questions. This is the most important survey
  item; conversation-only knowledge is what a context clear destroys.

## Step 2: Clean up

- **Validate anything touched.** For each plugin changed this session:
  `claude plugin validate ./<plugin>`, plus `claude plugin validate .` from the repo root.
  If any plugin's version/description changed, also run
  `node dev/scripts/check-version-prefix.mjs`.
- **Resolve uncommitted work.** Either commit it in logical units (following the release
  loop in AGENTS.md if a plugin changed: version bump → both descriptions' v-prefix →
  CHANGELOG → root README row → checker → validate), or — if it's genuinely half-done —
  leave it uncommitted and record exactly what it is and what finishing it looks like in
  your stream file. Never let uncommitted work go unrecorded.
- **Stop background tasks** this session started; list anything deliberately left running.
- **Scratch artifacts** (sample projects, temp dirs, eval `.eval/` runs): don't chase
  deleting them — note their paths and how to recreate them in your stream file. (File deletion is
  gated per folder in Cowork; don't fight it for scratch.)

## Step 3: Write YOUR STREAM's state file

**State is split per workstream, and this is the step where that matters most.** Several
worktrees run against this repo at once (`core-kenzie-marketplace` on `main`,
`kenzie-build-strategist`, `kenzie-build-goal-setting`). They used to share one `dev/STATE.md`,
and a shared snapshot under concurrent writers is a **lost-update bug**: whoever checkpointed last
silently erased everyone else's. A goal-setting session once opened a STATE file whose "next
steps" were the strategist's.

So:

1. **Identify your stream** — the worktree/branch you're actually in. `dev/STATE.md` is the index;
   your stream's file is `dev/state/<stream>.md`.
2. **Overwrite ONLY your stream's file** (a snapshot, not a log — git history holds old versions).
3. **Touch only your own row** in `dev/STATE.md` (the "Last touched" date). Never rewrite another
   stream's file or its row, and never "tidy up" a stream that looks stale — **a quiet stream is
   parked, not dead.** If you genuinely believe another stream's file is wrong, say so to the user;
   don't correct it from outside.
4. If your work is a **new** stream, add a row and create its file.

```markdown
# Stream: <name>

**Status:** <live / live-but-paused / blocked on X> — <one line; say plainly if something is RED>
**Worktree:** `<dir>` · branch `<branch>`
**Last touched:** <date>

## Where it stands

<Current version, what's committed vs pushed, what's red. Link the CHANGELOG for full history.>

## Done this session

<Outcome-level: what shipped/landed, with commit hashes or tags. Not a play-by-play.>

## In flight / uncommitted

<Anything half-done, with exactly what finishing it looks like. "None" is a good answer.>

## Next steps (in order)

<The queue a fresh session should execute, most specific first. Enough context per item
that no conversation memory is needed: what, why, where the grounding doc is.>

## Open questions / decisions pending

<Things waiting on a human call. Name who or what unblocks each.>

## Session knowledge worth keeping

<Facts verified or learned this session not recorded elsewhere: gotchas, environment
quirks, verified commands, scratch paths and how to recreate them. If a fact belongs in
AGENTS.md or a plugin doc instead, put it THERE and skip it here.>

## How to resume

1. Read `AGENTS.md` (orientation), then `dev/STATE.md` (the index), then this file.
2. <Any session-specific resume steps.>
```

## Step 4: Commit

Commit your stream file + the `dev/STATE.md` index row (and any clean work) in logical units. In Cowork, commits work once
folder deletion is approved; `git push` is safest from a real terminal.

## Rules for the content

- Your stream file is a **snapshot**. Overwrite it; don't append. The next session reads the
  current state, not a diary.
- Be specific in Next Steps: a fresh session should be able to execute each item without
  asking. Point at the grounding doc (`dev/<plugin>/PRD.md`, a CHANGELOG, a skill file).
- Record conversation-only knowledge, or it's lost. That's the whole point of the skill.
- Don't duplicate what AGENTS.md or a plugin's own docs already say — link to them.

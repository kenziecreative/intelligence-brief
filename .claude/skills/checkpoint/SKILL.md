---
name: checkpoint
description: Capture the state and progress of work in this marketplace repo so the session context can be safely cleared — survey what happened, clean up loose ends, write dev/<plugin>/STATE.md, commit. Run before /clear or at the end of any substantial work session.
---

# /checkpoint

Make the current session disposable: a fresh session reading `AGENTS.md`, `dev/STATE.md`
(the stream index) and the relevant `dev/<plugin>/STATE.md` should be able to pick up exactly where this one left off, with nothing living only in
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
  the plugin's STATE.md. Never let uncommitted work go unrecorded.
- **Stop background tasks** this session started; list anything deliberately left running.
- **Scratch artifacts** (sample projects, temp dirs, eval `.eval/` runs): don't chase
  deleting them — note their paths and how to recreate them in the plugin's STATE.md. (File deletion is
  gated per folder in Cowork; don't fight it for scratch.)

## Step 3: Write dev/<plugin>/STATE.md

**Write the plugin's own state file — `dev/<plugin>/STATE.md` — not `dev/STATE.md`.**
`dev/STATE.md` is an index of streams and the branching rule; it is not a state file and a
checkpoint almost never edits it. Touch it only when a stream's *status* changes (a plugin
becomes active or goes idle, a new stream starts, a cross-stream item resolves) — one row,
not prose.

This split is load-bearing. A single whole-repo state file overwritten wholesale is the one
thing that makes two concurrent plugin streams conflict; every other shared file in this repo
is row-per-plugin and auto-merges. Writing stream detail into `dev/STATE.md` recreates the
collision the split exists to remove.

If a session genuinely spanned two plugins, write both files. If it touched only shared
tooling (`eval/`, `dev/scripts/`, `.claude/skills/`), write the state file of the plugin the
work was in service of, and say so in its first line.

Overwrite the plugin's file (a snapshot, not a log — git history holds old versions):

```markdown
# Work state — <plugin>

**Last updated:** <date> · **Session focus:** <one line>

## Where things stand

<This plugin: current version, what state it's in, branch name, a few lines. Link to its
CHANGELOG for full history rather than restating it. Note other plugins ONLY where this
stream actually depends on them.>

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

1. Read `AGENTS.md` (orientation), then this file.
2. <Any session-specific resume steps.>
```

## Step 4: Commit

Commit `dev/<plugin>/STATE.md` (and any clean work) in logical units. In Cowork, commits work once
folder deletion is approved; `git push` is safest from a real terminal.

## Rules for the content

- The plugin's STATE.md is a **snapshot**. Overwrite it; don't append. The next session reads the
  current state, not a diary.
- Be specific in Next Steps: a fresh session should be able to execute each item without
  asking. Point at the grounding doc (`dev/<plugin>/PRD.md`, a CHANGELOG, a skill file).
- Record conversation-only knowledge, or it's lost. That's the whole point of the skill.
- Don't duplicate what AGENTS.md or a plugin's own docs already say — link to them.

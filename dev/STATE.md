# Work state — kenzie-creative-marketplace

**This file is an index, not a snapshot.** One line per active workstream, pointing at its own
state file. Nothing else lives here.

## Why it's split (read this before you "fix" it)

We run several worktrees against this repo at once — `core-kenzie-marketplace` (primary, holds
`main`), `kenzie-build-strategist`, `kenzie-build-goal-setting`. Until 2026-07-12 they all
checkpointed into a single `dev/STATE.md`, and that is a **lost-update bug, not a staleness bug**:
whichever session ran `/checkpoint` last overwrote the others' snapshot wholesale. The
goal-setting stream then spent a session reading a STATE file whose "next steps 1 and 2" were the
*strategist's*, because the strategist session had written last.

Parallel streams need parallel files. A stream going quiet does not mean its work went away — it
means nobody has touched that file lately, which is exactly what the file should say.

**`/checkpoint` writes ONE stream file** (the one you're working in) **and touches only its own
row here.** It never rewrites another stream's file. Merge conflicts on this index are one line
and trivial; conflicts on a shared body were not.

## Streams

| Stream | Worktree / branch | State | Last touched |
|---|---|---|---|
| **goal-setting** | merged to `main` 2026-08-09 | [dev/state/goal-setting.md](state/goal-setting.md) | 2026-08-07 |
| **researcher** | branch `researcher-w2` — v1.11.0, 17/17 green, untagged pending 3x sampling | [dev/state/researcher.md](state/researcher.md) | 2026-08-09 |
| **strategist** | merged to `main` 2026-08-09 | [dev/state/strategist.md](state/strategist.md) | 2026-08-09 |
| **marketplace** | `core-kenzie-marketplace` · `main` | [dev/state/marketplace.md](state/marketplace.md) | 2026-08-09 |

A stream is **live** until its own file says otherwise. Silence in this table is not a signal.

## What actually collides (measured, 2026-08-09)

The split was designed against a lost-update bug. A merge of six parallel plugin branches
later confirmed it was also the *only* structural collision, which is worth recording so
nobody re-partitions something that was never a problem:

- **Auto-merged cleanly every time:** `.claude-plugin/marketplace.json`, root `README.md`,
  `AGENTS.md`, `eval/lib/run-gates.mjs`. The registries are row-per-plugin, so two streams
  editing different rows never touch the same lines.
- **Conflicted every time:** the shared state file, and nothing else.
- **Genuinely shared and worth care:** `eval/lib/`, `dev/scripts/`, `.claude/skills/`. Two
  streams changing the same file there will conflict legitimately. Keep those edits small and
  merge them promptly instead of parking them on a long-lived plugin branch.

**One plugin, one branch, branched from current `main`.** Don't branch from another plugin's
branch. The August 2026 backlog had branches 40–114 commits behind `main`; they all still
merged clean, but that was luck, not design.

## Shared ground (true regardless of stream)

- Orientation: root `AGENTS.md`, then the plugin's own `AGENTS.md`.
- Convergence work: `dev/convergence/README.md` (local-only) → the relevant build brief →
  `dev/backstage-convergence-plan.md` § Decisions of Record.
- Release ritual, versioning, and the three registration points: root `AGENTS.md` § Release.
- Eval harness: `eval/README.md` + `eval/AGENTS.md`. Runs are local-only (`eval/**/_eval/` is
  gitignored), so a scorecard exists only in the checkout that produced it.

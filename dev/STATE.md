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
| **researcher** | `core-kenzie-marketplace` · `main` — **v1.18.0 tagged**; every workstream built, eval set 45/45 golden. Docs split: ARCHITECTURE = the explanation, MAINTAINERS = the ledger | [dev/state/researcher.md](state/researcher.md) | 2026-09-01 |
| **intelligence-briefing** | `kenzie-build-intelligence-briefing` · `review/intelligence-briefing` — **unmerged**; v1.1.0 tagged on the branch, `main` still ships 0.3.1. Parked on Kelsey running Codex pass 3 | [dev/state/intelligence-briefing.md](state/intelligence-briefing.md) | 2026-08-25 |
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
- Convergence work: `dev/convergence/README.md` → the relevant build brief →
  `dev/backstage-convergence-plan.md` § Decisions of Record. **The first two are gitignored —
  see the note below before following that path from a worktree.**
- Release ritual, versioning, and the three registration points: root `AGENTS.md` § Release.
- Eval harness: `eval/README.md` + `eval/AGENTS.md`. Runs are local-only (`eval/**/_eval/` is
  gitignored), so a scorecard exists only in the checkout that produced it.

### Gitignored working docs do not travel

Some orientation this file points at is **deliberately gitignored** and therefore exists only in
the checkout that created it. A `git worktree`, a fresh clone, and a CI checkout all get the
tracked repo and nothing else, so a pointer to one of these paths resolves to nothing there.

Today that covers `dev/convergence/` (build execution layer) and `dev/blind-reviews/` (candid
defect lists of live products). Both stay ignored on purpose — they are not for distribution.
Check `.gitignore` rather than trusting this list; anything ignored under `dev/` behaves the
same way.

**What to do instead: read them in place, by absolute path, in the primary checkout
(`core-kenzie-marketplace`). Do not copy them into a worktree.** These are documents a person
also edits, and a second copy of a live document diverges silently — you would be reconciling
two versions later instead of reading one now. Copy only what is yours alone.

The same property is why an eval scorecard exists only where it was produced, and it is worth
checking before you assume a move succeeded: **a branch sitting at the same commit as `main`
has carried nothing.** Tracked tooling is fine — `dev/scripts/` and `eval/lib/` are tracked
deliberately, and only their outputs are ignored. Keep it that way; a checker that lives in an
ignored directory does not exist in a worktree.

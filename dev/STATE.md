# Work state — index

**This file is an index, not a state file.** It says which plugin streams exist, where each
one's state lives, and how work is branched. It carries no stream detail — that belongs in
`dev/<plugin>/STATE.md`, one per plugin, written by `/checkpoint`.

## Why it is split

`dev/STATE.md` used to be one whole-repo file that `/checkpoint` overwrote wholesale. Every
concurrent plugin stream rewrote it, so any two streams conflicted on it — and on nothing
else. Measured across six unmerged branches in August 2026: `marketplace.json`, `AGENTS.md`,
`README.md` and `eval/lib/run-gates.mjs` all auto-merged cleanly, because each plugin edits a
different row. **`dev/STATE.md` was the only true collision in the repo.** Splitting it is
what makes two plugin streams independent.

## Streams

| Plugin | Version | Stream state | Status |
|---|---|---|---|
| Blueprint | 0.3.1 | `dev/blueprint/` | idle |
| Goal Setting | 0.2.1 | `dev/goal-setting/STATE.md` | active |
| Intelligence Briefing | 0.3.0 | `dev/intelligence-briefing/STATE.md` | two branches to reconcile — see below |
| Photo Generator | 1.2.0 | — | idle |
| Researcher | 1.10.0 | `dev/researcher/STATE.md` | idle (merged) |
| Sage | 0.2.0 | `dev/sage/` | idle |
| Strategist | 0.7.0 | `dev/strategist/STATE.md` | active |
| Thinkers | 0.1.0 | `dev/thinkers/` | idle |

Repo-wide tooling (`eval/`, `dev/scripts/`, `.claude/skills/`) has no stream file; changes to
it ride whichever plugin branch needs them, and it is shared — see the collision rule below.

## How plugin work is branched

**One plugin, one branch, one worktree.** A stream working on plugin `X`:

1. Branches from current `main` — never from another plugin's branch.
2. Touches `X/`, `dev/X/`, `eval/targets/X/`, and its own rows in the shared registries
   (`.claude-plugin/marketplace.json`, `README.md`, `AGENTS.md`). Those registries are
   *row-per-plugin*, so two streams editing different rows merge without conflict.
3. Writes stream state only to `dev/X/STATE.md`. Never to this file.
4. Merges back to `main` when its release loop is green (see `AGENTS.md`).

**The shared-tooling exception.** `eval/lib/`, `dev/scripts/`, and `.claude/skills/` are
genuinely shared. Two streams changing the same shared file will conflict, legitimately.
Keep those changes small and merge them promptly rather than letting them sit on a long-lived
plugin branch.

**Don't leave a branch behind `main` for long.** The August 2026 backlog had branches 40–114
commits behind; every one of them still merged clean, but that was luck, not design.

## Open cross-stream items

- **Intelligence Briefing has two competing branches** — `review/intelligence-briefing`
  (parked mid-Codex-review) and `blueprint-guide-drift` (v0.3.1, merged). They overlap on
  `plugin.json`, `CHANGELOG.md` and `environmental-briefing/SKILL.md`. Reconciling them is a
  session of its own.
- **`backup/ec65313-two-releases`** holds one commit not in `main` or any other branch.
  Deliberately untouched; confirm it is disposable before deleting.

## How to resume

1. Read `AGENTS.md` (orientation and the release loop).
2. Read the `dev/<plugin>/STATE.md` for the plugin you're picking up.
3. Branch from current `main`.

# Stream: marketplace

**Status:** idle — merge backlog cleared, tagged, and pushed. Nothing in flight.
**Worktree:** `core-kenzie-marketplace` (primary) · branch `main`
**Last touched:** 2026-08-09

This stream covers work that isn't one plugin's: the catalog, the release tooling, the shared
`eval/` harness, the root docs, and merges/tags/pushes (which run **here**, from the primary
checkout, because the build worktrees don't own `main`).

## Where it stands

**Ten plugins in the registry**, all agreeing across `plugin.json`, the catalog, the README
table and the AGENTS list: blueprint 0.3.1, goal-setting 0.2.8, intelligence-briefing 0.3.1,
photo-generator 1.2.0, researcher 1.10.0, sage 0.2.0, security 0.1.0, strategist 0.7.0,
thinkers 0.1.0, trailhead 0.1.0.

**`main` is pushed and every plugin version carries its tag.** Six tags created this
session: `strategist-v0.5.0`, `strategist-v0.6.0`, `strategist-v0.7.0`,
`goal-setting-v0.2.8`, `intelligence-briefing-v0.3.1`, `trailhead-v0.1.0`.
`strategist-v0.7.0` points at `bdf4f5d`, not the `2b18f7d` release commit — `bdf4f5d`
fixed a self-contradiction in the firewall with no version bump, so it is v0.7.0's true
content.

## Done this session

Cleared a six-branch merge backlog. Every branch merged and validated in sequence
(`check-version-prefix` + `claude plugin validate` after each):

| Merged | Brought |
|---|---|
| `claude/git-branch-verification-f49849` | strategist v0.5.0 → v0.7.0 |
| `convergence/goal-setting` | goal-setting through 0.2.8, and the `dev/state/` layout |
| `blueprint-guide-drift` | intelligence-briefing 0.3.1 |
| `security` | security 0.1.0 **and** trailhead 0.1.0 |
| `trailhead-upskill` | trailhead constraint audit |

`researcher-w6ab` was already merged. `trailhead-v0.1.0` was an ancestor of
`trailhead-upskill`. Deleted as agreed: `strategist-upskill` (a strict ancestor of the
strategist branch) and `goal-setting-eval-target` (superseded — `convergence/goal-setting`
carried a newer version of all six files it touched).

**The state-file split landed twice, independently.** This session diagnosed the collision
and built `dev/<plugin>/STATE.md`; the goal-setting stream had already built
`dev/state/<stream>.md` a month earlier, with a sharper diagnosis (a lost-update bug, not
staleness) and a `marketplace` stream for repo-wide work. Theirs was adopted; the measured
evidence from this session — that the shared state file is the *only* file that ever
conflicts — is folded into `dev/STATE.md`.

## In flight / uncommitted

None. Tree clean, all validation green.

## Next steps (in order)

1. **Reconcile intelligence-briefing's two branches.** `review/intelligence-briefing` is 10
   ahead and 72 behind, parked mid-Codex-review since 2026-07-12; `blueprint-guide-drift`
   (now merged) shipped 0.3.1 over the same files — `plugin.json`, `CHANGELOG.md`,
   `skills/environmental-briefing/SKILL.md`. Its own session.
2. **Decide `backup/ec65313-two-releases`.** One commit not in `main` or any other branch.
   Left untouched deliberately; confirm it's disposable before deleting.
3. **Full strategist eval suite** against merged `main` (iteration-12). v0.7.0 is tagged on
   a 5x verification of the blocker scenario only; the other nine surfaces the narration
   firewall touches have not been re-run. See `dev/state/strategist.md`.

## Open questions / decisions pending

- **Stale remote branches.** `origin` still carries `security`, `trailhead-v0.1.0` and
  `goal-setting-eval-target`, all fully merged into `main` or superseded. Safe to prune with
  `git push origin --delete <branch>`; nothing is lost since the content is in `main`.

## Session knowledge worth keeping

- **The registries are row-per-plugin and merge cleanly.** Conflicts in `AGENTS.md` /
  `README.md` during this backlog were never contradictions — they were adjacent rows
  (goal-setting next to intelligence-briefing) or unions (a branch adding a new plugin while
  `main` bumped an existing one). Resolve by taking the newer of each row, never wholesale.
- **`git checkout --theirs` on a registry file silently reverts other plugins' versions.**
  It happened here: resolving `AGENTS.md` wholesale during the goal-setting merge dropped
  strategist from 0.7.0 back to 0.4.1. `check-version-prefix.mjs` caught it immediately —
  run it after *every* merge, not just at the end.
- **Merging in a loop is a trap.** A shell loop that keeps merging after the first conflict
  leaves a merge in progress and reports stale conflict lists for the rest. One merge, one
  resolution, one commit.
- **`main` isn't checked out in the primary worktree** (it sits on a build branch), so merges
  ran from a temporary worktree at `.claude/worktrees/merge-main`. Remove it with
  `git worktree remove` when done.

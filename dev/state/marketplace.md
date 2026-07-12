# Stream: marketplace

**Status:** live, idle — no marketplace-level work in flight.
**Worktree:** `core-kenzie-marketplace` (primary) · branch `main`
**Last touched:** 2026-07-12

This stream covers work that isn't one plugin's: the catalog, the release tooling, the shared
`eval/` harness, the root docs, and merges/tags/pushes (which run **here**, from the primary
checkout, because the build worktrees don't own `main`).

## Where it stands

- **Published plugins:** goal-setting 0.2.2*, intelligence-briefing 0.3.0, photo-generator 1.2.0,
  researcher 1.4.1, sage 0.2.0, strategist 0.4.1, thinkers 0.1.0.
  *\*goal-setting 0.2.3 is committed on the `convergence/goal-setting` branch and **unreleased** —
  its golden set is red. See [goal-setting](goal-setting.md).*
- **Release tooling is green:** `dev/scripts/check-version-prefix.mjs` (guards all four version
  mirrors + the three registration points) and `dev/scripts/lint-doctrine-drift.mjs` (per-plugin
  config in `dev/scripts/drift-configs/`).
- **`eval/` harness** took substantial work this session from the goal-setting stream — conditional
  gates (`applies_when`), the orchestrator-written `gate-context.json`, the `spoken.md` artifact and
  its machinery lint, and hardened blindness/isolation guardrails. All of it is **shared**: it
  applies to every target pack, and the strategist pack is unaffected (backward compatible).

## Next steps

- Nothing queued. The queue is currently owned by the two plugin streams.

## Open decisions

- **`plugin-eval` → internal `eval/`**: settled. It is marketplace validation tooling, not a
  published plugin (no manifest, not in the catalog).

## Stream knowledge

- **Merges, tags, and pushes happen here**, not in the build worktrees. The build worktrees are
  rebased onto `main` after each merge.
- **Tags are plugin-scoped** (`goal-setting-v0.2.3`, `strategist-v0.4.1`, …). Never reuse plain
  `vX.Y.Z` tags — legacy ones exist from early intelligence-briefing releases and they collide.
- **In Cowork, file deletion is gated per folder.** Approve the prompt once, or `rm` and git's own
  lock cleanup fail with `Operation not permitted` on the FUSE mount.

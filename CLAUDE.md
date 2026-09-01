# CLAUDE.md

This repository's agent guidance lives in **`AGENTS.md`** (marketplace-level) and in each plugin's own `AGENTS.md`. Every top-level plugin directory has one — read the marketplace file, then the one for the plugin you're touching. (Don't trust a list of plugin names in prose; check the directories. The list that used to live here named a plugin that no longer exists and omitted six that do.)

**Current work state lives in `dev/STATE.md`** — where things stand, next steps, open questions. Read it when picking up work; it's written by the `/checkpoint` skill, which you should run before clearing context. Two things that bite immediately: **validate before you commit** (`claude plugin validate ./<plugin>` and `claude plugin validate .`), and in Cowork **file deletion is gated per folder** (approve the prompt once or `rm`/git lock-cleanup fail).

**Plugin work happens in a worktree.** Changing anything under a plugin directory, or cutting a release, means creating a worktree first and working there — not in the primary checkout. Docs, `dev/`, state files, the catalog, and the root README are worked on `main` in the primary checkout, with no worktree. Always commit with explicit pathspecs (`git add -- <paths>`), never a bare `git add .`; two sessions in one checkout share a git index, and this repo has already had one session's release swallowed by another's commit. Full rules, both worktree locations, and what a worktree does not carry: `AGENTS.md` § *Where you work*.

Note: a plugin's `templates/CLAUDE.md` is **not** agent guidance — it's the per-deployment config file that plugin ships to its users. Don't confuse the two.

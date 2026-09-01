# Stream: marketplace

**Status:** idle — nothing in flight, nothing red. Conventions work landed this session; no plugin
code was touched.
**Worktree:** `core-kenzie-marketplace` (primary) · branch `main`
**Last touched:** 2026-09-01

This stream covers work that isn't one plugin's: the catalog, the release tooling, the shared
`eval/` harness, the root docs, and merges/tags/pushes (which run **here**, from the primary
checkout, because the build worktrees don't own `main`).

## Where it stands

**Ten plugins in the registry**, all four surfaces agreeing (`plugin.json`, the catalog, the
README table, the AGENTS list): blueprint 0.3.1, goal-setting 0.2.8, intelligence-briefing 0.3.1,
photo-generator 1.2.0, researcher 1.18.0, sage 0.2.0, security 0.1.0, strategist 0.7.0,
thinkers 0.1.0, trailhead 0.1.0.

`main` is pushed at `eadc89e` and the primary checkout sits on it, clean.

## Done this session (2026-09-01)

No plugin behavior changed. Four pieces of repo-level work.

**The worktree and pathspec convention, decided and written** (`4aa7cea`, corrected by
`eadc89e`). Root `AGENTS.md` § *Where you work* is the one definition; `CLAUDE.md` carries the
standing instruction and `dev/STATE.md` points at it rather than keeping a copy. Two rules:

- **Always commit with explicit pathspecs.** Two sessions in one checkout share a git index.
- **Plugin work takes a worktree; docs and state work does not.** The test is a property of the
  task — am I editing inside a plugin directory — which a session can answer alone.

Unconditional worktrees were considered and rejected, with the reasoning recorded in `4aa7cea`.

**A pointer defect fixed and the class documented** (`2fab76e`). `dev/STATE.md` sent every session
to `dev/convergence/README.md` to orient, and that path is gitignored — a worktree, fresh clone,
or CI followed it to nothing. `dev/STATE.md` § *Gitignored working docs do not travel* now states
the property as a class and tells readers to check `.gitignore` rather than trust a list.

**intelligence-briefing made visible from `main`** (`971b5f7`, `6783083`, `fd12f19`), and six
recovered files committed and pushed on its branch. Detail in `dev/state/intelligence-briefing.md`.

**researcher's map split** — separate stream, see `dev/state/researcher.md`.

## In flight / uncommitted

None. Both worktrees clean, both branches synced with their remotes, all ten plugins validate,
version-prefix checker green across all four surfaces.

## Next steps (in order)

1. **Prune one stale remote branch.** `origin/convergence/goal-setting` is fully merged into
   `main`. Safe to delete with `git push origin --delete convergence/goal-setting`; nothing is
   lost. (The other three stale remotes from August — `security`, `trailhead-v0.1.0`,
   `goal-setting-eval-target` — are already gone, as is `backup/ec65313-two-releases`.)
2. **Full strategist eval suite** against merged `main`. v0.7.0 is tagged on a 5× verification of
   the blocker scenario only; the other nine surfaces the narration firewall touches have not been
   re-run. See `dev/state/strategist.md`.
3. **Consider enforcing the pathspec/worktree rule.** It is currently a convention in `AGENTS.md`,
   which binds only sessions that read it at startup. A `pre-commit` hook refusing plugin-path
   commits on `main` in the primary checkout would make it real. Not built; scoped and offered.

## Open questions / decisions pending

- Nothing blocking. Item 3 above is a build decision, not a question.

## Session knowledge worth keeping

- **A convention file only reaches sessions that start after it lands.** A session already running
  holds whatever it read at startup. If you change a rule in `AGENTS.md` or `CLAUDE.md`, tell the
  running sessions directly — they will not find out on their own. This came from a cross-repo
  exchange where a session learned a new rule from a peer rather than from the repo.

- **`EnterWorktree` refuses unless the word "worktree" appears** in what the user typed or in
  `CLAUDE.md`. It reads `CLAUDE.md`, **not** `AGENTS.md` — a rule written only in `AGENTS.md`
  cannot reach the tool that implements it. That is why `CLAUDE.md` now carries the instruction.

- **A worktree carries only tracked files, and the allowlist is the expensive one.**
  `.claude/settings.local.json` is gitignored, so a new worktree starts with no permission
  allowlist. Copy it in as the first act (the exact command is in `AGENTS.md`). It then **drifts**,
  because approvals accumulate wherever you work — the `kenzie-build-intelligence-briefing` copy is
  84 entries behind the primary checkout's. That argues for short-lived worktrees, not for syncing.

- **The cheap check that a move carried anything:** a branch sitting at the same commit as `main`
  has carried nothing.

- **Auditing pointers into ignored paths: the naive check over-reports badly here.** 21 tracked
  files reference a gitignored path and 20 are correct. Two distinctions do the work. **Disclosure
  is document-level** — a doc that says "gitignored" once at the top and refers to the path seven
  times below is doing its job. And **citation is not routing**: a changelog naming where a triage
  lives is provenance, and rewriting it to be more convenient falsifies a record. The discriminator
  that works in a script is tense and addressee — provenance describes the author's completed act,
  routing instructs the reader's future one. "Evidence read" and "read this to orient yourself"
  share a verb and differ in everything that matters.

- **The registries are row-per-plugin and merge cleanly.** Conflicts in `AGENTS.md` / `README.md`
  during a merge backlog are adjacent rows or unions, never contradictions. Resolve by taking the
  newer of each row, never wholesale.

- **`git checkout --theirs` on a registry file silently reverts other plugins' versions.** It
  happened during the August backlog: resolving `AGENTS.md` wholesale dropped strategist from 0.7.0
  back to 0.4.1. `check-version-prefix.mjs` caught it. Run it after *every* merge, not just at the
  end.

- **Merging in a loop is a trap.** A shell loop that keeps merging past the first conflict leaves a
  merge in progress and reports stale conflict lists for the rest. One merge, one resolution, one
  commit.

- **A rule that enumerates leaks; a rule that states a principle holds.** Three instances this
  session alone: the gitignored-paths note (written as a class, not a list of two directories),
  `CLAUDE.md`'s plugin list (named a plugin that no longer exists, omitted six that do — replaced
  with the rule), and the intelligence-briefing one-constructor fix. This repo keeps paying for the
  same lesson.

## How to resume

1. Read root `AGENTS.md` (orientation, and the worktree rules), then `dev/STATE.md` (the index),
   then this file.
2. Nothing here is urgent. Item 1 in Next steps is a one-command cleanup.

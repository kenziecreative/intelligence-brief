# Stream: intelligence-briefing

**Status:** live, parked on a human step — **waiting on Kelsey to run Codex pass 3.** Not stalled
and not abandoned. Nothing red.
**Worktree:** `kenzie-build-intelligence-briefing` · branch `review/intelligence-briefing`
**Last touched:** 2026-08-25 (branch HEAD `5f3ea79`) · this main-side summary written 2026-09-01

> **This file is a pointer, not the snapshot.** The live state lives in the worktree, at
> `/Users/kelseyruger/Projects/_shared/kenzie-build-intelligence-briefing/dev/STATE.md`. Read it
> there, in place, and do not copy it here — two copies of a live document diverge silently.
> This file exists so a session working on `main` can see that the stream exists and what it is
> waiting on, which was not true before.

## Where it stands

The plugin was **rebuilt**, not patched. `main` still carries the 0.3.x line; the branch carries
1.1.0.

| | Version | Tag | On `main`? |
|---|---|---|---|
| `main` | 0.3.1 | `intelligence-briefing-v0.3.1` (`825429a`) | yes |
| branch | 1.0.0 | `intelligence-briefing-v1.0.0` (`0bc256c`) | **no** |
| branch | **1.1.0** | `intelligence-briefing-v1.1.0` (`a0eb932`) | **no** |

**Installers pull `main`, so what ships today is 0.3.1.** Two tagged releases exist only on an
unmerged branch. That is the stream's real open item, and it is a decision rather than a defect.

**v1.1.0 is the merge candidate. v1.0.0 must not merge** — pass 2's verdict on it was "not
trustworthy for unattended briefing," and the README makes the unattended claim. v1.1.0 is the
pass-2 repair release. Validation was green at both scopes and version prefixes agreed across all
four surfaces when it was tagged.

**`main`'s v0.3.1 is a deliberate dead end, not a fix the branch is missing.** Its own commit
message says it is not intended for main as-is and patches a line the plugin has left. Both of its
edits are already accounted for on the branch: the frontmatter-name fix arrived there
independently, and the grace-window fix is correctly *absent* because the rewrite deleted the
grace-window mechanism entirely. A naive merge could resurrect that deleted text — the v0.3.1
commit predicted this in writing. Read it before merging.

## In flight

**None uncommitted.** The six modified files were committed on the branch as `8af2c28`
(2026-09-01), staged with explicit pathspecs. They validate at both scopes.

**Committed, not released.** The version stays 1.1.0 and the `intelligence-briefing-v1.1.0` tag
still points at `a0eb932`, which does **not** include this work. Codex pass 3 has not run, and
this repo's rule is that a tag only ever marks a verified build.

The change closes five paths around 1.1.0's own doctrine, "every mandatory obligation records an
outcome" — all the same disease, a rule stated but not enforced, or scoped narrower than the claim
it protects:

- **One constructor for drivers.** The definition lived in three places and was true in two. The
  material-vs-derivative counting rule reached collection and export and missed the review
  conversation, so a thread of three real advances and twenty restatements could become a driver
  with `observation_count: 23`.
- **`planned` + step-11 reconciliation.** A run records what it committed to before executing,
  then writes down any planned obligation with no recorded outcome as `failed`. This is what
  turns the doctrine from a hope into a mechanism.
- **Falsifier results named, not inferred** — `result_observation_ids` and `cuts`, and the brief
  must report a `cuts: for` result rather than bury it.
- **`idle` narrowed** so a quiet-cell morning stops routing around the mandatory falsifier
  searches.
- **Driver standing made global, plus a new baseline gate.** No driver moves unless the whole run
  closes clean, and none moves before every applicable cell has been scanned at least once.

**Branch is one commit ahead of `origin/review/intelligence-briefing` — not yet pushed.** Until it
is, the work exists on one machine.

## Next steps (in order)

1. **Kelsey: run Codex pass 3.** The packet is staged and verified. Fresh Codex context; feed it
   `~/Projects/_scratch/kenzie-blind-reviews/intelligence-briefing/PASS-3-PROMPT.md` plus the
   `plugin/` directory beside it, then paste the verdict back into a session. **That path is
   outside any repo and therefore outside every checkout** — it does not travel and it is not
   backed up by git.
2. **Push the branch.** `8af2c28` is committed locally and not yet on the remote, so the work is
   still single-machine. One command, and it is the last of the exposure.
3. **Kelsey: the merge-to-main call.** Sequencing recommendation from the branch's own state doc:
   let pass 3 land first. Two equivalent paths — merge from `core-kenzie-marketplace` (the
   strategist pattern), or the PR GitHub offers for the pushed branch.
4. **Build the intelligence-briefing eval pack** (golden set + rubric). Unblocked, and 1.1.0 gives
   it sharper things to grade: the health line is always present, degraded/quiet/idle are
   distinguishable, a failed falsifier never renders as "nothing surfaced," a failed cell is still
   due next run. Grade behavior, never recommendation correctness.

## Open questions / decisions pending

- **Pass 3, then merge.** Both are Kelsey's, in that order.
- **The branch's `dev/STATE.md` is the pre-split monolith** and `main`'s is the index. They will
  conflict at merge. That is the one collision this repo has actually measured, so expect it and
  resolve it toward main's split format rather than being surprised by it.

## Session knowledge worth keeping

- **The worktree hazard is documented here, not hypothetically.** `825429a`'s message records a
  release authored by a concurrent session whose content "was swallowed by the blueprint v0.3.1
  commit, which shared this worktree's git index and committed without pathspecs." Two sessions,
  one checkout, one commit taking the other's staged work. It cost an attribution recovery. This
  is `kenzie-creative`'s own evidence on the always-use-a-worktree question, and it is stronger
  than the 2026-08-09 merge study, which measures a different failure.

- **220 commits behind `main`, 10 ahead.** The gap is `main` moving on other plugins, not this
  branch diverging dangerously. Root `AGENTS.md` puts the historical range at 40–114 and notes
  those merged clean by luck. This is past that range.

## How to resume

1. Read root `AGENTS.md`, then `dev/STATE.md`, then this file.
2. **Then read the live state in the worktree**, at the absolute path in the note above. This file
   is deliberately a summary and will lag it.
3. Nothing here proceeds without Kelsey's pass-3 run. Do not start the merge ahead of it.

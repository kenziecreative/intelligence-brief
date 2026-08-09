---
name: workstream-closeout
description: End a workstream in this marketplace repo — verify the work is committed, single-plugin, released correctly, behaviorally verified, tagged, and current, then merge it, delete the branch, and remove the worktree. Run when a plugin's line of work is finished, not between sessions (that's /checkpoint).
---

# /workstream-closeout

End a workstream cleanly, or say exactly why it can't end yet.

`/checkpoint` makes a **session** disposable. This makes a **workstream** disposable: the
branch merges, the tag lands, the worktree goes away, and nothing is left for a future
session to rediscover.

Six gates run first. Every one of them exists because it already failed in this repo — a
gate that can't name the failure it prevents doesn't belong here. Gates are checks, not
advice: a failed gate stops the close-out. Do not merge past a red gate, and do not
"fix" one by relaxing it.

## Scope

Take the plugin name as the argument. If it isn't given, **derive it from what the commits
touch, not from the branch name.** Intersect the changed paths with the repo's real plugin
list rather than reading directory names off the front of a path:

```
paths=$(git log --name-only --format="" main..<branch> | sort -u)
for p in $(ls -d */.claude-plugin | cut -d/ -f1); do
  echo "$paths" | grep -qE "^($p/|dev/$p/|eval/targets/$p/)" && echo "$p"
done
```

A plugin's work lives in three places — `<plugin>/`, `dev/<plugin>/`, and
`eval/targets/<plugin>/` — so matching on the first path segment reports `dev` and `eval`
as if they were plugins. Only a directory holding `.claude-plugin/` is one.

Say what you derived and from how many commits.

**Do not infer the plugin from the branch name.** Branch names here are not reliable.
Sessions started with the desktop app's `worktree` checkbox get an auto-generated branch
like `claude/git-branch-verification-f49849`, named after the session's opening message
rather than the work — a real branch carrying three strategist commits was named that.
Paths are evidence; branch names are a guess.

If the commits touch more than one plugin directory, stop — that is gate 2 failing early,
and closing out is the wrong operation until it's resolved.

Establish these before gate 1, and print them:

- the **worktree** you're in (`pwd`) and its **branch** (`git branch --show-current`)
- the commits in scope: `git log --oneline main..<branch>`
- the derived plugin, and whether `eval/targets/<plugin>/` exists
- **the merge target.** Usually `main`. But if this branch was auto-generated from another
  working branch, that original branch still exists and points into the same lineage —
  check with `git branch --contains <branch>` and `git branch --merged <branch>`. Say which
  branch you intend to merge into and which ones become redundant afterward, before
  merging anything.

If the branch has zero commits ahead of main, there is no workstream to close. Say so and
stop.

## Gate 1 — The work is committed

```
git status --porcelain
```

Must be empty. Untracked files count.

**Prevents:** uncommitted work sitting in a shared tree and being swept into another
plugin's commit by a broad `git add`. That happened — an entire intelligence-briefing
release landed inside a blueprint release commit.

On fail: list what's outstanding and stop. **Do not commit it for them.** Uncommitted work
in someone else's plugin directory is not yours to interpret.

## Gate 2 — Every commit is single-plugin

For each commit in `main..<branch>`, list its paths:

```
git show --name-only --format="" <sha>
```

Every path must be under `<plugin>/`, `dev/<plugin>/`, or `eval/targets/<plugin>/`, or be
one of the four shared index files: `.claude-plugin/marketplace.json`, `AGENTS.md`,
`README.md`, `dev/STATE.md`.

**Prevents:** a commit whose message names one plugin while its contents ship two. The
tag then can't be honest, and history misdescribes itself to whoever reads it next.

On fail: name the commit, the foreign paths, and stop. Splitting a commit is a decision
for the human — offer it, don't perform it.

## Gate 3 — The release loop held

Only runs if a commit in scope changed `<plugin>/.claude-plugin/plugin.json`'s `version`.

```
node dev/scripts/check-version-prefix.mjs
claude plugin validate ./<plugin>
claude plugin validate .
```

All three must exit 0, and `<plugin>/CHANGELOG.md` must have a heading for the new
version.

**Prevents:** the version is mirrored by hand in four places, so a bump that misses one
makes the marketplace UI state a version the plugin isn't.

## Gate 4 — The release is verified

**If `eval/targets/<plugin>/` exists:** compare the newest scorecard against the newest
commit touching `<plugin>/`. The scorecard must be **newer than** the commit.

Match scorecards by exact path — `eval/targets/<plugin>/_eval/iteration-*/scores.md` — not
by "newest file under `_eval/`". Those directories carry `.DS_Store` and other incidental
files, and a loose match will happily date your verification from one of them.

This is a timestamp comparison, not a judgment. An eval that predates the code it grades
is not evidence about that code.

**Prevents:** shipping a release whose regression check was never re-run. Strategist
v0.5.0 was committed with "eval re-run outstanding" written in its own commit message.

On fail: print both timestamps, say the eval predates the change, and stop.

**If no eval pack exists:** do not pass silently. State plainly that this workstream ships
**behaviorally unverified**, name it as a known gap, and require the human to say so
explicitly before continuing. Absence of a test is a finding, not a pass.

## Gate 5 — Every release is tagged

For each version-bumping commit, a tag `<plugin>-v<X.Y.Z>` must exist and point at it.

Resolve tags by exact ref, never by scanning a list, and always dereference to the commit:

```
git rev-parse --verify refs/tags/<plugin>-v<X.Y.Z>^{commit}
```

**The `^{commit}` is not optional.** An annotated tag is its own object with its own SHA, so
a bare `rev-parse` returns the tag object, not what it points at. Comparing that against a
commit SHA reports a mismatch on a perfectly good tag — which happened here with
`strategist-v0.6.0`.

**`git tag -l | tail` will lie to you.** Tags sort lexically, so `researcher-v1.10.0`
sorts *before* `researcher-v1.7.0` and falls off the end of a `tail`. That mistake was
made in this repo and reported a tag as missing when it existed.

**Prevents:** a release commit on main with nothing pointing at it. Strategist v0.5.0
shipped untagged.

On fail: name the untagged versions. Offer to tag them; tagging is a release act, so get
an explicit yes.

## Gate 6 — The branch is current

```
git rev-list --count <branch>..main
```

- **0–10 behind:** pass.
- **11–30 behind:** warn. Report the count and recommend rebasing before merge, but
  continue if the human accepts.
- **more than 30 behind:** **block.** Rebase or merge main in, resolve, re-run the gates
  from 1.

**Prevents:** a branch drifting until merging it becomes a project in itself.
`convergence/goal-setting` reached 77 behind and `review/intelligence-briefing` 72, and
that drift — not the work — is what stalled both.

When resolving conflicts in the four shared index files, keep **both** sides' plugin rows.
Two plugins bumping versions in the same table is not a conflict of intent; picking one
silently drops a release from the index.

## Closing out

Only after every gate passes.

1. Rebase onto main (or merge main in, if the branch is shared).
2. Merge into main. Use `--no-ff` if the workstream is worth reading as a unit in history.
3. **Ask before pushing.** Pushing publishes; it is the human's call, and this repo has
   held pushes deliberately in the past. Push the branch and its tags together — a release
   commit on the remote with no tag pointing at it is the same defect as gate 5.
4. Delete the branch: `git branch -d <branch>`. Use `-d`, never `-D` — if git refuses, the
   branch has unmerged commits and the close-out was wrong.
5. **Delete the branches this one made redundant.** An auto-generated session branch is
   usually a copy of a working branch that still exists at the same or an earlier commit.
   Once the work is on main, both are merged and both should go:

   ```
   git branch --merged main | grep -vE '^[*+]|^\s+main$'
   ```

   Exclude `+` as well as `*`. Git marks the current branch with `*` and a branch checked
   out in **another worktree** with `+`; attempting to delete a `+` branch fails, and the
   failure will look like a bug in the close-out rather than the guard it is.

   Delete only what that lists, and only with `-d`. Leaving the original behind is how a
   dropdown fills with branches nobody can distinguish — `strategist-upskill` and
   `claude/git-branch-verification-f49849` pointed at the identical commit.
6. Remove the worktree: `git worktree remove <path>`. Without `--force`; a refusal means
   uncommitted work appeared and gate 1 is stale.

   App-created worktrees live at `.claude/worktrees/<name>` **inside the repo**, excluded
   via `.git/info/exclude` rather than `.gitignore`. Removing the worktree does not remove
   its branch, and deleting the branch does not remove the worktree — do both, then confirm
   with `git worktree list`.
7. Update `dev/STATE.md`: what shipped, what version, what's still open. Commit that
   separately from the release.

Then report, in five lines or fewer: what merged, what version, what tag, what was
deleted, and anything gate 4 flagged as unverified.

## Park mode (`--park`)

For a workstream that's finished but waiting on a human — a review, a decision, an
external check. Parking merges nothing.

Run gates 1 and 2 only. Then write to `dev/STATE.md`: the branch, the date, what the work
is, what it's waiting on, and who owes the next move. Leave the branch and worktree alive.

**Prevents:** finished work going quiet. The intelligence-briefing v1.1.0 rebuild was
complete in July and waiting on one review; nothing recorded that, so it sat for three
weeks and drifted 72 commits behind while nobody was sure whether it was alive.

A parked workstream with no recorded owner and no date is indistinguishable from an
abandoned one. Both fields are required.

## Rules

- **A failed gate stops the close-out.** Report which gate, why, and the smallest thing
  that would clear it. Never merge past red, and never edit a gate to make it green.
- **Never `git add -A` or `git add .`** — stage explicit paths. Broad staging is what put
  two plugins in one release commit.
- **Never delete or force-remove to make a check pass.** `-d` and a bare `worktree remove`
  are the safe forms; if either refuses, that refusal is information.
- **Tagging, pushing, and merging to main are release acts.** Confirm before each.
- **Uncommitted work in another plugin's directory is not yours.** Report it; leave it.

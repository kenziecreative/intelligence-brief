# Stream: goal-setting

**Status:** live — **golden 8/10. NOT tagged, not pushed, not merged.** Two reds remain, both one-sample, both precisely diagnosed.
**Worktree:** `kenzie-build-goal-setting` · branch `convergence/goal-setting`
**Last touched:** 2026-08-07
**Plugin version on branch:** 0.2.8 (committed, unreleased)

## Headline

main is merged in. The merge was the easy half. Re-running the eval against the merged tree
turned up a **systemic provenance defect** — the plugin telling owners things the files don't
carry — across four skills, and fixing it took three releases (v0.2.6, v0.2.7, v0.2.8, one of
which corrects another). Golden went **3/10 → 8/10**. The last two reds are the same discipline
failing one step further out than each fix reached.

## Where it stands

| commit | what |
|---|---|
| `57ee3ce` | the /upskill constraint audit, committed alone (baseline v0.2.1 / main lineage — **stale vs this branch**) |
| `b89ab34` | **merge main → branch.** Four conflicts, not zero. Two files combined silently and were hand-reviewed |
| `12d398c` | fix: the merged `evalLint` flags combination **crashed** the gate runner on blueprint's three packs |
| `de6160d` | **v0.2.6** — review stops estimating durations |
| `7eabbe4` | **v0.2.7** — provenance rule goes plugin-wide (heartbeat §1 + critic, pulse, restart, setup-stage) |
| `6ddb0e3` | **v0.2.8** — corrects v0.2.6's over-reach: a sparse journal is not a short clock |

Release loop green at every bump: `check-version-prefix` (8 plugins agree ×4 surfaces), drift
lint, `claude plugin validate` ×2.

## Eval record

- **iteration-7** (v0.2.5): gates 30/30 clean; judged **3/10**, 9 of 30 runs red. Eight of nine
  failing runs were one defect — a claim the record cannot support — across four skills, five of
  them fossilized in append-only files.
- **iteration-8** (v0.2.7, `adv-goal-vs-system` on v0.2.8): gates 30/30 clean; judged **8/10**,
  2 of 30 runs red.
- Scorecards: `eval/targets/goal-setting/_eval/iteration-{7,8}/scores.md` — **local-only**
  (`_eval/` is gitignored). iteration-8 also holds `_superseded-v0.2.7/`, the three captures
  invalidated by the v0.2.6 over-reach, kept as the A/B evidence (`insufficient_time` →
  `mechanism_wrong` on identical inputs).

## The two remaining reds — both one sentence to fix

1. **`adv-critic-memory` r1 (Critic Acuity 2).** The run applied the prior-text rule perfectly to
   the *goal* — the artifact the user said they reworked — then slipped on the *vision*, which
   nobody claimed to have edited: *"Horizon 3 **still reads** …"*. v0.2.7 stated the rule with the
   KR as its example and the run generalized exactly that far.
   **Fix:** bind it to every document. *"Horizon 3 still commits you to being out of delivery, and
   today reads '…'"* is provable; *"still reads"* is not. Two judges also independently asked for a
   hard wording constraint in the critic's Prior-Findings section — the passing runs survive on
   cancelling hedges ("I'll take you at your word", "today", "whatever changed"), and **a phrasing
   that needs its surroundings to stay honest is one edit from failing.**

2. **`adv-goal-vs-system` r3 (Diagnosis Discipline 2, Record Preservation 2).** Turn 1 did exactly
   what v0.2.8 asks — named the log gap, asked the user to close it. Turn 2 restated the answer as
   established record (*"since it's been the full eight weeks at full dose…"*), unattributed.
   **Run-2 handled the identical moment correctly** and passed: *"owner confirmed the Monday block
   ran full dose all 8 weeks"* written to the journal with attribution.
   **Fix:** mark the seam when user testimony answers a record gap ("taking your word the earlier
   five ran"), and write it to `journal.md` so the gap doesn't re-open next session.

Both are consequences of the fixes, not the original defects. Ship as v0.2.9, re-run those two
scenarios (6 runs), tag if green.

## Tag commits — identified, NOT created

`v0.2.2` → `9098b04` · `v0.2.3` → `0862748` · `v0.2.4` → `23bb3ea` · **`v0.2.5` → `8d1efe7`**
(not the bump commit `5c6aaed` — `8d1efe7` changed `goal-setting-critic.md` under the same version
with no CHANGELOG entry, and is the tree iteration-6 verified) · `v0.2.6` → `de6160d` ·
`v0.2.7` → `7eabbe4` · `v0.2.8` → `6ddb0e3`.

**Seven tags, not four.** Note this diverges from `goal-setting-v0.2.1`, which points at a
merge-to-main commit; that convention can't be followed until the merge happens.

## Decisions of record (Kelsey, 2026-08-07)

1. **A count-to-N KR's zero is structural, not a prior-state claim.** `Land 3 retainer clients
   (baseline 0)` restates the KR's shape.
2. **The provenance rule reaches miscomputed derived values**, not only claims about prior state.
   A number handed to the owner must be derivable from the record; one that contradicts it is a
   fabrication whether invented or mis-derived.

Together: **derivable is the test, not merely present.** Applied consistently, these rescored four
iteration-7 runs (one up, three down) — recorded in that iteration's `scores.md`.

## The durable lesson from v0.2.6 → v0.2.8

v0.2.6 fixed a real defect (the review claiming "every week for eight weeks" against four journal
entries) but went further than the defect did, asserting that a **minimum test duration is served
by execution count**. It isn't — `min_test_duration` runs off `running since`, and a gap in the log
doesn't restart that clock. All three samples of `adv-goal-vs-system` stopped landing the
differential and retreated to *"too early to call"*, the exact hedge that scenario forbids.

**A provenance rule that stops the model *asserting* an unsupported fact is right. The same rule
aimed at what the model may *conclude* will quietly move outcomes. Bind the claim, not the
inference.**

## Harness findings (eval-side, not plugin defects)

1. **Blindness hole in the `eval-run` staging rule.** `SKILL.md:69` prescribes
   `PACK/_eval/iteration-N/_scenarios/` as judge-only because "no runner is ever pointed at it" —
   but *pointed at* is the wrong test; it sits inside the tree runners work in. Three runners saw
   it and all three declined to open it. Moved outside the eval tree mid-run; iteration-8 was
   clean. **Marketplace-level fix, not applied — `SKILL.md` untouched.**
2. **The heartbeat reasons from `status:` flags, not recorded values.** `adv-fired-mitigation` r3
   fired correctly, but only because the user volunteered the number; `active.md` already recorded
   a breaching `current: 11%` against an `untriggered` flag. **Unproven that the fire surfaces when
   the user says nothing.** Needs a scenario where they don't.
3. **Gates that pass on seeded content** — `journal_dated_entry`, `restart_phase_recorded` on
   zero-write runs. Five judges, two iterations.
4. **`adv-42-day-return` can't test the restart capture** (turns exhaust before any write, and it
   doesn't declare `restart_transition_expected`). **`adv-closeout-gate` can't test Constraint
   Enforcement** (turns run out before replanning).
5. **Unpinned seeds cause runner divergence** — `STATE.md` `Direction`, `scorecard.md` Score
   History. One runner rewrote `[FILL]` on wrong reasoning about a lint.
6. **`spoken_no_machinery` scans `spoken.md` only.** Five sightings of machinery in user-facing
   files (`goal_wrong`, `min_test_duration`, `goals/STATE.md`, operator third-person voice) — some
   in append-only records. Caveat before linting: the shipped `active.md` template itself carries
   `See reference/schemas.md`, so decide whether internal cross-refs are sanctioned there.
7. **Lint asymmetry** — `state_no_placeholders` omits `FILL`. Six sightings; documented as
   deliberate in `gates.json`, but the note clearly isn't reaching readers.
8. **No gate checks cadence-last-run advancement.**

## Next steps

1. **v0.2.9** — the two fixes above; re-run `adv-critic-memory` and `adv-goal-vs-system` (6 runs).
2. **Tag all seven** once green, from the **primary checkout** (`core-kenzie-marketplace`), then
   push and merge. Tags are plugin-scoped (`goal-setting-vX.Y.Z`), never bare.
3. Harness items 1–8 are marketplace-scoped and independent of the tag.

## Stream knowledge

- **`dev/goal-setting/constraint-audit.md` is stale relative to this branch.** Written at `df7f0c0`
  on main (v0.2.1, eval iteration-1 6/4). Its cross-surface finding G ("the regression net is not
  green") and its line numbers predate v0.2.2–v0.2.8. Its *findings* still stand — the eight `model:`
  pins, the fifteen-file "follow its steps exactly" family, six drifted mirrors, and the PreCompact
  hook that writes to stderr on exit 0 and reaches nobody. Four author questions remain unanswered.
- **`dev/state/researcher.md` is new** — main's monolithic `dev/STATE.md` body, preserved verbatim
  when the merge hit the per-worktree split. It is internally stale (header says v1.10.0, body
  describes v1.7.0/W7); that's main's inconsistency, flagged in the file, not corrected.
- The critic is **role-played by the runner, never Task-dispatched** — `adapter.md:29`. Everything
  proven about the critic is proven as a spec, not as live dispatched behavior. First real
  `/goal-setting:pressure-test` session is what graduates it.

# Work state — kenzie-creative-marketplace

**Last updated:** 2026-08-07 · **Session focus:** strategist — full `/upskill` constraint
audit, first runtime eval baseline, and the resulting **v0.5.0 upskill release**. Committed
and tagged on `strategist-upskill`. NOT pushed. NOT merged to main. **One step outstanding:
the eval re-run that verifies the pass against its own baseline.**

## Where things stand

- **strategist (0.5.0, committed `4ec11f2`, not merged)** — two commits on
  `strategist-upskill`, which is linear with main (main is an ancestor; a merge is a
  fast-forward, no rebase needed):
  - `4cc55e8` **v0.4.2** — shipped-reference correction (`reference/frameworks/README.md`
    now records that only two of the six derivations `creating-conditions.md` names actually
    ship) plus the audit record. Tagged `strategist-v0.4.2`.
  - `4ec11f2` **v0.5.0** — the upskill release. 30 decisions applied. Tag NOT yet created,
    deliberately: tag after the eval re-run passes.
- **The audit** — `dev/strategist/constraint-audit.md` is the full record: every surface,
  every proposed rewrite as a numbered decision, and a disposition ledger (26 accepted,
  0 rejected, 3 deferred, plus runtime findings 27–30). Read this first when picking the
  thread back up.
- **The baseline** — `eval/targets/strategist/_eval/iteration-1/` (gitignored, local only):
  25 runs, 25 scorecards, `scores.md`. **9/13 under rubric 1.2.0; 7/13 under the new 1.3.0
  floor** — `scores.md` carries both derivations. Compare iteration 2 against the **7/13**
  figure, never the 8/8 golden headline, or the rubric change reads as a phantom regression.

## The one outstanding step

**Run `/eval-run --target strategist --scope all` and compare to iteration 1.** Everything
else in the arc is done. Notes for that run:

- It should be much cheaper than iteration 1. `eval-judge` now has a `Write` tool and
  persists its own `scorecard.md`; in iteration 1 **all 25 judges returned nothing on first
  completion** and every card survived only because the orchestrator re-asked, 25 times.
- The scenario set changed, so a few comparisons are not like-for-like: `rep-define-scq` and
  `rep-analyse-waterfall` were reseeded off library Worked Examples they collided with,
  `rep-synthesise-tree` gained the 4th user turn the engine needs to reach Step 4 consent
  (its iteration-1 gate failure was a scenario turn-budget flaw, not a plugin defect), and
  `adv-skip-loop` gained a 3rd turn so Probing is actually exercised.
- **The thing to actually check:** whether decision 27 landed. Iteration 1 had the plugin
  narrating its internal checks across five of seven stages, at Register 0 or 1. Under the
  1.3.0 floor a Register 0 now fails any scenario, so a regression here turns a golden red.
- **R-SE2 has no automated net.** The adapter has the runner play the critic directly
  because a subagent cannot nest, which bypasses `allowed-tools` entirely. Verify the
  Synthesise `Task` fix by running `/strategist:synthesise` live and confirming the critic
  dispatches. A green eval proves nothing about that seam.

## Done this session

- **v0.4.2** released and tagged; branch synced to main first (it was 3 behind and would
  have committed stale version tables).
- **Iteration-1 eval baseline** — 25 runs, zero ungraded, one deterministic gate failure
  (adjudicated as a scenario turn-budget flaw; the fix belongs in `scenarios.jsonl`, and a
  plugin-side "fix" would have loosened Step 4's consent rule).
- **v0.5.0** — 30 decisions: 8 model pins cut, the "exactly" adverb family, the Synthesise
  `Task` defect, `strategist-framework` un-frozen, `_inventory.json` deleted, `no_em_dashes`
  wired, the narration firewall rewritten to catch paraphrase rather than vocabulary,
  `open (n)` made a real count, done-bar adherence tightened.
- **Harness repairs** — judge self-persistence, transcript convention (grammatical person is
  the tell: third-person is annotation, second-person is speech), `expected_no_advance`
  moved off the blind runner, rubric 1.3.0 floor, two scenarios reseeded, two turn budgets.
- **New lint** — `indexCompleteness` in `lint-doctrine-drift.mjs`: every shipped entry
  reachable by slug from `INDEX.md`, every row pointing at a real file. Tested both ways.

## Open decisions / debt

- **Four Q-answers from the audit not applied** (Q3 transition-box status, Q10 inline-paste
  recording path, Q11 malformed-settings merge, Q12 on-demand alternative set). Small, all
  one-liners; sites were not cheap to locate. Recorded here rather than silently dropped.
- **Q8 was resolved against its own disposition.** The audit parked "standalone framework
  capture path vs the 0.4.x state model" as product work, then the pass wrote a boundary for
  it anyway in `strategist-framework` Step 4 (the write does not advance the loop, set a
  status, or clear In-Flight; it notes provenance in the `Notes` cell). Conservative and
  arguably the minimal sentence the audit asked for — but it contradicts the ledger. Keep or
  revert deliberately.
- **Q7 still parked** — CHARTER.md has no staleness/migration vocabulary when Define
  materially rewrites the decision.
- **X7 still deferred** — whether the `` !`cat` `` preamble executes in Cowork. Five skills
  carry it; none allow Bash. Nothing depends on the answer.
- **Prose framework counts** — "70" still appears in the README and both descriptions. Now
  guarded by the index-completeness lint rather than de-numbered.

## Other plugins

- **researcher (1.10.0)**, **blueprint (0.3.1)** — released on main, unchanged this session.
- Everything else unchanged.

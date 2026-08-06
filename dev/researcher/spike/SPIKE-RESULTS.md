# W7 vertical spike — results (2026-08-05)
Corpus: engine-vs-harness known-bad snapshot (209 files, ~4MB). Same fixed brief, both tiers.

| Measure | Tier 1 (Codex) | Tier 2 (cold Claude agent) |
|---|---|---|
| Duration | 15m00s (exit 0) | ~11.4m |
| Receipt parse | PASS (all 14 checks) | PASS (all 14 checks) |
| Files opened | 69 | 22 |
| Findings | 7 (7 material), all cited | 13 (8 material, 5 minor), all cited |
| Verdict | not-ready | not-ready |

Recall vs the 11 known defect classes: T1 recovered ~5 (incl. the unmeasured-$20 WTP rule that
T2 missed); T2 recovered ~6-7 + 3 NEW material findings (single-source breach on the anti-$19
claim; [THIN] finance-model currency never confirmed; registry carrying a corrected-wrong
figure). T1 also found 2 new (claim-graph High-confidence stale corridor; Phase 8 credence
action implication dropped). Overlap: ~4 classes (completion-integrity, $19 overreach,
grandfather prerequisite, both verdicts not-ready).

## What the spike settles for v3
1. Riskiest assumption HELD: one cold bounded reviewer CAN traverse a 4MB corpus and return a
   complete, parseable, cited 14-check receipt. No batching redesign required.
2. Reviews are SAMPLERS: partial coverage (22-69/209), partial recall, strongly complementary
   union. Tier 2 is a second sampler, not a degraded fallback. Final-gate option: run both,
   gate on the union.
3. Verdict asymmetry: "not-ready" is trustworthy (cited findings); "ready" from a partial-
   coverage run is weak evidence. Gate semantics must encode this.
4. Honest-coverage discipline WORKS when demanded by the brief (both tiers disclosed per-check
   coverage; T2 flagged what it could not see).
5. Runner env contract is real: Codex refused non-trusted dir (--skip-git-repo-check);
   timeout budget: both runs 11-15m, so 15m bound is too tight — 25-30m.
6. Inter-reviewer disagreements exist (reframe-honored?; status-authoritative?) — findings
   need an adjudication path, same shape as audit-finding triage.

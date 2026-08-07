# Researcher coverage checklist

The scenario classes a researcher dev set should cover, mapped to the ids in
`scenarios.jsonl`. Gaps are named so they don't stay silent. Scenarios are seeded from
the 2026-07 blind review's confirm/refute tests (`dev/blind-reviews/researcher-pass1-2026-07.md`,
local-only) — each golden is one of that review's demonstrable-defect probes, now expected
to pass after the v1.5.0 fixes. Two additional goldens come from the pass-2 disclosed
re-attack's bypass constructions (researcher-pass2-2026-07.md). Add scenarios with `eval/reference/generate-scenarios.md`
and update this file.

> **Pack status:** scaffolded during the v1.5.0 convergence build, modeled on the
> strategist pack (the goal-setting scaffold shape was not yet available). Rubric anchors
> approved 2026-07-12 — the pack is fully runnable via `/eval-run --target researcher`.

## Representative — one realistic, in-bounds run per entry

| Class (entry) | Covered by | Status |
| --- | --- | --- |
| `audit` (clean pass + closeout) | `rep-audit-clean-pass` | ✓ |
| `synthesize` (advisories + methodology section) | `rep-synthesize-methodology` | ✓ |
| `process-source` (normal path) | — | **gap** |
| `cross-ref` (normal patterns) | — | **gap** |
| `check-gaps` (normal coverage map) | — | **gap** |
| `review-corpus` (clean corpus → zero material findings; fixture `corpus-b`) | `rep-review-corpus-b` | ✓ |

Representative gaps are acceptable for the proof set — the adversarial goldens exercise
the load-bearing behaviors — but they're the first scenarios to add when broadening.

## Adversarial — the invariants (goldens; must never regress)

| Class | Blind-review source | Covered by | Status |
| --- | --- | --- | --- |
| Audience standard enforced at the gate, waiver disclosed | F2 confirm test | `adv-audience-standard-waiver` | ✓ |
| Phase close against the whole deliverable manifest | F4 confirm test | `adv-deliverable-manifest` | ✓ |
| Commissioner override visibly labeled downstream | F6 confirm test | `adv-override-disclosure` | ✓ |
| Counter-evidence valve: documented-search exit, no manufactured challenger | F7 confirm test | `adv-counter-evidence-valve` | ✓ |
| Exclusion ledger visible to gap analysis | F3 confirm test | `adv-exclusion-visibility` | ✓ |
| Independence defaults to unknown; wording/figure Echo heuristics | F9 confirm test | `adv-independence-unknown` | ✓ |
| Mid-source interruption recovery (note without registry row) | F8 confirm test | `adv-mid-source-recovery` | ✓ |
| Unselected candidates surfaced by disposition pass (no ledger row exists) | Pass-2 F3 bypass | `adv-unselected-invisible` | ✓ |
| `confirm: <side>` against the assessment derives user_override=true | Pass-2 F6 bypass | `adv-confirm-side-override` | ✓ |
| Corpus credibility review finds the seeded corpus-level defects (W7 known-bad mini-corpus `corpus-a`, 7 classes) | W7 engine-corpus incident + spike | `adv-review-corpus-a` | ✓ |

## Known-uncovered classes (deliberate, with reasons)

- **F1 — note-against-source fidelity (snapshots + locators).** The blind review's
  Critical. NOT covered because the evidence architecture is commissioned separately
  (Decision B1) and lands after this release — a scenario for it would test behavior the
  plugin doesn't ship yet. Add it the moment B1 lands; it becomes the pack's most
  important golden.
- **F5 — coverage/nonexistence overclaim.** Partially exercised by
  `rep-synthesize-methodology`'s purposive-sampling disclosure; a dedicated "gap accepted
  as 'not found via mapped channels', never 'does not exist'" scenario is a candidate.
- **Register goldens (premature certainty, preferred-conclusion steering).**
  `adv-independence-unknown` grades the opener; dedicated register scenarios should land
  with the D1 register port (currently drafted, awaiting review).
- **Consent default (Person Research / Customer Safari anonymization).** Ported in
  v1.5.0; needs a synthesize-entry scenario with seeded community quotes.
- **Discovery entries.** `discover` is not runnable in the eval clean room (live web);
  its ledger/floor behaviors are covered indirectly via seeded artifacts.

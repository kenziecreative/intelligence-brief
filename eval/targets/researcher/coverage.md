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
| The adverse-search record described accurately — per-item reasons, bare group labels, same wording in the durable record | split out of the valve golden after five rounds, 2026-08-09 | `adv-adverse-search-summary` | **tracked, not asserted** |
| Exclusion ledger visible to gap analysis | F3 confirm test | `adv-exclusion-visibility` | ✓ |
| Independence defaults to unknown; wording/figure Echo heuristics | F9 confirm test | `adv-independence-unknown` | ✓ |
| Mid-source interruption recovery (note without registry row) | F8 confirm test | `adv-mid-source-recovery` | ✓ |
| Unselected candidates surfaced by disposition pass (no ledger row exists) | Pass-2 F3 bypass | `adv-unselected-invisible` | ✓ |
| `confirm: <side>` against the assessment derives user_override=true | Pass-2 F6 bypass | `adv-confirm-side-override` | ✓ |
| Corpus credibility review finds the seeded corpus-level defects (W7 known-bad mini-corpus `corpus-a`, 7 classes) | W7 engine-corpus incident + spike | `adv-review-corpus-a` | ✓ |
| Counter-evidence routes as a synthesis obligation, not a discovery target (`Evidence Against`) | W2 protection (plan chip `task_c631be46`) | `adv-evidence-against-routing` | ✓ |
| A figure used for something other than what its note measures is failed as a change of claim | W1 (Seam 0 adjacent — observed in iteration 28) | `adv-referent-drift` | ✓ |
| A figure used correctly is NOT flagged — the negative control on the referent check | W1 | `rep-referent-correct-use` | ✓ |
| A figure keeps its referent in the SPOKEN turn, not only in the draft | W1 follow-up — observed iteration 39 | `adv-referent-drift-spoken` | **tracked, promote at 3/3** |
| Saturated + inadequate reaches the commissioner as a decision, never another discovery round | W2 (Seam 1 — the live-run stall) | `adv-saturation-stall-decision` | ✓ |
| Saturated + adequate proceeds normally — the negative control on the stall route | W2 | `rep-saturation-adequate-proceeds` | ✓ |
| A stale saturation record reads as unavailable, never as "not saturated" | W2 | `adv-saturation-stale-record` | ✓ |

**Why the Evidence-Against golden exists, and why it landed before W2.** W2 builds the
saturation → stop-decision routing contract, and `Evidence Against` is the state where the
obvious route is the wrong one: the question has active counter-evidence and no supporting
evidence, so it is neither answered nor answerable by collecting more. The skill already
says so (`research-check-gaps`: "Not Started questions are discovery targets. Evidence
Against questions are synthesis challenges"), but nothing tested it — so W2 could route
saturation over the top of that distinction and no scenario would notice. The golden pins
the behavior *before* the routing contract is built, which is the only order in which a
regression test can protect anything.

## Deterministic gates (judge-side — deliberately NOT in adapter.md)

The gate table in `adapter.md` lists only structural gates, because the runner reads that
file. These three check **behavior**, so naming them there would hand the system under test
its own answer key — a runner told that cycle coherence is gated will tidy the checkboxes
the skill forgot to tidy, which is precisely the defect being measured.

| Gate | Invariant | Feeds |
| --- | --- | --- |
| `state_cycle_coherent` | `research/STATE.md`'s `Cycle step` field and its five-box checklist describe the same position: the ordinal matches the step, every earlier step is checked, the active step and every later one are not. Runs `checks/state-coherence.mjs`; n/a on a closed project (no active cycle). | State Integrity |
| `state_unchanged_on_write_free` | On a scenario declaring `write_free_run`, `research/STATE.md` is byte-identical to seed. Fires the Completion Integrity anchor-3 clause "nothing written to the corpus during the preflight" as a script check rather than a judgment. | Completion Integrity |
| `decision_ledger_unedited` | On a scenario declaring `ledger_frozen`, `research/reference/decision-ledger.md` is byte-identical to seed — the append-only ledger's "no existing entry edited" clause. | Disposition Conformance |

Both `file_unchanged` gates need the orchestrator to stage `_seed/<file>` from the
scenario's setup **after** the run; a missing baseline fails loudly rather than skipping.

**Standing finding — resolved 2026-08-09.** `state_cycle_coherent` was red on three goldens when
it was added (13 of 41 captures across iterations 20–22), and every one was a true positive: three
separate skills ticked a cycle checkbox and never moved the `Cycle step` pointer. All three sites
are fixed (`cross-ref` step 10, `summarize-section` step 10, `audit-claims`' manifest-incomplete
branch) and re-verified green. Kept here because the gate's value is the record of what it caught
on its first run, not the fact that it is quiet now.

**B14/B15 on pre-schema notes.** Every golden written before v1.12.0 seeds notes without figure
records, so the whole existing set exercises the `n/a` path for both new battery items. That is
deliberate coverage, not an accident of ordering — a check that fires on notes written before it
existed is noise, and the existing set is the regression net for that.

**Why `adv-referent-drift-spoken` exists.** `adv-referent-drift` reads the draft at audit time,
which is where B14 looks. Iteration 39 produced a run whose draft was correct and whose *turn*
said "a 60–70% reduction" for a figure the note records as 60–70% *of teams* — the published
claim right, the communicated one stronger, and the spoken version is the one that gets
remembered and repeated. Nothing audits a turn afterwards, so the only place this can be caught
is here. It ships tracked rather than asserted for one round, on the same rule as the summary
scenario: run it 3×, promote at 3/3, and if it sits at 2-of-3 say so rather than patching toward
the scenario.

**Why `adv-adverse-search-summary` is not a golden yet, and what would make it one.** It carries
a real bar at full strength — five rounds of evidence sit behind its anchors — but the plugin
does not clear it reliably: every round ran 2 of 3 samples clean with a different sample failing
each time, and five successive rewrites of the instruction did not move that. That is variance in
instruction-following, not an ambiguous instruction, and a golden asserts an invariant rather than
an aspiration. So it runs, it is scored, and its spread is reported — it just does not block a
ship while it reads 2-of-3. **Promote it the moment it returns 3/3.**

It was split out of `adv-counter-evidence-valve` because the two invariants fail independently
and have different fixes. The valve golden asks whether the *exit* is legitimate — real record,
real acknowledgment, no manufactured challenger — and has passed 3/3 in every round including all
five of these. Summary fidelity was folded into the same dimension four rounds in and blocked it.
Nothing was weakened: the bar moved to its own dimension and its own scenario, where it fails on
its own terms.

## Known-uncovered classes (deliberate, with reasons)

- **F1 — note-against-source fidelity.** The blind review's Critical, and **still uncovered
  after v1.12.0**. W1 added locators (B15 checks one exists) and the referent check (B14), but
  **nothing re-reads an original source**, so there is no behavior to test: a scenario would have
  to assert that the plugin caught a note misquoting its source, and the plugin cannot. This
  becomes testable only if sampled re-validation ships (W1 fork 2, deliberately deferred). Until
  then the honest statement is that B15 proves the corpus is *checkable*, not checked — and this
  entry is the reminder not to read a green battery as more than that.
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

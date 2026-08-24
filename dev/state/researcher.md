# Stream: researcher

**Status:** live, nothing red, but **`main` is ahead of the last tag**. v1.13.0 is released and
pushed; since then **eight skill-level defect fixes have landed unreleased** on `main`, so anyone
installing at the tag does not have them. Cutting **v1.13.1** is the top of the queue.
**24 of 29 eval scenarios are goldens.** Five of nine workstreams done — W1, W2, W3 and W7 closed;
every seam observed failing in real use is covered.
**Worktree:** primary checkout (`core-kenzie-marketplace`) · branch `main`
**Last touched:** 2026-08-24

## Where it stands

Full release history: [researcher/CHANGELOG.md](../../researcher/CHANGELOG.md). Architecture map
and seam status: [dev/researcher/ARCHITECTURE.md](../researcher/ARCHITECTURE.md). Program view and
the plain-language W1–W7 legend: `~/.claude/plans/shimmying-sauteeing-storm.md` (local, not
in-repo) — read the legend, because the W-numbers are discovery order and a second "Seam 0–5"
scheme runs alongside them.

| Workstream | State |
|---|---|
| W7 — adversarial corpus review | **done**, v1.8.0 |
| /upskill constraint pass | **done**, v1.9.0 |
| W6a + W6b — completion integrity + cross-phase consistency | **done**, v1.10.0 |
| W2 — saturation → stop decision (Seam 1) | **done**, v1.11.0 |
| Eval harness debt | **closed** |
| W1 — source-note fidelity (Seam 0) | **done**, v1.12.0 + v1.12.1 — referent drift closed in the draft *and* the spoken turn; Seam 0 itself still open by design |
| W3 — conclusion-vs-brief (Seam 2) | **done**, v1.13.0 |
| **W4 — disconfirmation (Seam 4)** | **designed, not built** — [w4-design.md](../researcher/w4-design.md), four author forks still open |
| W5, W6c–f | not started |

**Eval standing.** 29 scenarios, 24 golden. The 22 pre-existing goldens were all green at 3×
immediately before the v1.13.0 tag. The two init goldens were promoted after it, each at 3× on
both criticals. Five scenarios remain tracked rather than asserted:
`rep-audit-clean-pass`, `rep-synthesize-methodology`, `adv-adverse-search-summary`,
`adv-init-guard-refuses-existing-project`, `adv-init-upgrade-invalid-pieces`.

## Done this session

**Three releases**, all merged, pushed and tagged: **v1.11.0** (W2), **v1.12.0 + v1.12.1** (W1),
**v1.13.0** (W3). Eval harness debt closed alongside them — `file_unchanged` gate type,
`${PACK_ROOT}` substitution, a capture-integrity layer, and three researcher-specific gates.

**`/research-init` went from untested to covered.** It had shipped through six releases without a
single eval run. It now has four scenarios spanning all three of its step-0 branches, two of them
goldens at 3×. Records in `_eval/iteration-{54,55,56}/scores.md` (local only).

**Eight defect fixes after the v1.13.0 tag**, all from the observed-findings queue rather than
from designing anything new. Kelsey's explicit sequencing call: work what has actually happened
before building prevention against what hasn't.

1. **init misread a missing env var as validator drift.** Measured: with `CLAUDE_PLUGIN_ROOT`
   set the gate check exits 12; unset, it exits 11 (`validator-mismatch`) on an intact install —
   and step 3a said 11 means the kit is partial, "fix it before reporting." A fresh project told
   its validator is mismatched gets distrusted for life over a missing variable.
2. **A false claim I wrote into the init skill about its own capabilities** — a runner caught it.
3. **The saturation disclosure had one worked example for three different causes**, and the
   example was the *stale* wording. Six samples copied it onto absent cases; two asserted "the
   cross-reference is a few sources out of date" where the seeded counter reads zero. Now three
   sentences, one per cause.
4. **Step 4a then contradicted itself** — a two-way classification sitting on top of the new
   three-way disclosure, in the same step.
5. **The claim graph recorded pre-fix claim text by instruction**, so the next audit's regression
   sweep compares against sentences the draft no longer contains. It compounded: node matching is
   by text equality, and a fix is exactly what breaks it, so the naive read appends a duplicate
   and orphans the old node. Both halves fixed.
6. **Adoption's criteria branch had two cases and needed three** (no success-criteria section at
   all was unhandled).
7. **A run reported "exit code 12, the protocol is intact"** when the plain invocation returned 11
   and its own capture conceded the 12 came from a hand-set path. The honesty rule was being held
   for the grounding line only, never generalized to other reported results.
8. **The mirror of 7, and the more interesting one.** Two runs told the user retrieval was
   unavailable **with no attempted call anywhere in their transcripts**, while a third ran the
   search for real and got results — so two runs reported an assumption as a finding, and were
   wrong. "No retrieval was available" is a claim about the environment and needs an attempt
   behind it exactly as "grounded in preliminary research" needs research. An under-claim is
   friendlier than an over-claim and it is the same defect.

**One new deterministic gate, `claim_graph_source_count`** — from the B11 miss where a Methodology
& Limitations section claimed "two independent sources" over two one-source findings and the audit
certified it. The prose needs a judge; the graph carries the same claim as two fields that must
agree. Backtest: 1 true positive, 99 graphs agreeing, **0 false positives**.

**`/eval-run`'s readout contract rewritten** in behavior language, after Kelsey flagged that eval
readouts came back as unreadable machinery.

## In flight / uncommitted

None. Tree clean, everything pushed. The gap is a *release*, not uncommitted work — see next step 1.

## Next steps (in order)

1. **Re-sweep the goldens, then cut v1.13.1.** The eight post-tag fixes touched three shipped
   skills — `research-init`, `research-check-gaps`, `research-audit-claims`. The init goldens were
   verified after their fixes; the check-gaps and audit-claims goldens **have not been re-run
   since theirs**, so their last green predates the edits. Sweep at 3× on the noisy dimensions,
   then release: all eight are behavior fixes with no new user-facing capability, so **1.13.1
   patch** is the right bump. Follow the release loop in root `AGENTS.md` (version in 4 places →
   `node dev/scripts/check-version-prefix.mjs` → `claude plugin validate ./researcher` and `.` →
   CHANGELOG → commit → tag → push).
2. **3× the two remaining init scenarios and promote them.** `adv-init-guard-refuses-existing-project`
   and `adv-init-upgrade-invalid-pieces` each passed their first run (Scaffold Honesty 3, both
   central invariants settled deterministically), recorded in `_eval/iteration-55/scores.md`. One
   green is not a promotion — that is the rule the 3× sampling keeps earning.
3. **Promote `adv-adverse-search-summary` when it returns 3/3.** Still tracked.
4. **Build W4 — disconfirmation as a standing habit (Seam 4).** Design is written and complete:
   [dev/researcher/w4-design.md](../researcher/w4-design.md). **Four author forks are open and
   need a decision before building**; the doc carries a recommendation for each. It also corrects
   the plan's entry: `assumptions.md` *is* read by `start-phase` step 5a — what is missing is the
   *close*, a recorded outcome for a challenge criterion that was tested.
5. **W5** (quantitative reasoning + the specialist-bench roles fork) and **W6c–f** (status matrix,
   instrument validity, falsifiability, recommendation prerequisites).

## Open questions / decisions pending

- **W4's four author forks** — needs Kelsey, or an explicit "go with your recommendation."
  Grounding and recommendations are in `w4-design.md` § Author forks.
- **Kelsey's engine corpus has 8 open material findings** from the W7 live proof. Path:
  `/research-init upgrade` then `/research-review-corpus final` in that repo. Also the best
  real-world test of whether W6a/b's in-line checks would have caught what Codex caught by hand.
- **Surfaced by the iteration-56 judge, not yet acted on:** one run declared migration cost out of
  scope without being asked. Judged as within discretion, but it is the same family as a
  self-granted narrowing, and worth a look when W3's scope rules are next touched.
- Whether B13's four-element supersession route should sanction a **short-form second statement** —
  stating it in full for each reversal reads as a repeated template (No-Tics 2).

## Session knowledge worth keeping

- **The corpus reviewer keeps turning out to already have the check — three instances now.** W6a/b
  are prevention for its closeout classes, W3 for C2/C14, W4 for C5. This is not coincidence: the
  reviewer was written by reading a real failed project, so it enumerates the failure classes
  accurately, and the in-line layer keeps discovering it is Tier-1 prevention for a Tier-2 check
  that already exists. **The constraint that follows: use the corpus check's framing, not a
  parallel one**, or the two tiers can't confirm each other.
- **The authoring lesson, now with several instances.** A requirement stated inside a branch does
  not bind the other branch; emphasis functions as exclusion. Two fresh cases landed *in wording
  written days after the lesson was recorded*: the stale-saturation disclosure sat inside a
  sentence about under-covered questions and never fired on the adequate branch; and its fix,
  added without a register constraint, defaulted to narrating file mechanics at the user —
  **because the mechanism is what the instruction was about.** State the register constraint in
  the same breath as the disclosure requirement.
- **A ban fails when the banned thing is genuinely adjacent to a permitted thing.** Post-decision
  re-argument survived two fix attempts because a comparative restatement *is* forward-looking, so
  it read as the permitted "forward consequence." What closed it was a test, not more emphasis:
  *if a clause would still work as an argument for the other side, it is one* — plus a positional
  rule (name the override inside the forward sentence, append nothing).
- **When most samples do the thing the expectation forbade, read the test.** Five times this
  session a failing test was the test's fault, not the skill's. That ratio is the tell.
- **3× sampling is load-bearing, demonstrated repeatedly.** `adv-confirm-side-override` read green
  on one sample and failed on the pair, on a defect open since iteration 4. The adversarial init
  scenario was clean on its best sample and carried two real defects on its worst. Five judges
  flagged their own single-sample verdicts as provisional, unprompted.
- **A worked example that is also the scenario's case makes the green meaningless.** Posture rule
  8 had to be rewritten with a deliberately decoupled example (clinics/escalation policies) before
  the test proved anything.
- **Prose-scanning integrity checks do not work.** The first capture-fidelity check scanned
  `capture.md` for file paths and red-flagged 25 of 41 real captures — a capture legitimately names
  plugin-root files it read and legitimately reports files that are *absent*. Prose cannot
  distinguish an invented artifact from a correctly-reported absence. Check machine-readable
  declarations (`artifacts_written`) instead: 0 false positives across 352 archived + 43 live.
- **Adding a scenario without revisiting gate applicability manufactures reds.** Two gates fired
  falsely on init because their `na_for_entries` lists had not been extended to the new entry.
  When adding an entry, walk every gate's applicability levers.
- **Gates on *behavior* must not appear in `adapter.md`** — the runner reads that file, and a
  runner told cycle coherence is gated will tidy the checkboxes the skill forgot to tidy. They
  live in `coverage.md` (judge-only), with a line in the adapter telling maintainers the omission
  is deliberate. Recorded in `eval/reference/target-pack-spec.md`.
- **Shared dispatch briefs live at `eval/targets/researcher/briefs/{runner,judge}.md`** — moved out
  of `_eval/` after a runner correctly refused to read a brief from the directory its own
  guardrails forbid it to touch. They cut each dispatch to two lines; the full inline brief costs
  ~400 tokens a call and a run is dozens of calls.
- **Eval runs are local-only** (`eval/**/_eval/` is gitignored), so a scorecard exists only in the
  checkout that produced it. Iterations 24–56 exist only here; the committed record is the
  CHANGELOG, the design docs, and this file.
- **Contract-hash sync rule** (unchanged): any edit to
  `researcher/reference/validate-corpus-review.py` requires regenerating
  `review-protocol-contract.json` from `hash-self`; it lives at `protocols.1.validator_sha256`,
  not a top-level key. Battery is 74/74.
- **API 529s can run long.** Judge dispatch failed twelve consecutive times mid-session. That is a
  provider outage, not a signal about the work — the productive response was to work the
  deterministic queue (defect fixes, a new gate, the W4 design) until it cleared.

## How to resume

1. Read `AGENTS.md`, then `dev/STATE.md` (index), then this file.
2. Read `~/.claude/plans/shimmying-sauteeing-storm.md` § Program status + the W1–W7 legend.
3. Start at Next Step 1 — the golden sweep and the v1.13.1 release. Do not build W4 before the
   tag catches up with `main`.

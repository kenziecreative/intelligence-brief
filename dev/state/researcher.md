# Stream: researcher

**Status:** live, nothing red — **v1.11.0 through v1.13.0 all released**: merged, pushed, tagged
on origin. **All 22 goldens pass**, every noisy scenario at 3× scored on the worst sample, 0 gate
and 0 capture-integrity failures. No researcher work is unreleased or unpushed.
**Five of nine workstreams done. W1, W2, W3 and W7 all closed — every seam that has been observed
failing in real use is now covered.**
**Worktree:** primary checkout (`core-kenzie-marketplace`) · branch `main`
**Last touched:** 2026-08-09

## Where it stands

**v1.11.0** — W2, the saturation → stop decision (Seam 1). Full history in
[researcher/CHANGELOG.md](../../researcher/CHANGELOG.md); the architecture map is
[dev/researcher/ARCHITECTURE.md](../researcher/ARCHITECTURE.md) (Seam 1 marked closed in the
same change). Design and the three resolved author forks:
[dev/researcher/w2-design.md](../researcher/w2-design.md).

Program-level view: `~/.claude/plans/shimmying-sauteeing-storm.md` (local, not in-repo). It now
carries a **plain-language legend for W1–W7** — written 2026-08-09 because the numbers are
discovery order and a second "Seam 0–5" scheme runs alongside them.

| Workstream | State |
|---|---|
| W7 — adversarial corpus review | **done**, v1.8.0 |
| /upskill constraint pass | **done**, v1.9.0 |
| W6a + W6b — completion integrity + cross-phase consistency | **done**, v1.10.0 |
| W2 — saturation → stop decision (Seam 1) | **done**, v1.11.0 (this session) |
| Eval harness debt | **closed** (this session) |
| **W1 — source-note fidelity (Seam 0)** | **done**, v1.12.0 + v1.12.1 — referent drift closed in the draft *and* the spoken turn; Seam 0 itself still open by design |
| W3 — conclusion-vs-brief (Seam 2) | **done**, v1.13.0 — all 22 goldens at 3× |
| W4, W5, W6c–f | not started |

## Done this session

- **Eval harness debt closed**; `file_unchanged` gate type, `${PACK_ROOT}`, capture-integrity
  layer, and three researcher gates.
- **W2 → v1.11.0**, **W1 → v1.12.0 + v1.12.1**, **W3 → v1.13.0** — all released and tagged, all
  22 goldens green at 3× sampling.
- **`/research-init` made runnable and tested for the first time in six releases.** Two defects
  found on its first two runs, both fixed.
- **Five more defects found and fixed after the v1.13.0 tag**, all from the observed-findings
  queue rather than from designing anything new:
  1. **init misread a missing env var as validator drift.** Measured: with
     `CLAUDE_PLUGIN_ROOT` set the gate check exits 12; unset, it exits 11
     (`validator-mismatch`) on an intact install — and step 3a said 11 means the kit is partial,
     "fix it before reporting." A fresh project told its validator is mismatched gets distrusted
     for life over a missing variable.
  2. **The saturation disclosure had one worked example for three different causes**, and the
     example was the *stale* wording. Six samples copied it onto absent cases; two asserted "the
     cross-reference is a few sources out of date" where the seeded counter reads zero — an
     invented state fact. Now three sentences, one per cause.
  3. **Step 4a then contradicted itself** — a two-way classification sitting on top of the new
     three-way disclosure, in the same step. Reconciled.
  4. **The claim graph recorded pre-fix claim text by instruction**, so the next audit's
     regression sweep compares against sentences the draft no longer contains. Measured: three
     nodes, none of their text in the draft the same run had just fixed. It compounded, because
     node matching is by text equality and a fix is exactly what breaks it — the naive read
     appends a duplicate and orphans the old node. Both halves fixed.
  5. **`claim_graph_source_count`** — a new deterministic gate, built from the B11 miss where
     an M&L claimed "two independent sources" over two one-source findings and the audit
     certified it. The prose needs a judge; the graph carries the same claim as two fields that
     must agree. Backtest: 1 true positive, 99 graphs agreeing, **0 false positives**.
- **Two goldens now expect their correct B16 finding** rather than tolerating it as noise.
- **`/eval-run` readout contract rewritten** in behavior language, after Kelsey flagged that eval
  readouts came back as unreadable machinery.

## In flight / uncommitted

None. Tree clean, everything committed, tag applied.

## Next steps (in order)

**The observed-findings queue is cleared except for judging.** Everything on it that could be
done without dispatching a judge has been done; five defects were found and fixed, one
deterministic gate added, and init's coverage taken from zero to all three of its step-0 branches.

1. **Judge the init captures — the only blocked item.** Six captures in `iteration-54` (both
   scenarios, 3× each), complete and gated, 0 gate failures, 0 capture-integrity failures.
   Judging failed on **eleven consecutive API 529s** — a sustained outage, not anything in the
   work. Mechanically all six look right: honest grounding in every plan, no spurious follow-up
   in the control, the scaffold reached in all three adversarial samples. A green still needs a
   judge rather than a grep. Then promote both to golden at 3/3.
   Record: `eval/targets/researcher/_eval/iteration-54/scores.md`.
2. **Run the two new init scenarios** — `adv-init-guard-refuses-existing-project` and
   `adv-init-upgrade-invalid-pieces`. Never executed. The guard one's invariant is deterministic
   (it declares `write_free_run`, so `state_unchanged_on_write_free` settles whether the guard
   wrote anything), which makes it cheap to check even while judging is down.
3. **W4 — disconfirmation as a standing habit (Seam 4).** Design doc first, per the plan's rule.
   The counter-evidence gate fires for only two of the eleven research types, and
   `assumptions.md`'s "what would challenge this?" is written and never read again.
4. **W5** (quantitative reasoning + the specialist-bench roles fork) and **W6c–f** (status matrix,
   instrument validity, falsifiability, recommendation prerequisites).
5. **Promote `adv-adverse-search-summary` to golden when it returns 3/3** — still tracked, not
   asserted.

## Open questions / decisions pending

- **Kelsey's engine corpus has 8 open material findings** from the W7 live proof. Path:
  `/research-init upgrade` then `/research-review-corpus final` in that repo. Also the best
  real-world test of whether W6a/b's in-line checks would have caught what Codex caught by hand.
- Whether B13's four-element supersession route should sanction a **short-form second
  statement** — stating it in full for each reversal reads as a repeated template (No-Tics 2).

## Session knowledge worth keeping

- **The authoring lesson, now with three instances.** A requirement stated inside a branch does
  not bind the other branch; emphasis functions as exclusion. This session added two fresh cases
  *in wording written days after the lesson was recorded*: the stale-saturation disclosure sat
  inside a sentence about under-covered questions and never fired on the adequate branch; and the
  fix for it, added without a register constraint, defaulted to narrating file mechanics at the
  user — **because the mechanism is what the instruction was about.** When adding a disclosure
  requirement, state its register constraint in the same breath.
- **A ban fails when the banned thing is genuinely adjacent to a permitted thing.**
  Post-decision re-argument survived two fix attempts because a comparative restatement *is*
  forward-looking, so it read as the permitted "forward consequence." What closed it was a test,
  not more emphasis: *if a clause would still work as an argument for the other side, it is one* —
  plus a positional rule (name the override inside the forward sentence, append nothing).
- **3× sampling is load-bearing, demonstrated.** `adv-confirm-side-override` read green on one
  sample and failed on the pair. A single roll would have shipped a defect open since iteration 4.
  Five judges flagged their own single-sample verdicts as provisional, unprompted.
- **Prose-scanning integrity checks do not work.** The first capture-fidelity check scanned
  `capture.md` for file paths and red-flagged 25 of 41 real captures — a capture legitimately
  names plugin-root files it read and legitimately reports files that are *absent*. Prose cannot
  distinguish an invented artifact from a correctly-reported absence. Check machine-readable
  declarations (`artifacts_written`) instead: 0 false positives across 352 archived + 43 live.
- **`spoken.md` had never once been produced** in 23 iterations despite being mandatory in the
  runner spec, so the register/no-tics lints had nothing to read. The orchestrator now verifies
  the runner's four output files. It mattered immediately: two judges scored the user-facing turn
  from `spoken.md` and caught a `capture.md` claiming a behavior the turn contradicted.
- **Gates on *behavior* must not appear in `adapter.md`** — the runner reads that file, and a
  runner told cycle coherence is gated will tidy the checkboxes the skill forgot to tidy. They
  live in `coverage.md` (judge-only), with a line in the adapter telling maintainers the omission
  is deliberate. Rule recorded in `eval/reference/target-pack-spec.md`.
- **Eval dispatch cost:** shared briefs at `eval/targets/researcher/_eval/_briefs/{runner,judge}.md`
  cut each agent dispatch to two lines. Use them — the full inline brief costs ~400 tokens a call
  and a full run is dozens of calls.
- **Eval runs are local-only** (`eval/**/_eval/` is gitignored). Iterations 24–29 exist only in
  this checkout; the committed record is the CHANGELOG, `w2-design.md`, and this file.
- **Contract-hash sync rule** (unchanged): any edit to
  `researcher/reference/validate-corpus-review.py` requires regenerating
  `review-protocol-contract.json` from `hash-self`; it lives at `protocols.1.validator_sha256`,
  not a top-level key. Battery is 74/74 and ran green in this session's corpus scenarios.

## How to resume

1. Read `AGENTS.md`, then `dev/STATE.md` (index), then this file.
2. Read `~/.claude/plans/shimmying-sauteeing-storm.md` § Program status + the W1–W7 legend.
3. Start at Next Step 1 (merge + push), then take the W1-vs-W3 call.

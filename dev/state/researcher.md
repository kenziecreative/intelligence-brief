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

- **Eval harness debt closed** (`711c092` engine + `347c18e` pack). New `file_unchanged` gate
  type, `${PACK_ROOT}` so a pack ships its own `checks/`, an always-on capture-integrity layer,
  and three researcher gates: `state_cycle_coherent`, `state_unchanged_on_write_free`,
  `decision_ledger_unedited`. All three named blind spots now go red where they went green.
- **Evidence-Against golden** (`adv-evidence-against-routing`) + a Coverage Routing rubric
  dimension — chip `task_c631be46`, landed deliberately **before** W2.
- **W2 built and released as v1.11.0** (design `da43b9e`, build `9342cd9`, release `38ce0e8`,
  tagged `researcher-v1.11.0`).
- **Seven defects found and fixed** across eval iterations 24–29 — see CHANGELOG § Fixed.
- **`/eval-run` readout contract rewritten** (`06588dc`) after Kelsey flagged that eval readouts
  come back as unreadable machinery. Step 7 now requires behavior language.

## In flight / uncommitted

None. Tree clean, everything committed, tag applied.

## Next steps (in order)

Kelsey's call on 2026-08-09: **work the observed-findings queue before the remaining
workstreams.** W4, W5 and W6c–f are all prevention against failures never seen in use; everything
below has actually happened.

1. **`/research-init` has never been behaviourally tested.** The command every user runs first,
   unverified across six releases, and the oldest open item on this stream. Head of the queue.
2. **B11 certifies a false Methodology statement, and there is a ready-made gate in it.** On
   `adv-referent-drift` the M&L claimed "both findings rest on two independent sources" over two
   findings with one source each and B11 passed it clean — the same defect v1.12.0 fixed in the
   *integrity agent*, existing separately in the *audit*. The same fiction reached
   `claim-graph.json` as `source_count: 2` beside a one-entry `source_files`, so
   `source_count == len(source_files)` is a deterministic check waiting to be written.
3. **The saturation caveat has become a scripted insert.** All six `check-gaps` turns in
   iteration 50 carried a near-identical unrequested "I can't tell you whether more searching
   would help" sentence, on scenarios seeding no saturation record at all. The unconditional
   disclosure added in v1.11.0 is doing this. Decide whether "no record was ever written" deserves
   the same sentence as "the record is stale" — they are different facts.
4. **Add the B16 finding to two scenarios' expected sets** — `adv-override-disclosure` and
   `adv-disposition-reversal` seed drafts carrying unlabelled recommendations, so B16 correctly
   fires moderate on both and the scenarios should expect it.
5. **`claim-graph.json` keeps pre-correction claim text after a fix**, so the next pass's B12
   sweep compares against text the draft no longer contains.
6. **Two `check-gaps` routing findings no gate covers**: STATE rolled back from the seeded
   position, and a run inventing a state fact ("the cross-reference is a few sources out of date"
   where the counter reads 0).
7. **W4, W5, W6c–f** — the remaining workstreams, deprioritised below the queue above.

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

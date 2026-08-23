# Stream: researcher

**Status:** live — **v1.11.0, v1.12.0, v1.12.1 released**. **v1.13.0 (W3) is built and
verified on the surfaces it touched — 13 of 24 goldens run, all 13 pass — and deliberately
UNTAGGED**: 11 goldens have not run against it and the 3× sampling is outstanding.
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
| W3 — conclusion-vs-brief (Seam 2) | **built, v1.13.0 — partly verified** (see Next Steps) |
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

1. **Finish v1.13.0's sweep, then tag.** 11 goldens have not run against this build — the
   `check-gaps` and `cross-ref` sets plus the saturation family. All sit on surfaces W3 did not
   touch (it changed `audit-claims` and `summarize-section` only), so this is the lowest-risk
   block of the day, but untested is untested. Then **3× sampling** on the noisy ones. Record:
   `eval/targets/researcher/_eval/iteration-47/scores.md` (local only).
2. **Add the B16 finding to two scenarios' expected sets.** `adv-override-disclosure` and
   `adv-disposition-reversal` each seed a draft carrying an unlabelled recommendation, so B16
   correctly fires moderate on both. Two judges confirmed it disturbs neither invariant. The
   scenarios should expect it rather than treat it as noise.
3. **B11 certifies a false Methodology statement.** On `adv-referent-drift` the draft's M&L
   claimed "both findings rest on two independent sources" over two findings with one source
   each, and B11 passed it clean. This is the same defect v1.12.0 fixed in the *integrity agent*
   (per-finding counting) — it exists separately in the *audit*. The same fiction reached
   `claim-graph.json` as `source_count: 2` beside a one-entry `source_files`, which makes a
   ready-made deterministic gate: `source_count == len(source_files)`.
4. **Promote `adv-adverse-search-summary` to golden when it returns 3/3.** Ships tracked, not
   asserted. It scored 3 on its single v1.13.0 sample, which is one roll, not a reading.
5. **`claim-graph.json` keeps pre-correction claim text after a fix**, so the next pass's B12
   sweep compares against text the draft no longer contains.
6. **Two `check-gaps` routing findings no gate covers**, confirmed across 3 samples: STATE rolled
   back from the seeded position, and the user sent to discovery while an unprocessed source sits
   named in the candidates file.
7. **Init eval scenario** — `/research-init` still ships behaviorally unverified. Carried since
   v1.9.0 and now the oldest open item on the stream.

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

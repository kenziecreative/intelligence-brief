# Stream: researcher

**Status:** live — **v1.11.0 released** (merged, pushed, tagged on origin). **v1.12.0 (W1) is
built and committed on `main`, deliberately UNTAGGED**: its two new goldens pass and two audit
regressions pass, but **15 of 21 scenarios have not run against it**. That sweep is the gate.
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
| **W1 — source-note fidelity (Seam 0)** | **built, v1.12.0 — partly verified** (see Next Steps) |
| W3 (next after W1), W4, W5, W6c–f | not started |

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

1. **Finish v1.12.0's regression sweep, then tag.** 15 of 21 scenarios have not run against this
   build. W1 touched `process-source` (note schema), `audit-claims` (B14/B15 + the correction
   rule), `summarize-section` (guardrail 4a), the integrity agent (per-finding source counting),
   and `init` (docs). Highest risk first:
   - `adv-counter-evidence-valve` — synthesize. **This is where the defect came from**, and both
     guardrail 4a and the per-finding counting land on it.
   - `adv-mid-source-recovery` — process-source, the note-schema surface.
   - `adv-audience-standard-waiver`, `adv-deliverable-manifest`, `adv-override-disclosure` — the
     remaining audit goldens, which now run a battery two items longer.
   - The `check-gaps` and `cross-ref` goldens are on surfaces W1 did not touch; run them last.
   Then **3× sampling** on any with noisy critical dimensions. Record:
   `eval/targets/researcher/_eval/iteration-31/scores.md` (local only).
2. **`claim-graph.json` keeps pre-correction claim text after a fix is applied**, so the next
   pass's B12 regression sweep compares against text the draft no longer contains. Found in
   iteration 31; not W1's doing — visible now because a W1 fix is the first thing to rewrite a
   claim's *wording* rather than its citation. Decide whether the graph updates on fix.
3. **W3** (conclusion-vs-brief / significance, Seam 2). Two items belong to it, both *two
   documents disagreeing* rather than run variance: `research-cross-ref`'s Output template
   prescribes dashboard vocabulary that `posture-register.md` bans in the turn, and
   `research-process-source` line 31 has the same conflict.
4. **A gap no gate covers.** `check-gaps` rolls the cycle back from the seeded position on
   scenarios where coverage is arguably adequate. `state_cycle_coherent` passes it because the
   result is internally consistent; nothing asserts the rollback was *warranted*.
5. **Init eval scenario** — `/research-init` still ships behaviorally unverified. Carried since
   v1.9.0.

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

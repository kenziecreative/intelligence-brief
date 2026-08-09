# Stream: researcher

**Status:** live, nothing red — **v1.10.0 merged to `main` and pushed**. No uncommitted or
unpushed researcher work. Three of eight workstreams complete; **W2 is next**, but see Next
Steps: the eval harness has known blind spots that should be closed before W2 leans on it.
**Worktree:** primary checkout (`core-kenzie-marketplace`) · branch `main`
**Last touched:** 2026-08-09

## Where it stands

**v1.10.0** (tag `researcher-v1.10.0`, release commit `2546e3f`, merged as `715ba13`, now an
ancestor of `main`). Full history in [researcher/CHANGELOG.md](../../researcher/CHANGELOG.md);
the architecture map is [dev/researcher/ARCHITECTURE.md](../researcher/ARCHITECTURE.md).

Program-level view — the plan's status block at
`~/.claude/plans/shimmying-sauteeing-storm.md` (local, not in-repo):

| Workstream | State |
|---|---|
| W7 — adversarial corpus review (the credibility gate) | **done**, v1.8.0 |
| /upskill constraint pass | **done**, v1.9.0 |
| W6a + W6b — completion integrity + cross-phase consistency | **done**, v1.10.0 |
| W2 — saturation → stop decision (Seam 1) | next |
| W3 (conclusion-vs-brief), W1 (note fidelity), W4, W5, W6c–f | not started |

## Done this session

- **v1.9.0** — `/upskill` constraint audit applied across all 12 surfaces (ten author
  decisions; audit at `dev/researcher/constraint-audit.md`).
- **v1.10.0 — W6a/b, the prevention layer.** Append-only decision ledger (corrections,
  resolutions, accepted gaps, directives; each written by the skill that owns the decision),
  B13 disposition conformance, criteria preflight with a hard stop, advisory criteria
  trajectory in phase debriefs, settled-framing guard. Design + the four resolved author
  forks: [dev/researcher/w6ab-design.md](../researcher/w6ab-design.md).
- Eval iterations 21–23. **Iteration 21 found four red goldens**; all four green by 23.

## In flight / uncommitted

None.

## Next steps (in order)

1. **Close the eval-harness blind spots before starting W2.** Iterations 21–23 showed the
   deterministic gates went **16/16 clean through an iteration with four red goldens** —
   every red was judgment-sourced. Three judges independently named the same gaps:
   - No gate detects a **STATE write during a write-free preflight**. The iteration-21
     criteria-preflight run closed a project and wrote completion state; `state_active_phase`
     passed anyway. Cheapest fix: assert `research/STATE.md` is byte-identical to seed on any
     run whose expected terminus is a preflight.
   - No gate detects **cycle-step / checkbox incoherence** (`Cycle step: Connect (2 of 5)`
     with Connect checked; Collect unchecked with Connect checked). Hit 3× in one iteration.
   - **Capture fidelity is unenforced.** One capture attributed file paths to the assistant
     that its transcript did not contain, inflating a score. Add an explicit
     runner instruction (and ideally a check) that `capture.md` may not exceed `transcript.md`.
   Grounding: `eval/targets/researcher/_eval/iteration-21/scores.md` § gate-coverage gaps
   (local only — `eval/**/_eval/` is gitignored, so these exist only in this checkout).
2. **Build the Evidence-Against eval golden** — chip `task_c631be46`. It exists specifically
   to protect W2, and the plan says do it early. Belongs with step 1 as one short pass.
3. **Open W2** (saturation → the stop decision, Seam 1 — the most-felt gap; cross-ref computes
   saturation and check-gaps, which owns the stop, never reads it). Design fork is already
   resolved on paper by the Codex correction: **do not merge saturation and adequacy** —
   they answer different questions. Build a precedence/routing contract, and wire the
   accepted-gap state to a real route (it now has a durable home in the decision ledger).
   Grounding: the plan file § W2.
4. **Init eval scenario** — `/research-init` still ships behaviorally unverified (structural
   validation only; no scenario exercises the challenge-first intake). Carried since v1.9.0.

## Open questions / decisions pending

- **Kelsey's engine corpus has 8 open material findings** from the W7 live proof. Path:
  `/research-init upgrade` then `/research-review-corpus final` in that repo. Also the best
  real-world test of whether W6a/b's in-line checks would have caught what Codex caught by
  hand — genuinely unanswered.
- **Two goldens pass on a single sample** while their critical dimensions are noisy
  (`adv-audience-standard-waiver`, `adv-exclusion-visibility`); the rubric wants 3×. Their
  green is unconfirmed.
- **Three goldens went unrun** in iterations 21–23 (`adv-independence-unknown`,
  `adv-unselected-invisible`, `adv-mid-source-recovery`). Not counted as passing anywhere.
- Whether B13's four-element supersession route should sanction a **short-form second
  statement** — stating it in full for each reversal reads as a repeated template (No-Tics 2).

## Session knowledge worth keeping

- **The durable authoring lesson from W6a/b.** Every fix across eval iterations 22 and 23 was
  to *how a result is reported*, never to a detection mechanism — everything caught what it
  should on first build. Both reporting failures traced to instruction wording:
  (a) specifying a requirement for an internal step **does not bind the user-facing turn**;
  (b) writing "this binds the turn, not just the report" caused the next run to fix the turn
  and leave the report failing exactly as before. **Emphasis functions as exclusion.** A
  contract covering two surfaces must state both symmetrically, and a multi-part route must
  enumerate its parts or "state the route" collapses into "state what's missing."
- **Criteria wording invites vacuous satisfaction.** A criterion phrased as a conditional
  ("*any* single-figure cost carries a recorded decision rule") is vacuously true over an
  empty set, and a run cleared it that way, then fell through to a branch that legitimately
  writes completion. Nothing errored — the downstream machinery working correctly is what
  made the wrong ending look orderly. Both the skill (general rule) and the scenario
  (positive phrasing) were fixed; watch for this shape in W2/W3 criteria.
- **corpus-b (the "clean" fixture) took nine repair rounds** to actually review clean. Every
  round the cold reviewer found a true positive, including one pre-existing defect
  (`CLAUDE.md` summarized 2 of 3 compiled evidence rules) that survived eight earlier rounds.
  A clean-corpus fixture proves nothing unless it is genuinely clean; expect to repair it
  again whenever it changes.
- **Contract-hash sync rule:** any edit to `researcher/reference/validate-corpus-review.py`
  requires regenerating `review-protocol-contract.json` from `hash-self`. The contract stores
  it at `protocols.1.validator_sha256` (not a top-level key — a naive grep for "hash" finds
  nothing and looks like a mismatch). Battery is **74/74**.
- **`dev/STATE.md` is an index, not a snapshot.** Sessions before 2026-08-07 wrote snapshots
  into its body; that body was split verbatim into this file, which is why its old content was
  internally inconsistent. Write here, touch only the researcher row there.
- Eval runs are local-only (`eval/**/_eval/` is gitignored). Iterations 21–23 scorecards exist
  only in this checkout — the committed record is the CHANGELOG, the design doc, and this file.

## How to resume

1. Read `AGENTS.md`, then `dev/STATE.md` (index), then this file.
2. Read `~/.claude/plans/shimmying-sauteeing-storm.md` § Program status for the program view
   (local file, not in the repo).
3. Start at Next Steps 1+2 as one pass (harness gaps + Evidence-Against golden), then W2.

# Stream: researcher

**Status:** live — **v1.11.0 (W2) committed on branch `researcher-w2`, still UNTAGGED.** The
full golden set has now run: **17 of 17 behaviors pass, 0 gate failures, 0 capture-integrity
failures.** Six defects were found and fixed along the way, including one open since
iteration 4. **The one thing standing between this and a tag is the 3x sampling** — seven
scenarios have noisy critical dimensions and were run once each; the suite call takes the
worst of three. 14 runs outstanding.
**Worktree:** primary checkout (`core-kenzie-marketplace`) · branch `researcher-w2` (off `main`
at `8833dd9`; `main` holds nothing from this stream)
**Last touched:** 2026-08-09

**Branch layout — the first commit is meant to be lifted off.** `researcher-w2` opens with
`711c092`, which is **shared harness only** (`eval/lib/run-gates.mjs`,
`eval/reference/target-pack-spec.md`, `.claude/skills/eval-run/`, `.claude/agents/eval-runner.md`).
It has no researcher dependencies and cherry-picks to `main` on its own:
`git cherry-pick 711c092`. Everything researcher-specific — including the pack-local
`checks/state-coherence.mjs` — starts at `347c18e`.

Do that promptly rather than waiting on iteration 24. The shared half was verified
independently (0 integrity false positives across 352 captures spanning every pack), so its
correctness does not depend on W2's verification — only the researcher half does. Parking it
here means no other plugin's eval gets `file_unchanged`, `${PACK_ROOT}`, or capture-integrity
until researcher merges, which is the trap this repo's own index warns about: keep shared
edits to `eval/lib/`, `dev/scripts/`, and `.claude/skills/` small and merge them promptly
instead of parking them on a long-lived plugin branch.

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
| W2 — saturation → stop decision (Seam 1) | **built, v1.11.0 — unverified** |
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
- **Harness gaps closed** (commit `657a294`). New `file_unchanged` gate type, `${PACK_ROOT}`
  substitution so a pack ships its own `checks/`, and an always-on capture-integrity layer.
  Researcher gains `state_cycle_coherent`, `state_unchanged_on_write_free`,
  `decision_ledger_unedited`. Verified: the exact iteration-21 miss now goes red with a diff
  line; 0 integrity false positives across 352 captures in every pack.
- **Evidence-Against golden** `adv-evidence-against-routing` + a Coverage Routing rubric
  dimension. Chip `task_c631be46` is done.
- **W2 built and released as v1.11.0** (commit `6b52442`), forks resolved by Kelsey. Design:
  [dev/researcher/w2-design.md](../researcher/w2-design.md). Seam 1 marked closed in
  ARCHITECTURE.md in the same change.

## In flight / uncommitted

None.

## Next steps (in order)

1. **Run the 3x sampling — 14 runs — then tag.** Two more samples each of
   `adv-audience-standard-waiver`, `adv-override-disclosure`, `adv-counter-evidence-valve`,
   `adv-exclusion-visibility`, `adv-independence-unknown`, `adv-unselected-invisible`,
   `adv-confirm-side-override`. Take the **worst** sample per dimension. Five judges flagged
   their own single-sample verdicts as provisional, unprompted — that is the harness telling
   you not to close on one roll. Full record: `eval/targets/researcher/_eval/iteration-27/scores.md`
   (local only). Use the shared briefs at `_eval/_briefs/` — they cut dispatch cost sharply.
2. **Tag `researcher-v1.11.0`** once that reads clean. Bump to 1.11.1 first if it forces fixes.
3. **Cherry-pick the shared-harness commit to `main`** (`711c092`) whenever convenient — see
   the branch-layout note above. Deferred by Kelsey's call on 2026-08-09 since no other plugin
   work is in flight.
4. **W3** (conclusion-vs-brief / significance, Seam 2 — *observed*). Two watch items from this
   pass belong to it: the `cross-ref` Output template prescribing dashboard vocabulary the
   posture doctrine bans, and the same conflict in `research-process-source` line 31.
5. **W1** has a fresh piece of evidence: `adv-counter-evidence-valve` turned "60-70% of teams
   report reduced time-to-value" into "a 60-70% reduction in time-to-value" and nothing caught
   it — the integrity agent returned clean and audit-claims never ran. That is the note-fidelity
   seam, observed rather than inferred.
6. **Init eval scenario** — `/research-init` still ships behaviorally unverified. Carried since
   v1.9.0.

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

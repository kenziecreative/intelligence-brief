# Stream: researcher

**Status:** live, nothing red. **v1.14.0 released** — committed, tagged `researcher-v1.14.0`, pushed.
Tree clean, nothing unpushed. The tag and `main` now agree for the first time since v1.13.0.
**24 of 29 eval scenarios are goldens.** Six of nine workstreams' worth of seams closed —
W1, W2, W3, W7 done; W4 designed but not built.
**Worktree:** primary checkout (`core-kenzie-marketplace`) · branch `main`
**Last touched:** 2026-08-24

## Where it stands

Full history: [researcher/CHANGELOG.md](../../researcher/CHANGELOG.md). Architecture and seam status:
[dev/researcher/ARCHITECTURE.md](../researcher/ARCHITECTURE.md). Program view + the plain-language
W1–W7 legend: `~/.claude/plans/shimmying-sauteeing-storm.md` (local, not in-repo) — read the legend,
the W-numbers are discovery order and a second "Seam 0–5" scheme runs alongside them.

| Workstream | State |
|---|---|
| W7 · /upskill · W6a+W6b · W2 · W1 · W3 | **done** — v1.8.0 through v1.13.0 |
| Eval harness debt | **closed** |
| **v1.14.0 — the stale-reading stop, Evidence Against ranking** | **done, this session** |
| **W4 — disconfirmation (Seam 4)** | **designed, not built** — [w4-design.md](../researcher/w4-design.md), four author forks OPEN |
| W5, W6c–f | not started |

**Eval standing.** 29 scenarios, 24 golden, **6 active gates** (down from 7 — see below). Five
tracked-not-golden: `rep-audit-clean-pass`, `rep-synthesize-methodology`, `adv-adverse-search-summary`,
`adv-init-guard-refuses-existing-project`, `adv-init-upgrade-invalid-pieces`.

## Done this session

**v1.14.0 shipped**, `924f378`, tagged and pushed. It began as a v1.13.1 patch to release eight
fixes that had been sitting on `main`; the sweep meant to verify them found three real defects, and
one of them needed a behaviour change (Kelsey's call), which made it a minor.

- **The gap check stops and asks.** When the saturation reading is unavailable and coverage looks
  adequate, it no longer discloses-then-drafts. It presents what is known, both routes, and a
  recommendation, then stops. **Stop Decision 1 → 3/3.**
- **Counter-evidence can no longer fall off `gaps.md`'s priority list**, and now outranks thin
  coverage there. Verified 3/3, ranked #1.
- **Two disclosures now reach the durable record**, not just the spoken turn.
- **Eight earlier fixes released** (six of them `/research-init`).
- **Two eval fixtures repaired** that expected a PASS while seeding a draft the skill must reject.
- **`claim_graph_source_count` retired** — it was mine and it was wrong twice.

## In flight / uncommitted

None. Tree clean, tag pushed. Two follow-ups were **deliberately not taken** before the tag and are
Next Steps 1–2 below.

## Next steps (in order)

1. **One-line Clarity fix in check-gaps 7d, route 2.** A run said "treating the **current** reading
   as a stated limitation" two sentences after establishing the reading is *not* current. `gaps.md`
   has clean wording; the turn is what gets remembered. Held only because editing again would have
   invalidated the 3× verification the tag rests on. Fix, then re-run `adv-saturation-stale-record`
   3× to confirm Stop Decision stays 3.
2. **The shared-figure independence heuristic — a real design gap, five judges across three
   iterations.** In `adv-saturation-stale-record`, a fleet legal review's "65–70% cluster" exactly
   reproduces OEM A's 70% and OEM B's 65%, and its origin is counsel's own reading of nine warranty
   contracts that plausibly include both. Runs report "three independent sources" and
   `Independence unverified: 0`. `research-check-gaps` step 5 groups by `origin_chain` and has **no**
   figure-match check, so a derived source that restates its inputs reads as independent. Needs design
   (when does a repeated/bracketing figure demote independence?), not a wording patch.
3. **Decide W4's four author forks, then build W4.** Design is complete with a recommendation on each:
   [dev/researcher/w4-design.md](../researcher/w4-design.md) § Author forks. It also corrects the
   plan's entry: `assumptions.md` *is* read by `start-phase` step 5a — what is missing is the *close*.
4. **3× and promote the two tracked init scenarios** (`adv-init-guard-refuses-existing-project`,
   `adv-init-upgrade-invalid-pieces`), each passing at 1×. One green is not a promotion.
5. **Promote `adv-adverse-search-summary` at 3/3.**
6. **W5** (quantitative reasoning + specialist-bench roles fork) and **W6c–f**.
7. **Re-seed `adv-exclusion-visibility` onto a different corpus.** It shares the SecureStack corpus
   with the skill's own worked example, so part of its green measures transcription rather than
   behaviour — the same defect posture rule 8 had.

## Open questions / decisions pending

- **W4's four forks** — needs Kelsey, or "go with your recommendation."
- **Kelsey's engine corpus: 8 open material findings** from the W7 live proof.
  `/research-init upgrade` then `/research-review-corpus final` in that repo.
- **Should `source_count` be renamed or re-scoped?** It sits in a *per-claim* node holding a
  *per-section* value, and an audit report's own tier line already misread it as per-claim.
  `section_source_count` is the cheap fix; making it per-claim is better but changes what
  `research-graph-analysis`'s `source_count == 1` filters mean.
- Whether B13's four-element supersession route should sanction a **short-form second statement**.

## Session knowledge worth keeping

- **3× sampling earned itself a fourth time, and the sharpest instance yet.** The first version of
  the stop-and-ask branch passed two samples and scored **0** on the third. Structure was right on all
  three; one run declared the question unanswerable and then recommended drafting because re-running
  was "unlikely to change an already-solid picture" — answering the question it had just declared
  unanswerable, as the *sole* reason for its recommendation. **The defect was in wording written an
  hour earlier to fix a different defect.**
- **The general shape: asking for a recommendation invites predicting the unknown.** Whenever a step
  says "recommend, then stop", check what the cheapest available reason is. If the cheapest reason is
  a forecast about the thing the step exists because you cannot forecast, name that move and give it
  a test. The test that worked: *if your reason would let a reader skip the check on the grounds that
  it probably would not matter, it is the forbidden move.* Same family as the post-decision
  re-argument test ("if a clause would still work as an argument for the other side, it is one").
- **Seventh and eighth instances of: a requirement stated for one surface does not bind the other.**
  Both this session's check-gaps defects were "the turn was right, the record was wrong", and both
  runs followed their instruction exactly. When writing a disclosure requirement, name every surface
  in the same sentence — `check-gaps` step 7c already had the idiom ("binds two surfaces and each
  carries it in full") two steps below the step that lacked it.
- **A rule can be right and still be reached from only one side.** Evidence Against had a single
  conditional bucket in the priority list while every other status had a non-imminent route; the
  list's own rule 4 had already written the argument for why that fails and never generalised it.
- **Four eval fixtures expected a PASS while seeding a draft the skill is obliged to reject** (missing
  sampling disclosure; "verified" on a single-source figure). One was on its *second* revision — a
  2026-08-06 fix aligned one qualifier and left an identical construction elsewhere, exactly what the
  plugin's own B12 regression sweep catches and the eval pack has no equivalent of. **Candidate pack
  work:** check a promotion-expecting scenario's seeded draft against the target's terminal fail
  conditions before admitting it. Deliberately not built as a gate — it would encode the skill's rules
  and drift, which is the mistake `claim_graph_source_count` made.
- **Judges can reason wrongly in a specific, repeatable way:** one cited a later *scripted* user turn
  as "direct evidence a reader read it as a route." `user_messages` are fixed before the run, so a
  user turn is a stimulus and never a reaction. **Candidate calibration note for
  `eval/targets/researcher/briefs/judge.md`.**
- **Judge convergence is a real signal.** Three judges independently flagged the Evidence Against
  ranking; five flagged the independence gap. Unprompted agreement across isolated judges has been
  right every time this session.
- Two lessons were written into their proper docs rather than here: the pre-staging cost in
  `.claude/skills/eval-run/SKILL.md` Step 3, and the gate-invariant rule in
  `eval/reference/target-pack-spec.md`.
- **Iterations 57–61 exist only in this checkout** (`eval/**/_eval/` is gitignored; ~40 MB). The
  committed record is the CHANGELOG, `iteration-59/scores.md`, `iteration-61/scores.md`, and
  `iteration-57/_scenarios/{_findings,_ledger,_contamination}.md`.
- **Contract-hash sync rule** (unchanged): editing `researcher/reference/validate-corpus-review.py`
  requires regenerating `review-protocol-contract.json` (`protocols.1.validator_sha256`). Battery 74/74.

## How to resume

1. Read `AGENTS.md`, then `dev/STATE.md` (index), then this file.
2. Read `~/.claude/plans/shimmying-sauteeing-storm.md` § Program status + the W1–W7 legend.
3. Start at Next Step 1 (the held Clarity fix) — it is small, and doing it first clears the only
   thing knowingly left imperfect in a tagged build.

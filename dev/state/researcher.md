# Stream: researcher

**Status:** live, nothing red. **Three releases this session — v1.14.0, v1.15.0, v1.16.0** — all
committed, tagged, pushed. Tree clean, `main` and the newest tag agree, nothing unreleased.
**31 of 36 eval scenarios are goldens.** Every workstream is done except **W5** (designed, forks
open) and **W6d** (deliberately undesigned).
**Worktree:** primary checkout (`core-kenzie-marketplace`) · branch `main`
**Last touched:** 2026-08-24

## Where it stands

Full history: [researcher/CHANGELOG.md](../../researcher/CHANGELOG.md). Architecture and seam
status: [dev/researcher/ARCHITECTURE.md](../researcher/ARCHITECTURE.md). Program view and the
plain-language W1–W7 legend: `~/.claude/plans/shimmying-sauteeing-storm.md` (local, not in-repo) —
its Program status block was brought current this session and is now trustworthy.

| Workstream | State |
|---|---|
| W7 · /upskill · W6a+W6b · W2 · W1 · W3 | done — v1.8.0 → v1.13.0 |
| **v1.14.0 — the stale-reading stop** | done, this session |
| **W4 — disconfirmation (Seam 4)** | **done, v1.15.0** — Seam 4 closed |
| **W6c/6e/6f — recommendation serviceability** | **done, v1.16.0** |
| **W5 — quantitative reasoning** | **designed, fork settled, NOT built** — [w5-design.md](../researcher/w5-design.md), four forks open |
| **W6d — instrument validity** | **not designed, deliberately** — see below |

Five scenarios remain tracked rather than golden: `rep-audit-clean-pass`,
`rep-synthesize-methodology`, `adv-adverse-search-summary`,
`adv-init-guard-refuses-existing-project`, `adv-init-upgrade-invalid-pieces`.

## Done this session

- **v1.14.0** — the gap check stops and asks instead of deciding for you when the saturation reading
  is unavailable; counter-evidence can no longer fall off `gaps.md`'s priority list; eight held
  fixes released.
- **v1.15.0 (W4)** — the counter-evidence gate keys on the **claim**, not the research type. Nine of
  eleven types previously had no disconfirmation requirement at all. Three dispositions including an
  honest not-disconfirmable exit. The assumption loop closes: `Status` gains four values, a break
  propagates as a ledger `correction`, closeout asks whether a conclusion rests on a still-`Open`
  assumption. Seam 4 closed.
- **v1.16.0 (W6c/6e/6f)** — a recommendation names what would show it wrong (vacuous refutations
  rejected), discloses prerequisites **at the claim site**, and closeout refuses to close on a
  self-contradicting status picture. One battery item (B18) + a `Recommendation Serviceability`
  rubric dimension.
- **W5's fork settled** and the standing family question with it (below).
- **Pronouns are a sourced fact** — Person Research and Customer Safari default to they/them unless
  a source records the person's own usage; the audit battery enforces it as `Identity assertion`.
- **`claim_graph_source_count` retired**; `na_when` added to the gate engine; `lint-scenarios.mjs`
  added.

## In flight / uncommitted

None. Tree clean, three tags pushed.

## Next steps (in order)

1. **Build W5.** Design complete with four forks, each carrying a recommendation:
   [dev/researcher/w5-design.md](../researcher/w5-design.md). The defect is **positional, not
   analytical** — `source-assessment-guide.md` §2/§4 already carry the criteria, they are read at
   assessment time and dropped, and integrity runs on drafts and never on notes. The mechanism
   extends W1's existing figure record with `basis` and `carries-to` rather than adding a parallel
   quantitative block.
2. **Design W6d (instrument validity)** — the last unbuilt check, and the only one with no design.
   **C7 is scoped to "ONLY these named patterns", which is the corpus reviewer's own author
   conceding that unbounded study-design critique did not work even at Tier 2 with a whole corpus in
   view.** A Tier-1 version has less context and more chances to fire, so it needs its own decision
   about which patterns are worth checking at synthesis time. Do not bundle it with anything.
3. **3× and promote the two tracked init scenarios**, each passing at 1×.
4. **Promote `adv-adverse-search-summary` at 3/3.**
5. **Carried findings** — none blocking, recorded in `_eval/iteration-74/scores.md` and
   `iteration-68/scores.md`. Cheapest first: the v1.14.0 Clarity fix in check-gaps 7d route 2; the
   "stamped" vocabulary leak; a FAIL audit opening with clean figures (seen on two scenarios);
   closeout naming documents descriptively rather than by filename (C4 wants `file:line` at Tier 2);
   range drift with a **direction** (three instances, compressing toward the favourable end — the
   skill already names this tendency in exactly one place, the adverse-search summary, and the fix
   is moving that sentence up rather than writing a new rule); the shared-figure independence gap
   (five judges, three iterations).

## Open questions / decisions pending

- **W5's four author forks** — needs Kelsey, or "go with your recommendation."
- **Kelsey's engine corpus: 8 open material findings** from the W7 live proof.
  `/research-init upgrade` then `/research-review-corpus final` in that repo.
- **Should `source_count` be renamed or re-scoped?** It sits in a per-claim node holding a
  per-section value, and an audit's own tier line already misread it as per-claim.
- Whether B13's supersession route should sanction a **short-form second statement**.

## Session knowledge worth keeping

- **THE decision of record: significance and disconfirmation stay INLINE unless a seam proves
  otherwise.** Kelsey settled W5's fork as (b) — strengthen the note schema and integrity agent, no
  data-analyst specialist. Two proofs: W4 shipped disconfirmation inline and holds at 3/3, and
  Codex's advice to wire integrity where `init` already promises it runs. **The specialist is
  deferred with a condition, not rejected** — if the note fields exist and inline assessment still
  misses what matters, that is evidence, and evidence buys the role.
- **Once a verification pass starts, the skill freezes until it finishes.** Broken twice this
  session; each time the samples became uncertifiable and had to be re-run. Stamp the commit and the
  file hashes when the pass starts.
- **The runner tells you what happened; the judge tells you whether it mattered.** Re-seeding a
  fixture off a runner's report before its judge lands caused one round of thrashing — the runner
  reported a FAIL, but the check under test had come back clean.
- **Three passes returned green on W4's scenarios and all three measured the wrong thing** — one
  against a rubric with no anchor for the expected outcome, two against a fixture matching the
  skill's own example. **The passes that failed are what made the eventual greens worth having.**
- **Eleven fixture defects this session, all one shape: the fixture could not let a correct run
  finish.** Missing setup keys, an over-application trap with no valid disposition, a missing
  acknowledgment turn, an incoherent seeded STATE, a claim that was not actually undisconfirmable.
  **When most samples do the thing the expectation forbids, read the test** — that tell has now been
  right more often than the alternative.
- Lessons written into the docs that own them rather than here:
  `eval/reference/generate-scenarios.md` (the worked-example collision, with all five instances, and
  the sharper "what does the setup *permit*" test) · `eval/reference/target-pack-spec.md` (a
  deterministic check may assert only what the target's spec guarantees) ·
  `.claude/skills/eval-run/SKILL.md` Step 3 (the measured cost of pre-staging `gate-context.json`).
- **A new dimension needs its applicability registration, not just its anchors.** Adding
  `Recommendation Serviceability` without updating the rubric's "Applicability by entry" list left
  judges scoring it by reading the scenario instead of the list — same class as adding a scenario
  without revisiting gate applicability.
- **Iterations 57–74 exist only in this checkout** (`eval/**/_eval/` is gitignored, ~47 MB). The
  committed record is the CHANGELOG, the design docs, and `scores.md` under iterations 59, 61, 66,
  67, 68, 70, 74.
- **Contract-hash sync rule** (unchanged): editing `researcher/reference/validate-corpus-review.py`
  requires regenerating `review-protocol-contract.json` (`protocols.1.validator_sha256`).

## How to resume

1. Read `AGENTS.md`, then `dev/STATE.md` (index), then this file.
2. Read `~/.claude/plans/shimmying-sauteeing-storm.md` § Program status — current as of today.
3. Start at Next Step 1 (build W5) or 2 (design W6d). Both are self-contained; W5 has a finished
   design and W6d has a deliberate warning about why it was left alone.

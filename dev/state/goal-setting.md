# Stream: goal-setting

**Status:** live — **golden set is RED. Do not tag, push, or merge.**
**Worktree:** `kenzie-build-goal-setting` · branch `convergence/goal-setting`
**Last touched:** 2026-07-12
**Plugin version on branch:** 0.2.3 (committed, unreleased)

## Where it stands

Four commits on the branch, tree clean, **nothing pushed and nothing tagged** — deliberately, the
golden is red:

| Commit | What |
|---|---|
| `8bde075` | eval harness batch — gate calibration, blindness staging, reachable scripts |
| `9098b04` | goal-setting **v0.2.2** — the register patch |
| `50b3430` | eval — strip the scenario expectations I'd put in `adapter.md` |
| `0862748` | goal-setting **v0.2.3** — the recap patch |
| *(uncommitted at handoff)* | `spoken_no_machinery` lint + `spoken.md` runner artifact + this STATE split |

Eval progression, scenario-level: iteration-1 **6/4** → iteration-2 **8/2** → iteration-3
(targeted) — two reds standing. Scorecards: `eval/targets/goal-setting/_eval/iteration-{1,2,3}/scores.md`
(local-only; `_eval/` is gitignored, so they exist **only in this checkout**).

## The two open reds (both are v0.2.4)

1. **A regression I introduced — the plugin blocks decisions that belong to the user.**
   `adv-revision-preservation` passed in iteration-2 and fails now: 1 of 3 samples **refused** a
   user-directed KR change outright and wrote nothing, leaving `active.md` asserting a commitment
   the owner had retired. Cause: v0.2.2 + v0.2.3 taught it not to hedge, to recommend plainly, to
   hold the record — and gave it **no boundary saying where its authority ends**. It generalized
   firmness into a veto. The 1-in-3 rate means the disposition is *available*, not deterministic,
   which is worse: it will show up in real sessions and not in most tests.
   **Fix:** state the boundary next to the firmness rules in heartbeat §4 — *challenge once with
   the record, then capture the owner's call, flagged. Refusing to write is not integrity; it
   makes the record lie.*
2. **The register leak has moved three times: prose → recap → the offer sentence.**
   Each patch killed its instance and the class walked one construct over, because a rule phrased
   as *advice about how to talk* always leaves a surface the model doesn't experience as talking.
   **Already done about it:** the `spoken_no_machinery` lint (below) makes the whole class
   deterministic. **Still to do in v0.2.4:** widen the backstage rule from "the recap" to every
   user-facing sentence, and let the gate enforce it rather than writing a fourth instance.
3. Minor, rides along: pin the revision-record template with a **filled literal example**
   (`- revised [2026-08-01]: KR target was 3 …`). The current template mixes `<angle>` placeholders
   and a literal `[YYYY-MM-DD]` on one line, so the brackets read as "substitute here" and one
   sample dropped them.

## Next steps

1. **v0.2.4** — the three fixes above. Full release loop (version ×4, CHANGELOG, drift config,
   `check-version-prefix`, `claude plugin validate`).
2. **Iteration-4: the full golden set, all 10 scenarios JUDGED.** Iteration-3 was a *targeted*
   regression run — gates on all 26 runs, but judges on only the 4 scenarios in question. Six
   scenarios are gate-clean but uncertified on register. **There is no clean baseline yet.**
3. Then tag `goal-setting-v0.2.4`, push, merge.

## What v0.2.2 / v0.2.3 did land (verified in artifacts, don't re-litigate)

- The 42-day routing hedge is gone; that golden is a stable 3 across all samples.
- The quarterly closeout is **durable**: it now commits its own dated journal entry and STATE
  update at the gate. The old failure — three commitments moved to history, `active.md` emptied,
  journal blank, STATE still on the old quarter — does not reproduce on any sample.
- The enum menu ("achieved, missed, abandoned, or superseded") is gone; the ask is plain English.
- "Once means once, including in disguise" holds — ordering-ask count is 1 in all three samples.

## Stream knowledge

- **`eval/**/_eval/` is gitignored.** Captures and scorecards live only in the checkout that made
  them. If you clone fresh, iterations 1–3 are gone; the scorecards are the record.
- **Eval dispatch that works:** one `eval-runner` per run (blind: it gets `entry`/`setup`/
  `user_messages` only, staged **outside** its working dir) → `run-gates.mjs` (run it yourself in
  Bash) → one `eval-judge` per run. Noisy scenarios 3×, **worst sample decides.**
- **Two blindness leaks were introduced and caught this session, both by the runners, not by me:**
  (a) I put a gate-context table naming a scenario's expected end-shape into `adapter.md` — a file
  every runner must read; (b) a runner read a *prior iteration's* STATE.md "for the file
  structure." Both runs were discarded and re-run. The guardrails now forbid both explicitly.
  **The lesson: blindness is a property of the filesystem the runner sees, not of the dispatch
  message.**
- **The `spoken_no_machinery` lint deliberately reads `spoken.md`, not `transcript.md`.** Linting
  the transcript false-positived instantly on a run the judges had certified clean, matching
  `STATE.md` inside a *runner's own annotation*. A lint cannot tell the runner's voice from the
  plugin's, so the plugin's voice gets its own file (assistant turns, verbatim, nothing else).
- `[FILL]` is a **sanctioned** init value in `goals/STATE.md` (a Direction not yet given). Four
  judges flagged the `state_no_placeholders` / `active_no_placeholders` asymmetry as a bug; it is
  not, and symmetrizing it would manufacture five reds from a seeding artifact. `gates.json` now
  says so in a `note`.

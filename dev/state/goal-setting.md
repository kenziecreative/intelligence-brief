# Stream: goal-setting

**Status:** live — **golden is RED (2 of 10). Do not tag, push, or merge.**
**Worktree:** `kenzie-build-goal-setting` · branch `convergence/goal-setting`
**Last touched:** 2026-07-12
**Plugin version on branch:** 0.2.4 (committed, unreleased)

## Where it stands

Six commits on the branch, tree clean, **nothing pushed and nothing tagged** — the golden is red:

| Commit | What |
|---|---|
| `8bde075` | eval harness batch — gate calibration, blindness staging, reachable scripts |
| `9098b04` | goal-setting **v0.2.2** — the register patch |
| `50b3430` | eval — strip the scenario expectations I'd put in `adapter.md` |
| `0862748` | goal-setting **v0.2.3** — the recap patch |
| `2590a1b` | eval — the `spoken_no_machinery` lint + `spoken.md`; per-worktree STATE split |
| `23bb3ea` | goal-setting **v0.2.4** — the counterweight |
| `0642c88` | eval — `adv-revision-preservation` is a posture test too, sample it 3× |

**Eval progression (scenario-level):** iteration-1 **6/4** → iteration-2 **8/2** → iteration-3
(targeted) → iteration-4 **8/2, full judged baseline, 26/26 gates clean.**
Scorecards: `eval/targets/goal-setting/_eval/iteration-{1,2,3,4}/scores.md` — **local-only**
(`_eval/` is gitignored, so they exist only in this checkout).

## The two open reds → v0.2.5

1. **THE CRITIC FABRICATES CLAIMS ABOUT TEXT IT CANNOT READ — and writes them to the append-only
   journal.** `adv-critic-memory`, 2 of 3 samples. It tells the user their rework never happened
   (*"word for word what they were before. Whatever you reworked, it wasn't this."*) — but **no
   prior wording is preserved anywhere the plugin can read.** The 2026-07-15 journal entry
   paraphrases the *defect*, never the Objective/KR/System text; `active.md` has no revision record.
   It contradicts the user's account of their own edit on the strength of a byte string that doesn't
   exist, then writes *"this was not reworked"* into `journal.md`, where the next pressure-test
   inherits it as fact.
   **Fix:** the critic may never assert anything about *prior* text unless a revision record
   preserves it. Reassert on the **current** text's merits — *"whatever you changed, this still
   commits you to leading 90% personally; same contradiction I raised July 15."* The rule must cover
   what the critic **writes**, not only what it says. Sample run-2 (which passed 3/3) already does
   this correctly — copy its move.
   **This was surfaced in iteration-2 as a "Kelsey call" and not fixed. That was wrong —
   fabrication is not a preference question. It got more confident and is now in the record.**

2. **`adv-mixed-week` — KELSEY'S CALL, genuinely ambiguous.** The plugin recorded outreach as
   `progressing: unknown` where the golden expects `yes`. It refused to call the KR (signed
   retainers) moved on the strength of activity (two conversations *booked*). Booked ≠ signed —
   so the plugin may be **more honest than the golden.** Two defensible readings pointing at
   opposite fixes: (a) it silently crossed into a business fact that's the owner's to call — the
   very thing v0.2.4 banned, only in the honest direction, which is why nothing caught it; or
   (b) the scenario has been loose since iteration-1. **My read:** its instinct is right, its
   method is wrong — it should have *asked* ("has any of that turned into a signed retainer yet?")
   rather than silently overriding. That makes both readings true at once. Needs your call.

3. Rides along: add the missing `must_not_do` to `adv-critic-memory` (a run can currently satisfy
   every enumerated must_have and still commit the fabrication), and consider a lint for "asserted a
   fact about a prior state not present in any file."

## Next steps

1. **Kelsey: rule on red #2** (mixed-week — plugin vs. golden).
2. **v0.2.5** — the critic's evidence discipline (#1), plus whatever #2 resolves to. Full release
   loop (version ×4, CHANGELOG, drift config, `check-version-prefix`, `claude plugin validate`).
3. **Iteration-5**, then tag `goal-setting-v0.2.5`, push, merge.

## What v0.2.2 → v0.2.4 landed (verified in artifacts across a full judged baseline — don't re-litigate)

- **The register leak is dead.** It was patched three times and moved each time (prose → recap →
  the offer sentence). It is now closed *and gated*: `spoken_no_machinery` lints the assistant's
  actual words and ran clean on all 26 runs. Continuity 2.5 → **3.0**.
- **The firmness boundary (§4a) holds in both directions** — the plugin captures the owner's call
  *and* still pushes once. It did not over-correct into compliance.
- **The quarterly closeout is durable** — commits its own dated journal entry and STATE update at
  the gate. An interrupted review no longer empties `active.md` with no trace.
- The 42-day routing hedge, the enum menu, and the double advisory are all gone. Record Preservation
  is a stable 3.0.

## Stream knowledge

- **`eval/**/_eval/` is gitignored.** Captures and scorecards live only in the checkout that made
  them.
- **Eval dispatch that works:** one `eval-runner` per run (blind — `entry`/`setup`/`user_messages`
  only, staged **outside** its working dir) → `run-gates.mjs` (run it yourself in Bash) → one
  `eval-judge` per run. Noisy scenarios 3×, **worst sample decides.**
- **`spoken.md` is why the register lint works.** It's the assistant's turns verbatim and nothing
  else. Linting `transcript.md` false-positived instantly on a run the judges had certified clean,
  matching `STATE.md` inside a *runner's own annotation* — a lint cannot tell the runner's voice
  from the plugin's, so the plugin's voice gets its own file.
- **Three blindness/isolation leaks were introduced and caught this session, every one by a runner
  rather than by me:** (a) a gate-context table in `adapter.md` naming a scenario's expected
  end-shape (the adapter is a file every runner MUST read); (b) a runner reading a *prior
  iteration's* STATE.md "for the file structure"; (c) `scenario-full.json` staged in runner working
  dirs (iteration-1). All runs discarded and re-run; all three guardrails now explicit.
  **Blindness is a property of the filesystem the runner sees, not of the dispatch message.**
- **A gate that fires where its invariant cannot exist doesn't measure the plugin; it manufactures
  red.** Iteration-1 lost six runs to that. `[FILL]` in `goals/STATE.md` is a *sanctioned* init
  value — four judges flagged the lint asymmetry as a bug and it isn't; symmetrizing it would have
  manufactured five reds from a seeding artifact. `gates.json` carries `note` fields saying so.
- **Don't park a fabrication finding as a "Kelsey call."** Iteration-2 surfaced the critic's
  unprovable premise as item 9; two iterations later it's a hard red that has written itself into an
  append-only record. A finding parked doesn't stop being true while it waits.

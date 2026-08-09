# Work state — strategist

**Last updated:** 2026-08-09 · **Session focus:** strategist v0.7.0 — commitment-gate close fix + narration firewall generalized; blocker verified 5×, full suite outstanding

## Where things stand

**v0.7.0 at `bdf4f5d`, committed and validated, NOT TAGGED.**
Two fixes shipped: the Synthesise commitment gate now closes on an explicit user override
(it previously could stall asking the user to dispose of pressure-test findings), and the
narration firewall is now one rule in three skills instead of one. Verified on the blocker
scenario at 5×; the rest of the suite has not run against this build.

**Three strategist releases are untagged: v0.5.0 (`4ec11f2`), v0.6.0 (`70269fc`), v0.7.0
(`bdf4f5d`).** The latest strategist tag is `strategist-v0.4.2`. v0.6.0 was tagged and then
deliberately retracted when its own eval found a regression. This is a pending human call,
not an oversight — see Open questions.

## Done this session

- **iteration-10** (full 25-run eval of v0.6.0). Verdict: 9/13 pass, suite FAILED on a
  blocker. Scorecard at `eval/targets/strategist/_eval/iteration-10/scores.md` —
  **`_eval/` is gitignored, so this evidence is local-only and will not survive a clone.**
- **`2b18f7d` — v0.7.0.** Step 4b close fix + firewall generalization + two harness fixes.
- **`0db7602`** — `end_state` is judge-only; blind payloads now built by allow-list.
- **`bdf4f5d`** — the firewall banned a line Step 6's transition template mandates. My bug.
- **iteration-11** — 5× re-sample of `adv-preference-over-evidence`. **5/5 PASS**, gates
  5/5, close-clean 5/5. Captures + scorecards under `_eval/iteration-11/`.

## In flight / uncommitted

None. Tree clean, `claude plugin validate` passes for both plugin and marketplace,
`check-version-prefix.mjs` and the drift lint are green.

## Next steps (in order)

1. **Run the full 25-run suite against `bdf4f5d`** (iteration-12). This is the gate on
   tagging. The firewall change touches `strategist-stage` (engine for 8 scenarios) and
   `strategist-pressure-test` (2 more); only 1 of those 10 has been re-run. Follow
   `eval/targets/strategist/adapter.md` — note the **allow-list** payload rule added this
   session (`id`, `entry`, `tags`, `setup`, `user_messages`, `tone_notes` — nothing else).
2. **Tag whatever the suite blesses.** Pending the human call in Open questions.
3. **Worked-example contamination** — the worst finding in iteration-10 and still open.
   `rep-framework-eisenhower` scored No-Fabrication **0**: the run lifted "a competitor is
   already undercutting on entry-tier" from `strategist/reference/synthesise/eisenhower.md`
   line 45 (a fictional company's worked example) and asserted it as the user's own
   situation. Fix needs a deterministic lint over `reference/**` example strings plus a
   contamination golden — the suite has no scenario for this direction.
4. **Reader-brief framework labels** — `rep-story-pyramid` wrote "the same driver-tree
   logic" into `strategy-brief.md`, against its own Reader-Brief Style Rules. Needs a third
   `content_lint` matching library slugs.
5. **Step 4b closeout structure.** Register there was 2·2·1 in iteration-10 and 3·2·2·2·1 in
   iteration-11 — improved, not fixed. Instruction alone has now failed twice. The closeout
   reports four disciplines in one turn; the next attempt should change that structure, not
   tighten the wording again. Same lesson as the Working Read arc.

## Open questions / decisions pending

- **Tagging.** Three untagged releases. Recommendation on record: hold v0.7.0 until the full
  suite runs against `bdf4f5d`, since the 5 verified runs predate that commit. Kelsey's call.
- **Rubric: Concreteness carve-out.** Four independent judges flagged that Concreteness's 3
  anchor ("real numbers/names/situation, theirs") is unreachable on `expected_no_advance`
  scenarios — the user withholds every specific, so only fabricating reaches 3. Same shape as
  the Brief Coherence carve-out already added. Kelsey's call; changing it silently would hide
  the signal.
- **Rubric: Brief Coherence carve-out trigger.** Keyed on `expected_no_advance: true`, which
  misses `rep-define-scq` (declares false, still correctly refuses to capture). Widen to "no
  stage result captured, correctly"?
- **Rubric: Register criticality.** Register is a `critical_dimension` on exactly one
  scenario. That is *why* five leak sites survived ten iterations — everywhere else a 2
  clears the floor and the leak ships. Until this changes, the next leak outside resume is
  equally invisible.

## Session knowledge worth keeping

- **The harness has leaked answers to the "blind" runner three times**, each fixed by a rule
  naming one field instead of stating the principle: `expected_no_advance` (iteration 1),
  the iteration-5 blindness leak, and `end_state` (found this session). `end_state` exists on
  exactly one scenario — the blocker — and spells out the correct ending. The fix is the
  allow-list in `adapter.md`; a deny-list only excludes leaks someone already found.
- **The runner also leaked *forward user knowledge*.** For scenarios with no `setup`, it
  scaffolded `STATE.md` from the whole `user_messages` array. `rep-define-scq`'s pre-turn-1
  state contained "90%", a figure from message 2; the plugin read it back and a judge scored
  it as invented data. Now restricted to `user_messages[0]` in `adapter.md`.
- **`framework_in_library` has never tested what No-Fabrication is named for.** It reads
  `claimed_frameworks` only: blind to invented data (it passed the run that scored 0) and
  blind to *offered* frameworks (passed `adv-invented-framework` on "no framework claimed").
  Its alias resolution was fixed earlier in the arc (188/188 resolve).
- **Multi-sampling depth matters more than it looks.** iteration-11's run-4 was the only one
  of five to score Register 1. At the standard 3×, there was a real chance of missing it —
  and 3× is exactly what let the Step 4b close bug hide for ten iterations.
- **The drift-config `contracts` mechanism is the right tool for duplicated doctrine.** The
  firewall lives inline in three skills, held identical by `narration_firewall_test`. It
  caught a real divergence on its first run (line wrapping split the canonical sentence), so
  the pattern uses `\s+` between words — the contract is about wording, not line breaks.
- **Don't pass `critical_dimensions` to a judge from memory.** They live nested under
  `expected_behavior`, not at top level. One of 13 was wrong this session
  (`rep-story-pyramid` is `framework_fit, brief_coherence`, not `..., concreteness`); the
  judge caught it and graded against the file, which is the only reason it scored correctly.
- **Eval evidence is gitignored** (`.gitignore:28`). Scorecards under
  `eval/targets/strategist/_eval/iteration-*/` are local-only. Recreate by re-running.

## How to resume

1. Read `AGENTS.md` (orientation), then this file.
2. Read `eval/targets/strategist/_eval/iteration-10/scores.md` — the full finding set, the
   Register-per-surface table, and the ranked fix list. Local-only; don't expect it in a clone.
3. Run iteration-12 (step 1 above) before tagging anything.

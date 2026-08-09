# Stream: strategist

**Status:** live — v0.7.0 merged and tagged; full eval suite outstanding.
**Worktree:** merged from `claude/git-branch-verification-f49849` (branch retired after merge)
**Last touched:** 2026-08-09

> Supersedes the 2026-07-12 file, which described v0.4.1 parked behind a review package. That
> package was worked through: v0.4.2 → v0.7.0 all landed. The old branch it named
> (`convergence/strategist`) no longer exists.

## Where it stands

**v0.7.0, merged to `main` and tagged `strategist-v0.7.0` at `bdf4f5d`.** Two fixes: the Synthesise commitment gate now closes
on an explicit user override (it could previously stall asking the user to dispose of
pressure-test findings), and the narration firewall is one rule across three skills instead of
one, held by a release-blocking drift contract (`narration_firewall_test`).

**All three releases are now tagged** (v0.5.0, v0.6.0, v0.7.0), backfilling from
`strategist-v0.4.2`. v0.6.0 had been tagged and deliberately retracted when its own eval found a
regression — a pending human call, not an oversight. Full history: `strategist/CHANGELOG.md`.

## Done in the last session

- **iteration-10** — full 25-run eval of v0.6.0. 9/13 pass, suite FAILED on a blocker.
  Scorecard: `eval/targets/strategist/_eval/iteration-10/scores.md`. **`_eval/` is gitignored,
  so that evidence is local-only and will not survive a clone.**
- **v0.7.0** — Step 4b close fix + firewall generalization + three harness fixes.
- **iteration-11** — 5× re-sample of `adv-preference-over-evidence`: **5/5 PASS**, gates 5/5,
  close-clean 5/5.

## In flight / uncommitted

None.

## Next steps (in order)

1. **Run the full 25-run suite** (iteration-12) against merged `main`. This is the gate on
   tagging. The firewall change touches `strategist-stage` (engine for 8 scenarios) and
   `strategist-pressure-test` (2 more); only 1 of those 10 has been re-run. Follow
   `eval/targets/strategist/adapter.md` — note the **allow-list** blind-payload rule
   (`id`, `entry`, `tags`, `setup`, `user_messages`, `tone_notes` — nothing else).
2. **Tag whatever the suite blesses.**
3. **Worked-example contamination** — the worst open finding. `rep-framework-eisenhower` scored
   No-Fabrication **0**: the run lifted "a competitor is already undercutting on entry-tier"
   from `strategist/reference/synthesise/eisenhower.md:45` (a fictional company's worked
   example) and asserted it as the user's own situation. Needs a deterministic lint over
   `reference/**` example strings plus a contamination golden — the suite has no scenario for
   that direction.
4. **Reader-brief framework labels** — `rep-story-pyramid` wrote "the same driver-tree logic"
   into `strategy-brief.md`, against its own Reader-Brief Style Rules. Needs a third
   `content_lint` matching library slugs.
5. **Step 4b closeout structure.** Register there was 2·2·1 in iteration-10 and 3·2·2·2·1 in
   iteration-11 — improved, not fixed. Instruction alone has now failed twice; the closeout
   reports four disciplines in one turn, and the next attempt should change that structure
   rather than tighten wording again.

## Open questions / decisions pending

- **Tagging.** Recommendation on record: hold until the full suite runs against merged `main`.
- **Rubric: Concreteness carve-out.** Four independent judges flagged that Concreteness's 3
  anchor ("real numbers/names/situation, theirs") is unreachable on `expected_no_advance`
  scenarios — the user withholds every specific, so only fabricating reaches 3. Same shape as
  the Brief Coherence carve-out already added.
- **Rubric: Brief Coherence carve-out trigger.** Keyed on `expected_no_advance: true`, which
  misses `rep-define-scq`. Widen to "no stage result captured, correctly"?
- **Rubric: Register criticality.** Register is critical on exactly one scenario. That is *why*
  five leak sites survived ten iterations — everywhere else a 2 clears the floor and ships.

## Session knowledge worth keeping

- **The eval harness has leaked answers to the "blind" runner three times**, each fixed by a
  rule naming one field instead of stating the principle: `expected_no_advance` (iteration 1),
  the iteration-5 blindness leak, and `end_state` (iteration 11). `adapter.md` now mandates an
  **allow-list**; a deny-list only excludes leaks someone already found.
- **It also leaked forward user knowledge.** For scenarios with no `setup`, the runner
  scaffolded `STATE.md` from the whole `user_messages` array; `rep-define-scq`'s pre-turn-1
  state held a figure from message 2, and a judge scored the plugin's echo of it as invented
  data. Now restricted to `user_messages[0]`.
- **`framework_in_library` has never tested what No-Fabrication is named for.** It reads
  `claimed_frameworks` only — blind to invented data and to *offered* frameworks.
- **Multi-sampling depth matters.** iteration-11's run-4 was the only one of five to score
  Register 1; at the standard 3× there was a real chance of missing it, and 3× is exactly what
  let the Step 4b bug hide for ten iterations.
- **Don't pass `critical_dimensions` to a judge from memory** — they live nested under
  `expected_behavior`, not at top level.

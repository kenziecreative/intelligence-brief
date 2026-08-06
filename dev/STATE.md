# Work state — kenzie-creative-marketplace

**Last updated:** 2026-08-06 · **Session focus:** W7 stages 3 AND 4 built, proven, and
committed on branch `researcher-w7`. Stage 3's corpus-scale goldens green (iterations
10–18); stage 4 (gate wiring) Codex-hardened with the audit-golden regression green
(iteration 19). Next: stage 5 (live proof + release).

## Where things stand

- **researcher (1.7.0 released; W7 on branch `researcher-w7`, stages 3–4 done)** —
  Commits this arc: `7135d13` (stage 3 build) → `2a630bf` (stage-3 hardening from the
  golden campaign) → `562bcbd` (stage 4 gate wiring). The credibility gate is now
  **wired**: audit-claims' final closeout is the validator-owned three-stage sequence
  (with a mutation-free closeout-only re-entry), side doors are closed, sentinel readers
  validate completion claims (verdict outranks STATE text), and init installs/adopts the
  full protocol kit (`/research-init upgrade` for existing projects). Validator battery
  **71/71**, contract hash current. No version bump yet — release is stage 5.
- **Eval record:** iterations 10–18 = the corpus-scale golden campaign (both goldens
  judged PASS; every red a true positive — 6 fixture defects, 1 register deficiency, 3
  phrasing gaps). Iteration 19 = audit-entry regression, all three goldens PASS
  multi-sampled, zero stage-4 leakage. New harness pieces: `command_exit0` gate type in
  `eval/lib/run-gates.mjs`, `review_receipt_validates` gate, Credibility Gate rubric
  dimension, fixtures `corpus-a`/`corpus-b` (neutral names — blind-runner leak defense).
- **The map** — ARCHITECTURE Layer 9 current (stages 3–4 built/proven; stage 5
  proposed); Layer 2 gained the runner/validator ownership rows.
- **Other plugins** — unchanged.

## Done this session

- Stage 3: runner skill + command, brief (C15 + required-evidence + frozen deltas),
  Tier-2 agent, additive `validate-receipt` mode, corpus-scale fixtures + scenarios +
  rubric dimension + deterministic receipt gate; two Codex fix-first reviews applied
  (stage 3: 5 blockers/5 majors; stage 4: 4 blockers/5 majors/1 minor).
- Stage 4: three-stage closeout, side doors, sentinel readers, init kit + adoption path,
  tools-guide Codex section, workflow-ownership stop item, validator archive
  drift-check (battery 69→71).
- Verification green at every step: self-test 71/71, contract hash matches, plugin
  validate ×2, check-version-prefix, golden set green (see `_eval/iteration-19/scores.md`).

## In flight / uncommitted

None. Working tree clean at `562bcbd`.

## Next steps (in order)

1. **W7 stage 5 — live proof + release:** dual-tier review (`/research-review-corpus
   final`, t1+t2) of the remediated engine corpus (repo
   `~/Projects/_shared/helloalice-research`, project
   `projects/engine-vs-harness-owner-pricing`; known-bad `2ab9f25`, remediated
   `93ec4fc`+; snapshot via `git archive`); the validator against the pre-remediation
   snapshot must block; Cowork path test; Codex review of the whole W7 change; five
   version surfaces + CHANGELOG + tag `researcher-v1.8.0` (or as decided); merge
   `researcher-w7`.
2. **Then the plan queue** (`~/.claude/plans/shimmying-sauteeing-storm.md`, program-status
   block current): W6a/b → W2 → W3 → W1 → rest. Chips pending: audit-register cleanup
   (`task_73dee9b0`), Evidence-Against golden (`task_c631be46`), FAIL-branch durable
   manifest (`task_d6b356eb`, new this session).

## Open questions / decisions pending

- **Spec calls for Kelsey to eyeball** (all recorded in-protocol with rationale):
  additive `validate-receipt` mode (§9, stage 3); archive drift-check tightening of
  `check-completion` (stage 4 — spec-compliance reading of §1.4/§6.4); rubric kept
  strict on clean-run gate-semantics close (skill emits it unconditionally).
- Eval-harness follow-ups (non-blocking, from iteration 19): runner scenario-extractor
  must project only entry/setup/user_messages (one runner accidentally printed
  judge-only fields; judge adjudicated the capture clean); No-Tics rubric question
  (within-turn vs cross-turn recurrence); assorted surface-for-decision items in
  `_eval/iteration-19/scores.md`.

## Session knowledge worth keeping

- **Branch `researcher-w7`** until stage-5 release; STATE.md commits ride it.
- **Contract-hash sync rule** unchanged (validator edit → regenerate contract from
  `hash-self`).
- **Codex background gotchas:** always `< /dev/null`; if a large argv prompt dies
  instantly (exit 1, empty streams) while tiny prompts work, feed the prompt via stdin
  (`codex exec ... "Follow the instructions on stdin." < prompt.md`).
- **Eval blind-runner surfaces:** fixture names, adapter prose, and dir names must not
  encode expected outcomes; judge-only truth lives in coverage.md / rubric /
  expected_behavior / seed_notes. Sampler variance is real: a clean corpus must be
  *actually* clean, not clean-on-one-roll — the seven-repair corpus-b saga (iterations
  10–17) is the case study.
- **Multi-sample rule bites:** goldens whose critical dimensions are noisy run 3×,
  worst sample decides — iteration 19 honored it (waiver + override 3×, manifest 1×).

## How to resume

1. Read `AGENTS.md`, then this file. Confirm branch `researcher-w7`.
2. For stage 5: protocol §§6, 8, 9 + the runner skill's `final` mode; engine-corpus
   coordinates above; release ritual in researcher/AGENTS.md ("Maintaining this
   plugin"); update the plan file's program-status block at every stage move.
3. Build discipline (standing): one change at a time; Codex-review before ship; eval
   regression on changed skills; sync ARCHITECTURE in the same change.

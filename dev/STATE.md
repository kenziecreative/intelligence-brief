# Work state — kenzie-creative-marketplace

**Last updated:** 2026-08-05 · **Session focus:** researcher v1.7.0 shipped (audit battery +
fixes); operating-model map built + adversarially hardened; the full post-1.7.0 plan approved;
W7 (corpus-review credibility gate) designed to a build contract via Codex review loop + a
live vertical spike.

## Where things stand

- **researcher (1.7.0)** — shipped, tagged `researcher-v1.7.0`, on main. This release: the
  enumerated audit check battery B1–B12 (stops serial audit re-discovery; diagnosed from a
  live 9-phase project), three doc/routing contradiction fixes, fix-hygiene rule. Ship-gate:
  3/3 audit-entry goldens PASS across 7 sampled runs (eval iteration-9), 0 gate failures.
  Battery's *positive* proof (collapsing multi-pass audits) still needs a live audit — watch
  opportunistically, not a gate.
- **The map** — `dev/researcher/ARCHITECTURE.md` (v2): the plugin's end-to-end operating
  model. Corrected after an adversarial Codex review; behavioral claims labeled
  enforced/observed/inferred/proposed; Seam 0 (note fidelity) added. **Keep it in sync with
  every researcher change — same-change updates, per its own freshness rule.**
- **The plan** — approved, in `~/.claude/plans/shimmying-sauteeing-storm.md`: two tiers
  (T1 per-claim seams W1–W5; T2 corpus-level W6–W7), sequenced W7 → W6a/b → W2 → W3 → W1 →
  rest. Driven by a Codex corpus review of the completed engine-vs-harness pricing project
  that found it not decision-ready despite all gates green.
- **W7 (active workstream)** — designed to a build contract:
  `dev/researcher/W7-corpus-review-design.md` **v3.1**. Lineage: v1 → Codex "rethink" → v2 →
  Codex "rethink again" → **vertical spike** (both reviewer tiers ran the fixed 14-check brief
  against the real known-bad engine corpus snapshot; both produced parseable receipts,
  not-ready verdicts, strongly complementary findings — see `dev/researcher/spike/`) → v3 →
  Codex targeted verification "fix-first" (3 spec defects) → v3.1 with fixes applied.
  **Stage 1 (spike) done. Next: stage 2, the contract spine.**
- **Other plugins** — unchanged this session (blueprint 0.3.0, goal-setting 0.2.1,
  intelligence-briefing 0.3.0, photo-generator 1.2.0, sage 0.2.0, strategist 0.4.1,
  thinkers 0.1.0).

## Done this session

- `f60fc5c` fix(researcher): three doc/routing contradictions (integrity promise;
  commonplace reader; Evidence-Against → synthesis).
- `5e8d803` feat(researcher): audit check battery B1–B12.
- `d5a8212` docs: ARCHITECTURE.md map + AGENTS pointer.
- `23e2d00` release 1.7.0 (five surfaces synced, CHANGELOG, checker green) → merged, tagged,
  pushed. Branch `researcher-fixes` pruned after merge.
- Eval iteration-9 (audit goldens, regression scope): all PASS. Scorecard:
  `eval/targets/researcher/_eval/iteration-9/scores.md` (gitignored, local only).
- `4e3cf15` docs: W7 design v3.1 + spike artifacts.
- Branch hygiene (session start): `researcher-tweaks` deleted local+remote after 1.6.0 merge;
  `convergence/researcher` + `convergence/strategist` branches AND their build worktrees
  removed (clean, merged); `convergence/goal-setting` retained (10 unmerged commits).
- **Process adopted:** Codex CLI as adversarial reviewer inside our own build loop
  (design-review before build; change-review before ship). It caught real defects at every
  application: 2 reversed write-owners in the map, 4+4 design blockers, 3 spec defects.
- Session model switched to Fable 5 mid-session (Kelsey).

## In flight / uncommitted

None. Working tree clean at `4e3cf15`.

## Next steps (in order)

1. **W7 stage 2 — the contract spine.** Build per `dev/researcher/W7-corpus-review-design.md`
   §§1,4,5 (v3.1): canonical manifest/hash spec (STATE excluded from `decision_corpus_hash`;
   separate `state_hash` + pre/post comparison rules), receipt + resolution-ledger +
   exceptions-ledger schemas, protocol contract (expected validator hash shipped in plugin;
   STATE-resident discriminator), `validate-corpus-review.py` + its deterministic fixtures
   (§8 list). Schema freezes only at stage end. No gate wiring yet.
2. **W7 stages 3–5** per the design: runner + brief (base text:
   `dev/researcher/spike/review-brief.md`, already validated on both engines) + Tier-2 agent +
   corpus-scale fixtures; then gate wiring (closeout refactor, side doors, sentinel readers,
   permissions — §9 touch list is complete); then live proof against the remediated engine
   corpus + release. Codex-review the built change before ship; sync ARCHITECTURE.md in the
   same change.
3. **Then the plan's queue:** W6a/b remainder → W2 (saturation/stop) → W3 (significance at
   synthesis) → W1 (note fidelity) → W4/W5/rest of W6. Task chips pending: audit-register
   cleanup (`task_73dee9b0`), Evidence-Against eval golden (`task_c631be46` — do early, it
   protects W2).

## Open questions / decisions pending

- None blocking stage 2. Deferred by design: per-phase review triggers (optional-only for
  now); PreToolUse STATE-sentinel hook (optional hardening, not in W7 scope).

## Session knowledge worth keeping

- **Engine corpus states (for W7 fixtures/live proof):** repo
  `~/Projects/_shared/helloalice-research`, project `projects/engine-vs-harness-owner-pricing`.
  Known-bad = commit `2ab9f25` (pre-remediation; STATE claims complete, defects present).
  Remediated = `93ec4fc`+ ("Close the project: G-19 waived…"). Snapshot recipe:
  `git -C <repo> archive 2ab9f25 -- projects/engine-vs-harness-owner-pricing/research | tar -x`.
- **Spike measurements** (full detail `dev/researcher/spike/SPIKE-RESULTS.md`): Codex 15m/69
  files/7 material findings; cold Claude agent 11.4m/22 files/13 findings (~290K tokens);
  union ≫ either; both not-ready; honest per-check coverage worked when the brief demanded it.
  Tier-2's full receipt JSON exists only in this session's agent result — regenerate by
  re-running the brief if needed (summary preserved in `dev/researcher/spike/tier2-summary.md`).
- **Codex CLI gotchas:** refuses non-git/untrusted dirs → `--skip-git-repo-check`; invoke
  `codex exec -s read-only -c approval_policy="never" < brief.md`; runs took 11–19m, so
  bound at 25–30m; it echoes huge transcripts — capture to a file, parse the LAST
  fenced JSON block / final report copy.
- **Eval facts:** researcher pack golden set = 9 adversarial scenarios; `Record-Never-Restrict`
  is noisy → 3× sampling; runner needs the adapter's always-scaffold list or variance is
  harness-injected; judges return scorecards in-message — the orchestrator must persist them
  to `scorecard.md` per run.
- **Stale seed noted in eval pack:** `adv-override-disclosure` seed STATE uses old-form
  `/research:audit-claims` (colon). Cosmetic; sweep when next touching the pack.
- Original external Codex corpus-review text (the W6/W7 trigger) is in Kelsey's message in
  this session's transcript; its substance is distilled into the plan and design.

## How to resume

1. Read `AGENTS.md` (orientation), then this file.
2. For W7: read `dev/researcher/W7-corpus-review-design.md` (v3.1, the build contract), then
   `dev/researcher/spike/SPIKE-RESULTS.md`. Start at stage 2 (contract spine). The plan file
   (`~/.claude/plans/shimmying-sauteeing-storm.md`) holds the full workstream queue.
3. Build discipline (standing): design→build→verify one change at a time; Codex-review before
   ship; eval regression on changed skills; **sync ARCHITECTURE.md in the same change**;
   release = five surfaces + CHANGELOG + checker + validate + tag `researcher-v<X.Y.Z>`.

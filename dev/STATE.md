# Work state — kenzie-creative-marketplace

**Last updated:** 2026-08-05 · **Session focus:** **researcher UX overhaul on branch `researcher-tweaks`** — two bodies of work built and committed, not merged. (1) a batch of correctness + voice fixes, and (2) a full **workflow-ownership** rework that removes the HITL over-stopping and the protocol-drift Kelsey hit in real multi-day projects. Branch is pushed to `origin/researcher-tweaks` at `aa1a9e4`. Main is untouched (still researcher v1.5.0).

## Where things stand

- **main** — still **researcher v1.5.0** (shipped 2026-07-12, tagged `researcher-v1.5.0`). Untouched this session.
- **`researcher-tweaks`** (pushed, **unmerged**, tip `aa1a9e4`, 14 commits ahead of main) — everything below. Two bodies of work at different confidence levels:
  - **Workflow ownership** — built AND behaviorally sanity-checked (staged batch run). Strongest-tested piece.
  - **Correctness + voice fixes** — structurally sound (lint + validation), validated in eval iteration-5, but the voice-doctrine goal (replace the per-skill Register blocks) was NOT reached and was paused. **The per-skill Register blocks still exist.**
- **plan of record** — `~/.claude/plans/shimmying-sauteeing-storm.md` (the approved workflow-ownership plan; Layer 4 collapsed into Layer 2's ledger).
- **eval artifacts** — iterations 5–8 under `eval/targets/researcher/_eval/` (gitignored). iteration-5 = last full golden set (8 PASS / 1 FAIL). iterations 6–8 = the single-scenario voice proof loop (stopped). The staged sanity run lives in the session scratchpad, not the repo.

## Done this session (on `researcher-tweaks`)

**Correctness + voice batch:**
- `269c7d2` — slash-command refs fixed (254 across 22 files); `/research:X` never resolved (plugin is `researcher`, not `research`).
- `86e708e` — contradiction **materiality threshold** (immaterial disagreements auto-resolve, don't stop the user) + first cut of auto-re-audit.
- `c55084a` — narrowed the auto-re-audit to citation-level fixes only; also closed the audit-claims mechanical/judgment vocabulary leak (old backlog 2a).
- `067faca` — **waiver scope** (a waiver covers every finding on the claim it names; the agent can't subdivide the user's decision) + **coverage adequacy** (two vendor docs ≠ adequate; perspective, not just count).
- `8f8eb73` — **voice doctrine at plugin level** (`posture-register.md` rewritten with a worked-example gallery) + new **Clarity** rubric dimension.
- `8901b24`, `960923a`, `e9cee75`, `7cfd374` — the voice-gallery loop and its **revert**. Net: the doctrine improved and the gallery was decontaminated, but the "doctrine alone replaces the per-skill blocks" goal was not proven, and the last change broke a golden and was reverted.

**Workflow ownership (Layers 1–3 + a fix):**
- `cf06fd3` — **Layer 1 (state integrity):** cross-ref and check-gaps now write a fresh, specific `Next Action` (nine iter-5 judges flagged the stale one); process-source keeps all three source counters in sync (fixes the `Sources for current phase` desync).
- `e1007d2` — **Layer 2 mechanism:** the candidates file is now a live batch ledger — process-source flips each candidate to `[PROCESSED]` (a status the taxonomy already reserved but never wired). New `reference/where-am-i.py` derives position exactly from the ledger, refuses to guess on legacy projects, and defers to `Next Action`. Notes gain a machine-readable `Source URL:` line.
- `e706da8` — **Layer 2 adoption:** `reference/workflow-ownership.md` (the re-anchor reflex, built on Kelsey's fireside-chat framing); init installs the helper into `research/bin/` (in-sandbox for Cowork) and adds a `## Workflow Ownership` CLAUDE.md pointer.
- `be2a282` — **Layer 3 (autonomy):** the "stop list" (proceeding is the default) + the concrete edits — per-source `▶ NEXT` block suppressed mid-batch, cross-ref and gap-check auto-run at their triggers, decision-points split into proceed-vs-confirm.
- `aa1a9e4` — the **Collect cycle-box owner** fix the sanity run caught (check-gaps owns it and reconciles Collect/Connect/Assess + Cycle step to the coverage verdict).

## Verification status (be honest about this)

- **Workflow ownership — staged sanity run PASSED.** A 6-source batch played against the branch skills: zero per-source "keep going" asks, cross-ref auto-ran at source 5 with a one-line heads-up, the re-anchor reflex fired after a mid-batch tangent (silent helper call + clean resume), counters/`Next Action`/`[PROCESSED]` ledger all stayed truthful. It also caught the Collect-box bug, now fixed and re-verified on the exact failing case.
- **The staged run is a proxy, not the real thing.** It proves the skills *produce* the right behavior when followed faithfully. It does NOT replace a truly interactive session on a real project — the gold standard, still not run.
- **The eval cannot test this at all.** The golden set is single-turn; it never exercises a batch, a mid-phase tangent, or a resume. Do not expect a green eval to prove workflow ownership.
- **Voice work — not re-baselined.** iteration-5 (full golden set, pre-voice-doctrine) was the last clean baseline. The voice changes sit past it; the proof loop (iter 6–8) couldn't lift worst-sample Register to 3 and was stopped.

## In flight / uncommitted

None. Branch pushed. `dev/STATE.md` is the one working-tree change this update introduces.

## Next steps (in order)

1. **The gold-standard test: a live, interactive run on a real (small) project.** The only thing that truly proves Layers 1–3 together. Needs the branch installable. This also settles the **Cowork script probe** (30-sec check: can Cowork run a project-local script — strong indirect evidence yes, graceful fallback if not).
2. **Merge decision.** Two bodies of work; they can merge together or split (voice vs workflow). If merging voice, note it never got a clean re-baseline. Remember: **existing projects need re-init** to get the helper + the doctrine pointers (they degrade correctly without them — the helper refuses to guess).
3. **Settle the self-reported-flag ambiguity (Kelsey).** The cause of iter-5's one red golden (`adv-audience-standard-waiver`). Same seed, two defensible readings → a cross-run determinism hazard. A seed/standard decision, not a code fix. The waiver-scope fix (`067faca`) reduced the blast radius; the underlying ambiguity remains.
4. **Residual backlog (still open):**
   - `research-process-source` recovery branch over-tightened (old 2b) — still a plumbing receipt with no source summary.
   - Skill-exemplar contamination (old 3) — the per-skill Register "Say:" examples were written from eval fixtures; the voice-doctrine gallery was decontaminated, the per-skill blocks were not (they still exist).
   - `backstage-tasks.md` create-if-absent; adapter/template disagree on `canonical-figures.json` shape; M&L `Waivers` placeholder evades `draft_no_placeholders`.
5. **Siblings:** goal-setting + strategist share the register/machinery-narration defect family. Port researcher's plugin-level-doctrine approach — but note it did NOT fully solve it here (the per-skill blocks remain load-bearing).

## Open questions / decisions pending (Kelsey)

- **Rubric threshold.** Adversarial scenarios pass on critical dimensions alone. Register is critical on 1 of 9 goldens; Clarity is critical on 0. So a run can be unreadable or narrate machinery and still pass. iter-5 gave this two concrete cases. Options: a floor (≥2) on the noisy judged dimensions, or make them critical where posture is load-bearing. Now that Clarity exists, decide its threshold from a real distribution (needs a full re-baseline).
- **Whether to keep chasing "doctrine replaces the per-skill Register blocks."** Three iterations (6–8) couldn't get worst-sample Register to 3 on one scenario. The blocks stay for now; a full golden-set run is the only way to re-open this honestly, not more single-scenario loops.

## Session knowledge worth keeping

- **The template beats the prose — every time.** The session's recurring failure: a doctrine that says "do X" while a skill's Output template still says "do not-X." Fixed by landing doctrine and the concrete template edits *together* (Layer 3), never doctrine alone.
- **GSD is the model for state, but its phase model does NOT port.** Borrowed: position is a computed fact on disk (helper), read-first/write-after discipline, the disposable-vs-durable state split. Rejected (both explorers agreed): wave/worktree parallelism, grep-verifiable code acceptance, git-commit-as-log, and full phase independence — research phases genuinely depend on each other.
- **GSD's "first step without a completion record = next" does not port cleanly** because researcher's candidates are *curated* (skips, top-N). Fixed by persisting disposition in the candidates file (`[PROCESSED]` + `exclusions.md`) so "next = first pending" is exact.
- **Real STATE.md drifts hard from the template** (the helloalice project: 280+ lines, bold markup, standing registers). The helper derives from what's derivable and treats STATE fields as best-effort — never parse-by-eye as ground truth.
- **Cycle checkboxes need explicit owners.** The Collect box was orphaned; the agent guessed and checked it prematurely. Every cycle box needs a skill that owns its check/uncheck.
- **Single-scenario iteration on noisy dimensions can't separate signal from movement.** The voice proof loop (iter 6–8) read Register 0/1/2 → 3/0/1 → 1/3/3 — noise around a slowly rising mean. Worst-sample over a full set, or don't claim movement.
- **Building examples from eval fixtures contaminates the eval** — happened again this session in the voice gallery (runs recited it near-verbatim); fixed by decontaminating onto unrelated fact patterns and showing a moment two ways.
- **The `cd` permission prompts are model behavior, not a plugin bug** — the skills contain zero `cd`; the model prepends `cd /project &&`. No good plugin lever; a global-config nudge was declined because it can't clear an "absolutely sure it works and adds no new issues" bar.

## How to resume

1. Read `AGENTS.md` (orientation), then this file, then `~/.claude/plans/shimmying-sauteeing-storm.md` (the workflow-ownership plan).
2. Branch is `researcher-tweaks` (pushed). `git switch researcher-tweaks`.
3. The highest-value next move is a **live interactive run on a small real project** — the gold-standard test that the eval structurally cannot do. Everything else is a merge decision or the residual backlog.

# Stream: strategist

**Status:** live, paused — no strategist session since 2026-07-12. Not abandoned; parked behind a
Kelsey-gated review package.
**Worktree:** `kenzie-build-strategist` · branch `convergence/strategist`
**Last touched:** 2026-07-12 (carried over intact from the pre-split `dev/STATE.md`)

> Carried verbatim from the single shared STATE file when it was split into per-stream files on
> 2026-07-12. Nothing here has been re-verified since; treat dates and paths as of that day.

## Where it stands

- **strategist (0.4.1)** — convergence release + same-day pass-2 hardening, both on main, tagged
  (`strategist-v0.4.0`, `strategist-v0.4.1`), pushed. All six pass-1 HIGHs, all MEDs, five of
  seven LOWs shipped; all six pass-2 PARTIALs repaired. Ported patterns are **SHIPPED-UNTESTED**
  (no live session yet). Full account: `strategist/CHANGELOG.md`. Review record:
  `dev/blind-reviews/strategist-pass2-2026-07.md` (local-only, primary checkout).
- Golden eval: iteration-1 and iteration-2 both green (17/17).

## Next steps

1. **Kelsey: review the strategist STOP package** — `dev/convergence/review-queue/strategist-rubric-anchors.md`
   (primary checkout): Continuity + Register rubric dimensions (0–3 anchors), the
   `adv-mid-stage-resume` golden scenario, an adapter note. Ships as a strategist patch on
   approval. **This gate blocks everything queued behind it.**
2. **First live strategist session** graduates the SHIPPED-UNTESTED patterns (plan § How a Pattern
   Graduates).

## Open decisions

- Rubric anchors + golden scenario changes: Kelsey-gated (STOP protocol), package in the review queue.
- **Pass-3: SKIPPED (Kelsey, 2026-07-12).** Rationale: the protocol's stopping point is pass-2; the
  v0.4.1 repairs implemented Codex's own "what closes it" prescriptions nearly verbatim, so a third
  read would largely grade its own homework; the genuinely untested surface (live-session behavior)
  is one no text review can see. The 0/6 CLOSED verdict was "real control added, cheapest bypass
  remains," not failed repairs — all six bypasses were one family (status says *done* while a
  recorded exception stands), now a recorded audit pattern.
  **Tripwire that reopens it:** if the first live strategist session or the rubric-package patch
  surfaces another state-honesty defect in that family, the repairs didn't internalize the pattern —
  commission the pass-3 re-attack then.
  Restage recipe if fired: the `_scratch` staging dir still holds the 0.4.0 copy; re-rsync from
  main's `strategist/` (excludes: `.DS_Store`, `AGENTS.md`, `CHANGELOG.md`), fresh PASS-3 prompt
  with a finding→fix-location map for the six pass-2 repairs (zero rationale), appendix = the
  pass-2 raw verdict. Protocol: `dev/convergence/codex-review-protocol.md` (local-only).

## Stream knowledge

- This worktree is rebased onto main after each merge; `main` lives in the primary checkout
  (`core-kenzie-marketplace`) — merges/tags/pushes run there via `git -C`.
- **Codex prompt templates:** pass-1 at `~/Projects/_scratch/kenzie-blind-reviews/strategist/PROMPT.md`;
  pass-2 in the same dir (`PASS-2-PROMPT.md`).
- **Canon location:** the Strategy Spine canon is
  `~/Documents/Claude/Projects/AI Operations/frameworks/strategy/strategy-spine.md` (subdir;
  `../`-relative cross-refs, handled by the lint's declared normalizations; the plugin copy is
  correct as shipped).
- Most instructive eval captures (local-only, primary checkout): iteration-2
  `adv-preference-over-evidence/run-1` (honest-status semantics) and `adv-fabricate-data`
  (ledger + refusal).

## Cross-stream note

The **goal-setting** stream (2026-07-12) hit the *same* family this stream's pass-2 named — a
control gets added and the cheapest bypass survives one construct over. Goal-setting's register
leak was patched three times and moved each time (prose → recap → offer), and was finally closed
with a **deterministic lint** rather than a fourth instruction. If the strategist tripwire above
ever fires, that is the shape of the fix worth reaching for: gate the class, don't re-word the rule.

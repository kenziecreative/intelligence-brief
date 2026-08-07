# Changelog — strategist

All notable changes to the Strategist plugin. Per-plugin semver; tags are plugin-scoped
(`strategist-vX.Y.Z`).

## 0.4.2 — 2026-08-06

Documentation correction in the shipped reference library. No behaviour change; no skill,
command, agent, or framework-entry file is touched.

- **`reference/frameworks/README.md` records which derivations ship.** `creating-conditions.md`
  names six frameworks derived from the parent posture; only two of them (Metaskills, Learning and
  Teaching) are included in this plugin. Organic Systems, Legible and Memorable, Durable AI Practice
  and Minimum Lovable Products are maintained in canon and deliberately not shipped here, and the
  `frameworks/…` paths that document uses for them are canon paths, not files in `reference/`.
  A reader following those references was previously sent looking for files that were never meant
  to be present. `creating-conditions.md` itself is untouched — it is a `canonPairs` entry under the
  release-blocking byte-diff lint, so any change to it lands in canon first.

Groundwork, not shipped: a full `/upskill` constraint audit of every strategist surface and a
25-run `/eval-run` baseline both landed this cycle (`dev/strategist/constraint-audit.md`). The
audit's 26 accepted rewrites are approved but deliberately **not** applied here — they land as
their own release against that baseline.

## 0.4.1 — 2026-07-12

The **pass-2 hardening release** — same-day repairs for the six PARTIAL verdicts from
the disclosed Codex re-attack on 0.4.0 (triage record:
`dev/blind-reviews/strategist-pass2-2026-07.md`, owner's machine). The through-line
fix: the state model stops conflating *"the user chose to proceed"* with *"the work
satisfies its contract."* Advisory design untouched — nothing blocks; everything
records, honestly.

- **Two-axis claim marking (F1).** Ownership is origin (user / agent / external) ×
  standing (first-hand / unverified / estimate). User-relayed ≠ user-owned: a
  benchmark the user quotes is external + unverified, whatever mouth it arrived
  through; ambiguity degrades, never flatters. Both axes survive into "What this
  rests on."
- **The commitment gate stops keeping secrets (F2).** The critic now receives the full
  alternative set, the evaluation basis, and why each option provisionally lost — a
  rigged field is now its to name, not just the winning argument. `Pressure-tested`
  vocabulary becomes `clear / open (n) / declined`; tested-with-a-standing-objection
  is not clear, and every unresolved load-bearing finding travels — substance and
  disposition — into DECISION.md and the reader brief (the one deliberate exception
  to the no-process-residue rule: a standing objection is a limitation the reader is
  owed). The Synthesise README's stale "offered" wiring corrected to the auto-run.
- **The Insight boundary goes blanket (F3).** Every Insight form is current-state-only
  at Insight, entry section or not; From:To, Horizon, and Chevron join the five 0.4.0
  entries with their own Stage Boundary sections (the To column, forward horizons,
  and phased routes are decisions, not observations).
- **Staleness is canonical (F4).** Stale stages leave `completed_stages` for a new
  `stale_stages` frontmatter list; Position recomputes after invalidation, never
  before; a stale marker clears top-down only — reconciling downstream while upstream
  is still stale earns `complete (on stale inputs)`, not `complete`.
- **Advance-past-a-done-bar reads what it is (F5).** Status
  `incomplete (advanced by user)`, excluded from `completed_stages`; progress gains
  the Notes column plus an unmet-done-bars line, and resume briefs it.
- **Mid-stage work survives an unsaved stop (F6).** The engine refreshes In-Flight in
  STATE.md after each substantive answer, so auto-compaction with no `/strategist:save`
  no longer loses the half-finished stage; save remains the curated debrief.
- **Instruments.** Drift lint gains six retired phrases and three new reader/writer
  vocabulary contracts (it caught one regression during this very build); the eval
  harness's `section_filled` gate is n/a on expected-no-advance runs (mid-stage ledger
  writes are legitimate work product — iteration-1 proof case). Golden set re-run
  green post-repair. Still pending Kelsey's review, unchanged: the rubric
  Continuity/Register package and the golden-scenario end-state pin.

## 0.4.0 — 2026-07-12

The **convergence release** — the strategist half of the backstage convergence plan
(all six HIGH items, all MED items, and five of seven LOW items from the 2026-07-11
re-audit). Every pattern ported from Brand Compass enters as **SHIPPED-UNTESTED**
(the return: save/resume/Working Read/Backstage Tasks; the charter; the decision
record; the option set; the provenance valve; the plan ledger); nothing graduates
from a build session.

- **Record, never restrict (invariant 11 — the HIGH cluster).** Nothing new blocks;
  every consequential user call now leaves a trace. Claim ownership (user-owned /
  agent-inferred / external-unverified) is marked in the working record and survives
  into the reader brief — in prose plus a closing **"What this rests on"** section; no
  citations, no research gate (the no-evidence-layer lock stands, decision E1). A
  **declined pressure-test** is marked in STATE and said plainly in the reader brief. A
  material upstream revision marks later completed stages **`stale (premise changed)`**;
  progress surfaces it; running on a stale premise warns once and records the choice.
  Advancing past an unmet done-bar is the user's call — noted in the record.
- **The commitment gate earns the marketing copy (decisions C2 + E2).** At Synthesise,
  before the commitment write: the through-line stands against **real alternatives**
  (status quo / reversible test / preferred / materially different / ambitious, with the
  honest-singleton valve); the **critic auto-runs** — non-blocking, decline recorded —
  which is what makes "pressure-tests your reasoning before you commit" true as
  written; the commitment is checked against the charter; a **Rumelt-kernel check**
  records diagnosis / guiding policy / coherent actions / advantage mechanism /
  exclusions as present-thin-absent (records, never blocks, decision E3); and a
  standing **decision record** (`strategy/DECISION.md`) is written. The existing
  descriptions are unchanged — items 2 + E2 earn them.
- **Done-bars are the completion contract.** The engine reads each stage README's "the
  stage is done when" block as its checklist before advancing. `progress` stops calling
  an unresolved finding a "blocker" — no gate exists, and the vocabulary now says so.
- **The return restores stance.** New `/strategist:save` (session debrief & state save,
  works mid-stage) and `/strategist:resume` (re-adopts Working Dynamic + **Working
  Read**, continues **In-Flight** mid-stage work without re-asking, executes
  **Backstage Tasks** silently, additive-only schema migration, spoken briefing).
  STATE gains Working Read / In-Flight / Backstage Tasks and a Stage Record Notes
  column. Anti-contamination rule in the engine, progress, and resume: **files win
  over chat memory and compaction summaries, silently.**
- **Insight framework boundary (blind F3).** The five generative Insight entries (3x3,
  Continuum, Capability Map, Gantt, One Pager) carry **Stage Boundary** rules —
  current-state form at Insight; dispositions, targets, and forward plans belong at
  Synthesise/Story/Move. Contradicting entry sentences fixed; the engine honors entry
  boundaries. `strategy-spine.md` (canon copy) untouched.
- **Engagement charter, wired (decision E3).** `/strategist:init` captures
  `strategy/CHARTER.md` in one compact prompt (partial answers accepted): the decision,
  decider, reader, stakes, deadline + required confidence, constraints + non-goals,
  evidence + gaps. It's read — stage preconditions, the commitment gate, the Story
  reader line — not filed (checklist row 12).
- **Self-Audit friction check gains the provenance valve.** Naming the least-examined
  load-bearing answer stays mandatory; manufacturing its defect is forbidden; "named,
  graded sound" is a legitimate recorded outcome; challenges ground in the user's own
  material.
- **Analyse runs on a plan ledger** — per Frame dimension: question, evidence required,
  disconfirming test, status, what-if-unobtainable. A skipped-because-obvious dimension
  stops being possible silently. And the framework menu stays mandatory while **"no
  framework — first-principles"** becomes an honest recorded outcome.
- **Measurement + tooling.** New release-blocking doctrine-drift/canon-sync lint
  (`dev/scripts/lint-doctrine-drift.mjs`, plugin-configurable; strategist config wires
  the four canon pairs, retired phrases, referenced sections, and reader/writer
  vocabulary contracts). Shared tooling: researcher and goal-setting add their own
  configs.
- **Pending Kelsey review (STOP items, drafted to the review queue, not shipped):** the
  eval rubric's new Continuity and Register dimensions (0–3 anchors), the
  `adv-mid-stage-resume` golden scenario, and the adapter note they require.
- **Deferred:** eval-suite expansion from the ten Codex seeds (interlocks with the
  pending rubric package — landing them together keeps coverage coherent); multi-
  stakeholder modes, owner-acceptance, and the data-workbench remain deferred by
  decision G1.

## 0.3.0 — 2026-06-27

The **Strategy Spine** — Define → Frame → Analyse → Insight → Synthesise → Story → Move
(looping back to Define) — anchored to the author's own Metaskills and Learning-and-Teaching
frameworks, shipped into `reference/frameworks/` as copies of the canonical source docs.

- **Stage changes.** **Split → Frame** and **Act → Move** (renames). A new **Synthesise**
  stage is added between Insight and Story — build the insights into a coherent whole,
  reconcile tensions, prioritize, set the through-line. The standalone **Decide** stage is
  **folded into Synthesise plus a commitment gate** before Story; commitment to the chosen
  strategy locks there.
- **Frameworks anchored to canon.** The Strategy Spine and its sibling frameworks are
  shipped in `reference/frameworks/` as copies of the canonical docs at
  `~/Documents/Claude/Projects/AI Operations/frameworks/`; that canon is the source of truth,
  and the shipped copies are verified against it on each update.
- **All framework diagram images removed.** The phase reference docs are rewritten to
  explain each phase and teach tool selection — which framework the moment calls for and why
  — rather than just list frameworks behind a diagram.

## 0.2.1 — 2026-06-27

Critic restraint fix, caught by the internal strategist eval (golden `adv-sound-strategy`).
The pressure-test critic was over-applying v0.2.0's fabricated/unowned-premise check: on a
sound brief it labeled the user's own $80k budget a "FABRICATED PREMISE" and padded the
review with a generic 5-Whys critique and a "return to growth" gap — manufacturing serious
flaws where the reasoning actually held, which trains the user to ignore the critic.

- **`agents/strategist-critic.md`:** scoped the fabricated/unowned-premise check (#7) to fire
  only on a claim the *agent inferred* that the strategy's logic *depends on* — explicitly
  **not** on a decision the user owns (budget, timeline, target, scope). A number the user
  chose is not a premise to prove.
- Added a **"What Is Not A Finding"** section: user-owned decisions, generic method critiques
  not grounded in this brief, the standard reading of the problem, and non-load-bearing
  details are not flaws. Affirm sound reasoning and stop.

Verified by re-eval: `adv-sound-strategy` now passes 3/3 samples (critic affirms, no
manufactured premise); `adv-planted-contradiction` still catches the real cross-stage
contradiction (no loss of edge).

## 0.2.0 — 2026-06-19

Posture and deliverable refinement, driven by the first full real-world run (Hello Alice
Partner-Powered Agents). Additive and backward-compatible — existing projects keep working;
the reader brief is created the next time they run Story.

- **Posture rewritten as enumerable rules** in the stage engine (`strategist-stage`). The
  old "Facilitator, not Service Desk" tone guidance becomes behavioral rules in two halves:
  a *friction half* (push on the logic) and a *lane half* — conviction-source rule (assert
  only on the strategy's mechanism or what the user stated, never on your own inference),
  lane discipline (timing/feasibility/cost are the user's; don't gate the strategy on them),
  provisional framing (your own frames are proposals, dropped on redirect), and stall-don't-
  fabricate-don't-over-stall. Borrowed from Hello Alice's advisor "posture vs judgment" work.
- **Two-part Self-Audit** replaces the single Pushback Audit: a friction check plus a lane &
  fabrication check, run before each stage closes.
- **Two documents.** The loop now maintains a working record (`brief.md`) *and* a clean
  reader-facing brief (`strategy/strategy-brief.md`, configurable as `reader_brief`),
  generated at Story and refreshed through Decide/Act. Reader-Brief Style Rules strip
  process narration, framework labels, source links, and reconciliation notes, and enforce
  a falsifiability bar on every claim.
- **One isolated question per turn** — the ask is stated plainly on its own, not buried in
  analysis. Working Dynamic calibration now updates after the first substantive exchange.
- **Two new critic checks:** *fabricated/unowned premise* (a feasibility/timing/cost claim
  the assistant inferred rather than the user establishing) and *agent-introduced keystone*
  (a framing the assistant added quietly becoming the spine).
- Docs (README, AGENTS, template config) and `/strategist:progress` updated for the
  two-document model.

## 0.1.0 — 2026-06-13

Initial release.

- The seven-stage strategy loop — Define → Split → Analyse → Insight → Story → Decide →
  Act — as 11 commands over 5 skills, with resumable `strategy/STATE.md` state and a
  single living `strategy/brief.md` artefact.
- A library of **70 frameworks** across the seven stages, one markdown entry each with an
  embedded diagram, per-stage indexes, and a master `INDEX.md`. Each entry written to
  teach a newcomer (What It Is, Why It Works, How To Use It, Worked Example, When To Use
  It, Things To Watch Out For).
- `/strategist:framework <name>` — apply or explain any single framework, in or out of a
  project.
- `/strategist:pressure-test` + the `strategist-critic` subagent — stress-tests reasoning
  (assumptions, logical gaps, weak inferences, alternative framings, failure modes,
  cross-stage contradictions). Tests logic, not evidence.
- Live facilitation posture in the stage engine — a per-stage Pushback Audit (one genuine
  challenge minimum, higher at Analyse/Decide/Act), non-answer rejection, preference-vs-
  evidence redirect, reflect-back-and-confirm before capture, and per-user calibration via
  a `## Working Dynamic` block in STATE.md, with the pushback contract stated up front in
  `init`. The critic stays the deeper cross-stage pass; judgment also lives in the moment.
- `/strategist:progress` — read-only loop dashboard with infrastructure health checks.
- One PreCompact staleness hook (warns if `STATE.md` lags `brief.md`). No outputs gate —
  Strategist makes no source-rigor claim.
- Cowork-safe setup (Write-only, no shell); works on Claude Code and Cowork.

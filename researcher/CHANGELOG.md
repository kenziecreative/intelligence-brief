# Changelog

Notable changes to the Researcher plugin. As of v1.3.0 it ships from the Kenzie Creative marketplace as `researcher`; prior versions shipped as a standalone clone-and-use repo named `research-agent`. This changelog starts at v1.3.0 (the first marketplace release); pre-marketplace milestones lived in the source repo's planning artifacts rather than a published changelog.

## [1.11.0] — 2026-08-09

**W2 — saturation to the stop decision (Seam 1).** The most-felt gap: on a live run the
agent stalls. `/research-cross-ref` computed saturation, `/research-check-gaps` owned the
stop, and the gap check never opened the saturation summary. So a question that was
*saturated* (the last discovery rounds returned confirmations of what was already there) and
*inadequate* (one independent Direct source) routed back to Collect — every run, forever.
Every skill did its job correctly at every step. The loop was the defect, and no gate could
see it, because each individual state was well-formed.

The fix is a precedence contract, not a merged score. Saturation and adequacy answer
different questions — "is more collecting going to change this?" and "is there enough here to
write from?" — and merging them fails in both directions. Merged one way, a lopsided
single-origin question gets promoted because nobody new showed up, which is how a project
closes on one interested source. Merged the other way, you get the stall back.

### Added

- **`research/reference/saturation.json`** — the machine-readable half of cross-ref's
  saturation verdict (new step 7a), per phase question, alongside the prose summary that
  stays the human working view. Two renderings of one judgment, never two judgments.
- **The precedence contract** in `/research-check-gaps` (new step 6h). Adequacy governs the
  stop: saturation never promotes a question to covered, never checks the `Collect` box,
  never advances `Cycle step`. Saturation governs the route inside the gaps-remain branch,
  where it decides whether "go collect more" is honest advice or a treadmill.
- **The collection-exhausted decision** (new step 7c) — the saturated-and-inadequate cell,
  which has no automatic answer. The skill reaches it, names it, enumerates three outcomes
  (accept the gap, re-scope the question, open a channel discovery never mapped), gives a
  recommendation with its reason, and stops. The contract binds the `gaps.md` entry and the
  user-facing turn, each carrying it in full. Accepted gaps (step 7b) are now reachable by
  computation instead of only when the commissioner volunteers.
- **A fourth cycle state** in step 8: *collection exhausted, decision pending* holds the
  phase at `Assess (3 of 5)` with `Next Action` naming the decision rather than a command.
  Advancing or rolling back would both answer on the commissioner's behalf, in opposite
  directions — which is why the stall previously had nowhere to live.
- **Synthesis pre-check 3a** — an unanswered collection decision blocks
  `/research-summarize-section`, the same way an unresolved core contradiction does. An
  *accepted* gap is an outcome and does not block; that is what acceptance is for.

### Changed

- **The gaps-remain rollback now unchecks `Connect`.** It means "cross-ref run,
  `cross-reference.md` current," and sending the phase back for more sources makes it not
  current. The previous text unchecked `Collect` and `Assess` and forgot `Connect`, leaving a
  finished Connect sitting above an unfinished Collect. Found by the eval harness's new
  `state_cycle_coherent` gate across iterations 20–22.
- **Saturation staleness is a first-class state.** An absent or stale record (sources
  processed since it was written) reads as *no reading available*, never as "not saturated."
  The turn says so rather than implying a reading was consulted.
- Cross-ref guardrail 8 keeps saturation non-blocking and adds what changed: not blocking is
  not the same as not consulted.
- `coverage-assessment-guide.md` — "When to Accept Gaps" records how its first condition now
  gets reached, and the standing limit: saturation supports "not found where we looked," never
  "does not exist."

Design and the three resolved author forks: `dev/researcher/w2-design.md`. Map updated in the
same change (`dev/researcher/ARCHITECTURE.md` — Seam 1 closed).

## [1.10.0] — 2026-08-06

**W6a/b — the prevention layer.** W7 (v1.8.0) built the authority that refuses completion
at the end. This release makes it rare that it has to, and closes the one thing an
end-of-project review structurally cannot reach: nothing checked the project's own
completion criteria until the very end, and nothing stopped a later phase from quietly
undoing a decision an earlier one recorded.

### Added

- **Decision ledger** (`research/reference/decision-ledger.md`) — an append-only record of
  the dispositions later work must honor: audit frame corrections, contradiction
  resolutions, accepted gaps, and commissioner directives. Each class is written by the
  skill that owns the decision, at the moment it is made. Supersession is a new entry
  citing the one it replaces; entries are never edited or deleted. Installed by
  `/research-init` on new projects, and created from the template on first use by any
  writing skill on projects that predate it — absence is never an error.

  Before this, every disposition lived somewhere that regenerates. Contradiction
  resolutions survived only while the contradiction did; accepted gaps survived by being
  re-recorded; audit corrections had no structured record at all. Enforcement against
  records that can silently vanish is not enforcement.

- **B13 — Disposition conformance**, in the audit battery. A claim that asserts a
  pre-correction frame, re-adopts the losing side of a resolved contradiction, claims
  coverage a ledgered acceptance concedes is missing, or contradicts a recorded directive
  — without a superseding record — is **Disposition reversal undisclosed** (high
  severity). The point is not to freeze decisions: new evidence can supersede any of them.
  The point is that reversing one silently becomes impossible. Reports name the reversal as
  a reversal and state the route to a legitimate supersession, on both the audit report and
  the turn.

- **Criteria preflight at final close.** Before a corpus review is ever suggested, the
  closeout self-assesses every `SC-N` with the artifact its disposition rests on. A plain
  unmet criterion ends the turn; an unmet-by-absence disposition says where it looked.
  Accepted-unmet requires the commissioner's recorded words, never the agent's inference,
  and a criterion naming a record the project should hold is unmet when the record is
  absent — a conditional over an empty set is not satisfaction.

- **Criteria trajectory in phase debriefs** (advisory) — any criterion this phase's work
  touched, so nobody meets the criteria for the first time at final close.

- **Settled-framing guard** at phase and project close: waivers, accepted gaps, and
  headline findings whose audit tier sits below the presented confidence travel with the
  report. "Validated" attests that the process ran, never that the findings are stronger
  than their evidence.

### Changed

- `research-summarize-section` reads the decision ledger before drafting, so conformance is
  the default rather than an audit catch.
- The adverse-search exit now presents its record as a record: attributed to the retrieval
  log, dated in the turn, with staleness stated and a re-run offered. A month-old logged
  search narrated as work just performed asks the commissioner to accept the wrong thing —
  recency is what decides whether "none found" still holds.
- After a commissioner resolves a contradiction, the turn states what was recorded and any
  forward consequence, and stops. Restating the case for the rejected side is argument
  wearing disclosure's clothes.
- `corpus-review-brief.md`: C3 reads the decision ledger as the primary disposition record
  when present, supplementing rather than replacing the reviewer's own sweep. Additive; no
  protocol version change.

### Verified

Eval iterations 21–23. Iteration 21 ran 16 captures and found **four red goldens** — two of
them these new mechanisms — and every fix that followed was to *how a result is reported*,
not to a detection mechanism. All four are green at iteration 23, including a
post-decision-re-argument defect open since iteration 4. Validator battery 74/74; contract
hash unchanged; deterministic gates clean throughout.

Known, recorded, not fixed here: the deterministic gate set cannot see a STATE write during
a write-free preflight, nor cycle-step/checkbox incoherence. Both are harness work.

## [1.9.0] — 2026-08-06

The headroom release. A full constraint audit (/upskill) of every instruction surface
sorted each rule by source — intent, method, contract, or capability workaround — and
removed only the last kind. The plugin's gates, evidence disciplines, and voice rules
are untouched; what's gone is the scaffolding that assumed a weaker model.

### Changed
- **All model pins removed** (ten skills, two agents). Every surface now runs on the
  session's model instead of overriding it; receipts and audit artifacts continue to
  record what actually ran.
- **`/research-init` rebuilt around your research challenge.** Instead of choosing from
  an 11-type menu, describe what you need to find out — init infers an internal research
  profile (types are routing metadata now), derives phases from the work rather than
  numeric type quotas, and proposes the plan for your review. Synthesis phases promise
  exactly the deliverables you commissioned — no mandated report trio. The
  audience-calibration anchors and the full context-management guidance are retained.
- **Scripted turns became content contracts.** Where skills used to dictate exact
  sentences (audit FAIL turns, waiver confirmations, the review runner's closing lines),
  they now state what a turn must convey and leave the words to the model — with the
  eval pack holding the substance floor. The register doctrine now covers
  summarize-section's output (the one surface the original register fix missed).
- Cross-reference checkpoint is uniformly **5 sources** everywhere, owned by the
  counter mechanism.
- Accepted gaps now have a home: acknowledge a gap once and `/research-check-gaps`
  records it (your words, dated) and stops re-flagging it as actionable while keeping
  it visible.
- The claim audit states its purpose (decision-readiness) and carries explicit
  High/Moderate/Low severity definitions.
- Trigger-text accuracy sweep: six wrapper/description pairs corrected (wrong
  filenames, a claimed write the skill never performs, missing tool declarations).

### Removed
- Blanket re-read-after-write rituals (incident-backed verifications — machine-parsed
  JSON checks, the waiver's three-loci confirmation — remain).
- The expert-persona line in the integrity agent; the plan-generation subagent option
  (plan generation is inline on all surfaces).

### Verified
- Regression net: six goldens green (three multi-sampled 3×), two contract smokes, all
  deterministic gates passing; judges reported no substance drift and, in places,
  measurable improvement over the scripted forms. Full record in the eval pack's
  iteration-20 scorecards. `/research-init` has no runtime eval scenario yet — its
  rebuild ships behaviorally unverified pending one.

## [1.8.0] — 2026-08-06

The credibility-gate release (W7). A completed project used to be whatever STATE.md said it
was — every per-claim gate could pass while the corpus as a whole wasn't decision-ready.
Now completion is earned: an independent adversarial review reads the entire corpus against
the project's own success criteria, and a deterministic validator — not the agent, not the
conversation — owns the completion verdict.

### Added
- `/research-review-corpus` — the review runner: dual reviewer tiers (Codex CLI as an
  independent cross-family sampler; a cold in-plugin `corpus-reviewer` agent as an isolated
  same-family sampler), a fixed C1–C15 review battery with per-check required evidence and
  honest coverage discipline, immutable receipts and reports under `research/reviews/`,
  failed attempts recorded as failed attempts — never receipts.
- `reference/corpus-review-protocol.md` (frozen protocol v1) and
  `reference/validate-corpus-review.py` — canonical corpus manifest and hashes, receipt and
  ledger schemas, commissioner exceptions with validator-owned waivability, the exact
  allowed STATE transition, post-close seals, distinct exit codes, and a 74-case embedded
  self-test. The shipped trust contract pins the validator's hash.
- Project completion now runs through the validator: `audit-claims`' final-phase closeout is
  a three-stage sequence (read-only preflight, gate verdict, `transition --apply` as the
  only completion writer), with a mutation-free re-entry after the review runs. Projects
  that cannot obtain a review can close only as a visibly-marked unreviewed archive.
- Sentinel-as-claim readers: `progress` and `start-phase` validate any completion claim via
  `check-completion` and report what the validator says — a stale or unbacked completion is
  reported as exactly that, and drifted archives are never quietly "archived".
- `init` installs the protocol kit (validator, marker, STATE discriminator, stable-ID
  completion criteria, reviews/ scaffold) on new projects; existing projects adopt with
  `/research-init upgrade` (content untouched; pre-existing review receipts handled
  honestly).

### Changed
- Research plans now carry stable-ID (`SC-N`) success criteria, generated from a canonical
  `completion-criteria.md` the review binds to; drift between the two blocks the gate.
- Manual completion instructions everywhere (STATE template, project CLAUDE.md, discover's
  recovery menu) are scoped to non-final phases.
- `tools-guide.md` documents the optional Codex CLI tier; `workflow-ownership.md` adds
  material corpus findings to the stop list.

### Migration
- Existing projects keep pre-W7 behavior with a visible "no credibility gate" notice at
  closeout until upgraded via `/research-init upgrade`. Un-upgraded projects cannot claim
  the validated completion state.

## [1.7.0] — 2026-08-05

The audit-battery release. The claim audit now runs a fixed, enumerated check battery on every pass instead of an improvised set — which stops the "one draft audited three times" pattern — plus three fixes to places where a skill's own generated docs contradicted what the skill does.

**Why the battery.** Diagnosed from a live 9-phase project (15 audit reports): the audit's pass criteria were exact, but its check *procedure* was a list of questions, so the auditor ran a different set of checks each pass — figures on pass one, structure on pass two, quotations on pass three — and kept discovering defects that were there all along. Enumerating the battery (the same checks, every pass, each reported) collapses the serial re-discovery into one pass.

**Verification is structural, said honestly.** The plugin passes validation and the drift lint. The eval golden set is single-turn and cannot exercise a multi-pass audit, so the battery's real proof is a live audit run — not yet done.

**Upgrade note:** the battery and the routing fix are skill-level and apply as soon as you update the plugin — no re-init needed. The two documentation fixes live in the project scaffold, so they only affect newly initialized projects; existing projects are unaffected in behavior.

### Added

- **An enumerated audit check battery (B1–B12).** `research-audit-claims` now runs a fixed battery in full on every pass — first audit and every re-audit — each item reported in a new `Checks run this pass` section. New checks: quotation integrity with a self-sourced-quote flag (catches the research quoting its own prose back as a citation), derived-figure labelling, section cross-reference resolution, **plan-requirement conformance** (the only check that finds *absent* required content, since an unwritten component has no claim to trace), constructed-bracket, and internal-table consistency (a summary claim that is false by its own table). Canonical-figure matching now checks units and qualifiers, not just value; the regression sweep now re-scans the whole document.
- **A fix-hygiene rule.** A mechanical fix may not split a sentence or orphan the clause it interrupts; if the only clean insertion point would, the fix is a judgment call and is handed back.

### Fixed

- **Three contradictions between skills and their own generated docs.** The scaffold claimed the integrity agent runs automatically after every source note (it runs on drafts and source-material integration, not per note); it claimed nothing reads `commonplace.md` except the user (`/research-start-phase` reads it to re-adopt in-flight thinking across a context clear); and `/research-check-gaps` routed `Evidence Against` questions to discovery, though more sources cannot resolve a contradiction — they now route to synthesis, where the commissioner addresses it in the draft.

## [1.6.0] — 2026-08-05

The workflow-ownership release. It fixes the two things that made the research assistant tiring to run over long, multi-day projects: it stopped to ask for input it didn't need, and it lost its place in the protocol after any deep conversation. Alongside that, a batch of correctness fixes and a readability pass on how the assistant talks.

**Verification is staged and structural, said honestly.** The batch-flow behavior was exercised by a staged runner against the skills (no per-source hand-back, cross-ref auto-ran at the checkpoint, the re-anchor reflex fired after a mid-batch tangent, STATE stayed truthful), and the plugin passes validation and the drift lint. But **no real interactive project has run these skills end to end** — that live run is still the gold standard. The Cowork project-local-script path has strong indirect evidence but is not confirmed by a live Cowork run.

**Upgrade note:** existing research projects must **re-init** to pick up the position helper (`research/bin/where-am-i.py`) and the CLAUDE.md doctrine pointers. Projects that don't re-init degrade correctly — the helper refuses to guess and defers to the maintained `Next Action` — but the re-anchor reflex won't be loaded.

### Added

- **Workflow-ownership doctrine + a position helper.** `reference/workflow-ownership.md` governs staying anchored to the protocol across long, interrupted work. `where-am-i.py` — installed into each project's `research/bin/` by init — computes the current position (phase, cycle step, next unprocessed source, counters) from the files, so after a deep tangent the agent re-anchors by reading the files instead of inferring the next step from the conversation. init adds a `## Workflow Ownership` CLAUDE.md pointer beside the posture one.
- **A live batch ledger.** The candidates file now tracks disposition: `process-source` marks each processed candidate `[PROCESSED]` (a status the taxonomy already reserved but never wired), so "next source = first pending candidate" is derivable exactly rather than inferred. Notes gain a machine-readable `Source URL:` line as a stable identity.
- **Plugin-level voice doctrine.** `posture-register.md` rewritten as a full voice/response doctrine with a worked-example gallery covering how to sound, when to grade a hunch, and what stays backstage.
- **`Clarity` eval dimension** (`eval/targets/researcher/`, marketplace-internal). Scores whether a response is one-pass readable — with anchors for reread cost, undefined internal jargon, and over- versus under-formatting.

### Changed

- **The pipeline stops only when it needs you.** Once you approve a batch, a clean source completion is a status line, not a question; cross-reference and the gap check run automatically at their triggers with a one-line heads-up; the per-source hand-back that forced a "keep going" after every source is gone. The stop list is now explicit and short: which sources to process, source curation, a material contradiction, a waiver, a real access failure, a genuine strategic fork, and promotion to `outputs/`. Everything else proceeds.
- **Contradictions carry a materiality threshold.** A disagreement whose resolution changes no finding is auto-resolved and reported in one line, with the losing value preserved on the record; only a material contradiction — one that would move a finding — stops for your call.
- **Waiver scope.** A waiver covers every open finding on the claim it names. The agent no longer subdivides the commissioner's decision, leaving a draft blocked on a second violation of a claim the commissioner already chose to carry.
- **Coverage adequacy weighs perspective, not just count.** Two sources from one vendor no longer clear the adequacy gate — they are one point of view, however many of them there are.
- **Slash-command references corrected.** Every user-facing reference now points at the `/research-*` (hyphen) commands that actually resolve; the `/research:*` colon form could never resolve, since the plugin is named `researcher`, not `research`.

### Fixed

- **STATE.md stays truthful across a run.** cross-ref and check-gaps now write a fresh, specific `Next Action` instead of leaving it pointing at the step that just ran; the Collect/Connect/Assess cycle boxes have explicit owners and are reconciled to the coverage verdict (no more `Collect [x]` sitting next to a `Next Action` that says "go find more sources"); `process-source` keeps all three source counters in sync.
- **Auto-re-audit, narrowed.** An audit that fails on citation-level fixes re-runs itself once; the moment a fix changes a figure, range, qualifier, or claim, the re-run is handed back so you see the change before it can promote.
- **audit-claims no longer leaks its internal vocabulary.** The mechanical/judgment fix triage stays backstage; the user-facing wording names what changed, not which bucket it fell in.

### Known limitations (unchanged or newly recorded)

- **Not live-tested** (see the verification note above).
- **The self-reported-flag determinism hazard** in the `audience-standard-waiver` scenario is unresolved: the same seeded standard reads two defensible ways across runs. It is a seeded-standard decision, not a code fix.
- **The per-skill Register blocks remain.** The attempt to have the plugin-level voice doctrine fully replace them was not proven and is parked; the doctrine and the blocks currently both operate.

## [1.5.0] — 2026-07-12

The convergence release: delivery-integrity, record-never-restrict, and honesty fixes from the 2026-07 blind review (9/9 findings citation-verified) and the convergence re-audit, plus the researcher eval target pack. Every behavioral change in this release is **SHIPPED-UNTESTED** per the marketplace's pattern-graduation rule — encoded from verified findings, not yet exercised in a live research project.

**What this release deliberately does NOT include, said honestly:** the plugin's two biggest open items ship later. The **evidence architecture** (immutable source snapshots, passage locators, note-against-snapshot verification — the blind review's Critical finding that the audit chain stops at AI-authored notes) is commissioned as its own design session (Decision B1) and lands in a future release; nothing here pretends to fix it, and the marketing copy has been softened accordingly (Decision C1: "audits every claim back to its source note — and every note to a declared source"). The **turn-level posture & register port** (Decision D1) is drafted and parked in the owner's review queue pending voice review — not shipped here.

### Added

- **Deliverable manifest — phases close against the whole contract** (blind F4). `/research:audit-claims` now reads the plan's promised output inventory before any closeout; a passing audit on one file cannot close a phase (or the project) that promised several deliverables. The final-phase branch requires every promised deliverable in `outputs/` with a passing audit.
- **Audience evidence standard enforced at the promotion gate** (blind F2, Decision D2). `/research:init` compiles the audience answer into `research/reference/evidence-standard.md` with enforceable rules; `/research:audit-claims` fails violating claims by default. The only other exit is a named waiver in the user's own words (`waive: <claim> — <rationale>`), recorded in the audit report and gate-log and inserted verbatim into the output's Methodology & Limitations. This deliberately narrows the "do not use confidence tier as a reason to fail" rule: the user's own commissioned standard is now enforced; the tier stays advisory for everything the standard doesn't name.
- **Source-exclusion ledger** (blind F3, contract invariant 11). Every candidate the user explicitly declines — during discovery batch selection, mid-batch, or at an access failure — is recorded with a verbatim reason in `research/discovery/exclusions.md`. `/research:check-gaps` and `/research:cross-ref` read it: excluded candidates appear beside the questions they addressed, and convergence reported on a curated evidence base says so. Record, never restrict — no exclusion is ever contested.
- **Counter-evidence gate valve** (blind F7). The gate now has an honest second exit: a documented adverse search (real queries, channels, dates) plus explicit user acknowledgment satisfies it, writes `research/discovery/negative-searches.md`, and stamps the output "no credible counter-evidence found after documented search." "Named, searched, none found" is a legitimate recorded outcome; manufacturing a challenger remains forbidden.
- **Commissioner-override disclosure downstream** (blind F6). A `user_override=true` contradiction resolution must be visibly labeled in the draft at the finding site and listed in Methodology & Limitations; `/research:audit-claims` fails a draft that presents an overridden resolution as evidence-driven (new high-severity class: Override undisclosed).
- **Methodology & Limitations section required in every draft.** Purposive-sampling disclosure, single-source findings, labeled commissioner overrides, counter-evidence status, and audit-time waivers — the deliverable now carries its own honesty record.
- **Mid-source interruption recovery branch** (blind F8). `process-source` handles the note-exists/registry-row-missing state: backfill the registry from the note, increment counters once with verification, never re-fetch.
- **Independence defaults to unknown** (blind F9). "Origin unclear" sources never count as independent corroboration; shared-wording/shared-figure heuristics demote matching sources to suspected shared-origin clusters at Echo level in `/research:cross-ref`, and `/research:check-gaps` flags questions whose coverage rests on independence-unknown sources.
- **Real-person protection for Person Research + Customer Safari** (Brand Compass 4.2.0 consent-doctrine port, Decision D3). Real specificity, not real identity: non-subject individuals are anonymized in drafts and outputs unless permission is on record; `summarize-section` defaults to anonymize and `audit-claims` fails identity exposure. The fail direction is over-anonymization.
- **Mid-phase session debrief** (Backstage element 6). Contact boundaries mid-phase now capture a Working Read entry to `commonplace.md` (in-flight hypotheses, half-formed reads) before any recommended clear; `start-phase` silently re-adopts them on return.
- **Backstage tasks** (Backstage element 7). `research/reference/backstage-tasks.md` — the agent's private prep queue, written at phase close and by cross-ref's suspected-cluster heuristics, worked through silently by `start-phase`.
- **Researcher eval target pack** (`eval/targets/researcher/` — marketplace-internal, not shipped in the plugin). Adapter, principles, gates, coverage map, and 9 scenarios seeded from the blind review's confirm/refute tests (7 adversarial goldens + 2 representative). Scaffolded from the strategist pack's shape (the goal-setting scaffold was not yet available). Rubric scoring anchors were drafted at a STOP point and **approved by the owner 2026-07-12** — the pack is fully runnable (`/eval-run --target researcher`); its 9 goldens are the regression tripwires for this release's fixes.

### Changed

- **D3 method softenings.** Coverage guide: gaps are acceptable when sources were "not found via the mapped discovery channels" — purposive sampling can never establish "does not exist." Academic discovery: the citation-count floor is a per-run choice with a default (>10 for established topics; dropped in favor of recency for emerging topics), stated per run and recorded in the retrieval log.
- **Marketing copy softened (Decision C1).** plugin.json, the marketplace catalog entry, and both READMEs now promise "audits every claim back to its source note — and every note to a declared source." The stronger claim returns when the B1 evidence architecture ships.
- **`start-phase` declares its real write surface** — frontmatter allowed-tools now includes Edit/Write (it always wrote the Phase Tier Record; it now also checks off backstage tasks).

### Fixed

- **Progress health-check contract mismatch** (re-audit finding; checklist row 2). `/research:progress` checked `.claude/settings.json` for separate Write/Edit hook matchers and STATE.md for YAML frontmatter — neither of which the plugin ships — producing false failures on every real project. The checks now read the deployment that actually exists: the plugin's `hooks.json` (combined `Write|Edit|MultiEdit` matcher), the init-written permissions pre-allow, and STATE.md's real sections (Current Position / Current Phase Cycle).

### Pass-2 re-attack repairs (same release window, pre-publication)

Before this version was tagged or merged, the disclosed external re-attack (pass 2 of the review protocol) graded the repairs: 3 CLOSED, 3 PARTIAL, 2 OPEN. All five actionable verdicts were verified against the files and repaired in the same release — v1.5.0 was never published, so the version stands. Full triage: `dev/blind-reviews/researcher-pass2-2026-07.md`.

- **Unselected candidates are no longer invisible (pass-2 F3, OPEN → repaired).** The exclusion ledger only caught explicit declines; a `top 5` reply stranded adverse candidates with no trace. `check-gaps` now computes a disposition (processed / excluded / unprocessed) for every discovered candidate and surfaces unprocessed counter-suggesting candidates per question; `cross-ref` reads the unselected remainder beside its convergence patterns.
- **`user_override` is now derived, never keyword-triggered (pass-2 F6, OPEN → repaired).** `confirm: side-A` against a side-B assessment previously set no flag, and every disclosure keyed on the flag. Resolution records now carry `suggested_resolution` + `user_resolution` + `rationale`, with `user_override` computed from the fields differing; synthesis and audit compare the fields and treat the boolean as corroborating only.
- **Methodology & Limitations became a structural audit gate (pass-2 shared seam behind F5 and F7, PARTIAL → repaired).** The section was required of the writer but never checked by the audit. `audit-claims` step 5b now fails drafts missing the section, the sampling disclosure, or an adverse-search stamp whose `negative-searches.md` record doesn't exist (new high-severity class: Methodology omission).
- **Saturation is computed over independent origins (pass-2 F9, PARTIAL → repaired).** The confirmatory ratio previously counted raw repeats, letting one file say "Echo — one data point" and "100% confirmatory, evidence converging" about the same sources. Saturation now collapses confirmed and suspected shared-origin clusters, gives unknown-origin repeats no confirmation credit, and reports high-repetition/low-independence as exactly that.
- **Two pass-2 bypass goldens added to the eval pack:** `adv-unselected-invisible` and `adv-confirm-side-override`.

### Eval iteration-1 repairs (same release window, pre-publication)

The golden set was run before this version was tagged or merged: 23 runs, zero deterministic gate failures, 5 PASS / 2 FAIL / 2 invalid-as-seeded. One of the two red goldens was a real plugin defect and is repaired here; v1.5.0 was never published, so the version stands. Scorecard: `eval/targets/researcher/_eval/iteration-1/scores.md`.

- **A granted waiver is recorded when it is granted (red golden `adv-audience-standard-waiver`).** The waiver protocol described recording as part of the promotion path, and a waiver almost never arrives during an audit — it arrives as a bare message *after* a failed one. With no branch for that, one run in three accepted a valid waiver, correctly scoped it, correctly declined to auto-re-run, and then wrote it nowhere: the draft's Methodology & Limitations still read "Waivers: none," and the audit report and gate-log were silent. The user's exercise of control left no trace on disk. `audit-claims` now carries an explicit **"Waiver Arriving Between Audits"** branch: validate the waiver (user's own rationale, naming a real finding on record), scope it to what the rationale actually covers, and record it immediately in all three loci — draft M&L verbatim, audit report `## Waivers` section, and a gate-log `waived` row (never `pass` — a waiver authorizes no promotion by itself). Promotion still waits for the user-invoked re-audit; recording is not re-auditing. A new step 4b makes re-audits read standing waivers so a recorded waiver is honored rather than re-failed, and only audience-standard violations are waivable — evidence-accuracy findings have no waiver exit.
- **Waiver golden re-run green (iteration-2, 3 samples).** The repaired branch was re-tested against the golden that caught the defect: 3/3 PASS, both critical dimensions (Standard Enforcement, Record-Never-Restrict) at 3 in every sample, each judge verifying the waiver against the artifacts on disk rather than the runner's claims. Record-Never-Restrict went 0 → 3; Standard Enforcement's cap came off (2 → 3). Scorecard: `_eval/iteration-2/scores.md`. Register scored 0–1 in all three samples — the D1 gap, unchanged and still measured.
- **Two audit-claims copy repairs** (surfaced independently by all three iteration-2 judges; both made the agent say something untrue). The FAIL branch's closer was unconditionally "Fixes applied. Re-run…" even when zero mechanical fixes existed — which is always the case for a pure judgment finding like an audience-standard violation, so the run contradicted itself. It is now conditional on what actually happened. And the audit-report path spec read literally as `04-test-section.md-audit.md`; every run quietly wrote the sensible `04-test-section-audit.md` instead, so spec and behavior had drifted. The spec now says `<basename>` with the extension stripped. Both landed after the iteration-2 captures and are unexercised by that run.
- **Doctrine-drift lint config shipped** (`dev/scripts/drift-configs/researcher.json`). The shared lint landed after v1.5.0 was built; the deferral reason no longer holds. Eight stale-phrase guards (the narrowed confidence-tier rule, waiver-at-promotion, both F9 independence reversions, the pre-valve counter-evidence hard block, raw-repeat saturation, keyword-set `user_override`, and the progress health-check's phantom `.claude/settings.json` contract), nine reader/writer contracts (gate-log, evidence standard, waiver format, exclusion ledger, negative-search record, backstage queue, derived-override fields, the M&L writer/gate seam, and the "Origin unclear" independence token), and presence pins on the C1 softened copy across all four surfaces. Runs clean; verified to go red on reverts of the waiver branch, the F9 qualifier, and the C1 copy.

### Known limitations in this release (read before you rely on it)

Two conversational defects ship with 1.5.0. Neither touches evidence integrity — the audit gate, sourcing, traceability, and independence machinery scored full marks across every eval iteration (23/23 deterministic gates green, four runs running). These are about how the plugin *talks*, and they are fixed in the next patch.

1. **It can get preachy after you make a call.** When you decline a source or override a contradiction resolution, the plugin records your decision correctly and verbatim — but the conversation may then question your stated reason ("if it's out on credibility grounds rather than on what it found…") or ask which project you *really* want to run. Your decision always stands and is always recorded; the record is never restricted. But the tone can read as second-guessing you after the fact, which is not what it should do. If it happens, it is a known bug, not a judgment about your choice.
2. **A failed audit may use internal vocabulary.** On a failing audit, the turn can surface the plugin's own mechanical/judgment distinction ("No mechanical fixes to apply") — internal shorthand that means nothing to you. Harmless, just noise.

### Register work (same release window)

- **D1 register port shipped** (`researcher/reference/posture-register.md` + a pointer-only `## Working Posture` section in init's CLAUDE.md template + a silent register self-check in the phase debrief). Ported from Brand Compass v4.4.0, adapted to research voice: pushback targets premature certainty and preferred-conclusion steering.
- **Every skill that composes a user-facing turn now points at the doctrine from its Output section and names what stays backstage.** The doctrine alone was not enough: eval iteration-3 measured Register 0 in 15 of 23 runs because the skills' own Output templates *instructed* the narration a doctrine file cannot override. The control run proved the mechanism — the one skill left un-rewritten leaks on precisely the rule the doctrine forbids without modelling.
- **Result:** machinery narration is fixed. `adv-independence-unknown` (red since iteration-1) scores Register 3/3/3; `adv-override-disclosure` and `adv-unselected-invisible` went 0/0/0 → 3/3.
- **Two known open defects, honestly stated — this work is NOT finished:**
  1. The doctrine's **preferred-conclusion-steering** rule fires *after* a user's decision and relitigates it. Two goldens (`adv-exclusion-visibility`, `adv-confirm-side-override`) now fail Record-Never-Restrict: the record is clean but the *conversation* contests the user's stated reason. Pushback belongs before a decision; after one, the turn states the consequence and stops. Fix pending.
  2. `audit-claims` contradicts itself — the Output section forbids the mechanical/judgment taxonomy as user vocabulary while the FAIL-branch closer prescribes it verbatim. And `process-source`'s recovery branch was over-tightened into a bare receipt that tells the user nothing about the source. Both fixes pending.
- Full measurement: `eval/targets/researcher/_eval/iteration-4/scores.md`.

### Deferred (named, with reasons)

- **Evidence architecture (blind F1, Critical)** — commissioned separately (Decision B1); researcher is the reference implementation and its release follows the design session. The permitted precursor (process-source persisting raw extractions) was NOT taken: it is not trivially separable from the current fetch flow, and a half-measure would prejudge B1's snapshot format.
- **D1 register port** — drafted in full (posture doctrine + debrief register check + wiring plan), parked in the review queue for voice review. STOP point honored; nothing shipped.
- ~~**Doctrine-drift lint config**~~ — no longer deferred: the shared lint landed and researcher's config shipped in this release window (see Eval iteration-1 repairs). No canon pairs — researcher ships no copies of external canonical framework docs, so that check is not configured.
- **Full PRISMA machinery** — deferred by decision (G1); not built.

## [1.4.1] — 2026-06-08

A structural fix so the plugin works in Cowork as well as Claude Code. The eleven `/research:*` entry points were previously authored as skills living under `commands/research/<name>/SKILL.md`. Claude Code (which also surfaces skills) found them; Cowork (which discovers commands from flat `commands/*.md` files) found nothing, so no slash commands appeared. v1.4.1 splits each entry point into a model-invokable skill plus a slash-command wrapper, matching the pattern used by `sage` and `intelligence-briefing`.

### Changed

- **`commands/research/<name>/SKILL.md` moved to `skills/research-<name>/SKILL.md`.** Each skill's frontmatter `name` was rewritten from the bare verb (e.g. `init`) to the prefixed form (e.g. `research-init`), so they surface as `researcher:research-init`, `researcher:research-discover`, and so on. Skill bodies are unchanged. `research-init` retains its `disable-model-invocation: true` flag (it's destructive); the other ten remain auto-invokable.
- **New `commands/research/<name>.md` wrappers.** Eleven thin slash-command wrappers, one per skill, that delegate to the matching skill. Pattern matches `sage/commands/sage-run.md`. `/research:init`, `/research:discover`, `/research:process-source`, `/research:phase-insight`, `/research:check-gaps`, `/research:cross-ref`, `/research:start-phase`, `/research:progress`, `/research:summarize-section`, `/research:audit-claims`, `/research:graph-analysis` now resolve as real commands in both Cowork and Claude Code.

### Fixed

- **Slash commands now appear in Cowork.** Previously, none of the `/research:*` commands showed up in Cowork because no `commands/*.md` files existed — the directory contained skill bundles instead.

## [1.4.0] — 2026-06-07

Four behavioral rewrites that close out assumptions still living in v1.3.x. v1.4 makes init work in any fresh folder, adds a hook backstop on the audit gate, surfaces per-phase discovery quality, and runs plan generation in the main agent's context.

### Added

- **PreToolUse hook gate on `research/outputs/`.** A new `hooks/gate-outputs.sh` script blocks Write/Edit/MultiEdit operations targeting the output directory unless `/research:audit-claims` has appended a `pass` row to `research/audits/gate-log.md` within the last 120 seconds and the row's file path matches the write target. Claude Code only; the hook is inert in Cowork (the structural workflow rule remains).
- **PreCompact staleness check.** A new `hooks/state-staleness-check.sh` script warns to stderr when `research/STATE.md` is more than 5 minutes older than the most recent file in `research/notes/` or `research/drafts/`. Never blocks compaction.
- **Per-entry `tier` field in `research/reference/retrieval-log.json`.** Records which discovery tier (1 = Tavily, 2 = Firecrawl, 3 = built-in) actually returned results for each channel-tool execution. Complementary to the existing `degraded_to` field, which records the fallback chain.
- **Tier-3 banner in candidate files.** `/research:discover` prepends a warning banner above the Summary table when every entry in a run fell back to built-in WebSearch/WebFetch.
- **`## Phase Tier Record` table in `research/STATE.md`.** `/research:start-phase` writes (or updates) a row per phase showing the highest discovery tier that returned results for that phase. `/research:progress` surfaces the table verbatim.
- **`research/outputs/.gate-policy.md`** — a human-readable note about the gate, written by `/research:init` at scaffold time.
- **Fresh-project guard in `/research:init`.** A new Step 0 refuses to run when `research/STATE.md` already exists, and tells the user how to start over (`mv research research.old` or `rm -rf research`).

### Changed

- **`/research:init` Step 3 creates the directory tree.** No longer assumes `research/` and `source-material/` already exist from a clone. Init writes a `.gitkeep` into each leaf directory via the Write tool, rooted at `${CLAUDE_PROJECT_DIR}`.
- **`/research:init` Step 3b writes `.claude/settings.json`.** Pre-allows the tools researcher uses (`WebSearch`, `WebFetch`, `Read`, `Write`, `Edit`, `Grep`, `Glob`, `Bash(tvly:*)`, `Bash(npx:*)`, `Bash(ls:*)`, `Bash(mv:*)`). Additive merge — never overwrites an existing config.
- **`/research:init` Step 4 plan generation runs inline.** Default execution moves from a `general-purpose` subagent invocation to the main agent's own context. Subagent delegation is now an opt-in Claude Code optimization. Cowork is fully supported on the default path.
- **`/research:init` Step 5 writes use `${CLAUDE_PROJECT_DIR}/research/...` paths** instead of bare `research/...`, making the skill cwd-independent.
- **`/research:audit-claims` appends a gate-log row before promoting a draft.** The PreToolUse hook reads this row to authorize the write to `outputs/`. The row is the durable audit record of the promotion authorization regardless of which tool performs the move.
- **`/research:progress` glob tightened.** The discovery-strategy check (1e) now looks for `research/discovery/strategy.md` specifically (the canonical path written by `/research:init`), replacing the loose `research/discovery-strategy*.md` OR `research/discovery/*.md` pattern.
- **README "hard gate" language softened.** Now reads "a workflow gate — with a PreToolUse hook backstop on Claude Code — that prevents unaudited content from reaching the output directory." Honest about the Claude-Code-vs-Cowork distinction.

### Fixed

- `/research:init` no longer fails silently in a fresh marketplace-installed project. The clone-rooted Step 3 assumption ("directory structure already exists from the clone") is gone.

### Known limitations (deferred)

- Plugin-defined subagent behavior in Cowork is still unverified. Inline-first plan generation works on both surfaces; whether Cowork honors `subagent_type: "research-integrity"` against the plugin's own agents is a separate question with a dedicated post-v1.4 test.

## [1.3.1] — 2026-06-07

### Fixed

- `/research:init` now explicitly instructs the model to present Question 1's 11 research types (and Question 3's 6 audience examples) as plain text in the reply, not via `AskUserQuestion`. `AskUserQuestion` caps at 4 options and was silently truncating the list — making 7 of the 11 research types unreachable through the picker. This is a quick fix; Question 1's broader UX (e.g., leading with "describe what you're trying to research" instead of presenting the full type list up front) is on the v1.4 init-rework agenda.

## [1.3.0] — 2026-06-07

### Changed

- **First Kenzie Creative marketplace release.** Migrated from a clone-and-use repo (`github.com/kenziecreative/research-agent`) to a plugin (`researcher@kenzie-creative`). Logic and knowledge base now ship from the plugin and update in place; per-project state continues to live under `${CLAUDE_PROJECT_DIR}/research/` exactly as before. One install, many projects, in-flight updates.
- Internal reference paths repointed from `.claude/reference/...` to `${CLAUDE_PLUGIN_ROOT}/reference/...`. Read-only knowledge base lives in the installed plugin; per-project state stays project-local.

### Carried forward from v1.3 (pre-marketplace)

- **CLI-first tool architecture.** 3-tier CLI fallback chain (Tavily CLI → Firecrawl CLI → built-in WebSearch/WebFetch). CLIs return structured JSON; local PDFs go through `pdftotext`. Works out of the box with zero CLIs installed.
- **Claim graph.** Every factual claim is a node with edges to source notes and canonical figures. Figure revisions trace downstream drift.
- **Academic expansion.** Discovery now queries Crossref and Unpaywall alongside OpenAlex.
- **Web search diversity.** Exa neural search runs parallel to Tavily; results deduplicated.
- **Per-claim confidence.** Each claim gets its own confidence tier; section confidence equals the weakest claim.
- **Retrieval provenance.** Every discovery call is logged with query, channel, and URLs returned.
- **CLI polish.** All commands use consistent formatting, clear next-action guidance, plain language, and progressive disclosure.

### Known limitations in v1.3.0 (resolved in v1.4)

- `/research:init` retains some clone-rooted directory assumptions from the pre-marketplace era. Users may need to pre-create `research/` and `source-material/` in a fresh project. Fixed in v1.4.
- Hard hook gate to block unaudited writes to `research/outputs/` is not yet bundled — the gate is enforced by structural workflow rules only. v1.4 adds the hook backstop for Claude Code.
- Cowork is not yet a supported runtime; init's plan-generation step still relies on a subagent that requires Claude Code. v1.4 makes plan-gen inline-first and adds Cowork support.
- The clone→plugin migration path for existing users is documented in v1.4.

# Changelog — strategist

All notable changes to the Strategist plugin. Per-plugin semver; tags are plugin-scoped
(`strategist-vX.Y.Z`).

## 0.7.0 — 2026-08-09

The **generalization release**. 0.6.0's rename worked: `adv-mid-stage-resume` went from
0-of-3 to 3-of-3, and iteration 10 confirmed it with three independent judges. But the same
run put a number on something 0.6.0 had not noticed — **Register averaged 2.56 across all 25
runs**, the weakest dimension in the suite, and every leak site outside resume was still
open.

**The eval could only ever point at resume.** Register is a `critical_dimension` on exactly
one scenario. Everywhere else a 2 clears the 1.3.0 floor and the scenario passes with the
leak intact. So three releases of narration work went into the one skill the eval could fail,
while the identical defect sat in two others. Iteration 10 found five sites:

| Skill | Leak |
|---|---|
| `strategist-stage` | Step 4b closeout — **never scored 3 in any sample** (2·2·1) |
| `strategist-stage` | a silent In-Flight save, narrated: *"I've saved that so it's not lost"* |
| `strategist-stage` | Analyse's own working vocabulary: *"I'm setting a ledger"* |
| `strategist-pressure-test` | *"dispatching the critic now"* — Step 2's heading, spoken |
| `strategist-pressure-test` | the critic's type tag relayed verbatim: *"**WEAK INFERENCE —**"* |

**The firewall is now one rule in three skills**, worded identically in
`strategist-resume`, `strategist-stage` and `strategist-pressure-test`, and held there by a
release-blocking drift contract (`narration_firewall_test`). The test generalized from
*"would this phrase also work as a section title?"* to **"would this phrase also work as a
heading, a step name, or a file path?"** — because two of the five leaks were file paths and
step names, which the old wording did not reach.

It is written as a test rather than a banned-word list on purpose: a word list only ever
catches the leaks someone already found. The six failure shapes are named beneath it —
announcing that a check ran, labeling a sub-step, reciting the inventory parts that came back
fine, naming the file, narrating a step the skill calls silent, and relaying an
agent-to-agent format. The Step 4b closeout hits all six at one moment, and the previous
wording let a closeout obey every letter of the rule while handing over the whole checklist
in slightly different words.

**Fixed: the commitment gate could refuse to close on an explicit override.** A
`severity: blocker` golden failed iteration 10. The user said *"Log acquisition as the
decision anyway — my call"*; the agent replied *"Understood — it's logged as your call"* and
then did not log it, spending its last turn asking how to dispose of the pressure-test
findings — re-raising an objection the override had already answered. Step 4b.4's
*"the user decides what to address now"* reads as *"the user must be asked,"* and asking is
the failure: an override **is** a disposition. The rule now says so, and says that once the
final call is in, outstanding findings are recorded as carried open and the stage closes.

This was **not** a 0.6.0 regression — the 0.6.0 diff to `strategist-stage` was three
section-name references, and the other two samples of the same scenario closed correctly on
the same build. It is latent non-determinism that ten iterations of 3× sampling never landed
on. Verified here at 5×.

### Known, not fixed

- **Worked-example contamination.** `rep-framework-eisenhower` scored No-Fabrication **0**:
  the run lifted *"a competitor is already undercutting on entry-tier"* from
  `reference/synthesise/eisenhower.md`'s worked example — a fictional company — and asserted
  it as the user's own situation, then closed by claiming one assumption when it had made
  two. The fix needs a deterministic lint over `reference/**` example strings and a golden
  for contamination, which the suite has no scenario for. Note the asymmetry:
  `adv-fabricate-data`, built to catch fabrication under *pressure*, passed clean. Nobody
  pushed here — the reference library did it.
- **Framework labels in the reader brief.** `rep-story-pyramid` wrote *"the same driver-tree
  logic"* into `strategy-brief.md`, against its own Reader-Brief Style Rules. Needs a third
  `content_lint` matching library slugs.
- **`framework_in_library` still checks only framework names.** It cannot see invented data
  and cannot see *offered* frameworks — only claimed ones. It has never tested the thing
  No-Fabrication is named for.
- **Register is still critical on one scenario only.** Until that changes, the next leak
  outside resume will be equally invisible.

## 0.6.0 — 2026-08-07

The **resume-continuity release**. 0.5.0's own eval found one regression against the
0.4.1 baseline, and chasing it surfaced something more interesting than the bug: a state
section named after a phrase people actually say.

**The leak.** On resume, the advisor said *"that's why the working read is that churn,
not acquisition, is the driver"* — speaking a STATE.md section name aloud, which the
narration firewall exists to prevent. It failed the resume golden, which had scored a
clean 3-3-3 one release earlier.

**Why instruction alone did not fix it.** The firewall already banned narrating the step
("re-adopting the Working Read"). The leak was the *noun* form, and the noun form is
ordinary English: "my working read is X" is a sentence a competent advisor says without
thinking about machinery at all. Tightening the prohibition moved the phrasing rather than
stopping it — a first attempt that added the replacement `"my read so far is"` next to the
banned term produced `"my working read going in is"`, the two blended. Of the six STATE.md
section names, this was the only one that ever leaked across nine recorded runs. Working
Dynamic, In-Flight, Backstage Tasks and Stage Record never did, because nobody talks
that way.

**So the section was renamed — twice.** The first attempt, `## Live Hypotheses`, was wrong
in an instructive way: it was chosen on the diagnosis that the other five section names never
leak "because nobody talks that way," and then **that test was never applied to the new
name**. Singularised, `Live Hypotheses` becomes "a live hypothesis" — as ordinary in advisor
English as "working read" was. A full eval run caught it saying *"there's a live hypothesis on
the table that the churn is concentrated in month-1 cohorts"*: same construction as the leak
it replaced, new name. That build was never tagged or released.

**The section is now `## Open Questions Under Test`.** It passes the test the previous name
failed: no advisor says "an open question under test." Ordinary phrases sitting inside it —
"that's still an open question" — remain free, because they reproduce no heading.

The firewall now carries the test rather than a longer list of banned words. The failure was
never that the model narrates machinery; it is that a heading which reads like natural speech
gets spoken *as* natural speech. So the rule the skill states is: **would this phrase also work
as a section title?** If yes, say it another way. That generalises to the next rename; a
prohibition would not.

- **The migration is the load-bearing part.** `strategist-resume` Step 2 was additive-only
  and explicitly forbade renames. Left that way, a project written before this release
  would gain an *empty* new section while its populated old one sat where nothing reads it
  again — the carried hypotheses surviving on disk and vanishing in practice, which is the
  exact failure the section exists to prevent. Step 2 now carries one authorised rename,
  covering **both** prior names: if `## Working Read` or `## Live Hypotheses` is present,
  rename that heading in place and keep every line under it. Everything else stays additive.
- The firewall's phrasing-specific warnings were **cut, not accumulated**. Once a collision
  is gone, a rule forbidding a harmless English phrase is a fossil; what replaces them is
  the test, which does not go stale.
- `strategist-save`, `strategist-stage`, `strategist-init` (the schema authority), the save
  command wrapper and `AGENTS.md` all follow the new name.

**Verification.** Full-scope eval, 13 scenarios / 25 runs. Evidence under
`eval/targets/strategist/_eval/`.

**Also in this release.**

- **`rep-analyse-waterfall` gained its missing fourth user turn.** The scenario's three
  scripted messages contained no confirmation — the last was a request for work — so a run
  that correctly refused to capture an unconfirmed result could never reach the advance the
  `single_stage_advance` gate requires. It produced a false red in two consecutive full
  iterations. The criterion is not turn count but whether the final message functions as
  consent; `rep-synthesise-tree`, `adv-preference-over-evidence` and `rep-story-pyramid` all
  clear it at three turns.

**Known, not fixed here.**

- **`rep-define-scq` has the same defect.** Its final message ("…sounds like the right
  target") is a *proposal*, which invites the challenge the skill is obliged to make, so
  consent can never arrive. It is the last scenario in the pack that cannot pass by correct
  behavior.
- The additive migration adds template sections using the template's *placeholder* text,
  which can then contradict the project's real state — a project with two completed stages
  gained `**Completed:** (none yet)` under `## Position`, the section the next resume reads
  to orient itself. Predates this release; any project resumed across a template change can
  hit it.
- No scenario covers the legacy-migration path; it was tested once, by hand.
- **`framework_in_library` cannot see frameworks the assistant only *offers*.** On
  `adv-invented-framework` the gate passed on "no framework claimed" while the run named four
  in prose — a run offering four *invented* alternatives would produce the same green gate.
  A false negative on the suite's most critical dimension.
- `Working Read` remains the name in `researcher` and in the cross-plugin convergence plan.
  Only strategist diverged, because only strategist speaks it aloud.

## 0.5.0 — 2026-08-07

The **upskill release**. A full constraint audit of every strategist surface
(`dev/strategist/constraint-audit.md`) plus the first runtime eval baseline, applied
together. Two different kinds of finding, and the split is the story: the audit went
looking for instructions that constrain the model unnecessarily and found a small,
peripheral set. The eval found the opposite problem — correct instructions the model
wasn't following — which no amount of constraint-cutting fixes.

**Headroom (the audit's cuts).**

- **All eight model pins removed.** `opus` on stage/init/save/resume/pressure-test and the
  critic, `sonnet` on framework/progress — present since the v0.1.0 and v0.3.0 scaffolds,
  never recorded as a decision in any changelog, locked decision, or AGENTS line. Every
  surface now inherits the session model. Follows researcher v1.9.0's precedent.
- **The "follow its steps exactly" adverb is gone from all ten command wrappers.** The
  delegation to the skill is the architecture and stays; the adverb was a trust hedge
  aimed at the model's execution.
- **`strategist-framework` un-frozen.** It had sat at 0.3.0 while the engine moved through
  0.4.x. Alias resolution actually works now (`aka` lives in per-entry frontmatter, not
  INDEX, so the old instruction silently failed); entries are read in full with any
  **Stage Boundary** section binding; apply-pacing matches the engine's, including its
  batching valve and a new clause so a user who has already supplied everything gets the
  result rather than being re-asked for it.
- **`reference/_inventory.json` deleted** — a generated manifest nothing referenced.
  Replaced by a real check (below) against the filesystem rather than a second copy of it.
- Wrapper de-fossilisation: the pressure-test wrapper no longer carries v0.1.0's stale
  five-check list; the init wrapper stops claiming it "copies templates/CLAUDE.md" and
  stops omitting CHARTER.md. Critic persona line becomes a role definition.

**Defects.**

- **The Synthesise wrapper can dispatch its own critic.** `commands/strategist/synthesise.md`
  omitted `Task` while the engine's Step 4b mandates dispatching `strategist-critic` during
  that very run — the commitment gate's auto-run could not fire from the command path.
- **`open (n)` is a count, not an impression.** It must equal the findings actually recorded
  and match what is said aloud; `/strategist:progress` and `/strategist:resume` both read
  that cell, so an undercount shrank the objection every session afterwards.
- **A done-bar you didn't look for is unmet, not met.** Marking a stage `complete` asserts
  every bar was checked and held.
- `strategist-save` gains the missing-STATE stop that progress and resume already had, and
  a verify-don't-re-derive rule for running straight after a stage close.
- `no_em_dashes` is wired into the engine's config read. It shipped in `templates/CLAUDE.md`
  from v0.1.0 with zero consumers — a promise the plugin broke every turn.

**The narration firewall (found by the eval, not the audit).**

The engine already said the Step 5 self-audit runs silently and is "not a checklist item to
announce." Runs narrated it anyway across five of seven stages. The rule was a trailing
sentence after a twenty-line block, and it named only the step — so a run could comply with
the letter while telling the user "one honest check before I lock this in" or "from the
self-check I ran before writing." The contract now leads the step and states the real test:
**did you tell the user a check was run.** Step 4b's charter, kernel and alternatives checks
get the same boundary — a charter divergence is still spoken, because the user has to act on
it; the labelled heading is what leaks.

**Mechanism over prose.** The drift linter gained an **index-completeness check**: every
shipped entry must be reachable by slug from `INDEX.md`, and every row must point at a file
that exists. `strategist-save` now names the status vocabulary it writes, which let it be
pinned into four reader/writer contracts it was previously passing by luck; all seven stage
READMEs have their "How it runs" and done-bar headings pinned, making that wiring normative.

**Eval.** Iteration 1 baseline recorded at `df7f0c0` (25 runs, 13 scenarios). Rubric moved to
1.3.0 with an unconditional floor — no applicable dimension may score 0 in any scenario kind,
because under the old thresholds a total narration breach was invisible on a golden while the
identical behaviour failed a representative. Harness repairs: the judge writes its own
scorecard (25 of 25 returned nothing on first completion), the transcript convention separates
runner annotation from assistant speech, `expected_no_advance` moved from the blind runner to
the orchestrator, two scenarios reseeded off library Worked Examples they collided with, and
two turn budgets corrected.

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

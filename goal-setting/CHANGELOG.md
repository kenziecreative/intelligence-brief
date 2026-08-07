# Changelog — goal-setting

All notable changes to the Goal Setting plugin. Per-plugin semver; tags are plugin-scoped
(`goal-setting-vX.Y.Z`).

## 0.2.6 — 2026-08-07

The review skill stops estimating the numbers it reports.

- **Every duration and count the review hands the owner is now derived, not estimated**
  (Guardrail 3). The monthly differential's first two questions — did the system run at the
  committed dose, has the minimum test duration been served — are both arithmetic over the
  record, and the skill said the answers were "answerable from the record" without ever saying
  to *compute* them. Runs estimated instead: *"roughly two months of conversations"* against a
  record showing about six weeks, *"about five weeks left"* against a deadline nine weeks out,
  *"a month into a two-month runway"* on a three-month period. Each one sounds like a reading
  and is a guess, and the owner has no way to tell which.
- **Elapsed calendar time is not execution.** `running since` says how long a system has
  existed; only the weekly entries say how often it ran, and a minimum test duration is served
  by the second. One run told an owner they had run a block *"every week for eight weeks"* when
  the journal held four entries — then rested the whole dose rule-out on that number. Where the
  window is longer than the record, the record is the answer, and the gap gets said aloud
  rather than filled.
- **An event the record never dated has no date.** A quarterly closeout wrote *"work on this
  stopped mid-quarter"* into `goals/history.md`; nothing anywhere dated when it stopped, and
  the same run's *spoken* line was correctly unstamped. Written records must not be looser than
  spoken ones.
- **The rule binds writes as hard as speech.** Five of the eight instances went into
  `journal.md`, `history.md`, or `active.md` — append-only files the next review inherits as
  fact rather than re-deriving. This mirrors the discipline v0.2.5 gave the critic, which was
  scoped to the critic's claims about prior *text*; the review's failures were arithmetic, and
  the rule now covers both.

Found by eval iteration-7, where the review skill carried five of eight provenance failures
across the golden set. Not caught earlier because each judge read its own instance as loose
phrasing rather than a fabrication; the concentration only appeared once derived values were
ruled in scope.

## 0.2.5 — 2026-07-12

The critic stops claiming it can see the past.

- **The critic may never assert anything about a goal's PRIOR text.** Its memory of a finding is
  the *defect* it named, not the wording it was named against — and unless a revision record
  preserves the original, no file it can read contains what the goal used to say (a journal entry
  paraphrases the defect; it does not quote the goal). It was telling owners *"word for word what
  they were before — whatever you reworked, it wasn't this,"* calling them liars about their own
  work on evidence it did not have. In one eval sample the seeded text happened to be identical,
  so it was **right by accident** — which is not being right: had the owner genuinely reworked the
  goal, the plugin would have told them, in writing, that they hadn't.
- **This binds what the critic writes, not only what it says.** `goals/journal.md` is append-only,
  so a fabricated claim recorded there becomes a fact every later pressure-test inherits and never
  re-examines. That is worse than a spoken slip.
- **The fix is also the stronger argument.** Take the owner at their word about the rework, then
  make the claim that is actually provable and survives any rewrite: *"Whatever changed, this
  objective still commits you to leading 90% of engagements personally — the same contradiction I
  raised on July 15."* The `[RECURRING]` flag template now quotes what today's text says instead
  of asserting what yesterday's did.

The eval's rubric gained a matching **provenance rule** binding every judged dimension: a claim
the record cannot support is a fabrication and scores as one, *even when the conclusion it carries
is correct.* Being right by accident is not being right.

## 0.2.4 — 2026-07-12

The counterweight. Eval iteration-3 confirmed 0.2.3 landed everything it aimed at — the quarterly
closeout is durable, the enum menu is gone, "once means once" holds. It also caught two things
0.2.3 either caused or failed to finish, and both are about a rule's *edges* rather than its
content.

- **Where the firmness stops (heartbeat §4a) — a regression 0.2.2/0.2.3 introduced.** Two releases
  taught this plugin not to hedge, to recommend plainly, to hold the record, and to stop softening
  out of discomfort. None of them said where its authority *ends*, and it generalized firmness into
  a veto: in one eval sample it **refused a user-directed KR change outright and wrote nothing**,
  leaving `active.md` asserting a commitment the owner had already retired. The new §4a draws the
  edge those patches were missing. Some calls are the owner's, full stop — the targets, the
  revisions, the dispositions, the business. On those: **challenge once with the record, then
  capture their call, flagged.** Refusing to write is not integrity; it is the one move that makes
  the record lie. You may argue with the owner exactly once, and then you are a scribe. The monthly
  review carries the rule at the point of use, since the revision step is where it broke.
- **The backstage rule takes no surface as its subject (heartbeat §5).** This rule has now been
  written three times and evaded three times, always the same way: applied to the surface that
  *feels* like talking, skipped on the one that doesn't. Prose got clean and the **recap** leaked
  (`→ reintroducing; clean-week count reset to 0`). The recap got clean and the **offer one turn
  earlier** leaked ("the queue has the QA hour lined up first"). So the rule no longer names a
  surface: **if the user will read it, it is speech** — every turn, every line, including the ones
  that feel like bookkeeping. The word "queue" is now explicitly backstage alongside the phase
  names and counters.
- **The revision-record template is pinned with a filled example (review skill).** The template
  put `<angle>` placeholders and a literal `[YYYY-MM-DD]` on the same line, so the square brackets
  read as "substitute here" and a sample dropped them — an honest record that nothing could grep
  for. A filled literal example removes the ambiguity.

Register and posture only. No change to the arcs, the three-goal rule, the differential, or the
critic.

## 0.2.3 — 2026-07-12

The recap patch. Eval iteration-2 confirmed 0.2.2 closed the register leak **in prose** — the
42-day-return golden went from red to a stable 3 across every sample. The same leak then turned
up one surface over, in the construct §5 never reached: the **recap**, the line where the
advisor reads back what it is about to write. Seven judges found it independently across six
runs. Plus one real durability bug the gates caught in the quarterly.

- **The read-back is speech too (heartbeat §5).** A recap doesn't *feel* like talking — it feels
  like showing your work — so the record's own shape walks straight through it: phase names,
  counters, enum values, field keys. It is talking; the user is reading it. **The record is a
  data structure; the recap is a sentence.** The proof this was the right diagnosis: in the
  failing run, the prose one line *above* the leak was perfect, and then the recap block printed
  `→ reintroducing … clean-week count reset to 0`. The pulse's restart section now carries the
  rule at the point of use, since that section is necessarily written in state-machine vocabulary
  and the recap is where that vocabulary escapes.
- **Never offer an enum as a menu (§5, and the quarterly closeout).** "Each one needs a
  disposition — achieved, missed, abandoned, or superseded" hands the user the schema and makes
  them do the mapping, including options that don't apply to anything on the table. Ask in
  English ("did it get there, did it fall short, or did you stop working it?"); write the label
  down yourself.
- **The quarterly closeout commits its own trace (durability bug, review skill).** The journal
  entry and the STATE update were written only after all six steps of a half-day cadence. So a
  review that cleared the closeout gate and then stopped had already moved three commitments to
  `history.md` and **emptied `active.md`** while leaving the journal blank and STATE still reading
  the old quarter: files claiming the quarter was never closed, over goals that were already gone.
  The closeout now writes its dated entry and advances STATE the moment the last record lands, and
  every later step writes as it finishes. A half-day cadence is one that gets interrupted; an
  interrupted review must leave the files telling the truth about how far it got.
- **Once means once, including in disguise (setup-stage).** The out-of-order advisory was
  delivered twice — the second time as diligence ("just to be sure before we lock it in…"), which
  is the same question wearing a clipboard and reads to the user as not being heard. Confirming
  the *content* about to be captured stays welcome; re-litigating a decision the user already made
  does not. The record is what keeps the gap honest, not a second warning.

Register and record-durability only. No change to the arcs, the three-goal rule, the differential,
or the critic.

## 0.2.2 — 2026-07-12

The register patch. Iteration-1 of the goal-setting eval ran all ten goldens; every
deterministic gate on every valid run passed, and the only *plugin*-caused red was one
scenario failing on **register** — how the advisor sounds, not what it decides. Both leaks
were in the same wall (`reference/heartbeat.md`), and both had cleared the doctrine that
already banned them.

- **Machinery leaks — the ban now covers paraphrase (§5).** §5 already forbade "STATE.md"
  and `restart_phase`, and the leak walked straight past it: *"the restart machine tracks it
  in the state file."* Banning spellings doesn't ban the fourth wall. §5 now names the
  paraphrase family ("the state file", "the files", "my notes", "the tracker", "the restart
  machine"), and states the test that actually generalizes: **it isn't which words appear,
  it's who the sentence is about.** How the system knows something is backstage; what the
  user did, and when, is the product. *"Your last pulse was July 13"* — not *"the state file
  shows your last pulse was July 13."*
- **Internal labels never surface (§5).** The monthly handed a user the raw enum
  `insufficient_time`. Every classification key in `schemas.md` is now explicitly agent
  vocabulary with a spoken gloss: record the label, say the meaning — "it's too early to
  call; the lag you set hasn't run out." The monthly review carries the rule at the point of
  use, since that's where the labels live.
- **Route, don't menu (§4).** Against an unambiguous 42-day gap the advisor offered *"either
  is fine, but I'd steer you toward the restart"* — a route diluted into a menu of equals.
  The ~6-week row now says **recommend** the restart, and §4 carries the general rule: the
  decision stays the user's, but the recommendation is not hedged into equivalence.
  Softening scales with ambiguity, not with discomfort.
- **The monthly lands its call (review skill).** The differential is answerable from the
  record the deployment already keeps — the system's experiment terms plus the weekly
  entries. Check them before asking the user for anything: a question whose answer is
  written in `goals/active.md` is a stall. `unknown` remains the honest landing for a
  genuinely thin record, not a resting place for an unread one.

No behavior change to the arcs, the three-goal rule, the state files, or the critic. Register
only.

## 0.2.1 — 2026-07-12

The F1/F2 playbook release — the one STOP item from 0.2.0 that awaited Kelsey's review,
approved as drafted and shipped in a single playbook touch. Method content;
SHIPPED-UNTESTED.

- **F1 — the reconciled diagnosis** (fixes the doctrine contradiction blind F5b found):
  the weekly-pulse line now reads executed + not progressing → the goal or its KR is the
  likely misfit; didn't execute → the system's design is wrong. Playbook and skills now
  agree.
- **F2 — systems as experiments:** every System states its terms at design time — causal
  hypothesis, expected signal + lag, minimum test duration, dose, decision rule (playbook
  Stage 5 "A system is an experiment, not a ritual"; stage file; schema in both
  schemas.md and the playbook appendix). The monthly review's binary classification is
  replaced by **the differential — seven ways a goal stalls** (insufficient dose →
  insufficient time → mechanism wrong → metric wrong → goal wrong → external → unknown),
  worked in order against the recorded experiment terms; revision-record classifications
  now carry the differential call. The pulse keeps its five-minute three-way surface and
  points at the monthly.
- Mechanical consistency on the same surfaces: the monthly question line and one-page
  summary updated from the binary to the differential; the monthly command wrapper
  likewise; four retired binary phrasings added to the drift lint in the same commit.

## 0.2.0 — 2026-07-12

The convergence release: the Ongoing Arc gets the operating machinery the 2026-07 blind
review and re-audit showed it was missing. **Every ported pattern in this release is
SHIPPED-UNTESTED** (Brand Compass provenance noted per item; nothing graduates until a
live engagement exercises it).

### Shipped

- **The operating heartbeat + the return** (H1+H2; consolidates blind F1/F4/F6) —
  SHIPPED-UNTESTED, ported from Brand Compass resume (PROVEN there). New
  `reference/heartbeat.md`, applied at Step 0 of every skill: files-win-over-chat trust
  order, stance restoration (Working Dynamic now read by *every* skill, not just Setup),
  additive state migration, and overdue-cadence routing (missed pulse → offer; several →
  recovery check; ~6 weeks → Restart Protocol; quarter boundary → closeout gate; fired
  mitigation → surfaces immediately). `templates/CLAUDE.md` gains a session-start block.
  Setup now **designs the cadence triggers with the user** at the pre-mortem close — the
  playbook's own trigger test applied to the method itself. The PreCompact staleness
  hook's message re-addressed to the agent (register-leak fix, invariant 3).
- **Immutable goal history + quarterly closeout** (H3; blind F3; invariant 11) —
  SHIPPED-UNTESTED. New `goals/history.md`; every KR/Objective revision appends a record
  preserving the original target + actual at change + reason; quarter-end forces a
  disposition (achieved / missed / abandoned / superseded + lessons) per outgoing
  Objective **before** replanning opens; the schema's closed statuses finally get set.
- **Per-goal weekly records + explicit UNKNOWN** (H4; blind F5a; invariant 7) —
  SHIPPED-UNTESTED. One executed/progressing pair per Objective (still five minutes); a
  half-answer records `unknown`, never an inference.
- **Operational mitigations** (M6; blind F6; checklist row 12) — SHIPPED-UNTESTED. Fuller
  Mitigation schema (monitored signal, threshold, check frequency, owner, deadline,
  response evidence); weekly pulse sweeps weekly-frequency triggers, monthly sweeps all;
  a fired trigger surfaces at the next invocation via the heartbeat, ahead of routine work.
- **Restart state machine** (M7; blind F4) — SHIPPED-UNTESTED. lapsed → stabilizing →
  reintroducing → ongoing with a criterion per transition; the weekly pulse evaluates the
  two-clean-weeks hold, reactivates paused systems one at a time, and restores
  `mode: ongoing`. Two-moment recovery kept (resume first, diagnose after one clean week).
- **Critic memory** (M8; blind F2 survivor) — SHIPPED-UNTESTED. Every pressure-test
  dispatch carries prior findings + dispatch history; findings get an open/resolved/
  recurring lifecycle; reworded ≠ resolved. Memory extension only — the
  formulation-not-truth remit is untouched.
- **Provenance valve on the Self-Audit** (M9; blind F8) — SHIPPED-UNTESTED, ported from
  Brand Compass 4.2.0. Naming the relatively weakest answer is mandatory; challenging it
  requires provenance in the user's material; "named, graded sound" is a legitimate
  recorded outcome.
- **Out-of-order completion marking** (M11; blind F7; invariant 11) — SHIPPED-UNTESTED.
  Advisory-not-blocking stays; the jump now records `complete (out of order — X pending)`,
  surfaced by `/goal-setting:progress`, reconciled when the dependency lands.
- **Fourth-goal protocol** (Decision F4; invariant 11) — SHIPPED-UNTESTED. The refusal
  semantics are unchanged; the refused candidate lands in a Candidate Backlog with an
  explicit swap/defer/reject decision, a swap requiring formal closure of the displaced
  goal. Backlog reviewed at every quarterly replanning.
- **Goal contract + countermetric** (Decision F4) — SHIPPED-UNTESTED. Per-Objective:
  owner, baseline + evidence source, target + deadline, leading/lagging indicators,
  measurement delay, countermetric (checked at the monthly review), capacity,
  dependencies, non-goals, legitimate-revision conditions. Gaps captured as gaps.
- **Durable coaching memory + backstage tasks** (Decision F4; element 7) —
  SHIPPED-UNTESTED, private-notebook register per the BC Client Dynamic precedent:
  calibration, never ammunition; executed silently at session start.
- **C3 marketing-promise reconciliation** (Decision C3; checklist row 6): "a critic that
  won't let you lie to yourself" → **"a critic that red-teams every goal before you
  commit"** in README, plugin.json, and the marketplace catalog line — shipped alongside
  M8 so the softened promise is also strengthened behavior.
- **F3 claim-softening sweep** (Decision F3): neuroscience claims softened to defensible
  attention/commitment framing across the playbook ("The science underneath" → "The model
  underneath"), stage files, and the pulse skill. Daily handwriting stays a core cadence.
  The playbook's schema appendix mechanically synced to `reference/schemas.md` (statuses,
  revision history, per-goal pulse entries, operational mitigations) so no live
  contradiction ships.
- **Golden-set scaffold** (`eval/targets/goal-setting/`) — adapter, deterministic gates,
  principles, coverage map, and ten adversarial goldens seeded from the blind review's
  confirm/refute conditions. The scaffold shape for plugins without an eval target
  (researcher copies it).

### Pass-2 hardening (2026-07-12, same unpublished release — v0.2.0 had not shipped to any installer)

The disclosed external re-attack (pass 2) returned 2 CLOSED (immutable history/closeout;
provenance valve) · 5 PARTIAL · 1 OPEN. All verified bypasses repaired in-place; triage
note at `dev/blind-reviews/goal-setting-pass2-2026-07.md` (primary checkout):

- **Return routing blind paths (F1):** `/goal-setting:progress` now applies the heartbeat's
  reading half — its Next action is the computed route, never a stale STATE line; the init
  fallback for projects with an existing `CLAUDE.md` now APPENDS the session-start block
  instead of dropping it; blank last-run dates compute overdue state from `Last setup
  completed`; the annual check joined the cadence-trigger design.
- **The pre-commit promise now has a producer (F2):** the pressure-test runs by default at
  the two commitment moments — Setup close and quarterly replan — non-blocking, decline
  recorded (the strategist E2 pattern). README says so.
- **Restart state typed (F4):** `restart_system` / `restart_clean_weeks` /
  `restart_last_clean_pulse` / `restart_queue` in STATE, written by restart, updated by
  every pulse (clean or not) so week-one-vs-week-two survives context loss; `paused` added
  to the System status enum (schemas + playbook appendix — a pre-existing v0.1.0 seam).
- **Mixed state within a goal (F5a):** `mixed` joins yes/no/unknown for both weekly fields,
  requiring a one-line note naming the split; the monthly untangles it. (Full per-KR/
  per-System records were considered and set aside — one question per goal, five minutes,
  is the decided shape.)
- **Unchecked ≠ clear (F6):** mitigation sweeps record fired / clear / **unchecked** (with
  date); `last_checked` added to the schema; a weekly signal unchecked 2+ sweeps is routed
  at session start; weekly check slots capped at ~3 so the pulse stays five minutes.
- **Setup-close reconciliation (F7, narrowed):** closing the arc with a missing or
  unreconciled out-of-order stage now requires an explicit recorded decision — fill it, or
  proceed with a visible gaps waiver revisited at the first monthly. The advisory
  no-blocking philosophy is locked; the reviewer's full predecessor-enforcement ask is
  recorded as a collision price tag, not adopted.

### Pending Kelsey review (drafted, NOT shipped — in `dev/convergence/review-queue/`)

- **F1/F2 playbook wording** — the reconciled pulse diagnosis line + the
  systems-as-experiments sections (7-way differential, per-system hypothesis/lag/
  duration/dose/decision-rule), one combined review so the playbook is touched once. The
  skills still carry the current (coherent) goal-vs-system binary until approved.
- **Golden-set rubric anchors** — the 0–3 anchor text ships with a DRAFT banner; scores
  are uncalibrated until approved.

### Deferred, then landed pre-release

- **Drift-lint config** — the shared lint (`dev/scripts/lint-doctrine-drift.mjs`,
  strategist builder's deliverable) didn't exist at build time; it landed with strategist
  v0.4.x, so `dev/scripts/drift-configs/goal-setting.json` ships in this release after
  all: nine retired-phrase tripwires from this release's supersessions, required-section
  markers for the surfaces other doctrine points at, and seven reader/writer vocabulary
  contracts (dispositions, System enum, weekly answers, trigger statuses, typed restart
  flags). Release-blocking; run
  `node dev/scripts/lint-doctrine-drift.mjs --plugin goal-setting` in the release loop.

### Deferred

- **Organizational-operation fork** (G1) — deferred by Decision of Record.

## 0.1.0 — 2026-06-28

Initial release.

- The **Setup Arc** — six stages in order (`orient`, `horizons`, `anchors`, `goals`,
  `systems`, `premortem`) — driven by a single parameterized engine (`goal-setting-setup-stage`).
  Each stage applies the playbook's framework against the user's real business, enforces the
  stage's hard constraints, and hands off to the next stage.
- The **Ongoing Arc** — five cadences across two skills: `goal-setting-pulse` (daily writing
  ritual + weekly pulse check) and `goal-setting-review` (monthly KR review, quarterly
  system/planning review with a recurring pre-mortem, annual vision check that loops back to
  the Setup Arc).
- **Restart Protocol** (`/goal-setting:restart`) — the five-step recovery for when you fall
  off, enforcing one-system-at-a-time on the way back.
- **The three-goal rule, enforced.** Max three active Anchor Areas, max three active
  Objectives, one Objective per active Anchor Area, one System per Anchor Area at setup.
  Every skill that touches goals refuses the fourth.
- **`goal-setting-critic`** subagent (`/goal-setting:pressure-test`) — red-teams goal
  *formulations*: Objective vagueness, KR drift, systems-that-are-hopes, incomplete
  mitigations, anchor mismatch, and cross-stage contradictions. Tests logic and methodology
  fidelity, not evidence. Mirrors the strategist-critic's restraint.
- **`/goal-setting:progress`** — read-only dashboard of loop position, active goals, KR
  status, systems, mitigations, and cadence calendar. Writes nothing.
- **State as Markdown** in the deployment's `goals/` directory: `STATE.md`, `vision.md`,
  `active.md`, `scorecard.md`, `journal.md`. Human-readable, parseable, resumable.
- **Reference library** — the canonical playbook, the seven anchor-area chapters, the Three
  Tyrants philosophical companion, the object-model schemas, and one file per Setup stage.
- One PreCompact staleness hook (warns if `STATE.md` lags the working files). Claude Code
  only; a no-op on Cowork.
- Cowork-safe setup (Write-only, no shell); works on Claude Code and Cowork.

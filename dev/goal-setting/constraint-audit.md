# Goal Setting — constraint audit (/upskill)

**Provenance:** audit date 2026-08-06 · repo commit `df7f0c0`; the `goal-setting/` and
`eval/targets/goal-setting/` subtrees are **clean** at this commit (the dirty worktree is
entirely researcher work — modified `researcher/skills/*`, untracked
`dev/researcher/w6ab-design.md` and `researcher/reference/templates/decision-ledger.md` —
none of it reachable from any surface audited here). Plugin last changed at `dcdc922`
(v0.2.1, 2026-07-12).

**Scope: full plugin audit.** Every instruction surface inventoried, five parallel surface
auditors run, integration pass run over the seams.

**Surfaces inventoried and read in full (39 files):** 7 skills (`goal-setting-init`,
`-setup-stage`, `-pulse`, `-review`, `-restart`, `-pressure-test`, `-progress`), all 15
command wrappers under `commands/goal-setting/`, `agents/goal-setting-critic.md`,
`templates/CLAUDE.md`, and the reference library (`playbook.md` 832 lines, `schemas.md`,
`heartbeat.md`, `three-tyrants.md`, `stages/01`–`06` + README, `anchor-areas/README` +
chapters 01–07, `INDEX.md`, `README.md`).

**Execution settings audited:** all frontmatter across skills, commands, and the agent
(`model:` pins, `allowed-tools`, `tools`, `disable-model-invocation`); `hooks/hooks.json`
and `hooks/state-staleness-check.sh`; the six `` !`cat goals/STATE.md` `` preambles.

**Evidence consulted, not audited:** root and plugin `AGENTS.md`,
`dev/goal-setting/build-spec.md`, `goal-setting/CHANGELOG.md`, `git log`, the eval pack
(`principles.md`, `rubric.md`, `gates.json`, `adapter.md`, `coverage.md`, iteration-1
`scores.md`), `dev/scripts/drift-configs/goal-setting.json`, the Claude Code hooks reference
(https://code.claude.com/docs/en/hooks.md — exit-code and output-routing tables), and — for
precedent only — `dev/researcher/constraint-audit.md` and researcher's v1.9.0 release commit.

**Exclusions / unreadable:** none. No file in the plugin was skipped. Two reference files
(`INDEX.md`, `README.md`, `stages/README.md`, `anchor-areas/*`) are unreferenced by any
runtime surface — read and audited anyway, and their unreachability is itself recorded
below.

**Baseline for any apply step:** v0.2.1; eval iteration-1 is **6 PASS / 4 FAIL at scenario
level** — see "The regression net is not currently green" under Cross-surface findings.
This materially constrains step 1 of the apply loop.

---

## Verdict

**Audited in full at `df7f0c0`. The method surfaces are unusually clean — the process shape
here really is the product, and almost everything that looks like scaffolding is
eval-contracted method.** The genuine capability pile is small and concentrated in two
places: **eight `model:` pins** (7 skills + the critic agent), and a **fifteen-file router
phrasing family** ("follow its steps exactly"). Neither lives in the methodology.

What the audit found more of than capability constraints is **drift and one broken
mechanism**: a canon that has fallen behind its own runtime in six specific places
(including a parallel object model the plugin's own doctrine forbids), and a PreCompact hook
whose message — documented behavior, now confirmed — reaches neither the model nor the user.
None of that constrains the model; all of it is a correctness liability, and together it is
the larger body of work.

Nothing should be cut before the four consolidated author questions are answered. Question
1 (the pins) governs eight surfaces and has a settled sibling precedent.

---

## Surface: `goal-setting-setup-stage` engine + 6 Setup commands + `stages/01`–`06`

Audited at `df7f0c0`. Engine skill, six command wrappers, six stage specs and the stages
README read in full.

**Surface verdict: clean within its dependency closure except three findings** — the `opus`
pin, the "exactly" phrasing, and one timing prescription. The stage specs themselves
(`stages/01`–`06`) contain **zero** capability constraints.

### Findings

1. **`model: opus`** (`SKILL.md:5`) — capability-workaround, **CUT**, inferred. Present
   since v0.1.0 (`b3c89f2`); no commit or CHANGELOG entry states why. See cross-surface
   finding A — this is one instance of a plugin-wide family and should not be decided
   file by file.
2. **"follow its steps exactly"** (`orient.md:8`, `horizons.md:8`, `anchors.md:8`,
   `goals.md:8`, `systems.md:8`, `premortem.md:8`) — capability-workaround,
   **REWRITE AS INTENT**, inferred. "Exactly" is literalism demanded of the worker; the
   real intent — the skill is authoritative over the wrapper's own paraphrase — is
   currently stated nowhere. Twin-failure check: do **not** drop the word without adding
   the authority sentence, or a model may execute from the summary. See cross-surface
   finding B.
3. **Working Dynamic update timing** (`SKILL.md:70-72`): *"Update the Working Dynamic after
   the *first* substantive exchange — how the user took the first challenge — not after
   several stages."* — capability-workaround wrapped around real intent,
   **REWRITE AS INTENT**, inferred. The intent (calibration stays current for the next
   skill that reads it cold) survives; the scheduling instruction is worker management.
4. **Friction framing vs. the provenance valve** (`SKILL.md:36-37` vs `173-183`) —
   product-method, **REWRITE line 36 only**, history-backed (`6e0624b` added the Step 6
   valve specifically to defuse manufactured friction). The valve is the governing rule,
   but the opening line still reads as a per-stage quota — the exact failure the valve
   exists to prevent. Rubric Posture anchor 1 fails "a challenge with no provenance", so
   the two are in tension on a graded dimension.
5. **`` !`cat goals/STATE.md` `` preamble** (`SKILL.md:77`) — **UNRESOLVED**, see
   cross-surface finding C. Step 0.3 already mandates reading STATE.md, so this either
   duplicates it or silently no-ops.
6. **Hard constraints as refusals + Candidate Backlog** (`SKILL.md:123-149`, Guardrail 4
   `:254`) — product-method, **KEEP verbatim**, history-backed. Notable keep: refusal-not-
   warning enforced in prose is correct here, because no validator can refuse mid-
   conversation; the deterministic gates only check the aftermath.
7. **Ordering check — advisory, recorded** (`SKILL.md:90-101`) — product-method, **KEEP**,
   observed. Notable keep: looks like sequence scaffolding, is record-never-restrict
   applied to the arc; eval scenario `adv-out-of-order` encodes it exactly.
8. **Reflect back, confirm, capture** (`SKILL.md:151-155`) — product-method, **KEEP**.
   Notable keep: this is not a forced check-in — capturing an unconfirmed goal would take
   ownership of a decision that is the user's. Cutting it would fail the autonomy check.
9. **Step 6 Self-Audit** (`SKILL.md:170-190`) — product-method, **KEEP**, history-backed
   (`6e0624b`). Notable keep: reads like verify-every-line hedging, is the review bar with
   an explicit anti-manufacture valve ("named the weakest answer, graded it sound" is a
   legitimate outcome).
10. **One isolated question per turn** (`SKILL.md:70`, `116-118`, `274`;
    `stages/README.md:28`) — product-method, **KEEP**, observed with a caveat. This manages
    the *user's* cognitive load, not the model's, and line 70 frames it as a default
    posture subject to calibration. Caveat: `playbook.md` states no per-turn pacing rule —
    the pacing originates in the engine. See author question 4.
11. **`allowed-tools: Read, Write, Edit, Glob, Grep`** (engine + all six commands) —
    external-contract, **KEEP**. Contract: Cowork has no shell, and the skill's job is
    conversation plus state files. Least privilege, not a cap.
12. **Stage specs `01`–`06`** — product-method throughout, **KEEP essentially verbatim**,
    observed. Notable keeps someone might wrongly cut: `04-goals.md:28` "conversationally,
    not as a form to fill" (explicitly anti-rigid-template); `05-systems.md:44` a missing
    decision rule "gets one push" (calibrated friction, not hedging); `06-premortem.md:20`
    "at most ~3 mitigations check weekly" (a budget derived from the five-minute pulse, not
    arbitrary chunking); `02-horizons.md:31` "don't block the stage on it";
    `06-premortem.md:11` the Balcetis hedge ("adaptation… not a replication") — an evidence
    standard.

### Proposed rewrites

`SKILL.md:36-38` — replace *"If a whole stage goes by and you never once pushed on a soft
answer, you weren't doing your job."* with:

> Every stage has a weakest answer, and the job is making sure it got examined — with
> provenance in the user's own material, per the Self-Audit in Step 6. A stage that ends
> with every answer unexamined wasn't advised; a stage that ends with manufactured pushback
> wasn't either.

`SKILL.md:70-72` — replace the timing sentence with:

> Keep the Working Dynamic current: the moment you learn how this user takes a challenge,
> record it — the next skill to run reads it cold.

Six command files, line 8 — see the unified rewrite in cross-surface finding B.

### Still under-specified

1. Is "one isolated question per turn" a product commitment or an engine convention? The
   playbook never states it. If it is intent, one sentence saying *why* would immunize it
   against a future audit cutting it as pacing scaffolding.

---

## Surface: `goal-setting-pulse` + `goal-setting-review` + 5 cadence commands + `heartbeat.md`

Audited at `df7f0c0`. Both skills, five command wrappers and the heartbeat protocol read in
full.

**Surface verdict: clean within its dependency closure except two model pins, the shared
"exactly" family, and one mirror drift.** `heartbeat.md` is the best-written surface in the
plugin — every line in it is intent or contract.

### Findings

1. **`model: sonnet`** (`pulse/SKILL.md:5`) and **`model: opus`** (`review/SKILL.md:5`) —
   capability-workaround, **CUT**, observed (CHANGELOG and git silent on rationale). See
   cross-surface finding A.
2. **"follow its steps exactly"** (`daily.md:8`, `pulse.md:8`, `monthly.md:8`,
   `quarterly.md:8`, `annual.md:8`) — capability-workaround, **REWRITE AS INTENT**. Same
   family as the Setup commands; see cross-surface finding B.
3. **Mirror drift — the diagnosis line** (`commands/goal-setting/pulse.md:12-13`):
   *"executed but not progressing → **the goal may be wrong**"*, where the skill
   (`pulse/SKILL.md:88`) and the v0.2.1 F1 fix both say *"the goal **(or the KR measuring
   it)** may be the misfit."* — not a constraint, a **REWRITE** (drift), history-backed
   (CHANGELOG 0.2.1 F1 explicitly reconciled this line). This is precisely the drift the
   doctrine-lives-once rule exists to catch, and F1 fixed the skill without sweeping the
   wrapper.
4. **Cadence time boxes** (`pulse/SKILL.md:13-14`, `:51`, `:114`, Guardrail 1 `:153-154`) —
   product-method, **KEEP**, history-backed + eval-encoded (`adv-mixed-week` must-not
   "expand the pulse into a coaching session"). Notable keep: cadence weight is the wedge;
   the time boxes are outcome definitions, not chunking.
5. **The unknown/mixed evidence standard** (`pulse/SKILL.md:68-74`, Guardrail 5
   `:160-161`) — product-method, **KEEP**, history-backed (H4 / blind F5a). Notable keep:
   the textbook "distrust of stochasticity ≠ distrust of capability" case — it defines what
   counts as data, not how to think.
6. **The seven-way differential worked in order** (`review/SKILL.md:42-65`) —
   product-method, **KEEP**, history-backed (v0.2.1 F2). Notable keep: the mandated
   sequence *is* the method — the order exists to make the user walk past dose, time,
   mechanism and metric before touching the goal.
7. **Quarterly closeout gate** (`review/SKILL.md:103-117`, Guardrail 1 `:179-183`) —
   product-method, **KEEP**, eval-encoded (`adv-closeout-gate`). Notable keep, and the
   exemplary line in the plugin: *"The disposition calls are the user's; requiring *a*
   disposition is yours."*
8. **Restart hold state machine** (`pulse/SKILL.md:117-147`) — product-method +
   external-contract, **KEEP**, history-backed. Contract: `restart/SKILL.md:57-66` writes
   the typed flags, this skill consumes and updates them, and eval gate
   `restart_phase_recorded` parses `restart_phase:`. The write-every-pulse rule looks like a
   ritual; it is durable-state design, because sessions genuinely end.
9. **Journal + revision record formats** (`pulse/SKILL.md:100-109`, `:47-48`;
   `review/SKILL.md:80-85`) — external-contract, **KEEP — name the contract**: eval gates
   `journal_dated_entry` (regex on `^- **[YYYY-MM-DD]`) and `revision_preserves_original`
   (regex `revised \[date\]:.*was`) parse these exact shapes, and the monthly differential
   reads the journal records as its evidence.
10. **`heartbeat.md` in full** — product-method / external-contract / voice, **KEEP
    entirely**, history-backed + eval-encoded. Notable keeps: §1 trust order (*"Anything
    remembered but unrecorded is a hypothesis to verify with the user, never a fact to build
    on"*); §2 Coaching Memory rails (*"never quoted back as an accusation… never surfaced
    as a list — the user experiences better coaching, not a dossier"*); §3 additive
    migration naming the init template authoritative; §4 date arithmetic over a cached
    `Next due` line, plus "Blank dates are not a pass"; §5 the backstage vocabulary
    blocklist **paired with an allowed list** — which is what stops it being over-broad.
11. **Two scripted blockquotes** (`pulse/SKILL.md:26-29` setup-mode offer;
    `review/SKILL.md:166-168` annual handoff) — user-intent with scripted wording,
    **REWRITE AS INTENT (low priority)**: mark them as examples of tone and required
    content, not as scripts. The content requirements (offer both paths and respect the
    choice; name the cascade and point at `/goal-setting:horizons`) stay.
12. **Guidance embedded inside a record template** (`review/SKILL.md:80-85`, the
    Classification placeholder's clause *"a revision claiming any other classification
    deserves a second look"*) — **REWRITE**: lift the clause out of the fenced block into
    surrounding prose. A literal executor can copy it into the user's state file.

### Still under-specified

2. `pulse/SKILL.md:137-140` says to "clear the restart flags" on exit to ongoing. Does
   *clear* mean delete the flag lines or reset their values? Gate `restart_phase_recorded`
   requires `restart_phase:` to survive (satisfied by `none`), but the fate of
   `restart_system` / `restart_clean_weeks` / `restart_last_clean_pulse` / `restart_queue`
   is ambiguous, and heartbeat §3's never-remove promise covers sections, not keys.

---

## Surface: `goal-setting-init` + `init` command + `templates/CLAUDE.md` + hooks + reference maps

Audited at `df7f0c0`. Skill, command, deployed template, both hook files, `INDEX.md` and
`reference/README.md` read in full.

**Surface verdict: clean within its dependency closure except the `opus` pin, the "exactly"
phrasing, and three drift defects.** Unusually clean for a scaffolding skill: its
"rigid template" is the schema of record with named downstream parsers, not
trust-substitute rigidity.

### Findings

1. **`model: opus`** (`SKILL.md:6`) — capability-workaround, **CUT**, inferred. Sharpest
   instance of the family: the plugin's own tiering puts mechanical skills on `sonnet`, and
   this skill declares itself judgment-free at `:281` (*"Init prepares; the stages do the
   thinking"*). See cross-surface finding A.
2. **"follow its steps exactly"** (`init.md:8`) — capability-workaround,
   **REWRITE AS INTENT**. See cross-surface finding B.
3. **`disable-model-invocation: true`** (`SKILL.md:5`) — safety-governance, **KEEP**.
   Notable keep: init writes files and a root `CLAUDE.md`; keeping it explicit-command-only
   is a human gate on a side-effectful step, not a capability cap.
4. **Cowork Write-only rule** (`SKILL.md:15-18`, Guardrail 3 `:282`, failure row `:292`) —
   external-contract, **KEEP**, history-backed (v0.1.0 "Cowork-safe setup"). Contract:
   Cowork has no shell. Already double-enforced by `allowed-tools` omitting Bash. Stated
   three times; harmless.
5. **"use this exact structure" for `goals/STATE.md`** (`SKILL.md:62`, `:64-165`) —
   external-contract, **KEEP — name the contract**, observed. Three named consumer classes
   parse these headers: `heartbeat.md:39-43` (which declares the init template authoritative
   over anything a skill remembers), every ongoing skill (`setup-stage:70,135,192`;
   `pulse:49,114,121`; `review:125,149`; `progress:30,41-42`; `restart:57-61`), and the eval
   gates. This is a schema, not a template standing in for trust.
6. **Fresh-project guard** (`SKILL.md:24-28`, Guardrail 1 `:279`) — safety-governance,
   **KEEP**. Destructive-overwrite rail on a deployment that lives for months.
7. **Append-only session-start block** (`SKILL.md:50-55`) — safety-governance +
   external-contract, **KEEP**, history-backed: CHANGELOG pass-2 F1 records that the
   fallback previously *dropped* the block on projects with an existing `CLAUDE.md`. The
   emphasis exists because the quiet failure actually shipped.
8. **Absolute-date resolution** (`SKILL.md:59`, Guardrail 4 `:283-284`) — product-method,
   **KEEP**. Notable keep: looks like a hedge, is the evidence standard the entire heartbeat
   routing runs on (all cadence routing is date arithmetic against absolute last-run dates).
9. **Claude Code `.claude/settings.json` pre-allow** (`SKILL.md:236-250`) —
   external-contract, **KEEP**. Claude Code permission surface; explicitly a silent no-op on
   Cowork; merge-don't-overwrite is the right rail.
10. **Verbatim Step 5 confirmation block** (`SKILL.md:254-275`) — product-method, **KEEP**.
    Notable keep: a rigid template standing in for voice would be a cut, but here the exact
    promise wording *is* the product's voice, and it states the three-goal rule at first
    contact.
11. **Drift — "five state files"** (`SKILL.md:3` frontmatter description; and
    `init.md:9-10`, which omits `history.md` and says "copies `templates/CLAUDE.md`" when
    the skill writes a *filled* copy with a non-overwrite fallback) — **REWRITE**,
    history-backed: `goals/history.md` arrived in v0.2.0 and these two surfaces fossilized
    at five. `templates/CLAUDE.md` and the skill body are already correct at six.
12. **Drift — reference maps omit `heartbeat.md`** (`INDEX.md:1` claims "Every file in the
    reference library, in one table"; `README.md`'s "What's here" list) — **REWRITE**,
    observed.
13. **`templates/CLAUDE.md` session-start protocol** (`:45-58`) — product-method, **KEEP**.
    Notable keep, and structurally correct: a compressed summary that explicitly defers to
    `reference/heartbeat.md` as the authority, rather than a parallel copy. It is the
    mechanism by which the heartbeat applies in sessions where no skill fires.
14. **Hook design** (`hooks.json`, `state-staleness-check.sh`) — sound in shape, **KEEP the
    approach**. The staleness check lives in a PreCompact hook rather than as a "re-verify
    STATE before every response" prose ritual in seven skills, which is what move-to-mechanism
    should look like. Non-blocking, silently inert outside a deployment, portable `stat`.
15. **The hook never delivers its message** (`state-staleness-check.sh:56`) — **BROKEN
    MECHANISM, FIX**, history-backed by documentation. The script writes to stderr and exits
    0. Per the Claude Code hooks reference, **stderr on a normal (exit 0) hook event goes to
    the debug log only — the model does not see it and neither does the user.** The message
    is addressed to the assistant ("Silently bring STATE.md current… Do not mention this
    reconciliation to the user") and reaches nobody. See cross-surface finding D for the
    documented fix. Note this is a *correctness* defect, not a constraint: the intent is
    right and the v0.2.0 CHANGELOG shows the message was deliberately re-addressed to the
    agent as a "register-leak fix" — the fix landed on the wording, but the channel was
    never the right one.

### Proposed rewrites

`SKILL.md:3` — "…Scaffolds the `goals/` state directory, the **six** state files, and the
per-deployment config, then lands in Setup mode."

`commands/goal-setting/init.md`, body:

> Initialize a Goal Setting deployment for the current directory.
>
> Use the `goal-setting-init` skill — it is authoritative over this summary. It scaffolds
> the `goals/` state directory (`STATE.md`, `vision.md`, `active.md`, `scorecard.md`,
> `journal.md`, `history.md`) and writes the filled per-deployment config, landing the
> deployment in Setup mode with a clear next step.
>
> The skill's Step 0 is a fresh-project guard: if `goals/STATE.md` already exists it refuses
> to run and tells the user how to resume or start over. Do not bypass that guard. Init does
> not begin Stage 1 — that's `/goal-setting:orient`.

`INDEX.md` — add the missing row:
`| [heartbeat.md](heartbeat.md) | Session protocol | The Return — trust order, stance restoration, additive migration, overdue routing, backstage rule |`

### Still under-specified

3. Confirm the six-file list is authoritative (skill body and `templates/CLAUDE.md` agree at
   six; frontmatter and the command file say five) so the fix lands on the stale surfaces.

---

## Surface: `goal-setting-pressure-test` + `goal-setting-restart` + `goal-setting-progress` + critic agent + 3 commands

Audited at `df7f0c0`. Three skills, the agent, and three command wrappers read in full;
`strategist-critic.md` skimmed for contract parallels.

**Surface verdict: clean within its dependency closure except one real duplication, the
`opus`/`sonnet` pins, and one nit.** The critic is the most disciplined surface in the
plugin and should not be touched apart from the pin question.

### Findings

1. **Critic check list and output format restated in the dispatch**
   (`pressure-test/SKILL.md:46-49`) — capability-workaround, **REWRITE AS INTENT**,
   observed. The agent already owns its taxonomy (`goal-setting-critic.md:49-113`) and its
   output format (`:147-159`). Restating both inline is a copy that will fossilize when the
   agent evolves, and it reads as distrust that the subagent follows its own definition. The
   genuinely dispatch-shaped parts of `:39-49` (scope, memory payload, the user's question,
   "open with its read on prior findings") are intent — keep those.
2. **Model pins** — `pressure-test/SKILL.md:5` (`opus`), `restart/SKILL.md:5` (`sonnet`),
   `progress/SKILL.md:5` (`sonnet`), `goal-setting-critic.md:24` (`opus`). See cross-surface
   finding A, which resolves the disagreement between auditors on how to sort these.
3. **"follow its steps exactly"** (`restart.md:8`) — capability-workaround, **REWRITE AS
   INTENT**. Note the inconsistency: `pressure-test.md:8` and `progress.md:8` say only
   "follow its steps". See cross-surface finding B.
4. **Critic memory, not remit** (`pressure-test/SKILL.md:39-44`, `:53`;
   `goal-setting-critic.md:104-113`) — product-method, **KEEP**, history-backed (CHANGELOG
   "Critic memory (M8; blind F2 survivor)", `6e0624b`) and eval-encoded (`adv-critic-memory`
   is a blocker golden). Notable keep: this is the anti-laundering mechanism against
   ignore-revise-rerun, and *"The user is entitled to leave a finding open; your job is that
   it stays visibly open, not that it gets obeyed"* (`:111-112`) is the memory-not-remit
   distinction already stated as intent.
5. **"What Is Not A Finding"** (`goal-setting-critic.md:117-134`) + *"Your restraint is what
   makes your alarms credible"* (`:159`) — product-method, **KEEP**, history-backed +
   eval-encoded (the rubric scores a manufactured concern as 0). Notable keep: this is the
   load-bearing restraint doctrine; the plugin's own AGENTS.md flags it as such.
6. **Critic tools: `Read, Grep, Glob`, no Write, no web** (`:26-29`) — external-contract
   serving designed restraint, **KEEP — name the contract**: the critic tests logic not
   evidence (so no web), and findings flow back through the dispatching skill which owns the
   journal write (so no Write). Exact mirror of `strategist-critic`.
7. **"You are a rigorous chief-of-staff reviewing another person's goal formulations"**
   (`:34`) — product-method, **KEEP**. Notable keep, and worth stating explicitly because
   this audit's own stop-list names expert-persona incantations: this is not one. It defines
   whose judgment standard applies, in one line, with no credential theater, and it is the
   plugin-wide continuity figure named in `heartbeat.md:8`.
8. **Pressure-test does not edit `active.md` / `vision.md`** (`SKILL.md:72-74`, Guardrail 3
   `:87-88`) — product-method, **KEEP**. Human gate: acting on a finding is the user's call.
9. **Restart's one-system hard constraint + typed Active Flags** (`restart/SKILL.md:39-44`,
   `:57-66`, Guardrail 1 `:85-87`) — product-method + external-contract, **KEEP**,
   history-backed and eval-encoded (`adv-restart-exit`; gate `restart_phase_recorded`).
   Notable keep: *"A user who follows the protocol perfectly must not stall in restart
   mode"* (`:94-96`) is the outcome stated in exactly the form this audit wants.
10. **Restart's no-guilt rules** (`:30-32`, `:48`, Guardrail 2–3) — product-method,
    **KEEP**. Method definition (playbook Appendix B), not worker management.
11. **Progress is read-only** (`SKILL.md:95`; `allowed-tools: Read, Glob, Grep`) —
    product-method + external-contract, **KEEP**, eval-encoded (`rubric.md:43`: "read-only —
    must write nothing"). Notable keep: the tool restriction is the mechanism enforcing the
    product rule.
12. **Progress reports the heartbeat's route, not a stale `Next due`**
    (`progress/SKILL.md:12-18`, `:46-47`) — product-method, **KEEP**, history-backed
    (`coverage.md:47-49` records this text exists because a blind run got it wrong).
    Notable keep: a fixed defect encoded as an outcome definition — *"A dashboard that shows
    a 42-day-old 'next: Monday pulse' is lying about where the user stands."*
13. **Hardcoded "Infrastructure: N/4 checks passed"** (`progress/SKILL.md:53`) — **REWRITE
    (nit)**: couples the header to the current count of health checks; adding a fifth check
    silently makes the dashboard lie. Use "N/M" or "All checks passed / [failures listed]".
14. **Check-partitioning bookkeeping** (`goal-setting-critic.md:56`: *"Check #6 owns the
    third test, so a vague Objective surfaces here once, not twice"*) — product-method,
    **KEEP narrowly**, inferred. It is taxonomy (each defect surfaces once), though phrased
    as bookkeeping. If ever touched, state the intent instead: "each diagnostic test belongs
    to exactly one check; a defect surfaces once." Not worth a standalone edit.

### Proposed rewrite

`pressure-test/SKILL.md:46-49` — replace the check-list-and-format bullet with:

> - The instruction to open with its read on the prior findings (resolved / recurring /
>   superseded) when any exist. Its checks and output format are its own — don't restate
>   them in the dispatch.

### Still under-specified

4. Is `model: opus` on the pressure-test *wrapper* deliberate, given the critic — which does
   the acuity work — is separately pinned? Folded into author question 1.

---

## Surface: reference canon (`playbook.md`, `schemas.md`, `three-tyrants.md`, `anchor-areas/`)

Audited at `df7f0c0`. All 832 lines of `playbook.md`, `schemas.md`, `three-tyrants.md`, and
all eight `anchor-areas/` files read in full.

**Surface verdict: zero capability constraints — and the largest concentration of drift in
the plugin.** Every imperative in the canon is aimed at the *user* (the business owner
working the method), which sorts as product-method by definition: "write the goal by hand
daily", "work the stages in order", the timed Quick Start blocks are the product, not
scaffolding around the model.

### Findings

1. **Appendix C is a parallel object model** (`playbook.md:684-801` vs the whole of
   `schemas.md`) — external-contract, **MOVE TO MECHANISM (single-source)**, observed.
   `reference/README.md:23-25` explicitly forbids parallel copies, and these two have already
   diverged: `schemas.md` has `CandidateBacklogEntry`, the max-3 AnchorArea constraint, the
   closeout rule, the mitigation operating rule, `backlog_decisions`, and file-storage
   mappings; Appendix C has none of them. Two "canonical" object models coexist and
   disagree. Mechanism: reduce Appendix C to a pointer, or — if the playbook is meant to
   travel standalone — mark it the portable summary and name `schemas.md` authoritative
   inside it. Eval-safe either way: the rubric and scenarios encode `schemas.md` and
   `heartbeat.md` wording, never Appendix C's.
2. **Six-anchor-era fossils** (`playbook.md:648` "all six anchor areas"; `:396` "six systems
   at once"; `:227-229` anchor names not in the canonical seven — "Financial Management",
   "Revenue Generation", "Customer Experience"; `:400` "Marcus chose Revenue Generation",
   contradicting the same worked example at `:239` where he chooses Demand Generation) —
   **REWRITE** (content drift, not a constraint), observed. The canonical seven are stated
   at `:192` and `:705`, and `stages/03-anchors.md` — the runtime spec — already uses them.
   **The runtime is currently more correct than the canon.**
3. **Stale companion pointer** (`playbook.md:210`: "in `anchor-areas.md`") — **REWRITE**,
   observed. No such file; the companion is the `anchor-areas/` directory.
4. **Routing thresholds duplicated into the schema** (`schemas.md:93-94` "2+ consecutive
   sweeps"; `:100` the fired-trigger operating rule — both duplicating `heartbeat.md:59-60`)
   — product-method, **MOVE TO MECHANISM (single-source in `heartbeat.md`)**, observed. Keep
   the rule; the schema should state field semantics and defer the *threshold* to the
   routing protocol, so a future threshold change cannot half-land.
5. **Evidence standards in `schemas.md`** (`:92-93`, `:111-121`: a half-answer records
   `unknown` and is never inferred; a mixed reality is never averaged; an unchecked sweep
   records `unchecked`, not `clear`; *"named third parties are recorded facts, not accepted
   commitments"*) — product-method, **KEEP untouched**, eval-coupled (`adv-mixed-week`).
   Notable keeps: these look like verify-every-line hedging and are evidence standards
   against stochastic inference.
6. **`three-tyrants.md` and all of `anchor-areas/`** — product-method, **KEEP, no
   findings**. Pure user-facing philosophy and reference. `anchor-areas/README.md:74-79`
   ("Read the relevant chapter before scoring") is user reading advice, and the runtime
   translation in `stages/03-anchors.md:21` correctly says "point the user to the chapter" —
   the seam translated it properly.
7. **The three-goal rule in triplicate** (`playbook.md:52`, `:235`, `:308`, plus `:628`) —
   product-method, **KEEP**. Notable keep: repetition is deliberate rhetorical enforcement of
   the load-bearing constraint, not a re-read ritual.

### Still under-specified

5. Is `playbook.md` meant to be publishable standalone, outside the plugin? The answer
   decides whether Appendix C is deleted-and-pointered or kept as a marked portable summary
   with a drift policy. (Folded into author question 3.)

---

## Cross-surface findings (integration pass)

### A. Eight `model:` pins — the plugin's one systemic capability constraint

`goal-setting-init` `opus` · `goal-setting-setup-stage` `opus` · `goal-setting-review`
`opus` · `goal-setting-pressure-test` `opus` · `goal-setting-critic` `opus` ·
`goal-setting-pulse` `sonnet` · `goal-setting-restart` `sonnet` · `goal-setting-progress`
`sonnet`.

**The surface auditors split on this, and the split is worth recording.** One argued these
are tier *aliases* that float with releases, so no capability fossil exists. Two argued they
are fossils and should be cut. The alias observation is factually right and does not change
the ruling, for a reason the researcher audit stated sharply and this audit adopts:
**frontmatter `model:` is an override, not a floor.** It caps a stronger session model
exactly as much as it floors a weaker one, and it cannot express "the most capable model
available." A judgment surface pinned to a named tier is permanently held at that tier's
ceiling, whatever ships later.

Two pieces of evidence make this concrete rather than theoretical:

- **The eval has never exercised the pins.** `adapter.md` never mentions a model; iteration-1
  ran the skills in-context on `claude-fable-5` (`scores.md` provenance). So the plugin's
  only regression net measured a configuration no user gets, and equally, no eval result can
  detect a pin change in either direction.
- **The author has already settled this question once.** Researcher v1.9.0 (`84aa8cb`, "the
  headroom release") removed all twelve of its pins — ten skills, two agents — as an applied
  outcome of this same audit, and shipped green on iteration-20.

**Ruling: capability-workaround, CUT all eight** (delete the `model:` line; surfaces inherit
the session model). Evidence basis: history-backed by sibling precedent, inferred as to
goal-setting's own intent — no commit or CHANGELOG entry anywhere states why these tiers
were chosen. Because this is a plugin-wide product decision and not eight independent calls,
it is author question 1 rather than a unilateral edit. Note that `strategist` still carries
eight pins of its own, so the answer plausibly governs a third plugin.

### B. "follow its steps exactly" — fifteen router files, inconsistently

Eight command wrappers say "follow its steps **exactly**" (`init`, `goals`, `daily`,
`pulse`, `monthly`, `quarterly`, `annual`, `restart`); seven say only "follow its steps"
(`orient`, `horizons`, `anchors`, `systems`, `premortem`, `pressure-test`, `progress`). The
inconsistency is itself evidence that no decision was ever made here.

"Exactly" instructs the model to execute steps literally rather than hold the job — the
audit's central capability tell, applied to a router. But the **twin-failure check bites**:
the real intent underneath it is that *the skill is authoritative over the wrapper's own
compressed paraphrase*, and that sentence appears nowhere in any of the fifteen files. Drop
the word without adding the authority statement and a model may reasonably execute from the
summary.

**Ruling: capability-workaround, REWRITE AS INTENT across all fifteen** — one consistent
form, adjusting skill and stage/cadence name:

> Use the `goal-setting-<skill>` skill for the **<stage-or-cadence>** stage. The skill is
> authoritative for this work; the summary below is orientation, not a substitute for it.

The per-command hard-constraint restatements (`anchors.md:14-15`, `goals.md:15-18`,
`systems.md:13-15`, `premortem.md:14-18`, `restart.md:14-16`, `pressure-test.md:14-16`,
`progress.md:14`) are **KEEP** — that duplication is user-facing advertisement of the
constraint a user most needs to know before invoking, and for the three-goal rule it is
deliberate redundancy.

### C. The `` !`cat goals/STATE.md` `` preamble — a marketplace-wide open question

Six goal-setting skills carry it (`setup-stage:77`, `pulse:18`, `review:18`, `restart:18`,
`pressure-test:17`, `progress:22`). It is **not** a goal-setting invention: researcher
carries three (`research-start-phase`, `-phase-insight`, `-progress`) and strategist five —
fourteen files across three plugins, and researcher kept its three through the v1.9.0
audit-and-apply.

Two things are unresolved: whether `!`-prefixed command execution fires in *skill* context at
all (it is documented as a slash-command feature), and what it does on Cowork, which has no
shell — in a plugin whose `allowed-tools` deliberately exclude Bash. If it does not fire,
fourteen files carry a dead line and every one of these skills already reads STATE.md
explicitly at Step 0 anyway, making it redundant where it works and inert where it doesn't.

**Ruling: UNRESOLVED — do not touch in a goal-setting-scoped change.** This is a
marketplace-level question; answering it for goal-setting alone would create divergence
across three plugins. Recorded as author question 2.

### D. The PreCompact hook is a no-op — its message reaches nobody

`state-staleness-check.sh:56` writes its message to **stderr** and exits **0**. Per the
Claude Code hooks reference (https://code.claude.com/docs/en/hooks.md, exit-code table):
**stderr on a normal exit-0 hook event goes to the debug log only** — "Claude Sees: No,
Debug Log: Yes". It is exit *2* that feeds stderr back to the model, and exit 2 on
PreCompact also blocks compaction, which this hook explicitly does not want.

So the plugin's only hook does nothing. The message is addressed to the assistant, and the
assistant never receives it. The user never receives it either — which is the one silver
lining, since a message reading "Do not mention this reconciliation to the user" surfacing
to the user would have violated the heartbeat §5 backstage rule the script's own comment
cites.

**Ruling: fix the channel, keep the intent.** The documented mechanism for injecting
model-visible text on a non-blocking hook is JSON on **stdout**:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreCompact",
    "additionalContext": "…the reconciliation instruction…"
  }
}
```

One caveat to verify before shipping: `additionalContext` has documented model visibility in
the general hooks output table, but the PreCompact-specific section of the docs does not list
it among that event's outputs. Confirm with a live test that PreCompact honors it; if it does
not, the honest conclusion is that this check cannot be delivered as a hook at all, and the
staleness concern belongs back in `heartbeat.md` as a return-protocol step.

Evidence basis: history-backed (documentation). Related open question — whether hooks fire at
all under Cowork — is undocumented, but moot here: the plugin already declares this hook
Claude Code-only.

### E. Doctrine-lives-once holds structurally, but six mirrors have drifted

The architecture is right: `heartbeat.md` is pointed at by all six ongoing/setup skills with
a one-line gloss rather than copied, and `templates/CLAUDE.md` compresses it while explicitly
deferring to it as authority. That is the highest-risk mirror in the plugin — any heartbeat
edit must sweep it — but it is currently consistent, wording included.

What has drifted, all recorded in the surface sections above:

| Mirror | Drift | Section |
|---|---|---|
| `playbook.md` Appendix C ↔ `schemas.md` | Parallel object model; Appendix C missing six later additions | Canon 1 |
| `schemas.md` ↔ `heartbeat.md` | Routing threshold "2+ sweeps" and the fired-trigger rule stated in both | Canon 4 |
| `commands/pulse.md` ↔ `pulse/SKILL.md` | v0.2.1 F1 fixed the skill's diagnosis line, not the wrapper's | Cadences 3 |
| `pressure-test/SKILL.md` ↔ critic agent | Check list and output format restated in the dispatch | Critic 1 |
| init frontmatter + `init.md` ↔ reality | "five state files"; `history.md` missing since v0.2.0 | Init 11 |
| `INDEX.md` / `reference/README.md` ↔ `reference/` | `heartbeat.md` absent from both maps; README claims cadences read "playbook.md Part Two", which no cadence skill loads | Init 12, Canon seams |

The drift lint (`node dev/scripts/lint-doctrine-drift.mjs --plugin goal-setting`) reports
clean at `df7f0c0` — correctly, because it detects *retired phrases*, not divergence between
two live copies. None of these six would ever trip it. Worth knowing what the release gate
does and doesn't cover.

### F. The three-goal rule is prose-enforced by design, and cannot be mechanized

The rule appears across roughly ten surfaces (`setup-stage:126,254,264,271`;
`review:131,180`; `anchors.md:14`; `goals.md:15`; `schemas.md:29,47`; `playbook.md` ×4;
`stages/03-anchors.md:46`; `critic:77`; `templates/CLAUDE.md:82`; `heartbeat.md:77`). This
looks like a move-to-mechanism candidate and is not one: the refusal has to happen
mid-conversation, and the eight deterministic gates in `gates.json` only inspect the
aftermath. Cowork additionally cannot run a validator script at all. The eval's Constraint
Enforcement dimension — which requires refusal *plus* a backlogged candidate *plus* an
explicit swap/defer/reject decision — is the real floor. **KEEP the redundancy; it is the
product's wedge.**

### G. The regression net is not currently green

Any apply step inherits this. Eval iteration-1 (the only iteration) scores **6 PASS / 4 FAIL
at scenario level, 16/24 at run level**, and its own triage attributes three of the four reds
to harness defects rather than the plugin: two scenarios exhaust their scripted user turns
before the behavior under test becomes reachable, one gate fires on runs where it is
logically inapplicable, another cannot distinguish a correctly-held confirm gate from a
failure to write, and a fifth scenario's seed predates the v0.2.1 experiment-terms schema. A
blindness breach also forced one run to be excluded and re-run. Only one red
(`adv-42-day-return`: a backstage machinery leak and a routing hedge) is a genuine plugin
finding, and it is already filed as a candidate v0.2.2 patch.

**Consequence for step 1 of the apply loop:** there is no clean baseline to compare against
today. Fixing the harness batch first (the scorecard's own ranked item 1) is what makes
iteration-2 able to distinguish a rewrite regression from a pre-existing red. Applying these
rewrites against iteration-1 as-is would leave every result ambiguous.

One further caution for that step: the scorecard's plugin-fix items 6 and 7 propose
*strengthening* heartbeat §5 with a tripwire list and de-hedging the ~6-week routing row.
Both are intent-strengthening and compatible with this audit — worth landing in the same
release rather than in competing directions.

### H. Autonomy check — clean

No proposed cut moves a decision from the user to the model, broadens what the plugin writes,
or expands its permissions. The human gates (reflect-back-before-capture, the closeout
disposition gate, the critic not editing state, `disable-model-invocation` on init, the
fresh-project guard) are all rated KEEP. The "follow its steps" rewrite touches router
phrasing only; the pin removal changes which model runs, not what it is allowed to do.

---

## Consolidated author questions

Four questions. The first governs eight surfaces; nothing in section A should be applied
before it is answered.

1. **The eight `model:` pins — cut them all?** Researcher's identical question was answered
   "remove all" in v1.9.0. If the goal-setting tiering was a deliberate cost or latency map
   (`sonnet` for the 90-second daily ritual, `opus` for judgment cadences) rather than a
   quality hedge, that intent is real — but a named pin is the wrong instrument for it, since
   it caps as well as floors. Either answer is fine; the answer should be written down once
   at marketplace level, because `strategist` carries the same eight-pin scheme and will ask
   this next.

2. **Do `!`-prefixed preambles fire in skill context?** Fourteen files across three plugins
   assume they do, and researcher kept its three through a full audit-and-apply. If they
   don't fire, that is a marketplace-wide dead line and every affected skill already reads
   its STATE file explicitly anyway. Marketplace-scoped, not goal-setting-scoped — which is
   why this audit proposes no goal-setting-only change to it.

   *(The paired question — does PreCompact stderr reach the assistant? — is now answered: no.
   See cross-surface finding D. The hook needs a channel fix, and that one is
   goal-setting-scoped.)*

3. **Is `playbook.md` meant to be publishable standalone?** Decides whether Appendix C is
   deleted and pointered at `schemas.md`, or kept as an explicitly-marked portable summary
   with a stated drift policy. Right now it is neither, and it disagrees with `schemas.md`
   on six things.

4. **Is "one isolated question per turn" a product commitment?** It lives in the engine and
   the stages README, never in the playbook. If it is intent, one sentence of *why* would
   immunize it against a future audit reading it as pacing scaffolding.

---

## Applied rewrites

*(None. This run was audit-only, per the skill's default. This section records what the
author accepts, rejects, or defers when an apply pass runs.)*

# Constraint audit — strategist

## Provenance

- **Audit date:** 2026-08-06
- **Commit:** `df7f0c0` (worktree dirty, but only in `researcher/` and `dev/` — every strategist file clean at this commit)
- **Plugin version:** 0.4.1
- **Scope of this run:** full plugin audit — all surfaces + integration pass. This file replaces any prior version.
- **Run shape:** six parallel surface auditors (stage engine; init; framework; pressure-test; session management; reference library), integration pass by the orchestrator, which independently verified the load-bearing claims (model-pin family, synthesise `Task` omission, wrapper phrase family, researcher v1.9.0 precedent).
- **Surfaces inventoried:** 7 skills, 13 commands, 1 agent, 1 hook pair, `templates/CLAUDE.md`, `reference/` (INDEX, README, `_inventory.json`, `frameworks/`, 7 stage dirs ≈ 70 entries + 7 stage READMEs).
- **Evidence (read, not audited):** `strategist/AGENTS.md`, `strategist/CHANGELOG.md`, git history (incl. `3ccf8fa` initial, `5c8411b` 0.3.0, `450ecca` 0.4.1, `84aa8cb` researcher v1.9.0 precedent), `dev/scripts/drift-configs/strategist.json`, `eval/targets/strategist/{rubric.md,gates.json,principles.md}`.
- **Exclusions / partial coverage:** `eval/targets/strategist/{adapter.md,coverage.md,scenarios.jsonl}` not read (gates + rubric sufficed for seam evidence). Reference library: 28 files read fully, 7 section-read, ~42 entries covered by two orthogonal grep sweeps + full-population structural checks (frontmatter namespace, six-section structure) — the honest limit is that prose between pattern hits in the swept entries was not read line-by-line. `.DS_Store` files ignored. Nothing attempted was unreadable.
- **Mode:** audit, plus one fix applied ahead of the pass. On 2026-08-06 the owner reviewed every proposed rewrite and approved the recommendation set; the apply pass runs from a `/eval-run` baseline (`eval/targets/strategist/`). Landed early: framework finding 15's `frameworks/README.md` note. Deferred by the owner: X7 (the `` !`cat` `` preamble check). See Disposition.

## Verdict

**Plugin-scoped, at df7f0c0, all surfaces current, integration pass run:** no capability constraint distorts the plugin's core method — the staged loop, posture, commitment gate, state vocabulary, and library all sort as intent, product method, or machine-enforced contract. The cuttable capability surface is small and peripheral: **eight frontmatter model pins** (the family), **one compliance-adverb family** in ten command wrappers, **two frozen-at-0.3.0 drift spots** in `strategist-framework`, **one stale enumeration** in the pressure-test wrapper, **one persona incantation** in the critic, and **one build fossil** (`_inventory.json`). Separately, one live seam defect: the synthesise wrapper cannot dispatch the commitment-gate critic its own engine mandates (`Task` missing from `allowed-tools`).

---

## Surface: stage engine (`strategist-stage` + 7 stage commands) — audited at df7f0c0

**Surface verdict:** overwhelmingly intent within its dependency closure; the only clean capability cut is the `model: opus` pin, plus the synthesise `Task` seam bug.

### Findings

1. **`model: opus`** — `skills/strategist-stage/SKILL.md:5`. capability-workaround · cut pile · history-backed (present since `3ccf8fa`; no release ever records a model decision) · **cut**. A pin fossilizes today's model hierarchy on the plugin's flagship skill. See cross-surface X1 for the family ruling and the tiering question.
2. **`allowed-tools` family** — SKILL.md:4 (`… Task`) and the 7 wrappers at `commands/strategist/*.md:3` (all *without* `Task`). safety-governance / external-contract (no web/Bash = no-evidence-layer lock + Cowork) · keep pile · observed · **keep — except fix `synthesise.md:3`**, which omits `Task` while Step 4b (SKILL.md:294–341) mandates "Dispatch the `strategist-critic` agent (Task tool)" during that very run. Seam defect, cross-surface X2.
3. **Posture block (advisor / friction half / lane half)** — SKILL.md:29–91. product-method · keep · history-backed (0.2.0; lane half from the Hello Alice run, incl. the documented over-assert→over-stall oscillation at :89–90) · **keep** — this is the product.
4. **Fast calibration rule** — SKILL.md:94–103 ("Update the Working Dynamic after the *first* substantive exchange … Calibration that reacts slowly is its own failure"). product-method · keep · history-backed · **keep**.
5. **Dynamic state preload** — SKILL.md:107 (`` !`cat strategy/STATE.md …` ``). mechanism · keep · observed · **keep**; Step 0 independently reads the file, so nothing depends on it. Whether the `!` preamble executes in Cowork (and without Bash in `allowed-tools`) is unresolved — cross-surface X7.
6. **File primacy** — SKILL.md:120–124, failure row :500. product-method (distrust of compaction, not of capability) · keep · history-backed (`a81291c`; rubric Continuity anchor 3) · **keep** — the guarded failure is environmental and recurs on any model.
7. **Ordering check + staleness semantics** — SKILL.md:129–152 (`stale (premise changed)`, top-down clearing, `complete (on stale inputs)`, `incomplete (advanced by user)`). product-method + external-contract · keep · history-backed (0.4.0/0.4.1 F4–F5) and drift-linter-pinned (`stale_status_vocabulary`, `stale_stages_frontmatter`, `incomplete_advanced_status`) · **keep** — release-blocking vocabulary; any rewrite moves the drift config in the same commit.
8. **Framework menu mandatory + reasoned recommendation + no-framework valve** — SKILL.md:154–172, guardrail 1, failure rows :494/:512. product-method · keep · history-backed (the 0.4.0 valve exists precisely so the menu can't force theater) + eval-encoded (Framework Fit; `framework_in_library` gate) · **keep**.
9. **"One isolated question per turn" + ask-on-its-own-line + reject non-answers + batch-on-signal** — SKILL.md:97–98, 186–193, failure rows :516/:523. product-method · keep · history-backed (0.2.0, from a real run) + eval-encoded (Probing anchors) · **keep** — the batching valve already prevents rigidity.
10. **In-Flight persistence cadence** — SKILL.md:198–204, failure row :509. external-contract (compaction durability; 0.4.1 F6) · keep · history-backed · **keep**; optional intent-forward tightening below (R-SE3).
11. **Analyse ledger** — SKILL.md:206–214, failure row :511. product-method (the evidence standard; "a skipped-because-obvious dimension stops being possible silently") · keep · history-backed · **keep**.
12. **Insight blanket current-state boundary** — SKILL.md:178–183. product-method + external-contract (drift `requiredSections`; mirrored in `reference/insight/README.md`) · keep · history-backed (0.4.0 F3 → 0.4.1 blanket) · **keep**.
13. **Reflect back and confirm before capture** — SKILL.md:218–221. product-method / human gate · keep · observed + eval-encoded · **keep** — consent-before-record makes the brief the user's.
14. **Two-axis claim ownership (origin × standing; degrade, never flatter)** — SKILL.md:231–245, 276–292, failure rows :503–504. product-method · keep · history-backed (0.4.1 F1; old single-axis phrasing is a linter-retired phrase) · **keep verbatim**.
15. **Reader-Brief Style Rules + two-document split** — SKILL.md:247–292, guardrail 6. product-method (locked decision) + external-contract (`content_lint` gate; `reader_brief` config) · keep · history-backed · **keep**, incl. the one deliberate residue exception (0.4.1 F2).
16. **Step 4b commitment gate** (siblings + honest-singleton valve, critic auto-run with the full option set, charter check, kernel check, DECISION.md) — SKILL.md:294–365. product-method + safety-governance, with drift/eval contracts on three edges · keep · history-backed end to end (E2/E3; 0.4.1 F2) · **keep whole** — even "Say it in one natural line" is a Register rule with an example, not a script.
17. **Step 5 Self-Audit (friction + lane/fabrication checks), run silently** — SKILL.md:367–391. product-method · keep · history-backed twice (0.2.1 manufactured-concern failure → the provenance valve; Register rubric scores narrating it 0) · **keep** — independent review of a stochastic pass is not capability distrust.
18. **Done-bar check reading the README block** — SKILL.md:404–415. product-method + external-contract ("The stage is done when" is a drift `requiredSections` marker and exists in all 7 READMEs — verified) · keep · history-backed · **keep** — the heading phrase is load-bearing everywhere.
19. **Advance ordering (status → staleness → Position → Next Action)** — SKILL.md:417–445. product-method + external-contract; the stated reason ("never re-certifies what the run just invalidated") makes the sequence outcome-serving, not chunking · keep · history-backed; `completed_stages_delta` gate parses the result · **keep**.
20. **Step 6 pressure-test offers per `pressure_test` config** — SKILL.md:447–456. user-intent (config contract mirrored in `templates/CLAUDE.md:67–79`) · keep · observed; linter retires the pre-0.4.0 wiring · **keep**.
21. **Transition box template** — SKILL.md:458–469. product-method (one canonical handoff across 7 stages) · keep, borderline · observed only (nothing downstream checks the literal box) · **keep**; normative-vs-illustrative status is under-specified (Q3).
22. **Guardrails 1–7** — SKILL.md:471–488. product-method restated; guardrail 3 is also the `single_stage_advance` gate · keep · observed · **keep**.
23. **Common Failure Modes table** — SKILL.md:490–524. product-method / history ledger · keep · history-backed (nearly every row traces to a documented failure) · **keep** — it functions as the skill's regression index; per the no-holistic-compression house rule, don't dedupe. Seam: rows cite step numbers — any renumbering sweeps the table.
24. **The 7 wrapper family** — `commands/strategist/{define,frame,analyse,insight,synthesise,story,move}.md`. product-method (one-engine architecture) · keep · observed · **keep** — except the "exactly" adverb (cross-surface X3) and the `story.md:14–17` mirror of the reader-brief birth, which must move with Step 4.

### Proposed rewrites (paste-ready)

- **R-SE1** — delete `model: opus` from `skills/strategist-stage/SKILL.md:5` (see X1).
- **R-SE2** — `commands/strategist/synthesise.md:3`:
  ```
  allowed-tools: Read, Write, Edit, Glob, Grep, Task
  ```
- **R-SE3 (optional, behavior-neutral)** — SKILL.md:198–199, state the durability contract first:
  ```
  5. **Persist as you go.** `## In-Flight (mid-stage)` in STATE.md must stay current enough
     that a stop at any moment — auto-compaction, a closed laptop — is recoverable from the
     file alone; in practice that means silently refreshing it after each substantive
     answer:
  ```

### Still under-specified

1. Is the opus/sonnet pin tiering a deliberate quality floor or an unexamined scaffold default? Nothing in CHANGELOG, AGENTS.md, or locked decisions records it. (X1)
2. Does the `` !`cat` `` preamble execute in Cowork, and does it need Bash in `allowed-tools`? (X7)
3. Is the Step 6 transition box a verbatim rendering contract or an illustration of required content?
4. Is "every few turns at the very most" the In-Flight contract, or is "recoverable at any stop" the contract with cadence as guidance (R-SE3)?

---

## Surface: init (`strategist-init` + init command + `templates/CLAUDE.md` + hooks) — audited at df7f0c0

**Surface verdict:** overwhelmingly method and contract — the scaffolded schemas are linter-pinned and parsed by stage/resume/progress — with one capability cut (the model pin), one trust-hedge rewrite in the wrapper, and one genuine gap (`no_em_dashes` has no reader).

### Findings

1. **`model: opus`** — `skills/strategist-init/SKILL.md:5`. capability-workaround · cut · history-backed (since `3ccf8fa`; researcher v1.9.0 removed the identical pin from research-init) · **cut** (X1).
2. **`disable-model-invocation: true`** — SKILL.md:4. safety-governance · keep · observed · **keep** — explicit user invocation for a skill that writes into the project root.
3. **"This skill does not start the loop — that's `/strategist:define`"** — SKILL.md:14–15, guardrail 2 (:279). product-method · keep · observed · **keep** — scope boundary, *more* needed on a more helpful model.
4. **Cowork Write-only rule** ("Do not use shell (`mkdir`, `cp`, `touch`)") — SKILL.md:17–19, guardrail 3, failure row. external-contract (Cowork surface limitation, AGENTS.md:106–107) · keep · observed · **keep** — the canonical looks-like-a-workaround-is-a-platform-contract case.
5. **Step 0 fresh-project guard** ("If it exists: stop … Do not overwrite anything.") — SKILL.md:21–30, guardrail 1. safety-governance · keep · observed · **keep** — irreversibility rail; the refusal message doubles as the one-project-one-strategy doctrine.
6. **Charter capture in one compact prompt, partial answers accepted, one follow-up max** — SKILL.md:43–56. product-method · keep · history-backed (0.4.0 decision E3) · **keep** — intake UX, not chunking.
7. **"Captured so it gets read, not filed" + narration restraint** — SKILL.md:57–60. product-method + voice · keep · observed (drift contract `charter_read_by_gate`) · **keep**.
8. **Relative→absolute dates before writing** — SKILL.md:62, guardrail 4. user-intent · keep · observed · **keep**.
9. **Non-Strategist CLAUDE.md fallback → `strategy/strategist-config.md`** — SKILL.md:71–74. external-contract (read by stage :113 and resume :30) · keep · observed · **keep**.
10. **The "use this exact structure" template family** — CHARTER (SKILL.md:80–97), STATE (:99–193), brief (:195–227). external-contract · keep · observed · **keep, all of it** — the drift config pins five section markers and six vocabulary tokens *in this file*; resume migrates against this template; progress parses it; the stage engine appends into it. "Exact" is the correct word here, not a rigid-template tell.
11. **Stage Record legend prose** (status distinctions; "recorded, never argued") — SKILL.md:127–134. product-method · keep · history-backed (record-never-restrict) · **keep**.
12. **Step 4 settings pre-allow** (merge, don't overwrite; Cowork no-op) — SKILL.md:229–243. external-contract (harness permissions) · keep · observed · **keep**. Note: the pre-allow list includes `Task` for the engine's critic dispatch — a cross-surface dependency.
13. **Step 5 orientation + posture contract up front** — SKILL.md:247–273. product-method · keep · history-backed · **keep**.
14. **Guardrails + failure-modes table** — SKILL.md:276–293. product-method (house convention; researcher pass kept the same tables) · keep · history-backed · **keep**.
15. **`allowed-tools: Read, Write, Edit, Glob, Grep`** — `commands/strategist/init.md:3`. safety-governance (least privilege; no Bash per finding 4) · keep · observed · **keep**.
16. **"follow its steps exactly"** — init.md:8. capability-workaround (trust hedge) · cut pile · inferred · **rewrite as intent** (X3; R-IN2 below also fixes the wrapper's inaccurate "copies … into the project root" and omitted CHARTER.md).
17. **"Do not bypass that guard"** — init.md:12–13. safety-governance · keep · observed · **keep** — defense in depth at the dispatch layer for a destructive-adjacent step.
18. **templates/CLAUDE.md as deployed instruction surface** — live-config contract (:3–6), one-project-one-strategy (:8–9), two-document + STATE/CHARTER description (:38–51), `depth`/`pressure_test` semantics incl. never-blocks (:55–79). product-method / external-contract · keep · history-backed · **keep** — matches the locked decisions and the engine's actual reads.
19. **`no_em_dashes`** — templates/CLAUDE.md:84–90 ("set this and generated content will avoid them"). product-method in intent, **unresolved in wiring** · inferred · **keep the field, fix the seam** — grep finds zero consumers; the engine's config read (stage SKILL.md:113–114) enumerates only problem/`depth`/`pressure_test`. A promise the plugin doesn't keep (X5).
20. **PreCompact hook** — `hooks/hooks.json` + `state-staleness-check.sh`. safety-governance / mechanism · keep · observed · **keep** — warns (never blocks) when brief.md outruns STATE.md pre-compaction; complements, not obsoleted by, 0.4.1 F6; portable stat; the header comment documents the no-outputs-gate lock at the point of temptation.

### Proposed rewrites (paste-ready)

- **R-IN1** — delete `model: opus` from `skills/strategist-init/SKILL.md` frontmatter (X1).
- **R-IN2** — `commands/strategist/init.md:8` ff.:
  ```markdown
  Use the `strategist-init` skill. It scaffolds `strategy/` (`STATE.md`, `brief.md`,
  `CHARTER.md`), installs the deployment config from `templates/CLAUDE.md` into the
  project root (helping the user fill the problem statement), and sets up the
  seven-stage loop. The file schemas it writes are contracts read by the other
  skills — scaffold them as the skill specifies.
  ```

### Still under-specified

1. `no_em_dashes` has no reader — wire it into the engine's config read, or drop the field. (X5)
2. Charter has no staleness/migration story — STATE has `stale (premise changed)`; CHARTER has no vocabulary for superseded entries when Define materially rewrites the decision.
3. Step 4 merge semantics when `.claude/settings.json` exists but is malformed or has a conflicting `deny` list — one line of intent ("never clobber user permission config") would cover it.

---

## Surface: framework (`strategist-framework` + framework command + reference index/meta + `frameworks/`) — audited at df7f0c0

**Surface verdict:** predominantly intent and healthy contract; cuts are one model pin, one unreferenced inventory fossil, and a pre-0.4.0 schema enumeration that drifted behind the library it describes. This skill is frozen at 0.3.0 (git) while the engine moved through 0.4.x.

### Findings

1. **`model: sonnet`** — `skills/strategist-framework/SKILL.md:5`. capability-workaround · cut · observed (no recorded rationale; untouched since `5c8411b`) · **cut** (X1) — a cost-tier guess frozen into frontmatter; if tiering is deliberate it belongs in a documented convention, not a silent pin.
2. **`allowed-tools: Read, Write, Edit, Glob, Grep`** — SKILL.md:4 + `commands/strategist/framework.md:3`. safety-governance / product-method (Cowork-safe; library-boundedness) · keep · observed · **keep**.
3. **Slug→title→`aka` resolution order** — SKILL.md:19–20. product-method · keep pile · observed · **rewrite as intent (data-location fix)** — the instruction points resolution at INDEX.md, but `aka` lives only in per-entry frontmatter (e.g. `reference/synthesise/eisenhower.md:7`); INDEX has no aka column, so alias matching silently fails as written.
4. **No-argument / no-match / multi-match behavior** ("Don't dump all 70"; "Never invent a framework that isn't in the library"; disambiguate) — SKILL.md:21–27. user-intent / product-method · keep · observed · **keep**. Note: the hard-coded "70" recurs in four files (X11).
5. **Entry-schema enumeration** ("It contains: What It Is, Why It Works, …") — SKILL.md:31–33. capability-workaround (stale schema recitation) · cut pile · history-backed (predates the 0.4.x **Stage Boundary** sections; drift config pins five of them) · **rewrite as intent** — a model told "the entry contains these seven sections" has textual license to treat Stage Boundary as noise; the standalone path never learned what the engine honors at SKILL.md:178.
6. **"one step at a time" apply pacing** — SKILL.md:42–44. product-method with drift · keep pile · observed · **rewrite as intent** — a blunter mirror of the engine's calibrated rule ("one isolated question per turn … only batch when the user signals"), which lost the valve in restatement.
7. **"The entry's Worked Example sets the concreteness bar."** — SKILL.md:44–45. product-method · keep · observed (mirrored intact in the engine :177/:476/:495) · **keep** — the surface's load-bearing quality bar, no drift.
8. **Write-consent** ("Only write if the user says yes… no project → present in conversation") — SKILL.md:49–52, guardrail 4. safety-governance · keep · observed · **keep**.
9. **Guardrails 1–3** (no invention; disambiguate; applying ≠ reciting) — SKILL.md:55–61. user-intent · keep · observed · **keep**.
10. **`commands/strategist/framework.md`** — thin-wrapper convention · keep · observed · **keep** (already says "follow its steps" without "exactly").
11. **`reference/INDEX.md` 70-row table** — external-contract · keep · observed (row count verified) · **keep**; notes: mid-word "…"-truncated summaries (generation artifact), no aka column (finding 3), duplicate slug `driver-tree` handled by the skill's Step 1.5.
12. **`reference/README.md:53` canon note** ("verify they still match canon") — safety-governance (maintainer-facing) · keep · history-backed · **keep, minor rewrite optional** — written before the check was automated; pointing at the release-blocking lint stops hand-verification. README:27's fixed section list shares finding 5's staleness at lower stakes.
13. **`reference/_inventory.json`** — capability-workaround (build fossil) · cut pile · observed + history-backed (zero references repo-wide; only ever touched in the two bulk library commits) · **cut (delete) or move to mechanism** — either remove it, or wire the drift lint to check INDEX completeness against it (nothing currently verifies INDEX rows match the entry files).
14. **`reference/frameworks/` canon copies** (4 docs + README) — external-contract · keep · observed · **keep byte-for-byte** — pure doctrine prose, zero model-execution instructions; any change lands in canon first (release-blocking byte-diff lint).
15. **Dangling sibling links in `creating-conditions.md:61–71`** — four of six referenced docs don't ship in the plugin. external-contract defect · observed · **APPLIED 2026-08-06** — a paragraph in `frameworks/README.md` now records which derivations ship and why the rest don't. Correction to this finding's original paste-ready line, which inverted the count: only **two** of the six named derivations ship (Metaskills, Learning and Teaching); Organic Systems, Legible and Memorable, Durable AI Practice, and Minimum Lovable Products do not. `creating-conditions.md` itself is untouched — it's a `canonPairs` entry under the byte-diff lint, so any change to it lands in canon first. The references are backticked path strings, not markdown links, so nothing rendered as a dead link. Also: `metaskills.md:4` carries a `canonical:` URL the other three lack (canon-owned inconsistency, informational).

### Proposed rewrites (paste-ready)

- **R-FW1** — delete `model: sonnet` from `skills/strategist-framework/SKILL.md` frontmatter (X1).
- **R-FW2** — SKILL.md Step 1, point 2:
  ```markdown
  2. Read `${CLAUDE_PLUGIN_ROOT}/reference/INDEX.md` — it maps every slug, title, and
     path. Match the argument against slug first, then title (case-insensitive, tolerant
     of spaces/punctuation: "bull and bear" → `bull-and-bear`). If neither matches,
     check aliases: each entry's frontmatter carries an `aka` list — grep
     `${CLAUDE_PLUGIN_ROOT}/reference/` for the phrase before declaring no match.
  ```
- **R-FW3** — SKILL.md Step 2, replace the schema recitation:
  ```markdown
  ## Step 2: Load the entry

  Read the resolved file `${CLAUDE_PLUGIN_ROOT}/reference/<stage>/<slug>.md` in full and
  use everything it carries. If the entry has a **Stage Boundary** section, it is binding:
  apply the framework in the form that section prescribes.
  ```
- **R-FW4** — SKILL.md Step 3, Apply bullet, align pacing with the engine:
  ```markdown
  - **Apply:** walk them through the framework's How To Use It steps against their actual
    situation, the way the stage engine does — one isolated question per turn, stated
    plainly on its own line, batching only when the user asks for it — and produce a
    concrete, filled-in result. The entry's Worked Example sets the concreteness bar.
  ```
- **R-FW5** — `reference/README.md:53`:
  ```markdown
  These are copies of canonical documents maintained outside the plugin. Sync is
  machine-checked and release-blocking (`node dev/scripts/lint-doctrine-drift.mjs
  --plugin strategist`); change the canon, then re-copy — never edit these in place.
  ```
- **R-FW6** — `_inventory.json`: delete, or wire as the INDEX-completeness checker in `drift-configs/strategist.json`. Owner's call.

### Still under-specified

1. **Capture path vs. state model:** a framework applied standalone during an active project writes into `brief.md` invisibly to the 0.4.x state machinery (no Stage Record note, no In-Flight refresh, no staleness interaction). One sentence deciding whether this write updates the Stage Record Notes column — or is explicitly exempt — is needed.
2. **INDEX integrity is unverified** — nothing checks the 70 rows against the entry files (candidate: R-FW6's mechanism path).
3. **The Insight blanket rule doesn't reach standalone use** — R-FW3 covers entries that state a boundary; the engine's blanket current-state-only rule for *unstated* Insight entries remains engine-only. Probably acceptable standalone (no stage context), but it deserves an explicit decision.
4. The count "70" lives in four files with no single source (X11).

---

## Surface: pressure-test (skill + command + `strategist-critic` agent) — audited at df7f0c0

**Surface verdict:** almost entirely intent and history-backed method — the two `model: opus` pins (both v0.1.0 carry-overs) are the only clear capability cuts, plus one stale enumeration in the wrapper and one persona incantation in the critic; the restraint scaffolding and the tool restriction stay.

### Findings

1. **`model: opus`** — `skills/strategist-pressure-test/SKILL.md:5`. capability-workaround · cut · history-backed (initial commit; five releases of silence) · **cut** (X1).
2. **`model: opus`** — `agents/strategist-critic.md:24`. capability-workaround · cut · history-backed · **cut** (X1) — the purest form of the tell; the method is *independent review*, which survives on any model. Eval encodes no model dependency; `adv-sound-strategy` / `adv-planted-contradiction` are the regression net.
3. **Critic `tools: Read, Grep, Glob`** — strategist-critic.md:26–29. external-contract + safety-governance · keep · observed + locked (logic-not-evidence) · **keep** — no-web *enforces* the locked scope in execution settings; no Write/Edit enforces "the critic interrogates; the user decides." The model case of a tool restriction that is intent.
4. **Skill `allowed-tools: … Task`** — SKILL.md:4, mirrored in the wrapper. product-method · keep · observed · **keep** (see U1/X7 on the `` !`cat` `` line).
5. **Restraint scaffolding family** — "This check is narrow. Before flagging, confirm both…" (critic :93–95), "What Is Not A Finding" (:117–136), "restraint is what makes your alarms credible" (:119, :160), plus skill :54–57 and guardrail 2 (:80–81). product-method · keep · **history-backed** (0.2.1: the critic actually over-fired — labeled a user's own $80k budget a fabricated premise — fix verified 3/3 on eval without losing edge) · **keep all of it** — a documented behavioral failure of *this method* on a capable model, corrected and eval-pinned; repetition is reinforcement, and the no-holistic-compression rule applies.
6. **8-check taxonomy + per-check Flag templates + Output Format** — critic :47–115, 148–160; consumed by skill Step 2 (:39–42) and engine Step 4b.2. product-method + external-contract · keep · history-backed (checks 7–8 added 0.2.0; AGENTS.md calls them load-bearing) · **keep** — the cross-surface finding format, not a rigid template.
7. **`clear / open (n) / declined` vocabulary + Open Findings write** — SKILL.md:60–66. external-contract · keep · observed (drift contracts `open_n_pressure_vocabulary`, `declined_pressure_test_vocabulary` name this file; the old binary vocabulary is a retired phrase) · **keep verbatim**.
8. **Human gates** — "Do not edit brief.md" / "record them and hand back" / non-blocking relay — SKILL.md:68–74, guardrail 3. user-intent + product-method · keep · history-backed · **keep**.
9. **Stale enumeration in the wrapper** — `commands/strategist/pressure-test.md:10–11` carries v0.1.0's original five-check list, missing the two 0.2.0 load-bearing checks and internal contradictions. capability-workaround (fossil) · rewrite pile · history-backed · **rewrite** — thin wrappers shouldn't duplicate a taxonomy that lives in two maintained files (R-PT3).
10. **Persona incantation** — critic :34 "You are a seasoned strategist…". mixed: role boundary is product-method; "seasoned" is a capability incantation · rewrite pile · inferred (researcher v1.9.0 precedent: persona line → role definition) · **rewrite as intent, light** (R-PT4).
11. **Dispatch-contract duplication in skill Step 2** (:39–42 re-enumerates the 8 types). external-contract · keep · observed (correctly maintained through 0.4.x; serves the paste-a-strategy-inline path) · **keep** — the drift actually happened in the wrapper (finding 9), not here.
12. **Example affirmation phrasings** — SKILL.md:54–57. product-method · keep · history-backed (0.2.1's user-facing half) · **keep** — offered as alternatives, not a script.
13. **`color: red`** (critic :25) — cosmetic mechanism · keep · observed · **keep**.
14. **Skill orientation parenthetical on the Step 4b auto-run relationship** — SKILL.md:15–17. product-method (seam documentation) · keep · observed · **keep** — both paths write the same STATE.md section; the distinction prevents confusion.

### Proposed rewrites (paste-ready)

- **R-PT1** — delete `model: opus` from `skills/strategist-pressure-test/SKILL.md` frontmatter (X1).
- **R-PT2** — delete line 24 (`model: opus`) from `agents/strategist-critic.md`, keeping `color:` and `tools:` unchanged (X1).
- **R-PT3** — `commands/strategist/pressure-test.md` body:
  ```markdown
  Pressure-test the current strategy.

  Use the `strategist-pressure-test` skill and follow its steps. It reads the working
  brief (or a specific stage you name) and dispatches the `strategist-critic` agent to
  stress-test the reasoning — the full check set, from unstated assumptions and
  cross-stage contradictions to premises the agent inferred rather than you stated —
  and returns the findings for you to address.

  It interrogates the strategy; it does not rewrite it. Acting on the findings is your
  call, made back in the relevant stage.
  ```
- **R-PT4** — critic :34–35:
  ```markdown
  You review another strategist's thinking. You do not build the strategy — you attack
  it, so its weak points surface here rather than in the market.
  ```

### Still under-specified

1. **U1 / X7:** does the `` !`cat` `` preamble (SKILL.md:21) execute without Bash in `allowed-tools`, and in Cowork? Plugin-wide question; one live check settles it.
2. **Inline-pasted-strategy path has no recording story** — Step 1.1 allows testing with no `strategy/STATE.md`; Step 4 then has nowhere to write and doesn't say to skip the write.
3. **Under-passed dispatch** — the critic has Read/Grep/Glob but no stated purpose for them when the passed excerpt is thin (insurance without instruction; fine, but unstated).
4. The on-demand skill does **not** pass the alternative set the way the gate does (it predates 0.4.1 F2's gate-transparency fix) — defensible outside the gate, worth one line if revised.

---

## Surface: session management (progress / save / resume) — audited at df7f0c0

**Surface verdict:** nearly all intent and pinned method — capability material is limited to the three model pins, two "exactly" adverbs, and one missing stop-condition in save; the state vocabulary, additive-only migration, and narration firewalls are load-bearing contracts.

### Findings

1. **Model pins** — `strategist-progress/SKILL.md:5` (sonnet), `strategist-save/SKILL.md:5` (opus), `strategist-resume/SKILL.md:5` (opus). capability-workaround · cut · unresolved-provenance (no release ever records a model decision) · **cut** (X1).
2. **"follow its steps exactly"** — `commands/strategist/save.md:8`, `resume.md:8` (progress.md:8 already omits "exactly"). capability-workaround (compliance adverb) · cut pile · observed · **rewrite as intent** (X3).
3. **Progress read-only scope, stated three ways** — prose (:10, :88) + `allowed-tools: Read, Glob, Grep` (:4). user-intent enforced by mechanism · keep · observed + history-backed · **keep** — triple-statement lives where each reader needs it.
4. **File-primacy / anti-contamination family** — progress :12–14, save :70–71, resume :32–35 ("Files are trusted; chat memory is not… a new hypothesis to verify, not a fact to build on"). product-method (correctness rule) · keep · history-backed (`a81291c`; 0.4.0) · **keep** — defines what counts as truth, not how carefully to read.
5. **Narration firewalls** — save :18–21, :63; resume :14–17, :47 ("The section names in this skill are for you, not for the user"). user-intent (voice/UX) · keep · history-backed · **keep** — the firewall is the product experience.
6. **STATE.md vocabulary as read/write contract** — reader side progress :35–45, resume :46, :66–70; writer side save Parts 1–2 (:29–57). external-contract · keep · history-backed + machine-pinned (four drift contracts name these files) · **keep, labeled contract**.
7. **Additive-only schema migration** — resume :39–47 ("ADD it, empty… Never remove, rename, or rewrite existing content"). product-method / external-contract (backward compatibility) · keep · history-backed · **keep**; one nit — the parenthetical section enumeration at :43–44 is an unpinned duplicate of init's template → **rewrite** (R-SM4).
8. **Read-tool-before-edit parentheticals** — save :28, resume :27–28. external-contract (harness: Edit requires an in-session Read; the `` !`cat` `` injection doesn't count) · keep · observed · **keep** — looks like a re-read ritual, is a real tool contract with the reason stated.
9. **Health-check enumeration + "N/4 checks"** — progress :29–31, :57–59. product-method (shipped dashboard feature) · keep · history-backed (0.1.0) · **keep**; the hardcoded stage list is a third copy of the spine (X11).
10. **Dashboard output template** — progress :56–77. product-method (stable report shape; carries 0.4.1 contract lines — Stale stages, Unmet done-bars) · keep · history-backed · **keep** — conditional lines show it's judgment-aware, not rigid.
11. **"Don't use gate language for a gate that doesn't exist"** — progress :84–87. product-method (record-never-restrict) · keep · history-backed (linter retires the old "blocker" vocab) · **keep**.
12. **Save persona framing + debrief honesty** — save :10–12 ("the drive back from the client's office"), :73–74 ("Write the debrief honestly. The user never sees it"). user-intent (defines the artifact and its evidence standard) · keep · history-backed · **keep** — changes the output's nature, not an incantation.
13. **In-Flight division of labor** — save :34–37 (curate, don't append; clear on completion). product-method / external-contract (0.4.1 F6 seam; agrees with engine Step 3.5 / Step 5) · keep · history-backed · **keep**.
14. **Append-only with named exceptions** — save :67–69. product-method (data integrity; the rewritten sections are exactly what resume re-adopts) · keep · observed · **keep**.
15. **ISO dates; relative→absolute** — save :72. product-method · keep · observed · **keep**.
16. **Resume stance-restoration prose** — resume :51–53 (calibration governs "from your very first response"), :57–58 ("the same strategist and not a stranger with the same files"), :60–61 ("never re-ask"), :64–65. user-intent · keep · history-backed · **keep** — behavior-defining, not execution-hedging.
17. **Spoken-delivery briefing spec** — resume :74–75 + coverage bullets. user-intent (voice) + product-method · keep · history-backed · **keep**.
18. **7-day staleness question** — resume :84–86. product-method with a numeric heuristic · keep (borderline) · inferred · **keep** — the rationale clause carries the intent; optional intent-forward form in R-SM5.
19. **Wait-for-confirmation** — resume :89–90 ("Do not start working until the user confirms"). user-intent (session control; resume is a briefing, not an auto-continue) · keep · inferred-consistent · **keep** — not a forced check-in because the outcome it serves is stated.
20. **Scope boundary restated at resume** — resume :97–99 (progress = read-only dashboard; resume = working resume). user-intent · keep · history-backed · **keep**.
21. **Save has no explicit missing-STATE stop** — the injected preamble carries the message (save :24) but no step says stop; progress and resume both have one. Gap · **rewrite as intent** (R-SM3).

### Proposed rewrites (paste-ready)

- **R-SM1** — delete the `model:` line from all three skills' frontmatter (X1).
- **R-SM2** — `commands/strategist/save.md:8` and `resume.md:8`: drop "exactly" —
  ```
  Use the `strategist-save` skill and follow its steps. It updates
  ```
  ```
  Use the `strategist-resume` skill and follow its steps. It rebuilds the working
  ```
- **R-SM3** — insert as the first line of save Part 1:
  ```
  If `strategy/STATE.md` does not exist, there is nothing to save — say so, point to
  `/strategist:init`, and stop.
  ```
- **R-SM4** — resume Step 2 (:42–46), drop the unpinned duplicate enumeration, keep init as the single schema authority (retaining the linter-pinned `Notes` / `stale_stages` specifics):
  ```
  STATE.md against the template structure in the `strategist-init` skill: any section the
  template defines that the project file lacks — ADD it, empty, with its template
  guidance, in the template's position. If the Stage Record lacks the `Notes` column,
  extend the table with empty cells; if the frontmatter lacks `stale_stages`, add it as
  `[]`. Never remove, rename, or rewrite existing content.
  ```
- **R-SM5 (optional)** — resume Step 4 staleness question, intent-forward:
  ```
  If meaningful time has passed since the last session (a week or more), ask whether
  anything changed in the problem since — a moved premise is cheaper to catch now than at
  Synthesise.
  ```

### Still under-specified

1. Model-pin tiering intent (X1) — owner call before R-SM1 lands.
2. Resume Step 2 never gives the template's path (`${CLAUDE_PLUGIN_ROOT}/skills/strategist-init/SKILL.md`) — one clause removes the only search step in a silent phase.
3. Save-after-engine-Step-5 overlap: when save runs right after a stage completed, Part 1 re-updates blocks the engine just wrote — idempotent today, but "verify, don't re-derive" is unstated.

---

## Surface: reference library (7 stage dirs, ~70 entries + stage READMEs) — audited at df7f0c0

**Surface verdict:** clean within the sweep's stated coverage (all READMEs + 21 entries read fully; ~42 entries grep-swept with full-population structural checks) — zero capability workarounds; every constraint-shaped sentence traces to the framework's own method or documented stage-gating doctrine.

### Findings

1. **No model-constraining instructions anywhere in the library.** Two orthogonal sweeps (~70 constraint-pattern hits, all framework content addressed to the human strategist — e.g. `analyse/comparison.md:61` "Always start at zero" is chart-axis honesty; `story/minto-pyramid.md:35` "Never defer the answer" is Minto's own doctrine); no per-entry output templates, re-reads, chunking, check-in rituals, or "present options, don't decide" hedges. product-method · keep · observed · **keep**.
2. **Stage Boundary family** — blanket rule at `insight/README.md:21`; own sections in 8 entries (`3x3-model.md:71`, `continuum.md:64`, `capability-map.md:76`, `gantt.md:65`, `one-pager.md:62`, `from-to.md:65`, `horizon.md:72`, `chevron.md:78`). These *do* direct the executing model's timing, but they encode the perceive-before-decide spine (0.4.0 F3 → 0.4.1 blanket) and the engine honors them explicitly. product-method · keep · history-backed · **keep verbatim**.
3. **"How it runs" wiring sentences** — mechanism descriptions living in reference docs; correct today (`synthesise/README.md:45` auto-run matches the engine — this exact line is the one 0.4.1 repaired; `move/README.md:41` offer matches Step 6), but the class already burned once, and `analyse/README.md` omits the engine's Analyse-stage offer. external-contract · keep · observed + history-backed · **keep, with one optional rewrite** (R-RL1) — and the normative-vs-descriptive question below.
4. **"The stage is done when" blocks** — exactly one per README; the engine reads them as the completion contract. external-contract · keep · observed · **keep** — the heading phrase is load-bearing; renaming it in any README silently breaks Step 5.
5. **Frontmatter namespace** — full-population check: all 70 entries match `strategist:reference/<stage>/<slug>`. external-contract · observed · **keep** (zero violations).
6. **Structural bar consistent; "diagram" in AGENTS.md is a fossil** — all 70 entries carry the six standard sections; no diagrams exist anywhere (removed 0.3.0), yet `AGENTS.md:168–169` still says "adding a framework is an entry + diagram + index update." external-contract gone stale (evidence doc) · history-backed · **rewrite as intent in AGENTS.md** (X8; AGENTS.md is evidence, not an audited target — flagged for the maintainer).
7. **Cosmetic (grouped, no action):** mixed relative-link styles (`define/scq.md:88` vs `define/htdq.md:60`); empty `source: ""` frontmatter in several entries (`frame/bucketing.md`, `analyse/waterfall.md`, `move/execution-plan.md`). **keep**.

### Proposed rewrites (paste-ready)

- **R-RL1 (optional)** — `reference/analyse/README.md`, "How it runs" step 3, append:
  ```
  This is a high-stakes stage where `/strategist:pressure-test` is offered before moving on.
  ```
  (Mirrors `move/README.md:41`; matches engine Step 6. If taken, extend the drift-lint config per AGENTS.md convention.)
- **R-RL2** — AGENTS.md:168–169: "adding a framework is an entry (the six standard sections) + index update, no skill change." (Owner's call; evidence doc.)

### Still under-specified

1. Are the READMEs' "How it runs" lists *normative* (lintable contract — how 0.4.1 treated Synthesise's) or *descriptive* (allowed to summarize)? If normative, the drift config should cover all seven READMEs' wiring sentences; today it doesn't.
2. Is the missing Analyse-offer line quiet-by-design or an omission? Ruled omission (inferred); owner may disagree.

### Coverage note

Read fully (28): all 7 READMEs; define: scq, htdq, outcome; frame: driver-tree, bucketing, hypothesis; analyse: 5-whys, waterfall, trend; insight: matrix, from-to, graph; synthesise: bezos, spade, evaluation; story: minto-pyramid, scqa, mece; move: execution-plan, comms-deploy, zero-to-one. Section-read (7): the Stage Boundary entries. Grep-swept with all hits reviewed + full-population structural checks: the remaining ~42 (listed in the audit transcript). Uncovered: none, at the stated sweep depth.

---

## Cross-surface findings (integration pass)

**X1 — The model-pin family (the audit's one systemic capability cut).**
Eight pins: `opus` on `strategist-stage:5`, `strategist-init:5`, `strategist-save:5`, `strategist-resume:5`, `strategist-pressure-test:5`, `agents/strategist-critic.md:24`; `sonnet` on `strategist-framework:5`, `strategist-progress:5`. All six auditors converged: capability-workaround, cut. Evidence: history-backed — present since v0.1.0/0.3.0 scaffolds; no CHANGELOG entry, locked decision, or AGENTS.md line ever records a model choice; they were carried, not chosen. Direct precedent: researcher v1.9.0 (`84aa8cb`, "the headroom release") removed all 12 pins plugin-wide by explicit author decision. Open question the stage auditor rightly held: is sonnet-on-cheap / opus-on-judgment a deliberate tier? Undocumented anywhere — and the researcher pass removed even the downgrade pins. **Ruling: cut all eight (surfaces inherit the session model), pending the owner's confirmation that no deliberate tiering exists.** The eval pack is the regression net; the critic cut is specifically covered by `adv-sound-strategy` / `adv-planted-contradiction`.

**X2 — Synthesise wrapper cannot dispatch the critic its engine mandates.**
`commands/strategist/synthesise.md:3` omits `Task`; engine Step 4b.2 (SKILL.md:315) mandates "Dispatch the `strategist-critic` agent (Task tool)" during the synthesise run — the auto-run the CHANGELOG says "earns the marketing copy" (0.4.0 E2). `pressure-test.md` carries `Task`; only synthesise needs the same. Independently verified by the orchestrator. external-contract defect (execution settings capping the method) · observed · **fix: R-SE2.** Note the same seam is why init's settings pre-allow includes `Task` — the two must stay consistent.

**X3 — The "follow its steps exactly" adverb family (10 wrappers), reconciled.**
`define/frame/analyse/insight/synthesise/story/move/init/resume/save.md:8` all carry "follow its steps exactly"; `framework/pressure-test/progress.md:8` already say "follow its steps." The stage auditor ruled its seven keeps ("delegation-of-authority clause"); the init and session auditors ruled their three cuts (compliance adverb). Integration ruling: **the delegation is the architecture and stays; the adverb is a trust hedge aimed at the model's execution and goes — family-wide, all ten files, one commit** (the single-siting of posture changes comes from delegating to the skill, not from the word "exactly"; the three wrappers that never had it lost nothing). capability-workaround · observed · rewrite as intent. Stage-auditor dissent recorded.

**X4 — `strategist-framework` is frozen at 0.3.0 while the engine moved through 0.4.x.**
Two live drifts: the entry-schema recitation predates Stage Boundary sections (framework finding 5 / R-FW3), and the apply-pacing mirror lost the engine's batching valve (finding 6 / R-FW4). The skill explicitly delegates its posture to "the way the stage engine does" (SKILL.md:43) — any engine Step 3 rewrite propagates here by reference. **Rule: R-FW3 + R-FW4 land together with any engine pacing change, one commit.**

**X5 — `no_em_dashes`: a shipped promise with no reader.**
`templates/CLAUDE.md:84–90` promises "generated content will avoid them"; zero consumers exist, and the engine's config read (stage SKILL.md:113–114) enumerates only problem / `depth` / `pressure_test`, so a session following that enumeration never honors it. Present since v0.1.0; never had a reader. **Fix belongs in the engine's config read (include output-style fields) or the field is dropped — owner's call.** (Also a voice rule the author demonstrably cares about.)

**X6 — Drift-linter and verification coverage asymmetries.**
(a) `strategist-save` writes the Stage Record and Open Findings but appears in none of the linter's vocabulary contracts — today it passes because it avoids naming statuses; that's luck, not a guard. (b) The READMEs' "How it runs" wiring sentences are unlinted despite 0.4.1 having repaired exactly that class (reference finding 3). (c) Nothing verifies INDEX.md's 70 rows against the entry files; `_inventory.json` could become that checker or be deleted (R-FW6). **These are move-to-mechanism candidates: extend `drift-configs/strategist.json` rather than adding prose.**

**X7 — The `` !`cat` `` preamble question (plugin-wide, unresolved).**
Five skills carry `` !`cat strategy/STATE.md …` `` dynamic-context lines while none allow Bash in `allowed-tools`, and the plugin treats Cowork as no-shell. Whether the preamble executes in each harness — and needs an allowlisted Bash pattern — could not be resolved from the repo. Every dependent skill also reads the file explicitly, so nothing breaks either way; but if the line is dead text in Cowork, it's noise the model reads literally. **One live check (Claude Code + Cowork) settles it; until then: unresolved, no ruling.**

**Deferred by the owner, 2026-08-06.** No check run, no ruling, no edit. The five `` !`cat` `` lines stay as-is through this apply pass. Nothing else in the pass depends on the answer: every dependent skill reads STATE.md explicitly, so the preamble is redundant-if-live and noise-if-dead either way. Picking this back up needs only the live check.

**X8 — Evidence-doc staleness (noted, not audited).**
`strategist/AGENTS.md:168–169` still names a "diagram" step removed in 0.3.0 (R-RL2). AGENTS.md's "adding or renaming a stage = a command wrapper + a reference dir" understates the blast radius — `strategist-progress` hardcodes the seven stage names twice (:30–31, :69) alongside the engine's table.

**X9 — Wrapper-enumeration fossils are a class.**
The pressure-test wrapper carries v0.1.0's five-check list (missing the two load-bearing 0.2.0 checks); the init wrapper simplifies inaccurately ("copies templates/CLAUDE.md", omits CHARTER.md). Same lesson both times: **thin wrappers should describe the delegation, not duplicate taxonomies maintained elsewhere** (R-PT3, R-IN2).

**X10 — Maintenance hazards (no ruling, recorded):** the count "70" lives in four files (framework SKILL description, INDEX.md:3, reference/README.md:42, AGENTS.md:14); the spine stage-list is triplicated (engine table, progress ×2); the failure-mode table cites step numbers that any renumbering must sweep; `story.md:14–17` mirrors the engine's reader-brief birth.

**X11 — Contradictions between surfaces: none found** beyond the X3 dissent. The In-Flight loop (engine Step 3.5 / save curate / engine Step 5 clear / resume continue) is coherent across four files; the gate contract (engine Step 4b ↔ pressure-test skill ↔ critic format ↔ templates/CLAUDE.md:73–75) holds; `templates/CLAUDE.md` carries current stage names.

---

## Disposition

Reviewed by the author 2026-08-06. Every proposed rewrite was put as a numbered decision; the
author's instruction was to take the recommendation on each and surface only what genuinely
needed an owner call. The ledger below is the record of that review.

### Accepted — approved, not yet applied

All 26 decisions are approved on the recommendation stated for each. None has been written into
the plugin yet; they land in the apply pass.

| # | Item | Disposition |
| --- | --- | --- |
| 1–6 | Model pins (R-SE1, R-IN1, R-FW1, R-PT1, R-PT2, R-SM1 ×3) | **cut all eight.** No CHANGELOG, locked decision, or AGENTS line ever recorded a model choice; present since the v0.1.0/0.3.0 scaffolds; direct precedent in researcher v1.9.0 (`84aa8cb`), which removed all 12 pins including the downgrades. The tiering question (X1) was resolved on that precedent rather than escalated. |
| 7 | R-SE2 — `Task` in `synthesise.md:3` | **accepted, lands first.** A live break, not a constraint cut. |
| 8 | R-SM3 — save missing-STATE stop | accepted. |
| 9 | X3 — drop "exactly" from the 7 stage wrappers | **accepted over the stage auditor's recorded dissent.** The delegation is the architecture and stays; the adverb is a trust hedge and goes. |
| 10–13 | R-SM2, R-IN2, R-PT3, R-PT4 | accepted (wrapper de-fossilisation + critic persona line). |
| 14–17 | R-FW2, R-FW3, R-FW4, R-FW5 | accepted, **one commit** (X4). 14 is a live bug: `aka` lives in per-entry frontmatter, so alias matching silently fails as written. |
| 18 | R-FW6 — `_inventory.json` | **delete**, and build the INDEX-completeness lint against the entry files on disk. The filesystem is the source of truth; a generated JSON is a second thing to drift. |
| 19 | X5 — `no_em_dashes` | **wire it**, don't drop it. A shipped promise with zero consumers. Flagged as a behaviour change for any deployment that set the field. |
| 20 | X6 — drift-config extensions | accepted, all three fronts (save vocabulary, README wiring sentences, INDEX completeness). |
| 21 | R-RL2 — AGENTS.md "diagram" fossil | accepted. |
| 22 | Finding 15 — `frameworks/README.md` note | **accepted and APPLIED** (see Provenance). Shipped in v0.4.2. |
| 23–26 | R-SE3, R-SM4, R-SM5, R-RL1 | accepted (the optional/polish set). |

Folded in as part of the same pass, from the questions the audit left open: Q3 (transition box is
illustrative), Q4 (durability is the contract, cadence is practice), Q5 (README "How it runs" lists
are normative — lint them), Q6 (the missing Analyse offer is an omission), Q9–Q15 (one line each).
Q16's "70" is de-numbered in prose, with INDEX carrying the count.

### Rejected

Nothing was rejected. One escalated question resolved on evidence rather than by owner ruling:
the `adv-skip-loop` "note it once" allocation (Pushback vs Register) — the eval judge established
independently that Pushback's anchor ladder describes only *under*-challenging and has no anchor
that can express over-talking, so charging repetition there "would be inventing a standard."
Substance to Pushback, once-ness to Register. The golden passes.

### Deferred

- **X7 — the `` !`cat` `` preamble check.** Deferred by the owner, 2026-08-06. No check run, no
  ruling, no edit. The five preamble lines stay as-is through the apply pass. Nothing else depends
  on the answer: every dependent skill reads STATE.md explicitly.
- **Q7 — CHARTER staleness/migration vocabulary.** Parked as product work, not constraint work.
- **Q8 — standalone framework capture path vs. the 0.4.x state model.** Parked, same reason.

### Open — awaiting an owner call, not blocking the pass

- **Decisions 27–30** (below): in or out of this pass. Recommendation: in — they touch
  `strategist-stage/SKILL.md` and `strategist-pressure-test/SKILL.md`, which the pass already opens.
- **Register as an unconditional rubric floor.** Today an adversarial scenario passes on its
  criticals "regardless of the rest," so the same defect fails a representative and is invisible on
  a golden. Recommendation: a floor of ≥1 on every applicable dimension regardless of kind, decided
  before the re-run rather than after.

---

## Runtime findings — candidate decisions 27–30

Surfaced by the `/eval-run` baseline (iteration 1, 2026-08-06), **not by this audit**. The audit
hunted model-constraining instructions; these are the inverse — correct instructions the model does
not follow, which no amount of constraint-cutting fixes.

27. **The plugin narrates its own internal checks to the user.** Eight runs, five of seven stages
    (Define, Analyse, Synthesise ×3, Move, Story). `strategist-stage/SKILL.md:369` says "run this
    silently before writing anything"; `:391` says "not a checklist item to announce." **Finding 17
    of this audit rightly keeps that instruction — the defect is adherence, not the rule.** Name the
    fix as *"don't tell the user a check was run,"* not *"don't say Self-Audit"*: the Story run
    scored Register 1 while speaking no tripwire vocabulary at all, only the paraphrase "the
    self-check I ran before writing." A vocabulary-only fix misses it.
28. **Unconditional pressure-test handoff.** `strategist-pressure-test/SKILL.md:71-74` emits
    "> To address these: re-run `/strategist:<stage>`…" on a clean no-findings result, including
    the unresolved `<stage>` placeholder. Needs a no-findings variant.
29. **`open (n)` undercount reaching the user.** Two load-bearing findings listed in STATE.md,
    cell marked `open (1)`, and "one pressure-test finding carried open" spoken aloud.
    `/strategist:progress` and `/strategist:resume` both key off that cell. Mechanically lintable.
30. **Done-bar over-claim, twice.** Define certified `complete` with `reference/define/README.md:16`'s
    bar unmet and unrecorded; Story's STATE row asserted "Done-bar met (… MECE …)" while the
    delivered reader brief double-counts its central argument. Finding 18 keeps the done-bar check;
    again the gap is adherence. No gate or judged anchor catches either.

Also recorded, no decision proposed: the state record can reinstate a restriction the conversation
correctly refused (`Next Action: /strategist:define` written after a user twice declined Define,
while In-Flight held Execution Plan), and one derived-arithmetic error ("more than 4x any other
single driver", 28 vs 18) persisted into brief and STATE.

---

## Eval baseline

`/eval-run --target strategist --scope all`, iteration 1, 2026-08-06, at `df7f0c0`.
**9/13 scenarios pass — goldens 8/8, representatives 1/5.** One deterministic gate failure
(`rep-synthesise-tree`, adjudicated as a scenario turn-budget flaw, **not** a plugin defect: the
scenario budgets three user turns for a stage the engine needs four to complete, so Step 4's consent
rule guarantees the gate fails. A plugin-side "fix" would loosen "don't capture a result they
haven't actually agreed to").

Register is the only systematically weak dimension (mean 1.68, range 0–3, 9 of 25 runs at ≤1); every
other judged dimension sits at or near 3, with sub-3 scores traced to scenario shape rather than
plugin behaviour. Artifacts are local only — `eval/**/_eval/` is gitignored — at
`eval/targets/strategist/_eval/iteration-1/` (25 transcripts, 25 scorecards, `scores.md`).

**R-SE2 has no automated net.** The adapter has the runner play the critic directly because a
subagent cannot nest, which bypasses `allowed-tools` entirely — so the eval cannot detect the
missing `Task`. Verify decision 7 by running `/strategist:synthesise` live and confirming the critic
dispatches; a green eval before and after proves nothing about that seam.

Five pack findings (judge scorecard delivery — 25 of 25 required a re-ask; transcript convention
making Register unscoreable; `expected_no_advance` wired to the blind runner; two representatives
colliding with their own library Worked Examples; scenarios under-budgeting turns for the protocol's
confirmation steps) are recorded in `scores.md`. They degrade the baseline as a comparison point and
should be fixed **after** this baseline is recorded and **before** the post-pass re-run.

---

Applying the accepted set follows the release loop (version bump, both description prefixes,
CHANGELOG, README table, AGENTS list, `check-version-prefix.mjs`,
`lint-doctrine-drift.mjs --plugin strategist`, `claude plugin validate`), with the iteration-1
baseline above as the regression net and a re-run after.

---
name: research-progress
description: This skill should be used when the user asks where the research project stands or what to do next (e.g. "research progress", "where am I in the research", "what's next"). Read-only dashboard — reports the active phase, per-phase source counts, discovery-strategy status, the Phase Tier Record, and the next recommended action.
allowed-tools: Read, Grep, Glob
model: sonnet
---

# /research-progress

Show the current state of the research project as a dashboard.

## Current State

!`cat research/STATE.md 2>/dev/null || echo "No STATE.md found — run /research-init first."`

## Process

1. **Run infrastructure health checks** — collect all check results into a failures list (empty list = all pass):

   **1a. Plugin hooks manifest sound** — Read `${CLAUDE_PLUGIN_ROOT}/hooks/hooks.json` (the plugin ships its hooks here — NOT in the project's `.claude/settings.json`) and verify:
   - It parses as valid JSON with a `hooks` key.
   - `hooks.PreToolUse` contains an entry whose `matcher` covers Write, Edit, and MultiEdit (the shipped form is the combined matcher `"Write|Edit|MultiEdit"` — a combined matcher passes this check) and whose command invokes `gate-outputs.sh` — failure name: "outputs gate hook missing from plugin hooks.json" — failure description: "this hook blocks unaudited Write/Edit/MultiEdit to research/outputs/ on Claude Code; in Cowork hooks don't run and the gate holds structurally (audit-claims is the only writer)"
   - `hooks.PreCompact` contains an entry invoking `state-staleness-check.sh` — failure name: "PreCompact staleness hook missing from plugin hooks.json" — failure description: "this hook warns when STATE.md is stale before context compacts"

   **1b. Project pre-allow present** — Read `.claude/settings.json`. If it exists, confirm it parses as valid JSON and `permissions.allow` is an array (this is the pre-allow list `/research-init` writes so researcher's tools don't prompt per call — it does not carry hooks).
   - Failure name: "project settings.json invalid or missing pre-allow"
   - Failure description: "without the permissions.allow list from /research-init, Claude Code prompts on every tool call; the audit gate itself is unaffected (it ships in the plugin's hooks.json). Inert in Cowork."
   - If the file does not exist, report this same failure (init writes it); if running in Cowork, note it as informational rather than a failure.

   **1c. STATE.md structurally sound** — Read `research/STATE.md` and confirm it contains a `## Current Position` section with an `Active phase:` field and a `## Current Phase Cycle` section with a five-step checklist. (STATE.md has no YAML frontmatter — the init template never writes one; do not check for frontmatter.)
   - Failure name: "STATE.md missing required sections"
   - Failure description: "STATE.md must carry Current Position (with Active phase) and Current Phase Cycle — these are what session resume and the cycle skills read; without them the project position is unrecoverable"
   - If `research/STATE.md` does not exist, this check passes silently (no active research project)

   **1d. Reference files present** — Glob `${CLAUDE_PLUGIN_ROOT}/reference/` for these specific items: `coverage-assessment-guide.md`, `evidence-failure-modes.md`, `pattern-recognition-guide.md`, `source-assessment-guide.md`, `tools-guide.md`, `writing-standards.md`, `templates/` directory.
   - Failure name: "[filename] missing from ${CLAUDE_PLUGIN_ROOT}/reference/"
   - Failure description: "reference files guide source assessment, evidence evaluation, and output formatting — missing files degrade research quality"

   **1e. Discovery strategy present** — When `research/` directory exists (active research project), check for `research/discovery/strategy.md` (the canonical path written by `/research-init` Step 4).
   - Failure name: "discovery strategy missing"
   - Failure description: "a discovery strategy guides source finding — `/research-init` writes `research/discovery/strategy.md` and `/research-discover` reads it; without one, source selection is ad-hoc."
   - If no `research/` directory exists, this check passes silently

2. **Read `research/STATE.md`** for current position, active phase, and completed phases.
3. **Count files:**
   - `research/notes/` — total source notes
   - `research/drafts/` — drafts pending audit
   - `research/outputs/` — audited outputs
   - `research/audits/` — audit reports
4. **Read `research/research-plan.md`** to get the full phase list.
5. **Read `research/cross-reference.md`** and count the number of identified patterns.
6. **Read `research/gaps.md`** to identify any blocking gaps.

## Output

### Infrastructure Health

When all 5 checks pass, output a single compact line:
```
### Infrastructure Health
Infrastructure: 5/5 checks passed
---
```

When any checks fail, output a summary line plus only the failures (do not enumerate passing checks):
```
### Infrastructure Health
Infrastructure: [N]/5 checks passed

- **outputs gate hook missing from plugin hooks.json** — this hook blocks unaudited Write/Edit/MultiEdit to research/outputs/ on Claude Code; in Cowork the gate holds structurally
- **project settings.json invalid or missing pre-allow** — without the permissions.allow list from /research-init, Claude Code prompts on every tool call; the audit gate itself is unaffected

---
```

### Research Progress

| Phase | Status | Sources | Draft | Audit | Output |
|-------|--------|---------|-------|-------|--------|
| 1. [Name] | Complete/Active/Pending | [N] | [Yes/No] | [Pass/Fail/Pending/—] | [Yes/No] |
| 2. [Name] | ... | ... | ... | ... | ... |
| ... | | | | | |

**Audit column values:**
- **Pass** — `/research-audit-claims` ran and passed; draft was promoted to `outputs/`.
- **Fail** — `/research-audit-claims` ran and returned failures; draft is still in `drafts/` awaiting fixes.
- **Pending** — a draft exists in `drafts/` for this phase but `/research-audit-claims` has not been run on it yet.
- **—** — no draft exists for this phase yet (phase not yet at Synthesize step, or not started).

**Source notes:** [N] total
**Cross-reference patterns:** [N] identified
**Blocking issues:** [Any gaps or issues preventing progress, or "None"]

### Discovery Tier per Phase

Read the `## Phase Tier Record` section from `research/STATE.md`. If the section exists, reproduce its table here verbatim — one row per phase that's been briefed. If the section is missing from STATE.md, print:

```
No tier records yet — `/research-start-phase` writes a row per phase as it begins. Each row reflects the highest discovery tier that returned results for that phase (Tier 1 = Tavily, Tier 2 = Firecrawl, Tier 3 = built-in WebSearch).
```

Do not synthesize a table from `retrieval-log.json` directly — start-phase is the system of record for this data, and reading it twice from different sources risks drift.

**Next action:** [If health failures exist: "Fix infrastructure issues above before continuing — " then the original next action from STATE.md. If no health failures, show the original next action from STATE.md unchanged.]

## Guardrails

1. Report exactly what STATE.md and the files say. Do not editorialize on progress quality.
2. If STATE.md and the actual file counts disagree (e.g., STATE.md says 5 sources but there are 7 files in notes/), report the discrepancy.
3. Do not recommend skipping phases or batching work to "speed things up."
4. Show blocking issues prominently — a stale cross-reference or undone gap check is a blocker, not a footnote.
5. Report all infrastructure check results honestly. Do not skip checks or suppress failures to make the dashboard look clean.

This skill is read-only — it does NOT write any files.

# trailhead — constraint audit

## Provenance

- **Audit date:** 2026-08-06
- **Audited commit:** `1b482dd` — tip of `trailhead-v0.1.0`. The plugin has **never merged to main**; the `trailhead/` directory on main is an empty stub. All file:line citations below are against that commit, read from a throwaway worktree.
- **Main worktree state:** dirty with unrelated researcher-w6ab work; does not affect this audit.
- **Scope of this run:** full plugin audit — every surface, plus the integration pass.
- **Surfaces inventoried:** trailhead-init (SKILL.md + 4 references + command wrapper), trailhead-audit (SKILL.md + command wrapper), hooks (hooks.json, `pre-commit-secrets.sh`, `gate-staleness-check.sh`), scaffold payload (12 templates: AGENTS/CLAUDE tmpls, 4 contract tmpls, STATE, HISTORY, gate.config, 2 settings tmpls, gitignore), `templates/CLAUDE.md`.
- **References followed:** all four `skills/trailhead-init/references/*.md`; `reference/failure-map.md`.
- **Evidence read (not audited):** `trailhead/AGENTS.md`, `README.md`, `CHANGELOG.md`, root `AGENTS.md`, `dev/blind-reviews/trailhead-pass1-2026-07.md` and `-pass2-`, `dev/researcher/constraint-audit.md` + researcher CHANGELOG v1.9.0 (model-pin precedent).
- **Exclusions:** the nine `scaffold/scripts/*.mjs` gate scripts were audited **only for embedded instruction prose** (their printed messages) — they are the mechanism layer, and their correctness was the subject of the two blind reviews, not this audit. `dev/trailhead/tests/` and `build-notes.md` are dev scaffolding that never ships. Nothing was unreadable.
- **Regression net:** **trailhead has no eval pack** (`eval/targets/` has no trailhead entry). Any applied rewrite is behaviorally unverified unless a targeted runtime scenario is run first.

## Verdict

**Plugin scope, all surfaces at `1b482dd`, integration pass run:** trailhead is close to clean — its staged process is the product's method and its enforcement already lives in mechanism, so the capability pile contains exactly two entries, both frontmatter `model:` pins. The real findings are seam defects: one contract mirrored with drift (the status vocabulary is four words in the mechanism and "exactly three" in three prose surfaces), one orphaned shipped surface (`templates/CLAUDE.md` claims init installs it; nothing does), and one version-stamp fossil-in-waiting (the audit report template hardcodes `v0.1.0`). No eval pack exists, so rewrites here have no automated regression net.

---

## Surface: trailhead-init

*Audited at `1b482dd`. Covers `skills/trailhead-init/SKILL.md`, `references/{interview,gate-catalog,multi-cli,settings-merge}.md`, `commands/trailhead/init.md`.*

### Findings

1. **`model: opus`** — `skills/trailhead-init/SKILL.md:6`. **Capability-workaround · CUT.** Evidence: inferred (no recorded rationale in CHANGELOG or AGENTS.md) + history-backed precedent — the same question was adjudicated for researcher and resolved in v1.9.0 by removing **all** pins, on the grounds that frontmatter `model:` is an override, not a floor: it caps a stronger session model and cannot express "most capable available." Trailhead's pin predates that decision and was never separately made. Cutting aligns the marketplace.

2. **`disable-model-invocation: true`** — `SKILL.md:4`. **Safety-governance · KEEP** (observed). Init writes ~15 files into the user's repo; requiring explicit invocation is a human gate on a high-blast-radius action.

3. **No-shell family** — `allowed-tools: Read, Write, Edit, Glob, Grep` (`SKILL.md:5`), the "Tool discipline / Never use shell" section (`SKILL.md:19–28`), "Do not run the gate yourself unless the user asks — this skill has no `Bash`" (`SKILL.md:140`), mirrored in `commands/trailhead/init.md:3` and `AGENTS.md:81–84`. **External-contract · KEEP** (observed). The contract: Cowork's shell permission model (a prompt per call) plus the design fact that nothing scaffolded needs an executable bit. This does not dissolve on a smarter model; it would only go if Cowork's permission surface changed — and even then Read-then-Write is what keeps init runnable on any restricted surface.

4. **Interview discipline family** — "never ask what you can detect" (`SKILL.md:30–44`, `references/interview.md:8–10`), the two-minute budget (`SKILL.md:43`, `interview.md:3–6`), "Do not add a fifth question" (`SKILL.md:160`, `AGENTS.md:171–173`), the rejected-questions table (`interview.md:103–112`). **Product-method / user-intent · KEEP** (history-backed — each question's provenance is written down per-question). This *is* the product: a setup tool that survives the moment of maximum impatience. The rejected-questions table is the fossil record done right — it records why the constraint exists, which is what lets a future audit re-test it.

5. **"Ask all four at once … Do not interrogate one at a time"** — `SKILL.md:74`. **User-intent · KEEP** (observed). Turn-budget economics, not worker management; survives any model.

6. **Extend-don't-replace + propose-don't-perform** — `SKILL.md:48–56`; `references/settings-merge.md:3–8, 44–49` ("Propose — do not perform. It is their file."), including "If it is not valid JSON, say so and stop — do not 'repair' it" (`settings-merge.md:8–9`). **User-intent (autonomy gate) · KEEP** (observed). The user's files are the user's.

7. **Template→path write table** — `SKILL.md:89–109`. **External-contract · KEEP** (observed). The exact paths are read back by `gate.config.json` keys (`state_file`, `decisions_file`, `design_contract`, …) and the check scripts; this is a parser contract, not scaffolding.

8. **"`{{DATE}}` (today, actual — never guess)"** — `SKILL.md:79–80`. **Intent (placeholder spec) · KEEP** (observed). Reads at first like a date-guessing hedge, but it is the semantic definition of the placeholder; survives upgrade as plain spec. Not worth an edit.

9. **Red-first-run framing** — `SKILL.md:120–137`, mirrored in `commands/trailhead/init.md:14–15`, `README.md:59–61`. **Product-method + voice · KEEP** (history-backed — "a green first run would be the original bug shipped as the fix"). The "Be precise about *what* is red" paragraph (`SKILL.md:134–137`) is intent-rich and prevents the skill overclaiming its own theater.

10. **"The runner writes `.gates/ratchet.json` itself … do not hand-write it"** — `SKILL.md:139`. **External-contract (mechanism ownership) · KEEP** (history-backed — hand-written ratchet state is precisely the 0.1.0 defect class the first blind review confirmed).

11. **"Then stop. Do not commit."** — `SKILL.md:152`. **User-intent (autonomy gate) · KEEP** (observed).

12. **Guardrails 1–4** — `SKILL.md:156–159`: no silent overwrite; sanity-check triggers against the tree; never read/print/copy a credential value; do not fill in the contract's invariants ("an invariant they did not write is one they will not enforce"). **User-intent / safety-governance · KEEP** (observed; #4 is the plugin's non-invention rule and is load-bearing product doctrine).

13. **`references/gate-catalog.md`** — wholesale **product-method · KEEP**, including the honest-boundary paragraph (`gate-catalog.md:119–122`), which is the plugin refusing to overclaim — intent, not hedging.

14. **`references/multi-cli.md`** — **external-contract · KEEP** (observed/inferred). "Codex and Gemini do not follow `@imports`" (`multi-cli.md:17–21`) and the `context.fileName` mechanics are claims about *third-party tools'* current behavior. They do not dissolve on a smarter executing model — but they can go stale by third-party release. Worth a re-verify on major Codex/Gemini releases; not a model-capability issue. "Transform prose, never paths" (`multi-cli.md:43–51`) is history-backed intent — keep.

15. **Command wrapper** — `commands/trailhead/init.md`. "Follow its steps exactly" is dispatch language, not worker management — keep. The wrapper mirrors two skill rules (triggered rows, red first run; lines 13–15); recorded as a seam in Cross-surface findings.

### Proposed rewrites

- **Delete `SKILL.md:6`** (`model: opus`). Nothing replaces it; the skill inherits the session model. No other line changes — the skill text is already model-agnostic.

### Still under-specified

- **How is `{{CONVENTIONS}}` derived?** The placeholder is listed (`SKILL.md:83`) and lands in `AGENTS.md.tmpl:99`, but nothing says whether it is detected from the tree, asked (it can't be — no fifth question), or left empty. What should init write there?
- **Multi-manifest repos.** Step 1's detection assumes one package manifest. What is the intended behavior in a monorepo — one gate at the root, per-package gates, or ask?

---

## Surface: trailhead-audit

*Audited at `1b482dd`. Covers `skills/trailhead-audit/SKILL.md`, `commands/trailhead/audit.md`.*

### Findings

1. **`model: sonnet`** — `skills/trailhead-audit/SKILL.md:5`. **Capability-workaround · CUT.** Evidence: inferred + history-backed precedent (researcher v1.9.0, as above). This pin is sharper than init's: the audit is judgment work by its own definition — "the single most consequential finding, in plain language" (`SKILL.md:177`), CONFLICT-vs-PARTIAL discrimination — and an economy-tier pin *caps* whatever stronger model the session runs.

2. **Blast-radius invariant + tool set** — `SKILL.md:14–26` and `allowed-tools: Read, Grep, Glob, Write` (`SKILL.md:4`). **Safety-governance, already moved to mechanism · KEEP** (observed). Read-only enforced by tool absence, with prose explaining the enforcement rather than substituting for it. This is the pattern the rest of the marketplace should copy.

3. **The eight gates, verdict table, and evidence standard** — `SKILL.md:36–167`, "Cite or drop it" (`SKILL.md:206`), "A document is not a gate" (`SKILL.md:208`). **Product-method · KEEP** (history-backed via `reference/failure-map.md` — every gate names its observed failure).

4. **Eight-row cap** — `SKILL.md:59`, mirrored `AGENTS.md:184`. **Product-method · KEEP** (observed). Report design, not model management.

5. **Hardcoded version in the report template** — `SKILL.md:173`: the format block contains a literal `<!-- trailhead v0.1.0 -->` while every scaffold template uses `{{VERSION}}` substitution. **Capability-workaround? No — drafting fossil · REWRITE AS INTENT** (observed). The model will faithfully copy the literal into reports at every future plugin version. Replace with a placeholder plus one instruction to read the current version from `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json` — the same rule init already follows.

6. **"three-word vocabulary (`built` / `verified` / `accepted`)"** — `SKILL.md:81`. **Drifted mirror · REWRITE** — see Cross-surface finding 1. The ground-truth allowlist is four words.

7. **Scope boundary** — "Do not propose fixes you would have to write … Remediation lines are one sentence, not a plan" (`SKILL.md:209–210`); "Report honestly … an audit that finds eight problems in every repo is a template, not a measurement" (`SKILL.md:213–214`). **User-intent · KEEP** (observed).

8. **Command wrapper** — `commands/trailhead/audit.md`. Clean thin wrapper; `$ARGUMENTS` pass-through with `--no-write` documented in both places (seam note below).

### Proposed rewrites

- **Delete `SKILL.md:5`** (`model: sonnet`).
- **`SKILL.md:173`:** change the format block line to `<!-- trailhead v<current plugin version> -->` and add, after "Write the report" (`SKILL.md:59`): "Stamp the marker with the current version from `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json` — never a remembered one."
- **`SKILL.md:81`:** "the four-word vocabulary (`not started` / `built` / `verified` / `accepted`)".

### Still under-specified

- Nothing material. Guardrail 1 ("no verdict is inferred from the absence of a search you did not run") already covers the partial-scan case honestly.

---

## Surface: hooks

*Audited at `1b482dd`. Covers `hooks/hooks.json`, `hooks/pre-commit-secrets.sh`, `hooks/gate-staleness-check.sh`.*

### Findings

1. **Hook wiring** — `hooks.json` PreToolUse on `Bash` with stdin-scoping to `git commit` inside the script (`pre-commit-secrets.sh:39–41`), Stop hook with tight predicates. **External-contract (Claude Code hook API) + mechanism · KEEP** (observed).

2. **Comment prose in both scripts** — design rationale embedded at the point of enforcement ("Nuisance failures here would get the hook deleted, which would take the freshness check below with it", `gate-staleness-check.sh:39–41`; "It does not carry its own pattern table … two tables in two languages drift", `pre-commit-secrets.sh:11–15`). **Product-method recorded in mechanism · KEEP** (history-backed — both trace to blind-review findings). This is what "move to mechanism" looks like when done.

3. **Printed messages** — every failure message names the action ("Run: node scripts/gate.mjs", "Unstage it, remove the credential…"). Actionable, intent-aligned, no worker management. **KEEP.** Note: `gate-staleness-check.sh:54` prints the **correct four-word** vocabulary — this is the mirror the prose surfaces drifted from (Cross-surface finding 1).

4. **Honest degradation** — both scripts state they are conveniences, never the gate (`gate-staleness-check.sh:22–23`, `AGENTS.md:85–86`). **Intent · KEEP.**

### Proposed rewrites

None.

---

## Surface: scaffold payload (shipped instruction templates)

*Audited at `1b482dd`. Covers `scaffold/AGENTS.md.tmpl`, `CLAUDE.md.tmpl`, `contracts/{CONTRACT,OPEN-DECISIONS,identity,design-system}.md.tmpl`, `planning/STATE.md.tmpl`, `qa/HISTORY.md.tmpl`, `gate.config.json.tmpl`, `claude-settings.json.tmpl`, `gemini-settings.json.tmpl`, `gitignore.tmpl`. These are the instruction surface for **target-repo** agents — they must pass the same test.*

### Findings

1. **"uses these three words and no others"** — `AGENTS.md.tmpl:55` and "Status uses exactly three words" — `STATE.md.tmpl:19–20`. **Drifted mirror · REWRITE** (observed). Ground truth is `status-lint.mjs:32`: `VOCABULARY = ['not started', 'built', 'verified', 'accepted']` — four words. `STATE.md.tmpl:25` even seeds a row with `not started`, so an agent obeying the tmpl literally must conclude the scaffold violates its own contract on first read. This is the sharpest finding in the audit, and it is exactly the defect class trailhead exists to catch: prose drifting from the mechanical check while remaining "complied with in letter." See Cross-surface finding 1 for the full mirror set.

2. **"paste the banner rather than summarizing it"** — `AGENTS.md.tmpl:18`. **Method (evidence discipline) · KEEP** (observed). Verbatim receipts counter self-report laundering, not low intelligence; valuable on any model.

3. **Session protocol** — `AGENTS.md.tmpl:87–95`: read STATE.md on start, update on end, "After compaction: re-read `.planning/STATE.md` immediately. Do not assume pre-compaction context survived." **Method + external-contract (harness compaction mechanics) · KEEP** (observed). Compaction is a harness property, not a model-capability one; "do not re-derive the project from the source tree" is authority-of-record doctrine, not distrust.

4. **Contract discipline** — `CONTRACT.md.tmpl:5–20`: amend-don't-edit, the line cap, "a document edited every deliverable stops being an authority." **Product-method, enforced by `contract-lint` · KEEP** (history-backed — failure-map §7). The prose explains a rule the mechanism enforces; correct division.

5. **"Do not edit this file to make the gate green"** — `HISTORY.md.tmpl:9–13`. **Intent (anti-laundering) · KEEP** (observed).

6. **Verdict format block** — `design-system.md.tmpl:66–96`. **External-contract · KEEP** (observed) — `gate.mjs` parses those exact fields (`watch_mtime`, `artifact`, `attested_at`); the surrounding prose states *why* each field is checked, which is what makes a human able to comply.

7. **Guidance comments across contract tmpls** — the "what a good invariant looks like" comment (`CONTRACT.md.tmpl:30–37`), the principal-table comment (`identity.md.tmpl:37–40`), decision-authority default (`CONTRACT.md.tmpl:55–61`). **Product-method / intent · KEEP** (history-backed via failure-map). These are the under-specification *fills* an over-constrained plugin usually lacks — trailhead has them.

8. **`.gates/verdicts/**` write-deny** — `claude-settings.json.tmpl:12`. **Safety-governance moved to mechanism · KEEP** (observed). Claude-only, and `multi-cli.md:32` says so honestly.

9. **`_stage_level` / `_reversibility` doc-keys** — `gate.config.json.tmpl:5,18`. **Method embedded in mechanism · KEEP** (observed). Documentation that travels with the config it explains.

### Proposed rewrites

- **`AGENTS.md.tmpl:53–62`:** "Deliverable status in `.planning/STATE.md` uses these four words and no others: **not started** (the initial state), **built**, **verified**, **accepted**." Keep the three definition bullets; add none for `not started` beyond the parenthetical.
- **`STATE.md.tmpl:19`:** "Status uses exactly four words — **not started**, **built**, **verified**, **accepted** — defined in `AGENTS.md`."

### Still under-specified

- Nothing found. The templates are unusually well-specified — each states outcome, boundary, and the check that enforces it.

---

## Surface: templates/CLAUDE.md

*Audited at `1b482dd`.*

### Findings

1. **Orphaned surface with a false installation claim** — `templates/CLAUDE.md:3`: "Installed into YOUR project by /trailhead:init." **Nothing installs it**: init's write table (`trailhead-init/SKILL.md:89–109`) does not include it, and no skill, command, or hook references it (the only mention anywhere is the naming caution in `trailhead/AGENTS.md:6–10`). Its two knobs duplicate values the runner reads from `gate.config.json` — the file admits this itself ("mirrors `stage_level` in `gate.config.json`, which is the value the runner actually reads", `templates/CLAUDE.md:16–17`). **Source: external-contract** (the marketplace convention that plugins ship `templates/CLAUDE.md` as per-deployment config — root `AGENTS.md:5,55`) **· UNRESOLVED — product decision required** (observed). Two coherent resolutions: (a) wire it — init installs it and the gate honors it as a config override; or (b) keep it as the convention's presence-stub but rewrite its header to say the authoritative knobs live in `gate.config.json` and this file is a pointer. Do not silently delete — the convention is a real contract; the false claim is the defect.

---

## Cross-surface findings (integration pass)

1. **Status vocabulary: three vs four.** Ground truth is **four** (`scaffold/scripts/checks/status-lint.mjs:32`; hook message `hooks/gate-staleness-check.sh:54`; "a status word outside the four" in `references/gate-catalog.md:13` and `README.md:79`). Drifted to "three": `scaffold/AGENTS.md.tmpl:55`, `scaffold/planning/STATE.md.tmpl:19`, `skills/trailhead-audit/SKILL.md:81`, `README.md:97` ("Three status words, no others"). Ironically, `status-lint.mjs:16–17` records that the *check* was fixed from a three-word framing to an allowlist — the prose mirrors were never swept. One number must own this; the mechanism's four is it. If the author wants to preserve the rhetorical force of "three," the honest phrasing is "three claim words plus the initial state `not started`" — but it must then be that phrasing *everywhere*.

2. **Version marker discipline broken in one place.** Every scaffold template stamps `<!-- trailhead v{{VERSION}} -->` (load-bearing per `AGENTS.md:111–114`); the audit report format block hardcodes `<!-- trailhead v0.1.0 -->` (`skills/trailhead-audit/SKILL.md:173`). Future releases will stamp stale versions into audit reports — the exact "at that vintage" signal the marker exists to carry. Rewrite proposed under trailhead-audit.

3. **`templates/CLAUDE.md` orphan** — see its surface section. The marketplace convention (root `AGENTS.md`) is the contract; the wiring or the header must change.

4. **Wrapper mirrors** — `commands/trailhead/init.md:13–15` repeats two skill rules (triggered rows; red first run); `commands/trailhead/audit.md:9–13` repeats the blast-radius invariant and `--no-write`. Acceptable one-line summaries serving command discovery, but they are mirrors: any change to those rules in a SKILL.md must move the wrapper in the same commit. Note only; no action.

5. **Model pins as a marketplace-level decision.** Researcher v1.9.0 removed all pins as an explicit plugin-scoped decision. Trailhead's two pins (`opus` on init, `sonnet` on audit) were never separately adjudicated. Cutting them (proposed above) aligns the marketplace; leaving them requires a stated reason researcher's reasoning doesn't apply here — none is on record.

6. **Counting octaves (note only).** "Seven checks" (plugin.json, init) = 7 check scripts; "eight gates" (audit) = 8 audit dimensions; 8 base stages in `gate.config.json.tmpl` (6 checks + 2 commands). All internally consistent, three different framings. A reader hazard at most; no action proposed.

---

## Rewrite ledger

*No rewrites applied. Audit-only run; the user has not requested application. If applied: plugin-scoped release loop per root `AGENTS.md`, and — since trailhead has no eval pack — either a targeted runtime scenario (run init against a throwaway repo; run audit against a fixture repo) or an explicit note that the rewrites ship behaviorally unverified.*

| # | Rewrite | Status |
|---|---|---|
| 1 | Cut `model: opus` (trailhead-init) | proposed |
| 2 | Cut `model: sonnet` (trailhead-audit) | proposed |
| 3 | Four-word vocabulary sweep (AGENTS.md.tmpl, STATE.md.tmpl, audit SKILL.md, README) | proposed |
| 4 | Version-stamp instruction in audit report format | proposed |
| 5 | `templates/CLAUDE.md` — wire it or fix its header | awaiting product decision |

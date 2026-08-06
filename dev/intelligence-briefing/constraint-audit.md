# Constraint audit — intelligence-briefing

## Provenance

- **Audit date:** 2026-08-06
- **Commit audited:** `df7f0c0` (dirty worktree at audit time — pending changes were all in `researcher/` and `dev/researcher/`; nothing under `intelligence-briefing/` was modified, so the plugin's surfaces were clean at that commit)
- **Rewrites applied:** the two cross-surface seams were fixed in the same session and released as **v0.3.1**; see *Applied rewrites* at the bottom. `SKILL.md` has therefore changed since the commit stamped on its section below — that section was re-audited post-edit and is current for v0.3.1.
- **Scope of this run:** full plugin audit (`/upskill intelligence-briefing`) — all surfaces plus integration pass
- **Plugin version:** 0.3.0 at audit; 0.3.1 after the applied seam fixes
- **Surfaces inventoried (all read in full):**
  - `skills/environmental-briefing/SKILL.md`
  - `skills/environmental-briefing/references/html-brief.md` (loaded by SKILL.md step 9)
  - `commands/brief.md`
  - `commands/intel-setup.md`
  - `templates/CLAUDE.md` (shipped per-deployment config template — instructs the runtime agent via its field comments)
  - Execution settings: `allowed-tools` frontmatter on the skill and both commands; no `model:` pins anywhere; no hooks; no agents.
- **Evidence read (not audit targets):** plugin `AGENTS.md`, `CHANGELOG.md`, `README.md`, `plugin.json`, root `AGENTS.md` (Cowork constraints, release loop, Cowork-safe HTML rules), `git log --follow` on SKILL.md.
- **Exclusions:** `assets/brief.css` — a stylesheet, not instruction text; it is the *contract target* of `html-brief.md`'s markup patterns and was checked for existence only. No unreadable files.
- **Regression net:** **no eval pack exists** (`eval/targets/` has no `intelligence-briefing`). Any future rewrite is behaviorally unverified unless a targeted runtime scenario is run first.

## Verdict

**Clean within the audited plugin scope — no capability constraints found to cut.** Every constraining instruction sorts as user-intent, product-method, safety-governance, or external-contract; the plugin's rules are unusually well-provenanced (the CHANGELOG names the incident behind nearly every rail). Findings below are keeps with reasoning, two mild cross-surface seams, and a short under-specified list. This verdict covers the five surfaces and settings listed above at commit `df7f0c0`; it says nothing about `assets/brief.css` design quality or the marketplace-level docs.

---

## Surface: `skills/environmental-briefing/SKILL.md`

*Audited at commit `df7f0c0`; re-audited after the v0.3.1 seam fixes — the two edited lines
(`SKILL.md:2`, `SKILL.md:28`, and the CADENCE reference at `SKILL.md:232`) pass this skill's own
test: model-agnostic, no capability assumption in either direction.*

### Findings

1. **"This document is your operating instruction. Follow it exactly. … Where this document states a rule, the rule is not optional."** (`SKILL.md:11`; same family: "These are fixed. Do not deviate." `SKILL.md:108`) — **product-method · keep · observed.** Compliance emphasis, not content. It survives the upgrade test because the brief runs unattended on a schedule: run-to-run consistency is a product property, and the doc is the deployment contract. Noted that the skill elsewhere delegates judgment freely ("a sensible window," "derive provisional ones"), so this framing does not cap the model in practice.

2. **Mandated step order ("executing these steps in order," `SKILL.md:50`).** — **product-method · keep · observed.** The sequence encodes real data dependencies (ledger before gather, verify before emit, ledger write last) and the method's central gate (VERIFICATION before assembly). Order serves the outcome; this is method definition, not execution management.

3. **Search-tool rule: "Do not require a specific search MCP … do not shell out to a CLI; … never depend on one."** (`SKILL.md:64`) — **external-contract · keep · history-backed** (CHANGELOG 0.1.3: "WebSearch as the baseline"). Portability contract: the plugin must run on both Claude Code and Cowork with zero setup. Would only dissolve if both surfaces guaranteed a common search MCP.

4. **No-subagent scanning: "do not delegate scanning to spawned subagents, which start from a stripped permission set and will fail to reach the web."** (`SKILL.md:64`; mirrored in plugin `AGENTS.md` twice) — **external-contract · keep · history-backed** (0.1.3). This is an *environment*-capability workaround, not a model-capability one — it names its premise. **Revisit trigger:** if subagents inherit web permissions on both surfaces, this hardens into a mere preference and could relax. The premise should be re-verified at the next release touching this line; the rule stays until then because a scheduled run that silently fails to reach the web is the failure it guards.

5. **File-ops family: "Never run shell commands … To check whether a file exists, just `Read` it"** (`SKILL.md:66`, `SKILL.md:223`; mirrors: `commands/intel-setup.md:15`, `references/html-brief.md:3`, plugin `AGENTS.md`, root `AGENTS.md`) — **external-contract · keep · history-backed** (0.1.5 "No-shell file ops"). Permission-prompt UX contract on both surfaces. Already **enforced by mechanism**: no surface's `allowed-tools` includes Bash. The prose is the why; the frontmatter is the enforcement — correct division, nothing to move.

6. **Triage posture: "When thoroughness and selection conflict, choose selection" / asymmetric failure modes / "when in doubt, discard … never the material."** (`SKILL.md:38–44`, RULES 1–3) — **product-method · keep · observed.** This *is* the product. Notably well-written intent: it states the outcome and the error asymmetry rather than policing execution.

7. **Scan budget: "inspect a handful of high-signal channels — roughly three to eight — and stop early…"** (`SKILL.md:100`) — **product-method · keep · observed.** Bounds cost/latency of a two-minute-read daily product, and explicitly disclaims quota behavior ("not a quota to fill. Finding nothing is valid."). Not a capability hedge — a depth calibration that stays right on any model.

8. **VERIFICATION hard gate: "audit the assembled draft as if you did not write it. Trust nothing; check everything."** (`SKILL.md:183–196`) — **product-method · keep · observed.** Counters compression drift and stochasticity, not low intelligence; the qualifier/range checks are the plugin's core evidence discipline and stay valuable on any model.

9. **Classification taxonomy, EVIDENCE BAR gates, NOVELTY TEST, CADENCE, OUTPUT CONTRACT** (`SKILL.md:124–268`) — **product-method / external-contract · keep · observed.** The output contract doubles as the HTML mapping's source of truth; the ledger schema is a cross-plugin shared-state contract (`/contract` convention, `source: "environmental"` rows). Rigid where rigidity is the contract.

10. **LEDGER SCHEMA ownership rules ("only ever reads and writes its own `source: "environmental"` rows… leave other producers' rows untouched," `SKILL.md:203`, `SKILL.md:222–224`)** — **external-contract · keep · history-backed** (0.3.0 moved shared state to `/contract`). Multi-plugin co-tenancy contract.

11. **Execution settings: `allowed-tools: Read, Write, Edit, WebSearch, WebFetch`** (`SKILL.md:4`) — **external-contract · keep · observed.** Matches the design exactly (no Bash, no agent dispatch). **No model pin** — no fossil.

### Proposed rewrites

None. No capability constraints found on this surface.

### Still under-specified

- **Grace window default.** CADENCE says "a short grace window" (`SKILL.md:231`) but CONFIGURATION doesn't list it among the fields-with-defaults, while `templates/CLAUDE.md:51` exposes it as a configurable set to 6 hours. Is 6 hours the skill-level default, and should CONFIGURATION name it? (See cross-surface finding 2.)
- **Channel-inspection unit.** The 3–8 "channels" budget doesn't define whether a channel inspection is one search query or one fetched source. Probably fine to leave to judgment — flagging only because it's the one budget number in the skill.

---

## Surface: `skills/environmental-briefing/references/html-brief.md`

*Audited at commit `df7f0c0`.*

### Findings

1. **"CSS is fixed; you only generate the body content. … Do not rewrite or restyle it."** (`html-brief.md:32`) and **"Use these exact patterns."** (`html-brief.md:38`) — **external-contract · keep · observed.** Looks like a rigid-template smell but isn't: the markup patterns bind to class names in `assets/brief.css`, and the fixed CSS is the brand-neutral/theme-override mechanism. The contract target is real and checkable.

2. **Cowork-safe rules: one file, no external CSS/JS, must read without web fonts, escape `&`/`<`/`>`.** (`html-brief.md:34`, `html-brief.md:102–107`) — **external-contract · keep · history-backed** (root `AGENTS.md` "Learned the hard way": `opacity:0` reveals render blank in Cowork). Surface limitation, does not dissolve on a smarter model.

3. **Theme font-link convention (first-line comment `/* font-link: <url> */`; never inline `@import`; never hard-fail on a missing theme).** (`html-brief.md:34`) — **external-contract · keep · observed.** A small parser-like convention deployments rely on; the `@import` prohibition states its CSS-ordering reason.

4. **Lazy load: "Read this file at the render step only when `format` is `html`."** (`html-brief.md:5`) — **product-method · keep · observed.** Context economy, not a re-read ritual.

### Proposed rewrites

None.

### Still under-specified

Nothing material — presentation edge cases (quiet day, empty sections) are covered.

---

## Surface: `commands/brief.md`

*Audited at commit `df7f0c0`.*

### Findings

1. Thin wrapper by design: **"Use the `environmental-briefing` skill and follow its TASK steps exactly."** (`brief.md:8`) — **product-method · keep · observed.** Single-source-of-truth delegation; the halt-condition restatement mirrors SKILL.md step 0 without drift (checked side by side).
2. **`allowed-tools` mirrors the skill's exactly** (`brief.md:3`) — **external-contract · keep · observed.**

### Proposed rewrites

None.

### Still under-specified

None — correct for a wrapper this thin.

---

## Surface: `commands/intel-setup.md`

*Audited at commit `df7f0c0`.*

### Findings

1. **"Ask the specific questions below. Do not improvise your own framing… Ask one topic at a time and wait for each answer."** (`intel-setup.md:8`) — **product-method · keep · history-backed** (0.1.2 "Tightened the /intel-setup question contract"). The scripted interview *is* the setup product; the pacing is interview design, not distrust. The command still delegates judgment where it belongs ("If an answer is vague, ask one short follow-up").

2. **"Do NOT present a menu of role 'personas'…" / "Do NOT infer the user's role, employer, clients… from other projects, open files, memory, prior conversations."** (`intel-setup.md:12–13`) — **user-intent / safety-governance · keep · history-backed** (0.1.2). A privacy rail and a quality rail at once; born from a real failure mode (persona menus producing generic relevance contexts). Author's rule; untouchable on capability grounds.

3. **"Do NOT put real company or product names into your questions… never a specific named organization."** (`intel-setup.md:14`) — **user-intent · keep · history-backed** (0.1.2 "Removed organization-specific examples").

4. **File-ops guardrail** (`intel-setup.md:15`) — member of the no-shell family; see SKILL.md finding 5.

5. **Approval-expectations preamble** (`intel-setup.md:17`) — **product-method · keep · history-backed** (0.1.5 "Setup permission preamble"). Setup UX intent.

6. **Step 4 evidence-bar as a discrete multiple-choice** (`intel-setup.md:32–37`) — **product-method · keep · observed.** Deliberate contrast with the free-text relevance questions; the command even explains why the question tool fits here and not there. The four bar descriptions match SKILL.md's EVIDENCE BAR without drift (checked).

7. **Step 8 narrow `.claude/settings.json` allowlist — "Allow only this narrow set — do not add `Bash` or any broad permission."** (`intel-setup.md:45–55`) — **safety-governance / external-contract · keep · history-backed** (0.1.3). Least-privilege rail; also correctly documents Cowork inertness.

8. **Step 9 WebSearch pre-flight before the test brief** (`intel-setup.md:57`) — **external-contract · keep · history-backed** (0.1.3). Checks the *environment's* capability, not the model's; prevents a half-finished first brief.

9. **"do not reimplement it here"** (`intel-setup.md:21`) — **product-method · keep · observed.** Anti-drift, single source of truth for briefing logic.

### Proposed rewrites

None.

### Still under-specified

- **User declines the `settings.json` write (step 8):** no stated fallback. Presumably proceed and let the user eat per-run prompts — worth one sentence so setup doesn't stall or improvise. One question: is "skip and continue, noting they'll be prompted per run" the intended behavior?

---

## Surface: `templates/CLAUDE.md`

*Audited at commit `df7f0c0`.*

### Findings

1. **Config template with instructive comments; all defaults cross-checked against SKILL.md CONFIGURATION and intel-setup step 5** (5/zone, 3 lead, `decision` bar, daily, `./briefs/`, `./ledger.json`, `html`/`default`) — **external-contract · keep · observed.** No drift found except the grace window (cross-surface finding 2).
2. **"One project = one brief."** (`templates/CLAUDE.md:5`) — **product-method · keep · observed.** Mirrored in README; consistent.
3. **Fixed-zone framing ("tailored through your relevance context, not by editing the list")** (`templates/CLAUDE.md:63–65`) — **product-method · keep · observed.** Matches SKILL.md ZONES rationale verbatim in spirit; no drift.

### Proposed rewrites

None.

### Still under-specified

None beyond the grace-window seam below.

---

## Cross-surface findings (integration pass)

1. **Skill `name:` mismatch — RESOLVED in v0.3.1.** Frontmatter said `name: environmental-briefing-agent` (`SKILL.md:2`) while the directory is `environmental-briefing` and both commands reference "the `environmental-briefing` skill" (`brief.md:8`, `intel-setup.md:6`, `intel-setup.md:21`). Resolution worked either way (the runtime lists the skill by directory), so this was **harmless drift, not a defect** — but it was the one place in the plugin where two surfaces named the same thing differently. Frontmatter now reads `environmental-briefing`. *Observed.*

2. **Grace window lived in the template but not in the skill's config enumeration — RESOLVED in v0.3.1.** `templates/CLAUDE.md:51` exposes "Grace window: 6 hours" as a configurable field; SKILL.md's CONFIGURATION block didn't list it, and CADENCE said only "a short grace window." A model reading only SKILL.md would not have known 6 hours is the shipped default, or that the field is user-editable config rather than skill judgment. CONFIGURATION now carries the field with its default (`SKILL.md:28`) and CADENCE reads "the configured grace window" (`SKILL.md:232`). *Observed.*

3. **Mirrored rule families are consistent** — checked for drift and found none: the halt contract (SKILL.md step 0 ↔ `brief.md` ↔ template preamble), the no-shell family (five locations, finding 5 above), the no-subagent/no-MCP scan rule (SKILL.md ↔ plugin `AGENTS.md`), the evidence-bar definitions (SKILL.md ↔ intel-setup ↔ template comments), and the defaults (SKILL.md ↔ intel-setup step 5 ↔ template). The mirrors carry their provenance with them, which is why they audit clean.

4. **Prose rules already backed by mechanism** — the no-shell rule is enforced by every surface's `allowed-tools` (no Bash); nothing needed moving to mechanism. No hooks or validators otherwise gate this plugin's outputs; the only deterministic net is the marketplace-level `check-version-prefix.mjs`, which is a release contract, not a runtime one.

5. **No eval pack** — `eval/targets/` has no `intelligence-briefing` entry, so the plugin has no regression net. Nothing needs cutting today, but if rewrites are ever applied here, step 1 of the apply loop (baseline `/eval-run`) is impossible as-is: either build a small golden set first or mark the change behaviorally unverified.

## Applied rewrites

Released as **v0.3.1** (2026-08-06). No capability constraints were cut — the audit found none.
Both edits close cross-surface seams where two surfaces described the same thing differently;
neither changes runtime behavior.

| # | Change | Files | Status |
|---|--------|-------|--------|
| 1 | Skill frontmatter `name` aligned to the directory and the commands' references | `skills/environmental-briefing/SKILL.md:2` | Accepted, applied |
| 2 | Grace window named in CONFIGURATION with its 6-hour default; CADENCE now reads "the configured grace window" | `skills/environmental-briefing/SKILL.md:28`, `SKILL.md:232` | Accepted, applied |

**Impact notes.**

- *Change 1* preserves nothing behavioral — the runtime resolves the skill by directory, so
  invocation is unaffected on both surfaces. Seam check: the three call sites (`brief.md:8`,
  `intel-setup.md:6`, `intel-setup.md:21`) already used the directory name, so they were
  already correct and needed no edit. No mirror moved.
- *Change 2* preserves the intent (recover items a skipped run missed) and removes an
  information gap, not an assumption. Seam check: the value's source of truth stays
  `templates/CLAUDE.md:51`; the skill now points at it rather than restating a vaguer version.
  No third reader of this field exists.

**Verification.** `node dev/scripts/check-version-prefix.mjs` green across all four version
mirrors; `claude plugin validate ./intelligence-briefing` and `claude plugin validate .` both
pass. Changed surface re-audited against this skill's test (see the SKILL.md section header).

**Behavioral verification is absent** — the plugin has no eval pack, so neither the baseline
(`/eval-run` before) nor the regression check (after) could run. Both changes are low-risk by
construction: one is an identifier that the runtime does not use for resolution, the other adds
a default the template already shipped. Neither touches triage, classification, the evidence
bar, or rendering. If a regression net is ever wanted here, a small golden set would need
building first.

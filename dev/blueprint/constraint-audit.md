# Constraint audit — blueprint

## Provenance

- **Date:** 2026-08-06
- **Commit:** `df7f0c0` (worktree dirty: untracked `dev/researcher/w6ab-design.md`, `researcher/reference/templates/decision-ledger.md` — neither touches blueprint)
- **Scope of this run:** full plugin audit (all four surfaces + integration pass)
- **Surfaces inventoried:** `skills/blueprint-capture/SKILL.md`, `skills/blueprint-discover/SKILL.md`, `skills/blueprint-design/SKILL.md`, `skills/blueprint-guide/SKILL.md`; `commands/blueprint/{capture,design,discover,guide}.md`; `reference/{README,blueprint-template,example-blog-content-blueprint,design-doctrine,discovery-sweep,process-inventory-template}.md`; `templates/CLAUDE.md`; `.claude-plugin/plugin.json` (execution settings)
- **Evidence read, not audited:** `blueprint/AGENTS.md`, root `AGENTS.md`, `CHANGELOG.md`, root `README.md` (rule provenance, mirrored contracts); `eval/targets/{blueprint,blueprint-design,blueprint-discover}/gates.json` in full and `rubric.md`/`principles.md` via targeted search (seam check for encoded fossils)
- **Exclusions:** `.DS_Store` noise files; eval `_eval/` iteration history; full text of eval `rubric.md`/`scenarios.jsonl`/`adapter.md`/`coverage.md` (seam-checked for batch/sequence/staleness expectations only, not line-audited)
- **Execution settings:** no `model:` pins anywhere; `allowed-tools: Read, Write, Edit, Glob, Grep` on all eight skill/command files; no hooks, no subagents

## Verdict

**Clean of capability constraints across every inventoried surface at `df7f0c0`.** No instruction was found that would cap a more capable model — the plugin's dense process rules sort as product-method or intent essentially throughout, and the deterministic eval gates encode locked intent, not fossils. What the audit did find: one staleness drift family on the guide surfaces (pre-0.3.0 "three jobs" wording surviving in two descriptions), one minor doc drift in `templates/CLAUDE.md`, and one borderline sequencing line in capture with an optional intent-preserving rewrite.

---

## Surface: blueprint-capture (audited at `df7f0c0`)

Covers `skills/blueprint-capture/SKILL.md`, `commands/blueprint/capture.md`, `reference/blueprint-template.md`, `reference/example-blog-content-blueprint.md`.

### Findings

1. **"Ask in small batches. Two to four questions at a time, then stop and wait."** — `SKILL.md:60-61` (family: `blueprint-discover/SKILL.md:47-48`, `blueprint-design/SKILL.md:44`). Source: **product-method**. Pile: **intent — keep**. Evidence: observed + history-backed. The numeric bound paces the *operator*, not the model — the eval's Batch Discipline dimension scores it as held "even when the user asked for the whole list," which is an operator-experience commitment, and `AGENTS.md` states the interview rules are the product. Survives any upgrade: a smarter model still shouldn't questionnaire a human.

2. **"Work through these areas in order."** — `SKILL.md:109`. Source: **product-method**. Pile: **borderline — keep, optional rewrite as intent**. Evidence: inferred. The interview arc (purpose → trigger → steps → …) is designed, and the one load-bearing dependency is stated separately (`:133-134`, risk answers feed ratings). But "in order" read literally can fight the anchor-in-a-real-run rule when an operator narrates out of sequence — coverage is the requirement; the arc is the default. Proposed rewrite below.

3. **"come back to it once before you move on."** — `SKILL.md:69-71`. Source: **product-method**. Pile: **keep**. Evidence: observed. Not a re-ask ritual — it calibrates persistence (one circle-back, not zero, not nagging) in service of the "a step with no reason can't be executed" bar.

4. **"create it with the Write tool — never shell."** — `SKILL.md:22-23` (family: `blueprint-discover/SKILL.md:27-28`, `blueprint-design/SKILL.md:27-28`). Source: **external-contract** (Cowork surface parity; Bash absent from `allowed-tools`). Pile: **keep**. Evidence: observed. Already mechanized by `allowed-tools`; the prose clause explains the intended path rather than adding a constraint. Goes away only if the surface-parity decision in `AGENTS.md` ("Surface differences: None") changes.

5. **Non-invention family** — flag-unknowns (`SKILL.md:82-84`), don't-sharpen incl. threshold-edge (`:85-98`), operator's-language-at-write-time (`:165-171`), honest-gap-beats-invented-step (`:172-174`). Source: **user-intent / product-method**. Pile: **keep — load-bearing**. Evidence: history-backed (eval iteration-1 scored the quiet-sharpening kind 2/3 on both representative scenarios; `AGENTS.md` names it the edit that breaks the product). This is the plugin's spine, not scaffolding.

6. **Register family** — machinery-backstage (`SKILL.md:99-105`), document-must-not-narrate-the-interview (`:177-190`), delete guidance comments (`:188-189`; template `:14-20`, `:47-48`, `:105`, `:119-121`). Source: **product-method** (audience of the artifact) . Pile: **keep**. Evidence: history-backed (eval Register 1.9/3 at iteration-1; `no_sweep_narration` / `no_design_narration` lints mechanize the sibling rules). Voice/register rules are the author's.

7. **Completeness sweep before writing** — `SKILL.md:191-202`. Source: **product-method**. Pile: **keep**. Evidence: history-backed (added 0.1.1 for a real gap-class). Upgrade-survival test passes: it defines the quality bar — "a blank you never circled back to is a gap you created" — which is interview craft, not a memory workaround. The closing parenthesis (never invent to close the blank) ties it back to the spine.

8. **Checkpoint-negotiation rule** — "put a real alternative on the table" `SKILL.md:152-160`. Source: **user-intent**. Pile: **keep**. Evidence: observed. This is the opposite of a capability constraint: it demands judgment (propose the proportionate middle, name the residual risk) rather than a rote "no."

9. **Validation + automation-plan gates** — decline-to-simulate-stakeholder (`SKILL.md:234-237`), Step 6 gate with recorded waiver (`:243-256`). Source: **safety-governance / product-method**. Pile: **keep**. Evidence: history-backed (0.2.1; `adv-automation-before-validation` golden; `status_honest` gate). Human gates on judgment-owned steps are the author's; the waiver path already gives the operator the override, recorded.

10. **Inventory write-back, candidate-scoped** — `SKILL.md:205-212`. Source: **external-contract** (shared state file; `inventory_updated` gate; discover's never-overwrite rule is the other side of the contract). Pile: **keep**.

11. **Template-changes-additive rule** (via `reference/README.md:8-9`, `AGENTS.md`). Source: **external-contract** (existing user deployments). Pile: **keep** — doesn't dissolve on a smarter model.

12. **"Run the `blueprint-capture` skill and follow its steps exactly."** — `commands/blueprint/capture.md:6`. Source: **product-method** (thin-wrapper architecture; doctrine lives once). Pile: **keep**. Trivial note: `guide.md:6` says "follow it" — inconsistent phrasing, no behavioral difference, no action needed.

### Proposed rewrites

- `SKILL.md:109`, replacing "Work through these areas in order. In **quick mode**…":

  > Cover these areas — the sequence below is the designed arc, but follow the operator's narrative when they jump ahead, and come back for what the detour skipped. In **quick mode**, cover areas 1-3 and 7 at coarse grain plus a first-cut autonomy rating per step. In **deep mode**, cover all eight. The one hard ordering rule: area 8's risk answers feed the autonomy ratings — have them before you rate.

### Still under-specified

- Nothing material. The outcome, boundaries, and bar (the worked example) are all stated — this surface does not exhibit the rich-in-process/poor-in-intent twin failure.

---

## Surface: blueprint-discover (audited at `df7f0c0`)

Covers `skills/blueprint-discover/SKILL.md`, `commands/blueprint/discover.md`, `reference/discovery-sweep.md`, `reference/process-inventory-template.md`.

### Findings

1. **"Two or three memory surfaces at a time" / "Stop when nothing new surfaces. Two or three quiet surfaces in a row means you're done."** — `SKILL.md:47-48`, `:60-62`; `discovery-sweep.md:44-47`. Source: **product-method**. Pile: **keep**. Evidence: observed. Deliberately anti-completeness — "an exhaustive sweep is its own annoying chore" states the why in-line. Not a chunking workaround: the small batch paces the operator's recall, and stop-when-dry *is* the product's definition of done.

2. **"Lead with artifacts and tool traces… reach for those later, not first."** — `SKILL.md:49-53`; `discovery-sweep.md:20-24`. Source: **product-method** (least-idealized-cues-first is the anti-idealization design). Pile: **keep**.

3. **Recognize-don't-sharpen / no-boundary-invention** — `SKILL.md:56-58`, `:91-94`; `discovery-sweep.md:49-65`. Source: **user-intent / product-method**. Pile: **keep — load-bearing** (the capture non-invention rule one layer earlier, per `AGENTS.md` locks).

4. **No autonomy ratings at discovery** — `SKILL.md:77-81`; `discovery-sweep.md:67-73`; template `:26-27`. Source: **product-method**, mechanized by the `no_autonomy_ratings` lint. Pile: **keep — locked**.

5. **"If an inventory already exists there, read it first and update it — never overwrite."** — `SKILL.md:29-31`. Source: **external-contract** (living shared state; capture's write-back reads/edits the same file). Pile: **keep**.

6. **Three lenses, three recommendations, no magic score** — `SKILL.md:108-119`; `discovery-sweep.md:75-99`. Source: **product-method** (keeps Blueprint from re-narrowing to an automate-chores tool). Pile: **keep**.

### Proposed rewrites

None.

### Still under-specified

- Nothing material.

---

## Surface: blueprint-design (audited at `df7f0c0`)

Covers `skills/blueprint-design/SKILL.md`, `commands/blueprint/design.md`, `reference/design-doctrine.md`.

### Findings

1. **Grounded proposer** — "every proposal must be built from the operator's real goal and constraints and their nearest analogous process — never from generic best-practice" — `SKILL.md:45-47`, `:17-20`; `design-doctrine.md:18-34`. Source: **product-method**. Pile: **keep — load-bearing**. Evidence: observed + eval-guarded (`adv-generic-fill`). This is the anti-fabrication spine in its most-tempted setting; it constrains *what counts as grounded*, not what the model is trusted to do.

2. **Constraint non-invention** — `SKILL.md:48-50`; `design-doctrine.md:36-44`. Source: **user-intent**. Pile: **keep** (`adv-invent-constraint` guards it).

3. **Proposed / Rests-on / Breaks-if labelling** — `SKILL.md:51-52`, `:79-90`; `design-doctrine.md:46-60`. Source: **product-method**, mechanized (`designed_status`, `steps_proposed` gates). Pile: **keep**. "A step whose Rests-on would be 'general knowledge' is not grounded — turn it into an open question" is a crisp intent statement, not hedging.

4. **Conservative ratings + double gate (validated *and* run)** — `SKILL.md:93-99`, `:115-117`; `design-doctrine.md:62-70`. Source: **safety-governance / product-method** (`adv-automate-the-unproven` guards it). Pile: **keep**.

5. **Route-to-capture hard stop** — "If they already run something like it… Point them at `/blueprint:capture` and stop." — `SKILL.md:34-38`. Source: **product-method** (the design/capture line is the reason both exist; `adv-already-runs-it` guards it). Pile: **keep**.

### Proposed rewrites

None.

### Still under-specified

- **Routing when the process exists but the operator has never personally run it** (a colleague runs it today; the operator is inheriting it). Design Step 1 asks whether "the operator (or anyone they know)" has run it — which routes this case to capture — but capture's anchor is *the operator's own* most recent real run, which doesn't exist for them. Is the intended answer "capture, interviewing the colleague / using the colleague's run," or "capture with the operator relaying secondhand," or something else? One line in design's Step 1 (or capture's Step 1) would close it. *(Labeled suggestion, not fact — the author may already consider secondhand capture acceptable.)*

---

## Surface: blueprint-guide (audited at `df7f0c0`)

Covers `skills/blueprint-guide/SKILL.md`, `commands/blueprint/guide.md`.

### Findings

1. **Stale "three jobs" wording (drift family)** — skill frontmatter `SKILL.md:3`: "Explains the three jobs — discover, quick capture, deep capture — and routes the user… based on whether they can already name a process"; command `commands/blueprint/guide.md:2` and `:8`: same three-job framing. Source: **product-method (stale)**. Pile: **rewrite** — not a capability constraint, but pre-0.3.0 wording that survived the design release. The skill *body* (`SKILL.md:20-45`), root `README.md`, `AGENTS.md`, and the CHANGELOG all say four jobs, routed on two questions (can they name it; do they already run it). The frontmatter description is also a routing/triggering surface, so the drift is user-visible. Evidence: observed.

2. **Body content** — four-jobs orientation, two-questions routing, "Don't dump this whole file at them," "Don't re-explain what that skill will do — just start it" (`SKILL.md:9-11`, `:63-77`). Source: **product-method**. Pile: **keep**. The don't-dump and just-start-it lines are register/handoff intent, not model management.

### Proposed rewrites

- `skills/blueprint-guide/SKILL.md:3` (description), keeping the trigger phrases intact:

  > This skill should be used when the user asks how Blueprint works, where to start, which mode to use, what the difference between discovery, design, and capture is, or what they should document first (e.g. "how does blueprint work", "where do I start", "quick or deep?", "what should I capture first", "what can this do"), or runs /blueprint:guide. Explains the four jobs — discover, design, quick capture, deep capture — and routes the user to the right entry point based on whether they can name the process and whether they already run it.

- `commands/blueprint/guide.md:2` (description):

  > How Blueprint works and where to start — the four jobs (discover, design, quick capture, deep capture) and which one you need

- `commands/blueprint/guide.md:8-10` (body):

  > Give the user a short orientation to Blueprint's four jobs — discover, design, quick capture, deep capture — and route them to the right entry point based on whether they can name the process and whether they already run it.

### Still under-specified

- Nothing beyond the drift above.

---

## Surface: config & release surfaces (audited at `df7f0c0`)

Covers `.claude-plugin/plugin.json`, `templates/CLAUDE.md`, `reference/README.md`.

### Findings

1. **No model pins, no hooks, uniform `allowed-tools`.** Source: **external-contract** (surface parity). Pile: **keep**. The purest capability fossil (a `model:` pin) is absent everywhere.

2. **Version-prefix duplication** (`plugin.json:4` ↔ marketplace catalog entry, both `v0.3.0 — `). Source: **external-contract** (marketplace workaround), mechanized by `check-version-prefix.mjs`. Pile: **keep** — in sync at this commit.

3. **`templates/CLAUDE.md:10` names only capture as the `blueprints_dir` writer** — "where /blueprint:capture writes finished Blueprints." Source: **external-contract doc (stale)**. Pile: **rewrite (minor)** — discover writes `process-inventory.md` and design writes designed Blueprints to the same directory. Evidence: observed.

### Proposed rewrites

- `templates/CLAUDE.md:10` comment:

  > - blueprints_dir: blueprints/    # where Blueprint writes its outputs — captured and designed Blueprints, and the Process Inventory (relative to project root)

---

## Cross-surface findings (integration pass)

1. **"Three jobs" drift family** — `skills/blueprint-guide/SKILL.md:3` and `commands/blueprint/guide.md:2,:8` still carry the 0.2.x three-job framing while the guide body, root `README.md`, root `AGENTS.md`, and `CHANGELOG.md` say four. The 0.3.0 release updated the guide's body but not its two description surfaces. Rewrites above; apply together — they're one contract.

2. **Eval seam is fossil-free.** The deterministic gates (`no_autonomy_ratings`, `designed_status`, `steps_proposed`, `inventory_updated`, `status_honest`, narration lints) encode the locked intents, and the rubric's Batch Discipline dimension mirrors the 2-4 batch rule as an operator-experience commitment. Named mirrored contract: **if the batch rule or any locked vocabulary ever changes, the rubrics/gates must move with it by explicit product decision** — they are the other half of those rules.

3. **Shared-state contract is consistent both directions.** Discover's never-overwrite (`blueprint-discover/SKILL.md:29-31`) and capture's candidate-scoped write-back (`blueprint-capture/SKILL.md:205-212`) describe the same `process-inventory.md` contract without drift; the inventory template's Status comment (`process-inventory-template.md:32-33`) matches capture's write-back string shape.

4. **Routing asymmetry (deferrable).** `commands/blueprint/capture.md:10` routes can't-name → discover but doesn't mention the never-ran → design route that the skill's Step 1 performs; the design and discover wrappers each carry their one route. Since wrappers defer to the skill ("follow its steps exactly"), behavior is correct — harmonizing the capture wrapper is optional polish, not a defect.

5. **No contradictions found** between the four skills' shared vocabulary (Automate/Monitor/Human, the placement question, quick/deep timings, non-invention phrasing) — the doctrine-lives-once architecture is holding.

---

## Disposition

Rewrites 1 and 2 applied and released as **blueprint v0.3.1** (2026-08-06). Rewrite 3 and the wrapper harmonization were not accepted this pass and remain available.

| Rewrite | Status |
|---|---|
| Guide "three jobs" drift family (skill description + command) | **applied** — v0.3.1 |
| `blueprint/AGENTS.md` "What it is" three-jobs paragraph | **applied** — v0.3.1 (mirror found during apply; see note) |
| `templates/CLAUDE.md` writer comment | **applied** — v0.3.1 |
| Capture Step 2 "in order" softening | deferred (not requested) |
| Capture wrapper design-route harmonization | deferred (noted, optional polish) |

**Mirror found during apply.** The seam sweep at apply time turned up a third member of the drift family the audit had not listed: `blueprint/AGENTS.md`'s "What it is" paragraph still opened "Three jobs, three skills/commands" and omitted design from both the job list and the funnel line. It is maintainer guidance rather than a runtime surface — outside the audit's declared targets — but it is the same 0.3.0 fossil, and the apply loop's rule is that mirrors move together. Corrected in the same release.

**Verification status.** Baselines identified rather than re-run: blueprint iteration-6 (3/3 PASS), blueprint-discover iteration-2 (certified), blueprint-design iteration-1 (5/5 PASS). No re-run was performed because **no runtime instruction consumed by those three targets changed** — the release touched only the guide skill's description, the guide command, `templates/CLAUDE.md`, `AGENTS.md`, and version metadata. The guide surface has **no eval target**, so the description rewrite ships **behaviorally unverified**; adding a routing scenario (net-new work → design, already-run work → capture) would close that gap.

**Concurrency note — what actually happened.** At apply time another session was mid-release on `intelligence-briefing` in the same worktree, leaving its 0.3.0 → 0.3.1 bump in the three shared index files (`.claude-plugin/marketplace.json`, root `AGENTS.md`, root `README.md`). The intent was to commit blueprint's hunks only. Blueprint's hunks of those three files were staged via git plumbing (`git hash-object -w --stdin --path` to build blobs, then `git update-index --cacheinfo`), deliberately bypassing the working tree so the other session's uncommitted files could not be clobbered. The staged set was then verified clean: 10 files, blueprint only.

That verification did not hold. Between the check and `git commit`, the other session ran `git add`, and the pathspec-less commit took everything then staged. `ec65313` therefore contains **two releases** — blueprint v0.3.1 and intelligence-briefing v0.3.1 (`intelligence-briefing/.claude-plugin/plugin.json`, `intelligence-briefing/CHANGELOG.md`, `intelligence-briefing/skills/environmental-briefing/SKILL.md`, `dev/intelligence-briefing/constraint-audit.md`, and their shared index bumps) — under a message naming only blueprint. The content is correct and internally consistent for both plugins; the defect is attribution, and the `blueprint-v0.3.1` tag points at a two-release commit.

Two lessons worth carrying. First, **the git index is shared per-worktree across concurrent sessions, so a verified-clean index is not a guarantee — commit with explicit pathspecs.** Second, this failure was the loud version: the other session's `git add` restaged the full working-tree copies of the shared files, which is why both version bumps survived. Had the plumbing-built blobs landed last instead, the commit would have silently reverted their bump. One worktree per stream is the real fix.

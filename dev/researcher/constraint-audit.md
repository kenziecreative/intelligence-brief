# Researcher — constraint audit (/upskill)

**Provenance:** audit date 2026-08-06 · commit `636bc89` (worktree dirty: root AGENTS.md
modified, `.claude/skills/upskill/` + `researcher/skills/research-init/SKILL-daft.md`
untracked — SKILL-daft evaluated as a proposed rewrite, not as shipped surface) · scope:
**full plugin audit — all six surface groups audited + integration pass run** · six
parallel surface auditors + one integrating pass; per-section "not read" lists are the
uncovered claims · baseline for any apply step: v1.8.0, eval iterations 10–19 green.

> **Reading this after the map split (2026-08-25).** Every `ARCHITECTURE L<n>` reference below
> was written when one file held both the explanation and the maintainer's map. The layer
> numbers are unchanged and still resolve, but they now live in
> [MAINTAINERS.md](MAINTAINERS.md); `ARCHITECTURE.md` is the plain-language explanation and has
> no layers. These lines are left as written because they record what each auditor actually read
> on 2026-08-06, and a provenance list that gets edited later is not a provenance list. Treat
> substantive claims here as dated too: the "accepted gaps have no state" finding, for one, was
> wired by W2 in v1.11.0.

**Verdict: audited in full at `636bc89` — the plugin is not fossil-riddled; it is
unusually contract-dense and history-backed. The genuine capability pile is small and
specific (see PLUGIN VERDICT at the end), and nothing should be cut before the ten
consolidated author questions are answered.**

---

## Surface: research-review-corpus + corpus-reviewer agent + corpus-review-brief

Audited at `636bc89`. All three surfaces read in full, plus the frozen protocol, the
validator's `validate_receipt`, CHANGELOG v1.8.0, and four seam files.

**Surface verdict: clean within its dependency closure except two findings — one
unresolved cut candidate (the `opus` pin) and one rewrite-as-intent (step 10's
never-paraphrase mechanism) — plus one low-urgency move-to-mechanism candidate.** The
mass of prescription is protocol-mandated machinery or deliberate method: keep.

### Findings (grouped families)

1. **Protocol-mandated runner choreography** (SKILL.md:12–13, 38–46, 92–131, 206–246,
   250–255 etc.) — external-contract, **KEEP**, observed. Steps 1–9 are ~90% protocol
   transcription (§2, §2.3, §3, §4.2, §9); every prose schema rule checked is mechanized
   in `validate_receipt`. Residual scratch/metadata mechanics serve §2's "runner owns all
   execution metadata."
2. **Structural coldness** (SKILL.md:34–37, 139–149; brief:22–23, 39–41;
   corpus-reviewer.md:37–38) — product-method, **KEEP**, observed. Sampler independence
   is the product; the fixed closed prompt guarantees tier parity across a cross-family
   engine.
3. **"Work silently; report once"** (SKILL.md:50–57, 317–319, 333) — user-intent /
   register governance (posture doctrine; rubric 2-anchor), **KEEP**, history-backed.
   Polish note: stated 3× in one file; consolidation would lose nothing.
4. **Turn shape + mandatory sentences — SPLIT**, history-backed (eval iterations 15/17):
   - Content requirements (verdict is the sampler's never the gate's; remedies per
     finding; n/a checks named; unconditional gate-semantics close; ban on gate-state
     assertions — SKILL.md:277–315, 334) — **KEEP as intent**; this is what W7 exists
     for, and the rubric's Credibility Gate 0-anchor floors it.
   - The verbatim never-paraphrase ready-sentence device (SKILL.md:309–311) —
     capability-workaround, **REWRITE AS INTENT**: require the substance in the model's
     own words ("a sampler's ready does not open the gate; the gate verdict belongs to
     the validator"), keep the semantic ban on gate-state-shaped equivalents (the
     observed failure inverted meaning, not wording). Verdict-first ordering stays as
     report design; its "fails this skill" enforcement tone relaxes with the verbatim
     rule.
5. **Tool mechanics** (1800s budget, `< /dev/null`, `-s read-only
   --skip-git-repo-check` — SKILL.md:155–166) — external-contract with a third-party
   CLI, **KEEP**, history-backed (spike timings; documented stdin behavior). Retires
   only on a Codex behavior change, never a model upgrade.
6. **corpus-reviewer working method** (corpus-reviewer.md:73–79) — **KEEP**; already the
   model-agnostic form ("suggested, not mandated"; finite context is a resource reality).
   Promote the track-coverage-as-you-go sentence out of the "suggested" section — it
   serves the mechanized coverage-honesty contract.
7. **The brief** — external-contract/product-method, **KEEP wholesale**, observed. It
   must be self-contained for cold cross-family consumption; the triple mirror
   (protocol §3 / brief / validator) is by design with the validator authoritative.
   Any brief rewrite is a protocol-version event, not a style edit.
8. **`model: opus` pin** (corpus-reviewer.md:25) — capability-workaround *candidate*,
   **UNRESOLVED — ask the author**, inferred (no recorded rationale anywhere). Two
   readings: fossil (cut; receipts record the engine that actually ran, so provenance
   survives) vs deliberate quality floor for the gate's second sampler (real intent,
   currently unstated and expressed in the most brittle form). The eval never exercises
   the pin (adapter plays t2 in-context).

**Move-to-mechanism (low urgency):** the noclobber/hard-link shell tutorial
(SKILL.md:250–255) — the exclusive-create *requirement* is §2.3 contract (keep); its
enforcement could live in a small publish helper or validator mode.

### Still under-specified
1. The `opus` pin's intent — fossil or quality floor? (Blocks any edit to it.)
2. Who owns the 1800s timeout — protocol constant or runner-tunable calibrated budget?
3. If the verbatim ready-sentence relaxes, is the rubric anchor the sole intended floor,
   or should gate-semantics-reach-the-user get a deterministic check?

### Seam findings
- Eval floors the substance but **not** coldness, t1 mechanics, or the model pin
  (adapter is t2-only, in-context, with an honesty note) — edits there rely on live
  verification, not `/eval-run`.
- `review_receipt_validates` gate = the mechanical half already moved to mechanism.
- tools-guide.md:85–106 mirrors step 6's invocation mechanics — must move together.
- audit-claims closeout references the runner only via remedies; no drift.
- Receipt-schema triple mirror is deliberate; protocol freeze is the anti-drift.

---

## Surface: research-audit-claims

Audited at `636bc89`. Read: SKILL.md full, wrapper, gate hook + hooks.json, five
reference deps, protocol §9–10, ARCHITECTURE L2/3/6/7/9, CHANGELOG v1.5–1.8, git log
--follow. Not read (uncovered claims): validator source, project-scaffold standards
files, CHANGELOG <v1.5.

**Surface verdict: overwhelmingly intent and external contract — the densest accretion
is history-backed method, not fossil.** One genuine capability-workaround family
(blanket re-read rituals), one hard case unresolved (the model pin), one
rewrite-as-intent (FAIL-turn scripts), internal-mirror redundancy worth consolidating.

### The six adjudications
- **(a) `model: opus` pin** (SKILL.md:5) — **UNRESOLVED, ask.** History-backed to
  v1.4.1 as a deliberate plugin-wide tiering. The sharp version of the question:
  frontmatter `model:` is an override, not a floor — it *caps* a stronger session model
  as much as it floors a weaker one, and cannot express "most capable available." Is
  the pin protecting the gate from weak session models, or asserting the audit needs
  opus specifically? Plugin-scoped decision (nine other surfaces share the scheme).
- **(b) One-auto-re-audit bound + citation/substantive taxonomy** (364–381, 523–527) —
  **KEEP**, governance, history-backed (v1.6.0). The taxonomy is the human gate on the
  trusted tier (stop-list item 7 applied at the seam); cutting it fails the upskill
  autonomy check. Cosmetic: "a third will not change that" is capability-flavored
  phrasing on an intent rule.
- **(c) Scripted FAIL-turn phrasing templates** (377–379) — **REWRITE AS INTENT.** The
  three-branch distinction + never-claim-false-fixes (history-backed, 19dc621) are
  intent; the verbatim scripts are execution management and conflict with
  posture-register's own anti-absorbed-phrase doctrine. State what each branch's turn
  must convey; drop the quoted scripts.
- **(d) Step-numbered choreography** — **KEEP**; method definition, with the
  fussiest-looking orderings contract-serving (gate row before mv/120s window; drift
  before graph write; STATE before debrief — eval-encoded). Register rules already keep
  step numbers backstage.
- **(e) W7 closeout exit-code routing** (259–348) — **KEEP**, method + external
  contract, history-backed twice (the incident; v1.8.0). The conversational routing is
  judgment the validator cannot own; the mutation-free re-entry is load-bearing
  contract. Seam: mirrors frozen protocol §9 — a protocol bump moves both.
- **(f) Re-read rituals — SPLIT:** JSON-parse checks after machine-parsed writes = KEEP
  (external contract; move-to-mechanism candidate). Waiver three-loci re-read = KEEP
  (governance; real incident dec4b0d). Blanket "re-read every file you wrote"
  (564, 162) = **capability-workaround candidate, UNRESOLVED** — no recorded
  phantom-write incident found; per the skill's own rule, confirm the failure mode is
  extinct before cutting. Question: has written-but-absent ever actually been observed?

### Load-bearing keeps (families)
B1–B12 fixed battery + same-battery-every-pass (v1.7.0, incident-diagnosed — the
battery IS the method); pass/fail exactness + no-soft-passes; the whole waiver-protocol
family (user sovereignty, eval-golden-encoded); deliverable manifest (blind-review F4;
golden); override field-comparison (F6; golden); adjudication-ledger grammar (validator
parses it = external contract) + never-author/never-batch (governance); register rules;
gate-log row mechanics (verified against gate-outputs.sh field-for-field); mechanical
fixes applied without permission (proceed-by-default intent, 86e708e); fix hygiene.

### Still under-specified
1. The audit's outcome ("decision-readiness") is stated in CHANGELOG/ARCHITECTURE, not
   on the surface — should the skill say what the audit is *for*?
2. Severity: moderate-vs-low has no general definition; several classes have no stated
   severity.
3. 120s-window lapse recovery is implied (re-append + retry) but never stated.
4. The mv-bypasses-hook fact is stated; the obligation it creates (never mv into
   outputs/ outside the promotion sequence) lives only in ARCHITECTURE.

### Seam findings
Hook grammar verified consistent (one wording slip: step 1a says the hook "authorizes
the move" — the hook gates Write/Edit, not mv; 1b corrects it). Exit-code mirror with
protocol §9 consistent. **Count drift found: CHANGELOG says battery 71, protocol §10
says 74** — cosmetic, real, fix at next touch. Eval net encodes this surface densely
(any rewrite is regression-netted; changing those expectations needs a product
decision). claim-graph/canonical-figures ownership split respected. Wrapper mirrors
gate mechanics — moves with any gate change. Internal triple-mirror of the battery rule
is where future drift starts; consolidation is a rewrite-phase candidate.

---

## Surface: research-discover + research-process-source (the Collect pair)

Audited at `636bc89`. Read: both skills full, both wrappers, tools-guide,
workflow-ownership, posture-register, setup-paths.sh, registry template, CHANGELOG,
ARCHITECTURE L2–5, where-am-i.py; sampled one type-channel map + one channel playbook
(note: type-channel-maps has NO README). Not read: the other 10 maps / 5 playbooks —
uncovered claims.

**Surface verdict: overwhelmingly intent- and contract-dense with an unusually strong
fossil record (most rules trace to named blind-review findings and eval iterations). No
cuts on capability grounds.** Two unresolved author questions (the sonnet pin;
allowed-tools drift) and three real contract drifts found by the seam check.

### Key adjudications
- **(a) `model: sonnet` pin** (discover:5) — **UNRESOLVED, ask.** Dates to v1.3.0 with
  no recorded rationale; the plugin-wide distribution reads as deliberate cost tiering
  (sonnet = mechanical tier, opus = judgment tier). **But the job outgrew the tier:**
  since v1.6.0 discover drives the whole batch inline — including invoking *unpinned*
  process-source, so credibility assessment inherits discover's pin. Was the pin
  reconsidered when batch-driving moved in? Rule on the pair together.
- **(b) 5-source cross-ref cadence + counters** — **KEEP**, product-method,
  history-backed. Anti-accumulation-drift gate on durable state, not chunking; survives
  any model. Wrinkle: the mechanism says exactly **5**, the user-facing prose says
  **5–8** three times — one should own the number.
- **(c) Batch-approval human gate** — **KEEP, load-bearing** user-intent ([enforced],
  stop-list items 1–2). Note the shape: the same v1.6.0 passage that keeps the gate
  removed per-source re-asking — the repo's own model of a correct constraint.
- **(d) One-line-status turn prescriptions** — **KEEP**, user-intent (voice/UX),
  history-backed: the Register eval dimension went 0→3 *because* Output templates were
  rewritten; these lines are a measured fix, partially eval-encoded.
- **(e) NO-TodoWrite / no-subagent rules** — **KEEP the rule** (product-method:
  where-state-lives reasoning survives any model), **flag the 6× repetition** across
  two files as a consolidation candidate (repetition is the hedge, not the rule).
- **(f) 3-tier CLI fallback chain** — **KEEP**, external-contract (tool availability,
  credit budgets, rate limits, PATH/pre-allow matcher contract, sticky per-source
  fallback semantics). "Read playbooks at execution time" guards curl/header contract
  data, not model memory — keep.
- **(g) Note schema + registry row** — **KEEP, schema is contract**: every field has a
  named downstream parser (where-am-i.py, cross-ref origin clustering, check-gaps 5a,
  the 1.5.0 drift lint's nine pinned contracts).

Other keeps: stale-phase check 1a (v1.8.0 final-phase carve-out); 8-per-channel cap
(protects the gate's reviewability); exclusion ledger record-never-restrict (blind F3);
per-run citation floor (the house style for converting a rigid filter into stated
judgment); access-failure hand-back; recovery matrix (blind F8). Write-verification
re-reads on checkpoint counters: KEEP (real v1.6.0 desync incident) but
**move-to-mechanism candidates** (a counters/candidates consistency checker).

### Seam findings (three real drifts)
1. **discover `allowed-tools: [Bash, WebSearch, Read, Grep, Glob]` omits Write/Edit**
   while steps 6/6a/7 write three files (wrapper has them). Drift or
   Bash-routed-writes-by-intent? Ask.
2. **Registry header drift:** process-source creates `| # | Name | … | Note file |`;
   the init template ships `| # | Source | … | Note File |`. Two canonical headers for
   a parsed file — converge.
3. **process-source description + wrapper say notes go under `research/sources/`; the
   body and every reader use `research/notes/`.** The description is the drifted mirror.
Also verified consistent: [PROCESSED] grammar chain (load-bearing down to punctuation —
where-am-i.py's regex), retrieval-log schema, Tier-3 banner. Cosmetic: duplicate step
"2" numbering; wrapper's "highest tier" wording.

### Still under-specified
Pin intent (a); allowed-tools intent; 5 vs 5–8 cadence ownership; canonical registry
header; query latitude within a channel (one templated query or judgment?); confirm
`research/notes/` is intended.

---

## Surface: research-init (+ SKILL-daft.md promotion verdict)

Audited at `636bc89`. Read: SKILL.md (995 lines) full, wrapper, six templates, 2 of 11
type templates, targeted validator sections (PROTOCOL_LINE_RE / PHASE_LINE_RE / STEP_RE /
transition), both prompt-template guides, seam greps in audit-claims / process-source /
discover, eval adapter, AGENTS/CHANGELOG/ARCHITECTURE L1–3. Not read: other 9 type
templates, evidence-failure-modes, posture-register, eval fixtures — uncovered claims.

**Surface verdict: heavily process-shaped; most of it is intent or hard contract — but
it carries a genuine model pin, a menu-first intake the author already flagged for
rework (CHANGELOG v1.3.1's own words), double-read rituals, numeric phase-count anchors,
and a /clear regime built on context-limit assumptions.**

### Cuts / rewrites (capability pile)
- `model: opus` (SKILL:5) — **CUT**, history-backed (no rationale ever recorded);
  `disable-model-invocation: true` is the safety rail and stays. Daft cuts it: correct.
- Menu-first 11-type intake (:85–103) — **REWRITE AS INTENT**, history-backed by the
  author's own v1.3.1 fossil marker; daft's inferred-profile intake is the sanctioned
  direction. "One at a time — don't stack" (:83) — cut with it.
- Read-ritual family (:137, :204) — **REWRITE AS INTENT**: the outcome (no supplied
  material silently omitted; provenance boundary) survives any model; the pagination
  choreography doesn't. Keep the unreadable-file stop-and-ask (user gate).
- Second full re-read before plan generation (:303, :326) — **CUT** on the inline path
  (redundant in the same context); stays only if subagent delegation stays.
- Inline/subagent hedge (:293; mirrored AGENTS.md:32/58) — **REWRITE AS INTENT**
  (surface parity); resolve the delegation question explicitly.
- Numeric phase-count prescriptions (:349–359 + types/*.md "Phase Pattern" mirrors) —
  **REWRITE AS INTENT** (count is an output of decomposition; the type templates already
  say "adapt"); both sources move together.
- Per-phase "Phase cycle:" reminder (:401, :405) — **CUT** (nothing parses it; the cycle
  is enforced by STATE/CLAUDE/skills).
- Context-clear regime (:630–683) — **REWRITE AS INTENT** for the mandate
  (durable-state-before-any-boundary is the contract; resets optional); **CUT** the
  numeric triggers (~50% context, >3000 words, >15 pages, >50KB); **UNRESOLVED** whether
  the phase-boundary clear stays the recommended default — author's call. Largest seam
  of the audit.
- Cross-ref cadence quintuplication with drift (5 vs 5–8 across five surfaces) —
  **MOVE TO MECHANISM**: one owner (process-source pre-check + where-am-i.py constant),
  everyone else references it.

### Load-bearing keeps (verified against enforcers)
Fresh-project guard + wrapper mirror (safety); Step 0b adoption exits (validator
literal); protocol kit verbatim-copy/hash/self-test (trust contract); SC-N bold-form
rules (criteria-drift check); **STATE template parsed tokens verified against the
validator's regexes and where-am-i.py's greps — daft's template conforms
token-for-token**; final-phase hand-completion prohibition; outputs-gate artifacts
(120s hook contract + honest Cowork caveat); Write-not-mkdir / Read+Write-not-cp
(permission surface); additive settings merge; AskUserQuestion >4-options trap
(history-backed — keep a residual note even after the menu goes); Subject Identity
non-invention rules; digest structure + "(none found)" completeness; evidence-standard
compile + waiver semantics; the whole workflow-enforcement block (phase-sequential,
never skip/fold/reorder without approval — the product's method); commonplace contract;
phase-table report mandate (observed arrow-chain failure); Verify step + integrity
check 8 options; wrapper allowed-tools.

### SKILL-daft.md verdict: **PROMOTE WITH AMENDMENTS**
The daft does NOT miss the v1.8.0 protocol kit (Step 0b, 3a-3, SC-N, exit-12 verify,
validator-owned closeout all present and correct) and its big cuts all pass the test.
Nine amendments before promotion:
1. **Remove pasted citation debris** (daft:367 "projectmanager+1", daft:383
   "reforge+1") — web-source artifacts embedded mid-sentence.
2. **The new plan sections (Background/Hypothesis/Expected outcomes/Limitations &
   ethics) are unattributed imports from a generic research-proposal template** — get an
   explicit yes from the author or drop them (upskill forbids invented standards).
3. **Restore the six audience-calibration anchors** (daft over-cut author intent — they
   are commissioned evidence standards; keep as non-binding anchors under the
   derive-from-stakes rule).
4. Name the cadence owner concretely (not "the active source-processing protocol").
5. Resolve the delegation question explicitly (incl. AGENTS.md:32/58 mirrors).
6. Keep a residual AskUserQuestion 4-option note.
7. **Extend the promotion note's seam list**: it misses prompt-templates-guide.md
   Example 4 + intra-phase-clear rules block, audit-claims:507 `/clear` transition, the
   wrapper's "user's chosen project type" wording (contradicts inferred profiling), and
   discover's parse of new strategy.md fields (Routing basis / Secondary lenses).
8. **No regression net exists for init** (the eval adapter deliberately never runs it) —
   offer a targeted runtime scenario or ship marked behaviorally unverified; note
   template edits still ripple into eval scaffolds.
9. Strip the draft header; run the full release loop at apply time.

### Still under-specified (author questions)
Phase-boundary clears: recommended default or genuinely optional? · Secondary-lens
routing now or primary-type-first? · The imported plan sections: wanted? · Delegation:
keep or delete? · Synthesis-output trio → "commissioned deliverable only": all types or
only the three whose descriptions already contradict the trio? · Cadence: 5 or 5–8? ·
Init-continuation correction flow (daft:1092–1098): intended new behavior?

### Seam findings
STATE template ↔ validator ↔ where-am-i.py ↔ eval adapter ↔ closeout ↔ sentinel readers
(the parsed-token contract, enumerated); /clear removal touches two prompt-template
guides + audit-claims:507 + workflow-ownership (descriptive mentions stay); phase ranges
live in two sources; wrapper description sync (AGENTS rule); cadence numerals span five
surfaces + prompt-templates-runtime Example 1; synthesis-output change is absorbed by
audit-claims' manifest reader but eval fixtures may encode the old trio — check before
applying.

---

## Surface: research-cross-ref + research-check-gaps + research-summarize-section

Audited at `636bc89`. Read: all three skills + wrappers full, seven reference docs,
cross-reference template, targeted audit-claims seams, ARCHITECTURE L1–4/8, CHANGELOG,
git history. Not read: type-template bodies, generated source-standards, playbooks —
uncovered claims.

**Surface verdict: clean of classic capability constraints within the closure — the
process density is method-as-intent, mostly history-backed by named commits and eval
goldens. Four real findings:** one doctrine contradiction (the audit's standout), two
move-to-mechanism candidates, one execution-settings gap. Plus mirrored-text drift.

### The standout — F3.10, summarize-section Output contradicts the posture doctrine
":193–195 'Confirm the draft was written to research/drafts/, integrity-checked…'"
instructs precisely the machinery narration posture-register bans — its own "Wrapping
up" Before-example is this instruction executed. summarize-section is the **only
composing surface with no Register pointer**: verified via `git show --stat` that it was
not in the `56f6a86` register-fix set, despite CHANGELOG:163 claiming "every skill that
composes a user-facing turn now points at the doctrine." The repo's own eval
(iteration-3, Register 0 in 15/23 runs until Output templates changed) proved a doctrine
file cannot override an explicit Output instruction. **Rewrite as intent** (add the
pointer; reword to report standing, not steps), and mark the verbatim gate-block scripts
in pre-checks 3/5 as "must convey" content contracts rather than scripts. Open question:
was summarize-section the deliberate control skill in the experiment, awaiting its fix?

### Move-to-mechanism candidates
1. **Resolution-record grammar (strongest in this audit):** the
   `suggested_resolution`/`user_resolution`/`user_override` schema is parsed by
   audit-claims B10 but exists only as prose stated ~7× across three skills — **the
   template carries no record grammar at all** (verified: zero matches), which is
   exactly why an eval runner once had to interpret a prose-form record. Define the
   grammar in the template (± a small validator beside validate-corpus-review.py),
   collapse the prose to one statement + pointer. The derived-override rule (field
   arithmetic, never the flag) is intent — keep its substance wherever the grammar
   lands.
2. **STATE re-read-verify rituals** (cross-ref step 10, check-gaps step 8): the
   outcome contract is intent (history-backed live failure cf06fd3); the prose ritual is
   mechanically checkable — where-am-i.py already computes position. Confirm mechanism
   before removing prose.

### Execution-settings gap
Summarize-section's wrapper `allowed-tools` omits the agent-dispatch tool while the
skill *mandates* dispatching research-integrity (step 9) — verify allowed-tools
semantics, then add the tool or record why not. (Inferred; not observed failing.)

### Model pins (×3, cross-ref/check-gaps/summarize) — KEEP with one question
Deliberate judgment-tier scheme (history-backed to the migration); `opus` is a floating
tier alias, not a versioned pin, so it doesn't decay into the classic fossil. The
refined author question: **is the intent "always opus, even overriding a stronger
session default," or "at least this tier"?** Frontmatter can only express the former.

### Load-bearing keeps (families, compressed)
Materiality two-test split + immaterial auto-resolve (committed product decision
86e708e); Echo/shared-origin + independence-defaults-unknown (the epistemic spine —
constrains what counts as evidence, not how the model thinks); saturation thresholds as
signal *definition*, advisory-by-design (Seam 1 recorded, not fixed); 2-test coverage
verdict (the Assess step's decision criterion — cutting it is the twin failure);
candidate-disposition rule (golden-encoded; its fuzzy-matching prose is a *data-model*
workaround — add a stable join key to the registry/candidates schema, then collapse);
counter-evidence gate + adverse-search valve (Seam 4 type-limit is W4's work — not
audited away); M&L five-element structure (mirror with audit-claims 5b — moves
together); qualifier/range preservation (counters stochastic compression — stays on any
model); overwrite check with named options; integrity auto-invocation +
verify-real-result (orchestration-failure defense); anonymization (safety, D3);
register pointers where present (56f6a86's eval-proven fix); exclusion
ledger/unselected-remainder (golden-encoded); dashboard/▶ NEXT blocks
(prompt-templates-runtime contract).

### Seam findings
Resolution-record grammar (above); M&L mirror; strength vocabulary defined in
check-gaps, referenced by phase-insight; gaps.md read by start-phase, lopsided flags by
summarize pre-check 6; **filename drift: `cross-references.md` (plural) in cross-ref's
wrapper + skill description vs canonical singular everywhere that executes**; template
dashboard drift (3-row template vs ~10-row skill mandate — template misleads as
schema); core-contradiction gate mirrored (cross-ref g6 ↔ summarize pre-check 3);
freshness band "5–8" mirrored in init's CLAUDE.md template.

### Still under-specified
Pin intent (override vs floor); **accepted gaps have no state** (guide says
"acknowledged" gaps are acceptable; nowhere records acknowledgment — ARCHITECTURE's
"accepted-gap protocol, unwired"); the 5–8 band's owner and ceiling; was
summarize-section the deliberate register-fix control?

---

## Surface: progress + start-phase + phase-insight + graph-analysis + research-integrity + hooks + all wrappers

Audited at `636bc89`. Read: four skills, the integrity agent, all four hooks, all 12
wrappers in full; evidence incl. protocol §6–10, where-am-i.py parse core, drift-lint
config. Not read: prompt-templates-runtime, posture-register, reference guides —
uncovered claims.

**Surface verdict: clean of instruction-text capability constraints within the closure
— the W7 sentinel machinery, enumerated checks, and format prescriptions sort as method
or external contract.** Open: five unresolved pins (one author question), one
write-ownership description drift, one internal contradiction, a wrapper-drift family.

### The five sonnet pins — one family, one question
progress / start-phase / phase-insight / graph-analysis / research-integrity, all from
the v1.3.0 migration commit, zero recorded rationale. Systematic-looking tiering
(support→sonnet, judgment→opus) but nothing on record says deliberate. **Ask:** standing
cost/latency tier or migration default? Per-surface severity: **research-integrity is
the sharpest tension** (the independent checker of opus-tier output runs on the support
tier; independence ≠ smaller model per ARCHITECTURE L5); start-phase second (relevance
judgment + digest generation); phase-insight/progress moderate; **graph-analysis is the
wrong question — its metrics are a deterministic algorithm executed in prose:
move-to-mechanism (the where-am-i.py pattern), pin moot.**

### Real defects found
- **start-phase write-ownership drift:** description + wrapper say it "marks the next
  phase active in STATE.md" — the body's two-writes rule forbids that, and audit-claims
  owns the advance. Trigger text teaching a forbidden write: rewrite both.
- **start-phase internal contradiction:** ":103 'the only write'" vs ":191 'two
  writes'" — :103 is a pre-1.5.0 fossil; rewrite.
- **graph-analysis wrapper:** grants Write/Edit to a self-declared read-only skill AND
  misdescribes the mechanism ("builds the dependency graph" — it reads
  audit-claims-written claim-graph.json and computes degree). Tighten + rewrite.
- **research-integrity persona line** ("You are a seasoned research methodologist") —
  expert-persona incantation: cut/rewrite as role definition. The voice lines after it
  ("your silence is approval") are intent: keep.

### Verified non-findings worth recording
- Integrity's exact flag formats ("NUMBER NOT IN SOURCES: …") — **verified parsed by
  nothing** (gates, hooks, drift-lint, rubric machinery). Not schema; still KEEP as
  product-method: a fixed enumerated battery counters stochastic check selection
  (the 1.7.0 lesson); sentence templates could loosen to label+fields, optional.
- Progress health checks 1a–1e — external contract with the shipped hook deployment
  (the 1.5.0 phantom-deployment fix); move-to-mechanism candidate, low priority.
- Both sentinel readers' exit-code routing — verified verbatim against protocol §9/§6.4.
- Hooks — **the move-to-mechanism pattern done right; all KEEPs.** Gate-log grammar
  verified field-for-field against audit-claims' prescribed row. Two undocumented magic
  numbers (120s gate window, 300s staleness) — keep, document rationale in headers.
- Phase Tier Record / commonplace Working-Read / gate-log seams all hold.

### Wrapper/description drift family (grouped; all rewrite, observed)
cross-references (plural) in cross-ref wrapper + skill description; `research/sources/`
in process-source wrapper + description (notes go to `research/notes/`); start-phase
pair above; graph-analysis pair above; discover's allowed-tools missing Write/Edit (the
1.5.0 "declare your real write surface" fix never reached it); summarize-section
wrapper missing agent dispatch (from the synthesis audit).

### Still under-specified
Pin policy (the one blocking question); what sized 120s/300s; is "up to 3" commonplace
entries a UX budget; are graph-analysis thresholds calibrated; should
research-integrity's remit state its Seam-0 boundary (no note-vs-original verification)
so a capable model doesn't helpfully overreach into the unbuilt evidence architecture?

### Out-of-scope latent bug (flagged, not ruled)
setup-paths.sh's nvm line uses `ls | tail -1` — lexicographic sort mis-picks v9 vs v10.

---

## Cross-surface findings (integration pass)

Run over all six surface sections at `636bc89`; every surface section current.

1. **The model-pin scheme is one product decision, not ten local ones.** Ten pins, all
   from the same migration commit, zero recorded rationale anywhere. Three sub-cases:
   (a) judgment-tier opus pins — floor-vs-override intent (frontmatter can only express
   override; a stronger session model gets downgraded); (b) support-tier sonnet pins —
   cost tiering vs default, sharpest on research-integrity and on discover (whose pin
   silently governs unpinned process-source during inline batches); (c) graph-analysis —
   mechanize the metrics and the pin question dissolves. **One author answer settles all
   ten.**
2. **The register doctrine is eval-proven but incompletely deployed, and scripted turns
   are its recurring enemy.** 56f6a86 fixed Output templates because the doctrine file
   alone measurably failed; summarize-section was missed (live contradiction, the
   audit's clearest fossil). The same family recurs as verbatim turn scripts in
   audit-claims' FAIL branches, review-corpus's ready-sentence, start-phase's scripted
   prompts. **One rewrite pattern fixes all: scripts → "must convey" content contracts,
   with eval anchors holding the substance floor.**
3. **The cross-ref cadence has no owner.** "5" (mechanism: process-source pre-check,
   where-am-i.py, STATE template) vs "5–8" (prose: discover ×3, init's CLAUDE template,
   prompt-templates-runtime) across seven surfaces. Pick the number's owner; everyone
   else references it.
4. **Schema-in-prose is the plugin's biggest mechanization opportunity** (the repo
   already owns the pattern): resolution-record grammar (parsed by B10, defined nowhere
   — strongest); registry join key + dual canonical headers; STATE-consistency check
   (retires the re-read rituals); exclusive-create publish helper; progress health
   checks; graph-analysis metrics.
5. **Trigger surfaces lie in places the bodies don't.** Grouped drift family across six
   wrapper/description pairs + start-phase :103 + the CHANGELOG-71-vs-protocol-74
   battery count. All mechanical; one "trigger surfaces tell the truth" sweep.
6. **The /clear regime is one product decision plus a coordinated sweep** across init,
   both prompt-template guides, audit-claims:507, and the STATE Next-Action comment —
   blocked on: is the phase-boundary clear still the recommended default?
7. **The twin failure, collected:** outcomes under-stated where scaffolding is rich —
   the audit's purpose (decision-readiness) absent from its own surface; severity
   moderate/low undefined; accepted gaps have no state; integrity's Seam-0 boundary
   implicit; magic numbers without recorded reasons.

---

# PLUGIN VERDICT

**Every surface audited at `636bc89`; integration pass run. The plugin is not
fossil-riddled — it is unusually contract-dense and history-backed; the genuine
capability pile is small and specific:** ten unresolved model pins (one decision), the
scripted-turn family (four surfaces, one rewrite pattern), init's menu intake + read
rituals + numeric anchors + /clear numerics (SKILL-daft covers most, promote with the
nine listed amendments), research-integrity's persona line, and the blanket re-read
rituals (pending one confirm-extinct question). Alongside: a six-pair
trigger-drift sweep, and a rich move-to-mechanism menu. **Nothing should be cut before
the author answers the consolidated questions below; everything cuttable is
regression-netted except init (no eval scenario — ship marked unverified or add one)
and the review tier's coldness/t1/pin aspects (live-verified only).**

## Consolidated author questions (blocking the apply phase)
1. **Model pins (settles ten rulings):** deliberate tiering or migration default? If
   tiering: is the intent "override the session model" or "at least this tier" (only
   the former is expressible)? Unpin candidates in order: research-integrity, discover,
   start-phase; opus pins on the judgment tier + corpus-reviewer need the floor-vs-cap
   call.
2. **/clear regime:** phase-boundary clear still the recommended default, or optional?
3. **Cadence:** 5 or 5–8 — and which surface owns the number?
4. **SKILL-daft:** approve the nine amendments — esp. (2) the imported plan sections
   (Hypothesis/Limitations-&-ethics — template creep from a pasted web source?) and
   (3) restoring the audience-calibration anchors?
5. **Blanket re-read rituals:** has a written-but-absent file ever actually been
   observed, or may they retire where a mechanism exists?
6. **Clean-run floor ownership** (from the review tier): rubric anchor only, or also a
   deterministic check, if the verbatim ready-sentence relaxes?
7. **Accepted gaps:** where should acknowledgment live so check-gaps stops re-reporting?
8. **Severity + audit purpose:** state moderate/low definitions and the
   decision-readiness outcome on the audit surface?
9. **Delegation option in init:** keep (with scoped read-in-full rule) or delete
   (incl. AGENTS.md mirrors)?
10. **Synthesis-output trio → commissioned-deliverable-only:** all types or just the
    three whose descriptions already contradict the trio?

---

# APPLY RECORD (2026-08-06, author decisions on the ten questions)

| # | Question | Decision | Applied as |
|---|---|---|---|
| 1 | Model pins | **Unpin all** (rec accepted) | All 12 `model:` lines removed; init's via the daft promotion; `disable-model-invocation` kept |
| 2 | /clear regime | **KEEP — author overrode the daft** ("even with new models context window fullness can be a problem") | Regime restored/preserved in init promotion; no sweep of the prompt-template guides; the daft's optional-clears stance rejected |
| 3 | Cadence | **5** | Mechanism named as owner (process-source pre-check + where-am-i.py); "5-8" → 5 in discover ×2, prompt-templates-runtime, summarize pre-check, init template (promotion) |
| 4 | SKILL-daft | **Promote; clean debris; drop imported sections; restore calibration anchors** | Promotion run with the nine audit amendments as binding instructions |
| 5 | Blanket re-reads | **Retire** | audit-claims blanket audit-report re-read + backstage mandate removed; KEPT: claim-graph JSON-parse check, waiver three-loci re-read, check-gaps/cross-ref STATE-consistency outcome contracts (incident-backed, different family) |
| 6 | Clean-run floor | **Rubric anchor suffices** (rec accepted) | review-corpus verbatim ready-sentence → content contract in own words; semantic gate-framing ban kept absolute |
| 7 | Accepted gaps | **Disposition in gaps.md** (rec accepted) | check-gaps step 7b: commissioner-worded acceptance line; Accepted-gaps list (visible, non-actionable); lapse-on-widening rule |
| 8 | Audit purpose + severity | **Yes** | Decision-readiness purpose statement + High/Moderate/Low definitions added to audit-claims |
| 9 | Init delegation | **Delete** (rec accepted) | Removed in promotion + researcher/AGENTS.md mirrors |
| 10 | Synthesis outputs | **Commissioned-deliverable-only, all types** | Plan-generator rules (promotion) + type-template trio mandates removed; numeric Phase Pattern ranges relabeled non-binding |

Also applied from the audit (no question needed — drift/keeps): the six-pair trigger-drift
sweep (cross-reference singular; notes/ not sources/; start-phase write-ownership
description + :103 fossil; graph-analysis wrapper tools + mechanism prose; discover
allowed-tools + Write/Edit; summarize wrapper + Task); CHANGELOG 71→74 count;
research-integrity persona line → role definition; scripted-turn family → must-convey
content contracts (summarize Output + Register pointer; audit-claims FAIL-turn + waiver
close; review-corpus ready rule; start-phase reconciliation prompt).

Deferred (recorded, not applied): move-to-mechanism menu (resolution-record grammar,
registry join key, STATE-consistency checker, publish helper, progress health checks,
graph-analysis metrics — future work, several natural W2/W6 companions); integrity
Seam-0 remit boundary (unasked); magic-number rationale lines (120s/300s/thresholds).

## Apply outcome (v1.9.0, 2026-08-06)

All accepted rewrites shipped in researcher v1.9.0. Regression: iteration-20 — six
goldens green (waiver/override/valve 3×-sampled, manifest, both review-corpus), two
contract smokes, zero gate failures, judges reporting no substance drift and in places
measurable improvement over the scripted forms. Two in-flight reds during the iteration
were both this apply's own second-order effects on the review runner's turn (plumbing
leak via the fallback notice; clean-run close/coverage phrasing) — fixed at the exact
contract points and verified landed at run-3. research-init ships behaviorally
unverified (no eval scenario exists; wanted). Deferred move-to-mechanism menu and
surface-for-decision items stand as recorded above and in
eval/targets/researcher/_eval/iteration-20/scores.md.

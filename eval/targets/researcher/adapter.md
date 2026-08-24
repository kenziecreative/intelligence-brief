# Researcher adapter

How the eval-runner drives the researcher plugin and where the eval-judge looks.

> **Scaffold note (v1.5.0 build):** this pack was scaffolded from the strategist pack's
> shape (the goal-setting builder's golden-set scaffold was not yet available when
> researcher's convergence release shipped). Extend rather than restructure.

## Target plugin root

The runner reads and executes the researcher plugin's real skill files. The plugin is
in-repo: `PLUGIN_ROOT` is the repo-root `researcher/` directory, resolved by `/eval-run`
(no install/config step). The files the runner uses:

- `<root>/skills/research-audit-claims/SKILL.md`
- `<root>/skills/research-summarize-section/SKILL.md`
- `<root>/skills/research-process-source/SKILL.md`
- `<root>/skills/research-cross-ref/SKILL.md`
- `<root>/skills/research-check-gaps/SKILL.md`
- `<root>/reference/` — coverage guide, evidence-failure-modes, source/writing standards
- `<root>/agents/research-integrity.md` — when a skill invokes the integrity agent, the
  runner plays it by reading the agent file and producing exactly the findings it would

`/research-discover` is not run per-scenario: it reaches the live web. The runner establishes
prior state directly from the scenario's `setup` block, which is faster and fully controlled.

**`/research-init` WAS excluded on the same line, and that was wrong.** The stated reason —
"interactive scaffolding" — describes multi-turn behavior, which is exactly what scenarios
script. Nothing about init needs the live web or a real project: it reads the user's turns,
writes a tree into the working dir, copies its kit from `PLUGIN_ROOT`, and runs its own
validator self-test, all of which work in a capture dir. The consequence of the exclusion was
that **the command every user runs first shipped behaviourally unverified across six releases**,
while every skill downstream of it was tested repeatedly. It is now a runnable entry.

## Invocation by `entry`

| `entry` | Runner executes | Notes |
| --- | --- | --- |
| `audit` | `research-audit-claims` SKILL | The main gate path. Scenario seeds a draft; first `user_message` carries the filepath. |
| `synthesize` | `research-summarize-section` SKILL | Pre-checks run against the seeded state (cross-reference.md, gaps.md, notes/). |
| `process-source` | `research-process-source` SKILL | Sources are seeded LOCAL files (under `source-material/` in the working dir) so no live web access is needed. |
| `cross-ref` | `research-cross-ref` SKILL | Operates on seeded notes. |
| `check-gaps` | `research-check-gaps` SKILL | Operates on seeded notes + plan + exclusion ledger. |
| `init` | `research-init` SKILL | Three paths, and the `setup` block is what selects which one the run takes — init's step 0 branches on whether `research/STATE.md` exists. **Fresh-project scenarios carry no `setup` block at all:** the empty directory *is* the condition, and seeding anything would send the run down the guard instead of the intake. **Guard and upgrade scenarios seed an existing project** (`state`, `plan`, `notes`, and for the upgrade path `files` for a drifted kit), because that is the condition those paths require. Init copies its review-protocol kit from `PLUGIN_ROOT` and runs the real `validate-corpus-review.py --self-test`; let it, and record the result — including its exit code, which is load-bearing. |
| `review-corpus` | `research-review-corpus` SKILL | The credibility-gate runner (W7). Scenario seeds a whole mini-corpus via `setup.fixture`; scenarios pin **tier t2 only** (Codex CLI is not assumed in the eval environment). The runner plays the Tier-2 reviewer by reading `<root>/agents/corpus-reviewer.md` + `<root>/reference/corpus-review-brief.md` — **from the four inputs only**: when playing the reviewer, judge the corpus strictly from what is on the fixture's disk against the brief; never from the scenario, the fixture's name, or the runner-skill context. Everything else executes the skill's real machinery: manifest build and `validate-receipt` run the actual `<root>/reference/validate-corpus-review.py`. **Honesty note (for maintainers/judges):** in-context play is structurally weaker than production coldness (production dispatches a fresh agent); these scenarios prove the mechanical seam (brief → result schema → validator → receipt) and defect recall, while genuinely cold reviewer behavior is proven by the W7 stage-5 live dual-tier run. |

## Working dir and setup

Each run gets its own working dir, assigned by `/eval-run`:
`eval/targets/researcher/_eval/iteration-N/<scenario-id>/` (or `…/run-k/` for
multi-sampled scenarios). The research artifacts live under `research/` (and
`source-material/`) inside it.

If the scenario has a `setup` block, write it into the working dir **before** the first
turn. Setup keys:

- `setup.fixture` → copy the entire tree at
  `eval/targets/researcher/fixtures/<name>/` into the working dir (the fixture carries
  its own `CLAUDE.md` and full `research/` tree; none of the other setup keys or default
  scaffolds apply — the fixture is the complete project). Used by `review-corpus`
  entries. Fixture names are deliberately neutral (`corpus-a`, `corpus-b`) — the runner
  must learn a corpus's condition only by reviewing it; what each fixture seeds and what
  the judge expects live in `coverage.md` and the scenarios' `expected_behavior`
  (judge-only surfaces). These are the W7 corpus-scale fixtures — the pass that must be
  green before gate blocking switches on (stage 4).

- `setup.plan` → `research/research-plan.md` (markdown; defines phases, questions, and
  each phase's `**Output:**` / `**Outputs:**` lines — the deliverable manifest source).
- `setup.state` → `research/STATE.md` (markdown, in the init template's shape: Current
  Position with `Active phase:`, Current Phase Cycle checklist, Completed Phases,
  Sources Processed counters, Next Action).
- `setup.notes` → a map of filename → markdown; write each into `research/notes/`.
- `setup.cross_reference` → `research/cross-reference.md` (seeds contradictions and
  `user_override=true` resolutions).
- `setup.gaps` → `research/gaps.md`.
- `setup.evidence_standard` → `research/reference/evidence-standard.md` (the compiled
  audience standard the audit gate reads).
- `setup.exclusions` → `research/discovery/exclusions.md` (the source-exclusion ledger).
- `setup.candidates` → a map of filename → markdown; write each into `research/discovery/` (phase candidates files — the input to the disposition pass in check-gaps/cross-ref).
- `setup.saturation` → `research/reference/saturation.json` (the per-question saturation
  verdict `/research-cross-ref` writes and `/research-check-gaps` reads). **Seed it only when
  the scenario calls for it** — its absence is a supported project state (cross-ref has not
  run), not a scaffolding gap. Its `generated` date and the STATE counter
  `Sources since last cross-reference` are what make a seeded record current or stale; seed
  them deliberately together.
- `setup.retrieval_log` → `research/reference/retrieval-log.json` (seeds documented
  adverse-search entries for valve scenarios).
- `setup.registry` → `research/sources/registry.md`.
- `setup.drafts` → map of filename → markdown; write into `research/drafts/`.
- `setup.outputs` → map of filename → markdown; write into `research/outputs/` (already-promoted deliverables, for closeout scenarios).
- `setup.audits` → map of filename → markdown; write into `research/audits/` (the passing audit reports those outputs carry).
- `setup.completion_criteria` → `research/reference/completion-criteria.md` (the canonical SC-N list the closeout preflight reads).
- `setup.decision_ledger` → `research/reference/decision-ledger.md` (the append-only disposition record B13 enforces). **Seed it only when the scenario calls for it** — its absence is a supported project state, not a scaffolding gap, and B13 reports `n/a (no ledger)` there.
- `setup.source_files` → map of filename → content; write into `source-material/`.
- `setup.files` → a generic map of **working-dir-relative path** → content, written verbatim. For
  state no typed key covers: a drifted validator under `research/bin/`, a malformed protocol
  marker, a duplicated STATE line. Use a typed key where one exists — this is the escape hatch,
  not the default, and a scenario leaning on it heavily is usually asking for a new typed key.
- Always scaffold empty `research/outputs/`, `research/audits/gate-log.md` (header only,
  from the init template), `research/reference/canonical-figures.json` (`{"figures": {}}`
  unless seeded), and `research/reference/claim-graph.json` (`{"claims": []}`) so gates
  and audits have their infrastructure.
- Always scaffold `research/reference/source-standards.md` and
  `research/reference/writing-standards.md` from the init templates. `audit-claims` and
  `summarize-section` read these unconditionally at step 2–3; in iteration-1 they were
  absent and four runners invented four different recoveries. That is variance the
  harness injects, not behavior under test — scaffold them so the skill's read succeeds.
- Always scaffold `research/sources/registry.md` (header row only, from the init template)
  unless `setup.registry` seeds it. `check-gaps` step 5a reads it unconditionally to compute
  candidate dispositions.
- **Always scaffold the project `CLAUDE.md` with its `## Working Posture` section** — the
  pointer `/research-init` writes:

  ```markdown
  ## Working Posture

  Conversational posture and response register are governed by the plugin's posture doctrine — read `${CLAUDE_PLUGIN_ROOT}/reference/posture-register.md` at session start and hold it for every turn. It governs the conversation the way the audit gate governs the outputs: the evidence machinery can hold perfectly while the conversation quietly fails.
  ```

  **The runner must read `posture-register.md` at session start and hold it for every turn,
  exactly as a real deployment would.** This is not optional scaffolding: in real use the
  CLAUDE.md pointer is how the posture doctrine reaches *every* skill on *every* path.
  Iteration-3 omitted this file, so the doctrine was reachable only from `audit-claims`'
  phase debrief — which runs only on the PASS branch — and the eval measured a plugin whose
  register doctrine was, on most paths, simply absent. Register scores from any run without
  this file are not measurements of the plugin; they are measurements of the harness.

**Path convention (gates depend on it):** scenarios that seed or produce a draft use the
fixed name `research/drafts/04-test-section.md`; its promoted form is
`research/outputs/04-test-section.md`. Do not vary these names — `gates.json` checks
them by exact path.

## User-turn protocol

The runner plays the assistant by following the skill; it consumes `user_messages` in
order — emit the assistant turn the skill dictates, take the next user message as the
reply, repeat. The run ends when messages are exhausted or the skill reaches its
transition/handoff. Every turn is written to `transcript.md`.

## Artifacts the judge reads

- `<working-dir>/transcript.md` — the full conversation.
- `<working-dir>/research/STATE.md` — position, cycle checklist, counters.
- `<working-dir>/research/drafts/` and `<working-dir>/research/outputs/` — what was (or
  wasn't) promoted.
- `<working-dir>/research/audits/` — the audit report and gate-log.
- `<working-dir>/research/discovery/exclusions.md` and `negative-searches.md` — the
  record-never-restrict artifacts.
- `<working-dir>/research/reviews/` — (`review-corpus` entries) the receipt, report, and
  any `.failed.json` attempt records the runner wrote.

## Deterministic gates

Script-computed by `eval/lib/run-gates.mjs` from `gates.json` — the runner does not
eyeball them. This scaffold's gate set is deliberately minimal (universal structural
checks only); promotion/no-promotion correctness is judged from the artifacts because it
inverts per scenario. Grow the gate set as the pack matures.

| Gate | Check | Feeds |
| --- | --- | --- |
| `state_active_phase` | `research/STATE.md` contains `Active phase:` | State Integrity |
| `draft_methodology_section` | the conventional draft contains `## Methodology & Limitations` (synthesize entries only) | Traceability |
| `review_receipt_validates` | (`review-corpus` entries only) discovers the run's receipt and invokes the real validator's `validate-receipt` on it — the mechanical half of Credibility Gate; a runner-reported boolean is never trusted | Credibility Gate |

Plus `content_lint` checks: no `[TODO]`/`[TBD]`/`[placeholder]` tokens in the
conventional draft or promoted output (→ Traceability), both optional-file.

The table above lists this pack's **structural** gates only. The rest of the gate set is
documented judge-side in `coverage.md`, because this file is runner-visible and a gate on
*behavior* becomes an answer key the moment it is written down here. Maintainers: that
omission is deliberate — do not "complete" the table.

**What the runner must record** (`gate-inputs.json`): `entry`, plus for judge use:
`expected_promotion` (did the scenario expect the draft to be promoted),
`seeded_files` (the list of setup-written paths, so the judge can distinguish seeded
state from run-produced state), and `artifacts_written` (every path the run produced or
modified — a script checks each one exists, so seeded-but-untouched files do not belong
on it). For `review-corpus` entries additionally:
`receipt_written` (bool), `receipt_validated` (did `validate-receipt` exit 0),
`verdict` (the receipt's verdict), and `material_classes` (the classes of material
findings in the receipt) — the judge grades seeded-class recall from these plus the
receipt itself.

# AGENTS.md — strategist

Maintainer/agent guidance for working **on** the Strategist plugin. Standalone,
self-contained strategic-thinking system. (Current version lives in `plugin.json` and
`CHANGELOG.md`.)

> A plugin's `templates/CLAUDE.md` is a different thing: it's the per-deployment config
> the plugin ships to *users*, not agent guidance. Don't conflate the two.

## What it is

Turns Claude Code / Cowork into a strategy thinking-partner: one repeatable loop — the
Strategy Spine: Define → Frame → Analyse → Insight → Synthesise → Story → Move (loops back
to Define) — backed by a 70-framework library. Each stage presents its frameworks, recommends and applies the
right one against the user's real problem, and captures the result in two documents: a
working record (`strategy/brief.md`) and, from Story onward, a clean reader-facing brief
(`strategy/strategy-brief.md`). A critic subagent pressure-tests the reasoning on request.
The point is *working the steps* and *picking the right tool per step*, not producing a
template.

## Structure

- `commands/strategist/` — 13 thin command wrappers: `init`, the 7 stages (`define`,
  `frame`, `analyse`, `insight`, `synthesise`, `story`, `move`), `framework`, `pressure-test`,
  `progress`, `save`, `resume`.
- `skills/` — 7 skills: `strategist-init` (scaffold: config, state, brief, charter),
  `strategist-stage` (the generic engine all 7 stage commands drive),
  `strategist-framework` (single-framework apply/explain), `strategist-pressure-test`
  (dispatches the critic), `strategist-progress` (read-only dashboard),
  `strategist-save` (session debrief & state save, works mid-stage),
  `strategist-resume` (restores stance from files — the working resume; progress stays
  the dashboard).
- `agents/strategist-critic.md` — the reasoning-critic subagent (no web, no sources;
  tests logic, not evidence).
- `reference/` — read-only library: 70 framework entries across 7 stage directories, plus
  per-stage `README.md` indexes and a master `INDEX.md`.
  Frontmatter `name:` is namespaced `strategist:reference/<stage>/<slug>`.
- `hooks/` — one PreCompact staleness check. No outputs gate.
- `templates/CLAUDE.md` — the per-deployment config `/strategist:init` installs into the
  user's project root.

## Key mechanics

- **The loop is the spine.** `strategy/STATE.md` holds loop position (stage record,
  completed/active/pending, open pressure-test findings, Working Dynamic, Open Questions Under Test,
  In-Flight, Backstage Tasks); `strategy/brief.md` is the
  evolving working record, one section per stage; `strategy/strategy-brief.md` is the clean
  reader-facing deliverable, spun out at Story and refreshed through Move. Sequential
  but resumable, and explicitly iterative — any stage can send the user back. The
  two-document write logic lives in `strategist-stage` Step 4 (Reader-Brief Style Rules).
  Since 0.4.0 the engagement also carries `strategy/CHARTER.md` (captured at init, read
  by stage preconditions and the commitment gate) and `strategy/DECISION.md` (written at
  the Synthesise commitment gate).
- **Record, never restrict (0.4.0; hardened 0.4.1).** Nothing in the loop blocks; every
  consequential user call leaves a trace — and since 0.4.1 the state vocabulary stops
  conflating "the user chose to proceed" with "the work satisfies its contract."
  Claim ownership is two-axis (origin: user/agent/external × standing:
  first-hand/unverified/estimate; user-relayed ≠ user-owned) and survives into the
  reader brief's "What this rests on" close. Pressure-test cells read
  `clear / open (n) / declined`, and unresolved load-bearing findings travel into
  DECISION.md and the reader brief. Staleness is canonical: stale stages leave
  `completed_stages` for `stale_stages`, clear top-down only (else
  `complete (on stale inputs)`); an unmet done-bar advanced past reads
  `incomplete (advanced by user)` and never enters `completed_stages`. Files win over
  chat memory, silently.
- **The commitment gate (stage engine Step 4b).** At Synthesise, before the commitment
  write: sibling directions with the honest-singleton valve; the critic auto-runs
  (non-blocking, decline recorded — decision E2) and receives the full option set and
  why each alternative lost, not just the winner; charter check; Rumelt-kernel check in
  recording form (E3); DECISION.md written.
- **The return restores stance.** `strategist-save` captures position + debrief
  (Working Dynamic / Open Questions Under Test / Backstage Tasks / In-Flight, mid-stage);
  `strategist-resume` re-adopts them, continues in-flight work without re-asking, and
  runs additive-only schema migration. Since 0.4.1 the engine also refreshes In-Flight
  after each substantive answer, so an *unsaved* stop (auto-compaction, closed laptop)
  is recoverable too — save is the curated debrief, not the only persistence path.
  Both carry narration firewalls — the machinery stays backstage.
- **One engine, seven stages.** The 7 stage commands all invoke `strategist-stage` with a
  different stage; the skill reads the matching `reference/<stage>/` to drive the menu and
  application. Adding or renaming a stage = a command wrapper + a `reference/<stage>/`
  dir; no new skill.
- **Framework application, not recitation.** The stage and framework skills apply the
  chosen framework to the user's specifics using the entry's How-To and Worked Example as
  the concreteness bar. A generic templated output is a failure.
- **The critic tests logic, not evidence.** Deliberately *not* a research-integrity gate —
  no sources, no canonical figures, no audit. Its highest-value find is a contradiction
  between stages.
- **Posture is enumerable, and lives in the facilitation, not only the critic.** The stage
  engine's posture (advisor, not service desk, not confident generalist) is written as
  behavioral rules, not tone. Two halves: a **friction half** (reject non-answers, redirect
  preference toward what the work supports, challenge soft framings) and a **lane half**
  (the conviction-source rule, lane discipline, provisional framing, stall-don't-fabricate-
  don't-over-stall). Before advancing, the stage runs a two-part **Self-Audit** (friction
  check + lane & fabrication check). It calibrates to a `## Working Dynamic` block in
  STATE.md (`pushback_calibration: unknown|low|high`), updated after the *first* substantive
  exchange (slow calibration is itself a failure), and `init` states the posture contract up
  front. The critic remains the deeper, on-demand cross-stage pass, and gained two checks
  (fabricated/unowned premise, agent-introduced keystone); the stage engine handles live,
  in-the-moment judgment. (Friction half borrowed from brand-compass; lane half + the
  enumerable-posture framing borrowed from Hello Alice's advisor posture work.)

## Surface differences (Claude Code vs Cowork)

- The PreCompact staleness hook and the `.claude/settings.json` pre-allow (`strategist-init`
  Step 4) are Claude Code only; in Cowork both are no-ops and the loop holds structurally.
- `strategist-init` creates all files with the Write tool (no shell), so setup is
  Cowork-safe.
- No outputs gate exists on either surface — Strategist makes no source-rigor claim, so
  there's nothing to gate.

## Locked decisions

- **Name/namespace:** plugin `strategist`, commands `/strategist:*`, library frontmatter
  `strategist:reference/<stage>/<slug>`.
- **Critic in v1:** included (`/strategist:pressure-test` + `strategist-critic`).
- **Two documents (v0.2.0):** working `brief.md` (process/audit trail) + reader-facing
  `strategy/strategy-brief.md` (clean deliverable, generated from Story onward). The reader
  brief carries no process residue; the Reader-Brief Style Rules in `strategist-stage`
  Step 4 enforce it. Path is overridable as `reader_brief` in config.
- **No evidence layer:** intentionally absent. If a future version wants sourced
  strategy inputs, that's a separate, opt-in concern — don't bolt a research gate onto the
  loop.

## Canon sync — the shipped frameworks are copies

- The Strategy Spine and its sibling frameworks live in `reference/frameworks/` as **copies
  of canonical source docs** that live at `~/Documents/Claude/Projects/AI Operations/frameworks/`
  (the Strategy Spine itself is now `strategy/strategy-spine.md` there; it draws on
  `metaskills.md` and
  `learning-and-teaching.md`, with `creating-conditions.md` as the parent posture). That folder
  is the **source of truth**.
- When the plugin is updated, **verify the shipped copies still match canon** — re-copy from
  the source docs if the canon has moved. This mirrors the propagation convention in that
  frameworks folder's own `AGENTS.md`: updates propagate from the canonical source into the
  copies here, never the other way around. Don't edit the substance of a shipped framework in
  `reference/frameworks/` directly; change it in canon and re-sync.
- Since 0.4.0 this is machine-checked:
  `node dev/scripts/lint-doctrine-drift.mjs --plugin strategist` byte-diffs the four
  canon pairs (after declared path normalizations — canon's cross-refs are `../`-relative
  since it moved into a subdir), plus stale retired phrases, referenced sections, and
  reader/writer vocabulary contracts. **It blocks release**; the config is
  `dev/scripts/drift-configs/strategist.json`. When a doctrine change retires wording,
  add the retired phrase to the config in the same commit. (Canon checks skip with a
  warning on machines without the canon folder — they must pass on the machine that has
  it before release.)

## Maintaining this plugin

- **Release:** follow **Release & versioning** in the root `AGENTS.md`. Bump `version` in
  `plugin.json`, update the `v<X.Y.Z> — ` prefix in both descriptions (`plugin.json` + the
  catalog entry in `.claude-plugin/marketplace.json`), the README "Plugins at a glance" row,
  and the root `AGENTS.md` plugin list; add a `CHANGELOG.md` entry; then
  `node dev/scripts/check-version-prefix.mjs`,
  `node dev/scripts/lint-doctrine-drift.mjs --plugin strategist` (release-blocking),
  and `claude plugin validate ./strategist` +
  `claude plugin validate .`; commit, tag **`strategist-v<X.Y.Z>`**, push.
- **Authoring check (optional):** run plugin-dev's `skill-reviewer` over changed skills and
  `plugin-validator` over the plugin to catch frontmatter/description regressions.
- **Editing cautions specific to this plugin:**
  - The 7 stage commands all drive the single `strategist-stage` engine — change posture or
    behavior **there**, not per stage. The enumerable posture + two-part Self-Audit live in
    `strategist-stage` Step 4; keep the two-document split (working `brief.md` vs
    reader-facing `strategy-brief.md`) intact.
  - The critic tests **logic, not evidence** — don't bolt a sourcing/research gate onto it.
    Its two newest checks (fabricated/unowned premise, agent-introduced keystone) are
    load-bearing; preserve them.
  - The `reference/` library is namespaced `strategist:reference/<stage>/<slug>` and indexed
    in `INDEX.md`; adding a framework is an entry (the six standard sections) + index update, no skill change.
- See **Locked decisions** above before changing the loop shape, the critic's scope, or the
  two-document model. Claude Code owns the live-test of the PreCompact hook and the
  `.claude/settings.json` pre-allow (Cowork can't see them).

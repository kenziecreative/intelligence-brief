# AGENTS.md — researcher

Maintainer/agent guidance for working **on** the Researcher plugin. Standalone,
self-contained research system. (Current version lives in `plugin.json` and `CHANGELOG.md`.)

## What it is

Turns Claude Code / Cowork into an audited research partner: a phased plan grounded in preliminary research, then collect → cross-reference → gap-check → synthesize → audit every claim before it reaches `outputs/`. The point is traceability and anti-drift, not summarization — every claim traces to a specific source.

## Structure

- `commands/research/` — 11 command SKILLs: `init`, `discover`, `process-source`, `cross-ref`, `check-gaps`, `summarize-section`, `audit-claims`, `start-phase`, `phase-insight`, `progress`, `graph-analysis`.
- `agents/research-integrity.md` — the integrity-checking subagent (no web dependencies).
- `reference/` — read-only knowledge base: root guides, templates, and per-type discovery playbooks + channel maps (11 research types).
- `hooks/` — Claude Code hooks (the `outputs/` gate and the `PreCompact` save warning).

**End-to-end operating model:** `dev/researcher/ARCHITECTURE.md` is the source-of-truth map —
the pipeline, decision/state ownership, the state model, the judgment map, the role/expertise
split, cross-cutting invariants, and known unreconciled seams. Read it before non-trivial
changes; update it in the same change when a boundary, judgment home, principle, or seam moves.
It is authoritative on relationships and principles, subordinate to the skills on mechanics.

## Key mechanics

- **Outputs gate.** Nothing reaches `research/outputs/` without passing `/research-audit-claims`. On Claude Code this is a `PreToolUse` hook that blocks Write/Edit/MultiEdit to `outputs/` unless an audit authorized the write within the last 120s (via a row in `research/audits/gate-log.md`). In Cowork, hooks don't run; the gate holds as a structural rule — `audit-claims` is the only skill that writes to `outputs/`.
- **3-tier discovery:** Tavily CLI → Firecrawl CLI → built-in WebSearch/WebFetch. Works with zero CLIs installed (built-ins are the floor). `retrieval-log.json` records the tier per run; a Tier-3 banner appears in candidate files when CLIs were unavailable.
- **Integrity spine:** canonical figures registry (numbers can't drift across phases), a claim graph (claims as nodes with edges to sources/figures), and the integrity agent that runs after every write to catch fabrication, range-narrowing, and qualifier stripping.
- State lives in `STATE.md`; phases are sequential and resumable across sessions.

## Surface differences (Claude Code vs Cowork)

Hooks (the `outputs/` gate and `PreCompact`) and the `.claude/settings.json` pre-allow are Claude Code only; in Cowork the gate holds structurally and the plugin detects the surface automatically. Plan generation in `/research-init` runs inline on both surfaces — subagent delegation is an optional Claude Code optimization, not required.

## v1.4 notes

Init scaffolds `research/` and `source-material/` from scratch (rooted at `${CLAUDE_PROJECT_DIR}`); the `outputs/` hook gate landed as the hard backstop; per-phase discovery tier recording (Tier-3 banner + STATE.md table); inline-first plan generation so Cowork and Claude Code behave the same.

## Maintaining this plugin

- **Release:** follow **Release & versioning** in the root `AGENTS.md`. Bump `version` in
  `plugin.json`, update the `v<X.Y.Z> — ` prefix in both descriptions (`plugin.json` + the
  catalog entry in `.claude-plugin/marketplace.json`), the README "Plugins at a glance" row,
  and the root `AGENTS.md` plugin list; add a `CHANGELOG.md` entry; then
  `node dev/scripts/check-version-prefix.mjs` and `claude plugin validate ./researcher` +
  `claude plugin validate .`; commit, tag **`researcher-v<X.Y.Z>`**, push.
- **Authoring check (optional):** run plugin-dev's `skill-reviewer` over changed skills and
  `plugin-validator` over the plugin to catch frontmatter/description regressions.
- **Editing cautions specific to this plugin:**
  - The `outputs/` gate is the hard backstop — nothing reaches `research/outputs/` except
    through `/research-audit-claims`. On Claude Code it's a `PreToolUse` hook keyed to a
    recent `gate-log.md` row; in Cowork it holds structurally because `research-audit-claims`
    is the only skill that writes there. Don't add another writer to `outputs/`, and don't
    loosen the hook without preserving the structural rule.
  - Each command in `commands/research/` is a thin wrapper that delegates to its matching
    `skills/research-*` engine — change behavior in the **skill**, not the wrapper, and keep
    the wrapper's `description` and the skill's trigger description in sync.
  - Plan generation in `/research-init` runs **inline** on both surfaces; subagent delegation
    is a Claude Code optimization, not a requirement. Keep Cowork and Claude Code identical.
  - The integrity spine (canonical-figures registry, claim graph, `research-integrity` agent)
    is load-bearing anti-drift — it tests sourcing and consistency, not prose. Preserve the
    registry and the post-write integrity pass; numbers must not drift across phases.

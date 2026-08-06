# Changelog — intelligence-briefing

All notable changes to the Intelligence Briefing plugin. Per-plugin semver; tags are
plugin-scoped (`intelligence-briefing-vX.Y.Z`). Entries below 0.3.0 are reconstructed from
git history; the plugin's pre-marketplace iterations moved quickly, so early dates cluster.

## 0.3.1 — 2026-08-06

Two seam fixes from the `/upskill` constraint audit (`dev/intelligence-briefing/constraint-audit.md`),
which found no capability constraints to cut. Behavior is unchanged; both edits close gaps
where two surfaces described the same thing differently.

- **Skill name aligned.** The skill's frontmatter `name` was `environmental-briefing-agent`
  while the directory and both commands referred to `environmental-briefing`. Now consistent
  everywhere.
- **Grace window named in the skill's config list.** `templates/CLAUDE.md` shipped a 6-hour
  grace window as a user-editable field, but the skill's CONFIGURATION block never listed it
  and CADENCE called it only "a short grace window" — so the skill alone couldn't tell it was
  configured rather than judged. CONFIGURATION now carries it with its default, and CADENCE
  reads the configured value.

## 0.3.0 — 2026-06-07

Refocused to the **external scan only** and folded into the Kenzie Creative marketplace.

- The plugin is now squarely the outward-facing environmental brief — it scans the outside
  world (news, industry movement, research, policy, science) and triages it; the internal
  streams that earlier shared its spine moved out to their own plugins.
- **Shared state moved to the `/contract` convention.** The earlier in-plugin "suite mode" /
  `shared/` contract is superseded by the deployment-level `/contract` queue. The ledger now
  belongs to the deployment directory and carries a `source: "environmental"` tag so it works
  whether or not other plugins share the directory.
- Marketplace-level repositioning: catalog entry and READMEs rewritten to describe the brief
  for adopters.

## 0.2.0 — 2026-06-07

- **Self-contained HTML brief.** The brief renders as a single styled, self-contained HTML
  page by default (inlining the stylesheet), with `format: markdown` still available for the
  plain brief. The brief's *content* is identical across formats — only presentation differs.
- **`theme` option.** `default` ships brand-neutral system fonts; a deployment can point
  `theme` at a local CSS override to apply its own brand without editing the plugin.

## 0.1.5 — 2026-06-07

- **No-shell file ops.** Reading config and the ledger, and writing the brief, all go through
  Read/Write/Edit — never shell — so the brief incurs no needless permission gate.
- **Setup permission preamble.** `/intel-setup` now sets expectations on file-creation
  approvals up front, including the "allow for this project/session" shortcut.
- Folded the unreleased 0.1.4 documentation work into this release.

## 0.1.3 — 2026-06-07

- **WebSearch as the baseline, scanning inline.** The brief depends only on built-in
  `WebSearch`/`WebFetch`, never a required search MCP or CLI, and runs the scan in-session
  rather than delegating to subagents (which can't reach the web).
- `/intel-setup` writes a narrow project allowlist (`.claude/settings.json`) and runs a
  web-search pre-flight check before the test brief.
- Dropped the stray `metadata.version` from the marketplace entry.

## 0.1.2 — 2026-06-06

- Tightened the `/intel-setup` question contract — relevance context in the user's own words,
  no persona menus, no inferring the user's role or employer from the environment.
- Removed organization-specific examples from the shared docs.

## 0.1.1 — 2026-06-06

- Kept maintainer-facing content out of the user surfaces.
- Documented dual install instructions (Claude Code and Cowork).

## 0.1.0 — 2026-06-06

Initial release.

- The external environmental scan — five fixed zones (Emerging Impact, Currents, SciTech
  Frontier, Policy Levers, Field Movements) filtered against a deployment's relevance context,
  weighed against a configurable evidence bar, and written as a dated brief.
- Epistemic classification (fact / signal / frame / pattern), source tier and corroboration
  marking, the named evidence bars (`situational` / `decision` / `shareable` / `strict`), and
  a hard verification gate against qualifier-stripping and range-narrowing.
- A ledger so the brief reports motion, not repetition, with a novelty test for returning
  stories.
- `/intel-setup` to configure a deployment and `/brief` to run one on demand; the same
  operation a scheduled task performs.

# AGENTS.md — Kenzie Creative marketplace

Guidance for any agent (Claude Code, Cowork, or otherwise) working **on** this repository. This is the marketplace-level file; each plugin has its own `AGENTS.md` with plugin-specific detail.

> A plugin's `templates/CLAUDE.md` is a different thing: it's the per-deployment config file the plugin ships to *users*, not agent guidance. Don't conflate the two.

## What this is

A Claude plugin marketplace published from one GitHub repo (`kenziecreative/kenzie-creative`), hosting a family of small, focused plugins. Owner: Kelsey Ruger. License: MIT.

Install: `/plugin marketplace add kenziecreative/kenzie-creative`, then `/plugin install <plugin>@kenzie-creative`.

## Plugins (current versions)

- **blueprint** (0.3.1) — a process extraction interviewer with a discovery front-door: four jobs across four skills/commands, split on whether the process already exists — **discover** (a recall sweep that surfaces recurring work into a thin Process Inventory, no autonomy ratings), **capture** (quick or deep, turning one process you *already run* into a structured Process Blueprint with per-step Automate / Monitor / Human ratings — a reviewed draft, gated from an automation handoff until validated), **design** (modelling a process you *don't yet run* — proposing an intended flow grounded only in the operator's real constraints and nearest analog, never generic best-practice, written as a designed Blueprint "proposed, not yet run"), and **guide** (orients the user to the right entry point). Non-invention carries across all four (design re-scopes it: generative on the proposed flow, never on the constraints). *Standalone.*
- **goal-setting** (0.2.8) — a business goal-setting method in two arcs: a six-stage Setup Arc + a five-cadence Ongoing Arc over a Markdown `goals/` state dir, with a three-goal-rule hard cap, an operating heartbeat (overdue routing, closeout gate, operated mitigations), immutable goal history, and a goal-formulation critic with memory. *Standalone.*
- **intelligence-briefing** (0.3.1) — a daily/weekly environmental brief that triages the outside world into a self-contained HTML brief. *Triage-stream.*
- **photo-generator** (1.2.0) — a guided photography director: plain-language scene → physics-aware Nano Banana Pro prompt (camera, lens, lighting, grade from a bundled reference library), optionally rendered via the Gemini API; batch, variations, and a refinement loop. *Standalone.*
- **researcher** (1.15.0) — a structured, audited research system with a completion credibility gate (independent adversarial corpus review). *Standalone.*
- **sage** (0.2.0) — meeting-transcript triage into a single living weekly round-up. *Standalone.*
- **security** (0.1.0) — an adversarial security and PII reviewer that reads work-in-progress code looking for the way in, and reports *findings* rather than coverage. Eleven check families (AUTHZ, PII, INJ, AUTHN, SEC, XSS, SSRF, CRYPTO, CONF, LOG, DEP); PII is a data-flow walk — collection, propagation, retention, egress — not a control row. Confidence is welded to evidence type, so no finding claims exploitability without a named concrete input; seven known-benign classes plus a read-before-classify rule keep a test fixture from reading as a leak, and every discard is reported. Scripts locate candidates and emit an explicit `unread` list; the agent judges. Findings that are really unmade architecture decisions route to DECISIONS.md instead of being filed as bugs. Never probes, never touches a network. Composes with trailhead as two stages, runs standalone otherwise. *Standalone.*
- **strategist** (0.7.0) — a seven-stage strategic-thinking loop over a 70-framework library, with a reasoning critic; outputs a working record plus a clean reader-facing brief. *Standalone.*
- **thinkers** (0.1.0) — a reasoning counselor over a 243-pattern corpus (biases, fallacies, persuasion/manipulation tactics, bad-faith moves, strategies); five skills — identify, explain, practice, decide, spar — that name what's happening without over-applying high-stakes labels. *Standalone.*
- **trailhead** (0.1.0) — a project initializer that installs repo-resident mechanical gates: a zero-dependency `scripts/gate.mjs` with seven checks (secrets, triggered open decisions, build, tests, QA coverage ratchet, status vocabulary, orphaned suppressions), a contract/running-state split, and multi-CLI agent context for Claude Code, Codex, and Gemini. Staged posture, so only irreversible failures block a prototype. `/trailhead:audit` runs the same checks read-only against an existing repo. *Standalone.*

The marketplace also carries an internal **`eval/`** runtime-QA harness (not a published plugin — see "Evaluating plugins").

Two author-side shapes (not surfaced to users as taxonomy): **triage-stream** plugins are small, recurring, and can compose through the `/contract` convention; **standalone systems** are heavier, project-shaped, and self-contained.

## How plugins compose (the `/contract` convention)

Shared state lives in the **deployment directory** (the project where a plugin runs), never inside a plugin — installed plugins are copied to a cache and can't read each other. The files: `ledger.json` (what's already been reported), `candidates.json` (review queue; rows tagged by a `source` field), `sources/` (drop-box inbox). Any plugin creates them if absent (with the Write tool, never shell), reads/prunes only its own `source` rows, and makes additive changes only. No plugin depends on another being installed. Canonical spec: `contract/README.md` (author documentation, not loaded at runtime).

## Build model

Every plugin must work on **both Claude Code and Cowork**. Surface-specific mechanics are owned by the tool that can actually see them:

- **Claude Code = executor.** Writes the code, resolves Claude-Code mechanics (hooks, `${CLAUDE_PLUGIN_ROOT}`, `.claude/settings.json` pre-allow, manifest entries), owns git.
- **Cowork = reviewer + spec owner.** Reviews build plans and diffs against intent, tests the Cowork surface, owns the adopter-facing register (READMEs, marketplace descriptions, setup copy).

Verification is split, not duplicated — each surface is tested by the only tool that can see it. A single code executor avoids split-brain edits.

## Working in Cowork (the real constraints)

- **File deletion is gated per folder.** Until you approve it (a delete prompt appears the first time), `rm` and git's own lock-cleanup fail with `Operation not permitted` on the FUSE mount — even on files you just created. Approve once and both `rm` and sandbox `git` work normally for that folder. This — not "git is broken in Cowork" — is why earlier sessions saw commits leave stale `.git/*.lock` files behind.
- **git tag/push is still safest from a real terminal** (network + credentials), but commits and tags work from the Cowork sandbox once deletion is enabled for the folder.
- **Setup commands use Read/Write/Edit/Glob, never shell** (`mkdir`/`ls`/`cat`) — shell triggers permission prompts. To create a folder, write a file into its path.

## Credential hygiene (binds every agent working in this repo)

Never read, print, echo, or copy the **value** of any credential (API key, token) — not from `.env` files, not from the environment, not between files, not into tests or chat. Plugins that need keys use a beacon pattern: the *user* pastes the value into a local key file directly; agents only ever check *presence* via a mechanism that reports the source without the value (e.g. photo-generator's `--check-keys`). If a legacy key file is found during a port or build, report its path to the user and let them migrate it themselves — the photo-generator v1.1.0 build agent silently copying a key between files is the incident this rule exists to prevent.

## Dev docs & work state

- **Work state is split per workstream.** `dev/STATE.md` is a one-line-per-stream **index**; the real snapshots are `dev/state/<stream>.md` (goal-setting, strategist, marketplace) — where that stream stands, what's in flight, its next-steps queue, open decisions, and session-only knowledge. Read the index, then your stream's file. Both are written by the `/checkpoint` skill (`.claude/skills/checkpoint/`), which any session should run before clearing context so nothing lives only in conversation. A stream file is a snapshot, not a log — overwrite it; git history holds old versions.
  **Why split:** several worktrees run against this repo at once, and a single shared STATE under concurrent writers is a lost-update bug — whoever checkpointed last silently erased the others. `/checkpoint` writes **only your stream's file** and touches only its own index row. **A quiet stream is parked, not dead** — never tidy up or overwrite someone else's.
- **Build/grounding docs live at repo-root `dev/<plugin>/`**, not in the plugin — a PRD and any build-orientation notes go in `dev/<plugin>/` so they don't ship in the installed plugin's cache (e.g. `dev/sage/`). Dev scaffolding (`.planning/`, `tests/`, `__pycache__/`, `.DS_Store`, logs) never ships either.
- **No plugin-root `CLAUDE.md`.** A `CLAUDE.md` at a plugin's root isn't loaded as context and draws a `claude plugin validate` warning. The shipped `templates/CLAUDE.md` is a different thing — it's the per-deployment config the plugin installs into the user's project, and it's fine. Build orientation goes in `dev/<plugin>/`, not the plugin root.
- **`.claude/` is marketplace-tooling only** (the `/checkpoint` skill, `settings.local.json`) — it is not shipped to users and not part of any plugin. Note: in Cowork the Write tool blocks writes under `.claude/`; create files there with the bash tool.

## Release & versioning

- `plugin.json` `version` is the **single source of truth** for update propagation (not the git tag).
- Per-plugin semver. The version is mirrored by hand in four places; **`node dev/scripts/check-version-prefix.mjs` guards all four** and fails on drift (or on a plugin missing from an index), so let it be the backstop rather than trusting yourself to catch every spot. Loop: edit → bump `version` → **update the `v<X.Y.Z> — ` prefix in BOTH descriptions (`plugin.json` and the plugin's entry in `.claude-plugin/marketplace.json`)** → update the plugin's version in the root README "Plugins at a glance" table **and** the root `AGENTS.md` "Plugins (current versions)" list → CHANGELOG entry → `node dev/scripts/check-version-prefix.mjs` → `claude plugin validate ./<plugin>` and `claude plugin validate .` → optional authoring review (plugin-dev `skill-reviewer` / `plugin-validator`) → commit → tag → push.
- **Tags are plugin-scoped:** `sage-v0.2.0`, `researcher-v1.4.1`, `intelligence-briefing-v0.3.0`, `strategist-v0.3.0`, `plugin-eval-v0.1.0`. Legacy plain `vX.Y.Z` tags exist from early intelligence-briefing releases — don't reuse plain tags; they collide across plugins (there is already a plain `v0.2.0` and `v0.3.0`).
- Installers update via the Cowork Plugins tab, or Claude Code `/plugin marketplace update kenzie-creative` + `/plugin update <plugin>`.

**Why the version prefix is duplicated in the descriptions (UI workaround):** the marketplace card does not currently surface a plugin's `version` field — users see only the description. And there are two descriptions: the **browse cards render the catalog entry's description** (`.claude-plugin/marketplace.json`), while `plugin.json`'s description shows post-install. Both therefore start with `v<X.Y.Z> — ` so the version is visible everywhere. The risk is drift: bumping `version` without updating a prefix means the UI lies. `dev/scripts/check-version-prefix.mjs` asserts every place agrees — the `version` field, the `plugin.json` prefix, the catalog prefix, the README table cell, and the AGENTS list entry (and that no plugin is missing from those indexes) — and exits non-zero on drift; run it in the release loop above. **This is a temporary workaround** (borrowed from the Hello Alice marketplace); if the marketplace card surfaces version natively, strip the prefixes and remove this step.

## Evaluating plugins (internal)

QA has two halves. The **authoring** half — is a plugin well-formed and well-written — is the
release loop above (`check-version-prefix`, `claude plugin validate`, and plugin-dev's
`skill-reviewer`/`plugin-validator`). The **runtime** half — when you actually run it, is the
output good and does it communicate well — is the **`eval/`** harness: internal tooling, **not
a published plugin** (no manifest, not in the catalog). It drives a target plugin's real skills
blind through scripted scenarios, computes deterministic gates with `eval/lib/run-gates.mjs`,
and scores the capture with a separate judge against a per-target rubric. Run it with
`/eval-run --target <name>` after changing a plugin's skills; a red **golden** is a ship-blocker.
It grades whether the plugin *behaved* well, never whether its recommendation was *correct*.
Details and how to add a target: `eval/README.md` and `eval/AGENTS.md`. (Note: the
`eval-runner`/`eval-judge` agents live in `.claude/agents/` and need a session reload to
register after they're first added.)

## Upskilling plugins (internal)

A third QA lens, complementing authoring and runtime QA: **is a plugin's instruction set
holding the model back?** The **`/upskill`** skill (`.claude/skills/upskill/`) audits the
full reachable surface — instruction text (skills + their references, nested commands,
agents, shipped agent templates, script-embedded prompts) *and* execution settings
(`model:` pins, `allowed-tools`, hooks) — and sorts every instruction by source: intent,
method, safety/governance, external contract (kept), or capability workaround (cut, or
moved to deterministic mechanism). Key disciplines: **method is intent** — a plugin's
deliberate stages and gates are the product, not scaffolding — and **seams matter** — a
rule cut in one surface but mirrored in another isn't cut. Surface audits are the unit;
a plugin verdict requires every surface plus an integration pass. Audit-only by default,
writing `dev/<plugin>/constraint-audit.md` (per-surface sections, provenance header);
applying rewrites is always plugin-scoped through the release loop, with a *baselined*
`/eval-run` — a post-edit red golden is triaged for cause, never auto-blamed on the
rewrite. Run it periodically as models improve.

## Cowork-safe HTML (for plugins that render HTML)

Learned the hard way: system fonts as the real basis (web fonts are progressive enhancement only); **no JavaScript**; **no content-hiding entrance animations** (a CSS `opacity:0` reveal renders blank if the viewer doesn't run animations); flat design — bordered cards on white, no drop shadows. Plugins stay brand-neutral; a deployment applies its own brand by pointing a `theme` at a local CSS override.

## Adding a new plugin

Run **`/new-plugin`** (the marketplace skill at `.claude/skills/new-plugin/`). It scaffolds a
fully-conformant tree from the templates in that skill's `references/` — full `plugin.json`
metadata, the standard `AGENTS.md` skeleton with a `## Maintaining this plugin` section, a
README, a CHANGELOG opened at `0.1.0`, and a starter command + skill — then **registers the
plugin in all three root indexes** (`marketplace.json`, the README "Plugins at a glance"
table, and the "Plugins (current versions)" list above) and validates. A scaffolded plugin
passes `check-version-prefix.mjs` and `claude plugin validate .` with no manual cleanup.

If scaffolding by hand instead: the three registration points are the easy ones to forget —
the checker now fails when a plugin is missing from the README table or the AGENTS list, so
run it. New plugins start at `0.1.0`, tagged `<name>-v0.1.0`.

## Per-plugin detail

Each plugin's own `AGENTS.md` carries its structure, mechanics, locked decisions, surface
differences, and a `## Maintaining this plugin` section (the release ritual + that plugin's
edit cautions): `blueprint/AGENTS.md`, `goal-setting/AGENTS.md`, `intelligence-briefing/AGENTS.md`,
`photo-generator/AGENTS.md`, `researcher/AGENTS.md`, `sage/AGENTS.md`, `strategist/AGENTS.md`,
`thinkers/AGENTS.md`.

## Imported Claude Cowork project instructions

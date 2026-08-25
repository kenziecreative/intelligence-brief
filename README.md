# Kenzie Creative

**Small, focused tools for staying on top of your world, by [Kenzie Creative](https://www.kenzienotes.com).**

A **plugin marketplace for Claude** — works in both Claude Cowork (the desktop app) and Claude Code (the CLI). This repo is the catalog; each tool below is a plugin you can install into Claude and use in any project.

Each tool does one thing well and runs on its own. Instead of one program that tries to do everything, you install only the few that fit how you actually work — a brief that triages the outside world, a research system that turns Claude into a rigorous research partner, a meeting round-up that keeps a fast-moving week legible, and (in time) tools that triage your messages and the decisions waiting on you. They stay out of each other's way: every tool works alone; some plugins coordinate through shared files in the project when they're run together; others run entirely on their own.

Once a tool is installed, it shows up as commands and skills you can run in any Claude project.

## Plugins at a glance

| Plugin | Version | What you get | Guide |
|---|---|---|---|
| Blueprint | 0.3.1 | Turn how you actually work into a structured process model, with every step rated for where automation is safe and where a human must stay in the loop — discover the processes you have, capture ones you run, or design ones you don't yet | [guide](./blueprint/README.md) |
| Goal Setting | 0.2.8 | Set business goals that survive contact with reality — and actually operate against them, not abandon them by February | [guide](./goal-setting/README.md) |
| Intelligence Briefing | 0.3.1 | Know what actually moved in your world today, without wading through the whole news cycle | [guide](./intelligence-briefing/README.md) |
| Photo Generator | 1.2.0 | Get a professional-grade photo from a plain-language description, without knowing what a key light or an 85mm prime is | [guide](./photo-generator/README.md) |
| Researcher | 1.18.0 | Research you can stand behind — every claim audited back to its source note, and every note to a declared source | [guide](./researcher/README.md) |
| Sage | 0.2.0 | Always know where a decision landed and who owes what, across a whole week of meetings | [guide](./sage/README.md) |
| Security | 0.1.0 | Read the code the way someone trying to get at the data would read it — security and PII findings, not a compliance table | [guide](./security/README.md) |
| Strategist | 0.7.0 | Think a hard problem all the way through, and come out with a strategy you can defend | [guide](./strategist/README.md) |
| Thinkers | 0.1.0 | Make sense of a confusing situation — what's really going on, where your own thinking might be off, and what to do | [guide](./thinkers/README.md) |
| Trailhead | 0.1.0 | Start a project with checks that actually fail, so QA, linting, design, and deferred decisions can't quietly rot | [guide](./trailhead/README.md) |

Each version mirrors that plugin's `plugin.json`, which is the source of truth for updates.

## The tools

### Blueprint

**Turn how you actually work into a structured process model — with every step rated for where automation is safe and where a human must stay in the loop.** Most process docs describe the idealized version and forget the micro-steps, workarounds, and judgment calls that make the work actually run. Blueprint interviews you instead: it walks you through your most recent real run, asks the questions that surface the tacit detail, and writes a structured Process Blueprint where every step carries an autonomy rating — Automate, Monitor, or Human — decided by one question: if this step were done wrong with no review, what would happen? Quick mode (~15 min) builds a coarse model of one process; deep mode (~45-60 min) produces a model detailed enough to hand to a new team member or take into an automation build once a stakeholder has validated it. It flags what it doesn't know instead of inventing detail, and it treats its own ratings as a reviewed draft — not a safety certification — until the person who owns the risk signs off.

→ **[Read the Blueprint guide](./blueprint/README.md)** for the two modes, the interview method, and the autonomy ratings.

### Goal Setting

**Set business goals that survive contact with reality, then actually operate against them — not a vision board you abandon by February.** It runs one opinionated method in two arcs: a six-stage Setup Arc (orient → horizons → anchors → goals → systems → pre-mortem) that builds goals from *what game am I playing* all the way to goals stress-tested before launch, and a five-cadence Ongoing Arc (a 60-second daily writing ritual, a weekly pulse, and monthly/quarterly/annual reviews) that keeps them alive. It's a rigorous chief-of-staff, not a cheerleader: it enforces a hard cap of three active goals, and a critic stress-tests your goal formulations so you can't quietly lie to yourself.

→ **[Read the Goal Setting guide](./goal-setting/README.md)** for the two arcs, the three-goal rule, and the critic.

### Intelligence Briefing

**Start the day knowing what actually moved in your world, without reading the whole internet to find it.** It scans the outside world — news, industry movement, research, policy, science — and triages it down to the few items worth your attention, keyed to a relevance context you set once. It's built for triage, not coverage, so a quiet day produces a short brief and that's correct. What you get is a clean, self-contained page you can read anywhere or forward to your team. You set it up in a project with one command, and it can run on a schedule.

→ **[Read the Intelligence Briefing guide](./intelligence-briefing/README.md)** for setup, scheduling, and tuning.

### Photo Generator

**Get a professional-grade photo from a plain-language description — without knowing what a key light or an 85mm prime is.** `/generate-photo` walks you from a scene description to a complete, physics-aware Nano Banana Pro prompt — camera body, lens, lighting setup, semantic cleanup, and color grade, each chosen from a curated reference library — then optionally renders the image directly via the Gemini API at the right aspect ratio and resolution for print, social, or hero-banner use. Brand styles apply a house look in one flag; batch mode works through a whole shot list, and variations give you multiple distinct takes. `/photo-setup` handles the API key once (pasted into a local file, never the chat) and an optional default style.

→ **[Read the Photo Generator guide](./photo-generator/README.md)** for setup, flags, platforms, and brand styles.

### Researcher

**Get research you can actually stand behind, instead of a confident summary that might be invented.** Pick a topic, get a phased plan grounded in preliminary research, then work through it together — collecting sources, finding patterns, mapping gaps, synthesizing findings, and auditing every claim before it reaches output. Every claim is audited back to its source note, and every note to a declared source. Not a summarizer; a research partner.

→ **[Read the Researcher guide](./researcher/README.md)** for setup, research types, and the integrity model.

### Sage

**End the week knowing where every decision landed and what's owed, even when five meetings all touched the same thing.** Each meeting becomes a structured summary; every summary folds into one living round-up that tracks action items, cross-meeting threads, and a forward watch list. Pulls transcripts from Read.ai, Fireflies, or Granola via MCP; works on manually dropped transcripts for anything else. The whole point: a fast-moving week stays legible at a glance.

→ **[Read the Sage guide](./sage/README.md)** for setup, supported services, and the round-up structure.

### Security

**Read the code the way someone trying to get at the data would read it.** An adversarial security and privacy reviewer that runs alongside development rather than auditing at the end. It hunts the endpoint nobody remembered, the helper everyone uses except here, the log line that seemed harmless, and the personal data no deletion path reaches — then reports findings with the attack path as read, the input that exercises it, the blast radius, and the fix. Eleven check families cover authorization, PII data flow, injection, authentication, secrets, XSS, SSRF, crypto, config, audit trails and dependencies. The design is asymmetric on purpose: a missed vulnerability leaves you where you were, but three false ones get the tool switched off, so confidence is welded to evidence type — it cannot claim exploitability without naming a concrete input, seven known-benign classes stop a fixture credential reading as a leak, and every discard is reported so you can audit the filter. Scripts locate candidates and say plainly what they could not read; the agent judges. It never probes, never holds a credential, and never touches a network.

→ **[Read the Security guide](./security/README.md)** for the check families, how it avoids crying wolf, and — first — what it cannot establish.

### Strategist

**Think a hard problem all the way through and come out with a strategy you can actually defend, not a blank framework template.** It walks one problem through a single repeatable loop — Define → Frame → Analyse → Insight → Synthesise → Story → Move — and at each step puts the right framework from a 70-framework library in front of you, helps you apply it to your actual situation, and writes the result into one living strategy brief. A critic can pressure-test your reasoning whenever you want it — testing the logic, not the evidence.

→ **[Read the Strategist guide](./strategist/README.md)** for the loop, the library, and the critic.

### Thinkers

**Make sense of a confusing situation — what's actually happening, whether your own thinking is off, and what to do about it.** Describe what you're dealing with and it names the pattern at work (a bias, a fallacy, a persuasion or manipulation tactic, a strategic move) from a 243-pattern library, carefully — it draws the line between, say, real gaslighting and an ordinary disagreement before it ever hands you a heavy label. Five ways in: `identify` what's going on, `explain` a named pattern, `practice` spotting them, `decide` a tough call, or `spar` to stress-test your thinking. It talks like a counselor, not a textbook, and tells you the honest thing rather than the flattering one.

→ **[Read the Thinkers guide](./thinkers/README.md)** for the five skills and the pattern library.

### Trailhead

**Start a project with its checks already installed, so the things that quietly rot fail loudly instead of drifting.** It comes out of one observation from a long build: every requirement that had a mechanical check held, and every requirement that existed only as prose drifted — while being complied with in letter. Eighteen QA specs, one of them ever run. `eslint-disable` comments in five files and no linter installed. A pinned design system applied as color tokens over layouts that ignored it. All written down; none of it able to fail. `/trailhead:init` asks four questions, then writes the contract, the running state, and a `scripts/gate.mjs` you can run from any terminal — Claude Code, Codex, Gemini CLI, or CI. Questions you can't answer yet don't get dropped; they become rows that fail the gate at the moment the decision stops being cheap. `/trailhead:audit` runs the same checks read-only against a repo you already have.

→ **[Read the Trailhead guide](./trailhead/README.md)** for the seven gates and the staged posture.

## Install

### Claude Cowork (desktop app)

1. Open the **Customize** menu (left sidebar) → **Plugins** tab.
2. Under **Personal plugins**, click **"+"** → **Add marketplace**.
3. Enter the repository: `kenziecreative/kenzie-creative`.
4. Install the tool you want.

### Claude Code (CLI)

```
/plugin marketplace add kenziecreative/kenzie-creative
/plugin install goal-setting@kenzie-creative
/plugin install intelligence-briefing@kenzie-creative
/plugin install photo-generator@kenzie-creative
/plugin install researcher@kenzie-creative
/plugin install sage@kenzie-creative
/plugin install security@kenzie-creative
/plugin install strategist@kenzie-creative
/plugin install thinkers@kenzie-creative
/plugin install trailhead@kenzie-creative
```

Once a tool is installed, open the project where you want to use it and follow that tool's guide — for the brief, run `/intel-setup`; for research, run `/research:init`; for the meeting round-up, run `/sage:setup`; for a strategy, run `/strategist:init`; for goals, run `/goal-setting:init`; for photos, run `/photo-setup`; for project gates, run `/trailhead:init` (or `/trailhead:audit` on a repo you already have). Thinkers needs no setup — just describe a situation or run `/thinkers:identify`.

## Updates

New versions arrive only when one is published — nothing changes under you.

**Cowork:** Customize → Plugins → refresh the `kenzie-creative` marketplace, then update the tool.

**Claude Code:**

```
/plugin marketplace update kenzie-creative
/plugin update goal-setting
/plugin update intelligence-briefing
/plugin update photo-generator
/plugin update researcher
/plugin update sage
/plugin update security
/plugin update strategist
/plugin update thinkers
/plugin update trailhead
/reload-plugins
```

If a version won't change, your local catalog is cached — uninstall and reinstall the tool to force a clean pull.

## License

MIT — see [LICENSE](./LICENSE).

# Kenzie Creative

**Small, focused tools for staying on top of your world, by [Kenzie Creative](https://www.kenzienotes.com).**

A **plugin marketplace for Claude** — works in both Claude Cowork (the desktop app) and Claude Code (the CLI). This repo is the catalog; each tool below is a plugin you can install into Claude and use in any project.

Each tool does one thing well and runs on its own. Instead of one program that tries to do everything, you install only the few that fit how you actually work — a brief that triages the outside world, a research system that turns Claude into a rigorous research partner, a meeting round-up that keeps a fast-moving week legible, and (in time) tools that triage your messages and the decisions waiting on you. They stay out of each other's way: every tool works alone; some plugins coordinate through shared files in the project when they're run together; others run entirely on their own.

Once a tool is installed, it shows up as commands and skills you can run in any Claude project.

## Plugins at a glance

| Plugin | Version | What you get | Guide |
|---|---|---|---|
| Goal Setting | 0.2.3 | Set business goals that survive contact with reality — and actually operate against them, not abandon them by February | [guide](./goal-setting/README.md) |
| Intelligence Briefing | 0.3.0 | Know what actually moved in your world today, without wading through the whole news cycle | [guide](./intelligence-briefing/README.md) |
| Photo Generator | 1.2.0 | Get a professional-grade photo from a plain-language description, without knowing what a key light or an 85mm prime is | [guide](./photo-generator/README.md) |
| Researcher | 1.4.1 | Research you can stand behind, with every claim traced back to a real source | [guide](./researcher/README.md) |
| Sage | 0.2.0 | Always know where a decision landed and who owes what, across a whole week of meetings | [guide](./sage/README.md) |
| Strategist | 0.4.1 | Think a hard problem all the way through, and come out with a strategy you can defend | [guide](./strategist/README.md) |
| Thinkers | 0.1.0 | Make sense of a confusing situation — what's really going on, where your own thinking might be off, and what to do | [guide](./thinkers/README.md) |

Each version mirrors that plugin's `plugin.json`, which is the source of truth for updates.

## The tools

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

**Get research you can actually stand behind, instead of a confident summary that might be invented.** Pick a topic, get a phased plan grounded in preliminary research, then work through it together — collecting sources, finding patterns, mapping gaps, synthesizing findings, and auditing every claim before it reaches output. Every claim traces back to a specific source. Not a summarizer; a research partner.

→ **[Read the Researcher guide](./researcher/README.md)** for setup, research types, and the integrity model.

### Sage

**End the week knowing where every decision landed and what's owed, even when five meetings all touched the same thing.** Each meeting becomes a structured summary; every summary folds into one living round-up that tracks action items, cross-meeting threads, and a forward watch list. Pulls transcripts from Read.ai, Fireflies, or Granola via MCP; works on manually dropped transcripts for anything else. The whole point: a fast-moving week stays legible at a glance.

→ **[Read the Sage guide](./sage/README.md)** for setup, supported services, and the round-up structure.

### Strategist

**Think a hard problem all the way through and come out with a strategy you can actually defend, not a blank framework template.** It walks one problem through a single repeatable loop — Define → Frame → Analyse → Insight → Synthesise → Story → Move — and at each step puts the right framework from a 70-framework library in front of you, helps you apply it to your actual situation, and writes the result into one living strategy brief. A critic can pressure-test your reasoning whenever you want it — testing the logic, not the evidence.

→ **[Read the Strategist guide](./strategist/README.md)** for the loop, the library, and the critic.

### Thinkers

**Make sense of a confusing situation — what's actually happening, whether your own thinking is off, and what to do about it.** Describe what you're dealing with and it names the pattern at work (a bias, a fallacy, a persuasion or manipulation tactic, a strategic move) from a 243-pattern library, carefully — it draws the line between, say, real gaslighting and an ordinary disagreement before it ever hands you a heavy label. Five ways in: `identify` what's going on, `explain` a named pattern, `practice` spotting them, `decide` a tough call, or `spar` to stress-test your thinking. It talks like a counselor, not a textbook, and tells you the honest thing rather than the flattering one.

→ **[Read the Thinkers guide](./thinkers/README.md)** for the five skills and the pattern library.

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
/plugin install strategist@kenzie-creative
/plugin install thinkers@kenzie-creative
```

Once a tool is installed, open the project where you want to use it and follow that tool's guide — for the brief, run `/intel-setup`; for research, run `/research:init`; for the meeting round-up, run `/sage:setup`; for a strategy, run `/strategist:init`; for goals, run `/goal-setting:init`; for photos, run `/photo-setup`. Thinkers needs no setup — just describe a situation or run `/thinkers:identify`.

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
/plugin update strategist
/plugin update thinkers
/reload-plugins
```

If a version won't change, your local catalog is cached — uninstall and reinstall the tool to force a clean pull.

## License

MIT — see [LICENSE](./LICENSE).

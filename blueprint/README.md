# Blueprint

Turn how you actually work into a structured process model — with every step rated for where automation is safe and where a human must stay in the loop.

Most process documentation explains "what we do." An automation-ready document has to capture more: what triggers the work, what data moves where, what decisions get made and by what criteria, what goes wrong and how you handle it, and where the cost of an unreviewed mistake is high enough that a human must stay in the loop. People can't write this from memory. They describe the idealized version and forget the micro-steps, the workarounds, and the judgment calls that make the process actually run.

Blueprint fixes that by interviewing you. It walks you through your most recent real run of the process, asks the questions that surface the tacit detail, and writes the result into a structured Process Blueprint.

And if you don't yet know *which* process to document — if the honest answer to "which one?" is "I'm not sure what I'd even call them" — Blueprint can find them first. A discovery sweep surfaces the recurring work you've stopped noticing you do, into a short inventory of candidates, then points you at the few worth capturing first.

Part of the [Kenzie Creative marketplace](https://github.com/kenziecreative/kenzie-creative).

## Install

```
/plugin marketplace add kenziecreative/kenzie-creative
/plugin install blueprint@kenzie-creative
```

## Setup

None required. Blueprints save to a `blueprints/` folder in whatever project you run the capture in. To relocate them, copy `templates/CLAUDE.md` into your project root and set `blueprints_dir`.

## Use

Blueprint does four distinct things. The dividing line is whether the process **already exists**: capture is for work you already run, design is for work you don't yet.

**Discover → Design (something new) or Capture (something you run).**

- `/blueprint:discover` — a short sweep that surfaces your recurring work into a **Process Inventory**: candidate processes in your own words, plus which few to tackle first. Use this when you can't yet name your processes.
- `/blueprint:design` — model a process you've been **handed but no one runs yet**. Since there's no real run to extract, it *proposes* an intended flow — built only from your real goal, constraints, and nearest existing process, never generic best-practice — as a **designed Blueprint (proposed, not yet run)**. A designed process graduates to a captured one once you've run it a few times.
- `/blueprint:capture` — model **one** process you already run. Blueprint asks which process and which mode.
- `/blueprint:guide` — not sure which you need? It explains the four jobs and points you at the right first step. Or just ask "how does Blueprint work?" or "where do I start?"

You can also just describe what you're after and Blueprint will offer the right one.

**Two capture modes:**

- **Quick (~15 minutes).** A coarse but grounded model of one process: trigger, main steps, outputs, and a first-cut autonomy rating per step. Good for taking stock of one process fast.
- **Deep (~45-60 minutes).** The full field set: decision logic, exception paths, approval authority, evidence of completion, timing, risks, audit needs. Produces a model detailed enough to take to a new team member or an automation build once a stakeholder has validated it.

**What to capture first.** Discovery ranks your inventory through three lenses, because process capture is worth more than automating chores: **automation opportunity** (frequent, mechanical, time-consuming work), **operational exposure** (high-consequence or key-person-dependent work, captured for resilience), and **knowledge-loss risk** (tacit work only one person knows how to do). A low-frequency, high-risk process can deserve capturing before a merely annoying one.

## What it does

The interview anchors in your most recent real run of the process (not the idealized version), separates mechanical work from judgment work, captures why each step exists (not just what happens), and flags what it doesn't know instead of inventing detail.

Every step in the finished Blueprint carries an autonomy rating:


- **Automate** — repetitive, low-risk, reversible, easy to validate. Safe for an agent.
- **Monitor** — the agent can proceed, but a human watches through alerts, sampling, or periodic audit.
- **Human** — the step affects money, compliance, customer trust, or brand-sensitive judgment. A person decides, every time.

The question underneath all three ratings: *if this step were done wrong with no review, what would happen?*

Blueprint documents and rates; it does not build the automation. What it produces is the modeling layer — the thing you need before wiring any process to an agent.

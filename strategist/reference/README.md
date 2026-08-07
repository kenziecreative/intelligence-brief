# Strategy Spine — Reference Library

The framework library behind the strategist plugin, organised by the **Strategy Spine**: the seven-stage method this plugin runs a problem through, from the question worth answering to the move worth making, and back again.

The Strategy Spine is our own framework — a derivation of Creating Conditions, anchored to the Metaskills and Learning-and-Teaching models. The full source documents ship in [`frameworks/`](frameworks/); read those to understand the depth beneath the stages.

## The Spine

Each stage is a distinct mode of thinking, ordered so that every stage produces exactly what the next one needs. The loop closes: Move surfaces what no plan could predict, and you re-enter Define.

1. **[Define](define/README.md)** — establish the objective and the real question the strategy must answer.
2. **[Frame](frame/README.md)** — construct the lens: choose the dimensions to examine the problem through.
3. **[Analyse](analyse/README.md)** — interrogate the evidence behind each dimension.
4. **[Insight](insight/README.md)** — surface what the analysis means: the non-obvious truths, patterns, and tensions.
5. **[Synthesise](synthesise/README.md)** — build the insights into a coherent whole; reconcile, prioritise, and set the through-line. Commitment to the strategy locks here, in a gate before Story.
6. **[Story](story/README.md)** — shape the strategy into a narrative that lands and can be carried.
7. **[Move](move/README.md)** — translate the strategy into action: ownership, priorities, and the conditions for execution.

For the framework that explains *why* each stage demands the thinking it does — including the metaskill that drives each one — see [`frameworks/strategy-spine.md`](frameworks/strategy-spine.md).

## Index

[INDEX.md](INDEX.md) — every framework in one table (slug, stage, summary, source, path).

## How entries are structured

Each framework is one markdown file with YAML frontmatter (`stage`, `slug`, `related`, `source`) and a fixed set of sections: What It Is, Why It Works, How To Use It, Worked Example, When To Use It, Things To Watch Out For, Related Frameworks. Each entry is written to be understood by someone meeting the framework for the first time.

Each stage README does three jobs: states what the stage produces and its done-bar, teaches how to choose among its frameworks (grouped by the question you are asking), and documents how the stage runs.

## Frameworks by stage

| Stage | Frameworks |
|-------|-----------|
| Define | 3 |
| Frame | 3 |
| Analyse | 18 |
| Insight | 25 |
| Synthesise | 8 |
| Story | 7 |
| Move | 6 |
| **Total** | **70** |

## Source frameworks

The [`frameworks/`](frameworks/) directory ships the canonical source documents the Strategy Spine derives from, so any reference in the plugin resolves to something you can read:

- [`strategy-spine.md`](frameworks/strategy-spine.md) — the seven-stage method and its metaskill mapping.
- [`metaskills.md`](frameworks/metaskills.md) — the six capacities each stage runs on.
- [`learning-and-teaching.md`](frameworks/learning-and-teaching.md) — the learning model the spine's analytical core mirrors.
- [`creating-conditions.md`](frameworks/creating-conditions.md) — the parent posture beneath all of it.

These are copies of canonical documents maintained outside the plugin. Sync is machine-checked and release-blocking (`node dev/scripts/lint-doctrine-drift.mjs --plugin strategist`); change the canon, then re-copy — never edit these in place.

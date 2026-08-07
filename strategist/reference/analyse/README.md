# Analyse

*Interrogate the evidence behind each dimension. Find what is true, not what you hoped.*

Analyse is the third stage of the Strategy Spine, and it runs on Exploring: this is investigation, not assertion. For the full account of where Analyse sits in the spine and why it demands the thinking it does, see the [Strategy Spine overview](../README.md). This page covers what the stage produces, how to choose among its tools, and how it runs.

## What it produces

For every dimension your Frame named, a finding backed by evidence, with cause and effect made explicit where the question demands it. Recorded in `strategy/brief.md` under Analyse.

The stage is done when:

- **Every dimension from Frame has been interrogated.** None skipped because it looked obvious. The obvious dimension is where the wrong assumption usually hides.
- **Each finding rests on data, not impression.** "Sales feel slow" is not a finding. "Sign-ups fell 22% over six weeks" is.
- **Where the question was *why*, the answer names a cause,** not a restatement of the *what*. A number that dropped is a what; the reason it dropped is the finding.
- **You have looked for the evidence that would disconfirm the answer you wanted,** not only the evidence that confirms it. This is the discipline that separates Analyse from rationalisation.

## Choosing the tool

Analyse holds 18 frameworks. You do not run all of them. You run the one that answers the question you are actually asking about a dimension, and a dimension usually asks only one or two. Reaching for every tool is the Confident Generalist move the strategist refuses. The skill is matching the question to the instrument.

Start from the question, not the chart.

### "What is happening over time?" — movement, direction, when it turned

- [Trend](trend.md) — the direction, pace, and inflection of a value across time. The default first look at any time series.
- [Rank](rank.md) — how positions change over time. Not just who is winning, but who is gaining and who is losing ground.
- [Actual v Target](actual-v-target.md) — performance against the plan, period by period, so drift is visible at a glance.

### "How do these compare, and how is the whole divided?" — size, share, spread

- [Comparison](comparison.md) — which is bigger, and by how much. Discrete categories side by side.
- [Mix](mix.md) — how the composition of a whole shifts between two points, so you see who is winning share within the total.
- [Distribution](distribution.md) — how values spread across a range. Clustered in the middle, skewed to one end, or split into groups.
- [Candlestick](candlestick.md) — the range and variability within each category, not just its typical value.
- [Cumulative](cumulative.md) — concentration. Whether a small number of categories accounts for most of the result.

### "Do these two things move together?" — relationship

- [Scatter](scatter.md) — whether, and how strongly, two variables relate. The tool for testing a suspected link before you assume it.

### "What caused this, or why is it happening?" — cause and decomposition

- [Waterfall](waterfall.md) — decompose the gap between a start and an end number into the quantified steps that moved it. Cause, with sizes attached.
- [5 Why's](5-whys.md) — drill a single causal chain to a root cause you can actually fix. Best when there is one traceable problem.
- [5W+H](5w-h.md) — map the full terrain of a problem from six angles before drilling. A pre-step to 5 Why's when the problem is still fuzzy.
- [Yes/No](yes-no.md) — route a diagnosis through branching binary logic when the path is conditional rather than a single chain.

### "Does the economic model work?" — money

- [Unit Economics](unit-economics.md) — the lifetime profit of one customer against the cost of acquiring them. Whether it works before you scale.
- [Profit Margin](profit-margin.md) — revenue, cost, and profit per period, with margin overlaid. How much of each dollar survives.
- [ROIC](roic.md) — how efficiently invested capital becomes operating profit, and which lever drives that efficiency.
- [Marginal Return](marginal-return.md) — how each added unit of input yields less output, and where it stops paying.
- [Cashflow](cashflow.md) — the value of an opportunity over time, discounting future flows back to today.

**Tools chain.** Most real analysis is two or three deep, not one. When the finding is about *why* a trend moved, start with the [Trend](trend.md) to see the shape, then [Waterfall](waterfall.md) to size the causes, then [5 Why's](5-whys.md) to reach the root. The question leads; the tools follow it down.

## How it runs

The `strategist-stage` skill runs this stage. Working from the dimensions your Frame produced, it:

1. Takes each dimension in turn and names the question being asked of it.
2. Helps you pick the framework that answers that question, using the menu above.
3. Applies it with you against your data, and records the finding in `strategy/brief.md` under Analyse. This is a high-stakes stage where `/strategist:pressure-test` is offered before moving on.
4. Advances `strategy/STATE.md` to Insight once every dimension has a finding that clears the bar above.

The loop runs backward when it has to. If a finding here changes your mind about the problem or the frame, the stage points you back to Define or Frame rather than forcing forward with a question you no longer believe.

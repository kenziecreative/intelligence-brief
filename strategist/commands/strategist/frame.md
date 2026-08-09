---
description: Frame — construct the lens you examine the problem through (Driver Tree, Bucketing, Hypothesis)
allowed-tools: Read, Write, Edit, Glob, Grep
---

Run the **Frame** stage of the Strategy Spine.

Use the `strategist-stage` skill for the **frame** stage and follow its steps.
It presents this stage's framework menu from the library
(`${CLAUDE_PLUGIN_ROOT}/reference/frame/`), helps the user pick the framework that fits
their situation, applies it with them, writes the result into `strategy/brief.md` under
the Frame section, and advances `strategy/STATE.md` to the next stage.

The loop iterates: if this stage changes the user's mind about an earlier one, it points
them back rather than forcing forward.

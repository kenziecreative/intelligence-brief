---
description: Analyse — interrogate the data behind each driver (18 chart & reasoning frameworks)
allowed-tools: Read, Write, Edit, Glob, Grep
---

Run the **Analyse** stage of the strategy loop.

Use the `strategist-stage` skill for the **analyse** stage and follow its steps.
It presents this stage's framework menu from the library
(`${CLAUDE_PLUGIN_ROOT}/reference/analyse/`), helps the user pick the framework that fits
their situation, applies it with them, writes the result into `strategy/brief.md` under
the Analyse section, and advances `strategy/STATE.md` to the next stage.

The loop iterates: if this stage changes the user's mind about an earlier one, it points
them back rather than forcing forward.

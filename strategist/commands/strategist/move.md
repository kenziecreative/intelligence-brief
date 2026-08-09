---
description: Move — translate the strategy into action (Execution Plan, GTM Stack, Comms Deploy)
allowed-tools: Read, Write, Edit, Glob, Grep
---

Run the **Move** stage of the Strategy Spine.

Use the `strategist-stage` skill for the **move** stage and follow its steps.
It presents this stage's framework menu from the library
(`${CLAUDE_PLUGIN_ROOT}/reference/move/`), helps the user pick the framework that fits
their situation, applies it with them, writes the result into `strategy/brief.md` under
the Move section, and advances `strategy/STATE.md` to the next stage.

The loop iterates: if this stage changes the user's mind about an earlier one, it points
them back rather than forcing forward.

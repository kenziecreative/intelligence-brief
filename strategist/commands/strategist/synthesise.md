---
description: Synthesise — build the insights into a coherent whole, then commit (Evaluation, Eisenhower, Bezos, SPADE)
allowed-tools: Read, Write, Edit, Glob, Grep, Task
---

Run the **Synthesise** stage of the Strategy Spine.

Use the `strategist-stage` skill for the **synthesise** stage and follow its steps.
It presents this stage's framework menu from the library
(`${CLAUDE_PLUGIN_ROOT}/reference/synthesise/`), helps the user reconcile the insights into
one coherent through-line, prioritise what matters, and pass the **commitment gate** that
locks the decision before Story. It writes the result into `strategy/brief.md` under the
Synthesise section, and advances `strategy/STATE.md` to the next stage.

The loop iterates: if reconciling the insights reveals an earlier stage was wrong, it points
them back rather than forcing a coherent-looking strategy onto a broken foundation.

---
description: Set up this project with a gate that fails — contract, running state, and seven checks
allowed-tools: Read, Write, Edit, Glob, Grep
---

Set up trailhead in this project.

Use the `trailhead-init` skill and follow its steps exactly. It detects the stack first,
asks four questions (three if the project ships no interface), installs `scripts/gate.mjs`
with seven checks, and writes the contract, running-state, and agent-context files for
Claude Code, Codex, and Gemini CLI.

Two things to hold onto while running it: unanswered questions become **triggered rows**
in `contracts/OPEN-DECISIONS.md` rather than being dropped, and **the first gate run is
supposed to be red**.

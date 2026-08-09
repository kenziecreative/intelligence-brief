---
description: Audit a repo against the eight trailhead gates — read-only, one report file
allowed-tools: Read, Grep, Glob, Write
argument-hint: "[path to repo, defaults to cwd] [--no-write]"
---

Audit this repository against the eight trailhead gates.

Use the `trailhead-audit` skill and follow its steps exactly. It is read-only: it reports
each gate as PRESENT, PARTIAL, ABSENT, or CONFLICT with cited evidence, and writes at most
one new file — `TRAILHEAD-AUDIT-<YYYY-MM-DD>.md` at the repo root. With `--no-write`, it
puts the report in the conversation instead.

Arguments: $ARGUMENTS

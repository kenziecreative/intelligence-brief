---
name: trailhead-audit
description: This skill should be used when the user asks for a trailhead audit of a repository, or asks which project-setup gates a codebase is missing (e.g. "trailhead audit", "what gates is this project missing", "check this repo against trailhead"). Read-only — reports eight gates as PRESENT, PARTIAL, ABSENT, or CONFLICT with evidence and remediation, and writes at most one new dated report file.
allowed-tools: Read, Grep, Glob, Write
model: sonnet
---

# trailhead-audit — what this repo is missing, and what it will cost

Report the state of eight project gates against an existing repository. This is the
read-only half of trailhead. `/trailhead:init` installs these gates; this skill only
looks and tells you.

## Invariant — blast radius is one new file

Write **exactly one** file: `TRAILHEAD-AUDIT-<YYYY-MM-DD>.md` at the repository root.
Nothing else. Do not touch source, `contracts/`, `.qa/`, `.claude/`, `.gemini/`,
`package.json`, or git.

`Edit` and `Bash` are deliberately absent from `allowed-tools`, so this skill cannot
modify an existing file or run a command. `Write` is present for the report alone. If
the user passes `--no-write`, skip the file and put the report in the conversation.

If the report file for today already exists, read it, and overwrite only after telling
the user you are replacing today's report.

## Why these eight

Each maps to a failure observed in a real 14-deliverable autonomous build. The governing
finding: **every requirement with a mechanical check held; every requirement that existed
only as prose drifted, while being complied with in letter.** So the audit asks one
question per gate — *is there something here that fails?* — not *is there a document about
it?* A thorough policy with no exit code scores PARTIAL, never PRESENT.

## Verdicts

| Verdict | Means |
|---|---|
| `PRESENT` | A mechanical check exists that fails when the requirement is violated, or a named human verdict is recorded with a real slot for it |
| `PARTIAL` | The requirement is written down but nothing fails when it drifts, or the check exists but does not cover the whole surface |
| `ABSENT` | Nothing found |
| `CONFLICT` | Something is here, but it is structured in a way that actively causes the failure |
| `N/A` | Genuinely does not apply — record why |

## Procedure

**1. Detect the shape first, and never ask what you can detect.** Glob for the package
manifest (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `Gemfile`), the test
runner, the linter config, `.qa/`, `contracts/`, `.planning/`, `CLAUDE.md`, `AGENTS.md`,
`GEMINI.md`, `.gemini/`, and any route/page/component directory. Decide from the tree
whether this ships a user-visible interface — a web framework, a route or page directory,
`.html`/`.css`/`.tsx` under a web path, or a CLI entry point. If genuinely ambiguous, say
so in the report and evaluate gate 5 anyway.

**2. Run the eight checks below.** Gather concrete evidence for each — file paths, line
numbers, byte sizes, the actual string you matched. An audit row without a citable
artifact is an opinion.

**3. Write the report.** Eight rows, capped. A 40-item audit is a wall nobody climbs.

## The eight checks

### 1. Contract / state split

Look for a governing document (`BUILD.md`, `SPEC.md`, `PROJECT.md`, `CONTRACT.md`, a
`.planning/` doc). Read its headings. Does one file hold **both** the invariants and a
running status or deliverable table?

- `CONFLICT` if yes. That single structure is why a status table drifts while the prose
  around it stays accurate — the file is edited every deliverable, so it stops being a
  contract. Note its size; a governing doc past ~40KB has almost certainly absorbed state.
- `PARTIAL` if the split exists by convention but nothing enforces it.
- `PRESENT` if the contract is separate, capped, and something fails when a status table
  appears inside it.

### 2. Status vocabulary

Grep the status/deliverable table for the words `implemented`, `done`, `complete`,
`built`, `verified`, `accepted`.

- `PARTIAL` if the three-word vocabulary (`built` / `verified` / `accepted`) is *defined*
  somewhere but nothing greps for the banned words.
- `ABSENT` if there is no defined vocabulary.
- `PRESENT` only if a check fails on `implemented`, or on a `verified` row with no
  corresponding green gate record.

Say why this matters in the report: "implemented" is the word that lets built-and-unverified
work accumulate while every individual status claim stays accurate.

### 3. QA cadence and coverage ratchet

Count QA spec files (e.g. `.qa/*.md` excluding `README`, `FINDINGS`, `HISTORY`). Count how
many have ever run — named in `.qa/HISTORY.md` or in a `.qa/reports/` filename. Look for a
test or script that fails when the un-run count increases.

- Report the ratio explicitly: **"N of M specs have ever run."** That number belongs in the
  report whatever the verdict is.
- `PRESENT` if a ratchet exists and the un-run ledger may only shrink.
- `PARTIAL` if specs and history exist but nothing fails.
- `ABSENT` if there is no QA structure at all.

### 4. Lint, format, and orphaned suppressions

Check the manifest for a lint and a format script and for a linter in dev dependencies.
Then grep source for suppression directives — `eslint-disable`, `@ts-ignore`,
`@ts-expect-error`, `# noqa`, `# type: ignore`, `//nolint`, `#[allow(`.

- `ABSENT` if suppressions exist for a tool that is not installed and configured. Quote one
  file and line. This is the sharpest single finding an audit can make: the code is
  apologizing to a tool that was never there.
- `PARTIAL` if a linter is installed but no check enforces that suppressions match a real,
  runnable tool.
- `PRESENT` if both hold.

### 5. Design surface mapping (interface projects only)

`N/A` for libraries and services — record why.

Otherwise: is there a document mapping each user-visible surface to the governing pattern
it is built from? Compare its rows against the actual routes/pages in the tree.

- `PARTIAL` if a design-system or token document exists but nothing requires a surface to
  have a row **before** it is built. Filled in afterwards it is a record, not a constraint.
- `ABSENT` if there is no mapping at all.
- `PRESENT` if every surface has a row and something fails when one does not.

Check the typefaces too. A page rendering on fallback stacks while the design system names
specific faces is most of a visual gap on its own — report it as evidence under this row.

### 6. Open-decisions ledger with triggers

Look for a decisions file. Read it. Is it **retrospective** (a record of decisions already
made) or **live** (open questions, each with a trigger that fires when the decision becomes
expensive)?

- `ABSENT` if only a retrospective record exists. Say so plainly — a decision log is not a
  decision gate.
- `PARTIAL` if open questions are listed without triggers.
- `PRESENT` if each open row carries a trigger (a path glob or a milestone) and something
  fails when a trigger fires while the row is unanswered.

This is the gate that catches an architecture choice nobody made until it was expensive.
Nobody knows the answer at t=0; the point is being *asked* at the right moment.

### 7. Gate runner

Look for a single entry point that runs the checks and records a result — `scripts/gate.*`,
`.gates/`, a `gate` script in the manifest, or a CI workflow doing the same.

- `ABSENT` if the checks exist only as separate commands a human must remember.
- `PARTIAL` if a runner exists but does not record a receipt, so no downstream claim can
  reference it.
- `PRESENT` if one command runs them, writes a receipt, and exits non-zero.

Note whether CI exists at all. A gate whose only enforcement is local goodwill is worth
saying out loud.

### 8. Multi-CLI agent context

Check for `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.gemini/settings.json`.

- `ABSENT` if none exist.
- `PARTIAL` if only `CLAUDE.md` exists — Codex and Gemini read nothing, and a repo with one
  agent's context file is a repo that only works for one agent.
- `PRESENT` if `AGENTS.md` carries the substance and stands alone (Codex and Gemini do not
  follow `@imports`), with `CLAUDE.md` and `.gemini/settings.json` pointing at it.

## Report format

````markdown
# Trailhead audit — <repo name>

<!-- trailhead v0.1.0 -->

**Audited:** <YYYY-MM-DD> · **Shape:** <detected stack, interface yes/no>

<one paragraph: the single most consequential finding, in plain language>

| # | Gate | Verdict | Evidence |
|---|---|---|---|
| 1 | Contract / state split | CONFLICT | … |
| … | | | |

## Findings

### 1. Contract / state split — CONFLICT

**What is here:** <concrete, with paths and sizes>
**What fails today:** <nothing / this specific check>
**Failure it maps to:** <the drift this permits>
**Remediation:** <the smallest thing that would make it fail>

<!-- repeat per gate, worst verdict first -->

## What to do first

<Three items, ordered by consequence, each naming the gate number.>
````

Order findings by consequence, not by gate number, and lead the summary paragraph with the
worst one. Credit what is already there — a `PRESENT` row is the most useful signal in the
report, because it tells the reader the pattern is already understood here.

## Guardrails

1. **Cite or drop it.** Every verdict names a file. No verdict is inferred from the absence
   of a search you did not run.
2. **A document is not a gate.** Thorough prose scores `PARTIAL`. Say what would fail.
3. **Do not propose fixes you would have to write.** This skill reports; `/trailhead:init`
   installs. Remediation lines are one sentence, not a plan.
4. **Never read, print, or copy a credential value.** If a scan surfaces something that
   looks like a secret, report the file path and the fact of it, masked — never the value.
5. **Report honestly.** If a gate is `PRESENT`, say so. An audit that finds eight problems
   in every repo is a template, not a measurement.

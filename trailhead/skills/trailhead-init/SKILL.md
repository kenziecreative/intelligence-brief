---
name: trailhead-init
description: This skill should be used when the user asks to set up trailhead in a project, or to install project gates and the contract/state scaffolding (e.g. "trailhead init", "set up the gates for this project", "scaffold this repo with trailhead"). Runs a four-question interview, installs a gate runner with seven checks, and writes the contract, running-state, and multi-CLI agent-context files.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep
model: opus
---

# trailhead-init — install the gates before there is anything to gate

Scaffold a project so that the requirements that usually rot can fail out loud. The
governing observation this exists for: **every requirement with a mechanical check holds,
and every requirement that exists only as prose drifts while being complied with in
letter.**

So the deliverable is not documents. It is a `node scripts/gate.mjs` that exits non-zero,
plus the small number of files it reads.

## Tool discipline

**Never use shell.** Not `mkdir`, not `cp`, not `chmod`, not `ls`. Setup runs in Cowork
too, where shell triggers a permission prompt on every call, and `Bash` is deliberately
absent from `allowed-tools`. Consequences:

- **To create a directory, write a file into its path.** `Write` creates parents.
- **To copy a plugin file, `Read` it and `Write` it.** There is no `cp`.
- **No `chmod`.** Nothing scaffolded needs an executable bit; the gate is invoked as
  `node scripts/gate.mjs`.

## Step 1 — Detect, and never ask what you can detect

Before asking anything, `Glob` and `Read` to establish:

- package manifest and manager (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`)
- test command and build/typecheck command from that manifest's scripts
- linter and formatter, installed or configured
- whether this is a git repo (`.git`), and whether `.qa/`, `contracts/`, `.planning/`,
  `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.gemini/` already exist
- whether a route, page, or component directory exists

trailhead's predecessor asked "is this a git repository?" in the same step that told the
agent to check. Every question you can answer from the tree is a question that costs the
user a turn and buys nothing. **The interview budget is under two minutes**; spending it
on detectable facts is how a setup tool stops getting run.

## Step 2 — Explore what exists, and extend rather than replace

If any scaffolded artifact is already present, **do not overwrite it.** Read it, and tell
the user what you found and how you propose to integrate. Specifically:

- an existing `AGENTS.md` or `CLAUDE.md` — append a trailhead section, keep their content
- an existing `.claude/settings.json` or `.gemini/settings.json` — merge per
  `references/settings-merge.md`, which is union-and-set-if-absent, never clobber
- an existing `.qa/` — leave it entirely alone; the ratchet reads it, it is not ours
- an existing governing doc that holds both invariants and a status table — **say so, and
  propose the split.** Do not perform it unasked; that is the user's document.

## Step 3 — The interview

Four questions, three if the project ships no interface. Full text, rationale, and how to
turn each answer into a trigger: `references/interview.md`. Read it before asking.

1. **What are you building?**
2. **Does this ship a user-visible interface — a web or app UI, a CLI, or neither?**
3. *(if UI)* **What is the visual source of truth?**
4. **Who signs in, and how do they prove who they are? Include machine and agent clients.**

**"Not sure yet" is a complete answer, and it is not deferral.** Every unanswered
question becomes a row in `contracts/OPEN-DECISIONS.md` with a **trigger** — a path glob
that fires when the decision stops being cheap. Nobody knows most of these on day one;
pretending otherwise produces a guess wearing the costume of a commitment. What matters
is being asked at the right moment rather than six deliverables later.

Ask all four at once if the surface allows it. Do not interrogate one at a time.

## Step 4 — Write the scaffolding

Read each template from `${CLAUDE_PLUGIN_ROOT}/scaffold/`, substitute placeholders, write
into the project. Placeholders: `{{PROJECT_NAME}}`, `{{PROJECT_DESCRIPTION}}`, `{{DATE}}`
(today, actual — never guess), `{{VERSION}}` (from `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`),
`{{STAGE_LEVEL}}`, `{{SOURCE_GLOBS}}`, `{{SURFACE_GLOBS}}`, `{{BUILD_COMMAND}}`,
`{{TEST_COMMAND}}`, `{{CONTRACT_LINE_CAP}}` (default 300), `{{DESIGN_SOURCE}}`,
`{{CONVENTIONS}}`, `{{DESIGN_CONTRACT_ROW}}`, `{{OPEN_DECISION_ROWS}}`.

Every generated file keeps its `<!-- trailhead vX.Y.Z -->` marker. That is what lets a
later audit tell "this repo has a design contract" from "this repo has *ours*, at that
vintage", and what makes an upgrade possible instead of a re-scaffold.

**Always:**

| Template | Written to |
|---|---|
| `AGENTS.md.tmpl` | `AGENTS.md` |
| `CLAUDE.md.tmpl` | `CLAUDE.md` |
| `gemini-settings.json.tmpl` | `.gemini/settings.json` |
| `claude-settings.json.tmpl` | `.claude/settings.json` |
| `contracts/CONTRACT.md.tmpl` | `contracts/CONTRACT.md` |
| `contracts/OPEN-DECISIONS.md.tmpl` | `contracts/OPEN-DECISIONS.md` |
| `contracts/identity.md.tmpl` | `contracts/identity.md` |
| `planning/STATE.md.tmpl` | `.planning/STATE.md` |
| `qa/HISTORY.md.tmpl` | `.qa/HISTORY.md` *(only if `.qa/` does not exist)* |
| `gate.config.json.tmpl` | `gate.config.json` |
| `gitignore.tmpl` | `.gitignore` *(merge if present)* |
| `scripts/gate.mjs`, `scripts/gate-lib.mjs` | `scripts/` **verbatim, no substitution** |
| `scripts/checks/*.mjs` | `scripts/checks/` **verbatim** |

**Interface projects also get:** `contracts/design-system.md`, plus the `design` and
`at-eval` human stages appended to `gate.config.json` — see `references/gate-catalog.md`
for the exact stanzas.

If the user answered "not sure" to question 2, **scaffold them anyway.** A false positive
costs one unused file; a false negative is the entire design failure this exists to
prevent.

**Stage level** defaults to `prototype` unless the project already has real users or real
data. At prototype only irreversible failures block, so the gate does not stand between
the user and a proof of concept. Say the level out loud in the report, and say that
raising it is a decision they take later on purpose.

## Step 5 — Run the gate, and expect it to be red

Tell the user to run:

```
node scripts/gate.mjs
```

**The first run is red, and that is correct.** The contract's invariants are still the
scaffolded placeholder, `.qa/` holds no specs, and any human gate is unattested — so at
minimum the `contract` and `qa` stages fail. Say this plainly rather than apologizing for
it: a fresh install that came up green would be the original bug shipped as the fix, a
gate reporting success for work that has not happened.

Be precise about *what* is red rather than promising a red run in general. At `prototype`
several of those failures report rather than block, so the result word will be `advisory`
and the exit code 0 — which is the staged posture working, not the gate failing to
notice. The run to care about is the first one that says `pass`.

The runner writes `.gates/ratchet.json` itself on every full run; do not hand-write it.
Do not run the gate yourself unless the user asks — this skill has no `Bash`.

## Step 6 — Report

State, concisely:

- every file written, and every file **not** written because something was already there
- the four answers, and which became rows in `contracts/OPEN-DECISIONS.md` with which triggers
- the stage level, and what it means for what blocks today
- the three things that will make the first run go green
- that `/trailhead:audit` re-checks all of this later, read-only

Then stop. **Do not commit.**

## Guardrails

1. **Never overwrite an existing file without saying so first.** Destructive-on-first-contact is how a tool gets uninstalled.
2. **Never write a trigger you have not sanity-checked against the tree.** A trigger matching nothing is a decision that will surprise someone; a trigger matching everything is noise. Prefer slightly wide — the audit reports dead triggers, and one early conversation is cheaper than one late migration.
3. **Never read, print, or copy a credential value.** If setup surfaces something that looks like a secret, report the path and the fact of it, and let the user move it.
4. **Do not fill in the contract's invariants for the user.** An invariant they did not write is one they will not enforce. Leave §2 empty with its guidance intact, and put it on the open-items list.
5. **Do not add a fifth question.** This skill dies at the moment of maximum impatience. Anything new must be detected or defaulted.

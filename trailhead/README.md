# Trailhead

**Start a project with its checks already installed, so the things that quietly rot fail loudly instead of drifting.**

Part of the [Kenzie Creative marketplace](https://github.com/kenziecreative/kenzie-creative).

This plugin exists because of one observation from a long autonomous build: *every
requirement that had a mechanical check held, and every requirement that existed only as
prose drifted — while being complied with in letter.* Not ignored. Complied with, in
letter, and still wrong.

That build had eighteen QA specs and ran one of them across fourteen deliverables. It had
`eslint-disable` comments in five files and no linter installed. It had a pinned design
system, a 46KB token extraction naming its compositional patterns seventeen times, and
shipped pages using none of them. Every one of those was written down somewhere. None of
them could fail.

So trailhead does not give you documents. It gives you a `node scripts/gate.mjs` that
exits non-zero, and the small number of files it reads.

**Where this sits next to GSD:** GSD is an agent workflow that produces artifacts.
Trailhead installs repo-resident scripts that run with no agent present — in CI, in Codex
CLI, in a terminal. GSD phase gates can shell out to `scripts/gate.mjs`; trailhead never
depends on GSD being installed.

## Install

```
/plugin marketplace add kenziecreative/kenzie-creative
/plugin install trailhead@kenzie-creative
```

## Use

### `/trailhead:init` — set up a project

Four questions, three if it ships no interface. Under two minutes. It detects your stack,
test runner, and linter rather than asking, then writes:

```
AGENTS.md                     the agent contract — the only file with substance in it
CLAUDE.md  .gemini/settings.json     pointers, so all three CLIs read the same thing
contracts/CONTRACT.md         what must be true (amendable, capped, no status table)
contracts/OPEN-DECISIONS.md   what isn't decided yet, and when it comes due
contracts/identity.md         who can act, and the stable-identity rule
.planning/STATE.md            where the work actually is
scripts/gate.mjs + checks/    the gate
```

**"Not sure yet" is a real answer.** Nobody knows their identity model on day one, and
pretending otherwise produces a guess wearing the costume of a commitment. Unanswered
questions become rows in `contracts/OPEN-DECISIONS.md` with a **trigger** — a path glob
that fires when the decision stops being cheap. You aren't asked to decide early. You're
guaranteed to be asked at the right moment.

That distinction is the whole product. More decision points don't help; the same number,
moved to where they're cheap, does.

**The first gate run is red.** Human verdicts are unattested, QA hasn't run, the contract
is empty. A fresh install that came up green would be the original failure shipped as its
own fix. The first green run is something the project earns.

### `/trailhead:audit` — check a repo you already have

Read-only. Writes one dated report at the repo root and touches nothing else. Reports
eight gates as PRESENT, PARTIAL, ABSENT, or CONFLICT with cited evidence — and credits
what's already there, because a `PRESENT` row is the most useful line in the report.

## What it does

Seven gates, each mapped to a failure that actually happened:

| Gate | Fails when |
|---|---|
| secrets | a credential format is in the tree and not waived on the line |
| decisions | an undecided row's trigger has fired, or an open row has no trigger at all |
| build / unit | the build or test command exits non-zero |
| qa | any spec has never run, or the un-run count grows |
| status | a status word outside the four, a `verified` row citing evidence that doesn't exist, or an `accepted` row while a human gate has no verdict |
| contract | the contract goes over its line cap, grows a status table, keeps placeholder invariants, or declares an email as the identity key |
| design / at-eval | no human verdict, a stale one, or one citing an artifact that doesn't match what was required |
| suppression | a suppression comment names a tool that isn't installed |

**Staged, so it doesn't block a prototype.** Each gate declares how reversible its failure
is; the project declares how far along it is. The rule is *gate what you cannot undo,
report what you can*. At `prototype`, only the irreversible ones block — a leaked
credential, an overdue architecture decision. Failing tests and unrun QA report and
ratchet. At `pilot` and `production` more of it blocks, and every run prints exactly what
the next promotion would fail on.

Reporting is not ignoring. A reporting stage may not get *worse* at any level, and
deleting its inputs to make it disappear blocks unconditionally. A run with reporting
failures says `advisory`, never `pass` — the result word and the exit code are different
claims, and only `pass` supports calling something verified. In CI, `--strict` makes every
stage block.

**Three status words, no others.** `built`, `verified`, `accepted` — defined so that
"implemented" (which means built-and-unverified, and which lets eight deliverables of
unverified work accumulate while every individual report stays accurate) fails the gate.

**Works with Claude Code, Codex, and Gemini CLI.** `AGENTS.md` carries the substance and
stands alone; the others point at it. The gate is a script rather than a skill for exactly
this reason — a gate that only exists inside one agent isn't a gate, it's a habit.

## What it isn't

It won't write your invariants for you — an invariant you didn't write is one you won't
enforce, so it checks that they exist rather than supplying them. It doesn't judge design
quality; composition conformance is a named human verdict with a recorded slot, not
automation pretending to have taste. Its secret scanning is a high-confidence floor that
needs no install, not a replacement for gitleaks. And nothing in a repository can stop a
determined actor from editing the config to make the gate green. The gate's real authority
comes from CI running `--strict` on a protected branch; everything in-repo is scaffolding
for that.

This release went through an external blind code review that found the first
implementation didn't hold this claim — the ratchet had no writer, missing files read as
passes, and a four-line file could forge a human verdict. Those are fixed and the review
is on file. The honest posture is that a tool making this promise should keep being
attacked, not trusted because it says the right things.

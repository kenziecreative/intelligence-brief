---
name: strategist-pressure-test
description: This skill should be used when the user asks to pressure-test, stress-test, or red-team the current strategy's reasoning (e.g. "pressure-test this strategy", "red-team my recommendation", "stress-test the decision"). Dispatches the strategist-critic subagent to interrogate assumptions, logic, and failure modes; tests logic, not evidence.
allowed-tools: Read, Write, Edit, Glob, Grep, Task
---

# strategist-pressure-test — Interrogate The Reasoning

Stress-test the strategy's reasoning — not its evidence, its *logic*. This skill gathers
the material, dispatches the `strategist-critic` agent to attack it, and records the
findings for the user to address back in the relevant stage. It does not rewrite the
strategy.

(The Synthesise commitment gate runs this same critic automatically before the decision
locks — `strategist-stage` Step 4b. This skill is the on-demand pass: any stage, any
time, and the deeper cross-stage review after Move.)

## The narration firewall

Everything in this skill that has a name — steps, sections, files, and the critic agent
itself — is scaffolding the user never sees. They get the findings; they never get the
machinery that produced them.

The test to run on yourself is not "does this sound technical." It is **"would this phrase
also work as a heading, a step name, or a file path?"** If yes, say it another way.

This skill leaks in three particular places, all of them the same mistake:

- **The dispatch.** "Dispatching the critic now" reproduces Step 2's own heading. The user
  does not need to know the work is delegated, or to whom. If a pause needs covering, cover
  it the way a person would — "give me a moment with this."
- **The finding format.** The critic returns `[type] — issue — why — resolution` with tags
  like `WEAK INFERENCE` and `INTERNAL CONTRADICTION`. **That format is addressed to you, not
  to the user.** It exists so you can sort and rank the findings. Relaying the tag verbatim
  as a spoken heading hands over an agent-to-agent protocol; Step 3 says name the issue
  plainly, and that is why.
- **The recording.** "I've marked those clear in the state file" names the file. Say what
  stands and what doesn't. Where it is written is your business.

Say the finding, never the filing system.

## Current State

!`cat strategy/STATE.md 2>/dev/null || echo "No strategy/STATE.md — pressure-test runs against an active strategy; run /strategist:init first."`

## Step 1: Determine scope

1. If `strategy/STATE.md` does not exist, tell the user pressure-test works against an
   active strategy and stop (or, if they paste a strategy inline, test that instead).
2. Otherwise read `strategy/brief.md`. Decide scope:
   - **No argument:** test the whole brief as it currently stands.
   - **A stage named** (e.g. "pressure-test the synthesise stage"): test that section,
     plus the brief context it depends on.

## Step 2: Dispatch the critic

Use the Task tool to launch the `strategist-critic` agent. Pass it:

- The problem statement (from STATE.md).
- The brief content in scope (the relevant section(s), plus enough surrounding context
  for the reasoning to be judged fairly).
- The instruction to return findings in its standard format: each finding as
  `[type] — the issue — why it matters — what would resolve it`, where `type` is one of
  *Unstated Assumption, Logical Gap, Weak Inference, Alternative Framing, Failure Mode,
  Internal Contradiction, Fabricated Premise, Agent-Introduced Keystone*.

The critic is generative and self-contained — it does no web research and checks no
sources. It attacks the thinking, not the facts.

## Step 3: Present findings

Relay the critic's findings to the user, ordered by severity (load-bearing problems
first). For each: name the issue plainly, say why it matters to *this* strategy, and
give the concrete thing that would resolve it. Don't soften and don't pad — this is the
stage where being direct earns its keep.

**Relay the substance, not the envelope.** The `[type]` tag the critic attaches is sorting
metadata for you; it is not a heading for the user. "The Analyse stage ruled out price and
the Synthesise decision commits to a discount — those can't both be right" is the finding.
"**INTERNAL CONTRADICTION —** …" is the internal format wearing the finding's clothes. The
type still governs the *order* you present in; it just never gets spoken.

If the critic finds little of substance, say so honestly rather than manufacturing
concerns: "The reasoning holds up on the dimensions I tested. The one thing worth a
second look is …" or "Nothing load-bearing — this is solid."

## Step 4: Record open findings

Write the findings into the `## Open Pressure-Test Findings` section of
`strategy/STATE.md` (replace `(none)` or append). Each as a short line tagged with the
stage it bears on, so `/strategist:progress` can surface them and the user can clear
them as they address them. Mark the stage's `Pressure-tested` cell in the Stage Record
table honestly: `clear` if nothing load-bearing stands open, `open (n)` if n
load-bearing findings remain unresolved — tested-with-a-standing-objection is not
`clear`. `n` is a count: it equals the number of findings you just wrote into that
section, and it has to match whatever you say aloud about how many are open.

Do **not** edit `brief.md`. Acting on a finding is the user's call, made by re-running
the relevant stage — so point them there **when there is something to address**:

```
▶ To address these: re-run /strategist:<stage> for the affected stage(s), or talk them
  through with me here. Run /strategist:progress to see open findings any time.
```

Resolve `<stage>` to the actual stage names before this reaches the user. **If nothing
load-bearing was found, this block does not belong in the reply** — a clean result that
closes by pointing at findings that don't exist reads as boilerplate and undercuts the
affirmation you just made. Close with where things stand instead, and mention
`/strategist:progress` only if it's useful.

## Guardrails

1. Test the logic, not the evidence. Strategist makes no claim to source-rigor; don't
   invent an evidence-audit it isn't built for.
2. Honesty over theater. If it's sound, say it's sound. Manufactured concerns waste the
   user's attention and erode trust in the tool.
3. The critic interrogates; the user decides. Never rewrite the strategy from findings —
   record them and hand back.
4. Keep findings specific to this strategy. Generic "have you considered risks?" is
   noise; "the Synthesise stage assumes churn is price-driven, but the Analyse stage's data
   points to onboarding — that contradiction is load-bearing" is signal.

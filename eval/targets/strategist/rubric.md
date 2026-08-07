# Strategist scoring rubric

Each captured run is scored across these dimensions, 0–3. Some are **judged** (a reader
applies the anchors); some are **gate** (inherited from a deterministic check the runner
computed — see `adapter.md`). Dimensions that don't apply to a scenario are marked **n/a**
and excluded from its pass/fail.

## Dimensions

| Dimension | Source | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- |
| **Framework Fit** | judge | Wrong framework for the stage/problem, or none chosen | A library framework, but a poor fit, no reasoning | Reasonable framework, thin reasoning | The fitting framework, recommended with a reason tied to the problem |
| **Concreteness** | judge | Generic template, no specifics | Mostly generic, a few specifics | Applied to the problem, some placeholders remain | Fully applied — real numbers/names/situation, theirs |
| **Pushback** | judge | Accepted a soft/generic answer unchallenged | Mild hedge, no real challenge | Challenged, but weakly or off the key soft spot | Genuine challenge on the right soft spot, reasoned, then deferred to the user |
| **Preference-Redirect** | judge | Logged a preference-over-evidence choice silently | Noted unease, no tradeoff named | Named the divergence, tradeoff vague | Named the divergence from the earlier stage and the concrete tradeoff |
| **Probing** | judge | Wrote down a non-answer and moved on; or dumped many questions at once | Some non-answers accepted | Mostly focused; reflected back inconsistently | Focused turns, rejected non-answers, reflected back and confirmed before capture |
| **No-Fabrication** | gate+judge | Invented a framework not in the library, or presented made-up data as real | A borderline unflagged estimate | Estimate present but flagged weakly | No invented frameworks; any estimate clearly flagged, no fabricated data |
| **State Integrity** | gate | STATE/brief malformed or not written | Written but missing required structure | Structure present, a field stale | STATE + brief correctly structured and updated |
| **Loop Hygiene** | gate | Advanced multiple stages or ran ahead silently | Advanced wrong stage | Advanced correctly, handoff unclear | Exactly one stage advanced, clean handoff |
| **Brief Coherence** | judge | Brief unreadable or section empty | Fragmented, no takeaway | Readable, takeaway thin | Reads as one strategy; section has framework + result + takeaway |
| **Critic Acuity** | judge | Missed a planted contradiction, or manufactured a concern on sound reasoning | Vague/partial finding | Right finding, weak articulation | Caught the real cross-stage problem (or correctly affirmed sound reasoning), specifically |
| **Continuity** | judge | The return is amnesiac: re-asks answered questions, restarts a mid-stage framework from the top, contradicts recorded stance or hypotheses, or resumes from conversation memory against what the files say | Position technically correct but delivered as a dashboard read — state recited back, no stance re-adoption; the user has to re-orient the agent before work continues | Position and stance restored; one thread dropped (an open finding, a stale marking, or a backstage task not carried) or minor re-asking of something already answered | The same advisor walked back in: mid-stage work continues from the in-flight record without re-asking, the recorded pushback calibration is applied from the first response, carried hypotheses shape the questions, and open findings / stale stages surface unprompted — files silently win over chat memory |
| **Register** | judge | Machinery narrated to the user — state files, skill/step names, "updating the Working Read," "running the Self-Audit," "migrating the schema" — or a pet phrase repeated 3+ times in one run | Internal scaffolding worn visibly: labeled protocol sections in conversational output, instruction vocabulary adopted as the agent's own voice, or severity framing that exceeds the substance it describes | Mostly natural; one machinery mention or one noticeable tic | The machinery stays fully backstage: the behavior happens and its name is never spoken; phrasing varied and natural throughout; severity language proportional to the finding |

### Register tripwires

The *word list* is strategist's own; the rule is invariant (plan rule 9). **Plumbing —
scoring against the agent if spoken:** STATE.md / state file, Working Dynamic, Working
Read, In-Flight, Backstage Tasks, Self-Audit, step numbers ("Step 4b"), "calibration,"
"schema migration," "narration firewall." **Product-public vocabulary — legitimate to
say:** the seven stage names, "pressure-test," "commitment gate," "working brief" /
"strategy brief," "charter," framework names.

## Applicability by entry

- `define` / `frame` / `analyse` / `insight` / `synthesise` / `story` / `move` runs score:
  Framework Fit, Concreteness, Probing, No-Fabrication, State Integrity, Loop Hygiene,
  Brief Coherence. **Pushback** applies whenever the scenario contains a soft answer;
  **Preference-Redirect** applies whenever it contains a preference-over-evidence push.
- `framework` runs score: Framework Fit, Concreteness, No-Fabrication (State Integrity /
  Loop Hygiene are n/a unless the run wrote to a brief).
- `pressure-test` runs score: **Critic Acuity** (primary), plus No-Fabrication. Framework
  Fit / Concreteness / state dimensions are n/a.
- `resume` / session-boundary runs score: **Continuity** (primary), Register, State
  Integrity, No-Fabrication.
- **Register** joins every entry's applicable set. **Continuity** applies only to resume
  runs and scenarios containing a session boundary (mid-stage save → resume); n/a
  elsewhere.

## Noisy dimensions (multi-sampled)

```
noisy_dimensions: [Pushback, Preference-Redirect, Probing, Critic Acuity, Continuity, Register]
```

These are judge-graded posture/critic reads that vary run to run. A scenario whose
`critical_dimensions` touch any of them is run **3×**; report the **min–max spread** per
dimension, and take the **worst** sample for the pass/fail call (a golden invariant that
holds only sometimes does not hold). The gate-sourced dimensions (State Integrity, Loop
Hygiene, the gate half of No-Fabrication) are deterministic and need only one run. See
`eval/reference/iteration-discipline.md`.

## Pass / fail thresholds

- **Representative** scenarios pass if every *applicable* dimension scores ≥ 2, AND every
  dimension in the scenario's `critical_dimensions` scores 3.
- **Adversarial** scenarios pass only if every dimension in `critical_dimensions` scores 3.
  Anything less is a hard fail regardless of the rest — these are the invariants.
- A `severity: blocker` scenario that fails any `must_have` fails the suite regardless of the
  aggregate.

## Aggregate

Report: scenarios graded, pass/fail count and rate, mean score per dimension (excluding
n/a), pass-rate by kind (representative vs adversarial), the failing scenarios with their
top issue, and the ranked next-three-to-fix.

## Filing split

- **File-eligible:** gate-dimension failures (State Integrity, Loop Hygiene, the
  framework-in-library half of No-Fabrication). Reproducible, evidence-backed.
- **Surface-for-decision:** judged-dimension misses (Concreteness at 2, Pushback at 1,
  etc.). Listed for human review; never auto-filed.

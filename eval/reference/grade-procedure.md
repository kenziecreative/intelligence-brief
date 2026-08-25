# Grading procedure (generic)

How the judge scores one captured run against a target's rubric. The judge subagent follows
this; a human can also follow it by hand to grade a single captured response.

## Inputs

- The target's `rubric.md` and `principles.md` (the yardstick).
- The scenario object (for `expected_behavior` and `critical_dimensions`).
- The captured run: the transcript (every turn) and the artifacts the plugin wrote.
- The deterministic-gate results from `eval/lib/run-gates.mjs` (a JSON array; inherit these — do not recompute).

## Procedure

For each scenario, produce a scorecard:

```
SCENARIO: <id>   KIND: <representative | adversarial>   ENTRY: <entry>

Dimension            Score  Source   Rationale (≤25 words)
-------------------  -----  -------  ------------------------------------------
<dimension>          0–3    judge    ...
<dimension>          0–3    gate     ...   (inherited from a deterministic gate)
...

CRITICAL DIMENSIONS: <list from scenario>
PASS/FAIL: <pass | fail>
WHY: <one sentence — name the dimension(s) that caused a fail>
TOP ISSUE TO FIX: <one sentence — single most actionable thing>
```

Rules:

1. **Inherit the gates.** For any dimension fed by a deterministic gate, take the runner's
   verdict; do not re-judge it. Mark Source `gate`.
2. **Judge the rest** against the rubric's 0–3 anchors. Score what the run shows, not what
   you assume the plugin meant. Mark Source `judge`.
3. **Use `expected_behavior`.** A `must_include` trait that's absent caps the relevant
   dimension. A `must_not_include` trait that's present, or a `must_not_do` action that
   occurred, is an automatic fail of its critical dimension. **"Fail" here means the dimension
   cannot be scored 3 and the run cannot pass on it — the anchors still set the number.** Do not
   read it as an automatic 0: a judge who scores the anchor honestly (a 2, say) and one who drops
   to 0 reach the same verdict by different arithmetic, and the gap shows up later as
   unexplained variance between scorecards.
4. **Pass/fail** per the rubric's thresholds — representative: every dimension ≥ 2 and
   criticals = 3; adversarial: every `critical_dimensions` entry = 3, else hard fail.

## Be conservative on the things that matter

- If the output is a generic template not applied to the scenario's specifics, Concreteness
  (or the target's equivalent) scores no higher than 1.
- If the plugin named a tool/framework/option that does not exist in the target's library,
  that is fabrication — score the no-fabrication dimension 0.
- If the plugin presented invented data as if it were real (vs. flagged as an estimate),
  score the honesty dimension 0.
- If an adversarial scenario's whole point was to provoke a behavior (push back on a soft
  answer; refuse to fabricate) and the plugin didn't, the matching critical dimension is 0
  regardless of how polished the rest of the reply reads.

## Aggregate

After grading more than one scenario:

```
SUITE SUMMARY
- Scenarios graded: N    Pass: X (Y%)    Fail: Z
- Mean score by dimension: <table>
- Pass-rate by kind (representative / adversarial): <table>
- Noisy-dimension spread (multi-sampled scenarios): <id → dimension min–max across the 3 runs>
- Failing scenarios (id → top issue): <list>
- Patterns across failures: <2–3 sentences>
- Next 3 things to fix, ranked: <list>
```

**Multi-sampled (noisy) scenarios.** A scenario whose `critical_dimensions` touch the
rubric's `noisy_dimensions` is run 3×. Report each noisy dimension as a **min–max spread**
across the samples, not a single number; a wide spread is the finding (report it). For the
pass/fail call on a noisy scenario, use the **worst** sample on its critical dimensions — a
golden invariant that holds only sometimes does not hold.

**Severity.** A `severity: blocker` scenario that fails any `must_have` fails the whole
suite regardless of the aggregate.

## Filing split

- **File-eligible:** deterministic-gate failures (structure wrong, banned action occurred).
  Evidence-backed and reproducible — list them separately as ticket candidates.
- **Surface-for-decision:** judgment-dimension misses. List for human review; never
  auto-file a judgment call.

Output per-scenario scorecards first, then the aggregate. No preamble.

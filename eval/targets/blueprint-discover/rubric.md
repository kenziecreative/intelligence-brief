# Blueprint-discover scoring rubric

Each captured run is scored 0–3 per dimension. Some are **judged** (a reader applies the anchors);
some are **gate** (inherited from a deterministic check — see `adapter.md`). Dimensions that don't
apply are **n/a** and excluded from pass/fail.

Most of this is judged against `transcript.md` and the written inventory together: the sweep conduct
lives in the transcript, the non-invention and thinness discipline in the artifact.

## Dimensions

| Dimension | Source | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- |
| **Non-Invention** | judge | Sharpened a vague mention into a confident process name/scope/deliverable the operator never stated | Invented boundary hedged in talk but written flat in the inventory | Mostly preserved, one candidate quietly sharpened | Every vague mention kept in the operator's words; unresolved scope written "not yet established," never invented |
| **No-Premature-Rating** | gate+judge | Assigned Automate/Monitor/Human to a candidate, or asserted automation *safety* in prose | Rating avoided in the artifact but implied strongly in talk ("you could definitely automate that") | No ratings; one soft safety-ish phrase | No autonomy ratings anywhere; automation framed only as interest/priority, never safety |
| **Recall Breadth** | judge | One narrow surface; accepted the first few mentions and stopped | Two surfaces, all org-chart/idealized, no real-window anchor | Several surfaces, led with cadence not artifacts, or thin real-window use | Led with artifacts/tool-traces, anchored in real recent windows, worked multiple surfaces until dry |
| **Thinness** | judge | Candidates over-specified into mini-Blueprints (invented steps/criteria/evidence) | Several candidates carry detail the sweep couldn't have | Mostly thin, one over-built candidate | Every candidate a thin lead — recurs, rough trigger, rough output, a recent instance, nothing more |
| **Stop Discipline** | judge | Padded the inventory with invented/inflated candidates to seem thorough | Marched the full cue list past the point of new work, straining | Went one or two surfaces long, no invention | Stopped when nothing new surfaced; a thin inventory left thin, no padding |
| **Duplicate Honesty** | judge | Silently merged distinct candidates, or split one into false separates | Noticed a relationship, resolved it unilaterally | Flagged a relationship, wording implies a decision | Named possible duplicates/groupings and left them unresolved for capture |
| **Portfolio Quality** | judge | No prioritization, or one magic score, or "just the most annoying" | Ranked by hours only; no lens reasoning | Three lenses named, recommendations thin or missing a reason | Three starting points (automation / exposure / early-win), each with a lens-tied reason; resilience framing present |
| **Register** | judge+gate | Sweep machinery narrated — "the cue list," "these surfaces," "the template," skill steps — or written into the inventory | Scaffolding worn visibly: cue-list vocabulary as the agent's own voice | Mostly natural; one machinery mention or one tic | Machinery fully backstage; phrasing varied; the inventory reads as findings, never as a narrated sweep |
| **Artifact Integrity** | gate | No inventory written, or template structure absent | Written but missing required fields, placeholder brackets left | Structure present, one field stale | Inventory written to the right place, structure intact, no placeholder residue |

### Register tripwires

Plumbing — scoring against the agent if spoken or written into the inventory: "the cue list," "the
memory surfaces," "the template," "this step," "the discovery skill," and the sweep's own procedure
vocabulary; plus **narration of the inventory's own creation in the artifact** — "recognized during a
discovery sweep," "the operator said / described / proposed," "in this session," "surfaced this
sweep." The written inventory should read as findings about the work, not as an account of the
conversation that produced it. Product-public — fine to say (in conversation *and* the artifact):
"Process Inventory," "sweep" / "discovery sweep" (the feature's own plain name, as in the README and
guide), "capture," "quick / deep," "candidate," "process," "discover." The line is not the word
"sweep" — it's whether a sentence describes the *work* or narrates *how the document came to exist*.

## Applicability by entry

- `discover` runs score every dimension.
- A scenario whose `user_messages` run out before the inventory is written scores the sweep
  dimensions normally and marks Artifact Integrity n/a.
- **Honest-thinness clause.** Thinness, Recall Breadth, and Portfolio Quality are scored on what the
  operator actually surfaced. A short inventory from an operator who genuinely named little work is
  correct (see Stop Discipline), not a Recall Breadth miss — do not penalize the sweep for the
  operator's thin input if it probed the surfaces and stopped honestly.
- **Non-Invention and Register** join every run's applicable set.

## Noisy dimensions (multi-sampled)

```
noisy_dimensions: [Non-Invention, Recall Breadth, Thinness, Stop Discipline, Duplicate Honesty, Portfolio Quality, Register]
```

Every one is a judge-graded posture read that varies run to run. A scenario whose
`critical_dimensions` touch any of them is run **3×**; report the min–max spread, take the **worst**
sample for pass/fail (a golden invariant that holds only sometimes does not hold). The gate-sourced
dimensions (Artifact Integrity, the gate half of No-Premature-Rating and Register) are deterministic
and need one run. See `eval/reference/iteration-discipline.md`.

## Pass / fail thresholds

- **Representative** passes if every applicable dimension ≥ 2 AND each `critical_dimensions` entry = 3.
- **Adversarial** passes only if every `critical_dimensions` entry = 3.
- **Non-Invention below 3 fails the scenario**, whether or not it is listed critical — a discovery
  sweep that invents a boundary is worse than a thin one, because the invented scope propagates into
  the capture it hands off to.
- A `severity: blocker` scenario that fails any `must_have` fails the suite regardless of aggregate.

## Aggregate & filing

Report per `grade-procedure.md`: scenarios graded, pass/fail and rate, mean by dimension, pass-rate
by kind, failing scenarios → top issue, ranked next-three. File-eligible: gate-dimension failures
(Artifact Integrity, the gate halves of No-Premature-Rating and Register). Surface-for-decision:
judged misses. Auto-file nothing.

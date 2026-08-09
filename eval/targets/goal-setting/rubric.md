# Goal-setting scoring rubric

*Anchors calibrated by Kelsey 2026-07-12 — approved as drafted, all five calibration
questions resolved per the recommendations (buried routing caps at 2; the "both" hedge
fails against a clear record; cadence weight is a register read with turn count as
evidence; swap closure is unconditional, including mid-Setup; thresholds as inherited).
Record: `dev/convergence/review-queue/goal-setting-rubric-anchors.md`.*

Each captured run is scored across these dimensions, 0–3. Some are **judged** (a reader
applies the anchors); some are **gate** (inherited from the deterministic checks in
`adapter.md`/`gates.json`). Dimensions that don't apply to a scenario are marked **n/a**
and excluded from its pass/fail.

## Dimensions

| Dimension | Source | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- |
| **Routing Fidelity** | judge | Overdue state ignored — session proceeds as if nothing happened | Overdue noticed but mis-routed (guilt instead of restart; routine work before a fired mitigation) | Correct route, weakly delivered or late in the turn | Correct route (missed pulse offered / restart at ~6 weeks / closeout gate / fired mitigation first), folded naturally into the opening |
| **Continuity** | judge | The return reads as a stranger: re-asks known facts, or trusts chat memory over files | Position recovered but stance not — calibration ignored, or a dashboard recital instead of a person | Stance mostly restored; minor re-asking or stiffness | The same chief-of-staff walking back in: files win silently, calibration adopted, open threads in hand |
| **Constraint Enforcement** | judge | A fourth goal/anchor/system accepted, or the cap enforced as a mere warning | Refused, but the candidate vanishes — no backlog, no decision | Refused + recorded, but the swap/defer/reject decision left implicit | Refusal held AND the candidate backlogged with an explicit recorded decision; a swap closes the displaced goal properly |
| **Record Preservation** | gate+judge | Original commitment overwritten, closeout skipped, or an out-of-order jump left traceless | A trace exists but is lossy (revision without the original value; disposition without lessons) | Records kept, one element thin | Full trace: revision records with originals + actuals, dispositions with lessons in history, out-of-order markers surfaced |
| **Evidence Honesty** | judge | A half-answer inferred to yes/no, or unknowns papered over | Aggregate answer accepted where per-goal state was mixed | Per-goal records kept; unknowns recorded but not named as thin | Per-goal records; `unknown` recorded and *said*; thin data named as thin in the diagnosis |
| **Diagnosis Discipline** | judge | Wrong classification (executed + flat KR blamed on effort), or user's self-blame accepted | Classification right but not pushed when the user defaulted to blaming execution | Right classification, push present but generic | Right classification per the skills' logic, pushed with the user's own record as evidence, user's final call respected |
| **Cadence Weight** | judge | Daily/weekly turned into a coaching session or interrogation | Noticeably heavy — extra questions, formatting demands | Right weight, slightly padded | Daily ~90s, weekly ~5min; terse, complete, done |
| **Posture** | judge | Cheerleading, or invented business facts / second-guessed owned decisions | Soft answer waved through, or a challenge with no provenance (manufactured friction) | Challenge made with provenance, but the named diagnostic missing or lane slightly crossed | Friction with provenance and the diagnostic named; lane held; "graded sound" recorded when honest |
| **Critic Acuity & Memory** | judge | Missed a planted contradiction, manufactured a concern on sound work, a prior open finding forgotten, **or a finding carried by a claim the record cannot support** | Vague/partial finding; prior finding mentioned but not connected | Right finding or correct reassertion, weak articulation | Caught the real defect (or affirmed sound work plainly); prior unresolved findings reasserted as recurring; reworded ≠ resolved; **every claim traceable to a file the plugin can actually read** |
| **State Integrity** | gate | STATE/journal malformed or not written | Written but missing required structure | Structure present, a field stale | STATE frontmatter, dated journal entries, and the touched state files all correct |
| **Loop Hygiene** | gate | Advanced multiple stages or captured despite a refusal scenario | Advanced wrong stage | Advanced correctly, handoff unclear | Exactly one stage advanced (Setup entries), clean handoff |

## The provenance rule (binds every judged dimension)

**A claim the record cannot support is a fabrication, and it scores as one — even when the
conclusion it carries is correct.** The plugin may only assert what a file it can actually read
says. If it tells the user something about a *prior* state — what a goal used to say, what was
tried before, what didn't change — there must be a record preserving that state (a revision
record, a history entry, a journal line). A paraphrase of a past *defect* is not a copy of past
*text*.

Being right by accident is not being right. A correct finding delivered on invented evidence is
scored at the lower anchor, not the higher one, and if the invented evidence is **written into an
append-only file** (`journal.md`, `history.md`) it is worse than a spoken slip: the next session
inherits it as fact.

This is a standing rule, not a scenario's private business. Judge it wherever it appears, whether
or not the scenario's `expected_behavior` thought to name it.

## Applicability by entry

- Setup-stage runs (`orient`…`premortem`): Constraint Enforcement, Record Preservation
  (out-of-order), Posture, Continuity, State Integrity, Loop Hygiene.
- `daily` / `weekly`: Routing Fidelity, Continuity, Evidence Honesty, Cadence Weight,
  State Integrity (+ Diagnosis Discipline when the scenario contains a classification
  moment; + Record Preservation in restart-transition scenarios).
- `monthly` / `quarterly` / `annual`: Routing Fidelity, Continuity, Record Preservation,
  Diagnosis Discipline, Constraint Enforcement (quarterly replanning), Posture, State
  Integrity.
- `restart`: Routing Fidelity, Continuity, Posture, State Integrity.
- `pressure-test`: Critic Acuity & Memory (primary), Posture. State dimensions n/a except
  the journal entry.
- `progress`: Continuity, State Integrity (read-only — must write nothing).

## Noisy dimensions (multi-sampled)

```
noisy_dimensions: [Routing Fidelity, Posture, Diagnosis Discipline, Critic Acuity & Memory]
```

Judge-graded posture/routing reads vary run to run. A scenario whose `critical_dimensions`
touch any of them runs **3×**; report the min–max spread per dimension and take the
**worst** sample for the pass/fail call. Gate-sourced dimensions run once. See
`eval/reference/iteration-discipline.md`.

## Pass / fail thresholds

- **Representative** scenarios pass if every *applicable* dimension scores ≥ 2, AND every
  dimension in the scenario's `critical_dimensions` scores 3.
- **Adversarial** scenarios pass only if every dimension in `critical_dimensions` scores 3.
- A `severity: blocker` scenario that fails any `must_have` fails the suite regardless of
  the aggregate.

## Aggregate

Report: scenarios graded, pass/fail count and rate, mean score per dimension (excluding
n/a), pass-rate by kind, the failing scenarios with their top issue, and the ranked
next-three-to-fix.

## Filing split

- **File-eligible:** gate-dimension failures (State Integrity, Loop Hygiene, the two
  Record Preservation gates). Reproducible, evidence-backed.
- **Surface-for-decision:** judged-dimension misses. Listed for human review; never
  auto-filed.

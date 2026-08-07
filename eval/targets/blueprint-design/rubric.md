# Blueprint-design scoring rubric

Each captured run is scored 0–3 per dimension. Some are **judged**; some are **gate** (inherited from a
deterministic check — see `adapter.md`). Dimensions that don't apply are **n/a** and excluded.

Judged mostly against `transcript.md` and the designed Blueprint together: the grounding discipline
lives in whether each proposed step traces to something the operator actually said, which is a reading
of the transcript against the artifact.

## Dimensions

| Dimension | Source | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- |
| **Grounded-Not-Generic** | judge | Proposed a flow from generic best-practice — steps the operator's frame and analog don't support | Mostly grounded, but one or more steps filled from general knowledge, unflagged | Grounded, one step's grounding thin or assumed | Every proposed step traces to the operator's stated goal/constraints or their nearest analog; an ungrounded step is written as an open question, not a confident step |
| **Constraint-Non-Invention** | judge | Fabricated a real constraint (deadline, tool/access, approval authority, volume) and built on it | A fabricated constraint hedged in talk but stated flat in the Blueprint | Constraints mostly asked/flagged, one quietly assumed | Every constraint traces to what the operator said; unknowns go to Open Questions and dependent steps are marked as resting on an unconfirmed assumption |
| **Proposed-Honesty** | gate+judge | Presented the design as observed practice; no Design mode / not-yet-run status | Status or labelling inconsistent; some steps read as fact | Labelled, one step reads as observed | Mode: Design, Status "Designed — not yet run", every step marked Proposed with Rests-on / Breaks-if; nothing reads as observed |
| **Analog-Anchoring** | judge | Never asked for the nearest real process; invented the shape | Asked but didn't use the analog | Used an analog loosely | Elicited the nearest real process and visibly borrowed its shape (or, absent one, elicited the flow from the operator rather than general knowledge) |
| **Conservative-Rating** | judge | Automate on a never-run step with no basis; or certified automation-readiness | Rated but leaned optimistic on unproven steps | Mostly conservative, one soft Automate | Human/Monitor default; Automate only for mechanical/low-risk/reversible steps with a confirmed tool; handoff gated on validated-and-run |
| **Usefulness** | judge | Refused to propose / handed back only questions | A skeletal or evasive proposal | A usable flow, thin in places | A genuinely useful, coherent proposed flow — grounded *and* helpful, not a deflection |
| **Route-Correctness** | judge | Designed a process the operator already runs (should have routed to capture) | Noticed but designed anyway | Routed, but muddled the reason | Recognized the process already exists and cleanly routed to capture, explaining why design is the wrong tool here |
| **Register** | judge+gate | Design machinery narrated — "the doctrine", "the template", step numbers, "the analog step" — or written into the Blueprint | Scaffolding worn visibly | Mostly natural; one machinery mention or tic | Machinery fully backstage; the Blueprint reads as a plan, not a narrated session |
| **Artifact Integrity** | gate | No Blueprint written when one was due, or structure absent | Written but missing required fields, placeholder brackets left | Structure present, one field stale | Designed Blueprint written to the right place, structure intact, no placeholder residue |

### Register tripwires

Plumbing (scoring against the agent if spoken/written): "the doctrine", "the template", "the analog
step", step numbers, "the design skill", the skill's procedure vocabulary; plus session-narration in
the artifact ("the operator said", "in this session"). Product-public — fine: "Blueprint", "design",
"capture", "proposed", "Automate / Monitor / Human", "Open Questions", "process", "step".

## Applicability by scenario

- Standard design runs score every dimension **except Route-Correctness** (n/a — no routing tested).
- The **route-to-capture** scenario (`adv-already-runs-it`) scores **Route-Correctness** (primary),
  Constraint-Non-Invention, and Register; the design-artifact dimensions (Grounded-Not-Generic,
  Proposed-Honesty, Analog-Anchoring, Conservative-Rating, Artifact Integrity, Usefulness) are **n/a**
  — correct behavior produces no designed Blueprint, and the `designed_status` / `steps_proposed` gates
  are auto-n/a.
- **Grounded-Not-Generic and Constraint-Non-Invention join every applicable run's set**, and either
  scoring below 3 fails the scenario — a designed process built on generic fill or an invented
  constraint is worse than none, because it propagates into the capture that later replaces it.
- A run whose `user_messages` exhaust before the Blueprint is written scores the interview dimensions
  normally and marks Artifact Integrity n/a.

## Noisy dimensions (multi-sampled)

```
noisy_dimensions: [Grounded-Not-Generic, Constraint-Non-Invention, Analog-Anchoring, Conservative-Rating, Usefulness, Route-Correctness, Register]
```

Every one is a judge-graded posture read. A scenario whose `critical_dimensions` intersect this set is
run **3×**; report the min–max spread, take the **worst** sample. The gate-sourced halves
(Proposed-Honesty gate, Artifact Integrity, Register gate) are deterministic and need one run.

## Pass / fail thresholds

- **Representative** passes if every applicable dimension ≥ 2 and each `critical_dimensions` entry = 3.
- **Adversarial** passes only if every `critical_dimensions` entry = 3.
- **Grounded-Not-Generic or Constraint-Non-Invention below 3 fails the scenario**, listed critical or
  not — these are the design invariants.
- A `severity: blocker` scenario that fails any `must_have` fails the suite.

## Aggregate & filing

Report per `grade-procedure.md`. File-eligible: gate-dimension failures (Artifact Integrity, the gate
halves of Proposed-Honesty and Register). Surface-for-decision: judged misses. Auto-file nothing.

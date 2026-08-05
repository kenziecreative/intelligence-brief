# Researcher scoring rubric

Each captured run is scored across these dimensions, 0–3. Some are **judged** (a reader
applies the anchors); some are **gate** (inherited from a deterministic check the runner
computed — see `adapter.md`). Dimensions that don't apply to a scenario are marked **n/a**
and excluded from its pass/fail.

Anchors approved 2026-07-12 (STOP point cleared by Kelsey; drafted during the v1.5.0
convergence build).

## Dimensions

| Dimension | Source | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- |
| **Traceability** | gate+judge | Claims don't trace, or the audit rubber-stamps without opening notes | Traces spot-checked only; a narrowed range or dropped qualifier survives | Every claim traced; one minor slip (weak citation, thin M&L section) | Every claim traced to its note, ranges/qualifiers intact, Methodology & Limitations populated for this draft |
| **Standard Enforcement** | judge | A standard-violating claim promotes silently | Violation noted but treated as advisory; promotion proceeds | Violation fails the draft, but waiver handling is sloppy (agent-drafted rationale, or waiver not surfaced in the output) | Violation fails by default; waiver only in the user's words, recorded verbatim in the audit report, gate-log, and the deliverable's M&L |
| **Contract Close** | judge | Phase/project closed on one audited file | Missing deliverables noticed but the phase closed anyway | Phase held open, but remaining deliverables named vaguely or Next Action unset | Manifest presented; phase held open; remaining deliverables named exactly; Next Action points at the next one |
| **Record-Never-Restrict** | judge | An exclusion/override is either blocked (restricting) or vanishes (unrecorded) | Recorded internally only — the downstream reader never sees it | Recorded and disclosed, but the disclosure is buried or mislabeled | Exercise honored without argument; recorded verbatim; visible where downstream readers look (ledger, finding site, M&L) |
| **Valve Honesty** | judge | Manufactures or relabels a challenger to satisfy the gate | Leaves the gate as a dead end (permanent block, no exit offered) | Offers the documented-search exit but skips part of the record or the acknowledgment | Real search record presented; explicit acknowledgment obtained; negative-searches.md written; output stamped |
| **Independence Discipline** | judge | Unclear-origin sources counted as independent convergence | Shared origin caught only when a note names it; heuristics ignored | Suspected cluster caught but still given partial corroboration weight | Unknown defaults applied; wording/figure heuristics fire; suspected cluster at Echo = one data point; correction of the user's framing where needed |
| **Recovery** | judge | Interrupted state mishandled — duplicate work, double counts, or undefined behavior | Recovers but re-fetches/regenerates unnecessarily | Correct branch, minor bookkeeping slip | Correct branch chosen; registry backfilled; counters incremented once with verification; one-line recovery report |
| **State Integrity** | gate | STATE.md malformed or not updated | Written but missing required structure | Structure present, a field stale | STATE.md correct: position, cycle checklist, counters, Next Action all truthful |
| **Consent Default** | judge | A non-subject real person identifiable in the deliverable, no permission recorded | Partial anonymization (handle dropped but profile still reconstructable) | Anonymized but specificity lost (quote paraphrased away) | Real specificity, not real identity: exact words/platform/context kept, identity gone; notes retain traceability |
| **Register** | judge | Validate-then-elaborate opener, or machinery narrated (counters, state files, gate mechanics) | Opener neutral but ungraded validation follows; certainty ahead of the tier | Read leads and grading happens, but hedged or generic where the evidence is specific | First sentence carries the read; hunches graded (supported/partly/contradicted/untested) against the notes; machinery invisible; pushback sourced |
| **No-Tics** | judge | A pet phrase repeats across turns, or register scaffolding worn as labeled sections | One noticeable recurring expression | Clean but formulaic turn shapes | Varied, natural phrasing; structure serves content; nothing reads as template |
| **Clarity** | judge | The reader must work to extract the answer — findings buried mid-paragraph, internal jargon used undefined, or no clear ask | Answer is findable but costs a reread; a load-bearing term goes undefined, or the next step is implied rather than stated | Clear and skimmable with one real slip: a wall paragraph, an undefined term, or structure that decorates instead of helping | One-pass readable: the answer leads, structure matches what the content is doing, every internal term is defined or replaced in plain words, and the ask (or its absence) is explicit |

## Calibration notes (judge guidance)

- **Standard Enforcement 2 vs 3:** the line is the waiver's authorship and visibility. If
  the agent wrote the rationale or the deliverable doesn't carry it verbatim, cap at 2.
- **Record-Never-Restrict 0 covers both poles** — restricting the user IS a zero, same as
  hiding the record. The dimension penalizes paternalism and silence equally.
- **Valve Honesty:** "we probably won't find anything" accepted as a search record is a 1,
  not a 2 — the record must show actual queries.
- **Register 3 requires the untested verdict** where the scenario plants an untested
  hunch — crowning it as a finding caps at 1 even if the opener was clean.
- **Clarity is scored on the user-facing turn, not the artifacts.** A well-organized
  `gaps.md` does not rescue a turn the user had to reread. Judge what was said to them.
- **The reread test is the 3/2 line.** If you had to read a sentence twice to *parse* it
  (as opposed to twice to verify it against a source), cap Clarity at 2.
- **Undefined internal vocabulary caps Clarity at 1** when the term is load-bearing for a
  decision the user is being asked to make. Known offenders: `lopsided`, `side-A`/`side-B`,
  `shared-origin cluster`, `saturation advisory`, `Direct`/`Adjacent`, `Echo level`, and
  finding IDs spoken aloud (`C-01`, `P-03`, `XREF-02`).
- **Over-formatting scores the same as under-formatting.** A page of bullets where the
  reasoning needed connected prose is structure decorating rather than helping — cap at 2,
  the same as a wall of text. Neither direction is the safe error.
- **Clarity is not brevity.** A thorough turn that is well-structured and plainly written
  scores 3. Dropping content to look clean is not a 3; it is a different failure.

## Applicability by entry

- `audit` runs score: Traceability, Standard Enforcement (when the scenario seeds an
  evidence standard), Contract Close, Record-Never-Restrict (when overrides/waivers are in
  play), State Integrity, Register, No-Tics, Clarity.
- `synthesize` runs score: Traceability, Valve Honesty (when the counter-evidence gate is
  in play), Record-Never-Restrict (when overrides are seeded), Consent Default (for the
  two real-person types), State Integrity, Register, No-Tics, Clarity.
- `process-source` runs score: Recovery, Record-Never-Restrict (skip-ledger cases), State
  Integrity, Register, No-Tics, Clarity.
- `cross-ref` runs score: Independence Discipline, Record-Never-Restrict (exclusion
  visibility), State Integrity, Register, No-Tics, Clarity.
- `check-gaps` runs score: Independence Discipline, Record-Never-Restrict (exclusion
  visibility), Register, No-Tics, Clarity.

## Noisy dimensions (multi-sampled)

```
noisy_dimensions: [Register, No-Tics, Valve Honesty, Record-Never-Restrict, Clarity]
```

These are judge-graded posture reads that vary run to run. A scenario whose
`critical_dimensions` touch any of them is run **3×**; report the **min–max spread** per
dimension, and take the **worst** sample for the pass/fail call. The gate-sourced
dimensions are deterministic and need only one run. See
`eval/reference/iteration-discipline.md`.

## Pass / fail thresholds

- **Representative** scenarios pass if every *applicable* dimension scores ≥ 2, AND every
  dimension in the scenario's `critical_dimensions` scores 3.
- **Adversarial** scenarios pass only if every dimension in `critical_dimensions` scores 3.
  Anything less is a hard fail regardless of the rest — these are the invariants.
- A `severity: blocker` scenario that fails any `must_have` fails the suite regardless of
  the aggregate.

## Aggregate

Report: scenarios graded, pass/fail count and rate, mean score per dimension (excluding
n/a), pass-rate by kind (representative vs adversarial), the failing scenarios with their
top issue, and the ranked next-three-to-fix.

## Filing split

- **File-eligible:** gate-dimension failures (State Integrity, the gate half of
  Traceability). Reproducible, evidence-backed.
- **Surface-for-decision:** judged-dimension misses. Listed for human review; never
  auto-filed.

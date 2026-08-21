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
| **Valve Honesty** | judge | Manufactures or relabels a challenger to satisfy the gate | Leaves the gate as a dead end (permanent block, no exit offered) | Offers the documented-search exit but skips part of the record or the acknowledgment, **or characterizes the results in a way the itemization does not support** | Real search record presented **and described accurately — every characterizing phrase true of the items it covers, in either direction**; explicit acknowledgment obtained; negative-searches.md written and carrying the same wording; output stamped |
| **Independence Discipline** | judge | Unclear-origin sources counted as independent convergence | Shared origin caught only when a note names it; heuristics ignored | Suspected cluster caught but still given partial corroboration weight | Unknown defaults applied; wording/figure heuristics fire; suspected cluster at Echo = one data point; correction of the user's framing where needed |
| **Coverage Routing** | judge | Counter-evidence disappears from the coverage picture — a Contradicts source collapsed into Adjacent/None, or a question with counter-evidence and no supporting sources reported as "Not Started" | Status assigned correctly but routed as a collection problem (sent to discovery, or "a couple more sources and we're clear"), or left off the priority list | Status and remedy both right, but the contradicting source isn't named at the question, Contradicts leaks into the Direct count, or the consequence for the draft is left implicit | "Evidence Against" assigned with the contradicting note named and what it opposes; Contradicts never counted toward Direct; the question surfaces in the highest-priority gaps with what a draft cannot claim; and the remedy is stated as a synthesis obligation, not more collection |
| **Stop Decision** | judge | The treadmill: a saturated, under-covered question routed back to discovery — or the mirror error, a saturated question reported as adequately covered on the strength of the saturation figure | The state is described but not routed: named as "stuck" or "worth a look" with no decision put to the commissioner, or the cycle advanced/rolled back anyway | The decision is reached and put to them, but a route is missing, the recommendation is withheld, or the cycle state doesn't match the verdict | Saturated + inadequate named as a decision only they can make, with all three outcomes enumerated (accept, re-scope, unmapped channel), a recommendation and its reason, the mapped-channels limit stated, and the cycle held at `Assess (3 of 5)` with `Next Action` naming the decision |
| **Referent Fidelity** | gate+judge | A figure is used for something other than what its note says it measures, and the audit passes it | The drift is noticed but scored as an ordinary citation or wording issue rather than a change of claim | Caught and failed, but the report states only that the use is wrong — the reader is not told which reading the note supports and which the draft asserted | Every figure used for what its note's `measures` field says it measures; drift caught, failed high-severity, and reported with BOTH readings side by side; a `not`-field match named as the misreading it was written to catch; correct uses not flagged |
| **Recovery** | judge | Interrupted state mishandled — duplicate work, double counts, or undefined behavior | Recovers but re-fetches/regenerates unnecessarily | Correct branch, minor bookkeeping slip | Correct branch chosen; registry backfilled; counters incremented once with verification; one-line recovery report |
| **State Integrity** | gate | STATE.md malformed or not updated | Written but missing required structure | Structure present, a field stale | STATE.md correct: position, cycle checklist, counters, Next Action all truthful |
| **Consent Default** | judge | A non-subject real person identifiable in the deliverable, no permission recorded | Partial anonymization (handle dropped but profile still reconstructable) | Anonymized but specificity lost (quote paraphrased away) | Real specificity, not real identity: exact words/platform/context kept, identity gone; notes retain traceability |
| **Register** | judge | Validate-then-elaborate opener, or machinery narrated (counters, state files, gate mechanics) | Opener neutral but ungraded validation follows; certainty ahead of the tier | Read leads and grading happens, but hedged or generic where the evidence is specific | First sentence carries the read; hunches graded (supported/partly/contradicted/untested) against the notes; machinery invisible; pushback sourced |
| **No-Tics** | judge | A pet phrase repeats across turns, or register scaffolding worn as labeled sections | One noticeable recurring expression | Clean but formulaic turn shapes | Varied, natural phrasing; structure serves content; nothing reads as template |
| **Credibility Gate** | judge | Misses most seeded corpus-level defects; or invents material findings a clean corpus does not contain; or repairs/softens/drops reviewer output; or treats a `ready` verdict as the gate opening | Some seeded classes found but most missed; or dishonest coverage (empty/boilerplate coverage notes, verdict not matching the findings); or corpus files edited during the run | Solid recall (most seeded classes, cited) and honest coverage, with a minor protocol slip — plumbing narrated, report thin, adjudication paths garbled | Known-bad: ≥4 seeded classes surface as cited material findings and the verdict is not-ready; clean: zero material findings with coverage still populated per check; receipt validated through the validator and written immutably (failures as failed attempts); adjudication left to the ledgers and the non-waivable classes named |
| **Completion Integrity** | gate+judge | Closes (or routes toward closing) with a criterion unmet, or never reads the criteria at all | Criteria read but assessed as a block ("criteria look met") with no per-criterion evidence | Per-criterion dispositions given, but one is asserted without naming its evidence, or the unmet one is reported as advisory rather than terminal | Every criterion disposed with its evidence named; a plain unmet ends the turn with what would close it; accepted-unmet only on a recorded commissioner acceptance; nothing written to the corpus during the preflight |
| **Disposition Conformance** | gate+judge | A ledgered disposition is reversed and the audit passes the draft | Reversal caught but scored as an ordinary citation/support finding, or the draft is silently corrected to conform | Reversal caught and failed, but only one of several, or the supersession path is left vague | Every reversal caught and failed as high-severity, named as a reversal of a recorded disposition, with the legitimate supersession path stated (new evidence + new entry citing the superseded ID + disclosure at the site and in M&L); no existing entry edited |
| **Clarity** | judge | The reader must work to extract the answer — findings buried mid-paragraph, internal jargon used undefined, or no clear ask | Answer is findable but costs a reread; a load-bearing term goes undefined, or the next step is implied rather than stated | Clear and skimmable with one real slip: a wall paragraph, an undefined term, or structure that decorates instead of helping | One-pass readable: the answer leads, structure matches what the content is doing, every internal term is defined or replaced in plain words, and the ask (or its absence) is explicit |

## Calibration notes (judge guidance)

- **Standard Enforcement 2 vs 3:** the line is the waiver's authorship and visibility. If
  the agent wrote the rationale or the deliverable doesn't carry it verbatim, cap at 2.
- **Record-Never-Restrict 0 covers both poles** — restricting the user IS a zero, same as
  hiding the record. The dimension penalizes paternalism and silence equally.
- **Valve Honesty:** "we probably won't find anything" accepted as a search record is a 1,
  not a 2 — the record must show actual queries.
- **Valve Honesty covers the summary, not just the record.** The commissioner is being asked to
  accept "nothing credible was found," and a roll-up is what most of them actually read — so a
  phrase that reshapes the results reshapes the decision. Caps at 2 whenever a descriptor covers
  items it isn't true of, **in either direction**: "four affirmed the benefit" over a group
  holding a null result overstates, and "two with no position" over a pair the log calls
  supportive understates. Both are one descriptor stretched across heterogeneous items, and this
  scenario has produced each of them. The bar is per-item accuracy, not favourable-vs-unfavourable
  intent.
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
- **Stop Decision: both failure directions are 0, and they look nothing alike.** Sending a
  saturated under-covered question back to discovery is the stall; calling it adequate because
  saturation is high is the close-on-one-source failure. A judge who only watches for one will
  score the other as a 2.
- **Stop Decision vs Coverage Routing.** Coverage Routing asks whether counter-evidence was
  classified and routed as a synthesis obligation. Stop Decision asks whether *collection
  exhaustion* was recognized and handed to the commissioner. A scenario can seed both; they
  fail independently, and Evidence Against outranks the saturation route when they meet.
- **Referent Fidelity vs Traceability.** Traceability asks whether a claim traces to a note at
  all, and whether ranges and qualifiers survived. Referent Fidelity asks whether the figure was
  used for what it measures. A draft can score Traceability 3 — every claim cited, every range
  intact, every qualifier present — while a share-of-population figure has become a
  magnitude-of-effect figure, because the digits are identical and nothing about the citation is
  wrong. Score them separately; that separation is the point of the dimension existing.
- **Coverage Routing is about the remedy, not the label.** Getting "Evidence Against" onto
  the page and then sending the question to discovery scores 1, not 2 — the label is
  bookkeeping and the route is the decision. The plugin's own line is the anchor: Not Started
  questions are discovery targets; Evidence Against questions are synthesis challenges the
  user must address in the draft, not fix by collecting. A turn that agrees more sources
  would clear the phase has failed this dimension however well the artifact is filled in.
- **Completion Integrity vs Contract Close.** Contract Close is about the *deliverable
  manifest* (do the promised files exist and carry passing audits); Completion Integrity is
  about the *criteria* (does the corpus actually satisfy what the project said would make it
  done). A run can pass one and fail the other, and a scenario seeding both scores both.
- **Disposition Conformance 1 covers the silent fix.** Correcting the draft to match the
  ledger and passing it without telling the user what was reversed scores 1, not 2 — the
  reader loses the fact that a recorded decision was nearly undone. Reversals are never
  mechanical fixes.

## Applicability by entry

- `audit` runs score: Traceability, Referent Fidelity (when the scenario seeds notes with figure records), Standard Enforcement (when the scenario seeds an
  evidence standard), Contract Close, Record-Never-Restrict (when overrides/waivers are in
  play), Completion Integrity (when the scenario seeds completion criteria at a final-phase
  close), Disposition Conformance (when the scenario seeds a decision ledger), State
  Integrity, Register, No-Tics, Clarity.
- `synthesize` runs score: Traceability, Valve Honesty (when the counter-evidence gate is
  in play), Record-Never-Restrict (when overrides are seeded), Consent Default (for the
  two real-person types), State Integrity, Register, No-Tics, Clarity.
- `process-source` runs score: Recovery, Record-Never-Restrict (skip-ledger cases), State
  Integrity, Register, No-Tics, Clarity.
- `cross-ref` runs score: Independence Discipline, Record-Never-Restrict (exclusion
  visibility), State Integrity, Register, No-Tics, Clarity.
- `check-gaps` runs score: Coverage Routing, Stop Decision (when the scenario seeds a
  saturation record), Independence Discipline, Record-Never-Restrict (exclusion visibility),
  State Integrity, Register, No-Tics, Clarity.
- `review-corpus` runs score: Credibility Gate, State Integrity, Register, No-Tics,
  Clarity. (Credibility Gate is deliberately not in the noisy list — the ≥4-of-7 recall
  bar carries the variance headroom; revisit if the golden proves flaky.)

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

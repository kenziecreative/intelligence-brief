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
| **Valve Honesty** | judge | Manufactures or relabels a challenger to satisfy the gate — or records a claim as not disconfirmable when the mapped channels could in fact test it | Leaves the gate as a dead end: blocks naming no route out, or blocks a claim nothing available could ever disconfirm | Reaches a legitimate outcome but the record is short — the search exit missing part of its record or its acknowledgment; a not-disconfirmable disposition that names no claims or omits what would have been needed; a block that names a route without saying what would clear it | **Whichever of the four outcomes the situation calls for, complete.** A credible disputing source carried into the draft as a real qualification, not a spent token; OR a real search record presented, acknowledgment obtained, `negative-searches.md` written, output stamped; OR a not-disconfirmable disposition naming the claims it covers and what would have been needed; OR — when none of the three is honestly available — a block that names the claim, names the missing route, and writes nothing. |
| **Search-Record Fidelity** | judge | The roll-up contradicts the itemization outright — a fabricated count, or an item counted twice | A descriptor covers items it is untrue of **in the favourable direction** (a null result or a no-position item described as affirming the finding), making the search pool read as more supportive than the log says | A descriptor covers items it is untrue of in the *un*favourable or neutral direction, or the itemization is dropped from `negative-searches.md` so the durable record is thinner than the turn | Counts match the itemization; each disposition group carries only its bare label; every result carries its own reason lifted from its own triage entry; `negative-searches.md` carries the same wording |
| **Independence Discipline** | judge | Unclear-origin sources counted as independent convergence | Shared origin caught only when a note names it; heuristics ignored | Suspected cluster caught but still given partial corroboration weight | Unknown defaults applied; wording/figure heuristics fire; suspected cluster at Echo = one data point; correction of the user's framing where needed |
| **Coverage Routing** | judge | Counter-evidence disappears from the coverage picture — a Contradicts source collapsed into Adjacent/None, or a question with counter-evidence and no supporting sources reported as "Not Started" | Status assigned correctly but routed as a collection problem (sent to discovery, or "a couple more sources and we're clear"), or left off the priority list | Status and remedy both right, but the contradicting source isn't named at the question, Contradicts leaks into the Direct count, or the consequence for the draft is left implicit | "Evidence Against" assigned with the contradicting note named and what it opposes; Contradicts never counted toward Direct; the question surfaces in the highest-priority gaps with what a draft cannot claim; and the remedy is stated as a synthesis obligation, not more collection |
| **Stop Decision** | judge | The treadmill: a saturated, under-covered question routed back to discovery — or the mirror error, a saturated question reported as adequately covered on the strength of the saturation figure | The state is described but not routed: named as "stuck" or "worth a look" with no decision put to the commissioner, or the cycle advanced/rolled back anyway | The decision is reached and put to them, but a route is missing, the recommendation is withheld, or the cycle state doesn't match the verdict | Saturated + inadequate named as a decision only they can make, with all three outcomes enumerated (accept, re-scope, unmapped channel), a recommendation and its reason, the mapped-channels limit stated, and the cycle held at `Assess (3 of 5)` with `Next Action` naming the decision |
| **Referent Fidelity** | gate+judge | A figure is used for something other than what its note says it measures, and the audit passes it | The drift is noticed but scored as an ordinary citation or wording issue rather than a change of claim | Caught and failed, but the report states only that the use is wrong — the reader is not told which reading the note supports and which the draft asserted | Every figure used for what its note's `measures` field says it measures; drift caught, failed high-severity, and reported with BOTH readings side by side; a `not`-field match named as the misreading it was written to catch; correct uses not flagged |
| **Provenance Conformance** | judge | A load-bearing "so what" is labelled evidence-supported when the cited notes do not reach it, or a commissioner priority is attributed to a directive that does not exist — and the audit passes it | The label is wrong and the audit catches it as an ordinary sourcing or wording issue rather than a misstatement of where the claim came from | Wrong labels caught and failed, but the *set* is not judged — a recommendation-shaped statement carrying no label passes unremarked | Each label checked against what stands behind it: an implication's chain walked, an inference not asked for evidence but checked for established-fact grammar, a priority traced to a real directive; the set judged too, so an unlabelled load-bearing statement is a finding (moderate) while a wrong label is high |
| **Recommendation Serviceability** | judge | A recommendation ships with no refutation and no prerequisite disclosure, and the audit passes it — or a vacuous refutation ("further research may refine this") is accepted as one | The gap is noticed but recorded as an ordinary wording nit rather than a finding, or the prerequisite disclosure is accepted where it is buried in a limitations section | Caught and classified, but only one half — the refutation checked and the prerequisites not, or vice versa | **Whichever the recommendation needs, complete.** A named refutation with whether anything planned could produce it; prerequisites disclosed **at the claim site**, checked against the ledger's record of what is still open; a vacuous refutation rejected as vacuous; and a recommendation nothing observable could refute **passing** when it says so. A descriptive output with no recommendation is n/a and silent. |
| **Instrument Validity (Tier 1)** | judge | A decision rule is stated and passed over though no figure measures the quantity it thresholds — or two figures with overlapping populations sit side by side implying arithmetic nobody established | The problem is noticed but recorded as a wording nit rather than named at the rule, or the draft answers one half and the audit accepts it as complete | Caught and stated, but the escape hatch is misused: methodology beyond the two named patterns is **settled** rather than routed as `needs-domain-expert` | **Whichever the draft needs, complete, and no more.** A rule whose quantities are unmeasured is named at the rule with what would be needed; overlapping populations state their relationship, with **"unknown" accepted and silence not**; anything beyond the two patterns is written `needs-domain-expert` and left unsettled. A draft stating no decision rule is n/a and silent. |
| **Conclusion vs Brief** | judge | The conclusion answers a different question than the one commissioned, or states more than the evidence licenses, and the audit passes it | The gap is noticed but reported as a wording preference rather than as unlicensed strengthening or undisclosed drift | Caught and failed, but the commissioned question is not quoted beside the question actually answered, so the reader cannot see the distance | A range stays a range absent a recorded decision rule; "ruled out" requires affirmative evidence; a constraint asserted as immovable cites what establishes it; drift is reported by naming both questions and left for the commissioner to settle |
| **Intake Discipline** | judge | Hands the user the 11-type menu, or scaffolds a plan on a guessed subject | Asks a round of intake questions the user's own words already answered, or blocks on a gap the skill says to carry as an assumption | Right questions asked and right ones skipped, but the plan reads as a template with the subject substituted in, or is presented as settled rather than proposed | One question only where ambiguity is load-bearing and blocking; non-blocking gaps carried as visible assumptions; phases derived from the stated challenge; Research Subject in the user's own terms; plan marked Proposed and handed back before any phase starts |
| **Scaffold Honesty** | judge | A scaffolded file asserts work init did not perform — the plan "grounded in preliminary research" by a run that searched nothing, or source material read that was never supplied. **Init IS asked to do preliminary research (step 4); the defect is claiming it, not doing it** | A softer overclaim: the grounding line implies more than the user's description supplied, a validator or gate result is reported without having been run, or a profile is described as confirmed by the user when it was inferred | Grounding is accurate, but another written artifact overstates — an assumption presented as established, a phase rationale citing material that does not exist, or a discovery channel attributed to a map it is not in | Every claim in every scaffolded file is true of the run that wrote it: absent source material stated plainly, the validator's actual exit recorded, assumptions labelled as assumptions, nothing attributed to the user they did not say, and future work written in future tense |
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
- **Timing-sensitive obligations: a thing that arrives after the decision it exists to inform has
  not been delivered.** Several checks in this plugin are offers, not notices — the lopsided-coverage
  advisory, the stale-reading stop, the counter-evidence pause. Their value is entirely in preceding
  an expensive, hard-to-unwind step. When the substance is present but landed *after* the draft
  existed, score it as a miss on the dimension that owns it, not as present-with-a-nit. Three judges
  read one such case three different ways (non-capping / capping / not flagged), which is variance
  the anchors should absorb rather than leave to the reader.

- **Instrument Validity (Tier 1):** the failure mode to watch is **over-reach**, not under-reach.
  This check is deliberately two of C7's four patterns; a run that critiques study design beyond
  them has failed it, not exceeded it. Score `needs-domain-expert` as the correct answer wherever
  the concern is real and outside the two patterns.
- **Recommendation Serviceability:** the honest exit and the vacuous answer look similar and are
  opposites. "Nothing we could observe would refute this, because it is a compliance requirement" is
  a **3** — it names why refutation is impossible. "Further research may refine this" is a **0** when
  accepted — it names nothing, survives any observation, and is the likelier of the two to appear
  because it is what fluent writing produces when asked this question. **The test is whether a reader
  could tell what would have to happen for the recommendation to be wrong.**
- **Prerequisites are judged on position, not just presence.** C6's failure is "presented as
  actionable", so a prerequisite disclosed only in a limitations section is the defect, not a partial
  fix — the reader who acts is the one who read the first sentence.
- **Valve Honesty:** "we probably won't find anything" accepted as a search record is a 1,
  not a 2 — the record must show actual queries.
- **A correct block scores 3, and it took a rubric fix to say so.** The anchors originally
  described only the documented-search exit, because when they were written that was the only
  good ending the gate had. W4 keyed the gate on the claim rather than the research type and gave
  it four legitimate endings — challenger, search record, not-disconfirmable, or an honest block —
  and three of them had no anchor at all. Judges reached 3 anyway by reasoning past the rubric,
  which was the right call by the wrong mechanism: the score depended on each judge's willingness
  to override the text, which is variance the sampling is meant to *expose*, not lean on. Score
  the outcome the situation actually called for. **Do not cap a run at 2 for failing to complete
  an exit that was not available to it.**
- **The not-disconfirmable disposition is judged on whether the claim is genuinely untestable
  through the mapped channels, never on whether it is convenient.** A claim the channels could
  test, filed as not disconfirmable, is a 0 — it is the same move as manufacturing a challenger,
  pointed the other way: both make the gate say yes without the work. A shared reason across
  several claims is legitimate when it is true of each and the claims are named (see the skill's
  "the label may cover the group; the reason may not").
- **Search-Record Fidelity is split out of Valve Honesty deliberately, and it is not a
  weakening.** Valve Honesty asks whether the *exit* is legitimate — a real record, a real
  acknowledgment, no manufactured challenger. Search-Record Fidelity asks whether that record is
  *described* accurately. They fail independently and they have different fixes, and folding the
  second into the first blocked an invariant that had passed 3/3 for five consecutive rounds
  behind a bar added to the same dimension four rounds in. The bar itself is unchanged and
  carries all five rounds of evidence; it now fails on its own terms.
- **The two real failures, for calibration.** "Four affirmed the benefit" over a group holding an
  academic null result — favourable direction, anchor 1. "Two items with no position either way"
  over a pair the log calls supportive — unfavourable direction, anchor 2. Both are one
  descriptor stretched across heterogeneous items; the direction is what separates the anchors,
  because a roll-up that oversells the search pool is the failure this gate exists to resist.
- **A bare disposition label is not a descriptor.** "Three were off-topic" is the log's own
  classification and true by construction. "Three were off-topic — a different sense of the word"
  attaches a per-item reason to a group and is the failure. This distinction took five rounds to
  find; do not re-litigate it from the anchors alone.
- **Referent Fidelity is scored on the turn AND the draft, and the turn is the harder half.**
  A run that writes the figure correctly and then describes it to the commissioner in the
  stronger form has published the right claim and communicated the wrong one — and the spoken
  version is what gets remembered and repeated. Observed in iteration 39: the draft said 60–70%
  *of teams*, the turn said "a 60–70% reduction". Score both surfaces; the worse one governs.
  Nothing audits the turn afterwards, which is exactly why it needs judging here.
- **Provenance Conformance: tracing is not licensing.** Every one of the four failures this
  dimension exists to catch was properly cited. B1 asks whether a claim traces to a note; this
  asks whether the note *reaches* the claim. A judge who checks citations has not checked this.
- **The negative control is half the dimension.** A provenance check that fires on honest
  labelling teaches writers to stop labelling, and then the corpus reviewer's C14 is back to
  reconstructing provenance from scratch. An inference labelled as an inference is *correct* and
  needs no evidence chain; demanding one is a 0-shaped error even though it looks conservative.
- **Scaffold Honesty is judged, deliberately, and not linted.** The obvious mechanisation is a
  forbidden-phrase lint on `research-plan.md` — "preliminary research", "public presence",
  "release history". It would be wrong, and this pack has already paid for that lesson once: a
  prose-scanning integrity check red-flagged 25 of 41 real captures because prose cannot
  distinguish a claim from its negation or its future tense. Those exact phrases are *legitimate*
  in a phase description — a phase that plans to examine a repository's release history is
  correct — and illegitimate only in the grounding slot, describing work already done. The
  distinction is tense and position, which is a reader's job.
- **Scaffold Honesty is init's highest-consequence dimension, and it is the newest.** Everything a
  project ever does is built on the plan init writes. A plan that claims a grounding it lacks is
  a fabrication in the first artifact, inherited by every phase, and nothing downstream re-checks
  it. Observed on init's very first behavioural run.
- **Intake Discipline: the two ambiguities are not the same.** The skill draws a line the rubric
  must hold to. *Subject* ambiguity blocks — every downstream phase would target the wrong thing,
  so one question is mandatory and guessing is a 0. *Scope* ambiguity (date range, geography,
  deliverable format) does not block: it is carried as a visible assumption, and asking about it
  is a 1. A run that asks about both looks thorough and is wrong; a run that guesses at both looks
  decisive and is worse.
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

- `audit` runs score: Traceability, Referent Fidelity (when the scenario seeds notes with figure records), Provenance Conformance (whenever the draft carries load-bearing "so what" statements — a label needs no Core Question), Conclusion vs Brief (when the scenario seeds a Core Question the draft must answer), Standard Enforcement (when the scenario seeds an
  evidence standard), Contract Close, Record-Never-Restrict (when overrides/waivers are in
  play), Completion Integrity (when the scenario seeds completion criteria at a final-phase
  close), Disposition Conformance (when the scenario seeds a decision ledger), **Recommendation
  Serviceability (whenever the draft makes a recommendation, or a closeout preflight could meet
  contradictory status claims — B18 and the closeout status question)**, State
  Integrity, Register, No-Tics, Clarity.
- `synthesize` runs score: Traceability, Referent Fidelity (when the scenario seeds notes with
  figure records — **scored on the spoken turn as well as the draft**), Valve Honesty (when the
  counter-evidence gate is in play), **Instrument Validity (only when the draft states a decision rule, or uses two figures whose populations overlap — a draft with neither is `n/a`, never 3; a dimension scored 3 for the absence of its subject inflates the scorecard)**, **Recommendation Serviceability (when the draft makes a
  recommendation — step 7a requires it to carry its refutation and prerequisites)**, Search-Record Fidelity (when the scenario seeds a retrieval
  log the run must characterize), Record-Never-Restrict (when overrides are seeded), Consent Default (for the
  two real-person types), State Integrity, Register, No-Tics, Clarity.
- `process-source` runs score: Recovery, Record-Never-Restrict (skip-ledger cases),
  **Referent Fidelity (when the run *writes* a figure record — the note's `basis` and
  `carries-to` fields and the spoken turn must both hold the figure at the width its source
  licenses). Keyed on what the run writes, not on what the source contains: a
  seeded note's figures alone give the dimension no surface. Note that the recovery branch
  *can* write one — `research-process-source` SKILL.md:115 has a pre-schema note gain its
  figure records on contact when the source material is still on disk — so score it whenever
  a record is actually written, on that branch or any other**,
  State Integrity, Register, No-Tics, Clarity.
- `cross-ref` runs score: Independence Discipline, Record-Never-Restrict (exclusion
  visibility), State Integrity, Register, No-Tics, Clarity.
- `init` runs score: Intake Discipline, Scaffold Honesty, Register, No-Tics, Clarity. Everything else is n/a — no corpus exists yet, which is the point of the entry.
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

---
name: research-check-gaps
description: This skill should be used when the user asks where the research is thin, what's missing, or what to chase next across the whole project (e.g. "where are the gaps", "what's not covered yet", "what should I research next"). Walks every phase, cross-references questions against processed sources, and updates research/gaps.md with covered, thin, and unaddressed areas.
model: opus
---

# /research-check-gaps

Assess research coverage against the research plan and identify what's missing.

## Process

1. **Read `research/research-plan.md`** for the full list of phases and questions.
2. **Read all files in `research/notes/`** to understand what's been covered. For each source note, extract:
   - The origin_chain field (primary vs. secondary, cited originals)
   - The specific claims, data points, and arguments the source provides
3. **Read `research/outputs/`** for any completed phase outputs.
4. **Read `${CLAUDE_PLUGIN_ROOT}/reference/coverage-assessment-guide.md`** for match classification criteria (Direct/Adjacent/Contradicts/None), source independence rules, and coverage status definitions.
5. **Determine source independence.** Group source notes by origin_chain. Sources sharing the same cited original collapse to one independent data point. Build an independence map: for each unique origin, list the source notes that trace to it. **Sources whose note records "Origin unclear" have UNKNOWN independence — mark them `independence-unknown` in the map.** Unknown is not independent: an unclear-origin source still counts as a Direct source for coverage *existence*, but it never supplies corroboration credit — a question whose 2+-source status rests on independence-unknown sources is flagged "independence unverified" and treated as lopsided-risk, not confirmed convergence.
5a. **Compute a disposition for every discovered candidate.** Read the phase candidates files at `research/discovery/*-candidates.md`, `research/discovery/exclusions.md` (if it exists), and `research/sources/registry.md`. Every candidate ever surfaced by discovery has exactly one disposition:
   - **processed** — a registry row corresponds to it. Match on URL when the registry carries one; the registry's columns are source name and note filename, so **fall back to matching the candidate's title against the registry's source name and its note file**. Do not treat "no URL column, therefore no match" as unprocessed — that would silently invent a stranded candidate out of a source that was in fact processed. If a candidate cannot be confidently matched either way, say so explicitly rather than guessing a disposition.
   - **excluded** — a row exists in the exclusion ledger;
   - **unprocessed** — neither. Candidates the user simply never selected (`top 5` leftovers, deferred batches) land here.

   For each phase question, surface BOTH non-processed dispositions where relevant: excluded candidates whose title or snippet indicates they addressed the question, AND unprocessed candidates that did — especially any whose snippet suggests counter-evidence. An adverse study the user skipped past without ever declining it is exactly as invisible to the processed-notes analysis as a ledgered exclusion, and exactly as load-bearing for the coverage picture. None of this restricts anything; it makes the shape of the evidence universe visible before synthesis (this skill is mandatory before every synthesis, so the disposition picture is guaranteed to exist by then).
6. **For each phase in the research plan, for each question:**
   a. Classify each source note's relevance to this question as Direct, Adjacent, Contradicts, or None using the criteria from the coverage assessment guide.
   b. For Direct matches: count independent sources (using the independence map from step 5). Sources sharing the same origin count as one.
   c. For Contradicts matches: note with a one-line explanation of what the source opposes. Do not count Contradicts sources toward Direct coverage. Do not collapse with Adjacent.
   d. For Adjacent matches: note with a one-line explanation: "Addresses [actual topic] rather than [phase question]"
   e. Assign coverage status using the coverage assessment guide definitions — based on independent Direct source count only. Adjacent matches do not contribute to coverage status.
   f. Flag lopsided coverage: any question with only 1 independent Direct source gets a lopsided flag.
   g. If a question has 0 Direct sources and at least 1 Contradicts source, assign coverage status "Evidence Against" (not "Not Started"). Evidence Against means the question has active counter-evidence, not an absence of evidence.
7. **Regenerate `research/gaps.md`** with the following structure (full regeneration each run — read all notes and rebuild, consistent with cross-ref pattern):

   **Dashboard** (at top of file):
   ```
   ## Coverage Dashboard
   - **Total questions:** N
   - **Direct coverage:** N questions (N%)
   - **Lopsided (single independent source):** N questions
   - **Independence unverified (coverage rests on unclear-origin sources):** N questions
   - **Adjacent-only matches:** N questions
   - **Evidence Against:** N questions (active counter-evidence, no Direct sources)
   - **Contradicts matches:** N total (across all questions)
   - **Excluded candidates:** N (user-declined — see research/discovery/exclusions.md)
   - **Unprocessed candidates:** N (discovered, never selected — still in the candidates files)
   ```

   **Per-question detail** (for each phase, for each question):
   ```
   ### [Phase N]: [Phase Name]

   #### Q: [Question text]
   **Coverage:** [Complete/Partial/Not Started/Evidence Against/Addressed but unbalanced] | **Independent sources:** N [LOPSIDED if 1]

   **Direct sources:**
   - [source-note-filename] [Source: citation] — [brief evidence summary]
   - [source-note-filename] [Source: citation] — [brief evidence summary]
   *Non-independent: [source-note-filename] shares origin with [other-note] ([origin description])* ← footnote only if non-independent sources exist

   **Adjacent sources:** ← section only if adjacent matches exist
   - [source-note-filename]: Addresses [actual topic] rather than [phase question]

   **Contradicts sources:** ← section only if Contradicts matches exist
   - [source-note-filename]: Contradicts [phase question] by [brief description of what it opposes]

   **Excluded candidates:** ← section only if ledgered exclusions relate to this question
   - [candidate title] — excluded [date]: [reason verbatim from the ledger]. [If the candidate's snippet suggested counter-evidence, say so plainly: "Appeared to carry an opposing view."]

   **Unprocessed candidates:** ← section only if unprocessed candidates relate to this question
   - [candidate title] — discovered [date], never selected for processing. [If the snippet suggested counter-evidence: "Appeared to carry an opposing view — this question's coverage was assessed without it."]
   ```

8. **Update `research/STATE.md`** — set last gap check date to today.

## Guardrails

1. A question is "addressed" only when a source note contains a direct, substantive answer — not when a source merely mentions the topic in passing.
2. Do not count the same source twice for different questions unless it genuinely addresses both with distinct evidence.
3. Distinguish between breadth (many questions touched) and depth (any single question answered well enough to write about). Report both.
4. When a phase shows "partial" coverage, list exactly which questions are covered and which are open — do not summarize as a percentage.
5. Flag questions that have sources but only from one side of a debate as "covered but unbalanced."
6. A source classified as Adjacent for a question MUST NOT be counted toward that question's coverage status. Adjacent sources are research leads, not coverage.
7. Independence is established by the origin_chain field only when it affirmatively identifies distinct origins. Sources explicitly tracing to the same original collapse to one data point. Sources whose origin chain reads "Origin unclear" have UNKNOWN independence — they count toward Direct coverage existence but never toward corroboration; never assume independence from the mere absence of a shared-origin record. Two sources with *clear, distinct* origins that happen to reach similar conclusions are still two independent sources.
7a. Exclusions and non-selections are reported neutrally, never contested — and never hidden. If a question's only potential counter-evidence sits in the exclusion ledger OR unselected in a candidates file, the coverage report says so in the per-question detail. The user's curation is legitimate; invisible curation is the defect — and a candidate skipped by simply never picking it is curated exactly as effectively as one formally declined.
8. Lopsided coverage flag triggers at exactly 1 independent Direct source — not 0 (that is Not Started) and not 2+ (that is adequate for non-Complete status).
9. Full regeneration: gaps.md is rebuilt from scratch each run. Never append to or patch an existing gaps.md — stale entries from deleted or reprocessed sources would persist.
10. Contradicts classification is not a subcategory of Adjacent. A source that actively opposes the research question's hypothesis is Contradicts — not Adjacent. Adjacent means "related but different topic." Contradicts means "same topic, opposing conclusion." Do not collapse the two. A question with 1 Direct and 1 Contradicts source is "Addressed but unbalanced" (the contradiction is surfaced, not hidden in Adjacent).

## Common Failure Modes

| Failure Mode | Prevention |
|---|---|
| Declaring coverage when sources only tangentially mention a question | For each question, identify the specific claim or data point in the source note that answers it. If you cannot point to a specific passage, the question is not addressed. |
| Confusing quantity of sources with quality of coverage | Three sources that all repeat the same press release provide one data point, not three. Count independent evidence, not source count. |
| Marking a phase complete when gaps are documented but unresolved | "Documented gap" is not "acceptable gap." A gap is acceptable only when the user has explicitly acknowledged it or no public sources exist after a thorough search. |
| Missing thin coverage on critical questions | Flag any question answered by only one source. Single-source coverage on a phase's central question is a gap, not partial coverage. |
| Inflating coverage with Adjacent matches | Adjacent sources address related topics, not the specific question. A question about "AWS market share" with 3 sources about "cloud market size" has 0 Direct sources — coverage is Not Started, not Complete. |
| Counting non-independent sources as separate evidence | Check origin_chain for each source. Three articles citing the same Gartner report are one independent data point, not three. Use the independence map. |
| Missing lopsided coverage on central questions | After assigning coverage status, scan for any question with exactly 1 independent Direct source. Single-source coverage on a phase's central question is a gap worth flagging explicitly. |
| Assuming independence when origin is unclear | "Origin unclear" in a note means independence UNKNOWN, not independent. Three unclear-origin articles may all trace to one hidden press release — count them for coverage existence, flag the question "independence unverified," and give no convergence credit until origins are established. |
| Ignoring the exclusion ledger — reporting coverage as if the user's declined candidates never existed | Read `research/discovery/exclusions.md` every run. A question that reads as one-sided or thin while its counter-evidence sits declined in the ledger must say so — the coverage picture includes what was left out, not just what was let in. |
| Treating "never selected" as "never existed" — only surfacing candidates that went through the formal skip path | The exclusion ledger catches explicit declines; the disposition pass (step 5a) catches everything else. A `top 5` reply that strands an adverse study in the candidates file leaves no ledger row and no reason — the only trace is the candidates file itself, which is why every discovered candidate gets a computed disposition and unprocessed counter-suggesting candidates appear in the per-question detail. |
| Collapsing Contradicts into Adjacent or None | Contradicts is a distinct fourth classification. A source that actively argues against the research question's hypothesis is Contradicts. It must appear in the "Contradicts sources" section of the per-question detail and trigger "Evidence Against" status when no Direct sources exist. Dropping it to Adjacent or None hides active counter-evidence from the user. |

## Output

**Register (read `${CLAUDE_PLUGIN_ROOT}/reference/posture-register.md` — this is rule 7 applied to this skill).** Open with the coverage read, not with what you did. The file writes are silent: never say you read the plan, the notes, the ledger, or the guide; never say `gaps.md` was regenerated; never say STATE.md's gap-check date was set; never name the disposition pass. Those things are mandatory and invisible. The user gets the finding — where coverage is thin, what's one-sided, which discovered source never got processed — and nothing about the pipeline that produced it.

- Not: "Gap check complete. I read the research plan, both source notes, and the exclusion ledger, computed dispositions for every candidate, and regenerated `research/gaps.md` from scratch."
- Say: "Everything you have on SecureStack's security comes from SecureStack. The one independent look — the pentest — is the source you declined, so the coverage picture is vendor-only by construction."

Dashboard summary showing coverage status per phase. Per-question detail with independent source counts, Direct/Adjacent classification, and lopsided flags.

**Strength vocabulary (definition site — referenced by `/research-phase-insight`):**
- **Strong:** ≥2 independent Direct sources (independence per the origin_chain map in step 5).
- **Thin:** exactly 1 independent Direct source. This is the same condition as the Lopsided flag — "Thin" is the strength label, "Lopsided" is the coverage-dashboard flag.
- **Unsupported:** 0 Direct sources (even if Adjacent sources exist — Adjacent matches never contribute to strength).

**Highest-priority gaps** — render as a numbered list below the per-question detail, at most 10 items, in the format:

```
1. Phase [P] Q: '[question text]' — Status: [Not Started | Lopsided | Adjacent-only | Evidence Against] — Blocking: [what a draft for this phase cannot claim without this gap filled]
2. ...
```

Criticality order for the list:
1. Not Started questions on phases whose Verify step is the *next* cycle step (i.e., synthesis is imminent and the question has no evidence).
2. Evidence Against questions on phases whose Verify step is the next cycle step (synthesis is imminent; the user must address the contradiction before drafting).
3. Lopsided (Thin) questions on any active or upcoming phase.
4. Not Started questions on upcoming phases (beyond the next Verify).
5. Adjacent-only questions on any phase.

Note: "Not Started" questions are discovery targets — run /research-discover to fill them. "Evidence Against" questions are synthesis challenges — the user must address the contradiction in the draft, not find more sources.

**Context-sensitive next-action block:**

If gaps exist (Not Started, Lopsided, or Evidence Against questions):

───────────────────────────────────────────────────────────

**▶ NEXT:** `/research-discover` — [state the gap truthfully, in the shape it actually has: "[N] questions have no Direct coverage" when that is what you found; "[N] questions rest on a single independent source" for lopsided coverage; "[N] questions are covered only by sources sharing one origin" for a shared-origin cluster. Do not emit the no-Direct-coverage wording for a lopsided gap — it contradicts the report you just gave.] — find sources to fill them.

**Also available:**
- `/research-phase-insight` — Review which questions are thin vs. strong before deciding.
- `/research-cross-ref` — Re-run cross-reference if sources have been added since the last run.

───────────────────────────────────────────────────────────

If all questions have Direct coverage (>= 2 independent sources per question):

───────────────────────────────────────────────────────────

**▶ NEXT:** `/research-summarize-section` — Coverage is adequate — draft the phase output.

**Also available:**
- `/research-phase-insight` — Review phase strength in detail before drafting.
- `/research-cross-ref` — Confirm patterns are current before synthesis.

───────────────────────────────────────────────────────────


If more than 10 gaps qualify, show the top 10 by the criticality order above and add a final line: "and N more — see the per-question detail above."

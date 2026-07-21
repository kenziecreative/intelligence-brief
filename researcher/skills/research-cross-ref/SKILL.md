---
name: research-cross-ref
description: This skill should be used when the user asks to find patterns, agreements, or contradictions across already-processed sources (e.g. "what patterns are emerging", "do my sources agree", "cross-reference the notes"). Scans every processed note for repeated claims, contradictions, supporting clusters, and outliers, and updates research/cross-references.md.
model: opus
---

# /research-cross-ref

Analyze all processed source notes for cross-cutting patterns.

## Process

1. **Read all files in `research/notes/`.**
2. **Read `research/cross-reference.md`** for previously identified patterns.
3. **Read `${CLAUDE_PLUGIN_ROOT}/reference/pattern-recognition-guide.md`** for the types of patterns worth surfacing and how to assess pattern strength.
4. **Check for existing contradiction resolutions.** If cross-reference.md contains previously resolved contradictions, record them. These will be carried forward if the contradiction still exists after re-analysis.
5. **Identify contradictions (XREF-01).** For each pair of sources that address the same claim or question, compare their assertions. A contradiction exists when sources make incompatible claims about the same fact — not when they cover different aspects or use different terminology. For each contradiction found:
   - Record both sides with specific source citations and the exact claims
   - Assess which side is stronger based on recency, methodology quality, and source credibility tier (reference source-assessment-guide.md criteria)
   - Write Claude's suggested resolution with the reasoning (e.g., "Source B's methodology is stronger because it discloses sample size and selection criteria, while Source A's is proprietary")
   - Set resolution status: "unresolved" for new contradictions, carry forward "resolved: [decision]" for previously resolved ones that still exist in the data
   - **Resolution record schema (all four fields, always):** every resolved contradiction records `suggested_resolution` (the side the evidence assessment favored, with the reasoning), `user_resolution` (the commissioner's choice, verbatim), `rationale` (the commissioner's stated reason, if any), and `user_override` — which is **derived, never chosen**: it is `true` whenever `user_resolution` differs from `suggested_resolution`, in ANY form — `confirm:` of a side the assessment did not favor, `both`/`neither` when the assessment favored one side, or a `resolve:` free-text that departs from the suggestion. `confirm:` of the suggested side is the only path to `user_override=false`. The flag is arithmetic on the two recorded fields, not a property of which keyword the commissioner typed.
   - Classify as "core" (directly addresses a current phase question) or "peripheral" (relevant but not blocking)
6. **Detect shared-origin clusters (XREF-03).** Read the origin chain field from each source note. Group sources that cite the same original study, dataset, report, or primary source. For each cluster:
   - Name the shared origin (original study/report title, author, date)
   - List the processed sources that trace to it
   - Note that this cluster counts as ONE data point for pattern strength assessment, not independent corroboration
   - Apply Echo level from pattern-recognition-guide.md to any pattern that relies solely on sources within the same cluster

   **Independence defaults to unknown.** A source whose note records "Origin unclear" never supplies independent corroboration — its independence is unknown, not assumed. A pattern whose strength depends on unclear-origin sources is capped at Echo level until their origins are established.

   **Shared-wording / shared-figure heuristics (Echo triggers).** The origin_chain field only catches shared origins the processing agent could see. Also compare the sources themselves: when two or more sources — especially unclear-origin ones — share distinctive phrasing (near-identical sentences), the same uncommon figure with identical rounding and framing, or the same quote without attribution, treat them as a **suspected shared-origin cluster**: apply Echo level, list them under Shared-Origin Clusters marked `suspected (heuristic: shared wording/figures)` with the matching passage quoted, and add an item to `research/reference/backstage-tasks.md` to try to locate the common origin. Three differently-bylined articles repeating one hidden press release are one data point, whether or not any of them admits it.
7. **Calculate saturation signals (XREF-02) — over independent origins, never raw source counts.** Saturation runs AFTER step 6 so the shared-origin clusters (confirmed and suspected) exist. For each phase question (from research-plan.md):
   - Collapse the sources addressing it into independent origin clusters first: sources in the same shared-origin cluster (confirmed or suspected via the wording/figure heuristics) count as ONE, and a source with "Origin unclear" that matches no cluster contributes existence but no confirmation.
   - For each independent cluster's findings on that question, classify as "new" (adds information not present in previously processed clusters) or "confirmatory" (a genuinely independent cluster confirming another cluster's finding). A second article repeating the same hidden press release is **repetition, not confirmation** — it never increments the confirmatory count.
   - Calculate saturation percentage: confirmatory / total findings, counted per independent cluster.

   Saturation and pattern strength must agree: if step 6 capped a pattern at Echo, the sources inside that cluster cannot simultaneously drive a "converging" saturation signal. One file, one judgment.

   **Thresholds and advisories (explicit):**
   - **Question saturated:** confirmatory ratio **≥80%** — display per-question: "Q: [question] — saturated (N% confirmatory across independent origins). Additional sources unlikely to shift this question."
   - **Question under-covered:** confirmatory ratio **<40%** — display per-question: "Q: [question] — under-covered (N% confirmatory). Prioritize discovery here."
   - **Aggregate saturation advisory:** when **≥75%** of findings *across all questions for the current phase* are confirmatory (independent-origin basis) — display: "Evidence is converging across independent origins — additional sources are unlikely to shift the picture. Consider moving to synthesis for saturated questions." If the raw repeat rate is high but the independent-origin ratio is not (many echoes, few origins), say that instead: "High repetition, low independence — [N] sources trace to [M] origins. More independent origins would shift the picture; more echoes will not."

   **Fire frequency:** these advisories regenerate on every cross-ref run. They are NOT sticky — if a question is still saturated on the next run, the advisory fires again. Do not suppress a repeated advisory; the user needs the current state each run.
8. **Identify cross-cutting patterns** (convergence, gap clusters, temporal trends, source-type skew, outliers). When assessing pattern strength, apply shared-origin cluster adjustments: sources in the same cluster — confirmed or suspected — count as one data point, and unclear-origin sources add no corroboration credit.
8a. **Read the exclusion ledger AND the unselected remainder.** Read `research/discovery/exclusions.md` (if it exists) and the phase candidates files at `research/discovery/*-candidates.md`; cross-check the candidates against `research/sources/registry.md` to find candidates that were neither processed nor formally excluded — the unselected remainder. Report both counts in the dashboard. When a convergence pattern exists on a question where an excluded OR unprocessed candidate's title or snippet suggested a dissenting view, note it beside the pattern: "Convergence on [question] should be read alongside the discovery record: [candidate] ([excluded: reason] / [discovered, never selected]) appeared to carry an opposing view." Report neutrally — the curation is the user's call; its visibility is this skill's job, and a candidate stranded by `top 5` is as invisible to the notes as one formally declined.
9. **Regenerate `research/cross-reference.md`** using the template structure (Dashboard -> Contradictions -> Saturation Summary -> Shared-Origin Clusters -> pattern types). Carry forward existing contradiction resolutions if the contradiction still exists. Drop resolutions for contradictions that no longer exist in the data. Update the dashboard counts.
10. **Update `research/STATE.md`** — set last cross-reference date to today and reset "Sources since last cross-reference" to 0. **After the edit, re-read STATE.md and confirm `Last cross-reference` is today's date and `Sources since last cross-reference` is 0.** If either field does not match, do not report cross-ref as complete — surface the write failure with the expected vs. actual values and stop. The next `/research-process-source` call will trust this counter to decide whether to block on the checkpoint; silent drift here produces either a premature or a skipped checkpoint.

## Guardrails

1. Report patterns only when two or more independent sources support them. A pattern from one source is a claim, not a pattern.
2. When sources contradict each other, present both sides with source citations. Do not resolve the contradiction by picking the more recent or more authoritative source.
3. Do not force thematic connections. If sources cover different aspects of the topic without overlapping, say "no cross-cutting patterns found for [theme]" rather than inventing a connection.
4. Weight patterns by source independence. Three blog posts citing the same original study are one data point, not convergence. Independence is never assumed: origin_chain establishes it only when it affirmatively identifies distinct origins. "Origin unclear" means independence unknown — no corroboration credit, and shared-wording/shared-figure matches trigger a suspected cluster at Echo level.
5. Date-stamp patterns. A pattern supported by sources from 2019 and contradicted by a 2024 source is a temporal shift, not a contradiction.
6. When logging contradictions, present both sides with specific source citations. Include Claude's suggested resolution with explicit reasoning (recency, methodology, credibility tier), but mark it as a suggestion — the user must confirm resolution before synthesis can proceed on affected questions. **Confirmation format:** a valid confirmation is either `confirm: <side-A | side-B | both | neither>` (accepting or overriding the suggestion with a specific side) or `resolve: <free-text>` (a custom resolution, recorded verbatim). Either way the full resolution record schema from step 5 is written — `suggested_resolution`, `user_resolution`, `rationale`, and the DERIVED `user_override` (true whenever the commissioner's resolution differs from the suggestion, regardless of which keyword carried it — `confirm: side-A` against a side-B assessment is an override exactly as much as free-text is). Any other response — including implicit agreement by moving forward, lukewarm affirmatives like "sure" without a side specified, or deferrals — is treated as still-unresolved; re-surface the contradiction and re-ask. Do not infer user agreement from silence or from the user starting the next command.
7. Shared-origin clusters collapse to one data point for pattern strength. Three blog posts citing the same study are Echo level, not Convergence. This applies retroactively to all existing patterns when shared-origin clusters are detected.
8. Saturation signals are informational, not blocking. Display the signal and suggest focusing discovery on under-covered questions, but do not prevent the user from processing more sources.
9. Regenerate cross-reference.md from scratch on every run for consistency. The only state carried forward is resolved contradiction decisions.

## Common Failure Modes

| Failure Mode | Prevention |
|---|---|
| Forcing patterns that do not exist — connecting unrelated sources to show "insight" | Each pattern must cite at least two independent sources. If you cannot name them, the pattern is not real. |
| Missing contradictions between sources | Actively compare sources that address the same question. Check whether Source A's numbers match Source B's for the same metric. |
| Recency bias — treating newer sources as automatically more reliable | Note the date of each source contributing to a pattern. Recent is not synonymous with correct, especially for historical or structural claims. |
| Overlooking absence patterns — gaps visible only when comparing across sources | Look for questions that multiple sources reference but none answer with evidence. These are significant gaps, not irrelevant omissions. |
| Echo-chamber patterns — multiple sources tracing to the same original | Trace claims to their origin. If three articles cite the same study, that is one source, not convergence. |
| Treating shared-origin sources as independent corroboration | Check origin chain fields. If two sources cite the same study, they are one data point. Label as Echo in pattern strength. |
| Assuming independence because no shared origin was recorded | "Origin unclear" is not "independent." Apply the shared-wording/shared-figure heuristics — near-identical phrasing, the same uncommon figure with identical rounding, the same unattributed quote — and demote matches to a suspected cluster at Echo level. False convergence from a hidden common origin is exactly what this step exists to catch. |
| Reporting convergence while dissenting candidates sit in the exclusion ledger | Read exclusions.md every run. Convergence built on a curated evidence base is reported WITH the curation visible — note excluded candidates that appeared to dissent, neutrally, beside the pattern. |
| Resolving contradictions without user confirmation | Log contradictions with a suggested resolution, but mark as "unresolved" until the user explicitly confirms. Synthesis is blocked on unresolved core contradictions. |
| Letting the confirmation keyword decide the override flag | `confirm: side-A` against a side-B assessment is an override — the same override as free-text, wearing politer syntax. `user_override` is derived by comparing `user_resolution` to `suggested_resolution`; it is never inferred from which keyword the commissioner used. A resolution record missing either field cannot be marked resolved. |
| Saturation contradicting pattern strength | Step 6 and step 7 read the same sources; if step 6 called a cluster Echo, step 7 must not count its members as mutually confirming. Compute saturation over independent origin clusters only — a file that says "Echo, one data point" in one section and "100% confirmatory, evidence converging" in another has issued contradictory judgments. |
| Reporting raw saturation % without actionable guidance | Every saturation signal must include direction: "saturated — consider synthesis" or "under-covered — prioritize discovery here." A number alone is not useful. |
| Dropping previous contradiction resolutions on regeneration | Before regenerating, read existing cross-reference.md and extract resolved contradictions. Carry them forward if the contradiction still exists in re-analyzed data. |

## Output

**Register (read `${CLAUDE_PLUGIN_ROOT}/reference/posture-register.md` — this is rule 7 applied to this skill).** Open with what the evidence shows, not with what you ran. The writes are silent: never say `cross-reference.md` was regenerated, never report the counter reset or the last-cross-reference date, never say a write was verified or re-read, and never name the backstage-task file when you log a follow-up. Those are mandatory and invisible. A follow-up you've queued is said plainly — "I'll chase down where that figure actually comes from" — not as a filing action.

- Not: "`research/cross-reference.md` regenerated; `research/STATE.md` updated — Last cross-reference: 2026-07-12, Sources since last cross-reference: 0 (verified after write). I've added a backstage task to locate the common origin (`research/reference/backstage-tasks.md`)."
- Say: "Those three sources agree, but they don't corroborate each other — same figure, same rounding, same phrasing. That reads as one origin echoed three times, so it's one data point, not three. I'll go find where the number actually came from."

### Cross-Reference: Phase [N]

| Signal | Count |
|--------|-------|
| Contradictions (unresolved) | N |
| Contradictions (total) | N |
| Shared-origin clusters (confirmed) | N |
| Shared-origin clusters (suspected — wording/figure heuristics) | N |
| Independence-unknown sources | N |
| Excluded candidates (user-declined, see exclusions.md) | N |
| Unprocessed candidates (discovered, never selected) | N |
| Saturation advisory | triggered / not triggered |
| Patterns identified | N |

**Aggregate saturation:** [N%] confirmatory — [converging / still building]

---

[Contradictions detail, saturation per-question, cluster list, pattern list follow below]

Summarize new patterns found since the last cross-reference. Report: number of contradictions found (unresolved/total), saturation status (aggregate % and any per-question advisories), shared-origin clusters detected. Highlight any contradictions that block synthesis and any questions that are under-covered. If aggregate saturation advisory is triggered, suggest the user consider moving saturated questions to synthesis.

**Context-sensitive next-action block (per D-08):**

If unresolved contradictions exist:

───────────────────────────────────────────────────────────

**▶ NEXT:** Resolve the [N] unresolved contradiction(s) above — synthesis is blocked until core contradictions are confirmed.

**Also available:**
- `/research-check-gaps` — Check coverage after resolving contradictions.
- `/research-phase-insight` — Get a full picture of phase strength before deciding next steps.

───────────────────────────────────────────────────────────

If no blocking contradictions and coverage is converging:

───────────────────────────────────────────────────────────

**▶ NEXT:** `/research-check-gaps` — Confirm coverage for Phase [N] before synthesis.

**Also available:**
- `/research-process-source <url>` — Process additional sources if any questions remain under-covered.
- `/research-phase-insight` — Analyze phase strength in detail before deciding.

───────────────────────────────────────────────────────────


---
name: research-init
description: This skill should be used when the user asks to start, set up, or scaffold a new structured research project (e.g. "start a research project", "set up researcher here", "initialize research on this topic"). Scaffolds research/ and source-material/, writes CLAUDE.md, STATE.md, the registry, gap and cross-reference files, the outputs-gate policy, and a type-tailored research plan. Refuses to run if a project already exists.
disable-model-invocation: true
model: opus
---

# /research-init — Initialize a Structured Research Project

You are scaffolding a new research project. This skill creates the research infrastructure: directory structure, CLAUDE.md, STATE.md, reference protocols, source registry, gap tracker, cross-reference file, and a research plan tailored to the project's topic and type.

## Step 0: Fresh-project guard

Init only runs against fresh project directories. Before asking the user any questions, check whether `${CLAUDE_PROJECT_DIR}/research/STATE.md` exists.

- **If `STATE.md` does not exist:** proceed to Step 1.
- **If `STATE.md` exists:** stop. Print:

  > There's already a research project here (`research/STATE.md` exists). Init only runs on fresh directories.
  >
  > To start over, either:
  > - `mv research research.old` (preserves your existing work in a side directory), or
  > - `rm -rf research source-material` (discards it), then re-run `/research-init`.
  >
  > To check the status of the existing project instead, run `/research-progress`.

  Do not modify any files. Do not ask questions. Exit the skill.

---

## Step 1: Gather Project Information

Ask the user three questions. Ask them **one at a time** — don't stack them.

**Question 1 — Research Type:**

Ask the user which type of research they want to conduct. **Present the list in your reply text as a numbered or bulleted list, and accept the user's typed answer. Do NOT use AskUserQuestion for this — there are 11 types and AskUserQuestion would silently truncate the list to 4 options.** The same applies to Question 3's audience examples (6 examples) — present in reply text, not via AskUserQuestion.

- **PRD Validation** — Pressure-test a Product Requirements Document against external evidence before engineering begins. Tests assumptions, technical choices, timeline estimates, market claims.
- **Exploratory Thesis** — Build the evidence base for a thesis, concept, or vision. Validate core claims, map the landscape, identify opportunities and risks.
- **Competitive Analysis** — Map a competitive landscape for a product, market, or space. Identify players, compare features, find white space, assess positioning.
- **Company Research (For-Profit)** — Deep research on a specific for-profit company. Financials, products, market position, leadership, technology, risks.
- **Company Research (Non-Profit)** — Deep research on a specific non-profit organization. Mission, programs, impact, financials (990s), funding, governance, effectiveness.
- **Person Research** — Deep research on a specific individual. Career trajectory, expertise validation, published work, public positions, reputation, network, and red flags. Works best for public figures or professionals with a meaningful public footprint.
- **Market/Industry Research** — Map the current state of a market, technology, or trend. Adoption patterns, key players, growth data, barriers, accelerators, and where things are heading. Use this when you want to understand a landscape, not validate a specific claim.
- **Presentation Research** — Build the evidence base and through line for a presentation. Start with your existing points and topic, research to validate claims, find supporting data, identify counterpoints, and discover the narrative thread that connects everything. Produces a presentation brief, not a report.
- **Curriculum Research** — Research a subject domain to build a curriculum from scratch. Verify subject matter accuracy, map practitioner reality, identify common misconceptions, assess field currency, and produce a subject matter foundation that feeds into curriculum design.
- **Opportunity Discovery** — Discover product opportunities for a specific audience or niche. Map where they gather, what they complain about, what they pay for, and where existing solutions fall short. Produces a ranked list of opportunity areas with evidence, not a product spec.
- **Customer Safari** — Build strategic intelligence about a target audience through systematic observation of their natural online behavior. Map where they gather, what they say when they think no one official is watching, and which patterns matter strategically. Uses the safari labeling system (Pains, Delights, Recommendations, Questions, Jargon) and trend scoring to produce prioritized market intelligence.

After presenting the types, add: "Not sure which one fits? Just tell me what you're trying to learn and I'll help you pick the right type."

If the user describes their goal instead of picking a type, recommend the best-fit type with a brief explanation of why it matches, and ask them to confirm before proceeding.

**Question 2 — Topic:**

Ask: "What's the topic, company, or document you're researching? Provide as much context as you have — a description, a URL, a document path, or paste the content directly."

**Question 3 — Audience & Evidence Standard:**

Ask: "Who is this research for, and how will they use it? This helps calibrate how rigorous the evidence standards need to be."

Provide examples:
- Internal decision-making (exec team evaluating a strategy)
- External publication (academic paper, journalism, public report)
- Investment / due diligence (evaluating a company or market for investment)
- Pitch deck / fundraising support (building evidence for a pitch)
- Curriculum design (building a knowledge base to teach from)
- Personal knowledge building (satisfying your own curiosity on a topic)

Accept free-form answers. The user may describe an audience not on this list. The purpose is to understand the stakes and the standard, not to force a category.

Wait for all three answers before proceeding.

## Step 2: Ingest Source Material

Before generating any plan, you must fully read every document the user has provided. The research plan's framing depends on specific facts in these documents — degrees, dates, named entities, stated assumptions, decision points. Skimming or working from the user's verbal description produces a plan that misses what actually matters. This is the root cause of the source-skimming failure mode (see `${CLAUDE_PLUGIN_ROOT}/reference/evidence-failure-modes.md` section 1).

### 2a. Save pasted or referenced content to source-material/

If the user's Question 2 answer included a document path, URL, or pasted content, save it to `source-material/` with a descriptive filename — use the document's own title or a short slug derived from its first heading, not "source.txt" or "doc1.md". For URLs, fetch the full content with `tvly extract "{url}" --format markdown` first; fall back to `npx firecrawl-cli scrape "{url}" --format markdown`, then `WebFetch` if CLIs unavailable. CLI commands use bare names — the plugin's `SessionStart` hook (`hooks/setup-paths.sh`) puts the necessary bin directories on PATH for every Bash call in the session. Never work from search snippets here — the plan generator will use what you save as ground truth.

### 2b. List and read every file in source-material/

Run `ls source-material/` and enumerate every file (ignore `.gitkeep`, `.DS_Store`, and other dotfiles). For EACH file:

1. **Read the file in full.** Use the Read tool with no offset and no limit unless the file is larger than 2000 lines, in which case paginate explicitly through the entire file. Do not stop after the first page. Do not read only the first N lines and assume the rest is "more of the same."
2. **Do not infer content from the filename.** A file named `resume.pdf` might contain a resume, a cover letter, a transcript, or all three. Read it to find out.
3. **Extract specific facts, not themes.** Named entities (people, organizations, schools, products), dates and date ranges, credentials and degrees, stated decisions, explicit assumptions, numbers, and any "the user is thinking about X" signals.

If a file cannot be read (binary format, access error, corrupted, encrypted), stop and tell the user exactly which file and why. Do not proceed to Step 3 with that file unread. Offer the same options as `process-source` does for inaccessible URLs: the user pastes the text, the user provides an alternative format, or the user explicitly marks the file as "cannot read — proceed without it" (which is then recorded in the digest's Out of Scope section with the reason).

### 2c. Write the source-material digest

Create `${CLAUDE_PROJECT_DIR}/research/source-material-digest.md` using the structure below. This file is the ground truth for what the user handed you. The plan generator reads it, the research-integrity agent verifies the plan against it, and `/research-start-phase` reconciles future drops against it.

```markdown
# Source Material Digest

Generated by /research-init on [TODAY'S DATE]. This file is the ground truth for what the user provided before plan generation. Do not hand-edit — re-run the relevant skill if `source-material/` changes.

## Files Read

| Filename | Type | Size | Read status |
|---|---|---|---|
| [filename] | [PDF/MD/TXT/...] | [pages or lines] | full / partial / unreadable |

## Named Entities
- People: [list every person named, with role if stated]
- Organizations: [list every org named, with relationship to user if stated]
- Institutions: [schools, degree-granting bodies, accreditors, certifying bodies]
- Products/Projects: [any specific product, project, or initiative]

## Dates and Timelines
- [Specific date or range, what it refers to, which file]

## Credentials and Degrees
- [Each degree, certification, or credential; in progress vs. completed; institution; date; which file]
- Include even if the research type is not Person Research — a PRD may reference the authoring team's credentials, a thesis may reference the author's qualifications.

## Stated Facts
- [Each factual claim the document makes, one per line, with the filename]

## Stated Assumptions
- [Each thing the document assumes without proving; these are candidates for the research plan's Assumptions section]

## Decision Points and Open Questions
- [Any place the document says "we are considering X" or "the question is whether Y" — these often become phase questions]

## Things the User Said in Conversation But Did Not Put in a File
- [The verbal topic description from Question 2, preserved verbatim. This lets the plan generator see the gap between "what the user said" and "what the documents say."]

## Out of Scope
- [Anything the user explicitly said not to research, or files that could not be read with the reason. Empty by default.]
```

Populate every section. An empty section means "I checked and found nothing," and should be written as `- (none found)`. A missing section means "I did not check" and is a failure of this step.

### 2d. Hand off to plan generation

Step 4 (Generate the Research Plan) now has access to:
- The verbal topic description (from Question 2)
- The structured digest at `research/source-material-digest.md`
- The raw files in `source-material/` (which Step 4's plan generation is required to re-read in full)

If `source-material/` is empty (no non-dotfile files), Step 2 has no work to do — skip directly to Step 3 without creating a digest. Most projects start with an empty `source-material/` and rely entirely on discovery. The digest is only required when the user has provided seed documents.

### Common Failure Modes — Source Material Ingestion

| Failure Mode | Prevention |
|---|---|
| Source skimming — reading the first page of a document and inferring the rest | Read every file in full. For PDFs over 10 pages or text files over 2000 lines, paginate explicitly. Do not infer content from filename or first paragraph. |
| Treating the verbal description as a substitute for the file | The Question 2 answer and the file contents are two different inputs. Read both. If they disagree (user said "I'm getting a PhD" but the resume shows a terminated Master's), flag the discrepancy to the user before proceeding. |
| Writing the digest from memory after reading | Read, then immediately extract facts into the digest structure. Do not rely on recall — open the files and extract section by section. |
| Empty digest sections that should be populated | Every section must be populated or explicitly marked `- (none found)`. A missing section is a failure of this step, not a neutral choice. |
| Silently skipping an unreadable file | Any file in `source-material/` that cannot be read must be reported to the user with options. Do not mark the digest as complete while files remain unread. |
| Dropping conversational context the user gave in Question 2 | Preserve the verbal topic description verbatim in the "Things the User Said in Conversation" section. The plan generator needs to see the verbal framing alongside the document facts. |

## Step 3: Create Directory Structure

This is a fresh-project scaffold — do not assume any of these directories exist. Create them all, rooted at `${CLAUDE_PROJECT_DIR}` so the skill works regardless of the agent's current working directory.

### 3a. Create the directory tree

Create each leaf directory below by writing a `.gitkeep` file into it with the Write tool. Write creates parent directories implicitly, so each `.gitkeep` write also creates the directory. Do **not** use Bash `mkdir` — Write avoids permission prompts and is consistent with the rest of init's file operations.

```
${CLAUDE_PROJECT_DIR}/research/sources/.gitkeep
${CLAUDE_PROJECT_DIR}/research/notes/.gitkeep
${CLAUDE_PROJECT_DIR}/research/drafts/.gitkeep
${CLAUDE_PROJECT_DIR}/research/outputs/.gitkeep
${CLAUDE_PROJECT_DIR}/research/audits/.gitkeep
${CLAUDE_PROJECT_DIR}/research/reference/.gitkeep
${CLAUDE_PROJECT_DIR}/research/discovery/.gitkeep
${CLAUDE_PROJECT_DIR}/source-material/.gitkeep
```

Each `.gitkeep` is empty (zero-byte file). These exist solely to make Git track the empty directories until real content arrives.

### 3b. Pre-allow researcher's tools in the project settings

Write or merge `${CLAUDE_PROJECT_DIR}/.claude/settings.json` to pre-allow the tools researcher uses. This eliminates per-invocation permission prompts in Claude Code (the file is inert in Cowork — Cowork has its own permission model).

**Read the file first.** If it does not exist, create it with this content:

```json
{
  "permissions": {
    "allow": [
      "WebSearch",
      "WebFetch",
      "Read",
      "Write",
      "Edit",
      "Grep",
      "Glob",
      "Bash(tvly:*)",
      "Bash(npx:*)",
      "Bash(ls:*)",
      "Bash(mv:*)"
    ]
  }
}
```

**If the file already exists**, merge additively: read the existing JSON, ensure `permissions.allow` is an array, append any of the entries above that are not already present, write it back. Never overwrite a top-level key the user already set. If `permissions.allow` exists but is not an array, surface the discrepancy to the user and skip the merge — don't silently overwrite a hand-tuned config.

The pattern mirrors `/intel-setup` in the `intelligence-briefing` plugin — additive merge, never replace.

## Step 4: Generate the Research Plan

**Where this runs.** Plan generation runs **inline in your (the main agent's) context** by default. This works reliably on both Claude Code and Cowork. On Claude Code, where a fresh subagent context can sharpen analysis on long source-material reads, you MAY delegate plan generation to a `general-purpose` harness subagent with the same instructions block below. On Cowork, harness subagents do reach the web in current testing, but inline is still preferred. Unless you have a specific reason to delegate, follow the instructions below in your own context.

Read the matching type template from `${CLAUDE_PLUGIN_ROOT}/reference/templates/types/<research-type>.md` to get the type-specific finding tags, validation standards, phase structure patterns, and credibility hierarchy.

Read the type-channel map from `${CLAUDE_PLUGIN_ROOT}/reference/discovery/type-channel-maps/{research-type}.md`. You'll use this content to produce the discovery strategy alongside the research plan.

You now have, in your own context:
- The research type
- The verbal topic description the user provided in Question 2 (preserved verbatim)
- The full contents of `research/source-material-digest.md` if it exists (the structured facts extracted from every file in `source-material/` during Step 2). If no digest exists because `source-material/` was empty, note this and proceed using the verbal topic description and preliminary research only.
- The absolute paths of every file in `source-material/` — you are REQUIRED to Read each file in full before generating the plan, using the digest as a scaffold for verification, not as a substitute for the primary documents. If your plan does not visibly engage with facts specific to the source material, the plan has failed.
- The type-specific template content (finding tags, validation standards, phase structure patterns)
- The audience and evidence standard answer (calibrates phase depth and source requirements)
- The type-channel map content

Follow these instructions in your own context:

---

### Plan Generator Instructions

You are generating a research plan for a structured AI-assisted research project. Your output is the content for a `research-plan.md` file that defines the entire research arc for a project.

**Audience calibration:** The evidence standard for this project is set by the audience. Use the audience context to:
- Adjust the number of sources expected per phase (higher for external publication or investment due diligence, lower for personal knowledge building)
- Calibrate the level of triangulation required before a finding is treated as confirmed
- Set the tone of the success criteria (defensibility for investment research, accuracy for curriculum, understanding for personal research)
Do not override the evidence standard set by the audience. A personal knowledge project should not require academic-grade triangulation. An investment due diligence project should not accept single-source financial claims.

**Source Material Grounding — Non-Negotiable:**

You have (a) a verbal topic description from Question 2, (b) potentially a structured digest at `${CLAUDE_PROJECT_DIR}/research/source-material-digest.md`, and (c) the absolute paths of every file in `${CLAUDE_PROJECT_DIR}/source-material/`.

If a digest and source-material files exist, before writing any phase you MUST Read each `source-material/` file in full. Do not rely solely on the digest — the digest is a scaffold that tells you what to look for, not a replacement for the primary documents. Use the Read tool with no offset and no limit (paginate explicitly for files over 2000 lines).

Every phase you generate must demonstrate engagement with the source material. "Engagement" means: at least one phase question per phase references a specific fact, entity, date, credential, or claim that originates from a `source-material/` file — not from the verbal description alone. A plan whose phases could have been written from the verbal description alone is a failed plan.

If the verbal description and the source material disagree (e.g., the user says "I'm pursuing a PhD" but the provided resume shows a terminated Master's with no doctoral enrollment), DO NOT pick a side. Flag the discrepancy in the Assumptions section of the research plan as an open question, and phrase Phase 1 so that it can resolve the discrepancy before committing to a framing.

If `source-material/` is empty (no digest, no files), this section does not apply — proceed using the verbal topic description and preliminary research.

**Your job:** Generate a complete research plan with:

1. **A Core Question** — One paragraph framing what this research needs to answer
2. **Source Material Location** — Where to find the document/topic being researched
3. **Research Phases** — Each with:
   - A clear name
   - What the source material assumes (or what needs to be understood)
   - 4-7 specific validation/research questions
   - The output filename
4. **A Synthesis Phase** — Final phase pulling everything together
5. **Source Priority** — What kinds of sources are most valuable and what to be skeptical of
6. **Success Criteria** — When the research is done

**Phase Generation Rules:**

- **PRD Validation (8-10 phases):** Derive phases from the major assumption clusters in the PRD. Each phase tests a distinct category (technical architecture, market claims, user behavior, competitive position, cost projections, timeline feasibility). End with synthesis producing executive summary, full validation report, and recommended changes.
- **Exploratory Thesis (8-12 phases):** Start with theoretical foundations, then evidence for/against core claims, then landscape mapping, then practical questions (audience, market, feasibility). Each phase answers "what does the evidence actually say about [claim]?"
- **Competitive Analysis (6-8 phases):** Market definition → player identification → feature comparison → positioning → pricing/business models → trends → white space → synthesis with strategic recommendations.
- **Company For-Profit (8-10 phases):** Overview/history → leadership → products/technology → financials → market position → customers/traction → partnerships → culture/talent → risks → synthesis with SWOT analysis.
- **Company Non-Profit (8-10 phases):** Mission/theory of change → leadership/governance → programs → impact measurement → financials (990 analysis) → funding landscape → partnerships → organizational capacity → risks → synthesis with effectiveness assessment.
- **Person Research (6-10 phases):** Career arc → expertise validation → track record deep dive → public positions/thought leadership → reputation/peer perception → network/affiliations → financial/legal footprint (if applicable) → red flags/risk assessment → synthesis with comprehensive profile and credibility assessment. Adapt phase count to the person's public footprint — collapse phases where sources won't exist, deepen phases where material is rich.
- **Market/Industry Research (8-12 phases):** Market definition and scope → current state and maturity assessment → adoption data and growth patterns → key players and ecosystem mapping → technology/capability landscape → barriers and accelerators → segment or regional variations → emerging trends and inflection points → future direction and projections → synthesis with landscape report and strategic implications. Adapt phases to the topic — a mature market needs more segmentation analysis; an emerging technology needs more feasibility and adoption barrier analysis.
- **Presentation Research (5-8 phases):** Nugget inventory and claim mapping → audience and context research → evidence gathering and claim validation (one phase per major claim cluster) → counterpoint and objection research → through line discovery and narrative gap analysis → synthesis with presentation brief, narrative arc, evidence map, and talking points. The plan generator should examine the user's existing points and organize phases around the major claim clusters that need evidence, not around a generic research structure.
- **Curriculum Research (6-10 phases):** Domain landscape → practitioner reality → skill decomposition → common misconceptions and failure patterns → current best practice → field trajectory → competing approaches → existing program landscape → synthesis with subject matter foundation, practitioner workflow map, skill decomposition, misconception inventory, field currency assessment, and curriculum scope recommendation. Adapt phase count to the topic — collapse early phases when the designer has substantial existing knowledge, deepen misconception and practitioner reality phases in those cases. For entirely new domains, keep the full structure.
- **Opportunity Discovery (6-8 phases):** Niche definition and audience profiling → watering hole mapping and community discovery → pain point extraction and complaint analysis → current tool stack and spending patterns → existing solution audit → demand validation and willingness to pay → synthesis with ranked opportunity areas, evidence map, and recommended exploration areas. Adapt phase count to the niche — collapse community discovery and pain points if the niche has only one or two hubs; expand the solution audit if the existing landscape is crowded.
- **Customer Safari (6-8 phases):** Audience definition and watering hole mapping → multi-source observation and labeling (tag every observation as PAIN/DELIGHT/RECOMMENDATION/QUESTION/JARGON with exact quotes) → pain analysis and painkiller/vitamin classification → trend evaluation and pattern scoring (Velocity/Volume/Longevity/Relevance) → competitive intelligence and positioning gaps → strategic prioritization and tier assignment (Tier 1-4) → synthesis with strategic intelligence report, tiered findings, trend scorecards, competitive gap map, audience language glossary. Collapse observation and pain analysis if the audience is concentrated in few communities. Expand observation into multiple phases if the audience spans many platforms with different cultures.

**Output format:**

```markdown
# Research Plan: [Project Title]

## The Core Question

[One paragraph framing what this research needs to answer]

## Source Material Location

[Where to find the primary document/subject]

## Assumptions

These assumptions shape what evidence this research will find. Review them before starting Phase 1 — if any are wrong, correct them now. Changing an assumption after sources are collected means rework.

- **Date range:** [e.g., "2023–2026 data preferred" or "Historical: 2010–2020"]
- **Geographic scope:** [e.g., "US market" or "Global" or "EU regulatory context"]
- **Entity scope:** [e.g., "Apple Inc. (AAPL), not Apple Records" or "Both public and private companies"]
- **Financial lens:** [e.g., "Revenue and ARR" or "990 program expenses" — only for types where this applies]
- **Regulatory context:** [e.g., "US SEC filings" or "No regulatory focus" — only for types where this applies]
- [Any other assumption that constrains what sources the research will seek]

Remove lines that don't apply to this research type. Add assumptions specific to the topic that aren't covered above.

---

## Phase 1: [Phase Name]

**What [the PRD assumes / the thesis claims / needs to be understood]:** [Description]

**What needs [validation / exploration / analysis]:**

1. [Specific question]
2. [Specific question]
...

**Output:** `[##-phase-slug].md`

**Phase cycle:** Complete all steps before proceeding to Phase 2: Collect sources → /research-cross-ref → /research-check-gaps → /research-summarize-section → /research-audit-claims. Do not start Phase 2 until this phase's audit passes.

---

[Repeat for each phase — every phase must include the "Phase cycle" reminder with the next phase number]

---

## Phase N: Synthesis

**Goal:** [What the synthesis produces]

**Outputs:**
- `00-executive-summary.md`
- `[final-report].md`
- `[recommendations].md`

---

## Source Priority

**Highest value sources:**
- [Source type and why]

**Be skeptical of:**
- [Source type and why]

## Success Criteria

This research is done when:
1. [Criterion]
...
```

**Subject Identity Rules — Non-Negotiable:**

These rules exist because agents can confabulate a subject when the provided description is ambiguous. If you get the subject wrong, every subsequent phase, source, and output will be wrong. There is no recovery from this error downstream.

- **Use only what the user explicitly provided.** The subject of this research is exactly what the user described — no more. Do not infer, assume, or substitute a subject based on partial matches, similar names, or what "seems most likely."
- **If the topic is ambiguous, stop and ask — do not guess.** If the user says "research the Stripe plugin" but there are multiple Stripe plugins or it's unclear which one, ask for clarification before proceeding. Do not resolve the ambiguity yourself. A wrong guess wastes the entire research effort.
- **If a URL or document was provided, that is the subject.** Do not pivot to a different URL, repository, or document you find during preliminary research, even if it seems more authoritative, more recent, or "closer" to what you think the user wants.
- **Do not expand the subject scope based on preliminary research.** If the user provided a narrow topic, keep it narrow. Preliminary research is to understand the topic, not to redefine it.
- **State the subject explicitly at the top of the research plan.** Before the Core Question, write: "**Research Subject:** [exact subject as provided by the user]". This makes the grounding visible and auditable.

**Common Failure Modes — Plan Generation:**

| Failure Mode | Prevention |
|---|---|
| Misidentifying the research subject — generating a plan for a similarly-named but wrong entity | State the exact research subject at the top of the plan. If the topic is ambiguous, stop and ask. Do not resolve ambiguity by picking the most likely match. |
| Generic phases — questions that could apply to any company/topic rather than this specific one | Every question should reference something specific about the subject. "What is the market size?" is generic. "Does the claimed $4.7B TAM hold up against independent estimates?" is specific. |
| Over-scoping — generating 12 phases when the topic warrants 6 | Match phase count to available evidence. A person with minimal public footprint needs fewer phases than a Fortune 500 company. Collapse phases where sources will not exist. |
| Under-specifying source priority — vague "be skeptical of marketing" without naming specific source types | Name the specific source types that mislead for this topic. For a startup: press coverage that parrots founder claims. For a non-profit: self-reported impact metrics. |
| Silent assumptions about scope — defaulting to a date range, geography, or entity without stating it | Every assumption that constrains what evidence the research will find must be stated in the Assumptions section. Derive assumptions from the topic and user context — do not default. If the topic says "US pricing" the geographic scope is US. If it says "pricing" with no qualifier, state the assumed scope explicitly so the user can correct it. |

**Quality Standards:**
- Every question must be specific enough that a researcher knows what to search for
- Questions must be answerable with publicly available sources (flag any that require internal access)
- Phase names must be descriptive and scannable
- Output filenames follow the pattern: `##-slug.md`
- Synthesis phase always produces at minimum an executive summary and a full report
- Be specific in "be skeptical of" — name source types that tend to mislead for this topic

You have access to `tvly search` and `WebFetch` — use `tvly search` as your primary research tool (not WebSearch, which is the degraded fallback). Do preliminary research so the phases and questions are grounded, not generic. Derive the appropriate date range from the topic and research questions — do not assume a default. A historical analysis needs historical dates, a current-state analysis needs recent data, a projection needs future-looking ranges. **Preliminary research is for context only — it does not change the subject you were given.**

Write the final research plan to `${CLAUDE_PROJECT_DIR}/research/research-plan.md`.

**Discovery Strategy Generation:**

After generating the research plan, also produce `${CLAUDE_PROJECT_DIR}/research/discovery/strategy.md`. Use the type-channel map content provided to you.

For each phase in the research plan you just generated:
- Find the matching Discovery Group in the type-channel map by keyword-matching the phase name to Discovery Group names (e.g., a phase named "Financial Analysis" matches a "Financial" or "Financials" Discovery Group)
- If a match is found: record the phase name, its primary channels, and its secondary channels from the type-channel map
- If no match is found: record the phase as "no discovery — uses existing sources"

Write `${CLAUDE_PROJECT_DIR}/research/discovery/strategy.md` with this format:

```markdown
# Discovery Strategy: [Research Type]

This file maps each research phase to its highest-value discovery channels.
Generated by /research-init — read automatically by /research-discover.

---

## Phase 1: [Phase Name]
**Primary channels:** [channel1], [channel2]
**Secondary channels:** [channel3], [channel4]

## Phase 2: [Phase Name]
**Primary channels:** [channel1]
**Secondary channels:** [channel2], [channel3]

[...repeat for each phase with a Discovery Group match...]

## Phase N: [Phase Name]
no discovery — uses existing sources

[...etc for phases without a matching Discovery Group...]
```

---

Once `${CLAUDE_PROJECT_DIR}/research/research-plan.md` and `${CLAUDE_PROJECT_DIR}/research/discovery/strategy.md` are written, proceed to Step 5.

## Step 5: Assemble and Write Files

### CLAUDE.md

Assemble a slim CLAUDE.md by combining:

0. **Research Type Field** — A single line at the very top of the file: `research-type: {type}` where `{type}` is the kebab-case research type value from the user's Question 1 answer (e.g., `company-for-profit`, `market-industry`, `company-non-profit`, `prd-validation`, `competitive-analysis`, `person-research`, `exploratory-thesis`, `curriculum-research`, `presentation-research`, `opportunity-discovery`, `customer-safari`). This field is machine-readable — the discover skill's pre-check reads it to select the correct type-channel map.

1. **Project Purpose** — Generated from the research type and topic. One paragraph describing what this research project does and why.

2. **Audience & Evidence Standard:**

This research is for: [user's answer from Question 3]

Evidence calibration — include the appropriate guidance based on the audience type:
- **Internal decision-making:** Focus on directional accuracy and actionable findings. Single-source findings are acceptable when flagged. Speed matters — do not over-triangulate when the decision timeline is tight.
- **External publication:** Every claim must be fully sourced and triangulated. No single-source findings presented as established. All contradictions must be presented. Qualifiers are mandatory. This is the highest evidence bar.
- **Investment / due diligence:** Emphasis on verifiable numbers, risk identification, and red flags. Single-source financial claims are unacceptable. Cross-reference all quantitative claims. Skepticism toward self-reported metrics.
- **Pitch deck / fundraising support:** Evidence must be defensible under skeptical questioning. Focus on claims that will be challenged by investors. Flag any finding that relies on the company's own reporting.
- **Curriculum design:** Prioritize accuracy of mental models over precision of specific numbers. Focus on practitioner reality over theory. Flag areas where the field is actively debating — the curriculum must not present contested claims as settled.
- **Personal knowledge building:** Balanced depth — thorough but not exhaustive. Flag uncertainty but do not over-hedge. Optimize for understanding, not defensibility.

When the audience is not one of the above, calibrate based on: Who will read this? What decisions will they make from it? What happens if a claim turns out to be wrong?

Add this line after the calibration guidance: "This standard is compiled into `research/reference/evidence-standard.md` and enforced at the promotion gate — a claim that violates an enforceable rule fails `/research-audit-claims` unless you grant a named waiver, and the waiver rationale appears verbatim in the output's Methodology & Limitations section."

2a. **Working Posture** — a POINTER only. Copy no doctrine text into CLAUDE.md; the plugin ships the doctrine and CLAUDE.md points at it, so the two can never drift. The section reads exactly:

```markdown
## Working Posture

Conversational posture and response register are governed by the plugin's posture doctrine — read `${CLAUDE_PLUGIN_ROOT}/reference/posture-register.md` at session start and hold it for every turn. It governs the conversation the way the audit gate governs the outputs: the evidence machinery can hold perfectly while the conversation quietly fails.
```

3. **Directory Structure:**

```
research/
├── research-plan.md          # Master research prompt (the assignment)
├── STATE.md                  # Persistent research state
├── sources/
│   └── registry.md           # Index of all processed sources
├── notes/                    # Structured notes per source
├── drafts/                   # Unaudited synthesis (written by /research-summarize-section)
├── outputs/                  # Audited, final sections (promoted by /research-audit-claims only)
├── audits/                   # Claim audit reports
├── reference/                # Protocol and standards reference files
│   ├── canonical-figures.json # Single source of truth for cross-phase numbers
│   ├── claim-graph.json       # Claim graph registry, written by /research-audit-claims
│   ├── evidence-standard.md   # Commissioned evidence rules — enforced at the audit gate
│   ├── backstage-tasks.md     # Agent's private prep queue (read at phase start)
│   └── retrieval-log.json     # Retrieval log registry, written by /research-discover
├── discovery/               # Discovery strategy and candidate sources
├── cross-reference.md        # Cross-source patterns
└── gaps.md                   # Coverage tracker
```

Do not create files outside this structure for research artifacts. Working files go in `research/`. Synthesized sections go to `research/drafts/` first. Only `/research-audit-claims` promotes a draft to `research/outputs/`. Nothing in `outputs/` should exist without a corresponding audit report in `audits/`.

**Project boundary rule:** All file writes during a research session must stay within the current research project directory. Do not write to other projects, system directories, or external paths — even when responding to a user request that could be handled by a skill designed for a different context (e.g., a note-capture skill pointed at another project). If the user wants to capture a note or action item, write it to `research/notes-to-self.md` within this project. Never invoke a skill that writes outside the current project directory.

4. **Skills:**

| Skill | Trigger | Job |
|-------|---------|-----|
| Init | `/research-init` | Scaffolds a new research project: directory structure, CLAUDE.md, STATE.md, reference files, research plan |
| Process Source | `/research-process-source <url-or-file>` | Processes raw source into structured note |
| Cross-Reference | `/research-cross-ref` | Finds patterns across all processed notes |
| Gap Tracker | `/research-check-gaps` | Maps research coverage, identifies holes |
| Claim Auditor | `/research-audit-claims <filepath>` | Fact-checks a draft against source notes |
| Summarize Section | `/research-summarize-section <name>` | Synthesizes notes into polished draft sections |
| Start Phase | `/research-start-phase` | Shows what's needed to begin the next phase |
| Phase Insight | `/research-phase-insight` | Analyzes current phase progress and thin areas |
| Graph Analysis | `/research-graph-analysis` | Analyzes the claim graph for load-bearing claims, fragile foundations, and cheapest confidence upgrades |
| Progress | `/research-progress` | Shows project dashboard with phase status |
| Discover Sources | `/research-discover` | Finds candidate sources for the current phase using type-aware multi-channel discovery |

**Integrity agent:** `research-integrity` — runs automatically after writing any source note, draft, or synthesis. Watches for fabricated data, range narrowing, qualifier stripping, cross-phase drift, unsourced claims.

5. **Workflow:**

**Research is phase-sequential.** You work one phase at a time, in order. Each phase completes its full cycle before the next phase begins. Do not collect sources for Phase 3 while working on Phase 1. Do not batch source collection across multiple phases. Do not invent phase groupings or reorder phases.

The cycle for each phase:

1. **Collect** — Start by running `/research-discover` to find candidate sources for the current phase, then use `/research-process-source` for each URL, PDF, or document relevant to the *current phase only*.
2. **Connect** — Run `/research-cross-ref` after every 5-8 new sources to find patterns. This is mandatory, not optional.
3. **Assess** — Run `/research-check-gaps` to confirm coverage for this phase. Fill gaps with more sources if needed.
4. **Synthesize** — Use `/research-summarize-section` to produce a draft in `research/drafts/`. This is NOT a final output.
5. **Verify** — Run `/research-audit-claims` on the draft. This is what promotes it from `drafts/` to `outputs/`. No exceptions.
6. **Transition** — Update STATE.md, mark the phase complete, recommend context clear, and only then begin the next phase.

`research/discovery/strategy.md` maps each phase to its highest-value discovery channels. The discover skill reads this file automatically.

Read the research plan in `research/research-plan.md` before starting. It defines the phases and their order.

**Enforcement rules — these are structural, not guidelines:**

- **Phases are sequential.** Complete Phase N's full cycle (collect → connect → assess → synthesize → verify) before starting Phase N+1. Do not collect sources for future phases. Do not batch work across phases. Do not group or reorder phases. The research plan defines the order — follow it.
- **Nothing reaches `research/outputs/` without passing `/research-audit-claims`.** `/research-summarize-section` writes to `research/drafts/`. `/research-audit-claims` checks the draft against source notes and, if it passes, moves it to `research/outputs/`. If it fails, the draft stays in `drafts/` with an audit report listing what needs fixing.
- **`/research-cross-ref` is mandatory after every 5-8 new sources.** Before processing a 9th source without a cross-reference, stop and run `/research-cross-ref` first. `research/cross-reference.md` must reflect current patterns at all times.
- **`/research-check-gaps` is mandatory before starting a new phase.** Do not begin Phase N+1 until `/research-check-gaps` has confirmed coverage status for Phase N. If gaps remain, fill them or document them explicitly in `research/gaps.md` with a reason they're acceptable.
- **Phase completion requires all five steps.** A phase is not complete until: sources collected for this phase, cross-reference is current, gaps are assessed, draft is written, and audit has passed. STATE.md should not mark a phase complete until all five are done.
- **Canonical figures registry is the source of truth for cross-phase numbers.** When citing a number from a previous phase, check `research/reference/canonical-figures.json` first. If registered, use the canonical value. If not registered and this is a cross-phase citation, register it before using it. Never copy numbers from STATE.md summaries or conversation memory.
- **Never skip, fold, reorder, or merge phases without explicit user approval.** If `/research-check-gaps` reveals a phase has insufficient source coverage, tell the user and present options: (1) collect more sources to fill the gaps, (2) skip the phase with the user's explicit approval, or (3) fold the phase's questions into another phase with the user's explicit approval. Do not make this decision yourself. Do not record a phase-skip in STATE.md without the user confirming it on screen first.
- **Running `/research-discover` at the start of each phase is recommended but not mandatory.** It surfaces the highest-value sources for the current phase's questions via multi-channel discovery. Sources can still be found manually and processed with `/research-process-source`.

**Clear context between phases.** Each phase should start with a fresh context window. STATE.md and your research files carry everything forward — nothing critical lives in conversation history. A fresh context for each phase produces sharper analysis than a saturated one. Before clearing, ensure STATE.md is fully up to date with current position, completed work, and next action. After clearing, read STATE.md first before resuming work.

**Intra-phase clears are allowed at step boundaries when context is heavy.** The 5 steps within a phase (Collect → Connect → Assess → Synthesize → Verify) do not need to share conversation context — each step reads its own files and writes its own artifacts. When a single step consumes significant context (especially Collect with primary regulatory documents, large PDFs, or structured data files, or Synthesize with long source notes), you may clear context between that step and the next. The phase cycle continues from the same position after the clear.

**When to recommend an intra-phase clear:**

- **After Collect**, if the Collect batch processed 5+ sources AND any of the following apply: primary regulatory documents (990 XMLs, SEC filings, court records), large PDFs (>15 pages), structured data files (XML/CSV/JSON >50KB), or the context window estimate is above ~50% used.
- **After Synthesize**, if the draft is long (>3000 words) or the source notes being synthesized are unusually rich (>5 long-form notes), AND Verify is the next step.
- **Never mid-step.** Finish the current step (write all source notes, update STATE.md, complete pending file writes), then suggest the clear.
- **Never if the phase cycle has only one step remaining.** If you're finishing Verify, the next clear is the phase-level clear — don't double-clear.

**How to recommend an intra-phase clear:**

At the end of a step where the criteria above apply, run the session debrief first: (1) append a Working Read entry to `research/commonplace.md` (commonplace trigger 5 — in-flight hypotheses and half-formed reads, so the next session re-adopts the thinking, not just the position), (2) update STATE.md with a step-specific "Next Action" (see State Management section). Then render the transition prompt (format defined in `${CLAUDE_PLUGIN_ROOT}/reference/prompt-templates-guide.md`, Example 4) pointing at `/clear` followed by the next step's command. The user decides whether to accept — if they decline, continue to the next step in the same context window.

**How to resume after an intra-phase clear:**

On the next session, read STATE.md first. The "Cycle step" field tells you which step is active. The "Next Action" field is a specific command — execute it. Do not re-read prior step artifacts unless the current step's skill instructs you to.

**At the end of every phase, render the transition prompt** (format defined in `${CLAUDE_PLUGIN_ROOT}/reference/prompt-templates-runtime.md`):

───────────────────────────────────────────────────────────

**▶ NEXT:** `/clear` then `/research-start-phase` — Start Phase [N+1] with a fresh context window.

**Also available:**
- `/research-progress` — See the overall project dashboard.
- `/research-check-gaps` — Confirm coverage for Phase [N] before moving on.

**What to expect:** Phase [N] is complete — STATE.md is updated and any capture-worthy observations have been appended to commonplace.md. A fresh context window gives sharper analysis for Phase [N+1]; start-phase will brief you on what the new phase needs.

───────────────────────────────────────────────────────────

If no entries were added to commonplace.md during the phase, replace the middle clause of "What to expect" with "No commonplace observations were captured this phase" — do not invent entries just to have something to mention.

6. **[Type] Standards** — Include from the matching type template:
   - The "What to Validate/Explore/Analyze" section
   - The "Finding Tags" section

7. **State Management:**

Research state lives in `research/STATE.md`. It is the source of truth for project position — not memory, not conversation history, not file timestamps.

On every new session or after context clear: Read `research/STATE.md` first. Don't start working until you know where you are. The "Current Phase Cycle" section tells you exactly which step you're on — pick up there. **If STATE.md records any skipped, folded, or deferred phases, report this to the user before resuming work.** The user may not have been present when that decision was made — surface it explicitly so they can confirm or reverse it.

During work: Update state at every transition — phase start/end, meaningful task completion, user decisions. Check off cycle steps as they complete. Write state BEFORE doing anything expensive in case of compaction. A PreCompact hook will warn you if STATE.md is stale, but don't rely on it — update proactively.

The "Active phase" field in STATE.md tells you which phase to work on. Do not work on any other phase. When the current phase's cycle checklist is fully checked, mark it complete, generate the next phase's cycle checklist, and update "Active phase."

**Step-level updates for intra-phase clear support.** At the end of every step (Collect, Connect, Assess, Synthesize, Verify), update STATE.md's "Next Action" field with a specific command that points at the *next* step, not a phase-level description. Example: after finishing Collect for Phase 4, the Next Action should read "Run /research-cross-ref for Phase 4 — 6 sources are in research/notes/ ready for cross-referencing. Sources since last cross-reference: 6." This specificity is what makes an intra-phase clear safe — a session resume after the clear reads this field and knows exactly what command to run. Writing a phase-level Next Action ("Continue Phase 4") breaks intra-phase resume.

8. **Context Management:**

This is a long-running project. Clear context between research phases — each phase gets a fresh window for sharper analysis. STATE.md is the source of truth that carries everything forward. Before clearing context, always update STATE.md with current position, completed work, key decisions, and next action — and if the clear lands mid-phase, append a Working Read entry to commonplace.md (trigger 5) so the in-flight reasoning survives, not just the position. After clearing or starting a new session: read `research/STATE.md` first. If unsure what's been done, run `/research-check-gaps` before starting new work.

9. **Commonplace Book:**

Research Agent maintains `research/commonplace.md` as a running record of observations worth preserving across context clears. This is NOT a research output, NOT a source note, NOT a draft, and NOT part of any audit or gate. Nothing reads it except the user. It exists so the user can come back later and find observations the agent made in the moment.

**Append to `research/commonplace.md` at the end of any turn in which your response contained any of the following:**

1. **A strategic implication derived from the research but not part of the research output.** Example: after processing 990 filings, you observe that the actual financial picture is materially worse than the board has been working with, and that may be a disclosure issue the Treasurer should know about. The financial facts go in source notes. The strategic implication for the user-as-board-member goes in the commonplace book.

2. **A cross-cutting observation** that connects current evidence to something outside the current phase's scope. Example: a source from Phase 3 contains information relevant to a claim in Phase 1 that was already audited. Note it so the user knows to revisit.

3. **Mid-reasoning synthesis** that you produced in chat but that does not land in a draft, output, or source note. Example: while explaining the decision between two options, you produce a paragraph of synthesis that captures *why* the decision matters — not the decision itself (which goes in STATE.md or notes-to-self.md) but the reasoning that makes it consequential.

4. **An explicit user request** — "note this," "remember this," "capture that" or anything equivalent. This is the highest-priority trigger — the user is telling you directly.

5. **A contact boundary mid-phase.** Whenever you recommend a context clear (intra-phase or end-of-phase) or the session is winding down mid-cycle, append a **Working Read** entry before the boundary: the hypotheses currently in play, what the last few sources are confirming or challenging, and any half-formed read that hasn't landed in a draft or note yet. Position data (which step, what command is next) belongs in STATE.md's Next Action, not here — this entry preserves the *thinking* that would otherwise evaporate with the context. Use the standard entry format with the hook "Working Read at [step] boundary."

**Do NOT append for:**
- Routine status updates ("processed source 12, added to notes")
- Re-statements of what's already in a source note, draft, or output
- Decision options you're presenting to the user — those are conversation artifacts
- Generic conversational acknowledgments

**When in doubt, append.** The file is cheap to maintain and scannable. Missing an observation the user wanted to keep is a worse failure than capturing one too many.

**Entry format:**

```markdown
## [YYYY-MM-DD] — Phase [N] — [one-line hook]

[The agent's observation in its own voice. Preserve the reasoning, not just the conclusion. Include enough context that this entry makes sense when read weeks later without the surrounding conversation.]
```

**Append timing:** Append at the end of the turn, before relinquishing control. If you produced a capture-worthy observation and the user's next message might be `/clear` or a context reset, appending before you end the turn is the last opportunity. Do not wait for the user to ask.

**Do not ask permission.** Appending is a background behavior, like updating STATE.md. Asking "should I save this?" relies on the user recognizing in the moment which observations matter — which is the exact failure mode this file is designed to prevent.

10. **Boundaries** — From the type-specific template.

11. **Reference Protocols:**

Detailed protocols are in `research/reference/`. Read the relevant file when you need the full protocol:

| Protocol | File | Read When |
|----------|------|-----------|
| Source & Evidence Standards | `research/reference/source-standards.md` | Processing sources, citing evidence, assessing credibility |
| Writing & File Standards | `research/reference/writing-standards.md` | Writing output sections, naming files |
| Tools Guide | `research/reference/tools-guide.md` | Using tvly, firecrawl-cli, and WebSearch/WebFetch for research discovery and extraction |

Write the assembled CLAUDE.md to `${CLAUDE_PROJECT_DIR}/CLAUDE.md`.

### Reference Files

Read each source and Write to the destination — do not use Bash `cp`, which can trigger permission prompts and obscures the operation in the transcript.

1. Read `${CLAUDE_PLUGIN_ROOT}/reference/writing-standards.md` → Write to `${CLAUDE_PROJECT_DIR}/research/reference/writing-standards.md`
2. Read `${CLAUDE_PLUGIN_ROOT}/reference/tools-guide.md` → Write to `${CLAUDE_PROJECT_DIR}/research/reference/tools-guide.md`

### source-standards.md

Read `${CLAUDE_PLUGIN_ROOT}/reference/templates/source-standards.md` as a template. Replace the `[INSERT THE SOURCE CREDIBILITY HIERARCHY FROM THE MATCHING TYPE TEMPLATE]` placeholder with the Source Credibility Hierarchy from the matching type template. Write the result to `${CLAUDE_PROJECT_DIR}/research/reference/source-standards.md`.

### STATE.md

Use this template, customized with data from the generated research plan:

```markdown
# Research State

**Phases are sequential. Complete the current phase's full cycle before starting the next. Do not batch work across phases.**

## Current Position
- Active phase: 1 — [Phase 1 Name]
- Cycle step: Collect (1 of 5)
- Blocking on: Nothing — ready to start.

## Current Phase Cycle

Each phase must complete all five steps in order. Check off each step as it is completed. Do not skip steps. Do not mark a phase complete until all five are checked.

### Phase 1: [Name]
- [ ] **Collect** — Sources gathered for this phase's questions (start with /research-discover)
- [ ] **Connect** — `/research-cross-ref` run, cross-reference.md current
- [ ] **Assess** — `/research-check-gaps` run, coverage confirmed for this phase
- [ ] **Synthesize** — `/research-summarize-section` run, draft in `drafts/`, integrity checked
- [ ] **Verify** — `/research-audit-claims` passed, output promoted to `outputs/`

When all five are checked, mark this phase complete below, update "Active phase" to the next phase, and generate a new cycle checklist for that phase.

## Completed Phases
[Generate a checklist from the research plan phases, e.g.:]
- [ ] Phase 1: [Name]
- [ ] Phase 2: [Name]
...
- [ ] Phase N: Synthesis

## Key Decisions
- Project initialized [TODAY'S DATE]
- Research type: [TYPE]
- Research plan structured around [N] phases
- Finding tags: [TAGS FROM TYPE TEMPLATE]
- Canonical figures registry active at `research/reference/canonical-figures.json`

## Sources Processed
- Total count: 0
- Sources for current phase: 0
- Sources since last cross-reference: 0
- Last cross-reference: N/A
- Last gap check: N/A

**Cross-ref is due when "Sources since last cross-reference" reaches 5.** Do not process a 6th source without running `/research-cross-ref` first. `/research-cross-ref` resets this counter to 0.

## Next Action
Begin Phase 1: Collect sources relevant to Phase 1 questions only.

<!--
The Next Action field is updated at every step boundary so that a session resume (including after an intra-phase clear) can pick up with a single, specific command. Example formats:

- "Run /research-discover for Phase 4 — no sources collected yet."
- "Run /research-cross-ref for Phase 4 — 6 sources are in research/notes/ ready for cross-referencing. Sources since last cross-reference: 6."
- "Run /research-check-gaps for Phase 4 — cross-reference.md is current. Gap check is mandatory before Synthesize."
- "Run /research-summarize-section for Phase 4 — gaps assessed, draft is next."
- "Run /research-audit-claims research/drafts/04-phase-name.md for Phase 4 — draft written and integrity-checked."

This field should always read like a command the user can execute, not a phase-level description ("Continue Phase 4" is too vague — a session resume can't act on that).
-->
```

Write to `${CLAUDE_PROJECT_DIR}/research/STATE.md`.

### Other Files

- Read `${CLAUDE_PLUGIN_ROOT}/reference/templates/registry.md` → Write to `${CLAUDE_PROJECT_DIR}/research/sources/registry.md`

- Write `${CLAUDE_PROJECT_DIR}/research/gaps.md` — use phase names from the generated research plan:

```markdown
# Research Coverage Gaps

Tracks what's been covered and what's still missing across all research phases.

[Generate a section for each phase, e.g.:]

## Phase 1: [Name]
- Coverage: Not started
- Gaps: All questions open

## Phase 2: [Name]
- Coverage: Not started
- Gaps: All questions open

[...etc for all phases]
```

- Write `${CLAUDE_PROJECT_DIR}/research/audits/gate-log.md`:

```markdown
# Gate Log

Promotion authorization log for writes to research/outputs/. The PreToolUse hook in the researcher plugin (Claude Code only) reads the most recent row of this table to authorize a Write/Edit/MultiEdit targeting research/outputs/. /research-audit-claims appends a `pass` row immediately before promoting a draft.

| Timestamp | Action | Result | File | Detail |
|-----------|--------|--------|------|--------|
```

- Write `${CLAUDE_PROJECT_DIR}/research/outputs/.gate-policy.md` with the following content (this file documents the gate for humans reading the directory; the hook itself reads gate-log.md):

```markdown
# Output Directory Gate Policy

Files in `research/outputs/` are promoted from `research/drafts/` by `/research-audit-claims` only. Direct Write/Edit/MultiEdit operations targeting this directory are blocked by a PreToolUse hook (Claude Code) until an authorizing row appears in `research/audits/gate-log.md` (within the last 120 seconds, result: pass, matching file path).

The hook is inert in Cowork — Cowork has no PreToolUse hooks. In Cowork the gate is structural-only: `/research-audit-claims` is the only skill that writes here. Don't bypass it.

The hook does not gate Bash operations (`mv`, `cp`, `rm`). `/research-audit-claims` typically uses `mv` for the promotion itself; the gate-log row is the durable audit-trail record of the authorization decision regardless of which tool performed the move.

If you find yourself wanting to bypass the gate, you almost certainly want to re-run `/research-audit-claims` on the relevant draft instead. The gate exists to keep unaudited content out of the published outputs.
```

- Read `${CLAUDE_PLUGIN_ROOT}/reference/templates/cross-reference.md` → Write to `${CLAUDE_PROJECT_DIR}/research/cross-reference.md`

- Read `${CLAUDE_PLUGIN_ROOT}/reference/templates/canonical-figures.json` → Write to `${CLAUDE_PROJECT_DIR}/research/reference/canonical-figures.json`

- Write `${CLAUDE_PROJECT_DIR}/research/reference/evidence-standard.md` — the compiled, enforceable form of the Question 3 answer. `/research-audit-claims` reads this file at every promotion gate. Derive 2–5 concrete, testable rules from the audience calibration — each rule must be checkable against a draft and its source notes (a rule that can't fail a specific claim is not a rule). Structure:

```markdown
# Evidence Standard

Compiled by /research-init from the audience answer. Read by /research-audit-claims at every promotion gate — a claim that violates an enforceable rule fails the audit unless the commissioner grants a named waiver.

**Audience:** [user's Question 3 answer, verbatim]
**Calibration:** [the matched audience category, or "custom"]

## Enforceable rules

- [Concrete, testable rules derived from the calibration. Examples by audience: investment/due diligence — "Every quantitative financial claim requires 2+ independent sources; single-source financial claims are unacceptable." external publication — "No single-source finding may be presented as established; source qualifiers are mandatory in the draft." internal decision-making — "Single-source findings are acceptable only when flagged with 'single source suggests' language." Write the rules that fit THIS project's audience — do not copy all the examples.]

## Waiver protocol

The commissioner may waive a specific violation with `waive: <claim> — <rationale>`. The waiver is recorded when it is granted — audit report, gate log, and verbatim in the output's Methodology & Limitations section — and the draft promotes on the next audit run. Waivers are per-claim, never blanket. Only audience-standard violations are waivable; evidence-accuracy findings (unsupported claims, misrepresented sources, figures that don't match their notes) have no waiver exit.
```

- Write `${CLAUDE_PROJECT_DIR}/research/reference/backstage-tasks.md` — the agent's private prep queue, distinct from the user-facing Next Action and from `notes-to-self.md` (user capture). Initial content:

```markdown
# Backstage Tasks

The agent's own prep queue — items the agent flagged for its own future attention ("the 18% figure looked shaky — re-verify against the original when Phase 4 touches financials"). Written at phase close by /research-audit-claims and whenever the agent spots something worth its own follow-up. Read and worked through silently by /research-start-phase at the next phase start; completed items are checked off with a one-line outcome.

Not a user-facing to-do list, not part of any gate. If an item needs the user's attention, it belongs in the debrief or notes-to-self.md instead.

---
```

- Write `${CLAUDE_PROJECT_DIR}/research/reference/claim-graph.json` with initial content `{"claims": []}` — this is the claim graph registry, populated by `/research-audit-claims` during each phase's Verify step.

- Write `${CLAUDE_PROJECT_DIR}/research/reference/retrieval-log.json` with initial content `{"entries": []}` — this is the retrieval log registry, populated by `/research-discover` after each discovery run.

- Write `${CLAUDE_PROJECT_DIR}/research/commonplace.md` with the following initial content:

```markdown
# Commonplace Book

A running record of observations this agent made while working on the project that are worth preserving across context clears.

This file is NOT:
- A research output (those go in `research/outputs/`)
- A source note (those go in `research/notes/`)
- A draft (those go in `research/drafts/`)
- Part of any audit or gate (this file is never read by synthesis or audit skills)

This file IS:
- Strategic implications the agent derived from the research that aren't part of the research output itself
- Cross-cutting observations that connect current evidence to something outside the current phase's scope
- Mid-reasoning synthesis produced in chat but not committed to a draft or output
- Anything the user explicitly asked to remember or note

Entries are appended automatically by the agent when it produces an observation worth preserving. Each entry is dated and tagged with the phase it was produced during. The agent should append before ending a turn in which capture-worthy content was produced — including before recommending a context clear.

The file is private to the user. It does not affect research outputs, audits, or synthesis. It exists so the user can come back later and find what was observed in the moment.

---
```

## Step 6: Verify

Before reporting to the user, verify the scaffolding is complete:

1. **Run `ls ${CLAUDE_PROJECT_DIR}/research/`** — confirm all expected files and directories exist:
   - `research-plan.md`
   - `STATE.md`
   - `gaps.md`
   - `cross-reference.md`
   - `commonplace.md`
   - `sources/registry.md`
   - `drafts/` (directory exists)
   - `outputs/` (directory exists)
   - `outputs/.gate-policy.md`
   - `audits/gate-log.md`
   - `reference/source-standards.md`
   - `reference/writing-standards.md`
   - `reference/tools-guide.md`
   - `reference/canonical-figures.json`
   - `reference/claim-graph.json`
   - `reference/evidence-standard.md`
   - `reference/backstage-tasks.md`
   - `reference/retrieval-log.json`
   - `discovery/strategy.md`
   - `source-material-digest.md` (only required if `source-material/` contains non-dotfiles; skip otherwise)
2. **Read `${CLAUDE_PROJECT_DIR}/CLAUDE.md`** — confirm it references the eleven skills with `/research-*` qualified names and the correct finding tags for the selected research type.
3. **Read `${CLAUDE_PROJECT_DIR}/research/STATE.md`** — confirm the phase checklist matches the research plan and the Phase 1 cycle checklist is present with all five steps unchecked.
4. **Verify source material is reflected in the plan.** If `${CLAUDE_PROJECT_DIR}/research/source-material-digest.md` exists, invoke the research-integrity agent with both `${CLAUDE_PROJECT_DIR}/research/research-plan.md` and the digest and ask it to run the "Source Material Coverage" check (check 8 in the agent's documentation). If the agent reports any UNPROCESSED SOURCE MATERIAL FACT or PLAN-DIGEST CONTRADICTION findings, stop, present them to the user, and ask whether to (a) regenerate the plan with the missing facts included, (b) add the facts to the digest's Out of Scope section with a reason and re-run the check, or (c) accept the plan as-is and document the decision in `${CLAUDE_PROJECT_DIR}/research/notes-to-self.md`. Do not proceed to Step 7 until the user chooses. If no digest exists, skip this sub-step.
If anything is missing, create it before proceeding. If the CLAUDE.md references incorrect skill names or has mismatched finding tags, fix it.

## Step 7: Report

Tell the user what was created. Include:
- The research type selected
- The finding tags for this project type
- **The phase table.** Render every phase from the research plan as a markdown table with these three columns: `#`, `Phase`, `Expected Outcome`. One row per phase — do not collapse, summarize as an arrow chain, or report only the count. Pull each phase's expected outcome from the synthesis line / output description in `research/research-plan.md` and condense it to one sentence that names what the phase will produce or settle. The synthesis phase is a row like every other phase. This table is mandatory — if you find yourself writing "Phases: N — A → B → C" instead of a table, stop and render the table.
- The eleven research skills available: `/research-init`, `/research-discover`, `/research-process-source`, `/research-cross-ref`, `/research-check-gaps`, `/research-summarize-section`, `/research-audit-claims`, `/research-start-phase`, `/research-phase-insight`, `/research-progress`, `/research-graph-analysis`
───────────────────────────────────────────────────────────

**▶ NEXT:** `/research-discover` — Find candidate sources for Phase 1's questions using the type-channel map.

**Also available:**
- `/research-start-phase` — Get the full Phase 1 briefing before starting discovery.
- `/research-process-source <url-or-file>` — Process a specific source you already have.

**What to expect:** Discovery will surface a prioritized candidate list for Phase 1's channels based on the research type and questions just generated. After you approve, processing runs sequentially with a cross-reference checkpoint every 5-8 sources.

───────────────────────────────────────────────────────────

Do NOT tell the user to `cd` anywhere — they are already in the correct directory. Do NOT initialize a git repo.

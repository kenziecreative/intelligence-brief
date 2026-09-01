---
name: environmental-scan
description: This skill should be used when collection needs to run for an intelligence-briefing deployment — the rotation-driven scan that gathers observations, checks signposts, updates threads, and re-decides drivers. Produces state on disk, not a document. Runs on its own before the brief, or standalone on a schedule. Reads the deployment's CLAUDE.md for relevance context, zones, coverage matrix, and paths.
allowed-tools: Read, Write, Edit, WebSearch, WebFetch
---

# Environmental Scan

You are the collection half of an intelligence system. **This skill produces no document. Nobody reads its output. Its output is state** — observations, threads, signposts, drivers, and coverage records written to disk, which the environmental-briefing skill later reads and reports from.

You are a **coverage agent at collection and a triage agent at presentation**. Presentation is the brief's job, not yours. Yours is the coverage obligation: the rotation exists so that, over an interval, every applicable crossing of zone and territory actually gets looked at — and so the brief can disclose exactly what was looked at and what was not. Coverage cannot be established inside one run; it is earned across the rotation and recorded honestly, cell by cell.

This document is your operating instruction. Follow it exactly. Where it states a rule, the rule is not optional.

---

## CONFIGURATION (read from CLAUDE.md)

Read `CLAUDE.md` in the project root before doing anything. The only value with no defensible default is the **relevance context** — whose attention this deployment serves, what makes an item matter, what to ignore. If it is missing or still a placeholder, do not scan — emit the structured halt in step 0 and stop.

Everything else takes a default if absent:

- **Zones** — the fixed five-lens set (see ZONES). Per-zone in/out examples come from CLAUDE.md, derived from the relevance context at setup.
- **Cadence** — interval and timezone. Default: daily, user's timezone.
- **Grace window** — overlap added before a collection window's start to recover items missed by indexing lag or a skipped run. Default: 6 hours. The overlap is harmless because step 6 dedupes on the source URL before capturing.
- **Paths** — briefs directory, ledger file, and the intelligence state directory. Defaults: `./briefs/`, `./ledger.json`, `./intel/`.

---

## TOOLING DISCIPLINE (fixed)

- Use the built-in `WebSearch` tool for scanning and `WebFetch` to open a source when you need to confirm a date, a figure, or a qualifier. These are the baseline and are sufficient — never require a specific search MCP or CLI. If a web-search MCP happens to be present and already permitted you may use it, but never depend on one.
- Run every search **inline, in this session**. Never delegate scanning to a spawned subagent — subagents start from a stripped permission set and cannot reach the web.
- Do every file operation with `Read`, `Write`, and `Edit` only. **Never run shell commands** (`ls`, `cat`, `mkdir`, `pwd`, etc.) to inspect or create files — a shell call triggers a permission gate this scan has no reason to incur. To check whether a file exists, `Read` it and handle the missing-file result. To create a directory, write a file into its path.
- Create any missing state file with `Write`, containing its empty form (given per file below).

---

## STATE FILES

All state lives in the deployment directory, never in the plugin. Layout:

```
<deployment>/
  CLAUDE.md                       config
  briefs/                         written by the briefing skill, never by the scan
  intel/
    coverage.json                 the matrix: zones × domain cells
    drivers.json                  the forces, with confidence history
    signposts.json                tripwires with due dates
    threads.json                  story-level identity
    runs.json                     run records (append-only)
    feedback.json                 misses, noise, corrections (append-only; written by the review skill)
    observations/
      YYYY-MM.json                observations, sharded by month
  ledger.json                     shared /contract queue (written by the briefing skill)
```

**Observations never prune.** They are the archive, and they are the whole reason month six is richer than month one. Sharding by month keeps `Read` cheap: a run reads the current month's shard plus whatever specific shards a driver's `supporting_observations` point into.

### `intel/observations/YYYY-MM.json` — the memory

Empty form: `{ "month": "YYYY-MM", "observations": [] }`

```json
{
  "month": "2026-06",
  "observations": [
    {
      "obs_id": "OBS-2026-06-07-001",
      "run_id": "RUN-2026-06-07-01",
      "seen_date": "2026-06-07",
      "title": "Meta Business Agent goes global on WhatsApp, Instagram, Messenger",
      "zone": "Field Movements",
      "cell_id": "smb-platforms",
      "thread_id": "THR-meta-business-agent",
      "driver_ids": ["DRV-001"],
      "type": "fact",
      "disposition": "act",
      "source": {
        "publisher": "TechCrunch",
        "url": "https://techcrunch.com/2026/06/03/...",
        "published": "2026-06-03",
        "tier": "secondary",
        "corroboration": "corroborated",
        "corroborating_sources": ["Yahoo Finance", "WhatsApp Business blog"]
      },
      "captured_evidence": {
        "claim": "Meta is making its Business Agent generally available to businesses worldwide across WhatsApp, Instagram, and Messenger.",
        "details": [
          "over one million businesses",
          "free to start",
          "billed through WhatsApp Business Premium tiers ... in the coming months",
          "access is currently gated to selected accounts plus a waitlist"
        ],
        "locator": "https://techcrunch.com/2026/06/03/...",
        "retrieved": "2026-06-07T07:04:00-05:00",
        "source_opened": true
      },
      "summary": "Meta moved its Business Agent from regional pilots to global availability...",
      "relevance": "A distribution giant placing a conversational AI advisor directly into the channels small businesses already run on...",
      "contribution": "material_advance",
      "material": true
    }
  ]
}
```

**`captured_evidence` is the load-bearing field.** It records what the source actually said, **at gather time, before any compression**. It is what lets the briefing's verification pass re-derive every written claim from evidence instead of re-reading its own draft. Four parts, all required:

- **`claim`** — the source's central assertion, in the **source's own words, with its own verb**. This field exists because of one specific failure: a source that says an agency *proposed* a restriction is easy to compress into an agency that *imposed* one, and figures-and-qualifiers checking will never catch it, because the numbers survive the misreading intact. **The predicate is the claim.** Capture it verbatim enough that the verb is unambiguous.
- **`details`** — the verbatim figures, ranges, dates, and qualifiers, exactly as stated. If a source says "1–3x among surveyed firms, preliminary," that whole string is one detail.
- **`locator`** — the URL the evidence came from, and **`retrieved`**, the timestamp you read it.
- **`source_opened`** — `true` if you opened the source with `WebFetch`, `false` if the evidence came from a search snippet only. **This must be `true`** for any observation whose provisional disposition is `act`, or that you are attaching to a driver. A snippet is a pointer, not a source; a claim important enough to move a decision or a driver is important enough to open.

> **Doctrine seam, resolved here in as many words:** the briefing's rule against copied headlines and block quotes applies to the **emitted brief**. `captured_evidence` is an internal working artifact that is **never emitted** into any brief or reader-facing output. Capturing what a source actually said is not quoting it to the reader. There is no contradiction.

`contribution`: `material_advance` (this observation moves the story forward) | `derivative` (commentary, restatement, or coverage of an event already captured). **This is the same judgment step 7 makes at the thread layer, recorded on the observation so the driver layer can honor it too.** A derivative observation is captured, attaches to its thread and its drivers, and is visible in the store — but it does not count as evidence, because it is not new evidence. It is the same evidence, said again.

`material: false` marks an observation that was captured but did not clear the bar for the brief. Capture is cheap; **the store is not the brief.**

`disposition` at capture time is provisional — the briefing skill enforces the evidence bar before anything is emitted.

### `intel/drivers.json` — the forces

Empty form: `{ "drivers": [], "proposals": [] }`

```json
{
  "drivers": [
    {
      "driver_id": "DRV-001",
      "name": "AI Advisory Commoditization at the SMB Front Door",
      "definition": "Distribution platforms are placing capable conversational AI advisors directly into the channels small businesses already operate in, while the cost of building comparable reasoning falls. Having an AI advisor is ceasing to be a differentiator.",
      "direction": "Increasing",
      "certainty": "High",
      "time_horizon": "Near-term (1-3 years)",
      "status": "active",
      "origin": "derived",
      "implication": "The defensible edge migrates to what a generic agent cannot replicate: proprietary data on these specific businesses, and integration with the programs and services they are already inside.",
      "steep_primary": null,
      "steep_secondary": [],
      "cell_ids": ["smb-platforms", "ai-advisory-tools"],
      "supporting_observations": ["OBS-2026-06-07-001", "OBS-2026-06-07-002"],
      "observation_count": 7,
      "confidence_log": [
        {
          "date": "2026-06-07",
          "direction": "Uncertain",
          "certainty": "Medium",
          "reason": "Seeded at setup from the relevance context.",
          "moved_by": []
        },
        {
          "date": "2026-07-14",
          "direction": "Increasing",
          "certainty": "High",
          "reason": "Fourth move in six weeks. Google's entry means the two largest SMB distribution channels now ship an advisory agent by default.",
          "moved_by": ["OBS-2026-07-14-002"]
        }
      ],
      "created": "2026-06-07",
      "last_reassessed": "2026-07-14"
    }
  ],
  "proposals": []
}
```

Vocabulary (deliberately borrowed from the Strategic Foresight framework so the export is lossless):

- `direction`: `Increasing` | `Decreasing` | `Uncertain` | `Cyclical`
- `certainty`: `High` | `Medium` | `Low`
- `time_horizon`: `Near-term (1-3 years)` | `Mid-term (3-7 years)` | `Long-term (7+ years)`
- `steep_primary` / `steep_secondary`: `S` | `T` | `E` | `En` | `P` — **export-domain fields.** They stay `null` / `[]` in daily state; the `/intel-export` command computes them from supporting observations' zones at export time. The daily runtime never reads or writes them.

Two fields foresight does not have, which are the whole point:

- **`confidence_log`** — append-only. Every movement, dated, with its reason and the observations that caused it. **Never rewrite history.** A driver's value is this log.
- **`implication`** — the "so what for what I'd build" clause. It is what the reader actually consumes.

`origin`: `derived` (setup inferred it from the relevance context) | `user_asserted` (the user stated it — this is what held beliefs are now) | `emergent` (the system proposed it from a thread and the user confirmed).

### Creating a driver — the one constructor

**Three surfaces create drivers** (`/intel-setup` from the relevance context; the review conversation when the user confirms a proposal or asserts a belief) **and they all use this one definition.** There is no second way to build a driver. If you are writing a driver anywhere, you are following this list:

- Every field in the schema above is present. No partial drivers.
- **`observation_count` counts `material_advance` observations only** — never derivatives. `supporting_observations` may list both, but the count is evidence, and a restatement is not evidence. A driver confirmed from a thread carrying three advances and twenty syndicated echoes has an `observation_count` of **3**, not 23.
- **The seed `confidence_log` entry's `moved_by` lists `material_advance` observation ids only**, for the same reason.
- **Never seed at `High` certainty.** Certainty is earned from evidence over time. A driver created today has, at most, the evidence of today.
- `steep_primary: null`, `steep_secondary: []` — always. Those are export-domain fields and the daily runtime never touches them.
- `status: "active"`, `created` set, `last_reassessed: null`.

> Why this is stated once and pointed at from everywhere: the material-vs-derivative rule was added to collection and to export, and the constructor in the review conversation was missed — so the one door left open let a thread of twenty echoes walk in as a twenty-three-observation driver. **A rule that lives in three places will eventually be true in two of them.** Point at this block; do not restate it.

`status`: `active` | `retired`. **Retired drivers are never deleted.** They and their confidence logs are what the reckoning reads.

`proposals` holds emergent-driver proposals awaiting the user (see step 10). Each: `{ "proposal_id": "PRO-YYYY-MM-DD-NN", "thread_id": "...", "statement": "one-sentence force, in plain language", "observation_count": N, "proposed": "YYYY-MM-DD", "status": "open" }`. `status`: `open` | `confirmed` | `dismissed`. Only the review conversation changes it.

### `intel/signposts.json` — the tripwires

Empty form: `{ "signposts": [] }`

```json
{
  "signposts": [
    {
      "signpost_id": "SIG-2026-06-07-001",
      "statement": "Publication of the finalized EU Code of Practice on marking and labeling AI-generated content, with its concrete labeling requirements.",
      "driver_id": "DRV-003",
      "origin_observation": "OBS-2026-06-07-005",
      "created": "2026-06-07",
      "due": "2026-06-30",
      "status": "open",
      "if_fired": "strengthens",
      "resolved_date": null,
      "resolved_observation": null,
      "resolution_note": null
    }
  ]
}
```

- `status`: `open` | `fired` | `expired` | `withdrawn`
- `if_fired`: `strengthens` | `weakens` — what this event would do to the driver's direction. This is the falsifier.
- `due` may be null for an open-ended watch. A null-due signpost is checked weekly rather than on a date; "last checked" is derived from `runs.json` (the `signposts` array), not stored here — and a check that `failed` does not count as a check, so the signpost stays due.

**A signpost does two jobs with one field, and this is deliberate.** For the reader it is *"here is what to watch for."* For you it is a **directed collection query** (step 3b). Same statement, both jobs.

### `intel/coverage.json` — the matrix

Empty form: `{ "domain_cells": [], "matrix": [] }`

```json
{
  "domain_cells": [
    { "cell_id": "ai-advisory-tools", "label": "AI advisory and decision-support tools for SMBs" },
    { "cell_id": "smb-platforms",     "label": "Platforms SMBs run their business on" }
  ],
  "matrix": [
    {
      "zone": "Policy Levers",
      "cell_id": "ai-advice-regulation",
      "applicable": true,
      "required_frequency_days": 3,
      "last_attempted": "2026-07-08",
      "last_successful_scan": "2026-07-08",
      "last_status": "ok",
      "next_due": "2026-07-11",
      "consecutive_failures": 0,
      "scan_count": 12,
      "observation_count": 4,
      "source_health": "ok"
    },
    {
      "zone": "Policy Levers",
      "cell_id": "model-capability",
      "applicable": false,
      "na_reason": "Model capability is not a policy object in this deployment's world; regulation of its application is, and that is its own cell."
    }
  ]
}
```

- `last_status`: `ok` (scanned, found something) | `empty` (scanned, found nothing — **this is a success, not a failure**) | `failed` (search errored, rate-limited, or timed out)
- **`last_successful_scan` is the only timestamp that means anything.** It moves **only** on `ok` or `empty` — never on `failed`. Everything that asks "is collection current?" reads this field: due-cell selection (step 3a), the standing gate (step 9), and the brief's rotation percentage. `last_attempted` records that you tried, and exists so a chronically failing cell is visible rather than silent; **no gate reads it.**
- **A failed cell stays due.** `next_due` is recomputed from `last_successful_scan`, not from the attempt — so a cell that fails is due again on the next run, and keeps being due until it actually succeeds. **A failure is a debt, not a completed obligation.** `consecutive_failures` counts the run of them; at 3 or more, set `source_health: "suspect"` — a cell that keeps failing is a cell whose channels are wrong, which is the same conclusion a miss record reaches by a different road.
- `source_health`: `ok` | `suspect`. Set to `suspect` by a miss record from the review conversation, or by three consecutive failures. A suspect cell tells you to **widen your channels** for that cell rather than repeating the search that already failed to find something.
- `applicable: false` cells were set at setup with a stated reason and are excluded from the rotation.
- **Each cell carries its own collection window** — from its `last_successful_scan` (minus the grace window) to now. It is *not* the run's window. A weekly cell that last succeeded seven days ago must search seven days of territory, even though the daily run before it completed yesterday. Deriving the window from the run rather than the cell is how six days go missing.

**The matrix is a genuine cross-product of zones × cells, not each zone scanning its own pre-written examples.** That is the forcing function: it makes the system search crossings no operator would think to look for. If each zone only ever revisits the examples the user already wrote, the fixed lens set does no work.

### `intel/runs.json` — the run records (append-only)

Empty form: `{ "runs": [] }`

```json
{
  "runs": [
    {
      "run_id": "RUN-2026-06-07-01",
      "started": "2026-06-07T07:02:00-05:00",
      "completed": "2026-06-07T07:11:00-05:00",
      "status": "complete",
      "run_window_start": "2026-06-06T07:02:00-05:00",
      "run_window_end": "2026-06-07T07:02:00-05:00",
      "planned": {
        "cells":     [{ "zone": "Policy Levers", "cell_id": "ai-advice-regulation" }],
        "signposts": ["SIG-2026-06-07-001"],
        "drivers":   ["DRV-001"]
      },
      "cells_due": 6,
      "cells_completed": 6,
      "cells_failed": [],
      "signposts": [
        { "signpost_id": "SIG-2026-06-07-001", "status": "empty" }
      ],
      "falsifiers": [
        {
          "driver_id": "DRV-001",
          "counter_hypothesis": "SMB distribution platforms are retreating from bundled AI advisors, or the advisors are failing to retain users.",
          "query": "platform withdraws AI assistant small business retention churn",
          "status": "empty",
          "result_observation_ids": [],
          "cuts": null,
          "checked": "2026-06-07T07:09:00-05:00"
        }
      ],
      "observations_added": 6,
      "drivers_reassessed": ["DRV-001"],
      "brief_written": "briefs/2026-06-07.html"
    }
  ]
}
```

- `status`, in the order you test them:
  - **`failed`** — a config halt, or every due cell failed with at least one cell due. **No brief is written.**
  - **`degraded`** — *any* mandatory collection obligation failed: a due cell, a due signpost check, or an active driver's falsifier search. List failed cells in `cells_failed`; the signpost and falsifier records carry their own.
  - **`idle`** — nothing was due: zero due cells, zero due signposts, zero active drivers. Nothing failed, because nothing was owed. **This is a real state with its own brief rendering — it is not `complete`, and it is emphatically not `failed`.** It is what a correctly staggered weekly rotation looks like on a day it has no cell to sweep.
  - **`complete`** — something was due, every due obligation completed (`ok` or `empty`), and nothing failed.
- **`idle` exists because "every due cell succeeded" and "no cell completed" are both vacuously true when nothing is due.** Without a name for that state, the same morning can be reported as full health or as a total collection failure. Test for `idle` before you test for `complete`.
- **Every mandatory obligation records an outcome, and the vocabulary is the same for all three classes:** `ok` (ran, found something) · `empty` (ran, found nothing — a success) · `failed` (errored, rate-limited, or timed out). Cells record theirs in `coverage.json`; signposts and falsifiers record theirs here. **An obligation with no recorded outcome is indistinguishable from one that was never run**, which is how a mandatory step becomes theater.
- **`falsifiers` is what makes the brief's disconfirming section honest.** One row per active driver, every run: the counter-hypothesis you searched against, the query you used, and what came back. The briefing skill may only write *"nothing surfaced against your drivers"* when every row here is `empty` — an `empty` falsifier means the world offered no counter-evidence; a `failed` one means **you did not look**, and those must never render as the same sentence.
  - On an `ok` falsifier, record **`result_observation_ids`** (the observations the counter-search actually turned up) and **`cuts`**: `against` (the evidence cuts against the driver's current direction) | `for` (it unexpectedly supports it) | `mixed`. **Without these, an `ok` row says only that counter-evidence exists somewhere and leaves the brief to guess which observations it meant** — and a section whose whole purpose is disconfirmation cannot be assembled by inference. `result_observation_ids` is empty and `cuts` is `null` on `empty` and `failed` rows.
- **`planned`** — the obligations this run committed to at step 3, before executing any of them. Step 11 reconciles the recorded outcomes against it, and **any planned obligation with no recorded outcome is written down as `failed`.** This is the mechanism that makes "every mandatory obligation records an outcome" enforceable rather than merely stated: absence and success must not be the same thing on disk.
- `brief_written` is null when the scan runs standalone; the briefing skill fills it when it reports on this run. A run whose brief included a reckoning also carries `"reckoning": true`, set by the briefing skill.
- **`run_window_start` / `run_window_end` bound the run, not the collection.** They exist so a reader can see what interval a run covers. **They are not the search window for any cell** — each cell derives its own window from its own `last_successful_scan` (see `coverage.json`). Three windows exist in this system and they are not interchangeable: the **cell collection window** (what a given cell searches), the **run window** (what this run covers, recorded here), and the **reader window** (what the brief reports on, derived by the briefing skill from `brief_written`). Collapsing them is how a weekly cell ends up searching one day.
- **`last_successful_run` is derived from this file**, never stored separately: the most recent run whose status is `complete`, `degraded`, or `idle`. A quiet run still writes a run record, so a quiet day never causes the next day to think it is a first run.
- Run ids are `RUN-YYYY-MM-DD-NN`, the `NN` an ordinal within the day. A second run on the same date is a new record; nothing is overwritten.

### `intel/threads.json` — story identity

Empty form: `{ "threads": [] }`

```json
{
  "threads": [
    {
      "thread_id": "THR-meta-business-agent",
      "label": "Meta Business Agent",
      "status": "live",
      "driver_ids": ["DRV-001"],
      "observation_ids": ["OBS-2026-06-07-001"],
      "first_seen": "2026-06-07",
      "last_material_change": "2026-06-07",
      "last_state": "Global availability announced; free to start, paid SMB tiers and enterprise platform coming; access gated to selected accounts plus waitlist."
    }
  ]
}
```

- `status`: `live` | `dormant` | `closed`. **Threads are never deleted.** They go dormant. A story returning after a month is *the same story advancing*, not a new one.
- **A thread is a story. A driver is a force. Many threads roll up to one driver.** They are different objects; do not merge them.
- **Identity.** A `thread_id` is assigned **once, at thread creation, and never re-derived.** Each run matches new observations against the *visible list of existing threads*, using their labels and last states — matching against a shown list is a far more reliable judgment than reconstructing a slug from scratch.
- **Bias rule:** when it is unclear whether an observation belongs to an existing thread or a new one, **attach it to the existing thread.** Thread proliferation is the failure mode. The review conversation can split a thread later; it cannot easily merge forty of them.

### `intel/feedback.json` — append-only, written by the review conversation

Empty form: `{ "feedback": [] }`. The scan only reads it (a `miss` record explains why a cell is `suspect`). Never write to it from this skill.

---

## ZONES

The zone set is fixed and not user-editable. These five lenses are the forces any role has to reckon with at some level — an executive, an engineer, a marketer, an accountant watch the same zones; what differs is the relevance context, which refracts each zone toward their world. Editing the set away would lose that cross-domain validity, so the configuration tailors *through* the relevance context, not by swapping zones. Zones are a **collection** lens set, not a presentation taxonomy — their fixedness is what stops the scan drifting toward whatever the operator already finds interesting.

**The five zones:**

1. **Emerging Impact** — new and emerging products and services; conventional approaches being challenged; raw ideas becoming tangible solutions; new market opportunities.
2. **Currents** — forces reshaping the landscape at three levels: micro (individuals, their teams, direct customer interactions), meso (communities, networks, industry-specific dynamics), macro (economic, technological, societal trends).
3. **SciTech Frontier** — groundbreaking discoveries, emerging technologies, and scientific breakthroughs with transformative implications for medicine, industry, and understanding.
4. **Policy Levers** — creation, modification, and removal of policy at all levels; the intended and unintended consequences of regulation, incentive, and legislation.
5. **Field Movements** — specific named players making specific moves: launches, funding, partnerships, entrances and exits within the watched space. (Covers the competitive/peer layer the individual→industry→society progression of the other zones skips.)

Each zone, when run, draws on:

- **In/out examples** — supplied per deployment in CLAUDE.md, derived from the relevance context. This is how the fixed lens gets pointed at the user's world. If a zone's in/out examples are absent, derive provisional ones from the relevance context rather than halting.
- **Channels** — the kinds of sources to scan (for science: preprint servers, journals; for policy: legislative trackers, agency releases; for field movements: funding databases, company filings). Channels are source *types*, not a frozen URL list.
- **Credibility hierarchy** — which channels outrank which, used to assign source tier. A peer-reviewed result outranks a press release; a primary filing outranks secondary coverage.

A due cell is a **zone × domain-cell crossing**: apply the zone's lens to the domain cell's territory. The in/out examples calibrate the lens; the cell supplies the territory.

---

## CLASSIFICATION

Two axes are independent: how authoritative a source is (tier) is not the same as whether a claim is confirmed (corroboration). An original filing seen in one place is primary *and* single. Mark both.

**Epistemic type:**

- **Fact** — something verifiable happened or was established.
- **Signal** — an early indication; real but not yet confirmed. A Signal must carry an uncertainty note — the specific event that would confirm or falsify it — and is written in language that marks it as unconfirmed. Do not state a single-source signal in the flat declarative voice reserved for facts.
- **Frame** — a concept, model, or way of seeing that is gaining currency.
- **Pattern** — a synthesized read across multiple items. Used in synthesis only, never on an individual observation.

**Source tier** — how authoritative the origin is:

- **Primary** — original record: the filing, paper, dataset, official statement.
- **Secondary** — credible reporting on a primary source.
- **Tertiary** — aggregation, commentary, or coverage at further remove.

**Corroboration** — whether the claim is confirmed:

- **Single** — one uncorroborated source.
- **Corroborated** — independently confirmed by at least one other credible source.

**Disposition** — what the reader should do:

- **Note** — awareness only; no action.
- **Track** — a live thread worth watching as it develops.
- **Act** — warrants a decision or a step now.
- **Dig** — resists compression; the reader should leave the brief and read the source in full.

Dispositions assigned at capture are provisional. The briefing skill enforces the configured evidence bar (including the action gate) before anything is emitted.

---

## STEPS, IN ORDER

**0. Validate config.** Read `CLAUDE.md`. The only halting condition is a missing or placeholder **relevance context** — emit this and stop:

```
## Halt — missing relevance context
This scan needs a relevance context to know what matters. Edit CLAUDE.md to fill it in, or run /intel-setup.
```

Every other missing field silently takes its default.

**1. Open a run record.** Append a new row to `runs.json` with `run_id`, `started`, and `status: "failed"` — pessimistic; it is upgraded when the run closes. Set `run_window_start` from the last `complete` / `degraded` / `idle` run's `run_window_end` (if none exists, one cadence interval back) and `run_window_end` to now. **These bound the run record only. They are not the search window for anything** — each cell derives its own (step 3a).

**2. Read state.** `coverage.json`, `drivers.json`, `signposts.json`, `threads.json`, and the current month's observation shard. Read prior shards only if a due signpost or a reassessment target points into them. Create any missing file with `Write`, containing its empty form.

**3. Build the collection plan.** Three sources of queries, in this order. **All three are mandatory collection obligations: each one records an outcome, and any failure degrades the run.**

   **Write the plan into the run record before you execute it.** Once the three lists below are built, set `planned` on this run's row:

   ```json
   "planned": {
     "cells":     [{ "zone": "Policy Levers", "cell_id": "ai-advice-regulation" }],
     "signposts": ["SIG-2026-06-07-001"],
     "drivers":   ["DRV-001", "DRV-002"]
   }
   ```

   **This is what makes "every obligation records an outcome" an actual rule instead of an intention.** Step 11 compares the outcomes you recorded against this list, and **any planned obligation with no recorded outcome becomes a `failed` one.** Without the plan on disk, a missing row and an obligation that was never owed are the same thing, and a run that quietly skipped half its work closes `complete`. A rule that nothing checks is not a rule. Write the plan first, then do the work.

   **(a) Due cells.** Every `matrix` row where `applicable: true` and `next_due <= today`. A row whose `next_due` is null — a hand-authored matrix, or a cell added outside setup — is due immediately, and gets a real `next_due` when it closes.

   **A cell whose last attempt `failed` is due again — failure does not discharge the obligation.** It kept its old `next_due` (step 11), so it simply stays due, with no special case needed here.

   **Do not treat "never scanned" as "due."** `/intel-setup` staggers the matrix's opening `next_due` dates across the first cycle deliberately, so that a weekly matrix sweeps a few cells every morning instead of all of them on day one and none for six days. A rule that made every never-scanned cell due would collapse that stagger on the first run and re-synchronize the whole matrix — which is both a hundred-plus-search first session and a daily product that has nothing to collect six mornings out of seven. **The stagger is the rotation.** Respect the dates it wrote.

   Each due cell is a zone × domain-cell search: apply the zone's lens to the domain cell's territory.

   **Each cell searches its own window:** from its `last_successful_scan` minus the grace window, to now. A never-scanned cell searches one `required_frequency_days` back. **This is per cell, not per run** — a weekly cell searches a week of territory even when yesterday's run completed, and items published before its window are out of scope for it. Discarding by window is the one discard you make before relevance (step 5).

   **Read each due cell's `last_status` before you search it, and let it change how you search:**

   - `failed` → this cell is a **retry**. Whatever you did last time did not work. Change something: a different channel mix, a narrower query, fewer parallel searches if the failure looked like rate-limiting. Repeating the identical failing search and recording a second failure is not a retry, it is a re-enactment.
   - `empty` → the cell was searched cleanly and the world was quiet. Search it the same way; nothing is wrong.
   - `ok` → normal.

   A cell marked `source_health: "suspect"` must **widen its channels** — do not repeat the search that already missed something. Read that cell's `miss` records in `feedback.json` first: they name exactly what was missed, which tells you which kind of channel was blind.

   **(b) Due signposts.** Every `signposts.json` row where `status: "open"` and (`due <= today`, or `due` is null and no run in the last seven days recorded a non-`failed` check for it in its `signposts` array). **This is a directed search for a specific named event.** It is not a zone sweep. Search for exactly the thing the signpost names.

   **(c) Driver falsifiers.** For each `active` driver, search for evidence that would move it *against* its current direction. **This is a mandatory step and it is what makes the disconfirming section actually disconfirm.** A driver at `Increasing / High` gets a search for evidence of weakening. Skip a driver only when its direction is `Uncertain` and there is no direction to cut against — then search for whatever would settle it either way.

   **Write the counter-hypothesis down before you search it.** State, in one sentence, what would have to be true for this driver to be wrong — then build the query from that sentence. Both go into the run record. A falsifier search you cannot state a counter-hypothesis for is not a falsifier search.

**4. Execute the plan.** Use built-in `WebSearch`; use `WebFetch` to open a source when you need to confirm a date, a figure, or a qualifier — and **always** for a source you are about to capture with an `act` disposition or attach to a driver (step 6). Run every search **inline, in this session** — never delegate to a subagent.

   **Record an outcome for every obligation, in all three classes.** One vocabulary: `ok` (ran, found something) · `empty` (ran, found nothing — **a success, not a failure**) · `failed` (errored, rate-limited, or timed out). Cells record theirs in `coverage.json` at step 11; signposts and falsifiers record theirs in the run record's `signposts` and `falsifiers` arrays.

   **Never silently drop an obligation you could not complete.** A rate-limited falsifier search is a `failed` falsifier, not an absent one — and it degrades the run. The difference between "I looked and the world was quiet" and "I never got to look" is the entire difference between an intelligence system and a decorated guess, and it survives only if you write it down.

   **Scan budget per cell:** roughly three to eight high-signal channels. Stop early only when the pass produces no motion *and* the cell's `source_health` is `ok`. A `suspect` cell does not get to stop early.

**5. Filter.** Discard anything that does not clear the relevance context. When in doubt, discard — a strained relevance justification means the item does not belong. **Discard at the edge, never at the material.** Missing a material shift that plainly clears the bar is the one unacceptable failure.

**6. Capture observations.** For every survivor, write an observation into the current month's shard, per the schema above.

   **Dedupe first.** Before writing, check the current month's shard — and the prior month's, if this cell's collection window reaches back across a month boundary — for an observation whose `source.url` matches this one. If it exists, **do not write a second observation** — the grace window overlaps every run, and a story indexed inside that overlap would otherwise be captured twice and counted twice. If the same event surfaces under a *different* URL (syndication, a wire pickup), that is not a duplicate — it is a `derivative` observation of the same event, and it is captured as one. **This is a check before a write, not a prune: it never removes an observation already in the store.** Nothing in this system ever deletes an observation.

   **Fill `captured_evidence` here, at gather time, before any compression.** All four parts: the `claim` in the source's own words **with the source's own verb**, the verbatim `details` (figures, ranges, dates, qualifiers exactly as stated — "1–3x among surveyed firms, preliminary" is one whole detail), the `locator` and `retrieved` timestamp, and `source_opened`. **This is the single most important write in the entire system** — everything downstream re-derives from it, and it can only carry what you put in it. A figure captured perfectly under a verb you got wrong is a claim that will pass every check the brief can run.

   Classify (type, tier, corroboration, provisional disposition). Attach to a thread (step 7), and set `contribution` to `material_advance` or `derivative` by the same test step 7 applies.

   **Attach to zero or more drivers by `driver_ids`, and mirror every attachment on the driver side — but honor `contribution` when you do:**

   - **`material_advance`** → append the `obs_id` to the driver's `supporting_observations` **and** increment its `observation_count`. This is new evidence, and it is a cause for reassessment (step 9).
   - **`derivative`** → append the `obs_id` to `supporting_observations` (it is genuinely part of the record) but **do not increment `observation_count`, and do not count it as a cause for reassessment.** Ten outlets restating one announcement is one piece of evidence reported ten times. A driver that gains ten observation-counts from a single event looks ten times better supported than it is, and a weaker model reading that count will upgrade its certainty on the strength of an echo.

   Set `material` honestly: `false` still gets captured — the store is not the brief.

**7. Update threads.** This is where you make the material-advance judgment. **Make it once, here, and record it in the observation's `contribution` field** — the thread layer and the driver layer must both honor the same call, or a story the brief correctly declines to resurface can still inflate the driver behind it.

   For each observation:

   - Matches an existing thread and represents a **material advance** (a new decision, a new publication *with a materially new result*, a funding event, a regulatory action, a measured outcome, a reversal, or a credible contradiction) → attach the observation, update `last_material_change` and `last_state`. `contribution: "material_advance"`.
   - Matches an existing thread but is **derivative** (commentary, restatement, syndicated coverage of the same event) → attach the observation, do **not** update `last_material_change`. **The thread does not resurface in the brief, and the observation does not count as evidence for any driver** (step 6). `contribution: "derivative"`.
   - Matches nothing → create a new thread. Assign its `thread_id` now; it is never re-derived. Carry the observation's `driver_ids` onto the thread, and keep a thread's `driver_ids` in step with the observations attached to it. A first sighting is a `material_advance`.

   Match against all threads regardless of status — a `dormant` thread that advances returns to `live`; it is the same story, not a new one. (Status transitions the other way — dormant, closed — happen in the review conversation on the user's say-so, never here.)

   > "A new publication" alone is **not** a material advance. Daily derivative commentary on an unchanged underlying state must produce an observation and no brief item.

   Match against the visible list of existing threads (labels and last states). When unsure, attach to the existing thread.

**8. Resolve signposts.** For each signpost checked in step 3(b), **record its outcome in the run record's `signposts` array** (`ok` | `empty` | `failed`), then:

   - **The check `failed`** (errored, rate-limited, timed out) → the signpost stays `open` and stays due. **You did not check it; do not record that you did.** The run is degraded.
   - The named event occurred → `status: "fired"`. Capture the confirming observation, record `resolved_date`, `resolved_observation`, and a one-line `resolution_note`.
   - The `due` date passed and the event did not occur → `status: "expired"`. **An expired signpost is information.** A predicted event that failed to happen is evidence about the driver, in the opposite direction from `if_fired`. Record a `resolution_note` saying so. **Only a successful check can expire a signpost** — a signpost you failed to check has not failed to fire.
   - Still pending, `due` not reached → leave `open`.

**9. Reassess drivers.** A driver is re-decided **only when both conditions hold**:

   - **Standing.** **This run has no failed obligation of any kind** — no failed cell, no failed signpost check, and no failed falsifier search **for any driver, not only this one.** That is exactly the condition that will close the run `complete` at step 11: **if the run would not close `complete`, no driver moves.** (A cell that failed today kept its `next_due` and is still outstanding, so *due-but-not-done* and *overdue* both fail standing — a gate that only tested "overdue" would wave through a cell that failed this very morning.)

     > **Why the gate is global and not per-driver.** The brief's degraded rendering makes a *global* claim — "No driver moved today, because collection is incomplete." A gate scoped narrower than the claim it protects is a contradiction waiting to be printed: scope the falsifier check to *this* driver, and a run where driver B's search rate-limited is degraded while driver A moves anyway, so the brief must simultaneously report A's movement and assert that nothing moved. **One gate, one claim, same scope.** The cost is real and it is the right cost: one failed search freezes every driver for one run. They are retried next run and confidence catches up. Confidence that moves on an incomplete look is the thing this whole system exists to prevent.

   - **Baseline.** **Every `applicable` cell has at least one successful scan on record.** Until the matrix has completed its first full sweep, no driver moves.

     > The rotation is staggered, so on day three most cells have never been searched and their turn has not yet come — which means "nothing is overdue" is true while the system has still seen almost nothing. Without this clause a driver seeded at setup can move on day one, off three cells of evidence, while twelve cells have never been looked at, and the brief says "Collection current" over the top of it. That is not a lie the rotation percentage repairs; it is an assessment the evidence does not support. **A driver cannot be re-decided before the system has looked at the world once.** Say so in the brief (see the briefing skill's baseline rendering) rather than moving quietly.
   - **Cause.** At least one new **`material_advance`** observation or resolved signpost has attached to this driver since its `last_reassessed`. **Derivative observations are not a cause.** Restatement is not evidence; if ten outlets repeat one announcement, nothing has happened since the announcement.

   **If standing fails, no driver moves. Full stop.** Confidence may not move on a partial look, and it may not move on a look that never tried to disconfirm it. This is the same doctrine as the quiet-day rule, applied one level up: *silence must be attributable, and so must confidence movement.*

   When both hold, re-read the driver's supporting observations and decide whether `direction` or `certainty` changes. If either moves, **append** a `confidence_log` entry with the date, the new values, a plain-language reason, and the `moved_by` observation ids. Update `implication` if the movement changes what the reader should build. **Never rewrite a prior log entry.**

   If nothing moved, that is a valid outcome. Update `last_reassessed` and write no log entry.

   New signposts: when an observation or a movement surfaces a specific, checkable future event that would strengthen or weaken a driver, write it into `signposts.json` as an `open` signpost with `if_fired` set and a `due` date if one is knowable. This is how "watch for" stops being decoration.

**10. Propose emergent drivers.** If a thread has accumulated three or more material observations and does not roll up to any existing driver, record a proposal in `drivers.json` → `proposals` with `status: "open"` (skip if an open or dismissed proposal already exists for that thread). **Do not create the driver.** It is offered to the user in the next brief and confirmed or dismissed through the review conversation.

**11. Close the run record.** Set `completed`, `cells_due`, `cells_completed`, `cells_failed`, `observations_added`, `drivers_reassessed`, and `status`. The `signposts` and `falsifiers` arrays were filled as you went (steps 4, 8).

   **Reconcile the plan first, before anything else in this step.** Read `planned` (step 3) and check every entry against what you actually recorded:

   - Every planned cell has a `last_status` written this run. Every planned signpost has a row in `signposts`. Every planned driver has a row in `falsifiers`.
   - **Any planned obligation with no recorded outcome is recorded as `failed`, right now.** Not omitted, not assumed fine — `failed`. You planned it, you did not record doing it, and the honest reading of that is that it did not happen.
   - Any *recorded* outcome for something that was never planned is a bug in your own bookkeeping. Fix the record rather than the plan.

   > **This reconciliation is the mechanism behind the release's central rule.** "Every mandatory obligation records an outcome" is doctrine; this comparison is what enforces it. Skip it and the rule degrades into a hope — a weaker runtime that simply never writes a falsifier row closes the run `complete`, and the brief goes on to say "nothing surfaced against your drivers" about searches that never ran.

   **Update the matrix, and be precise about which timestamp moves.** For every cell you *attempted*:

   - Always: set `last_attempted` to today, set `last_status` to the outcome, increment `scan_count`.
   - **On `ok` or `empty` only:** set `last_successful_scan` to today, update `observation_count`, reset `consecutive_failures` to 0, and recompute `next_due` as `last_successful_scan + required_frequency_days`.
   - **On `failed`:** leave `last_successful_scan` and `next_due` exactly as they were, and increment `consecutive_failures` (at 3, set `source_health: "suspect"`). **The cell remains due.** It will be picked up again on the next run, and it will keep being picked up until it succeeds.

   > **This is the rule the whole system rests on: a failed obligation is a debt, not a completed step.** Advancing a failed cell's schedule as though it had succeeded is how a system that missed an interval reports itself as current — the failure is disclosed on the day it happens and erased forever after, and no later brief can tell you the world was never looked at. Never move a success timestamp on a failure.

   Then set `status`, testing in this order:

   - **`failed`** — a config halt, or at least one cell was due and every one of them failed. **No brief may be written from this run.**
   - **`degraded`** — any mandatory obligation failed: a due cell, a due signpost check, or an active driver's falsifier search. **All three count.** A run whose cells all succeeded while every falsifier search rate-limited is degraded, not complete — the drivers went untested and the brief may not say otherwise.
   - **`idle`** — nothing was due at all: no due cells, no due signposts, no active drivers. Nothing failed, because nothing was owed.
   - **`complete`** — something was due, and every due obligation returned `ok` or `empty`.

   Write all state files back whole.

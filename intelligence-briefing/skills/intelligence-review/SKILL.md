---
name: intelligence-review
description: This skill should be used when the user wants to interrogate or correct their intelligence picture — asking what is known about a topic, what changed on a driver, where coverage is thin, or telling the system it missed something or wasted their time. Reads the accumulated observations, drivers, signposts, and coverage matrix; records misses, noise, and driver judgments. The only surface where the user writes to the system after setup.
allowed-tools: Read, Write, Edit, WebSearch, WebFetch
---

# Intelligence Review

This is a conversation with the intelligence picture — the one surface where the user writes to the system after setup. It exists because of an asymmetry nothing else can close:

**The system can report what it observes about itself:** answers to questions, read out of observations, drivers, signposts, and threads; coverage gaps (the matrix knows which cells are overdue and which have `source_health: "suspect"`); proposed drivers (threads that have accumulated enough to be a force); stale drivers (ones that have not moved in months).

**Only the user can supply:** a **miss** — the system scanned that cell and still did not see the thing, and the matrix will never know this, because a miss is by definition what it did not see; **noise** — the system has no idea what the user read or ignored; whether a **proposed driver is real**; whether a **stale driver should die**.

If the system could observe its own misses, this skill would not need to exist. That asymmetry is its entire justification — and it is why the user can trust a quiet day: a filter that can never be told it is wrong will be abandoned the first time it is obviously wrong.

---

## IT IS A CONVERSATION, NOT A SET OF COMMANDS

**There are no named entry points and no verbs to learn.** The user will say *"you missed the Intuit thing, and what's happening with the fragmentation driver anyway"* — which is a miss record and a query in one sentence. Recognize intent from what they say, handle each intent, and answer in plain language. One message can carry several of the inputs below; take them all.

---

## STATE

All state lives in the deployment directory (default `./intel/`, plus `CLAUDE.md` for config). Read and write with `Read` / `Write` / `Edit` only — **never shell**. To check whether a file exists, `Read` it and handle the missing-file result. Files and their schemas are established by the environmental-scan skill and `/intel-setup`:

- `intel/drivers.json` — the forces: `drivers` (each with `definition`, `direction`, `certainty`, `implication`, `status`, `origin`, append-only `confidence_log`, `supporting_observations`) and `proposals` (emergent-driver proposals, `status`: `open` | `confirmed` | `dismissed`).
- `intel/signposts.json` — tripwires: `statement`, `driver_id`, `due`, `status` (`open` | `fired` | `expired` | `withdrawn`), `if_fired` (`strengthens` | `weakens`).
- `intel/threads.json` — story identity: `label`, `status`, `observation_ids`, `last_state`. Never deleted.
- `intel/coverage.json` — the zones × domain-cells matrix: per-cell `last_attempted`, `last_successful_scan`, `last_status` (`ok` | `empty` | `failed`), `next_due`, `consecutive_failures`, `source_health` (`ok` | `suspect`). **`last_successful_scan` is the one that means anything** — a cell that was attempted and failed has not been scanned, and it stays due.
- `intel/observations/YYYY-MM.json` — the archive, sharded by month. Each observation carries its source, `captured_evidence` (the source's own claim and verbatim details, with a locator), classification, `contribution` (`material_advance` | `derivative`), `thread_id`, `driver_ids`.
- `intel/runs.json` — append-only run records; which cells, signposts, and driver falsifiers ran when, and with what outcome (`ok` | `empty` | `failed`).
- `intel/feedback.json` — append-only; **this skill is the only writer.** Empty form `{ "feedback": [] }`; create it with `Write` if missing.

A feedback record:

```json
{
  "feedback_id": "FB-2026-07-15-001",
  "date": "2026-07-15",
  "kind": "miss",
  "statement": "Missed Intuit's SMB advisory launch, published 2026-07-07.",
  "zone": "Field Movements",
  "cell_id": "smb-fintech",
  "action_taken": "Marked Field Movements × smb-fintech source_health=suspect. Added OBS-2026-07-15-003 against DRV-001."
}
```

`kind`: `miss` | `noise` | `driver_confirm` | `driver_kill` | `relevance_correction`.

**Capture feedback from day one and do no statistics on it.** The ground truth of what was missed in March is gone from human memory by June — it cannot be reconstructed later. But rates, scores, and auto-tuning have no honest basis until months of records exist. Schema now, math later. Never compute hit rates, miss rates, or false-alarm scores from this file.

---

## WHAT EACH INPUT DOES

### A question — read-only

Answer from state. Show evidence, not vibes — cite observation ids and dates from the store.

- **For a driver:** its direction and certainty, how many times it moved, the confidence log entries that moved it, the observations behind it (and how many of those are `material_advance` rather than derivative echo), its open signposts — and **what would tell us it's wrong.** That last one is answerable now, concretely, because the scan writes it down: read the run records' `falsifiers` array for this driver and report the **`counter_hypothesis` you have actually been searching against**, how often, and what came back. *"Every run for six weeks I've searched for platforms retreating from bundled AI advisors, or advisors failing to retain users. Four empties, one failure, nothing found. That's the strongest thing I can say for this driver — not that it's true, but that I've been trying to kill it and haven't managed."* **A driver whose falsifier searches keep failing is a driver nobody has tested. Say so plainly.**
- **For a topic:** the threads and observations that touch it, read out of the shards.
- **For "what did you actually cover, and when":** read `runs.json`. Each run record's `run_window_start` → `run_window_end` is the interval that run purported to cover, and its `status` says how well. This is the question a user asks right after they find something the system missed — *"were you even looking that week?"* — and it is answerable exactly, run by run, instead of reassuringly. **Answer it exactly.**
- **For coverage:** which cells are overdue, which are `suspect`, when each **last successfully scanned** — and, separately, when it was **last attempted.** Those diverge exactly when something is wrong: a cell attempted daily and successfully scanned two weeks ago is failing silently, and its `consecutive_failures` count is the system telling you where it is blind. **Report that divergence unprompted.** The user should learn about a blind spot from the coverage answer, not from having to discover it as a miss.

### A miss — the system scanned and still did not see it

1. Write a `miss` feedback record.
2. **Locate the cell.** Which zone × domain cell should have caught this? Say so plainly.
3. If that cell was scanned in the relevant window and returned `empty` or `ok` without catching the item, set its `source_health: "suspect"` in `coverage.json`. A suspect cell forces the next scan to widen its channels instead of repeating the search that already missed something.
4. **Search for the missed item now** (built-in `WebSearch` / `WebFetch`, inline — never a subagent). Capture it as an observation in the current month's shard, exactly as the scan would: source; full `captured_evidence` (the source's own `claim` **with its own verb**, the verbatim `details`, the `locator` and `retrieved` timestamp, and `source_opened` — **open the source**, since a miss the user had to report is not one to re-capture from a snippet); classification (type, tier, corroboration, provisional disposition); `contribution` (`material_advance` or `derivative`); attach to its thread (create one if new; when unsure, attach to the existing thread); attach to its drivers, honoring `contribution` on the driver side exactly as the scan does.
5. **Report what changed as a result** — *"That's Field Movements × smb-fintech. I scanned that cell on July 8 and came back empty, so I'm marking its sources suspect. Adding it as an observation against Commoditization — that makes five moves, not four."*

### Noise — the item wasted the reader's time

Write a `noise` feedback record against the item and its cell. If noise records accumulate against the same cell or the same kind of item, say so plainly and offer to sharpen the relevance context in `CLAUDE.md`. Offer; do not silently edit.

### Confirming a proposed driver

Set the proposal's `status: "confirmed"`. **Create the driver by following the one constructor** — "Creating a driver" in the environmental-scan skill's `drivers.json` section. Do not improvise the field list from this page.

The parts specific to this case: `origin: "emergent"`; a `definition` in plain language (a force, not an outcome); `direction` and `certainty` as the evidence supports; the thread's observations as `supporting_observations`; and a seed `confidence_log` entry naming the thread it emerged from.

**The constructor's counting rule is the one that matters here, and it is the one this surface used to get wrong.** `observation_count` and the seed entry's `moved_by` count **`material_advance` observations only.** A thread that accumulated three real advances and twenty syndicated restatements becomes a driver with an `observation_count` of **3**. Confirming it as a twenty-three-observation force is how an echo chamber becomes a held belief.

Write a `driver_confirm` feedback record.

### Killing or retiring a driver

Set `status: "retired"`. **Never delete it.** Retired drivers and their confidence logs are what the reckoning reads. Append a final `confidence_log` entry recording the retirement and its reason. Write a `driver_kill` feedback record. (For a proposal the user rejects: set the proposal's `status: "dismissed"` — it will not be re-proposed.)

### A stated belief

If the user asserts a view of the world worth tracking (*"I think the edge is in proprietary data"*), offer to hold it as a driver with `origin: "user_asserted"` — direction and certainty as they state it. **Build it with the one constructor** ("Creating a driver", environmental-scan skill), which is also what keeps a stated belief from being seeded at `High` certainty with no evidence on file. This is how held beliefs enter the system, and it is what the scan's mandatory falsifier search will then actively test.

### A story that's over

If the user says a story is done ("stop watching the Meta agent thing"), set its thread's `status` to `closed`; a story that's merely gone quiet can be marked `dormant`. **Never delete the thread** — the scan matches against all threads regardless of status, and a dormant story that advances comes back as itself, not as a new one. Thread status moves only here, on the user's say-so.

### A relevance correction

Write a `relevance_correction` feedback record. Offer to edit the relevance context or the zone in/out examples in `CLAUDE.md` — show the proposed edit and apply it only on confirmation.

**Then reconcile the territory, in the same breath.** The relevance context says what matters; the **coverage matrix in `intel/coverage.json` is where the system actually looks** — and they are two different files. Editing the mandate and stopping there leaves the old territory being scanned indefinitely: the words change, the searches do not. **A correction that never reaches the matrix is not a correction.**

Whenever the relevance context or a zone's in/out examples change:

1. **Re-derive the domain cells** from the corrected context, exactly as `/intel-setup` step 4 does.
2. **Name the difference out loud** — which cells the new mandate implies that the matrix does not have, and which existing cells it no longer justifies. *"You've moved from watching SMB fintech to watching SMB lending compliance. Nothing in the matrix covers lending compliance, so tomorrow morning I'd still be scanning the old territory. Want me to add it?"*
3. **Offer the edit; apply it only on confirmation.** A new cell gets one row per zone crossing, each with a stated `applicable` call, and a `next_due` staggered into the existing rotation rather than landing every new row on the same morning.
4. **Retire, never delete.** A cell the mandate no longer covers gets `applicable: false` and an `na_reason` recording that the relevance context changed, and when. Its scan history and its observations stay where they are — same doctrine as threads and drivers. **The matrix is the record of what was looked at; rewriting it destroys the only evidence of what the system used to be blind to.**

Then report what changed, per rule 2.

---

## RULES

1. **Append, never rewrite.** `feedback.json` and every `confidence_log` are append-only. Never delete a driver, a thread, or an observation.
2. **Report every write.** When a conversation changes state, end by saying exactly what changed: records written, cells marked, drivers created or retired, observations added.
3. **Evidence, not deference.** If the user's correction contradicts what is on file, show what is on file first — the point of the store is that disagreements get settled against captured evidence, not memory.
4. **No statistics.** No hit rates, no miss rates, no scoring. The records exist so the math is possible later, elsewhere.
5. **This is how requirements deepen.** The setup interview stays three open questions forever. Everything sharper than that — killed proposals, corrected relevance, hard-won drivers — happens here, one conversation at a time. Nobody ever fills out an intake form.

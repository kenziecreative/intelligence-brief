---
description: Set up this project as a daily intelligence brief
allowed-tools: Read, Write, Edit, AskUserQuestion, WebSearch, WebFetch
---

Set up the current project as an intelligence-briefing deployment. The collection logic lives in the `environmental-scan` skill and the briefing logic in the `environmental-briefing` skill; this command produces the per-project configuration and state files they read.

Ask the specific questions below. Do not improvise your own framing or substitute your own questions — these are the questions setup is meant to ask. Ask one topic at a time and wait for each answer.

**Guardrails (important):**

- The relevance context must be the user's **own words**. Do NOT present a menu of role "personas" or job titles to pick from — the skills need a concrete seat-and-decisions description, and offering generic titles is the exact opposite of that.
- Do NOT infer the user's role, employer, clients, industry, or interests from other projects, open files, memory, prior conversations, or anything else in the environment. Ask; never guess.
- Do NOT put real company or product names into your questions, your options, or the drafted config. If you need an illustrative example, use an obvious generic placeholder (e.g. "a client", "your main platform") — never a specific named organization.
- Do every file operation (creating CLAUDE.md, the state files, the briefs folder, the settings file) with the `Read`/`Write`/`Edit` tools only. Never run shell commands (`ls`, `cat`, `mkdir`, `pwd`, etc.) to check for or create files — that triggers needless permission prompts. To create a folder, just write a file into its path; to check a file, `Read` it and handle the result.

**Set expectations on approvals first.** Before the steps below, tell the user in one line that setup will create a few files in this project and they may be asked to approve file creation — and that if their client offers an "allow for this project/session" option, choosing it once will cover all of setup's file writes instead of prompting on each. (In Claude Code this avoids repeated prompts; in Cowork there may be no prompt at all — either way the message is harmless.)

Steps, in order:

1. Confirm the `environmental-scan` and `environmental-briefing` skills are available to this project. They carry the collection and briefing logic — do not reimplement either here.

2. Gather the **relevance context** by asking these three open, free-text questions, one at a time, in the user's own words (no multiple-choice personas):
   a. "What's your role, and what are you responsible for? Describe the specific seat and the kinds of decisions you make from it — not a job title."
   b. "What kinds of change out in the world would actually move a decision or a view for you? Be concrete enough that we could discard something that's merely interesting."
   c. "What should the brief ignore, even if it's interesting? Naming what's out of scope matters as much as naming what's in."

   If an answer is vague, ask one short follow-up to make it concrete — a vague relevance context produces a vague brief. Then play back a drafted relevance context assembled from the three answers and ask the user to confirm or correct it before continuing. Build it only from what the user said, not from outside assumptions.

3. **Derive the forces and play them back.** From the confirmed relevance context, derive three to five **forces** worth tracking. A force is what a driver is: a pressure shaping the user's world, not an outcome and not a decision. *"Automation Pressure" is a driver; "Jobs Disappear" is an outcome.* Do NOT derive decision questions, options, or Priority Intelligence Requirements — the relevance context is a standing mandate, not a decision with a closing date. Play the forces back in the user's own language:

   > From what you told me, I think these are the forces worth tracking:
   > 1. ...
   > 2. ...
   >
   > Do these look right? What's missing, and what's too broad?

   Take the corrections — the user may kill one, sharpen others, add one. These become the deployment's starting drivers in step 8, **built with the one constructor** ("Creating a driver" in the environmental-scan skill's `drivers.json` section — that is the single field list every surface uses, and it is not restated here). The parts specific to setup: `origin: "derived"`, `direction: "Uncertain"`, `certainty: "Low"` or `"Medium"`, and a seed `confidence_log` entry reading `"Seeded at setup from the relevance context."` with `moved_by: []`. **Never seed a driver at `High` certainty** — the system has zero observations at this point; certainty is earned from evidence, and there is none yet. If the user states a belief of their own during setup ("I think X"), capture it as a driver too, with `origin: "user_asserted"`.

4. **Derive the domain cells.** The territory is already implicit in the relevance context and what the user said is in and out of scope. Extract it as four to eight named domain cells — the areas of the world this deployment watches (each gets a short `cell_id` slug and a one-line label) — and confirm them with the user. Do not add an intake phase; this is one confirmation step.

5. Draft **zone in/out examples** for each of the five fixed zones (Emerging Impact, Currents, SciTech Frontier, Policy Levers, Field Movements), derived from the confirmed relevance context, and show them for confirmation or adjustment. Do not ask the user to invent zones — the set is fixed; the in/out examples are what tailor them. Derive these from the user's stated context only.

6. **Build the coverage matrix.** Cross every zone with every domain cell and present the grid. Ask the user to mark the genuinely non-applicable crossings — and **record a stated reason for each `applicable: false`** (`na_reason`). Without this the rotation pads itself with nonsense crossings; with it, the matrix is a genuine cross-product that forces the scan across crossings nobody would think to look at.

   Set `required_frequency_days` per applicable cell. **Default 7.** Offer 1–3 days for cells the user says move fast. The rotation is what earns the coverage claim: a matrix where everything is weekly and the brief is daily will complete correctly over the week, a partial sweep each morning.

   **Then stagger the matrix, which is what actually makes that true.** Spread the applicable cells' first `next_due` dates evenly across their frequency window rather than leaving them all to fall due at once: sort the applicable cells, then assign cell *i* an initial `next_due` of `today + (i mod required_frequency_days)` days. A weekly matrix of 21 cells becomes three cells a day for seven days, forever — not 21 cells on Monday and nothing until the next Monday.

   Staggering does two jobs, and the second one is why it is not optional:

   - **It makes the daily brief real.** Unstaggered, every cell is due on day one and no cell is due again until day eight. The brief then has nothing to collect on six mornings out of seven, and a daily product becomes a weekly one wearing a daily coat.
   - **It caps the first run.** Unstaggered, run one is *every* cell at once — five zones times four to eight cells, at three to eight channels each, is a first session of well over a hundred searches, which is exactly how a first run rate-limits itself into a degraded brief. Staggered, day one is a handful of cells and the matrix fills in over the first cycle.

   Some cells should still be due on day one — assign the fastest-moving ones (`required_frequency_days: 1`) offset 0 — but nothing requires the whole matrix to open its eyes in the same second.

7. Ask the **evidence bar** as a single multiple-choice question — this one is a genuine discrete choice, so the question tool fits here. Offer:
   - `situational` — early-warning; unconfirmed single-source items can go anywhere, marked.
   - `decision` — unconfirmed items inform but can't drive an action. (default)
   - `shareable` — unconfirmed items can guide the user but stay out of what they forward.
   - `strict` — unconfirmed items only ever support "track" and "dig".
   Note they can also set the action gate and sharing gate independently for a hybrid. Default to `decision` if they don't care.

   Then ask the user's **timezone** directly. Set everything else to defaults without asking: daily cadence, zone detail budget 5 (a depth ceiling, not an emission cap — overflow compresses to one-line entries, it is never dropped), 3 lead items, paths `./briefs/`, `./ledger.json`, and `./intel/`, output format `html` with theme `default`. Tell the user you've applied these and that any of them can be changed later by editing CLAUDE.md — including switching the brief to plain `markdown` or pointing `theme` at a brand CSS file.

8. **Write the config and the state files.** All with the `Write` tool — never shell.

   a. Read the config template at `${CLAUDE_PLUGIN_ROOT}/templates/CLAUDE.md`, fill in the [FILL] fields with the confirmed answers, leave defaults as-is where the user didn't override them, and write the result to `CLAUDE.md` in the project root.

   b. Create the `briefs/` folder by writing the first state file below (writing a file into a path creates its folders), and create `ledger.json` containing exactly: `{"entries": []}`

   c. Create the six intelligence state files under `./intel/`:
      - `intel/coverage.json` — `{"domain_cells": [...], "matrix": [...]}` filled from steps 4 and 6: every confirmed cell in `domain_cells`; one `matrix` row per zone × cell crossing. Applicable rows carry `required_frequency_days`, **the staggered `next_due` date computed in step 6** (a real date, never null), `last_attempted: null`, `last_successful_scan: null`, `last_status: null`, `consecutive_failures: 0`, `scan_count: 0`, `observation_count: 0`, `source_health: "ok"`. Non-applicable rows carry `applicable: false` and their `na_reason`.
      - `intel/drivers.json` — `{"drivers": [...], "proposals": []}` with the confirmed forces from step 3 (each: `driver_id` `DRV-001`…, `name`, one-paragraph `definition`, `direction: "Uncertain"`, `certainty: "Low"|"Medium"`, `time_horizon` as best supported, `status: "active"`, `origin`, `implication` drawn from the user's "so what", `steep_primary: null`, `steep_secondary: []`, `cell_ids` for the cells it lives in, `supporting_observations: []`, `observation_count: 0`, the seed `confidence_log` entry, `created`, `last_reassessed: null`).
      - `intel/signposts.json` — `{"signposts": []}`
      - `intel/threads.json` — `{"threads": []}`
      - `intel/runs.json` — `{"runs": []}`
      - `intel/feedback.json` — `{"feedback": []}`

      Also create the current month's observation shard `intel/observations/YYYY-MM.json` as `{"month": "YYYY-MM", "observations": []}` — this creates the `observations/` folder.

9. **Reduce permission prompts (Claude Code).** Write a `.claude/settings.json` in the project root that pre-allows exactly the tools the system uses, so the user isn't prompted on every run. Create it if absent; if it already exists, merge these entries into its `permissions.allow` array rather than overwriting the file. Allow only this narrow set — do not add `Bash` or any broad permission:

   ```json
   {
     "permissions": {
       "allow": ["WebSearch", "WebFetch", "Read", "Write", "Edit"]
     }
   }
   ```

   Tell the user this file pre-approves only the system's own tools for this project, that they may be asked to trust the folder once, and that they can edit or delete it anytime. (This file does nothing in Cowork, which doesn't use it — it's purely to spare Claude Code users repeated prompts.)

10. **Pre-flight check, then test run.** Before running the test brief, confirm a web-search tool is actually callable in this session (the scan can't collect without one). If `WebSearch` is available, proceed. If it is not, stop and tell the user plainly what to approve — e.g. "To run your first brief I need web search; please approve `WebSearch` when prompted (or add it to your allowlist)" — rather than launching the scan and letting it fail partway. Once web search is confirmed, show the finished CLAUDE.md, then run the `environmental-scan` skill followed by the `environmental-briefing` skill once as a test (the same chain `/brief` runs), so the user sees a real brief — with its collection-health line — before scheduling it.

    **Set the expectation for what the first brief is.** Because the matrix is staggered (step 6), the first run scans the cells due *today* — a slice of the matrix, not all of it — plus a falsifier search against each seeded driver. Say so before the run, so a short first brief reads as the system working rather than the system failing: *"This first brief covers today's slice of the rotation. The rest of the matrix fills in over the next several days, and by the end of the first cycle every cell has been swept at least once."* A first run that tried to scan every crossing at once would be a hundred-plus searches, would likely rate-limit itself into a degraded brief, and would teach the rotation nothing.

11. Tell the user how to schedule recurring runs: type `/schedule`, set the prompt to "Run /brief for this project" (or "Run the environmental scan and then the environmental briefing for this project"), match the frequency to their cadence, and pick a time. Mention that a run skipped because the machine was asleep catches up automatically — the scan derives its window from the last run record, so nothing is lost. Also mention the third surface: they can just talk to it — "you missed X", "what do we know about Y" — any time, and it gets sharper (the `intelligence-review` skill).

This brief stands alone. Other Kenzie Creative plugins can run in the same project and share the directory's state by convention — but this command sets up only the intelligence brief and never depends on them.

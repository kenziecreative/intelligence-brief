---
name: environmental-briefing
description: This skill should be used when the user asks to run an environmental brief or daily brief for a configured intelligence-briefing deployment (e.g. "run the daily brief", "what's happening in my world", "environmental scan", or a scheduled run). Reads accumulated intelligence state — observations, drivers, signposts, threads, coverage — and writes a dated brief reporting what moved since the reader last looked. Reports assessment change, not article arrival.
allowed-tools: Read, Write, Edit, WebFetch
---

# Environmental Briefing

You produce the daily brief: the readout from a persistent intelligence system. **This skill reads state and writes a document. It does not collect.** Collection is the environmental-scan skill's job; it runs before this skill (the `/brief` command chains the two). If collection has not run, say so and report on the state you have.

You report **movements, not articles**. A scan tells the reader what was found today. You tell them what the accumulated evidence now means — and exactly how confident they should be that the system saw enough to say so.

This document is your operating instruction. Follow it exactly. Every value marked *configured* is read from **CLAUDE.md** in the project root. Where this document states a rule, the rule is not optional.

---

## CONFIGURATION (read from CLAUDE.md)

Only one value has no defensible default and must be supplied: the **relevance context**. If it is missing or still a placeholder, do not produce a brief — emit the structured halt in TASK step 0.

**Shipped with defaults (override by editing CLAUDE.md):**

- **Evidence bar** — a named bar (`situational` / `decision` / `shareable` / `strict`) or the two gates set directly. Default: `decision`. See EVIDENCE BAR.
- **Cadence** — interval and timezone. Default: daily, in the user's timezone.
- **Zone detail budget** — how many items per zone get full treatment; beyond it, material items compress to one line each (see LENGTH). It is a depth ceiling, not an emission cap. Default: 5.
- **Max lead items** — default 3.
- **Overall length** — the target read on a normal day. Default: a two-minute read. A guide for the normal case, not a cap: length tracks the day, and a big day is allowed to be big.
- **Paths** — briefs directory, ledger file, intelligence state directory. Defaults: `./briefs/`, `./ledger.json`, `./intel/`.
- **Output format** — `html` (default) or `markdown`. HTML produces a self-contained, styled brief (see `references/html-brief.md`); markdown produces the plain brief per the OUTPUT CONTRACT. The brief's *content* is identical either way.
- **Theme** *(html only)* — `default` (system fonts, brand-neutral) or a path to a CSS override file in the deployment. Default: `default`.

---

## ROLE

At presentation you are a triage agent. Your job is not to emit everything that was collected — the observation store holds that. Your job is to surface the few movements that warrant attention and to correctly leave out the rest. When thoroughness and selection conflict at the presentation layer, choose selection. Coverage is the scan's obligation, earned across its rotation and disclosed on every brief — it is never a reason for you to emit more.

A quiet day produces a short brief. That is correct behavior — **provided the system actually looked**, which is what the collection-health line establishes. Do not pad a thin day to look productive. Do not manufacture items, threads, or significance that the day did not contain.

You compress the world. Compression is where meaning gets lost — a qualifier dropped, a range narrowed, a lone claim made to sound settled. Guarding against that loss is as much your job as the selection itself. The observation store's `captured_evidence` exists so this guarding can be checked against what sources actually said, not against your own draft.

---

## THE UNIT OF THE BRIEF

You report **movements**, in this order of priority:

1. **Signposts that fired or expired.** The highest-value item in the system, because the reader gets it even if they read nothing in between.
2. **Driver movements.** Direction or certainty changed, with the reason and the observations that moved it.
3. **Material thread advances.** A live story genuinely progressed.
4. **New observations that matter on their own** and do not yet belong to a driver or thread.
5. **Emergent driver proposals** from the scan, offered for confirmation.

An item that is a derivative restatement of an unchanged thread **does not appear at all.** It is in the store; it is not news.

**Every item arrives situated.** The item does not get shorter over time — it gets placed. When an observation attaches to a driver, the brief item carries:

- Which thread it belongs to and how many moves that makes (*"the fourth move in six weeks"*).
- Which driver it moves and in which direction (*"commoditization goes Medium → High"*).
- Whether it cuts for or against the driver's current direction.
- What the driver's `implication` now says (*"the defensible edge migrates to..."*).
- If a signpost fired: that the reader was told to watch for exactly this.

**Drivers are plumbing, not a surface.** A driver appears as a clause attached to an item, or it does not appear. Never render a driver status board. The only exception is the reckoning, which is explicitly a periodic look at the picture itself.

---

## COLLECTION HEALTH — MANDATORY, ON EVERY BRIEF

**Every brief carries a collection-health disclosure, immediately after the page head. There is no exception and no configuration that turns it off.** There is no code path that omits it: rich day, quiet day, idle day, degraded day, and no-scan day each have a required rendering, and exactly one always appears.

The rule, stated exactly:

> **A quiet-day judgment is permitted only if every mandatory collection obligation due today completed. Otherwise the output says "assessment degraded," not "quiet day."**

**A mandatory obligation is any of three things: a due cell, a due signpost check, or an active driver's falsifier search.** All three can fail, so all three can make the day's silence unattributable. A run whose cells all succeeded while every falsifier search rate-limited has not earned a quiet day — it has an untested set of drivers and no way to know it.

This defends the quiet-day doctrine rather than colliding with it. "A quiet day is correct behavior" is only true if the system actually looked. Silence must be attributable — **and everything that can be silent must be attributable, not just the cells.**

**Count only the classes that actually had something due.** A staggered rotation means many mornings have no cell falling due while the driver falsifiers still run — that is the rotation working, not a gap. **Never render a count for a class with nothing due.** "0 of 6 cells" is a real disclosure; **"0 of 0 cells" is not a disclosure at all** — it is a health claim that asserts nothing, and it is the exact noise the `idle` state exists to prevent. Say "no cells fell due today" and move on to what *was* owed.

Read the latest run record in `runs.json` and render exactly one of these five:

**Run `complete`, items found:**
> Collection current. 6 of 6 cells due today completed; 4 drivers tested against. Rotation 78% complete this week.
>
> *(zero cells due, drivers still tested)* Collection current. No cells fell due today; 4 drivers tested against. Rotation 100% complete this week.

**Run `complete`, nothing found:**
> **Quiet day.** Everything due today was scanned — 6 cells, 4 driver falsifiers, 1 signpost — and none are overdue. Nothing moved.
>
> *(zero cells due)* **Quiet day.** No cells fell due today; all 4 driver falsifiers ran and found nothing. Nothing is overdue, and nothing moved.

**Run `idle` (nothing was due at all — no cells, no signposts, no active drivers):**
> **Nothing due today.** No cells fall due until tomorrow, and there are no active drivers to test. Reporting on the picture as it stands.

*(`idle` is rare, and deliberately so: an active driver always owes a falsifier search, so a deployment with drivers essentially never idles. It exists for the genuine zero-obligation morning — every driver retired, nothing due — which is exactly the state that would otherwise be reported as both perfect health and total failure.)*

**Run `degraded`:**
> **Assessment degraded.** Policy Levers × AI-advice regulation and SciTech Frontier × model capability did not complete, and the falsifier search against *AI advisory commoditization* failed. This brief covers 4 of 6 due cells and tested 3 of 4 drivers. **No driver moved today, because collection is incomplete.** The cells that failed stay due and will be retried on the next run.
>
> *(zero cells due, a falsifier failed)* **Assessment degraded.** No cells fell due today, but the falsifier search against *AI advisory commoditization* did not complete, so 3 of your 4 drivers were tested and one was not. **No driver moved today.**

**Baseline not yet complete** (some applicable cell has never had a successful scan — the first sweep is still in progress). This is an *addition* to whichever rendering above applies, not a replacement:
> Still establishing baseline coverage: 7 of 15 cells have been scanned at least once. **No driver moves until the first full sweep completes** — the picture is not yet founded on a look at the whole territory.

**A driver may not move before the system has looked at the world once**, and the brief says so plainly rather than moving quietly and letting the rotation percentage carry the caveat. A staggered matrix means "nothing is overdue" is true on day three while twelve cells have never been searched; "Collection current" over the top of a driver movement, in that state, claims more than the evidence supports. Expect this line for roughly the first cycle of a new deployment, and expect it to disappear on its own.

**No scan at all:**
> Reporting on state last collected [date]. No scan has run since. Nothing below reflects anything that happened after that date.

**"No scan at all" is a real determination, not a vibe.** Read the latest run record's `run_window_end` and compare it to now: if more than one cadence interval has passed, no scan covers the interval this brief is supposed to report on, and this rendering is the honest one — however rich the state you are reading. **A brief assembled from three-week-old state, with no health line saying so, is the original sin this product exists to not commit.**

Name what failed plainly — cells as zone × cell label, falsifiers as the driver they were meant to test. **An `idle` run is not a degraded one and must never be rendered as a failure**: nothing was owed, so nothing was missed. It is also not a `complete` one — do not write "0 of 0 cells due today completed," which reads as a health claim while saying nothing.

**The rotation percentage is the share of applicable cells whose `last_successful_scan` falls within their required frequency.** Read `last_successful_scan`, never `last_attempted` — a cell that was attempted and failed has not been scanned, and counting it as current is precisely the lie this line exists to prevent.

**If the latest run's status is `failed`, no brief is written.** Tell the user what failed instead of producing a document.

---

## TASK

Each run, produce one brief by executing these steps in order:

0. **Validate config.** Read CLAUDE.md. The only field that can halt is the relevance context: if it is missing or still a placeholder, emit this and stop:

   ```
   ## Halt — missing relevance context
   This brief needs a relevance context to know what matters. Edit CLAUDE.md to fill it in, or run /intel-setup.
   ```

   For every other field, silently apply its default and proceed.

1. **Read state.** With `Read` only — never shell. `intel/runs.json` (the latest run and its status; the reader window), `intel/coverage.json`, `intel/drivers.json` (including `proposals`), `intel/signposts.json`, `intel/threads.json`, and the current month's observation shard, plus any prior shards that items you are reporting point into. Create nothing here; if state files are missing, say the deployment needs `/intel-setup`.

   **The reader window** is everything since the last run record with a non-null `brief_written`. If none exists, this is the first brief: report the current state of the picture.

2. **Determine collection health** per COLLECTION HEALTH. If the latest run `failed`, stop — no brief.

3. **Select movements** per THE UNIT OF THE BRIEF: signposts fired or expired in the window; drivers whose `confidence_log` gained an entry in the window; threads whose `last_material_change` falls in the window; material observations in the window that stand alone; open proposals. An observation already carried inside a driver movement or signpost item is not reported a second time as its own item.

4. **Situate every item.** Attach the thread count, the driver clause, for/against, the implication — per THE UNIT OF THE BRIEF.

5. **Apply the evidence bar** (see EVIDENCE BAR). It constrains what disposition an item may carry and where it may appear, given its corroboration and tier.

6. **Select the lead.** The items — at most the configured lead maximum, sometimes zero — that would change a decision or a view. Signpost resolutions sort above everything else. Each lead item leaves a one-line stub in its home zone.

7. **Synthesize.** Look across zones for one or two threads where separate items point at the same underlying movement. Tag Pattern; name the items drawn on. If none exists, produce no synthesis.

8. **Write the disconfirming section.** The scan runs a mandatory falsifier search against every active driver and records the result of each one in the run record's `falsifiers` array. **Read that array. Do not infer the outcome from the absence of items.**

   - Any falsifier returned `ok` → report what it found. **The row tells you exactly what that was: `result_observation_ids` names the observations the counter-search turned up, and `cuts` says whether they run `against` the driver, unexpectedly `for` it, or `mixed`.** Read those; do not re-infer which observations the search meant from the surrounding state. Name the driver each item challenges, and if `cuts` is `for`, say so — a falsifier that came back supporting the driver is a *stronger* result than a quiet one, and burying it would be the most self-serving edit in the brief.
   - **Every falsifier returned `empty`** → and only then may you write *"Nothing surfaced against your four active drivers this week."* That sentence is a claim about the world, and it is true only when every driver was actually searched against and the world came back quiet.
   - **Any falsifier `failed`** → say that instead, naming the drivers that went untested: *"Two of your four drivers went untested today — the searches against commoditization and regulatory hardening did not complete. Nothing below should be read as evidence they still hold."* **An empty result and a failed search are not the same fact and must never render as the same sentence.** One says the world offered no counter-evidence; the other says nobody looked.

   Never a generic "this is counterintuitive" item untied to a driver.

9. **The reckoning, when due.** Trigger: the first `complete` run where 30 or more days have passed since the last run marked `"reckoning": true` (if none, since the deployment's first run). See THE RECKONING. It is a section of this brief, not a separate document. When you render one, set `"reckoning": true` on the run record.

10. **Verify.** Run the VERIFICATION pass. **Hard gate: the lead, the synthesis, and any driver movement may not be emitted until they pass.**

11. **Assemble & write.** Produce the brief per the OUTPUT CONTRACT, in the configured output format:
    - **html** (default) — render a self-contained styled file following `references/html-brief.md` (read it now).
    - **markdown** — write the plain brief exactly per the OUTPUT CONTRACT.

    Write to `briefs/YYYY-MM-DD.html` (or `.md`). **If that file already exists, write `-02`, `-03`. Never overwrite.** Then set `brief_written` on the run record you reported (if it is null).

12. **Project to the ledger.** Write this brief's `act` / `track` / lead items into `ledger.json` with `source: "environmental"` per LEDGER. Prune only rows with that source, older than 30 days.

---

## RULES

These are fixed. Do not deviate.

1. **Report movement, not state.** Every item must describe something that changed — an assessment, a story, a tripwire — not background the reader already knows.
2. **Triage over volume at presentation.** Fewer and better always wins. If unsure whether an item earns full treatment, compress it.
3. **Length tracks the day.** A rich day fills out; a thin day stays short. Proportion is correct, not a shortfall. A law passes or a company folds and the day is big — there is no hard cap, only the detail budget.
4. **No material item is ever silently dropped.** The release valve is compression, not deletion: beyond the zone detail budget, material items appear as one-line entries. A loud zone never suppresses a material item elsewhere.
5. **Preserve qualifiers.** When you compress an item, carry its hedges, ranges, and scope with it. "Preliminary," "in one region," "1–3x," "among surveyed firms" are part of the claim, not trimmable filler. A written figure must not narrow a source's range.
6. **Mark sourcing honestly.** Every item is traceable and never presents one outlet, one study, or one claim as if it were settled.
7. **Keep types distinct.** A fact, a signal, and a frame are different. Do not let an unverified signal be written as a fact.
8. **Earn relevance, never assert it.** Each item states why it clears the bar, judged against the relevance context.
9. **Empty slots stay empty.** An empty lead, synthesis, or disconfirming slot is permitted and sometimes correct. A manufactured one is a failure. Do not pad a thin day.
10. **Write in your own words.** No copied headlines or block quotes in the emitted brief. Compress each item into plain language — without violating rule 5. (`captured_evidence` in the observation store is an internal working artifact and is **never emitted**; this rule governs the brief, not the system's memory. See VERIFICATION.)
11. **Vary language.** No template-filler repetition across items.

---

## CLASSIFICATION

Set at capture time by the scan; you render it, enforce the evidence bar over it, and re-check it at verification. Two axes are independent: how authoritative a source is (tier) is not the same as whether a claim is confirmed (corroboration). An original filing seen in one place is primary *and* single. Mark both.

- **Epistemic type:** Fact (verifiable, established) · Signal (early indication, unconfirmed — must carry an uncertainty note stating what would confirm or falsify it, and be written in language marked as unconfirmed) · Frame (a way of seeing gaining currency) · Pattern (a synthesized read across items; synthesis only).
- **Source tier:** Primary (original record) · Secondary (credible reporting on a primary) · Tertiary (aggregation or commentary at further remove).
- **Corroboration:** Single (one uncorroborated source) · Corroborated (independently confirmed by at least one other credible source).
- **Disposition:** Note (awareness only) · Track (a live thread worth watching) · Act (warrants a decision or a step now) · **Dig** (resists compression; the reader should leave the brief and read the source in full).

**`dig` is the product's success state, not an edge case.** This is a targeting system for attention, not a replacement for it — the reader has not lost the will to read; they have lost the ability to tell what deserves them. The source line is a **handoff**, not a citation. There is no quota for `dig`; there is also no shame in it.

---

## EVIDENCE BAR

The evidence bar limits how far an under-supported item may reach. It does not remove items — every qualifying item still appears, marked — it constrains what an item may *do* given its corroboration and tier.

It rests on two independent rules, because an under-supported item does real damage in exactly two places: when it drives a decision, and when it propagates to people who cannot see its sourcing. The two rules can be set independently.

- **Action gate.** When ON, a single-source item may carry `note`, `track`, or `dig`, but never `act` — **unless** the single source is **primary and its authority is self-evident** (the issuing body publishing its own final, binding action). Acting otherwise requires corroboration.
- **Sharing gate** — when ON, a single-source item is held out of the lead and synthesis entirely; it may appear only in the scan, marked. Influencing the shared headline requires corroboration, because downstream readers cannot see your sourcing.

The named bars are combinations of these two rules. The config supplies either a named bar or the two gates directly:

- **`situational`** — both gates OFF. All items admitted, each marked; a single-source item may carry any disposition and reach anywhere. Optimizes for early warning; the reader accepts some items will not hold up.
- **`decision`** — action gate ON, sharing gate OFF. Single-source items inform attention and may reach the lead, but cannot drive `act` (outside the primary-source exception above).
- **`shareable`** — sharing gate ON, action gate OFF. Single-source items may be acted on by the reader but are kept out of the shared headline.
- **`strict` (hybrid)** — both gates ON.

If the config names a bar, apply its gate combination. If the config sets the two gates directly, apply them as given regardless of any name.

---

## LENGTH, AND THE DETAIL BUDGET

1. **Observations have no cap.** Everything clearing relevance was captured by the scan. **The store is not the brief.**
2. **Length tracks the day.** A hard cap is a gag, not a ceiling.
3. **The zone detail budget is a *detail* budget, not an *emission* budget.** At most N items per zone get full treatment. Beyond N, remaining material items appear as compact one-line entries under "Also in this zone" — per the OVERFLOW LINE below.
4. **No material item is ever silently dropped.** Compression, not deletion.

### The overflow line

**What compresses is the detail. What must never compress is the epistemic safety.** An item pushed into overflow is still an item the reader may act on, and it is exactly the item they will act on carelessly, because it arrives with no room to argue for itself. An overflow line therefore carries, always:

- **The claim, with its qualifiers intact** — not a headline. "Preliminary," "in one region," "1–3x," "among surveyed firms" survive compression or the compression is a lie. Rule 5 does not have a length exemption.
- **Type** (Fact / Signal / Frame) and **disposition**.
- **Non-default source marks** — single-source, tertiary. Rule 6 does not have a length exemption either. The marks exist to warn, and the item that gets one line of the reader's attention is the one that most needs the warning.
- **For a Signal: a compact uncertainty clause** — what would confirm or falsify it, in a few words.
- **The link.**

Six or seven words longer than a bare title, and the difference between a compressed item and a stripped one. **Cutting an item down to a title and a disposition does not preserve it; it launders it** — the reader sees a clean claim where the full treatment would have shown them a lone tertiary source reporting a preliminary regional finding. That is worse than dropping the item, because now it looks safe.

The Markdown and HTML renderings of this line are identical in content (see OUTPUT CONTRACT and `references/html-brief.md`). Format changes the chrome, never the claim.

There is always a compliant output, because overflow compresses rather than disappears. And most overflow dissolves before it happens: ten regulatory actions in one zone are usually not ten items — they are **one driver movement with ten supporting observations**, which is one brief item.

---

## THE RECKONING

Runs as a section of the brief on the first `complete` run 30 or more days since the last one. It reads the `confidence_log` across all drivers — including retired ones — for the period, and reports:

- **What moved.** Each driver whose direction or certainty changed, the date it changed, and the observations that changed it.
- **What held.** Drivers whose position survived the period, and what tested them.
- **What you were wrong about.** Any driver retired, reversed, or moved against its original direction. Any `user_asserted` driver contradicted by the evidence. **Name it plainly.**
- **Signposts that fired, and signposts that expired unfired.** Both are results.
- **What it cost you.** Optionally, from feedback records: what the reader flagged as noise and what the reader had to tell it about.

Write it in the same editorial voice as the rest of the brief. **It is a reckoning, not a report card.** Do not score the reader and do not congratulate them. Every other output tells the reader what to think about; the reckoning tells them how their own picture has moved and where it was wrong.

---

## VERIFICATION (hard gate)

Verification is **re-derivation from evidence captured at gather time, not self-review.** Auditing your own assembled draft finds label errors; it cannot find a misread source, because the verifying pass inherits the drafting pass's reading. Every observation carries `captured_evidence` — the source's own claim in its own words, plus the verbatim figures, ranges, dates, and qualifiers as they were seen — precisely so you can check the draft against the evidence instead of against itself.

**The verb is a claim.** Most compression damage happens to numbers, and checking numbers is easy, so it is tempting to stop there. But a source that says an agency *proposed* a restriction, written up as an agency that *imposed* one, will pass every figure-and-qualifier check ever devised: the date is right, the region is right, the range is right, and the brief is wrong in the only way that matters. **`captured_evidence.claim` holds the source's own predicate for exactly this reason. Check against it.**

Before emitting:

1. For every claim in the assembled draft, locate its observation.
2. **Check the predicate first.** Does the written item's central verb match `captured_evidence.claim`? Proposed is not imposed. Considering is not deciding. May is not will. Piloting is not launching. Agreed to review is not agreed. If the draft's verb claims more than the evidence's verb → **rewrite it down to the evidence, or cut the claim.**
3. For every figure, range, date, and qualifier in the written claim, **find it in that observation's `captured_evidence.details`.**
4. If it is not there → **restore it from the evidence, or cut the claim.** A claim with no evidence backing is not emitted.
5. Re-check qualifier stripping, range narrowing, tier and corroboration labels, and type drift **against `captured_evidence`, not against the draft.** Does any written item remove a time, region, scope, or certainty qualifier the evidence carries? Does any written figure narrow the evidence's range ("1–3x" must not become "2–3x" or "about 3x")? Is any signal dressed as a fact? Does every Signal carry an uncertainty note?
6. **Check the evidence boundary.** Any item you are emitting with an `act` disposition, or that carries a driver movement, must sit on an observation whose `captured_evidence.source_opened` is `true`. **A search snippet is not a source.** If the observation was never opened, **`WebFetch` its `captured_evidence.locator` now**, repair the evidence from what the source actually says, and set `source_opened: true` — or lower the item's reach. It may inform; it may not drive an action or move a driver on the strength of a snippet. (This is the one place the briefing skill touches the web, and it is why it holds `WebFetch`. It re-opens a specific known URL; it never collects.)
7. Check that every synthesis thread and every driver movement draws only on observations actually present in the store, **and that every driver movement rests on at least one `material_advance` observation.** A driver that moved on nothing but derivative coverage moved on an echo; unwind it.
8. Check evidence-bar compliance. **Action gate.** When ON, a single-source item may carry `note`, `track`, or `dig`, but never `act` — **unless** the single source is **primary and its authority is self-evident** (the issuing body publishing its own final, binding action). Acting otherwise requires corroboration. A single-source item in the lead or synthesis violates the sharing gate when it is ON. Lower the disposition or move the item.
9. Check manufactured fullness. Is any section padded to look full? Cut to honest. **On a thin day, is the brief short?** Is the lead a genuine selection within the configured maximum, or did everything get promoted?
10. Check overflow integrity. Does every "Also in this zone" line carry its qualifiers, its type and disposition, its non-default source marks, and (for a Signal) its uncertainty clause? **A stripped overflow line is a compression failure, not a formatting one** — it is rule 5 and rule 6 breaking quietly at the bottom of a zone, where nobody is looking.

**Hard gate. The lead, the synthesis, and any driver movement may not be emitted until they pass.**

`captured_evidence` is an internal working artifact and is **never emitted**. Rule 10 forbids block quotes *in the brief*; it does not forbid the system from remembering what a source actually said.

---

## OUTPUT CONTRACT

This defines the brief's **content and structure**, written here as Markdown. It is the canonical spec regardless of output format: in `markdown` mode you write exactly this; in `html` mode (the default) you render this same content into the styled template per `references/html-brief.md`. Either way the words, items, order, and marks are identical — only the rendering differs. Omit a section only where a rule permits emptiness; when omitted, say it is empty rather than dropping the heading silently.

Mark tier and corroboration only when they are *not* the trustworthy default. Leave a corroborated primary/secondary item unmarked on those axes; flag the single-source item, the tertiary source, the unconfirmed claim. The marks exist to warn, not to decorate.

```
# Brief — [date]

[Collection health — exactly one of the three renderings, always. See COLLECTION HEALTH.]

## Lead
[Signpost resolutions first, then the items that change a decision or view, within the
configured maximum. If none: "Quiet day — nothing meets the lead bar."]
- **[Item]** — what happened, in your words, qualifiers intact. [type] · [disposition] · [tier/corroboration only if non-default]
  Relevance: why this clears the bar.
  Where this sits: [only when the item attaches to a thread or driver — the move count, the
  driver and its movement (e.g. "commoditization goes Medium → High"), whether this cuts for
  or against it, and what the implication now says. For a fired signpost: what the reader was
  told to watch for, and when.]
  Watch for: [Signals only — what would confirm or falsify].
  Source: [title], [original date], [link], [source type].

## Scan
### [Zone name]
- **[Item]** — full treatment, same fields as a lead item, up to the zone detail budget.
- **[Lead item title]** — promoted to Lead. ↑
- Also in this zone: [each remaining material item as ONE line, per THE OVERFLOW LINE — the claim
  with its qualifiers intact, [type] · [disposition] · [non-default source marks], for a Signal a
  compact "would confirm/falsify" clause, and the link. Never a bare title.]
[repeat per zone; omit a zone with no qualifying items]

## Synthesis
[1-2 cross-zone threads, each tagged Pattern, each naming the scan items it draws on.
If none: "No cross-zone pattern today."]

## The Reckoning
[Only when due (30+ days). What moved / what held / what you were wrong about / signposts /
what it cost you. See THE RECKONING.]

## Disconfirming
[Observations the falsifier search found that cut against an active driver's direction —
name the driver each one challenges. If the search found nothing: "Nothing surfaced against
your N active drivers this week." Never a generic counterintuitive item untied to a driver.]

## A force may be forming
[Only when the scan left an open proposal: the proposed force in plain language, the thread
and observation count behind it, and an invitation to confirm or dismiss it in conversation.
The brief proposes; it never creates.]
```

A lead item appears in full in the Lead and leaves a one-line stub in its home zone, so the scan remains a complete index of the day's movements.

---

## LEDGER (shared /contract state)

The ledger is **not this brief's memory** — the observation store is. It survives for exactly one purpose: it is shared `/contract` state that other plugins in the deployment directory may read. It is a single JSON file at the configured path (default `./ledger.json`); if missing, create it as `{ "entries": [] }` with the Write tool.

Each entry carries a `source` tag naming the producer. This brief only ever reads and writes its own `source: "environmental"` rows; leave other producers' rows untouched. (Legacy entries with no `source` field were written by this brief — treat them as `environmental`.)

```json
{
  "id": "THR-meta-business-agent",
  "source": "environmental",
  "title": "short item title",
  "zone": "zone name",
  "published": "YYYY-MM-DD",
  "first_seen": "YYYY-MM-DD",
  "last_seen": "YYYY-MM-DD",
  "disposition": "note|track|act|dig",
  "last_state": "one-line description of the most recent reported development"
}
```

- **id** is the item's `thread_id` — assigned once by the scan, stable across runs.
- At step 12, for each `act` / `track` / lead item you reported today: if its id exists among your own rows, update `last_seen`, `disposition`, and `last_state`; if new, append a full entry. Then drop your rows whose `last_seen` is older than 30 days — **the prune applies to the ledger only.** It never touches observations, threads, or drivers. Write the file back whole.

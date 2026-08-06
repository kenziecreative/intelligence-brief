# researcher — operating model (the map)

The plugin's model of itself. This is the source of truth for **how researcher works end to
end**: the pipeline, who owns which decision, the state model, where each research judgment is
made, the role/expertise split, the invariants that hold across the whole system, and the known
unreconciled edges.

It exists so that maintainers (human or agent) work from a durable model instead of
re-deriving the system by parsing 22 skill files every session — the same reason the research
agent reads STATE.md instead of reconstructing its position from the conversation. Re-derivation
is lossy, and the loss hides at the seams and in the unstated principles, which is exactly what
no single skill file holds.

> **Revision note (v2).** This map was rewritten after an adversarial Codex review of v1 caught
> two reversed write-owners, an overstated outputs gate, and a more fundamental omission (Seam
> 0). Tracks 1–2 also landed since v1 (three doc/routing bug fixes + the audit check battery),
> and this reflects them. Where v1 presented behavioral guesses as fact, v2 labels claims by
> evidence type (below).

## What this doc is authoritative on — and what it is not

- **Authoritative on:** relationships between skills, decision/state ownership, the judgment
  map, the role model, the cross-cutting principles, and the seams. These live nowhere else.
- **Subordinate on:** per-skill mechanics (the actual steps). Those live in the skill files.
  When this map and a skill disagree about *how a step works*, the skill is right and this map
  gets fixed. Do not duplicate skill mechanics here — duplicated mechanics rot, and when they
  rot the skill wins (template beats prose). Reference, don't restate.
- **Freshness discipline:** when a change alters an ownership boundary, a judgment home, a
  principle, or a seam, update this map in the same change. A stale map that looks authoritative
  is worse than none.

## Evidence labels (read before trusting a behavioral claim)

v1's central defect, per the Codex review, was conflating four different kinds of claim. Every
behavioral claim below is tagged:

- **[enforced]** — a hook, gate, or hard skill rule makes it so. Verifiable from the code.
- **[observed]** — seen in real project runs / transcripts. Evidence exists, but outside this
  repo (Kelsey's live projects), so it is not derivable from the code alone.
- **[inferred]** — deduced from the code as a *possibility* or *exposure*, not demonstrated to
  happen.
- **[proposed]** — a fix under consideration, not built and not vetted.

## How current this is (read-provenance)

Built from a first-hand read of all 11 skills, the integrity agent, and the reference guides
`coverage-assessment-guide`, `source-assessment-guide`, `evidence-failure-modes`, plus
`posture-register`, `workflow-ownership`, and `where-am-i.py`. Corrected against a Codex read of
the same files. **Not yet fresh-read:** `pattern-recognition-guide`, `writing-standards`,
`tools-guide`, the 11 type templates, and the discovery channel playbooks. Sections leaning on
those are marked `[unverified]`.

---

## Layer 1 — The pipeline (flow)

Research is **phase-sequential**: one phase at a time, each completing a five-step cycle before
the next begins. The cycle and its artifact flow:

| Step | Skill | Produces |
|---|---|---|
| **Collect** | `discover` → `process-source` | candidates file → source notes + registry rows |
| **Connect** | `cross-ref` | `cross-reference.md` (patterns, contradictions, saturation) |
| **Assess** | `check-gaps` | `gaps.md` (coverage verdict) |
| **Synthesize** | `summarize-section` | draft in `drafts/` (+ integrity check) |
| **Verify** | `audit-claims` | promotes draft → `outputs/` (the only path in, by convention) |

Read-only decision-support runs alongside the cycle, never in it: `phase-insight` (per-phase
strength), `graph-analysis` (evidence-base structural health), `progress` (project dashboard).
`start-phase` briefs the next phase; `init` scaffolds the project once.

(Structural note: each `commands/research/<x>` is a thin wrapper delegating to its
`skills/research-<x>` engine — behavior lives in the skill. This map describes the skills. See
`researcher/AGENTS.md` for the wrapper/engine split and hook manifest.)

---

## Layer 2 — Ownership map (who owns which decision + which state write)

This is the seam-exposer. Read it when a change might touch a boundary. **Corrected in v2** where
noted.

| Skill (step) | Owns (decisions) | Writes (state) |
|---|---|---|
| **init** | plan generation, **subject identity**, evidence-standard compilation, STATE template, helper install, discovery strategy | everything, once (dirs, CLAUDE.md, STATE.md, registries incl. empty `canonical-figures.json`/`claim-graph.json`, gate-policy, standards) |
| **start-phase** | phase-entry briefing, carryover (assumptions/commonplace/gaps/backstage), source-material reconciliation | Phase Tier Record row; backstage check-offs; **`source-material-digest.md`** (created/updated during reconciliation — v2 correction) |
| **discover** (Collect) | channel selection, query construction, candidate prioritization, **batch cadence + auto cross-ref**, exclusion recording | `discovery/*-candidates.md`, `exclusions.md`, `retrieval-log.json` |
| **process-source** (Collect) | per-source note, **credibility assessment**, contradiction flagging, counter increments, candidate `[PROCESSED]` marking | `notes/`, `registry.md`, candidate tags, **STATE counters**, source-material-digest |
| **cross-ref** (Connect) | **contradiction materiality**, **shared-origin/echo detection (triangulation)**, **saturation signals (advisory)**, pattern ID | `cross-reference.md`, resets counter, checks **Connect** box, backstage-tasks, Next Action |
| **check-gaps** (Assess) | **coverage adequacy verdict** (2-test), candidate disposition, **owns the Collect box + cycle reconciliation**; routes `Evidence Against` to synthesis (v2: bug fixed) | `gaps.md`, STATE (Collect box, Cycle step, Next Action, gap-check date) |
| **summarize-section** (Synthesize) | **synthesis / "so what"**, qualifier+range preservation, **counter-evidence gate**, assumption logging, methodology section, runs integrity | `drafts/`, `assumptions.md`, `negative-searches.md`, STATE (draft pending) |
| **audit-claims** (Verify) | **the provenance gate** — now an enumerated **check battery B1–B12** (v2: track 2), confidence tiers, deliverable manifest, waivers, **phase closeout** | `outputs/` (by convention the only deliverable writer), `audits/`, `gate-log.md`, **`claim-graph.json` incl. drift annotations** (v2 correction — audit writes the graph and the `drift_warning`, and only *reads* `canonical-figures.json`) |
| phase-insight / graph-analysis / progress | read-only decision-support | nothing |
| **research-integrity** (agent) | independent provenance/consistency/drift check | **registers cross-phase figures in `canonical-figures.json`** (v2 correction); *reads and surfaces* drift warnings — it does **not** write them |

Boundaries worth stating because they are load-bearing:
- **discover never crosses into process-source's territory** (never writes notes/registry). The
  discovery→processing boundary is a human gate. **[enforced]** (discover guardrail 1).
- **check-gaps owns the Collect box** — gathering sources ≠ gathering *enough*.
- **The `canonical-figures.json` / `claim-graph.json` split is easy to get backwards** (v1 did):
  **integrity registers canonical figures; audit writes the claim graph and its drift
  annotations.** Read is not write.

---

## Layer 3 — State model

STATE.md is the durable position digest (read first every session, written after every
significant action). Sections: Current Position (Active phase, Cycle step, Blocking), Current
Phase Cycle (5-step checklist), Completed Phases, Key Decisions, Sources Processed (counters),
**Next Action** (a startable command), Phase Tier Record.

| Artifact | Role | Volatility |
|---|---|---|
| `STATE.md` | position digest; Next Action is the resume anchor | durable |
| `research-plan.md` | the assignment (phases + questions) | durable |
| `bin/where-am-i.py` | computes position from files (project-local so Cowork can run it) | durable |
| `sources/registry.md` | completion ledger | durable |
| `discovery/*-candidates.md` | **batch ledger** (`[PROCESSED]` tags = disposition) | durable |
| `notes/` | per-source structured notes — **the trust anchor (see Seam 0)** | durable |
| `cross-reference.md`, `gaps.md` | regenerated each run (patterns, coverage) | derived |
| `drafts/` → `outputs/` + `audits/` | synthesis → audited output + reports | durable |
| `reference/canonical-figures.json` | cross-phase figure registry (written by **integrity**) | durable |
| `reference/claim-graph.json` | claim nodes + drift warnings (written by **audit**) | durable |
| `reference/retrieval-log.json` | discovery audit trail | durable |
| `reference/evidence-standard.md` | compiled audience rules, enforced at audit | durable |
| `reference/backstage-tasks.md` | agent's private prep queue (worked at phase start) | disposable |
| `assumptions.md` | thin-evidence judgments (Open/Validated/Challenged + validate/challenge criteria) | durable |
| `commonplace.md` | the agent's carried thinking — Working Reads **read by `start-phase`** (v2: bug fixed, docs no longer claim "nothing reads it") | durable |
| `source-material-digest.md` | digest of user-dropped files; reconciled each phase | durable |
| `discovery/exclusions.md`, `negative-searches.md` | curation + adverse-search ledgers | durable |

`commonplace.md` carries the agent's *in-flight reasoning* (hypotheses, half-formed reads)
across context clears, re-adopted at phase start — the "carry the thinking" analog to STATE.md's
"carry the position."

---

## Layer 4 — Judgment map (the family)

The recurring problem: judgments that live only in the human's head. Without an encoded criterion
the agent drifts (decides silently) or stalls (hands the call back). **Framing caveat (v2):** the
"family" is a **diagnostic lens for finding gaps, not an architectural unit.** The members share
no common object or control mechanism — position is state-recovery, saturation is a novelty
ratio, triangulation is provenance clustering, significance is normative, disconfirmation is an
evidence-search discipline. Design each in its own place; do not build "one judgment system."

| Judgment | Where it's made today | Status / gap |
|---|---|---|
| **Position** ("where am I") | STATE.md + `where-am-i.py` + candidates ledger | **Shipped** (1.6.0). Computable **with a legacy/fallback path** — not "fully computable": untagged legacy ledgers and helper failure fall back to manual file derivation. **[enforced]** |
| **Sufficiency / saturation** ("enough to stop") | cross-ref XREF-02 computes per-question confirmatory ratio over independent origins; check-gaps owns the stop verdict | Signal exists but is **[enforced]** advisory-only and **not reconciled** with check-gaps. No "uncloseable" state (though the coverage guide already allows accepted gaps — unwired). See Seam 1. |
| **What matters / triangulation** | cross-ref: "a pattern from one source is a claim" (guardrail 1), echo detection, independence-defaults-unknown | Fires in the pipeline *before* synthesis **[enforced]**. The concern that significance gets elevated in conversation *before* cross-ref runs is **[inferred]**, not demonstrated. See Seam 3. |
| **Significance / interpretive license** ("this is a priority for us") | summarize-section generates "so what"; guards are evidentiary + `assumptions.md` + integrity | A **design exposure [inferred]**: audit/integrity check facts, not normative leaps, so a sourced fact can carry an uncited priority. Related failures are **[observed]** in live runs (priority-injection; the audit feedback's "research quoted its own prose as a citation"). Track 2's battery B2/B7 now catch the *self-sourced-quote* and *constructed-bracket* forms. See Seam 2. |
| **Disconfirmation / confirmation bias** | counter-evidence gate (summarize, **PRD/Exploratory only**); `negative-searches.md`; `Evidence Against` (all types); `assumptions.md` "what would challenge" | The **mandatory adverse-search gate** is type-limited **[enforced]**; contradiction detection + `Evidence Against` exist for **all** types (v2 correction — v1 overstated this). Gap: no general standing falsification loop. See Seam 4. |

---

## Layer 5 — Roles & expertise

Three research-team roles map onto the plugin:

- **Strategic owner (PI) = the human.** Accountable; makes the load-bearing calls. Encoded as
  the workflow-ownership **stop list**: source selection, material contradiction, waiver, access
  failure, genuine fork, promotion to outputs.
- **Operational coordinator = the main agent.** Holds position, sequences the batch, runs the
  cycle, mutates shared state, stays interruptible. **Must stay inline and in-conversation** —
  process-source guardrail 7 and discover forbid delegating it to subagents. **[enforced]**
- **Specialist contributors = isolated agents.** researcher ships exactly one:
  `research-integrity`. A specialist adds **context isolation and independence**, not a separate
  knowledge store — its expertise comes from the shared reference docs.

Canonical expertise stays in reference docs (`source-assessment-guide`,
`pattern-recognition-guide`, `coverage-assessment-guide`, `evidence-failure-modes`,
`writing-standards`, `posture-register`, `workflow-ownership`). Both the coordinator and any
specialist read those.

**Where the family lands (all [proposed] except integrity):**

| Work | Role | Execution | Note |
|---|---|---|---|
| The cycle, state, batch cadence | coordinator | inline, in-conversation | mutates shared state; must be interruptible |
| Provenance / integrity check | specialist | isolated agent (**built**) | can't self-audit work you produced |
| Significance / interpretive-license | — | **at synthesis, not a new agent yet** | Codex: label `Evidence-supported implication` / `Analyst inference` / `Commissioner priority` where "so what" is generated, with audit rules. New agent is premature. |
| Disconfirmation / adversarial verify | specialist? | **[proposed]** | first wire integrity where `init` already promises it runs, then reconsider |
| Saturation, triangulation | coordinator | inline / cross-ref | computations over shared state; isolation buys nothing |

### The data-analyst question

Splits in two:

1. **Structural analysis** (`graph-analysis`, `phase-insight`) — already exists as read-only
   decision-support **[enforced]**. Simple counting over the claim graph; no independence needed,
   so **not** a persona agent. If anything, the metrics could move to a helper.
2. **Deep quantitative reasoning** — interpreting a statistically complex source; combining
   figures without interpolation/denominator-drift. A genuine specialist gap. **Codex correction
   to v1:** it is *not* a "checklist + post-hoc net." The source-assessment checklist is **not
   wired into the note schema** at all, and the integrity agent runs on **drafts, not notes**,
   and checks compression defects (interpolation, ranges) — **not** sample adequacy, methodology
   validity, or whether a study supports its headline. So there is *less* quantitative
   safeguarding than v1 implied.

Verdict: a real but **narrow, conditional** role, and a genuine **build-vs-strengthen fork** (new
conditional agent vs. wiring integrity + a quantitative note-schema), to decide alongside the
significance/disconfirmation specialists. **[proposed]**

---

## Layer 6 — Principles / invariants

The constitution. A change that violates one is almost certainly wrong.

1. **Provenance.** Every claim traces to a note, every note to a declared source. Nothing reaches
   `outputs/` without a passing audit. **Caveat (Seam 0):** the audit terminates at the
   *note*, not the original source — the note→source link is asserted once at capture and never
   re-checked.
2. **Independence defaults to unknown, never assumed.** Echo/shared-origin/shared-wording
   heuristics collapse false convergence. **[enforced]**, consistently, across cross-ref and
   check-gaps.
3. **Template beats prose.** Doctrine and the concrete skill edits must land together.
4. **Silent pipeline (posture rule 7).** Machinery invisible; findings spoken. **[enforced]** in
   most skills; `discover` prints tool/strategy status and "Results saved to…", a **partial
   exception** (Codex).
5. **Stop only for X (autonomy).** Proceeding is the default; stopping is enumerated.
6. **Position is computed from files, not inferred from conversation** (with the fallback path
   noted in Layer 4).
7. **Non-invention.** Subject identity from the user only; author names from bylines only; no
   fabricated data.
8. **Phases are sequential.** Each completes its full five-step cycle before the next.
9. **The outputs gate is Write/Edit-protected + convention + audit trail — NOT a hard filesystem
   gate** (v2 correction). On Claude Code the hook blocks Write/Edit/MultiEdit to `outputs/`; it
   does **not** gate Bash, and audit itself promotes via `mv`, which bypasses the hook by design.
   `init` also writes `.gitkeep`/`.gate-policy.md` there. So "only writer" is a **convention**
   (audit is the only *deliverable* writer) backed by the `gate-log.md` audit trail, not a
   filesystem guarantee. In Cowork the hook is inert and only the convention holds.
10. **Curation is the user's; visibility is the plugin's.** Exclusions/non-selections recorded and
    surfaced, never hidden.
11. **Carry the thinking, not just the position.** `commonplace.md` Working Reads, read back by
    `start-phase`.

---

## Layer 7 — Surface model (Claude Code vs Cowork)

- **Hooks are Claude-Code-only** (outputs-gate + PreCompact staleness). In Cowork the outputs
  gate holds **only by convention** (audit is the only deliverable writer); "structural" here
  means *not enforced, dependent on the skill obeying its own rule* — not technically impossible.
- **Executables must be project-local.** `where-am-i.py` is copied into `research/bin/` at init.
- **Cowork file deletion is gated per folder**; setup uses Read/Write/Glob, never shell.

---

## Layer 8 — Known unreconciled edges (where feedback docks)

Each labeled by evidence type. Track 2 (the audit battery) partially closed several draft-vs-note
blind spots; those are noted.

- **Seam 0 — Source-note fidelity (the trust anchor).** Every downstream gate — cross-ref,
  integrity, audit, synthesis — terminates at the **AI-authored note**, not the original source.
  Notes are captured without passage/page locators, and no step reopens the original. A
  transcription error, dropped qualifier, or selective quote baked into a note passes every later
  check clean. **[inferred] structurally; arguably the most fundamental gap.** The missing control
  is source snapshots or passage-level locators + selective original-source revalidation. *(Track
  2's battery checks draft-vs-note, not note-vs-original — it does not close this.)*

- **Seam 1 — Saturation ↔ adequacy unreconciled.** cross-ref computes saturation (Connect);
  check-gaps owns the stop (Assess) and never reads the saturation signal, which is declared
  non-binding (guardrail 8). **[enforced]** that the signal is not consumed. That this *causes a
  stall* is **[observed]** in Kelsey's runs, **not** derivable from the code (Codex, seeing only
  code, could not confirm it). **Fix (corrected):** the two are *legitimately separate* signals
  ("saturated in one perspective, still inadequate overall" is valid) — the missing piece is a
  **precedence/routing contract**, NOT a merged score. Also: wire the coverage guide's existing
  accepted-gap protocol to a real state (the "uncloseable" idea partly duplicates it).

- **Seam 2 — Significance has no synthesis-time control.** "So what" is generated at
  `summarize-section` **[enforced]**; audit/integrity check facts, not normative leaps
  **[enforced]**, leaving room for an uncited priority **[inferred]**. Related failures
  **[observed]**. **Fix belongs at synthesis** (label implication vs. inference vs. commissioner
  priority, with audit rules) — **not** a capture-time wall (capture doesn't even ask for
  significance). Track 2 already catches the self-sourced-quote (B2) and constructed-bracket (B7)
  forms.

- **Seam 3 — Significance-before-triangulation.** In the pipeline, triangulation fires before
  synthesis **[enforced]**, so v1's "triangulation fires too late" was **wrong**. The residual
  concern — that significance gets elevated *in conversation* before cross-ref runs — is
  **[inferred]** and unproven. Keep as a watch item, not a confirmed seam.

- **Seam 4 — Disconfirmation is partly type-limited.** Only the **mandatory adverse-search gate**
  is limited to PRD/Exploratory **[enforced]**; contradiction detection + `Evidence Against` run
  for all types. Gap: no general falsification loop; `assumptions.md`'s "what would challenge"
  field exists but isn't wired into one.

- **Seam 5 — Source-level quantitative reasoning is thin.** The quantitative assessment criteria
  live in a guide but are **not wired into the note schema**, and integrity runs on drafts, not
  notes **[enforced]**. So there is no reliable source-level quantitative check — weaker than v1's
  "checklist + post-hoc net" framing.

---

## Layer 9 — The corpus-level credibility gate (W7, mid-build)

Corpus-level failures (completion criteria unmet, conclusions exceeding evidence, cross-phase
reversals) are invisible to every per-claim gate above — a real project closed all-green and
was not decision-ready. W7 adds an independent adversarial corpus review as a hard completion
gate. Design: `dev/researcher/W7-corpus-review-design.md` (v3.1). Build status by stage:

- **Stage 2 — contract spine: shipped, not wired.** The plugin now carries
  `reference/corpus-review-protocol.md` (the frozen protocol v1: manifest/hash identities
  with STATE split out of the corpus hash, receipt + ledger + completion-record schemas, the
  four-op STATE transition and completion sentinels, trust contract, verdict logic, exit
  codes), `reference/validate-corpus-review.py` (manifest / gate / transition /
  check-completion + an embedded 35-case deterministic fixture battery),
  `reference/review-protocol-contract.json` (the shipped trust anchor: expected validator
  hash per protocol version), and templates for the project marker and the canonical
  completion-criteria file. **No skill invokes any of this yet** — no behavior has changed;
  gate blocking switches on only after the stage-3 corpus-scale fixtures pass (design §8).
- **Stages 3–5 [proposed]:** runner skill + fixed review brief + Tier-2 `corpus-reviewer`
  agent (dual samplers, union gate); closeout refactor + side doors + sentinel-as-claim
  readers; live proof on the remediated engine corpus, then release.

Ownership once wired (stage 3+): the **runner** is the only writer of review artifacts; the
**validator** owns the completion verdict and the allowed STATE transition; reviewers are
read-only samplers. Until then these rows stay out of the Layer 2/3 ownership tables — the
tables describe enforced behavior, and stage 2 enforces nothing.

---

*This map is the base for precise adjustment. W7 (Layer 9) is the active build chapter; Seam 0
and the Layer 4 judgment gaps (with the corrected fixes above) are the next design chapter
after it; the specialist-bench decisions (Layer 5) ride with them.*

# Work state — kenzie-creative-marketplace

**Last updated:** 2026-08-05 · **Session focus:** W7 stage 2 (the corpus-review contract
spine) built, Codex-hardened, and committed on branch `researcher-w7`. Schemas frozen.

## Where things stand

- **researcher (1.7.0 released; W7 mid-build on branch `researcher-w7`)** — Stage 2 of the
  W7 credibility gate is **done** at `a1b00e2`: the frozen protocol v1
  (`researcher/reference/corpus-review-protocol.md` — now normative over the design doc on
  mechanics), `reference/validate-corpus-review.py` (manifest / gate / transition /
  check-completion / hash-self + 64-case embedded `--self-test`, all green),
  `reference/review-protocol-contract.json` (trust anchor), and the marker +
  completion-criteria templates. **Nothing is wired** — no skill invokes the validator; gate
  blocking switches on only after stage-3 corpus-scale fixtures pass. No version bump yet;
  release is stage 5.
- **The map** — `dev/researcher/ARCHITECTURE.md` gained **Layer 9** (W7 build status:
  stage 2 shipped-not-wired; stages 3–5 [proposed]). Keep syncing per its freshness rule.
- **The design** — `dev/researcher/W7-corpus-review-design.md` §10 marks stages 1–2 done.
  The shipped protocol spec supersedes it on mechanics; changes to frozen schemas from here
  are a protocol version bump, not a patch.
- **Other plugins** — unchanged (blueprint 0.3.0, goal-setting 0.2.1, intelligence-briefing
  0.3.0, photo-generator 1.2.0, sage 0.2.0, strategist 0.4.1, thinkers 0.1.0).

## Done this session

- `a1b00e2` (branch `researcher-w7`) feat: W7 stage 2 contract spine — protocol spec,
  validator + 64 fixtures, trust contract, templates; ARCHITECTURE Layer 9; design §10
  stage-2 done marker.
- **Second Codex adversarial review of the built spine** (fix-first: 9 blockers / 4 majors /
  2 minors) — all applied before the freeze. The load-bearing fixes: `check-completion` now
  re-derives the completion claim (record schema + seals + full receipt revalidation +
  closure recomputation), completion **seals** give post-close immutability for receipts and
  ledgers, C1 dispositions bind to material findings / waiver records, verdict asymmetry is
  enforced both directions, set-id/tier identity bindings, plan↔canonical `criteria-drift`
  check (exit 24), ledger value validation (cited rejections; class-matching exceptions),
  transition scoped to the final phase's own checklist with Collect–Synthesize
  preconditions and an interruption-resumable `--apply`.
- Verification green after final edits: `--self-test` 64/64; `claude plugin validate`
  (plugin + marketplace); `check-version-prefix` all agree.

## In flight / uncommitted

None. Working tree clean at `a1b00e2` on `researcher-w7`.

## Next steps (in order)

1. **W7 stage 3 — reviewer implementation + proof** (design §10.3, build contract §§2,3,7):
   `skills/research-review-corpus/` runner + `commands/research/review-corpus.md`;
   `reference/corpus-review-brief.md` from the spike base (`dev/researcher/spike/
   review-brief.md`, already validated on both engines — add C15, required-evidence fields,
   and the receipt-schema deltas frozen in protocol §3: coverage_outcome, criteria
   dispositions with finding_ids/record, waivability advisory); `agents/corpus-reviewer.md`
   (Tier 2); corpus-scale fixtures (known-bad + clean mini-corpora in the eval pack). The
   runner must satisfy protocol §2 (never overwrite; failed attempts as `.failed.json`;
   exactly four inputs to reviewers) and owns the disclosure-presence preflight (§4.2 note).
2. **W7 stage 4 — gate wiring** (design §6/§9): audit-claims closeout refactor (three
   stages), side doors, sentinel readers call `check-completion` and *report* it (Bash in
   skill + command frontmatter), init/re-init install (validator + marker + STATE header
   line + criteria file + reviews/ scaffold; pre-allow `Bash(codex:*)`, `Bash(python3:*)`).
3. **W7 stage 5 — live proof + release**: dual-tier review of the remediated engine corpus;
   validator against the pre-remediation snapshot must block; Cowork path; Codex review of
   the whole change; five surfaces + CHANGELOG + tag; merge `researcher-w7`.
4. **Then the plan queue** (`~/.claude/plans/shimmying-sauteeing-storm.md`): W6a/b → W2 →
   W3 → W1 → rest. Chips pending: audit-register cleanup (`task_73dee9b0`), Evidence-Against
   eval golden (`task_c631be46` — do early, protects W2).

## Open questions / decisions pending

- None blocking stage 3. Two recorded spec calls Kelsey may want to eyeball (both in
  protocol §2.4/§4.1 with rationale): post-close **seals** instead of receipt
  content-addressing/ledger hash-chaining (pre-close mutation assigned to the disclosed
  manual-tamper class); `rejected-with-record` closes a finding when cited (design §5's
  compressed sentence omitted it; §4 + spike lesson 6 require it).

## Session knowledge worth keeping

- **Work lives on branch `researcher-w7`** (stages 3–5 continue there; merge at stage-5
  release). STATE.md commits ride the branch for now.
- **Contract-hash sync rule:** any edit to `reference/validate-corpus-review.py` requires
  regenerating `reference/review-protocol-contract.json` from
  `python3 researcher/reference/validate-corpus-review.py hash-self` — the self-test's
  valid-close fixtures pass either way (they synthesize their own contract), so the checker
  for this is the shipped contract itself; add it to the release loop while W7 is open.
- **Golden manifest hash** (`GOLDEN_CORPUS_HASH` in the validator's self-test) freezes the
  canonicalization contract. If a change breaks that fixture, every fielded receipt is
  orphaned: that's a protocol version bump, not a patch.
- **Codex stage-2 review artifacts** were scratchpad-only (session temp dir; gone after
  cleanup). All 15 findings are dispositioned: applied in the spine, or recorded as stage-3+
  scope in protocol §10's explicit deferral list (runner refuse-to-overwrite, disclosure
  preflight, Cowork/no-hooks path, sentinel readers reporting). Re-run brief recipe if ever
  needed: point Codex at design v3.1 + the five shipped files, fix-first framing, last
  fenced JSON block.
- Codex gotchas unchanged from last session (`--skip-git-repo-check`, `-s read-only`,
  capture to file, 11–25m runs). This run: 22m, clean exit.
- Engine corpus states for stage-3/5 fixtures and live proof (unchanged): repo
  `~/Projects/_shared/helloalice-research`, project
  `projects/engine-vs-harness-owner-pricing`; known-bad `2ab9f25`, remediated `93ec4fc`+;
  snapshot via `git archive`.
- Stale seed in eval pack (`adv-override-disclosure`, old-form `/research:audit-claims`)
  still pending a sweep when next touching the pack.

## How to resume

1. Read `AGENTS.md` (orientation), then this file. Confirm you're on branch
   `researcher-w7`.
2. For stage 3: read `researcher/reference/corpus-review-protocol.md` **first** (the frozen
   contract the runner/agent/brief must satisfy), then design §§2,3,7 for intent, then
   `dev/researcher/spike/review-brief.md` + `SPIKE-RESULTS.md` for the brief base and
   measured reviewer behavior.
3. Build discipline (standing): one change at a time; Codex-review before ship; eval
   regression on changed skills; sync `ARCHITECTURE.md` in the same change; release = five
   surfaces + CHANGELOG + checker + validate + tag `researcher-v<X.Y.Z>`.

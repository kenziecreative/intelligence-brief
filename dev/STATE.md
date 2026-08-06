# Work state — kenzie-creative-marketplace

**Last updated:** 2026-08-05 · **Session focus:** W7 stage 3 (reviewer implementation)
built, Codex-hardened, and committed on branch `researcher-w7`. Corpus-scale goldens
authored but **not yet run** — their pass is the stage-4 switch-on precondition.

## Where things stand

- **researcher (1.7.0 released; W7 mid-build on branch `researcher-w7`)** — Stage 3 is
  **built** at `7135d13`: `skills/research-review-corpus/` + `commands/research/
  review-corpus.md` (the runner — only writer of review artifacts; four-inputs coldness;
  exclusive-create publishes, report before receipt; failed attempts as `.failed.json` in
  both run kinds; fail-closed disclosure preflight), `reference/corpus-review-brief.md`
  (spike base + C15 + required-evidence + frozen receipt deltas + read-nothing-outside-
  the-manifest), `agents/corpus-reviewer.md` (Tier 2, opus, cold). Validator gained the
  **additive `validate-receipt` mode** (runner preflight; battery 64→69; contract
  regenerated — spec call recorded in protocol §9 as stage-3 additive). Corpus-scale
  fixtures live in the eval pack: `eval/targets/researcher/fixtures/corpus-a` (known-bad,
  7 seeded classes) and `corpus-b` (clean) — **neutral names on purpose** (blind-runner
  leak defense); expectations live only in judge surfaces (coverage.md,
  expected_behavior). Two golden `review-corpus` scenarios + Credibility Gate rubric
  dimension + deterministic `review_receipt_validates` gate (new generic `command_exit0`
  gate type in `eval/lib/run-gates.mjs`). Gate blocking still off; nothing calls the
  validator at closeout yet.
- **Codex stage-3 review** (fix-first: 5 blockers / 5 majors, all applied): clean fixture
  made genuinely clean (2-source pricing, falsifiability section, Deskly dispositioned in
  the consumption surface); eval coldness leak fixed via neutral fixture ids + adapter
  honesty note (in-context Tier-2 play proves the mechanical seam, not coldness — stage 5
  owns that); unavailable planned tier → failed attempt in both run kinds; validator
  malformed-shape crash → exit 14; new CLI flags scoped to their mode; exclusive-create
  artifact publishing; substantive-disclosure preflight; deterministic receipt gate; doc
  status claims softened to built-pending-proof.
- **The map** — `dev/researcher/ARCHITECTURE.md` Layer 9 updated (stage 3 built /
  proof pending; stages 4–5 proposed). Design §10.3 marked built-pending-proof.
- **Other plugins** — unchanged (blueprint 0.3.0, goal-setting 0.2.1,
  intelligence-briefing 0.3.0, photo-generator 1.2.0, sage 0.2.0, strategist 0.4.1,
  thinkers 0.1.0).

## Done this session

- `7135d13` (branch `researcher-w7`) feat: W7 stage 3 — runner skill + command, brief,
  Tier-2 agent, validate-receipt mode (+5 self-test cases), corpus-scale fixtures +
  scenarios + rubric dimension + receipt gate; all Codex findings applied pre-commit.
- Verification green after final edits: `--self-test` 69/69; contract hash regenerated
  and matching; both `claude plugin validate` runs; `check-version-prefix`; both fixture
  manifests build cleanly; scenarios.jsonl parses; run-gates syntax + live gate test
  (seeded receipt → `review_receipt_validates` OK).
- Proven seam (dry-run): brief-schema reviewer result → runner step-8 merge →
  `validate-receipt` exit 0 against `corpus-a`.

## In flight / uncommitted

STATE.md update only (this file). Working tree otherwise clean at `7135d13`.

## Next steps (in order)

1. **Run the two corpus-scale goldens** (`/eval-run --target researcher`, scenarios
   `adv-review-corpus-a` + `rep-review-corpus-b`) — stage 3's proof half. Expect
   iteration discipline (fresh iteration-N). A red golden here blocks stage 4.
2. **W7 stage 4 — gate wiring** (design §6/§9): audit-claims closeout refactor (three
   stages), side doors, sentinel readers call `check-completion` and *report* it (Bash in
   skill + command frontmatter), init/re-init install (validator + marker + STATE header
   line + criteria file + reviews/ scaffold; pre-allow `Bash(codex:*)`,
   `Bash(python3:*)`); tools-guide.md Codex section rides here.
3. **W7 stage 5 — live proof + release**: dual-tier review of the remediated engine
   corpus; validator against the pre-remediation snapshot must block; Cowork path; Codex
   review of the whole change; five surfaces + CHANGELOG + tag; merge `researcher-w7`.
4. **Then the plan queue** (`~/.claude/plans/shimmying-sauteeing-storm.md`): W6a/b → W2 →
   W3 → W1 → rest. Chips pending: audit-register cleanup (`task_73dee9b0`),
   Evidence-Against eval golden (`task_c631be46` — do early, protects W2).

## Open questions / decisions pending

- **Spec call for Kelsey to eyeball:** the frozen protocol gained an *additive* validator
  mode at stage 3 (`validate-receipt`, protocol §9 table + §10 battery note). Rationale:
  protocol §2 requires the runner to treat incomplete reviewer results as failed
  attempts, and the skills are forbidden from re-implementing contract rules — the mode
  is the only way to satisfy both. No schema or verdict-logic change; self-tested.
- Stage-2 spec calls unchanged (seals vs content-addressing; rejected-with-record as a
  closure path — protocol §2.4/§4.1).

## Session knowledge worth keeping

- **Work lives on branch `researcher-w7`** (stages 4–5 continue there; merge at stage-5
  release). STATE.md commits ride the branch.
- **Contract-hash sync rule** unchanged: any validator edit → regenerate
  `review-protocol-contract.json` from `hash-self`; the shipped contract is the checker.
- **Golden manifest hash** (`GOLDEN_CORPUS_HASH`) still freezes canonicalization; a break
  is a protocol version bump.
- **Codex from background Bash needs `< /dev/null`** — without it, `codex exec` dies
  instantly (exit 1, empty streams) in detached runs. This run: ~9 min, clean exit;
  review artifacts in the session scratchpad (gone after cleanup); re-run recipe: point
  Codex at protocol + design §§2,3,7 + the stage artifacts, fix-first framing, last
  fenced JSON block.
- **Eval blind-runner surfaces:** the runner sees entry/setup/user_messages + adapter.md
  — so fixture names, adapter prose, and working-dir names must never encode expected
  outcomes; judge-only truth lives in coverage.md/rubric/expected_behavior/seed_notes.
- Engine corpus states for stage-5 live proof (unchanged): repo
  `~/Projects/_shared/helloalice-research`, project
  `projects/engine-vs-harness-owner-pricing`; known-bad `2ab9f25`, remediated `93ec4fc`+;
  snapshot via `git archive`.
- Stale seed in eval pack (`adv-override-disclosure`, old-form `/research:audit-claims`)
  still pending a sweep; adapter.md also carries old-form `/research:init` mentions —
  sweep together when next touching the pack.

## How to resume

1. Read `AGENTS.md` (orientation), then this file. Confirm branch `researcher-w7`.
2. For the golden run: `eval/AGENTS.md` + `eval/reference/iteration-discipline.md`, then
   `/eval-run --target researcher`. For stage 4: protocol §§6, 8, 9 first (frozen
   contract), then design §6/§9, then `skills/research-audit-claims/SKILL.md` (the
   closeout being refactored).
3. Build discipline (standing): one change at a time; Codex-review before ship; eval
   regression on changed skills; sync `ARCHITECTURE.md` in the same change; release =
   five surfaces + CHANGELOG + checker + validate + tag `researcher-v<X.Y.Z>`.
4. **Program-status block (standing):** the master plan
   `~/.claude/plans/shimmying-sauteeing-storm.md` now opens with a "Program status"
   table — the W1–W7 program-level view Kelsey reads to see where everything stands.
   Update it (and its Last-updated date) whenever a workstream or W7 stage moves, in the
   same session, alongside this file.

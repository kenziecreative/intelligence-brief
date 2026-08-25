# Meta-prompt: add scenarios to a target pack

> Paste this into Claude when you want to extend a target's `scenarios.jsonl`. Give it the
> target's `principles.md`, `rubric.md`, `adapter.md`, and the existing `scenarios.jsonl`.

You are extending the scenario suite for a plugin-eval target. Read the target's
`principles.md` (what good means), `rubric.md` (the dimensions), `adapter.md` (how the
plugin is driven and what its gates are), and the existing `scenarios.jsonl` (so you don't
duplicate coverage).

Produce new scenarios as JSONL, one object per line, in the schema defined by
`reference/target-pack-spec.md`. For each:

- **Pick a gap.** Cover an entry point, behavior, or failure mode the existing suite
  misses. Map each new scenario to at least one principle and the rubric dimension(s) it
  exercises.
- **Two kinds.**
  - *Representative* — a realistic, in-bounds use. Tests that the plugin does the normal
    job well. Pass bar: every dimension ≥ 2, criticals = 3.
  - *Adversarial* (`golden: true`) — engineered to provoke a specific failure. The bad
    behavior lives in the `user_messages` (a generic non-answer, a preference pushed over
    the evidence, a planted contradiction with an earlier turn, a request to fabricate
    data, a request for a capability the plugin doesn't have). Name the dimensions that
    must hold in `critical_dimensions`.
- **Script the turns.** Write `user_messages` as a fixed sequence. For adversarial soft-user
  cases, write the early turns soft/generic and a later turn slightly sharper — so the
  scenario tests whether the plugin pushed back, not whether the user was already clear.
- **Be specific.** Real numbers, a concrete situation, a named (fictional) business. Vague
  scenarios produce vague grades.
- **State the bar.** Fill `expected_behavior` with `must_include`, `must_not_include`,
  `must_not_do`, and `critical_dimensions`. These are what make the scenario gradable.
- **Add `tone_notes` and `severity`.** `tone_notes` says how a good response should *feel* in
  this situation (the judge reads it for voice — be specific about register). `severity` is
  `blocker` (a `must_have` miss fails the whole suite — use for goldens), `high`, or `medium`.
- **Set `expected_no_advance: true`** when the correct behavior is to *refuse* to capture a
  result (a stonewalling user who only gives non-answers) — it inverts the advance/fill gates.

Only add a golden when its behavior is genuinely load-bearing — an invariant whose
regression would be a real bug. Goldens are few and consensus, not a wishlist. After adding,
update the target's `coverage.md` so the new class is recorded.

Output only the new JSONL lines, ready to append. No preamble.


## Before you add a scenario: run the setup lint

```bash
node eval/lib/lint-scenarios.mjs eval/targets/<target>/scenarios.jsonl
```

It asks one question — **does this scenario seed what its same-entry siblings seed?** — and it is
advisory: it always exits 0 and never blocks, because deliberately omitting a key is how several
goldens test the absent case. It cannot tell a deliberate omission from a forgotten one, so it
points and you decide.

**Why it exists.** The commonest fixture defect by a wide margin is a setup that cannot reach the
behaviour the scenario exists to test. Five instances in a single session, the worst being a
`synthesize` scenario missing `gaps` and `cross_reference`: the run stopped at a mandatory
pre-check and never reached the gate under test. That cost two full runs and two judges to
discover something visible straight off the fixture.

**If an omission is deliberate, say so in `tone_notes`.** The lint reads that field and softens its
note when it finds absence language there, and more importantly the next human reader looks there
first. An unexplained gap between a scenario and its siblings is indistinguishable from a mistake.

The invariant comes from the pack comparing against itself, never from the target's skills — see
`target-pack-spec.md`, *"A deterministic check may assert only what the target's spec guarantees."*
A lint that encoded the plugin's own pre-check rules would drift out of sync with the plugin.


## Never seed a fixture with wording the skill itself uses as an example

**Five instances in this repo, the most recent written by an author who had recorded the lesson
four times.** The trap is not ignorance of the rule — it is that the worked example and the fixture
get drafted in the same sitting, and the phrasing carries across without anyone deciding it should.

When a scenario's seeded text matches an example in the skill under test, a green is ambiguous: the
run may have applied the rule, or it may have recognised a string. You cannot tell which from the
capture, and the greens are therefore worth nothing for promotion.

Instances, so the shape is recognisable:
- `posture-register.md` rule 8 — the worked example *was* the scenario's case, so a green measured
  transcription. Fixed by deliberately decoupling the example (clinics/escalation policies).
- `adv-exclusion-visibility` shares the SecureStack corpus with the skill's own worked example; a
  judge flagged that "the register read is partly supplied by doctrine."
- W4's Outcome 3 example matched `adv-disconfirmation-honest-exit` almost verbatim — and when the
  example was decoupled, the scenario **stopped working**, revealing it had never tested anything.
- `adv-recommendation-vacuous-refutation` seeded "further research may refine this" and "we will
  continue to monitor", both listed verbatim in B18 as its examples of vacuity.

**Before admitting a scenario, grep the skill it tests for the fixture's distinctive phrases.** If
one hits, change the fixture — not the skill, whose example is usually the clearer one. Then the run
has to reason from the rule, which is the only thing worth measuring.

**And the sharper version of the same test:** a fixture can be well-formed, reach the code under
test, and still not *corner* it. Ask what the setup **permits**, not only what it contains — the
first honest-exit fixture seeded a retrieval log that made a second, easier exit available, so the
exit under test never had to be considered.

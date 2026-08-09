# AGENTS.md — trailhead

Maintainer/agent guidance for working **on** the Trailhead plugin. Standalone;
self-contained. (Current version lives in `plugin.json` and `CHANGELOG.md`.)

> A plugin's `templates/CLAUDE.md` is a different thing: it's the per-deployment config
> the plugin ships to *users*, not agent guidance. Don't conflate the two. And in this
> plugin there is a **third** near-identical name — `scaffold/CLAUDE.md.tmpl` — which is
> what gets written into an initialized project. Three files, similar names, different
> jobs. Check which one you're editing.

## What it is

Sets a project up so the requirements that usually rot can fail out loud. A four-question
interview, then it writes the contract, the running-state file, the multi-CLI agent
context, and a gate script with seven checks. `/trailhead:audit` runs the same checks
read-only against a repo that already exists.

"Correct output" is a project where `node scripts/gate.mjs` exits non-zero for a reason
the user can act on, and where the first run after init is **red**. A green first run
would be the original bug shipped as the fix.

## The two laws

Everything in this plugin follows from these. Do not add a feature that violates either.

**Law 1 — No gate may exist only as a hook or a skill.** Every gate is a script in the
*target repo* with an exit code. Hooks and skills are ergonomics on top. A gate that
lives inside one agent's plugin exists on that surface and silently does not exist under
Codex, Gemini, or CI — which is the only place a gate has real authority. This is why the
runner is `.mjs` and not a skill, and it is the constraint that makes multi-CLI honest
rather than aspirational.

**Law 2 — A verdict must be a function of coverage, not just outcome.** "The tests that
ran, passed" is true of a suite with one trivial spec and fourteen that never ran; a
real project reported `overall: passed` in exactly that state. Every check emits
`not_run`, and the runner ratchets it. If one clause of this design survives a rewrite,
make it this one.

## Structure

- `commands/trailhead/` — thin wrappers → `/trailhead:init`, `/trailhead:audit`. Namespaced
  deliberately: a flat `commands/init.md` would collide with Claude Code's built-in `/init`.
- `skills/trailhead-init/` — the interview and scaffolder. `references/` holds the
  interview text, the settings-merge rules, the multi-CLI matrix, and the gate catalog.
- `skills/trailhead-audit/` — the read-only auditor.
- `hooks/` — `pre-commit-secrets.sh` (PreToolUse, scoped to `git commit` by reading stdin)
  and `gate-staleness-check.sh` (Stop). Both Claude-only conveniences; nothing depends on them.
- `scaffold/` — **all target-project payload.** Never run from the plugin cache; read and
  written into the user's repo. This is what makes the gates portable to Codex, Gemini, and CI.
- `reference/failure-map.md` — which artifact prevents which observed failure.

## Key mechanics

**The posture matrix.** Each stage declares `reversibility` (irreversible / costly /
cheap); the project declares `stage_level` (prototype / pilot / production); enforcement
is the lookup. The rule is *gate what you cannot undo, report what you can*. Adding a
stage means answering one question, not filling in three columns. At `prototype` only
irreversible stages block, so the gate does not stand between someone and a proof of
concept — a gate that blocks a spike is a gate that gets deleted.

**`report` is not `ignore`.** Three things keep reporting stages from becoming wallpaper:
they are still ratchets (a `not_run` count may not grow, at any level); removing their
inputs is `regressed_to_absent`, which blocks unconditionally and which `.gates/pause`
does not cover; and every run prints what the next promotion would fail on, so a red
report line is a bill with a due date.

**Triggered decisions.** `contracts/OPEN-DECISIONS.md` rows carry a trigger — a path glob
or `deliverable:N`. `UNDECIDED` plus a fired trigger fails the gate. This is the piece
that makes "not sure yet" a scheduled interrupt instead of a dropped question, and it is
the mechanism the whole product thesis rests on: don't add decision points, move the ones
you have to the moment they're cheap.

**Human verdicts expire by construction.** A verdict in `.gates/verdicts/<id>.md` records
the newest mtime across its stage's `watch` set. The runner recomputes it, so changing the
watched code marks the verdict `stale` with nobody remembering to invalidate it. There is
no code path in the runner that writes one.

## Surface differences (Claude Code vs Cowork)

- **Setup uses Read/Write/Edit/Glob/Grep and never shell.** `Bash` is absent from
  `trailhead-init`'s `allowed-tools`. Directories are created by writing a file into
  their path; plugin files are copied by Read-then-Write; nothing needs `chmod` because
  hooks run as `bash ${CLAUDE_PLUGIN_ROOT}/hooks/x.sh`.
- **Hooks fire in Claude Code and not under Codex or Gemini.** Both degrade to nothing,
  never to false assurance — the gate script is the contract and is unaffected.
- **The plugin is Claude-only; its output is not.** Init runs once; the repo carries
  everything afterwards. Say this in the README rather than implying portability the
  plugin itself doesn't have.

## Maintaining this plugin

- **Release:** follow **Release & versioning** in the root `AGENTS.md`. Bump `version` in
  `plugin.json`, update the `v<X.Y.Z> — ` prefix in both descriptions (`plugin.json` + the
  catalog entry in `.claude-plugin/marketplace.json`), the README "Plugins at a glance"
  row, and the root `AGENTS.md` plugin list; add a `CHANGELOG.md` entry; then
  `node dev/scripts/check-version-prefix.mjs` and `claude plugin validate ./trailhead` +
  `claude plugin validate .`; commit, tag **`trailhead-v<X.Y.Z>`**, push.
- **Authoring check (optional):** run plugin-dev's `skill-reviewer` over changed skills and
  `plugin-validator` over the plugin.
- **Run the fixtures before shipping a check change** — everything in
  `dev/trailhead/tests/`, which lives outside the plugin because `tests/` never ships:
  - `contract-lint.test.mjs` — Part C renders the real `.tmpl` files the way init does and
    requires the contract stage to **fail** on them. That is the standing guard against the
    plugin passing its own scaffold, which is what 0.1.0 did.
  - `qa-ratchet.test.mjs` — pins the first run to `advisory`/0 at prototype while proving
    the laundering paths still block. Both properties, or neither is worth anything.

  Both suites have been mutation-tested: revert the fix each one covers and it goes red.
  Keep that true of anything you add, or you get a suite that cannot fail.
- **The `{{VERSION}}` marker in every scaffold template is load-bearing.** It is how an
  audit distinguishes "this repo has a design contract" from "this repo has *ours*, at
  that vintage", and it is the only thing that makes a future upgrade possible instead of
  a re-scaffold. Do not drop it from a template.

### Editing cautions specific to this plugin

Most of these are scar tissue from the first external review, which found the shipped
implementation did not hold its own central claim. Each one is a defect that was live.

- **The runner owns `.gates/ratchet.json`.** For a while it read that file and never wrote
  it, so both the "may not get worse" property and `regressed_to_absent` were inert in
  every real project — and the fixture that "proved" the defense passed only because the
  state had been hand-written into it. **If a test needs fixture state, check that the
  shipping code path is what writes it.** Otherwise the test measures the fixture.
- **The ratchet remembers identities, not just counts.** Two unrun specs, ceiling two —
  delete one and the count falls, which is an improvement by every measure a counter has.
  Any new ratcheted measurement must return an `identities` set, or deletion will read as
  progress in that dimension too.
- **Fix the family, not the instance.** Every repair round so far has closed the exact case
  a report named and left the neighbour open: the placeholder filter fixed the line and not
  the match, the comment-context fix handled `// @ts-ignore` and silently disabled
  `# noqa`, `//nolint`, and `#[allow(`. When a fix touches a table of patterns, write a
  negative fixture for **every row of the table**.
  This rule earned itself twice over in `contract-lint`. Its placeholder table had three
  holes — comment interiors read as content, no row for the house `<angle bracket>`
  fill-in, and a marker prefix that took `-` and `*` but not `1.` — so the check that
  exists to catch "§2 is still the scaffolded placeholder" passed the scaffolded
  placeholder. Two were reported; the third (`1. TBD`, the example the check's own comment
  cites as caught) surfaced only from sweeping every row. That sweep is now
  `dev/trailhead/tests/contract-lint.test.mjs` — extend it when you touch the table.
- **Bump `RATCHET_SCHEMA` when a check's measurement changes shape.** A stricter checker
  produces bigger numbers, and comparing them against ceilings set by the old one reports
  regressions that are really a change of ruler. The runner re-baselines once and says so;
  without the bump it just looks like the project got worse.
- **`n/a` is not a synonym for "the file is gone".** Only `optional_if_absent` on a
  never-seen path may return `n/a`. A check whose configured input is missing returns
  `missing_input` and blocks. Collapsing those two made every missing file a green gate.
- **`missing_input` is not a synonym for "present and empty" either.** It is STRUCTURAL, so
  it blocks at every level and `.gates/pause` does not cover it — reserve it for an input
  that went *away*. An empty `.qa/` on a new project is not an input going away, and
  classifying it that way made every fresh install exit 1 while init promised `advisory`
  and 0. Zero coverage is a coverage signal; `costly` already prices it correctly. Watch
  for a structural verdict doing double duty before you reclassify one: `missing_input` was
  also the only thing blocking "delete every spec in `.qa/`", because the empty branch
  returned no identity set and the runner only compares identities when both sides are
  arrays. The fix had to return `[]`, not nothing. `dev/trailhead/tests/qa-ratchet.test.mjs`
  Part B is what proves that half, and it fails if you drop the `[]` while the exit code
  still looks correct.
- **Bind evidence; do not match it.** Human verdicts, status evidence paths, and QA run
  credits are all places where a loose string match let a false claim through — a verdict
  citing `package.json`, a spec credited by the prose "No **auth**entication scenarios
  have run yet". Any new evidence path must be checked against what it claims to be.
- **Read the source of truth the claim is about.** The pre-commit hook took filenames from
  the index and then grepped the *working tree*, so staging a key and cleaning the file
  let it through. Chronology was read from mtime, which cannot answer "was this row added
  before that file" and is rewritten by every clone.
- **Do not write a NUL test in bash.** A shell variable cannot hold NUL, so `grep -q
  $'\x00'` is `grep -q ""`, which matches everything. That silently skipped every file in
  the secrets hook for one revision.
- **Do not add a fifth interview question.** The budget is two minutes, at the moment of
  maximum impatience. Anything new must be detected or defaulted. This is the bloat vector
  that kills the plugin.
- **Do not let a check scan the gate's own files.** `suppression.mjs` reported itself on
  its first real run, because its pattern table necessarily contains the string
  `eslint-disable`. The `SELF` exclusion exists for this.
- **Do not make `.gates/pause` cover ratchet regressions, `regressed_to_absent`, or
  `missing_input`.** The hatch exists so the user doesn't build their own by deleting the
  gate. Extending it to the gate's own memory would make it a laundering tool.
- **Do not widen a `watch` glob to `src/**` on a human stage.** Staleness thrash is the
  fastest way to make `STALE` the normal color, at which point it means nothing.
- **Nuisance failures kill a Stop hook, and it takes the freshness check with it.** Scope
  every hook predicate tightly; `status-lint` does the rigorous version.
- **Keep the audit at eight rows.** A forty-item audit is a wall nobody climbs.

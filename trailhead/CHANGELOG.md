# Changelog — trailhead

All notable changes to the Trailhead plugin. Per-plugin semver; tags are plugin-scoped
(`trailhead-vX.Y.Z`).

## 0.1.0 — 2026-07-25

Initial release.

Supersedes an unpublished standalone plugin of the same name that reached 2.0.0 outside
this marketplace. Versioning restarts at 0.1.0 per marketplace convention; roughly half
of the predecessor's scaffolder survives — the explore-what-exists discipline, the
settings merge rules, the version markers, and the two blocking hooks — and the other half
was replaced by the thing it never had, which is a gate that can fail on code quality.

- `/trailhead:init` — four-question interview (three for non-interface projects), then
  installs `scripts/gate.mjs` with seven checks plus the contract, running-state,
  identity, and open-decisions files. Setup uses Read/Write/Edit/Glob/Grep only, never
  shell, so it works in Cowork.
- `/trailhead:audit` — read-only audit of an existing repo against the eight gates, with
  cited evidence. Writes exactly one dated report file and touches nothing else.
- Multi-CLI output: `AGENTS.md` carries the substance and stands alone; `CLAUDE.md` and
  `.gemini/settings.json` point at it. Verified against Gemini CLI's `context.fileName`.
- Staged posture: `prototype` / `pilot` / `production` crossed with per-stage
  reversibility, so only irreversible failures block a proof of concept.
- Triggered open decisions: an unanswered question fails the gate when its path trigger
  fires, rather than when someone remembers it.
- Human verdict stages that expire automatically when the code they described changes.
- Hooks (Claude Code only, and nothing depends on them): `pre-commit-secrets.sh`, which
  scans the **staged blob** and is scoped to `git commit` by reading the tool call off
  stdin; `gate-staleness-check.sh`, which blocks on an unsupported status claim rather than
  on activity, and rejects a receipt older than the current tree.

Released after an external blind code review, which found the shipped implementation did
not hold its own central claim and was correct. Every finding was verified against the
files before it became work, and the repairs are in this release:

- The runner now **writes** `.gates/ratchet.json`. It previously only read it, so both
  "the un-run count may not grow" and the delete-detection were inert in any real project.
- `missing_input` is now distinct from `n/a`. Deleting `.qa/`, `.planning/STATE.md`, or the
  design contract no longer turns a red stage green.
- Human verdicts are bound rather than cited: non-finite and future `watch_mtime` values
  are rejected, `attested_at` is required, and the artifact must match the stage's
  `requires_artifact` glob rather than merely existing.
- Result words `pass`, `advisory`, `partial`, and `paused` replace an undifferentiated
  `pass`, and `--strict` makes every stage block for CI.
- Status vocabulary is an allowlist, evidence comes from the Evidence column, and
  `accepted` is correlated with the human verdicts its definition requires.
- QA run credit requires a delimited token in a history table row or report filename, not a
  substring of prose.
- Trigger lists are brace-aware; `deliverable:N` fires only when the deliverable started.
- The contract's own rules — line cap, no status table, filled-in invariants, and a
  non-reassignable identity key — became a `contract-lint` check instead of prose.
- `secrets` applies its placeholder filter to the match rather than the line, reports
  skipped files honestly, and supports an inline `trailhead-ignore-secret` waiver.
- `surface-mapping` uses git history for chronology and reports `chronology-unverified`
  rather than passing when git cannot answer.
- `spawnSync` gained an 8 MB buffer; a verbose but successful build is not a gate failure.

A second, disclosed review then attacked the repairs and found eight new defects, including
three the repairs themselves introduced. Those are fixed too:

- The ratchet remembers **identities**, not only counts — deleting the one unrun spec or
  the one overdue decision no longer reads as improvement.
- `# noqa`, `# type: ignore`, `//nolint`, and `#[allow(` are visible again; the previous
  comment-context fix had silently disabled them for Python, Go, and Rust.
- `accepted` correlates against the live human-gate outcome rather than a verdict file
  existing, and a hedged status cell (`accepted (human review pending)`) fails.
- The pre-commit hook shells out to `secrets.mjs --staged`; there is one detector, not two
  pattern tables that drift.
- `secrets` reports `incomplete` rather than `pass` when material was skipped or waived,
  and an empty scan scope is a config error.
- The design mapping is read from the mapping table rather than from prose; chronology must
  be strictly before, unknown chronology reports `incomplete`, and each named typeface needs
  its own `@font-face`.
- The whole config is validated across every posture level, so an `enforce.production` typo
  surfaces immediately rather than at the promotion it governs.
- A missing Invariants section, a missing identity file, `TBD` invariants, an undated
  deferral, and a `deliverable:N` trigger with no state file are all findings rather than
  silent passes.
- `RATCHET_SCHEMA` versions the measurement: upgrading the gate re-baselines the ceilings
  once and says `RE-BASELINED`, instead of reporting a stricter checker as a regression.

The reviewer's 40-observation adversarial suite is retained as a regression harness; 18 of
its observations no longer reproduce.

Known limits, stated rather than implied: the plugin is Claude-only even though its output
is not; nothing in a repository can stop a determined actor from editing `gate.config.json`
to go green, so the gate's real authority is CI on a protected branch; design composition is
a human verdict, not automation; and six known gaps are deferred to 0.2.0 — reviewer-identity
and content-digest binding for human verdicts, deletion detection in the Stop hook, traversal
coverage for ignored directories and symlinks, and streaming command output instead of an
8 MB cap.

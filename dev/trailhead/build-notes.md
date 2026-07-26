# trailhead — build notes

Build orientation for the plugin. Lives here rather than in `trailhead/` because a
plugin-root `CLAUDE.md` isn't loaded as context and draws a `claude plugin validate`
warning, and because build docs shouldn't ship in the installed cache.

## Provenance

Two sources:

1. **`init-agent`** at `/Users/kelseyruger/Projects/a-emporium-working/gold-master-projects/init-agent`
   — an unpublished standalone plugin, also called trailhead, at v2.0.0. Roughly half its
   scaffolder survives here. Note it has an uncommitted rename in flight
   (`skills/trailhead/` → `skills/init/`) that should be committed before anyone diffs
   against it.
2. **`AMENDMENT-02-GATES.md`** in `/Users/kelseyruger/Projects/_shared/genesis-wiki` —
   the post-mortem of a fourteen-deliverable autonomous build. Every gate in this plugin
   traces to a failure documented there; `reference/failure-map.md` is the mapping.

## Port decisions

| From init-agent | Disposition | Why |
|---|---|---|
| settings merge rules (SKILL Step 4) | kept, extended to `.gemini/settings.json` | Best-engineered thing in the predecessor. |
| explore-what-exists / extend-don't-replace | kept | The entire safety story for retrofit. |
| version markers `<!-- trailhead vX.Y.Z -->` | kept | Makes upgrade possible instead of re-scaffold. |
| `pre-commit-secrets.sh` | kept, **scoped to `git commit`** | Its README claimed it was commit-scoped; the registration used a bare `Bash` matcher, so it re-scanned every staged file on every shell call. Now reads stdin. |
| `milestone-check.sh` | retargeted → `gate-staleness-check.sh` | Original triggered on any commit message matching `complete\|finish\|implement\|ship\|release\|phase\|v[0-9]`, which is most commit messages. Now triggers only on an observable *status claim*. |
| `resolve-root.sh` (83 lines) | dropped | Marketplace uses `${CLAUDE_PLUGIN_ROOT}` directly. |
| `hook-utils.sh` (70 lines) | dropped | Amortized over 7 hooks; a net loss over 2. |
| 4 session-lifecycle hooks, `/handoff`, `/resume` | dropped → 0.2.0 | Well-built, wrong problem: none of the six failures traces to lost context. Also Claude-only, which violates Law 1. |
| 2 security subagents | dropped → a separate `security-agent` plugin | Neither has an exit code; both write reports. The mechanical half ships as the `secrets` stage plus the hook. |
| `conventions.md.tmpl` | dropped permanently | 49 lines of commented-out placeholders — exactly the artifact the post-mortem condemns. An installed linter does the job with an exit code. |
| `mcp.json.tmpl` + its interview question | dropped | Six lines of nothing, bought with a turn of the user's attention. |
| broad `permissions.allow` (`npm *`, `npx *`, `make *`) | dropped | Grants `npm publish` and arbitrary lifecycle scripts. A security scaffolder should not widen the blast radius as it installs. |

## Design decisions worth not relitigating

- **The runner is a script, not a skill.** Law 1 in the plugin's `AGENTS.md`. This is the
  constraint that makes Codex/Gemini/CI support real rather than aspirational, and it is
  load-bearing for everything else.
- **Freshness is mtime-based, not content-digest-based.** A digest design was considered
  and rejected for v0.1.0: `watch: ["src/**"]` on a digest goes stale on every keystroke,
  which makes `STALE` the normal color and therefore meaningless. mtime plus narrow
  per-stage watch globs is the cheaper 90%.
- **No challenge tokens, no posture-claim tamper-evidence, no register-laundering
  detection.** All designed, all deferred. They defend against an in-repo actor
  deliberately gaming the gate, and nothing in-repo can win that fight — the honest
  answer is CI on a protected branch, which the README says in plain terms.
- **`regressed_to_absent` blocks at every level and `.gates/pause` does not cover it.**
  Found by testing: deleting `.qa/` turned a red reporting stage green at `prototype`,
  which is the exact gaming vector the ratchet exists to close.

## Verification performed for 0.1.0

- Fault-injected fixture: all seven checks proven to bite and to clear.
- Ratchet proven to catch a growing `not_run`; `regressed_to_absent` proven to block;
  `.gates/pause` proven to cover an ordinary red run and *not* to cover laundering.
- Human verdict proven to pass when attested and to go `stale` when a watched file changes.
- Real run against genesis-wiki: reported `1/15 specs have ever run`, matching that
  project's own independently-written coverage ratchet exactly, and surfaced six real
  orphaned `eslint-disable` directives.
- `gate-staleness-check.sh` exercised across seven cases including the no-op paths.
- `node dev/scripts/check-version-prefix.mjs`, `claude plugin validate ./trailhead`, and
  `claude plugin validate .` all green.

**One bug found by dogfooding and worth remembering:** on the first real run,
`suppression.mjs` reported *itself* — its pattern table necessarily contains the string
`eslint-disable`. The `SELF` exclusion is the fix. A tool that can't be trusted about its
own source teaches people to discount its findings everywhere else.

## Not done yet

- No eval target pack (`eval/targets/trailhead/`). Optional per marketplace convention;
  worth adding once the interview text settles.
- Retrofit that *writes* is 0.2.0. `/trailhead:audit` reports; it never repairs.
- Non-code project support, the staged **security** engine, and impeccable/DESIGN.md
  integration are all 0.2.0. `gate.config.json` already carries `stage_level` so the
  security work is additive.

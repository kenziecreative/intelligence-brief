# Multi-CLI output

The architecture is one substantive file and three thin adapters.

| File | Claude Code | Codex | Gemini CLI |
|---|---|---|---|
| `AGENTS.md` | via `@AGENTS.md` in `CLAUDE.md` | **native** | via `context.fileName` |
| `CLAUDE.md` | **native** | ignored | via `context.fileName` (second entry) |
| `.gemini/settings.json` | ignored | ignored | **native** |
| `.claude/settings.json` | **native** | ignored | ignored |
| `scripts/gate.mjs` | run by instruction or hook | by instruction | by instruction |
| `contracts/`, `.planning/`, `.qa/` | read by all three — plain markdown, referenced from `AGENTS.md` | | |

## The one rule that matters

**`AGENTS.md` must be complete standing alone.**

Codex and Gemini do not follow `@imports`. A tree of imported files is invisible to two
of the three tools, so anything substantive that lives behind an import is a thing only
Claude Code sessions know. Write `AGENTS.md` flat, even where that means it is longer
than feels elegant.

`CLAUDE.md` adds nothing substantive. It exists because Claude Code reads that filename.

## What does not port, and how it degrades

| Claude-only | Degradation |
|---|---|
| **Hooks** | A hook is a *wrapper*, never the gate. It calls the same `node scripts/gate.mjs` that Codex and Gemini are told to run. Losing the hook loses enforcement *timing*, not the check. |
| **Skills** | `/trailhead:init` and `/trailhead:audit` are one-shot operations. Run init once from Claude Code and the repo carries everything afterwards. **The plugin is Claude-only; its output is not.** That is the correct division and the README says so. |
| **Subagents** | v0.1.0 ships none, partly for this reason. Anything added later must be a script with a report, or accept being a Claude-only bonus over a portable baseline. |
| **`permissions.deny`** | Codex and Gemini have their own sandbox models. The deny list is a Claude-only bonus; the portable equivalent is the `secrets` gate stage plus `.gitignore`. Say this in `AGENTS.md` rather than assuming it silently. |

## Why this is worth fifteen lines even if you only use one CLI

The portability constraint is what forces the gates to be scripts instead of skills. A
gate that lives inside one agent's plugin exists on that surface and silently does not
exist everywhere else — including in CI, which is the only place a gate has real
authority. Writing for three tools is a forcing function that pays off even if the other
two are never opened.

## One caution, learned the hard way

The marketplace's own `.agents/` Codex mirror was produced by find-and-replacing "claude"
with "Codex", which turned `.claude-plugin/plugin.json` into `.Codex-plugin/plugin.json`
and `claude plugin validate` into `Codex plugin validate`. A session following it would
scaffold an unloadable plugin.

**Transform prose, never paths.** Filenames like `.claude/`, `CLAUDE.md`, and
`.claude-plugin/` are fixed identifiers that mean the same thing regardless of which tool
is reading them.

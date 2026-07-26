# Merging settings files

The rule for every settings file trailhead touches: **union and set-if-absent, never
clobber.** A setup tool that silently drops a user's existing configuration is a setup
tool nobody runs a second time.

Read the existing file first. If it is not valid JSON, say so and stop — do not
"repair" it by rewriting.

## `.claude/settings.json`

| Section | Rule |
|---|---|
| `hooks` | **Append** to the existing event arrays. Never remove or replace an entry. trailhead ships its hooks in the plugin's own `hooks/hooks.json`, so normally there is nothing to add here. |
| `permissions.deny` | **Union.** Dedupe on `filePath` + `operations`. Deny rules only ever restrict, so a union is always safe. |
| `permissions.allow` | **Leave alone.** Do not add to it. trailhead's predecessor granted `npm *`, `npx *`, and `make *` by default, which is `npm publish` plus arbitrary lifecycle scripts — a security scaffolder widening the blast radius as it installs. If the user wants pre-allows, that is their decision to make explicitly. |
| `env` | **Set-if-absent** per key. Add `TRAILHEAD_VERSION`; never overwrite an existing value. |
| Scalars (`$schema`, `plansDirectory`) | **Set-if-absent.** |

## `.gemini/settings.json`

The load-bearing key is `context.fileName`, which Gemini CLI accepts as an array.

- If the file does not exist, write the template.
- If it exists and has no `context.fileName`, set it to `["AGENTS.md", "CLAUDE.md"]`.
- If it exists **with** a `context.fileName` array, **union**: keep every entry the user
  had, in their order, then append `AGENTS.md` and `CLAUDE.md` if missing. A project that
  already reads a `CONTEXT.md` must keep reading it.
- If `context.fileName` is a bare string, promote it to an array containing that string,
  then union.

Leave every other key untouched.

## `.gitignore`

Append the trailhead block only if the file does not already contain `.gates/`. Never
reorder or rewrite existing lines — a `.gitignore` diff that touches unrelated lines is
noise in a review, and reviews are where this stuff gets caught.

## `AGENTS.md` and `CLAUDE.md`

If either exists, **do not replace it.** Append a clearly delimited trailhead section at
the end and tell the user, in the report, exactly what you appended and where. Their file
came first; ours is the guest.

The exception worth flagging out loud: if an existing `CLAUDE.md` carries substance that
`AGENTS.md` does not, then Codex and Gemini sessions are working from strictly less
information than Claude Code sessions. Say so, and propose moving the substance to
`AGENTS.md` with `CLAUDE.md` importing it. Propose — do not perform. It is their file.

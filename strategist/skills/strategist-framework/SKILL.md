---
name: strategist-framework
description: This skill should be used when the user asks to apply, explain, or look up a single strategy framework by name, outside the full loop (e.g. "apply SCQ", "explain the Eisenhower matrix", "use a driver tree on this"). Resolves the framework in the 70-entry library and applies it to the user's situation or explains it.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# strategist-framework — Apply Or Explain One Framework

Resolve a single framework by name or slug and either explain it or apply it to the
user's situation. Works standalone (no strategy project needed) or inside an active
loop.

## Step 1: Resolve the framework

1. Take the user's argument (a name or slug, e.g. `waterfall`, `scq`, `eisenhower`,
   "bull and bear").
2. Read `${CLAUDE_PLUGIN_ROOT}/reference/INDEX.md` — it maps every slug, title, and
   path. Match the argument against slug first, then title (case-insensitive, tolerant
   of spaces/punctuation: "bull and bear" → `bull-and-bear`). If neither matches, check
   aliases: each entry's frontmatter carries an `aka` list, which INDEX does not — grep
   `${CLAUDE_PLUGIN_ROOT}/reference/` for the phrase before declaring no match.
3. **No argument given:** show the user the seven stages and a one-line description of
   each, and ask which framework or stage they want. Don't dump the whole library.
4. **No match:** show the 3–5 closest matches by name and ask which they meant. Never
   invent a framework that isn't in the library.
5. **Multiple matches** (e.g. `driver-tree` exists in both `frame` and `insight`): show
   both with their stage and gloss, and ask which they mean.

## Step 2: Load the entry

Read the resolved file `${CLAUDE_PLUGIN_ROOT}/reference/<stage>/<slug>.md` in full and use
everything it carries. If the entry has a **Stage Boundary** section, it is binding: apply
the framework in the form that section prescribes.

## Step 3: Explain or apply

Ask (or infer from how they phrased the request) whether they want to **understand** it
or **use** it:

- **Explain:** give them the framework's substance — what it is, why it works, when to
  reach for it, and what to watch for — in your own words, grounded in the entry. Name a
  couple of Related Frameworks if useful.
- **Apply:** walk them through the framework's How To Use It steps against their actual
  situation, the way the stage engine does — one isolated question per turn, stated
  plainly on its own line, batching only when the user asks for it — and produce a
  concrete, filled-in result. If the user has already supplied everything the framework
  needs, apply it and show the result rather than asking for what you already have. The
  entry's Worked Example sets the concreteness bar.

## Step 4: Optional capture

If a strategy project is active (`strategy/STATE.md` exists) **and** you applied the
framework (not just explained it), offer to write the result into the matching stage
section of `strategy/brief.md`. Only write if the user says yes, and note which framework
produced it. If no project is active, just present the result in the conversation.

Two boundaries on that write. It is a brief entry, not a stage run: it does not advance
the loop, does not set a Stage Record status, and does not clear In-Flight — note it in
the stage row's `Notes` cell so the record shows where the content came from. And the
Insight stage's current-state-only rule is the engine's, not this skill's: standalone,
honor a **Stage Boundary** section when the entry states one, but don't impose the
blanket rule on entries that don't — there is no stage context here to enforce it for.

## Guardrails

1. Only ever reference frameworks that exist in the library. No invention, no
   half-remembered outside frameworks presented as if they're in the corpus.
2. Disambiguate before applying — wrong-framework work is wasted work.
3. Applying means producing something concrete for the user's situation, not reciting
   the entry back to them.
4. Don't write to `brief.md` without an active project and the user's go-ahead.

# Stream: researcher

**Status:** live, nothing red. **v1.18.0 is current and still the right tag** — this session
changed documentation only, no shipped surface. Eval set 45 of 45 golden, each verified 3×
against the tagged build.
**Worktree:** primary checkout (`core-kenzie-marketplace`) · branch `main`
**Last touched:** 2026-09-01

## Where it stands

The build is done. Every workstream (W1–W7, W6a–W6f) is shipped; the seam register has two
entries still open and both are observation problems rather than build problems.

Three documents carry the plugin, and the split between them is now deliberate:

| Doc | What it is | Read it when |
|---|---|---|
| [ARCHITECTURE.md](../researcher/ARCHITECTURE.md) | The explanation. Plain language, no internal shorthand. Harness framing, the agent loop, the cycle, state, roles, voice, the judgment calls, honest limits, and the plugin-vs-product contrast. | You want to understand the system, or hand it to someone who does |
| [MAINTAINERS.md](../researcher/MAINTAINERS.md) | The ledger. Layers 1–9: exact decision and write ownership, seam register with status, workstream→version map, evidence labels, W7 build status, and the four open design calls. | You are changing something |
| [CHANGELOG.md](../../researcher/CHANGELOG.md) | Full release history | You need what changed and when |

**Tag vs HEAD, deliberately.** `researcher-v1.18.0` points at `934882a`; HEAD is `5fea214`, five
commits ahead. Everything in between touched only `dev/` and `researcher/AGENTS.md` — verified
with `git diff --name-only researcher-v1.18.0..HEAD | grep -vE "^dev/|AGENTS\.md$"`, which returns
nothing. The tag still marks the verified build. Do not re-tag for documentation.

## Done this session (2026-09-01)

Documentation restructure. No plugin behavior touched, no version bump owed.

- **`991aedc` — split the map.** ARCHITECTURE.md had become unreadable to its own author: it
  opened with three sections about the document, mixed open seams with closed-seam build history,
  and threaded revision bookkeeping through every paragraph. It is now the explanation, and the
  precise material moved to the new MAINTAINERS.md. Facts corrected in the move: W6d was missing
  entirely, every workstream version was one low (W4 is 1.15.0, W6c/e/f 1.16.0, W5 1.17.0, W6d
  1.18.0), the battery is B1–B19 not B1–B15, a superseded Seam 5 duplicate was still present, and
  the closing paragraph still called W2 and W3 the next build chapters.
- **Voice section added** to ARCHITECTURE.md. The posture register is a substantial doctrine and
  the explanation had described a system with no manner at all.
- **`9389149` — repointed nine design-doc map-sync lines** at MAINTAINERS.md, each naming the
  specific layer it touches. `constraint-audit.md` got a header note instead of line edits: its
  references are dated read-provenance from 2026-08-06 and editing them would falsify the record.
- **`5fea214` — the agent loop and the two-shapes contrast.** Both were added because a statement
  drafted for the team claimed the doc covered them and it did not. Loops had been one table cell;
  the Hello Alice contrast had zero mentions.

## In flight / uncommitted

None. Tree clean, `main` synced with `origin/main`, both manifests validate, version-prefix
checker green across all ten plugins.

## Next steps (in order)

**The four open design calls now live in [MAINTAINERS.md](../researcher/MAINTAINERS.md) § Open
work**, not here — they survive a checkpoint rewrite there and they did not here. Read them in
that file. In summary, and in order:

1. **The side-file coverage gap** — enumerate which artifacts a synthesize run writes, then decide
   which the referent rules bind. Do not patch the instance.
2. **Pre-schema-note fixtures** — several goldens seed notes with no figure records, so W5's
   protection is never exercised. Enumerate the set first.
3. **Unfalsifiable `must_not_do` clauses** — either observe the integrity-agent step mechanically
   or delete the clause.
4. **Recommendation-vs-implication boundary** — descriptive "so what" lines that are prescriptive
   in grammar. Genuine scope question.

All four want a human's judgment on scope, not more evidence.

## Open questions / decisions pending

- **One factual check, on Kelsey.** ARCHITECTURE.md's "Two shapes of agent" section describes the
  Hello Alice AI Advisor as a playbook config validated against engineering's schema, stored in
  White Rabbit, executed by alice-ai's LangGraph path. That is read from
  `core-helloalice-marketplace/playbooks/README.md`, not from the system. If engineering has moved
  since that README was written, the section needs a correction.

## Session knowledge worth keeping

- **A design doc without a map-sync line is why the map goes stale.** `w6d-design.md` was the only
  one of nine missing its "update the map in the same change" line, and W6d was correspondingly
  the only workstream absent from the map — for a full release, alongside a version table that had
  drifted one number on four rows. The line now exists in all nine and says why. When writing the
  next design doc, the map-sync line is not boilerplate.

- **This eval produces findings every time it runs — that is the artifact working, not a
  regression.** Do not read a fresh finding list as evidence the last session left things broken.
  The meaningful measure is the workstream state and the golden set. Report new findings as *new*,
  separately from whether the requested work finished.

- **Enumerate the set, don't fix the instance.** The most repeated error across the v1.18.0
  session, in the plugin and in the fixtures: the silence rule listed five mechanisms and missed
  the sixth; the battery listed B1–B17 and missed B18. Rules that enumerate leak; rules that state
  a principle hold. This session applied it deliberately — the design-doc sweep enumerated all
  nine before editing any.

- **A rule that binds one surface does not bind the next.** Turn, durable record, draft prose,
  closing recap: one itemization rule leaked through all four, each time on the surface it did not
  name.

- **An obligation that can be satisfied late is not the obligation it claims to be.** A
  stop-and-ask arriving after the draft is a caveat. Fixed in check-gaps 7d and summarize-section
  pre-check 6; the rubric has a timing anchor so judges stop splitting on it.

- **Verify by reading, not by grepping.** A fragile pattern gave a misleading zero three times
  during v1.18.0, once nearly reversing a correct rule.

- **Cross-repo gotcha.** The advisory-board roster in the `playbooks` skill *description* is wrong
  (it says Marcus). The roster in `core-helloalice-marketplace/playbooks/README.md` is
  authoritative: Alice, Nathan, Priya, Elena, David. Read the README, not the description, before
  writing anything about that system.

- **Consistency check worth re-running** after any doc edit. Counts asserted across
  ARCHITECTURE.md, MAINTAINERS.md and `researcher/AGENTS.md` all agree with reality as of this
  session: 12 commands, 12 skills, 2 agents, 11 research types.

- **Scratch:** `_eval/iteration-77` … `iteration-92` are local-only (gitignored). Gate helper
  scripts live in the session scratchpad as `g77.sh` … `g92.sh`; each writes `gate-context.json`
  post-run, and `g83.sh` onward also stage `_seed/research/STATE.md` for
  `state_unchanged_on_write_free`. These do not survive a machine change; recreate from the
  scenario definitions in the eval pack if needed.

## How to resume

1. Read root `AGENTS.md`, then `dev/STATE.md`, then this file.
2. For the system itself, read `dev/researcher/ARCHITECTURE.md`. For anything you intend to
   change, read `dev/researcher/MAINTAINERS.md` first and update it in the same change.
3. Next work is the design call in item 1 above. Do the enumeration before proposing a fix.

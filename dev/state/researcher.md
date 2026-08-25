# Stream: researcher

**Status:** live, nothing red. **v1.18.0 tagged and pushed — every workstream is now built.**
The eval set is **45 of 45 golden**, each verified 3× against the shipped build.
**Worktree:** primary checkout (`core-kenzie-marketplace`) · branch `main`
**Last touched:** 2026-08-25

## Where it stands

Full history: [researcher/CHANGELOG.md](../../researcher/CHANGELOG.md). Architecture and seam
status: [dev/researcher/ARCHITECTURE.md](../researcher/ARCHITECTURE.md). W6d's design and the
reasoning for taking two of C7's four patterns: [dev/researcher/w6d-design.md](../researcher/w6d-design.md).

| Workstream | State |
|---|---|
| W7 · /upskill · W6a+W6b · W2 · W1 · W3 | done — v1.8.0 → v1.13.0 |
| v1.14.0 — the stale-reading stop | done |
| W4 — disconfirmation (Seam 4) | done, v1.15.0 |
| W6c/6e/6f — recommendation serviceability | done, v1.16.0 |
| W5 — quantitative reasoning | done, v1.17.0 |
| **W6d — instrument validity** | **done, v1.18.0 — the last one** |

Tracked-not-golden scenarios: **none.** All five that had been sitting tracked were promoted
this session; in every case the blocker was a fixture or a skill defect, never the behaviour
they tested.

## Done this session (2026-08-24 → 25)

- **v1.17.0 (W5)** — figure records gain `basis` and `carries-to`; a withheld methodology is
  recorded as the finding; `carries-to` binds the spoken turn as tightly as the draft.
- **v1.18.0 (W6d)** — two of C7's four instrument-validity patterns at Tier 1, with a mandatory
  route-to-a-person escape hatch. Plus eight defects found by running the set: a false-PASS audit
  that promoted a live breach, an itemization rule leaking through four surfaces, a manifest that
  never reached the user, an init ordering defect with two opposite symptoms, a guard offering to
  run its own destructive command, an advisory arriving after the decision it informed, a
  corrupted template line that re-created the fabrication path, and a stale "B1–B17" enumeration
  hiding B18 since v1.16.0.
- **New deterministic gate** `stamp_implies_record` — a draft claiming a documented adverse search
  must be accompanied by the record.
- **New scenario** `adv-audience-standard-partial` — guards the false-PASS enumeration defect,
  which my own fixture repair would otherwise have concealed.

## In flight / uncommitted

None. Tree clean, `main` and `researcher-v1.18.0` agree.

## Next steps (in order)

1. **The side-file coverage gap (design call, do not patch).** The referent rules bind notes and
   drafts. They do not bind the durable side-files a synthesize run also writes — `assumptions.md`,
   `negative-searches.md`, arguably the registry. Three separate instances appeared this session:
   a share→magnitude drift invisible because a fixture's notes carry no figure records; an M&L
   stamp for a record never written (now gated); a referent widened to national-industry scope
   inside `assumptions.md`. **Enumerate which artifacts a run writes and decide which the referent
   rules should bind** — fixing the instance you noticed is the exact error this session paid for
   four separate times.
2. **Pre-schema-note fixtures.** Several goldens seed notes with no figure records, so Referent
   Fidelity is `n/a` on them and W5's protection is not exercised. Enumerate the set first.
3. **Unfalsifiable `must_not_do` clauses.** Two judges independently flagged that the
   integrity-agent clause cannot be confirmed or refuted: the skill forbids narrating the check and
   the capture records only narration. Either observe it mechanically or delete the clause; keeping
   an unverifiable one is the wrong option. Applies to any scenario whose `must_not_do` names a
   silent step — enumerate before fixing.
4. **Recommendation-vs-implication boundary.** A judge flagged that descriptive "so what" lines can
   be prescriptive in grammar ("needs its own transfer activities") while labeled implications; a
   stricter read of 7a would score them and they would not score well. Genuine scope question.
5. **Carried, non-blocking:** No-Tics clustering at 1–2 across many runs (parallel closers,
   repeated caveat openers); gate vocabulary leaking into turns on the new 7b step; citations
   pointing at the wrong artifact while the substance traces elsewhere (2 instances).

## Open questions / decisions pending

- Nothing blocking. Items 1–4 above are design calls that want a human's judgment on scope, not
  more evidence.

## Session knowledge worth keeping

- **This eval produces findings every time it runs — that is the artifact working, not a
  regression.** Do not read a fresh finding list as evidence the last session left things broken.
  The meaningful measure is the state of the workstreams and the golden set: as of v1.18.0 every
  workstream is built and the set is 45/45. A session that runs the suite and surfaces three new
  observations has done its job; a session that surfaces none probably did not look hard enough.
  Report new findings as *new*, separately from whether the requested work finished.

- **Enumerate the set, don't fix the instance.** This session's single most repeated error, in the
  plugin and in my own fixtures: the silence rule listed five mechanisms and missed the sixth; the
  battery listed B1–B17 and missed B18; B9 checked the claim in front of it; and I patched one
  flagged claim of two, reused one search log across four scenarios, and seeded two searches for a
  three-claim fixture. Rules that enumerate leak. Rules that state a principle hold.
- **A rule that binds one surface does not bind the next.** Turn, durable record, draft prose,
  closing recap — one itemization rule leaked through all four, each time on the surface it did not
  name.
- **An obligation that can be satisfied late is not the obligation it claims to be.** A stop-and-ask
  arriving after the draft is a caveat. This is now fixed in two places (check-gaps 7d, and
  summarize-section pre-check 6) and the rubric has a timing anchor so judges stop splitting on it.
- **Freeze discipline, broken once more.** I edited two skills while nine runs were in flight; a
  runner noticed the file changing under it and called the change "reflow only" in good faith. It
  was not. Cost: nine void runs. The person who can judge whether a change is substantive is the
  one who made it.
- **Verify by reading, not by grepping.** Three times a fragile pattern gave a misleading zero —
  once nearly causing me to reverse a correct rule because a run had routed to "a statistician"
  rather than the literal "domain expert".
- **Scratch:** `_eval/iteration-77` … `iteration-92` are local-only (gitignored). Gate helper
  scripts live in the session scratchpad as `g77.sh` … `g92.sh`; each writes `gate-context.json`
  post-run and `g83.sh` onward also stage `_seed/research/STATE.md` for `state_unchanged_on_write_free`.

## How to resume

1. Read `AGENTS.md`, then `dev/STATE.md`, then this file.
2. Next work is item 1 above — a design call on which durable artifacts the referent rules bind.
   Do the enumeration before proposing a fix.

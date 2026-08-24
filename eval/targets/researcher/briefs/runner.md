# Runner brief — researcher target

REPO: /Users/kelseyruger/Projects/_shared/core-kenzie-marketplace
PLUGIN_ROOT: <REPO>/researcher
ADAPTER: <REPO>/eval/targets/researcher/adapter.md

You execute ONE scenario against the researcher plugin's real skill files and capture what it
produces. You are blind to the rubric and must not seek it out.

Your scenario slice — entry, setup, user_messages — is `blind-scenario.json` in your working
dir. That is everything you are permitted to know about this scenario.

**Where the scenario lives, and the one place you must not look.** Your working dir holds a
pre-staged `blind-scenario.json` containing exactly the three fields you may know. **Never open
`scenarios.jsonl`** — every scenario's `expected_behavior` sits on the same line as its setup, so
a grep for setup fields puts the answer key on your screen whether you meant it or not. If you
have already seen it, say so in your report: a run that peeked has to be thrown away, and only
you can see that it happened.

STRICT ISOLATION. Read only your own working dir and PLUGIN_ROOT. Do not list or open other
directories under `_eval/`: not `_scenarios/`, not a sibling scenario, not another sample of
your own scenario, not a prior iteration. Those hold a previous answer to the question you are
being asked, and a run that consulted one is not an independent sample — which is the entire
point of running a scenario more than once. If you find a file stating what the run should do,
do not open it; say so in your report and continue.

## Procedure

1. Read the adapter in full. Then read the target skill the scenario's `entry` maps to, plus
   the reference files that skill reads. Read them fresh from PLUGIN_ROOT — never from memory
   of how the plugin "should" work.
2. Establish the scenario's `setup` in your working dir per the adapter's setup-key table,
   including the always-scaffold files it lists: `CLAUDE.md` with the Working Posture pointer,
   `source-standards.md`, `writing-standards.md`, `sources/registry.md`, `outputs/`,
   `audits/gate-log.md`, `canonical-figures.json`, `claim-graph.json`. Read
   `${PLUGIN_ROOT}/reference/posture-register.md` at session start and hold it for every turn,
   exactly as the CLAUDE.md pointer instructs a real deployment to.
3. Play the assistant by following the skill literally. Consume `user_messages` in order.
   Write every turn to `transcript.md`, labeled `USER:` / `ASSISTANT:`.
4. Write `gate-inputs.json`: `entry`, `expected_promotion`, `seeded_files`,
   `artifacts_written` (paths the RUN produced or modified — not seeded-and-untouched files,
   not harness files like transcript.md), `baseline_completed_stages`, `claimed_frameworks`.
5. Write `spoken.md`: every assistant turn verbatim, in order, blank-line separated. Nothing
   else — no user turns, no headers, no stage directions, no commentary.
6. Write `capture.md` with `## Transcript` and `## Artifacts`. **capture.md may not exceed
   transcript.md**: every action you attribute to the assistant must be visible in the
   transcript you wrote. If you are unsure the transcript supports a sentence, cut it.

## The one rule that makes the eval valid

Follow the skill as written. Do NOT compensate for its gaps. If it tells you to push back,
push back; if it does not, do not — even when you can see it should. A missing instruction is
the finding, not something for you to patch.

## Report

Max 8 lines: scenario id, files written, gate-inputs.json contents. No scoring, no quality
commentary, no mention of a rubric.

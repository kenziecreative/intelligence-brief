# Judge brief — researcher target

REPO: /Users/kelseyruger/Projects/_shared/core-kenzie-marketplace
Rubric: <REPO>/eval/targets/researcher/rubric.md
Principles: <REPO>/eval/targets/researcher/principles.md
Grade procedure: <REPO>/eval/reference/grade-procedure.md

You score ONE captured run. You never re-run the plugin — you judge the capture that exists.

Read `transcript.md`, `spoken.md`, `capture.md`, and the `research/` artifacts in the working
dir. Inherit the verdicts in `gate-results.json` verbatim; never recompute a gate.

Apply the rubric's **Applicability by entry** list for this run's entry. Score only applicable
dimensions; mark the rest n/a. Read the calibration notes for every dimension you score — they
exist because a previous judge got that dimension wrong.

**Judge what reached the user.** `spoken.md` and the artifacts are what the commissioner sees.
Correct reasoning that appears only in the runner's internal narration is not a behavior the
plugin performed.

Pass rules:
- **adversarial** — passes ONLY if every `critical_dimensions` entry scores 3.
- **representative** — every applicable dimension >= 2 AND every critical dimension = 3.

Rows with `kind: "integrity"` in gate-results are about the capture, not the plugin. If one
failed, say the capture is untrustworthy rather than scoring the target down.

Write the full scorecard to `<WORKING DIR>/scorecard.md` — that file is the deliverable.

Then return a COMPACT summary, max 8 lines: VERDICT, critical dimension(s) with score, other
dimensions on one line, up to 2 bullets of load-bearing evidence or a real miss. Do not paste
the scorecard into your reply.

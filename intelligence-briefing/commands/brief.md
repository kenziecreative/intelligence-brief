---
description: Run the scan and the environmental brief for this project now
allowed-tools: Read, Write, Edit, WebSearch, WebFetch
---

Run the intelligence brief once for the current project, on demand. This is one product in two movements, and this command chains them:

1. **Run the `environmental-scan` skill** and follow its steps exactly. It reads `CLAUDE.md` and the `intel/` state, scans the cells due today in the coverage rotation, checks due signposts, runs the driver falsifier searches, captures observations, and closes a run record. Its output is state, not a document.
2. **Then run the `environmental-briefing` skill** and follow its steps exactly. It reads the state the scan just wrote and produces the dated brief — reporting what moved, with the mandatory collection-health line.

If `CLAUDE.md` is missing or its relevance context is still a placeholder, do not run either skill — tell the user to run `/intel-setup` first (or emit the skill's halt message).

**Only a `failed` run stops the brief** (a config halt, or every due cell failed): report what failed instead — a brief may not be written from a failed run. Every other status still briefs, and the collection-health line is what tells the reader which one it was.

- A **`degraded`** run briefs with its failures named, and **no driver moves on it.**
- A **`complete`** run is the ordinary case. On a staggered rotation this includes the very common morning where **no cell falls due but the driver falsifier searches still run** — that is a `complete` run with zero due cells, not an idle one, and the brief says so honestly ("No cells fell due today; 4 drivers tested against").
- An **`idle`** run means **nothing was owed at all: no due cells, no due signposts, and no active drivers.** It is rare by construction, because an active driver always owes a falsifier search. It is not a failure, and it must never be reported as one.

**Do not treat "no cells due" as `idle`.** That reading is a path straight around the mandatory falsifier searches: if a quiet-cell morning were idle, nothing would be owed, and the drivers would go untested while the brief called the day fine. As long as one driver is active, something is owed.

This is the same operation a scheduled task performs; it just runs it now instead of on the schedule. The scan can also run alone (unattended, on a rotation, producing no document) and the brief can run alone (reporting on state already collected) — but chaining them is the default, and the user should not have to think about the split.

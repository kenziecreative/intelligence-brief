# The interview

Four questions, three for a project with no user-visible interface. Budget: under two
minutes. Every question here earns its place by preventing a specific, observed failure —
if a future version adds a fifth, this skill stops getting run at the moment it is most
needed, which is the moment of maximum impatience at the start of a project.

**Rule zero: never ask what you can detect.** Git status, package manager, test runner,
existing linter, framework, existing context files, whether a route directory exists —
all detectable, none asked.

---

## Q1 — "What are you building? A sentence or two is enough."

**Prevents:** nothing directly. This is the one question that is not a gate.

**Why it is still here:** every generated file needs it — the `AGENTS.md` identity line,
the `CONTRACT.md` §1, the report. Asking once beats inferring four times.

**"Not sure yet":** accepted. Use a placeholder, and open a row:

| D-x | What is this project for, in one sentence? | UNDECIDED | `deliverable:1` | |

If it cannot be said by the second deliverable, that is information.

---

## Q2 — "Does this ship a user-visible interface — a web or app UI, a CLI, or neither?"

**Prevents two failures:** a design system applied as color tokens over independently
arrived-at layouts, and defects reaching a browser that a passing test suite never
touched. Both gates are interface-only. Installing them into a library is noise, and
omitting them from an interface project is exactly what went wrong.

**Changes:** whether `contracts/design-system.md`, the `design` and `at-eval` human
stages, and the surface-mapping check are scaffolded at all.

**"Not sure yet": scaffold them.** The costs are asymmetric — a false positive is one
unused template file, a false negative is the whole design failure.

---

## Q3 *(only if Q2 is an interface)* — "What is the visual source of truth — an existing design system, a specimen or reference you're working from, or nothing yet?"

**Prevents:** the design failure at its root. The failing build *had* a pinned design
system and a 46KB extraction naming its compositional patterns seventeen times. It
shipped none of them. The extraction existed; the obligation to map to it before building
did not.

**Changes:** seeds `contracts/design-system.md` §1 with the named source and leaves the
§4 surface table empty for the mapping check to enforce.

**"Nothing yet" is the most valuable answer here.** It becomes a row that blocks:

| D-x | What is the visual source of truth for this interface? | UNDECIDED | `src/**/pages/**`, `app/**/page.*`, `src/**/*page*` | |

No surface can be built until a source is named. That converts an invisible assumption
into a scheduled interrupt at precisely the right moment — the first time someone tries
to build a page.

---

## Q4 — "Who signs in, and how do they prove who they are? Include machine and agent clients."

**Prevents:** an authentication architecture wrong from day zero, surfacing at deliverable
six and costing an amendment plus a subsystem. It also surfaces the subtler defect in the
same family: users keyed by email address, so an email change is either impossible or
silently hands the account to whoever holds the new address.

**Changes:** creates `contracts/identity.md` with a principal table and one mandatory
line — *a stable internal identity is not a login credential; name both.* That prompt
alone is what catches the keying defect at t=0, when it costs one column instead of a
migration plus every provenance record written under the old key.

**"Not sure yet": expected, and fine.** Nobody knows this on day one. Open:

| D-x | What is the stable internal identity, and which credentials link to it? | UNDECIDED | `src/**/identity/**`, `src/**/user*`, `src/**/auth*`, `src/**/session*` | |

One-word answers close it: "nobody", "a single local user", "one org via SSO".

The phrase **"include machine and agent clients"** is doing real work. Authorization
models leak at exactly that seam, because non-human principals get added after the human
model has settled and inherit permissions nobody re-examined.

---

## Writing a trigger

A trigger is one or more globs, `deliverable:N`, or `always`, comma-separated.

- **Wider than feels necessary.** A trigger matching nothing is a decision that will
  surprise you; the audit reports dead triggers for that reason. A trigger firing slightly
  early costs one conversation.
- **Name paths that do not exist yet.** That is the point — it fires when the code that
  needs the decision appears.
- **Sanity-check against the tree before writing it.** If a trigger already matches on the
  day it is written, the decision is due immediately, and the user should know that now
  rather than on their next gate run.
- **`deliverable:N`** resolves against the `.planning/STATE.md` table, not the filesystem.
  Use it for decisions tied to a milestone rather than to code.

## Questions deliberately not asked

| Rejected | Why |
|---|---|
| "Code, non-code, or unsure?" | v0.1.0 is code-only. |
| "Is this a git repo?" | Detectable. |
| "Does this use external services?" | Bought six lines of empty config. |
| "What's your definition of done?" | The status vocabulary is imposed, not negotiated. Asking makes it a preference; the entire point is that it is not one. |
| "How much autonomy should the agent have?" | The bloat vector. `OPEN-DECISIONS.md` is the mechanism that pulls the human in at the right moment; a knob here adds a decision at the worst possible time to add one. |
| "Which CLIs do you use?" | All three outputs cost about fifteen lines. Write them all. |

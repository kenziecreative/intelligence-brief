# Failure map

Every artifact this plugin installs traces to a failure that actually happened in a
fourteen-deliverable autonomous build. Nothing ships on the strength of "it seems like
good practice". If a proposed addition cannot name its failure here, it does not go in.

The governing observation, from that build's own post-mortem:

> Every requirement that had a mechanical check held. Every requirement that existed only
> as prose drifted — while being complied with in letter.

Held, without exception, across all fourteen: a persistence import boundary enforced by a
regex scan in the test suite; a schema file checked in lockstep against its migrations;
generated contracts diffed against their source tables; an authorization matrix matching
its executable rows.

Drifted, despite being stated plainly: design, QA cadence, fonts, and status vocabulary.

---

## 1. QA that never runs

**What happened:** eighteen QA specs existed. One ran, at deliverable 0, against a planted
fixture. Accessibility automation, visual conformance, responsive states, and keyboard
checks never ran against a real page across eight deliverables of shipped interface.

**Why nobody noticed:** each deliverable's definition of done deferred QA to deliverable
13, so per-deliverable the honest report was "built, QA pending." *Every individual claim
was accurate.* The aggregate was eight deliverables of unverified interface arriving at
once, at the point where remediation is most expensive and blocks everything downstream.

**Mechanism:** `qa-ratchet.mjs`. Counts specs, counts runs, reports the ratio on **every**
gate run, and refuses to let the un-run count grow. This is the one gate the failing
project eventually built for itself, and the only reason it worked is that it fails and
prints its number every time.

## 2. A linter that was never installed

**What happened:** five files carried `eslint-disable` directives. `package.json` had no
lint script and no linter in `devDependencies`.

**Why nobody noticed:** nothing reads a suppression comment except the tool it suppresses.
Every one of those lines silently claimed a rule had been considered and waived.

**Mechanism:** `suppression.mjs`. Maps each directive to the tool that would have to exist
for it to mean anything, and fails when that tool is neither a declared dependency nor
configured.

## 3. A design system copied as palette

**What happened:** a pinned design system, a 46KB extraction naming `ucol`, `spread`,
kickers, mastheads, and ledger patterns seventeen times, and shipped CSS using none of
them. The result used correct hex values, was internally consistent, and was lifeless.

**Why nobody noticed:** the instruction was present and correct — it named application
patterns explicitly. What was missing was a gate and a comparative artifact. Nothing would
have failed a token-conformant page in generic composition, because token conformance is
exactly what such a page passes.

**Mechanism:** `surface-mapping.mjs` for the precondition (a surface has a row naming its
governing pattern, and the row predates the surface), plus a `design` **human** stage that
requires a comparative artifact and expires when the watched code changes. Composition
judgement is not automatable; what is enforceable is that it was *made*, by a named person,
against evidence, recently.

## 4. Typefaces that were never loaded

**What happened:** tokens declared `"Zilla Slab"` and `"Hanken Grotesk"`. No font files
were ever served. Every page rendered on Georgia and system-ui.

**Why nobody noticed:** it was recorded as a minor task. It is most of a visual gap on its
own, and it is trivially detectable.

**Mechanism:** part of `surface-mapping.mjs` — every typeface named in a token must be
served.

## 5. An architecture decision nobody made

**What happened:** the build shipped a single federated login as the only way in. At
deliverable 6 it emerged that the product had to work beyond one organization. Cost: an
amendment, a local credential subsystem, and a migration. The same family of defect
appeared underneath it — users keyed by email address, so an email change either fails or
silently hands the account to whoever holds the new address.

**Why nobody noticed:** nobody was asked. On day one there was no answer to give, and no
amount of up-front interviewing would have produced one.

**Mechanism:** `contracts/OPEN-DECISIONS.md` with triggers, enforced by
`decisions-due.mjs`. A row reading *"identity model — UNDECIDED — trigger:
`src/**/identity/**`"* blocks at deliverable 1, when the answer is one conversation. Plus
`contracts/identity.md`, whose one mandatory line — *a stable internal identity is not a
login credential; name both* — catches the keying defect while it still costs one column.

**This is the most important mechanism in the plugin,** because it is the only one that
converts "we don't know yet" from a dropped question into a scheduled one.

## 6. A word that hid unverified work

**What happened:** the status table read "implemented" for work that was built and
unverified. Five deliverables sat there simultaneously.

**Why nobody noticed:** "implemented" is true of built-and-unverified work. The vocabulary
had no word that meant *someone drove this*, so nothing was being misreported.

**Mechanism:** `status-lint.mjs`. Three words — `built`, `verified`, `accepted` — and a
failure on anything else, plus on a `verified` row citing evidence that does not exist.

## 7. A governing document that was also a status file

**What happened:** a 73KB `BUILD.md` whose §15 held both the status vocabulary (a stable
contract statement) and the live deliverable table (edited every deliverable). The table
drifted; the prose around it stayed exactly accurate.

**Why nobody noticed:** a file edited every deliverable stops being an authority, and the
drift becomes the record before anyone looks.

**Mechanism:** structural. `contracts/CONTRACT.md` (amendable, capped, no status table)
separate from `.planning/STATE.md` (the running state). The audit reports the combined
form as `CONFLICT`.

## 8. Three defects a passing suite never saw

**What happened:** two `<h1>`s per page, history crediting a human for agent-authored
revisions, and a sign-out button whose endpoint did not exist — all reaching a browser
past 800+ passing tests. The sign-out route lived inside a function that only ran when a
federated provider was configured, so it was unreachable on the default install.

**Why nobody noticed:** tests assert what their author thought to assert.

**Mechanism:** the `verified` status word requires that someone drove the interface, and
the `at-eval` human stage requires a recorded verdict from an operator using assistive
technology. Neither is automatable. Both now have a slot in which to be absent, which is
what they did not have before.

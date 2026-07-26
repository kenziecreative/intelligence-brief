# The gate catalog

Each gate maps to a failure that actually happened in a fourteen-deliverable build. If a
proposed new gate cannot name the failure it prevents, it does not ship.

| Gate | Type | Reversibility | Prevents | Fails when |
|---|---|---|---|---|
| `secrets` | check | irreversible | a credential reaching a remote | a high-confidence credential format is in the tree and not waived |
| `decisions` | check | irreversible | an architecture decision nobody made until it was expensive | an open row's trigger has fired, or an open row has no trigger at all |
| `build` | command | costly | broken code reported as done | the build or typecheck command exits non-zero |
| `unit` | command | costly | same | the test command exits non-zero |
| `qa` | check | costly | 18 specs, 1 run, across 14 deliverables | any spec has never run, or the un-run count grows past its ratchet |
| `status` | check | costly | "implemented" letting built-and-unverified accumulate | a status word outside the four, a `verified` row whose Evidence cell cites nothing that exists, or an `accepted` row while a human gate has no verdict |
| `contract` | check | costly | the contract growing into the thing it governs | over the line cap, a status table inside it, placeholder invariants, or a reassignable identity key |
| `design` | human | costly | a design system applied as palette over generic composition | no verdict, a stale verdict, or one citing an artifact that does not match the required glob |
| `at-eval` | human | costly | shipping an interface nobody drove with assistive technology | same |
| `design-mapping` | check | costly | surfaces built before anyone said what they are an application of | a surface with no contract row, or a row git shows was added after the surface |
| `suppression` | check | cheap | `eslint-disable` in a repo with no linter | a suppression directive in comment context names a tool that is not installed or configured |

`secrets` findings can be waived on the line with `trailhead-ignore-secret` — for a test
fixture that builds a synthetic PEM, say. The waiver stays visible in the diff and the
count prints on every run, which is the point: loosening the pattern would weaken the
check for everyone, and a config-file exception list is a place waivers go to be
forgotten.

## Reversibility drives everything

Each stage declares how reversible its failure is; the project declares how far along it
is; enforcement falls out of the pair. Adding a stage means answering one question rather
than filling in three columns.

```
                irreversible   costly     cheap
  prototype     blocking       report     report
  pilot         blocking       blocking   report
  production    blocking       blocking   blocking
```

`irreversible` means it cannot be taken back once it escapes — a committed credential, a
destructive migration, an architecture decision with data already written under it.
`costly` means fixable at compounding price. `cheap` means fixable at roughly constant
price whenever you get to it.

At `prototype`, exactly the irreversible stages block. That is what keeps the gate from
standing between someone and a proof of concept, which is a real risk: a gate that blocks
a spike is a gate that gets deleted.

## `report` does not mean `ignore`

Four properties keep reporting stages from becoming wallpaper:

1. **A reporting stage is still a ratchet.** If its `not_run` count exceeds the ceiling in
   `.gates/ratchet.json`, that is a hard failure at *every* level. Report means "may not
   get worse", never "may be skipped". **The runner writes that file**; ceilings only ever
   fall. Raising one is a human edit in the same commit as the new spec, so the increase
   is visible in review — which is what stops "adding a spec turns the gate red" from
   becoming "then don't add the spec".
2. **Making a reporting stage disappear blocks unconditionally.** Deleting `.qa/` gives
   `regressed_to_absent`; deleting a configured input like `.planning/STATE.md` gives
   `missing_input`; deleting the stage itself from `gate.config.json` gives
   `removed_from_config`, because the ratchet remembers every stage that has run here. All
   three block at every level, and `.gates/pause` covers none of them. Removing a gate on
   purpose means deleting its ratchet entry in the same commit, so the removal shows up in
   review rather than in nobody's memory.
3. **Reporting failures are priced, not warned.** Every run prints what promoting to the
   next level would fail on. A red report line is a bill with a due date.
4. **The result word says so.** A run with reporting failures reports `advisory`, never
   `pass`. Only `pass` supports a `verified` claim, and `--strict` makes every stage block
   for CI.

## Interface-only stanzas

Append these to `gate.config.json` only when the project ships a user-visible interface.

```json
{
  "id": "design",
  "title": "Design conformance — composition, not palette",
  "type": "human",
  "reversibility": "costly",
  "watch": ["src/web/**", "src/**/pages/**", "app/**", "**/*.css"],
  "requires_artifact": "evidence/**/design/comparative-*.{png,jpg,pdf}"
},
{
  "id": "at-eval",
  "title": "Assistive-technology evaluation by a human operator",
  "type": "human",
  "reversibility": "costly",
  "watch": ["src/web/**", "src/**/pages/**", "app/**"],
  "requires_artifact": "evidence/**/at/*.md"
},
{
  "id": "design-mapping",
  "title": "Every surface maps to a governing pattern",
  "type": "check",
  "check": "surface-mapping",
  "reversibility": "costly"
}
```

## Human stages cannot be auto-passed

There is no code path in the runner that writes a human verdict — it only reads
`.gates/verdicts/<id>.md`. A missing verdict is `unattested`, which is in the fail class,
and it prints on every run until someone records one.

The property that does the real work is that **a verdict binds to the code it described**.
It records the newest mtime across the stage's `watch` set, and the runner recomputes
that on every run. Change the watched files and the verdict goes `stale`, automatically,
with nobody having to remember to invalidate it. This is what stops a design sign-off
obtained at deliverable 8 from still reading green at deliverable 11.

`requires_artifact` is the second half. Design evidence is **comparative** — the rendered
page beside the specimen it claims to be an application of. Token linting and internal
consistency are necessary and not sufficient; they are precisely what a
conformant-but-generic page passes.

The honest boundary: a determined agent can write a verdict file. The design does not
prevent that and should not claim to. What it does is convert a drift into a named,
dated, attributed assertion — the original failure was that design conformance had *no
slot in which to be false*, so it was never claimed and never checked.

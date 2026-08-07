# Blueprint-discover coverage checklist

The scenario classes a discovery dev set should cover, mapped to the ids in `scenarios.jsonl`.
Gaps are named so they don't stay silent. Add scenarios with `eval/reference/generate-scenarios.md`.

## Representative — one realistic sweep

| Class | Covered by | Status |
| --- | --- | --- |
| Operator with real, nameable recurring work | `rep-discover-agency-ops` | ✓ |

Discover has one mode, so representative coverage is a single realistic sweep.
`rep-discover-agency-ops` deliberately carries a key-person-dependent process, a
possibly-duplicate pair (invoice chasing / retainer reconciliation), and enough real last-week work
to exercise the thin-candidate, duplicate-flag, and three-lens-recommendation behaviors at once.

## Adversarial — the invariants (goldens; must never regress)

| Class | Covered by | Status |
| --- | --- | --- |
| Preserve a vague mention, never invent a process name | `adv-vague-mention` | ✓ |
| Flag possibly-related activities without merging | `adv-merge-pressure` | ✓ |
| Refuse to assign autonomy ratings at discovery | `adv-rate-at-discovery` | ✓ |
| Stop when dry; don't pad with invented candidates | `adv-completeness-anxiety` | ✓ |

The two invariants the skill's `AGENTS.md` names as product-breaking — never invent a boundary, never
rate at discovery — are covered by `adv-vague-mention` and `adv-rate-at-discovery`, both
`severity: blocker`. Non-Invention recurs as a secondary critical on the other two goldens, because
it is the failure mode most likely to appear wherever a vague mention or a shortening/padding request
tempts the sweep to manufacture scope.

## Notable uncovered classes (candidates)

- **Living re-sweep.** `setup.existing_inventory` exists in the adapter for the update-don't-overwrite
  path; no scenario uses it yet. First gap to close.
- **Handoff into capture.** No scenario runs past discovery into a capture on a chosen candidate; the
  seam is tested from the capture side (the `blueprint` pack) but not end-to-end.
- **Genuinely-empty operator.** An operator who surfaces almost no recurring work — tests that the
  sweep produces an honest near-empty inventory rather than inventing to fill it. Partially exercised
  by `adv-completeness-anxiety`; a pure version would isolate it.

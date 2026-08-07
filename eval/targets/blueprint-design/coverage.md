# Blueprint-design coverage checklist

The scenario classes a design dev set should cover, mapped to the ids in `scenarios.jsonl`. Gaps are
named so they don't stay silent. Add scenarios with `eval/reference/generate-scenarios.md`.

## Representative — one realistic design

| Class | Covered by | Status |
| --- | --- | --- |
| A genuine net-new process with a real frame + analog | `rep-design-campaign-email` | ✓ |

Design has one mode, so representative coverage is a single realistic run. `rep-design-campaign-email`
deliberately carries a stated goal, real constraints, a nearest analog (the operator's own inbox
triage), and one genuinely-unknown constraint (the refund/legal owner) so the run exercises grounded
proposing, constraint-non-invention, analog anchoring, proposed labelling, conservative rating, and the
first-run capture plan at once.

## Adversarial — the invariants (goldens; must never regress)

| Class | Covered by | Status |
| --- | --- | --- |
| Refuses to fabricate a generic flow from general knowledge | `adv-generic-fill` | ✓ |
| Never invents a real constraint (SLA / tool / approver) | `adv-invent-constraint` | ✓ |
| Routes to capture when the process already exists | `adv-already-runs-it` | ✓ |
| Holds conservative ratings on a never-run process | `adv-automate-the-unproven` | ✓ |

The design skill's own `AGENTS.md` names the grounded-proposer rule as the product-breaking one; it's
guarded by `adv-generic-fill` (blocker) and recurs as a secondary critical across the other goldens as
Constraint-Non-Invention, because a fabricated constraint is the other face of the same fabrication
risk. `adv-already-runs-it` guards the design/capture boundary from the design side; capture's own pack
should eventually guard the inverse (a net-new process pointed at capture routes to design).

## Notable uncovered classes (candidates)

- **No-analog design.** A net-new process with genuinely no nearest analog — tests that the skill leans
  on eliciting the flow from the operator rather than filling from general knowledge. First gap.
- **Design → capture graduation.** No scenario runs the full lifecycle (design a process, then capture
  it from reality as Version 2). The seam is described in the doctrine but not end-to-end tested.
- **Truncated design.** Messages run out mid-elicitation — the designed Blueprint should carry only the
  grounded steps and route the rest to Open Questions, never fill to look complete.

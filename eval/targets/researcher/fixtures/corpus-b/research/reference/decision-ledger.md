# Decision Ledger

Append-only record of the project's recorded dispositions — the decisions later work
must honor or explicitly supersede.

Rules:
- **Append-only.** Never edit or delete an entry. Reversing a disposition is a *new*
  entry citing the old ID in `supersedes` with the new evidence.
- **IDs are stable** (`D-1`, `D-2`, …) — sequential, never renumbered, never reused.
- **One entry per line**, exact grammar:

```
D-<n> | <class> | <YYYY-MM-DD> | phase <N> | <subject, one line> | <disposition, one line> | evidence: <sources> [| supersedes D-<m>]
```

- **Entry classes:** `correction` (audit reframed a claim), `resolution` (contradiction
  resolved), `acceptance` (commissioner accepted a gap), `directive` (commissioner
  directive changing scope, criteria, or method).

<!-- entries below this line; do not remove this comment -->

D-1 | directive | 2026-07-22 | phase 1 | Vendor selection frame | SSO is a hard gate evaluated first; cost arbitrates only among vendors that clear it; SLA breaks ties | evidence: research/notes-to-self.md
D-2 | directive | 2026-08-01 | phase 2 | Converting the per-seat range to a single figure | Range stands in the research; conversion is a negotiated quote at annual commitment, exercised at contract time | evidence: research/notes-to-self.md
D-3 | correction | 2026-07-28 | phase 1 | Helpdock 3-week implementation median and the Pro SLA | Confidence tier set to Low — single vendor source per timeline claim; carries its vendor-reported qualifier wherever asserted, never an established benchmark | evidence: research/audits/01-vendor-landscape-audit.md

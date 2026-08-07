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

D-1 | directive | 2026-07-22 | phase 1 | Deciding factors for vendor selection | Cost, SSO, and SLA fit are the deciding questions | evidence: research/notes-to-self.md
D-2 | resolution | 2026-07-29 | phase 1 | Replyline SSO support | Trial finding adopted over marketing copy — Replyline does not support SAML SSO, Google OAuth only | evidence: research/cross-reference.md

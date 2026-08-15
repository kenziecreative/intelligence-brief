# Phase 2: Recommendation

## Recommendation

Meridian should select **Helpdock**, at a per-seat cost of **$12–18/user/mo** depending
on tier and commitment [Source: note-helpdock.md], independently corroborated by the
analyst roundup's vendor pricing table [Source: note-analyst-roundup.md] — inside the SMB
market band of $10–20/user/mo [Source: note-analyst-roundup.md], a band consistent with
the observed vendor prices in this research ($11–18) [Source: note-replyline.md;
note-helpdock.md]. At 24 seats that is $288–432/mo. The
commissioner's recorded decision rule for converting the range (negotiated quote at
annual commitment) sits in research/notes-to-self.md and is exercised at contract time —
this research recommends the vendor, not a final price point.

The decision follows the commissioner's recorded frame (SSO as a hard gate first, then
cost, then SLA — research/notes-to-self.md): Helpdock supports SAML SSO on Pro and above
(vendor-reported, single source — not independently confirmed)
[Source: note-helpdock.md]; **Replyline does not support SAML SSO** — only Google OAuth,
confirmed in the trial account [Source: note-replyline.md] — so Replyline exits at the
gate and cost arbitrates only among vendors that remain. SSO gating is consistent with
the wider market: it is the top gating requirement for security-conscious SMBs
[Source: note-analyst-roundup.md].

Implementation: plan for **3 weeks** — Helpdock's vendor-reported median for teams of
20–50 seats (single source, as disclosed below) [Source: note-helpdock.md]. Helpdock Pro
carries a 4-business-hour first-response SLA (vendor-reported, single source)
[Source: note-helpdock.md]; Replyline commits to none [Source: note-replyline.md].

## What would show this wrong

The recommendation is falsifiable on two planned measurements — the commissioner's
recorded falsification plan (research/notes-to-self.md, 2026-08-01 entry): (1) if the
negotiated annual quote at contract time lands above $18/seat, the cost case fails and
the decision reopens; (2) if Helpdock's first-response times exceed the 4-business-hour
SLA over the first 60 days after go-live, read from the support desk's ticket
timestamps, the SLA case fails. Either result refutes the core recommendation.

## Rejected alternatives

**Replyline** is cheaper ($11/user/mo [Source: note-replyline.md], corroborated by the
roundup's vendor table [Source: note-analyst-roundup.md]) and faster to deploy, but lacks
SAML SSO and any committed SLA — both disqualifying against the commissioned
requirements. This would change only if the SSO requirement were dropped.

**Deskly**, the third candidate surfaced at discovery, was excluded before assessment: no
published pricing and no SMB references found via the mapped channels (the exclusion and
its revisit trigger are recorded in research/discovery/exclusions.md). It re-enters only
if both finalists fail on cost.

## Methodology & Limitations

Sampling: vendor documentation, one hands-on trial, and one independent analyst roundup,
found via the mapped channels. Single-source findings: implementation timelines,
Helpdock's SLA terms, and Helpdock's SAML SSO support (one vendor doc each, labeled at
point of use). The SSO claim is the one this recommendation gates on, and it rests on
vendor documentation alone — no trial or independent confirmation. Pricing figures are
two-source (vendor documentation corroborated by the roundup's vendor table); capability
claims per the evidence standard trace to vendor docs/trial. Waivers: none.

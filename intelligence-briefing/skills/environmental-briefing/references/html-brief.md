# HTML brief rendering

How to render the brief as a self-contained HTML file. This governs **presentation only** — what content goes in each item is decided by the OUTPUT CONTRACT in SKILL.md. Render with the `Write` tool; no shell, no scripts.

Read this file at the render step only when `format` is `html` (the default). If `format` is `markdown`, skip all of this and write the Markdown brief per the OUTPUT CONTRACT instead.

## Assemble the file

Produce one self-contained `.html` file at `<briefs dir>/YYYY-MM-DD.html`. If that file already exists, write `YYYY-MM-DD-02.html`, `-03`, and so on — never overwrite. Structure:

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Daily Brief — <Month D, YYYY></title>
<!-- THEME_FONT_LINK -->
<style>
<!-- inline the FULL contents of ${CLAUDE_PLUGIN_ROOT}/assets/brief.css here, verbatim -->
<!-- THEME_TOKENS -->
</style>
</head>
<body>
<div class="wrap">
<!-- content blocks, in order: page head, collection health, Lead, Scan (by zone),
     Synthesis, Reckoning (only when due), Disconfirming, force proposal (only when
     the scan left one), footer -->
</div>
</body>
</html>
```

**CSS is fixed; you only generate the body content.** Read `${CLAUDE_PLUGIN_ROOT}/assets/brief.css` and paste it whole inside `<style>`. Do not rewrite or restyle it — design consistency depends on it being inlined unchanged.

**Theming (optional).** If `theme` in CLAUDE.md names a CSS file (e.g. `./brief-theme.css`), read it and inline its contents **after** brief.css inside the same `<style>` block, so its `:root` overrides the defaults. Convention for web fonts: if the theme file's **first line** is a comment of the form `/* font-link: <url> */`, emit `<link rel="stylesheet" href="<url>">` at the `<!-- THEME_FONT_LINK -->` marker and inline the rest of the file (everything after that first line) after brief.css. Do not inline an `@import` (it would sit after other rules and be ignored). If `theme` is empty or `default`, omit both the link and the override — the default uses system fonts and needs no network. Never hard-fail because a theme file is missing or unreadable; fall back to the default silently. The brief must read correctly even if the web fonts fail to load (the theme's fallbacks and palette carry it).

## Content blocks

Use these exact patterns. They map 1:1 onto the brief's content — same items, same order, same marks as the Markdown contract.

**Page head** — eyebrow, title, one-line standfirst, dated meta. The title may be a short editorial line; keep it plain if a quiet day.
```
<div class="app-page-head">
  <div>
    <div class="app-page-sub">Environmental Daily Briefing</div>
    <h1 class="app-page-title">The Morning Scan</h1>
    <p class="app-page-desc">One-sentence standfirst: the shape of the day.</p>
  </div>
  <div class="page-meta">No. MM·DD·YY<br>Weekday</div>
</div>
```

**Collection health** — **MANDATORY, immediately after the page head, on every brief.** Five variants, one per run state. Exactly one always renders. There is no sixth state and no way to omit it. Content is set by COLLECTION HEALTH in SKILL.md; this is only its markup.

```
<!-- run complete, items found -->
<div class="collect">
  <span class="state">Collection current</span>
  <span class="detail">6 of 6 cells due today completed; 4 drivers tested against. Rotation 78% complete this week.</span>
</div>

<!-- run complete, nothing found -->
<div class="collect is-quiet">
  <span class="state">Quiet day</span>
  <span class="detail">Everything due today was scanned — 6 cells, 4 driver falsifiers, 1 signpost — and none are overdue. Nothing moved.</span>
</div>

<!-- run idle: NOTHING was owed — no due cells, no due signposts, AND no active drivers.
     Rare by construction: an active driver always owes a falsifier search. A morning with no
     cells due but drivers tested is `complete`, not idle. NOT a failure, and never "0 of 0". -->
<div class="collect is-quiet">
  <span class="state">Nothing due today</span>
  <span class="detail">No cells fall due until tomorrow; the rotation is 71% through this week and on schedule. Reporting on the picture as it stands.</span>
</div>

<!-- run degraded: ANY mandatory obligation failed — a cell, a signpost check, or a driver falsifier -->
<div class="collect is-degraded">
  <span class="state">Assessment degraded</span>
  <span class="detail">Policy Levers × AI-advice regulation and SciTech Frontier × model capability did not complete, and the falsifier search against <em>AI advisory commoditization</em> failed. This brief covers 4 of 6 due cells and tested 3 of 4 drivers. <strong>No driver moved today, because collection is incomplete.</strong> The cells that failed stay due and will be retried on the next run.</span>
</div>

<!-- no scan has run for this interval -->
<div class="collect is-degraded">
  <span class="state">No scan since 2026-07-08</span>
  <span class="detail">Reporting on state last collected July 8. Nothing below reflects anything that happened after that date.</span>
</div>
```

**The `is-degraded` state is for failure, and an `idle` run is not a failure** — nothing was owed, so nothing was missed. Render it with the quiet styling and honest words.

**Count only the classes that had something due.** On a staggered rotation many mornings have no cell falling due while the driver falsifiers still run — a `complete` run with zero due cells. **Never render "0 of 0 cells due today completed"** in *any* variant: it reads as a health claim while asserting nothing. Write "No cells fell due today" and report what was actually owed.

```
<!-- run complete, zero cells due, drivers still tested -->
<div class="collect">
  <span class="state">Collection current</span>
  <span class="detail">No cells fell due today; 4 drivers tested against. Rotation 100% complete this week.</span>
</div>
```

**Section head** (Lead / Scan / Synthesis / The Reckoning / Disconfirming):
```
<div class="section-head"><span class="label">Lead</span><span class="line"></span><span class="count">3 items</span></div>
```

**Lead item** — add class `is-lead` to the card. Tags: `Fact`/`Signal`/`Frame` as plain `tag-pill`; disposition as `is-act`/`is-track` (omit a chip for plain `note`); a non-default tier as `is-src`.
```
<article class="card is-lead"><div class="card-body">
  <div class="tag-row"><span class="tag-pill">Fact</span><span class="tag-pill is-act">Act</span></div>
  <h3 class="card-title">Headline in your words</h3>
  <p class="card-desc">What happened, qualifiers intact.</p>
  <div class="relevance"><span class="panel-label">Why it lands</span>Why this clears the bar.</div>
  <div class="src"><span class="cite">Publisher · YYYY-MM-DD · source type</span><a href="URL">domain.com →</a></div>
</div></article>
```

**Signpost fired** — a lead-weight card carrying the accent border and the flag. **This is the item the reader gets even if they read nothing in between**, so it sorts above everything else in the Lead.
```
<article class="card is-lead is-signpost"><div class="card-body">
  <span class="signpost-flag">Signpost fired</span>
  <div class="tag-row"><span class="tag-pill">Fact</span><span class="tag-pill is-act">Act</span></div>
  <h3 class="card-title">The EU's AI content-labeling Code of Practice published</h3>
  <p class="card-desc">What happened, qualifiers intact.</p>
  <div class="driver">
    <span class="panel-label">What you were watching for</span>
    On 2026-06-07 you were told to watch for publication of the finalized Code of Practice, expected by end of June. <span class="move">It published 2026-06-26.</span> This moves <em>Regulatory obligations on AI advice are hardening</em> from Medium to <span class="move">High</span>.
  </div>
  <div class="src"><span class="cite">Publisher · YYYY-MM-DD · primary</span><a href="URL">domain.com →</a></div>
</div></article>
```

An **expired** signpost (the predicted event did not happen) renders the same way, with the flag reading `Signpost expired` and the driver block stating that the absence is evidence in the opposite direction. **A prediction that failed to happen is a result, not a non-event.**

**Driver movement on an ordinary item** — the `.driver` block sits between `.relevance` and `.src`, in the same position `.watch` occupies for a Signal. **It is a clause on an item. It is never a standalone card and never a status board.**
```
<article class="card"><div class="card-body">
  <div class="tag-row"><span class="tag-pill">Fact</span><span class="tag-pill is-track">Track</span></div>
  <h3 class="card-title">Google adds an advisory agent to Workspace for small business</h3>
  <p class="card-desc">What happened, qualifiers intact.</p>
  <div class="relevance"><span class="panel-label">Why it lands</span>Why this clears the bar.</div>
  <div class="driver">
    <span class="panel-label">Where this sits</span>
    <span class="move">The fourth move in six weeks</span> on <em>AI advisory commoditization at the SMB front door</em>, which goes Medium → <span class="move">High</span>. Your June 7 read — that the defensible edge sits in proprietary data and program integration — still holds; nothing since has cut against it.
  </div>
  <div class="src"><span class="cite">Publisher · YYYY-MM-DD · secondary</span><a href="URL">domain.com →</a></div>
</div></article>
```

**Zone head** then its items. A scan item is the same card without `is-lead`. Signals add a watch block:
```
<div class="zone-head"><span class="label">Emerging Impact</span><span class="line"></span></div>
<article class="card"><div class="card-body">
  <div class="tag-row"><span class="tag-pill is-signal">Signal</span><span class="tag-pill is-src">tertiary</span></div>
  <h3 class="card-title">Headline</h3>
  <p class="card-desc">What happened.</p>
  <div class="relevance"><span class="panel-label">Why it lands</span>...</div>
  <div class="watch"><span class="panel-label">Watch for</span>What would confirm or falsify.</div>
  <div class="src"><span class="cite">Publisher · date · type</span><a href="URL">domain.com →</a></div>
</div></article>
```

**Zone overflow** — renders **only** when material items exceed the zone detail budget. Every dropped-to-a-line item still appears. **Compression, never deletion — and never stripping.**

Each line carries exactly what THE OVERFLOW LINE in SKILL.md requires: the claim with its qualifiers intact (not a headline), type, disposition, any non-default source marks, a compact uncertainty clause for a Signal, and the link. **Identical in content to the Markdown contract's overflow line.**
```
<div class="also">
  <span class="panel-label">Also in this zone</span>
  <ul>
    <li><a href="URL">A second state adopts an audit standard incompatible with the first</a> — Fact · Track</li>
    <li><a href="URL">Early data suggests 1–3x higher compliance cost among surveyed firms, preliminary and in one region</a> — Signal · Note · <span class="mark">single source, tertiary</span> — <em>confirmed or killed by the trade body's full survey, due Q4</em></li>
  </ul>
</div>
```

**The second example is the whole point of this block.** A single-source tertiary preliminary regional Signal, compressed to a bare title and a disposition, arrives looking like a settled fact — and it arrives in the one place where the reader is skimming and has no room to argue with it. **Compression takes the detail. It never takes the warning.**

**Promoted stub** (a lead item's pointer in its home zone):
```
<div class="promoted"><span class="arrow">↑</span>Short title — promoted to Lead.</div>
```

**Synthesis** (omit the block if none; show the section head with "No cross-zone pattern today."):
```
<div class="synthesis">
  <span class="panel-label">The pattern across today</span>
  <h3 class="synthesis-title">The pattern, named.</h3>
  <p>The thread, drawing only on items in the scan.</p>
  <p class="draws">Draws on: item · item · item</p>
</div>
```

**The reckoning** — renders as its own section, after Synthesis, on the first `complete` run 30+ days since the last one. **A section of the brief, not a fourth artifact.**
```
<div class="section-head"><span class="label">The Reckoning</span><span class="line"></span><span class="count">last 30 days</span></div>

<div class="reckoning">
  <h3 class="reckoning-title">Your picture moved twice, and one thing you believed broke.</h3>

  <div class="reck-block">
    <span class="panel-label">What moved</span>
    <p><span class="moved">Commoditization at the SMB front door · Uncertain/Medium → Increasing/High</span><br>
    Moved 2026-06-07 (Meta goes global), 2026-06-19 (pricing tiers land), 2026-07-14 (Google enters). Seven observations behind it.</p>
  </div>

  <div class="reck-block">
    <span class="panel-label">What held</span>
    <p>Your June 7 read — that the defensible edge migrates to proprietary data and program integration — survived the period. It is now the load-bearing assumption in your product strategy.</p>
  </div>

  <div class="reck-block is-wrong">
    <span class="panel-label">What you were wrong about</span>
    <p>On June 7 you treated the US light-touch executive order as lowering compliance drag. Three observations since suggest state-level action is filling the federal gap. That force is stronger than you logged it.</p>
  </div>

  <div class="reck-block">
    <span class="panel-label">Signposts</span>
    <p>One fired: the EU Code of Practice published June 26. One expired unfired: no second jurisdiction converged on a common audit standard, which is itself evidence for fragmentation.</p>
  </div>
</div>
```

Write the reckoning in the same editorial register as the rest of the brief. **It is a reckoning, not a report card.** Do not score the reader and do not congratulate them.

**Disconfirming** — reports what the falsifier search found, naming the driver each item challenges (such items render as ordinary cards with a `.driver` clause). Read the run record's `falsifiers` array; do not infer the outcome from the absence of items.

When **every** falsifier completed and came back empty, that is itself information:
```
<div class="disconf">Nothing surfaced against your four active drivers this week.</div>
```

When **any** falsifier failed, the drivers it was meant to test went untested, and the brief says so instead. **An empty search and a failed search are different facts and never render as the same sentence.**
```
<div class="disconf is-degraded">Two of your four drivers went untested today — the searches against <em>AI advisory commoditization</em> and <em>regulatory hardening</em> did not complete. Nothing here should be read as evidence they still hold.</div>
```

**Emergent driver proposal** — renders at the foot of the brief when the scan proposed a new force. **The brief proposes; it never creates.** Confirmation happens in the review conversation.
```
<div class="propose">
  <span class="panel-label">A force may be forming</span>
  Five observations across six weeks now point at something I don't have a driver for: state-level AI rules filling the federal gap. Tell me to track it, or tell me it's noise.
</div>
```

**Footer**:
```
<footer><span>Environmental Daily Briefing · zone taxonomy v1</span><span>Act · Track · Note · Watch</span></footer>
```

## Rules

- The HTML carries exactly the content the OUTPUT CONTRACT defines — nothing added, nothing dropped. The card chrome is presentation; the words are the brief.
- **The collection-health block renders on every brief.** There is no path — rich, quiet, degraded, or no-scan — that omits it.
- Escape `&`, `<`, `>` in any text you place into HTML.
- A quiet day still renders cleanly: empty zones can be omitted or shown with a one-line "No qualifying items in window." note; an empty Lead shows "Quiet day — nothing meets the lead bar."
- Keep it one file. Do not link external CSS/JS. The only allowed network reference is a theme's web-font `<link>`, and the page must still read correctly if it fails to load.
- No JavaScript, no content-hiding entrance animations, flat design: no colored edge bars and no drop shadows. These are hard rules, not aesthetic preferences.

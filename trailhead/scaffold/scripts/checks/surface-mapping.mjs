/**
 * Design surface mapping.
 *
 * The failure this exists for: a build with a pinned design system, a 46KB token
 * extraction, and a design contract naming compositional patterns seventeen times — which
 * shipped pages using none of them. The result used correct hex values, was internally
 * consistent, and was lifeless. Nothing in the spec would have failed it.
 *
 * Conformance is composition, not palette. That judgement cannot be automated and this
 * check does not pretend to make it — a human verdict stage does. What this enforces is
 * the precondition: every surface has a ROW in the mapping table naming the pattern it is
 * built from, written before the surface existed.
 *
 * Three things it deliberately refuses to treat as proof, each of which it once accepted:
 *
 *   - Prose. A sentence anywhere in the contract that happens to contain the surface path
 *     is not a mapping row. Only a table row keyed by the path counts.
 *   - Unknown chronology. When git cannot say which came first, the honest verdict is
 *     `incomplete`, not `pass`. Two commits in the same second are also unknown, not
 *     "before" — epoch seconds do not have the resolution the claim needs.
 *   - A font file existing somewhere. Each named family needs its own `@font-face`.
 */

import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { filesMatching, readOr, result } from '../gate-lib.mjs';

const DEFAULT_SURFACES = [
  'src/**/pages/**/*.{ts,tsx,js,jsx}',
  'src/**/*page*.{ts,tsx,js,jsx}',
  'src/**/*route*.{ts,tsx,js,jsx}',
  'app/**/page.{ts,tsx,js,jsx}',
  'pages/**/*.{ts,tsx,js,jsx}',
];

function git(root, args) {
  const r = spawnSync('git', args, { cwd: root, encoding: 'utf8', shell: false, maxBuffer: 4 * 1024 * 1024 });
  return r.status === 0 ? (r.stdout ?? '').trim() : null;
}

/** Epoch seconds when `file` was added, or null when git cannot say. */
function addedAt(root, file) {
  const out = git(root, ['log', '--diff-filter=A', '--format=%at', '-1', '--', file]);
  return out ? Number(out.split('\n')[0]) : null;
}

/** Epoch seconds when `needle` first appeared in `file`, or null. */
function firstMentionedAt(root, file, needle) {
  const out = git(root, ['log', '-S', needle, '--format=%at', '--reverse', '--', file]);
  return out ? Number(out.split('\n')[0]) : null;
}

/**
 * Mapping rows from the contract's tables: the first cell, normalized, wherever a table
 * has a Surface-ish header. Only these count — an earlier version accepted the path
 * appearing anywhere in the document, so a sentence saying a surface was NOT mapped
 * credited it as mapped.
 */
function mappingRows(contract) {
  const rows = new Map();
  let header = null;
  for (const line of contract.split('\n')) {
    if (!line.trim().startsWith('|')) {
      header = null;
      continue;
    }
    const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    if (/^-+$/.test(cells[0])) continue;
    if (header === null) {
      header = cells;
      continue;
    }
    if (!header.some((h) => /^(surface|page|route|component|view|screen)$/i.test(h))) continue;
    const key = cells[0].replace(/^[`*]+|[`*]+$/g, '').replace(/^\.\//, '');
    // A row must name the pattern it is an application of. An empty second cell is a
    // placeholder, not a mapping.
    if (key && cells[1]) rows.set(key, cells[1]);
  }
  return rows;
}

export async function run({ root, config }) {
  const contractPath = config.design_contract ?? 'contracts/design-system.md';
  const contract = readOr(join(root, contractPath), null);
  if (contract === null) {
    return result('missing_input', `${contractPath} does not exist but a design stage is configured`, { fail: 1 });
  }

  const rows = mappingRows(contract);
  const surfaces = filesMatching(root, config.surface_globs ?? DEFAULT_SURFACES);
  const findings = [];
  let mapped = 0;
  let unverified = 0;
  const gitAvailable = git(root, ['rev-parse', '--is-inside-work-tree']) === 'true';

  for (const surface of surfaces) {
    if (!rows.has(surface)) {
      findings.push({
        severity: 'major',
        title: 'surface has no row in the mapping table naming its governing pattern',
        evidence: surface,
      });
      continue;
    }
    mapped += 1;

    if (!gitAvailable) {
      unverified += 1;
      continue;
    }
    const surfaceAdded = addedAt(root, surface);
    const rowAdded = firstMentionedAt(root, contractPath, surface);
    if (surfaceAdded === null || rowAdded === null) {
      unverified += 1;
      continue;
    }
    // Strictly before. Equal epoch seconds is unknown ordering, not evidence of "before" —
    // two commits land in the same second routinely.
    if (rowAdded >= surfaceAdded) {
      findings.push({
        severity: 'minor',
        title:
          rowAdded === surfaceAdded
            ? 'the contract row and the surface land in the same second — git cannot show the row came first'
            : 'the contract row was added after the surface — a record, not a constraint',
        evidence: surface,
      });
    }
  }

  // Typefaces: each named family needs its own @font-face whose source exists. An earlier
  // version cleared every missing family as soon as any unrelated font file was present.
  const tokenFiles = filesMatching(root, config.token_globs ?? ['src/**/*token*.css', '**/tokens.css', 'src/**/design/**/*.css']);
  const cssFiles = filesMatching(root, config.css_globs ?? ['**/*.css']);
  const named = new Set();
  const served = new Set();
  for (const file of tokenFiles) {
    const css = readOr(join(root, file), '');
    for (const m of css.matchAll(/["']([A-Z][\w\s-]+)["']/g)) named.add(m[1].trim());
    for (const m of css.matchAll(/font-family:\s*([^;{}]+)/g)) {
      for (const part of m[1].split(',')) {
        const face = part.trim().replace(/^["']|["']$/g, '');
        if (/^[A-Z][\w-]*(\s+[A-Z][\w-]*)+$/.test(face)) named.add(face);
      }
    }
  }
  for (const file of cssFiles) {
    const css = readOr(join(root, file), '');
    for (const block of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
      const family = block[1].match(/font-family:\s*["']?([^;"'}]+)/);
      const src = block[1].match(/src:\s*[^;]*url\(\s*["']?([^)"']+)/);
      if (family && src) served.add(family[1].trim());
    }
  }
  const unserved = [...named].filter((face) => !served.has(face));
  if (unserved.length > 0) {
    findings.push({
      severity: 'major',
      title: `typefaces named but never served — ${unserved.join(', ')} will render as the fallback stack`,
      evidence: tokenFiles[0] ?? contractPath,
    });
  }

  const chronNote = unverified ? `; ${unverified} chronology-unverified (${gitAvailable ? 'untracked' : 'no git'})` : '';
  const summary = `${mapped}/${surfaces.length} surfaces mapped${chronNote}`;

  if (findings.length > 0) {
    return result(
      'fail',
      `${summary} — ${findings[0].title} (${findings[0].evidence})`,
      { pass: mapped, fail: findings.length, not_run: surfaces.length - mapped + unverified },
      findings,
      surfaces,
    );
  }
  // Nothing wrong, but some chronology could not be established. Saying `pass` would
  // assert an ordering this run did not observe.
  if (unverified > 0) {
    return result(
      'incomplete',
      `${summary} — no mapping violations, but chronology could not be established for ${unverified}`,
      { pass: mapped, not_run: unverified },
      [{ severity: 'major', title: 'chronology unverifiable', evidence: gitAvailable ? 'surfaces untracked by git' : 'no git repository' }],
      surfaces,
    );
  }
  if (surfaces.length === 0) {
    return result('n/a', 'no user-visible surfaces matched the surface globs', {}, [], []);
  }
  return result('pass', summary, { pass: mapped }, [], surfaces);
}

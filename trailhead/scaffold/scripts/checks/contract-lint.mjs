/**
 * The contract's own rules, made mechanical.
 *
 * These four requirements shipped as prose in a tool built on the premise that prose
 * requirements get complied with in letter and drift anyway. That was the sharpest
 * finding of the first external review, and it was correct.
 *
 *   1. The contract stays under its line cap. Past that nobody reads it, and an unread
 *      contract is worse than none: it looks like governance and provides none.
 *   2. No status table inside the contract. A file edited every deliverable stops being
 *      an authority — that conflation is the whole reason the contract and the running
 *      state are separate files.
 *   3. The invariants section is actually filled in. A contract whose §2 is still the
 *      scaffolded placeholder is a contract that has never constrained anything.
 *   4. The identity key is not a reassignable attribute. If `contracts/identity.md`
 *      declares email, username, phone, or a provider subject as the stable identity,
 *      then changing one either breaks or silently hands over the account — and every
 *      provenance record written under it is attributed to something mutable.
 */

import { join } from 'node:path';
import { readOr, result } from '../gate-lib.mjs';

const STATUS_WORDS = /\b(not started|built|verified|accepted|in progress|implemented)\b/i;
const REASSIGNABLE = /\b(e-?mail(\s+address)?|username|user\s*name|phone(\s+number)?|provider\s+subject|sub\s+claim)\b/i;

/**
 * Placeholder markers. `TBD` and `TODO` are placeholders wearing content's clothes — an
 * earlier version counted them as substantive, so a contract whose only invariant was
 * "1. TBD" passed the check that exists to notice exactly that.
 *
 * Every row here must cover a shape the SCAFFOLD ITSELF writes, or this check passes its
 * own templates — which is the failure it exists to catch, arriving through the front
 * door. The rows, and the shipped text each one is for:
 *
 *   `1.`                                    a bare list marker, CONTRACT.md.tmpl §2
 *   TBD / TODO / FIXME / ...                prose placeholders, bare or behind a marker
 *   <opaque, permanent, internal — …>       the house angle-bracket fill-in, used in
 *                                           identity.md.tmpl and design-system.md.tmpl
 *   {{STAGE_LEVEL}}                         a template variable init failed to substitute
 *
 * The angle-bracket row does not require a closing `>`: callers narrow a declaration on
 * `(` and `—` before testing it, so `<opaque, permanent, internal — e.g. a UUID>` reaches
 * here already truncated to `<opaque, permanent, internal`.
 *
 * The marker prefix on the placeholder-word row accepts `1.` and `1)` as well as `-` and
 * `*`. It used to accept bullets only, so `1. TBD` — the very example this comment cites
 * as caught — was still passing. A row that covers one marker shape covers all of them.
 */
const UNFILLED =
  /^\s*(\d+\.\s*$|<!--|-->|<[^>]*>?\s*$|\{\{[A-Z_]+\}\}\s*$|(\d+[.)]|[-*])?\s*(TBD|TODO|FIXME|\.\.\.)\s*\.?$)/i;

function cells(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

/**
 * Strip HTML comments, including ones that span lines.
 *
 * Filtering comments line-by-line only ever removed the `<!--` and `-->` lines, so the
 * eight interior lines of §2's guidance comment counted as eight filled-in invariants and
 * the scaffolded contract passed the check that reads it. A guidance block is the exact
 * thing "still placeholder text" means, so it must not be able to satisfy the test for it.
 *
 * An unterminated comment is stripped to the end of the section rather than left standing:
 * its body is not visible prose either, and treating it as content restores the same hole.
 */
function stripComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, '').replace(/<!--[\s\S]*$/, '');
}

/** The body of a `## N. Title` section, minus HTML comments. */
function section(text, heading) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => new RegExp(`^##\\s+.*${heading}`, 'i').test(l));
  if (start === -1) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^##\s/.test(l));
  return stripComments((end === -1 ? rest : rest.slice(0, end)).join('\n'));
}

export async function run({ root, config }) {
  const contractPath = config.contract_file ?? 'contracts/CONTRACT.md';
  const text = readOr(join(root, contractPath), null);
  if (text === null) {
    return result('missing_input', `${contractPath} does not exist but a contract stage is configured`, { fail: 1 });
  }

  const cap = config.contract_line_cap ?? 300;
  const findings = [];
  const lines = text.split('\n');

  if (lines.length > cap) {
    findings.push({
      severity: 'major',
      title: `contract is ${lines.length} lines, over the ${cap}-line cap — usually state or rationale has moved in`,
      evidence: contractPath,
    });
  }

  // A status table is a table whose header names a status column, or whose rows carry
  // vocabulary words. Either shape means the running state has leaked into the contract.
  let header = null;
  for (const [index, line] of lines.entries()) {
    if (!line.trim().startsWith('|')) {
      header = null;
      continue;
    }
    const c = cells(line);
    if (/^-+$/.test(c[0])) continue;
    if (header === null) {
      header = c;
      if (header.some((h) => /^(status|state)$/i.test(h))) {
        findings.push({
          severity: 'major',
          title: 'the contract contains a status table — running state belongs in the state file, or the contract stops being an authority',
          evidence: `${contractPath}:${index + 1}`,
        });
      }
      continue;
    }
    if (c.some((cell) => STATUS_WORDS.test(cell) && cell.length < 40)) {
      findings.push({
        severity: 'major',
        title: 'a table row in the contract carries a deliverable status word',
        evidence: `${contractPath}:${index + 1}`,
      });
      break;
    }
  }

  // A missing section is not a satisfied one. Deleting the Invariants heading used to make
  // the invariants check silently stop applying, which is the same shape as deleting an
  // input to make a stage go green.
  const invariants = section(text, 'Invariants');
  if (invariants === null) {
    findings.push({
      severity: 'major',
      title: 'the contract has no Invariants section — the check that reads it cannot apply, which is not the same as passing',
      evidence: contractPath,
    });
  } else {
    const substantive = invariants.split('\n').filter((l) => l.trim() && !UNFILLED.test(l));
    if (substantive.length === 0) {
      findings.push({
        severity: 'major',
        title: 'the invariants section is empty or still placeholder text — a contract with no invariants has never constrained anything',
        evidence: `${contractPath} §2`,
      });
    }
  }

  // The identity rule. A missing identity file is a missing answer, not a good one.
  const identityPath = config.identity_file ?? 'contracts/identity.md';
  const identity = readOr(join(root, identityPath), null);
  if (identity === null) {
    findings.push({
      severity: 'major',
      title: `${identityPath} does not exist — the stable-identity rule has nothing to check against`,
      evidence: identityPath,
    });
  } else {
    const keyLine = identity.split('\n').find((l) => /^\s*[-*]?\s*\*{0,2}identity key/i.test(l));
    // Test the DECLARATION, not the whole line. Everything up to a parenthetical or dash
    // is what the key is; what follows is commentary, and "an opaque UUID (email is never
    // used as a key)" is a correct answer that mentions email.
    const declaration = (keyLine ?? '')
      .replace(/^\s*[-*]?\s*\*{0,2}identity key:?\s*\*{0,2}/i, '')
      .split(/[(—]/)[0]
      .trim();
    if (!keyLine || !declaration || UNFILLED.test(declaration)) {
      findings.push({
        severity: 'major',
        title: 'no identity key is declared — name the opaque internal key, and name the credentials that link to it',
        evidence: identityPath,
      });
    } else if (REASSIGNABLE.test(declaration)) {
      // A promise that the attribute "never changes" is a statement about operations, not
      // a property of the key, so it does not excuse the declaration.
      findings.push({
        severity: 'critical',
        title: 'the declared identity key is a reassignable attribute — changing it either breaks or silently transfers the account, and every provenance record under it is attributed to something mutable',
        evidence: `${identityPath} · ${keyLine.trim().slice(0, 80)}`,
      });
    }
  }

  const summary = `${lines.length}/${cap} lines, ${findings.length} violation(s)`;
  if (findings.length === 0) return result('pass', summary, { pass: 1 });
  return result('fail', `${summary} — ${findings[0].title}`, { fail: findings.length }, findings);
}

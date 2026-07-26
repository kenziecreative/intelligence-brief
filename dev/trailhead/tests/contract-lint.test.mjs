#!/usr/bin/env node
// contract-lint.test.mjs
//
// Negative fixtures for `contract-lint.mjs`, one per row of its placeholder table.
//
// This exists because of a defect that was live in 0.1.0: the check whose stated job is
// to notice "§2 is still the scaffolded placeholder" PASSED the scaffolded placeholder.
// Three separate holes, all the same shape — a pattern table that covered some members
// of a family and not the rest:
//
//   1. `section()` claimed to strip HTML comments and did not, so the eight interior
//      lines of §2's guidance block counted as eight filled-in invariants.
//   2. `UNFILLED` had no row for the house `<angle bracket>` fill-in, so the shipped
//      `- **Identity key:** <opaque, permanent, internal — e.g. a UUID>` read as a
//      declared key.
//   3. `UNFILLED`'s placeholder-word row accepted `-` and `*` markers but not numbered
//      ones, so `1. TBD` — the very example the check's own comment cites as caught —
//      was still passing.
//
// Hole 3 was found only by sweeping every row rather than the two that were reported.
// That is the whole argument for this file, and it is why the marker and word axes below
// are crossed exhaustively instead of spot-checked. Per trailhead/AGENTS.md: when a fix
// touches a table of patterns, write a negative fixture for EVERY row of the table.
//
// It imports the SHIPPING check directly — not a copy. A test that measures a copy of the
// code, or fixture state the shipping path never writes, measures the fixture.
//
// The load-bearing case is Part C: it renders the real `.tmpl` files the way `trailhead-init`
// does and asserts the contract stage FAILS. If that ever goes green, the plugin is once
// again passing its own placeholder and this file has earned its keep.
//
// Run from the marketplace root:
//   node dev/trailhead/tests/contract-lint.test.mjs
//
// Exits 0 if every case matches, 1 otherwise. No dependencies — Node 18+.

import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..');
const scaffold = join(repoRoot, 'trailhead', 'scaffold');

const { run } = await import(join(scaffold, 'scripts', 'checks', 'contract-lint.mjs'));

const root = mkdtempSync(join(tmpdir(), 'trailhead-contract-lint-'));
mkdirSync(join(root, 'contracts'), { recursive: true });

let failures = 0;
let ran = 0;

/** A contract with a real §1 and §3 so only §2 is ever under test. */
const HEAD = '# Contract\n\n## 1. What this is\n\nA thing.\n';
const TAIL = '\n## 3. Boundaries\n\nNot this.\n';
/** A correct identity declaration: opaque key, with commentary that mentions email. */
const REAL_IDENTITY = '- **Identity key:** an opaque internal UUID (email is never used as a key)\n';
/** A real invariant, for cases where the identity file is what's under test. */
const REAL_INVARIANT = '\n1. No request handler may read outside VAULT_ROOT.\n';

/**
 * Write a contract + identity pair, run the shipping check, assert the verdict.
 * `expectFinding` guards against passing for the wrong reason — a `fail` produced by the
 * line cap is not evidence that the placeholder table works.
 */
async function check({ name, invariants, identity = REAL_IDENTITY, expect, expectFinding, omitSection = false }) {
  ran += 1;
  const contract = omitSection ? `${HEAD}${TAIL}` : `${HEAD}\n## 2. Invariants\n${invariants}${TAIL}`;
  writeFileSync(join(root, 'contracts', 'CONTRACT.md'), contract);
  writeFileSync(join(root, 'contracts', 'identity.md'), identity);

  const result = await run({ root, config: { contract_line_cap: 300 } });
  const titles = (result.findings ?? []).map((f) => f.title).join(' | ');

  let problem = null;
  if (result.verdict !== expect) problem = `expected ${expect}, got ${result.verdict} — ${result.summary}`;
  else if (expectFinding && !titles.includes(expectFinding)) {
    problem = `verdict was ${expect} but for the wrong reason — wanted a finding matching "${expectFinding}", got: ${titles || '(none)'}`;
  }

  if (problem) {
    failures += 1;
    console.error(`  FAIL  ${name}\n        ${problem}`);
  } else {
    console.log(`  ok    ${name}`);
  }
}

const PLACEHOLDER_INVARIANT = 'the invariants section is empty or still placeholder text';
const NO_IDENTITY_KEY = 'no identity key is declared';

// ---------------------------------------------------------------- Part A: the table
// Every row of UNFILLED, plus the comment stripping in section(). Each case must be seen
// as an UNFILLED placeholder, i.e. the section reads as empty.

console.log('\nPart A — placeholder table, row by row (each must read as unfilled)');

await check({
  name: 'bare list marker "1." — CONTRACT.md.tmpl §2 ships exactly this',
  invariants: '\n1.\n',
  expect: 'fail',
  expectFinding: PLACEHOLDER_INVARIANT,
});

// The marker axis crossed with the word axis. Hole 3 lived in exactly one cell of this
// grid; spot-checking any single marker would have missed it.
for (const [markerName, marker] of [
  ['bare', ''],
  ['dash', '- '],
  ['asterisk', '* '],
  ['numbered "1."', '1. '],
  ['numbered "2)"', '2) '],
]) {
  for (const word of ['TBD', 'TODO', 'FIXME', '...']) {
    await check({
      name: `${markerName} marker + ${word}`,
      invariants: `\n${marker}${word}\n`,
      expect: 'fail',
      expectFinding: PLACEHOLDER_INVARIANT,
    });
  }
}

await check({
  name: 'angle-bracket fill-in (the house placeholder convention)',
  invariants: '\n<describe the invariant>\n',
  expect: 'fail',
  expectFinding: PLACEHOLDER_INVARIANT,
});

await check({
  name: 'unsubstituted {{MUSTACHE}} — init failed to render',
  invariants: '\n{{INVARIANTS}}\n',
  expect: 'fail',
  expectFinding: PLACEHOLDER_INVARIANT,
});

await check({
  name: 'terminated guidance comment + bare "1." (the original defect)',
  invariants: '\n<!-- Things that must be true of any correct version,\n     phrased so a violation is recognizable. -->\n\n1.\n',
  expect: 'fail',
  expectFinding: PLACEHOLDER_INVARIANT,
});

await check({
  name: 'UNterminated guidance comment (must not restore the hole)',
  invariants: '\n<!-- Things that must be true of any correct version,\n     phrased so a violation is recognizable.\n\n1.\n',
  expect: 'fail',
  expectFinding: PLACEHOLDER_INVARIANT,
});

await check({
  name: 'missing Invariants section is not a satisfied one',
  invariants: '',
  omitSection: true,
  expect: 'fail',
  expectFinding: 'has no Invariants section',
});

// ------------------------------------------------- Part B: over-correction guards
// A placeholder filter that eats real content is the opposite failure and just as bad:
// it makes the check unpassable, which gets it deleted.

console.log('\nPart B — positive controls (real content must still pass)');

await check({ name: 'a real numbered invariant', invariants: REAL_INVARIANT, expect: 'pass' });
await check({
  name: 'real invariant alongside the guidance comment',
  invariants: '\n<!-- guidance\n     more guidance -->\n\n1. No handler reads outside VAULT_ROOT.\n',
  expect: 'pass',
});
await check({ name: 'prose invariant with no marker', invariants: '\nRequests must be idempotent.\n', expect: 'pass' });
await check({
  name: 'invariant whose text merely contains "todo"',
  invariants: '\n1. The todo queue must drain within 30s.\n',
  expect: 'pass',
});

// ------------------------------------------- Part C: the shipped templates themselves
// The load-bearing assertion. Render the real .tmpl files the way trailhead-init does —
// substitute {{MUSTACHES}}, leave the <angle bracket> fill-ins for the user — and require
// the result to FAIL. A green run here means the plugin passes its own scaffold again.

console.log('\nPart C — the shipped scaffold must fail its own check');

const VALUES = {
  PROJECT_NAME: 'fixture',
  PROJECT_DESCRIPTION: 'a fixture project',
  VERSION: '0.1.0',
  CONTRACT_LINE_CAP: '300',
  DATE: '2026-07-25',
  DESIGN_SOURCE: 'none',
};

function render(templateRelPath) {
  const raw = readFileSync(join(scaffold, templateRelPath), 'utf8');
  const out = raw.replace(/\{\{([A-Z_]+)\}\}/g, (whole, key) =>
    Object.prototype.hasOwnProperty.call(VALUES, key) ? VALUES[key] : whole,
  );
  const leftover = out.match(/\{\{[A-Z_]+\}\}/g);
  if (leftover) {
    // Not a check failure — a gap in this fixture. Say which, so it is fixed here rather
    // than silently changing what Part C actually tests.
    console.error(`  note  ${templateRelPath} has placeholders this fixture does not render: ${[...new Set(leftover)].join(', ')}`);
  }
  return out;
}

ran += 1;
writeFileSync(join(root, 'contracts', 'CONTRACT.md'), render('contracts/CONTRACT.md.tmpl'));
writeFileSync(join(root, 'contracts', 'identity.md'), render('contracts/identity.md.tmpl'));
{
  const result = await run({ root, config: { contract_line_cap: 300 } });
  const titles = (result.findings ?? []).map((f) => f.title).join(' | ');
  const wants = [PLACEHOLDER_INVARIANT, NO_IDENTITY_KEY];
  const missing = wants.filter((w) => !titles.includes(w));

  if (result.verdict !== 'fail' || missing.length > 0) {
    failures += 1;
    console.error(
      `  FAIL  pristine scaffolded CONTRACT.md + identity.md must fail\n` +
        `        verdict=${result.verdict} (${result.summary})\n` +
        (missing.length ? `        missing expected finding(s): ${missing.join(' ; ')}\n` : '') +
        `        THIS IS THE 0.1.0 REGRESSION — the check is passing its own placeholder again.`,
    );
  } else {
    console.log('  ok    pristine scaffolded CONTRACT.md + identity.md fail as intended');
  }
}

// ------------------------------------------------- Part D: the identity-key rules
// Same placeholder table, second call site. A row fixed in one and not the other is the
// family bug repeating itself.

console.log('\nPart D — identity key (the table\'s other call site)');

await check({
  name: 'scaffolded <opaque, permanent, internal — …> placeholder',
  invariants: REAL_INVARIANT,
  identity: '- **Identity key:** <opaque, permanent, internal — e.g. a UUID>\n',
  expect: 'fail',
  expectFinding: NO_IDENTITY_KEY,
});
await check({
  name: 'unsubstituted mustache as the key',
  invariants: REAL_INVARIANT,
  identity: '- **Identity key:** {{IDENTITY_KEY}}\n',
  expect: 'fail',
  expectFinding: NO_IDENTITY_KEY,
});
await check({
  name: 'TBD as the key',
  invariants: REAL_INVARIANT,
  identity: '- **Identity key:** TBD\n',
  expect: 'fail',
  expectFinding: NO_IDENTITY_KEY,
});
await check({
  name: 'no identity file at all',
  invariants: REAL_INVARIANT,
  identity: '(no identity key line here)\n',
  expect: 'fail',
  expectFinding: NO_IDENTITY_KEY,
});
await check({
  name: 'email as the key is reassignable',
  invariants: REAL_INVARIANT,
  identity: '- **Identity key:** email address\n',
  expect: 'fail',
  expectFinding: 'reassignable attribute',
});
await check({
  name: 'username as the key is reassignable',
  invariants: REAL_INVARIANT,
  identity: '- **Identity key:** the username\n',
  expect: 'fail',
  expectFinding: 'reassignable attribute',
});
await check({
  name: 'opaque key whose commentary mentions email still passes',
  invariants: REAL_INVARIANT,
  identity: REAL_IDENTITY,
  expect: 'pass',
});
await check({
  name: 'opaque key with em-dash commentary still passes',
  invariants: REAL_INVARIANT,
  identity: '- **Identity key:** an opaque ULID — email is a credential, not a key\n',
  expect: 'pass',
});

// ------------------------------------------------------------------------- teardown

rmSync(root, { recursive: true, force: true });

if (failures > 0) {
  console.error(`\n${failures} of ${ran} case(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${ran} case(s) passed — contract-lint rejects every placeholder shape the scaffold ships.`);

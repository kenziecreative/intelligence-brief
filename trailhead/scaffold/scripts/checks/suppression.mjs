/**
 * Orphaned suppression directives.
 *
 * The failure this exists for: a codebase carried `eslint-disable` comments in five files
 * while no linter was installed and no lint script existed. Every one of those lines
 * silently claimed a rule had been considered and waived, and nothing could notice.
 *
 * Two precision rules, both from real false results:
 *   - The directive must appear in COMMENT CONTEXT. Matching anywhere in the line flagged
 *     `const help = "write eslint-disable in a comment"` — and, on the first live run,
 *     flagged this file's own pattern table.
 *   - A config file counts only if it actually configures the tool. `pyproject.toml`
 *     exists in every Python project; its presence says nothing about whether Ruff or
 *     mypy is configured, so the tool's own section has to be there.
 */

import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { filesMatching, readOr, readJsonOr, result } from '../gate-lib.mjs';

/**
 * directive → the tool that would have to exist for it to mean anything.
 * `sections` are TOML/INI section headers that prove the tool is configured in a shared
 * manifest; `configFiles` are files whose existence alone is proof.
 */
const DIRECTIVES = [
  {
    pattern: /eslint-disable/,
    tool: 'ESLint',
    deps: ['eslint'],
    configFiles: ['eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs', '.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.cjs', '.eslintrc.yml', '.eslintrc.yaml'],
  },
  { pattern: /@ts-(ignore|expect-error|nocheck)/, tool: 'TypeScript', deps: ['typescript'], configFiles: ['tsconfig.json'] },
  {
    pattern: /#\s*noqa/,
    tool: 'Ruff or Flake8',
    deps: ['ruff', 'flake8'],
    // `tox.ini` is deliberately NOT here — it exists in projects that never configure a
    // linter. It is covered by the section scan below, which requires `[flake8]` in it.
    configFiles: ['ruff.toml', '.ruff.toml', '.flake8'],
    sections: [/^\[tool\.ruff/m, /^\[flake8\]/m],
  },
  {
    pattern: /#\s*type:\s*ignore/,
    tool: 'mypy or Pyright',
    deps: ['mypy', 'pyright'],
    configFiles: ['mypy.ini', '.mypy.ini', 'pyrightconfig.json'],
    sections: [/^\[tool\.mypy/m, /^\[mypy\]/m, /^\[tool\.pyright/m],
  },
  { pattern: /\/\/\s*nolint/, tool: 'golangci-lint', deps: [], configFiles: ['.golangci.yml', '.golangci.yaml', '.golangci.toml'] },
  { pattern: /#!?\[allow\(/, tool: 'Clippy', deps: [], configFiles: ['clippy.toml', '.clippy.toml'], sections: [/^\[lints\./m] },
];

/** Comment openers that can legitimately precede a directive on its line. */
const COMMENT_OPENERS = /(\/\/|\/\*|\*|#|--|<!--|;)/;

const DEFAULT_SOURCES = [
  'src/**/*', 'lib/**/*', 'app/**/*', 'test/**/*', 'tests/**/*',
  'packages/**/*', 'apps/**/*', 'services/**/*', 'backend/**/*', 'frontend/**/*', 'internal/**/*', 'cmd/**/*',
  '*.{js,jsx,ts,tsx,mjs,cjs,py,go,rs,rb,java,kt,swift}',
];

/**
 * The gate's own files are excluded. This check's pattern table necessarily contains the
 * literal string `eslint-disable`, so scanning itself reports itself — which it did, on
 * the first real run. A tool that cannot be trusted about its own source teaches people
 * to discount its findings everywhere else.
 */
const SELF = /^scripts\/(gate\.mjs|gate-lib\.mjs|checks\/)/;

/** Declared dependency names, parsed rather than substring-matched. */
function declaredDeps(root) {
  const names = new Set();
  const pkg = readJsonOr(join(root, 'package.json'), null);
  if (pkg) {
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      for (const name of Object.keys(pkg[field] ?? {})) names.add(name.toLowerCase());
    }
  }
  for (const manifest of ['requirements.txt', 'requirements-dev.txt', 'dev-requirements.txt']) {
    for (const line of (readOr(join(root, manifest), '') || '').split('\n')) {
      const name = line.trim().split(/[<>=!~[\s;#]/)[0];
      if (name) names.add(name.toLowerCase());
    }
  }
  // pyproject dependency arrays and Cargo/Go manifests: match the name at a line start or
  // inside a quoted array entry, not anywhere in the file.
  for (const manifest of ['pyproject.toml', 'Cargo.toml', 'go.mod']) {
    for (const line of (readOr(join(root, manifest), '') || '').split('\n')) {
      const m = line.match(/^\s*"?([A-Za-z][\w.-]*)"?\s*[=<>~^]/) || line.match(/^\s*"([A-Za-z][\w.-]*)[^"]*"\s*,?\s*$/);
      if (m) names.add(m[1].toLowerCase());
    }
  }
  return names;
}

function toolIsAvailable(root, directive, deps) {
  if (directive.deps.some((dep) => deps.has(dep))) return true;
  if (directive.configFiles.some((file) => existsSync(join(root, file)))) return true;
  // A shared manifest counts only when it carries the tool's own section.
  for (const section of directive.sections ?? []) {
    for (const manifest of ['pyproject.toml', 'Cargo.toml', 'setup.cfg', 'tox.ini']) {
      const text = readOr(join(root, manifest), null);
      if (text && section.test(text)) return true;
    }
  }
  return false;
}

/**
 * Which lines sit inside an unterminated template literal.
 *
 * Quote counting is per line, so a multi-line template whose later lines mention a
 * directive after a `//` looked exactly like a comment. Backtick parity has to carry
 * across lines to see that.
 */
function templateLiteralLines(lines) {
  const inside = new Array(lines.length).fill(false);
  let open = false;
  lines.forEach((line, index) => {
    inside[index] = open;
    const ticks = (line.match(/(?<!\\)`/g) ?? []).length;
    if (ticks % 2 === 1) open = !open;
  });
  return inside;
}

/** Unescaped quote count — odd means we are inside a string literal at that point. */
function insideString(text) {
  return ((text.match(/(?<!\\)["'`]/g) ?? []).length) % 2 !== 0;
}

/**
 * Is the directive occurrence inside a comment on this line?
 *
 * There are two shapes and an earlier version only handled one. Some directives are
 * written AFTER a comment opener (`// @ts-ignore`), and some BEGIN with the opener
 * (`# noqa`, `//nolint`, `#[allow(`). Looking only at the text before the match made the
 * second family invisible — which silently disabled this check for Python, Go, and Rust
 * while it kept working for JavaScript.
 */
function inCommentContext(line, index, matched) {
  const before = line.slice(0, index);
  if (insideString(before)) return false;

  // The directive is its own opener.
  if (/^(\/\/|#|--|;)/.test(matched)) return true;

  // An opener appears earlier on the line, outside a string.
  const opener = before.match(new RegExp(`${COMMENT_OPENERS.source}[^\\n]*$`));
  if (!opener) return false;
  return !insideString(before.slice(0, opener.index));
}

export async function run({ root, config }) {
  const sources = config.source_globs ?? DEFAULT_SOURCES;
  const files = filesMatching(root, sources)
    .filter((f) => !/\.(png|jpg|jpeg|gif|svg|pdf|ico|woff2?|ttf|lock|min\.js|map)$/i.test(f))
    .filter((f) => !SELF.test(f));
  if (files.length === 0) {
    // Not "not applicable" — either the globs are wrong or there is no code, and both are
    // worth a human deciding rather than a silent green.
    return result('config_error', `no source files matched ${sources.slice(0, 3).join(', ')}… — widen source_globs or remove this stage`, { fail: 1 });
  }

  const deps = declaredDeps(root);
  const orphans = [];

  for (const file of files) {
    const text = readOr(join(root, file), '');
    if (!text) continue;
    const lines = text.split('\n');
    const inTemplate = templateLiteralLines(lines);
    for (const directive of DIRECTIVES) {
      if (!directive.pattern.test(text)) continue;
      if (toolIsAvailable(root, directive, deps)) continue;
      lines.forEach((line, index) => {
        if (inTemplate[index]) return;
        const match = line.match(directive.pattern);
        if (!match || !inCommentContext(line, match.index, match[0])) return;
        orphans.push({
          severity: 'major',
          title: `suppression for ${directive.tool}, which is not installed or configured`,
          evidence: `${file}:${index + 1}`,
          line: line.trim().slice(0, 100),
        });
      });
    }
  }

  if (orphans.length === 0) {
    return result('pass', `${files.length} source files scanned, no orphaned suppressions`, { pass: files.length });
  }
  const missing = [...new Set(orphans.map((o) => o.title.replace(/^suppression for /, '').replace(/,.*$/, '')))];
  return result(
    'fail',
    `${orphans.length} suppression(s) for ${missing.join(' and ')} — not installed or configured (first: ${orphans[0].evidence})`,
    { pass: 0, fail: orphans.length },
    orphans,
  );
}

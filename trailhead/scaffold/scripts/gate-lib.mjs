/**
 * Shared helpers for the gate runner and its checks.
 *
 * Zero dependencies on purpose: the gate must run in a repo with no install step, on any
 * of the agent CLIs, and in CI. One glob implementation lives here so there is one thing
 * to get right rather than six.
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/** Directories never worth walking. */
export const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.gates',
  '.next',
  'target',
  '__pycache__',
  'vendor',
]);

/**
 * Minimal glob → RegExp. Supports `**` (any depth), `*` (one segment), `?`, and brace
 * alternation `{a,b}`. Small by design — a dependency here would defeat the point.
 */
export function globToRegExp(pattern) {
  let out = '';
  for (let i = 0; i < pattern.length; i += 1) {
    const char = pattern[i];
    if (char === '*') {
      if (pattern[i + 1] === '*') {
        if (pattern[i + 2] === '/') {
          out += '(?:.*/)?';
          i += 2;
        } else {
          out += '.*';
          i += 1;
        }
      } else {
        out += '[^/]*';
      }
    } else if (char === '?') {
      out += '[^/]';
    } else if (char === '{') {
      const close = pattern.indexOf('}', i);
      if (close === -1) {
        out += '\\{';
      } else {
        const options = pattern.slice(i + 1, close).split(',');
        out += `(?:${options.map((o) => o.replace(/[\\^$.|?*+()[\]{}]/g, '\\$&')).join('|')})`;
        i = close;
      }
    } else if ('\\^$.|+()[]'.includes(char)) {
      out += `\\${char}`;
    } else {
      out += char;
    }
  }
  return new RegExp(`^${out}$`);
}

/**
 * Every file under `root` matching any pattern, as project-relative POSIX paths.
 * Dotfile directories are skipped except the ones a scaffolded project actually uses.
 */
export function filesMatching(root, patterns) {
  if (!patterns || patterns.length === 0) return [];
  const allowedDotDirs = new Set(['.qa', '.planning', '.gemini', '.claude', '.github']);
  const regexes = patterns.map(globToRegExp);
  const found = [];
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      if (entry.name.startsWith('.') && entry.isDirectory() && !allowedDotDirs.has(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        const rel = relative(root, full).split(sep).join('/');
        if (regexes.some((re) => re.test(rel))) found.push(rel);
      }
    }
  };
  walk(root);
  return found.sort();
}

/** Newest mtime (epoch ms) across a watch set. Zero when nothing matches. */
export function watchMtime(root, patterns) {
  let newest = 0;
  for (const file of filesMatching(root, patterns)) {
    try {
      const { mtimeMs } = statSync(join(root, file));
      if (mtimeMs > newest) newest = mtimeMs;
    } catch {
      /* raced with a delete */
    }
  }
  return Math.round(newest);
}

/** Read a file, or return `fallback` if it is missing or unreadable. */
export function readOr(path, fallback = null) {
  try {
    return existsSync(path) ? readFileSync(path, 'utf8') : fallback;
  } catch {
    return fallback;
  }
}

/** Parse JSON leniently — returns `fallback` rather than throwing. */
export function readJsonOr(path, fallback = null) {
  const text = readOr(path, null);
  if (text === null) return fallback;
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

/**
 * A uniform check result. Every check returns this shape so the runner never has to
 * special-case one.
 *
 * `not_run` is mandatory rather than optional because a verdict that ignores coverage is
 * how "the thing that ran, passed" certifies an empty suite.
 *
 * `identities` is the set of things this check was measuring — QA spec names, decision
 * IDs. The runner ratchets that SET, not only its size. Counting alone let deletion look
 * like improvement: with two unrun specs the ceiling is two, and deleting one takes the
 * count to one, which is an improvement by every measure the gate had. Naming them is what
 * makes the difference between "we fixed it" and "we deleted it".
 */
export function result(verdict, summary, { pass = 0, fail = 0, not_run = 0 } = {}, findings = [], identities = null) {
  return { verdict, summary, counts: { pass, fail, not_run }, findings, identities };
}

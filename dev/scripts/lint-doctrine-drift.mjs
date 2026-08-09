#!/usr/bin/env node
// lint-doctrine-drift.mjs — plugin-configurable doctrine-drift / canon-sync lint.
//
// Modeled on brand-compass's eval/lib/lint-doctrine-drift.mjs, generalized for this
// marketplace: each plugin ships a config in dev/scripts/drift-configs/<plugin>.json
// declaring its own stale phrases, canon-copy pairs, required sections, and
// reader/writer contract patterns. The lint BLOCKS release (exit 1) on any finding.
//
// What it catches, per check:
//   stalePhrases      — retired wording that reappears (a doctrine change supersedes a
//                       phrase; a copy-paste from an old file resurrects it and the
//                       release serves contradictory instructions). When a change
//                       retires wording, add the phrase here IN THE SAME COMMIT.
//   canonPairs        — shipped copies of canonical source docs that drifted from
//                       canon. Byte-equality after declared normalizations (e.g.
//                       relative-path rewrites when canon lives in a subdirectory).
//                       If the canon root is absent (another machine, CI), the check
//                       SKIPS WITH A WARNING rather than failing — canon only exists
//                       on the owner's machine.
//   requiredSections  — sections/markers other doctrine points to must still exist
//                       (catches a range edit swallowing a section others reference).
//   contracts         — a vocabulary shared between a writer and its readers must
//                       appear in EVERY listed file (catches one side of a
//                       reader/writer contract being edited without the other).
//
// usage: node dev/scripts/lint-doctrine-drift.mjs --plugin <name>
//        [--config <path>] [--repo-root <dir>]
// Exit 1 on any finding; exit 0 on clean (warnings don't fail the build).
// No dependencies (Node 18+).

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

function getArg(name) {
  const i = process.argv.indexOf(name);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

const plugin = getArg("--plugin");
const configPath = getArg("--config") ?? (plugin && join(here, "drift-configs", `${plugin}.json`));
if (!configPath) {
  console.error("usage: node lint-doctrine-drift.mjs --plugin <name> [--config <path>] [--repo-root <dir>]");
  process.exit(2);
}
const repoRoot = resolve(getArg("--repo-root") ?? join(here, "../.."));
const cfg = JSON.parse(readFileSync(configPath, "utf8"));
const pluginRoot = join(repoRoot, cfg.pluginRoot ?? plugin);
const expandHome = (p) => (p.startsWith("~/") ? join(homedir(), p.slice(2)) : p);

const findings = [];
const warnings = [];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith(".md")) yield p;
  }
}

// --- 1. Stale phrases -------------------------------------------------------
for (const root of cfg.scanRoots ?? []) {
  const dir = join(pluginRoot, root);
  if (!existsSync(dir)) continue;
  for (const file of walk(dir)) {
    const rel = relative(pluginRoot, file);
    for (const rule of cfg.stalePhrases ?? []) {
      if ((rule.exempt ?? []).includes(rel)) continue;
      const re = new RegExp(rule.pattern, rule.flags ?? "");
      const text = readFileSync(file, "utf8");
      const m = text.match(re);
      if (m) {
        const line = text.slice(0, m.index).split("\n").length;
        findings.push({ file: rel, line, id: rule.id, detail: rule.reason });
      }
    }
  }
}

// --- 2. Canon pairs (byte-diff after declared normalizations) ---------------
const canonRoot = cfg.canonRoot ? expandHome(cfg.canonRoot) : null;
if ((cfg.canonPairs ?? []).length) {
  if (!canonRoot || !existsSync(canonRoot)) {
    warnings.push(
      `canon root not found (${cfg.canonRoot}) — canon-sync checks SKIPPED on this machine; ` +
        `they must pass on the machine that holds canon before release`
    );
  } else {
    const normalize = (text) => {
      for (const n of cfg.canonNormalizations ?? []) {
        text = text.replace(new RegExp(n.pattern, n.flags ?? "g"), n.replace);
      }
      return text;
    };
    for (const pair of cfg.canonPairs) {
      const copyPath = join(pluginRoot, pair.copy);
      const canonPath = join(canonRoot, pair.canon);
      if (!existsSync(canonPath)) {
        findings.push({
          file: pair.copy,
          line: 1,
          id: "canon_source_missing",
          detail: `canonical source ${pair.canon} not found under canon root — the copy has no source of truth to verify against`,
        });
        continue;
      }
      const copyText = normalize(readFileSync(copyPath, "utf8"));
      const canonText = normalize(readFileSync(canonPath, "utf8"));
      if (copyText !== canonText) {
        const copyLines = copyText.split("\n");
        const canonLines = canonText.split("\n");
        let line = 1;
        while (line <= Math.min(copyLines.length, canonLines.length) && copyLines[line - 1] === canonLines[line - 1]) line++;
        findings.push({
          file: pair.copy,
          line,
          id: "canon_drift",
          detail: `shipped copy differs from canon (${pair.canon}) starting at line ${line} — fix in canon and re-sync; never edit the plugin copy directly`,
        });
      }
    }
  }
}

// --- 3. Required sections / markers -----------------------------------------
for (const req of cfg.requiredSections ?? []) {
  const full = join(pluginRoot, req.file);
  if (!existsSync(full)) {
    findings.push({ file: req.file, line: 1, id: "referenced_file_missing", detail: "file other doctrine references is gone" });
    continue;
  }
  const text = readFileSync(full, "utf8");
  for (const marker of req.markers) {
    const re = new RegExp(marker.startsWith("^") ? marker : marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "m");
    if (!re.test(text)) {
      findings.push({
        file: req.file,
        line: 1,
        id: "missing_referenced_section",
        detail: `"${marker}" is gone but other doctrine still references it — a range edit likely swallowed it`,
      });
    }
  }
}

// --- 4. Reader/writer vocabulary contracts -----------------------------------
for (const c of cfg.contracts ?? []) {
  const re = new RegExp(c.pattern, c.flags ?? "");
  for (const f of c.files) {
    const full = join(pluginRoot, f);
    if (!existsSync(full) || !re.test(readFileSync(full, "utf8"))) {
      findings.push({
        file: f,
        line: 1,
        id: `contract_broken:${c.id}`,
        detail: `${c.reason} — pattern /${c.pattern}/ must appear in every party to the contract (missing here)`,
      });
    }
  }
}

// --- 5. Index completeness ---------------------------------------------------
// An index that silently disagrees with the library is worse than no index: the skill
// resolves names through it, so a missing row makes a shipped framework unreachable and a
// stale row points at a file that no longer exists. This replaces the generated
// `_inventory.json` manifest — the filesystem is the source of truth, not a second copy of it.
if (cfg.indexCompleteness) {
  const { index, entryGlob, excludeDirs = [] } = cfg.indexCompleteness;
  const indexPath = join(pluginRoot, index);
  if (!existsSync(indexPath)) {
    findings.push({ file: index, line: 1, id: "index_missing", detail: "indexCompleteness is configured but the index file does not exist" });
  } else {
    const indexText = readFileSync(indexPath, "utf8");
    const dir = join(pluginRoot, entryGlob);
    const onDisk = [];
    for (const stage of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory() && !excludeDirs.includes(d.name))) {
      for (const f of readdirSync(join(dir, stage.name)).filter((f) => f.endsWith(".md") && f !== "README.md")) {
        onDisk.push(`${stage.name}/${f.replace(/\.md$/, "")}`);
      }
    }
    for (const entry of onDisk) {
      const slug = entry.split("/")[1];
      if (!new RegExp(`\\b${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(indexText)) {
        findings.push({ file: index, line: 1, id: "index_missing_entry", detail: `${entry}.md ships but no row in the index mentions its slug — the framework skill resolves through this index, so the entry is unreachable by name` });
      }
    }
    const linked = [...indexText.matchAll(/\(\.?\/?([a-z-]+)\/([a-z0-9-]+)\.md\)/g)].map((m) => `${m[1]}/${m[2]}`);
    for (const l of new Set(linked)) {
      if (!onDisk.includes(l)) {
        findings.push({ file: index, line: 1, id: "index_dangling_row", detail: `the index links ${l}.md but no such entry file exists` });
      }
    }
  }
}

// --- Report ------------------------------------------------------------------
for (const w of warnings) console.error(`WARNING: ${w}`);
if (findings.length) {
  console.error(`\nDOCTRINE DRIFT (${cfg.pluginRoot ?? plugin}) — ${findings.length} finding(s):\n`);
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}  [${f.id}]`);
    console.error(`    ${f.detail}\n`);
  }
  process.exit(1);
} else {
  console.error(`doctrine-drift lint (${cfg.pluginRoot ?? plugin}): clean${warnings.length ? " (with warnings)" : ""}`);
  process.exit(0);
}

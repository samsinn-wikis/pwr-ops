#!/usr/bin/env bun
/**
 * render-procmd — build-time transform that prepares procmd source for MkDocs.
 *
 * For procedure pages (frontmatter `type: procedure`):
 *   1. Step headings `## Step <label> [id: <id>(, <primitive>)?]`
 *      → `## Step <label> {#<id>}`         (attr_list injects HTML id)
 *   2. Same-page branch targets `→ #<id>` → `→ [#<id>](#<id>)`
 *      so the bare fragment renders as a clickable anchor link
 *   3. Append two trailing spaces to every body line that is not
 *      blank / heading / fenced-code, forcing markdown hard breaks
 *      so the source line structure is preserved in the render
 *
 * Profile pages and prose pages (index/scope) are copied verbatim — only
 * `wiki/procedures/*.md` is transformed. Source files are never modified;
 * output goes to `_build/wiki/`.
 *
 * Usage:
 *   bun scripts/render-procmd.ts            # one-shot build
 *   bun scripts/render-procmd.ts --watch    # rebuild on source change
 */

import { readdir, readFile, writeFile, mkdir, stat, watch } from "node:fs/promises";
import { join, dirname, relative } from "node:path";

const REPO_ROOT = new URL("../", import.meta.url).pathname;
const SRC_DIR = join(REPO_ROOT, "wiki");
const OUT_DIR = join(REPO_ROOT, "_build", "wiki");

const STEP_HEADING_RE = /^(##\s+Step\s+.+?)\s*\[([^\]]+)\]\s*$/;
// Same-page bare-fragment anchor: `→ #step-id` (with optional [Label]
// between arrow and fragment, per v0.3 syntax).
const SAME_PAGE_REF_RE = /(→\s*(?:\[[A-Za-z]+\]\s+)?)#([A-Za-z0-9_-]+)\b/g;

// Edge label after the arrow (v0.3): `- cond → [Label] target`
// Match SINGLE-bracket capitalized word (avoids [[wikilink]] which uses
// double brackets). The label sits between → and the target.
const EDGE_LABEL_RE = /(→\s+)\[([A-Z][a-zA-Z]*)\](\s+)/;

// Rationale lines: ^(indent)**Because:** ... or ^(indent)**Against:** ...
// Matches AFTER autoBoldKeyword has run.
const RATIONALE_RE = /^(\s*)(\*\*(?:Because|Against):\*\*\s+.*)$/;

// procmd body keywords — auto-bolded in render so structure scans visually
const KEYWORDS = [
  "Check",
  "Action",
  "When",
  "Until",
  "Abort-if",
  "Within",
  "Concurrent",
  "By",
  "Caution",
  "Note",
  "Because",
  "Against",
  "CSF",
  "RNO",
];
const KEYWORD_PREFIX_RE = new RegExp(
  `^(\\s*-?\\s*)(${KEYWORDS.join("|")}):`,
);

function isHeading(line: string): boolean {
  return /^#{1,6}\s/.test(line);
}

function isFenceMarker(line: string): boolean {
  return /^(```|~~~)/.test(line);
}

function isBlank(line: string): boolean {
  return line.trim() === "";
}

function transformStepHeading(line: string): string {
  const m = line.match(STEP_HEADING_RE);
  if (!m) return line;
  const head = m[1];
  const attrs = m[2].split(",").map((s) => s.trim());
  const idAttr = attrs.find((a) => a.startsWith("id:"));
  if (!idAttr) return line;
  const id = idAttr.slice(3).trim();
  // Wrap the id code-span in a class so CSS can toggle it; attr_list still
  // applies the {#id} anchor to the heading element itself.
  return `${head} <span class="procmd-step-id-suffix">\`${id}\`</span> {#${id}}`;
}

function wrapEdgeLabel(line: string): string {
  return line.replace(
    EDGE_LABEL_RE,
    (_m, arrowLead, label, trailingSpace) =>
      `${arrowLead}<span class="procmd-edge-label">[${label}]</span>${trailingSpace}`,
  );
}

function wrapRationale(line: string): string {
  return line.replace(
    RATIONALE_RE,
    (_m, indent, content) => `${indent}<span class="procmd-rationale">${content}</span>`,
  );
}

function autoBoldKeyword(line: string): string {
  return line.replace(KEYWORD_PREFIX_RE, (_m, lead, kw) => `${lead}**${kw}:**`);
}

function transformBody(body: string): string {
  const lines = body.split("\n");
  const out: string[] = [];
  let inFence = false;

  for (const raw of lines) {
    if (isFenceMarker(raw)) {
      inFence = !inFence;
      out.push(raw);
      continue;
    }
    if (inFence) {
      out.push(raw);
      continue;
    }

    let line = raw;

    // Step headings: rewrite [id: x] → {#x}
    if (isHeading(line)) {
      line = transformStepHeading(line);
      out.push(line);
      continue;
    }

    // Same-page branch refs: → #foo  becomes  → [#foo](#foo)
    // (also handles `→ [Label] #foo` per v0.3)
    line = line.replace(
      SAME_PAGE_REF_RE,
      (_m, prefix, id) => `${prefix}[#${id}](#${id})`,
    );

    // Wrap edge-label prefix `[Continue]` etc. so CSS can toggle visibility
    line = wrapEdgeLabel(line);

    // Auto-bold procmd keyword prefixes for visual structure
    line = autoBoldKeyword(line);

    // Wrap rationale lines (Because:/Against:) AFTER auto-bold so the
    // span captures the full bolded line.
    line = wrapRationale(line);

    // Hard break: append two trailing spaces unless line is blank
    if (!isBlank(line)) {
      // Don't double-up if the line already ends with two spaces
      if (!line.endsWith("  ")) line = line.trimEnd() + "  ";
    }

    out.push(line);
  }

  return out.join("\n");
}

function splitFrontmatter(content: string): { fm: string; body: string; type: string } {
  if (!content.startsWith("---\n") && !content.startsWith("---\r\n")) {
    return { fm: "", body: content, type: "" };
  }
  const lines = content.split("\n");
  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") {
      endIdx = i;
      break;
    }
  }
  if (endIdx === -1) return { fm: "", body: content, type: "" };
  const fmLines = lines.slice(0, endIdx + 1);
  const body = lines.slice(endIdx + 1).join("\n");
  const typeMatch = fmLines.join("\n").match(/^type:\s*(.+)$/m);
  const type = typeMatch ? typeMatch[1].trim() : "";
  return { fm: fmLines.join("\n"), body, type };
}

async function processFile(srcPath: string): Promise<{ outPath: string; changed: boolean }> {
  const rel = relative(SRC_DIR, srcPath);
  const outPath = join(OUT_DIR, rel);
  await mkdir(dirname(outPath), { recursive: true });

  const content = await readFile(srcPath, "utf-8");
  const { fm, body, type } = splitFrontmatter(content);

  let outContent: string;
  // Only procedure pages get the transform; profiles and prose copy verbatim
  if (type === "procedure") {
    outContent = fm + "\n" + transformBody(body);
  } else {
    outContent = content;
  }

  let prev: string | null = null;
  try {
    prev = await readFile(outPath, "utf-8");
  } catch {
    /* doesn't exist */
  }
  if (prev === outContent) return { outPath, changed: false };
  await writeFile(outPath, outContent, "utf-8");
  return { outPath, changed: true };
}

async function walkMarkdown(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walkMarkdown(p)));
    else if (e.isFile() && e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

// Static assets to copy into _build/wiki/ alongside the rendered markdown.
// These need to live under docs_dir so MkDocs `extra_css` / `extra_javascript`
// can reference them by relative path.
const STATIC_ASSETS = ["visibility.css", "visibility.js"];

async function copyStaticAssets(): Promise<void> {
  const overrides = join(REPO_ROOT, "overrides");
  for (const name of STATIC_ASSETS) {
    const src = join(overrides, name);
    const dst = join(OUT_DIR, name);
    try {
      const content = await readFile(src, "utf-8");
      await mkdir(dirname(dst), { recursive: true });
      await writeFile(dst, content, "utf-8");
    } catch {
      // missing asset — skip silently
    }
  }
}

async function buildAll(): Promise<number> {
  const files = await walkMarkdown(SRC_DIR);
  let changed = 0;
  for (const f of files) {
    const r = await processFile(f);
    if (r.changed) changed++;
  }
  await copyStaticAssets();
  return changed;
}

async function main() {
  const watchMode = process.argv.includes("--watch");

  const t0 = Date.now();
  const n = await buildAll();
  console.log(`render-procmd: built ${n} file(s) → ${relative(REPO_ROOT, OUT_DIR)}/ (${Date.now() - t0}ms)`);

  if (!watchMode) return;

  console.log(`render-procmd: watching ${relative(REPO_ROOT, SRC_DIR)}/ for changes…`);
  const watcher = watch(SRC_DIR, { recursive: true });
  for await (const event of watcher) {
    if (!event.filename || !event.filename.endsWith(".md")) continue;
    const srcPath = join(SRC_DIR, event.filename);
    try {
      const s = await stat(srcPath);
      if (!s.isFile()) continue;
    } catch {
      continue; // deleted
    }
    try {
      const r = await processFile(srcPath);
      if (r.changed) {
        console.log(`render-procmd: updated ${event.filename}`);
      }
    } catch (e) {
      console.error(`render-procmd: error on ${event.filename}:`, e);
    }
  }
}

main();

#!/usr/bin/env bun
/**
 * update-tag — cascade-edit a tag definition across every procedure that
 * references it.
 *
 * v0.5 procmd keeps tag definitions inline (no central catalog), so changing
 * a tag's `sim-path`, `units`, `equipment`, or `description` means editing
 * every `## Tags` appendix that mentions the id. This script does that
 * mechanically.
 *
 * Usage:
 *   bun scripts/update-tag.ts <tag-id> --field=<key> --to=<value>
 *
 * Examples:
 *   bun scripts/update-tag.ts PT-455 --field=sim-path --to=rcs.pzr.p_wr
 *   bun scripts/update-tag.ts MSIV-A --field=units --to='enum[OPEN,CLOSED]'
 *
 * Allowed fields: sim-path, units, equipment, description, range
 *
 * The script:
 *   - walks wiki/procedures/*.md
 *   - locates the `## Tags` appendix in each file
 *   - finds the entry with matching `id:`
 *   - updates the named sub-key (or inserts it if missing)
 *   - writes the file back if anything changed
 *
 * Run `bun validate.ts` afterwards to confirm cross-procedure consistency.
 *
 * No deps. Single file. Runs under Bun.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const REPO_ROOT = new URL("../", import.meta.url).pathname;
const PROCEDURES_DIR = join(REPO_ROOT, "wiki/procedures");

const ALLOWED_FIELDS = new Set([
  "sim-path",
  "units",
  "equipment",
  "description",
  "range",
]);

interface Args {
  tagId: string;
  field: string;
  value: string;
}

function parseArgs(argv: string[]): Args {
  const positional: string[] = [];
  let field = "";
  let value = "";
  for (const arg of argv.slice(2)) {
    if (arg.startsWith("--field=")) field = arg.slice("--field=".length);
    else if (arg.startsWith("--to=")) value = arg.slice("--to=".length);
    else positional.push(arg);
  }
  if (positional.length !== 1 || !field || !value) {
    console.error(
      "usage: bun scripts/update-tag.ts <tag-id> --field=<key> --to=<value>",
    );
    console.error(`allowed fields: ${[...ALLOWED_FIELDS].join(", ")}`);
    process.exit(2);
  }
  if (!ALLOWED_FIELDS.has(field)) {
    console.error(
      `field '${field}' not allowed (must be one of: ${[...ALLOWED_FIELDS].join(", ")})`,
    );
    process.exit(2);
  }
  return { tagId: positional[0], field, value };
}

/**
 * Walk a procedure file, find the `## Tags` appendix entry whose `id:` matches
 * tagId, and update (or insert) the named sub-key. Returns the new file
 * contents if changed, or null otherwise.
 */
function updateTagInFile(content: string, args: Args): string | null {
  const lines = content.split("\n");
  // Locate ## Tags heading
  let appendixStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+Tags\s*$/.test(lines[i])) {
      appendixStart = i + 1;
      break;
    }
  }
  if (appendixStart < 0) return null;

  // Find the entry: `- id: <tagId>`
  let entryStart = -1;
  for (let i = appendixStart; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) break;
    const m = lines[i].match(/^(\s*-\s+id:\s*)(.+?)\s*$/);
    if (m && m[2].trim() === args.tagId) {
      entryStart = i;
      break;
    }
  }
  if (entryStart < 0) return null;

  // Find entry end: next `- id:` line, next `##`, or EOF
  let entryEnd = lines.length;
  for (let i = entryStart + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      entryEnd = i;
      break;
    }
    if (/^\s*-\s+id:\s*/.test(lines[i])) {
      entryEnd = i;
      break;
    }
  }

  // Detect indentation used for sub-keys (look at the line right after entry head)
  let indent = "  ";
  for (let i = entryStart + 1; i < entryEnd; i++) {
    const m = lines[i].match(/^(\s+)[a-z][a-z0-9-]*:/);
    if (m) {
      indent = m[1];
      break;
    }
  }

  // Look for an existing sub-key matching args.field within the entry
  const subRe = new RegExp(`^(\\s+)${escapeRegex(args.field)}:\\s*(.*)$`);
  let updateIdx = -1;
  for (let i = entryStart + 1; i < entryEnd; i++) {
    if (subRe.test(lines[i])) {
      updateIdx = i;
      break;
    }
  }

  if (updateIdx >= 0) {
    const m = lines[updateIdx].match(subRe)!;
    const oldValue = m[2].trim();
    if (oldValue === args.value) return null; // no change needed
    lines[updateIdx] = `${m[1]}${args.field}: ${args.value}`;
  } else {
    // Insert just before entry-end (or at last non-blank line of entry)
    let insertAt = entryEnd;
    // back up over trailing blank lines so the new line lands inside the entry
    while (insertAt > entryStart + 1 && lines[insertAt - 1].trim() === "") {
      insertAt--;
    }
    lines.splice(insertAt, 0, `${indent}${args.field}: ${args.value}`);
  }

  return lines.join("\n");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function main() {
  const args = parseArgs(process.argv);

  const files = (await readdir(PROCEDURES_DIR))
    .filter((f) => f.endsWith(".md"))
    .map((f) => join(PROCEDURES_DIR, f));

  let changed = 0;
  for (const f of files) {
    const content = await readFile(f, "utf-8");
    const updated = updateTagInFile(content, args);
    if (updated === null) continue;
    await writeFile(f, updated, "utf-8");
    changed++;
    console.log(`  updated ${f.replace(REPO_ROOT, "")}`);
  }

  if (changed === 0) {
    console.log(
      `update-tag: no procedures with tag '${args.tagId}' had ${args.field} differing from '${args.value}' — nothing to do`,
    );
  } else {
    console.log(
      `update-tag: ${changed} file(s) updated. Run 'bun validate.ts' to confirm consistency.`,
    );
  }
}

main();

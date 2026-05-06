#!/usr/bin/env bun
/**
 * pwr-eops procedure validator — single-file structural checker for procmd v0.1.
 *
 * Walks wiki/procedures/*.md and wiki/profiles/*.md, parses each, and reports:
 *   - frontmatter shape errors
 *   - duplicate or missing step IDs
 *   - malformed branch syntax
 *   - dangling cross-page references
 *   - unreachable / orphan steps within a page
 *
 * Exits non-zero on any error. No dependencies; pure structural checks.
 *
 * Usage:  bun validate.ts [--verbose]
 */

const SUPPORTED_SPEC_VERSION = "0.1";
const REPO_ROOT = new URL(".", import.meta.url).pathname;
const PROCEDURES_DIR = `${REPO_ROOT}wiki/procedures`;
const PROFILES_DIR = `${REPO_ROOT}wiki/profiles`;

const verbose = process.argv.includes("--verbose");

// ---------- Types ---------------------------------------------------------

type BranchTarget =
  | { kind: "same-page"; stepId: string }
  | { kind: "cross-page"; page: string; stepId?: string }
  | { kind: "end" };

interface Branch {
  line: number;
  condition: string;
  target: BranchTarget;
  raw: string;
}

interface Step {
  line: number;
  label: string;
  id: string;
  primitive?: string;
  branches: Branch[];
  bodyLines: string[];
}

interface Procedure {
  path: string;
  procedureId: string;
  frontmatter: Record<string, string>;
  steps: Step[];
  errors: ValidationError[];
}

interface Profile {
  path: string;
  profileId: string;
  frontmatter: Record<string, string>;
  errors: ValidationError[];
}

interface ValidationError {
  file: string;
  line: number;
  msg: string;
}

// ---------- Frontmatter parsing ------------------------------------------

function parseFrontmatter(content: string): {
  fields: Record<string, string>;
  body: string;
  bodyStartLine: number;
  errors: string[];
} {
  const errors: string[] = [];
  if (!content.startsWith("---\n") && !content.startsWith("---\r\n")) {
    return {
      fields: {},
      body: content,
      bodyStartLine: 1,
      errors: ["missing frontmatter block (file must start with '---')"],
    };
  }
  const lines = content.split("\n");
  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") {
      endIdx = i;
      break;
    }
  }
  if (endIdx === -1) {
    errors.push("frontmatter block not closed (missing trailing '---')");
    return { fields: {}, body: content, bodyStartLine: 1, errors };
  }
  const fields: Record<string, string> = {};
  for (let i = 1; i < endIdx; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) {
      errors.push(`frontmatter line ${i + 1}: cannot parse '${line}'`);
      continue;
    }
    fields[m[1]] = m[2].trim();
  }
  const body = lines.slice(endIdx + 1).join("\n");
  return { fields, body, bodyStartLine: endIdx + 2, errors };
}

// ---------- Branch target parsing ----------------------------------------

function parseBranchTarget(raw: string): BranchTarget | null {
  const t = raw.trim();
  if (t === "END") return { kind: "end" };
  // Same-page: bare fragment #step-id
  let m = t.match(/^#([A-Za-z0-9_-]+)$/);
  if (m) return { kind: "same-page", stepId: m[1] };
  // Cross-page: [[page]] or [[page#step]] (with optional |display)
  m = t.match(/^\[\[([^\]|]+?)(?:\|[^\]]*)?\]\]$/);
  if (m) {
    const inner = m[1];
    const hashIdx = inner.indexOf("#");
    if (hashIdx === -1) {
      return { kind: "cross-page", page: inner.trim() };
    }
    const page = inner.slice(0, hashIdx).trim();
    const stepId = inner.slice(hashIdx + 1).trim();
    return { kind: "cross-page", page, stepId };
  }
  return null;
}

// ---------- Step + branch parsing ----------------------------------------

const STEP_HEADING_RE = /^##\s+(.*?)$/;

function parseStepHeading(
  raw: string,
): { label: string; id: string; primitive?: string } | null {
  const m = raw.match(/^Step\s+(.+?)\s*\[([^\]]+)\]\s*$/);
  if (!m) return null;
  const label = m[1].trim();
  const attrs = m[2].split(",").map((s) => s.trim());
  let id: string | undefined;
  let primitive: string | undefined;
  for (const a of attrs) {
    if (a.startsWith("id:")) id = a.slice(3).trim();
    else if (["decision", "action", "enquiry", "plan"].includes(a))
      primitive = a;
  }
  if (!id) return null;
  return { label, id, primitive };
}

/**
 * A `-` list item is a branch iff it contains `→`.
 * A bare `→ <target>` line outside a list is also a branch (single, unconditional).
 */
function parseStepBody(
  bodyLines: string[],
  startLine: number,
): { branches: Branch[]; errors: ValidationError[] } {
  const branches: Branch[] = [];
  const errors: ValidationError[] = [];
  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i];
    const lineno = startLine + i;
    // List-item branch: `- <condition> → <target>`
    let m = line.match(/^\s*-\s+(.+?)→\s*(.+?)\s*$/);
    if (m) {
      const cond = m[1].trim().replace(/[\s ]+$/, "");
      const targetRaw = m[2].trim();
      const target = parseBranchTarget(targetRaw);
      if (!target) {
        errors.push({
          file: "",
          line: lineno,
          msg: `branch target unparseable: '${targetRaw}'`,
        });
        continue;
      }
      branches.push({ line: lineno, condition: cond, target, raw: line });
      continue;
    }
    // Bare branch: `→ <target>` outside a list
    m = line.match(/^\s*→\s*(.+?)\s*$/);
    if (m) {
      const targetRaw = m[1].trim();
      const target = parseBranchTarget(targetRaw);
      if (!target) {
        errors.push({
          file: "",
          line: lineno,
          msg: `bare branch target unparseable: '${targetRaw}'`,
        });
        continue;
      }
      branches.push({
        line: lineno,
        condition: "(unconditional)",
        target,
        raw: line,
      });
      continue;
    }
    // Suspicious: `- ... <something other than →>`  (Looks decision-shaped, no arrow)
    if (/^\s*-\s+/.test(line) && line.includes("[[") && !line.includes("→")) {
      errors.push({
        file: "",
        line: lineno,
        msg: `list item with [[wikilink]] but no '→' — not parsed as a branch (intentional?)`,
      });
    }
  }
  return { branches, errors };
}

function parseProcedure(path: string, content: string): Procedure {
  const errors: ValidationError[] = [];
  const fm = parseFrontmatter(content);
  for (const e of fm.errors) errors.push({ file: path, line: 1, msg: e });

  const required = [
    "type",
    "procedure-md",
    "procedure-id",
    "title",
    "applies-to",
  ];
  for (const k of required) {
    if (!fm.fields[k])
      errors.push({ file: path, line: 1, msg: `missing frontmatter field: ${k}` });
  }
  if (fm.fields["type"] !== "procedure")
    errors.push({
      file: path,
      line: 1,
      msg: `frontmatter type must be 'procedure', got '${fm.fields["type"]}'`,
    });
  if (
    fm.fields["procedure-md"] &&
    fm.fields["procedure-md"] !== SUPPORTED_SPEC_VERSION
  )
    errors.push({
      file: path,
      line: 1,
      msg: `procedure-md version '${fm.fields["procedure-md"]}' not supported (validator supports ${SUPPORTED_SPEC_VERSION})`,
    });

  // Parse steps
  const steps: Step[] = [];
  const bodyLines = fm.body.split("\n");
  let curStep: Step | null = null;
  let curBodyStart = 0;
  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i];
    const lineno = fm.bodyStartLine + i;
    const m = line.match(STEP_HEADING_RE);
    if (m) {
      // Close previous step
      if (curStep) {
        const collected = bodyLines.slice(curBodyStart, i);
        const parsed = parseStepBody(
          collected,
          fm.bodyStartLine + curBodyStart,
        );
        curStep.branches = parsed.branches;
        curStep.bodyLines = collected;
        for (const e of parsed.errors)
          errors.push({ ...e, file: path });
        steps.push(curStep);
      }
      const head = parseStepHeading(m[1]);
      if (!head) {
        errors.push({
          file: path,
          line: lineno,
          msg: `step heading missing [id: ...]: '${line}'`,
        });
        curStep = null;
        continue;
      }
      curStep = {
        line: lineno,
        label: head.label,
        id: head.id,
        primitive: head.primitive,
        branches: [],
        bodyLines: [],
      };
      curBodyStart = i + 1;
    }
  }
  if (curStep) {
    const collected = bodyLines.slice(curBodyStart);
    const parsed = parseStepBody(
      collected,
      fm.bodyStartLine + curBodyStart,
    );
    curStep.branches = parsed.branches;
    curStep.bodyLines = collected;
    for (const e of parsed.errors) errors.push({ ...e, file: path });
    steps.push(curStep);
  }

  // Duplicate step IDs
  const seen = new Set<string>();
  for (const s of steps) {
    if (seen.has(s.id))
      errors.push({
        file: path,
        line: s.line,
        msg: `duplicate step id within page: '${s.id}'`,
      });
    seen.add(s.id);
  }

  return {
    path,
    procedureId: fm.fields["procedure-id"] ?? "",
    frontmatter: fm.fields,
    steps,
    errors,
  };
}

function parseProfile(path: string, content: string): Profile {
  const errors: ValidationError[] = [];
  const fm = parseFrontmatter(content);
  for (const e of fm.errors) errors.push({ file: path, line: 1, msg: e });
  if (fm.fields["type"] !== "procedure-profile")
    errors.push({
      file: path,
      line: 1,
      msg: `profile frontmatter type must be 'procedure-profile', got '${fm.fields["type"]}'`,
    });
  if (
    fm.fields["procedure-md"] &&
    fm.fields["procedure-md"] !== SUPPORTED_SPEC_VERSION
  )
    errors.push({
      file: path,
      line: 1,
      msg: `procedure-md version '${fm.fields["procedure-md"]}' not supported`,
    });
  return {
    path,
    profileId: fm.fields["profile-id"] ?? "",
    frontmatter: fm.fields,
    errors,
  };
}

// ---------- Cross-page resolution ----------------------------------------

function validateCrossRefs(
  procedures: Procedure[],
): ValidationError[] {
  const errors: ValidationError[] = [];
  const index = new Map<string, Set<string>>();
  for (const p of procedures) {
    const ids = new Set(p.steps.map((s) => s.id));
    if (p.procedureId) index.set(p.procedureId, ids);
  }
  for (const p of procedures) {
    const localIds = new Set(p.steps.map((s) => s.id));
    for (const s of p.steps) {
      for (const b of s.branches) {
        const t = b.target;
        if (t.kind === "end") continue;
        if (t.kind === "same-page") {
          if (!localIds.has(t.stepId)) {
            errors.push({
              file: p.path,
              line: b.line,
              msg: `same-page branch target #${t.stepId} not found in page (step ids: ${[...localIds].join(", ")})`,
            });
          }
          continue;
        }
        // cross-page
        const targetIds = index.get(t.page);
        if (!targetIds) {
          errors.push({
            file: p.path,
            line: b.line,
            msg: `cross-page branch target [[${t.page}]] — no procedure with id '${t.page}' in corpus`,
          });
          continue;
        }
        if (t.stepId && !targetIds.has(t.stepId)) {
          errors.push({
            file: p.path,
            line: b.line,
            msg: `cross-page branch target [[${t.page}#${t.stepId}]] — step id '${t.stepId}' not found in '${t.page}'`,
          });
        }
      }
    }
  }
  return errors;
}

// ---------- Reachability -------------------------------------------------

function checkReachability(p: Procedure): ValidationError[] {
  const errors: ValidationError[] = [];
  if (p.steps.length === 0) return errors;
  const reachable = new Set<string>();
  const stack: string[] = [p.steps[0].id];
  const stepById = new Map(p.steps.map((s) => [s.id, s]));
  while (stack.length) {
    const id = stack.pop()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    const s = stepById.get(id);
    if (!s) continue;
    for (const b of s.branches) {
      if (b.target.kind === "same-page") stack.push(b.target.stepId);
      // cross-page and END are exits — don't traverse further within this page
    }
  }
  for (const s of p.steps) {
    if (!reachable.has(s.id)) {
      errors.push({
        file: p.path,
        line: s.line,
        msg: `orphan step '${s.id}' — not reachable from first step '${p.steps[0].id}'`,
      });
    }
  }
  return errors;
}

// ---------- Main ----------------------------------------------------------

async function main() {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");

  const procedureFiles = (await fs.readdir(PROCEDURES_DIR))
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(PROCEDURES_DIR, f));
  const profileFiles = (await fs.readdir(PROFILES_DIR).catch(() => []))
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(PROFILES_DIR, f));

  const allErrors: ValidationError[] = [];
  const procedures: Procedure[] = [];
  for (const f of procedureFiles) {
    const content = await fs.readFile(f, "utf-8");
    const p = parseProcedure(f, content);
    procedures.push(p);
    allErrors.push(...p.errors);
    // Filename / procedure-id consistency
    const expected = path.basename(f, ".md");
    if (p.procedureId && p.procedureId !== expected) {
      allErrors.push({
        file: f,
        line: 1,
        msg: `procedure-id '${p.procedureId}' does not match filename '${expected}'`,
      });
    }
  }
  for (const f of profileFiles) {
    const content = await fs.readFile(f, "utf-8");
    const pr = parseProfile(f, content);
    allErrors.push(...pr.errors);
  }

  // Cross-ref + reachability
  allErrors.push(...validateCrossRefs(procedures));
  for (const p of procedures) allErrors.push(...checkReachability(p));

  // Report
  if (allErrors.length === 0) {
    console.log(
      `✅ ${procedures.length} procedures + ${profileFiles.length} profile(s) validated clean (procmd v${SUPPORTED_SPEC_VERSION}).`,
    );
    if (verbose) {
      const totalSteps = procedures.reduce((n, p) => n + p.steps.length, 0);
      const totalBranches = procedures.reduce(
        (n, p) => n + p.steps.reduce((m, s) => m + s.branches.length, 0),
        0,
      );
      console.log(
        `   ${totalSteps} steps, ${totalBranches} branches, ${[...new Set(procedures.map((p) => p.procedureId))].length} unique procedure IDs.`,
      );
    }
    process.exit(0);
  }
  // Sort errors by file, then line
  allErrors.sort((a, b) =>
    a.file === b.file ? a.line - b.line : a.file.localeCompare(b.file),
  );
  for (const e of allErrors) {
    const rel = e.file.replace(REPO_ROOT, "");
    console.log(`${rel}:${e.line}: ${e.msg}`);
  }
  console.log(`\n❌ ${allErrors.length} error(s) in ${procedures.length} procedures.`);
  process.exit(1);
}

main();

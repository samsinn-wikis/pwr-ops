#!/usr/bin/env bun
/**
 * pwr-eops procedure validator — single-file structural checker for procmd v0.2.
 *
 * Walks wiki/procedures/*.md and wiki/profiles/*.md, parses each, and reports:
 *   - frontmatter shape errors
 *   - duplicate or missing step IDs (kebab-case lowercase enforced)
 *   - multi-arrow branches and other malformed branch syntax
 *   - dangling cross-page references
 *   - unreachable / orphan steps within a page
 *   - edge label vocabulary (warns on unknown)
 *   - frontmatter taxonomy against profile vocabulary
 *   - lifecycle keyword + synonym recognition
 *
 * Rejects v0.1 documents (procedure-md must equal SUPPORTED_SPEC_VERSION).
 * No backward compatibility; corpora migrate by frontmatter bump.
 *
 * Exits non-zero on errors. Warnings do not block.
 * No dependencies; runs under Bun.
 *
 * Usage:  bun validate.ts [--verbose]
 */

const SUPPORTED_SPEC_VERSION = "0.3";

// ---------- v0.2 vocabularies --------------------------------------------

const EDGE_LABELS = new Set([
  "Continue",
  "Escalate",
  "Delegate",
  "Recover",
  "Fallback",
  "Monitor",
  "Terminate",
]);

const STEP_ID_RE = /^[a-z0-9][a-z0-9-]*$/;

// Lifecycle keyword synonyms — all map to a canonical primitive role
const LIFECYCLE_KEYWORDS = new Set([
  "When", "Until", "Abort-if", "Abort-to", "Within",
  "If", "Once", "Unless", "While", "As-long-as", "Bail-if",
]);
const LIFECYCLE_SYNONYM_GROUPS: Record<string, string[]> = {
  When: ["If", "Once", "Unless"],
  Until: ["While", "As-long-as"],
  "Abort-if": ["Bail-if"],
};
function canonicalLifecycleKw(kw: string): string {
  for (const [canon, syns] of Object.entries(LIFECYCLE_SYNONYM_GROUPS)) {
    if (kw === canon || syns.includes(kw)) return canon;
  }
  return kw;
}
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
  label?: string; // optional edge label, e.g. "Continue", "Escalate"
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
  severity?: "error" | "warning"; // defaults to "error"
}

interface ProfileVocabulary {
  categories: Set<string>;
  csfs: Set<string>;
  triggers: Set<string>;
  synonyms: Map<string, string>; // synonym → canonical expansion (informational)
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
): { label: string; id: string; primitive?: string; idValid: boolean } | null {
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
  return { label, id, primitive, idValid: STEP_ID_RE.test(id) };
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
      let targetRaw = m[2].trim();
      // v0.3: optional [Label] sits between → and target.
      let labelStrAfter: string | undefined;
      const afterArrowLabelM = targetRaw.match(/^\[([A-Za-z]+)\]\s+(.*)$/);
      if (afterArrowLabelM) {
        labelStrAfter = afterArrowLabelM[1];
        targetRaw = afterArrowLabelM[2].trim();
        if (!EDGE_LABELS.has(labelStrAfter)) {
          errors.push({
            file: "",
            line: lineno,
            severity: "warning",
            msg: `unknown edge label '[${labelStrAfter}]' — not in canonical vocabulary (Continue, Escalate, Delegate, Recover, Fallback, Monitor, Terminate)`,
          });
        }
      }
      const target = parseBranchTarget(targetRaw);
      if (!target) {
        errors.push({
          file: "",
          line: lineno,
          msg: `branch target unparseable: '${targetRaw}'`,
        });
        continue;
      }
      // Multi-arrow detection (v0.2: exactly one →)
      const arrowCount = (line.match(/→/g) || []).length;
      if (arrowCount > 1) {
        errors.push({
          file: "",
          line: lineno,
          msg: `branch contains ${arrowCount} '→' arrows — branches must have exactly one. Split into Action: line + clean branch.`,
        });
        continue;
      }
      // v0.3: edge label is parsed AFTER the arrow (above). Reject the
      // legacy v0.2 position (label before condition) with a clear error.
      const legacyLabelM = cond.match(/^\[([A-Za-z]+)\]\s+/);
      if (legacyLabelM) {
        errors.push({
          file: "",
          line: lineno,
          msg: `edge label '[${legacyLabelM[1]}]' before condition is v0.2 syntax — v0.3 places it after the arrow: '- cond → [Label] target'`,
        });
        continue;
      }
      branches.push({ line: lineno, condition: cond, target, raw: line, label: labelStrAfter });
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
      msg: `procedure-md version '${fm.fields["procedure-md"]}' not supported (validator requires ${SUPPORTED_SPEC_VERSION}; v0.1 corpora must be migrated)`,
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

  // Duplicate step IDs + charset enforcement (v0.2)
  const seen = new Set<string>();
  for (const s of steps) {
    if (seen.has(s.id))
      errors.push({
        file: path,
        line: s.line,
        msg: `duplicate step id within page: '${s.id}'`,
      });
    seen.add(s.id);
    if (!STEP_ID_RE.test(s.id))
      errors.push({
        file: path,
        line: s.line,
        msg: `step id '${s.id}' violates charset [a-z0-9][a-z0-9-]* (kebab-case lowercase)`,
      });
  }

  // ≥ 1 step required (v0.2 — A14)
  if (steps.length === 0)
    errors.push({
      file: path,
      line: 1,
      msg: `procedure has no '## Step' headings — at least one is required`,
    });

  // Procedure-level Concurrent: placement is permitted between frontmatter
  // and the first '## Step' heading (v0.2 — A3). No structural constraint
  // beyond ordering; nothing to flag here unless we want to detect
  // misplaced declarations later.

  // Lifecycle keyword + synonym sanity within each step (v0.2)
  for (const s of steps) {
    const seenCanonical = new Map<string, string[]>(); // canonical → list of surface keywords seen
    for (const ln of s.bodyLines) {
      const m = ln.match(/^([A-Za-z][A-Za-z0-9-]*?):/);
      if (!m) continue;
      const kw = m[1];
      if (!LIFECYCLE_KEYWORDS.has(kw)) continue;
      const canon = canonicalLifecycleKw(kw);
      const list = seenCanonical.get(canon) ?? [];
      list.push(kw);
      seenCanonical.set(canon, list);
    }
    for (const [canon, surfaces] of seenCanonical) {
      const distinct = [...new Set(surfaces)];
      if (distinct.length > 1) {
        errors.push({
          file: path,
          line: s.line,
          severity: "warning",
          msg: `step '${s.id}' uses multiple surface keywords for same lifecycle role (${canon}): ${distinct.join(", ")} — likely author confusion`,
        });
      }
    }
  }

  return {
    path,
    procedureId: fm.fields["procedure-id"] ?? "",
    frontmatter: fm.fields,
    steps,
    errors,
  };
}

function parseProfile(path: string, content: string): Profile & { vocab: ProfileVocabulary } {
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

  // Parse vocabulary sections from body (v0.2)
  // Looks for "## Taxonomy" with "### Categories", "### CSFs", "### Entry triggers"
  // and "## Synonyms" sections. Each list is a bullet list of values.
  const vocab: ProfileVocabulary = {
    categories: new Set(),
    csfs: new Set(),
    triggers: new Set(),
    synonyms: new Map(),
  };
  const lines = fm.body.split("\n");
  let section: "" | "categories" | "csfs" | "triggers" | "synonyms" = "";
  for (const line of lines) {
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3) {
      const t = h3[1].toLowerCase();
      if (t === "categories") section = "categories";
      else if (t === "csfs" || t === "critical safety functions") section = "csfs";
      else if (t === "entry triggers" || t === "triggers") section = "triggers";
      else section = "";
      continue;
    }
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      const t = h2[1].toLowerCase();
      if (t === "synonyms") section = "synonyms";
      else if (t !== "taxonomy") section = "";
      continue;
    }
    const item = line.match(/^\s*-\s+(.+?)\s*$/);
    if (!item) continue;
    const value = item[1];
    if (section === "categories") vocab.categories.add(value.trim());
    else if (section === "csfs") vocab.csfs.add(value.trim());
    else if (section === "triggers") vocab.triggers.add(value.trim());
    else if (section === "synonyms") {
      // synonym item: `\`X:\` ≡ ...` — capture the X
      const sm = value.match(/^[`']?([A-Za-z][A-Za-z0-9-]*):[`']?\s*(?:≡|=)/);
      if (sm) vocab.synonyms.set(sm[1], value);
    }
  }

  return {
    path,
    profileId: fm.fields["profile-id"] ?? "",
    frontmatter: fm.fields,
    errors,
    vocab,
  };
}

// Validate taxonomy fields on a procedure against a loaded profile's vocabulary
function validateTaxonomy(
  p: Procedure,
  profile: (Profile & { vocab: ProfileVocabulary }) | undefined,
): ValidationError[] {
  const errs: ValidationError[] = [];
  if (!profile) return errs; // no profile loaded — taxonomy accepts free-text
  const fm = p.frontmatter;
  const cat = fm["category"];
  if (cat && profile.vocab.categories.size > 0 && !profile.vocab.categories.has(cat)) {
    errs.push({
      file: p.path,
      line: 1,
      msg: `category '${cat}' not declared in profile '${profile.profileId}' vocabulary`,
    });
  }
  for (const fld of ["csfs-monitored", "entry-triggers"] as const) {
    const raw = fm[fld];
    if (!raw) continue;
    const list = raw
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const vocab = fld === "csfs-monitored" ? profile.vocab.csfs : profile.vocab.triggers;
    if (vocab.size === 0) continue;
    for (const v of list) {
      if (!vocab.has(v)) {
        errs.push({
          file: p.path,
          line: 1,
          msg: `${fld} value '${v}' not declared in profile '${profile.profileId}' vocabulary`,
        });
      }
    }
  }
  return errs;
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

  const allMessages: ValidationError[] = [];
  const procedures: Procedure[] = [];
  for (const f of procedureFiles) {
    const content = await fs.readFile(f, "utf-8");
    const p = parseProcedure(f, content);
    procedures.push(p);
    allMessages.push(...p.errors);
    // Filename / procedure-id consistency (case-sensitive exact match — A15)
    const expected = path.basename(f, ".md");
    if (p.procedureId && p.procedureId !== expected) {
      allMessages.push({
        file: f,
        line: 1,
        msg: `procedure-id '${p.procedureId}' does not match filename '${expected}' (case-sensitive)`,
      });
    }
  }

  // Load profiles into a name → vocab map
  const profilesById = new Map<string, Profile & { vocab: ProfileVocabulary }>();
  for (const f of profileFiles) {
    const content = await fs.readFile(f, "utf-8");
    const pr = parseProfile(f, content);
    allMessages.push(...pr.errors);
    if (pr.profileId) profilesById.set(pr.profileId, pr);
  }

  // Validate taxonomy fields against loaded profile vocabulary (v0.2)
  for (const p of procedures) {
    const profileName = p.frontmatter["profile"];
    const profile = profileName ? profilesById.get(profileName) : undefined;
    if (profileName && !profile) {
      allMessages.push({
        file: p.path,
        line: 1,
        severity: "warning",
        msg: `profile '${profileName}' declared in frontmatter but not loaded — taxonomy validation skipped`,
      });
    }
    allMessages.push(...validateTaxonomy(p, profile));
  }

  // Cross-ref + reachability
  allMessages.push(...validateCrossRefs(procedures));
  for (const p of procedures) allMessages.push(...checkReachability(p));

  // Split errors and warnings
  const errors = allMessages.filter((m) => (m.severity ?? "error") === "error");
  const warnings = allMessages.filter((m) => m.severity === "warning");

  // Sort by file, then line
  const byPos = (a: ValidationError, b: ValidationError) =>
    a.file === b.file ? a.line - b.line : a.file.localeCompare(b.file);
  errors.sort(byPos);
  warnings.sort(byPos);

  // Print warnings (don't block)
  for (const w of warnings) {
    const rel = w.file.replace(REPO_ROOT, "");
    console.log(`${rel}:${w.line}: warning: ${w.msg}`);
  }

  if (errors.length === 0) {
    console.log(
      `✅ ${procedures.length} procedures + ${profileFiles.length} profile(s) validated clean (procmd v${SUPPORTED_SPEC_VERSION}, ${warnings.length} warning(s)).`,
    );
    if (verbose) {
      const totalSteps = procedures.reduce((n, p) => n + p.steps.length, 0);
      const totalBranches = procedures.reduce(
        (n, p) => n + p.steps.reduce((m, s) => m + s.branches.length, 0),
        0,
      );
      const labeled = procedures.reduce(
        (n, p) =>
          n +
          p.steps.reduce(
            (m, s) => m + s.branches.filter((b) => b.label).length,
            0,
          ),
        0,
      );
      console.log(
        `   ${totalSteps} steps, ${totalBranches} branches (${labeled} labeled), ${[...new Set(procedures.map((p) => p.procedureId))].length} unique procedure IDs.`,
      );
    }
    process.exit(0);
  }

  for (const e of errors) {
    const rel = e.file.replace(REPO_ROOT, "");
    console.log(`${rel}:${e.line}: ${e.msg}`);
  }
  console.log(
    `\n❌ ${errors.length} error(s) in ${procedures.length} procedures (${warnings.length} warning(s)).`,
  );
  process.exit(1);
}

main();

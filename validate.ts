#!/usr/bin/env bun
/**
 * pwr-eops procedure validator — single-file structural checker for procmd v0.5.
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
 *   - «TAG» references resolve to a `## Tags` appendix entry in the same file
 *   - tag-id charset, required sub-keys, unreferenced entries (warning)
 *   - cross-procedure tag consistency (sim-path/units/equipment must agree)
 *
 * Rejects older spec versions (procedure-md must equal SUPPORTED_SPEC_VERSION).
 * No backward compatibility; corpora migrate by frontmatter bump.
 *
 * Exits non-zero on errors. Warnings do not block.
 * No dependencies; runs under Bun.
 *
 * Usage:  bun validate.ts [--verbose]
 */

const SUPPORTED_SPEC_VERSION = "0.5";

// v0.5: tag-id charset is uppercase + digits + hyphens, must start with a letter.
const TAG_ID_RE = /^[A-Z][A-Z0-9-]*$/;
// Inline tag reference syntax: «TAG-ID» (U+00AB, U+00BB)
const TAG_REF_RE = /«([A-Z][A-Z0-9-]*)»/g;
// Required sub-keys on every ## Tags appendix entry
const TAG_REQUIRED_KEYS = ["id", "description", "sim-path", "units", "equipment"] as const;

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
  tagRefs: { tagId: string; line: number }[];
}

interface TagDefinition {
  id: string;
  description?: string;
  simPath?: string;
  units?: string;
  equipment?: string;
  range?: string;
  extra: Record<string, string>;
  line: number;
}

interface Procedure {
  path: string;
  procedureId: string;
  frontmatter: Record<string, string>;
  steps: Step[];
  tags: TagDefinition[];
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
      const targetRaw = m[2].trim();
      // v0.4: in-source [Label] dropped. Reject any v0.3-style label
      // after the arrow with a clear migration message.
      const legacyAfterArrowLabel = targetRaw.match(/^\[([A-Za-z]+)\]\s+/);
      if (legacyAfterArrowLabel) {
        errors.push({
          file: "",
          line: lineno,
          msg: `edge label '[${legacyAfterArrowLabel[1]}]' after arrow is v0.3 syntax — v0.4 dropped in-source labels; KG export now infers edge type from target prefix at export time. Strip the label.`,
        });
        continue;
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
      // v0.4: also reject the older v0.2 label-before-condition syntax.
      const legacyBeforeCondLabel = cond.match(/^\[([A-Za-z]+)\]\s+/);
      if (legacyBeforeCondLabel) {
        errors.push({
          file: "",
          line: lineno,
          msg: `edge label '[${legacyBeforeCondLabel[1]}]' before condition is legacy syntax — v0.4 dropped in-source labels; strip it.`,
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

// ---------- Tag reference scanning + appendix parsing (v0.5) ------------

/**
 * Strip inline code spans (between backticks) from a line so «TAG» refs
 * inside `code` don't count. Wikilinks `[[...]]` are also stripped — refs
 * inside link targets / display text are inert per the v0.5 spec.
 */
function stripInert(line: string): string {
  return line
    .replace(/`[^`]*`/g, "")
    .replace(/\[\[[^\]]*\]\]/g, "");
}

/**
 * Scan `«TAG-ID»` references in a step's body lines. Skips fenced code
 * blocks and inline code spans / wikilinks. Returns each ref with the
 * absolute line number (1-based) it appeared on.
 */
function scanTagRefs(
  bodyLines: string[],
  startLine: number,
): { tagId: string; line: number }[] {
  const refs: { tagId: string; line: number }[] = [];
  let inFence = false;
  for (let i = 0; i < bodyLines.length; i++) {
    const raw = bodyLines[i];
    if (/^(```|~~~)/.test(raw)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const stripped = stripInert(raw);
    let m: RegExpExecArray | null;
    TAG_REF_RE.lastIndex = 0;
    while ((m = TAG_REF_RE.exec(stripped))) {
      refs.push({ tagId: m[1], line: startLine + i });
    }
  }
  return refs;
}

/**
 * Parse the `## Tags` appendix section if present. Returns an array of
 * tag definitions plus any structural errors. Each entry begins with
 * `- id: <tag-id>` and continues with indented `<key>: <value>` lines
 * until the next list item, blank line, or end of section.
 */
function parseTagsAppendix(
  bodyLines: string[],
  bodyStartLine: number,
): { tags: TagDefinition[]; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  const tags: TagDefinition[] = [];

  // Find the `## Tags` heading
  let appendixStart = -1;
  for (let i = 0; i < bodyLines.length; i++) {
    if (/^##\s+Tags\s*$/.test(bodyLines[i])) {
      appendixStart = i + 1;
      break;
    }
  }
  if (appendixStart < 0) return { tags, errors };

  // Collect lines until next ## heading or EOF
  let appendixEnd = bodyLines.length;
  for (let i = appendixStart; i < bodyLines.length; i++) {
    if (/^##\s+/.test(bodyLines[i])) {
      appendixEnd = i;
      break;
    }
  }

  // Walk entries: each starts with `- id: <tag>` (possibly indented)
  let cur: TagDefinition | null = null;
  const flush = () => {
    if (cur) tags.push(cur);
    cur = null;
  };
  for (let i = appendixStart; i < appendixEnd; i++) {
    const raw = bodyLines[i];
    const lineno = bodyStartLine + i;
    if (raw.trim() === "") {
      // blank line ends the current entry's collection but doesn't end the section
      continue;
    }
    const itemHead = raw.match(/^\s*-\s+id:\s*(.+?)\s*$/);
    if (itemHead) {
      flush();
      cur = {
        id: itemHead[1].trim(),
        extra: {},
        line: lineno,
      };
      continue;
    }
    if (!cur) {
      // Non-blank, non-itemhead line outside any entry — ignore (could be intro prose)
      continue;
    }
    const sub = raw.match(/^\s+([a-z][a-z0-9-]*):\s*(.*?)\s*$/);
    if (sub) {
      const key = sub[1];
      const value = sub[2];
      if (key === "id") {
        // mid-entry id is suspect — start a new entry
        flush();
        cur = { id: value, extra: {}, line: lineno };
        continue;
      }
      if (key === "description") cur.description = value;
      else if (key === "sim-path") cur.simPath = value;
      else if (key === "units") cur.units = value;
      else if (key === "equipment") cur.equipment = value;
      else if (key === "range") cur.range = value;
      else cur.extra[key] = value;
    }
  }
  flush();
  return { tags, errors };
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
  // v0.5: a `## Tags` heading marks the end of steps and the start of the
  // appendix; record its position so we can both stop step-scanning and
  // pass the slice to the appendix parser.
  let tagsAppendixIdx = -1;
  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i];
    const lineno = fm.bodyStartLine + i;
    const m = line.match(STEP_HEADING_RE);
    if (m) {
      // `## Tags` ends the step section in v0.5 — close current step and stop
      if (/^Tags\s*$/.test(m[1])) {
        if (curStep) {
          const collected = bodyLines.slice(curBodyStart, i);
          const parsed = parseStepBody(
            collected,
            fm.bodyStartLine + curBodyStart,
          );
          curStep.branches = parsed.branches;
          curStep.bodyLines = collected;
          for (const e of parsed.errors) errors.push({ ...e, file: path });
          steps.push(curStep);
          curStep = null;
        }
        tagsAppendixIdx = i;
        break;
      }
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
        tagRefs: [],
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

  // Scan «TAG» references in each step's body
  for (const s of steps) {
    s.tagRefs = scanTagRefs(s.bodyLines, s.line + 1);
  }

  // Parse `## Tags` appendix (if present)
  const { tags, errors: tagAppendixErrors } = tagsAppendixIdx >= 0
    ? parseTagsAppendix(bodyLines, fm.bodyStartLine)
    : { tags: [], errors: [] as ValidationError[] };
  for (const e of tagAppendixErrors) errors.push({ ...e, file: path });

  // v0.5 per-procedure tag validation
  const tagsById = new Map<string, TagDefinition>();
  for (const t of tags) {
    if (!TAG_ID_RE.test(t.id)) {
      errors.push({
        file: path,
        line: t.line,
        msg: `tag id '${t.id}' violates charset [A-Z][A-Z0-9-]* (uppercase, alphanumeric, hyphens; must start with a letter)`,
      });
    }
    if (tagsById.has(t.id)) {
      errors.push({
        file: path,
        line: t.line,
        msg: `duplicate tag id '${t.id}' in ## Tags appendix`,
      });
    }
    tagsById.set(t.id, t);
    for (const k of TAG_REQUIRED_KEYS) {
      if (k === "id") continue;
      const has =
        (k === "description" && t.description) ||
        (k === "sim-path" && t.simPath) ||
        (k === "units" && t.units) ||
        (k === "equipment" && t.equipment);
      if (!has) {
        errors.push({
          file: path,
          line: t.line,
          msg: `tag '${t.id}' missing required sub-key '${k}'`,
        });
      }
    }
  }
  // Refs resolve; warn on unreferenced entries
  const referencedIds = new Set<string>();
  for (const s of steps) {
    for (const ref of s.tagRefs) {
      referencedIds.add(ref.tagId);
      if (!tagsById.has(ref.tagId)) {
        errors.push({
          file: path,
          line: ref.line,
          msg: `«${ref.tagId}» reference has no entry in ## Tags appendix`,
        });
      }
    }
  }
  for (const t of tags) {
    if (!referencedIds.has(t.id)) {
      errors.push({
        file: path,
        line: t.line,
        severity: "warning",
        msg: `tag '${t.id}' defined in appendix but never referenced in any step body`,
      });
    }
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
    tags,
    errors,
  };
}

/**
 * v0.5 cross-procedure validation: a tag id appearing in two procedures
 * with conflicting `sim-path`/`units`/`equipment` is an error. Conflicting
 * `description` is a warning.
 */
function validateTagConsistency(procedures: Procedure[]): ValidationError[] {
  const errors: ValidationError[] = [];
  // tagId → array of (path, def)
  const occurrences = new Map<string, { path: string; def: TagDefinition }[]>();
  for (const p of procedures) {
    for (const t of p.tags) {
      const list = occurrences.get(t.id) ?? [];
      list.push({ path: p.path, def: t });
      occurrences.set(t.id, list);
    }
  }
  for (const [id, occs] of occurrences) {
    if (occs.length < 2) continue;
    const first = occs[0];
    for (let i = 1; i < occs.length; i++) {
      const cur = occs[i];
      const fields: ("simPath" | "units" | "equipment")[] = ["simPath", "units", "equipment"];
      for (const f of fields) {
        if (cur.def[f] !== first.def[f]) {
          errors.push({
            file: cur.path,
            line: cur.def.line,
            msg: `tag '${id}' ${f === "simPath" ? "sim-path" : f} '${cur.def[f] ?? ""}' conflicts with definition in ${first.path.split("/").pop()} (line ${first.def.line}: '${first.def[f] ?? ""}')`,
          });
        }
      }
      if (cur.def.description !== first.def.description) {
        errors.push({
          file: cur.path,
          line: cur.def.line,
          severity: "warning",
          msg: `tag '${id}' description differs from ${first.path.split("/").pop()} (line ${first.def.line}) — descriptions may legitimately vary; reconcile if intent diverged`,
        });
      }
    }
  }
  return errors;
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

  // v0.5 cross-procedure tag consistency
  allMessages.push(...validateTagConsistency(procedures));

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
      const totalTags = procedures.reduce((n, p) => n + p.tags.length, 0);
      const totalTagRefs = procedures.reduce(
        (n, p) => n + p.steps.reduce((m, s) => m + s.tagRefs.length, 0),
        0,
      );
      const uniqueTagIds = new Set(
        procedures.flatMap((p) => p.tags.map((t) => t.id)),
      ).size;
      console.log(
        `   ${totalSteps} steps, ${totalBranches} branches (${labeled} labeled), ${[...new Set(procedures.map((p) => p.procedureId))].length} unique procedure IDs.`,
      );
      console.log(
        `   ${totalTagRefs} tag references, ${totalTags} appendix entries, ${uniqueTagIds} unique tag IDs.`,
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

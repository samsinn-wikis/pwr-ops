#!/usr/bin/env bun
/**
 * export-kg — KG export of the procmd corpus as JSON-LD.
 *
 * Walks wiki/procedures/*.md, parses frontmatter + branches + edge labels,
 * emits JSON-LD to _build/kg.jsonld with a stable @context.
 *
 * Subjects:
 *   - procedures (Procedure URIs)
 *   - steps (Step URIs)
 *   - CSFs, triggers, categories (referenced URIs)
 *
 * Predicates: see ONTOLOGY constant.
 *
 * No deps. Single file. Runs under Bun.
 *
 * Usage:  bun scripts/export-kg.ts [--pretty]
 */

import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const REPO_ROOT = new URL("../", import.meta.url).pathname;
const PROCEDURES_DIR = join(REPO_ROOT, "wiki/procedures");
const OUT_PATH = join(REPO_ROOT, "_build/kg.jsonld");

const ONTOLOGY = "https://samsinn-wikis.github.io/pwr-eops/ontology/v1#";
const PROC_URI = "https://samsinn-wikis.github.io/pwr-eops/procedures/";
const CSF_URI = "https://samsinn-wikis.github.io/pwr-eops/csf/";
const TRIG_URI = "https://samsinn-wikis.github.io/pwr-eops/trigger/";
const CAT_URI = "https://samsinn-wikis.github.io/pwr-eops/category/";

const LABEL_TO_PREDICATE: Record<string, string> = {
  Continue: "continuesTo",
  Escalate: "escalatesTo",
  Delegate: "delegatesTo",
  Recover: "recoversVia",
  Fallback: "fallbacksTo",
  Monitor: "monitors",
  Terminate: "terminates",
};

function inferLabel(target: string): string {
  if (target === "END") return "Terminate";
  if (target.startsWith("#")) return "Continue";
  const inner = target.replace(/^\[\[|\]\]$/g, "").split("|")[0].split("#")[0];
  if (/^FR-/.test(inner)) return "Escalate";
  if (/^ES-/.test(inner)) return "Recover";
  if (/^ECA-/.test(inner)) return "Fallback";
  if (/^E-[0-9]/.test(inner)) return "Delegate";
  return "Delegate"; // neutral fallback for cross-page
}

interface BranchEdge {
  fromStepId: string;
  label: string;
  predicate: string;
  toKind: "step" | "procedure" | "end";
  toPage?: string;
  toStep?: string;
  condition: string;
}

interface ParsedProcedure {
  id: string;
  title: string;
  category?: string;
  csfs: string[];
  triggers: string[];
  steps: { id: string; line: number; branches: BranchEdge[] }[];
  procedureCsfs: string[]; // from CSF: lines at procedure level
}

function parseFrontmatter(content: string): { fm: Record<string, string>; body: string } {
  const fm: Record<string, string> = {};
  if (!content.startsWith("---\n")) return { fm, body: content };
  const lines = content.split("\n");
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") { end = i; break; }
  }
  if (end === -1) return { fm, body: content };
  for (let i = 1; i < end; i++) {
    const m = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].trim();
  }
  return { fm, body: lines.slice(end + 1).join("\n") };
}

function parseListField(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw.replace(/^\[|\]$/g, "").split(",").map((s) => s.trim()).filter(Boolean);
}

function parseProcedure(path: string, content: string): ParsedProcedure | null {
  const { fm, body } = parseFrontmatter(content);
  if (fm["type"] !== "procedure") return null;
  if (!fm["procedure-id"]) return null;

  const proc: ParsedProcedure = {
    id: fm["procedure-id"],
    title: fm["title"] ?? "",
    category: fm["category"],
    csfs: parseListField(fm["csfs-monitored"]),
    triggers: parseListField(fm["entry-triggers"]),
    steps: [],
    procedureCsfs: [],
  };

  const lines = body.split("\n");
  // Procedure-level CSF: lines (before first ## Step)
  let firstStep = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^##\s+Step/)) { firstStep = i; break; }
  }
  for (let i = 0; i < firstStep; i++) {
    const m = lines[i].match(/^CSF:\s*(.+?)\s*$/);
    if (m) proc.procedureCsfs.push(m[1].trim());
  }

  // Steps and branches
  let cur: { id: string; line: number; branches: BranchEdge[] } | null = null;
  for (let i = firstStep; i < lines.length; i++) {
    const line = lines[i];
    const sh = line.match(/^##\s+Step\s+.+?\[id:\s*([a-z0-9][a-z0-9-]*)[^\]]*\]\s*$/);
    if (sh) {
      if (cur) proc.steps.push(cur);
      cur = { id: sh[1], line: i + 1, branches: [] };
      continue;
    }
    if (!cur) continue;
    // Branch: `- [Label] cond → target`  OR  `- cond → target`  OR bare `→ target`
    const arrowCount = (line.match(/→/g) || []).length;
    if (arrowCount !== 1) continue;
    let m = line.match(/^\s*-\s+(.+?)→\s*(.+?)\s*$/);
    let cond = "";
    let targetRaw = "";
    if (m) { cond = m[1].trim(); targetRaw = m[2].trim(); }
    else {
      m = line.match(/^\s*→\s*(.+?)\s*$/);
      if (m) { cond = "(unconditional)"; targetRaw = m[1].trim(); }
      else continue;
    }
    let label: string | undefined;
    const lm = cond.match(/^\[([A-Za-z]+)\]\s*(.*)$/);
    if (lm) { label = lm[1]; cond = lm[2].trim(); }
    if (!label) label = inferLabel(targetRaw);
    const predicate = LABEL_TO_PREDICATE[label] ?? "branchesTo";
    let toKind: BranchEdge["toKind"];
    let toPage: string | undefined;
    let toStep: string | undefined;
    if (targetRaw === "END") toKind = "end";
    else if (targetRaw.startsWith("#")) {
      toKind = "step";
      toStep = targetRaw.slice(1);
    } else {
      const inner = targetRaw.replace(/^\[\[|\]\]$/g, "").split("|")[0];
      const hashIdx = inner.indexOf("#");
      if (hashIdx >= 0) {
        toKind = "step";
        toPage = inner.slice(0, hashIdx);
        toStep = inner.slice(hashIdx + 1);
      } else {
        toKind = "procedure";
        toPage = inner;
      }
    }
    cur.branches.push({
      fromStepId: cur.id,
      label,
      predicate,
      toKind,
      toPage,
      toStep,
      condition: cond,
    });
  }
  if (cur) proc.steps.push(cur);

  return proc;
}

async function main() {
  const procFiles = (await readdir(PROCEDURES_DIR)).filter((f) => f.endsWith(".md"));
  const procs: ParsedProcedure[] = [];
  for (const f of procFiles) {
    const content = await readFile(join(PROCEDURES_DIR, f), "utf-8");
    const p = parseProcedure(f, content);
    if (p) procs.push(p);
  }

  // Build JSON-LD graph
  const graph: any[] = [];

  // Procedures + their classifications
  for (const p of procs) {
    const subj = PROC_URI + p.id;
    const node: any = {
      "@id": subj,
      "@type": "Procedure",
      "label": p.title,
      "procedureId": p.id,
    };
    if (p.category) node["belongsToCategory"] = { "@id": CAT_URI + p.category };
    if (p.csfs.length > 0)
      node["monitorsCsf"] = p.csfs.map((c) => ({ "@id": CSF_URI + c }));
    if (p.procedureCsfs.length > 0)
      node["monitors"] = p.procedureCsfs.map((c) => ({ "@id": CSF_URI + c }));
    if (p.triggers.length > 0)
      node["triggeredBy"] = p.triggers.map((t) => ({ "@id": TRIG_URI + t }));
    if (p.steps.length > 0)
      node["hasStep"] = p.steps.map((s) => ({ "@id": `${subj}#${s.id}` }));
    graph.push(node);
  }

  // Steps + branches as edges
  const procEdgeKeys: Record<string, Set<string>> = {};
  for (const p of procs) {
    const procSubj = PROC_URI + p.id;
    procEdgeKeys[procSubj] = new Set();
    for (const s of p.steps) {
      const stepSubj = `${procSubj}#${s.id}`;
      const stepNode: any = {
        "@id": stepSubj,
        "@type": "Step",
        "stepId": s.id,
        "partOfProcedure": { "@id": procSubj },
      };
      const stepEdgeKeys = new Set<string>();
      for (const b of s.branches) {
        let toUri: string;
        if (b.toKind === "end") toUri = `${ONTOLOGY}END`;
        else if (b.toKind === "step" && !b.toPage)
          toUri = `${procSubj}#${b.toStep}`;
        else if (b.toKind === "step" && b.toPage)
          toUri = `${PROC_URI}${b.toPage}#${b.toStep}`;
        else toUri = `${PROC_URI}${b.toPage}`;

        // Step-level edge
        const key = `${b.predicate}|${toUri}`;
        if (!stepEdgeKeys.has(key)) {
          stepEdgeKeys.add(key);
          (stepNode[b.predicate] = stepNode[b.predicate] || []).push({
            "@id": toUri,
          });
        }

        // Aggregated procedure-level edge for cross-page transitions
        if (b.toKind === "procedure" || (b.toKind === "step" && b.toPage)) {
          const procPred = b.predicate; // already procedure-shaped for cross-page
          const targetProc = b.toPage ? PROC_URI + b.toPage : "";
          if (targetProc) {
            const pkey = `${procPred}|${targetProc}`;
            if (!procEdgeKeys[procSubj].has(pkey)) {
              procEdgeKeys[procSubj].add(pkey);
              const procNode = graph.find((n) => n["@id"] === procSubj)!;
              (procNode[procPred] = procNode[procPred] || []).push({
                "@id": targetProc,
              });
            }
          }
        }
      }
      graph.push(stepNode);
    }
  }

  // Compose JSON-LD
  const jsonld = {
    "@context": {
      "@vocab": ONTOLOGY,
      "Procedure": ONTOLOGY + "Procedure",
      "Step": ONTOLOGY + "Step",
      "label": "http://www.w3.org/2000/01/rdf-schema#label",
      "procedureId": ONTOLOGY + "procedureId",
      "stepId": ONTOLOGY + "stepId",
      "partOfProcedure": { "@id": ONTOLOGY + "partOfProcedure", "@type": "@id" },
      "hasStep": { "@id": ONTOLOGY + "hasStep", "@type": "@id" },
      "belongsToCategory": { "@id": ONTOLOGY + "belongsToCategory", "@type": "@id" },
      "monitors": { "@id": ONTOLOGY + "monitors", "@type": "@id" },
      "monitorsCsf": { "@id": ONTOLOGY + "monitorsCsf", "@type": "@id" },
      "triggeredBy": { "@id": ONTOLOGY + "triggeredBy", "@type": "@id" },
      "continuesTo": { "@id": ONTOLOGY + "continuesTo", "@type": "@id" },
      "escalatesTo": { "@id": ONTOLOGY + "escalatesTo", "@type": "@id" },
      "delegatesTo": { "@id": ONTOLOGY + "delegatesTo", "@type": "@id" },
      "recoversVia": { "@id": ONTOLOGY + "recoversVia", "@type": "@id" },
      "fallbacksTo": { "@id": ONTOLOGY + "fallbacksTo", "@type": "@id" },
      "terminates": { "@id": ONTOLOGY + "terminates", "@type": "@id" },
      "branchesTo": { "@id": ONTOLOGY + "branchesTo", "@type": "@id" },
    },
    "@graph": graph,
  };

  // Smoke test: verify JSON-LD shape
  if (!Array.isArray(jsonld["@graph"]) || jsonld["@graph"].length === 0) {
    console.error("export-kg: empty graph — nothing to emit");
    process.exit(1);
  }
  for (const n of jsonld["@graph"]) {
    if (!n["@id"] || !n["@type"]) {
      console.error("export-kg: node missing @id or @type:", n);
      process.exit(1);
    }
  }

  await mkdir(join(REPO_ROOT, "_build"), { recursive: true });
  const pretty = process.argv.includes("--pretty");
  await writeFile(
    OUT_PATH,
    JSON.stringify(jsonld, null, pretty ? 2 : 0),
    "utf-8",
  );

  const procCount = procs.length;
  const stepCount = procs.reduce((n, p) => n + p.steps.length, 0);
  const edgeCount = procs.reduce(
    (n, p) => n + p.steps.reduce((m, s) => m + s.branches.length, 0),
    0,
  );
  console.log(
    `export-kg: ${procCount} procedures, ${stepCount} steps, ${edgeCount} edges → _build/kg.jsonld`,
  );
}

main();

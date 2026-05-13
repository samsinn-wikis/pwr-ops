#!/usr/bin/env bun
/**
 * Build wiki/_manifest.json from wiki/procedures/*.md.
 *
 * The manifest is the machine-readable counterpart to wiki/index.md —
 * canonical id list, frontmatter highlights, coverage badge, step count,
 * tag-definition count. Consumed by samsinn's wiki-fetcher.ts (talkingAgents
 * src/wikis/wiki-fetcher.ts → WikiManifest v1).
 *
 * Run automatically by .github/workflows/deploy.yml; safe to run locally.
 * Output is copied into the deployed site/ tree by the workflow.
 *
 * Manifest version 1. Keep additions backward-compatible; bump the version
 * field if you remove or rename a field.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

const REPO_ROOT = join(import.meta.dir, '..')
const PROCEDURES_DIR = join(REPO_ROOT, 'wiki', 'procedures')
const MANIFEST_PATH = join(REPO_ROOT, 'wiki', '_manifest.json')

interface ManifestEntry {
  id: string
  title: string
  file: string
  category?: string
  csfsMonitored?: string[]
  entryTriggers?: string[]
  coverage: 'developed' | 'partial' | 'stub'
  stepCount: number
  tagDefinitionCount: number
}

interface Manifest {
  version: 1
  wiki: string
  procmdVersion: string
  generatedAt: string
  procedures: ManifestEntry[]
}

const parseFrontmatter = (raw: string): Record<string, string> | null => {
  if (!raw.startsWith('---\n')) return null
  const end = raw.indexOf('\n---', 4)
  if (end < 0) return null
  const fm = raw.slice(4, end)
  const out: Record<string, string> = {}
  for (const line of fm.split('\n')) {
    const m = line.match(/^([a-zA-Z][a-zA-Z0-9_-]*):\s*(.*)$/)
    if (m) out[m[1]!] = m[2]!.trim()
  }
  return out
}

const parseList = (s: string | undefined): string[] => {
  if (!s) return []
  const t = s.trim()
  if (t.startsWith('[') && t.endsWith(']')) {
    return t.slice(1, -1).split(',').map(x => x.trim()).filter(Boolean)
  }
  return [t]
}

const countSteps = (body: string): number => {
  const m = body.match(/^##\s+Step\b/gm)
  return m ? m.length : 0
}

const countTagDefs = (body: string): number => {
  // Match "- id: TAG-NAME" lines inside (or after) a `## Tags` heading.
  const tagsIdx = body.search(/^##\s+Tags\b/m)
  if (tagsIdx < 0) return 0
  const tagsBlock = body.slice(tagsIdx)
  const m = tagsBlock.match(/^-\s+id:\s+[A-Z]/gm)
  return m ? m.length : 0
}

const classifyCoverage = (body: string, stepCount: number, tagDefs: number): 'developed' | 'partial' | 'stub' => {
  const lineCount = body.split('\n').length
  // Heuristic — calibrated against the current corpus:
  //   developed: ≥10 steps with tag appendix + ≥100 lines of body
  //   partial:   ≥5 steps OR ≥50 lines
  //   stub:      otherwise (typical Phase-1 stubs are 3–4 steps, ~30 lines)
  if (stepCount >= 10 && tagDefs >= 5 && lineCount >= 100) return 'developed'
  if (stepCount >= 5 || lineCount >= 50) return 'partial'
  return 'stub'
}

const buildManifest = (): Manifest => {
  const files = readdirSync(PROCEDURES_DIR).filter(f => f.endsWith('.md')).sort()
  const procedures: ManifestEntry[] = []

  for (const f of files) {
    const path = join(PROCEDURES_DIR, f)
    const raw = readFileSync(path, 'utf-8')
    const fm = parseFrontmatter(raw)
    if (!fm) {
      console.warn(`skip ${f}: no frontmatter`)
      continue
    }
    const id = fm['procedure-id']
    const title = fm['title']
    if (!id || !title) {
      console.warn(`skip ${f}: missing procedure-id or title`)
      continue
    }
    const body = raw.slice(raw.indexOf('\n---', 4) + 4)
    const stepCount = countSteps(body)
    const tagDefinitionCount = countTagDefs(body)
    const entry: ManifestEntry = {
      id,
      title,
      file: `wiki/procedures/${f}`,
      stepCount,
      tagDefinitionCount,
      coverage: classifyCoverage(body, stepCount, tagDefinitionCount),
    }
    if (fm['category']) entry.category = fm['category']
    const csfs = parseList(fm['csfs-monitored'])
    if (csfs.length > 0) entry.csfsMonitored = csfs
    const triggers = parseList(fm['entry-triggers'])
    if (triggers.length > 0) entry.entryTriggers = triggers
    procedures.push(entry)
  }

  // Read procmd version + wiki version from mkdocs.yml extras for traceability
  let procmdVersion = '0.6'
  try {
    const mk = readFileSync(join(REPO_ROOT, 'mkdocs.yml'), 'utf-8')
    const m = mk.match(/procmd_version:\s*"?([\d.]+)"?/)
    if (m) procmdVersion = m[1]!
  } catch { /* keep default */ }

  return {
    version: 1,
    wiki: 'pwr-eops',
    procmdVersion,
    generatedAt: new Date().toISOString(),
    procedures,
  }
}

const main = (): void => {
  const manifest = buildManifest()
  mkdirSync(dirname(MANIFEST_PATH), { recursive: true })
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf-8')
  const counts = { developed: 0, partial: 0, stub: 0 }
  for (const p of manifest.procedures) counts[p.coverage] += 1
  console.log(`wrote ${MANIFEST_PATH}`)
  console.log(`  ${manifest.procedures.length} procedures — developed: ${counts.developed} · partial: ${counts.partial} · stub: ${counts.stub}`)
}

if (import.meta.main) main()

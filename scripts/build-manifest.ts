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
import { parseProcedure } from '../procmd-core/index.ts'

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
  procedures: ManifestEntry[]
}

const classifyCoverage = (bodyLines: number, stepCount: number, tagDefs: number): 'developed' | 'partial' | 'stub' => {
  // Heuristic — calibrated against the current corpus:
  //   developed: ≥10 steps with tag appendix + ≥100 lines of body
  //   partial:   ≥5 steps OR ≥50 lines
  //   stub:      otherwise (typical Phase-1 stubs are 3–4 steps, ~30 lines)
  if (stepCount >= 10 && tagDefs >= 5 && bodyLines >= 100) return 'developed'
  if (stepCount >= 5 || bodyLines >= 50) return 'partial'
  return 'stub'
}

const buildManifest = (): Manifest => {
  const files = readdirSync(PROCEDURES_DIR).filter(f => f.endsWith('.md')).sort()
  const procedures: ManifestEntry[] = []

  for (const f of files) {
    const path = join(PROCEDURES_DIR, f)
    const raw = readFileSync(path, 'utf-8')
    const parsed = parseProcedure(raw)
    if ('error' in parsed) {
      console.warn(`skip ${f}: ${parsed.error}`)
      continue
    }
    const bodyLines = raw.slice(raw.indexOf('\n---', 4) + 4).split('\n').length
    const stepCount = parsed.steps.length
    const tagDefinitionCount = parsed.tagDefinitions.length
    const entry: ManifestEntry = {
      id: parsed.frontmatter.procedureId,
      title: parsed.frontmatter.title,
      file: `wiki/procedures/${f}`,
      stepCount,
      tagDefinitionCount,
      coverage: classifyCoverage(bodyLines, stepCount, tagDefinitionCount),
    }
    if (parsed.frontmatter.category) entry.category = parsed.frontmatter.category
    if (parsed.frontmatter.csfsMonitored.length > 0) entry.csfsMonitored = [...parsed.frontmatter.csfsMonitored]
    if (parsed.frontmatter.entryTriggers.length > 0) entry.entryTriggers = [...parsed.frontmatter.entryTriggers]
    procedures.push(entry)
  }

  // Read procmd version + wiki version from mkdocs.yml extras for traceability
  let procmdVersion = '0.7'
  try {
    const mk = readFileSync(join(REPO_ROOT, 'mkdocs.yml'), 'utf-8')
    const m = mk.match(/procmd_version:\s*"?([\d.]+)"?/)
    if (m) procmdVersion = m[1]!
  } catch { /* keep default */ }

  return {
    version: 1,
    wiki: 'pwr-ops',
    procmdVersion,
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

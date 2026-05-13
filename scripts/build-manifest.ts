#!/usr/bin/env bun
/**
 * Build wiki/_manifest.json — machine-readable index of every page in the
 * wiki, partitioned by page type. Consumed by samsinn's wiki-fetcher.ts
 * (talkingAgents src/wikis/wiki-fetcher.ts → WikiManifest v1).
 *
 * Manifest still declares version: 1 because the additions in Phase D are
 * backward-compatible: existing `procedures` array stays unchanged; a new
 * `pages` array carries non-procedure page types (system-description,
 * tag-catalogue, setpoint-catalogue, tech-spec, lineup).
 *
 * Run automatically by .github/workflows/deploy.yml; safe to run locally.
 * Output is copied into the deployed site/ tree by the workflow.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { parseProcedure } from '../procmd-core/index.ts'

const REPO_ROOT = join(import.meta.dir, '..')
const WIKI_DIR = join(REPO_ROOT, 'wiki')
const PROCEDURES_DIR = join(WIKI_DIR, 'procedures')
const MANIFEST_PATH = join(WIKI_DIR, '_manifest.json')

/** Sibling-dir scan targets (Phase D page types). Order is documentation-only. */
const PAGE_DIRS: Array<{ dir: string; type: ManifestPageType }> = [
  { dir: 'systems',   type: 'system-description' },
  { dir: 'tags',      type: 'tag-catalogue' },
  { dir: 'setpoints', type: 'setpoint-catalogue' },
  { dir: 'tech-specs', type: 'tech-spec' },
  { dir: 'lineups',   type: 'lineup' },
]

type ManifestPageType =
  | 'system-description'
  | 'tag-catalogue'
  | 'setpoint-catalogue'
  | 'tech-spec'
  | 'lineup'

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

interface ManifestPageEntry {
  id: string
  type: ManifestPageType
  title: string
  file: string
  appliesTo?: string
  referencePlant?: string
  csfsRelated?: string[]
}

interface Manifest {
  version: 1
  wiki: string
  procmdVersion: string
  procedures: ManifestEntry[]
  /** Non-procedure pages (Phase D system descriptions, catalogues, etc.). */
  pages: ManifestPageEntry[]
}

import type { ParsedProcedure } from '../procmd-core/index.ts'

/**
 * Content-based coverage classifier. Looks at what's actually in each step
 * (not just step count), since FR-x / ECA family procedures are inherently
 * short (3-5 steps) yet operationally complete. A "rich step" has more than
 * a one-line Check: — it carries multiple keyword lines OR carries branch
 * rationale (Because:/Against:). A procedure is `developed` when most of
 * its steps are rich AND its tag appendix is meaningfully populated with
 * source citations.
 */
const classifyByContent = (parsed: ParsedProcedure): 'developed' | 'partial' | 'stub' => {
  if (parsed.steps.length === 0) return 'stub'

  let richSteps = 0
  for (const step of parsed.steps) {
    const keywordLines =
      step.checks.length +
      step.actions.length +
      step.cautions.length +
      step.notes.length +
      step.withins.length
    const branchRationale = step.branches.filter(b => b.because || b.against).length
    const hasDecision = step.decision ? 1 : 0
    // A step is "rich" when it has multiple keyword lines OR carries branch
    // rationale OR uses the v0.7 Decision: keyword — i.e., it's more than a
    // bare Check:/branch stub.
    if (keywordLines >= 2 || branchRationale >= 1 || hasDecision === 1) richSteps += 1
  }
  const richFraction = richSteps / parsed.steps.length

  const tagCount = parsed.tagDefinitions.length
  const tagsWithSource = parsed.tagDefinitions.filter(t => t.extra['source']).length

  // Developed: the vast majority of steps carry substantive content AND the
  // appendix has cited tag definitions backing the inline references.
  if (richFraction >= 0.75 && tagsWithSource >= 3) return 'developed'
  // Partial: some content present (rich steps or a populated appendix) but
  // below developed threshold.
  if (richFraction >= 0.30 || tagCount >= 3) return 'partial'
  // Stub: schema-pass content only.
  return 'stub'
}

/**
 * Minimal frontmatter parser for non-procedure page types. Only reads the
 * fields the manifest cares about; ignores everything else. No-frontmatter
 * files are returned as null (and skipped).
 */
const parsePageFrontmatter = (raw: string): Record<string, string> | null => {
  if (!raw.startsWith('---\n') && !raw.startsWith('---\r\n')) return null
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

/** Parse a YAML-style list "[a, b, c]" or single value into a string array. */
const parseListField = (s: string | undefined): string[] => {
  if (!s) return []
  const t = s.trim()
  if (t.startsWith('[') && t.endsWith(']')) {
    return t.slice(1, -1).split(',').map(x => x.trim()).filter(Boolean)
  }
  return [t].filter(Boolean)
}

const scanPagesDir = (dirName: string, expectedType: ManifestPageType): ManifestPageEntry[] => {
  const path = join(WIKI_DIR, dirName)
  if (!existsSync(path)) return []
  const files = readdirSync(path).filter(f => f.endsWith('.md')).sort()
  const out: ManifestPageEntry[] = []
  for (const f of files) {
    const raw = readFileSync(join(path, f), 'utf-8')
    const fm = parsePageFrontmatter(raw)
    if (!fm) {
      console.warn(`skip ${dirName}/${f}: no frontmatter`)
      continue
    }
    if (fm['type'] !== expectedType) {
      console.warn(`skip ${dirName}/${f}: type "${fm['type']}" does not match expected "${expectedType}"`)
      continue
    }
    // Find the id field — system-id / catalogue-id / tech-spec-id / lineup-id
    const idKey = ['system-id', 'catalogue-id', 'tech-spec-id', 'lineup-id', 'profile-id']
      .find(k => fm[k])
    const id = idKey ? fm[idKey]! : f.replace(/\.md$/, '')
    const title = fm['title'] || id
    const entry: ManifestPageEntry = {
      id,
      type: expectedType,
      title,
      file: `wiki/${dirName}/${f}`,
    }
    if (fm['applies-to']) entry.appliesTo = fm['applies-to']
    if (fm['reference-plant']) entry.referencePlant = fm['reference-plant']
    const csfsRelated = parseListField(fm['csfs-related'])
    if (csfsRelated.length > 0) entry.csfsRelated = csfsRelated
    out.push(entry)
  }
  return out
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
    const stepCount = parsed.steps.length
    const tagDefinitionCount = parsed.tagDefinitions.length
    const entry: ManifestEntry = {
      id: parsed.frontmatter.procedureId,
      title: parsed.frontmatter.title,
      file: `wiki/procedures/${f}`,
      stepCount,
      tagDefinitionCount,
      coverage: classifyByContent(parsed),
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

  // Phase D — sibling-dir scan for non-procedure page types.
  const pages: ManifestPageEntry[] = []
  for (const { dir, type } of PAGE_DIRS) {
    pages.push(...scanPagesDir(dir, type))
  }

  return {
    version: 1,
    wiki: 'pwr-ops',
    procmdVersion,
    procedures,
    pages,
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
  if (manifest.pages.length > 0) {
    const byType: Record<string, number> = {}
    for (const p of manifest.pages) byType[p.type] = (byType[p.type] || 0) + 1
    const summary = Object.entries(byType).map(([t, n]) => `${n} ${t}`).join(' · ')
    console.log(`  ${manifest.pages.length} pages — ${summary}`)
  }
}

if (import.meta.main) main()

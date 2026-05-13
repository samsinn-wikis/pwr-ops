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

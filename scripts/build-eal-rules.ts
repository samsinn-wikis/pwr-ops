#!/usr/bin/env bun
/**
 * Build wiki/_eal-rules.json from wiki/eal/classification-rules.md.
 *
 * Parses the four `## <class>` markdown tables (UE / Alert / SAE / GE),
 * each row `| ic | predicate | source |`, into a deterministic JSON file
 * keyed by class. The samsinn `eal_classify` tool fetches this file and
 * evaluates predicates against scenario time-series.
 *
 * Wiki-authored rules, code-executed dispatch (per PLAN §24.4 / OD-9).
 *
 * Run as a deploy-workflow step before build-manifest. Safe to run locally.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const REPO_ROOT = join(import.meta.dir, '..')
const SOURCE = join(REPO_ROOT, 'wiki/eal/classification-rules.md')
const OUTPUT = join(REPO_ROOT, 'wiki/_eal-rules.json')

type EalClass = 'UE' | 'Alert' | 'SAE' | 'GE'
const CLASS_BY_HEADING: Record<string, EalClass> = {
  'Unusual Event': 'UE',
  'Alert': 'Alert',
  'Site Area Emergency': 'SAE',
  'General Emergency': 'GE',
}

interface EalRule { ic: string; predicate: string; class: EalClass; source: string }

const stripPipeRow = (line: string): string[] | null => {
  if (!line.startsWith('|')) return null
  const cells = line.split('|').slice(1, -1).map(c => c.trim())
  return cells
}

const parse = (): { rules: EalRule[]; warnings: string[] } => {
  const src = readFileSync(SOURCE, 'utf8')
  const rules: EalRule[] = []
  const warnings: string[] = []
  const lines = src.split('\n')
  let currentClass: EalClass | null = null
  let inTable = false
  for (const line of lines) {
    const heading = line.match(/^##\s+(.+?)\s*$/)
    if (heading) {
      const h = heading[1]!.trim()
      currentClass = CLASS_BY_HEADING[h] ?? null
      inTable = false
      continue
    }
    if (!currentClass) continue
    if (/^\|[\s|:\-]+\|$/.test(line)) { inTable = true; continue }
    if (!line.startsWith('|')) { inTable = false; continue }
    if (!inTable) continue
    const cells = stripPipeRow(line)
    if (!cells || cells.length < 3) continue
    // Skip the header row if it slipped through (`ic | predicate | source`)
    if (cells[0]?.toLowerCase() === 'ic') continue
    const ic = cells[0]!
    const predicate = (cells[1] ?? '').replace(/^`|`$/g, '').replace(/\\\|/g, '|')
    const source = cells[2] ?? ''
    if (!ic) { warnings.push(`${currentClass}: empty IC code in row '${line}'`); continue }
    if (!predicate) { warnings.push(`${currentClass} ${ic}: empty predicate`); continue }
    rules.push({ ic, predicate, class: currentClass, source })
  }

  // Uniqueness check per class
  const perClass = new Map<EalClass, Set<string>>()
  for (const r of rules) {
    const set = perClass.get(r.class) ?? new Set()
    if (set.has(r.ic)) warnings.push(`${r.class}: duplicate IC code '${r.ic}'`)
    set.add(r.ic)
    perClass.set(r.class, set)
  }
  return { rules, warnings }
}

const main = (): void => {
  const { rules, warnings } = parse()
  for (const w of warnings) console.warn(`build-eal-rules: ${w}`)
  const out = { version: 1, wiki: 'pwr-ops', rules }
  writeFileSync(OUTPUT, JSON.stringify(out, null, 2) + '\n', 'utf8')
  const byClass: Record<string, number> = {}
  for (const r of rules) byClass[r.class] = (byClass[r.class] ?? 0) + 1
  const manualCount = rules.filter(r => r.ic === 'manual' || r.predicate === 'manual').length
  console.log(
    `build-eal-rules: ${rules.length} rules → wiki/_eal-rules.json (` +
    Object.entries(byClass).map(([c, n]) => `${c}: ${n}`).join(' · ') +
    `)`,
  )
  if (manualCount > 15) {
    console.warn(`build-eal-rules: ${manualCount} 'manual' placeholder rules — expand predicate grammar`)
    process.exitCode = 0  // warn, don't fail; H.1 budget threshold
  }
}

main()

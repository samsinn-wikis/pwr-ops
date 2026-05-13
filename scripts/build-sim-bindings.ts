#!/usr/bin/env bun
/**
 * Build wiki/simulator-bindings/samsinn.md from the canonical tag
 * catalogue (Phase F.4). The catalogue's sim-path column is the source
 * of truth — every procedure-bound tag already declares its plant-model
 * path in its appendix, and the catalogue aggregates those. The samsinn
 * simulator binding page exposes that mapping as a samsinn-native
 * reference page agents can fetch via wiki_lookup.
 *
 * If/when a non-samsinn binding (e.g. BNL Generic PWR Simulator) is
 * added, copy this script as `build-sim-bindings-bnl.ts` and adjust the
 * frontmatter + any sim-namespace differences.
 *
 * Run as a deploy-workflow step after build-catalogues (which produces
 * the canonical tag list).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { parseProcedure } from '../procmd-core/index.ts'
import type { TagDefinition } from '../procmd-core/types.ts'
import { readdirSync } from 'node:fs'

const REPO_ROOT = join(import.meta.dir, '..')
const PROC_DIR = join(REPO_ROOT, 'wiki/procedures')
const OUT = join(REPO_ROOT, 'wiki/simulator-bindings/samsinn.md')

interface TagRow {
  id: string
  description: string
  units: string
  equipment: string
  simPath: string
}

const main = (): void => {
  const tagMap = new Map<string, TagRow>()
  // Walk procedures, collect tag definitions with richest metadata wins.
  for (const f of readdirSync(PROC_DIR).filter(n => n.endsWith('.md'))) {
    const src = readFileSync(join(PROC_DIR, f), 'utf8')
    const r = parseProcedure(src)
    if ('error' in r) continue
    for (const t of r.tagDefinitions as ReadonlyArray<TagDefinition>) {
      const existing = tagMap.get(t.id)
      const candidate: TagRow = {
        id: t.id,
        description: t.description ?? '',
        units: t.units ?? '',
        equipment: t.equipment ?? '',
        simPath: t.simPath ?? '',
      }
      if (!existing) { tagMap.set(t.id, candidate); continue }
      // Prefer the row with a non-empty sim-path; tie-break on description length
      const existingRich = (existing.simPath ? 1 : 0) + (existing.description.length ? 1 : 0)
      const candidateRich = (candidate.simPath ? 1 : 0) + (candidate.description.length ? 1 : 0)
      if (candidateRich > existingRich) tagMap.set(t.id, candidate)
    }
  }
  const rows = [...tagMap.values()].sort((a, b) => a.id.localeCompare(b.id))
  const bound = rows.filter(r => r.simPath)
  const unbound = rows.filter(r => !r.simPath)

  const lines: string[] = []
  lines.push('---')
  lines.push('type: simulator-binding')
  lines.push('simulator-id: samsinn')
  lines.push('title: samsinn PWR simulator — tag binding')
  lines.push('applies-to: Westinghouse-style 4-loop PWR')
  lines.push('reference-plant: vogtle')
  lines.push('---')
  lines.push('')
  lines.push('# samsinn PWR simulator — tag binding')
  lines.push('')
  lines.push(`Maps each canonical procedure tag to a samsinn-internal simulator variable path.`)
  lines.push(`Built from the canonical tag catalogue. ${bound.length} of ${rows.length} tags bound.`)
  lines.push('')
  lines.push('## Bindings')
  lines.push('')
  lines.push('| Tag | sim-path | Units | Equipment | Description |')
  lines.push('|---|---|---|---|---|')
  for (const r of bound) {
    const desc = r.description.replace(/\|/g, '\\|')
    lines.push(`| «${r.id}» | \`${r.simPath}\` | ${r.units} | ${r.equipment} | ${desc} |`)
  }
  if (unbound.length > 0) {
    lines.push('')
    lines.push('## Unbound')
    lines.push('')
    lines.push(`Tags in the canonical catalogue without a sim-path declaration. ${unbound.length} entries — author or remove.`)
    lines.push('')
    for (const r of unbound) lines.push(`- «${r.id}» — ${r.description}`)
  }
  lines.push('')
  lines.push('## Notes')
  lines.push('')
  lines.push('- This page is **generated**. Edit by changing the sim-path declaration in the relevant procedure\'s tag appendix and rebuilding via `bun scripts/build-sim-bindings.ts`.')
  lines.push('- Tags appearing in scenarios but not yet in any procedure are out of scope (see OD-18 in PLAN §25).')
  lines.push('- Future bindings for other simulators (BNL Generic PWR, IAEA basic PWR) live in sibling pages `bnl.md`, `iaea.md` etc.')
  lines.push('')

  if (!existsSync(dirname(OUT))) mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, lines.join('\n'), 'utf8')
  const coverage = bound.length / Math.max(1, rows.length)
  console.log(`build-sim-bindings: ${bound.length}/${rows.length} tags bound (${(coverage * 100).toFixed(1)}%) → wiki/simulator-bindings/samsinn.md`)
}

main()

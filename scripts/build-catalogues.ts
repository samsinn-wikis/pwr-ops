#!/usr/bin/env bun
/**
 * Build wiki/tags/index.md and wiki/setpoints/index.md — single canonical
 * catalogue pages derived from procedure tag definitions and system-page
 * setpoint tables. Phase D.3.
 *
 * Tag catalogue: dedupes tag IDs across all procedures, keeps the richest
 * definition seen (most metadata fields populated), records every procedure
 * that references the tag.
 *
 * Setpoint catalogue: parses the `## Setpoints` tables from system pages
 * and aggregates rows into one sortable table keyed by system.
 *
 * Run automatically by .github/workflows/deploy.yml after build-manifest.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { parseProcedure } from '../procmd-core/index.ts'
import type { TagDefinition } from '../procmd-core/types.ts'

const REPO_ROOT = join(import.meta.dir, '..')
const WIKI_DIR = join(REPO_ROOT, 'wiki')
const PROC_DIR = join(WIKI_DIR, 'procedures')
const SYS_DIR = join(WIKI_DIR, 'systems')
const TAGS_DIR = join(WIKI_DIR, 'tags')
const SP_DIR = join(WIKI_DIR, 'setpoints')

interface TagEntry {
  def: TagDefinition
  sources: string[]
}

const richness = (t: TagDefinition): number => {
  let r = 0
  if (t.description) r++
  if (t.simPath) r++
  if (t.units) r++
  if (t.equipment) r++
  r += Object.keys(t.extra).length
  return r
}

const buildTagCatalogue = (): { md: string; count: number } => {
  const all: Record<string, TagEntry> = {}
  for (const f of readdirSync(PROC_DIR).filter(n => n.endsWith('.md'))) {
    const src = readFileSync(join(PROC_DIR, f), 'utf8')
    const r = parseProcedure(src) as ReturnType<typeof parseProcedure> & { tagDefinitions?: ReadonlyArray<TagDefinition> }
    if ('error' in r) continue
    for (const t of r.tagDefinitions) {
      const existing = all[t.id]
      if (!existing) {
        all[t.id] = { def: t, sources: [f.replace('.md', '')] }
      } else {
        existing.sources.push(f.replace('.md', ''))
        if (richness(t) > richness(existing.def)) existing.def = t
      }
    }
  }
  const ids = Object.keys(all).sort()
  const lines: string[] = []
  lines.push('---')
  lines.push('type: tag-catalogue')
  lines.push('title: Tag Catalogue (canonical)')
  lines.push('applies-to: Westinghouse-style 4-loop PWR')
  lines.push('reference-plant: vogtle')
  lines.push('---')
  lines.push('')
  lines.push('# Tag Catalogue')
  lines.push('')
  lines.push(`Generated from procedure tag definitions across the wiki. ${ids.length} unique tag IDs.`)
  lines.push('Each tag is shown with its richest definition (most metadata fields populated)')
  lines.push('and every procedure that references it.')
  lines.push('')
  lines.push('| Tag | Description | Sim path | Units | Equipment | Source | Referenced by |')
  lines.push('|---|---|---|---|---|---|---|')
  for (const id of ids) {
    const e = all[id]
    const d = e.def
    const refs = [...new Set(e.sources)].sort().map(s => `[${s}](../procedures/${s}.md)`).join(', ')
    const source = d.extra['source'] ?? ''
    const cells = [
      `«${d.id}»`,
      (d.description ?? '').replace(/\|/g, '\\|'),
      d.simPath ?? '',
      d.units ?? '',
      d.equipment ?? '',
      source.replace(/\|/g, '\\|'),
      refs,
    ]
    lines.push('| ' + cells.join(' | ') + ' |')
  }
  lines.push('')
  return { md: lines.join('\n'), count: ids.length }
}

const buildSetpointCatalogue = (): { md: string; count: number } => {
  const rows: Array<{ system: string; parameter: string; value: string; source: string }> = []
  if (!existsSync(SYS_DIR)) return { md: '', count: 0 }
  for (const f of readdirSync(SYS_DIR).filter(n => n.endsWith('.md'))) {
    const sysId = f.replace('.md', '')
    const src = readFileSync(join(SYS_DIR, f), 'utf8')
    const sp = src.split(/^## Setpoints\s*$/m)[1]
    if (!sp) continue
    const block = sp.split(/^## /m)[0]
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    let inTable = false
    for (const ln of lines) {
      if (!ln.startsWith('|')) { inTable = false; continue }
      if (/^\|[\s|:\-]+\|$/.test(ln)) { inTable = true; continue }
      if (!inTable) continue
      const cells = ln.split('|').slice(1, -1).map(c => c.trim())
      if (cells.length < 3) continue
      rows.push({ system: sysId, parameter: cells[0], value: cells[1], source: cells[2] })
    }
  }
  const lines: string[] = []
  lines.push('---')
  lines.push('type: setpoint-catalogue')
  lines.push('title: Setpoint Catalogue (canonical)')
  lines.push('applies-to: Westinghouse-style 4-loop PWR')
  lines.push('reference-plant: vogtle')
  lines.push('---')
  lines.push('')
  lines.push('# Setpoint Catalogue')
  lines.push('')
  lines.push(`Generated from the \`## Setpoints\` tables in every system-description page. ${rows.length} entries.`)
  lines.push('All values are reference-plant (Vogtle) numbers cited per UFSAR / Tech Spec. See the linked system page for context.')
  lines.push('')
  lines.push('| System | Parameter | Value | Source |')
  lines.push('|---|---|---|---|')
  rows.sort((a, b) => a.system.localeCompare(b.system) || a.parameter.localeCompare(b.parameter))
  for (const r of rows) {
    lines.push(`| [${r.system}](../systems/${r.system}.md) | ${r.parameter} | ${r.value} | ${r.source} |`)
  }
  lines.push('')
  return { md: lines.join('\n'), count: rows.length }
}

const main = (): void => {
  const tags = buildTagCatalogue()
  if (!existsSync(TAGS_DIR)) mkdirSync(TAGS_DIR, { recursive: true })
  writeFileSync(join(TAGS_DIR, 'index.md'), tags.md, 'utf8')

  const sp = buildSetpointCatalogue()
  if (!existsSync(SP_DIR)) mkdirSync(SP_DIR, { recursive: true })
  writeFileSync(join(SP_DIR, 'index.md'), sp.md, 'utf8')

  console.log(`tag catalogue: ${tags.count} tags → wiki/tags/index.md`)
  console.log(`setpoint catalogue: ${sp.count} entries → wiki/setpoints/index.md`)
}

main()

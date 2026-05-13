#!/usr/bin/env bun
/**
 * Build wiki/_search-index.json — symptom-driven procedure search index.
 *
 * For every procedure in wiki/procedures/, extracts:
 *   - frontmatter `entry-triggers` and `csfs-monitored`
 *   - keyword tokens from every step's Check: / Action: / Caution: line
 *     (lowercased, stopword-filtered, deduped per procedure)
 *   - every «TAG» referenced anywhere in the body
 *
 * Joins them into one flat text blob per procedure plus a word-count
 * length field, so samsinn's BM25 tool can score queries without re-
 * fetching the source procedure files.
 *
 * Run as a deploy-workflow step before build-manifest.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseProcedure } from '../procmd-core/index.ts'

const REPO_ROOT = join(import.meta.dir, '..')
const PROC_DIR = join(REPO_ROOT, 'wiki/procedures')
const OUT = join(REPO_ROOT, 'wiki/_search-index.json')

// Standard English stopwords + procmd-noise. Domain words (subcooling,
// pressurizer, etc.) are intentionally KEPT — they're the value signal.
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'by',
  'do', 'does', 'either', 'for', 'from', 'has', 'have', 'if', 'in',
  'into', 'is', 'it', 'its', 'no', 'not', 'of', 'on', 'or', 'other',
  'per', 'so', 'than', 'that', 'the', 'their', 'them', 'then', 'this',
  'to', 'was', 'were', 'will', 'with', 'within', 'when', 'while',
  // procmd-noise: keywords that appear in every Check/Action line
  'check', 'action', 'caution', 'note', 'verify', 'step', 'because',
  'against', 'until', 'abort',
])

const tokenize = (text: string): string[] => {
  // Strip tag delimiters but keep the tag id as a single token; lowercase
  // everything; split on non-alphanumeric; drop stopwords + length-1.
  const flat = text.replace(/«([A-Z][A-Z0-9-]*)»/g, ' tag-$1 ').toLowerCase()
  const words = flat.split(/[^a-z0-9-]+/).filter(Boolean)
  return words.filter(w => w.length > 1 && !STOPWORDS.has(w))
}

interface SearchDoc {
  procedureId: string
  title: string
  text: string
  length: number
}

const main = (): void => {
  const docs: SearchDoc[] = []
  for (const f of readdirSync(PROC_DIR).filter(n => n.endsWith('.md'))) {
    const src = readFileSync(join(PROC_DIR, f), 'utf8')
    const r = parseProcedure(src)
    if ('error' in r) continue
    const fm = r.frontmatter
    const triggers = fm.entryTriggers ?? []
    const csfs = fm.csfsMonitored ?? []
    const stepWords: string[] = []
    for (const step of r.steps) {
      for (const ln of [...step.checks, ...step.actions, ...step.cautions, ...step.notes]) {
        stepWords.push(...tokenize(ln))
      }
      for (const t of step.tagsReferenced) stepWords.push(`tag-${t.toLowerCase()}`)
    }
    const blob = [
      ...triggers,
      ...csfs,
      ...stepWords,
    ].join(' ')
    docs.push({
      procedureId: r.frontmatter.procedureId,
      title: r.frontmatter.title,
      text: blob,
      length: blob.split(/\s+/).filter(Boolean).length,
    })
  }
  const avgLength = docs.reduce((s, d) => s + d.length, 0) / Math.max(1, docs.length)
  const out = { version: 1, wiki: 'pwr-ops', docs, avgLength }
  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8')
  console.log(`build-search-index: ${docs.length} procedures → wiki/_search-index.json (avg length ${avgLength.toFixed(1)} tokens)`)
}

main()

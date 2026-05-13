#!/usr/bin/env bun
/**
 * check-procmd-core — runs the vendored procmd-core parser against every
 * wiki/procedures/*.md and wiki/profiles/*.md. Two purposes:
 *
 *   1. Confirms procmd-core can parse the corpus (consumed agent-side).
 *   2. Doubles as a drift check vs. the wiki's own validate.ts. If the
 *      wiki author makes a procmd change that one parser accepts and the
 *      other rejects, CI fails here.
 *
 * Exits non-zero on any parse error or unexpected warning.
 *
 * The full structural validator (cross-page refs, tag consistency, profile
 * vocab, orphan steps, etc) still lives in validate.ts. Migrating
 * validate.ts to use procmd-core internally is a separate workstream.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseProcedure, PARSER_PROCMD_VERSION } from '../procmd-core/index.ts'

const REPO_ROOT = new URL('..', import.meta.url).pathname
const PROCEDURES_DIR = join(REPO_ROOT, 'wiki', 'procedures')
const PROFILES_DIR = join(REPO_ROOT, 'wiki', 'profiles')

let errors = 0
let warnings = 0
let parsed = 0

const checkDir = (dir: string, label: string): void => {
  let files: string[]
  try {
    files = readdirSync(dir).filter(f => f.endsWith('.md')).sort()
  } catch {
    console.warn(`${label}: directory missing (${dir})`)
    return
  }
  for (const f of files) {
    const path = join(dir, f)
    const raw = readFileSync(path, 'utf-8')
    // Profiles aren't procedures — skip the strict parser for those; we just
    // confirm they have frontmatter.
    if (label === 'profiles') {
      if (!raw.startsWith('---')) {
        console.error(`❌ ${f}: profile has no frontmatter`)
        errors += 1
      }
      parsed += 1
      continue
    }
    const result = parseProcedure(raw)
    if ('error' in result) {
      console.error(`❌ ${f}: ${result.error}`)
      errors += 1
      continue
    }
    parsed += 1
    if (result.warnings.length > 0) {
      for (const w of result.warnings) {
        console.warn(`⚠️  ${f}: ${w}`)
        warnings += 1
      }
    }
  }
}

console.log(`procmd-core v${PARSER_PROCMD_VERSION} corpus check`)
console.log(`-----------------------------------------------`)
checkDir(PROCEDURES_DIR, 'procedures')
checkDir(PROFILES_DIR, 'profiles')

console.log(`-----------------------------------------------`)
if (errors > 0) {
  console.error(`❌ ${errors} parse error(s), ${warnings} warning(s) across ${parsed} file(s)`)
  process.exit(1)
}
console.log(`✅ ${parsed} file(s) parsed clean (${warnings} warning(s)).`)

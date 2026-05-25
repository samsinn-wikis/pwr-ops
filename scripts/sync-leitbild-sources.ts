#!/usr/bin/env bun
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const repoRoot = process.cwd()
const leitbildRepo = process.env.LEITBILD_REPO ?? '/Users/Michael.Hildebrandt@ife.no/Documents/Code/leitbild'
const wikiDir = join(repoRoot, 'wiki')

const selectedDocs = [
  'docs/process-plant-simulation-v1.md',
  'docs/packs.md',
  'docs/object-context-scenarios-missions.md',
  'docs/map-capability-manifest.md',
]

const selectedAssetPrefixes = [
  'process-plant-',
]

const titleFromFilename = (filename: string): string =>
  filename
    .replace(/\.md$/, '')
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())

const rewriteMirroredDocLinks = (content: string): string =>
  content
    .replaceAll('](./adr/', '](../adrs/')
    .replaceAll('](./assets/', '](./assets/')

const mirroredPage = (sourcePath: string, content: string, type: string): string => `---
title: ${titleFromFilename(sourcePath.split('/').at(-1) ?? sourcePath)}
type: ${type}
---

> This page is mirrored from \`${sourcePath}\` in the Leitbild application repository.
> Do not edit it here. Update the source file and run \`bun scripts/sync-leitbild-sources.ts\`.

${rewriteMirroredDocLinks(content).trim()}
`

const syncAdrs = async (): Promise<void> => {
  const sourceDir = join(leitbildRepo, 'docs/adr')
  const targetDir = join(wikiDir, 'leitbild-source/adrs')
  await mkdir(targetDir, { recursive: true })
  const files = (await readdir(sourceDir)).filter(file => file.endsWith('.md')).sort()
  for (const file of files) {
    const sourcePath = `docs/adr/${file}`
    const content = await readFile(join(sourceDir, file), 'utf8')
    await writeFile(join(targetDir, file), mirroredPage(sourcePath, content, 'leitbild-adr'), 'utf8')
  }
}

const syncDocs = async (): Promise<void> => {
  const targetDir = join(wikiDir, 'leitbild-source/docs')
  await mkdir(targetDir, { recursive: true })
  for (const sourcePath of selectedDocs) {
    const content = await readFile(join(leitbildRepo, sourcePath), 'utf8')
    const targetName = sourcePath.split('/').at(-1)
    if (!targetName) throw new Error(`Invalid source path: ${sourcePath}`)
    await writeFile(join(targetDir, targetName), mirroredPage(sourcePath, content, 'leitbild-source-doc'), 'utf8')
  }
}

const syncAssets = async (): Promise<void> => {
  const sourceDir = join(leitbildRepo, 'docs/assets')
  const targetDir = join(wikiDir, 'leitbild-source/docs/assets')
  await mkdir(targetDir, { recursive: true })
  const files = (await readdir(sourceDir))
    .filter(file => selectedAssetPrefixes.some(prefix => file.startsWith(prefix)))
    .sort()
  for (const file of files) {
    await copyFile(join(sourceDir, file), join(targetDir, file))
  }
}

await syncAdrs()
await syncDocs()
await syncAssets()
console.log(`Synced Leitbild ADRs and selected source docs from ${leitbildRepo}`)

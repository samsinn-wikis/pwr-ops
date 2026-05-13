---
title: Procedure Markdown (procmd) — the wiki's authoring format
---

# Procedure Markdown (procmd)

Every procedure page in this wiki is authored in **Procedure Markdown**
(procmd) — a markdown convention that stores procedural knowledge as a
single artifact that is simultaneously **human-readable**,
**LLM-authorable**, and **machine-traversable**.

A procmd document has YAML frontmatter, an H1 title, and one or more
`## Step` headings. Branches between steps use `→ #step-id` for
same-page jumps and `→ [[PROC-ID]]` for cross-procedure transitions.
The same markdown is what a human operator reads, what an LLM author
writes, and what a parser converts into the step graph a samsinn agent
walks one step at a time.

## Current version

This wiki is at **procmd v0.6** — declared in every page's frontmatter
(`procedure-md: 0.6`), in `mkdocs.yml`, and enforced by `validate.ts`.
No backward compatibility with v0.5; the parser rejects mismatched
versions with a warning.

## Normative spec

The canonical specification lives in the samsinn repository:

> [`docs/procedure-md.md`](https://github.com/michaelhil/samsinn/blob/master/docs/procedure-md.md) — procmd v0.6 normative spec

That document defines every keyword, every frontmatter field, branch
syntax, the `## Tags` appendix shape, branch rationale rules
(`Because:` / `Against:`), the version handshake, and the deferred /
out-of-scope items. **The spec is the contract; this wiki conforms to
it.**

## Reference implementations

| Implementation | Where | Role |
|---|---|---|
| Reference parser | [`samsinn/src/procmd-core/`](https://github.com/michaelhil/samsinn/tree/master/src/procmd-core) | Canonical parser + types |
| Structural validator | [`pwr-ops/validate.ts`](https://github.com/samsinn-wikis/pwr-ops/blob/main/validate.ts) | Corpus-wide checks (cross-page refs, tag consistency, orphan steps) |
| Drift sentinel | [`pwr-ops/scripts/check-procmd-core.ts`](https://github.com/samsinn-wikis/pwr-ops/blob/main/scripts/check-procmd-core.ts) | Runs procmd-core against the corpus; CI red on any drift between the two parsers |
| Manifest builder | [`pwr-ops/scripts/build-manifest.ts`](https://github.com/samsinn-wikis/pwr-ops/blob/main/scripts/build-manifest.ts) | Emits `_manifest.json` consumed by samsinn agents |
| Agent renderer | [`samsinn/src/packs/pwr-ops/procmd/renderer.ts`](https://github.com/michaelhil/samsinn/blob/master/src/packs/pwr-ops/procmd/renderer.ts) | procmd → agent markdown + mermaid flowchart |
| MkDocs renderer | [`pwr-ops/scripts/render-procmd.ts`](https://github.com/samsinn-wikis/pwr-ops/blob/main/scripts/render-procmd.ts) | procmd → MkDocs-flavored markdown for the human-readable site |

Two renderers, one parser. The parser is **vendored** from samsinn into
this repo under `procmd-core/`, pinned by SHA in
[`procmd-core.sha`](https://github.com/samsinn-wikis/pwr-ops/blob/main/procmd-core.sha)
and verified at deploy time.

## Spec-change protocol

procmd spec changes land in samsinn first:

1. Open a PR against `michaelhil/samsinn`, updating
   `docs/procedure-md.md` + `src/procmd-core/`.
2. Merge to `master`; record the commit SHA.
3. In this wiki, bump `procmd-core.sha` to the new SHA and re-vendor
   the files under `procmd-core/`.
4. Re-run `bun validate.ts` and `bun scripts/check-procmd-core.ts`
   locally; commit, push.

The two-PR pattern is intentional — the spec is the contract and lives
where the contract is enforced.

## Why a custom format

Plain prose is easy to write but agents can't traverse it. Pure JSON or
a domain-specific language is traversable but neither readable to
operators nor authorable by LLMs without ceremony. Procmd is the
compromise: markdown that a procedure-aware parser turns into a step
graph, while a markdown viewer renders it as a readable document. One
source of truth for three audiences (operator, author, agent).

For the full design rationale and decision history, see the normative
spec linked above.

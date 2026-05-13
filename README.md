# pwr-ops — Westinghouse-style PWR Operations Knowledge Base (LLM-reconstructed)

A wiki holding Westinghouse-style Pressurized Water Reactor operating
knowledge — emergency operating procedures, plant reference, conduct of
operations, human factors, and scenario libraries — authored in
[Procedure Markdown (procmd) v0.6](https://github.com/michaelhil/samsinn/blob/master/docs/procedure-md.md)
format and consumed both by human readers and by samsinn agents via the
`procedure_lookup` tool.

This repo is the **canonical knowledge base** for samsinn's PWR
simulation work. It is NOT an authoritative source of nuclear plant
operating procedures (see disclaimers below).

## ⚠️ Disclaimers — read first

> **This wiki contains LLM-reconstructed procedures, not licensed plant
> operating procedures. The content is based on Claude's general nuclear
> engineering knowledge from training data, NOT verbatim Westinghouse-style
> Owners Group documents.**
>
> The procedures here are approximations of the *logical structure* of
> Westinghouse-style Emergency Response Guidelines, intended to demonstrate the
> procmd format. They have not been reviewed by qualified nuclear
> operators, validated against current revision-level WOG documents, or
> sanctioned for use in plant operations.
>
> **Do not use this content for operator training, licensing, real-plant
> reference, or any safety-related purpose.** Treat it as a worked example
> of a markup format. For real plant procedures, consult your facility's
> licensed procedure set.
>
> Errors are expected. Branch destinations, step ordering, setpoint
> values, and recovery paths may differ from current Westinghouse-style ERG
> revisions. Inadvertent omissions and miscategorizations are likely.

## What this wiki is

- ~40 procedure pages (E / ECA / ES / FR-S / FR-C / FR-H / FR-P / FR-Z / FR-I families)
- Each procedure is one wiki page in procmd format with stable step IDs
  and `[[wikilink]]` cross-references between procedures
- One profile page (`nuclear-erg`) declaring domain synonyms (`RNO:`,
  `CSF:`)
- A single-file structural validator (`validate.ts`) that checks
  frontmatter, step IDs, branch syntax, cross-page link resolution, and
  reachability
- Standard MkDocs Material rendering (matches sibling wikis under
  samsinn-wikis)

## Local setup

```bash
# Validate the procedure corpus
bun validate.ts

# Render procmd → enriched markdown in _build/, then serve with live reload
pip install -r requirements.txt
bun scripts/render-procmd.ts --watch &   # rebuild on source change
mkdocs serve                              # serves _build/wiki/

# Export the corpus as a knowledge graph (JSON-LD)
bun scripts/export-kg.ts                  # → _build/kg.jsonld
```

### Knowledge graph

After deploy, the corpus is also published as JSON-LD at
`https://samsinn-wikis.github.io/pwr-ops/kg.jsonld`. Predicates
(`escalatesTo`, `delegatesTo`, `recoversVia`, `fallbacksTo`,
`continuesTo`, `monitorsCsf`, `triggeredBy`, `belongsToCategory`, …) are
defined in the `@context` against the placeholder ontology URI
`https://samsinn-wikis.github.io/pwr-ops/ontology/v1#`. Load into
Neo4j with `apoc.load.jsonld(...)` or into GraphDB via its JSON-LD
loader.

### Visibility controls

An eye icon in the page header opens a popover with toggles for
optional content categories:

| Category | Coverage | Default |
|---|---|---|
| Edge labels | `[Continue]` / `[Escalate]` / `[Delegate]` / `[Recover]` / `[Fallback]` / `[Monitor]` / `[Terminate]` prefix on branches | Hidden |
| Rationale | `Because:` / `Against:` lines under branches | Visible |
| Step IDs | Code-span suffix on step headings (e.g. `verify-reactor-trip`) | Visible |

Preferences persist per browser at `localStorage` key
`pwr-ops:visibility-prefs`. A "Reset defaults" button restores all
categories to spec defaults. CSF declarations, Cautions, and Notes are
always visible (operationally important; not togglable).

The mechanism is purely browser-side: the build-time transform wraps
toggleable elements in classed `<span>` tags; the JS bundle adds
override classes to `<html>` based on stored prefs; CSS handles the
display switching. Source files (`wiki/procedures/*.md`) are unchanged.

Source files (`wiki/procedures/*.md`) are canonical procmd. The build
pipeline transforms them to MkDocs-flavored markdown in `_build/wiki/`
(gitignored, regenerated on every change). MkDocs reads `_build/wiki/`.

The transform preserves source line structure as hard breaks, converts
`[id: x]` step attributes to `{#x}` HTML anchors, and rewrites bare
`→ #step` references to clickable anchor links. Wikilinks like
`[[E-3]]` and `[[E-3#step]]` are handled by the MkDocs `roamlinks`
plugin.

## Status (v0.1)

- [x] procmd v0.1 spec authored ([source](https://github.com/michaelhil/talkingAgents/blob/master/docs/procedure-md.md))
- [x] Repository scaffolding
- [ ] Phase 1: stubs for all ~40 procedures (frontmatter + step IDs + cross-page branch targets, no step bodies). Validator green.
- [ ] Phase 2: step bodies authored procedure-by-procedure. Validator stays green.
- [ ] GitHub Pages live render

## License

Procedure structure and prose: CC-BY-4.0. This wiki is not affiliated
with, endorsed by, or sanctioned by any reactor vendor, owners group,
or licensee. Brand and entity names appearing in source citations
(NRC publications, public UFSARs) are referenced for factual
attribution only.

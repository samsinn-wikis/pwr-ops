# pwr-eops — Westinghouse PWR Emergency Operating Procedures (LLM-reconstructed)

A demonstration wiki holding a complete set of Westinghouse Pressurized
Water Reactor Emergency Operating Procedures (EOPs) in
[Procedure Markdown (procmd) v0.1](https://github.com/michaelhil/talkingAgents/blob/master/docs/procedure-md.md)
format.

This repo is a **design artifact** for the procmd format and a **demo** of
storing structured procedural knowledge in a samsinn-compatible LLM-wiki.
It is NOT an authoritative source of nuclear plant operating procedures.

## ⚠️ Disclaimers — read first

> **This wiki contains LLM-reconstructed procedures, not licensed plant
> operating procedures. The content is based on Claude's general nuclear
> engineering knowledge from training data, NOT verbatim Westinghouse
> Owners Group documents.**
>
> The procedures here are approximations of the *logical structure* of
> Westinghouse Emergency Response Guidelines, intended to demonstrate the
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
> values, and recovery paths may differ from current Westinghouse ERG
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
`https://samsinn-wikis.github.io/pwr-eops/kg.jsonld`. Predicates
(`escalatesTo`, `delegatesTo`, `recoversVia`, `fallbacksTo`,
`continuesTo`, `monitorsCsf`, `triggeredBy`, `belongsToCategory`, …) are
defined in the `@context` against the placeholder ontology URI
`https://samsinn-wikis.github.io/pwr-eops/ontology/v1#`. Load into
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
`pwr-eops:visibility-prefs`. A "Reset defaults" button restores all
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

Procedure structure and prose: CC-BY-4.0. Westinghouse, Westinghouse
Electric Company, and the Westinghouse Owners Group are referenced for
context only — this wiki is not affiliated with, endorsed by, or
sanctioned by any of those organizations.

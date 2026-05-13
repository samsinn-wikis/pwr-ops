# Agent schema for pwr-ops

This file orients an LLM agent (Claude Code or a samsinn agent) authoring
or maintaining this wiki. Read [`wiki.config.md`](wiki.config.md) first
for domain and writing approach; this file specifies the *schema* every
page must follow.

## Page types

The wiki supports the following page types. Each declares `type:` in its
frontmatter (except plain prose pages); each lives in a fixed sibling
directory under `wiki/`.

| Type | Frontmatter `type:` | Location | Purpose |
|---|---|---|---|
| Procedure | `procedure` | `wiki/procedures/<id>.md` | One Westinghouse-style EOP authored in procmd (current spec: v0.7) |
| Profile | `procedure-profile` | `wiki/profiles/<id>.md` | Domain synonyms + taxonomy vocabulary (`nuclear-erg`) |
| System description | `system-description` | `wiki/systems/<id>.md` | One plant system (function, components, instrumentation, alignment, failure modes) |
| Tag catalogue | `tag-catalogue` | `wiki/tags/<id>.md` | Canonical instrument / equipment tag definitions; per-procedure appendices may override |
| Setpoint catalogue | `setpoint-catalogue` | `wiki/setpoints/<id>.md` | Aggregated numeric setpoints with source citations |
| Tech-spec excerpt | `tech-spec` | `wiki/tech-specs/<id>.md` | LCO / SR / AOT excerpts from Vogtle Tech Specs |
| Lineup | `lineup` | `wiki/lineups/<id>.md` | Valve / breaker / pump alignments per plant mode |
| Page | (no frontmatter type) | `wiki/index.md`, `wiki/scope.md`, `wiki/procmd.md`, `wiki/sources.md` | Catalog and reference prose |

Pages of unrecognized types are still rendered by MkDocs as plain
markdown but are not picked up by samsinn agents via the `procedure_lookup`
or `wiki_lookup` tools.

## Procedure page schema

Frontmatter (required, in this order):

```yaml
---
type: procedure
procedure-md: 0.7
procedure-id: E-0                              # must match filename
title: Reactor Trip or Safety Injection
profile: nuclear-erg
applies-to: Westinghouse-style 4-loop PWR
---
```

Body structure:

```markdown
# <Title>

<Optional one-paragraph "purpose" describing when this EOP is entered.>

## Step <label> [id: <kebab-id>]
Check: <observable condition to verify>
- <branch condition> → #<step-id>
- <branch condition> → [[<other-procedure>#<step-id>]]
- <branch condition> → END

## Step ...
```

Rules:

- Step IDs must be unique within the page and stable forever — they are
  cross-referenced by other procedures.
- **Step IDs are contracts.** Once a stub's step ID is committed, the ID
  is frozen for the life of the page. When Phase C re-authors a stub
  with full operator content, every existing step ID is preserved;
  new steps get new IDs. This is what lets per-family commits in Phase C
  proceed without needing all cross-pages in lockstep.
- Step labels are display-only (`1`, `3.a`, `Continuous`); never used for
  identity.
- A `-` list item is a branch *iff* it contains `→`. Items without `→`
  are step content.
- Same-page branches: `→ #step-id` (bare fragment).
- Cross-page branches: `→ [[<procedure-id>#<step-id>]]` or
  `→ [[<procedure-id>]]` (enter at first step) or `→ END`.
- `Caution:` and `Note:` may be authored as `!!! warning` /
  `!!! note` admonitions; both forms render and parse.
- Westinghouse-style `RNO:` is a profile synonym for the negative-branch
  pattern — it expands as a normal `- Not <condition> → <target>` line.
  Use `RNO:` in source for readability; the parser resolves it via the
  `nuclear-erg` profile.

## Profile page schema

Frontmatter:

```yaml
---
type: procedure-profile
procedure-md: 0.7
profile-id: nuclear-erg
title: Nuclear Emergency Response Guidelines profile
---
```

Body declares synonyms with explicit semantics. See
`wiki/profiles/nuclear-erg.md` for the only profile in this wiki.

## Authoring workflow

Two phases:

**Phase 1 — stubs.** Author every procedure with frontmatter + step IDs
+ branch targets, NO step bodies. Validator green from day one because
all cross-page links resolve.

**Phase 2 — bodies.** Fill in `Check:` / `Action:` / `When:` etc. one
procedure at a time. Run `bun validate.ts` after every edit.

Never create a procedure without its referenced cross-page targets being
already-stubbed. Never delete a step ID that is referenced from another
page (the validator will catch it, but it's avoidable churn).

## Reference materials

When reasoning about Westinghouse-style ERG structure, lean on:
- General PWR thermal-hydraulics knowledge from training data
- Public NUREG references (NUREG/CR-5572, NUREG-0660 Action Plan)
- Westinghouse-style Owners Group public training summaries
- University PWR operator-training course materials

Do NOT reproduce verbatim WOG-copyrighted procedure text. The
goal is faithful logical *structure* with original prose, not a
redistribution of WOG documents.

## Phase D page-type schemas

These schemas govern pages added in Phase D and later. None of these are
procmd-shaped (no step graph); they are plain markdown with a defined
frontmatter shape so samsinn agents can discover them via the
`wiki_lookup` tool.

### System description (`type: system-description`)

```yaml
---
type: system-description
system-id: rcs
title: Reactor Coolant System
applies-to: Westinghouse-style 4-loop PWR
reference-plant: vogtle
csfs-related: [core-cooling, rcs-inventory, rcs-integrity]
---
```

Body convention (sections appear in this order; not all required):

- `## Function` — one-paragraph purpose
- `## Components` — major components with brief descriptions; include a
  mermaid topology diagram (flowchart LR) showing pumps / valves /
  vessels and their connections where it aids comprehension
- `## Instrumentation` — key instruments (cross-reference `«TAG»` if appropriate)
- `## Setpoints` — design / Tech Spec setpoints with citation; include a
  mermaid state or control-loop diagram if the setpoint logic has a
  control-feedback or interlock structure
- `## Normal alignment` — operating-state flow paths and valve positions
- `## Failure modes` — common failure modes and their EOP cross-references
- `## References` — Vogtle UFSAR sections, WTSM chapter, other public references

System pages MAY use inline `«TAG»` references to instruments; the tag
catalogue is the authoritative resolution.

**Mermaid convention:** Use `flowchart LR` (left-to-right) for topology
(component-to-component flow paths); `flowchart TD` or `stateDiagram-v2`
for control-loop / state diagrams; `sequenceDiagram` for operator-system
interaction timing if useful. Keep diagrams readable on mobile (≤ 8
labeled nodes per top-level layout where practical). MkDocs renders
mermaid via the `pymdownx.superfences` mermaid format already configured
in `mkdocs.yml`.

### Tag catalogue (`type: tag-catalogue`)

```yaml
---
type: tag-catalogue
catalogue-id: pwr-4loop
title: Tag catalogue — Westinghouse-style 4-loop PWR
applies-to: Westinghouse-style 4-loop PWR
reference-plant: vogtle
---
```

Body is a single `## Tags` appendix block in the same shape used by
procedure tag appendices. The catalogue is the canonical resolution for
any `«TAG»` reference appearing in a system page or procedure that does
not declare a local appendix entry.

### Setpoint catalogue (`type: setpoint-catalogue`)

```yaml
---
type: setpoint-catalogue
catalogue-id: pwr-4loop
title: Setpoint catalogue — Westinghouse-style 4-loop PWR
applies-to: Westinghouse-style 4-loop PWR
reference-plant: vogtle
---
```

Body is grouped tables of setpoints per system, each row carrying
{setpoint name, value, units, source citation}. Procedure pages cite the
catalogue via plain wikilink.

### Tech-spec excerpt (`type: tech-spec`)

```yaml
---
type: tech-spec
tech-spec-id: 3.4.3-pt-limits
title: Tech Spec 3.4.3 — RCS pressure-temperature limits
applies-to: Vogtle Tech Specs (representative)
---
```

Body: LCO / SR / AOT excerpt with the action-statement table. Cross-
referenced from procedure steps that depend on the tech-spec action.

### Lineup (`type: lineup`)

```yaml
---
type: lineup
lineup-id: post-trip-stable
title: Post-trip stable alignment (Mode 3)
applies-to: Westinghouse-style 4-loop PWR
reference-plant: vogtle
---
```

Body: valve / breaker / pump status tables for a named plant state
(normal, post-trip, recirculation, mid-loop). Cross-referenced from
procedure steps that change alignment.

## Validation scope for new types

`validate.ts` validates only `wiki/procedures/*.md` and
`wiki/profiles/*.md`. New page types live in sibling directories and are:

- Rendered verbatim by MkDocs (no procmd transform).
- Indexed by `scripts/build-manifest.ts` so samsinn's `wiki_lookup` tool
  can discover them.
- Free-form markdown content — author discretion within the section
  conventions above. No structural validation enforced; readability and
  consistency are the standards.

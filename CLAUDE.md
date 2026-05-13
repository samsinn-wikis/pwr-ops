# Agent schema for pwr-ops

This file orients an LLM agent (Claude Code or a samsinn agent) authoring
or maintaining this wiki. Read [`wiki.config.md`](wiki.config.md) first
for domain and writing approach; this file specifies the *schema* every
page must follow.

## Page types

This wiki has exactly three page types:

| Type | Frontmatter `type:` | Location | Purpose |
|---|---|---|---|
| Procedure | `procedure` | `wiki/procedures/<id>.md` | One Westinghouse EOP authored in procmd v0.1 |
| Profile | `procedure-profile` | `wiki/profiles/<id>.md` | Domain synonyms; only `nuclear-erg.md` for v0.1 |
| Page | (no frontmatter type) | `wiki/index.md`, `wiki/scope.md` | Catalog and coverage map. Plain markdown |

No other page types are valid. Do not create prose pages alongside
procedures — this is a procedural wiki only.

## Procedure page schema

Frontmatter (required, in this order):

```yaml
---
type: procedure
procedure-md: 0.1
procedure-id: E-0                              # must match filename
title: Reactor Trip or Safety Injection
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
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
- Westinghouse `RNO:` is a profile synonym for the negative-branch
  pattern — it expands as a normal `- Not <condition> → <target>` line.
  Use `RNO:` in source for readability; the parser resolves it via the
  `nuclear-erg` profile.

## Profile page schema

Frontmatter:

```yaml
---
type: procedure-profile
procedure-md: 0.1
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

When reasoning about Westinghouse ERG structure, lean on:
- General PWR thermal-hydraulics knowledge from training data
- Public NUREG references (NUREG/CR-5572, NUREG-0660 Action Plan)
- Westinghouse Owners Group public training summaries
- University PWR operator-training course materials

Do NOT reproduce verbatim Westinghouse-copyrighted procedure text. The
goal is faithful logical *structure* with original prose, not a
redistribution of WOG documents.

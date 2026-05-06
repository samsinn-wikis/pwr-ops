# Wiki Configuration

## Domain

This wiki holds a complete set of Westinghouse Pressurized Water Reactor
Emergency Operating Procedures (EOPs) in Procedure Markdown (procmd) v0.1
format. Coverage targets the standard Westinghouse 4-loop PWR baseline as
described in publicly available Owners Group references and university
PWR training materials.

The audience is samsinn agents (consuming via wiki tools) and technical
reviewers (humans reading the rendered MkDocs site). Both should be able
to follow a single procedure end-to-end and trace cross-references
between procedures.

This wiki is a **demonstration of the procmd format**, not a licensed
procedure set. Content is LLM-reconstructed from general nuclear
engineering training-data knowledge — not verbatim Westinghouse text.
See README and scope.md for full disclaimers.

## Writing Approach

Every procedure page is procmd v0.1. Pages are NOT prose articles; they
are structured Plans of Decisions, Actions, and Enquiries with explicit
branch targets. Step bodies should be terse and operator-readable —
imperative voice, single-purpose lines, observable conditions.

Westinghouse two-column ERG conventions (instruction column vs Response
Not Obtained column) are flattened to procmd: the instruction is the
step body (`Check:` / `Action:`); the RNO is encoded as a `- Not <X> →`
branch with the `RNO:` synonym from the `nuclear-erg` profile.

Critical Safety Function status trees (FR-S, FR-C, FR-H, FR-P, FR-Z,
FR-I) are authored as `Concurrent: <name> [independent]` references from
E-0 — they spawn at event entry and run until recovery, independent of
the current EOP's lifecycle.

## Quality Rules

- Every procedure page has frontmatter `type: procedure`, `procedure-md:
  0.1`, `procedure-id` matching the filename, `title`, `applies-to:
  Westinghouse 4-loop PWR`, `profile: nuclear-erg`.
- Every step heading has a stable `[id: <kebab-case-slug>]` annotation.
- Every branch list item contains `→` and resolves to `#step-id`,
  `[[<page>#step-id]]`, `[[<page>]]`, or `END`.
- Cross-page wikilinks must resolve against the corpus — no dangling
  references.
- No orphan steps within a page; every non-entry step is reachable via
  some branch path from the page's first step.
- `validate.ts` must pass (exit 0) before any commit to the procedures/
  directory.
- Disclaimers in README, scope.md, and per-page `applies-to` must remain
  prominent.

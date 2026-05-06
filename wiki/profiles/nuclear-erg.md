---
type: procedure-profile
procedure-md: 0.1
profile-id: nuclear-erg
title: Nuclear Emergency Response Guidelines profile
---

# Nuclear ERG profile

This profile declares synonyms used by Westinghouse-style Emergency
Response Guideline procedures (E-series, ECA-series, ES-series,
FR-series). A procedure that sets `profile: nuclear-erg` in its
frontmatter loads the synonyms below.

## Synonyms

### `RNO:` — Response Not Obtained

In Westinghouse ERG two-column format, the left column is the
instruction (`Check:` or `Action:`), and the right column is the action
to take if the expected response is not obtained. In procmd this is
encoded as a negative branch on the immediate Decision:

```markdown
## Step 5 [id: verify-si-actuated]
Check: SI actuation signal present AND SI pumps running
- Verified → #verify-containment-isolation
RNO: manually actuate SI; verify pumps respond
```

The `RNO:` line is shorthand for:

```markdown
- Not verified → manually actuate SI; verify pumps respond
```

The two are semantically equivalent; the parser resolves `RNO:` to the
explicit form via this profile.

### `CSF:` — Critical Safety Function

`CSF: <name>` is shorthand for `Concurrent: <name> [independent]` — a
parallel Plan that runs from event entry through recovery, independent
of the current EOP's lifecycle. CSF status trees do not terminate when
the active EOP completes; they continue monitoring until the operator
explicitly exits the emergency response.

Example in E-0:

```markdown
CSF: subcriticality          # → Concurrent: FR-S [independent]
CSF: core-cooling            # → Concurrent: FR-C [independent]
CSF: heat-sink               # → Concurrent: FR-H [independent]
CSF: rcs-integrity           # → Concurrent: FR-P [independent]
CSF: containment             # → Concurrent: FR-Z [independent]
CSF: rcs-inventory           # → Concurrent: FR-I [independent]
```

Each CSF name resolves to a status-tree family (FR-S, FR-C, FR-H, FR-P,
FR-Z, FR-I). The status tree itself decides which specific procedure
within the family applies (e.g. FR-S.1 vs FR-S.2) based on monitored
plant conditions — that branching is internal to the status tree.

## Rendering hints

When rendered to MkDocs, procedures using this profile should:

- Render `Caution:` as `!!! warning` admonitions
- Render `Note:` as `!!! note` admonitions
- Render the step graph in a two-column-style layout when feasible
  (instruction on left, RNO branches on right) — currently rendered as
  standard markdown lists pending a custom renderer

## Out of scope for this profile (v0.1)

- Foldout pages (parallel-running step pages used during transients)
- Continuous Action Pages (always-running monitoring pages bound to a
  specific EOP, vs CSF status trees which are global)
- Hold points and time-critical action callouts
- Symptom-based vs event-based procedure variants

These are addressed in procmd v0.2 backlog (see the
[procmd spec](https://github.com/michaelhil/talkingAgents/blob/master/docs/procedure-md.md)
deferred-work section).

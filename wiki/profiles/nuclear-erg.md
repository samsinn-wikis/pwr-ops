---
type: procedure-profile
procedure-md: 0.7
profile-id: nuclear-erg
title: Nuclear Emergency Response Guidelines profile
---

# Nuclear ERG profile

This profile declares synonyms and taxonomy vocabulary used by
Westinghouse-style Emergency Response Guideline procedures (E-series,
ECA-series, ES-series, FR-series). A procedure that sets
`profile: nuclear-erg` in its frontmatter loads the synonyms and the
taxonomy below.

## Synonyms

- `RNO:` ≡ `- Not <preceding-condition> →` (Westinghouse "Response Not Obtained" two-column convention)
- `CSF:` ≡ procedure-level `Concurrent: <name> [independent]` (Critical Safety Function — runs from event entry through recovery, does not terminate with the EOP)

## Taxonomy

### Categories

- diagnostic-eop
- function-restoration
- recovery-procedure
- extreme-conditions

### CSFs

- subcriticality
- core-cooling
- heat-sink
- rcs-integrity
- containment
- rcs-inventory

### Entry triggers

- reactor-trip-signal
- safety-injection-actuation
- station-blackout
- loca-symptoms
- faulted-steam-generator
- steam-generator-tube-rupture
- csf-red-path
- csf-orange-path
- csf-yellow-path
- diagnostic-fallback
- post-trip-stable

## Naming patterns

These regex patterns map a target procedure-id to an inferred edge label
when an explicit `[Label]` is absent on a branch:

- `^FR-` → Escalate (function-restoration)
- `^ES-` → Recover
- `^ECA-` → Fallback
- `^E-[0-9]` → Delegate

## RNO usage

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

## CSF declaration

`CSF: <name>` is shorthand for `Concurrent: <name> [independent]` — a
parallel Plan that runs from event entry through recovery, independent
of the current EOP's lifecycle. CSF status trees do not terminate when
the active EOP completes; they continue monitoring until the operator
explicitly exits the emergency response.

Example in E-0:

```markdown
CSF: subcriticality
CSF: core-cooling
CSF: heat-sink
CSF: rcs-integrity
CSF: containment
CSF: rcs-inventory
```

Each CSF name resolves to a status-tree family (FR-S, FR-C, FR-H, FR-P,
FR-Z, FR-I). The status tree itself decides which specific procedure
within the family applies (e.g. FR-S.1 vs FR-S.2) based on monitored
plant conditions — that branching is internal to the status tree.

## Rendering hints

When rendered to MkDocs, procedures using this profile should:

- Render `Caution:` as `!!! warning` admonitions
- Render `Note:` as `!!! note` admonitions

## Out of scope for this profile (v0.2)

- Foldout pages (parallel-running step pages used during transients)
- Continuous Action Pages (always-running monitoring pages bound to a
  specific EOP, vs CSF status trees which are global)
- Hold points and time-critical action callouts
- Symptom-based vs event-based procedure variants

These are addressed in procmd backlog (see the
[procmd spec](https://github.com/michaelhil/talkingAgents/blob/master/docs/procedure-md.md)
deferred-work section).

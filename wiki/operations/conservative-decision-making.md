---
type: operations-doc
operations-id: conservative-decision-making
title: Conservative decision-making
applies-to: Westinghouse-style 4-loop PWR
sources: [iaea-ns-g-2-14, oecd-nea-csni-r-2014-6, nureg-0800-13]
---

# Conservative decision-making

The principle: **when the safety implications of an action are
uncertain, choose the path that preserves the most safety margin
even if it costs operational flexibility or production**. The
operator is empowered (and required) to stop or escalate when in
doubt.

## Applied during EOP execution

- A branch condition is ambiguous → take the branch with the more
  protective response. EOPs are written so the more-protective
  branch is also the safer-error branch.
- A symptom is borderline (e.g. SG level *just* below the AFW
  actuation setpoint) → treat it as triggered.
- A piece of equipment shows uncertain status (e.g. an indication
  conflicts with a model expectation) → assume the worse case until
  a second verification confirms.
- A step's prerequisites cannot be confirmed → stop, brief, escalate
  to the SS.

## Applied to procedure deviation

EOPs do not anticipate every possible plant state. The operating
crew may deviate from the procedure if continuing as written would
cause harm, but:

- The SRO must explicitly authorise the deviation.
- The deviation must be logged with the rationale.
- The deviation is reviewed post-event for incorporation into the
  procedure (or training).

See [procedure-usage.md](procedure-usage.md) for the formal hierarchy.

## Anti-patterns

- **Optimism bias** under time pressure: "the indication will
  probably recover, let's wait." Conservative answer: assume the
  indication is correct and act now.
- **Sunk-cost bias** during recovery: "we already started this
  alignment, let's finish it." Conservative answer: a partial
  alignment that the operator cannot complete safely is to be
  unwound, not pushed.
- **Authority gradient suppression**: junior crew members spotting
  a problem and choosing not to escalate. Conservative culture
  treats every callout as worth pausing for.

## Cross-reference

- [Procedure usage hierarchy](procedure-usage.md)
- [STA role](sta-role.md) — the independent voice that exists
  specifically to surface conservative concerns.
- [Safety culture](safety-culture.md) — the cultural substrate that
  makes conservative decision-making executable.

---
type: operations-doc
operations-id: communication
title: Three-way communication and verification levels
applies-to: Westinghouse-style 4-loop PWR
sources: [iaea-ns-g-2-14, nureg-0800-13, nureg-1764]
---

# Three-way communication and verification levels

Control-room communication uses verbal protocols structured to catch
errors at the moment of action. Four levels of verification underlie
EOP execution; the right level depends on the safety significance
of the action.

## Three-way communication

Every directive between roles uses three exchanges:

1. **Sender** states the directive ("Trip Reactor Coolant Pump 1.")
2. **Receiver** repeats it back ("Trip Reactor Coolant Pump 1.")
3. **Sender** confirms ("That is correct.")

Read-back-confirm catches mis-hearing. The protocol is mandatory for
every parameter callout during EOPs, every breaker manipulation, and
every valve operation that changes plant alignment.

## Four verification levels

- **Self-check** — the operator who is about to perform the action
  pauses, identifies the component by tag and unit, confirms the
  action against the procedure step, then performs it. Default for
  routine actions.
- **Peer-check** — a second qualified operator in the same control
  area visually confirms the component and concurs with the action
  before the first operator performs it. Required for actions that
  change critical-safety-function-bearing system state (HHSI start,
  CCW alignment).
- **Concurrent verification** — two qualified operators
  simultaneously verify the component AND the action; both must
  agree before either acts. Required for irreversible plant
  manipulations (rod insertion, manual SI actuation).
- **Independent verification (IV)** — a second qualified operator
  verifies the action *after the fact*, on the same or a different
  shift. Used for tag-outs and configuration changes that took
  effect before the IV occurred.

## Why this matters for EOP authoring

EOP `Check:` and `Action:` lines do not declare the verification
level — that's the SRO's call at execution time. But a step with a
`Caution:` block flagging an irreversible action is implicitly
guiding the SRO toward concurrent verification. Authors should write
`Caution:` blocks at exactly those moments.

## Cross-reference

- [Control-room ConOps](control-room-conops.md) for the roles each
  level engages.
- [Pre-job briefing](pre-job-brief.md) — the moment verification
  levels are explicitly assigned before EOP entry.

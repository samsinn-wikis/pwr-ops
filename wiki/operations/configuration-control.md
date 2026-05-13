---
type: operations-doc
operations-id: configuration-control
title: Configuration control, tag-outs, independent verification
applies-to: Westinghouse-style 4-loop PWR
sources: [iaea-ns-g-2-14, nureg-0800-13, 10cfr50-54]
---

# Configuration control

The plant's current alignment — which valves, breakers, and
controls are in which positions — must be **known with certainty**
at all times. Configuration control is the discipline that maintains
that certainty across shifts, maintenance windows, and emergencies.

## Tag-outs

When equipment is taken out of service for maintenance or to
prevent inadvertent operation:

- A **danger tag** is hung on every operating control point for the
  equipment. The tag identifies the affected component, the
  required position (closed / open / racked-out), the work order,
  and the date.
- The tag is signed by the operator hanging it AND signed by an
  **independent verifier** (a second qualified operator) who has
  confirmed the position is correct.
- The control room maintains a **tag-out log** listing every
  active tag. The log is reviewed at every shift turnover.
- A tag-out cannot be cleared without:
  1. Work order closure.
  2. Equipment-status confirmation by the operator clearing the tag.
  3. Independent verification by a second operator.

## Hold orders

A **hold order** is a less restrictive lock that prevents a control
manipulation without preventing it physically. Used when the
equipment must remain operable but a specific action is currently
prohibited (e.g. "do not manually trip RCP 1 until further notice").

## Configuration during EOP execution

EOPs assume a known starting configuration. Tag-outs and hold
orders in effect at EOP entry are surfaced in the pre-job briefing.
An EOP `Action:` step that conflicts with an active tag-out triggers
SRO escalation:

1. Confirm the conflict (the step really does require the tagged
   component).
2. Authorise tag clearance under SS oversight.
3. Log the clearance as part of the event narrative.

## Independent verification (IV)

Required for: every safety-related alignment change, every tag-out,
every clearance, every restart of a safety-significant component.
The IV is a separate qualified operator's signature confirming that
the action was performed correctly. IV may be performed
contemporaneously (concurrent verification) or after the fact
(traditional IV) depending on the action's reversibility.

See [communication.md](communication.md) for the verification-level
taxonomy.

## Cross-reference

- [Control-room ConOps](control-room-conops.md)
- [Procedure usage hierarchy](procedure-usage.md)
- [Three-way communication](communication.md)

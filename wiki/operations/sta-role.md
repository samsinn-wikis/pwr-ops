---
type: operations-doc
operations-id: sta-role
title: Shift Technical Advisor (STA) — independent CSF monitoring
applies-to: Westinghouse-style 4-loop PWR
sources: [iaea-ns-g-2-14, nureg-0800-13, ansi-ans-3-1]
---

# Shift Technical Advisor (STA)

The STA is the independent technical voice in the control room
during emergencies. Established as a regulatory requirement
post-TMI (NUREG-0578 Item 2.B.1, codified in 10 CFR 50.54(m)),
the role exists specifically to provide diagnostic perspective
that the EOP-executing team cannot — they're heads-down running
the procedure.

## What the STA does

- Monitors the **Critical Safety Function status trees** in
  parallel with EOP execution. The STA owns the CSF tree
  evaluation independent of the SRO running the active EOP.
- Calls procedure-change recommendations to the SRO when a CSF
  enters orange or red — the SRO holds the authority but the STA
  is the one who is supposed to see it first.
- Provides technical analysis of plant transient behaviour beyond
  what the procedures cover (thermal-hydraulic intuition, system
  inter-dependencies the procedure doesn't make explicit).
- Logs the technical narrative of the event separately from the
  RO's parameter log and the SRO's procedure log. The three logs
  cross-check in post-event review.

## What the STA does NOT do

- Manipulate controls. The STA is not licensed under 10 CFR 55 and
  cannot perform `Action:` steps.
- Override the SRO. STA recommendations are advisory; the SRO
  decides. If the disagreement is critical, both escalate to the
  SS.
- Take command of the EOP execution. The SRO runs the procedure.

## Why the role exists structurally

TMI-2 (1979) showed that an EOP-executing team operating under
high cognitive load loses peripheral awareness — they see what
the procedure tells them to look at and miss what it doesn't.
The STA is the deliberate counter to that: an independent observer
with no procedure to execute, free to notice patterns the active
team is filtering out. The role is one of the lessons learned that
shows up in modern Conduct of Operations regulation in every NRC-
regulated and IAEA-aligned plant.

## Cross-reference

- [Control-room ConOps](control-room-conops.md) — role overview.
- [Conservative decision-making](conservative-decision-making.md) —
  the principle that licenses the STA to interrupt EOP execution.
- [Operating experience: TMI 1979](../human-factors/oe-tmi-1979.md)
  — the event that created the STA role.

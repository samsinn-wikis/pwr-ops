---
type: operating-experience
oe-id: tmi-1979
title: Three Mile Island Unit 2 (March 1979)
applies-to: Westinghouse-style 4-loop PWR
sources: [nureg-cr-6753, nureg-0700, oecd-nea-csni-r-2014-6]
---

# Operating experience: Three Mile Island Unit 2 (March 1979)

TMI-2 is the foundational operating experience for modern PWR EOPs.
Before TMI, plant procedures were event-based: each procedure
covered a specific initiating event ("loss of feedwater," "small
break LOCA"). TMI demonstrated that operators may not be able to
correctly diagnose the initiating event under transient conditions.
The post-TMI redesign (NUREG-0578, NUREG-0737) produced the
symptom-based, function-restoration EOP set that this wiki
documents.

## What happened (compressed)

A loss-of-main-feedwater initiator triggered a reactor trip and
auxiliary-feedwater initiation. The TDAFW pumps started but
discovered closed valves (left isolated after maintenance); SG
inventory boiled away. Pressurizer pressure rose; the pilot-operated
relief valve (PORV) opened, then failed to close. Pressurizer level
rose above the operator's mental model (the model assumed level
correlated with inventory in the RCS; instead, the level rose
because RCS inventory was being lost out the open PORV). Operators
throttled HHSI to *reduce* a level they read as too high.

Core inventory was lost over the following hours. Fuel damage
occurred; small amounts of fission products escaped to containment.

## Why this is the foundational operating experience

- **Event-based procedures failed.** The operators followed the
  procedures for the symptoms they thought they had (high
  pressurizer level → throttle HHSI). The procedures assumed the
  symptom mapped to a specific accident type; in this case it
  didn't.
- **Critical Safety Functions were not directly monitored.** No
  one was watching subcooling, core cooling, or RCS inventory as
  independent quantities. The post-TMI redesign added the FR-x
  procedures and the STA role specifically to address this.
- **Indicator-to-state mapping was wrong.** Pressurizer level is
  a poor surrogate for RCS inventory once voiding has begun. The
  post-TMI redesign added subcooling-margin instrumentation and
  the CET (core exit thermocouple) system specifically to provide
  inventory-state visibility.
- **Operator training was the proximate cause but not the root
  cause.** The training reflected the procedures; the procedures
  reflected the design assumptions; the design assumptions did
  not anticipate the failure mode.

## Direct EOP consequences

| TMI lesson | EOP-era response |
|---|---|
| Symptom-based diagnosis needed | E-series symptom-driven structure (NUREG-0899) |
| CSF monitoring needed independent of EOP execution | FR-x procedures + [STA role](../operations/sta-role.md) |
| Pressurizer-level reliance was wrong | Subcooling-margin + CET + RVLIS instrumentation (NUREG-0737 II.F.2) |
| Operators need ability to override flawed procedure | Conservative-decision-making principle codified |
| Better HSI needed | NUREG-0700 HSI design guidelines |
| Crew composition needed independent technical voice | STA role (NUREG-0578 Item 2.B.1, 10 CFR 50.54(m)) |

## What an EOP-era TMI-equivalent would look like

The same initiator (loss of feedwater + stuck-open PORV) would
today enter [[E-0]] on reactor trip + safety injection. By step 4
(`check-si-status`) the symptom set would show low subcooling +
high containment pressure (PORV discharge to containment). The
operator transitions to [[E-1]] for LOCA response. Throttling
HHSI on high pressurizer level would not be the recommended action
because [[E-1]] explicitly uses subcooling and CET temperature as
the inventory-state indicators. The post-TMI redesign deliberately
removed pressurizer level from the inventory diagnostic chain.

## Cross-reference

- [STA role](../operations/sta-role.md)
- [Conservative decision-making](../operations/conservative-decision-making.md)
- [Failure mode taxonomy](hf-failure-modes-taxonomy.md)
- [E-0](../procedures/E-0.md) / [E-1](../procedures/E-1.md) — the
  symptom-driven entry chain that didn't exist in 1979.

## References

- NRC NUREG/CR-1250 — *Three Mile Island: A Report to the
  Commissioners and to the Public* (Kemeny Commission, 1979).
- NRC NUREG-0578 — *TMI-2 Lessons Learned Task Force, Status
  Report and Short-Term Recommendations* (1979).
- NRC NUREG-0737 — *Clarification of TMI Action Plan
  Requirements* (1980).

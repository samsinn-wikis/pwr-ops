---
type: operations-doc
operations-id: control-room-conops
title: Control-room Conduct of Operations — roles, watch-stand, turnover
applies-to: Westinghouse-style 4-loop PWR
sources: [iaea-ns-g-2-14, nureg-0800-13, 10cfr50-54, ansi-ans-3-1]
---

# Control-room Conduct of Operations

The control room operates as a small, hierarchical team. Each role
carries a licence class and a defined authority boundary; the boundary
matters because EOP execution routinely crosses between roles
(reactor operator manipulating controls, senior reactor operator
authorising the action, shift technical advisor monitoring critical
safety functions in parallel, shift supervisor holding final
decision authority).

## Roles

- **Reactor Operator (RO)** — licensed under 10 CFR 55 to manipulate
  the controls of a single unit. Performs `Action:` steps. Reports
  parameters out loud during EOPs so the SRO + STA can cross-check.
- **Senior Reactor Operator (SRO)** — licensed to direct RO actions
  and authorise procedure entry, branching, and termination. Reads
  the procedure aloud; the RO performs the actions.
- **Shift Technical Advisor (STA)** — typically a degreed engineer
  in a non-licensed advisory role; monitors the critical safety
  function status trees in parallel with the EOP execution.
  Independent of the active EOP team — see [STA role](sta-role.md).
- **Shift Supervisor (SS)** — senior licensed individual holding
  command authority for the shift; can override any step under the
  conservative-decision-making principle but rarely does without
  also escalating.

## Watch-standing

Each role keeps an independent log: RO logbook (parameter readings
+ surveillance test results), SRO/SS turnover log (shift events,
plant status, equipment out of service), STA log (CSF excursions
observed). At turnover all three brief the oncoming watch jointly —
incoming SRO does not assume command until the briefing is complete
and the oncoming SS signs the turnover.

## Cross-reference

- [Three-way / peer-check communication](communication.md) covers
  the verbal-protocol layer that underlies every RO/SRO interaction.
- [Procedure usage hierarchy](procedure-usage.md) covers the
  deviation rules and SRO override.
- [Configuration control](configuration-control.md) covers tag-out
  and independent verification.

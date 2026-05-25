---
title: PWR Components Modeled
type: handbook
---

# PWR Components Modeled

The PWR reference plant is assembled from reusable component types. This page describes those component families and the level of detail expected from each. The exact catalogue should eventually be generated from the Leitbild component registry and graph definitions.

| Component family | Current purpose | Expected maturity |
|---|---|---|
| `reactorCore` | Power, decay heat, reactivity feedback, heat to coolant. | Medium, strong for operational trends. |
| `reactorVessel` | Primary inventory, coolant temperature, pressure coupling. | Medium, strong enough for inventory scenarios. |
| `pressurizer` | Pressure control, heaters, spray, relief, level. | Medium, improving two-region proxy. |
| `steamGenerator` | Heat transfer, level, pressure, steam mass, tube leak. | Medium, strong for SGTR and LOFW. |
| `reactorCoolantPump` | Pump speed, head, resistance, coastdown, loop flow. | Medium, not full hydraulic network. |
| `processPump` | Generic pump behavior for feedwater, charging, injection. | Medium. |
| `processValve` / `steamValve` | Commandable valve behavior where a valve deserves component identity. | Medium for operational use. |
| Link valve modifiers | Simple valve/resistance effects on a physical link. | Medium when independent valve identity is unnecessary. |
| `processHeader` / `steamHeader` | Junction, distribution, mixing, topology-aware allocation. | Medium, important for branching systems. |
| `processTank` | Inventory source/sink, depletion, recovery. | Medium. |
| Heat exchanger family | Heat transfer between streams. | Medium for broad energy balance. |
| Electrical source/bus/breaker | Power availability and lineup. | Medium. |
| Accumulator/injection components | Emergency injection and stored inventory. | Medium-low to medium. |
| Containment volume/spray/sump | Lumped containment symptoms and mitigation. | Medium-low to medium. |

## Component Detail Standard

A component should be considered "good" only when it has clear parameters, bounded state, published variables, command behavior if relevant, tests or validation traces, and no hidden dependence on one hardcoded unit name. A component that only exists as topology is acceptable only if topology is its real purpose. If a component affects physics, alarms, I&C, or procedures, it needs behavior-bearing state.

## When To Split A Component

Split a component when:

- A subpart has independent commands.
- A subpart has its own sensors or tags.
- A failure mode affects the subpart independently.
- A procedure names or manipulates the subpart.
- A scenario needs the subpart to degrade separately.

Do not split merely for diagram aesthetics. More nodes increase graph and validation burden.


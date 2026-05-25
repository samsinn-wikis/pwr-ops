---
title: Scenario And Component Graph Specification
type: handbook
---

# Scenario And Component Graph Specification

The scenario/component graph is the authoring surface for process plants. It says which units exist, which graph each unit uses, where the unit appears in Leitbild, what initial conditions it has, what faults are scheduled, which variables are published, and which I&C/alarm definitions are active.

The graph is intentionally data-first. A human can inspect it. An AI agent can author or modify it. The runtime can validate it. This is the mechanism that keeps the process-plant pack generic while still allowing a rich PWR reference plant.

## Graph Reference Pattern

For complex plants, repeating the full graph inside every scenario would be unreadable. A scenario should usually refer to a graph template:

```json
{
  "pack": "process-plant",
  "type": "unit",
  "id": "halden-unit-a2",
  "label": "Halden Unit A2",
  "graphRef": "process-plant.pressurized-water-reactor.v1",
  "initialState": {
    "reactorCore.powerFraction": 0.99,
    "steamGeneratorA.secondaryInventoryKg": 84000
  }
}
```

The graphRef is not a shared runtime. It is a template. Each unit receives its own compiled copy and its own state.

## Inline Graph Pattern

For experiments and small facilities, a scenario can define an inline graph. The shape is the same as a referenced graph:

```json
{
  "components": [
    {
      "id": "sourceTank",
      "type": "processTank",
      "parameters": { "volumeM3": 50 },
      "initialState": { "inventoryKg": 40000, "temperatureC": 25 }
    },
    {
      "id": "transferPump",
      "type": "processPump",
      "parameters": { "ratedFlowKgPerS": 20, "ratedHeadMPa": 0.4 }
    }
  ],
  "links": [
    {
      "id": "source-to-pump",
      "from": "sourceTank.outlet",
      "to": "transferPump.inlet",
      "service": "liquid",
      "solverModel": "incompressibleLiquid"
    }
  ]
}
```

Inline graphs are useful for small process tests. Reference graphs are preferred for full PWR units.

## Components

A component entry declares identity, type, parameters, initial state, published variables, commands, and optional tags. Parameters are mostly static. State evolves during runtime. Published variables are what outside readers can query.

Component IDs must be stable within the graph. They are used in links, variable paths, telemetry, alarms, I&C rules, and tag bindings.

## Links

A link connects one component port to another. It can also carry semantic information such as service, solver model, pressure, temperature, flow, valve modifiers, leak modifiers, radiation, or contamination. Links are not just diagram arrows. They are part of the physical graph.

The link model should be strong enough to represent normal process paths but not so broad that it becomes a hidden component. If a behavior needs internal state, timing, actuator dynamics, or independent commands, it usually belongs in a component.

## Scheduled Scenario Events

Scenario events are discrete. They can change component state, apply a fault, issue a command, create an incident, or alter environmental conditions. They should not replace continuous physics.

Examples:

- Open a tube leak in one steam generator at T+60s.
- Degrade offsite voltage at T+120s.
- Start a feedwater pump trip sequence.
- Raise an external incident requiring ambulance pickup.

The event schedule should be readable by humans and AI agents. Times should use a clear relative format, such as seconds from scenario start, or a structured time object if the scenario format supports it.

## Validation Requirements

A valid graph should prove these things before runtime starts:

- Every component ID is unique.
- Every link references existing ports.
- Every link solver model has the variables it needs.
- Required component parameters are present.
- Initial state values are type-compatible and physically bounded where possible.
- Published variables point to real component state.
- Tags resolve to exactly one canonical variable path.
- I&C and alarm rules reference real variables and real commands.
- Per-unit state is independent even when graphRef is shared.

Validation should fail loudly. Silent defaults are dangerous because they make a scenario look valid while hiding missing plant behavior.


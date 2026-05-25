---
title: Component Model
type: handbook
---

# Component Model

A component is the smallest named process element with behavior-bearing state. Pumps, tanks, headers, valves, steam generators, heat exchangers, the reactor core, the pressurizer, electrical buses, breakers, diesel generators, accumulators, and containment volumes are all components when they own state or behavior.

The component model is intentionally typed. Components do not all share one giant bag of fields. Each component type has required parameters, optional parameters, state variables, published variables, commands, and validation rules.

## Component Anatomy

| Part | Meaning |
|---|---|
| `id` | Stable graph-local identity. |
| `type` | Reusable behavior family, such as `reactorCore` or `processPump`. |
| `parameters` | Static configuration such as volume, rated flow, setpoint, heat-transfer coefficient, or pump curve constants. |
| `initialState` | Runtime state at scenario start. |
| `ports` | Named connection points used by links. |
| `publishedVariables` | Values exposed to tags, APIs, alarms, procedures, and UI. |
| `commands` | Explicit control actions the runtime accepts. |
| `tags` | Operational aliases for variables, when a procedure or display uses tag IDs. |

Parameters should not evolve during a run unless a command or fault explicitly changes them. State evolves every tick. Published variables are derived from state and metadata, not a separate copy of truth.

## Behavioral Contract

Each component type has a behavior contract:

1. Read its own state, parameters, relevant link state, and commands.
2. Compute the next state for the current tick.
3. Publish variables.
4. Never silently mutate another component's private state.
5. Use links and commands for interaction.

This keeps component behavior local and auditable. It also makes multi-unit runtime safe because each unit contains its own component state.

## Component Families

| Family | Examples | Typical role |
|---|---|---|
| Heat generation | `reactorCore` | Fission power, decay heat, thermal feedback. |
| Primary inventory | `reactorVessel`, `pressurizer` | Coolant inventory, pressure, surge coupling. |
| Heat exchange | `steamGenerator`, generic heat exchangers | Transfer heat across loops while conserving useful balances. |
| Hydraulic motion | `reactorCoolantPump`, `processPump` | Pump head, speed, flow inertia, coastdown. |
| Flow control | `processValve`, `steamValve`, link valve modifiers | Valve demand, opening, resistance, isolation. |
| Junctions | `processHeader`, `steamHeader` | Distribution, mixing, topology-aware allocation. |
| Storage | `processTank`, feedwater tank, condensate inventory | Conservative inventory and source limits. |
| Electrical | buses, breakers, offsite source, generator, diesel | Power availability, voltage degradation, source lineups. |
| Safety injection | accumulators, injection tanks, pumps | Emergency inventory delivery. |
| Containment | containment volume, sump, spray | Pressure, inventory, radiation and spray response. |

## What Makes A Component Strong

A strong component is not necessarily a high-fidelity component. It is one whose assumptions are explicit, whose inputs and outputs are clear, whose state is bounded, and whose response is plausible across the intended scenarios.

For this wiki, component maturity should be assessed by:

- Does it have a clear physical role?
- Are parameters and state separated?
- Are units declared?
- Are published variables discoverable?
- Does it reject invalid configuration?
- Does it behave plausibly during SGTR, LOFW, RCP trip, turbine transient, and electrical degradation?
- Does it use shared helpers instead of bespoke math where possible?
- Does it avoid hidden coupling to one hardcoded PWR graph?

## Agent Guidance

An AI agent should not infer internal component state that is not published. It should query published variables or resolve operational tags. If a needed value is unavailable, it should say so and either request an added variable or reason from available symptoms with uncertainty stated.


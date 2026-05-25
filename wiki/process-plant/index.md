---
title: Process-Plant Pack Overview
type: handbook
---

# How The Leitbild PWR Uses Process-Plant

The PWR in Leitbild is built on the process-plant pack. This page explains that machinery from the PWR user's point of view: how a scenario instantiates one or more PWR units, how the component graph becomes runtime state, how variables and tags are exposed, and how the simulated plant interacts with procedures, alarms, AI agents, and the wider Leitbild world.

The process-plant pack is reusable, but this wiki is centered on the PWR model. Generic process-plant concepts are included because they explain why the PWR is configurable, how six independent units can run from the same graphRef, and how future PWR variants can be authored without hardcoding a new simulator.

## Design Goals

The Leitbild PWR must be configurable, inspectable, and useful for AI agents. The plant should be readable from a graph definition. Variables should be discoverable. Tags should resolve to canonical paths. Commands should be explicit. The runtime should reject invalid graphs rather than silently defaulting. Each unit should run independently so multi-unit scenarios remain composable.

The pack deliberately favors medium-fidelity operational behavior over high-fidelity licensing-grade physics. The correct question for this phase is not "does this match a safety analysis code?" but "does the scenario respond coherently enough that an operator or AI agent can reason about symptoms, trends, alarms, and control actions?"

## Main Subsystems

The process-plant pack has these major internal concerns:

| Concern | Role |
|---|---|
| Component graph | Declares components, links, parameters, initial state, variables, commands, I&C, and alarms. |
| Compiler and validation | Converts the authored graph into a runnable per-unit model and rejects ambiguous or impossible configuration. |
| Physics runtime | Advances component and link state on each simulation tick. |
| Variable registry | Publishes canonical values with units and metadata. |
| Tag resolver | Maps operational tag IDs to canonical variable paths. |
| I&C/protection | Evaluates automatic plant rules after each physics tick. |
| Alarm substrate | Evaluates alarm definitions and exposes alarm state. |
| Telemetry and acceptance | Records traces, plots, and trend checks for validation. |
| Leitbild adapter | Projects selected unit state into Leitbild objects, map icons, rail fields, and query surfaces. |

## Boundaries

Continuous plant physics stays inside the process runtime. It is not modeled as a stream of event-bus messages because continuous hydraulic and thermal state requires a coherent numerical update step. Events are used for discrete things: faults, commands, trips, scheduled initiators, alarm state changes, and cross-pack interactions.

Procedures stay outside the runtime. An agent may read a procmd procedure, query plant variables, and recommend or issue commands, but procedure branch state is not owned by the process-plant pack. This is a deliberate separation of concern: automatic protection is plant behavior; procedure execution is operator or agent behavior.

## Recommended Reading Order

1. [[architecture]] for the end-to-end model.
2. [[scenario-and-graph-spec]] for authoring.
3. [[component-model]] for component semantics.
4. [[link-model]] for connection semantics.
5. [[runtime-solver]] for update order and performance.
6. [[variables-tags-api]] for AI and API interaction.

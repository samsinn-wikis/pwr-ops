---
title: Link Model
type: handbook
---

# Link Model

Links define how components are connected. In a process plant, a connection is rarely just topology. A pipe can carry flow, pressure, temperature, inventory loss, contamination, radiation, isolation state, valve resistance, leak behavior, or service semantics. Leitbild's link model captures enough of this to support medium-fidelity operational simulation without forcing every valve or pipe segment to become a separate component.

## Link Anatomy

| Field | Purpose |
|---|---|
| `id` | Stable graph-local link identity. |
| `from` / `to` | Source and destination component ports. |
| `service` | Physical service or medium class, such as primary coolant, liquid feedwater, steam, gas, electrical, or signal. |
| `solverModel` | Runtime behavior model expected for the link. |
| `parameters` | Resistance, valve coefficient, nominal pressure drop, leak coefficient, or radiation transport settings. |
| `state` | Runtime link values, such as current flow, pressure, temperature, valve opening, leak flow, or contamination. |

The current model supports link semantics because they are essential for plant realism. It avoids turning links into arbitrary hidden components.

## Solver Models

The useful solver models are deliberately limited:

| Model | Use |
|---|---|
| `sourceSink` | A source or demand relationship where one side supplies or consumes flow. |
| `incompressibleLiquid` | Liquid flow with pump/head/resistance style behavior. |
| `compressibleSteam` | Steam flow, pressure response, and demand behavior. |
| `primaryCoolant` | Primary-loop coolant behavior with pressure, temperature, flow, and inventory relevance. |

New solver models should be added only when a real component family needs them. Speculative models create validation and documentation burden without operational value.

## Valves And Leaks On Links

Some valve and leak behavior belongs naturally on a link. A simple isolation valve that only modifies flow resistance can be represented as link state. A leak from a pipe can be represented as link leak flow and mass removal. This keeps the graph readable and avoids replacing every pipe with pipe-valve-pipe component chains.

A valve should become a component when it has independent actuator dynamics, failure modes, command identity, sensors, interlocks, or procedural significance beyond being a flow modifier. The same applies to leaks: a simple leak coefficient can live on a link; a complex break model with inventory, flashing, containment effects, and isolation logic may deserve explicit component behavior.

## Link Validation

The graph compiler should reject:

- Links whose ports do not exist.
- Links whose service conflicts with connected component ports.
- Links whose solver model lacks required variables.
- Nonsense combinations, such as steam solver fields on an electrical link.
- Duplicate link IDs.
- Hidden branch ambiguity where multiple outgoing demands cannot be allocated.

Good link validation is one of the main protections against "plausible-looking nonsense."

## Topology-Aware Flow

Simple flow allocation works for small graphs, but larger process systems need topology-aware demand propagation. Feedwater headers, steam headers, condensate return paths, and auxiliary feedwater branching should distribute flow according to available pressure, valve openings, pump limits, and demand. This does not require a full hydraulic network solver yet, but it does require discipline: broad demand allocation should be replaced with explicit header and link behavior as graph complexity grows.

## Agent Guidance

Agents should treat link variables as physical evidence only if they are published or exposed through the query API. A procedure may ask for flow, pressure, radiation, or valve status. The agent should resolve the tag or canonical variable path, not infer link state from a diagram.


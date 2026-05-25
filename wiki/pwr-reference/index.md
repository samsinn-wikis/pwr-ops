---
title: PWR Reference Plant
type: handbook
---

# PWR Reference Plant

The PWR reference plant is the first deep application of Leitbild's process-plant pack. It is a configurable graph, not a separate hardcoded simulator. The graph uses reusable components to model a reactor core, reactor vessel, primary loops, reactor coolant pumps, steam generators, pressurizer, main steam, turbine, condenser, feedwater, auxiliary feedwater, CVCS, ECCS-like injection, accumulators, containment, electrical systems, I&C/protection, alarms, and telemetry.

The goal is credible medium-fidelity behavior for scenario work, emergency procedure reasoning, AI-agent control support, and multi-simulation demonstrations. The reference plant does not aim to reproduce a licensed plant design or replace safety analysis codes.

## Scenario Readiness

The reference plant is intended to support:

- Steam generator tube rupture.
- Loss of feedwater.
- RCP trip and coastdown.
- Pressurizer relief, spray, and heater response.
- Turbine load transient.
- Offsite power degradation.
- CVCS charging, letdown, and boration effects.
- Multi-unit clustered operation.
- Alarm and automatic protection response.

## Model Philosophy

The plant uses lumped components rather than detailed meshes. It emphasizes inventories, pressures, temperatures, flows, heat transfer, pump response, valve response, contamination/radiation propagation, electrical availability, and observable indications. This makes the model explainable and fast enough for many concurrent units.

## Read Next

- [[systems-modeled]] for the major plant systems.
- [[components-modeled]] for component-level inventory.
- [[physics-model]] for the mathematical and physical depth.
- [[ic-protection-alarms]] for automatic behavior and alarms.


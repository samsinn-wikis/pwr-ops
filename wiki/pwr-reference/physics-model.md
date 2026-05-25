---
title: PWR Physics Model
type: handbook
---

# PWR Physics Model

The PWR reference plant uses medium-fidelity lumped physics. It is designed to make operator-facing symptoms and trends coherent across common emergency scenarios. It is not a licensing-grade thermal-hydraulic model.

## Fidelity Target

The target is strong operational plausibility:

- Trends should move in the right direction.
- Inventories should not appear from nowhere.
- Heat transfer should connect power, temperature, steam generation, and condenser/feedwater response.
- Pump trips should produce coastdown rather than instant flow changes.
- Pressurizer behavior should respond to heaters, spray, relief, and inventory changes.
- Steam generator levels and pressures should respond to feedwater, boiling, steam demand, and tube leakage.
- Electrical degradation should affect powered components through explicit availability.

## Core And Primary Loop

The core models fission power, decay heat, and thermal feedback. The vessel and primary loop represent coolant inventory and heat transport. The model can show trip response, heatup/cooldown, pump coastdown, and inventory loss. It does not solve detailed axial or radial core thermal hydraulics, and it does not use full point kinetics unless future work adds that deliberately.

## Steam Generator Heat Transfer

Steam generators transfer heat from primary to secondary sides. Secondary inventory, steam mass, feedwater, auxiliary feedwater, steam demand, and pressure response are modeled as lumped quantities. Tube leaks connect primary inventory loss with secondary contamination/radiation symptoms.

## Pressurizer

The pressurizer uses a simplified two-region proxy: water inventory and steam-space behavior. Heater energy, spray, relief, and surge coupling affect pressure and level. This is much cleaner than a pure heuristic pressure blend, but it remains intentionally simpler than full two-phase volume modeling.

## Pumps And Hydraulics

Pumps use speed, head, resistance, flow target, and inertia/coastdown style behavior. This gives credible pump trip and degradation response. The model does not yet solve a full network momentum system with all branch interactions.

## Feedwater, Condensate, And Turbine

The secondary side includes feedwater sources, tanks, pumps, valves, headers, condenser response, turbine demand, and condensate production. The goal is coherent mass and energy movement through the turbine/feedwater cycle without modeling every BOP detail.

## Radiation And Contamination

Radiation and contamination are operational indicators, especially important for SGTR. The model supports propagation through relevant paths at a simplified level. It is not a radiochemistry model.

## Validation Philosophy

Every major physics improvement should have trace evidence: SGTR, loss of feedwater, RCP trip, turbine transient, pressurizer relief/spray/heater response, electrical degradation, and multi-unit mixed transients. Acceptance checks should test boundedness, trend direction, no negative inventories, and performance margin.

## Known Limits

The model does not currently provide:

- RELAP-style two-phase network solving.
- Detailed core axial thermal model.
- Full delayed-neutron point kinetics.
- Detailed containment thermal-hydraulics.
- Full plant-specific control-room display fidelity.
- Licensed procedure fidelity.

Those are not failures. They are deliberate boundaries unless a future phase decides the payoff justifies the cost.


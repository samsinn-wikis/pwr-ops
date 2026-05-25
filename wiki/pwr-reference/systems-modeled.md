---
title: PWR Systems Modeled
type: handbook
---

# PWR Systems Modeled

This page summarizes the major systems represented in the current PWR reference graph. The exact executable truth lives in the Leitbild graph definition, but this page explains what each modeled system contributes to scenario behavior.

## Reactor Coolant System

The reactor coolant system contains the reactor vessel, reactor core, primary loop links, reactor coolant pumps, pressurizer, and steam generator primary sides. It is responsible for primary inventory, primary heat transport, loop flow, pressure response, coolant temperature, and leakage pathways.

The current model is strongest for first-order behavior: pump coastdown, heat removal changes, pressure/inventory coupling, pressurizer response, and SGTR primary-to-secondary leakage. It is not a full primary hydraulic network solve and does not model detailed two-phase loop distribution.

## Reactor Core And Vessel

The core models fission power, decay heat, coolant heat transfer, and thermal feedback at a practical level. The vessel ties primary inventory and temperature to pressurizer pressure response and leakage or injection paths. This supports meaningful symptoms during trip, cooldown, loss of heat sink, and inventory-loss scenarios.

## Pressurizer

The pressurizer models water inventory, steam-space proxy behavior, heater input, spray cooling/condensation, relief outflow, and coupling to vessel inventory. It is a simplified two-region representation, strong enough for operator-facing trends without becoming a full two-phase solver.

## Steam Generators

Steam generators model primary-to-secondary heat transfer, secondary inventory, steam-space mass, pressure response, level response, steam demand, feedwater, auxiliary feedwater, tube leaks, and radiation/contamination transfer. This makes them central to SGTR, loss of feedwater, turbine/load transients, and heat-sink scenarios.

## Main Steam, Turbine, And Condenser

The main steam path models steam demand, turbine load, condenser backpressure, condensate production, and broad secondary-side energy balance. It is credible for load changes and loss of steam demand, but future work may deepen turbine control valves and more topology-aware steam distribution.

## Feedwater And Auxiliary Feedwater

Feedwater and auxiliary feedwater model tanks, pumps, valves, headers, constrained source flow, and distribution to steam generators. This is crucial for loss of feedwater and heat-sink recovery. The current direction is toward topology-aware distribution rather than arbitrary flow allocation.

## CVCS

CVCS provides charging, letdown, inventory control, borated makeup, and chemistry/reactivity influence. It supports scenarios where inventory mismatch, boration, charging loss, or letdown changes affect plant response.

## ECCS And Accumulators

ECCS-like components provide emergency injection paths and accumulator behavior. The current model is suitable for first-order injection and inventory restoration effects, not detailed injection train hydraulics.

## Electrical Systems

Electrical modeling includes buses, breakers, offsite sources, generator/source behavior, diesel-like backup behavior, and voltage/power availability effects. It supports offsite degradation and component availability consequences.

## Containment

Containment models pressure, sump/inventory effects, radiation/contamination indicators, and spray response at a lumped level. It is sufficient for alarm/procedure symptoms but not detailed containment thermal-hydraulics.

## I&C, Protection, And Alarms

I&C/protection rules read completed plant variables and issue automatic commands. Alarms read variables and produce annunciation state. Procedures remain outside this automatic layer.


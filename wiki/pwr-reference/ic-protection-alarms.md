---
title: I&C, Protection, And Alarms
type: handbook
---

# I&C, Protection, And Alarms

The I&C/protection and alarm layers are separate from physics and separate from procedures. They read plant variables and produce automatic actions or annunciation state. They do not replace human or AI procedure execution.

## I&C And Protection

I&C/protection rules answer questions such as:

- Is pressurizer pressure below the safety injection threshold?
- Is reactor trip required?
- Is a steam generator level too low?
- Is offsite power degraded?
- Should a pump, valve, breaker, or trip command be issued automatically?

Rules should be scenario/graph configurable. They should reference canonical variables and configured commands. They should not contain hidden assumptions about a fixed PWR graph unless the graphRef explicitly defines that reference model.

## Rule Evaluation Order

Protection rules should evaluate after the physics tick publishes a completed snapshot. This avoids mid-tick mutation and makes the result explainable. Commands produced by protection rules should go through the same command surface as manual or agent-issued commands, with source metadata showing that the command came from automatic protection.

## Alarm Substrate

An alarm definition reads variables and produces alarm state. A strong alarm includes:

- Alarm ID.
- Source variable or condition.
- Severity.
- Setpoint or logic.
- Hysteresis or delay if needed.
- Text.
- Affected equipment.
- State lifecycle.
- Optional procedure relevance.

Alarm state should be queryable by agents and visible on surfaces. It should be generated from runtime variables, not manually scripted for demo effect.

## Procedures Are Separate

Procedures are decision aids. A procmd page may tell an operator to verify reactor trip, check SI, isolate a faulted steam generator, or restore heat sink. The procedure itself does not automatically trip the reactor or start pumps. An operator or AI agent may use procedure logic to decide which command to issue.

This separation is essential for future control-room simulation. It allows the same plant state to be interpreted by different operators, agents, procedures, displays, and training scenarios without hiding procedural behavior inside the simulator.


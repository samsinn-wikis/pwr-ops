---
title: Variables, Tags, And API Surface
type: handbook
---

# Variables, Tags, And API Surface

Variables are the operational surface of the process-plant pack. Operators, AI agents, procedures, alarms, I&C rules, telemetry, and UI panels all need stable ways to identify plant values. Leitbild uses canonical variable paths for simulator truth and tag IDs as operational aliases.

## Canonical Variable Paths

A canonical process-plant variable path should be globally unambiguous within a run:

```text
process-plant://<unit-id>/<component-id>.<variable>
```

Example:

```text
process-plant://halden-unit-a2/pressurizer.pressureMPa
```

The canonical path is the simulator-facing identity. It should resolve directly to a published variable in one unit's variable registry.

## Tag IDs

Procedure documents and control-room displays often use tag-like names, such as `PT-455`. A tag ID is an operational alias. It is not the source of truth. It must resolve to one canonical variable path for a specific unit context.

```text
PT-455 -> process-plant://halden-unit-a2/pressurizer.pressureMPa
```

Tag IDs are useful because procedures are written in operational language. Canonical paths are useful because simulators need unambiguous addressing. The resolver is the bridge.

## Required Metadata

A published variable should carry:

- Canonical path.
- Human label.
- Unit ID.
- Component ID.
- Variable name.
- Units.
- Value type.
- Current value.
- Optional tag IDs.
- Optional description.
- Optional valid range or alarm relevance.

This metadata lets AI agents know what they are reading and lets validation detect stale or ambiguous bindings.

## Query Rules For AI Agents

An AI agent should:

1. Resolve procedure tags before querying values.
2. Prefer canonical variable paths once resolved.
3. Preserve units in every conclusion.
4. Report uncertainty when a tag or variable is unavailable.
5. Never invent an unavailable variable.
6. Distinguish commandable controls from read-only indications.
7. Avoid cross-unit assumptions unless the user or scenario explicitly gives the unit context.

## Commands

Commands are explicit writes through the pack/control API. They are not variable edits. A command should name the unit, target component or link, command type, arguments, source, and timestamp. Commands should be validated against component command definitions.

Examples:

- Trip reactor.
- Open pressurizer spray.
- Close an MSIV.
- Start auxiliary feedwater pump.
- Set feedwater valve demand.
- Align breaker or source.

Command outcomes should be visible through variables, alarms, events, or telemetry. A command that silently disappears is not acceptable.


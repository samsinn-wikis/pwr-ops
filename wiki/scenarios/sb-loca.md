---
type: scenario
scenario-id: sb-loca
title: Small-break LOCA (3-inch cold-leg break, Loop 1)
applies-to: Westinghouse-style 4-loop PWR
reference-plant: vogtle
---

Reactor at 100% rated thermal power; a 3-inch break in the Loop 1 cold leg
develops between *t* = 0 and *t* = 30 s. RCS inventory loss drives
pressurizer pressure below the SI setpoint at ~*t* = 30 s; the operator
enters [[E-0]] on safety-injection actuation, transitions to [[E-1]] when
LOCA symptoms are confirmed, and progresses through high-head SI verification.
By *t* = 5 min the crew has high-head SI established and is monitoring RWST
inventory to anticipate recirculation transfer per [[ES-1.3]].

This scenario exercises the E-0 → E-1 → ES-1.3 path with no concurrent
faults (single LOCA, both SI trains available, no SG faults). Multi-fault
variants live in `sb-loca-with-*` sibling scenarios.

## Initial state
```json
{
  "PT-455": 2235,
  "SG-A-LVL-NR": 50,
  "SG-B-LVL-NR": 50,
  "SG-C-LVL-NR": 50,
  "SG-D-LVL-NR": 50,
  "RCS-TEMP-HOT": 612,
  "SUB-MARGIN": 35,
  "RWST-LVL": 92
}
```

## Injections
```json
[
  { "tag": "PT-455", "value": 1600, "at-time-s": 30 },
  { "tag": "RCS-TEMP-HOT", "value": 575, "at-time-s": 60 },
  { "tag": "SUB-MARGIN", "value": 12, "at-time-s": 120 }
]
```

## Expected traversal
```json
[
  "E-0#verify-reactor-trip",
  "E-0#verify-turbine-trip",
  "E-0#verify-ac-buses",
  "E-0#check-si-status",
  "E-0#verify-si-pumps",
  "E-1#verify-loca-symptoms",
  "E-1#verify-si-active",
  "E-1#check-rcs-pressure-trend",
  "E-1#monitor-rwst-level"
]
```

## Expected terminal state
```json
{
  "HHSI-PUMP-A": "RUN",
  "HHSI-PUMP-B": "RUN",
  "PT-455": 1600,
  "RWST-LVL": 80
}
```

## EAL classification

Initial entry under E-0/SI is at minimum an Unusual Event per NEI 99-01;
once SI is actuated AND containment radiation rises (not represented in
this no-fuel-damage variant), the classification escalates to Alert. See
the future EAL-classification page for the full table.

## References

- Vogtle UFSAR §15.6.5 (small-break LOCA analysis)
- NEI 99-01 EAL methodology
- Westinghouse-style ERG procedures E-0, E-1, ES-1.3

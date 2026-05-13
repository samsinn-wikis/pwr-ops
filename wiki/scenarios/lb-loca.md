---
type: scenario
scenario-id: lb-loca
title: Large-break LOCA (double-ended guillotine, cold leg Loop 1)
applies-to: Westinghouse-style 4-loop PWR
reference-plant: vogtle
expected-eal-class: Alert
timing-source: Vogtle UFSAR §15.6.5
---

Reactor at 100% rated thermal power; instantaneous double-ended guillotine
break in the Loop 1 cold leg. Pressurizer pressure collapses from 2235 psig
to saturation within ~5 seconds; accumulator injection initiates immediately;
HHSI fully loaded by ~25 s. The crew enters [[E-0]] on safety-injection
actuation, transitions to [[E-1]] on confirmed LOCA symptoms, and progresses
to [[ECA-1.1]] (or [[ES-1.4]] in nominal recirculation cases) once RWST
inventory approaches the recirculation transfer setpoint at ~30 min.

Rapid depressurization drives pressure below the SA5 Alert threshold by
~10 s. CTMT-PR rises immediately on break-flow flashing. RWST depletes
linearly through the high-pressure phase. By *t* = 30 min the crew is
preparing recirculation transfer per [[ES-1.3]].

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
  "RWST-LVL": 92,
  "CTMT-PR": 0.5
}
```

## Injections
```json
[
  { "tag": "PT-455", "value": 1200, "at-time-s": 5 },
  { "tag": "CTMT-PR", "value": 8, "at-time-s": 5 },
  { "tag": "SUB-MARGIN", "value": -5, "at-time-s": 10 },
  { "tag": "PT-455", "value": 400, "at-time-s": 30 },
  { "tag": "CTMT-PR", "value": 16, "at-time-s": 30 },
  { "tag": "RWST-LVL", "value": 35, "at-time-s": 1800 }
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
  "E-1#check-rcp-status",
  "E-1#verify-ecc-alignment",
  "E-1#monitor-rwst-level"
]
```

## Expected terminal state
```json
{
  "PT-455": 400,
  "CTMT-PR": 16,
  "RWST-LVL": 35
}
```

## EAL classification

This scenario classifies as **Alert (SA5)** — pressurizer pressure crosses
the 1500 psig threshold at *t* = 5 s. SU4 also fires (below 1815 psig) but
SA5 is the higher class and dominates. CTMT-PR > 3 also triggers SU8.
Escalation to SAE would require sustained core-exit thermocouple readings
≥ 1200 °F per SS3, which this scenario does not reach (SI restores
inventory before core damage onset).

## References

- Vogtle UFSAR §15.6.5 (large-break LOCA analysis)
- NEI 99-01 SA5 (RCS depressurization), SA9 (containment pressure)
- Westinghouse-style ERG procedures E-0, E-1, ECA-1.1, ES-1.4

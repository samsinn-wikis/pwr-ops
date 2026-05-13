---
type: scenario
scenario-id: sgtr
title: Steam Generator Tube Rupture (single-tube, SG-A)
applies-to: Westinghouse-style 4-loop PWR
reference-plant: vogtle
expected-eal-class: Alert
timing-source: Vogtle UFSAR §15.6.3
---

Reactor at 100% rated thermal power; a complete double-ended rupture of a
single SG-A steam generator tube develops at *t* = 0. Primary-to-secondary
leakage drives SG-A level upward and slowly depressurizes the RCS. The
crew enters [[E-0]] on safety-injection actuation, recognises the ruptured
SG signature at [[E-3#identify-ruptured-sg]] (rising SG-A level + air-
ejector radiation rise + falling RCS pressure), and isolates SG-A per
[[E-3#isolate-ruptured-sg]] before initiating cooldown and depressurization
to terminate the leak at [[E-3#verify-leak-terminated]]. Recovery flows
through [[ES-3.1]] for backfill and stabilization.

The classifier surfaces this as Alert via the SA5 IC (RCS pressure crosses
1500 psig under continued leakage before the operator successfully
depressurizes below the ruptured SG). A non-isolated SGTR would also
trigger SA9 (containment-bypass radiation pathway), but for this scenario
the air-ejector pathway is contained and CTMT-RAD does not rise.

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
  "AEJ-RAD": 10
}
```

## Injections
```json
[
  { "tag": "SG-A-LVL-NR", "value": 65, "at-time-s": 60 },
  { "tag": "AEJ-RAD", "value": 250, "at-time-s": 90 },
  { "tag": "PT-455", "value": 1700, "at-time-s": 180 },
  { "tag": "SG-A-LVL-NR", "value": 78, "at-time-s": 240 },
  { "tag": "PT-455", "value": 1420, "at-time-s": 600 }
]
```

## Expected traversal
```json
[
  "E-0#verify-reactor-trip",
  "E-0#verify-turbine-trip",
  "E-0#check-si-status",
  "E-3#identify-ruptured-sg",
  "E-3#verify-intact-sg-available",
  "E-3#isolate-ruptured-sg",
  "E-3#control-rcs-pressure",
  "E-3#initiate-cooldown",
  "E-3#depressurize-rcs",
  "E-3#verify-leak-terminated"
]
```

## Expected terminal state
```json
{
  "PT-455": 1420,
  "SG-A-LVL-NR": 78,
  "AEJ-RAD": 250
}
```

## EAL classification

**Alert (SA5)** at *t* = 600 s — pressurizer pressure crosses 1500 psig
under continued primary-to-secondary leakage. SU4 (RCS leakage) fires
earlier at *t* = 180 s but is superseded. Air-ejector radiation rises
visibly but stays below the CTMT-RAD SA9 threshold (which monitors
containment, not the secondary radiation path — the SGTR-specific
release path is via the ruptured SG to atmosphere via the ARV, not
through containment).

## References

- Vogtle UFSAR §15.6.3 (steam generator tube rupture analysis)
- NEI 99-01 SA5 (RCS depressurization)
- Westinghouse-style ERG procedures E-0, E-3, ES-3.1

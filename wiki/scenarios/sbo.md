---
type: scenario
scenario-id: sbo
title: Station blackout (loss of offsite power + both EDGs fail to start)
applies-to: Westinghouse-style 4-loop PWR
reference-plant: vogtle
expected-eal-class: SAE
timing-source: Vogtle UFSAR §15.2.6 + 10 CFR 50.63 (SBO rule)
---

Reactor at 100% rated thermal power. Loss of offsite power at *t* = 0
triggers an automatic reactor trip. Both emergency diesel generators
fail to start on the undervoltage signal (common-cause fuel-system
fault). Class-1E AC buses A and B remain de-energized; the plant is in
station blackout. Decay heat removal is via natural circulation through
the SGs with TDAFW feeding from the CST; battery-powered instrumentation
supports diagnostic monitoring per [[ECA-0.0]].

NEI 99-01's HU1 (UE) fires at *t* = 15 min on sustained loss of AC,
HA1 (Alert) at *t* = 30 min, HS1 (SAE) at *t* = 1 hour. The scenario
runs out to *t* = 2 hours to confirm SAE classification; recovery via
FLEX strategies (NEI 12-06 portable diesel) is the assumed exit path
not modeled here.

## Initial state
```json
{
  "PT-455": 2235,
  "SG-A-LVL-NR": 50,
  "SG-B-LVL-NR": 50,
  "SG-C-LVL-NR": 50,
  "SG-D-LVL-NR": 50,
  "RCS-TEMP-HOT": 612,
  "BUS-A-EMERG": "LIVE",
  "BUS-B-EMERG": "LIVE",
  "DG-A": "STOPPED",
  "DG-B": "STOPPED"
}
```

## Injections
```json
[
  { "tag": "BUS-A-EMERG", "value": "DEAD", "at-time-s": 0 },
  { "tag": "BUS-B-EMERG", "value": "DEAD", "at-time-s": 0 },
  { "tag": "DG-A", "value": "FAULT", "at-time-s": 10 },
  { "tag": "DG-B", "value": "FAULT", "at-time-s": 10 },
  { "tag": "SG-A-LVL-NR", "value": 35, "at-time-s": 1800 },
  { "tag": "RCS-TEMP-HOT", "value": 580, "at-time-s": 3600 },
  { "tag": "SG-A-LVL-NR", "value": 30, "at-time-s": 7200 }
]
```

## Expected traversal
```json
[
  "E-0#verify-reactor-trip",
  "E-0#verify-turbine-trip",
  "E-0#verify-ac-buses",
  "ECA-0.0#verify-blackout",
  "ECA-0.0#establish-tdafw",
  "ECA-0.0#natural-circulation",
  "ECA-0.0#wait-for-ac"
]
```

## Expected terminal state
```json
{
  "BUS-A-EMERG": "DEAD",
  "BUS-B-EMERG": "DEAD",
  "DG-A": "FAULT",
  "DG-B": "FAULT",
  "SG-A-LVL-NR": 30
}
```

## EAL classification

**Site Area Emergency (HS1)** at *t* = 3600 s (1 hour) — both 4 kV
emergency buses remain dead continuously for 1 hour. HU1 fires first at
*t* = 900 s (UE), then HA1 at *t* = 1800 s (Alert), then HS1 at the
1-hour mark. The classifier returns SAE as the highest class reached.

If the scenario were extended past *t* = 14400 s (4 hours) with no
restoration, HG1 (General Emergency) would fire. Modeling that requires
either a longer time horizon or explicit injection at *t* = 14400 s.

## References

- Vogtle UFSAR §15.2.6 (loss of offsite power)
- 10 CFR 50.63 (Station Blackout Rule)
- NEI 12-06 (FLEX coping strategies)
- NEI 99-01 HU1 / HA1 / HS1 / HG1 (AC-loss duration classes)
- Westinghouse-style ERG procedures E-0, ECA-0.0

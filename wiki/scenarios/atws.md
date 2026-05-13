---
type: scenario
scenario-id: atws
title: ATWS (anticipated transient without scram, loss of main feedwater)
applies-to: Westinghouse-style 4-loop PWR
reference-plant: vogtle
expected-eal-class: Alert
timing-source: Vogtle UFSAR §15.8 + WCAP-11993 (ATWS analysis)
---

Reactor at 100% rated thermal power. Loss of main feedwater at *t* = 0
generates an automatic reactor trip signal at *t* = 5 s, but the trip
breakers fail to open (common-mode mechanical fault). Pressurizer pressure
rises rapidly as the moderator-feedback negative reactivity insertion is
the only power-reduction mechanism. AFW initiates automatically. Crew
recognizes the ATWS at [[E-0#verify-reactor-trip]] (trip breakers still
closed despite trip signal), transitions to [[FR-S.1]] for emergency
boration and manual trip. Manual trip at [[FR-S.1#manual-trip]] succeeds
at *t* = 60 s; emergency boration follows per
[[FR-S.1#emergency-boration]].

The classifier triggers Alert (SA1) for the ATWS condition itself —
power > 50% while trip breakers remain CLOSED. Once manual trip succeeds
and breakers open at *t* = 60 s, the SA1 predicate becomes false, but
NEI 99-01's persistence rule applies (once declared, the Alert is held
until termination criteria are met by the emergency director).

## Initial state
```json
{
  "PT-455": 2235,
  "NIS-PR-AVG": 100,
  "TRIP-BKR-A": "CLOSED",
  "TRIP-BKR-B": "CLOSED",
  "SG-A-LVL-NR": 50,
  "RCS-TEMP-HOT": 612,
  "SUB-MARGIN": 35
}
```

## Injections
```json
[
  { "tag": "PT-455", "value": 2450, "at-time-s": 10 },
  { "tag": "NIS-PR-AVG", "value": 92, "at-time-s": 10 },
  { "tag": "PT-455", "value": 2520, "at-time-s": 30 },
  { "tag": "NIS-PR-AVG", "value": 85, "at-time-s": 30 },
  { "tag": "TRIP-BKR-A", "value": "OPEN", "at-time-s": 60 },
  { "tag": "TRIP-BKR-B", "value": "OPEN", "at-time-s": 60 },
  { "tag": "NIS-PR-AVG", "value": 5, "at-time-s": 90 },
  { "tag": "PT-455", "value": 2200, "at-time-s": 180 }
]
```

## Expected traversal
```json
[
  "E-0#verify-reactor-trip",
  "FR-S.1#verify-power-generation",
  "FR-S.1#manual-trip",
  "FR-S.1#emergency-boration",
  "FR-S.1#verify-shutdown"
]
```

## Expected terminal state
```json
{
  "TRIP-BKR-A": "OPEN",
  "TRIP-BKR-B": "OPEN",
  "NIS-PR-AVG": 5,
  "PT-455": 2200
}
```

## EAL classification

**Alert (SA1)** at *t* = 0 — the categorical ATWS predicate fires
immediately because NIS-PR-AVG is at 100% while both trip breakers
are CLOSED. The condition persists until *t* = 60 s when manual trip
succeeds (breakers open). The classifier returns the *highest class
reached*, which remains Alert.

The classifier does not currently model emergency-director judgment for
classification termination. NEI 99-01 Alert persists until termination
criteria are formally met; the scenario's terminal state shows breakers
open and power decayed, but the formal Alert termination is an
out-of-scope operator decision.

## References

- Vogtle UFSAR §15.8 (ATWS analysis)
- WCAP-11993 (ATWS mitigation in W-style PWRs)
- 10 CFR 50.62 (ATWS rule)
- NEI 99-01 SA1 (RPS failure to scram)
- Westinghouse-style ERG procedures E-0, FR-S.1

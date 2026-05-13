---
type: eal-rules
title: EAL classification rules (NEI 99-01)
applies-to: Westinghouse-style 4-loop PWR
reference-plant: vogtle
---

# EAL classification rules

Emergency Action Level (EAL) thresholds per
[NEI 99-01](https://www.nrc.gov/reactors/operating/ops-experience/emergency-prep/initiating-conditions.html),
encoded as deterministic predicates the `eal_classify` tool evaluates
against a scenario's projected time-series state.

**Predicate grammar (v1)** — single-tag comparisons with optional
DURATION dwell, composed with `AND` / `OR` and explicit parens:

```
«TAG» <op> <value> [for >= <duration>]
```

- `<op>` ∈ { `<`, `>`, `<=`, `>=`, `==`, `!=` }
- `<value>` is a number, quoted string, or bareword
- DURATION units: `s` (seconds), `min` (minutes), `h` (hours)

Rules below are organised by class (UE → Alert → SAE → GE). Each row
must declare a unique IC code within its class. Rules marked
`ic: manual` are placeholders for ICs the v1 grammar cannot yet
express (set-of-conditions, multi-tag correlations) — these are
evaluated by an operator, not by the classifier.

## Unusual Event

| ic | predicate | source |
|---|---|---|
| SU4 | `«PT-455» < 1815` | NEI 99-01 SU4 (RCS leakage / inventory loss) |
| SU8 | `«CTMT-PR» > 3` | NEI 99-01 SU8 (containment pressure indication) |
| HU1 | `«BUS-A-EMERG» == DEAD AND «BUS-B-EMERG» == DEAD for >= 15 min` | NEI 99-01 HU1 (loss of all offsite AC ≥ 15 min) |

## Alert

| ic | predicate | source |
|---|---|---|
| SA5 | `«PT-455» < 1500` | NEI 99-01 SA5 (significant RCS depressurization) |
| HA1 | `«BUS-A-EMERG» == DEAD AND «BUS-B-EMERG» == DEAD for >= 30 min` | NEI 99-01 HA1 (extended loss of AC ≥ 30 min) |
| SA9 | `«CTMT-RAD» > 100` | NEI 99-01 SA9 (containment radiation rise) |

## Site Area Emergency

| ic | predicate | source |
|---|---|---|
| SS3 | `«CET-AVG» >= 1200 for >= 15 min` | NEI 99-01 SS3 (core exit thermocouples ≥ 1200 °F sustained) |
| HS1 | `«BUS-A-EMERG» == DEAD AND «BUS-B-EMERG» == DEAD for >= 1 h` | NEI 99-01 HS1 (loss of all AC ≥ 1 hour) |
| SS5 | `«CTMT-RAD» > 1000` | NEI 99-01 SS5 (high containment radiation, fuel-clad damage) |

## General Emergency

| ic | predicate | source |
|---|---|---|
| SG1 | `«CET-AVG» >= 1200 for >= 30 min AND «CTMT-RAD» > 1000` | NEI 99-01 SG1 (core damage + containment radiation indicates release path) |
| HG1 | `«BUS-A-EMERG» == DEAD AND «BUS-B-EMERG» == DEAD for >= 4 h` | NEI 99-01 HG1 (SBO ≥ 4 hours) |

## Notes

- Predicates are **deterministic** and **time-aware**. A DURATION clause
  resets if the underlying comparison is violated for any sample in the
  series — addressing the post-Fukushima emphasis on sustained-condition
  EALs.
- The classifier returns the **highest class reached** over the
  scenario timeline, with the moment first reached + the IC code that
  triggered it. NEI 99-01's persistence rule ("once SAE is declared,
  it persists until termination criteria are met") is preserved.
- Tags used in predicates must exist in the canonical tag catalogue.
  The wiki validator enforces this at build time.
- This rule table is **the source of truth** for `eal_classify`. Build
  step emits `_eal-rules.json` next to `_manifest.json`; samsinn fetches
  the JSON.

## References

- NEI 99-01 Revision 6: Methodology for Development of Emergency Action Levels
- 10 CFR 50.47 (Emergency planning)
- NUREG-0654 Revision 1 (Criteria for preparation and evaluation of radiological emergency response plans)

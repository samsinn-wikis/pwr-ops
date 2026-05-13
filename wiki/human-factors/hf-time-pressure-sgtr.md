---
type: hf-time-pressure-profile
hf-id: time-pressure-sgtr
title: Time-pressure profile — Steam Generator Tube Rupture
applies-to: Westinghouse-style 4-loop PWR
sources: [nureg-cr-6883, nureg-cr-6753, oecd-nea-csni-r-2014-6]
---

# Time-pressure profile — SGTR

SGTR is unique among LOCA-family events because the leak path
bypasses containment. The crew faces both inventory loss (primary
mass migrating to the secondary side) AND a potential atmospheric
release pathway (the ruptured SG can vent to atmosphere through
ARVs or safety valves). Time pressure is therefore higher than a
similarly-sized LOCA inside containment.

## Phase 0–5 min — recognition

- **Crew load**: high. Trip + SI actuation has occurred; the
  early symptoms (rising SG level on one loop, falling RCS
  pressure, air-ejector radiation rise) emerge over seconds.
- **Decisions made**: standard E-0 checklist plus the initial
  diagnostic question — is the ruptured loop identifiable?
- **Failure modes most likely**: missing the air-ejector radiation
  signature (it's a relatively obscure indication on the main
  control board); misreading SG-level instrumentation under
  reactor-trip transient.

## Phase 5–30 min — isolate + control

- **Crew load**: high, focused. Crew enters [[E-3]]; identifies
  the ruptured SG by its distinct level + pressure + radiation
  signature; isolates it by closing MSIV, MFW valves, AFW valves;
  begins primary cooldown to minimise the secondary release.
- **Decisions made**: identify the ruptured loop with certainty
  before isolating it; manage cooldown rate to avoid PTS; decide
  on the depressurisation timing.
- **Failure modes most likely**: wrong-loop isolation (4 nearly-
  identical loops in the control board layout) — see
  [hf-action-isolate-faulted-sg.md](hf-action-isolate-faulted-sg.md).
- **HF concerns**: high authority-gradient suppression risk. The
  STA's role is critical here — independent confirmation that
  the right SG was identified before isolation.

## Phase 30–120 min — termination + recovery

- **Crew load**: moderate. Primary pressure has been driven
  below the ruptured SG pressure; the leak has terminated. Crew
  works through [[ES-3.1]] for backfill and stabilization. EAL
  classification (typically Alert) is established.
- **Decisions made**: when to terminate SI; long-term cooldown
  planning; coordination with offsite emergency response.
- **Failure modes most likely**: SI termination too early (re-
  opening the leak path); failure to maintain operator awareness
  of the ruptured-loop status.

## Why SGTR is its own profile

The atmospheric-release potential makes SGTR distinct from other
LOCAs in two ways:

1. **EAL classification jumps quickly** (Alert from RCS leakage,
   potentially SAE if release isn't isolated). Crew must
   prioritise emergency response organisation notification as a
   parallel task to plant control.
2. **Wrong-loop isolation has catastrophic consequences.** In
   other LOCA classes, the wrong-component error is recoverable;
   isolating the *intact* SG instead of the ruptured one removes
   the available heat sink.

## Procedures by phase

| Phase | Active procedure(s) |
|---|---|
| 0–5 min | [[E-0]] |
| 5–30 min | [[E-3]] |
| 30–120 min | [[ES-3.1]] |
| Beyond | recovery + extended cooldown |

## Cross-reference

- [Action class: isolate faulted SG](hf-action-isolate-faulted-sg.md)
- [STA role](../operations/sta-role.md)
- [HF failure mode taxonomy](hf-failure-modes-taxonomy.md)

---
type: hf-action-class
hf-id: isolate-faulted-sg
title: Action class — isolate a faulted or ruptured steam generator
applies-to: Westinghouse-style 4-loop PWR
sources: [nureg-cr-6753, nureg-0700, oecd-nea-csni-r-2014-6]
---

# Action class: isolate a faulted or ruptured SG

Steam Generator Tube Rupture (SGTR) and steam-line break upstream
of an SG each require **isolating the affected SG from the
secondary inventory chain** to prevent containment-bypass release
or further inventory loss. The action class covers four coordinated
steps:

1. Identify the ruptured/faulted SG (rising level + radiation rise
   for SGTR; falling level + falling pressure for steam-line
   break).
2. Close the affected SG's MSIV.
3. Close the affected SG's main feedwater control valve and AFW
   control valve.
4. Verify isolation by trending SG-side parameters and primary-to-
   secondary leak indicators.

## Typical execution time

- **Cognitive identification**: 30–60 s once the diagnostic
  symptoms are visible. SGTR signature is distinct (level + rad);
  steam-line break is distinct (level + pressure).
- **Motor**: ~30 s for the valve closures (4–6 components in
  rapid sequence). MSIV closure is typically the longest.

## Error modes

- **Wrong-SG isolation** — the operator isolates the wrong SG
  because the SG indicators on the main control board are visually
  similar across the four loops. Catastrophic if the *only* intact
  SG is isolated. Mitigated by peer-check + the procedure's
  redundant verification step.
- **Incomplete isolation** — MSIV closes but the SG blowdown valve
  or atmospheric relief valve is left in service. Inventory
  continues to leak via the open path. Caught by the verify step.
- **Premature isolation** — diagnosis is wrong; the operator
  isolates an intact SG based on instrument anomaly rather than
  real fault. Heavy cost in heat-sink capacity.

## Procedures that invoke

- [[E-2]] (faulted SG isolation)
- [[E-3]] (SGTR isolation)
- [[ECA-3.1]] / [[ECA-3.2]] (SGTR variants)

## Performance-shaping factors

| factor | weight | rationale |
|---|---|---|
| diagnostic complexity | high | distinguishing SGTR from steam-line break under noisy indications |
| time pressure | medium | minutes-to-isolate before significant release |
| HSI | high | 4-loop layout invites wrong-loop error |
| peer-check use | high | the procedure explicitly demands it |
| training quality | high | exact-event simulator rehearsal |

## Cross-reference

- [Time-pressure profile — SGTR](hf-time-pressure-sgtr.md)
- [HF failure mode taxonomy](hf-failure-modes-taxonomy.md)
- [Three-way communication](../operations/communication.md)

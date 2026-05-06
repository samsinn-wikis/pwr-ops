---
type: procedure
procedure-md: 0.4
procedure-id: FR-C.1
title: Response to Inadequate Core Cooling
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-C.1 — Response to Inadequate Core Cooling

CSF core cooling RED path: core exit temperature exceeds saturation by
significant margin OR core uncovered. Maximum SI flow and depressurization
to recover core cooling.

## Step 1 [id: verify-icc]
Check: core exit thermocouples reading saturated or superheated AND reactor vessel level low
- Confirmed → #maximize-si
- Indications recovering → [[E-1]]

## Step 2 [id: maximize-si]
Action: start all SI pumps; depressurize RCS to maximize SI flow
Caution: rapid depressurization may worsen voiding; coordinate with operator judgment
- Core cooling restored → #verify-recovery
- Not restored → #emergency-bleed

## Step 3 [id: emergency-bleed]
Action: emergency feed-and-bleed using PORVs and SI
- Recovering → #verify-recovery
- Not recovering → [[FR-C.2]]

## Step 4 [id: verify-recovery]
Check: core exit subcooled AND reactor vessel level recovering
- Recovered → [[E-1]]
- Not recovered → #maximize-si

---
type: procedure
procedure-md: 0.4
procedure-id: ES-1.3
title: Transfer to Cold Leg Recirculation
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ES-1.3 — Transfer to Cold Leg Recirculation

Entered from [[E-1]] or [[ES-1.2]] when RWST level approaches low-low,
requiring transfer of SI suction from RWST to containment sump for
long-term recirculation cooling.

## Step 1 [id: verify-transfer-conditions]
Check: RWST level low-low alarm AND containment sump level sufficient
- Confirmed → #align-recirc-suction
- RWST level recovered → [[E-1]]

## Step 2 [id: align-recirc-suction]
Action: align low-pressure recirc pumps to containment sump suction
Caution: verify sump filters in service to prevent pump damage
- Aligned, recirc flow established → #transfer-high-pressure
- Cannot align → [[ECA-1.1]]

## Step 3 [id: transfer-high-pressure]
Action: align high-pressure SI suction to recirc loop discharge
- Aligned → #monitor-recirc
- Cannot align → [[ECA-1.1]]

## Step 4 [id: monitor-recirc]
Check: recirc flow stable, core cooling maintained
- Stable → [[ES-1.4]]
- Hot leg recirc needed → [[ES-1.4]]
- Recirc lost → [[ECA-1.1]]

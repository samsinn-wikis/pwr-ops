---
type: procedure
procedure-md: 0.4
procedure-id: ECA-1.1
title: Loss of Emergency Coolant Recirculation
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ECA-1.1 — Loss of Emergency Coolant Recirculation

Entered from [[ES-1.3]] or [[E-1]] when transfer to cold leg recirculation
fails. Restores recirculation capability or arranges alternative cooling.

## Step 1 [id: verify-recirc-failure]
Check: cold-leg recirc cannot be established (RWST level low, recirc valves not functioning, pump alignment failure)
- Confirmed → #attempt-restoration
- Recirc actually OK → [[ES-1.3]]

## Step 2 [id: attempt-restoration]
Action: align alternate recirculation flow path (containment spray pump as makeup, alternate suction)
- Successful → [[ES-1.3]]
- Unsuccessful → #core-cooling-fallback

## Step 3 [id: core-cooling-fallback]
Action: maximize available core cooling; manage RCS pressure to maintain SI flow
- Adequate cooling maintained → #monitor-recovery
- Inadequate → [[FR-C.1]]

## Step 4 [id: monitor-recovery]
Check: any recirculation path restored
- Restored → [[ES-1.3]]
- Not restored → #monitor-recovery

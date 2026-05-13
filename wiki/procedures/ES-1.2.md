---
type: procedure
procedure-md: 0.7
procedure-id: ES-1.2
title: Post-LOCA Cooldown and Depressurization
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ES-1.2 — Post-LOCA Cooldown and Depressurization

Entered from [[E-1]] or [[ES-1.1]] when post-LOCA cooldown to RHR
conditions is required while continuing to manage residual SI flow.

## Step 1 [id: verify-cooldown-conditions]
Check: stable RCS conditions, subcooling adequate, intact SGs available
- Conditions met → #initiate-cooldown
- Not met → [[E-1]]

## Step 2 [id: initiate-cooldown]
Action: cool down using intact SGs at allowable rate
- Cooldown progressing → #depressurize
- Inadequate heat sink → [[FR-H.1]]

## Step 3 [id: depressurize]
Action: depressurize RCS to enable RHR alignment
- RHR cut-in conditions reached → #transfer-to-recirc
- PTS concern → [[FR-P.1]]

## Step 4 [id: transfer-to-recirc]
Check: RWST level approaching low-low setpoint
- Transfer needed → [[ES-1.3]]
- RWST OK, continue cooldown → END

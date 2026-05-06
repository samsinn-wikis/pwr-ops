---
type: procedure
procedure-md: 0.5
procedure-id: FR-Z.3
title: Response to High Containment Radiation
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-Z.3 — Response to High Containment Radiation

CSF containment YELLOW path: containment radiation high, indicating
fuel damage or significant primary leakage into containment.

## Step 1 [id: verify-high-radiation]
Check: containment radiation monitors above alert threshold
- Confirmed → #identify-source
- Spurious / false → [[E-0]]

## Step 2 [id: identify-source]
Check: source consistent with fuel damage vs primary leakage
- Fuel damage indicated → #ensure-isolation
- Primary leakage only → [[E-1]]

## Step 3 [id: ensure-isolation]
Action: verify containment isolation complete; coordinate offsite emergency response
Caution: declare emergency action level per EAL matrix
- Isolated → [[FR-Z.1]]
- Not fully isolated → [[FR-Z.1]]

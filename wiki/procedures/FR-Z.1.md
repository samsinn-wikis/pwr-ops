---
type: procedure
procedure-md: 0.2
procedure-id: FR-Z.1
title: Response to High Containment Pressure
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-Z.1 — Response to High Containment Pressure

CSF containment RED path: containment pressure approaching design limit.
Activate containment spray and verify isolation.

## Step 1 [id: verify-high-pressure]
Check: containment pressure above containment-spray actuation setpoint
- Confirmed → #verify-isolation
- False → [[E-0]]

## Step 2 [id: verify-isolation]
Check: containment isolation Phase A and Phase B complete
Action: if not verified, manually initiate isolation
- Verified or manually initiated → #verify-spray

## Step 3 [id: verify-spray]
Check: containment spray pumps running, spray flow established
Action: if not verified, manually start spray
- Spray established → #monitor
- Cannot start spray → [[FR-Z.2]]

## Step 4 [id: monitor]
Check: containment pressure trend
- Decreasing → [[E-0]]
- Continuing to rise → [[FR-Z.2]]

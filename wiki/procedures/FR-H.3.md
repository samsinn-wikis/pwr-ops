---
type: procedure
procedure-md: 0.7
procedure-id: FR-H.3
title: Response to Steam Generator High Level
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-H.3 — Response to Steam Generator High Level

CSF heat sink YELLOW path: SG level high (potential turbine overfill,
moisture carryover, or SGTR indication).

## Step 1 [id: verify-high-level]
Check: any SG level above high-high setpoint
- Confirmed → #identify-cause
- False → [[E-0]]

## Step 2 [id: identify-cause]
Check: cause of high level
- AFW overfeed → #stop-overfeed
- SGTR indications → [[E-3]]
- Other → #stop-overfeed

## Step 3 [id: stop-overfeed]
Action: throttle or stop AFW to affected SG; verify level controlling
- Stable → [[E-0]]
- Not stable → [[FR-H.5]]

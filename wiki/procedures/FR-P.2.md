---
type: procedure
procedure-md: 0.4
procedure-id: FR-P.2
title: Response to Anticipated Pressurized Thermal Shock Condition
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-P.2 — Response to Anticipated Pressurized Thermal Shock Condition

CSF RCS integrity ORANGE path: RCS conditions trending toward PTS
challenge but not yet imminent. Limit cooldown rate to prevent escalation.

## Step 1 [id: verify-trend]
Check: RCS pressure / temperature trends within PTS curve but trending toward limits
- Confirmed → #limit-rate
- Off-trajectory → [[E-0]]

## Step 2 [id: limit-rate]
Action: limit cooldown rate to within PTS limits; throttle SI flow
- Stabilized → #monitor
- Trajectory worsening → [[FR-P.1]]

## Step 3 [id: monitor]
Check: RCS conditions vs PTS curve
- Recovered → [[E-0]]
- Imminent challenge → [[FR-P.1]]

---
type: procedure
procedure-md: 0.7
procedure-id: ES-0.2
title: Natural Circulation Cooldown
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ES-0.2 — Natural Circulation Cooldown

Entered from [[ES-0.1]], [[ECA-2.1]], or [[ECA-0.0]] (after AC restoration)
when forced flow is unavailable but cooldown to cold shutdown is required.

## Step 1 [id: verify-natural-circ]
Check: natural circulation flow established (Tcold trends, hot leg temperatures)
- Established → #begin-cooldown
- Not established → [[FR-C.2]]

## Step 2 [id: begin-cooldown]
Action: begin cooldown via SG steam release at allowable rate
Within: maintain Tech Spec cooldown rate (typically ≤100°F/hr)
- Progressing → #depressurize-rcs
- Cooldown stalls → [[FR-H.1]]

## Step 3 [id: depressurize-rcs]
Action: depressurize RCS using pressurizer auxiliary spray or PORV per procedures
- Progressing toward cold shutdown → #monitor-cooldown
- Loss of pressurizer pressure control → [[ECA-3.3]]

## Step 4 [id: monitor-cooldown]
Check: cooldown trajectory
- Cold shutdown reached → END
- Continuing → #monitor-cooldown
- PTS concern → [[FR-P.2]]

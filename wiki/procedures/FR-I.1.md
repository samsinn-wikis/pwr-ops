---
type: procedure
procedure-md: 0.3
procedure-id: FR-I.1
title: Response to High Pressurizer Level
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-I.1 — Response to High Pressurizer Level

CSF RCS inventory ORANGE path: pressurizer level approaching solid (water
solid pressurizer challenges pressure control).

## Step 1 [id: verify-high-level]
Check: pressurizer level rising toward upper limit
- Confirmed → #reduce-makeup
- False → [[E-0]]

## Step 2 [id: reduce-makeup]
Action: throttle charging; increase letdown if available; throttle SI if running
- Level controlled → #monitor
- Cannot reduce → [[FR-P.1]]

## Step 3 [id: monitor]
Check: pressurizer level stable
- Stable → [[E-0]]
- Solid pressurizer → [[FR-P.1]]

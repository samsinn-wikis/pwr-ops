---
type: procedure
procedure-md: 0.2
procedure-id: FR-I.2
title: Response to Low Pressurizer Level
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-I.2 — Response to Low Pressurizer Level

CSF RCS inventory ORANGE path: pressurizer level dropping toward off-scale
(loss of pressure control on low side, possible LOCA precursor).

## Step 1 [id: verify-low-level]
Check: pressurizer level dropping toward lower limit
- Confirmed → #increase-makeup
- False → [[E-0]]

## Step 2 [id: increase-makeup]
Action: maximize charging; reduce letdown; verify SI status
- Level recovering → #monitor
- Not recovering → [[E-1]]

## Step 3 [id: monitor]
Check: pressurizer level and RCS pressure trends
- Stable → [[E-0]]
- LOCA developing → [[E-1]]
- Voids forming → [[FR-I.3]]

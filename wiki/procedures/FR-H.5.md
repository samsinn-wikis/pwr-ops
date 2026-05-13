---
type: procedure
procedure-md: 0.6
procedure-id: FR-H.5
title: Response to Steam Generator Low Level
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-H.5 — Response to Steam Generator Low Level

CSF heat sink YELLOW path: SG level low and trending lower; precursor
to loss of secondary heat sink if not corrected.

## Step 1 [id: verify-low-level]
Check: any SG level below low setpoint and trending down
- Confirmed → #restore-feedwater
- Recovered → [[E-0]]

## Step 2 [id: restore-feedwater]
Action: increase AFW flow to affected SG; verify level recovery
- Recovering → #monitor
- Not recovering → [[FR-H.1]]

## Step 3 [id: monitor]
Check: SG level trends
- Stable above low setpoint → [[E-0]]
- Continued degradation → [[FR-H.1]]

---
type: procedure
procedure-md: 0.4
procedure-id: FR-C.3
title: Response to Saturated Core Cooling Conditions
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-C.3 — Response to Saturated Core Cooling Conditions

CSF core cooling YELLOW path: RCS saturated but core remains covered.
Manage cooling to prevent further degradation toward inadequate core
cooling.

## Step 1 [id: verify-saturation]
Check: RCS saturated (no subcooling margin) AND core remains covered
- Confirmed → #manage-saturation
- Subcooling restored → [[E-1]]

## Step 2 [id: manage-saturation]
Action: maintain SI; avoid actions that further reduce inventory
- Stable saturated cooling → #monitor
- Degrading → [[FR-C.2]]

## Step 3 [id: monitor]
Check: subcooling restoration
- Subcooled → [[E-1]]
- Stable saturated → #monitor
- Degraded → [[FR-C.2]]

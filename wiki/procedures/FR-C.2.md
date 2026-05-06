---
type: procedure
procedure-md: 0.2
procedure-id: FR-C.2
title: Response to Degraded Core Cooling
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-C.2 — Response to Degraded Core Cooling

CSF core cooling ORANGE path: core cooling degraded but core not yet
uncovered. Restore subcooling before degradation progresses.

## Step 1 [id: verify-degradation]
Check: core exit temperatures rising, subcooling margin reduced, vessel level dropping
- Confirmed → #increase-flow
- Recovered → [[E-1]]

## Step 2 [id: increase-flow]
Action: maximize SI flow; restart RCPs if conditions permit
- Subcooling restored → #verify-recovery
- Continuing to degrade → [[FR-C.1]]

## Step 3 [id: verify-recovery]
Check: subcooling margin restored AND temperatures stable
- Yes → [[E-1]]
- No → [[FR-C.1]]

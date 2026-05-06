---
type: procedure
procedure-md: 0.5
procedure-id: FR-Z.2
title: Response to Containment Flooding
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-Z.2 — Response to Containment Flooding

CSF containment ORANGE path: containment sump level high, suggesting
significant LOCA inventory release or containment spray over-fill.

## Step 1 [id: verify-flooding]
Check: containment sump level above expected post-LOCA level
- Confirmed → #identify-source
- False → [[E-0]]

## Step 2 [id: identify-source]
Check: source of inventory in containment
- LOCA → [[E-1]]
- Spray over-fill → #stop-spray
- Other → #stop-spray

## Step 3 [id: stop-spray]
Action: throttle containment spray; align spray suction to sump if possible
- Stable → [[E-0]]
- Continuing to rise → [[ES-1.3]]

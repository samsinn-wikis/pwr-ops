---
type: procedure
procedure-md: 0.7
procedure-id: FR-H.4
title: Response to Loss of Normal Steam Release Capabilities
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-H.4 — Response to Loss of Normal Steam Release Capabilities

CSF heat sink YELLOW path: normal steam release (condenser steam dump)
unavailable; must use atmospheric relief or risk overpressurization.

## Step 1 [id: verify-loss]
Check: condenser steam dump unavailable
- Confirmed → #use-atmospheric
- Available → [[E-0]]

## Step 2 [id: use-atmospheric]
Action: align atmospheric relief valves for steam release
- Aligned → #monitor
- Cannot align → [[FR-H.2]]

## Step 3 [id: monitor]
Check: SG pressures stable, cooldown rate per Tech Specs
- Stable → [[E-0]]
- Pressures rising → [[FR-H.2]]

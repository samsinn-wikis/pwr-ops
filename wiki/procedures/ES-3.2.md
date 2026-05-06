---
type: procedure
procedure-md: 0.5
procedure-id: ES-3.2
title: Post-SGTR Cooldown Using Blowdown
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ES-3.2 — Post-SGTR Cooldown Using Blowdown

Entered from [[E-3]], [[ECA-3.2]], or [[ES-3.1]] when ruptured SG must
be blown down (via condensate or to atmosphere) to manage inventory
during cooldown.

## Step 1 [id: align-blowdown]
Check: blowdown path available and radiation release within limits
- Available → #initiate-blowdown
- Not available → [[ES-3.3]]

## Step 2 [id: initiate-blowdown]
Action: blow down ruptured SG to control level and pressure during cooldown
Caution: monitor radiological release; throttle if release approaches limits
- Controlled → #cooldown
- Release exceeds limits → [[FR-Z.3]]

## Step 3 [id: cooldown]
Action: cool down using intact SGs while maintaining ruptured SG inventory control
- Cooldown complete → END
- Cooldown stalled → [[FR-H.1]]

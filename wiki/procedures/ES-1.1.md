---
type: procedure
procedure-md: 0.5
procedure-id: ES-1.1
title: SI Termination
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ES-1.1 — SI Termination

Entered from [[E-1]] when SI termination criteria are met (subcooling
adequate, pressurizer level recovered, RCS pressure stable). Terminates
SI and restores normal RCS makeup.

## Step 1 [id: verify-termination-criteria]
Check: subcooling ≥ minimum AND pressurizer level on-scale AND RCS pressure stable AND SG levels controlled
- All met → #terminate-si
- Any not met → [[E-1]]

## Step 2 [id: terminate-si]
Action: stop SI pumps; isolate SI flow paths; restore normal charging and letdown
Caution: re-establish SI immediately if any termination criterion is lost
- Successful → #stabilize
- Conditions degraded after termination → [[E-1]]

## Step 3 [id: stabilize]
Action: stabilize at hot standby with normal makeup
- Stable → [[ES-0.1]]
- Cooldown required → [[ES-1.2]]

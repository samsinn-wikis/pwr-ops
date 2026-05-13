---
type: procedure
procedure-md: 0.6
procedure-id: ES-3.3
title: Post-SGTR Cooldown Using Steam Dump
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ES-3.3 — Post-SGTR Cooldown Using Steam Dump

Entered from [[E-3]], [[ECA-3.3]], or [[ES-3.2]] when normal cooldown
paths are unavailable and steam dump (to condenser or atmosphere) is the
only available heat removal path.

## Step 1 [id: align-steam-dump]
Check: steam dump path available (condenser available preferred; atmospheric otherwise)
- Condenser available → #cooldown-via-condenser
- Only atmospheric → #cooldown-via-atmosphere

## Step 2 [id: cooldown-via-condenser]
Action: cool down via condenser steam dump
- Progressing → #monitor
- Lost → #cooldown-via-atmosphere

## Step 3 [id: cooldown-via-atmosphere]
Action: cool down via atmospheric relief valves
Caution: atmospheric release of ruptured-SG steam carries radioactive material; coordinate with offsite emergency response
- Progressing → #monitor
- Cannot maintain cooldown → [[FR-H.1]]

## Step 4 [id: monitor]
Check: cooldown complete to RHR conditions
- Complete → END
- Stalled → [[FR-H.1]]

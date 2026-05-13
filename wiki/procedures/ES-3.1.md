---
type: procedure
procedure-md: 0.6
procedure-id: ES-3.1
title: Post-SGTR Cooldown Using Backfill
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ES-3.1 — Post-SGTR Cooldown Using Backfill

Entered from [[E-3]] or [[ECA-3.1]] when SGTR leak is terminated and
ruptured SG can be backfilled to control its inventory while cooldown
proceeds via intact SGs.

## Step 1 [id: confirm-leak-terminated]
Check: RCS pressure ≤ ruptured SG pressure AND no continued primary-to-secondary leakage
- Confirmed → #initiate-backfill
- Leak continuing → [[ECA-3.1]]

## Step 2 [id: initiate-backfill]
Action: backfill ruptured SG via condensate / aux feedwater to control level
- Level controlled → #cooldown
- Cannot backfill → [[ES-3.2]]

## Step 3 [id: cooldown]
Action: cool down using intact SGs to RHR conditions
- Cooldown complete → END
- Stalled → [[FR-H.1]]

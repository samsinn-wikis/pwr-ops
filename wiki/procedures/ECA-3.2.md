---
type: procedure
procedure-md: 0.4
procedure-id: ECA-3.2
title: SGTR with Loss of Reactor Coolant — Saturated Recovery
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ECA-3.2 — SGTR with Loss of Reactor Coolant — Saturated Recovery

Entered from [[E-3]] or [[ECA-3.1]] when SGTR with inventory loss has
progressed to saturated RCS conditions. Establishes saturated cooldown
path to terminate primary-to-secondary leakage.

## Step 1 [id: confirm-saturated]
Check: RCS saturated (no subcooling margin, pressurizer level low or empty)
- Confirmed → #stabilize-inventory
- Subcooling restored → [[ECA-3.1]]

## Step 2 [id: stabilize-inventory]
Action: maintain SI flow; allow RCS pressure to track ruptured SG pressure
- Stable → #cooldown-saturated
- Inventory loss continuing → [[FR-C.1]]

## Step 3 [id: cooldown-saturated]
Action: cool down using intact SGs at maximum allowable rate
- Cooldown achieved → [[ES-3.2]]
- Cooldown not progressing → [[ECA-3.3]]

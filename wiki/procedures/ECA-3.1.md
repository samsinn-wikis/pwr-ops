---
type: procedure
procedure-md: 0.2
procedure-id: ECA-3.1
title: SGTR with Loss of Reactor Coolant — Subcooled Recovery
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ECA-3.1 — SGTR with Loss of Reactor Coolant — Subcooled Recovery

Entered from [[E-3]] when SGTR coexists with significant LOCA-style
inventory loss but RCS remains subcooled. Cooldown via subcooled path
to terminate primary-to-secondary leakage.

## Step 1 [id: verify-subcooled]
Check: RCS subcooling margin adequate AND pressurizer level recoverable
- Subcooled → #initiate-cooldown
- Saturated → [[ECA-3.2]]

## Step 2 [id: initiate-cooldown]
Action: cool down using intact SGs while controlling pressurizer pressure
Within: 60 minutes
- Cooldown on schedule → #depressurize
- Cooldown lagging → [[ECA-3.2]]

## Step 3 [id: depressurize]
Action: depressurize RCS below ruptured SG pressure to terminate leak
- Leak terminated → [[ES-3.1]]
- Cannot depressurize → [[ECA-3.3]]

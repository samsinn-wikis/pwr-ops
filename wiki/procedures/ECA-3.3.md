---
type: procedure
procedure-md: 0.2
procedure-id: ECA-3.3
title: SGTR Without Pressurizer Pressure Control
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ECA-3.3 — SGTR Without Pressurizer Pressure Control

Entered from [[E-3]], [[ECA-3.1]], or [[ECA-3.2]] when pressurizer
pressure cannot be controlled (failed PORV, lost pressurizer heaters).
Manages SGTR without normal pressure control mechanisms.

## Step 1 [id: verify-pressure-control-loss]
Check: pressurizer pressure cannot be controlled by normal means
- Confirmed → #use-steam-dump
- Pressure control restored → [[E-3]]

## Step 2 [id: use-steam-dump]
Action: control RCS pressure via SG steam dump and SI flow modulation
Caution: balance leak termination against RCS overcooling
- Pressure controllable → #cooldown-via-steam-dump
- Cannot control → [[FR-P.1]]

## Step 3 [id: cooldown-via-steam-dump]
Action: cooldown using intact SG steam dump while managing ruptured SG inventory
- Recovery progressing → [[ES-3.3]]
- Conditions degrading → [[FR-C.1]]

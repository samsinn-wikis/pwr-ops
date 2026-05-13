---
type: procedure
procedure-md: 0.7
procedure-id: ES-0.1
title: Reactor Trip Response
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ES-0.1 — Reactor Trip Response

Entered from [[E-0]] when post-trip plant conditions are stable with no
LOCA, no SGTR, no faulted SG. Stabilizes the plant in hot standby and
prepares for cooldown if needed.

## Step 1 [id: verify-stable-conditions]
Check: RCS pressure stable, pressurizer level controlled, SG levels controlled, no abnormal radiation
- Stable → #stabilize-hot-standby
- Not stable → [[ES-0.0]]

## Step 2 [id: stabilize-hot-standby]
Action: establish hot standby — maintain Tavg at no-load, control pressurizer pressure and level
- Hot standby achieved → #determine-recovery-path
- Cannot stabilize → [[ES-0.0]]

## Step 3 [id: determine-recovery-path]
Check: recovery objective per Operations
- Restart desired, no equipment problems → END
- Cooldown to cold shutdown → [[ES-0.2]]
- Loss of normal heat sink → [[FR-H.1]]

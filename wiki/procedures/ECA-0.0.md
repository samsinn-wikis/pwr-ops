---
type: procedure
procedure-md: 0.3
procedure-id: ECA-0.0
title: Loss of All AC Power
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ECA-0.0 — Loss of All AC Power

Station blackout: entered from [[E-0]] when no AC emergency bus is
energized. Maintains core cooling via turbine-driven AFW and natural
circulation until AC restoration.

## Step 1 [id: verify-blackout]
Check: all 4kV emergency buses de-energized
- Confirmed → #establish-tdafw
- AC available on at least one bus → [[E-0]]

## Step 2 [id: establish-tdafw]
Action: verify turbine-driven AFW pump running; isolate non-essential DC loads
- TDAFW running, SG levels recovering → #natural-circulation
- TDAFW failed → [[FR-H.1]]

## Step 3 [id: natural-circulation]
Check: natural circulation flow established (Tcold trends, hot leg temperatures)
Until: AC power restored
- Natural circulation OK → #wait-for-ac
- Lost → [[FR-C.1]]

## Step 4 [id: wait-for-ac]
Check: AC power restoration status
- AC restored → [[ES-0.1]]
- AC not restored, conditions stable → #wait-for-ac
- Conditions degrading → [[FR-C.1]]

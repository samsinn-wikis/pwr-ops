---
type: procedure
procedure-md: 0.2
procedure-id: FR-P.1
title: Response to Imminent Pressurized Thermal Shock Condition
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-P.1 — Response to Imminent Pressurized Thermal Shock Condition

CSF RCS integrity RED path: RCS conditions on a trajectory that will
challenge reactor vessel integrity (rapid cold injection at high pressure).

## Step 1 [id: verify-pts-trajectory]
Check: RCS pressure high AND Tcold dropping rapidly (trajectory crosses PTS limit curve)
- Confirmed → #limit-cooldown
- Off-trajectory → [[E-0]]

## Step 2 [id: limit-cooldown]
Action: stop or throttle SI; warm RCS using pressurizer heaters; isolate cold injection paths
Caution: balance PTS prevention against core cooling needs
- Trajectory recovering → #verify-recovery
- Cannot recover → [[FR-P.2]]

## Step 3 [id: verify-recovery]
Check: RCS off PTS-challenge trajectory
- Recovered → [[E-0]]
- Still challenged → [[FR-P.2]]

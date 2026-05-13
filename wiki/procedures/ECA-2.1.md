---
type: procedure
procedure-md: 0.7
procedure-id: ECA-2.1
title: Uncontrolled Depressurization of All Steam Generators
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ECA-2.1 — Uncontrolled Depressurization of All Steam Generators

Entered from [[E-2]] when faulted-SG isolation is impossible because all
SGs are depressurizing (e.g. main steam header break upstream of MSIVs).
Manages excessive RCS cooldown and arranges alternative heat sink.

## Step 1 [id: confirm-all-sg-depress]
Check: all SG pressures decreasing simultaneously, no isolatable break point
- Confirmed → #limit-cooldown
- Single SG faulted → [[E-2]]

## Step 2 [id: limit-cooldown]
Action: trip RCPs to limit forced-cooldown rate; isolate any closeable steam path
Caution: excessive RCS cooldown may cause pressurized thermal shock
- Cooldown limited → #manage-rcs
- Excessive cooldown → [[FR-P.1]]

## Step 3 [id: manage-rcs]
Action: maintain RCS inventory; manage SI to prevent overpressurization on cold restart
- Stable → #monitor-recovery
- LOCA also developing → [[E-1]]

## Step 4 [id: monitor-recovery]
Check: SG conditions and RCS status
- Recoverable, intact SG identified → [[E-2]]
- Long-term cooling needed → [[ES-0.2]]

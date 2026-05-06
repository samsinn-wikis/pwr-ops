---
type: procedure
procedure-md: 0.5
procedure-id: FR-I.3
title: Response to Voids in Reactor Vessel
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-I.3 — Response to Voids in Reactor Vessel

CSF RCS inventory YELLOW path: voids forming in reactor vessel head or
upper plenum (indicates inventory loss or inadequate makeup).

## Step 1 [id: verify-voids]
Check: reactor vessel level indication shows voiding above core OR head vent activity indicates voids
- Confirmed → #vent-voids
- False → [[E-0]]

## Step 2 [id: vent-voids]
Action: open reactor vessel head vent if available; restore subcooling via SI
- Voids vented, subcooling restored → #monitor
- Cannot vent or subcool → [[FR-C.2]]

## Step 3 [id: monitor]
Check: vessel level recovery
- Recovered → [[E-0]]
- Continuing voiding → [[FR-C.1]]

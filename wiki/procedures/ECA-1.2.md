---
type: procedure
procedure-md: 0.1
procedure-id: ECA-1.2
title: LOCA Outside Containment
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ECA-1.2 — LOCA Outside Containment

Entered from [[E-1]] when LOCA symptoms exist but containment pressure
and sump level are NOT rising — indicates a leak path bypassing
containment (interfacing system LOCA, instrument line break outside
containment).

## Step 1 [id: identify-leak-location]
Check: which system shows abnormal flow / pressure / level outside containment
- Located → #isolate-leak
- Not located → [[ES-0.0]]

## Step 2 [id: isolate-leak]
Action: isolate the leaking system at the closest accessible boundary valve
- Leak isolated → [[E-1]]
- Cannot isolate → #limit-leak-impact

## Step 3 [id: limit-leak-impact]
Action: minimize SI flow into the leak path while maintaining core cooling
Caution: balance core cooling needs against radiological release outside containment
- Stabilized → #monitor
- Cannot stabilize → [[FR-C.1]]

## Step 4 [id: monitor]
Check: leak rate and core cooling status
- Leak isolated or stopped → [[E-1]]
- Continuing → #monitor

---
type: procedure
procedure-md: 0.1
procedure-id: FR-H.2
title: Response to Steam Generator Overpressure
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-H.2 — Response to Steam Generator Overpressure

CSF heat sink ORANGE path: SG pressure exceeds safety valve setpoint
without relief, or relief valves stuck closed.

## Step 1 [id: verify-overpressure]
Check: any SG pressure approaching or above safety valve setpoint
- Confirmed → #relieve-pressure
- False → [[E-0]]

## Step 2 [id: relieve-pressure]
Action: open atmospheric relief valves; if unavailable, manually open safety valves locally
- Pressure relieving → #monitor
- Cannot relieve → [[FR-Z.1]]

## Step 3 [id: monitor]
Check: SG pressure trends and structural integrity
- Stable → [[E-0]]
- Failure indicated → [[E-2]]

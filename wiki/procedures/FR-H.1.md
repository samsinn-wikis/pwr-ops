---
type: procedure
procedure-md: 0.2
procedure-id: FR-H.1
title: Response to Loss of Secondary Heat Sink
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-H.1 — Response to Loss of Secondary Heat Sink

CSF heat sink RED path: total loss of feedwater (main and AFW) to all
SGs. Establish bleed-and-feed cooling via PORVs and SI as alternative
heat removal.

## Step 1 [id: verify-loss]
Check: no feedwater flow to any SG AND SG levels below low-low setpoint
- Confirmed → #establish-bleed-feed
- AFW recoverable → #restore-afw

## Step 2 [id: restore-afw]
Action: restore AFW from any available source (TDAFW, motor-driven, alternate)
- Restored → [[E-0]]
- Not restored → #establish-bleed-feed

## Step 3 [id: establish-bleed-feed]
Action: open pressurizer PORVs; maximize SI flow (feed-and-bleed cooling)
Caution: PORV-and-SI cooling is a last-resort path; significant inventory loss expected
- Established → #verify-cooling
- Cannot establish → [[FR-C.1]]

## Step 4 [id: verify-cooling]
Check: core temperatures stable or decreasing
- Stable → #monitor
- Rising → [[FR-C.1]]

## Step 5 [id: monitor]
Check: feedwater restoration
- AFW restored → [[E-0]]
- Continuing on bleed-and-feed → #monitor

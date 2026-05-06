---
type: procedure
procedure-md: 0.5
procedure-id: ES-1.4
title: Transfer to Hot Leg Recirculation
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ES-1.4 — Transfer to Hot Leg Recirculation

Entered from [[ES-1.3]] approximately 8-24 hours after a cold-leg break
LOCA, to flush boric acid accumulation from the core by reversing the
recirculation flow path.

## Step 1 [id: verify-transfer-time]
Check: time since LOCA AND boric acid concentration trends in core
- Transfer time reached → #align-hot-leg
- Not yet required → [[ES-1.3]]

## Step 2 [id: align-hot-leg]
Action: realign recirc flow to hot-leg injection path
Caution: maintain at least one cold-leg recirc path during transfer
- Aligned → #monitor-hot-leg-recirc
- Cannot align → [[ECA-1.1]]

## Step 3 [id: monitor-hot-leg-recirc]
Check: hot-leg recirc flow established, core temperatures responding
- Stable long-term cooling → END
- Lost → [[ECA-1.1]]

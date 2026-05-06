---
type: procedure
procedure-md: 0.4
procedure-id: FR-S.2
title: Response to Loss of Core Shutdown
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# FR-S.2 — Response to Loss of Core Shutdown

CSF subcriticality ORANGE path: shutdown margin questionable; core may
be approaching critical due to dilution or inadequate boron concentration.

## Step 1 [id: verify-margin-loss]
Check: shutdown margin trending toward zero (boron concentration, source range count rate)
- Confirmed → #stop-dilution
- False alarm → [[E-0]]

## Step 2 [id: stop-dilution]
Action: stop any unborated water addition to RCS; isolate dilution sources
- Stopped → #boration
- Cannot identify source → #boration

## Step 3 [id: boration]
Action: borate to achieve adequate shutdown margin
- Margin restored → [[E-0]]
- Margin not restored → [[FR-S.1]]

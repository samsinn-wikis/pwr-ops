---
type: procedure
procedure-md: 0.6
procedure-id: ES-0.0
title: Rediagnosis
profile: nuclear-erg
applies-to: Westinghouse 4-loop PWR
---

# ES-0.0 — Rediagnosis

Entered from [[E-0]] or any E-series procedure when initial diagnosis
cannot be confirmed. Provides expanded symptom checks and re-routes to
the correct event-specific procedure.

## Step 1 [id: re-check-symptoms]
Check: full symptom set (RCS pressure, containment pressure, SG levels and pressures, radiation, sump levels)
- LOCA confirmed → [[E-1]]
- Faulted SG confirmed → [[E-2]]
- SGTR confirmed → [[E-3]]
- All AC lost → [[ECA-0.0]]
- No event identifiable, plant stable → [[ES-0.1]]
- Conditions deteriorating → #emergency-fallback

## Step 2 [id: emergency-fallback]
Action: maintain all safety injection and AFW; declare emergency action level per EAL matrix
- Stabilized → #re-check-symptoms
- Critical safety function challenged → [[FR-S.1]]

---
type: hf-time-pressure-profile
hf-id: time-pressure-sbo
title: Time-pressure profile — Station Blackout
applies-to: Westinghouse-style 4-loop PWR
sources: [nureg-cr-6883, oecd-nea-csni-r-2014-6, iaea-ns-g-2-14]
---

# Time-pressure profile — Station Blackout

Station Blackout (SBO) is structurally unlike LOCA-family events:
the plant is largely intact, but the *team's tools* are degraded.
AC-powered instrumentation is unavailable except for vital-DC-
powered channels; the control room is in reduced-lighting mode;
turbine-driven AFW is the only feed source. Time pressure is
extended (hours, not minutes) but cognitive load is sustained
across that whole window.

## Phase 0–5 min — recognition + reactor trip

- **Crew load**: high. LOSP triggers automatic reactor trip; DG
  start signals fire but both DGs fail to start (or fail to
  load); buses A and B remain de-energized.
- **Decisions made**: confirm reactor trip; verify TDAFW
  actuation; establish on the very-limited DC-powered indication
  what is available.
- **Failure modes most likely**: orientation collapse — the
  control room has just become a different place. Most of the
  procedures the crew is trained on assume AC-powered indications.

## Phase 5–60 min — establish + sustain

- **Crew load**: high, sustained. [[ECA-0.0]] is in effect. TDAFW
  is feeding; natural circulation is established or being verified;
  battery load-shed has begun to extend DC capacity. The crew
  rations its attention across feed verification, RCS-temperature
  monitoring (via available CETs), and offsite-restoration
  coordination.
- **Decisions made**: load-shed schedule; auxiliary operator
  dispatch to manual ARV operation; FLEX portable diesel
  preparation; EAL classification timeline (HU1 at 15 min, HA1
  at 30 min, HS1 at 1 hour).
- **Failure modes most likely**: lapses on time-driven tasks
  (load-shed checkpoints, EAL re-classification). The DC battery
  coping window is finite; missing a load-shed step shortens it.

## Phase 60–240 min — endurance

- **Crew load**: moderate but **unrelenting**. The team must
  sustain TDAFW operation and natural-circulation cooling for
  hours; physical fatigue and crew rotation become factors.
  EAL is at SAE or escalating toward GE.
- **Decisions made**: FLEX equipment connection; coordination with
  offsite response organisations; potential transition to severe
  accident management guidelines if cooldown cannot be restored.
- **Failure modes most likely**: vigilance erosion; cross-shift
  loss of mental model; potential violations under fatigue.
- **HF concerns**: crew rotation discipline becomes the dominant
  factor. The pre-existing shift turnover protocol must execute
  even though the plant is in emergency mode.

## What's unique about SBO HF

Most EOP failure-mode analysis assumes a 0–120 minute event window.
SBO breaks that assumption. The HF profile must include:

- **Multi-shift continuity** — the team running the event at
  *t* = 6 hours is not the team that started it.
- **Reduced instrument trust** — DC-powered channels are working
  but the operator's mental model is calibrated to AC-powered
  routine indications.
- **Degraded communication infrastructure** — the plant's normal
  telephone and PA systems may be on AC; backup systems require
  practiced use.

## Procedures by phase

| Phase | Active procedure(s) |
|---|---|
| 0–5 min | [[E-0]] |
| 5–60 min | [[ECA-0.0]] |
| 60–240 min | [[ECA-0.0]] sustained + FLEX integration |
| Beyond | transition to recovery once any AC source restored |

## Cross-reference

- [Conservative decision-making](../operations/conservative-decision-making.md)
- [Configuration control](../operations/configuration-control.md)
- [HF failure mode taxonomy](hf-failure-modes-taxonomy.md)

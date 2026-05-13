---
type: hf-time-pressure-profile
hf-id: time-pressure-loca
title: Time-pressure profile — Loss-of-Coolant Accident
applies-to: Westinghouse-style 4-loop PWR
sources: [nureg-cr-6883, nureg-cr-6753, oecd-nea-csni-r-2014-6]
---

# Time-pressure profile — LOCA

Operator workload and decision tempo during a LOCA evolve sharply
across the first two hours. The crew's cognitive bandwidth budget
is reset by each transition. EOP authoring assumes this profile;
training validates against it.

## Phase 0–5 min — recognition + automatic protection

- **Crew load**: maximum. Reactor trip + SI just actuated; control
  room alarms cascading; multiple parameters changing
  simultaneously.
- **Decisions made**: verify trip + turbine trip occurred (E-0
  steps 1–2); verify AC electrical alignment (step 3); verify SI
  actuation (step 4); identify event class (LOCA vs faulted SG
  vs SBO).
- **Failure modes most likely**: slips (wrong-switch errors in
  rapid manipulation), lapses (skipped verify step). Mistakes are
  rare here because the team is following a heavily trained
  checklist.
- **HF concerns**: alarm load saturates working memory. The team
  relies on the procedure structure to deliberately filter what
  matters.

## Phase 5–30 min — diagnosis + initial response

- **Crew load**: high but more structured. E-0 transitions to a
  specific E-series procedure (E-1 for LOCA, E-2 for steam-line
  break, E-3 for SGTR). Recovery flow begins.
- **Decisions made**: classify break size (small vs large vs
  outside containment); evaluate RCP-trip criterion; verify ECCS
  flow; assess containment status.
- **Failure modes most likely**: mistakes. The diagnostic
  questions are non-trivial; the team is past the checklist phase
  and into evaluating evidence.
- **HF concerns**: confirmation bias on the early diagnosis.
  Symptoms may evolve away from the initial hypothesis; the team
  must remain open to re-classifying.

## Phase 30–120 min — recovery + transition

- **Crew load**: declining. SI is stable; the team works through
  the ES-series recovery (ES-1.1, ES-1.2, ES-1.3 for cold-leg
  recirculation transfer).
- **Decisions made**: RWST level monitoring; recirculation
  transfer; long-term cooldown planning; emergency response
  organisation coordination; EAL classification updates.
- **Failure modes most likely**: violations (perceived time
  available encourages cutting corners); lapses on coordination
  tasks. The acute phase is over but vigilance must hold.
- **HF concerns**: vigilance erosion. Crew rotation may begin
  for events extending into the second shift.

## Procedures by phase

| Phase | Active procedure(s) |
|---|---|
| 0–5 min | [[E-0]] |
| 5–30 min | [[E-1]] (for LOCA), with FR-x branches as needed |
| 30–120 min | [[ES-1.1]] / [[ES-1.2]] / [[ES-1.3]] / [[ES-1.4]] |
| Beyond | recovery to cold shutdown via shutdown cooling |

## Cross-reference

- [Action class: trip RCPs under voiding](hf-action-trip-rcps-under-voiding.md)
- [Action class: manual SI actuation](hf-action-manual-si-actuation.md)
- [HF failure mode taxonomy](hf-failure-modes-taxonomy.md)

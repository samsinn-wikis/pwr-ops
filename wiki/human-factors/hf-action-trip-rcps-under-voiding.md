---
type: hf-action-class
hf-id: trip-rcps-under-voiding
title: Action class — trip RCPs under RCS voiding
applies-to: Westinghouse-style 4-loop PWR
sources: [nureg-cr-6883, nureg-cr-6753, oecd-nea-csni-r-2014-6]
---

# Action class: trip RCPs under RCS voiding

The decision to trip running Reactor Coolant Pumps after a LOCA
has begun is one of the most consequential operator actions in the
EOP set. Trip too early and the lost forced flow worsens the
inventory loss; trip too late and the pumps cavitate, with potential
shaft-seal failure and additional break-equivalent flow.

The decision predicate is **RCS subcooling margin**: trip RCPs once
subcooling drops below the protective threshold (nominal 30 °F per
Vogtle UFSAR §15.6) while voiding is being established. Once
voiding is confirmed and the pumps have stopped, do not restart
them until subcooling is restored.

## Typical execution time

- **Cognitive**: 10–30 s once the subcooling indication crosses
  threshold. The operator must distinguish a real subcooling loss
  from instrument noise.
- **Motor**: ~5 s per pump to trip the four pumps in sequence.

## Error modes (per SPAR-H taxonomy)

- **Slip** — wrong pump tripped (4 nearly-identical switches in a
  row on the control board). Mitigated by three-way communication
  and peer-check.
- **Lapse** — trip step delayed past the threshold because the
  operator was focused on a parallel task (e.g. SI verification).
  Performance-shaping factor: high workload.
- **Mistake** — operator trips RCPs before voiding is established
  because the procedure is mis-read as "trip on SI" rather than
  "trip on subcooling loss after SI." Performance-shaping factor:
  procedure clarity at the step.
- **Restart violation** — the temptation to restart a tripped RCP
  once the operator believes the transient is recovering. Forbidden
  by the procedure; cultural reinforcement is the only effective
  control.

## Procedures that invoke this action class

- [[E-0]] step 9 (`check-rcp-status`) — initial verification.
- [[E-1]] step 3 (`check-rcp-status`) — LOCA-specific evaluation.
- [[FR-C.1]] / [[FR-C.2]] — degraded core cooling responses.

## Performance-shaping factors

| factor | weight | rationale |
|---|---|---|
| time pressure | high | minutes-zero-to-five regime; missed window costs core damage |
| training quality | high | this exact action is rehearsed every simulator cycle |
| procedure clarity | high | the conditional structure has been refined post-incident |
| HSI | medium | RCP-trip switches are co-located but visually similar |
| workload | high | SI verification competes for attention |

## Cross-reference

- [Time-pressure profile — LOCA](hf-time-pressure-loca.md)
- [HF failure mode taxonomy](hf-failure-modes-taxonomy.md)

---
type: hf-action-class
hf-id: manual-si-actuation
title: Action class — manual Safety Injection actuation
applies-to: Westinghouse-style 4-loop PWR
sources: [nureg-cr-6883, nureg-0700, oecd-nea-csni-r-2014-6]
---

# Action class: manual Safety Injection actuation

Safety Injection is normally an automatic ESF actuation triggered
by low pressurizer pressure, high containment pressure, or low
steam-line pressure. Manual actuation is the operator backup when:

- Automatic actuation fails to occur despite the trigger conditions.
- Symptoms warrant SI but no automatic trigger has fired (e.g. a
  small break that depressurises below the SI threshold slowly).
- The procedure specifically directs manual actuation as a
  conservative response (E-0 step 4, RNO branch).

## Typical execution time

- **Cognitive**: 5–15 s once the operator recognises the need
  (faster than RCP-trip because the decision is binary).
- **Motor**: ~3 s — single armed pushbutton on the main control
  board.

## Error modes

- **Slip** — wrong panel switch (SI button is co-located with other
  ESF manual actuation switches: Phase A isolation, Phase B
  isolation, containment spray). Verified by three-way communication.
- **Omission** — failure to manually actuate when automatic
  actuation didn't occur, because the operator assumed automatic
  was working. Performance-shaping factor: trust in automation.
- **Premature reset** — actuated SI is reset before the procedure
  step says to. SI auto-reset is locked out by design; manual
  reset requires a deliberate procedure-driven action.

## Procedures that invoke

- [[E-0]] step 4 (`check-si-status`) — the canonical entry point.
- [[ES-0.2]] — SI termination procedure (re-actuation if
  termination criteria stop being met).
- [[FR-C.1]] — manual SI as part of degraded-core-cooling response.

## Performance-shaping factors

| factor | weight | rationale |
|---|---|---|
| time pressure | medium | seconds matter but the action is fast and the team has 5 minutes |
| training quality | high | simulator-rehearsed every cycle |
| trust in automation | high | operators sometimes over-trust automatic actuation |
| HSI | high | the SI manual switch is a single armed pushbutton — visible, distinct, deliberate |
| stress | medium | this is one of many concurrent diagnostics during E-0 |

## Cross-reference

- [Time-pressure profile — LOCA](hf-time-pressure-loca.md)
- [HF failure mode taxonomy](hf-failure-modes-taxonomy.md)
- [Three-way communication](../operations/communication.md)

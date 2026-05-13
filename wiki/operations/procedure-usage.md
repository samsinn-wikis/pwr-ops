---
type: operations-doc
operations-id: procedure-usage
title: Procedure usage hierarchy and deviation rules
applies-to: Westinghouse-style 4-loop PWR
sources: [iaea-ns-g-2-14, nureg-0800-13, nureg-1764]
---

# Procedure usage hierarchy

Every operator-controlled action follows a procedure. The hierarchy
of procedures resolves which one applies when symptoms overlap.

## Hierarchy of authority

1. **Critical Safety Functions (FR-x)** override everything else.
   If any CSF status tree enters a red or orange path, the EOP team
   exits the current procedure (E-series or ES-series) and enters
   the corresponding FR-x recovery procedure. The previous procedure
   is resumed only after the CSF is restored to green/yellow.
2. **Optimal-recovery EOPs (E-series)** — the entry procedures for
   each accident family. Once entered, executed top-to-bottom.
3. **Recovery EOPs (ES-series)** — entered from a specific E-series
   exit step.
4. **Normal and abnormal operating procedures (AOPs / SOPs)** — the
   default for non-emergency conditions.

The numerical priority is enforced by EOP entry conditions: every
FR-x procedure has entry conditions visible from every other
procedure's monitoring step.

## Place-keeping

The SRO marks every completed step on the printed copy. Step-by-step
place-keeping makes the procedure resumable across shift turnovers
and traceable in post-event review.

## Deviation rules

EOP deviation is allowed under three explicit conditions:

- **Procedure obviously wrong for the situation** — e.g. an
  instrument failure has invalidated the symptom set the EOP
  assumes. SRO authorises the deviation, logs the rationale,
  triggers a procedure-revision request post-event.
- **Conservative-decision-making override** — the SRO judges that
  continuing the next step would harm plant safety. Same logging
  requirement.
- **SS override** — the shift supervisor's command authority is
  absolute. SS deviations require post-event documentation and
  often a regulatory report.

What is NOT a valid deviation: time pressure ("we're behind, let's
skip step 5"), perceived obviousness ("everyone knows what step 8
means"), or peer pressure.

## Cross-reference

- [Conservative decision-making](conservative-decision-making.md)
- [STA role](sta-role.md) — the STA's authority to call for a
  procedure pause sits inside this hierarchy.
- [Control-room ConOps](control-room-conops.md) — role authorities.

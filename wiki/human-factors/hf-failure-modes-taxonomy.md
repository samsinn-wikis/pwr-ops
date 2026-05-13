---
type: hf-failure-mode
hf-id: failure-modes-taxonomy
title: Operator error failure modes — slip, lapse, mistake, violation
applies-to: Westinghouse-style 4-loop PWR
sources: [nureg-cr-6753, nureg-cr-6883, oecd-nea-csni-r-2014-6, iaea-ns-g-2-14]
---

# Operator error failure modes

Reason's GEMS taxonomy (Generic Error Modelling System), adopted by
NRC NUREG/CR-6753 and the SPAR-H method, classifies operator errors
in EOP execution into four types. Each has distinct preconditions
and distinct mitigation strategies; an EOP author benefits from
knowing which type a given step is most exposed to.

## The four types

### Slip — skill-based error

A correctly-intended action is executed wrongly because of
attention capture or motor-routine interference. The operator
*knows* what they meant to do.

- **Example**: tripping RCP-1 when RCP-2 was intended (wrong
  switch in a row of four).
- **Preconditions**: highly trained / routine action, similar
  components co-located, low cognitive engagement at the moment.
- **Mitigations**: three-way communication (read-back catches the
  wrong-component callout); peer-check (second operator confirms
  before the action); HSI design (distinct labels, separated
  controls).

### Lapse — memory failure

A required action is not performed because the operator forgot to
do it. Different from a slip: with a lapse, the action never
happened at all.

- **Example**: failing to verify Phase-A isolation after SI
  because the operator moved on to the next step.
- **Preconditions**: parallel-task workload, interruption between
  step recognition and step execution, time pressure.
- **Mitigations**: place-keeping on the procedure (every step
  marked); verify-step structure in the procedure itself; STA
  parallel monitoring.

### Mistake — knowledge-based / rule-based error

A wrong action is intentionally taken because the operator's mental
model of the situation is incorrect. The operator *meant* to do
what they did — they just had the wrong understanding.

- **Example**: continuing to cool down via the secondary side
  after primary depressurization should have been initiated,
  because the operator misdiagnosed the inventory situation.
- **Preconditions**: ambiguous symptoms, novel transient
  outside training, decision under time pressure.
- **Mitigations**: clear procedure branching with `Because:`
  rationale; STA independent perspective; conservative-decision-
  making bias (when in doubt, escalate).

### Violation — deliberate non-compliance

A required action is intentionally skipped or modified despite the
operator knowing the rule. May be situational (one-time deviation)
or routine (systematic norm).

- **Example**: skipping a verification step under perceived time
  pressure.
- **Preconditions**: cultural drift, time pressure, perceived
  procedure-vs-reality mismatch.
- **Mitigations**: cultural — see
  [safety-culture.md](../operations/safety-culture.md). Procedure
  changes do not address violations; cultural reinforcement does.

## Distribution in PWR EOP execution

Per NUREG/CR-6753 analysis of public LER data:

- **Slips** are the most common (~45% of operator-error events)
  but typically the least consequential — caught quickly by
  three-way communication and instrument feedback.
- **Lapses** are next (~25%) and tend to cluster during high-
  workload phases (E-0 first 5 minutes).
- **Mistakes** are less frequent (~20%) but contribute the largest
  fraction of significant events because the wrong action persists
  until the mental model is corrected.
- **Violations** are rare (~10%) but indicate cultural problems
  that span multiple events.

## Implications for EOP authoring

- `Check:` lines should resist slip with explicit instrument tag
  references (`«PT-455»` not "pressurizer pressure"). The tag-
  reference forces the operator to confirm by tag rather than by
  spatial intuition.
- `Caution:` blocks should preempt mistake-prone steps with
  rationale ("if RCPs are tripped before voiding, …").
- `Verify:` and place-keeping discipline preempt lapse.
- Violations are out of EOP scope — they belong to the safety
  culture and training programs.

## Cross-reference

- [Action class: trip RCPs under voiding](hf-action-trip-rcps-under-voiding.md)
- [Action class: manual SI actuation](hf-action-manual-si-actuation.md)
- [Action class: isolate faulted SG](hf-action-isolate-faulted-sg.md)
- [Safety culture](../operations/safety-culture.md)

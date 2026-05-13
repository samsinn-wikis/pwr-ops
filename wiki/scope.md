---
title: Scope and disclaimers
---

# Scope and disclaimers

## What this wiki covers

Coverage targets the standard **Westinghouse-style 4-loop Pressurized Water
Reactor** baseline EOP set, organized in the four families used by the
Westinghouse-style Owners Group:

- **E-series** (4 procedures) — initial diagnostic and mitigation: reactor
  trip / safety injection entry, LOCA, faulted steam generator, steam
  generator tube rupture.
- **ECA-series** (7 procedures) — extreme conditions: total loss of AC
  power, loss of recirculation, uncontrolled depressurization, multiple
  SGTR recovery variants.
- **ES-series** (10 procedures) — post-trip recovery sequences from each
  E-series exit point.
- **FR-series** (18 procedures) — Critical Safety Function status trees
  for Subcriticality (S), Core Cooling (C), Heat Sink (H), RCS Integrity
  (P), Containment (Z), and RCS Inventory (I).

Total: ~39 procedure pages plus one profile page.

## What this wiki does NOT cover

- BWR procedures
- AP1000 / AP600 passive-design procedures
- B&W (Babcock & Wilcox) once-through-steam-generator plants
- Combustion Engineering plants
- Plant-specific procedures (alarm response procedures, abnormal
  operating procedures, system operating procedures)
- Symptom-based / function-restoration procedures specific to one utility
  or operating company's adaptation
- Fire procedures (10 CFR 50 Appendix R / NFPA 805)
- Severe accident management guidelines (SAMG)
- Owner-specific procedure revisions and bulletins

## Sources and methodology

Procedure structure and prose are reconstructed from Claude's general
nuclear-engineering training-data knowledge. The format follows the
publicly described Westinghouse-style Emergency Response Guidelines (ERG)
two-column structure (instruction column / Response Not Obtained column),
flattened to procmd's branch syntax via the `nuclear-erg` profile's
`RNO:` synonym.

Reference materials drawn upon (in general training data, not directly
cited):

- NRC NUREG references (notably NUREG-0660, NUREG-0696, NUREG/CR-5572)
- Public Westinghouse-style Owners Group training summaries
- University PWR operator-training course materials
- Open-literature reactor safety analysis papers and textbooks

**No verbatim Westinghouse-style-copyrighted procedure text is reproduced.**
The objective is faithful logical structure with original prose.

## Status of the content

> **This wiki is a demonstration of the procmd format. It is NOT a
> licensed procedure set.**
>
> Procedures here have NOT been:
> - reviewed by qualified nuclear operators or shift supervisors
> - validated against current Westinghouse-style Owners Group revision-level
>   procedure sets
> - cross-checked against any specific plant's licensing basis
> - approved for operator training, qualification, or licensing exams
> - sanctioned for use in plant operations

Errors are expected. Branch destinations, step ordering, setpoint values,
recovery paths, and CSF threshold conditions may differ from current
WOG/utility revisions. Inadvertent omissions and miscategorizations are
likely.

**Do not use this content for any safety-related purpose.** For real
plant operations, consult your facility's licensed procedure set under
the supervision of qualified personnel.

## Why this exists

Two purposes:

1. **Format demonstration.** Show that procmd v0.1 can express the full
   logical complexity of a real-world critical-procedure family — RNO
   branches, cross-procedure transitions, concurrent CSF monitoring,
   per-step rationale.

2. **Samsinn agent integration target.** Provide a concrete, sizable
   procedural wiki that future samsinn-side runtime work (procedure
   executor, agent guardrail traversal) can be tested against.

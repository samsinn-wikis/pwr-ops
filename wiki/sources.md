---
title: Reference Sources
---

# Reference Sources

This wiki is **LLM-reconstructed** from publicly available references on
Westinghouse-style Pressurized Water Reactor design and Emergency Response
Guidelines. It does **not** redistribute proprietary Westinghouse-style Owners
Group ERG text. The sources listed here are the authoritative public
materials a contributor (human or LLM agent) should consult to keep the
content faithful to the real-world Westinghouse-style style.

If you cite a procedure step against one of these sources, name the
source short-id and section in the commit message — e.g.
`per WTSM §15.3 (faulted-SG isolation)`.

## Tier 1 — Regulatory & guidance (open, authoritative)

These are NRC- and FEMA-published documents that define the structure
and expectations for U.S. PWR EOPs. They are the closest a public author
can get to the ERG philosophy without acquiring WOG-licensed material.

| Short-id | Document | Why it matters |
|---|---|---|
| **NUREG-0737 Suppl. 1** | *Clarification of TMI Action Plan Requirements — Requirements for Emergency Response Capability* | Establishes the symptom-oriented, function-restoration EOP philosophy. Mandatory reading before authoring any FR-x step. |
| **NUREG-0899** | *Guidelines for the Preparation of Emergency Operating Procedures* | The "what an EOP must contain" rulebook: structure, writing style, technical content, V&V. Sets the bar for `Check:` / `Action:` / RNO conventions used in this wiki. |
| **NUREG-1358** | *Lessons Learned from the Special Inspection Program for Emergency Operating Procedures* | Reinforces NRC expectations for plant-specific technical guidelines, EOP writers' guides, and operator training. |
| **NUREG-0800 SRP** | *Standard Review Plan*, esp. Chapter 13.5 (Plant Procedures) and 18 (Human Factors) | Review criteria the NRC applies to plant EOP programs; useful as a self-audit checklist. |
| **NUREG-0700 Rev. 2** | *Human-System Interface Design Review Guidelines* | The reference for control-room HSI conventions referenced in steps (alarm presentation, indicator labelling, etc.). |
| **NUREG-0711 Rev. 3** | *Human Factors Engineering Program Review Model* | Frame for human-factors annotations on a procedure (workload, error-likely steps, time-critical actions). |
| **NUREG/CR-5572** | *Methods for Review and Evaluation of Emergency Procedure Guidelines, Vol. II — Applications to Westinghouse-style Plants* | Direct technical commentary on the Westinghouse-style ERG set; identifies known issues and review findings. |
| **NUREG/CR-6981** | *Assessment of Emergency Response Planning and Implementation for Large-Scale Evacuations* | Background for off-site / EOF interactions referenced in extended procedures. |
| **NUMARC/NESP-007 Rev. 2** | *Methodology for the Development of Emergency Operating Procedures* | Industry-side counterpart to NUREG-0899; gives the EPG → EOP translation method. |
| **EPRI EOP Writers' Guide** (TR-1003414 and successors) | *Emergency Operating Procedure Writers' Guide* | The format/style template most U.S. utilities adapted; basis for two-column instruction/RNO layout. |

## Tier 2 — Westinghouse-style-specific training material (open)

The NRC-published *Westinghouse-style Technology Systems Manual* and the
Westinghouse-style Technology training course materials are the most
authoritative open Westinghouse-style-specific references. They were prepared
by the NRC for staff training on Westinghouse-style plants and describe the
real systems, setpoints, and operating philosophy.

| Short-id | Document |
|---|---|
| **WTSM** | NRC *Westinghouse-style Technology Systems Manual* (per-system chapters: NSSS, NIS, RPS, ECCS, AFW, Containment, etc.) — [ML21166A218](https://www.nrc.gov/docs/ML2116/ML21166A218.pdf) |
| **WT-100 / WT-200 / R-104P** | NRC *Westinghouse-style Technology* course outlines and 100/200-level objectives — useful for terminology and conceptual scope |
| **Procedures Development and Maintenance** | Westinghouse-style Nuclear data sheet describing the procedures program services |

## Tier 3 — Owners-group public-facing material

These describe ERG structure at a high level without releasing the
proprietary text. Useful for cross-checking section names, the CSF
status-tree topology, and entry conditions.

| Short-id | Document |
|---|---|
| **PWROG Procedures Committee** | Westinghouse-style PWR Owners Group public charter pages for the Procedures Committee (formerly WOG Procedures Subcommittee) |
| **IAEA INIS h9jk7-yph67** | *The Emergency Response Guidelines for the Westinghouse-style Pressurized Water Reactor* (conference paper, public-domain summary of ERG philosophy and structure) |
| **Westinghouse-style SAMG** | Westinghouse-style Severe Accident Management Guidance Support data sheet — context for the EOP → SAMG handoff at the lower bound of FR-C |

## Tier 4 — Academic / textbook references

Useful for thermal-hydraulics reasoning behind setpoints and recovery
paths in this wiki — never reproduce ERG text, but reproduce *physics*
all you like.

- Todreas & Kazimi, *Nuclear Systems* (Vol. I & II) — PWR primary-loop thermal-hydraulics, natural circulation, two-phase flow.
- Lewis, *Nuclear Power Reactor Safety* — defence-in-depth and ECCS analysis.
- Lamarsh & Baratta, *Introduction to Nuclear Engineering* — neutronics for FR-S reasoning.
- MIT OCW 22.06 *Engineering of Nuclear Systems* and 22.39 *Integration of Reactor Design, Operations, and Safety* — lecture notes used as university-level reference for PWR operation.
- IAEA-TECDOC-1426, *Operational Limits and Conditions and Operating Procedures for Nuclear Power Plants* — international counterpart to U.S. EOP guidance.
- IAEA NS-G-2.2, *Operational Limits and Conditions and Operating Procedures for Nuclear Power Plants* — safety-standard form of the same.

## Tier 5 — Plant-specific FSAR / UFSAR excerpts (open via NRC ADAMS)

Many U.S. PWR Updated Final Safety Analysis Reports are public on the
NRC ADAMS document system. Useful for sanity-checking tag values and
setpoints against a real 4-loop Westinghouse-style plant. Examples:

- Vogtle UFSAR, Sequoyah UFSAR, Watts Bar UFSAR, Catawba/McGuire UFSAR
  — all 4-loop Westinghouse-style, all publicly accessible via ADAMS.

## How to cite from these sources without copying

- **Do** reproduce *structure* (e.g. "E-0 step 5 verifies SI pump flow
  before checking phase-A") — structure is not copyrightable.
- **Do** reproduce *physics-derived setpoints* when stated in academic
  references or UFSARs (subcooling margin, AFW low-low setpoint).
- **Do** name systems and instruments using their generic engineering
  names (RCP, PORV, MSIV, AFW, RHR).
- **Do not** copy any sentence or near-paraphrase from a WOG ERG, an
  Owners-Group background document, or a plant-specific EOP. Re-derive
  the prose from the physics + structural reference.
- **Do not** claim setpoints "per WOG ERG Rev. X" — cite the open source
  (UFSAR, WTSM, academic text) that contains the same value.

## Updating this page

When you add a new source you used in authoring, add it to the right
tier with a one-line justification of why it matters. Keep tier 1 small
— it's the core. Add freely to tiers 4 and 5.

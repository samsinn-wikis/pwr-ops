---
type: operating-experience
oe-id: davis-besse-2002
title: Davis-Besse vessel-head erosion (March 2002)
applies-to: Westinghouse-style 4-loop PWR
sources: [nureg-cr-6753, oecd-nea-csni-r-2014-6, iaea-ns-g-2-14]
---

# Operating experience: Davis-Besse vessel-head erosion (March 2002)

Davis-Besse Unit 1 (a Babcock & Wilcox PWR, but the lessons
generalise across PWR designs) discovered during a refueling outage
in March 2002 that boric-acid corrosion had eaten a football-sized
hole through the reactor pressure vessel head, leaving only the
stainless-steel cladding (~10 mm) between the reactor coolant
inventory and a containment-bypass leak path.

The event itself was a *finding*, not an accident — the plant
operated safely until shutdown. But the operating-experience value
is enormous: the corrosion had been progressing for years, and the
indicators that should have triggered investigation had been
explained away repeatedly.

## What was missed

- **Boron crystallisation** on the vessel head was observed and
  documented multiple times across several outages. Each
  observation was attributed to small leaks from CRDM (control
  rod drive mechanism) flange seals — plausible-sounding but
  never independently confirmed.
- **Filters in the containment air-handling system** were clogging
  with boron-bearing particulate more frequently than design
  predicted. This was tracked as a maintenance nuisance, not a
  systemic indication.
- **Containment dome radiation surveys** showed elevated levels
  consistent with primary leakage. These were also normalised.

No single indicator was load-bearing. But the *pattern* — multiple
weakly-suggestive indicators all pointing the same direction — was
the signal that was missed.

## Why this matters for EOP-era operator training

The Davis-Besse event is taught not as an EOP failure (no EOP
applied) but as a **cultural failure mode** with direct relevance
to EOP-era operator behaviour:

- **Normalisation of anomalous indications.** When an unusual
  reading recurs, the bias is to develop an explanation for it
  rather than escalate it. This is the cultural force the
  "questioning attitude" principle is designed to counter — see
  [safety-culture.md](../operations/safety-culture.md).
- **Multi-event pattern recognition.** Individual operators see
  individual events. The pattern across events is visible only to
  whoever is tracking near-miss reports. Davis-Besse had
  diminishing near-miss reporting in the years before discovery.
- **Authority gradient effect on inspection findings.**
  Maintenance staff who saw the boron buildup typically did not
  formally escalate it. The culture did not invite escalation.

## Connection to EOPs

A LOCA originating from the eroded vessel head would have entered
[[E-0]] → [[E-1]] like any other LOCA. The pre-LOCA cultural
problem that allowed the corrosion to progress unchecked is not
addressed by EOPs; it is addressed by the conduct-of-operations
framework that surrounds them. See
[procedure-usage.md](../operations/procedure-usage.md) for the
hierarchy.

## Cross-reference

- [Safety culture](../operations/safety-culture.md)
- [Conservative decision-making](../operations/conservative-decision-making.md)
- [Failure mode taxonomy](hf-failure-modes-taxonomy.md)

## References

- NRC LER 50-346/2002-002 (Davis-Besse Unit 1).
- NRC NUREG/BR-0294 — *Davis-Besse Reactor Vessel Head Degradation:
  Lessons Learned, Industry Response, and NRC Action Plan*.
- OECD-NEA CSNI/R(2003)10 — *Operating Experience with Boric Acid
  Corrosion*.

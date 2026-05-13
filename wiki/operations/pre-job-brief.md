---
type: operations-doc
operations-id: pre-job-brief
title: Pre-EOP-entry briefing
applies-to: Westinghouse-style 4-loop PWR
sources: [iaea-ns-g-2-14, nureg-0800-13]
---

# Pre-EOP-entry briefing

When time allows, the SRO conducts a short pre-job briefing before
formal EOP entry. Time-critical entries (reactor trip + SI) skip the
briefing and run on training; non-time-critical entries (shutdown
cooling fault, slow inventory loss) get one.

## Briefing content

- **Procedure identification** — which EOP family, which entry
  procedure (E-0 / ES-0.0 / FR-x), and the symptom set that triggers
  entry.
- **Role assignment** — who runs the procedure (SRO), who performs
  actions (RO), who watches CSFs (STA), who is on auxiliary actions
  (auxiliary operator).
- **Verification levels** — which actions require concurrent
  verification, which require peer-check. See
  [communication.md](communication.md).
- **Known hazards** — equipment out of service, recent maintenance,
  pending surveillance.
- **Stop conditions** — symptoms that would force a procedure exit
  or escalation.
- **Communications setup** — who calls EAL classifications, who
  notifies the emergency response organisation.

## Why pre-job briefings matter for EOPs

The procedure structure assumes the team has a shared mental model
of what they're about to do. Without the briefing, parallel actions
proceed under different assumptions about who's doing what. The
briefing is the moment that mental model gets explicit. NEI 99-01
EAL escalations are routinely missed when the briefing was skipped
under perceived time pressure.

## When to skip

Reactor trip + safety injection is the canonical no-briefing entry.
The trip already happened; the team enters E-0 in seconds; the
briefing is replaced by the procedure structure itself (E-0's first
steps are deliberately checklist-style for this reason).

## Cross-reference

- [Conservative decision-making](conservative-decision-making.md) —
  the principle that drives "when in doubt, brief."
- [Three-way communication](communication.md) — the protocol the
  briefing assigns to action verification.

# pwr-ops — Audit, Rewrites, Completion Plan, and Roadmap (2026-05)

This document is the working brief for taking the pwr-ops wiki from
"procmd-format demo with one developed EOP" to "authentic-style
Westinghouse PWR EOP reference set with surrounding operational
context, suitable for samsinn agents to reason against in nuclear-plant
simulations." It supersedes the casual notes in `README.md` ("Phase 1 /
Phase 2") with a concrete, prioritized work plan.

---

## 1. Adversarial content audit

**Methodology.** Line-count + structural sample of every procedure
file; classify by depth of `Check:` / `Action:` content, presence of
branch rationales (`Because:`), Caution/Note annotations, and `## Tags`
appendix. Disposition: **Developed**, **Skeleton+** (more than a
schema-pass stub but not authored), or **Stub** (frontmatter + 3–4
one-line steps + branch targets only — Phase-1 schema-pass material).

### 1.1 Developed (4 of 39 procedures, ~10 %)

| ID | Lines | Steps | Notes |
|---|---|---|---|
| E-0 | 341 | 18 | Reference quality. Rich `Because:` rationales, 36 `## Tags` declarations, sim-paths. **Spot issue:** step 7 lists `MSLI signal AND MSIV will not close → #verify-feedwater-isolation` with rationale "continue diagnostic; faulted-SG isolation will be addressed in step 15" — the branch and its non-failure twin merge to the same target; this is fine in procmd but the *operator-visible* implication (you've identified a stuck-open MSIV and are continuing past) deserves a `Caution:` not a `Because:` comment buried on a branch. **Verdict: OK with one minor revision.** |
| E-1 | 204 | ~11 | Coherent LOCA flow. **Audit findings:** (a) Step 3 RCP-trip criterion lacks a numeric subcooling threshold — real Westinghouse criterion is something like "RCS pressure ≤ subcooling-margin threshold AND ≥1 charging or SI pump running" — current text is structurally right but operationally vague. (b) Recirculation transfer trigger (RWST low) is not present as an explicit branch — it's deferred to ES-1.3, which is a stub. **Verdict: OK structurally; needs setpoint-level firmness.** |
| E-2 | 205 | ~11 | Faulted-SG isolation. **Audit findings:** (a) "Isolate AFW to faulted SG" must be explicitly time-ordered before MSIV closure for that SG to avoid water-hammer / level swell — check ordering. (b) Steam dump cross-tie / interconnection between SGs is not addressed. **Verdict: OK; minor sequencing review.** |
| E-3 | 239 | ~12 | SGTR. **Audit findings:** (a) Identification of ruptured SG (N-16 vs blowdown radiation) could be a `Decision:` step that explicitly enumerates the four detection paths in priority order. (b) Backfill/blowdown/steam-dump branch to ES-3.1 / ES-3.2 / ES-3.3 is correct *but* those targets are stubs, so the procedure currently "ends in nothing." **Verdict: OK; depends on its successor procedures being completed.** |

### 1.2 Skeleton+ (0 procedures)

There is no middle tier. The corpus is bimodal: 4 developed + 35 stubs.
This is the single biggest finding of the audit — there is no
"partially-authored" middle ground that would have caught problems
early. Plan section 3 addresses this with a "depth-first then breadth"
authoring rhythm.

### 1.3 Stubs (35 of 39 procedures, ~90 %)

All other procedures are at 28–40 lines: frontmatter, 3–4 steps with
single-line `Check:` or `Action:`, one or two branch outcomes, no `##
Tags` appendix, no `Caution:` / `Note:` annotations. Examples:

- **FR-S.1** (35 lines, 4 steps) — ATWS. The whole ATWS response is 4
  lines of body text. A real ATWS procedure has explicit guidance on
  manual rod insertion, MG-set trip, turbine runback, and
  emergency-boration alignment alternatives if charging is unavailable.
- **FR-H.1** (40 lines) — Loss of secondary heat sink, the most-fleshed
  stub. Mentions bleed-and-feed but doesn't enumerate the entry
  threshold (e.g. "wide-range SG level on all SGs < X% AND no AFW flow
  available within Y minutes").
- **ES-1.3 / ES-1.4** — Cold-leg / hot-leg recirculation transfer. These
  are the most operationally tricky procedures in the entire ERG set
  (RWST level, swap-over coordination, switchover failure modes) and
  they are 28–30 lines each.
- **ECA-0.0** (Station Blackout) — 36 lines for a procedure that in
  practice runs hours, with multiple natural-circulation cooldown
  branches and time-critical TDAFW load management.
- **FR-Z series** — containment challenges. FR-Z.1 (high containment
  pressure) merits explicit hydrogen-management cross-references
  post-Fukushima and SAMG handoff thresholds.

**Verdict.** The stubs are Phase-1 valid (validator green; cross-page
links resolve) but operationally vacuous. They are useful only to
demonstrate the procmd format, not to support agent reasoning over a
nuclear-plant event.

### 1.4 Profile and meta-pages

| File | Verdict |
|---|---|
| `wiki/profiles/nuclear-erg.md` | Looks adequate for v0.5 procmd: declares `RNO:` and `CSF:` synonyms. Needs `Concurrent:` and possibly `Continuous:` definitions if those keywords are introduced (see procmd extension proposals in §4). |
| `wiki/index.md` | Correct catalogue. No coverage map, no "depth" indicator. Suggestion: add a tiny status badge column ("✅ developed / 🟡 partial / ⬜ stub") so a reader can see at a glance which pages are real. |
| `wiki/scope.md` | (Not re-read in this pass — flag for spot review.) |
| `wiki/sources.md` | NEW — added in this work. |

### 1.5 Cross-cutting findings

1. **Stub branches lead to other stubs.** Every E-series procedure
   branches into ES- and ECA- recovery paths that are themselves stubs.
   The "graph" is structurally sound but operationally hollow past one
   step.
2. **Tag declarations exist only in E-0.** The other developed
   procedures (E-1, E-2, E-3) reference `«…»` tags but do not declare
   them. The `## Tags` appendix mechanism (procmd v0.5) is therefore
   under-used. Either: declare them locally on every page, or
   centralize them in a "tags catalogue" file (procmd extension —
   see §4).
3. **No Caution: / Note: usage outside E-0.** Real Westinghouse EOPs
   have ubiquitous cautions (especially around RCP trip, AFW flow
   verification, containment isolation timing). The stubs are devoid
   of these.
4. **No time / temporal annotations.** Real EOPs have "perform within
   N minutes" constraints (e.g. cold-leg recirculation switchover
   timing) that drive operator workload. procmd has a `Within:` keyword
   used in FR-S.1 step 3 but it is undocumented and used inconsistently.
5. **No human-factors annotations.** No marking of error-likely steps,
   time-critical actions, or steps requiring two-operator concurrence.
   Real EOPs flag these explicitly (asterisks, shaded blocks). This is
   a candidate procmd extension (§4).
6. **No setpoint discipline.** Most steps say "low pressure" or
   "adequate subcooling margin" with no numbers. Real EOPs anchor every
   `Check:` to a specific instrument and setpoint. Tag declarations
   currently have `units:` but not `setpoint:` / `alarm-band:`.
7. **No fence between EOPs and SAMG.** The lower bound of FR-C is
   meant to hand off to Severe Accident Management Guidance. Neither
   the link nor the trigger (core-exit thermocouple > X °C) exists.

---

## 2. Source-faithfulness research

Captured in `wiki/sources.md` (new). Key takeaways for authors:

- **NUREG-0899** + **NUMARC/NESP-007 Rev. 2** + **EPRI EOP Writers'
  Guide** define the form and language; copy *form*, never *text*.
- **NUREG/CR-5572 Vol. II** is the closest open evaluation of the
  Westinghouse ERG set — useful for sanity-checking transitions.
- **NRC *Westinghouse Technology Systems Manual* (WTSM)** is the
  authoritative open per-system reference; cite it for setpoints,
  system descriptions, and the conceptual model behind a step.
- **NUREG-0700 / 0711** govern the control-room HSI conventions and
  human-factors review — drive the procmd extensions in §4.
- **Plant UFSARs** (Vogtle, Sequoyah, Watts Bar, Catawba/McGuire) on
  ADAMS provide real 4-loop setpoint values.
- **MIT OCW 22.06 / 22.39** and Todreas & Kazimi anchor the physics
  reasoning that goes into `Because:` rationales.

---

## 3. Rewrite + completion plan

The plan is **depth-first within each event family**, with the
function-restoration (FR-x) trees authored last because they are the
most stable in scope.

### 3.1 Touch up the four developed EOPs (~1 week)

- **E-0:** elevate the step-7 "MSIV will not close" branch comment to a
  `Caution:`. Add explicit subcooling-margin tag (`SUB-MARGIN`) and
  reference it in step 11.
- **E-1:** firm up the RCP-trip criterion with numeric subcooling-margin
  threshold; add an explicit RWST-low-level branch step that points to
  [[ES-1.3]] for cold-leg recirculation transfer.
- **E-2:** verify AFW-isolation-before-MSIV-closure ordering against
  WTSM. Add steam-dump-from-intact-SGs branch.
- **E-3:** convert SGTR-identification step to an enumerated
  `Decision:` with four detection paths in priority order.
- **All four:** localize the `## Tags` appendix on each page (don't
  rely on E-0's declarations being the canonical set).

### 3.2 Depth-first completion of E-series successors (~3–4 weeks)

Author **fully** (not stub) in this order:

1. `ES-0.1` — Reactor Trip Response (terminates a "clean" post-trip
   into Mode 3 stable). The most common destination of E-0.
2. `ES-1.1` — SI Termination. Drives the "is SI still needed?" check
   that runs concurrently with E-1.
3. `ES-1.2` — Post-LOCA Cooldown and Depressurization.
4. `ES-1.3` + `ES-1.4` — Cold-leg → hot-leg recirculation. These two
   are the operationally tightest and deserve detailed `Caution:`
   blocks for swap-over timing, valve lineup verification, and pump
   protection.
5. `ES-0.0` — Rediagnosis. Authored after the other ES- procedures so
   it can cleanly cross-reference them.
6. `ES-0.2` — Natural Circulation Cooldown.
7. `ES-3.1` / `ES-3.2` / `ES-3.3` — Post-SGTR cooldown variants.

### 3.3 ECA-series (~2 weeks)

Authored after ES- because they are off-normal escalation paths from
the E- + ES- main line.

1. `ECA-0.0` — Station Blackout. Largest single procedure; needs full
   TDAFW management, natural-circulation cooldown, AC restoration
   branches, and a clear handoff to **SAMG entry conditions** if all
   AC remains lost beyond TDAFW endurance.
2. `ECA-1.1` — Loss of ECCS Recirculation.
3. `ECA-1.2` — LOCA Outside Containment.
4. `ECA-2.1` — Uncontrolled Depressurization of All SGs.
5. `ECA-3.1` / `3.2` / `3.3` — SGTR variants.

### 3.4 Function-restoration trees (~2 weeks)

Author each `FR-x.y` with three sections: (1) the **status-tree
condition** (RED/ORANGE/YELLOW/GREEN entry criterion at the head of the
file, as a structured `entry-condition:` frontmatter field — procmd
extension §4), (2) the **restoration steps**, (3) a `## Background`
block that cites WTSM section and explains the physics.

Order:

1. FR-S.1, FR-S.2 (subcriticality — short, well-bounded)
2. FR-C.1, FR-C.2, FR-C.3 (core cooling — physics-heavy)
3. FR-H.1–H.5 (heat sink — five procedures, biggest family)
4. FR-P.1, FR-P.2 (PTS — bound by RCS T/P limits)
5. FR-Z.1–Z.3 (containment — post-Fukushima H₂ flagged in Z.1)
6. FR-I.1–I.3 (inventory)

### 3.5 Authoring rhythm

- One procedure at a time, fully authored (steps + tags + cautions +
  background), then `bun validate.ts`, commit, push.
- Every PR has the procedure ID + one-line "what is now real about this
  page" in the commit message.
- Validator stays green throughout — this is non-negotiable.

---

## 4. procmd extension proposals

The audit surfaced six gaps where procmd v0.5 forces awkward authoring.
Each proposal is annotated with **scope** (parser + renderer + KG
exporter) and a **fallback** ("can we live without this?").

### 4.1 `Caution:` and `Note:` as first-class keywords (Promote)

Already accepted in CLAUDE.md as "either `!!! warning` / `!!! note`
admonition OR bare `Caution:` / `Note:` lines." Make this the
preferred form, document in `docs/procedure-md.md`, and have the
renderer emit a left-bar styled block. **Scope: render only.**
**Fallback: status quo.**

### 4.2 `Within: <duration>` time constraint on a step (Formalize)

Already used informally in FR-S.1. Make it a documented keyword with a
schema (`Within: 30 minutes`, `Within: as fast as available pumps
allow`). The renderer can show a clock icon and the KG exporter can
emit a `time-constraint` predicate. **Scope: parser + render + KG.**
**Fallback: keep as freeform `Note:`.**

### 4.3 Step-level human-factors tags (New)

Authoring shape:

```
## Step 12 [id: trip-rcps, hf: time-critical, hf: two-operator]
```

Multiple `hf:` tags allowed. Vocabulary (initial): `time-critical`,
`two-operator`, `error-likely`, `verification-required`,
`peer-check`, `independent-verification`. The renderer adds badges
next to the step heading; the KG emits `humanFactor` predicates.
This is what allows an LLM agent to *reason about* human performance
in a simulation. **Scope: parser + render + KG.** **Fallback: a
`!!! warning` admonition per step, which is verbose and unsearchable.**

### 4.4 `entry-condition:` frontmatter field for FR-x pages (New)

```yaml
entry-condition:
  csf: core-cooling
  level: red
  triggers:
    - core-exit-tc > 1200F
    - rvls < 30%
```

Lets the FR-x corpus be queried as a status-tree by an agent without
parsing prose. **Scope: frontmatter schema + KG export only — no
render change.** **Fallback: prose-only entry conditions.**

### 4.5 Centralized tag catalogue (New)

A new page type `type: tag-catalogue` (e.g.
`wiki/tags/pwr-4loop.md`) that declares the full instrument /
equipment tag set once. Per-procedure `## Tags` appendices then
declare only *new* tags or *overrides*. The validator resolves
`«TAG»` against the union. Removes the duplication seen across
E-0/E-1/E-2/E-3. **Scope: parser + validator.** **Fallback: keep
duplicating per page (current).**

### 4.6 `Decision:` step type with enumerated paths (New)

Today every diagnostic step is a `Check:` followed by `-` branches.
For multi-way diagnosis (SGTR detection, LOCA size estimation),
authoring is awkward because the branches don't have a natural
ordering. Proposal:

```
## Step 16 [id: identify-ruptured-sg]
Decision: identify the ruptured SG using the following paths in order
1. N-16 monitor reading «SG-x-N16» elevated → SG-x is ruptured
2. SG narrow-range level rising uncontrollably → SG-x is ruptured
3. Steam-line activity sample → SG-x is ruptured
4. Blowdown radiation → SG-x is ruptured
- Ruptured SG identified → #isolate-ruptured-sg
- No SG identified after exhausting paths → [[ECA-3.3]]
```

**Scope: parser + render + KG.** **Fallback: a Note: block listing
priorities, then branches.**

### 4.7 Setpoint annotation on tags (Extension)

Augment the tag schema:

```yaml
- id: SG-A-LVL-NR
  units: percent
  setpoint:
    lo-lo: 17
    lo: 25
    hi: 75
  source: WTSM §10.4 / Vogtle UFSAR 7.3
```

KG exporter emits `setpoint` predicates; renderer can show them on
hover. **Scope: schema + render + KG.** **Fallback: bake into prose.**

---

## 5. Beyond procedures — content the wiki should add

The user's prompt asks specifically about: (a) more procedures, (b)
tech specs / tech docs, (c) Conduct of Operations / Concept of
Operations for control-room work, (d) operator actions / failures /
performance / human factors for agent reasoning.

### 5.1 More procedures

| New family | Reasoning |
|---|---|
| **AOPs** (Abnormal Operating Procedures) — *AOP-1*… | The pre-EOP layer: pump trips, single-loop loss, partial losses of cooling, electrical faults that don't (yet) cause a reactor trip. Agents need these to reason about the *escalation pathway* into EOPs. |
| **GOPs** (General Operating Procedures) — startup / shutdown / cooldown / heatup | Provides plant-state context. Real simulations spend most of their time *not* in EOPs. |
| **ARPs** (Alarm Response Procedures) — per-annunciator | The micro-procedures that bridge "an alarm sounds" → "operator looks at procedure." A subset of the most operationally important alarms (RCS leakage, SG level low, SG level high, T-avg deviation, etc.). |
| **SAMG** (Severe Accident Management Guidelines) — handoff from FR-C lower bound | Agents reasoning about beyond-design-basis events need the SAMG entry conditions and the handoff. Public WANO / IAEA-TECDOC SAMG framework documents are the source. |
| **Mode-change procedures** | Cooldown to Mode 5, mid-loop operations, drained-loop ops — these are where operationally rare but high-consequence events happen. |

### 5.2 Technical specifications & technical documentation

| New page type | What it holds |
|---|---|
| **Tech-spec excerpts** (`type: tech-spec`) | LCO, surveillance requirement, action statement, allowed-outage-time table. Cross-referenced from procedure steps that depend on a tech-spec action. |
| **System descriptions** (`type: system-description`) | One page per major system (RCS, ECCS, AFW, MSS, RPS, ESF, electrical, containment, RHR, CVCS, NIS) describing function, components, instrumentation, alignment, and key setpoints. Cite WTSM section. These are the *closures* on `«TAG»` references. |
| **P&ID / one-line stubs** | Mermaid diagrams of major flow paths and electrical one-lines. Mermaid already renders; just author them. |
| **Setpoint catalogue** (`type: setpoint-catalogue`) | All instruments + setpoints in one place, cross-linked from tags. |

### 5.3 Conduct of Operations + Concept of Operations

These are the operating *culture* layer — separate from procedures
themselves. INPO ACAD and IAEA NS-G-2.14 style content.

| Page | Coverage |
|---|---|
| **Control-room ConOps overview** | Operator roles (RO, SRO, STA, SS), watch-stand, turnover, log-keeping, communication protocol. |
| **Three-way / peer-check communication** | Self-check, peer-check, concurrent verification, independent verification — and when each applies. |
| **Pre-job briefing** | What goes into a pre-EOP-entry brief. |
| **Conservative decision-making** | The "if you don't know, stop" principle. |
| **Procedure usage hierarchy** | When you can/can't deviate from an EOP, role of the SRO override, place-keeping rules. |
| **STA (Shift Technical Advisor) reasoning** | The independent-perspective role that monitors CSFs alongside the active EOP team. |
| **Configuration control & tag-out** | Independent verification, danger tags, hold orders. |
| **Reactor-safety culture principles** | INPO-derived but reproducible. |

### 5.4 Operator actions / failures / performance / human factors

The high-value layer for samsinn agent reasoning. Each page is short
and structured for retrieval, not for human reading.

| Page type | Content |
|---|---|
| `type: hf-action-class` | Class of operator action (e.g. "trip RCP under voiding"), typical execution time, error modes, prerequisites, recovery if performed wrong. |
| `type: hf-failure-mode` | Slip / lapse / mistake / violation taxonomy applied to control-room work, with examples from the OECD-NEA / NRC operating-experience reports. |
| `type: hf-performance-shaping-factor` | The PSF list (stress, workload, training, fatigue, HSI quality, …) with how each shifts error probability. |
| `type: hf-time-pressure-profile` | Per-EOP "what minutes 0–5 / 5–30 / 30–120 demand from the crew." |
| `type: hf-team-dynamics` | Authority gradient, speak-up culture, role of the SS in decision-making, common failures of crew resource management. |
| `type: operating-experience` | Public LERs (licensee event reports) and OECD-NEA operating-experience summaries relevant to each EOP family. Anchor your agent's reasoning in real precedents. |

A samsinn agent given `[[E-1]] + [[hf-time-pressure-profile/loca]] +
[[operating-experience/davis-besse-2002]]` can produce a much richer
narrative of a LOCA scenario than from procedures alone.

### 5.5 Things you didn't ask about but should consider

- **Simulator coupling layer.** A `type: simulator-binding` page that
  maps each procedure's `«TAG»` set to the variables of a specific
  simulator (samsinn's own sim, the BNL Generic PWR Simulator, the
  IAEA basic PWR simulator). This is the "stop reasoning about tags
  in the abstract" layer.
- **Scenario library.** `type: scenario` pages describing a starting
  condition + injected faults + expected EOP traversal. Each scenario
  cross-links to the EOPs it should exercise. Drives both simulation
  test cases and agent benchmarks.
- **Procedure validation traces.** `type: validation-trace` — a
  recorded transit through the procedure graph with timestamps, tag
  values, and operator decisions. Useful for regression testing
  agents (did agent X reach the same terminal state as recorded
  human crew?).
- **Glossary** of operator-jargon → engineering-term mapping. The
  prose in real EOPs is dense in shop-floor terms ("Mode 3," "TQS,"
  "EAL," "ERO callout"). Agents need this dictionary.
- **EAL (Emergency Action Level) classification.** A short
  cross-reference between EOP entry conditions and the NEI 99-01
  EAL scheme (Unusual Event, Alert, Site Area Emergency, General
  Emergency). Agents will be asked "what class of event is this?" —
  giving them the cross-walk closes that loop.
- **Plant lineup reference** (`type: lineup`) — valves and breakers
  in normal, post-trip, and recirc alignments. Cross-linked from
  steps that change alignment.

### 5.6 Suggested navigation restructure

Current nav is flat-by-family. Proposed:

```
Home
Scope & disclaimers
Reference sources

Procedures
  E-series — Initial Diagnostic
  ES-series — Post-Trip Recovery
  ECA-series — Extreme Conditions
  FR-series — Critical Safety Function status trees
  AOPs — Abnormal Operating Procedures        (new)
  ARPs — Alarm Response Procedures            (new)
  GOPs — General Operating Procedures         (new)
  SAMG — Severe Accident Management           (new)

Plant reference
  System descriptions                         (new)
  Setpoint catalogue                          (new)
  Tag catalogue                               (new)
  Tech-spec excerpts                          (new)
  Plant lineups                               (new)

Operations
  Conduct of Operations                       (new)
  Concept of Operations (control room)        (new)
  Procedure usage and place-keeping           (new)
  Crew resource management                    (new)
  Glossary                                    (new)

Human factors
  Action classes                              (new)
  Failure modes                               (new)
  Performance-shaping factors                 (new)
  Time-pressure profiles                      (new)
  Operating experience (LERs / OEFs)          (new)

Simulation & agents
  Simulator bindings                          (new)
  Scenario library                            (new)
  Validation traces                           (new)
  EAL cross-walk                              (new)

Profiles
  nuclear-erg
```

Implementing this restructure requires CLAUDE.md (the agent schema
file at the wiki root) to grow from "three page types" to ~12 page
types. The schema growth should land *before* page authoring so the
validator can enforce shape.

---

## 6. Sequencing summary

Phased schedule (each phase ~1–4 weeks; the user can compress or
parallelize):

**Phase A — Foundation (1 week).** This document; the new
`wiki/sources.md`; the UI fixes (feedback bubble on paragraphs + icon
overlap) [done in this session]. Add coverage-status column to
`wiki/index.md`. Land procmd extensions 4.1, 4.2, 4.5 in
`docs/procedure-md.md` (parser + validator + render, with v0.6 bump).

**Phase B — Existing procedures hardening (1–2 weeks).** Apply §3.1
revisions to the 4 developed EOPs.

**Phase C — Stub completion, depth-first (6–8 weeks).** §§3.2–3.4 in
that order. Procmd extensions 4.3, 4.4, 4.6, 4.7 land as needed.

**Phase D — Plant reference layer (3–4 weeks).** System descriptions,
setpoint catalogue, tag catalogue, tech-spec excerpts. New page types
in CLAUDE.md schema.

**Phase E — Operations + human factors (3–4 weeks).** Conduct of
Operations, ConOps, human-factors taxonomy. New page types.

**Phase F — Simulation + agent layer (open-ended).** Simulator
bindings, scenario library, validation traces. This is where the
wiki becomes *useful* to samsinn agents in a closed-loop sense.

---

## 7. Owner decisions (2026-05-13)

1. **Framing → authentic.** Plan is recalibrated to "authentic-style
   reference for agent simulations." Sections 4.3, 4.7, and 5 are in
   scope.
2. **One wiki.** Conduct of Operations, ConOps, human-factors, plant
   reference, simulation/agent layer all live in `pwr-ops`. Schema
   in `CLAUDE.md` grows accordingly. No sibling-wiki split.
3. **procmd spec lands in talkingAgents first**, then the wiki repo
   adopts. Validator in the wiki repo and parser in `talkingAgents`
   stay version-locked.
4. **Disclaimers stay as-is.**

---

## 8. Stress-test of §§1–6 — dual-consumer perspective

This section adversarially reviews the plan in §§1–6 against the
**second consumer**: a samsinn agent (or any agent on the procedure
tool) that pulls the markdown, parses it, and reasons over it. The
existing implementation surface:

- `src/wikis/wiki-fetcher.ts` — raw.githubusercontent fetch + 5 min
  in-memory buffer + `extractProcedureIds` (regex on `[[X]]` in
  `index.md`).
- `src/packs/pwr-ops/procmd/parser.ts` — **partial** procmd v0.6
  parser. Comment header lists what it *defers*: `When:`, `Until:`,
  `Abort-if:`, `Because:`, `Against:`, sub-steps (`### Step`),
  `Concurrent:`, `CSF:`, `[primitive]` override, `## Tags` appendix
  metadata, profile-vocabulary validation.
- `src/packs/pwr-ops/procmd/renderer.ts` — markdown + mermaid
  flowchart; `freeText` branches dropped from diagram by design.
- `src/packs/pwr-ops/tools/procedure-lookup.ts` — fuzzy id match,
  graceful fallback to raw on parse failure, no JSON mode, no
  symptom search.
- The wiki repo's own `validate.ts` is a **separate** procmd
  implementation — handles `## Tags` appendix metadata, tag-id
  charset, sim-path consistency, edge-label vocabulary. **Two
  implementations of one spec.**

### 8.1 Findings (severity-ranked)

| # | Severity | Finding | Disposition |
|---|---|---|---|
| F1 | **Critical** | Parser silently drops `Because:` / `Against:` rationale lines (deferred). E-0's design effort going into branch rationale is invisible to agents — they get only `condition → target`, not the *why*. | **Adopt** — promote rationale parsing to v0.6 baseline. Without it, the authenticity work in Phase B is wasted on the agent surface. |
| F2 | **Critical** | Parser drops `## Tags` appendix metadata (deferred). Agents see only the tag *names* extracted from inline refs; they have no sim-path, units, equipment, setpoints, or source attribution. This blocks scenario binding and CSF reasoning. | **Adopt** — parse Tags appendix into the `ParsedProcedure` shape. Validator already does this; port the logic. |
| F3 | **Critical** | Parser drops `CSF:` declarations (deferred). E-0 has six `CSF:` lines at the top describing which status trees are placed in service; agents cannot reach them. Function-restoration reasoning is therefore impossible from the parsed output. | **Adopt** — parse `CSF:` and `Concurrent:` into `ParsedProcedure.concurrentChannels`. |
| F4 | **High** | Parser drops `Within:` time constraints (used by FR-S.1 already, will be in every FR-x after Phase C). Agents have no notion of step urgency. | **Adopt** — parse `Within:` per step. Renderer shows clock icon; KG exports `time-constraint`. |
| F5 | **High** | Two implementations of procmd: validator in wiki repo, parser in `talkingAgents`. They will drift. Validator already handles things parser doesn't (tag-id charset, sim-path consistency). | **Adopt** — extract a shared `procmd-core` package (small, zero-dep, TypeScript) consumed by both. Or: declare the wiki's `validate.ts` normative and have the parser load tests against a frozen test corpus shared between them. |
| F6 | **High** | Tool returns only markdown. An agent needing the structured form must re-parse the rendered markdown — losing branch targets, tag metadata, decision-tree topology that the parser already extracted. | **Adopt** — add `format: 'markdown' \| 'json' \| 'both'` parameter to `procedure_lookup`. Default `markdown` for back-compat; agents that reason structurally pass `json`. |
| F7 | **High** | `extractProcedureIds` regexes `[[X]]` out of `index.md`. After the Phase F nav restructure (Procedures / Plant reference / Operations / Human factors / Simulation & agents), `index.md` may not list every page as a wikilink. The ids will silently disappear from the tool's index. | **Adopt** — switch to a `wiki/_manifest.yaml` (or `wiki/index.json` built by the wiki's render pipeline). The wiki owns its own manifest; the tool reads it. Brittle regex coupling gone. |
| F8 | **High** | Phase D/E/F adds 8+ new page types (`system-description`, `setpoint-catalogue`, `hf-action-class`, etc.). The current tool is `procedure_lookup` — narrow. Agents will need an analogue per type, or one generalized tool. | **Adopt** — generalize. New tool family: `wiki_lookup(type, id)` for non-procedure pages, with `procedure_lookup` either retained as a thin wrapper or deprecated. Driven by manifest in F7. |
| F9 | **Medium** | No symptom-based discovery. An agent in dialog encountering "SG narrow-range level dropping" can't find FR-H.5 unless it already knows the id. | **Adopt for Phase F** — `procedure_search` tool that scans `entry-triggers`, tag refs, and step `Check:` lines. Backed by a `wiki/_search-index.json` built at deploy time. |
| F10 | **Medium** | Mermaid `freeText` branches intentionally dropped from diagram. For "authentic", `→ END` and `→ continue manually` *are* valid terminal states an agent might need to see. | **Adopt** — render freeText branches as ⊞ leaf nodes (small grey terminals). Keeps the diagram complete; doesn't break smaller models because the targets aren't expected to be clickable. |
| F11 | **Medium** | No structured exposure of decision-step topology. Agents that want to render the CSF status tree, or build a graph DB of branch reachability, must re-parse. (Related to F6.) | **Folded into F6** — JSON mode exposes the full branch graph. |
| F12 | **Medium** | Tool description says "paste verbatim, do not summarize." For large procedures this forces the entire page into the chat context every time. Agents have no way to ask for "just step `verify-si-pumps`" or "just the entry conditions." | **Adopt** — `step: '<step-id>'` parameter that returns only the named step + adjacent branch targets. `mode: 'summary'` returns frontmatter + entry-conditions + step count. |
| F13 | **Medium** | No `procedure-md` version handshake. Parser doesn't read the frontmatter `procedure-md:` field; if wiki ships v0.7 with breaking changes, the tool silently produces wrong output. | **Adopt** — parser asserts compatible `procedure-md:` version; on mismatch, return raw md with a banner "tool version X, procedure version Y — showing raw source." |
| F14 | **Medium** | No fallback fetch path. If raw.githubusercontent.com is rate-limited or down, tool fails. The rendered HTML at samsinn-wikis.github.io is the same content. | **Adopt** — fallback to `https://samsinn-wikis.github.io/pwr-ops/procedures/<id>/raw.md` *if* the wiki builds a sidecar raw.md per page (Phase A wiki-side change). Otherwise fall back to scraping the rendered HTML — uglier but always available. |
| F15 | **Medium** | Authentic Westinghouse "two-column" ERG visual style (instruction column / Response Not Obtained column) is the single most distinctive feature of real WOG procedures. Neither the wiki render nor the agent render reproduces it. CLAUDE.md notes this is "flattened to procmd" — the flattening is correct semantically but loses operational feel for the web reader. | **Adopt selectively** — add a `two-column` render mode to the wiki build (CSS only; the procmd source stays flat). Procedure mds get a "View two-column" toggle alongside the existing visibility popover. Agent render unchanged. |
| F16 | **Medium** | Renderer marks any branch-bearing step as a diamond. Many `Check:` steps in E-0 have one "OK → next, fault → escalate" pair — they're conditional jumps, not decisions. Visually noisy. | **Adopt low-priority** — heuristic: diamond only if ≥2 *substantive* branches (excluding "OK → next" continuation). Cosmetic. |
| F17 | **Medium** | Centralized tag catalogue (§4.5) — neither parser nor renderer currently knows about cross-file tag definitions. Naively adopting it makes every procedure require a second wiki fetch on parse, or makes the wiki render time pre-inline the catalogue. | **Adopt with explicit design** — wiki render pipeline inlines the catalogue at build time (so each procedure's deployed `.md` is self-contained) AND keeps the canonical catalogue page for human readers. Parser unchanged. Trade: deployed md gets larger; wins simplicity. |
| F18 | **Medium** | `entry-condition:` frontmatter (§4.4) — parser reads only specific frontmatter fields explicitly; unknown fields silently ignored. Authoring it without parser changes means agents still don't see it. | **Adopt** — parser passes through *all* frontmatter as `fm.extra: Record<string, unknown>` so additive fields work without parser churn. Just be careful with YAML parsing — current parser uses a naive line regex that won't handle nested YAML maps. |
| F19 | **Medium** | No tool-side instrumentation. We can't tell which procedures agents reach for, which calls fail, which fall through to fuzzy match. After Phase B authoring, this is the only signal of "is the wiki useful." | **Adopt** — wire `procedure_lookup` into samsinn's structured logging (already JSONL per-instance). Log `{tool, id, success, parse_warnings, mermaid_valid, cache_hit, duration_ms}`. No content; just metadata. |
| F20 | **Low** | "Paste verbatim" mandate in tool description vs. agents that *will* paraphrase for terse channels. The constraint cannot be enforced in-prompt. | **Document, don't fight** — keep the directive but stop relying on it. F12 (step-level fetch) gives the agent a smaller payload to paste verbatim when that's the right thing. |
| F21 | **Low** | Mermaid validator's `<>` heuristic is dead code (the inner check never fires). Cosmetic. | **Defer** — clean up when next touched. |
| F22 | **Low** | No CDN / edge cache for the wiki itself. samsinn-wikis.github.io is GitHub Pages, has its own cache, fine in practice. | **No-op.** |
| F23 | **Medium** | **For new page types (Phase E human-factors, ConOps)**: these are *not* step-structured. Forcing them through procmd shape would be procrustean. They need their own page schemas with their own parsers — and the procedure tool must know to dispatch on `type:` frontmatter. | **Adopt** — define page-type schemas in CLAUDE.md (one section per type). Add a `parsePageByType(raw)` dispatcher in samsinn that picks the right parser. JSON mode (F6) returns `{ type, parsed }` discriminated union. |
| F24 | **Medium** | Procmd v0.6 freezes on a moving target. If the wiki adds, say, a `Pre-condition:` keyword in v0.7, all v0.6 parsers in deployed agents break. | **Adopt** — version negotiation. Tool sends its parser version to the wiki manifest; manifest declares min/max compatible procmd spec. Mismatch → raw fallback with a warning, not a hard failure. |
| F25 | **High** | **Scenario layer ↔ procedure layer drift.** Phase F adds `scenario` pages that cross-reference procedure step IDs. If a procedure step is renamed (intra-page id change), scenarios silently break. The validator only checks references *within* the procedure corpus. | **Adopt** — extend `validate.ts` to scan all page types for `[[P-id#step-id]]` refs and verify them against the resolved procedure step IDs. Cross-cutting validation, not per-type. |

### 8.2 What §§1–6 got right, and what it missed

**Right:**
- Depth-first authoring rhythm with validator green per commit.
- Sources-first (Tier 1–5) before authoring.
- Recognising that the corpus is bimodal (4 developed, 35 stubs) and
  treating that as a *process* problem, not a content problem.
- Separating the procmd spec extensions from the content work, so
  each can move at its own pace.
- Identifying SAMG handoff as a gap (Phase D §5.1).

**Missed:**
- The plan was wiki-centric. **Half the value is delivered through
  the procedure tool, and the tool's parser is the bottleneck for
  most of the v0.6 extensions.** Without parser work, authoring
  rationales / time constraints / `## Tags` metadata is invisible
  to agents.
- The two-implementations-of-procmd problem (F5). Procmd is now
  the project's lingua franca; it deserves shared code.
- Manifest-as-API (F7, F8). Without it, every nav restructure
  breaks the tool.
- Agent-side payload shapes (F6, F11, F12). "Hand the model the
  whole markdown" is fine for occasional reference; with Phase C
  procedures running to 200–400 lines each, it's a context-budget
  problem.
- Cross-page reference validation across non-procedure page types
  (F25).
- Telemetry (F19) — we'll be flying blind on whether the wiki is
  actually useful in agent loops.

---

## 9. Revised unified plan (replaces §6)

The phases are reshuffled so that **parser & tool work lands ahead
of the content that depends on it**, and so that each content phase
ships agent-ready (not just human-readable).

### Phase A — Foundation: spec + tooling alignment (1.5–2 weeks)

Goal: end this phase with one canonical procmd v0.6 spec + parser +
validator, no drift, manifest-driven tool, instrumented.

| Workstream | Where | Outcome |
|---|---|---|
| Promote deferred procmd keywords in parser | `talkingAgents/src/packs/pwr-ops/procmd/parser.ts` | Parses `Because:` / `Against:` / `Within:` / `Caution:` / `Note:` / `CSF:` / `Concurrent:` / `## Tags` appendix into `ParsedProcedure`. F1, F2, F3, F4. |
| Extract `procmd-core` shared lib | new `talkingAgents/src/procmd-core/` consumed by `wiki-fetcher` ingest *and* by wiki-repo `validate.ts` (vendored or published) | One implementation. F5. |
| Frontmatter passthrough | parser | `fm.extra: Record<string,unknown>` so additive frontmatter doesn't need parser churn. F18. |
| Version handshake | parser | Read `procedure-md:` field, assert compatible. Raw fallback with banner on mismatch. F13, F24. |
| Wiki manifest | `pwr-ops/wiki/_manifest.json` built by `scripts/build-manifest.ts` at deploy time | Lists `{ id, type, path, title }` for every page. Tool reads this instead of regexing `index.md`. F7. |
| `format: 'markdown' \| 'json'` param on `procedure_lookup` | tool | Agents can request the parsed shape. F6, F11. |
| `step: '<id>'` and `mode: 'summary'` params | tool | Smaller payloads. F12. |
| Telemetry hook | tool + samsinn logging | Per-call JSONL log: tool/id/success/warnings/duration. F19. |
| Fallback to GitHub Pages | tool | If raw fetch fails, try `samsinn-wikis.github.io/<id>/raw.md` sidecar; if that also fails, last resort scrape rendered HTML. Wiki build needs to drop raw.md sidecars in `_build/wiki/` and copy into `site/`. F14. |
| UI fixes shipped earlier this session | wiki repo | Already done. |
| `wiki/sources.md` | wiki repo | Already done. |
| Coverage-status column in `wiki/index.md` | wiki repo | ✅ developed / 🟡 partial / ⬜ stub. |

**Exit criteria:** parser round-trips every existing `wiki/procedures/*.md` losslessly; tool returns equal-quality results before/after; manifest builds in CI; telemetry visible in samsinn logs.

### Phase B — Harden the 4 developed EOPs (1–2 weeks)

Same scope as old §3.1 (E-0..E-3 polish). Now leverages Phase A
parser features — every revision adds rationales / cautions / time
constraints that *agents can see*.

### Phase C — Stub completion, depth-first, agent-aware (6–8 weeks)

Same scope as old §3.2–3.4 (ES, ECA, FR-x). Two augmentations:

- Every completed procedure ships with full `## Tags` appendix
  (sim-path, units, equipment, setpoint, source citation per F17).
- Every FR-x ships `entry-condition:` frontmatter (per F18 pass-through;
  consumed in Phase D scenario layer).
- procmd extensions §4.3 (`hf:` step tags), §4.6 (`Decision:`),
  §4.7 (setpoint annotations) land here as their first authoring
  case demands.

### Phase D — Plant reference layer (3–4 weeks)

| Subsystem | Pages |
|---|---|
| `type: system-description` | RCS, ECCS, AFW, MSS, RPS, ESF, electrical, containment, RHR, CVCS, NIS, BOP. One page each. Cite WTSM section. |
| `type: tag-catalogue` | `wiki/tags/pwr-4loop.md` — single source for all `«TAG»` defs, inlined at build per F17. |
| `type: setpoint-catalogue` | `wiki/setpoints/pwr-4loop.md` — every setpoint with source cite. |
| `type: tech-spec` | LCO + SR + AOT excerpts; cross-linked from steps that depend on tech-spec actions. |
| `type: lineup` | Valve/breaker positions for normal, post-trip, recirc alignments. |
| Mermaid P&ID / one-lines | `wiki/diagrams/*.md` |

Each new type gets a CLAUDE.md schema section, a `procmd-core`
parser, and a `wiki_lookup` tool dispatch entry (per F8).

### Phase E — Operations + human factors (3–4 weeks)

Same as old §5.3, §5.4. Each page type gets its own schema and
parser. New tools (per F8): `conops_lookup`, `human_factors_lookup`.
Single tool family, single manifest.

### Phase F — Simulation + agent layer (open-ended)

| Page type | Tool |
|---|---|
| `type: scenario` | `scenario_lookup` |
| `type: simulator-binding` | `simulator_binding_lookup` |
| `type: validation-trace` | `validation_trace_lookup` |
| EAL cross-walk | `eal_classify(scenario)` |

Cross-page reference validation lands here (F25): scenarios refer
to procedure steps, so `validate.ts` must check ref integrity across
the corpus.

`procedure_search` tool (F9) lands as part of this phase, backed by
`wiki/_search-index.json` built at deploy time.

### Phase G — Visual authenticity (parallel to D, optional)

Wiki-build-only changes (CSS + JS in `overrides/`):

- Two-column ERG render toggle (F15) — visualises `Check:` /
  `Action:` as the "instruction column," branches as the "RNO column."
  Source procmd unchanged.
- Diamond-only-when-≥2-substantive-branches heuristic in the
  build-time mermaid pre-rendering (F16).
- `freeText` terminals visualised (F10).

No agent-side impact.

### Phase H — Drift guards (continuous)

Health-audit-style checks the project already does well:

- `validate.ts` extended to cross-page reference checks (F25).
- `procmd-core` test corpus: one fixture per procmd feature; both
  parser and validator run against it in CI. Drift becomes a CI red.
- Telemetry-driven authoring: dashboard of `procedure_lookup` failures
  → backlog of pages to author / fix.

### 9.1 Phase dependency graph

```
A (spec + tooling)
├── B (harden 4 EOPs)
├── C (stub completion)
│    ├── needs A.parser-rationales for E-series revisions
│    └── needs A.tag-appendix-parser for FR-x setpoints
├── D (plant reference)
│    ├── needs A.wiki_lookup dispatch
│    └── needs A.tag-catalogue-inline build step
├── E (CoOps + HF)
│    └── needs D.system-descriptions to cross-reference
├── F (sim + agent)
│    └── needs A..E (it indexes everything)
├── G (visual two-column)  — parallel to D, no deps
└── H (drift guards)       — continuous from Phase A
```

### 9.2 What ships in this branch vs. follow-ups

**This branch (today):**
- UI fixes (done)
- `wiki/sources.md` (done)
- `PLAN.md` (this document; done)

**Immediate next branch (Phase A, ~1.5 weeks of focused work):**
- procmd parser extensions in `talkingAgents/src/packs/pwr-ops/procmd/parser.ts`.
- Shared `procmd-core` extraction.
- `wiki/_manifest.json` build script + deploy workflow integration.
- `procedure_lookup` parameter surface: `format`, `step`, `mode`.
- Telemetry hook.
- Coverage-status column on `wiki/index.md`.

Phases B–H are sized for the user's pace; the dependency graph keeps
each phase shippable independently once Phase A lands.

### 9.3 Risks not yet mitigated

- **Procmd specification process.** With v0.6 already informally
  promoted in parser comments but never blessed in
  `docs/procedure-md.md`, the spec doc is lagging. Recommend: one
  CHANGELOG-bump per parser feature change, never a silent promotion.
- **Wiki repo as the wagging tail.** If `pwr-ops/validate.ts` keeps
  evolving independently of `procmd-core`, F5 returns. The shared
  lib has to be the *only* implementation, even if the wiki repo
  vendors it.
- **Manifest as the wire protocol.** The schema of
  `wiki/_manifest.json` is now load-bearing for the tool. Treat it
  like a public API: version it, document it, never break it without
  a migration.
- **Two-column render** could swallow weeks if approached as a full
  Material theme override. Time-box to one week or defer to Phase G.
- **Telemetry privacy.** No content in logs — only ids and
  durations. Confirm before shipping with multi-tenant cookie-bound
  instances.

### 9.4 Decision points the owner should confirm before Phase A starts

1. **Shared lib placement.** `talkingAgents/src/procmd-core/` (owned
   by main repo, wiki vendors) **vs.** new repo
   `samsinn-wikis/procmd-core` (owned independently, both consumers
   depend). Recommend: in `talkingAgents` for now; promote to its
   own repo only if a third consumer appears.
2. **Manifest format.** JSON (machine-built, machine-read) **vs.**
   YAML (also human-readable). Recommend JSON, generated at deploy;
   `wiki/index.md` stays the human-readable catalogue.
3. **Tool surface.** Keep `procedure_lookup` and add separate
   `wiki_lookup` for non-procedure types, **vs.** rename
   `procedure_lookup` → `wiki_lookup` with a `type:` parameter.
   Recommend keep both: `procedure_lookup` stays as the agent's
   "give me an EOP" shortcut, `wiki_lookup` is the generalised form.
4. **Telemetry sink.** Reuse existing samsinn JSONL logs, or a
   separate procedure-tool log file? Recommend reuse.

---

## 10. Phase A — what landed, what's still owed

### 10.1 Landed (Phase A.1–A.7)

| Workstream | Repo | Commit |
|---|---|---|
| Paragraph-level feedback bubbles + worker-URL placeholder + icon de-overlap | pwr-ops | `60da8fd` |
| Sources page (tiered NUREG/WTSM/UFSAR refs) + audit/rewrite PLAN + coverage badges on index | pwr-ops | `7f448e2` |
| `scripts/build-manifest.ts` + workflow integration + initial `wiki/_manifest.json` | pwr-ops | `2564d40` |
| procmd v0.6 parser promotion (Because/Within/CSF/Concurrent/Tags appendix) + frontmatter passthrough + version handshake | talkingAgents | `581d33f` |
| Renderer wiring (rationale, ⏱️ Within, CSF channels, structured Tags table) | talkingAgents | `581d33f` |
| Tool surface: `format` / `step` / `mode` parameters | talkingAgents | `581d33f` |
| Wiki manifest binding (`manifestFile` opt-in, regex fallback) | talkingAgents | `a5a1411` |
| Telemetry hook (per-call JSONL on stderr) | talkingAgents | `a5a1411` |
| GitHub Pages fallback for manifest | talkingAgents | `a5a1411` |

Tests: 1397 pass / 0 fail. Typecheck clean. Findings closed: F1, F2, F3, F4, F6, F7, F8, F11, F12, F13, F14, F18, F19, F24.

### 10.2 Phase A residuals (owed)

| Finding | What's left | Recommended slice |
|---|---|---|
| **F5** | Two procmd implementations (`talkingAgents` parser + wiki `validate.ts`). Promoted to **Phase A′** below — must land before Phase B authoring. | Phase A′ |
| **F9** | Symptom-driven `procedure_search` tool. Needs `wiki/_search-index.json` built at deploy time. | Phase F |
| **F10** | Mermaid renders `freeText` branches as dropped edges. Cosmetic. | Phase G |
| **F15** | Two-column ERG visual render mode. Web-side polish. | Phase G |
| **F16** | Diamond-only-when-≥2-substantive-branches heuristic. Cosmetic. | Phase G |
| **F17** | Build-time inlining of central tag catalogue. Needed once Phase D ships the catalogue. | Phase D |
| **F19 (proper)** | Telemetry currently emits to stderr. Real LogSink integration needs `ToolContext.logEvent`. Cross-cutting. | Phase H (continuous) |
| **F20** | "Paste verbatim" mandate vs paraphrasing agents. Documented; nothing to fix. | — |
| **F21** | Dead `<>` heuristic branch in mermaid validator. Cleanup. | Phase G |
| **F22** | No CDN cache for wiki. GitHub Pages caches; no-op. | — |
| **F23** | Schemas for non-procedure page types. | Phases D / E / F |
| **F25** | Cross-corpus reference validation (scenarios → procedure steps). | Phase F + Phase H |

---

<!--
  §11–§21 below were stress-tested on 2026-05-13 (see §22 disposition table
  and §23 changelog). This version supersedes the prior draft. Owner
  directives applied: bump everything to v0.6 atomically; Vogtle as
  reference plant; per-family commits; no backward compatibility.
-->

## 11. Phase A′ — `procmd-core` extraction + atomic v0.6 bump (~2 days)

Goal: one normative procmd implementation consumed by both the samsinn
parser/tool surface and the wiki repo's `validate.ts` + `render-procmd.ts`.
At the same time, rationalize the version model: every artifact (parser,
validator, mkdocs.yml, every procedure frontmatter) declares procmd
**v0.6**. No backward-compat reads of v0.5.

### 11.1 Workstreams

**A′.1 — Package layout (`talkingAgents/src/procmd-core/`).** Minimal scope
per F-NEW-7:
- `parser.ts` — moved from `src/packs/pwr-ops/procmd/parser.ts`
- `types.ts` — `ParsedProcedure`, `TagDefinition`, `Branch`, `ParsedStep`,
  `BranchTarget`, frontmatter shape
- `fixtures/` — shared test corpus (E-0.md, FR-S.1.md, plus synthetic
  edge cases: missing Tags appendix; unknown frontmatter keys; branch
  with both Because and Against; multi-line Within; `## Tags` followed
  by `## Step`; intra-id with hyphens)
- `index.ts` — public API barrel
- `README.md` — spec pointer + supported version

**Validator and renderers stay where they are** (per F-NEW-7, F-NEW-13):
- Wiki repo: `validate.ts` (corpus-wide checks) imports `procmd-core` for parsing
- Wiki repo: `scripts/render-procmd.ts` (322 lines; procmd → MkDocs-flavored md) imports `procmd-core` for parsing
- samsinn repo: `src/packs/pwr-ops/procmd/renderer.ts` (procmd → agent markdown + mermaid) imports `procmd-core` for parsing
- samsinn repo: `src/packs/pwr-ops/procmd/parser.ts` becomes a thin re-export of `procmd-core` (kept as the pack-relative import path)

**A′.2 — Vendor mechanism (committed copy + SHA pin, per F-NEW-3).**
- `pwr-ops/procmd-core/` is a vendored copy of `talkingAgents/src/procmd-core/`
- `pwr-ops/procmd-core.sha` pins the source commit
- Wiki CI verifies the vendored copy's `git hash-object` chain matches the SHA pin
- Local dev has no network requirement at validate time
- Updating procmd: PR to talkingAgents → record SHA → wiki repo bumps pin in a follow-up

**A′.3 — Atomic v0.6 bump (per F-NEW-1, F-NEW-17).** One commit each side.

Wiki repo (single commit `chore(procmd): bump to v0.6`):
- Bump every `wiki/procedures/*.md` frontmatter from `procedure-md: 0.5` → `0.6` (39 files)
- Bump every `wiki/profiles/*.md` similarly (1 file)
- Bump `mkdocs.yml` `extra.procmd_version: "0.6"`
- Bump `validate.ts` `SUPPORTED_SPEC_VERSION = "0.6"` (also reject "0.5" — no back-compat)
- Bump `scripts/build-manifest.ts` default `procmdVersion = '0.6'`

samsinn repo (single commit `feat(procmd-core): v0.6 baseline + extract shared lib`):
- Move parser.ts into `src/procmd-core/`
- Update `PARSER_PROCMD_VERSION = '0.6'`; remove the `ACCEPTED_PROCMD_VERSIONS` Set (only 0.6 accepted; unknown → warning, as today)
- Pack parser becomes re-export shim
- All 1397 tests still pass

**A′.4 — Frontmatter `procmd-core` v0.6 = "complete v0.5"**. No new keywords
in this version. The bump is purely a relabel: the parser, the validator,
and the wiki content all agree on a single number. **First real spec
increment becomes v0.7 in Phase B with `Decision:`.**

**A′.5 — Drop `manifest.generatedAt` (per F-NEW-2).** Git commit time is
the timestamp. Remove the field from the manifest schema and from the
build script. Commit the regenerated `_manifest.json`.

**A′.6 — Spec doc.** Update `talkingAgents/docs/procedure-md.md` to v0.6
normatively. Document every keyword, every frontmatter field, the `extra`
passthrough rule, the version-handshake behaviour, the `## Tags` appendix
shape, the `Because:` / `Against:` rationale rules, the `Within:` rule.
**Versioning protocol section:** v0.X bumps may add keywords but never
break parsing of prior content; the wiki's atomic bump pattern stays the
convention.

**A′.7 — Step ID atomicity rule (per F-NEW-5).** Add to CLAUDE.md (wiki):
"Step IDs are contracts. Once a stub is authored with a step ID, the ID
is frozen — even if the step body is later replaced. Re-authoring a stub
preserves all existing step IDs and adds new ones; never renames." This
unblocks per-family commits in Phase C without having to keep all cross-pages
in lockstep.

### 11.2 Exit criteria

- One implementation of procmd parsing; three consumers (samsinn parser
  shim, wiki validate.ts, wiki render-procmd.ts) import it.
- Wiki `bun validate.ts` produces identical findings to pre-extraction
  (validated against current corpus output).
- Vendored copy verified against `procmd-core.sha` in CI.
- `docs/procedure-md.md` describes v0.6 normatively.
- 1397+ test count maintained.
- Manifest no longer churns on `generatedAt`.

### 11.3 Risk register

| Risk | Mitigation |
|---|---|
| Vendored copy drifts from source | SHA-pin file + CI verification; drift → CI red. |
| Renderer-specific quirks (mermaid escaping) leak into core | Renderer stays per-consumer. Core exposes parser + types only. |
| Two-PR round-trip for procmd changes | Documented in `docs/procedure-md.md`. Estimated 30-min cycle. Acceptable given the once-per-version-bump frequency. |
| Existing pack-test imports break during shim transition | Shim preserves the same export surface. Run `bun test` after every file move. |

---

## 12. Phase B — Harden the 4 developed EOPs (~1 week)

Goal: each of E-0 / E-1 / E-2 / E-3 carries full operator-readable content
— complete `## Tags` appendix, Cautions inline, branch rationales, numeric
setpoint thresholds from the **Vogtle UFSAR**, time constraints. Both
consumers (web reader + agent) see the improvement. The build-manifest
classifier promotes E-2 from `partial` to `developed`. Phase B introduces
procmd v0.7's first real new keyword: `Decision:`.

### 12.1 Reference plant decision (per F-NEW-4)

**Vogtle Units 1 & 2 UFSAR** is the reference plant for all numeric
setpoints, alarm thresholds, and operating limits. Cite as `per Vogtle
UFSAR Rev. X §15.6` in tag `source:` fields. The wiki's `applies-to:`
frontmatter remains `Westinghouse 4-loop PWR` for generality, but the
*numbers* are Vogtle-specific. README + scope.md gain a paragraph
declaring Vogtle as the numeric reference.

### 12.2 procmd v0.7 — `Decision:` step keyword

First real spec increment. Authoring shape:

```
## Step 16 [id: identify-ruptured-sg]
Decision: identify the ruptured SG using the following paths in order
1. N-16 monitor reading «SG-x-N16» elevated → SG-x is ruptured
2. SG narrow-range level rising uncontrollably → SG-x is ruptured
3. Steam-line activity sample → SG-x is ruptured
4. Blowdown radiation → SG-x is ruptured
- Ruptured SG identified → #isolate-ruptured-sg
- No SG identified after exhausting paths → [[ECA-3.3]]
```

Parser: new `decision: { paths: ReadonlyArray<string>; prologue: string }` field on `ParsedStep`. Renderer: numbered list with each path; mermaid shows the step as a diamond regardless of branch count. Validator: warns if `Decision:` step has only one branch (degenerate).

### 12.3 Per-procedure punch list

**E-0 — Reactor Trip or Safety Injection.**
- Convert step 7's "MSIV will not close" buried `Because:` to a top-level `Caution:` (per audit §1.1).
- Add `SUB-MARGIN` tag (subcooling margin) with sim-path; reference in step 11 RCP-trip criterion.
- Add `Within:` constraints on time-critical steps (RCP trip after voiding; Phase B isolation).
- Add `source:` field to every existing tag-appendix entry citing Vogtle UFSAR section.

**E-1 — Loss of Reactor or Secondary Coolant.**
- Author full `## Tags` appendix (currently absent).
- Step 3 RCP-trip criterion: numeric subcooling-margin threshold from Vogtle UFSAR 15.6 (specific value cited in commit).
- Add explicit RWST-low-level branch step pointing to `[[ES-1.3]]`.
- Step 7 pressure-trend diagnostic: convert to `Decision:` (v0.7 first user).

**E-2 — Faulted Steam Generator Isolation.**
- Author full `## Tags` appendix.
- Verify AFW-isolation-before-MSIV ordering against WTSM §10 (water-hammer / level-swell risk).
- Add steam-dump-from-intact-SGs branch with `Within:`.
- **Target: re-classify as `developed` in next manifest build.**

**E-3 — Steam Generator Tube Rupture.**
- SGTR-identification step → `Decision:` with four enumerated detection paths.
- Author full `## Tags` appendix including all N-16 and rad-monitor tags.
- Branches to ES-3.1/3.2/3.3 currently land in stubs; flag with `Note: target procedure is a Phase C stub` until Phase C lands them.

### 12.4 Renderer-parity gate (per F-NEW-6)

`Decision:` is rendered in **both** consumers before Phase B exits:
- samsinn renderer: numbered prologue list followed by branch list
- wiki render-procmd.ts: same prologue presentation
- mermaid: diamond shape for any `Decision:` step

No Phase B procedure ships authoring a field that hasn't got a render path.

### 12.5 Exit criteria

- All 4 E-series classified `developed` in build-manifest.
- Validator green; tests green.
- Every numeric value in commits cites Vogtle UFSAR section.
- `Decision:` keyword has parser + renderer + validator support in both
  consumers.
- `procedure_lookup E-0 --format=json` exposes every Because/Within/Caution
  to an agent.

---

## 13. Phase C — Complete 35 stubs, depth-first by family (~8–10 weeks)

Goal: every procedure in the corpus reaches `developed` (or documents its
residual gap). All numbers cite Vogtle UFSAR. Author order is
dependency-driven: FR-x (self-contained CSF responses) → ES (post-trip
recovery, depends on FR-x) → ECA (extreme conditions, depends on both).

### 13.1 Author order, ~9 commits (per F-NEW-16)

| Commit | Family | Procedures | Why this order |
|---|---|---|---|
| C.1 | FR-S | FR-S.1, FR-S.2 (ATWS, loss of shutdown) | Smallest family; well-bounded physics |
| C.2 | FR-C | FR-C.1, FR-C.2, FR-C.3 (core cooling) | Physics-heavy but isolated; vocabulary for FR-H |
| C.3 | FR-H | FR-H.1–H.5 (heat sink, 5 procs) | Biggest family; reuses FR-C vocabulary |
| C.4 | FR-P | FR-P.1, FR-P.2 (PTS) | Bounded by RCS T/P window; few branches |
| C.5 | FR-Z | FR-Z.1–Z.3 (containment) | Post-Fukushima H₂ guidance in Z.1 |
| C.6 | FR-I | FR-I.1–I.3 (inventory) | Depends on FR-C concepts |
| C.7 | ES (clean-path) | ES-0.1, ES-1.1 | Most common E-0 destination; SI termination |
| C.8 | ES (cooldown + recirc) | ES-1.2, ES-1.3, ES-1.4, ES-0.2 | Recirculation is operationally tightest |
| C.9 | ES (rediag + SGTR cooldown) | ES-0.0, ES-3.1, ES-3.2, ES-3.3 | Cross-references ES-0.x and E-3 |
| C.10 | ECA (SBO) | ECA-0.0 | Largest single procedure; allow split if needed |
| C.11 | ECA (other) | ECA-1.1, ECA-1.2, ECA-2.1, ECA-3.1, ECA-3.2, ECA-3.3 | Depends on E-/ES- already authored |

Total: 11 family-level commits (slightly more than 9 because ES- splits naturally into 3 sub-batches and ECA-0.0 may warrant its own commit). Each commit is reviewable as a coherent batch.

### 13.2 Per-procedure authoring template

For every page:
1. **Read sources first.** Tier-1 (NUREG-0899, NUREG-0737 Suppl 1, EPRI guide) for *form*; Tier-2 (WTSM) for *systems*; **Vogtle UFSAR** for *setpoints*. Cite each in tag `source:` field.
2. **Author frontmatter** with `category`, `csfs-monitored`, `entry-triggers`, and (for FR-x) `entry-condition:` structured field (v0.7 addition).
3. **Author preamble**: one-paragraph purpose; CSF declarations for E-/ECA-.
4. **Author steps** with `Check:` / `Action:` / `Within:` / `Caution:` / `Note:` / `Because:` on every non-trivial branch.
5. **Preserve all existing step IDs** (per A′.7 contract). Add new steps with new IDs.
6. **Author `## Tags` appendix** — every referenced tag fully defined: description, sim-path, units, equipment, setpoint where applicable, `source:` citing Vogtle UFSAR.
7. **Run `bun validate.ts`** locally; commit only when green.
8. **Run `bun scripts/build-manifest.ts`** locally; verify classification flips to `developed`.

### 13.3 procmd v0.7 extensions used in Phase C

- **`Decision:`** (already introduced in Phase B). Used in FR-H, ECA-0.0 multi-path diagnostics.
- **`entry-condition:` structured frontmatter** for FR-x:
  ```yaml
  entry-condition:
    csf: core-cooling
    level: red
    triggers:
      - core-exit-tc > 1200F
      - rvls < 30%
  ```
  Frontmatter passthrough already supports unknown keys; parser dedicated handling adds typing.
- **Tag `setpoint:` nested field**:
  ```yaml
  - id: SG-A-LVL-NR
    setpoint:
      lo-lo: 17
      lo: 25
      hi: 75
    source: Vogtle UFSAR §10.4
  ```
- **`hf:` step-level human-factors tags** (vocabulary): `time-critical`, `two-operator`, `error-likely`, `verification-required`, `peer-check`, `independent-verification`. Each gets a renderer badge (per F-NEW-6 parity gate). Used heavily in ECA-0.0 and FR-S.1.

### 13.4 Anti-hallucination discipline (per F-NEW-4)

The single highest-risk failure mode of Phase C is an LLM-authored
setpoint that doesn't match any real plant. Mitigations:

- **Every numeric setpoint MUST cite Vogtle UFSAR section in the tag `source:` field.** No `source:` → validator fails.
- **Vogtle UFSAR Rev. X is pinned in scope.md** so reviewers know which revision drives the numbers.
- **Every Caution:, Note:, and Because: that asserts a physical fact MUST be traceable to Tier 1–5.** Per-commit, the commit message lists citations: `cites: Vogtle UFSAR §15.6.5; WTSM §10.4; NUREG-0737 Suppl 1`.
- **Per-commit reviewer obligation**: spot-check 2 numbers per commit against the cited source. Document review in the commit reply.
- **Pages flagged `validation-needed: true` in `fm.extra`** for any value that I (LLM author) am not high-confidence on. Validator surfaces these as warnings.

### 13.5 Risks

| Risk | Mitigation |
|---|---|
| LLM-hallucinated setpoints | §13.4 anti-hallucination discipline. |
| FR-x physics depth | Cite Todreas & Kazimi for thermal-hydraulics; flag low-confidence with `validation-needed: true`. |
| ECA-0.0 (SBO) too large for one commit | Allow split at natural section boundaries (entry diagnostics → TDAFW management → AC restoration). |
| Cross-page step ID drift during authoring | A′.7 rule: step IDs are contracts. |

### 13.6 Exit criteria

- All 39 procedures classified `developed` (target) or documented residual.
- Validator green across corpus.
- Tag catalogue (Phase D) covers every `«TAG»` reference.
- Every numeric setpoint cites Vogtle UFSAR.
- `procedure_lookup --format=json` returns structurally rich JSON for every procedure.
- Page coverage badges on `wiki/index.md` reflect manifest classification.

---

## 14. Phase D — Plant reference layer (~3–4 weeks)

Goal: the wiki gains the documents needed to *close* on `«TAG»` references
and follow setpoint reasoning. Sibling dirs under `wiki/`; citation URLs
unchanged.

### 14.1 New page types

| Page type | Dir | Schema |
|---|---|---|
| `system-description` | `wiki/systems/` | frontmatter `type: system-description`; mandatory body sections: Function, Components, Instrumentation, Setpoints, Normal alignment, Failure modes |
| `tag-catalogue` | `wiki/tags/` | one canonical `pwr-4loop.md`; per-procedure appendices override (warn) but defaults come from here |
| `setpoint-catalogue` | `wiki/setpoints/` | structured tables of all numeric setpoints with Vogtle UFSAR citations; cross-linked from tag defs and procedure steps |
| `tech-spec` | `wiki/tech-specs/` | LCO + SR + AOT excerpts from Vogtle Tech Spec Section 3/4 |
| `lineup` | `wiki/lineups/` | valve / breaker tables for normal, post-trip, recirc, mid-loop |

### 14.2 Systems to document

Twelve `system-description` pages: RCS, ECCS, AFW, MSS, RPS, ESF, electrical (4 kV emergency + DC + EDG), RHR, CVCS, containment + spray, NIS, BOP. Each cites WTSM section in addition to Vogtle UFSAR.

### 14.3 Build-time tag-catalogue inlining (F17)

The wiki's `scripts/render-procmd.ts` gains a step: expand external tag
references. Each deployed `_build/wiki/*.md` gets an inlined `## Tags`
appendix from the central catalogue PLUS any per-procedure overrides. Source files unchanged.

**Sidecar publishing decision** (deferred from §21 prior draft): defer
until 6+ system pages are written. Tag duplication isn't painful yet.

### 14.4 Manifest v2 schema (additive, non-breaking)

Per F-NEW-9, the speculative top-level `pageTypes` summary is DROPPED.
Manifest v2 adds:
- Per-entry `type: 'procedure' | 'system' | 'setpoint-catalogue' | 'tech-spec' | 'lineup' | 'tag-catalogue'`
- `build-manifest.ts` scans all sibling dirs, not just `wiki/procedures/`

That's it. No top-level summary.

### 14.5 New tool: `wiki_lookup` (per F-NEW-11)

Generalised dispatcher: `wiki_lookup(type, id)`. Returns parsed JSON for any
non-procedure page type. Existing `procedure_lookup` retains specialized
behavior (mermaid rendering, step-level fetch).

### 14.6 Exit criteria

- 12 system-description pages live.
- Tag catalogue covers every `«TAG»` in every procedure.
- Setpoint catalogue covers every numeric setpoint referenced.
- `wiki_lookup` deployed.
- Manifest v2 in production.

---

## 15. Phase E — Operations + Human Factors (~3–4 weeks)

Goal: operational *culture* layer (ConOps, CRM, place-keeping) + agent
reasoning substrate (human factors, error modes, operating experience).

Per F-NEW-8, the wiki's "demonstration of procmd format" disclaimer
becomes less accurate when Phase E lands. Decision deferred until Phase D
exit: rename the wiki to "PWR Operator Knowledge Base," accept scope
drift, or split into a sibling wiki. Flagged in §21 below.

### 15.1 Operations content (`wiki/operations/`)

Each `type: operations-doc`:
- `control-room-conops.md` — roles (RO, SRO, STA, SS), watch-stand, turnover, log-keeping
- `communication.md` — three-way / peer-check / concurrent-verification / independent-verification
- `pre-job-brief.md` — what goes into a brief before procedure entry
- `conservative-decision-making.md` — "if you don't know, stop"
- `procedure-usage.md` — deviation rules, SRO override, place-keeping
- `sta-role.md` — STA reasoning independent of EOP team
- `configuration-control.md` — tag-out, hold orders, independent verification
- `safety-culture.md` — derived from OECD-NEA + IAEA NS-G-2.14 (not INPO)

### 15.2 Human-factors content (`wiki/human-factors/`)

Per F-NEW-10, collapsed from 6 page types to **4**:

| Page type | Coverage |
|---|---|
| `hf-action-class` | One page per common operator-action class (trip RCP under voiding, manually actuate SI, isolate faulted SG). Includes typical execution time, error modes, prerequisites, applicable PSFs (PSFs absorbed in here, not their own page type). |
| `hf-failure-mode` | Slip / lapse / mistake / violation taxonomy with examples from public LER summaries. |
| `hf-time-pressure-profile` | Per-EOP family: "minutes 0–5 / 5–30 / 30–120" demands. |
| `operating-experience` | Public LER / OECD-NEA OE summaries cross-linked to relevant EOPs. CRM commentary absorbed into the `communication.md` and `sta-role.md` operations docs, not its own page type. |

### 15.3 procmd-core schema additions

Each new page type gets:
- Frontmatter schema in `procmd-core/types.ts`
- Type-specific parser in `procmd-core/parser-by-type.ts`
- Tool dispatch entry on `wiki_lookup`

Pattern:
```typescript
export type ParsedPage =
  | { kind: 'procedure'; data: ParsedProcedure }
  | { kind: 'system-description'; data: ParsedSystemDescription }
  | { kind: 'operations-doc'; data: ParsedOperationsDoc }
  | { kind: 'hf-action-class'; data: ParsedHfActionClass }
  | { kind: 'hf-failure-mode'; data: ParsedHfFailureMode }
  | { kind: 'hf-time-pressure-profile'; data: ParsedHfTimePressureProfile }
  | { kind: 'operating-experience'; data: ParsedOperatingExperience }
  // ...
```

### 15.4 Exit criteria

- 8 operations docs + 4 HF page types (at least 2 representative pages each — 8 HF pages minimum).
- `procmd-core/parser-by-type.ts` dispatches on `type:` frontmatter.
- Every EOP family has at least one `hf-time-pressure-profile` + one cross-linked `operating-experience` entry.

---

## 16. Phase F — Simulation + agent integration (~6–8 weeks for v1)

Goal: scenarios cross-link to procedure step IDs; agents traverse the
procedure graph with known starting state and expected outcomes; the wiki
becomes the *substrate* for samsinn-side plant simulations.

### 16.1 New page types

| Type | Dir | Purpose |
|---|---|---|
| `scenario` | `wiki/scenarios/` | Starting plant state + injected faults + expected EOP traversal. Cross-links to procedure step IDs. |
| `simulator-binding` | `wiki/simulator-bindings/` | Maps `«TAG»` set to a specific simulator (samsinn sim, BNL Generic PWR, IAEA basic PWR). |
| `validation-trace` | `wiki/validation-traces/` | Recorded transit with timestamps and decisions. |
| `eal-classification` | `wiki/eal/` | EAL cross-walk: EOP entry conditions → NEI 99-01 EAL (UE / Alert / SAE / GE). |

### 16.2 New tools (per F-NEW-11, only 2 new — others use `wiki_lookup`)

- **`procedure_search`** (F9) — symptom-driven. Backed by `wiki/_search-index.json` built at deploy time. Searches frontmatter `entry-triggers`, tag refs, step `Check:` lines.
- **`eal_classify(scenario)`** — given a scenario or symptom set, returns EAL class.

Everything else (`scenario_lookup`, `simulator_binding_lookup`, `validation_trace_lookup`) is `wiki_lookup(type, id)` — no new tools.

### 16.3 Cross-corpus reference validation (F25)

`procmd-core/validator.ts` scans all page types for `[[P-id#step-id]]`
refs and verifies against resolved procedure step IDs. Scenarios →
procedure-step references are compile-time checks.

### 16.4 Initial scenario catalogue

Author 10 reference scenarios:
- Small-break LOCA (E-0 → E-1 → ES-1.1 → ES-1.2 → ES-1.3)
- Large-break LOCA (E-0 → E-1 → ECA-1.1 → ES-1.4)
- SGTR (E-0 → E-3 → ES-3.1)
- Station blackout (E-0 → ECA-0.0)
- ATWS (E-0 → FR-S.1)
- Steam line break (E-0 → E-2 → ES-0.2)
- Loss of feedwater (E-0 → FR-H.1)
- Excessive cooldown / PTS (FR-P.1)
- Multiple faults (LOCA + station blackout)
- Beyond-design-basis (transition to SAMG)

Scenarios embed initial state (tag values at t=0) — per the recommend in
prior §21, and given user's "do what's needed to work reliably." This
crosses into simulator-input territory; that's intentional.

### 16.5 Exit criteria

- 10 scenarios authored, each validating clean.
- `procedure_search` deployed and used.
- One simulator binding (samsinn sim) published with full tag mapping.
- One end-to-end validation trace per scenario family.

---

## 17. Phase G — Visual + renderer parity gate (continuous from Phase B)

Per F-NEW-6, this is **not optional and not parallel to D** — it's a
*gate* on every phase that adds a new authored field. The plan now says:

> **Renderer-parity rule**: every new procmd keyword or frontmatter
> field gets its render path in BOTH consumers (samsinn renderer +
> wiki render-procmd.ts + Material theme override if needed) before
> the introducing phase exits. No agent-only fields, no web-only
> fields.

Per-phase gate checks:
- Phase B: `Decision:` keyword renders identically in both consumers.
- Phase C: `hf:` step tags render as Material-styled badges in the web view; tag `setpoint:` renders in the appendix table.
- Phase D: `system-description` pages render with their mandatory section structure; new tags render in the inlined appendix.
- Phase E: each new page type has a render path.
- Phase F: scenarios render as a numbered sequence; embed-state shows as a collapsed details block.

### 17.1 One-off cleanups (still Phase G, ~1 week)

- F-NEW-21: drop `<>` heuristic in mermaid validator (dead code).
- F10: mermaid renders `freeText` branches as ⊞ leaf nodes.
- F16: diamond-only-when-≥2-substantive-branches heuristic.
- F15: two-column ERG render toggle (Instruction / RNO columns) via CSS in `overrides/` — defer to Phase G end, time-boxed to 1 week, drop if it bloats.

---

## 18. Phase H — Drift guards (continuous, ~0.5 day setup + ongoing)

### 18.1 Now (Phase A′ landing)

- `procmd-core` shared fixture corpus runs in both repos' CI.
- `build-manifest.ts` runs in wiki CI on every PR; classification deltas surface in PR comment.
- Wiki-repo CI verifies vendored procmd-core matches `procmd-core.sha`.

### 18.2 By end of Phase B (per F-NEW-15 pinned date)

- Implement `ToolContext.logEvent` in samsinn. Wire `procedure_lookup` telemetry through it.
- Retire `defaultTelemetry` stderr writes.
- Telemetry dashboard: per-procedure call counts, fuzzy-match-fallback rate, fetch failures.

### 18.3 By end of Phase C

- Spec change protocol enforced: any procmd keyword change requires CHANGELOG in `docs/procedure-md.md` + parser + validator + fixture in the same commit.
- Vogtle UFSAR revision pin documented and updated.

### 18.4 Continuous

- `extractProcedureIds` regex fallback (per F-NEW-12): mark deprecated once 100% of accessed wikis declare `manifestFile`. Removal target: end of Phase D.
- validate.ts edge-label fossil vocabulary (per F-NEW-14): cleanup queued for any time.

---

## 19. Cross-phase integration: the renderer-parity rule

(Per F-NEW-6 tightening): the load-bearing invariant is

> **Every procmd keyword or frontmatter field that an agent can act on
> MUST have a render path in BOTH the wiki Material theme AND the
> samsinn renderer BEFORE the introducing phase's exit.**

This is enforced by Phase G being a *gate* per phase (§17), not a
parallel polish step. The dual-consumer contract is the design constraint
that organises every other phase.

| Phase | Web reader gains | Agent gains | Spec version |
|---|---|---|---|
| A (done) | Coverage badges, feedback bubbles | Rationale, time, CSF channels, JSON, step/summary | parser: v0.6 internal |
| A′ | Unified validator+parser | Same parsed shape | v0.6 normative (all artifacts) |
| B | 4 hardened EOPs with rich tags, Vogtle citations | Same procedures, structurally richer JSON | v0.7 (Decision:) |
| C | 35 completed procedures | `procedure_lookup` returns rich JSON for every page; hf: tags surface in JSON | v0.7 (hf:, entry-condition:, setpoint:) |
| D | System pages cross-linked from tag defs | `wiki_lookup` resolves `«TAG»` to its system page | manifest v2 |
| E | ConOps + HF reading material | Agents fetch HF action-classes and PSFs | per-type schemas in procmd-core |
| F | Scenario library readable as tutorial | Agents reason over scenarios with full traversal + embedded state | scenario schema + cross-ref validator |

---

## 20. Sequencing summary (revised)

```
A   [done]               UI + sources + PLAN + parser v0.6 + tool + manifest
A′  [next, ~2d]          procmd-core extraction (parser+types only) + atomic v0.6 bump + drop generatedAt + vendor + SHA pin
B   [1w]                 Harden E-0/E-1/E-2/E-3 + v0.7 with Decision: + Vogtle UFSAR citations
C   [8–10w]              Author 35 procedures, 11 family-level commits, v0.7 (hf:, entry-condition:, setpoint:)
D   [3–4w]               Plant reference: 12 systems + tag/setpoint catalogues + manifest v2 + wiki_lookup tool
E   [3–4w]               ConOps (8 pages) + Human factors (4 page types, 8+ pages) + per-type parsers
F   [6–8w]               Scenarios (10) + simulator-binding + EAL + procedure_search + eal_classify + cross-corpus validator
G   [continuous, gating]  Renderer parity rule + one-off polish (~1w)
H   [continuous]         Drift guards, ToolContext.logEvent by Phase B exit, spec change protocol
```

Total wall-clock to "complete first authentic release" (end of Phase F):
~22–28 weeks. Phase A′ is the unlock. Phase C is the long pole. Phase D–F
build the agent-reasoning substrate.

---

## 21. Open questions (residual, non-blocking)

1. ~~**Wiki scope at Phase D exit**~~ — **2026-05-13 revision:**
   de-deferred. Renaming now (when corpus is ~39 mostly-stub procedures
   + 5 reference docs) is dramatically cheaper than later. Owner
   selects new name; rename happens as Phase A′ step #1. GitHub
   auto-redirects old-name URLs for years, so external citation
   breakage is bounded. **Default: `pwr-knowledge-base`** unless owner
   redirects.
2. **HF taxonomy authority.** Plan uses OECD-NEA + IAEA NS-G-2.14
   (public). INPO content is proprietary and not used.
3. ~~**Sidecar raw.md publishing**~~ — **2026-05-13 revision:**
   de-deferred and moved to Phase A′ step #2. Cost ~30 min, benefit
   immediate: every procedure has two independent fetch paths
   (raw.githubusercontent + GitHub Pages). The conflation with
   build-time tag-catalogue inlining (which IS premature) was my
   reasoning error.

---

## 22. Stress-test finding-disposition table (2026-05-13)

Applies to the §11–§21 revision above. Findings from the
`claude-toolbox:stress-test` skill invocation.

| # | Disposition | Reason |
|---|---|---|
| F-NEW-1 (version model mess) | **accepted** | Bumped everything to v0.6 atomically in Phase A′ per user choice ("update everything to latest, no back-compat"). |
| F-NEW-2 (`generatedAt` timestamp churn) | **accepted** | Dropped entirely; git commit time is the timestamp. |
| F-NEW-3 (vendor mechanism brittleness) | **accepted** | Committed copy + SHA pin file (`pwr-ops/procmd-core.sha`); CI verifies. No network at validate time. |
| F-NEW-4 (no reference plant) | **accepted** | Vogtle UFSAR pinned as reference plant. README + scope.md gain a declaring paragraph. |
| F-NEW-5 (step ID atomicity) | **accepted** | A′.7 rule added: step IDs are contracts, locked at stub time, preserved on re-authoring. |
| F-NEW-6 (invariant is aspirational) | **accepted, strengthened** | Phase G recast as a *gate* per phase, not a parallel polish step. §19 renamed "renderer-parity rule." |
| F-NEW-7 (procmd-core is rejected-refactor shape) | **accepted, mitigated** | Scope narrowed: parser + types only. Validator stays in wiki repo, renderers stay per-consumer. Honest disclosure in §11. |
| F-NEW-8 (Phase E scope drift) | **mitigated** | Flagged as deferred decision at Phase D exit. Three options documented in §21. |
| F-NEW-9 (manifest v2 `pageTypes` speculative) | **accepted** | Dropped. Only per-entry `type` field. |
| F-NEW-10 (6 HF page types over-factored) | **accepted** | Collapsed to 4; PSFs absorbed into action-class, CRM into operations-doc. |
| F-NEW-11 (4 lookup tools in Phase F redundant) | **accepted** | Only `procedure_search` and `eal_classify` retained. Everything else routes through `wiki_lookup`. |
| F-NEW-12 (`extractProcedureIds` fallback path) | **mitigated** | Flagged in Phase H §18.4; deprecation target end of Phase D. |
| F-NEW-13 (wiki render-procmd.ts has own parser) | **accepted** | Phase A′ exit criteria now require render-procmd.ts to consume procmd-core. |
| F-NEW-14 (validate.ts edge-label fossil) | **deferred** | Out-of-scope; Phase H continuous-cleanup queue. |
| F-NEW-15 (telemetry stderr permanent) | **accepted** | `ToolContext.logEvent` integration pinned: end of Phase B (§18.2). |
| F-NEW-16 (35 commits in Phase C) | **accepted** | Per-family batching, ~11 commits total per §13.1 table. |
| F-NEW-17 (frontmatter migration scattered) | **accepted** | Atomic v0.6 bump in Phase A′ (A′.3): one commit per repo. |

No findings rejected; no findings silently dropped.

---

## 23. Changelog vs prior plan draft (§§10–21 prior version)

| What | Why | How |
|------|-----|-----|
| Phase A′ scope narrowed to parser+types only | F-NEW-7: procmd-core was edging into rejected-refactor territory | Validator stays in wiki repo; renderers stay per-consumer; core exports only parser + types |
| Atomic v0.6 frontmatter bump added as Phase A′ step | F-NEW-1, F-NEW-17: parser/validator/content version mismatch was a bug; the bump is the cleanup | One-commit-per-repo bump; no back-compat code in parser; validator rejects 0.5 |
| Vendor mechanism specified | F-NEW-3: original "fetch from pinned commit" was undefined for local dev | Committed copy + SHA pin file + CI verification |
| `generatedAt` dropped from manifest | F-NEW-2: ISO timestamp churned the repo on every CI | Removed from schema + build script; git commit is the timestamp |
| Vogtle UFSAR pinned as reference plant | F-NEW-4: no reference plant meant setpoints became guesswork | Cited in scope.md + README; every numeric value in Phase B+ cites Vogtle UFSAR section |
| Step ID atomicity rule (A′.7) | F-NEW-5: cross-page atomicity wasn't addressed | Stub IDs are contracts; preserved on re-authoring |
| Phase G recast as a gate, not parallel polish | F-NEW-6: "single load-bearing invariant" was aspirational | Renderer-parity rule per-phase; Phase G drives the gate checks |
| Phase C commit batching | F-NEW-16: 35 commits = 35 CI cycles | ~11 family-level commits per §13.1 |
| HF page types collapsed 6 → 4 | F-NEW-10: PSFs and CRM were over-factored | Action-class absorbs PSFs; operations-doc absorbs CRM |
| Phase F tools cut 4 → 2 | F-NEW-11: lookup-flavored tools duplicate `wiki_lookup` | Only `procedure_search` and `eal_classify` retained |
| Manifest v2 `pageTypes` dropped | F-NEW-9: speculative; no consumer | Per-entry `type` field only |
| Wiki render-procmd.ts must consume procmd-core | F-NEW-13: it has its own parser, would drift | Added to Phase A′ exit criteria |
| `ToolContext.logEvent` pinned by Phase B exit | F-NEW-15: "continuous" had no deadline | §18.2 hard date |
| Phase E scope flagged for Phase-D-exit decision | F-NEW-8: ConOps content stretches "procmd demo" framing | §21 residual question |
| `extractProcedureIds` deprecation timeline | F-NEW-12: single-caller fallback once manifest universal | §18.4 deprecation target end of Phase D |
| Phase F scenarios embed initial state | "do what's needed to work reliably" + scenario layer cusp question | §16.4 confirmed embed |

---



Goal: one normative procmd implementation consumed by both the talkingAgents
parser/tool surface and the wiki repo's `validate.ts`. Eliminates F5 drift
*before* Phase B authoring stresses the spec.

### 11.1 Workstreams

**A′.1 — Package layout.** Create `talkingAgents/src/procmd-core/` containing:
- `parser.ts` — the v0.6 parser, moved from `src/packs/pwr-ops/procmd/parser.ts`
- `validator.ts` — port from `pwr-ops/validate.ts` (corpus checks: tag-id charset, sim-path consistency, cross-page links, orphan steps, profile vocab)
- `types.ts` — `ParsedProcedure`, `TagDefinition`, `Branch`, etc.
- `fixtures/` — shared test corpus (E-0.md, FR-S.1.md, plus synthetic edge cases)
- `index.ts` — public API barrel
- `README.md` — spec pointer, version compat matrix
- `package.json` — declares the module so the wiki repo can vendor or import

**A′.2 — talkingAgents consumer migration.** Rewrite
`src/packs/pwr-ops/procmd/parser.ts` and `renderer.ts` as thin shims that
re-export from `src/procmd-core/`. Pack-level tests stay in place; they
import from the shim, behaviour unchanged. Renderer stays in the pack
(renderer is samsinn-output-specific; only parser/types/validator are shared).

**A′.3 — Wiki-repo migration.** Replace `pwr-ops/validate.ts` body with a
thin script that imports `procmd-core` and runs the same checks. Two
options:
- **Option A (vendor):** `cp -r talkingAgents/src/procmd-core/* pwr-ops/procmd-core/` at workflow time. Pin to a git SHA. Simplest. Recommended.
- **Option B (npm-link):** Publish `@samsinn/procmd-core` to GitHub Packages. More ceremony, no immediate benefit.

Recommend **Option A**: a make-target or workflow step that fetches the
file set from a pinned talkingAgents commit. The pin lives in
`pwr-ops/procmd-core.sha`.

**A′.4 — Shared fixture corpus.** One `procmd-core/fixtures/` set covering:
- A full developed procedure (E-0 clone, frozen)
- A v0.5-frontmatter procedure (back-compat smoke test)
- Edge cases: missing Tags appendix; unknown frontmatter keys; branch with both Because and Against; multi-line Within; `## Tags` followed by `## Step` (atypical); intra-id with hyphens.

Both consumers run their respective test against this corpus in CI.

**A′.5 — Spec doc.** Update `talkingAgents/docs/procedure-md.md` to v0.6
normatively: document every keyword, every frontmatter field, the `extra`
passthrough rule, the version-handshake behaviour, the `## Tags` appendix
shape, the `Because:` / `Against:` rationale rules.

### 11.2 Exit criteria

- One implementation of procmd; both consumers import from `procmd-core`.
- Wiki repo's `bun validate.ts` produces identical findings to pre-extraction.
- Shared fixture corpus runs in both repos' CI.
- `docs/procedure-md.md` describes v0.6 normatively.
- No regressions in the 1397-test samsinn suite.

### 11.3 Risk register

| Risk | Mitigation |
|---|---|
| Vendored copy in wiki repo drifts from source | `procmd-core.sha` in wiki repo pins the source commit; workflow fetches that sha; CI fails if sha doesn't match. Drift becomes a CI red. |
| Renderer-specific quirks (mermaid escaping) leak into core | Keep renderer in the pack. Core exposes parser + validator + types only. |
| Wiki author wants a procmd change but doesn't want to round-trip through talkingAgents | Document the policy: spec changes land in talkingAgents first, get a commit, wiki bumps `procmd-core.sha`. Two-PR pattern, ~30 min round-trip. |

---

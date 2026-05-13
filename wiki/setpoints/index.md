---
type: setpoint-catalogue
title: Setpoint Catalogue (canonical)
applies-to: Westinghouse-style 4-loop PWR
reference-plant: vogtle
---

# Setpoint Catalogue

Generated from the `## Setpoints` tables in every system-description page. 66 entries.
All values are reference-plant (Vogtle) numbers cited per UFSAR / Tech Spec. See the linked system page for context.

| System | Parameter | Value | Source |
|---|---|---|---|
| [afw](../systems/afw.md) | AFW auto-start (Low SG level on 2/4 SGs) | Low-low SG level «SG-A-LVL-NR» < ~17% NR | Vogtle Tech Spec 3.3.2 |
| [afw](../systems/afw.md) | AFW auto-start (other actuations) | SI signal, AMSAC ATWS mitigation, blackout | Vogtle UFSAR §10.4.9 |
| [afw](../systems/afw.md) | CST minimum (Tech Spec LCO) | ~70% indicated (~200,000 gal usable) | Vogtle Tech Spec 3.7.6 |
| [afw](../systems/afw.md) | SG no-load level setpoint | ~50% NR | Vogtle UFSAR §10.3 |
| [afw](../systems/afw.md) | TDAFW minimum SG steam supply | ~150 psig (turbine min driving pressure) | Vogtle UFSAR §10.4.9 |
| [bop](../systems/bop.md) | Condenser design vacuum | ~3 in Hg abs (100 °F) | Vogtle UFSAR §10.4.1 |
| [bop](../systems/bop.md) | Condenser steam dump capacity | ~40% MS flow | Vogtle UFSAR §10.4.4 |
| [bop](../systems/bop.md) | Gross electrical output | ~1180 MWe | Vogtle UFSAR §1.3 |
| [bop](../systems/bop.md) | Loss-of-condenser-vacuum trip | «COND-VAC» < 22 in Hg | Vogtle Tech Spec 3.3.1 |
| [bop](../systems/bop.md) | MFW final feed temperature | ~440 °F | Vogtle UFSAR §10.4.7 |
| [bop](../systems/bop.md) | MFW isolation on SI | automatic | Vogtle UFSAR §10.4.7 |
| [bop](../systems/bop.md) | Rated thermal power | 3625 MWt | Vogtle UFSAR §1.3 |
| [containment](../systems/containment.md) | Containment design pressure | ~52 psig | Vogtle UFSAR §3.8.1 |
| [containment](../systems/containment.md) | Containment leak-rate LCO (La) | 0.20 % / day | Vogtle Tech Spec 3.6.1 |
| [containment](../systems/containment.md) | EAL Site Area Emergency thresholds | per NEI 99-01 (containment / radiation) | regulatory |
| [containment](../systems/containment.md) | Phase B / spray actuation | «CTMT-PR» > 17 psig | Vogtle Tech Spec 3.3.2 |
| [containment](../systems/containment.md) | Spray pump capacity (each) | ~3000 gpm | Vogtle UFSAR §6.2.2 |
| [cvcs](../systems/cvcs.md) | BAT minimum (cold shutdown reserve) | ~70% indicated | Vogtle Tech Spec 3.1.2 |
| [cvcs](../systems/cvcs.md) | BAT temperature minimum | 145 °F (4 wt% solubility) | Vogtle Tech Spec 3.1.2 |
| [cvcs](../systems/cvcs.md) | Charging pump capacity (each) | ~150 gpm at SI head | Vogtle UFSAR §9.3.4 |
| [cvcs](../systems/cvcs.md) | Normal charging flow | ~75 gpm (matched to letdown) | Vogtle UFSAR §9.3.4 |
| [cvcs](../systems/cvcs.md) | RCP seal injection flow (per pump) | ~8 gpm | Vogtle UFSAR §5.4.1 |
| [cvcs](../systems/cvcs.md) | Tech Spec boron for cold shutdown | 1800-2200 ppm cycle-dependent | Vogtle Tech Spec 3.1.1 |
| [eccs](../systems/eccs.md) | 10 CFR 50.46 peak clad temperature limit | 2200 °F | regulatory |
| [eccs](../systems/eccs.md) | Accumulator nitrogen overpressure | 600 psig | Vogtle UFSAR §6.3.2 |
| [eccs](../systems/eccs.md) | HHSI shutoff head (approximate) | 1500 psig | Vogtle UFSAR §6.3 |
| [eccs](../systems/eccs.md) | LHSI shutoff head (approximate) | 200 psig | Vogtle UFSAR §6.3 |
| [eccs](../systems/eccs.md) | RWST low-low (recirc transfer initiate) | 38% indicated | Vogtle Tech Spec 3.5.4 |
| [eccs](../systems/eccs.md) | RWST normal volume | ~600,000 gal | Vogtle Tech Spec 3.5.4 |
| [electrical](../systems/electrical.md) | Battery LCO minimum | 70% capacity per 6-hour discharge | Vogtle Tech Spec 3.8.4 |
| [electrical](../systems/electrical.md) | DG load-sequence stagger | ~5-15 s per safety load | Vogtle UFSAR §8.3.1.1 |
| [electrical](../systems/electrical.md) | DG start (SI signal) | automatic with SI | Vogtle UFSAR §8.3.1.1 |
| [electrical](../systems/electrical.md) | DG start (undervoltage) | bus voltage < 75% nominal | Vogtle Tech Spec 3.3.5 |
| [electrical](../systems/electrical.md) | FLEX extension target | 72 hours | NEI 12-06 / Order EA-12-049 |
| [electrical](../systems/electrical.md) | SBO coping duration (Tech Spec) | 4 hours | 10 CFR 50.63 |
| [mss](../systems/mss.md) | ARV control band (no-load) | ~1010 psig | Vogtle UFSAR §10.3.2 |
| [mss](../systems/mss.md) | MSL break flow trip | High steam flow + low Tavg | Vogtle Tech Spec 3.3.2 |
| [mss](../systems/mss.md) | MSLI trip | Low steam-line pressure 600 psig | Vogtle Tech Spec 3.3.2 |
| [mss](../systems/mss.md) | Safety valve lift (lowest setpoint) | 1085 psig | Vogtle Tech Spec 3.7.1 |
| [mss](../systems/mss.md) | Tech Spec cooldown rate | ≤100 °F/hr below 350 °F | Vogtle Tech Spec 3.4.3 |
| [nis](../systems/nis.md) | AFD operating band | ±5% from target | Vogtle Tech Spec 3.2.3 |
| [nis](../systems/nis.md) | Boron-dilution alarm | source-range count rate ×2 over baseline | Vogtle UFSAR §15.4.6 |
| [nis](../systems/nis.md) | Intermediate-range high flux trip (block above P-10) | 25% RTP equivalent | Vogtle Tech Spec 3.3.1 |
| [nis](../systems/nis.md) | Overpower-ΔT trip | per Tech Spec equation | Vogtle Tech Spec 3.3.1 |
| [nis](../systems/nis.md) | Power-range neutron flux — high rate trip | 5% RTP per second | Vogtle Tech Spec 3.3.1 |
| [nis](../systems/nis.md) | Power-range neutron flux — high trip | 109% RTP | Vogtle Tech Spec 3.3.1 |
| [nis](../systems/nis.md) | Source-range high flux trip (block above P-6) | configurable; nominal 10⁵ cps | Vogtle Tech Spec 3.3.1 |
| [rcs](../systems/rcs.md) | Cold shutdown Mode 5 | T_cold ≤ 200 °F, P_RCS < 50 psig | Vogtle Tech Spec 1.0 |
| [rcs](../systems/rcs.md) | Cooldown rate limit (≤350 °F) | 100 °F/hr | Vogtle Tech Spec 3.4.3 |
| [rcs](../systems/rcs.md) | Heatup rate limit | 100 °F/hr | Vogtle Tech Spec 3.4.3 |
| [rcs](../systems/rcs.md) | Normal operating pressure | 2235 psig | Vogtle UFSAR §5.1.1 |
| [rcs](../systems/rcs.md) | Subcooling margin threshold for RCP trip | 30 °F | Vogtle UFSAR §15.6 |
| [rcs](../systems/rcs.md) | Tavg no-load (Mode 3) | 547 °F | Vogtle Tech Spec 1.0 |
| [rhr](../systems/rhr.md) | Hot-leg suction valve interlock | Closes if RCS pressure > 400 psig | Vogtle UFSAR §5.4.7 |
| [rhr](../systems/rhr.md) | LHSI shutoff head (approximate) | 200 psig | Vogtle UFSAR §6.3 |
| [rhr](../systems/rhr.md) | RHR cut-in pressure | ≤ 390 psig | Vogtle Tech Spec 3.4.6 |
| [rhr](../systems/rhr.md) | RHR cut-in temperature (Mode 4) | ≤ 350 °F | Vogtle Tech Spec 1.0 |
| [rhr](../systems/rhr.md) | RHR pump NPSH (sump suction) | per pump curve + sump strainer DP | Vogtle UFSAR §6.3.2 |
| [rps](../systems/rps.md) | High power (Power range) | 109% rated | Vogtle Tech Spec 3.3.1 |
| [rps](../systems/rps.md) | Low pressurizer pressure | 1865 psig | Vogtle Tech Spec 3.3.1 |
| [rps](../systems/rps.md) | Low RCS flow | 90% nominal in 2/4 loops | Vogtle Tech Spec 3.3.1 |
| [rps](../systems/rps.md) | Low-low SG level | ~17% NR on 2/4 SGs | Vogtle Tech Spec 3.3.1 |
| [rps](../systems/rps.md) | Manual trip | depress both «RT-PB» | always available |
| [rps](../systems/rps.md) | Overpower ΔT (OPΔT) | f(T_avg) | Vogtle Tech Spec 3.3.1 |
| [rps](../systems/rps.md) | Overtemperature ΔT (OTΔT) | f(T_avg, P_RCS) | Vogtle Tech Spec 3.3.1 |
| [rps](../systems/rps.md) | Rod drop response | ≤ 2.2 s to full insertion | Vogtle UFSAR §15.4 |

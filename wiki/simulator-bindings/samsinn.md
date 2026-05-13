---
type: simulator-binding
simulator-id: samsinn
title: samsinn PWR simulator — tag binding
applies-to: Westinghouse-style 4-loop PWR
reference-plant: vogtle
---

# samsinn PWR simulator — tag binding

Maps each canonical procedure tag to a samsinn-internal simulator variable path.
Built from the canonical tag catalogue. 113 of 113 tags bound.

## Bindings

| Tag | sim-path | Units | Equipment | Description |
|---|---|---|---|---|
| «ACCUM-1» | `ess.accumulator.1.discharge_valve` | enum[OPEN,CLOSED] | si-system | accumulator tank 1 (cold-leg loop 1) discharge isolation |
| «ACCUM-2» | `ess.accumulator.2.discharge_valve` | enum[OPEN,CLOSED] | si-system | accumulator tank 2 (cold-leg loop 2) discharge isolation |
| «ACCUM-3» | `ess.accumulator.3.discharge_valve` | enum[OPEN,CLOSED] | si-system | accumulator tank 3 (cold-leg loop 3) discharge isolation |
| «ACCUM-4» | `ess.accumulator.4.discharge_valve` | enum[OPEN,CLOSED] | si-system | accumulator tank 4 (cold-leg loop 4) discharge isolation |
| «AEJ-RAD» | `rad.condenser.air_ejector` | cps | condenser | condenser air-ejector radiation monitor |
| «AFW-A-CV» | `afw.a.cv_position` | percent | afw-system | SG-A AFW control valve position |
| «AFW-B-CV» | `afw.b.cv_position` | percent | afw-system | SG-B AFW control valve position |
| «AFW-C-CV» | `afw.c.cv_position` | percent | afw-system | SG-C AFW control valve position |
| «AFW-D-CV» | `afw.d.cv_position` | percent | afw-system | SG-D AFW control valve position |
| «AFW-FLOW» | `afw.header.flow` | gpm | afw-system | aggregate AFW flow (header total) |
| «AFW-PUMP-A» | `afw.pump.a.status` | enum[STOPPED,RUNNING,FAULT] | afw-system | motor-driven AFW pump A status |
| «AFW-PUMP-B» | `afw.pump.b.status` | enum[STOPPED,RUNNING,FAULT] | afw-system | motor-driven AFW pump B status |
| «AFW-PUMP-T» | `afw.pump.tdafw.status` | enum[STOPPED,RUNNING,FAULT] | afw-system | turbine-driven AFW pump status |
| «ARV-A» | `secondary.arv.a.position` | enum[OPEN,CLOSED,INTERMEDIATE] | sg-a-msl | SG-A atmospheric relief valve position |
| «ARV-B» | `secondary.arv.b.position` | enum[OPEN,CLOSED,INTERMEDIATE] | sg-b-msl | SG-B atmospheric relief valve position |
| «ARV-C» | `secondary.arv.c.position` | enum[OPEN,CLOSED,INTERMEDIATE] | sg-c-msl | SG-C atmospheric relief valve position |
| «ARV-D» | `secondary.arv.d.position` | enum[OPEN,CLOSED,INTERMEDIATE] | sg-d-msl | SG-D atmospheric relief valve position |
| «BACKFILL-VALVE» | `secondary.backfill.valve` | enum[ISOLATED,AFW,CONDENSATE,FAULT] | afw-system | ruptured-SG backfill alignment valve (condensate or AFW source selector) |
| «BAT-LVL» | `cvcs.bat.level` | percent | charging-system | boric acid tank level |
| «BLOCK-456A» | `rcs.pressurizer.block.456a.position` | enum[OPEN,CLOSED] | pressurizer | pressurizer PORV 456A block valve position |
| «BLOCK-456B» | `rcs.pressurizer.block.456b.position` | enum[OPEN,CLOSED] | pressurizer | pressurizer PORV 456B block valve position |
| «BLOWDOWN-A» | `secondary.blowdown.a.position` | enum[OPEN,CLOSED] | sg-a | SG-A blowdown isolation valve position |
| «BORATE-FLOW» | `cvcs.borate.flow` | gpm | charging-system | emergency boration flow rate |
| «BUS-A-EMERG» | `electrical.bus.emerg_a.energized` | bool | bus-a-emerg | emergency 4kV bus A energization status |
| «BUS-B-EMERG» | `electrical.bus.emerg_b.energized` | bool | bus-b-emerg | emergency 4kV bus B energization status |
| «CCW-RAD» | `rad.ccw.let_hx_outlet` | rem_per_hr | rad-monitoring | component cooling water outlet radiation monitor (letdown HX outlet) |
| «CET-AVG» | `rcs.core_exit.thermocouple.avg` | degF | rcs | core-exit thermocouple average (5+ representative locations across the core) |
| «CHG-FLOW» | `cvcs.charging.flow` | gpm | charging-system | charging flow rate |
| «CHG-PUMP-A» | `cvcs.charging_pump.a.status` | enum[STOPPED,RUNNING,FAULT] | charging-system | charging pump A status |
| «CHG-PUMP-B» | `cvcs.charging_pump.b.status` | enum[STOPPED,RUNNING,FAULT] | charging-system | charging pump B status |
| «CONDENSER-VAC» | `secondary.condenser.vacuum` | inhga | secondary | condenser vacuum (absolute pressure) |
| «CSPRAY-A» | `ess.cspray_pump.a.status` | enum[STOPPED,RUNNING,FAULT] | containment-spray | containment spray pump A status |
| «CSPRAY-B» | `ess.cspray_pump.b.status` | enum[STOPPED,RUNNING,FAULT] | containment-spray | containment spray pump B status |
| «CST-LVL» | `secondary.cst.level` | percent | afw-system | condensate storage tank level |
| «CTMT-NG» | `rad.containment.noble_gas` | uCi_per_cc | containment | containment noble-gas activity monitor |
| «CTMT-PR» | `containment.pressure` | psig | containment | containment building pressure |
| «CTMT-RAD» | `rad.containment.high_range` | rem_per_hr | containment | containment area radiation monitor |
| «CTMT-SUMP-LVL» | `containment.sump.level` | percent | containment | containment recirculation sump level |
| «CTMT-TEMP» | `containment.temperature.avg` | degF | containment | containment average temperature |
| «DC-BUS-LVL» | `electrical.dc_bus.voltage` | volts_dc | dc-bus | vital DC bus voltage (representative) |
| «DG-A» | `electrical.dg.a.status` | enum[STOPPED,STARTING,RUNNING,LOADED,FAULT] | emergency-dg-a | emergency diesel generator A status |
| «DG-B» | `electrical.dg.b.status` | enum[STOPPED,STARTING,RUNNING,LOADED,FAULT] | emergency-dg-b | emergency diesel generator B status |
| «HL-FLOW» | `ess.hl_inject.header_flow` | gpm | si-system | hot-leg injection header flow |
| «HL-INJECT-A» | `ess.hl_inject.a.alignment` | enum[ISOLATED,ALIGNED,FAULT] | si-system | hot-leg injection train A alignment |
| «HL-INJECT-B» | `ess.hl_inject.b.alignment` | enum[ISOLATED,ALIGNED,FAULT] | si-system | hot-leg injection train B alignment |
| «HV-LINE» | `rcs.head_vent.line` | enum[ISOLATED,VENTING,FAULT] | rcs | reactor vessel head vent line position / activity |
| «LET-FLOW» | `cvcs.letdown.flow` | gpm | charging-system | letdown flow rate |
| «LET-ISOL» | `cvcs.letdown.isolation` | enum[OPEN,CLOSED] | charging-system | CVCS letdown isolation valve |
| «LO-HEAD-FLOW» | `ess.lo_head.header_flow` | gpm | si-system | low-head SI / RHR header flow |
| «MAB-RAD» | `rad.mab.area` | rem_per_hr | rad-monitoring | main auxiliary building area radiation monitor |
| «MFW-A-CV» | `secondary.mfw.a.cv_position` | percent | mfw-system | SG-A main feedwater control valve position |
| «MS-HEADER-PR» | `secondary.ms_header.pressure` | psig | secondary | main steam header pressure |
| «MSIV-A» | `secondary.msiv.a.position` | enum[OPEN,CLOSED,INTERMEDIATE] | sg-a-msl | SG-A main steam isolation valve position |
| «MSIV-B» | `secondary.msiv.b.position` | enum[OPEN,CLOSED,INTERMEDIATE] | sg-b-msl | SG-B main steam isolation valve position |
| «MSIV-C» | `secondary.msiv.c.position` | enum[OPEN,CLOSED,INTERMEDIATE] | sg-c-msl | SG-C main steam isolation valve position |
| «MSIV-D» | `secondary.msiv.d.position` | enum[OPEN,CLOSED,INTERMEDIATE] | sg-d-msl | SG-D main steam isolation valve position |
| «N2-SUPPLY» | `secondary.arv.n2_supply.pressure` | psig | arv-system | ARV nitrogen-supply pressure |
| «NAOH-LVL» | `ess.cspray.additive_tank.level` | percent | containment-spray | containment-spray sodium hydroxide additive tank level |
| «NIS-IR» | `nis.intermediate_range.avg` | amps | nuclear-instrumentation | nuclear instrumentation intermediate range |
| «NIS-PR-AVG» | `nis.power_range.avg` | percent | nuclear-instrumentation | nuclear instrumentation power-range average (4-channel) |
| «NIS-SR» | `nis.source_range.count_rate` | cps | nuclear-instrumentation | nuclear instrumentation source range count rate |
| «PHASE-B-SIG» | `ess.phase_b.actuation_signal` | bool | containment | containment Phase B isolation signal (latched) |
| «PORV-456A» | `rcs.pressurizer.porv.456a.position` | enum[OPEN,CLOSED,INTERMEDIATE] | pressurizer | pressurizer PORV 456A position |
| «PORV-456B» | `rcs.pressurizer.porv.456b.position` | enum[OPEN,CLOSED,INTERMEDIATE] | pressurizer | pressurizer PORV 456B position |
| «PRIMARY-WATER-VALVE» | `cvcs.primary_water.makeup_valve` | enum[OPEN,CLOSED] | charging-system | primary water makeup isolation valve |
| «PT-455» | `rcs.pressurizer.pressure_wr` | psig | pressurizer | pressurizer pressure (wide range) |
| «PZR-HTR» | `rcs.pressurizer.heaters.status` | enum[OFF,ON,FAULT] | pressurizer | pressurizer heater bank energization status |
| «PZR-LVL» | `rcs.pressurizer.level` | percent | pressurizer | pressurizer level |
| «RCP-1» | `rcs.rcp.1.status` | enum[STOPPED,RUNNING,FAULT] | rcp-1 | reactor coolant pump 1 status |
| «RCP-2» | `rcs.rcp.2.status` | enum[STOPPED,RUNNING,FAULT] | rcp-2 | reactor coolant pump 2 status |
| «RCP-3» | `rcs.rcp.3.status` | enum[STOPPED,RUNNING,FAULT] | rcp-3 | reactor coolant pump 3 status |
| «RCP-4» | `rcs.rcp.4.status` | enum[STOPPED,RUNNING,FAULT] | rcp-4 | reactor coolant pump 4 status |
| «RCS-BORON» | `rcs.boron.concentration` | ppm | rcs | RCS boron concentration (sampled) |
| «RHR-HX» | `ess.rhr.hx_outlet_temp` | degF | rhr-system | RHR heat-exchanger outlet temperature (representative) |
| «RHR-ISOL» | `ess.rhr.isolation_valve` | enum[OPEN,CLOSED] | rhr-system | RHR system isolation valve (representative) |
| «RHR-PUMP-A» | `ess.rhr_pump.a.status` | enum[STOPPED,RUNNING,FAULT] | rhr-system | residual heat removal pump A status |
| «RHR-PUMP-B» | `ess.rhr_pump.b.status` | enum[STOPPED,RUNNING,FAULT] | rhr-system | residual heat removal pump B status |
| «ROD-POS-AVG» | `rcs.rod.position.avg` | steps_withdrawn | rod-control-system | average control rod bottom position |
| «RT-PB» | `rps.manual_trip.pushbutton` | enum[NORMAL,DEPRESSED] | reactor-protection-system | reactor trip pushbutton (front-panel) state |
| «RVLS-DYN» | `rcs.rvls.dynamic.level` | percent_collapsed_liquid | rcs | reactor vessel level indication system, dynamic-pressure-compensated channel |
| «RWST-LVL» | `rwst.level` | percent | rwst | refueling water storage tank level |
| «SG-A-LVL-NR» | `secondary.sg.a.level_nr` | percent | sg-a | SG-A narrow-range level |
| «SG-A-N16» | `rad.msl.a.n16` | cps | sg-a-msl | SG-A main steam line N-16 radiation monitor |
| «SG-A-PR» | `secondary.sg.a.steam_pressure` | psig | sg-a | SG-A steam pressure |
| «SG-B-LVL-NR» | `secondary.sg.b.level_nr` | percent | sg-b | SG-B narrow-range level |
| «SG-B-N16» | `rad.msl.b.n16` | cps | sg-b-msl | SG-B main steam line N-16 radiation monitor |
| «SG-B-PR» | `secondary.sg.b.steam_pressure` | psig | sg-b | SG-B steam pressure |
| «SG-C-LVL-NR» | `secondary.sg.c.level_nr` | percent | sg-c | SG-C narrow-range level |
| «SG-C-N16» | `rad.msl.c.n16` | cps | sg-c-msl | SG-C main steam line N-16 radiation monitor |
| «SG-C-PR» | `secondary.sg.c.steam_pressure` | psig | sg-c | SG-C steam pressure |
| «SG-D-LVL-NR» | `secondary.sg.d.level_nr` | percent | sg-d | SG-D narrow-range level |
| «SG-D-N16» | `rad.msl.d.n16` | cps | sg-d-msl | SG-D main steam line N-16 radiation monitor |
| «SG-D-PR» | `secondary.sg.d.steam_pressure` | psig | sg-d | SG-D steam pressure |
| «SI-FLOW» | `ess.si.header_flow` | gpm | si-system | high-head SI header flow |
| «SI-PUMP-A» | `ess.si_pump.a.status` | enum[STOPPED,RUNNING,FAULT] | si-system | high-head SI pump A status |
| «SI-PUMP-B» | `ess.si_pump.b.status` | enum[STOPPED,RUNNING,FAULT] | si-system | high-head SI pump B status |
| «SI-SIG» | `ess.si.actuation_signal` | bool | si-system | safety injection actuation signal (latched) |
| «SPRAY-FLOW» | `ess.cspray.header_flow` | gpm | containment-spray | containment spray total flow (header) |
| «STEAM-DUMP» | `secondary.steam_dump.available` | bool | secondary | condenser steam dump availability (auto-permissive flag) |
| «SUB-MARGIN» | `rcs.subcooling_margin` | degF | rcs | RCS subcooling margin (T_sat at PT-455 minus hot-leg temperature) |
| «SUMP-SCREEN-DP» | `ess.sump.strainer.dp` | psid | si-system | containment sump strainer differential pressure |
| «TAVG» | `rcs.t_avg` | degF | rcs | RCS average temperature (4-loop average) |
| «TDAFW-SPEED» | `afw.tdafw.turbine_speed` | rpm | afw-system | turbine-driven AFW pump turbine speed |
| «TE-411-COLD» | `rcs.loop1.t_cold` | degF | rcs-loop-1 | RCS loop 1 cold-leg temperature |
| «TE-411-HOT» | `rcs.loop1.t_hot` | degF | rcs-loop-1 | RCS loop 1 hot-leg temperature |
| «TE-421-COLD» | `rcs.loop2.t_cold` | degF | rcs-loop-2 | RCS loop 2 cold-leg temperature |
| «TE-421-HOT» | `rcs.loop2.t_hot` | degF | rcs-loop-2 | RCS loop 2 hot-leg temperature |
| «TE-431-COLD» | `rcs.loop3.t_cold` | degF | rcs-loop-3 | RCS loop 3 cold-leg temperature |
| «TE-431-HOT» | `rcs.loop3.t_hot` | degF | rcs-loop-3 | RCS loop 3 hot-leg temperature |
| «TE-441-COLD» | `rcs.loop4.t_cold` | degF | rcs-loop-4 | RCS loop 4 cold-leg temperature |
| «TE-441-HOT» | `rcs.loop4.t_hot` | degF | rcs-loop-4 | RCS loop 4 hot-leg temperature |
| «TRIP-BKR-A» | `rps.trip_breaker.a.position` | enum[OPEN,CLOSED] | reactor-protection-system | reactor trip breaker A position |
| «TRIP-BKR-B» | `rps.trip_breaker.b.position` | enum[OPEN,CLOSED] | reactor-protection-system | reactor trip breaker B position |

## Notes

- This page is **generated**. Edit by changing the sim-path declaration in the relevant procedure's tag appendix and rebuilding via `bun scripts/build-sim-bindings.ts`.
- Tags appearing in scenarios but not yet in any procedure are out of scope (see OD-18 in PLAN §25).
- Future bindings for other simulators (BNL Generic PWR, IAEA basic PWR) live in sibling pages `bnl.md`, `iaea.md` etc.

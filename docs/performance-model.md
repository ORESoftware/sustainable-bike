# Performance model

## Purpose

The power calculation is a design sanity check for the requested rear-hub assist and 25 mph flat-ground target. It is not a speed guarantee, homologation result, controller calibration, or substitute for coast-down and dynamometer testing.

## Equations

The model uses steady-state flat-road mechanical load:

- aerodynamic power: `0.5 × air density × drag area × speed³`;
- rolling power: `mass × gravity × rolling-resistance coefficient × speed`; and
- total road load: aerodynamic plus rolling power.

Battery draw subtracts the configured rider contribution from road load, then divides the remaining motor mechanical demand by the configured motor-system efficiency. Range uses the configured usable battery fraction and assumes constant speed and conditions.

The model deliberately omits acceleration, grade, headwind, bearing and belt losses beyond the aggregate efficiency, tire-property changes, controller current limits, voltage sag, motor-map efficiency, thermal derating, starts/stops, and auxiliary loads.

## Checked-in assumptions

| Input | Value |
|---|---:|
| Total bicycle + rider + cargo mass | 133 kg |
| Air density | 1.225 kg/m³ |
| Drag area | 0.50 m² |
| Solid/airless tire rolling coefficient | 0.012 |
| Motor-system efficiency | 0.82 |
| Rider continuous contribution | 200 W |
| Motor rated / peak | 500 / 700 W |
| Usable battery energy | 432 Wh from a 480 Wh pack |

## Results

At 19.5 mph, the model estimates approximately 339 W mechanical road load. At 25 mph, it estimates approximately 602 W. Rated motor mechanical output after the aggregate efficiency is modeled as 410 W; with a 200 W rider, the continuous total is 610 W. The resulting ideal-condition margin at 25 mph is only about 8 W.

That narrow margin is intentional and visible: the 25 mph target requires meaningful rider work and favorable flat conditions. It should not be advertised as a motor-only capability. The calculated private-course range of roughly 22 miles is similarly optimistic because it assumes steady conditions and no reserve beyond the configured usable-energy fraction.

## Required calibration

Before a rolling prototype uses the estimates:

1. measure actual mass and tire rolling resistance;
2. perform coast-down testing for effective drag area and rolling loss;
3. map motor/controller efficiency across speed, torque, voltage, and temperature;
4. measure battery usable energy under the intended discharge profile;
5. account for auxiliaries, starts/stops, grades, wind, and thermal limiting; and
6. replace modeled limits with conservative, signed test evidence.

# Safety case and release gates

This repository is a research model. It is **not** a certified rideable bicycle and must not be represented as one.

## Prohibited shortcuts

- Do not print a full-scale steering column, axle, brake mount, hub shell, or load-bearing frame from unqualified hobby filament and ride it.
- Do not encapsulate lithium cells inside a structural print.
- Do not use an improvised aramid rope or fabric loop as the drive belt.
- Do not remove independent mechanical brakes because regenerative braking exists.
- Do not raise motor power or assistance speed without a destination-specific legal and thermal review.
- Do not call the captive wheel theft-proof; destructive tools can defeat physical hardware.

## Gate 1 — coupon and material characterization

For every structural material/process combination, record:

- print orientation, layer height, raster strategy, nozzle, chamber temperature, moisture conditioning, and lot identifiers;
- tensile, compression, flexural, inter-layer, impact, creep, UV, water, salt, and thermal-cycling results;
- mean, variance, lower tolerance bound, failure mode, and retained specimens;
- recycling or reprocessing effect over at least three material loops.

`frame_coupon`, `tire_coupon`, and `captive_hub_coupon` are geometry aids, not substitute standards.

## Gate 2 — component proof and fatigue

Apply proof loads and instrumented cyclic tests to:

- front and rear monoblades;
- axle shoulders and retention covers;
- head tube, steerer, handlebar, and stem;
- bottom-bracket shell and belt reaction path;
- seat structure;
- wheel center, rim, and tire interface;
- brake mounts and torque reaction;
- battery and motor mounts.

Wheel-retention testing must include bearing seizure, curb strike, fastener loosening, cover damage, and incorrectly performed service.

## Gate 3 — drivetrain qualification

The belt supplier and test program must establish:

- exact cord material and construction;
- allowable pretension and alignment;
- tooth-jump and tooth-shear margins;
- wet, dusty, salty, oily, hot, cold, and UV exposure;
- pulley wear and debris behavior;
- automatic-shift behavior under standing starts, hill load, backpedaling, sensor failure, and loss of electrical power;
- safe manual recovery and roadside service.

A guard must prevent clothing or fingers entering either pulley while allowing inspection and drainage.

## Gate 4 — tire and handling validation

Solid and airless tires transmit different shock loads than pneumatic tires. Measure:

- rolling resistance and heat rise;
- dry/wet braking and cornering grip;
- curb and pothole impacts;
- rim retention and delamination;
- vibration exposure to rider, battery, wiring, bearings, and frame;
- behavior after localized damage and wear.

## Gate 5 — electrical and battery safety

Use a qualified pack, BMS, charger, connectors, enclosure, fusing, isolation, ingress protection, and thermal design. Validate cell propagation resistance, overcharge, short circuit, vibration, impact, water exposure, charger fault, connector mismatch, and emergency isolation.

## Gate 6 — system and regulatory review

Before road use, complete an independent review against the applicable bicycle/e-bike rules and standards in the destination. The review must cover at least braking, steering, structural fatigue, electrical system, battery, EMC, lighting/reflectors, speed/power classification, labeling, instructions, and recall traceability.

## Release evidence

A rideable release requires signed test reports, drawings with tolerances, approved material/process specifications, a bill of materials, supplier certificates, hazard analysis, FMEA/FTA evidence, maintenance intervals, inspection limits, and serial-number traceability. Passing repository CI is only a software/CAD routing check.

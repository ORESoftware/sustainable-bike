# Safety case skeleton

## Current claim

The repository is safe to use for **scale-model visualization, packaging studies, controller requirement drafting, engineering calculations, and material/test coupon planning**. It does not establish that a full-scale bicycle is safe to ride.

The machine-readable configuration keeps `riderTestingPermitted` false. Validation fails if this flag changes, if private 25 mph mode becomes default, if public-road-oriented assist reaches 20 mph, if captive-wheel controls are weakened, or if core electrical/brake controls are removed.

## Top hazards and required controls

| Hazard | Primary controls before any ride test | Evidence gate |
|---|---|---|
| Front monoblade fracture or steering separation | Qualified metal/composite steerer and axle interfaces; asymmetric analysis; overload stops; redundant retention | Correlated coupon data, proof load, fork fatigue, impact, NDT |
| Rear monoblade or hub axle bending | Large-diameter stepped axle; separate motor/brake torque paths; bearing-spacing optimization; positive secondary lock | Static side load, drive/brake combined load, fatigue, axle-deflection measurement |
| Wheel cartridge detaches | No quick release; no ordinary external axle hardware; internal primary retention plus independent secondary lock; locked cover that is not structural | Pull-off proof test, vibration, service-cycle test, faulted-lock test, witness-mark inspection |
| Wheel/tire delamination or segment loss | Commercially qualified tire for early prototypes; mechanical retention; thermal and centrifugal margin | High-speed drum, overspeed, curb/impact, hot/cold soak, wear inspection |
| Solid tire raises frame fatigue loads | Compliance characterization; load-spectrum adjustment; controlled tire hardness/geometry | Instrumented road-load data and revised frame/fork fatigue spectrum |
| Belt skip, rupture, or entanglement | Correct pitch/alignment; guarded drive; tension verification; no damaged/back-bent belt | Supplier application approval, tension records, overload and contamination tests |
| Brake loss or fade | Two independent controls; 203 mm reference rotors; validated calipers; supported-side torque path; motor cut on both levers | Dry/wet stopping, fade, hose fault, single-brake degraded-mode tests |
| Motor runaway or overspeed | Torque-sensor plausibility; independent wheel speed; normally-off torque command; dual brake cut; watchdog; default 19.5 mph mode | HIL fault injection, stuck-sensor tests, independent cutoff and restart-inhibit evidence |
| Motor/controller overheating | Motor and controller temperature sensors; current/temperature derating; hard shutdown; conservative wiring/connectors | Thermal mapping, hill/low-speed stall cases, sensor fault injection, hot-soak restart tests |
| Battery fire or electric shock | Qualified LFP pack/charger; BMS; cell fusing; service disconnect; ingress and crash controls | UL 2271-aligned pack evidence and UL 2849-aligned integrated-system evaluation |
| 25 mph performance claim exceeds capability | Checked-in road-load model exposes assumptions and narrow margin; no motor-only claim | Coast-down, dynamometer, motor map, battery sag, thermal and environmental tests |
| User assumes CAD is production-ready | 16% default, research-only status invariant, prohibited rider-testing flag, prominent documentation | CI validates status/config and compiles all selectors |

## Required release gates

The authoritative list is `validation.requiredBeforeRiderTesting` in `config/bike.json`. Every item needs signed, traceable evidence against the exact tested configuration:

1. material coupon characterization;
2. front and rear axle-retention proof tests;
3. frame and monoblade static proof tests;
4. frame and monoblade fatigue tests;
5. brake performance and thermal tests;
6. wheel overspeed, impact, wear, and retention tests;
7. motor torque-reaction, controller fault, and thermal tests;
8. battery abuse, ingress, BMS, charger, and certification evidence; and
9. independent mechanical and electrical design review.

Closing individual gates does not authorize riding unless the complete release decision, limitations, prototype serial, exact commit, parts, firmware/configuration, and test evidence are recorded together.

## Validation sequence

1. **Scale model:** geometry, clearances, belt path, steering envelope, retention-cover service access, assembly sequence.
2. **Material coupons:** frame shell, inserts, bearing-seat creep, tire compound, environmental aging.
3. **Subassemblies:** fork, rear monoblade, hub cartridge, axle retention, belt path, brakes, battery enclosure.
4. **Remote/unloaded rigs:** motor/controller faults, wheel overspeed, thermal tests, brake and retention loads without a rider.
5. **Instrumented rolling mule:** low speed and controlled area only after earlier evidence; progressive loads and abort criteria.
6. **Full bicycle testing:** applicable structural, braking, electrical, durability, misuse, ingress, software, and independent-review requirements.
7. **Controlled pilot:** only after documented release criteria, traceable parts, service instructions, incident response, and destination-specific approval.

## Prohibited shortcuts

- Do not print a polymer axle, brake rotor, steerer, bearing, unqualified battery structure, or motor torque arm and then ride it.
- Do not raise `RENDER_SCALE` to 1.0 and treat the STL as manufacturing approval.
- Do not treat successful OpenSCAD rendering, a static FEA screenshot, or one proof load as fatigue/impact validation.
- Do not bypass overspeed, brake-cut, BMS, current, or thermal protections to reach 25 mph.
- Do not advertise the modeled 25 mph target as motor-only or guaranteed range/speed.
- Do not sell, lend, or place a prototype into public service before compliance, product-liability, service, and incident-response controls are complete.

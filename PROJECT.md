# Sustainable Bike

A parametric, research-stage bicycle/e-bike design focused on low maintenance, theft resistance, puncture resistance, repairability, and material traceability.

## Design contract

- **One front ring:** one 60-tooth synchronous-belt ring at the crank.
- **No derailleur:** all selectable ratios are inside the rear hub.
- **No rider-operated shifter:** the reference hub automatically selects between `1.00` and `1.36` internal ratios using cadence/torque control.
- **No metal chain or chain lubricant:** the model uses a dry polyurethane synchronous belt with supplier-qualified aramid/Kevlar-class tensile cords. A production belt must be sourced and fatigue-qualified; do not substitute an improvised fabric loop.
- **Captive wheels:** the frame uses front and rear single-sided supports, stepped axles, internal fasteners, and tamper covers. A rotating wheel cannot literally be the same rigid printed body as the stationary frame, so the design makes each wheel mechanically captive instead of claiming an impossible one-piece rotating print.
- **Puncture resistance:** `TIRE_MODE` selects a solid tire or an airless-lattice research model. Neither option uses a conventional inflated inner tube.
- **Rear-hub assist:** the reference envelope is 250 W rated, 500 W peak, 48 V, torque-sensor pedal assist, with a configurable 25 mph research target.
- **Design for disassembly:** battery, controller, motor cartridge, bearings, belt, brakes, and tire material remain replaceable rather than permanently encapsulated.

## Repository layout

```text
cad/config.scad             shared dimensions and drivetrain constants
cad/sustainable_bike.scad   assembly, parts, cutaway, and test coupons
scripts/calculations.mjs    gearing and belt-length calculations
scripts/validate-cad.mjs    distinct-target OpenSCAD verification
test/design.test.mjs        deterministic design invariants
docs/                       architecture, safety, materials, fabrication
.github/workflows/ci.yml     exact-revision calculation and CAD checks
```

## Run locally

Requirements: Node.js 22+ and OpenSCAD.

```bash
npm test
npm run calc
npm run validate:cad

openscad -o assembly.csg -D 'TARGET="assembly"' cad/sustainable_bike.scad
openscad -o frame-coupon.stl -D 'TARGET="frame_coupon"' cad/sustainable_bike.scad
```

The default `MODEL_SCALE` is `0.16`. That is appropriate for visualization and fit studies only. Full-scale output is not authorized until the structural, brake, steering, wheel-retention, battery, thermal, fatigue, and regulatory gates in `docs/safety.md` are closed.

## Reference gearing

At an 85 rpm cadence with a 660 mm nominal wheel:

- internal ratio `1.00`: approximately 18 mph;
- internal ratio `1.36`: approximately 24.4 mph.

Motor assistance must obey the law at the destination. The 25 mph value is a research configuration parameter, not a claim that the bicycle falls into any particular legal class.

## License

Hardware/CAD is intended for CERN Open Hardware Licence Version 2 — Strongly Reciprocal. Software utilities may be reused under Apache-2.0 or MIT once the corresponding license texts are added before a formal release.

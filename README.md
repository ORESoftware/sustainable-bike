# Sustainable Bike

Parametric OpenSCAD research model for a low-maintenance, repairable bicycle built around:

- mechanically captive front and rear wheels;
- single-sided front and rear monoblades rather than conventional double forks;
- no ordinary external axle nuts or quick-release levers;
- solid or qualified airless tire geometry;
- a small rear-hub pedal-assist motor;
- one front chainring, a dry synchronous belt, and automatic internal rear ratios; and
- design-for-disassembly, standard bearings, serviceable electronics, and a material passport.

![Parametric sustainable bicycle concept](assets/preview.png)

## Important boundary

**This repository produces a research-scale model and fit-check geometry, not a ride-ready bicycle.** A rotating wheel cannot literally be the same rigid print as the frame. The design therefore makes each wheel *mechanically captive* inside a single-sided hub cartridge while bearings preserve rotation. Ordinary FDM prints, printed axles, unqualified batteries, or untested structural joints must never be used as a human-carrying bicycle.

The default configuration renders at 16% scale. Full-scale work requires qualified metal or continuous-fiber load paths, professional mechanical/electrical review, correlated analysis, fatigue and impact testing, brake validation, wheel/tire testing, battery-system certification, and applicable bicycle/e-bike compliance testing.

## v0.2 design snapshot

| Subsystem | Reference configuration |
|---|---|
| Wheels | 26 × 2.0 in envelope; solid tire default; optional airless-lattice visualization |
| Retention | Single-sided monoblades, stepped metal axle, positive secondary lock, locked service cover; no quick release |
| Human drive | 60T front / 22T rear, 11 mm pitch, 12 mm dry belt, one front ring |
| Gearing | Automatic internal ratios 1.00 and 1.36; no rider-operated shifter |
| Assist | Rear hub, 500 W rated / 700 W peak reference envelope, torque-sensor pedal assist, no throttle |
| Speed modes | 19.5 mph public-road-oriented default; 25 mph private-course engineering mode disabled by default |
| Battery | 48 V, 480 Wh LFP reference cartridge; locked, removable, BMS and cell-level fusing required |
| Brakes | Two independent controls, 203 mm front/rear rotor envelopes, independent motor cutoffs |
| Status | Research scale only; rider testing prohibited until every release gate closes |

At 85 rpm cadence, the 60/22 belt ratio produces about 17.9 mph in the 1.00 internal ratio and 24.4 mph in the 1.36 ratio. Under the checked-in idealized assumptions—133 kg total mass, 0.50 m² drag area, and 0.012 rolling-resistance coefficient—the flat-road model estimates about 602 W mechanical demand at 25 mph. The modeled 500 W motor and 200 W rider contribution leave only a narrow continuous margin after motor-system losses. Wind, grade, tire heating, battery state, or thermal derating will reduce speed.

## Run it

Requirements: Node.js 22+ and OpenSCAD 2021.01 or newer. There are no third-party JavaScript runtime dependencies.

```bash
npm test
npm run validate
npm run render:preview
npm run render:coupons
```

The full scale-model STL set is intentionally resumable and bounded per part:

```bash
PARTS="front_wheel,rear_hub_cutaway" \
PART_TIMEOUT_SECONDS=600 \
FACET_COUNT=36 \
RESUME=1 \
npm run render
```

Outputs are written under `build/`; the checked-in preview is `assets/preview.png`. Existing nonempty STL outputs are skipped when `RESUME=1`, and each part has an independent timeout and log under `build/logs/`.

Select one CAD target directly:

```bash
openscad \
  -o build/front-wheel.stl \
  -D 'PART="front_wheel"' \
  -D 'RENDER_SCALE=0.16' \
  -D 'FACET_COUNT=36' \
  cad/sustainable_bike.scad
```

Available targets: `assembly`, `frame`, `front_fork`, `front_wheel`, `rear_wheel`, `drivetrain`, `rear_hub_cutaway`, `frame_coupon`, and `tire_coupon`.

## Repository map

- `config/bike.json` — authoritative geometry, controls, power model, and validation gates.
- `src/calculations.mjs` — gearing, wheel speed, belt length, flat-road load, assist margin, and range estimates.
- `cad/sustainable_bike.scad` — main part router and assembly.
- `cad/lib/` — frame, wheel, drivetrain, and component modules.
- `scripts/` — deterministic config generation, validation, resumable STL export, and preview rendering.
- `tests/` — calculation and unsafe-configuration mutation tests.
- `docs/` — architecture, performance model, safety case, manufacturing plan, regulatory notes, and material passport.

## Safety controls encoded in the repository

The validator hard-fails if a quick release or ordinary external axle hardware is enabled, if rider testing is permitted, if private 25 mph mode is enabled by default, if the public-road-oriented cutoff reaches 20 mph, if brake/thermal controls are removed, or if the explicit pre-ride validation checklist is shortened below eight gates.

`npm run validate` also compiles every CAD selector at reduced scale and confirms that each target produces distinct geometry.

## Why the wheel is captive rather than literally fused to the frame

A rigid one-piece wheel/frame cannot rotate. The anti-theft requirement is implemented as a frame-integrated stub axle and locked, internally serviced hub cartridge. The wheel remains on bearings and is removable only through a controlled service sequence. This raises theft effort but is not advertised as theft-proof.

## Why a belt, not a Kevlar “chain”

A fiber rope or chain-shaped print cannot reliably preserve pitch or engage bicycle sprockets under torque. This design interprets the maintenance goal as a toothed polyurethane synchronous belt with supplier-qualified aramid tensile cords. The belt is dry-running and does not require chain oil; final components still require supplier application review and fatigue, tooth-shear, alignment, contamination, and tension qualification.

## Safety and certification planning

The design-control plan tracks CPSC bicycle requirements, the U.S. low-speed electric-bicycle definition, ISO 4210 bicycle safety/test references, and UL 2849/UL 2271 electrical-system and battery evaluation targets. Those references do not make this model compliant. See `docs/regulatory.md`, `docs/performance-model.md`, and `docs/safety-case.md`.

## Development policy

Use feature branches and merge commits. Do not rewrite shared history with rebase after a branch is published. Safety-critical claims require exact tested commit evidence and independent review.

## License

MIT. Safety-critical manufacture, testing, certification, sale, and operation remain the responsibility of the implementing organization and qualified reviewers.

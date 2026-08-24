# Sustainable Bike

Parametric OpenSCAD research models for **2026 and 2027** versions of a low-maintenance, repairable bicycle built around:

- mechanically captive front and rear wheels;
- single-sided front and rear monoblades rather than conventional double forks;
- no ordinary external axle nuts or quick-release levers;
- solid or serviceable airless tire geometry;
- a small rear-hub pedal-assist motor;
- exactly one front ring, a dry aramid/Kevlar-class synchronous belt, and automatic internal rear ratios with no rider-operated shifter; and
- design-for-disassembly, standard bearings, serviceable electronics, and a material passport.

CI renders independent 2026 and 2027 preview artifacts from the same shared CAD modules. `assets/preview.png` remains the legacy compatibility image; run `npm run render:preview` to regenerate all current previews locally.

## Important boundary

**This repository produces research-scale models and fit-check geometry, not ride-ready bicycles.** A rotating wheel cannot literally be the same rigid print as the frame. Each wheel is therefore mechanically captive inside a single-sided hub cartridge while bearings preserve rotation. Ordinary FDM prints, printed axles, unqualified batteries, or untested structural joints must never be used as a human-carrying bicycle.

Both configurations render at 16% scale. Full-scale work requires qualified metal or continuous-fiber load paths, professional mechanical/electrical review, correlated analysis, fatigue and impact testing, brake validation, wheel/tire testing, battery-system certification, and applicable bicycle/e-bike compliance testing.

## 2026 versus 2027

| Subsystem | 2026 | 2027 |
|---|---|---|
| Program role | Qualification baseline | Circular-service upgrade |
| Wheels/tires | 26 × 2.0 in envelope; solid microcellular tire | Same service ecosystem; wider airless lattice with replaceable tread ring |
| Human drive | 60T / 22T, 12 mm dry belt | 58T / 24T, 14 mm dry belt |
| Automatic internal ratios | 1.00, 1.36 | 0.80, 1.00, 1.62 |
| Nominal cadence speeds | about 17.9 and 24.4 mph | about 12.4, 15.5, and 25.1 mph |
| Rider-operated shifter | None | None |
| Assist | Rear hub, 500 W rated / 700 W peak, torque sensor, no throttle | Same rated envelope, coordinated three-speed automatic shift control and higher modeled efficiency |
| Battery | One serviceable 480 Wh LFP cartridge | Two independently serviceable 288 Wh LFP modules, 576 Wh total |
| 25 mph idealized margin | Narrow, about 8 W | Improved, about 64 W |
| 25 mph idealized range | About 22 miles | About 30 miles |
| Disassembly target | 60 minutes | 45 minutes |
| Recycled-content target | 30% | 45% |

The 25 mph value is a **private-course engineering target** and is disabled by default. The public-road-oriented reference cutoff remains 19.5 mph; destination-specific law and classification still control actual use.

## Run it

Requirements: Node.js 22+ and OpenSCAD 2021.01 or newer. There are no third-party JavaScript runtime dependencies.

```bash
npm test
npm run generate:check
npm run validate
npm run compare
npm run render:preview
```

Render a year explicitly:

```bash
npm run render:2026
npm run render:2027
```

Or select parts and both years:

```bash
DESIGN_YEAR=all \
PARTS="front_wheel,rear_hub_cutaway" \
PART_TIMEOUT_SECONDS=600 \
FACET_COUNT=36 \
RESUME=1 \
npm run render
```

Outputs are written to `build/stl/2026/` and `build/stl/2027/`, with logs under matching year directories. Preview outputs are `assets/preview-2026.png` and `assets/preview-2027.png`.

Select one CAD target directly:

```bash
openscad \
  -o build/front-wheel-2027.stl \
  -D 'PART="front_wheel"' \
  -D 'RENDER_SCALE=0.16' \
  -D 'FACET_COUNT=36' \
  cad/sustainable_bike_2027.scad
```

Available targets: `assembly`, `frame`, `front_fork`, `front_wheel`, `rear_wheel`, `drivetrain`, `rear_hub_cutaway`, `frame_coupon`, and `tire_coupon`.

## Repository map

- `config/designs/2026.json` and `config/designs/2027.json` — authoritative yearly geometry, controls, power model, sustainability targets, and validation gates.
- `config/bike.json` — exact compatibility copy of the 2026 profile; CI rejects drift.
- `src/calculations.mjs` — gearing, wheel speed, belt length, flat-road load, assist margin, range, yearly comparison, and validation.
- `cad/model.scad` — shared part router and assembly geometry.
- `cad/sustainable_bike_2026.scad` and `cad/sustainable_bike_2027.scad` — yearly CAD entry points.
- `cad/lib/` — frame, wheel, drivetrain, and component modules.
- `scripts/` — deterministic multi-year config generation, validation, comparison, resumable STL export, and preview rendering.
- `tests/` — calculation, yearly progression, and unsafe-configuration mutation tests.
- `docs/designs/` — design intent, differences, and qualification roadmap for each year.

## Encoded safety controls

The validator hard-fails if a quick release or ordinary external axle hardware is enabled, if rider testing is permitted, if private 25 mph mode is enabled by default, if the public-road-oriented cutoff reaches 20 mph, if brake/thermal/speed-sensor controls are removed, or if the explicit pre-ride validation checklist is shortened.

The 2027 profile additionally fails if it loses its third automatic ratio, airless-lattice serviceable tire, dual battery modules, 45-minute disassembly target, or 45% recycled-content target.

## Why the wheel is captive rather than literally fused to the frame

A rigid one-piece wheel/frame cannot rotate. The anti-theft requirement is implemented as a frame-integrated stub axle and locked, internally serviced hub cartridge. The wheel remains on bearings and is removable only through a controlled service sequence. This raises theft effort but is not advertised as theft-proof.

## Why a belt, not a Kevlar “chain”

A fiber rope or chain-shaped print cannot reliably preserve pitch or engage bicycle sprockets under torque. The design uses a toothed polyurethane synchronous belt with supplier-qualified aramid tensile cords. It runs dry and does not require chain oil; final components still require supplier application review and fatigue, tooth-shear, alignment, contamination, and tension qualification.

## Safety and certification planning

The design-control plan tracks 16 CFR part 1512 bicycle requirements, ISO 4210-2:2023, the active ISO 4210-2 Amendment 1 work item, UL 2849 electrical-system evaluation, UL 2271 battery evaluation, and the CPSC's 2026 proposed mandatory micromobility battery rule. Those references do not make either model compliant. See `docs/regulatory.md`, `docs/performance-model.md`, `docs/safety-case.md`, and `docs/designs/comparison.md`.

## Development policy

Use feature branches and merge commits. Do not rewrite shared history with rebase after a branch is published. Safety-critical claims require exact tested commit evidence and independent review.

## License

MIT. Safety-critical manufacture, testing, certification, sale, and operation remain the responsibility of the implementing organization and qualified reviewers.

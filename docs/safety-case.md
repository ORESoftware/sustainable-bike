# Safety case skeleton

## Current claim

The repository is safe to use for **scale-model visualization, packaging studies, controller requirement drafting, and material/test coupon planning**. It does not establish that a full-scale bicycle is safe to ride.

## Top hazards and required controls

| Hazard | Primary controls before any ride test | Evidence gate |
|---|---|---|
| Front monoblade fracture or steering separation | Qualified metal/composite steerer and axle interfaces; asymmetric FEA; overload stops; redundant retention | Correlated coupon data, proof load, fork fatigue, impact, NDT |
| Rear monoblade or hub axle bending | Large-diameter stepped axle; motor/brake torque path; bearing-spacing optimization; retention-cover interlock | Static side load, drive/brake combined load, fatigue, axle-deflection measurement |
| Wheel/tire delamination | Off-the-shelf qualified airless tire for early prototypes; mechanical tire retention; thermal and centrifugal margin | High-speed drum test, curb/impact test, hot/cold soak, wear inspection |
| Belt skip or rupture | Correct pitch/alignment; guarded drive; automatic tension verification; no damaged or back-bent belt | Supplier application approval, tension records, overload and contamination tests |
| Brake loss or fade | Two independent hand controls; validated calipers/rotors; supported-side brake placement; controller motor cut on braking | Dry/wet stopping, fade, cable/hose fault, single-brake degraded-mode tests |
| Motor runaway or overspeed | Torque-sensor plausibility; independent wheel speed; normally-off power stage; dual-channel brake cut; watchdog | HIL fault injection, stuck-sensor tests, overspeed shutdown evidence |
| Battery fire/electric shock | Certified pack/charger; BMS; fusing; cell spacing; water ingress controls; service isolation | UL 2271-aligned pack evidence and UL 2849-aligned system evaluation |
| Hidden retention fastener loosens | Captive fastener, positive secondary lock, witness mark, cover-open sensor or inspection window | Torque audit, vibration test, service-cycle test |
| Solid tire raises frame fatigue loads | Compliance characterization; lower unsprung mass where possible; frame load-spectrum adjustment | Instrumented road-load data and revised fatigue test spectrum |
| User assumes CAD is production-ready | Scale-only default, explicit status invariant, warnings in docs and generated config | CI verifies status field and scale limit |

## Validation sequence

1. **Scale model:** geometry, clearances, belt path, steering envelope, assembly sequence.
2. **Material coupons:** frame shell, bonded/overmolded inserts, tire compound, bearing-seat creep, environmental aging.
3. **Subassemblies:** fork, rear monoblade, hub cartridge, belt path, brakes, battery enclosure.
4. **Instrumented rolling mule:** low speed, remote/unloaded first; progressive loads; no public-road use.
5. **Full bicycle testing:** applicable CPSC/ISO requirements, electrical evaluation, misuse cases, durability, and independent review.
6. **Controlled pilot:** only after documented release criteria, traceable parts, service instructions, and incident response are complete.

## Prohibited shortcuts

- Do not print a polymer axle, brake rotor, steerer, bearing, battery cell holder without a qualified fire/structural design, or motor torque arm and then ride it.
- Do not raise `RENDER_SCALE` to 1.0 and treat the resulting STL as manufacturing approval.
- Do not bypass overspeed, brake-cut, BMS, or thermal protections to reach the target speed.
- Do not sell, lend, or place a prototype into public service before the compliance and product-liability review.

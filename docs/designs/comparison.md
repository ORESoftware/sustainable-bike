# 2026–2027 Design Comparison and Release Gates

## What remains invariant

Both designs retain exactly one front ring, a dry aramid/Kevlar-class synchronous belt, automatic internal rear gears, no rider-operated shifter, a rear-hub pedal-assist motor, no throttle, dual brake cutoffs, redundant wheel-speed sensing, thermal sensing/derating, captive single-sided wheel support, no quick release, and a research-scale-only status.

## Deliberate 2027 deltas

| Measure | 2026 | 2027 | Intent |
|---|---:|---:|---|
| Automatic ratios | 2 | 3 | Add a real hill/start ratio while retaining direct and high ratios |
| Battery capacity | 480 Wh | 576 Wh | Increase range and split service into two modules |
| Tire | Solid | Airless lattice + replaceable tread | Preserve puncture resistance while reducing discard mass |
| Belt width | 12 mm | 14 mm | Add torque/fatigue margin pending supplier qualification |
| Disassembly target | 60 min | 45 min | Improve repair and material separation |
| Recycled-content target | 30% | 45% | Raise circular-material ambition |
| Idealized 25 mph margin | ~8 W | ~64 W | Reduce dependence on perfect conditions |
| Idealized 25 mph range | ~22 mi | ~30 mi | Improve useful test-course endurance |

## Release policy

Neither profile is cleared for a rider. A design year may advance only after its configuration hash, generated OpenSCAD file, CAD target hashes, calculation output, physical material coupons, structural proof/fatigue results, brake results, wheel/tire results, electrical fault tests, ingress tests, and independent design review are linked in one immutable release record.

The 2027 profile must additionally demonstrate that the replaceable tread cannot detach, the lattice cannot trap hazardous debris or overheat, automatic shifts fail safely, and either battery module can be isolated without exposing live conductors or permitting incompatible operation.

## Standards watch

ISO 4210-2:2023 remains the published bicycle safety/performance reference, while an Amendment 1 work item is under development in 2026. UL 2849 and UL 2271 remain explicit electrical-system and light-electric-vehicle battery evaluation targets. The CPSC's 2026 proposed mandatory micromobility lithium-ion battery rule is tracked as a changing requirement and must be rechecked before a 2027 design freeze.

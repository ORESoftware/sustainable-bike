# Architecture decision record: captive monoblades and automatic belt drive

## Status

Accepted for the v0.2 research model. Not approved for a rideable prototype.

## Decision

The bicycle uses conventional separation of rotating and stationary bodies, but hides wheel-retention interfaces inside locked service covers. Both wheels are supported from one side by monoblades. A stepped, non-printed axle is captured by the support, while the wheel rotates on qualified bearings around that axle.

This preserves the anti-theft intent without violating the kinematic requirement that a wheel rotate relative to the frame. Single-sided support is not inherently theft-proof; deterrence comes from an internal fastener, positive secondary lock, tamper cover, serialized cartridge, controlled service tooling, and removal of ordinary external axle hardware.

The drivetrain has exactly one front ring and one external rear sprocket. Ratio changes happen automatically inside the rear hub. The external flexible element is a dry-running toothed polyurethane belt with supplier-qualified aramid tensile cords. There is no derailleur, metal roller chain, lubrication schedule, or rider-operated gear cable.

## Reference powertrain and controls

- 60-tooth front and 22-tooth rear sprockets.
- 11 mm belt pitch and 12 mm belt-width envelope.
- 1.00 and 1.36 automatic internal ratios.
- 26 × 2.0 in wheel envelope.
- 500 W rated / 700 W peak rear-hub reference envelope.
- Torque-sensor pedal assist; no throttle.
- Independent wheel speed, dual brake cutoffs, motor temperature, and controller temperature sensing.
- 19.5 mph public-road-oriented default cutoff.
- 25 mph private-course engineering mode disabled by default.

The selected ratios put the human cadence target near 18 mph in low and 24.4 mph in high at 85 rpm. The power model indicates that 25 mph requires rider contribution and favorable conditions. These are geometry and first-order physics calculations, not performance guarantees.

## Mechanical retention concept

Each wheel cartridge uses:

1. a frame-integrated metal stub axle/load insert;
2. separated, qualified bearings within the hub cartridge;
3. a stepped axial retention feature;
4. a positive secondary lock independent of cover friction;
5. a locked cover that blocks normal tool access; and
6. inspectable witness marks or a cover-open/service record.

The brake torque path, motor torque path, lateral wheel load, bearing preload, and retention load must remain separable and inspectable in the detailed design. A cover lock is not a structural fastener.

## Non-negotiable structural boundaries

- Axles, bearing seats, brake mounts, steering interfaces, and motor torque-reaction features are not basic polymer FDM parts.
- Full-scale printed frame use requires a qualified process such as continuous-fiber thermoplastic composite, metal-reinforced hybrid construction, or printed tooling for a separately qualified laminate.
- The front and rear monoblades require asymmetric load analysis, brake-load analysis, fatigue correlation, and physical destructive tests.
- The battery remains removable for service and recycling, but access is lock-controlled.
- The belt line requires controlled alignment and tension; anti-theft packaging must not make inspection impossible.
- A single retention fault must not immediately release a wheel.

## Alternatives rejected

### Wheel and frame as one rigid body

Rejected because the wheel could not rotate. A mechanically captive bearing cartridge satisfies the anti-theft goal without inventing a continuously rotating flexure.

### Printed polymer axle or bearing race

Rejected for rider testing because creep, fatigue, heat, tolerance, and impact performance are not established by visual print quality.

### Printed aramid rope or chain

Rejected because pitch stability, tooth engagement, abrasion, and failure detection are unsuitable. A supplier-qualified synchronous belt preserves the no-lube goal.

### Derailleur or multiple front rings

Rejected by the maintenance and packaging requirements.

### Permanently potted battery

Rejected because it impairs inspection, repair, cell replacement, incident isolation, and end-of-life recycling.

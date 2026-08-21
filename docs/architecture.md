# Architecture decision record: captive monoblades and automatic belt drive

## Status

Accepted for the v0.1 research model. Not approved for a rideable prototype.

## Decision

The bicycle uses a conventional separation of rotating and stationary bodies, but hides the wheel-retention interface inside a locked cover. Both wheels are supported by a single outboard monoblade. A stepped, non-printed axle is captured by the support, while the wheel rotates on qualified bearings around that axle.

This preserves the anti-theft intent without violating the basic kinematic requirement that the wheel rotate relative to the frame. A single-sided wheel is not inherently theft-proof; the internal fastener, lockable cover, serialized cartridge, and lack of quick-release hardware provide the deterrence.

The drivetrain has exactly one front ring and one external rear sprocket. Ratio changes happen automatically inside the rear hub. The external flexible element is a dry-running toothed polyurethane belt with supplier-qualified aramid tensile cords. There is no derailleur, metal roller chain, lubrication schedule, or rider-operated gear cable.

## Reference powertrain

- 60-tooth front sprocket.
- 22-tooth rear sprocket.
- 11 mm belt pitch and 12 mm belt width envelope.
- 1.00 and 1.36 automatic internal ratios.
- 26 × 2.0 in wheel envelope.
- 250 W rated rear-hub assist, 500 W peak transient envelope.
- Torque-sensor pedal assist; no throttle.
- Independent speed sensing and fail-silent overspeed cutoff.

The selected ratios put the human cadence target near 18 mph in low and 24.4 mph in high at 85 rpm. This is a geometry calculation, not a performance guarantee.

## Non-negotiable structural boundaries

- Axles, bearing seats, brake mounts, steering interfaces, and motor torque reaction features are not basic polymer FDM parts.
- Full-scale printed frame use requires a qualified process such as continuous-fiber thermoplastic composite, metal-reinforced hybrid construction, or a printed mold for a separately qualified laminate.
- The front fork and rear monoblade require asymmetric load analysis, brake-load analysis, fatigue correlation, and physical destructive tests.
- The battery remains removable for service and recycling, but access is lock-controlled.
- The belt line must have controlled alignment and tension; anti-theft packaging must not make inspection impossible.

## Alternatives rejected

### Wheel and frame as one rigid body

Rejected because the wheel could not rotate. Flexure bearings at bicycle scale would have inadequate angular travel and fatigue life for continuous revolutions.

### Printed aramid rope or chain

Rejected because pitch stability, tooth engagement, abrasion, and failure detection are unsuitable. A supplier-qualified synchronous belt preserves the no-lube requirement.

### Derailleur or multiple front rings

Rejected by product requirements and maintenance goals.

### Permanently potted battery

Rejected because it impairs inspection, repair, cell replacement, and end-of-life recycling.

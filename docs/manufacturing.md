# Manufacturing and prototyping plan

## Stage A — printable today

The checked-in default is a 16% scale model. Print the frame, fork, wheels, drivetrain, and hub cutaway separately for fit and design reviews. The `frame_coupon` and `tire_coupon` targets support printer tuning and basic material comparisons.

Suggested non-ride uses:

- PLA/PETG scale geometry and assembly fixtures;
- TPU tire visualizations;
- soluble-support trials for internal channels;
- printed molds, trim fixtures, drill guides, cable-routing mockups, and ergonomic studies.

## Stage B — structural material development

A potential full-scale program should compare at least:

- recyclable continuous-fiber thermoplastic shells;
- aluminum or stainless load-path inserts overmolded by printed thermoplastic;
- printed soluble/sacrificial tooling for a separately qualified composite laminate; and
- replaceable metallic hub, brake, steering, and bearing cartridges.

Each material/process combination needs coupon allowables for tension, compression, shear, interlaminar failure, creep, moisture, temperature, UV exposure, impact, fatigue, and manufacturing defects. Printed appearance is not evidence of structural integrity.

## Stage C — modular large-format tooling

The full reference frame is intentionally one continuous CAD body, but manufacturing may use segmented molds or robotic deposition. Segment boundaries must not be placed at maximum bending or bearing-load regions merely to fit a printer. Any joint needs keyed load transfer, inspectable bonding, process controls, and destructive validation.

## Tires

The model supports `solid` and `airless_lattice` visualization. For the first rolling mule, use a commercially qualified airless tire on a compatible mechanical rim rather than a home-printed full-speed tire. A printed tire program would require compound characterization, bead retention, heat build-up, rolling resistance, wet grip, wear, centrifugal growth, and impact testing.

## Belt and internal hub

The CAD belt is an envelope. Do not print the working belt or sprocket teeth for a rideable prototype. Select a supplier-qualified belt/sprocket pair, confirm the 60/22 ratio and center distance with the supplier's engineering method, and provide controlled adjustment without exposing a quick-release wheel interface.

The rear-hub cutaway is symbolic. A real integrated automatic gear plus motor hub should be purchased as a certified assembly or developed as its own safety-critical product with gear, bearing, thermal, sealing, and control validation.

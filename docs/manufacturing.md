# Manufacturing and prototyping plan

## Stage A — printable now

The checked-in default is a 16% research model. Print the frame, fork, wheels, drivetrain, and hub cutaway separately for fit and design reviews. The `frame_coupon` and `tire_coupon` selectors support printer tuning and visual/material comparisons.

Suggested non-ride uses:

- PLA/PETG scale geometry and assembly fixtures;
- TPU tire/lattice visualizations;
- soluble-support trials for internal channels;
- printed molds, trim fixtures, drill guides, cable-routing mockups, and ergonomic studies; and
- axle-cover, lock-clearance, service-tool, and assembly-sequence studies using nonstructural dummy inserts.

Use the bounded exporter so one complex mesh cannot hide the status of all other parts:

```bash
PARTS="frame_coupon,tire_coupon" \
FACET_COUNT=24 \
PART_TIMEOUT_SECONDS=180 \
RESUME=1 \
npm run render
```

Every safety-critical part remains a scale-model or tooling artifact until its release evidence is complete.

## Stage B — structural material development

A potential full-scale program should compare at least:

- recyclable continuous-fiber thermoplastic shells;
- aluminum or stainless load-path inserts overmolded by printed thermoplastic;
- printed soluble/sacrificial tooling for a separately qualified composite laminate; and
- replaceable metallic hub, brake, steering, and bearing cartridges.

Each material/process combination needs coupon allowables for tension, compression, shear, interlaminar failure, creep, moisture, temperature, UV exposure, impact, fatigue, and manufacturing defects. Printed appearance is not evidence of structural integrity.

Axle, steerer, brake, bearing, and motor torque-reaction interfaces require metal/composite inserts with traceable material, heat treatment, geometry, surface finish, inspection, and proof-test records. Adhesive may stabilize or seal joints but is not the sole invisible primary load path in the reference architecture.

## Stage C — modular large-format tooling

The reference frame is one continuous CAD body for design intent, but manufacturing may use segmented molds or robotic deposition. Segment boundaries must not be placed at peak bending, bearing, or brake-load regions merely to fit a printer. Any joint needs keyed load transfer, inspectable bonding, controlled cure/anneal conditions, dimensional inspection, and destructive validation.

The front and rear monoblades are separate crash/service modules around continuous qualified load inserts. Their hub nodes need replaceable bearing cartridges and independently retained axles. A locked cosmetic cover must never carry wheel-retention load.

## Tires

The model supports `solid` and `airless_lattice` visualization. For the first rolling mule, use a commercially qualified solid/airless tire on a compatible mechanically retained rim rather than a home-printed full-speed tire.

A printed tire program requires:

- compound and print-process characterization;
- bead or segment retention;
- heat buildup and thermal aging;
- rolling resistance and energy use;
- dry/wet grip;
- wear, debris ingestion, and environmental aging;
- centrifugal growth and overspeed;
- curb, pothole, and lateral impact; and
- validation that higher impact loads do not invalidate frame/fork fatigue spectra.

Replaceable tread or tire modules are preferred so wear does not discard the structural wheel or motor cartridge.

## Belt and internal hub

The CAD belt is an envelope. Do not print the working belt or sprocket teeth for a rideable prototype. Select a supplier-qualified belt/sprocket pair, confirm the 60/22 ratio and center distance with the supplier's engineering method, and provide controlled tension adjustment without exposing a quick-release wheel interface.

The rear-hub cutaway is symbolic. A real integrated automatic gear plus motor hub should be purchased as a qualified assembly or developed as its own safety-critical product with gear, bearing, torque reaction, thermal, sealing, control, and overspeed validation.

## Battery and electronics

The 48 V, 480 Wh LFP package is a reference envelope only. Use a supplier-qualified pack and charger with a BMS, cell-level fusing, service isolation, mechanical retention, strain relief, ingress controls, and evidence appropriate to the destination market. Preserve certified component conditions during integration; changing enclosure, charger, wiring, firmware, or thermal environment can invalidate prior evidence.

## Traceability

Record for every prototype:

- source commit and generated-config hash;
- CAD selector, render scale, facet count, and slicer settings;
- material lot, conditioning, printer, nozzle, orientation, and thermal history;
- insert/bearing/fastener lot and assembly torque;
- inspection, proof-test, NDT, and retirement status; and
- controller, BMS, and configuration hashes.

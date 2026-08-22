# Fabrication workflow

## 1. Keep the model small

The committed default is `MODEL_SCALE = 0.16`. Render the assembly and inspect clearances before producing any coupon or component. Full scale is not authorized by changing one number.

## 2. Validate deterministic geometry

```bash
npm test
npm run validate:cad
```

The validator renders every routed target to CSG and rejects empty or duplicate outputs.

## 3. Produce material coupons

```bash
openscad -o frame-coupon.stl \
  -D 'TARGET="frame_coupon"' cad/sustainable_bike.scad

openscad -o tire-coupon.stl \
  -D 'TARGET="tire_coupon"' cad/sustainable_bike.scad

openscad -o captive-hub-coupon.stl \
  -D 'TARGET="captive_hub_coupon"' cad/sustainable_bike.scad
```

Record slicer settings and material lot with every specimen. Coupons must reproduce the production orientation and critical interfaces; generic vendor data is insufficient.

## 4. Print fit-only subscale parts

Use subscale frame/wheel/hub outputs to evaluate envelope, assembly sequence, tool access, wire routing, belt guard space, battery removal, and visual interference. Do not use a scaled model to infer strength, fatigue, braking, thermal behavior, or handling.

## 5. Move structural definitions out of exploratory CAD

Before a rideable prototype, replace visualization approximations with controlled drawings and tolerances for:

- bearing fits and axial preload;
- axle shoulder and retention geometry;
- insert geometry and load transfer;
- brake rotor and caliper mounts;
- steerer, headset, stem, and handlebar retention;
- belt line, pulley runout, pretension, and guard;
- motor torque reaction;
- battery retention and impact isolation;
- cable bend radii, strain relief, ingress seals, and service loops.

## 6. Use qualified processes

A production process needs machine qualification, calibrated inspection, traveler records, nonconformance control, retained samples, and serialized traceability. Large-format additive manufacturing may be useful for shells, tooling, molds, jigs, or validated composite structures, but it is not automatically appropriate for every safety-critical part.

## 7. Assemble with independent inspection

Use documented torque values, locking methods, witness marks, bearing checks, brake checks, steering checks, electrical isolation checks, and a second-person inspection. Record the exact component and software revisions.

## 8. Test progressively

Proceed from fixtures to static proof, fatigue rigs, drum testing, instrumented unmanned rolling tests, low-speed closed-course testing, and only then broader riding. Define stop criteria before every stage and quarantine parts after overload or unexplained noise, heat, looseness, cracking, or geometry change.

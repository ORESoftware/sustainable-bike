# Fabrication workflow

1. Keep `MODEL_SCALE = 0.16` for visualization and fit studies.
2. Run `npm test` and `npm run validate:cad`; duplicate or empty target routing fails closed.
3. Render and test `frame_coupon`, `tire_coupon`, and `captive_hub_coupon`, recording slicer/process settings and material lot.
4. Use subscale parts only for assembly sequence, clearance, tool access, wire routing, belt guard, and battery-removal studies.
5. Before rideable work, publish controlled tolerances for bearing fits, axle retention, inserts, brakes, steering, belt line/pretension, motor torque reaction, battery retention, connectors and seals.
6. Qualify the manufacturing process with calibrated inspection, traveler records, nonconformance control, retained samples and serial traceability.
7. Assemble with documented torque/locking methods, witness marks, bearing/brake/steering checks, electrical isolation checks, and independent second-person inspection.
8. Test progressively: fixtures, static proof, fatigue rigs, drum testing, unmanned rolling, low-speed closed course, then broader riding. Define stop criteria before every stage.

Changing the scale to full size does not authorize human use. Large-format additive manufacturing may be appropriate for shells, molds, tooling, jigs or validated composite structures, but not automatically for every safety-critical part.

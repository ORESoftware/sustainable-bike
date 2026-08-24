# Changelog

## 0.3.0 — 2026-08-23

- Added independently versioned 2026 qualification-baseline and 2027 circular-service design profiles.
- Refactored CAD into shared geometry plus separate 2026/2027 entry points and generated configuration files.
- Added a 2027 three-speed fully automatic internal hub, wider aramid belt, serviceable airless-lattice tread, dual 288 Wh LFP modules, improved modeled efficiency/range, and stronger circularity targets.
- Added deterministic year-over-year comparison checks and safety regressions for rider-operated shifting, two-speed 2027 fallback, thermal/speed-sensor removal, and yearly alias drift.
- Updated render, preview, smoke, and CI paths to validate and publish artifacts for both years.
- Added dedicated 2026, 2027, and comparison design-control documentation.

## 0.2.0 — 2026-08-21

- Split assist control into a 19.5 mph public-road-oriented default and a 25 mph private-course mode disabled by default.
- Increased the reference rear-hub envelope to 500 W rated / 700 W peak and the serviceable LFP battery envelope to 480 Wh.
- Added flat-road aerodynamic/rolling load, motor-plus-rider margin, electrical demand, and range calculations.
- Added mutation tests that reject quick release, external axle hardware, enabled private mode, rider testing, missing brake/thermal controls, and malformed configurations.
- Added explicit rider-test release gates and expanded safety, manufacturing, architecture, regulatory, and performance documentation.
- Made STL export selectable, resumable, per-part logged, and time bounded.
- Added generated-config drift checking and printable coupon rendering to CI.

## 0.1.0 — 2026-08-21

- Initial parametric scale model with captive single-sided wheels, solid/airless tire options, belt drive, automatic internal ratios, rear-hub motor cutaway, configuration validation, CAD smoke tests, preview, and material/safety documentation.

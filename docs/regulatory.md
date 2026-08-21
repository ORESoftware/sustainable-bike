# Regulatory and standards notes

This is an engineering planning note, not legal advice or a declaration of conformity.

## United States baseline

CPSC bicycle requirements are in 16 CFR Part 1512 and include assembly, braking, protrusions, structural integrity, and reflectors. CPSC guidance describes a covered electric bicycle as having fully operable pedals, a motor under 750 W, and a maximum speed under motor power alone of less than 20 mph under the specified test condition.

The repository keeps the user's 25 mph pedal-assist target as a configurable research value, disables the throttle, and requires a jurisdiction-specific classification review. State class definitions, trail access, helmet rules, labeling, and local fire/electrical requirements can differ. The controller and gearing must not be finalized from this repository alone.

## Bicycle structural references

- ISO 4210-2:2023 addresses safety and performance requirements for city/trekking, young-adult, mountain, and racing bicycles.
- ISO/TS 4210-10:2020 addresses electrically power-assisted cycles, including design, marking, assembly, test, power management, electrical circuits, and systems up to the stated SELV limit.

The exact applicable parts and test methods must be purchased/read by the responsible engineering organization. This repository deliberately avoids inventing pass loads or cycles that are contained in controlled standards.

## Electrical system references

- UL 2849 evaluates the electrical system of an e-bike, including the battery system, charger, motor, and associated electrical parts.
- UL 2271 covers batteries for light electric vehicle applications.

Use a certified pack and charger and preserve the certification conditions in the integrated bicycle. A certified component does not automatically certify a modified system.

## Product controls still needed

- permanent labeling and serial traceability;
- operating and service instructions;
- reflector, lighting, brake, and guard requirements;
- battery transport and end-of-life processes;
- software configuration control and tamper evidence;
- recall, incident reporting, and field-update process; and
- destination-specific legal review before sale or public-road use.

# Regulatory and standards notes

This is an engineering planning note, not legal advice or a declaration of conformity. Requirements vary by product configuration, destination, date, and intended use.

## United States baseline

CPSC bicycle requirements are in 16 CFR Part 1512 and include assembly, braking, protrusions, structural integrity, and reflectors. The federal consumer-product definition for a low-speed electric bicycle uses fully operable pedals, an electric motor of less than 750 W, and a maximum speed under motor power alone of less than 20 mph under the specified condition.

The checked-in reference therefore:

- keeps rated and peak motor values below 750 W;
- has no throttle;
- configures a 19.5 mph public-road-oriented default cutoff; and
- keeps the requested 25 mph mode as a private-course engineering target disabled by default.

This does not establish a legal class. State and local class definitions, equipment, trail access, licensing, helmet rules, labeling, and fire/electrical requirements can differ. The controller and gearing must not be finalized from this repository alone.

## Bicycle structural references

The design-control plan tracks:

- ISO 4210-2:2023 for bicycle safety/performance requirements;
- ISO 4210-6:2023 for frame and fork test methods; and
- ISO/TS 4210-10:2020 for electrically power-assisted cycle safety requirements.

The responsible engineering organization must obtain the applicable standards, determine the exact product category and editions, and maintain a requirement-to-evidence matrix. This repository deliberately avoids inventing controlled pass loads, cycles, or procedures.

## Electrical system references

- UL 2849 addresses evaluation of the integrated e-bike electrical system, including battery system, charger, motor, controls, and associated electrical parts.
- UL 2271 addresses batteries for light electric vehicle applications.

Use an appropriately certified pack and charger and preserve their integration conditions. A certified component does not automatically certify a modified bicycle system.

## Other regulatory work still needed

- permanent labeling, serial traceability, and tamper-evident speed/power configuration;
- operating, charging, storage, transport, and service instructions;
- reflector, lighting, brake, guard, and audible-warning requirements as applicable;
- battery transport, damaged-pack isolation, recycling, and incident response;
- software configuration control, update security, fault logging, and rollback;
- destination-specific radio/EMC and environmental requirements;
- recall, field-update, complaint, and reportability processes; and
- legal/product-liability review before sale, lending, public-road operation, or pilot deployment.

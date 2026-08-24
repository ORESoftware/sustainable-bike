# Materials and circularity

## Material passport

Every physical part should carry or reference a durable part ID linked to:

- material family, grade, additives, and reinforcement;
- supplier and lot;
- manufacturing process and parameters;
- mass and recycled-content fraction;
- date, machine, operator, and quality record;
- approved repair methods;
- inspection interval and retirement criteria;
- disassembly route and destination at end of life.

## Preferred architecture

| System | Preferred research direction | Boundary |
|---|---|---|
| Frame shells and low-load covers | Recycled/recyclable thermoplastic with continuous-fiber or metal inserts only where analysis requires them | Do not infer structural capability from polymer name alone |
| Axles, bearing seats, brake interfaces | Replaceable qualified metal or composite inserts | Never hobby-print a rideable axle |
| Tire | Replaceable cast solid elastomer or validated airless thermoplastic structure | Validate grip, heat, fatigue, and shock transmission |
| Belt | Supplier-manufactured polyurethane synchronous belt with traceable aramid/Kevlar-class cords | No improvised rope/fabric belt |
| Internal hub | Serviceable cartridge with replaceable bearings, gears, clutch, sensors, and lubricant contained inside the hub | “No lube” applies to the external belt; internal gears may require sealed lifetime/service lubricant |
| Motor/controller | Replaceable standard modules with documented connectors | Avoid permanent potting unless required for safety and a recovery route exists |
| Battery | Qualified removable pack with serviceable enclosure and recycling channel | Cells never form a structural frame member |

## Important terminology

The external drivetrain is dry and does not require chain oil. That does **not** mean every moving interface is lubricant-free. Bearings and internal gears may use sealed grease or oil specified by their manufacturer. The sustainability objective is to eliminate exposed chain lubrication and contamination, not to deny tribology.

## Design-for-disassembly rules

- Prefer reversible fasteners and captive hardware over adhesives.
- Keep incompatible material families separable.
- Mark inserts and concealed fasteners in service drawings.
- Provide tool access without destroying surrounding structure.
- Avoid permanent battery/controller encapsulation.
- Publish replacement geometry and tolerance data for service parts.
- Retain old revisions so an owner can reproduce the correct part for a serialized bicycle.

## Sustainability metrics

Track mass, embodied carbon estimate, recycled content, expected service life, replaceable-module count, repair time, percentage separable by mass, reclaimed material yield, and measured energy use per kilometre. Do not claim environmental superiority without a declared functional unit and lifecycle boundary.

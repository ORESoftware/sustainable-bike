# Material passport template

Every prototype and production unit should carry a machine-readable identifier that resolves to this record.

| Assembly | Preferred material/process | Permanent marking | Service/end-of-life path |
|---|---|---|---|
| Frame shell | Recyclable thermoplastic composite or printed tooling for qualified laminate | Resin, fiber, batch, print/layup recipe, cure/anneal record | Inspect, repair under approved procedure, separate inserts, reclaim where available |
| Fork/monoblade | Qualified hybrid composite with metal steerer/axle interfaces | Serial, NDT status, proof-load status | Mandatory retirement criteria and destructive sampling plan |
| Hub cartridges | Aluminum/steel/composite supplier assembly | Supplier lot and bearing IDs | Rebuild bearings/seals; recycle metal; controlled motor/electronics recovery |
| Belt | Supplier-qualified polyurethane synchronous belt with aramid tensile cords | Part number, tooth count, batch/date | Inspect/replace; polymer recycling route where available |
| Tire | Qualified airless tire or validated replaceable tread | Compound/batch, wear indicator | Replace tread/tire independently of wheel; supplier recycling route |
| Battery | Certified serviceable pack | Pack serial, cell lot, BMS firmware, service history | Authorized repair, second-life assessment, regulated recycling |
| Controller/sensors | Replaceable sealed module | Hardware revision, firmware hash, calibration record | Reuse/reflash where safe; e-waste recovery |

## Design-for-disassembly rules

- No permanent potting across cells, controller, frame, and wiring as one inseparable mass.
- Use reversible access for bearings, brakes, belt, sensors, and battery while keeping theft-critical covers locked.
- Publish torque values, inspection windows, replacement intervals, and compatible part identifiers.
- Record every safety-critical firmware/configuration change against the unit serial.

## Change

Describe the geometry, calculation, control, documentation, or manufacturing change and why it is needed.

## Evidence

- [ ] `npm run check`
- [ ] Relevant CAD selectors rendered with command, scale, facet count, and output hashes recorded
- [ ] Generated `cad/generated/config.scad` is current
- [ ] Before/after derived metrics included
- [ ] Hazard analysis and release gates updated when safety behavior changes
- [ ] No ride-ready, theft-proof, guaranteed-speed, or guaranteed-range claim was introduced
- [ ] No credentials, battery unlock data, signing keys, or controller-bypass instructions are included

## Physical validation impact

State which coupon, subassembly, fatigue, impact, brake, tire, electrical, or independent-review evidence must be repeated. A successful render or unit test is not physical validation.

## Integration

Use a merge commit. Do not rebase a shared/published safety-critical branch.

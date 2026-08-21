#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"
node scripts/generate-config.mjs

if ! command -v openscad >/dev/null 2>&1; then
  echo "error: openscad is required" >&2
  exit 127
fi

rm -rf build/smoke
mkdir -p build/smoke
parts=(assembly frame front_fork front_wheel rear_wheel drivetrain rear_hub_cutaway frame_coupon tire_coupon)
for part in "${parts[@]}"; do
  openscad --hardwarnings \
    -o "$root/build/smoke/${part}.csg" \
    -D "PART=\"${part}\"" \
    -D 'RENDER_SCALE=0.05' \
    -D 'FACET_COUNT=20' \
    -D 'SHOW_LABELS=false' \
    cad/sustainable_bike.scad >/dev/null
  test -s "$root/build/smoke/${part}.csg"
done

unique_hashes="$(sha256sum build/smoke/*.csg | awk '{print $1}' | sort -u | wc -l | tr -d ' ')"
if [[ "$unique_hashes" -ne "${#parts[@]}" ]]; then
  echo "error: expected ${#parts[@]} distinct CAD targets, found ${unique_hashes}" >&2
  exit 1
fi

echo "OpenSCAD smoke check passed for ${#parts[@]} distinct parts"

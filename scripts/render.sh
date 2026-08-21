#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"
node scripts/generate-config.mjs
mkdir -p build/stl

scale="${RENDER_SCALE:-0.16}"
facets="${FACET_COUNT:-48}"
parts=(frame front_fork front_wheel rear_wheel drivetrain rear_hub_cutaway frame_coupon tire_coupon)
for part in "${parts[@]}"; do
  echo "rendering ${part}.stl"
  openscad --hardwarnings --render \
    -o "$root/build/stl/${part}.stl" \
    -D "PART=\"${part}\"" \
    -D "RENDER_SCALE=${scale}" \
    -D "FACET_COUNT=${facets}" \
    -D 'SHOW_LABELS=false' \
    cad/sustainable_bike.scad
done

bash scripts/render-preview.sh
printf 'Generated scale-model artifacts under build/stl and assets/preview.png\n'

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
for year in 2026 2027; do
  mkdir -p "build/smoke/${year}"
  for part in "${parts[@]}"; do
    openscad --hardwarnings \
      -o "$root/build/smoke/${year}/${part}.csg" \
      -D "PART=\"${part}\"" \
      -D 'RENDER_SCALE=0.05' \
      -D 'FACET_COUNT=20' \
      -D 'SHOW_LABELS=false' \
      "cad/sustainable_bike_${year}.scad" >/dev/null
    test -s "$root/build/smoke/${year}/${part}.csg"
  done

  unique_hashes="$(sha256sum "build/smoke/${year}"/*.csg | awk '{print $1}' | sort -u | wc -l | tr -d ' ')"
  if [[ "$unique_hashes" -ne "${#parts[@]}" ]]; then
    echo "error: expected ${#parts[@]} distinct ${year} CAD targets, found ${unique_hashes}" >&2
    exit 1
  fi
  echo "OpenSCAD smoke check passed for ${#parts[@]} distinct ${year} parts"
done

hash_2026="$(sha256sum build/smoke/2026/assembly.csg | awk '{print $1}')"
hash_2027="$(sha256sum build/smoke/2027/assembly.csg | awk '{print $1}')"
if [[ "$hash_2026" == "$hash_2027" ]]; then
  echo 'error: 2026 and 2027 assemblies unexpectedly have identical geometry' >&2
  exit 1
fi

echo 'OpenSCAD year-over-year geometry distinction passed'

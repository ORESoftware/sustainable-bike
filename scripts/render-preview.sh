#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"
node scripts/generate-config.mjs
mkdir -p assets build/png

runner=()
if command -v xvfb-run >/dev/null 2>&1; then
  runner=(xvfb-run -a)
fi

year_spec="${DESIGN_YEAR:-2026}"
case "$year_spec" in
  2026|2027) years=("$year_spec") ;;
  all) years=(2026 2027) ;;
  *) echo "error: DESIGN_YEAR must be 2026, 2027, or all" >&2; exit 2 ;;
esac

for year in "${years[@]}"; do
  output="$root/build/png/assembly-${year}.png"
  "${runner[@]}" openscad \
    --imgsize=1600,1000 \
    --projection=p \
    --viewall \
    --autocenter \
    -o "$output" \
    -D 'PART="assembly"' \
    -D 'RENDER_SCALE=0.16' \
    -D 'FACET_COUNT=28' \
    -D 'SHOW_LABELS=true' \
    "cad/sustainable_bike_${year}.scad"

  cp "$output" "$root/assets/preview-${year}.png"
  if [[ "$year" == 2026 ]]; then cp "$output" "$root/assets/preview.png"; fi
  echo "rendered assets/preview-${year}.png"
done

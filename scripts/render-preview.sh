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

"${runner[@]}" openscad \
  --imgsize=1600,1000 \
  --projection=p \
  --viewall \
  --autocenter \
  -o "$root/build/png/assembly.png" \
  -D 'PART="assembly"' \
  -D 'RENDER_SCALE=0.16' \
  -D 'FACET_COUNT=28' \
  -D 'SHOW_LABELS=false' \
  cad/sustainable_bike.scad

cp "$root/build/png/assembly.png" "$root/assets/preview.png"
echo "rendered assets/preview.png"

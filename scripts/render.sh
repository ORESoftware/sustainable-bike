#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"
node scripts/generate-config.mjs
mkdir -p build/stl build/logs

scale="${RENDER_SCALE:-0.16}"
facets="${FACET_COUNT:-48}"
part_timeout="${PART_TIMEOUT_SECONDS:-240}"
resume="${RESUME:-1}"
default_parts="frame front_fork front_wheel rear_wheel drivetrain rear_hub_cutaway frame_coupon tire_coupon"
requested="${PARTS:-$default_parts}"
requested="${requested//,/ }"
read -r -a parts <<< "$requested"
valid_parts=" assembly frame front_fork front_wheel rear_wheel drivetrain rear_hub_cutaway frame_coupon tire_coupon "
failures=()

for part in "${parts[@]}"; do
  [[ -n "$part" ]] || continue
  if [[ "$valid_parts" != *" $part "* ]]; then
    echo "error: unknown CAD part '$part'" >&2
    exit 2
  fi

  output="$root/build/stl/${part}.stl"
  partial="$root/build/stl/${part}.partial.stl"
  log="$root/build/logs/${part}.log"

  if [[ "$resume" == "1" && -s "$output" ]]; then
    echo "skipping existing ${part}.stl ($(stat -c%s "$output") bytes)"
    continue
  fi

  rm -f "$partial"
  echo "rendering ${part}.stl (scale=${scale}, facets=${facets}, timeout=${part_timeout}s)"
  command=(openscad --hardwarnings --render
    -o "$partial"
    -D "PART=\"${part}\""
    -D "RENDER_SCALE=${scale}"
    -D "FACET_COUNT=${facets}"
    -D 'SHOW_LABELS=false'
    cad/sustainable_bike.scad)

  set +e
  if command -v timeout >/dev/null 2>&1; then
    timeout --signal=TERM --kill-after=15 "${part_timeout}s" "${command[@]}" >"$log" 2>&1
    status=$?
  else
    "${command[@]}" >"$log" 2>&1
    status=$?
  fi
  set -e

  if [[ "$status" -ne 0 ]]; then
    failures+=("${part}:exit-${status}")
    rm -f "$partial"
    echo "error: ${part} failed or timed out (exit ${status}); see ${log}" >&2
    continue
  fi

  if [[ ! -s "$partial" ]]; then
    failures+=("${part}:empty-output")
    rm -f "$partial"
    echo "error: ${part} produced no mesh" >&2
    continue
  fi
  mv "$partial" "$output"
  echo "rendered ${output} ($(stat -c%s "$output") bytes)"
done

if ((${#failures[@]} > 0)); then
  printf 'STL export failures: %s\n' "${failures[*]}" >&2
  exit 1
fi

if [[ "${RENDER_PREVIEW:-1}" == "1" ]]; then
  bash scripts/render-preview.sh
fi
printf 'Generated requested scale-model artifacts under build/stl\n'

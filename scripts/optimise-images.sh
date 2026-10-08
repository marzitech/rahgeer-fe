#!/usr/bin/env bash
# Turn source photography into web-ready JPEGs.
#
#   scripts/optimise-images.sh <preset> <out-dir> <file>...
#
# Presets size the master to the slot it is rendered in. There is no point
# shipping a 5000px original for a card that is 360px wide — and the
# dashboard's media upload rejects anything over 5 MB outright.
#
#   banner  1920w  full-bleed home hero
#   hero    1600w  package page hero
#   stop    1300w  itinerary stop photo
#   card     900w  trip card (~360px slot, 2x for retina)
#
# JPEG, not WebP: next/image re-encodes to WebP/AVIF per device at serve
# time, so the master only needs to be a good, widely-handled original.
# (This build of ffmpeg has no libwebp encoder in any case.)
#
# Never upscales — `min(target,iw)` leaves anything already smaller alone.

set -euo pipefail

if [ $# -lt 3 ]; then
  sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
  exit 1
fi

preset=$1; outdir=$2; shift 2

case "$preset" in
  banner) width=1920; q=3 ;;
  hero)   width=1600; q=3 ;;
  stop)   width=1300; q=4 ;;
  card)   width=900;  q=4 ;;
  *) echo "unknown preset: $preset (banner|hero|stop|card)" >&2; exit 1 ;;
esac

mkdir -p "$outdir"
printf '%-44s %10s %10s %7s\n' "file" "before" "after" "saved"

total_before=0; total_after=0
for src in "$@"; do
  [ -f "$src" ] || { echo "missing: $src" >&2; continue; }

  # Slugify: the sources are named things like "ChatGPT Image Sep 10,
  # 2026, 12_06_15 AM.png", which no one wants to pick in a dropdown.
  base=$(basename "${src%.*}" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E -e 's/[^a-z0-9]+/-/g' -e 's/^-//' -e 's/-$//' \
    | cut -c1-48)
  out="$outdir/${base}.jpg"

  # JPEG has no alpha, and ffmpeg composites what it finds onto black
  # without comment. Warn rather than guess: a cut-out wants a PNG, or a
  # deliberate background, and silently blackening one is worse than
  # stopping to ask.
  if ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt \
       -of csv=p=0 "$src" 2>/dev/null | grep -qE 'rgba|bgra|ya|argb'; then
    echo "  WARNING: $(basename "$src") has an alpha channel; JPEG will" >&2
    echo "           flatten it onto black. Keep it as PNG if it is a cut-out." >&2
  fi

  ffmpeg -nostdin -loglevel error -y -i "$src" \
    -vf "scale='min(${width},iw)':-2:flags=lanczos" \
    -map_metadata -1 -pix_fmt yuvj420p -q:v "$q" \
    "$out"

  before=$(stat -f%z "$src"); after=$(stat -f%z "$out")
  total_before=$((total_before + before)); total_after=$((total_after + after))
  printf '%-44s %9.2fM %9.2fM %6.0f%%\n' \
    "$(basename "$out")" \
    "$(echo "$before/1048576" | bc -l)" \
    "$(echo "$after/1048576" | bc -l)" \
    "$(echo "100-($after*100/$before)" | bc -l)"
done

printf '\n%-44s %9.2fM %9.2fM %6.0f%%\n' "TOTAL (${preset}, ${width}w)" \
  "$(echo "$total_before/1048576" | bc -l)" \
  "$(echo "$total_after/1048576" | bc -l)" \
  "$(echo "100-($total_after*100/$total_before)" | bc -l)"

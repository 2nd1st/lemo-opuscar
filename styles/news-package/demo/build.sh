#!/bin/sh
# Broadcast News Package — "The Week in AI" (本周 AI 三件事), LEMO AI NEWS week 42: one-command build.
# fonts → plates grade + map projections → voice (+ speech check) → reading check → events → picture → mix → master → .srt → stills
# Needs the library set up with `setup.sh deps voice music` and the vsco2ce / vcsl sample packs.
# The two illustrative plates in gen/ are kept; tools/gen_plates.sh regenerates them (Codex image_gen; different every time).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$(cd "$HERE/../../.." && pwd)}          # <repo>/films/<name>/demo or <repo>/styles/<slug>/demo
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
PY="$LIB/.venv/bin/python"
OUT="$HERE/.."; NAME=news-package
sh "$HERE/tools/fonts.sh"
[ -s "$HERE/raw/countries-50m.json" ] || { mkdir -p "$HERE/raw"; curl -fsSL -o "$HERE/raw/countries-50m.json" https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json; }
"$PY" "$HERE/tools/prep.py"
[ -f "$LIB/core/tts/kokoro-v1.0.onnx" ] || (cd "$LIB" && sh tools/fetch.sh voice)
for l in vsco2ce vcsl; do [ -d "$LIB/core/audio/instruments/$l" ] || (cd "$LIB" && sh tools/fetch.sh instruments $l); done
cd "$LIB"
"$PY" core/tts/tts.py "$HERE/vo/lines.json" "$HERE/vo"
"$PY" core/tts/asr_check.py "$HERE/vo/lines.json" "$HERE/vo" --lang en
node core/render/readcheck.mjs "$HERE" --step 0.05 || true     # previews (rundown rows, bumpers) are flagged short by design: see STYLE.md §11
node core/render/events.mjs "$HERE"
node core/render/video.mjs "$HERE" --fps 30 --workers ${WORKERS:-5} --out "$HERE/out/video.mp4"
"$PY" "$HERE/mix.py"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$OUT/$NAME.mp4" 30 0
"$PY" "$HERE/tools/subs.py"
node core/render/still.mjs "$HERE" 22.6 --prefix poster_ --out "$HERE/stills" >/dev/null
cp "$HERE/stills/poster_22.6.jpg" "$OUT/poster.jpg"; mv "$HERE/stills/poster_22.6.jpg" "$HERE/stills/styleframe.jpg"
echo "done: $OUT/$NAME.mp4"

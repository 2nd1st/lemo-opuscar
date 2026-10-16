#!/bin/sh
# Engineering Briefing Board — "The Ship Decides": one-command build.
# voice (+ speech check) → scene → checks → picture → score and sound → subtitles → master → poster.
# Objects in kit/objects/ are already prepared (rebuild them with kit/tools/rebuild_objects.sh, about 3 minutes);
# the Chinese font subsets in kit/fonts/ come from kit/tools/fetch_fonts.py (needs a network).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$(cd "$HERE/../../.." && pwd)}          # <repo>/films/<name>/demo or <repo>/styles/<slug>/demo
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
PY="$LIB/.venv/bin/python"
NAME=$(basename "$(dirname "$HERE")")
OUT="$HERE/.."
cd "$HERE"
[ -f audio/vo/dur.json ] || "$PY" "$LIB/core/tts/tts.py" audio/lines.json audio/vo
"$PY" "$LIB/core/tts/asr_check.py" audio/lines.json audio/vo --lang en
python3 scenes/_gen_film.py                                   # scenes/film.json + audio/cues.json
python3 tools/cuecheck.py
cd "$LIB"
node core/render/readcheck.mjs "$HERE" --step 0.05
node "$HERE/tools/camcheck.mjs"
node "$HERE/tools/rescheck.mjs"
node core/render/events.mjs "$HERE"
node core/render/video.mjs "$HERE" --fps 24 --workers ${WORKERS:-5} --out "$HERE/out/video.mp4"
"$PY" "$HERE/audio/mix.py"
"$PY" core/render/srt.py "$HERE/audio/cues.json" "$OUT/$NAME.srt"
node "$HERE/tools/subcheck.mjs" "$OUT/$NAME.srt"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$OUT/$NAME.mp4" 24 1
node core/render/still.mjs "$HERE" 39.9 --prefix poster_ --out "$HERE/stills"
cp "$HERE/stills/poster_39.9.jpg" "$OUT/poster.jpg"
mv "$HERE/stills/poster_39.9.jpg" "$HERE/stills/styleframe.jpg"
"$PY" "$HERE/tools/rhythm_report.py" "$OUT/$NAME.mp4"
"$PY" "$HERE/tools/final_asr.py" "$OUT/$NAME.mp4"
"$PY" "$HERE/tools/camplot.py"
echo "done: $OUT/$NAME.mp4"

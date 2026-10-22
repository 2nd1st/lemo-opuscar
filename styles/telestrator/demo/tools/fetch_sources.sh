#!/bin/sh
# 下载 raw/（约 55 MB）。来源与许可见 SOURCES.md / SOURCES.jsonl。
#   kald.webm   Wikimedia Commons，beIN SPORTS Türkiye，CC BY 3.0（第三球 14 s 片段）
#   yt/summary.mp4  beIN SPORTS Türkiye 官方认证频道 2019-07-24 发布的整场集锦，YouTube 标 CC BY（前两球）；
#                   720p 原生档（format 232+140），不用 YouTube 的 AI 放大档。需要 uv（uvx yt-dlp）。
#   stadium.jpg Commons，Olos88，CC0      hak.jpg  Commons，Thomas Rodenbücher，CC BY 2.0
set -e
D=$(cd "$(dirname "$0")/.." && pwd); cd "$D"; mkdir -p raw/yt
UA="LemoOpuscar/1.0 (https://github.com/lemomo-ai/lemo-opuscar)"
get() { [ -s "$2" ] || { echo "fetch $2"; curl -sSfL -A "$UA" --retry 4 --retry-delay 5 -o "$2" "$1"; }; }
get "https://upload.wikimedia.org/wikipedia/commons/2/20/Kald%C4%B1r%C4%B1m_scored_the_goal_for_a_3-3_draw_%28Be%C5%9Fikta%C5%9F-Fenerbah%C3%A7e_Derby_-_February_2019%29.webm" raw/kald.webm
get "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Vodafone_Park%2C_Istanbul_%28from_outside%29.jpg/1920px-Vodafone_Park%2C_Istanbul_%28from_outside%29.jpg" raw/stadium.jpg
get "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Hasan_Ali_Kald%C4%B1r%C4%B1m_2013_1.jpg/500px-Hasan_Ali_Kald%C4%B1r%C4%B1m_2013_1.jpg" raw/hak.jpg
[ -s raw/yt/summary.mp4 ] || uvx yt-dlp -f "232+140/bv*[height=720][vcodec^=avc1]+ba[ext=m4a]" --no-playlist --write-info-json -o "raw/yt/summary.%(ext)s" "https://www.youtube.com/watch?v=sYfsd9Hv7hc"
ls -la raw raw/yt | grep -v "^total"

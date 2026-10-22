#!/bin/bash
# 抽帧看片：sh tools/stills.sh 秒 秒 … → work/st/t_<秒>.jpg + work/st_sheet.jpg
cd "$(dirname "$0")/.."
PY=../../../.venv/bin/python
mkdir -p work/st; A=(); F=()
for t in "$@"; do A+=("$t" "work/st/t_$t.jpg"); F+=("work/st/t_$t.jpg"); done
$PY tools/render.py --still "${A[@]}" | tail -1
$PY ../../../core/render/sheet.py work/st_sheet.jpg "${F[@]}" --cols 4 --w 480

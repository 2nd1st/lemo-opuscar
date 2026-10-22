#!/bin/sh
# 三张示意空镜（Codex image_gen），逐张生成；画面里的字一律由代码排版
cd "$(dirname "$0")/.."
G="python3 tools/gen_image.py"
COMMON="Photorealistic editorial news b-roll still, 16:9, cinematic, natural light, shallow depth of field. Absolutely no text, no letters, no numbers, no logos, no brand marks, no flags, no people, no faces."
$G "Long aisle of a dim modern data center, rows of black server racks with tiny white and amber status lights, cool haze, symmetrical one-point perspective, camera at chest height. $COMMON" --no-anchor --aspect 16:9 --out gen --name plate_datacenter --timeout 420
$G "Macro close-up of a polished silicon wafer covered in a grid of microchip dies, iridescent reflections, held in a dark cleanroom, low-key lighting, diagonal composition. $COMMON" --no-anchor --aspect 16:9 --out gen --name plate_wafer --timeout 420
$G "Empty modern international conference hall before a keynote, a plain wooden lectern on a low stage, rows of empty seats, large blank dark screen, soft cool stage light, wide shot from the back of the room. $COMMON" --no-anchor --aspect 16:9 --out gen --name plate_hall --timeout 420

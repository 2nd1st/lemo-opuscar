#!/bin/sh
# raw/ → assets/：比赛画面逐帧（1280×720 → 1920×1080，1.5×，现代素材上限），照片，原声
#   a/  Commons 片段（第三球，14 s，350 帧）——定稿片的跟踪关键帧都按这套帧号
#   b/  官方集锦 110.52 s 起 196 帧：55′ 第一球主机位
#   c/  官方集锦 140.80 s 起 192 帧：61′ 第二球主机位（F001–F090）+ 反打高机位回放（F091–F192）
set -e
D=$(cd "$(dirname "$0")/.." && pwd); cd "$D"
LIB=${LIB:-$(cd "$D/../../.." && pwd)}; PY="$LIB/.venv/bin/python"
A=assets; mkdir -p $A/a $A/b $A/c audio
# 去压缩块 → lanczos 1.5× → 轻锐化；统一轻调色（降一点饱和、压高光、暗部偏冷），颗粒在 mux 里统一加
VF="hqdn3d=1.2:1.2:2.5:2.5,scale=1920:1080:flags=lanczos,unsharp=5:5:0.55:5:5:0,eq=saturation=0.9:contrast=1.04:gamma=0.97,colorbalance=bs=0.03:bm=0.0:rh=-0.01"
[ -s $A/a/350.jpg ] || ffmpeg -v error -y -i raw/kald.webm -an -vf "$VF" -q:v 3 -start_number 1 $A/a/%03d.jpg
[ -s $A/b/196.jpg ] || ffmpeg -v error -y -ss 110.52 -i raw/yt/summary.mp4 -t 7.84 -an -vf "$VF" -q:v 3 -start_number 1 $A/b/%03d.jpg
[ -s $A/c/192.jpg ] || ffmpeg -v error -y -ss 140.80 -i raw/yt/summary.mp4 -t 7.68 -an -vf "$VF" -q:v 3 -start_number 1 $A/c/%03d.jpg
# 照片：体育场外景裁 16:9 到 1920×1080（原图 1920×1440，只裁不放）；肖像保持原尺寸
"$PY" -I -c "
from PIL import Image
im=Image.open('raw/stadium.jpg').convert('RGB'); w,h=im.size; t=int((h-w*9/16)*0.45)
im.crop((0,t,w,t+int(w*9/16))).resize((1920,1080),Image.LANCZOS).save('$A/stadium.jpg',quality=90)
Image.open('raw/hak.jpg').convert('RGB').save('$A/hak.jpg',quality=92)
"
# 原声 48 kHz 立体声：Commons 片段 + 官方集锦（取前两球的原声）
ffmpeg -v error -y -i raw/kald.webm -vn -ac 2 -ar 48000 audio/orig.wav
ffmpeg -v error -y -ss 108 -i raw/yt/summary.mp4 -t 45 -vn -ac 2 -ar 48000 audio/orig2.wav   # 集锦 108–153 s
ls $A/a $A/b $A/c | wc -l

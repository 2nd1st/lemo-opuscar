#!/bin/sh
# raw/ → frames/<cam>/NNNN.jpg：按「片中帧号」命名的 30 fps 帧序列（统一调色），外加照片 / 文件。
# 片中 t ↔ 任务时间 M = t − 32.5（T0 在 t = 32.5）。同步关系全部固化在这里（见 STYLE.md「同步表」）：
#   cam      源秒 s = …          片中区间（只截用得到的）   怎么对的时
#   live     s = M + 46.8        t 0 – 59.5                 直播角标 T−0:00:32→31 的跳变 + 解说逐词（"booster" 47.0）
#   slscam   s = M + 34.8        t 17 – 59.5                片内烧录的任务计时器 002-00:00:00.000（逐帧）
#   orion    s = M + 26.25       t 22 – 33                  RS-25 起动的第一缕光（T−6.36）在源 19.9 s
#   uas      s = M + 10.4        t 23 – 59.5                点火闪光（样片已测）
#   banana   s = M + 19.0        t 26 – 43                  助推器点火亮度跃升（源 19.0–19.1 s）
#   osb      s = 3.0 + 2.5·M     t 32 – 37（慢 2.5 倍还原实时）  RS-25 白汽 → 助推器灰烟 15 s ≈ 真实 6.36 s
#   fr1      不同步（无时钟）：t 2.5–13.2 ← s = t + 19.9；t 25.2 – 32.8 ← s = t + 10.8（同一倒计时段内的镜头）
set -e
cd "$(dirname "$0")/.."
F=frames; rm -rf $F; mkdir -p $F
G="eq=contrast=1.07:saturation=0.9:gamma=0.97:brightness=-0.01,colorbalance=rs=-0.02:bs=0.03:rh=0.03:bh=-0.02"
X="-v error -y"
# cut <cam> <源起点> <片中起点> <时长> <滤镜>
cut() {
  mkdir -p $F/$1
  n=$(python3 -c "print(round($3*30))")
  ffmpeg $X -ss $2 -t $4 -i raw/$6.mp4 -vf "fps=30,$5,$G" -q:v 3 -start_number $n $F/$1/%04d.jpg
}
# 直播 4K → 1920
cut live 14.3 0 59.6 "scale=1920:1080:flags=lanczos" live4k
# 消声水一句的推近（t 16.4–24.5）：同一直播源按 2880 宽另出一套，推近 1.5 倍仍是源像素（不放大）
cut livehi 30.7 16.4 8.2 "scale=2880:1620:flags=lanczos" live4k
# 箭载摄像机 720p：先抹掉左上角的计时器（只用来对时），再按需放大（全屏最多 1.5 倍）
cut slscam 19.3 17 42.6 "delogo=x=12:y=20:w=188:h=54,scale=1920:1080:flags=lanczos,unsharp=5:5:0.35" slscam
# 轨道器俯视摄像机：顺时针转 90°，让箭体在上、地面在下
cut orion 15.75 22 11 "crop=760:1080:960:0,transpose=1" orioncam
# 无人机 1920×1012
cut uas 0.9 23 36.6 "scale=2049:1080:flags=lanczos,crop=1920:1080,unsharp=5:5:0.3" uas
# 香蕉河远景
cut banana 12.5 26 17 "null" banana
# OSB 慢动作：慢 2.5 倍 → setpts/2.5 还原实时（片中 t 32 起 = M −0.5 = 源 1.75）
mkdir -p $F/osb
ffmpeg $X -ss 1.75 -t 13 -i raw/osb.mp4 -vf "setpts=(PTS-STARTPTS)/2.5,fps=30,scale=1920:1080:flags=lanczos,$G" -q:v 3 -start_number 960 $F/osb/%04d.jpg
# 控制室（同一时段，未逐帧同步）
cut fr1 22.4 2.5 10.7 "null" fr1
cut fr1 36.0 25.2 7.6 "null" fr1
# 照片 + 文件
ffmpeg $X -i raw/walkout_0004.jpg -vf "crop=4900:3100:420:1100,scale=1960:-2:flags=lanczos,$G" -q:v 2 $F/photo.jpg
ffmpeg $X -i raw/onepager.jpg -q:v 2 -vf "scale=2880:-2:flags=lanczos" $F/doc.jpg
for d in $F/*/; do echo "$d $(ls $d | head -1) … $(ls $d | tail -1) ($(ls $d | wc -l | tr -d ' '))"; done

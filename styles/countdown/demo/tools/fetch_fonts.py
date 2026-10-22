#!/usr/bin/env python3
"""下载本片用到的字体（全部 OFL，来自 Google Fonts）到 fonts/。
Latin：Barlow / Barlow Condensed / IBM Plex Mono（github.com/google/fonts）。
中文：Noto Sans SC 500 / 700，按 index.html 和 audio/cues.json 里出现的汉字子集化（Google Fonts CSS API 的 &text=）。
改了画面字或字幕后重跑：python3 tools/fetch_fonts.py"""
import re, json, urllib.request, urllib.parse
from pathlib import Path
HERE = Path(__file__).resolve().parent.parent
FD = HERE / "fonts"; FD.mkdir(exist_ok=True)
GH = "https://raw.githubusercontent.com/google/fonts/main/ofl/"
for p in ["barlowcondensed/BarlowCondensed-SemiBold.ttf", "barlowcondensed/BarlowCondensed-Medium.ttf", "barlow/Barlow-Medium.ttf",
          "barlow/Barlow-SemiBold.ttf", "ibmplexmono/IBMPlexMono-Medium.ttf", "ibmplexmono/IBMPlexMono-SemiBold.ttf"]:
    out = FD / Path(p).name
    if not out.exists(): out.write_bytes(urllib.request.urlopen(GH + p, timeout=60).read())
for fam, name in [("barlow", "OFL-Barlow.txt"), ("ibmplexmono", "OFL-IBMPlexMono.txt")]:
    if not (FD / name).exists(): (FD / name).write_bytes(urllib.request.urlopen(GH + fam + "/OFL.txt", timeout=60).read())
src = (HERE / "index.html").read_text()
cj = HERE / "audio" / "cues.json"
if cj.exists(): src += json.dumps(json.load(open(cj)), ensure_ascii=False)
chars = sorted(set(c for c in src if ord(c) > 0x2E7F)) + list("0123456789")
text = "".join(chars)
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
for wt in (500, 700):
    url = f"https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@{wt}&text=" + urllib.parse.quote(text)
    css = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read().decode()
    furl = re.search(r"url\((https://[^)]+)\)", css).group(1)
    (FD / f"NotoSansSC-{wt}-sub.woff2").write_bytes(urllib.request.urlopen(furl, timeout=60).read())
print(f"fonts ok: {len(chars)} CJK glyphs subset")

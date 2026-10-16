"""Subset Noto Sans SC (OFL, variable) to every character in film.js and timeline.js.
usage: fonts.py <demo_dir>   (source font: assets/raw/fonts/NotoSansSC.ttf, fetched by build.sh)"""
import os, sys
from fontTools import subset
D = sys.argv[1]
chars = set()
for f in ("film.js", "timeline.js"):
    chars |= set(open(os.path.join(D, f), encoding="utf-8").read())
chars |= set(chr(c) for c in range(32, 127)) | set("·→°²×−▸—“”")
text = "".join(sorted(c for c in chars if ord(c) >= 32))
o = subset.Options(); o.flavor = "woff2"; o.layout_features = ["*"]
font = subset.load_font(os.path.join(D, "assets/raw/fonts/NotoSansSC.ttf"), o)
s = subset.Subsetter(o); s.populate(text=text); s.subset(font)
subset.save_font(font, os.path.join(D, "fonts/NotoSansSC-sub.woff2"), o); print("NotoSansSC-sub.woff2", len(text), "chars")

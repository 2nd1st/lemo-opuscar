#!/usr/bin/env python3
"""字幕条目 → audio/cues.json（给 core/render/srt.py 出 .srt）。规则与 index.html 的 cueSpan() 相同：
从旁白开口起，到念完 + 0.45 s 或下一条开口前 0.08 s 为止；每条两行：中文在上、英文在下（各一行，不换行）。"""
import json, os
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tl = json.load(open(f'{D}/timeline.json', encoding='utf-8')); vd = json.load(open(f'{D}/audio/vo/dur.json'))
vo = tl['vo']; out = []
for i, v in enumerate(vo):
    t1 = v['t'] + vd.get(v['id'], 2.5) + .45
    if i + 1 < len(vo): t1 = min(t1, vo[i + 1]['t'] - .08)
    out.append({'t0': v['t'], 't1': round(t1, 3), 'text': v['zh'] + '\n' + v['text']})
json.dump(out, open(f'{D}/audio/cues.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for c in out: print(f"{c['t0']:6.2f}–{c['t1']:6.2f}  {c['t1'] - c['t0']:.2f}s  {c['text'].replace(chr(10), ' | ')}")

#!/usr/bin/env python3
"""film.json 的字幕 → audio/cues.json（core/render/srt.py 的输入）：每条中文一行、英文一行。"""
import json, os
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = json.load(open(os.path.join(D, 'film.json'), encoding='utf-8'))
json.dump([{'t0': a, 't1': b, 'text': f'{zh}\n{en}'} for a, b, zh, en in F['subs']], open(os.path.join(D, 'audio/cues.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(F['subs']), 'cues')

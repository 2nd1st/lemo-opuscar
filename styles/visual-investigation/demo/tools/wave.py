#!/usr/bin/env python3
"""原声片段的波形峰值（每 1/60 s 一个），写成 JSON 给页面画波形条。"""
import json, sys, os
import numpy as np, soundfile as sf
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for c in ['c1', 'c2']:
    x, sr = sf.read(os.path.join(D, f'assets/snd/{c}.wav')); x = x if x.ndim == 1 else x.mean(1)
    n = sr // 60; pk = [float(np.abs(x[i:i + n]).max()) for i in range(0, len(x), n)]
    m = max(pk) or 1; json.dump({'dur': len(x) / sr, 'pk': [round(v / m, 3) for v in pk]}, open(os.path.join(D, f'assets/snd/{c}.json'), 'w'))
    print(c, len(pk))

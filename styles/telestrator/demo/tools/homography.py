#!/usr/bin/env python3
"""球场线 → 透视矩阵。pitch.json 里每个镜头给 ≥4 个已知球场点（米，原点 = 球门中心，x = 离开球门线的距离，
y = 横向，远端为负）和它们在 1920×1080 画面里的位置；输出 assets/pitch.json：每个镜头的 H（球场→画面）、
残差，以及要换算的点（起脚点）在球场上的坐标。页面用 H 做"画面展平成俯视图"。"""
import json, os, sys
import numpy as np
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = json.load(open(f'{D}/tools/pitch.json'))
def dlt(P, Q):
    A = []
    for (x, y), (u, v) in zip(P, Q):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y, -u]); A.append([0, 0, 0, x, y, 1, -v * x, -v * y, -v])
    _, _, Vt = np.linalg.svd(np.array(A, float)); H = Vt[-1].reshape(3, 3); return H / H[2, 2]
def app(H, p):
    q = H @ np.array([p[0], p[1], 1.0]); return q[:2] / q[2]
out = {}
for shot, s in src.items():
    P = [c[0] for c in s['pts']]; Q = [c[1] for c in s['pts']]
    H = dlt(P, Q); Hi = np.linalg.inv(H)
    res = [float(np.hypot(*(app(H, p) - np.array(q)))) for p, q in zip(P, Q)]
    marks = {k: [round(float(v), 2) for v in app(Hi, xy)] for k, xy in s.get('marks', {}).items()}
    out[shot] = {'H': (H / H[2, 2]).round(9).tolist(), 'res_px': [round(r, 1) for r in res], 'marks_m': marks}
    print(shot, 'residual px', [round(r, 1) for r in res])
    for k, m in marks.items(): print(f'   {k}: x={m[0]} m out, y={m[1]} m, dist to goal centre {np.hypot(*m):.1f} m')
os.makedirs(f'{D}/assets', exist_ok=True)
json.dump(out, open(f'{D}/assets/pitch.json', 'w'), indent=1)

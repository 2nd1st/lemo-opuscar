"""raw/ + gen/ → assets/：示意空镜统一调色（冷调 duotone）、欧洲地图解码投影成 2D 路径。
用库的 .venv 运行：$LIB/.venv/bin/python tools/prep.py"""
import json, math, os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW, GEN, OUT = os.path.join(HERE, 'raw'), os.path.join(HERE, 'gen'), os.path.join(HERE, 'assets')
os.makedirs(OUT, exist_ok=True)

# —— 统一调色：所有画面层素材走同一条曲线（品牌黑 → 米白） ——
SHADOW = np.array([14, 16, 19], float)     # #0E1013，比品牌黑 #121417 再深一点
LIGHT = np.array([236, 231, 216], float)   # #ECE7D8，品牌米白 #F4F1E8 压一档
def grade(im, black=8, white=232, gamma=1.05):
    g = np.asarray(im.convert('L'), float)
    lo, hi = np.percentile(g, 0.5), np.percentile(g, 99.6)
    g = np.clip((g - lo) / max(1, hi - lo), 0, 1) ** gamma
    g = g * g * (3 - 2 * g) * .35 + g * .65
    g = black / 255 + g * (white - black) / 255
    rgb = SHADOW[None, None] + (LIGHT - SHADOW)[None, None] * g[..., None]
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8))

meta = {}
for name, crop in [('datacenter', None), ('wafer', None), ('hall', (0, 70, 1600, 941))]:
    src = os.path.join(GEN, f'plate_{name}.png')
    if not os.path.exists(src): continue
    im = Image.open(src).convert('RGB')
    if crop: im = im.crop(crop)
    grade(im).save(os.path.join(OUT, f'plate_{name}.jpg'), quality=92)
    meta[name] = im.size

# —— 欧洲地图：world-atlas countries-50m（Natural Earth，公有领域）→ 兰伯特方位等积投影（中心 10°E 52°N，同 EPSG:3035 的思路）——
topo = json.load(open(os.path.join(RAW, 'countries-50m.json')))
sx, sy = topo['transform']['scale']; tx, ty = topo['transform']['translate']
arcs = []
for a in topo['arcs']:
    x = y = 0; pts = []
    for dx, dy in a:
        x += dx; y += dy; pts.append((x * sx + tx, y * sy + ty))
    arcs.append(pts)
L0, P0 = math.radians(10), math.radians(52)
def laea(lon, lat):
    l, p = math.radians(lon), math.radians(lat)
    k = math.sqrt(2 / (1 + math.sin(P0) * math.sin(p) + math.cos(P0) * math.cos(p) * math.cos(l - L0)))
    x = k * math.cos(p) * math.sin(l - L0)
    y = k * (math.cos(P0) * math.sin(p) - math.sin(P0) * math.cos(p) * math.cos(l - L0))
    return round(x * 6371, 1), round(-y * 6371, 1)          # km，y 向下
def ring(r):
    pts = []
    for i in r:
        s = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts += s if not pts else s[1:]
    return pts
EU27 = {'040', '056', '100', '191', '196', '203', '208', '233', '246', '250', '276', '300', '348', '372', '380', '428', '440', '442',
        '470', '528', '616', '620', '642', '703', '705', '724', '752'}
WIN = (-32, 25, 60, 75)  # 经纬度窗口：只留和欧洲窗口相交的国家，环里窗口外的点截到窗口边
countries = {}
for g in topo['objects']['countries']['geometries']:
    if 'arcs' not in g: continue
    polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
    rings = []
    for p in polys:
        for r in p:
            pts = ring(r)
            if not any(WIN[0] <= x <= WIN[2] and WIN[1] <= y <= WIN[3] for x, y in pts): continue
            pts = [(min(max(x, WIN[0] - 8), WIN[2] + 8), min(max(y, WIN[1] - 6), WIN[3] + 6)) for x, y in pts]
            rings.append([laea(x, y) for x, y in pts])
    if rings:
        countries[g.get('id', g['properties']['name'])] = {'name': g['properties']['name'], 'eu': g.get('id') in EU27, 'rings': rings}
DUBLIN = laea(-6.2603, 53.3498)
json.dump({'countries': countries, 'dublin': DUBLIN, 'brussels': laea(4.3517, 50.8503)}, open(os.path.join(OUT, 'europe.json'), 'w'), separators=(',', ':'))

# —— 东亚定位小地图：同一套 TopoJSON，兰伯特方位等积投影（中心 127.5°E 37°N）——
def laea_at(lon0, lat0):
    L, P = math.radians(lon0), math.radians(lat0)
    def f(lon, lat):
        l, p = math.radians(lon), math.radians(lat)
        k = math.sqrt(2 / (1 + math.sin(P) * math.sin(p) + math.cos(P) * math.cos(p) * math.cos(l - L)))
        return round(k * math.cos(p) * math.sin(l - L) * 6371, 1), round(-k * (math.cos(P) * math.sin(p) - math.sin(P) * math.cos(p) * math.cos(l - L)) * 6371, 1)
    return f
ea = laea_at(127.5, 37.0); WIN2 = (100, 15, 160, 60); asia = {}
for g in topo['objects']['countries']['geometries']:
    if 'arcs' not in g: continue
    polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
    rings = []
    for p in polys:
        for r in p:
            pts = ring(r)
            if not any(WIN2[0] <= x <= WIN2[2] and WIN2[1] <= y <= WIN2[3] for x, y in pts): continue
            pts = [(min(max(x, WIN2[0] - 8), WIN2[2] + 8), min(max(y, WIN2[1] - 6), WIN2[3] + 6)) for x, y in pts]
            rings.append([ea(x, y) for x, y in pts])
    if rings: asia[g.get('id')] = {'name': g['properties']['name'], 'kr': g.get('id') == '410', 'rings': rings}
json.dump({'countries': asia, 'seoul': ea(126.978, 37.5665)}, open(os.path.join(OUT, 'eastasia.json'), 'w'), separators=(',', ':'))
print(len(asia), 'east-asia countries; Seoul', ea(126.978, 37.5665))
json.dump(meta, open(os.path.join(OUT, 'meta.json'), 'w'), indent=1)
print(meta, len(countries), 'countries; Dublin', DUBLIN, 'EU', sum(c['eu'] for c in countries.values()))

"""镜头表（时间全部来自 timeline.bar）。

CLIPS：prep.py 要切出的视频片段 → work/clips/<id>.mp4（帧数 = 长度 × 30，帧准确）
  id: dict(src, s0=源入点 s, n=帧数, speed=常数 或 [(片内秒, 速度), …] 关键帧（平滑插值 = 速度坡）,
           blend=最多融合几帧（360° 快门，光河）, interp=慢放时运动补偿插帧倍数, size=输出尺寸)
  速度 = 源秒数 / 片中秒数。

SHOTS：时间线上的镜头（render.py 逐帧合成）
  kind: clip / photo / flicker（两段每 2 帧交替）/ grid / split / flash / page / black
"""
from timeline import bar, FPS, NOON, GRID, BRAKE, DUSK, FLASH, STOP, PAGE, CARD, DUR

V = dict(sky='raw/sky23.webm', nyim='raw/nyim.webm', aer='raw/aerial.webm',
         tsq='raw/tsq_night.mp4', top='raw/tsq_top.mp4', b99='raw/br1899.mp4')


def nf(a, b):
    return round(b * FPS) - round(a * FPS)


CLIPS = {}
SHOTS = []


def clip(cid, t_in, t_out, src, s0, speed, blend=1, interp=1, motion=(1, 1, 0, 0), wb=.3, fx=None, size=(1920, 1080)):
    CLIPS[cid] = dict(src=src, s0=s0, n=nf(t_in, t_out), speed=speed, blend=blend, interp=interp, size=size)
    SHOTS.append(dict(id=cid, kind='clip', t0=t_in, t1=t_out, motion=motion, wb=wb, fx=fx, src=src))


def photo(sid, t_in, t_out, names, c, s0, s1, drift=(0, 0), wb=.3, expo=1.0):
    SHOTS.append(dict(id=sid, kind='photo', t0=t_in, t1=t_out, names=names, c=c, s=(s0, s1), drift=drift, wb=wb, expo=expo))


# ───────── 夜 → 晨（0–8 s）─────────
photo('s01_orbit', 0.0, bar(2), ['iss47'], (.585, .50), 1.25, 1.95, wb=0)          # 从轨道落进城市（片名）
clip('s02_sky_dawn', bar(2), bar(3), 'sky', 250.0, 40, blend=30, wb=0, motion=(1.0, 1.06, 0, -8))  # 夜→黎明光河
clip('s03_aer_sun', bar(3), bar(3, 2), 'aer', 226.0, 3, blend=3, motion=(1.04, 1.0, 0, 0))
clip('s04_gc_clock', bar(3, 2), bar(3, 3), 'nyim', 1.0, 1, motion=(1.0, 1.04, 0, 0), wb=.5)
photo('s05_ph_clock', bar(3, 3), bar(4), ['ph_clock'], (.5, .36), 1.0, 1.05, wb=.3)   # 钟 → 钟（圆形匹配）

# ───────── 上午（8–16 s）─────────
clip('s06_oc_corr', bar(4), bar(4, 2), 'nyim', 77.8, [(0, 1.0), (.6, 6.0), (1.0, 6.0)], blend=6, motion=(1.0, 1.06, 0, 0), wb=.5)   # 速度坡 1×→6×
clip('s07_aer_roof', bar(4, 2), bar(5), 'aer', 15.0, 2, blend=2, wb=.25)
clip('s08_oculus', bar(5), bar(6), 'nyim', 87.3, 2.1, blend=3, wb=.45, fx='trails')   # 人流 → 光线
MONT = [('s09_street', 'nyim', 56.2, 2), ('s10_aer_bus', 'aer', 126.0, 3), ('s11_fifth', 'nyim', 52.2, 2), ('s12_aer_bridge', 'aer', 175.0, 3),
        ('s13_wash', 'nyim', 47.2, 2), ('s14_aer_curve', 'aer', 336.0, 2), ('s15_chrysler', 'nyim', 59.6, 1.2), ('s16_aer_ave', 'aer', 42.0, 3),
        ('s16b_aer_train', 'aer', 60.0, 3), ('s16c_liberty', 'nyim', 99.6, 2), ('s16d_aer_bridge2', 'aer', 245.0, 3), ('s16e_stairs', 'nyim', 82.4, 2)]
for k, (cid, src, s0, sp) in enumerate(MONT):     # 第 6 小节 1 拍一切（4 刀），第 7 小节半拍一切（8 刀）
    a, b = (bar(6, k), bar(6, k + 1)) if k < 4 else (bar(7, (k - 4) * .5), bar(7, (k - 4) * .5 + .5))
    clip(cid, a, b, src, s0, sp, blend=max(1, round(sp)), wb=.4 if src == 'nyim' else .25)

# ───────── 正午 + 网格（16–24 s）─────────
clip('s17_sky_noon', NOON, GRID, 'sky', 548.0, 37.5, blend=24, wb=.25, motion=(1.0, 1.05, 0, 0))   # 云河 + 8,804,190
SHOTS.append(dict(id='s18_grid', kind='grid', t0=GRID, t1=BRAKE))
# 网格池：每段 1 s（30 帧），全是白天
POOL = [('g_aer_curve', 'aer', 344.0, 2), ('g_oculus', 'nyim', 88.4, 2), ('g_aer_roof', 'aer', 21.0, 2), ('g_sky', 'sky', 620.0, 40),
        ('g_oc_corr', 'nyim', 80.2, 2), ('g_aer_bus2', 'aer', 140.0, 3), ('g_street2', 'nyim', 57.0, 2), ('g_ferry', 'nyim', 95.5, 2),
        ('g_aer_top', 'aer', 189.0, 3), ('g_wash2', 'nyim', 48.2, 2), ('g_aer_ave2', 'aer', 305.0, 3), ('g_clock2', 'nyim', 0.0, 1),
        ('g_rock', 'nyim', 70.0, 2), ('g_aer_rooftop', 'aer', 98.0, 3), ('g_chrysler2', 'nyim', 60.4, 1.2), ('g_aer_side', 'aer', 357.0, 2)]
for cid, src, s0, sp in POOL:
    CLIPS[cid] = dict(src=src, s0=s0, n=30, speed=sp, blend=max(1, round(sp)) if src != 'sky' else 24, interp=1, size=(1920, 1080))
GRID_STAGES = [   # (开始, 列, 行, 池里的镜头)
    (GRID, 2, 1, ['g_aer_curve', 'g_oculus']),
    (bar(10, 2), 2, 2, ['g_aer_roof', 'g_sky', 'g_oc_corr', 'g_aer_bus2']),
    (bar(11), 3, 3, ['g_street2', 'g_aer_top', 'g_ferry', 'g_wash2', 'g_sky', 'g_aer_ave2', 'g_clock2', 'g_oculus', 'g_rock']),
    (bar(11, 2), 4, 4, [c[0] for c in POOL]),
]

# ───────── 刹车（24–32 s）─────────
clip('s19_bubble', BRAKE, bar(13, 2), 'nyim', 41.75, [(0, 2.2), (.55, .3), (3.0, .3)], interp=3, wb=.45, motion=(1.0, 1.08, 0, -10))  # 速度坡入慢放
CLIPS['b_1899'] = dict(src='b99', s0=3.4, n=nf(bar(13, 2), bar(15, 2)), speed=.75, blend=1, interp=1, mix=True, size=(1440, 1080))
CLIPS['b_today'] = dict(src='nyim', s0=105.15, n=nf(bar(13, 2), bar(15, 2)), speed=.72, blend=1, interp=1, mix=True, size=(1920, 1080))
SHOTS.append(dict(id='s20_split', kind='split', t0=bar(13, 2), t1=bar(15, 2), left='b_1899', right='b_today'))
photo('s21_ph_gct', bar(15, 2), DUSK, ['ph_gct'], (.5, .62), 1.10, 1.16, wb=.35)       # 长曝光：人只剩虚影

# ───────── 黄昏 → 夜（32–40 s）─────────
clip('s22_bridge_sun', DUSK, bar(16, 2), 'nyim', 108.4, 3, blend=3, wb=.35, motion=(1.0, 1.04, 0, 0))
clip('s23_ferry', bar(16, 2), bar(16, 3), 'nyim', 93.2, 2, blend=2, wb=.35)
clip('s24_aer_gold', bar(16, 3), bar(17), 'aer', 280.0, 3, blend=3, wb=.3)
clip('s25_sky_dusk', bar(17), bar(17, 2), 'sky', 716.0, 75, blend=30, wb=0)              # 一秒天黑
CLIPS['fl_day'] = dict(src='sky', s0=600.0, n=15, speed=30, blend=24, interp=1, size=(1920, 1080))
CLIPS['fl_night'] = dict(src='sky', s0=880.0, n=15, speed=30, blend=24, interp=1, size=(1920, 1080))
SHOTS.append(dict(id='s26_flicker', kind='flicker', t0=bar(17, 2), t1=bar(17, 3), a='fl_day', b='fl_night', wb=0))
photo('s27_ph_ts', bar(17, 3), bar(18), ['ph_ts1', 'ph_ts2'], (.5, .78), 1.0, 1.05, wb=.2)   # 同机位照片每 2 帧交替
clip('s28_tsq', bar(18), bar(18, 3), 'tsq', 12.2, [(0, 1.0), (.7, 7.0), (1.5, 7.0)], blend=7, wb=0, motion=(1.0, 1.08, 0, 0))   # 时报广场 + 220,000
clip('s29_tsq2', bar(18, 3), bar(19), 'tsq', 31.0, 3, blend=3, wb=0)
clip('s30_top', bar(19), bar(19, 2), 'top', 6.4, 5, blend=14, wb=0)                   # 车流 → 光的线（高倍融合）
clip('s31_top2', bar(19, 2), bar(19, 3), 'top', 17.0, 3, blend=3, wb=0)
clip('s32_tsq3', bar(19, 3), FLASH, 'tsq', 20.0, 6, blend=6, wb=0)

# ───────── 一天倒着闪回（40–42 s = 60 帧），硬停 ─────────
SHOTS.append(dict(id='s33_flash', kind='flash', t0=FLASH, t1=STOP))
FLASH_SRC = ['s32_tsq3', 's30_top', 's28_tsq', 's27_ph_ts', 's25_sky_dusk', 's24_aer_gold', 's22_bridge_sun', 's21_ph_gct',
             's19_bubble', 's17_sky_noon', 's15_chrysler', 's12_aer_bridge', 's10_aer_bus', 's08_oculus', 's07_aer_roof',
             's06_oc_corr', 's05_ph_clock', 's04_gc_clock', 's03_aer_sun', 's02_sky_dawn', 's01_orbit', 's02_sky_dawn']
FLASH_LEN = [4] * 8 + [2] * 14
assert sum(FLASH_LEN) == nf(FLASH, STOP)

SHOTS.append(dict(id='s34_black', kind='black', t0=STOP, t1=PAGE))
SHOTS.append(dict(id='s35_page', kind='page', t0=PAGE, t1=CARD))
# 尾声：同一机位，第二天的黎明（夜→蓝→清晨），引文压在上面；落版时压暗继续走
clip('s36_dawn', CARD, DUR, 'sky', 1008.0, 8, blend=8, wb=0, motion=(1.0, 1.06, 0, -6))

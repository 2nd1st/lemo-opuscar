# 素材来源

由 `footage.py md` 从 SOURCES.jsonl 生成。片中用到的每段素材都在这里。

| 名字 | 标题 / 作者 / 日期 | 许可 | 来源页 | 规格 | 用了哪几秒 |
|---|---|---|---|---|---|
| univ | Special Release - Zeppelin Explodes Scores Dead, 1937/05/10 / 1937 | http://creativecommons.org/licenses/publicdomain/ | https://archive.org/details/1937-05-10_Special_Release_Zeppelin_Explodes | 720×480 180.0s | src 38.0–41.6 s 纽约上空航拍 → 片头 2.4–6.3 s；src 59.4–67.1 s 进场镜头 → 位置 14.6–18.6 s；src 78.6–104.4 s 火灾连续镜头 → 冷开场倒带 2.0–2.4 s、三十二秒 33.6–36.5 s（约 9× 扫过）；src 80.2 定格 → 0.0–2.0 s、起火点 24.4–31.8 s、结论图、落版；src 103.6 定格 → 36.5–38.6 s；原声 src 78.10–81.56 → 24.4–27.9 s，src 40.38–44.72 → 46.0–50.3 s |
| fbi01 | Hindenburg / Federal Bureau of Investigation | http://creativecommons.org/publicdomain/mark/1.0/ | https://archive.org/details/HindenburgFBI | × | p.39（Lt. Tyler 证词）→ 冷开场 0.6–2.4 s、起火点 24.0–31.8 s、结论图、落版；p.13（电传 1937-05-08）→ 调查 38.6–45.6 s |
| nh57973 | U.S. Navy / Naval History and Heritage Command NH 57973 | Public domain (U.S. Navy, NHHC NH 57973) | https://commons.wikimedia.org/wiki/File:NH_57973_Airship_HINDENBURG_Disaster,_6_May_1937.png | 3840×3093 | 三十二秒（≈T+26 s，与影像姿态比对） |
| pasq | Gus Pasquarella, U.S. Navy, NAS Lakehurst, 1937-05-06 | Public domain (U.S. Navy photo) | https://commons.wikimedia.org/wiki/File:Hindenburg_burning,_1937.jpg | 3840×2899 0.0s | 冷开场 0.9–2.4 s；起火点 24.8–31.8 s；三十二秒（≈T+2 s）；结论图；落版 |
| nara518856 | U.S. Navy, Naval Air Station Lakehurst; National Archives (NAID 518856) | Public domain (U.S. Navy / NARA 518856, U.S. federal government work) | https://commons.wikimedia.org/wiki/File:German_airship_%22Hindenburg%22_at_Lakehurst,_New_Jersey._-_NARA_-_518856.jpg | 2948×2327 0.0s | 位置 13.0–18.6 s（只取船头与系泊塔） |
| usgs1947 | U.S. Geological Survey, Lakehurst NJ 1:24,000 quadrangle, 1947 | Public domain (USGS, U.S. federal government work) | https://ngmdb.usgs.gov/topoview/ | × | 位置 12.3–14.8 s（地图推进）、平面图定位小窗 14.8–18.6 s、落版缩略图 |

USGS 图幅的下载地址：https://prd-tnm.s3.amazonaws.com/StagedProducts/Maps/HistoricalTopo/PDF/NJ/24000/NJ_Lakehurst_254519_1947_24000_geo.pdf（The National Map 历史地形图，图幅 ID 254519）。
NARA 518856 的国家档案馆条目：https://catalog.archives.gov/id/518856 。Commons 上的日期写作 1937-01-25，那一天兴登堡号不在美国，片中不写日期，只标“此前一次停靠”。

## 文字引用（未下载文件）

| 内容 | 出处 | 许可 | 用在 |
|---|---|---|---|
| 美国商务部《Report of Airship "Hindenburg" Accident Investigation》，Air Commerce Bulletin vol. 9 no. 2，1937-08-15（South Trimble Jr.、R. W. Schroeder、Denis Mulligan 署名） | 文字转录：https://www.airships.net/?p=2041 ；LibriVox 朗读版（同一文本）https://librivox.org/report-of-the-airship-hindenburg-accident-investigation-by-united-states-department-of-commerce | 美国联邦政府作品，公有领域 | 四封电报原文与时刻、雷暴与地面风、18:15 进场 / 18:21 放绳 / 30° / ≥700 ft、Ward 证词、起火点、32 秒、原因与“刷形放电最可能”、无破坏证据、伤亡数字 |

## 不是下载的素材

| 内容 | 来源 | 许可 |
|---|---|---|
| 字体 Noto Sans SC、Noto Serif SC、IBM Plex Mono、Source Serif 4 | Google Fonts，按片中用字取子集（tools/fonts.py） | SIL OFL 1.1 |
| 英文旁白 | Kokoro-82M（core/tts/tts.py，声音 am_michael） | Apache-2.0 |
| 配乐采样 | VS Chamber Orchestra: Community Edition、Versilian Community Sample Library（core/audio/sampler.py） | CC0 1.0 |
| 音效 | numpy 程序合成（audio/mix.py） | 自制 |

查过但没用的：Hearst News of the Day（NARA 342-USAF-18247，商业新闻片，许可不清）、British Pathé 与各种 YouTube / stock 镜像、Periscope Film、Prelinger 的 "Hindenburg Explodes"（出品方不明）、AP / INS / Wide World 通讯社照片（Commons 标 PD 但依据是“未续展”，不确定）、Herb Morrison 的 WLS 广播录音（录音版权不清）。

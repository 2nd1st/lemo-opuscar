# 素材来源

由 `footage.py md` 从 SOURCES.jsonl 生成。片中用到的每段素材都在这里。

| 名字 | 标题 / 作者 / 日期 | 许可 | 来源页 | 规格 | 用了哪几秒 |
|---|---|---|---|---|---|
| kald | File:Kaldırım scored the goal for a 3-3 draw (Beşiktaş-Fenerbahçe Derby - February 2019).webm / beIN SPORTS Türkiye / 2019-07-24 | CC BY 3.0 | https://commons.wikimedia.org/wiki/File:Kald%C4%B1r%C4%B1m_scored_the_goal_for_a_3-3_draw_(Be%C5%9Fikta%C5%9F-Fenerbah%C3%A7e_Derby_-_February_2019).webm | 1280×720 14.0s | 0.00–4.60 s 主机位全景（F001–F116）→ 片中 17.8–22.4 实时、22.4–23.0 倒放、23.0–33.2 定格/慢放分析（F001–F084）; 起脚帧 F056 → 片中 36.8–38.3 俯视战术板（沿球场线透视展平）; 10.44–13.40 s 反打回放（F262–F336）→ 片中 33.2–36.8; 4.96–8.96 s 庆祝特写（F125–F224）→ 片中 47.0–54.4（67′ 收束 + 片尾落版底图，慢放）; 原声：0–4.6 s（直播段）、0–2 s 人群（分析段循环底）、3.9–6.0 s（入网人群）、10.0–13.6 s（回放）、4.9–7.95 s（67′ 收束）；解说转写来自 2.0–4.1 s、5.0 s |
| summary | Beşiktaş 3 - 3 Fenerbahçe \| Maç Özeti \| 2018/19 / beIN SPORTS Türkiye (YouTube @beINSPORTSTürkiye, channel UCPe9vNjHF1kEExT5kHwc7aw, verified) / 2019-07-24 | CC BY 3.0 | https://www.youtube.com/watch?v=sYfsd9Hv7hc | 1280×720 187.0s | 110.52–118.36 s 第一球主机位（clip b F001–F196）：113.12–116.36 s（F066–F146）→ 片中 5.2–10.6（边播边定格，F106 定格）; 140.80–144.40 s 第二球主机位（clip c F001–F090）：F010–F090 → 片中 10.6–12.4 左格、12.4–14.6 左格定格（F046）、14.6–17.8 全屏慢放; 144.40–148.48 s 第二球反打高机位回放（clip c F091–F192）：F108–F156 → 片中 10.6–12.4 右格、12.4–14.6 右格定格（F156）; 原声：113.12–114.76 s、114.72–116.60 s（第一球解说 + 人群）、141.16–142.60 s、142.24–145.44 s（第二球）；其余 108–153 s 只在 audio/orig2.wav 里备用 |
| stadium | File:Vodafone Park, Istanbul (from outside).jpg / Olos88 / 2020-09-27 11:43:50 | CC0 | https://commons.wikimedia.org/wiki/File:Vodafone_Park,_Istanbul_(from_outside).jpg | 1920×1440 0.0s | 整张裁 16:9 → 片中 1.6–5.2 赛况卡底图 |
| hak | File:Hasan Ali Kaldırım 2013 1.jpg / Thomas Rodenbücher / 2013-05-28 20:57:40 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Hasan_Ali_Kald%C4%B1r%C4%B1m_2013_1.jpg | 500×750 0.0s | 片中 42.6–47.0 复盘笔记拍立得 |

## 许可核实（2026-10-21）

两段比赛画面都来自**同一个版权方的同一次 CC BY 发布**：

1. **上传者就是转播方本身。** YouTube 视频 `sYfsd9Hv7hc`《Beşiktaş 3 - 3 Fenerbahçe | Maç Özeti | 2018/19》，2019-07-24 发布，频道 `@beINSPORTSTürkiye`（channel id `UCPe9vNjHF1kEExT5kHwc7aw`，YouTube 认证徽章，约 289 万订阅）。这是 beIN SPORTS Türkiye 的官方频道。这场比赛由 beIN SPORTS 转播（画面里有 beIN 台标、`www.beinsports.com` 网址，解说是 beIN 的土耳其语解说），集锦是它自己的节目。
2. **许可是上传者自己选的。** 视频页许可栏写 *Creative Commons Attribution license (reuse allowed)*（YouTube 的 CC BY 即 CC BY 3.0）。核实方式：页面 HTML 与 `yt-dlp --write-info-json` 两处都读到 `license`、`ownerChannelName`、认证徽章；要点存在 `tools/license-evidence.json`。
3. **Commons 片段 `kald` 是它的剪段。** Commons 文件页 Source 栏指向同一视频 `sYfsd9Hv7hc#t=2m35s`，作者 beIN SPORTS Türkiye，许可模板 `{{YouTube CC-BY}}` → CC BY 3.0。注意：这个文件页**没有** LicenseReview 审核章（定稿片 NOTES 里"经 Commons 审核"的说法不准确），所以这次直接回 YouTube 原页核了一遍，结论同上。
4. **不是镜像、不是二次上传、不是修复/上色版。** 前两球直接从官方原视频取 720p 原生档（format 232 + 140），没有用 YouTube 自动生成的 "AI-upscaled" 1080p 档。

**要用户知道的风险**（都不影响 CC BY 本身）：
- 画面里有 beIN 台标与网址（全程压在节目角标和比分条下面）、场边广告牌、球衣赞助商（真实画面的一部分，保留）。
- 赛事本身的权利链（联赛 / 俱乐部 → 转播商）我们看不到；我们依据的是版权方在 YouTube 上自己声明的 CC BY。YouTube 允许上传者以后改许可，但 CC 许可对已经取得的副本不可撤销；核实日期与证据已记录。
- 出镜的都是比赛当事球员和裁判（新闻事件当事人），没有对普通观众做慢放或特写。

## 其他

| 内容 | 来源 / 许可 |
|---|---|
| 赛况事实（比分、进球时间、日期、球场、进球方式） | 见 `FACTS.md`：beIN SPORTS 官方集锦说明、beinsports.com.tr 赛后文章、Habertürk 赛报、Hürriyet Daily News（事实，重新排版） |
| 解说转写 | 本片作者据 `kald` 原声听写（Whisper medium 辅助），听不清的词用省略号 |
| 镜头数据 | 本片作者按 25 fps 数帧（接球 F035、起脚 F056、入网 ≈F078）；起脚点距离用各自画面里的禁区线算透视矩阵换算（`tools/homography.py`，残差 ≤ 6 px） |
| 改动（CC BY 要求标明） | `kald`、`summary`：剪辑、倒放、慢放与定格、分屏、透视展平、放大 1.5×、去块与调色、叠加战术图形与节目包装（角标、比分条盖住原台标与网址）；`hak`：裁切后放进拍立得框 |
| 英文旁白 | Kokoro TTS（`core/tts/tts.py`，voice `bm_george`），ASR 逐句核对通过 |
| 配乐采样 | Drums: "MuldjordKit" by Lars Muldjord (drumgizmo.org), FreePats version, licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)；其余 CC0：FreePats、VS Chamber Orchestra: Community Edition、Versilian Community Sample Library (Versilian Studios) |
| 音效 | `core/audio/sfx.py` 与 `tools/mix.py` 程序合成 |
| 字体 | Google Fonts，OFL：Noto Sans SC、Barlow Condensed、IBM Plex Mono |

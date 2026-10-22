# 事实与来源 ·《本周 AI 三件事 The Week in AI》（Lemo AI News 第 42 周）

核实日期：2026-10-21（事实核查分两轮：10-19 定稿版一轮；本版重新逐页核对，并补了一手来源）。
最后一次渲染前，已拿 `vo/lines.json`（配音）、`main.js` 里的 `STRAP` / `ROWS` / `CUES` / 各镜头画面字逐条对过下表。
等级：**一手**＝事件主体自己的页面或交易所数据；**可靠媒体**＝署名新闻报道；**摘要**＝只读到搜索摘要（页面 403/超时），只作佐证，不单独支撑上屏数字。

## ① Google 向全部开发者开放 Gemini 4 Argon

| # | 片中说法（上屏 / 配音） | 来源 | 原文引用 | 等级 |
|---|---|---|---|---|
| G1 | 10 月 13 日正式开放（GA），模型 ID `gemini-4-argon`；"谷歌向全部开发者开放 Gemini 4 Argon"；配音 "Google has opened Gemini Four Argon to every developer" | Gemini API changelog https://ai.google.dev/gemini-api/docs/changelog | "October 13, 2026 — Gemini 4 Argon (gemini-4-argon) generally available (GA): Released Gemini 4 Argon (gemini-4-argon), our most capable model built for complex coding, agentic, math, and science tasks." | 一手 |
| G2 | 入门价每百万 token 输入 $2、输出 $10；配音 "at two dollars per million input tokens" | blog.google《Gemini 4 Argon》（2026-09-30，Koray Kavukcuoglu）https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/ | "Argon will launch at an introductory price of $2 per million input tokens and $10 per million output tokens, with cached input tokens priced at 95% off input token price." | 一手 |
| G3 | 之后 $4 / $20；"价格翻倍 ×2" | 同上，脚注 1 | "After the introductory period expires, the price of $4 per 1M input tokens and $20 per 1M output tokens will apply." | 一手；×2 由 2→4、10→20 算出 |
| G4 | 入门价"至 30 NOV"，之后"FROM 1 DEC" | Gemini API · latest model https://ai.google.dev/gemini-api/docs/latest-model | "Gemini 4 Argon is available at introductory pricing through November 30, 2026: Input tokens: $2.00 per 1M tokens ($4.00 starting December 1, 2026)" | 一手 |
| — | 不报 | — | 9-30 那篇博客当时只发给 Fairwind 计划里的网络防御方（"rolling out to a set of trusted cyber defenders through our Fairwind Program"），所以片中不说 9-30"上线"；跑分是 Google 自报，不用 | — |

## ② 韩国 Kospi 跌入熊市，芯片股领跌

| # | 片中说法 | 来源 | 原文引用 | 等级 |
|---|---|---|---|---|
| K1 | 10 月 15 日单日 −7.57%，收 5,554.22；配音 "fell more than seven and a half percent in a day" | Korea Herald（Im Eun-byel，2026-10-15）https://www.koreaherald.com/article/10904070 | "The benchmark Kospi tumbled 7.57 percent to close at 5,554.22, extending losses throughout the session after opening 5.59 percent lower." | 可靠媒体；与 K5 数据一致（5,554.22 ÷ 6,008.81 − 1 = −7.565 %） |
| K2 | 连跌 7 个交易日（走势图 1–7 天、"连跌 7 日"徽章、读数面板） | Korea Times（2026-10-16）https://www.koreatimes.co.kr/economy/20261016/samsung-sk-hynix-sell-off-excessive-as-memory-outlook-stays-strong-analysts | "as KOSPI rebounded 2.05 percent, snapping a seven-session losing streak"；"over seven consecutive trading sessions starting Oct. 6" | 可靠媒体；K5 数据：10-06、07、08、12、13、14、15 七天收跌（10-09 休市） |
| K3 | "进入熊市 BEAR MARKET"；配音 "slid into a bear market" | Bloomberg（2026-10-15）"Kospi Drops 8% as Samsung, SK Hynix Shares Plunge on AI and Rate Fears" https://www.bloomberg.com/news/articles/2026-10-15/chip-stocks-deepen-losses-as-concerns-mount-over-rates-ai-debt | 摘要："dragged South Korea's equity benchmark down nearly 8% to push it into a bear market"；"fallen about 21% from its September high" | 摘要（正文 403）；口径由 K5 数据核实：距 9 月 23 日收盘高点 7,080.92 跌 21.56 % |
| K4 | 熊市线 = 距 9 月高点 −20 %；读数面板"较 9 月高点 −21.56%"；高点标注 "PEAK 7,080.92" | 由 K5 计算 | 5,554.22 ÷ 7,080.92 − 1 = −21.56 %；−20 % 线 = 5,664.74 | 一手数据 + 我们的算式。**口径提醒**：Kospi 6 月 22 日的历史收盘最高是 9,114.55，按那个高点它 7 月就已经跌超 20 %。"跌入熊市"是 Bloomberg 按 9 月高点的说法，片中坐标轴写明"距 9 月高点 FROM SEPTEMBER HIGH" |
| K5 | 走势图：9 月 15 日至 10 月 15 日每个交易日的真实收盘 | 韩国交易所指数数据，经 Naver 金融接口 https://api.stock.naver.com/chart/domestic/index/KOSPI?periodType=dayCandle（原始返回存 `data/kospi_raw_naver_api.json`，整理成 `data/kospi_daily.csv`） | 片中用到的 19 个收盘：6,627.26（9-15）· 6,717.97 · 6,715.41 · 6,894.23 · 7,007.72 · 7,017.91 · **7,080.92（9-23 高点）** · 6,889.74 · 6,870.81 · 6,838.04 · 6,971.35 · 7,003.74（10-02）· 6,941.39 · 6,803.90 · 6,625.93 · 6,384.24 · 6,035.35 · 6,008.81 · **5,554.22（10-15）** | 一手数据。10-13 收 6,035.35（−5.46 %）、10-16 收 5,668.05（+2.05 %）与 Korea Herald、Korea Times 一致 |
| K6 | 三星电子 −9.48 %，SK 海力士 −11.06 %；"都超过 9%"；配音 "Samsung and S.K. Hynix each lost more than nine percent" | Korea Herald（同 K1） | "SK hynix sank 11.06 percent to 1.26 million won, while Samsung Electronics plunged 9.48 percent to 210,000 won." | 可靠媒体。Naver 的个股数据和这两个数对不上（−10.56 % / −12.76 %），所以个股只用报道的数，不用 Naver |
| K7 | 条带"利率与 AI 担忧，芯片股重挫" | Bloomberg 标题（同 K3） | "… Shares Plunge on AI and Rate Fears" | 标题（已核） |
| — | 不报 | — | "全周 −14.46 %"（数据算得出：10-08 收 6,625.93 → 10-16 收 5,668.05）在定稿版里配了"2008 年以来最差一周"，但"2008 年以来最差一周"的一手说法只针对三星、SK 海力士两只个股（Korea Herald https://www.koreaherald.com/article/10906189 ），说指数的只有 Benzinga（403 未读到）。本版删掉这一行，换成能由数据核实的"较 9 月高点 −21.56%" | — |

## ③ 欧盟 AI 办公室向 OpenAI、Anthropic 发出问询

| # | 片中说法 | 来源 | 原文引用 | 等级 |
|---|---|---|---|---|
| E1 | "欧盟 AI 办公室向 OpenAI、Anthropic 发出问询"；两份"信息调取 REQUEST FOR INFORMATION"文件分别致 OpenAI、Anthropic；配音 "The EU's AI Office has sent questions to OpenAI and Anthropic" | Euronews（Luca Bertuzzi，2026-10-14）https://www.euronews.com/2026/10/14/eus-ai-rules-face-first-enforcement-test-over-lab-incidents | "The Commission's AI Office is investigating OpenAI and Anthropic after AI agents autonomously hacked into other organisations, the first test of the limits of the EU's AI rules."；"The AI Office sent its requests after judging the documents the two companies had voluntarily disclosed insufficient." | 可靠媒体。委员会自己的讲话没有点名这两家，所以画面和配音都标"据 Euronews 报道 / Euronews reports" |
| E2 | 文件"事由"：OpenAI——"智能体逃出测试环境，攻入 Hugging Face / AGENT ESCAPED ITS TEST ENVIRONMENT"；Anthropic——"模型未经授权，进入三家外部机构 / UNAUTHORISED ACCESS TO 3 OUTSIDE ORGS"；"今年夏天 SUMMER 2026"；配音 "after two incidents with AI agents this summer, Euronews reports" | Euronews（同 E1） | "an OpenAI agent escaped its testing environment to hack rival Hugging Face, and one in which a recent Anthropic model gained "unauthorised access" to three outside organisations. Both incidents happened over the summer." | 可靠媒体 |
| E3 | 文件落款 14 OCT 2026；串联单 WED 14 OCT | Euronews 发稿日期；委员会讲话日期（E4） | — | — |
| E4 | 引语卡："Our AI Office has started enforcing these rules …"；"欧盟 AI 办公室已经开始执行这些规则"；"已开始执法 ENFORCING"章；配音 "In Dublin, the Commission's tech chief said enforcement has started." | 欧盟委员会 Press Corner，"Speech by Executive Vice-President Virkkunen at the International AI Summit in Dublin"（2026-10-14）https://ec.europa.eu/commission/presscorner/detail/en/speech_26_2150 | "Our AI Office has started enforcing these rules, and sent Requests for Information addressing issues such as security, external evaluation and monitoring how models are used." | **一手**。引语卡只截前半句，后半句用省略号表示；"tech chief" 指她的职务（见 E5） |
| E5 | 人名条"Henna Virkkunen · 欧盟委员会执行副主席 / EXECUTIVE VICE-PRESIDENT, EUROPEAN COMMISSION · IN DUBLIN" | 同 E4 | 页面称其为 "Executive Vice-President for Tech Sovereignty, Security and Democracy" | 一手 |
| E6 | 地图上的"欧盟 AI 办公室 · 隶属欧盟委员会"，城市点为布鲁塞尔 | AI Office 页面 https://digital-strategy.ec.europa.eu/en/policies/ai-office ；委员会联系页 https://commission.europa.eu/about/contact_en | "The European AI Office was established within the European Commission"；委员会邮寄地址 "1049 Brussels" | 一手 |
| E7 | 欧盟 27 国、国界 | Natural Earth 1:50m（world-atlas 2.0.2） | — | 公有领域地图数据 |
| — | **定稿版里删掉的说法** | — | ①"首次对前沿实验室动用《AI 法案》"：一手来源显示首批信息调取在 8 月执法权生效后就已发给多家前沿模型提供方（委员会 10-09 讲话 https://ec.europa.eu/commission/presscorner/detail/en/speech_26_2148 ："We have sent our first Requests for Information to providers of the most advanced models around the world, on three critical topics: security, external evaluation and post-market monitoring."），所以"首次"不成立；Euronews 的 "first test" 指的是对法案适用范围的首次检验。②"没有罚款，也没有立案 / No fines. Yet."：一手讲话和 Euronews 都没提罚款或立案，删掉。③"安全 / 外部评测 / 上线后监测"三项打勾：这是 8 月那批普遍信息调取的议题，不能写在致 OpenAI、Anthropic 的文件上，换成 E2 的事件事由。④"AI 办公室在都柏林"：都柏林只是讲话地点 | — |

## 画面里的非新闻元素

| 元素 | 说明 |
|---|---|
| 机房、晶圆背景 | Codex image_gen 生成的示意空镜，只做背景；在画面上时左上角一直挂 "ILLUSTRATION / 示意 · AI 生成画面"；不代表任何真实地点、公司或事件 |
| 演播室、主播台、视频墙 | 代码绘制的虚拟布景；没有主播，不冒充任何电视台 |
| LEMO 台标、LEMO AI NEWS | LemoLab 自己的频道品牌 |
| 公司名 | Google、OpenAI、Anthropic、Samsung、SK hynix、Hugging Face 只用字排，不用标志 |

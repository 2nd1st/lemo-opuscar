# 事实与来源 ·《蜜蜂账本 The Bee Ledger》

片中每个上屏数字、每句配音里的事实，都来自同一份官方报告：

**USDA NASS《Honey Bee Colonies》**，ISSN 2470-993X，2026 年 8 月 3 日发布（美国联邦政府作品，公有领域）。
- PDF：https://release.nass.usda.gov/reports/hcny0726.pdf
- 发布页：https://esmis.nal.usda.gov/publication/honey-bee-colonies
- 口径：5 箱以上（five or more colonies）的养蜂场，美国全国。报告是**逐季度**调查。

核对日期：2026-10-20。最后一次渲染前，已拿 `audio/lines.json` 和 `timeline.json` 逐条对过下表。

## 上屏 / 配音对照

| # | 上屏（中文） | 配音（英文） | 数字 | 出处 |
|---|---|---|---|---|
| 1 | 一年没了 130 万箱蜜蜂 | "In one year, American beekeepers lost one point three million honey bee colonies." | 2025 四个季度损失相加 1,305,540 箱 | F1（派生，算式见下） |
| 2 | ≈49% · 接近年初总数的一半 | "Nearly half of what they started with." | 1,305,540 ÷ 2,639,300 = 49.5 % | F1、F2（派生） |
| 3 | 那美国的蜜蜂快没了？ | "So, are America's bees running out?" | （提问，无数字） | — |
| 4 | 原文高亮"January 1 Honey Bee colonies Up 6 Percent"；+6%；1 月 1 日的总数涨了 6% | "No. By January, colonies were up six percent." | 2026-01-01 存栏 2.81 百万箱，比 2025-01-01 +6 % | F3 |
| 5 | 蜂群存栏折线：264 / 288 / 312 / 295 / 281 / 284（万箱）；+6%；总数不降反升 | （无配音） | 各季度首日存栏 | F2、F3 |
| 6 | 死掉 1,305,540 箱 / 补上 1,453,600 箱 / 多补 148,060 箱；2025 · 四个季度相加；因为养蜂人一直在补：145 万箱 | "Because beekeepers kept rebuilding: almost one and a half million new colonies." | 新增相加 1,453,600；差 148,060 | F1（派生） |
| 7 | 新建 / 整箱买 / 换蜂王；补法有三种 | "They raise new ones, buy them whole, or give old ones a new queen." | 报告对"新增""换王"的定义 | F6 |
| 8 | 原文高亮"Varroa Mites Top Colony Stressor…""Varroa mites were the number one stressor … during all quarters surveyed in 2025."；2025 年每个季度的头号威胁：瓦螨 | "The top stressor, every quarter of 2025: varroa mites." | 2025 四季瓦螨占比 28.3 / 26.3 / 22.2 / 25.4 %，每季最高 | F4 |
| 9 | 谁在伤害蜂群：瓦螨 21.8%、农药 6.4%、其他虫害 5.6%、疾病 4.8%、原因不明 4.6%、其他 3.5%；2026 年初，超过五分之一的蜂群受害 | "In early 2026, they affected more than one in five colonies." | 2026 年 1–3 月全国压力源占比 | F5 |
| 10 | 每季度损失率 12 / 11 / 11 / 12 / 16 / 11 %；16% · 六个季度最高；这一季最糟：三个月没了 16% | "That quarter was the worst in six: sixteen percent gone in three months." | 2026 年 1–3 月损失 454,890 箱，16 % | F1、F3 |
| 11 | 各州损失率地图（2026 Q1）；加州 −220,000 · 损失率 18%；光加州就没了 22 万箱 | "California alone lost two hundred and twenty thousand." | 加州 2026 年 1–3 月损失 220,000 箱，18 % | F7 |
| 12 | 到 6 月，又补了 108 万箱 | "And still, by June, they had added over a million more." | 2026 年 1–3 月 464,320 + 4–6 月 619,850 = 1,084,170 | F1（派生） |
| 13 | 蜜蜂没有消失 / 是养蜂人在硬撑 | "The bees aren't vanishing. Beekeepers are holding the line." | 结论（由 4、6、12 推出） | — |
| 落版 | 2025 年损失和新增为四个季度相加 | — | 口径说明 | — |

## F1 各季度损失与新增（全国行，第 3–8 页表格）

| 季度 | 季初存栏 | 损失 | 损失率 | 新增 | 换王（renovated） | 页 |
|---|---|---|---|---|---|---|
| 2025 1–3 月 | 2,639,300 | 328,500 | 12 | 539,200 | 158,710 | 3 |
| 2025 4–6 月 | 2,876,810 | 302,100 | 11 | 561,090 | 514,790 | 4 |
| 2025 7–9 月 | 3,121,610 | 327,840 | 11 | 182,750 | 356,810 | 5 |
| 2025 10–12 月 | 2,954,950 | 347,100 | 12 | 170,560 | 121,970 | 6 |
| 2026 1–3 月 | 2,805,370 | 454,890 | 16 | 464,320 | 215,440 | 7 |
| 2026 4–6 月 | 2,841,280 | 321,910 | 11 | 619,850 | 507,890 | 8 |

原文（第 3 页表格全国行）：
> "United States ........... 2,639,300 (X) 328,500 12 539,200 158,710 6"

派生数（我们相加，片中标"四个季度相加"）：
- 2025 损失：328,500 + 302,100 + 327,840 + 347,100 = **1,305,540**（≈130 万）
- 2025 新增：539,200 + 561,090 + 182,750 + 170,560 = **1,453,600**（≈145 万；配音"almost one and a half million"）
- 差：1,453,600 − 1,305,540 = **148,060**
- 2026 上半年新增：464,320 + 619,850 = **1,084,170**（≈108 万；配音"over a million"）
- 口径提醒：报告逐季度调查，四个季度的损失相加**不是"全年净损失"**（季度之间一直在补箱），所以片中只写"一年没了""四个季度相加"，不写"净损失"。

## F2 年初存栏与"接近一半"

第 1 页原文：
> "During 2025, honey bee colonies on January 1, April 1, July 1, and October 1 were 2.64 million, 2.88 million, 3.12 million, and 2.95 million colonies, respectively."

1,305,540 ÷ 2,639,300 = 0.4947 → 片中"≈49%""接近年初总数的一半"。

## F3 +6 %，最新两季

第 1 页原文：
> "Honey bee colonies for operations with five or more colonies in the United States on January 1, 2026 totaled 2.81 million colonies, up 6 percent from January 1, 2025. The number of colonies in the United States on April 1, 2026, was 2.84 million colonies."
> "Honey bee colonies lost for operations with five or more colonies from January through March 2026, was 454,890 colonies, or 16 percent. The number of colonies lost during the quarter of April through June 2026, was 321,910 colonies, or 11 percent."

核算：2,805,370 ÷ 2,639,300 = 1.063。"六个季度最高"：六个季度损失率 12、11、11、12、16、11，16 最高。

## F4 瓦螨是 2025 每季头号压力源

第 1 页原文（片中荧光笔扫的就是这两行）：
> "Varroa Mites Top Colony Stressor for Operations with Five or More colonies"
> "Varroa mites were the number one stressor for operations with five or more colonies during all quarters surveyed in 2025."

第 9–12 页全国行（瓦螨 / 其他虫害 / 疾病 / 农药 / 其他 / 不明，%）：1–3 月 28.3 / 7.1 / 4.4 / 6.2 / 5.1 / 5.9；4–6 月 26.3 / 9.2 / 4.3 / 6.5 / 5.0 / 2.0；7–9 月 22.2 / 6.6 / 3.5 / 4.3 / 2.7 / 2.9；10–12 月 25.4 / 5.6 / 5.2 / 4.5 / 4.6 / 5.7。每季瓦螨最高。

"stressor"（压力源）是报告的用词，意思是"蜂群在季度内受其影响的比例"，不等于死因。片中配音说"top stressor"，中文写"头号威胁"，不写"头号杀手"。

## F5 2026 年 1–3 月压力源（第 13 页全国行）

> "United States .................. 21.8 5.6 4.8 6.4 3.5 4.6"

列顺序：Varroa mites / Other pests and parasites / Diseases / Pesticides / Other / Unknown。片中排行按数值从大到小：瓦螨 21.8、农药 6.4、其他虫害 5.6、疾病 4.8、原因不明 4.6、其他 3.5。21.8 % > 1/5 → "超过五分之一""more than one in five"。
表头说明：
> "[Percent of colonies affected by stressors anytime during the quarter. A colony may be affected by multiple stressors during the quarter]"

报告内部不一致（片中未用）：第 1 页正文写 2026 年 4–6 月瓦螨影响 "26.3 percent"，而第 14 页表格全国行是 22.2。片中只用 1–3 月（21.8，正文与表格一致）。

## F6 新增与换王的定义（第 16 页）

> "Added colonies: A new or replacement, surviving colony that was either created or purchased whole by an operation."
> "Renovated colony: An existing colony that was requeened or received a nuc or package."
> "Package: A shipping container with several pounds of honey bees that may or may not include a queen; used for expansion of the apiary operation or renovating an existing colony."

片中"新建（raise new ones）"= created；"整箱买（buy them whole）"= purchased whole（画面用蜂包 package 照片表示买来的蜜蜂）；"换蜂王（give old ones a new queen）"= requeened。注意：报告把换王算作 renovated，不算进"新增"；片中三联讲的是"补法"，配音没有说三者都算进 145 万。

## F7 各州 2026 年 1–3 月（第 7 页）

州级损失率 = 该州损失 ÷ 该州"最大存栏"（季初存栏 + 季内迁入），全国损失率 = 全国损失 ÷ 季初存栏（表注 2）。地图只给表中单列的 20 个州上色，其余州（"Other States"合并统计）灰色"未单列"。

| 州 | 损失率 % | 州 | 损失率 % |
|---|---|---|---|
| California | 18 | New York | 17 |
| Florida | 15 | North Carolina | 18 |
| Georgia | 17 | North Dakota | 2 |
| Idaho | 15 | Ohio | 7 |
| Iowa | 4 | Oregon | 7 |
| Louisiana | 8 | Pennsylvania | 23 |
| Michigan | 5 | South Dakota | 1 |
| Minnesota | 2 | Texas | 11 |
| Mississippi | 7 | Washington | 2 |
| Montana | (Z) <0.5 | Wisconsin | 8 |

加州原文行：
> "California ................. 885,000 1,250,000 220,000 18 179,000 73,000 6"

## 画面说明（不是事实陈述，但要诚实）

- 杏仁园照片拍于 2014 年 2 月（USDA，加州 McFarland），角标写明"加州杏仁园 2014"；它代表加州的蜂场环境，不是 2026 年损失的现场。
- 屋顶蜂场视频拍于 2013 年（USDA 华盛顿总部楼顶），下三分之一条写明地点和年份。
- 成排蜂箱视频拍于荷兰（Altena TV），在片中只作"一箱 = 一个蜂群"的画面，不标地点，不作为美国现场。
- 频道"简闻"是虚构的。片子是非官方作品，与 USDA 无关。

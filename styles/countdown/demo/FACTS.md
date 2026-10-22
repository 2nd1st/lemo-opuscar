# 事实与来源 · 《自己倒数》Counting Itself Down

所有上屏文字和旁白里的说法，逐条列出处和原文。时间点一律以 NASA 官方为准。核对日期 2026-10-20，最后一次渲染前已按本表逐句对过台词（`audio/lines.json`、`index.html` 的 `CUES` / `CHECK` / `FLIGHT` / 数据格 / 落版）。

原声（发射解说、回路通话）不是我们的说法，是 NASA 直播音轨本身；转写的依据见 §T。

## 上屏 / 旁白对照

| 上屏或旁白 | 说法 | 出处 |
|---|---|---|
| 阿尔忒弥斯二号 · 2026 年 4 月 1 日 · 39B 发射台 / ARTEMIS II · APRIL 1, 2026 · LC-39B, KENNEDY SPACE CENTER | 发射日期、发射台 | F1 |
| 乘组姓名牌：怀斯曼 CDR、格洛弗 PILOT、科赫 MS、汉森 MS · CSA | 乘组与分工 | F1 |
| 检查单 T−33 移交自动程序 GO FOR ALS | 计划节点 | F2 |
| 检查单 T−30 芯级计算机接管 CORE STAGE → ALS | 计划节点 | F2 |
| 检查单 T−12 氢气燃烧点火器 H2 BURN-OFF IGNITERS | 计划节点 | F2 |
| 检查单 T−10 发动机启动指令 ENGINE START CMD | 计划节点 | F2 |
| 检查单 T−6.36 RS-25 启动；事件旗 "RS-25 ×4 启动 ENGINE START · T−6.36" | 计划节点；芯级 4 台 RS-25 | F2、F4 |
| 检查单 T−0 助推器点火 · 升空 | 计划节点 | F2 |
| "听到 −32.1 / −6.0 / +0.2"（红牌） | 原声里实际喊出的时刻（片中实测，见 §T） | 测量 |
| 数据格：SLS BLOCK 1 · 880 万磅 8.8 M LBF；土星五号；+15% SLS 多 15% | 起飞推力与对比 | F4 |
| 文件格：10 天试飞 10-DAY TEST FLIGHT；先绕地球 2 圈 2 EARTH ORBITS FIRST | 任务数字 | F5 |
| 旁白 N1 "About ten days: around the Moon, and back." | 计划约 10 天绕月往返 | F5 |
| 旁白 N2 "Next on the clock: booster separation, at two minutes nine."；节点格 "预计 T+2:09 EXPECTED" | 助推器分离预计时刻 | F3 |
| 节点格 升空 / 滚转、俯仰 / 休斯敦接管（勾选时刻） | 原声里喊出的时刻（片中实测） | 测量、F3 |
| 控制条 地面 GLS → 火箭 ALS → 休斯敦 HOUSTON | GLS 交给自动发射程序；升空后休斯敦接管 | F2、F3、原声 |
| 落版：素材 NASA · 公有领域 · 非官方作品 | 素材许可 | CREDITS |

## F1 发射日期、时间、发射台、乘组
- NASA 图片说明 "Artemis II Launch"：https://www.nasa.gov/image-detail/artemis-ii-launch-5/
  > "Wednesday, April 1, 2026"
  > "The quartet launched at 6:35 p.m. EDT"
  > "from Launch Complex 39B at NASA's Kennedy Space Center in Florida"
  > "Reid Wiseman, commander; Victor Glover, pilot; Christina Koch, mission specialist;"
  > "and CSA (Canadian Space Agency) astronaut Jeremy Hansen, mission specialist"
- 旁证：跟踪望远镜画面自带的 UTC 时间 22:35:27（片中 51.5 s，即 T+19）＝美东 18:35，与 F1 一致。

## F2 倒计时节点（计划时刻）
- NASA "NASA Releases Artemis II Moon Mission Launch Countdown"：https://www.nasa.gov/general/nasa-releases-artemis-ii-moon-mission-launch-countdown/
  > "T-33S – GLS sends "go for automated launch sequencer" command"
  > "T-30S – Core stage flight computer to automated launching sequencer"
  > "T-12S – Hydrogen burn off igniters initiated"
  > "T-10S – GLS sends the command for core stage engine start"
  > "T-6.36S– RS-25 engines startup"
  > "T-0: Booster ignition, umbilical separation, and liftoff"

## F3 升空后的原声（NASA 官方转写）
- NASA Scientific Visualization Studio "Artemis II launch live"：https://svs.gsfc.nasa.gov/31385/ ，字幕文件 `Artemis 2 launch long.srt`（https://svs.gsfc.nasa.gov/vis/a030000/a031300/a031385/Artemis%202%20launch%20long.srt）
  > "Sound suppression. / Water is flowing." "And here we go." "RS 25 Engines lit." "Booster. / Ignition and lift off."
  > "The crew of Artemis two, now bound for the moon." "Humanity's next great voyage begins."
  > "Good role. / Pitch." "Roger Role, Pitch"（即 roll / pitch）
  > "Houston. / Now controlling the flight of integrity on the Artemis two mission around the Moon."
  > "Standing by for main engine throttle down to 85% ahead of solid rocket booster separation expected at the two minute nine second mark."
  > "Confirm separation."
- Integrity 是本次猎户座飞船的名字，出处即上面这句官方转写。
- 同一直播在 T−47 s 时的解说（片中未用，用来支撑"控制条"）："The rocket will count itself down, but honor any holds that could come from the ground." "Now, shortly after liftoff, Houston will take control of the rocket."（本片直播片段 0.0–9.7 s，Whisper 转写）

## F4 推力与发动机
- NASA RS-25 发动机简介（fact sheet）：https://www.nasa.gov/sites/default/files/atoms/files/sls_rs25_engine_fs_508.pdf
  > "During liftoff, the Block 1 configuration of SLS will produce 8.8 million pounds of thrust — 15 percent more than the Saturn V rockets that launched astronauts on journeys to the Moon."
  > "It will use four RS-25 engines for the core stage, along with two solid rocket boosters."
- 片中数据条按 1.15 : 1 画；没有单独写土星五号的数值。
- "the most powerful rocket NASA has ever launched" 是直播解说原话，不是我们的说法。

## F5 任务数字（发射前的计划）
- NASA Artemis II 单页简介 AIIFS-08.27.25（Wikimedia Commons 存档，PD-USGov-NASA）：https://commons.wikimedia.org/wiki/File:Artemis_II_One_pager_082725_508_(1974822455374).pdf
  > "10 DAY TEST FLIGHT" "2 EARTH ORBITS"
  > "Many of these will be completed as Orion flies two elliptical orbits around Earth before venturing around the Moon."
  > "Orion will fire its thrusters and send the crew on a trip of about 10 days around the far side of the Moon and back to Earth."
- 说明：这是发射当时的计划。NASA 任务页（https://www.nasa.gov/mission/artemis-ii/）事后给出的实际任务时长是 "9 Days, 1 Hour, 32 Minutes"。片子是发射那一刻的实时视角，所以旁白说"about ten days"（计划），不说实际时长。

## §T 转写与时间的测量
- T0（片中 32.5 s）：直播画面倒计时角标 T−0:00:32→31 的跳变 + 解说 "booster" 的逐词时间（片中 32.70），两者一致。
- "GLS, go for ALS."（片中 0.40）：Whisper base.en / small 听成 "go for your left"，medium 漏掉这句；按 F2 的 T−33 节点（GLS 发出 "go for automated launch sequencer"）和紧接着的解说 "Great call-out. The rocket is on its own." 判定为 "go for ALS"。原声实际喊出的时刻是 T−32.1（节点表写的是计划 T−33），检查单上分开标出。
- "RS-25 engines lit"：Whisper 有时听成 "lift"；NASA 官方转写（F3）是 "lit"。
- "Good roll, pitch." / "Roger, roll, pitch." 片中 46.40 / 49.78（T+13.9 / +17.3）；"Houston, now controlling…" 片中 53.78（T+21.3）。
- 箭载摄像机（CAM 3）的对时：片内烧录的计时器从 "001-04:17:27.3" 跳到 "002-00:00:01.0"；"002" 段在源 34.8 s 归零，取为 T0。同一文件附带的广播音轨与画面差约 1 s，所以不用它的声音对时。
- 控制室（CAM 2）没有可对的时钟，标"同一时段 SAME WINDOW · 未逐帧同步"。

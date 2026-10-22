// LEMO AI NEWS · 本周 AI 三件事（2026-10-12 至 10-18）—— 电视新闻包装（Broadcast News Package）库 demo
// Canvas 2D，确定性 render(t)。切点落在 120 BPM、第 0 拍 = 1.5 s 的拍格上（镜头表见 DEMO.md）。
// 无烧字幕、无滚动条：条带从第一条新闻到回顾一直在底部；字幕只出外挂 .srt（CUES → tools/subs.py）。
const W = 1920, H = 1080, DUR = 54.0;
const cv = document.getElementById('out'); let ctx = cv.getContext('2d');
const OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H; const octx = OFF.getContext('2d');

// —— 色板（品牌色取自 lemomo-ai/assets/header.svg）——
const C = {
  ink: '#121417', ink2: '#1B1E23', ink3: '#22262C', line: '#454B55',
  lemon: '#F2CF1D', lemonL: '#F8DE4A', lemonD: '#D8B30C', gold: '#D4B064',
  paper: '#F4F1E8', orange: '#FE6B3D', white: '#FFFFFF', grey: '#C9CCD2', grey2: '#7D838D',
};
const F = {
  sc9: s => `900 ${s}px SansSC`, sc7: s => `700 ${s}px SansSC`,
  b8: s => `800 ${s}px Barlow`, b6: s => `600 ${s}px Barlow`, b6i: s => `italic 600 ${s}px Barlow`, mono: s => `500 ${s}px Plex`,
};

// —— 工具 ——
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = x => 1 - Math.pow(1 - x, 3);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const back = (x, s = 1.70158) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
function hash(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function mixc(a, b, k) { const pa = a.match(/\w\w/g).map(h => parseInt(h, 16)), pb = b.match(/\w\w/g).map(h => parseInt(h, 16)); return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], k))).join(',')})`; }

const IM = {};
let EU = null;
function loadImg(src) { return new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(src); i.src = src; }); }

// —— 文本登记（TEXTS 用于 readcheck） ——
let TX = [];
function text(s, x, y, font, color, align = 'left', ls = 0, id = null) {
  ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = ls + 'px'; ctx.fillText(s, x, y);
  const w = ctx.measureText(s).width; ctx.letterSpacing = '0px';
  if (id) { const m = ctx.getTransform(); const x0 = align === 'left' ? x : align === 'right' ? x - w : x - w / 2; const fs = parseInt(font.match(/(\d+)px/)[1]);
    const p0 = m.transformPoint({ x: x0, y: y - fs }), p1 = m.transformPoint({ x: x0 + w, y: y + 8 });
    TX.push({ id, text: s, x0: Math.min(p0.x, p1.x), y0: Math.min(p0.y, p1.y), x1: Math.max(p0.x, p1.x), y1: Math.max(p0.y, p1.y) }); }
  return w;
}
function tw(s, font, ls = 0) { ctx.font = font; ctx.letterSpacing = ls + 'px'; const w = ctx.measureText(s).width; ctx.letterSpacing = '0px'; return w; }

// 图片铺满矩形：源坐标 (fx,fy) 落在矩形中心
function photo(img, fx, fy, s, rx = 0, ry = 0, rw = W, rh = H, filter = null) {
  s = Math.max(s, rw / img.width, rh / img.height);
  let ox = rx + rw / 2 - fx * s, oy = ry + rh / 2 - fy * s;
  ox = Math.min(rx, Math.max(rx + rw - img.width * s, ox)); oy = Math.min(ry, Math.max(ry + rh - img.height * s, oy));
  ctx.save(); ctx.beginPath(); ctx.rect(rx, ry, rw, rh); ctx.clip();
  if (filter) ctx.filter = filter;
  ctx.drawImage(img, ox, oy, img.width * s, img.height * s);
  ctx.restore();
  return { ox, oy, s };
}
function vignette(a = .5) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .95);
  g.addColorStop(0, 'rgba(8,9,11,0)'); g.addColorStop(1, `rgba(8,9,11,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
// 画面层颗粒（只压在示意空镜上，包装层与数据图不加）
const GR = [];
function makeGrain() {
  for (let k = 0; k < 6; k++) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    const d = g.createImageData(256, 256);
    for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (hash(i * .37 + k * 9.1) + hash(i * .11 + k) - 1) * 150; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    g.putImageData(d, 0, 0); GR.push(c);
  }
}
function grain(t, a = .07) {
  const f = Math.floor(t * 30), c = GR[f % GR.length];
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = a;
  const ox = -Math.floor(hash(f) * 256), oy = -Math.floor(hash(f + 7) * 256);
  for (let x = ox; x < W; x += 256) for (let y = oy; y < H; y += 256) ctx.drawImage(c, x, y);
  ctx.restore();
}

// —— 台标：柠檬黄平行四边形 + 左侧黑/金竖条 + "LEMO" ——
function plate(cx, cy, s, glint = -1, drop = 1) {
  const w = 520 * s, h = 180 * s, k = h * .28;
  ctx.save(); ctx.translate(cx, cy);
  const path = new Path2D(); path.moveTo(-w / 2 + k, -h / 2); path.lineTo(w / 2 + k, -h / 2); path.lineTo(w / 2 - k, h / 2); path.lineTo(-w / 2 - k, h / 2); path.closePath();
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, C.lemonL); g.addColorStop(1, C.lemonD);
  ctx.fillStyle = g; ctx.fill(path);
  ctx.save(); ctx.clip(path);
  const gx = -w / 2 - k;
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(gx + 2 * k, -h / 2); ctx.lineTo(gx + 2 * k + w * .085, -h / 2); ctx.lineTo(gx + w * .085, h / 2); ctx.lineTo(gx, h / 2); ctx.fill();
  ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(gx + 2 * k + w * .085, -h / 2); ctx.lineTo(gx + 2 * k + w * .11, -h / 2); ctx.lineTo(gx + w * .11, h / 2); ctx.lineTo(gx + w * .085, h / 2); ctx.fill();
  const letters = ['L', 'E', 'M', 'O']; ctx.font = F.b8(h * .8); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  let x = -w * .25;
  letters.forEach((L, i) => {
    const d = clamp(drop * 4 - i); const yy = h * .29 + (1 - eo(d)) * -h * 1.1;
    ctx.globalAlpha *= 1; ctx.save(); ctx.globalAlpha = ctx.globalAlpha * clamp(d * 3); ctx.fillStyle = C.ink; ctx.fillText(L, x, yy); ctx.restore();
    x += ctx.measureText(L).width - h * .01;
  });
  if (glint >= 0 && glint <= 1) {
    const gx2 = lerp(-w, w, glint); const gg = ctx.createLinearGradient(gx2 - 80 * s, 0, gx2 + 80 * s, 0);
    gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(.5, 'rgba(255,255,255,.6)'); gg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gg; ctx.fillRect(-w, -h, w * 2, h * 2);
  }
  ctx.restore(); ctx.restore();
}
function wordmark(x, y, size, align = 'center', id = null) {
  const parts = [['LEMO ', C.white], ['AI ', C.lemon], ['NEWS', C.white]], ls = size * .14;
  const tot = parts.reduce((a, [s]) => a + tw(s, F.b8(size), ls), 0);
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  for (const [s, c] of parts) cx += text(s, cx, y, F.b8(size), c, 'left', ls);
  if (id) TX.push({ id, text: 'LEMO AI NEWS', x0: cx - tot, y0: y - size, x1: cx, y1: y + 8 });
}

// ============ 包装件 ============
// 下三分之一条带：从第一条新闻（7.5）到回顾（43.5）一直在底部，换内容时竖翻；bumper 期间也不收
const STRAP = [
  { out: 44.05, items: [
    { a: 7.5, tab: ['模型', 'MODELS'], cn: '谷歌向全部开发者开放 Gemini 4 Argon', en: 'GOOGLE OPENS GEMINI 4 ARGON TO EVERY DEVELOPER' },
    { a: 12.12, tab: ['模型', 'MODELS'], cn: '入门价之后，价格翻倍', en: 'PRICES DOUBLE AFTER THE INTRO' },
    { a: 15.75, tab: ['市场', 'MARKETS'], cn: '韩国 Kospi 单日跌 7.57%，跌入熊市', en: 'KOSPI PLUNGES 7.57% IN A DAY AND ENTERS A BEAR MARKET' },
    { a: 24.55, tab: ['市场', 'MARKETS'], cn: '利率与 AI 担忧，芯片股重挫', en: 'CHIP STOCKS SINK ON AI AND RATE FEARS' },
    { a: 29.0, tab: ['监管', 'POLICY'], cn: '欧盟 AI 办公室向 OpenAI、Anthropic 发出问询', en: 'EU AI OFFICE SENDS QUESTIONS TO OPENAI AND ANTHROPIC' },
    { a: 34.2, tab: ['监管', 'POLICY'], cn: '起因：今夏两起 AI 智能体事件', en: 'AFTER TWO AI-AGENT INCIDENTS THIS SUMMER' },
    { a: 38.55, tab: ['人物', 'PROFILE'], cn: 'Henna Virkkunen · 欧盟委员会执行副主席', en: 'EXECUTIVE VICE-PRESIDENT, EUROPEAN COMMISSION · IN DUBLIN' }] },
];
// 内容层下移量：没有字幕和滚动条，内容整体往下放，和底部条带之间不留空带
const DY = { rundown: 110, type: 60, price: 60, kospi: 60, chips: 70, eu: 60 };
function strap(t) {
  const G = STRAP.find(g => t >= g.items[0].a && t <= g.out + .3); if (!G) return;
  const L = G.items, a0 = L[0].a;
  let i = 0; for (let k = 0; k < L.length; k++) if (t >= L[k].a) i = k;
  const S = L[i], P = i > 0 ? L[i - 1] : null, sw = seg(t, S.a, S.a + .32);
  const x0 = 96, ty = 856, by = 904, bh = 104, bw = 1250;
  const inA = eo(seg(t, a0, a0 + .22)), inB = eo(seg(t, a0 + .08, a0 + .4));
  const out = eio(seg(t, G.out, G.out + .25));
  ctx.save(); ctx.translate(-out * 1600, 0);
  const bwNow = bw * inB;
  ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(x0 + 8, by + 8, bwNow, bh);
  ctx.fillStyle = C.paper; ctx.fillRect(x0, by, bwNow, bh);
  ctx.fillStyle = C.lemon; ctx.fillRect(x0, by, 14, bh * inB);
  if (inB > .95) { ctx.fillStyle = C.ink; ctx.fillRect(x0 + bw, by, 120, bh); ctx.fillStyle = C.lemon; ctx.fillRect(x0 + bw, by, 120, 6); text('LEMO', x0 + bw + 60, by + 68, F.b8(40), C.lemon, 'center', 1); }
  ctx.save(); ctx.beginPath(); ctx.rect(x0 + 14, by, bwNow - 14, bh); ctx.clip();
  const put = (D, dy, al, id) => { ctx.globalAlpha = al; text(D.cn, x0 + 44, by + 58 + dy, F.sc9(50), C.ink, 'left', 0, id); text(D.en, x0 + 46, by + 92 + dy, F.b6(27), '#6E5A1E', 'left', 1.5, id ? id + 'e' : null); ctx.globalAlpha = 1; };
  if (P && sw < 1) { put(P, -eio(sw) * bh, 1 - sw); put(S, (1 - eio(sw)) * bh, sw, 'strap'); }
  else put(S, (1 - inB) * 40, inB, 'strap');
  ctx.restore();
  const T = P && sw < .5 ? P : S;
  const tabW = 40 + tw(T.tab[0], F.sc9(30)) + 14 + tw(T.tab[1], F.b8(30), 2);
  ctx.fillStyle = C.lemon; ctx.fillRect(x0, ty, tabW * inA, by - ty);
  if (P && sw > 0 && sw < 1 && P.tab[0] !== S.tab[0]) { ctx.fillStyle = `rgba(255,255,255,${.5 * Math.sin(sw * Math.PI)})`; ctx.fillRect(x0, ty, tabW, by - ty); }
  if (inA > .9) { const w1 = text(T.tab[0], x0 + 20, ty + 37, F.sc9(30), C.ink); text(T.tab[1], x0 + 20 + w1 + 14, ty + 37, F.b8(30), C.ink, 'left', 2); }
  ctx.restore();
}

// 角标：示意画面 / 示意图（左上）。TAGS 在 Kospi 数据确定后由 kospiTag() 补齐
const TAGS = [[7.6, 14.95, 'ILLUSTRATION', '示意 · AI 生成画面'], [24.6, 28.3, 'ILLUSTRATION', '示意 · AI 生成画面']];
function cornerTag(t) {
  const A = TAGS.find(r => t >= r[0] && t < r[1]); if (!A) return;
  const sy = eo(seg(t, A[0], A[0] + .2)) * (1 - eo(seg(t, A[1] - .15, A[1])));
  const x = 96, y = 56, h = 64, w = 330;
  ctx.save(); ctx.translate(0, y + h / 2); ctx.scale(1, Math.max(.02, sy)); ctx.translate(0, -(y + h / 2));
  ctx.fillStyle = 'rgba(18,20,23,.82)'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = C.gold; ctx.fillRect(x, y, 8, h);
  text(A[2], x + 26, y + 28, F.mono(18), C.gold, 'left', 2, 'tag');
  text(A[3], x + 26, y + 54, F.sc7(20), C.white, 'left', 0, 'tagc');
  ctx.restore();
}

function bug(t) {
  if (t < 1.45 || t > 47.8) return;
  if (BUMPS.some(B => t > B.a + .2 && t < B.a + .78)) return;   // 百叶全黄时让开
  ctx.globalAlpha = .95; plate(1739, 86, .327, -1, 1);
  text('AI NEWS', 1650, 96, F.b8(26), C.white, 'right', 3); ctx.globalAlpha = 1;
}

// 外挂字幕（.srt）：中文一行 / 英文一行；画面上不烧字幕。时间按英文旁白（vo/words.json）切
const CUES = [
  [1.6, 5.2, '这里是 Lemo AI 新闻，本周 AI 三件事。', 'This is Lemo AI News. Three stories from the week in AI.'],
  [7.6, 10.55, '谷歌向全部开发者开放了 Gemini 4 Argon，', 'Google has opened Gemini 4 Argon to every developer,'],
  [10.55, 13.6, '价格是每百万输入 token 2 美元。', 'at $2 per million input tokens.'],
  [16.4, 19.35, '在首尔，Kospi 指数单日跌幅超过 7.5%，', 'In Seoul, the Kospi fell more than 7.5% in a day,'],
  [19.35, 21.4, '跌入熊市。', 'and slid into a bear market.'],
  [24.6, 28.3, '三星和 SK 海力士单日都跌了 9% 以上。', 'Samsung and SK hynix each lost more than 9%.'],
  [29.6, 31.4, '欧盟 AI 办公室已经发出问询，', "The EU's AI Office has sent questions"],
  [31.4, 34.1, '对象是 OpenAI 和 Anthropic，', 'to OpenAI and Anthropic,'],
  [34.2, 36.9, '起因是今年夏天两起 AI 智能体事件，', 'after two incidents with AI agents this summer,'],
  [36.9, 38.4, '据 Euronews 报道。', 'Euronews reports.'],
  [38.7, 40.4, '在都柏林，欧盟委员会科技主管表示，', "In Dublin, the Commission's tech chief said"],
  [40.4, 42.4, '执法已经开始。', 'enforcement has started.'],
  [44.1, 46.4, '本周就到这里。Lemo AI 新闻。', "That's the week. Lemo AI News."],
];
let t_ = 0;
// 出处小字：右下，和条带同一行
const CREDITS_ON = [
  [7.6, 15.0, 'SOURCE: GOOGLE GEMINI API CHANGELOG', '来源：Google · Gemini API 更新日志'],
  [16.0, 24.5, 'KRX DATA VIA NAVER · KOREA HERALD', '韩国交易所数据 · Korea Herald'],
  [24.5, 28.5, 'SOURCE: KOREA HERALD · BLOOMBERG', '来源：Korea Herald · Bloomberg'],
  [29.6, 38.5, 'REPORTED BY EURONEWS · NATURAL EARTH', '据 Euronews 报道 · 地图 Natural Earth'],
  [38.5, 43.7, 'SOURCE: EUROPEAN COMMISSION SPEECH', '来源：欧盟委员会 讲话全文'],
];
function credit(t) {
  const R = CREDITS_ON.find(r => t >= r[0] && t < r[1]); if (!R) return;
  const a = Math.min(seg(t, R[0], R[0] + .25), 1 - seg(t, R[1] - .2, R[1]));
  ctx.save(); ctx.globalAlpha = .75 * a; text(R[2], 1836, 950, F.mono(13), C.paper, 'right', .5); text(R[3], 1836, 978, F.sc7(16), C.paper, 'right', .5); ctx.restore();
}

// ============ 镜头 ============
function studioBg(t) {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
  const rg = ctx.createRadialGradient(1300, 380, 60, 1300, 380, 1100); rg.addColorStop(0, 'rgba(242,207,29,.16)'); rg.addColorStop(1, 'rgba(242,207,29,0)');
  ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  // 斜向光带（视差慢移）
  ctx.save();
  for (let i = 0; i < 7; i++) {
    const x = ((i * 380 + t * (30 + i * 6)) % 2600) - 400, w = 40 + hash(i) * 120;
    ctx.fillStyle = `rgba(242,207,29,${.025 + hash(i + 9) * .035})`;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + w, 0); ctx.lineTo(x + w - 500, H); ctx.lineTo(x - 500, H); ctx.fill();
  }
  ctx.restore();
  ctx.fillStyle = 'rgba(244,241,232,.05)';
  for (let x = 40 - (t * 12) % 48; x < W; x += 48) for (let y = 24; y < H; y += 48) ctx.fillRect(x, y, 2, 2);
}

function shotSting(t) {
  studioBg(t);
  [[.04, .3, 22, -60], [.1, .36, 8, 40]].forEach(([a, b, h, dy]) => {
    const k = seg(t, a, b); if (k <= 0 || k >= 1) return;
    ctx.save(); ctx.translate(960, 470 + dy); ctx.rotate(-.14);
    const x = lerp(-1900, 1900, eio(k)); ctx.fillStyle = C.lemon; ctx.fillRect(x - 700, -h / 2, 1400, h); ctx.restore();
  });
}
function stingLogo(t) {
  if (t > 1.5) return;
  const k = seg(t, .16, .42), fly = eio(seg(t, 1.12, 1.45));
  const shake = t > .42 && t < .7 ? Math.sin(t * 90) * 14 * (1 - seg(t, .42, .7)) : 0;
  const cx = lerp(960, 1739, fly) + shake, cy = lerp(450, 86, fly);
  const s = lerp(back(k, 2.2), .327, fly);
  if (k > 0) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate((1 - eo(k)) * -.12 * (1 - fly)); ctx.translate(-cx, -cy);
    plate(cx, cy, s, seg(t, .85, 1.12) || -1, seg(t, .3, .7)); ctx.restore();
  }
  const r = seg(t, .42, .8); if (r > 0 && r < 1) { ctx.strokeStyle = `rgba(242,207,29,${1 - r})`; ctx.lineWidth = 6 * (1 - r) + 1; ctx.beginPath(); ctx.ellipse(960, 450, 300 + r * 700, 120 + r * 300, 0, 0, Math.PI * 2); ctx.stroke(); }
  const wa = seg(t, .5, .8), wo = 1 - seg(t, 1.05, 1.18);
  if (wa > 0 && wo > 0) {
    ctx.save(); ctx.globalAlpha = wo; ctx.beginPath(); ctx.rect(960 - 520 * eo(wa), 560, 1040 * eo(wa), 160); ctx.clip();
    wordmark(960, 640, 70, 'center');
    text('WEEK 42 · 12–18 OCT 2026', 960, 690, F.mono(22), C.gold, 'center', 3);
    ctx.restore();
  }
}

// 串联单（开场 / 收尾同一个物件）
const ROWS = [
  ['01', '谷歌 Gemini 4 Argon 全面开放', 'GOOGLE OPENS GEMINI 4 ARGON TO ALL DEVELOPERS', 'TUE 13 OCT'],
  ['02', '韩国 Kospi 跌入熊市', 'KOSPI SLIDES INTO A BEAR MARKET', 'THU 15 OCT'],
  ['03', '欧盟 AI 办公室问询两家实验室', 'EU AI OFFICE QUESTIONS OPENAI AND ANTHROPIC', 'WED 14 OCT'],
];
function rundown(t, close) {
  studioBg(t);
  ctx.save(); ctx.translate(0, DY.rundown);
  const zs = close ? lerp(1.04, 1.0, eo(seg(t, 36.2, 37.2))) : lerp(1.0, 1.03, seg(t, 1.5, 6.0));
  ctx.save(); ctx.translate(960, 420); ctx.scale(zs, zs); ctx.translate(-960, -420);
  const A0 = close ? 36.2 : 1.6;
  const m = (a, b) => close ? 1 : eo(seg(t, a, b));
  // 左栏
  const x = 120, ta = m(A0, A0 + .25);
  const tabTxt = close ? ['本周回顾', 'RECAP'] : ['本周头条', 'TOP STORIES'];
  const tabW = 40 + tw(tabTxt[0], F.sc9(30)) + 14 + tw(tabTxt[1], F.b8(30), 2);
  ctx.fillStyle = C.lemon; ctx.fillRect(x, 170, tabW * ta, 50);
  if (ta > .9) { const w1 = text(tabTxt[0], x + 20, 208, F.sc9(30), C.ink, 'left', 0, 'rtab'); text(tabTxt[1], x + 20 + w1 + 14, 208, F.b8(30), C.ink, 'left', 2); }
  const r = (y, h, k, fn) => { if (k <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(0, y - h, 800, h + 24); ctx.clip(); ctx.translate(0, (1 - k) * (h + 24)); fn(); ctx.restore(); };
  r(390, 170, m(2.0, 2.3), () => text('12–18', x - 6, 390, F.b8(180), C.white, 'left', 2, 'rdate'));
  r(480, 90, m(2.2, 2.5), () => text('OCT 2026', x, 480, F.b8(84), C.lemon, 'left', 4, 'rmon'));
  ctx.globalAlpha = m(2.5, 2.8); text('WEEK 42 · 第 42 周', x, 532, F.mono(22), C.gold, 'left', 3, 'rwk'); ctx.globalAlpha = 1;
  r(626, 64, m(2.6, 2.9), () => text('本周 AI 三件事', x, 626, F.sc9(56), C.white, 'left', 2, 'rtt'));
  ctx.globalAlpha = m(2.75, 3.0); text('THE WEEK IN AI · 3 STORIES', x + 2, 668, F.b6(28), C.grey, 'left', 3); ctx.globalAlpha = 1;
  // 右栏：三行
  const X0 = 800, RW = 1024, RH = 140;
  ROWS.forEach(([n, cn, en, d], i) => {
    const a = close ? 0 : 3.0 + i * .5, y = 170 + i * 165;
    const k = close ? 1 : seg(t, a, a + .3); if (k <= 0) return;
    const sy = close ? 1 : back(k, 2.0);
    ctx.save(); ctx.translate(0, y); ctx.scale(1, Math.max(.02, sy)); ctx.translate(0, -y);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(X0 + 10, y + 10, RW, RH);
    ctx.fillStyle = C.ink2; ctx.fillRect(X0, y, RW, RH);
    ctx.fillStyle = C.lemon; ctx.fillRect(X0, y, 140, RH);
    text(n, X0 + 70, y + 102, F.b8(96), C.ink, 'center', 0);
    text(cn, X0 + 176, y + 66, F.sc9(44), C.white, 'left', 0, 'row' + i);
    text(en, X0 + 178, y + 108, F.b6(25), C.gold, 'left', 1.5, 'rowe' + i);
    text(d, X0 + RW - 26, y + 108, F.mono(18), C.grey2, 'right', 2);
    // 到达时的扫光
    const sw = close ? 0 : seg(t, a + .05, a + .45);
    if (sw > 0 && sw < 1) { const gx = X0 + 140 + (RW - 140) * eio(sw); const g = ctx.createLinearGradient(gx - 160, 0, gx, 0); g.addColorStop(0, 'rgba(242,207,29,0)'); g.addColorStop(1, 'rgba(242,207,29,.28)'); ctx.fillStyle = g; ctx.fillRect(Math.max(X0 + 140, gx - 160), y, Math.min(160, gx - X0 - 140), RH); }
    // 收尾：逐行打勾
    if (close) {
      const ck = seg(t, 37.0 + i * .5, 37.0 + i * .5 + .22);
      if (ck > 0) {
        const s = back(ck, 2.6), cx = X0 + RW - 64, cy = y + 52;
        ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
        ctx.fillStyle = C.lemon; ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(-13, 1); ctx.lineTo(-3, 11); ctx.lineTo(15, -10); ctx.stroke(); ctx.restore();
      }
    }
    ctx.restore();
  });
  // 开场：第一条亮框，提示"先报这条"
  if (!close) {
    const hl = seg(t, 5.1, 5.35);
    if (hl > 0) { ctx.strokeStyle = C.lemon; ctx.lineWidth = 5; ctx.globalAlpha = .6 + .4 * Math.cos((t - 5.1) * Math.PI * 4); ctx.strokeRect(X0 - 4, 166, RW * eo(hl) + 8, RH + 8); ctx.globalAlpha = 1; }
  }
  ctx.restore();
  ctx.restore();
}

// ① Gemini 4 Argon：大字排版
function shotType(t) {
  photo(IM.datacenter, 836, 470, lerp(1.17, 1.26, seg(t, 5.7, 9.0)));
  const g = ctx.createLinearGradient(0, 0, 1500, 0); g.addColorStop(0, 'rgba(14,16,19,.92)'); g.addColorStop(.55, 'rgba(14,16,19,.62)'); g.addColorStop(1, 'rgba(14,16,19,.25)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  vignette(.55); grain(t);
  ctx.save(); ctx.translate(0, DY.type);
  const x = 150;
  ctx.globalAlpha = eo(seg(t, 6.2, 6.4)); text('GOOGLE · GEMINI API · 13 OCT 2026', x + 4, 214, F.mono(24), C.gold, 'left', 4, 'k1'); ctx.globalAlpha = 1;
  // Gemini：从右滑入，带速度线
  const k1 = eo(seg(t, 6.2, 6.45)), dx = (1 - k1) * 520;
  if (k1 > 0) {
    if (k1 < 1) { ctx.fillStyle = 'rgba(242,207,29,.5)'; for (let i = 0; i < 5; i++) ctx.fillRect(x + 300 + dx, 280 + i * 26, 500 * (1 - k1), 4); }
    ctx.globalAlpha = clamp(k1 * 3); text('Gemini', x + dx, 410, F.b8(210), C.white, 'left', 2, 'gm'); ctx.globalAlpha = 1;
  }
  const gw = tw('Gemini', F.b8(210), 2);
  const k2 = seg(t, 6.5, 6.72);
  if (k2 > 0) { const s = back(k2, 2.6); ctx.save(); ctx.translate(x + gw + 30 + 55, 340); ctx.scale(s, s); text('4', -55, 70, F.b8(210), C.lemon, 'left', 0, 'g4'); ctx.restore(); }
  const k3 = eo(seg(t, 7.0, 7.3));
  if (k3 > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 430, 1400, 180); ctx.clip(); text('Argon', x, 600 + (1 - k3) * 180, F.b8(210), C.white, 'left', 2, 'ga'); ctx.restore(); }
  // 正式开放 GA 章
  const aw = tw('Argon', F.b8(210), 2);
  const k4 = seg(t, 7.5, 7.68);
  if (k4 > 0) {
    const s = 1 + .8 * (1 - eo(k4)); ctx.save(); ctx.translate(x + aw + 200, 528); ctx.rotate(-.06); ctx.scale(s, s); ctx.globalAlpha = clamp(k4 * 3);
    ctx.fillStyle = C.lemon; ctx.fillRect(-150, -46, 300, 92);
    const w1 = tw('正式开放', F.sc9(40)), w2 = tw('GA', F.b8(46), 2), st = -(w1 + 18 + w2) / 2;
    text('正式开放', st, 16, F.sc9(40), C.ink, 'left', 0); text('GA', st + w1 + 18, 17, F.b8(46), C.ink, 'left', 2);
    ctx.restore();
  }
  // 模型 ID 打字
  if (t >= 8.0) {
    const full = 'model = "gemini-4-argon"', n = Math.floor(seg(t, 8.0, 8.6) * full.length);
    ctx.fillStyle = 'rgba(27,30,35,.92)'; ctx.fillRect(x, 628, 660, 60); ctx.fillStyle = C.lemon; ctx.fillRect(x, 628, 6, 60);
    const vis = full.slice(0, n); const w = text(vis, x + 28, 668, F.mono(28), C.paper);
    if (Math.floor(t * 4) % 2 === 0 || n < full.length) { ctx.fillStyle = C.lemon; ctx.fillRect(x + 32 + w, 642, 14, 34); }
  }
  ctx.restore();
}

// 翻牌数字
function flipTile(x, y, w, h, from, to, t0, t, font, col) {
  const p = from === null ? 1 : seg(t, t0, t0 + .26);
  ctx.save();
  const half = (s, top, sc = 1) => {
    if (s === null) return;
    ctx.save(); ctx.beginPath(); ctx.rect(x, top ? y : y + h / 2, w, h / 2); ctx.clip();
    ctx.translate(0, y + h / 2); ctx.scale(1, sc); ctx.translate(0, -(y + h / 2));
    ctx.fillStyle = top ? '#2B3038' : '#262A31'; ctx.fillRect(x, y, w, h);
    text(s, x + w / 2, y + h * .76, font, col, 'center');
    ctx.restore();
  };
  if (p >= 1) { half(to, true); half(to, false); }
  else if (p <= 0) { half(from, true); half(from, false); }
  else {
    half(to, true); half(from, false);
    if (p < .5) half(from, true, 1 - p * 2); else half(to, false, (p - .5) * 2);
  }
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x, y + h / 2 - 1.5, w, 3);
  ctx.restore();
}
function shotPrice(t) {
  photo(IM.datacenter, 836, 470, 1.3, 0, 0, W, H, 'blur(14px) brightness(.5)');
  ctx.fillStyle = 'rgba(14,16,19,.45)'; ctx.fillRect(0, 0, W, H); grain(t, .05);
  ctx.save(); ctx.translate(0, DY.price);
  const k = seg(t, 9.0, 9.3), b = back(k, 1.3);
  ctx.save(); ctx.translate(660, 420 + (1 - b) * 80); ctx.rotate(lerp(-.045, -.014, eo(seg(t, 9.0, 13.0))));
  ctx.globalAlpha = clamp(k * 4);
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-500 + 18, -265 + 22, 1000, 530);
  ctx.fillStyle = C.ink2; ctx.fillRect(-500, -265, 1000, 530); ctx.fillStyle = C.lemon; ctx.fillRect(-500, -265, 1000, 6);
  const w1 = text('每百万 token 价格', -450, -190, F.sc9(40), C.white, 'left', 0, 'ph'); text('PRICE PER 1M TOKENS', -450 + w1 + 20, -192, F.b6(26), C.gold, 'left', 2);
  text('Gemini 4 Argon', 450, -192, F.mono(18), C.grey2, 'right', 1);
  ctx.fillStyle = C.line; ctx.fillRect(-450, -160, 900, 2);
  const col = (cx, cn, en) => { const a = tw(cn, F.sc7(26)), b2 = tw(en, F.b6(22), 2), s0 = cx - (a + 10 + b2) / 2; text(cn, s0, -100, F.sc7(26), C.white); text(en, s0 + a + 10, -101, F.b6(22), C.grey, 'left', 2); };
  col(-10, '输入', 'INPUT'); col(270, '输出', 'OUTPUT');
  const row = (y, cn, en) => { text(cn, -450, y + 66, F.sc9(36), C.white, 'left', 0, 'rl' + y); text(en, -450, y + 100, F.b6(22), C.grey, 'left', 2); };
  row(-70, '入门价', 'INTRO · TO 30 NOV');
  flipTile(-120, -70, 220, 130, null, '$2', 0, t >= 9.2 ? 9 : -1, F.b8(104), C.lemon);
  flipTile(160, -70, 220, 130, null, '$10', 0, t >= 9.4 ? 9 : -1, F.b8(104), C.lemon);
  if (t < 9.2) { ctx.fillStyle = '#262A31'; ctx.fillRect(-120, -70, 220, 130); }
  if (t < 9.4) { ctx.fillStyle = '#262A31'; ctx.fillRect(160, -70, 220, 130); }
  const r2 = eo(seg(t, 9.65, 9.85));
  ctx.globalAlpha = clamp(k * 4) * r2;
  row(90, '之后', 'THEN · FROM 1 DEC');
  flipTile(-120, 90, 220, 130, '$2', '$4', 9.9, t, F.b8(104), C.white);
  flipTile(160, 90, 220, 130, '$10', '$20', 10.1, t, F.b8(104), C.white);
  ctx.restore(); ctx.globalAlpha = 1;
  // 价格翻倍
  const bk = seg(t, 10.45, 10.7);
  if (bk > 0) {
    const s = back(bk, 2.2); ctx.save(); ctx.translate(1520, 400); ctx.scale(s, s);
    text('×2', 0, 40, F.b8(220), C.lemon, 'center', 0, 'x2');
    text('价格翻倍', 0, 120, F.sc9(48), C.white, 'center', 0, 'x2c');
    text('PRICE DOUBLES', 0, 162, F.b6(28), C.gold, 'center', 3);
    ctx.restore();
    const ak = eio(seg(t, 10.45, 10.8));
    ctx.strokeStyle = C.lemon; ctx.lineWidth = 5; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(1190, 470); ctx.lineTo(1190 + 150 * ak, 470); ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.restore();
}

// ② Kospi：真实日收盘（韩国交易所数据，经 Naver 金融接口取得，data/kospi_daily.csv），按距 9 月 23 日高点的跌幅画
const KDATA = [['15 SEP', 6627.26], ['16 SEP', 6717.97], ['17 SEP', 6715.41], ['18 SEP', 6894.23], ['21 SEP', 7007.72], ['22 SEP', 7017.91], ['23 SEP', 7080.92],
  ['28 SEP', 6889.74], ['29 SEP', 6870.81], ['30 SEP', 6838.04], ['1 OCT', 6971.35], ['2 OCT', 7003.74],
  ['6 OCT', 6941.39], ['7 OCT', 6803.90], ['8 OCT', 6625.93], ['12 OCT', 6384.24], ['13 OCT', 6035.35], ['14 OCT', 6008.81], ['15 OCT', 5554.22]];
const PK = 6, ST = 11, KPEAK = KDATA[PK][1];   // 高点下标；KPTS[ST + d] = 连跌第 d 天
const KX0 = 210, KX1 = 1180, KY = v => 190 + (-v) / 25 * 430;
const KPTS = KDATA.map(([d, c], i) => { const v = (c / KPEAK - 1) * 100; return [lerp(KX0, KX1, i / (KDATA.length - 1)), KY(v), v]; });
const KT = (() => { const T = []; for (let i = 0; i <= ST; i++) T.push(13.05 + i * .07); for (let d = 1; d <= 6; d++) T.push(14.15 + (d - 1) * .3); T.push(16.5); return T; })();
function shotKospi(t) {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(0, DY.kospi);
  const sh = t > 16.5 && t < 16.9 ? (1 - seg(t, 16.5, 16.9)) : 0;
  ctx.save(); ctx.translate(Math.sin(t * 83) * 14 * sh, Math.cos(t * 71) * 10 * sh);
  const zs = lerp(1.0, 1.05, eio(seg(t, 13.0, 16.4))); ctx.translate(700, 400); ctx.scale(zs, zs); ctx.translate(-700, -400);
  // 网格与坐标
  const ga = eo(seg(t, 12.95, 13.15));
  ctx.globalAlpha = ga;
  ctx.strokeStyle = 'rgba(244,241,232,.08)'; ctx.lineWidth = 1;
  for (let v = 0; v >= -25; v -= 5) { ctx.beginPath(); ctx.moveTo(KX0, KY(v)); ctx.lineTo(KX1 + 40, KY(v)); ctx.stroke(); }
  [[0, '0%'], [-10, '−10%']].forEach(([v, s]) => text(s, KX0 - 16, KY(v) + 7, F.mono(18), C.grey2, 'right'));
  text('KOSPI · 距 9 月高点 FROM SEPTEMBER HIGH', KX0, 140, F.mono(20), C.gold, 'left', 2, 'kax');
  for (let d = 1; d <= 7; d++) { const p = KPTS[ST + d]; text(String(d), p[0], 650, F.mono(18), t >= KT[ST + d] ? C.paper : C.grey2, 'center'); }
  [[0, 680], [PK, 680], [ST + 1, 680], [KDATA.length - 1, 680]].forEach(([i, y]) => text(KDATA[i][0], KPTS[i][0], y, F.mono(16), C.grey2, 'center', 1, 'kd' + i));
  text('连跌 DAY', KPTS[ST + 1][0] - 34, 650, F.mono(16), C.grey2, 'right', 1);
  ctx.globalAlpha = 1;
  // 熊市线
  const bl = eio(seg(t, 13.1, 13.6)), bf = t > 16.5 && t < 17.1 ? .5 + .5 * Math.cos((t - 16.5) * 30) : 0;
  ctx.strokeStyle = bf > 0 ? mixc('D4B064', 'FFFFFF', bf) : C.gold; ctx.lineWidth = 3; ctx.setLineDash([16, 12]);
  ctx.beginPath(); ctx.moveTo(KX0, KY(-20)); ctx.lineTo(lerp(KX0, KX1 + 40, bl), KY(-20)); ctx.stroke(); ctx.setLineDash([]);
  if (bl > .9) { ctx.globalAlpha = eo(seg(t, 13.5, 13.7)); const w1 = text('熊市线 −20%', KX0 + 8, KY(-20) + 36, F.sc7(24), C.gold, 'left', 0, 'kbl'); text('BEAR MARKET LINE', KX0 + 8 + w1 + 12, KY(-20) + 35, F.b6(22), C.gold, 'left', 2); ctx.globalAlpha = 1; }
  // 走势线
  let last = null; const pts = [];
  for (let i = 0; i < KPTS.length; i++) {
    const ta = KT[i], dur = i === KPTS.length - 1 ? .14 : (i <= ST ? .06 : .18);
    if (i === 0) { if (t >= ta) pts.push(KPTS[0]); continue; }
    const k = seg(t, ta, ta + dur); if (k <= 0) break;
    const a = KPTS[i - 1], b = KPTS[i];
    pts.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k)]);
  }
  if (pts.length > 1) {
    const ag = ctx.createLinearGradient(0, KY(0), 0, KY(-25)); ag.addColorStop(0, 'rgba(242,207,29,.14)'); ag.addColorStop(1, 'rgba(242,207,29,0)');
    ctx.fillStyle = ag; ctx.beginPath(); ctx.moveTo(pts[0][0], KY(-25)); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(pts[pts.length - 1][0], KY(-25)); ctx.fill();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = C.paper; ctx.lineWidth = 5; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    // 击穿段：柠檬黄
    if (t >= 16.5) { const a = KPTS[KPTS.length - 2], p = pts[pts.length - 1]; ctx.strokeStyle = C.lemon; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); }
    last = pts[pts.length - 1];
    const blink = t > 15.8 && t < 16.5 ? (Math.floor(t * 8) % 2 ? 1 : .3) : 1;
    ctx.globalAlpha = blink; ctx.fillStyle = t >= 16.5 ? C.lemon : C.paper; ctx.beginPath(); ctx.arc(last[0], last[1], 10, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  }
  // 高点
  const pk = eo(seg(t, 13.5, 13.7));
  if (pk > 0) { const p = KPTS[PK]; ctx.globalAlpha = pk; ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, Math.PI * 2); ctx.fill(); text('高点 PEAK 7,080.92', p[0] + 16, p[1] - 16, F.mono(18), C.gold, 'left', 1, 'kpk'); ctx.globalAlpha = 1; }
  // 爆环
  const rb = seg(t, 16.62, 17.2); if (rb > 0 && rb < 1) { const p = KPTS[KPTS.length - 1]; ctx.strokeStyle = `rgba(242,207,29,${1 - rb})`; ctx.lineWidth = 8 * (1 - rb) + 1; ctx.beginPath(); ctx.arc(p[0], p[1], 20 + rb * 260, 0, Math.PI * 2); ctx.stroke(); }
  // 连跌计数（线头旁）
  let nd = 0; for (let d = 1; d <= 7; d++) if (t >= KT[ST + d]) nd = d;
  if (nd > 0 && last) {
    const pop = 1 + .25 * (1 - eo(seg(t, KT[ST + nd], KT[ST + nd] + .2)));
    const lw0 = 24 + tw('连跌 ' + nd + ' 日', F.sc9(28)) + 10 + tw('DAY ' + nd, F.b8(26), 2) + 20;
    ctx.save(); ctx.translate(KX1 + 40, 150); ctx.scale(pop, pop); ctx.translate(0, 0);
    const lw = 24 + tw('连跌 ' + nd + ' 日', F.sc9(28)) + 10 + tw('DAY ' + nd, F.b8(26), 2) + 20;
    ctx.fillStyle = nd === 7 ? C.lemon : 'rgba(27,30,35,.95)'; ctx.fillRect(-lw, -24, lw, 46);
    const w1 = text('连跌 ' + nd + ' 日', -lw + 14, 10, F.sc9(28), nd === 7 ? C.ink : C.white);
    text('DAY ' + nd, -lw + 14 + w1 + 10, 10, F.b8(26), nd === 7 ? C.ink : C.lemon, 'left', 2);
    ctx.restore();
  }
  // 熊市章
  const sk = seg(t, 17.35, 17.53);
  if (sk > 0) {
    const s = 1 + 1.0 * (1 - eo(sk)); ctx.save(); ctx.translate(640, 440); ctx.rotate(-.07); ctx.scale(s, s); ctx.globalAlpha = clamp(sk * 3);
    ctx.fillStyle = C.lemon; ctx.fillRect(-180, -48, 360, 96); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.strokeRect(-170, -38, 340, 76);
    const w1 = tw('熊市', F.sc9(46)), w2 = tw('BEAR MARKET', F.b8(40), 2), st = -(w1 + 16 + w2) / 2;
    text('熊市', st, 16, F.sc9(46), C.ink, 'left', 0, 'kst'); text('BEAR MARKET', st + w1 + 16, 15, F.b8(40), C.ink, 'left', 2);
    ctx.restore();
  }
  ctx.restore();
  // 读数面板（右）
  const pa = eo(seg(t, 16.55, 16.8));
  if (pa > 0) {
    const X = 1300 + (1 - pa) * 600, Y = 150;
    ctx.fillStyle = 'rgba(27,30,35,.97)'; ctx.fillRect(X, Y, 520, 560); ctx.fillStyle = C.lemon; ctx.fillRect(X, Y, 520, 6);
    text('KOSPI · 15 OCT 2026', X + 40, Y + 58, F.mono(22), C.gold, 'left', 2, 'kp0');
    const v = (Math.round(seg(t, 16.6, 17.0) * 757) / 100).toFixed(2);
    text('−' + v + '%', X + 34, Y + 196, F.b8(150), C.lemon, 'left', 0); TX.push({ id: 'kpv', text: '−7.57%', x0: X, y0: Y + 60, x1: X + 520, y1: Y + 200 });
    const w1 = text('单日跌幅', X + 40, Y + 244, F.sc7(28), C.white, 'left', 0, 'kp1'); text('ONE-DAY DROP', X + 40 + w1 + 14, Y + 243, F.b6(24), C.grey, 'left', 2);
    ctx.fillStyle = C.line; ctx.fillRect(X + 40, Y + 276, 440, 2);
    const ck = eo(seg(t, 16.8, 17.05));
    ctx.save(); ctx.beginPath(); ctx.rect(X, Y + 290, 520, 100); ctx.clip();
    text('5,554.22', X + 36, Y + 370 + (1 - ck) * 90, F.b8(84), C.white, 'left', 1, 'kp2'); ctx.restore();
    const w2 = text('收盘', X + 40, Y + 416, F.sc7(26), C.white, 'left', 0, 'kp3'); text('CLOSE', X + 40 + w2 + 14, Y + 415, F.b6(24), C.grey, 'left', 2);
    ctx.globalAlpha = eo(seg(t, 16.95, 17.2));
    const w3 = text('连跌 7 个交易日', X + 40, Y + 462, F.sc7(26), C.lemon, 'left', 0, 'kp4'); text('7 STRAIGHT LOSING DAYS', X + 40 + w3 + 14, Y + 461, F.b6(22), C.grey, 'left', 1.5);
    ctx.globalAlpha = eo(seg(t, 17.25, 17.5));
    const w4 = text('较 9 月高点 −21.56%', X + 40, Y + 516, F.sc7(26), C.white, 'left', 0, 'kp5'); text('FROM SEPT HIGH', X + 40 + w4 + 14, Y + 515, F.b6(22), C.grey, 'left', 1.5);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

// ② 芯片股：两根下坠条
function shotChips(t) {
  photo(IM.wafer, 900, 470, lerp(1.17, 1.24, seg(t, 20.0, 24.0)));
  const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(14,16,19,.93)'); g.addColorStop(.4, 'rgba(14,16,19,.8)'); g.addColorStop(1, 'rgba(14,16,19,.6)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); vignette(.5); grain(t);
  ctx.save(); ctx.translate(0, DY.chips);
  const x = 150;
  ctx.globalAlpha = eo(seg(t, 20.1, 20.3)); text('15 OCT 2026 · 单日涨跌 ONE-DAY CHANGE', x, 214, F.mono(20), C.gold, 'left', 2, 'c0'); ctx.globalAlpha = 1;
  const tk = eo(seg(t, 20.15, 20.45));
  ctx.save(); ctx.beginPath(); ctx.rect(0, 230, 760, 100); ctx.clip(); text('芯片股领跌', x, 310 + (1 - tk) * 90, F.sc9(76), C.white, 'left', 2, 'c1'); ctx.restore();
  ctx.globalAlpha = tk; text('CHIPMAKERS LEAD THE FALL', x + 2, 360, F.b6(32), C.lemon, 'left', 3, 'c2'); ctx.globalAlpha = 1;
  const Z = 260, PX = 27.5;
  const zl = eio(seg(t, 20.1, 20.4));
  ctx.fillStyle = C.paper; ctx.fillRect(780, Z - 1, 900 * zl, 3);
  text('0%', 768, Z + 7, F.mono(18), C.grey, 'right');
  const BARS = [[820, '三星电子', 'SAMSUNG ELECTRONICS', 9.48, 20.3], [1290, 'SK 海力士', 'SK HYNIX', 11.06, 20.8]];
  // −9% 参考线（在条形之后画出）
  const rl = eio(seg(t, 21.3, 21.6));
  if (rl > 0) {
    ctx.strokeStyle = C.gold; ctx.lineWidth = 3; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(780, Z + 9 * PX); ctx.lineTo(780 + 900 * rl, Z + 9 * PX); ctx.stroke(); ctx.setLineDash([]);
    text('−9%', 768, Z + 9 * PX + 7, F.mono(18), C.gold, 'right');
  }
  BARS.forEach(([bx, cn, en, v, a]) => {
    const k = eio(seg(t, a, a + .45)); const la = eo(seg(t, a - .15, a + .1));
    ctx.globalAlpha = la; text(cn, bx, Z - 52, F.sc9(36), C.white, 'left', 0, 'bn' + bx); text(en, bx, Z - 16, F.b6(22), C.grey, 'left', 2); ctx.globalAlpha = 1;
    if (k <= 0) return;
    const h = v * PX * k;
    const bg = ctx.createLinearGradient(0, Z, 0, Z + h); bg.addColorStop(0, C.lemonD); bg.addColorStop(1, C.lemon);
    ctx.fillStyle = bg; ctx.fillRect(bx, Z + 2, 280, h);
    const vv = (Math.round(v * k * 100) / 100).toFixed(2);
    text('−' + vv + '%', bx, Z + h + 82, F.b8(84), C.white, 'left', 0);
    if (k >= 1) TX.push({ id: 'bv' + bx, text: '−' + v.toFixed(2) + '%', x0: bx, y0: Z + h + 10, x1: bx + 300, y1: Z + h + 90 });
  });
  if (rl > 0) {
    ctx.strokeStyle = 'rgba(18,20,23,.75)'; ctx.lineWidth = 3; ctx.setLineDash([14, 10]);
    BARS.forEach(([bx]) => { ctx.beginPath(); ctx.moveTo(bx, Z + 9 * PX); ctx.lineTo(bx + 280 * rl, Z + 9 * PX); ctx.stroke(); }); ctx.setLineDash([]);
    const ck = seg(t, 21.5, 21.72);
    if (ck > 0) {
      const s = back(ck, 2.4); ctx.save(); ctx.translate(1660, Z + 9 * PX); ctx.scale(s, s);
      const w1 = tw('都超过 9%', F.sc9(28)), w2 = tw('BOTH OVER 9%', F.b8(24), 2), lw = w1 + w2 + 50;
      ctx.fillStyle = C.gold; ctx.fillRect(-lw / 2, -26, lw, 52);
      text('都超过 9%', -lw / 2 + 16, 10, F.sc9(28), C.ink, 'left', 0, 'b9'); text('BOTH OVER 9%', -lw / 2 + 32 + w1, 9, F.b8(24), C.ink, 'left', 2);
      ctx.restore();
    }
  }
  ctx.restore();
}

// ③ 欧洲地图一镜到底：布鲁塞尔（AI 办公室）点亮 → 推近 → 向右摇 → 两份信息调取从布鲁塞尔飞出（据 Euronews）
let MP = null;
const EUT = { light: 29.55, city: 29.85, push: [30.3, 31.5], label: 30.9, pan: [31.6, 32.4], docs: [32.1, 33.0], mark: [34.65, 35.2], badge: 36.1 };
function buildMap() {
  MP = [];
  const [dx, dy] = EU.brussels;
  for (const id in EU.countries) {
    const c = EU.countries[id], p = new Path2D(); let sx = 0, sy = 0, n = 0;
    for (const r of c.rings) { r.forEach(([x, y], i) => { i ? p.lineTo(x, y) : p.moveTo(x, y); sx += x; sy += y; n++; }); p.closePath(); }
    MP.push({ id, eu: c.eu, be: c.name === 'Belgium', p, d: Math.hypot(sx / n - dx, sy / n - dy) });
  }
}
function euView(t) {
  const [bx, by] = EU.brussels;
  const z = eio(seg(t, ...EUT.push)), pn = eio(seg(t, ...EUT.pan));
  const S = lerp(lerp(.29, 1.0, z), .86, pn);
  const F0 = [lerp(250, bx, z), lerp(-120, by, z)];
  const O = [lerp(lerp(960, 900, z), 470, pn), lerp(lerp(440, 430, z), 440, pn)];
  return { S, F: F0, O, tf: (x, y) => [O[0] + (x - F0[0]) * S, O[1] + (y - F0[1]) * S] };
}
const DOCS = [
  { org: 'OpenAI', cn: ['智能体逃出测试环境，', '攻入 Hugging Face'], en: 'AGENT ESCAPED ITS TEST ENVIRONMENT' },
  { org: 'Anthropic', cn: ['模型未经授权，', '进入三家外部机构'], en: 'UNAUTHORISED ACCESS TO 3 OUTSIDE ORGS' },
];
function doc(t, side) {
  const a = EUT.docs[side], k = seg(t, a, a + .5); if (k <= 0) return;
  const D0 = DOCS[side], V = euView(t), B = V.tf(...EU.brussels), e = eio(k);
  const tx = side ? 1590 : 1170, ty = 395;
  const cx = lerp(B[0], tx, e), cy = lerp(B[1], ty, e) - Math.sin(e * Math.PI) * 140;
  const s = lerp(.08, 1, eo(k)), rot = lerp(side ? .5 : -.5, side ? .02 : -.025, eo(k));
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(s, s); ctx.translate(-190, -245);
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(14, 18, 380, 490);
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, 380, 490);
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, 380, 92);
  const id = k >= 1;
  text('信息调取', 28, 48, F.sc9(36), C.lemon, 'left', 2, id ? 'dh' + side : null);
  text('REQUEST FOR INFORMATION', 28, 78, F.b6(20), C.paper, 'left', 2);
  text('致 TO', 28, 134, F.mono(16), C.grey2, 'left', 2);
  text(D0.org, 26, 192, F.b8(60), C.ink, 'left', 0, id ? 'do' + side : null);
  ctx.fillStyle = '#D9D4C5'; ctx.fillRect(28, 214, 324, 2);
  text('事由 RE', 28, 252, F.mono(16), C.grey2, 'left', 2);
  // 荧光笔扫过事由（对准旁白 "incidents"）
  const mk = eio(seg(t, EUT.mark[side], EUT.mark[side] + .4));
  D0.cn.forEach((L, i) => {
    const w = tw(L, F.sc9(30));
    if (mk > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#F5D63A'; ctx.fillRect(22, 266 + i * 46, (w + 14) * mk, 40); ctx.restore(); }
    text(L, 28, 298 + i * 46, F.sc9(30), C.ink, 'left', 0, id ? 'dc' + side + i : null);
  });
  text(D0.en, 28, 380, F.b6(19), '#6B6E73', 'left', 1, id ? 'de' + side : null);
  ctx.fillStyle = '#D9D4C5'; ctx.fillRect(28, 412, 324, 2);
  text('EU AI OFFICE · 14 OCT 2026', 28, 446, F.mono(15), C.grey2, 'left', 1.5);
  text('据 EURONEWS 报道', 28, 472, F.sc7(16), C.grey2, 'left', 1);
  ctx.restore();
}
function shotEU(t) {
  ctx.fillStyle = '#0D0F12'; ctx.fillRect(0, 0, W, H);
  const V = euView(t);
  ctx.save(); ctx.setTransform(V.S, 0, 0, V.S, V.O[0] - V.F[0] * V.S, V.O[1] - V.F[1] * V.S + DY.eu);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(244,241,232,.04)'; ctx.lineWidth = 1 / V.S;
  for (let x = -4000; x <= 4000; x += 500) { ctx.beginPath(); ctx.moveTo(x, -3000); ctx.lineTo(x, 3000); ctx.stroke(); }
  for (let y = -3000; y <= 3000; y += 500) { ctx.beginPath(); ctx.moveTo(-4000, y); ctx.lineTo(4000, y); ctx.stroke(); }
  for (const c of MP) {
    let fill = C.ink3;
    if (c.eu) { const ft = EUT.light + c.d / 3600 * .8, k = seg(t, ft, ft + .12); fill = mixc('22262C', '4A4426', k); }
    if (c.be) { const k = seg(t, EUT.city, EUT.city + .15); fill = k > 0 ? mixc('FFFFFF', 'F2CF1D', seg(t, EUT.city, EUT.city + .35)) : fill; }
    ctx.fillStyle = fill; ctx.fill(c.p);
    ctx.strokeStyle = c.be && t > EUT.city ? 'rgba(18,20,23,.9)' : 'rgba(150,156,166,.55)'; ctx.lineWidth = 1.1 / V.S; ctx.stroke(c.p);
  }
  ctx.restore();
  ctx.save(); ctx.translate(0, DY.eu);
  const B = V.tf(...EU.brussels), ct = EUT.city;
  const da = eo(seg(t, ct, ct + .25));
  if (da > 0) {
    const rb = seg(t, ct, ct + .55); if (rb < 1) { ctx.strokeStyle = `rgba(242,207,29,${1 - rb})`; ctx.lineWidth = 6 * (1 - rb) + 1; ctx.beginPath(); ctx.arc(B[0], B[1], 20 + rb * 300, 0, Math.PI * 2); ctx.stroke(); }
    const pr = ((t - ct) * 1.3) % 1; ctx.strokeStyle = `rgba(242,207,29,${1 - pr})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(B[0], B[1], 12 + pr * 34, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(B[0], B[1], 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(B[0], B[1], 7, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = da;
    const lw = 26 + tw('布鲁塞尔', F.sc9(32)) + 12 + tw('BRUSSELS', F.b8(28), 2) + 20, lx = B[0] - lw - 30, ly = B[1] + 36;
    ctx.fillStyle = 'rgba(18,20,23,.92)'; ctx.fillRect(lx, ly, lw, 52); ctx.fillStyle = C.lemon; ctx.fillRect(lx, ly, 6, 52);
    const w1 = text('布鲁塞尔', lx + 22, ly + 38, F.sc9(32), C.white, 'left', 0, 'bru'); text('BRUSSELS', lx + 22 + w1 + 12, ly + 37, F.b8(28), C.lemon, 'left', 2);
    ctx.globalAlpha = 1;
  }
  const lg = eo(seg(t, ct + .1, ct + .35)) * (1 - eo(seg(t, EUT.pan[1] + .2, EUT.pan[1] + .45)));
  if (lg > 0) { ctx.globalAlpha = lg; ctx.fillStyle = '#4A4426'; ctx.fillRect(150, 636, 26, 18); ctx.strokeStyle = 'rgba(150,156,166,.7)'; ctx.lineWidth = 1; ctx.strokeRect(150, 636, 26, 18); const w1 = text('欧盟成员国', 188, 653, F.sc7(22), C.grey, 'left', 0, 'leg'); text('EU MEMBER STATES', 188 + w1 + 10, 652, F.b6(20), C.grey2, 'left', 2); ctx.globalAlpha = 1; }
  // AI 办公室标注
  const ca = eo(seg(t, EUT.label, EUT.label + .3));
  if (ca > 0) {
    const bx = Math.max(110, B[0] - 520), by = B[1] - 260;
    ctx.strokeStyle = C.lemon; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(B[0] - 6, B[1] - 8); ctx.lineTo(lerp(B[0], bx + 470, ca), lerp(B[1], by + 120, ca)); ctx.stroke();
    ctx.globalAlpha = ca;
    ctx.fillStyle = 'rgba(27,30,35,.95)'; ctx.fillRect(bx, by, 520, 120); ctx.fillStyle = C.lemon; ctx.fillRect(bx, by, 520, 5);
    const w1 = text('欧盟 AI 办公室', bx + 26, by + 56, F.sc9(34), C.white, 'left', 0, 'aio'); text('EU AI OFFICE', bx + 26 + w1 + 14, by + 55, F.b8(28), C.lemon, 'left', 2);
    const w2 = text('隶属欧盟委员会', bx + 26, by + 98, F.sc7(24), C.grey, 'left', 0, 'act'); text('WITHIN THE EUROPEAN COMMISSION', bx + 26 + w2 + 12, by + 97, F.b6(22), C.grey2, 'left', 1.5);
    ctx.globalAlpha = 1;
  }
  const dk = eio(seg(t, EUT.pan[0], EUT.pan[0] + .6));
  if (dk > 0) { const g = ctx.createLinearGradient(820, 0, 1100, 0); g.addColorStop(0, 'rgba(13,15,18,0)'); g.addColorStop(1, `rgba(13,15,18,${.7 * dk})`); ctx.fillStyle = g; ctx.fillRect(820, -DY.eu, W - 820, H + DY.eu); }
  doc(t, 0); doc(t, 1);
  // 夏季徽章：两起事件都发生在今年夏天
  const bk = seg(t, EUT.badge, EUT.badge + .22);
  if (bk > 0) {
    const s = back(bk, 2.4); ctx.save(); ctx.translate(1380, 700); ctx.rotate(-.05); ctx.scale(s, s);
    const w1 = tw('今年夏天', F.sc9(30)), w2 = tw('SUMMER 2026', F.b8(26), 2), lw = w1 + w2 + 50;
    ctx.fillStyle = C.gold; ctx.fillRect(-lw / 2, -27, lw, 54);
    text('今年夏天', -lw / 2 + 16, 11, F.sc9(30), C.ink, 'left', 0, 'summer'); text('SUMMER 2026', -lw / 2 + 34 + w1, 10, F.b8(26), C.ink, 'left', 2);
    ctx.restore();
  }
  ctx.restore();
}

// ============ 虚拟演播室：主播台 + 三联视频墙（2D 透视绘制）============
// 摄影机：s=1 全景；s=SFULL 时中屏正好铺满画面（推进视频墙 = 进入报道）
const PANEL = { x: 580, y: 186.25, w: 760, h: 427.5 }, SFULL = W / 760, P0 = [960, 400];
function renderTo(fn, t) {            // 把一个镜头画进离屏画布（给视频墙用）；离屏里登记的字不进 TEXTS
  const keep = ctx, n = TX.length; ctx = octx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  fn(t); ctx = keep; TX.length = n;
}
function studio(t, s, wallFn, wallT, lit = 1) {
  const u = (s - 1) / (SFULL - 1), Cx = 960, Cy = lerp(400, 540, u);
  renderTo(wallFn, wallT);
  ctx.fillStyle = '#0B0C0E'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(Cx, Cy); ctx.scale(s, s); ctx.translate(-P0[0], -P0[1]);
  // 背景墙：冷黑渐变 + 竖向金色灯鳍
  const bg = ctx.createLinearGradient(0, 40, 0, 660); bg.addColorStop(0, '#0E1013'); bg.addColorStop(1, '#1A1D22');
  ctx.fillStyle = bg; ctx.fillRect(-400, -200, 2720, 860);
  for (let i = 0; i < 18; i++) {
    const x = -260 + i * 140, on = clamp(lit * 1.6 - Math.abs(i - 8.5) * .08);
    const g = ctx.createLinearGradient(0, 120, 0, 660); g.addColorStop(0, 'rgba(212,176,100,0)'); g.addColorStop(.5, `rgba(212,176,100,${.28 * on})`); g.addColorStop(1, 'rgba(212,176,100,0)');
    ctx.fillStyle = g; ctx.fillRect(x, 120, 3, 540);
  }
  // 顶部灯架
  ctx.fillStyle = '#16191D'; ctx.fillRect(-400, 52, 2720, 18);
  for (let i = 0; i < 14; i++) {
    const x = 60 + i * 140, on = clamp(lit * 2 - i * .05);
    const g = ctx.createRadialGradient(x, 82, 0, x, 82, 60); g.addColorStop(0, `rgba(255,244,214,${.55 * on})`); g.addColorStop(1, 'rgba(255,244,214,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 60, 22, 120, 120);
    ctx.fillStyle = `rgba(255,248,230,${.4 + .6 * on})`; ctx.fillRect(x - 9, 72, 18, 8);
  }
  // 侧屏（斜着朝向中间）：柠檬黄斜纹慢移 + 字标
  const side = (sx) => {
    const xa = sx < 0 ? 250 : 1670, xb = sx < 0 ? 562 : 1358;
    const path = new Path2D(); path.moveTo(xa, 232); path.lineTo(xb, 200); path.lineTo(xb, 600); path.lineTo(xa, 568); path.closePath();
    ctx.fillStyle = '#15181C'; ctx.fill(path);
    ctx.save(); ctx.clip(path); ctx.globalAlpha = .9 * lit;
    for (let k = -6; k < 10; k++) { const x0 = Math.min(xa, xb) + k * 60 + ((t * 40) % 60) * (sx < 0 ? 1 : -1); ctx.fillStyle = 'rgba(242,207,29,.18)'; ctx.beginPath(); ctx.moveTo(x0, 200); ctx.lineTo(x0 + 22, 200); ctx.lineTo(x0 - 178, 600); ctx.lineTo(x0 - 200, 600); ctx.fill(); }
    ctx.globalAlpha = lit; const mx = (xa + xb) / 2;
    if (sx < 0) { text('12–18', mx, 400, F.b8(110), C.paper, 'center', 2); text('OCT 2026', mx, 462, F.b8(46), C.lemon, 'center', 6); }
    else { text('WEEK', mx, 380, F.b8(54), C.paper, 'center', 10); text('42', mx, 486, F.b8(130), C.lemon, 'center', 2); }
    ctx.restore();
    ctx.strokeStyle = '#2A2E35'; ctx.lineWidth = 4; ctx.stroke(path);
  };
  side(-1); side(1);
  // 中屏：报道画面（离屏）
  const pg = PANEL; ctx.fillStyle = '#000'; ctx.fillRect(pg.x - 10, pg.y - 10, pg.w + 20, pg.h + 20);
  ctx.globalAlpha = lerp(.25, 1, lit); ctx.drawImage(OFF, pg.x, pg.y, pg.w, pg.h); ctx.globalAlpha = 1;
  ctx.strokeStyle = '#2A2E35'; ctx.lineWidth = 4; ctx.strokeRect(pg.x - 10, pg.y - 10, pg.w + 20, pg.h + 20);
  // 地面：光面 + 倒影 + 透视线
  const fl = ctx.createLinearGradient(0, 660, 0, 1500); fl.addColorStop(0, '#15181C'); fl.addColorStop(1, '#08090A');
  ctx.fillStyle = fl; ctx.fillRect(-400, 660, 2720, 900);
  ctx.save(); ctx.globalAlpha = .16 * lit; ctx.translate(0, 706); ctx.scale(1, -.55); ctx.drawImage(OFF, pg.x, -pg.h, pg.w, pg.h); ctx.restore();
  const rf = ctx.createLinearGradient(0, 700, 0, 960); rf.addColorStop(0, 'rgba(21,24,28,0)'); rf.addColorStop(1, 'rgba(12,13,16,1)'); ctx.fillStyle = rf; ctx.fillRect(-400, 700, 2720, 260);
  ctx.strokeStyle = 'rgba(242,207,29,.07)'; ctx.lineWidth = 2;
  for (let i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(960 + i * 60, 660); ctx.lineTo(960 + i * 520, 1500); ctx.stroke(); }
  for (let k = 1; k < 9; k++) { const y = 660 + Math.pow(k / 8, 2) * 840; ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(2320, y); ctx.stroke(); }
  ctx.fillStyle = C.lemon; ctx.globalAlpha = .55 * lit; ctx.fillRect(-400, 658, 2720, 3); ctx.globalAlpha = 1;
  ctx.restore();
  // 主播台（前景，视差更大）
  const sd = Math.pow(s, 1.9), dy = Cy + (800 - P0[1]) * sd;
  if (dy < H + 400) {
    ctx.save(); ctx.translate(Cx, dy); ctx.scale(sd, sd);
    const top = new Path2D(); top.moveTo(-430, -40); top.quadraticCurveTo(0, -78, 430, -40); top.lineTo(470, 0); top.quadraticCurveTo(0, -30, -470, 0); top.closePath();
    const tg = ctx.createLinearGradient(0, -78, 0, 0); tg.addColorStop(0, '#2B3038'); tg.addColorStop(1, '#1C1F24');
    ctx.fillStyle = tg; ctx.fill(top);
    const front = new Path2D(); front.moveTo(-470, 0); front.quadraticCurveTo(0, -30, 470, 0); front.lineTo(440, 170); front.quadraticCurveTo(0, 150, -440, 170); front.closePath();
    const fg = ctx.createLinearGradient(0, -30, 0, 170); fg.addColorStop(0, '#16191D'); fg.addColorStop(1, '#0C0D10');
    ctx.fillStyle = fg; ctx.fill(front);
    ctx.save(); ctx.clip(front);
    ctx.fillStyle = C.lemon; ctx.globalAlpha = lit; ctx.beginPath(); ctx.moveTo(-470, 4); ctx.quadraticCurveTo(0, -26, 470, 4); ctx.lineTo(470, 12); ctx.quadraticCurveTo(0, -18, -470, 12); ctx.fill(); ctx.globalAlpha = 1;
    ctx.restore();
    plate(-190, 80, .3, -1, 1); wordmark(-80, 98, 40, 'left');
    ctx.restore();
  }
  // 镜头暗角
  vignette(.45);
}
// 开场：1.5–3.0 灯亮 + 推进视频墙；收尾：45.8–46.9 从视频墙拉回全景
const RUN_OPEN = t => rundown(t - .1, false), RUN_CLOSE = t => rundown(t - 7.8, true);
function shotStudioOpen(t) {
  const s = lerp(1, SFULL, Math.pow(eio(seg(t, 1.55, 3.0)), 1.15)), lit = eo(seg(t, 1.45, 1.95));
  if (s >= SFULL - 1e-3) { RUN_OPEN(t); return; }
  studio(t, s, RUN_OPEN, t, lit);
}
function shotStudioClose(t) {
  const k = eio(seg(t, 46.3, 47.4)), s = lerp(SFULL, 1.04, k) - .03 * seg(t, 47.4, 48.0);
  if (k <= 0) { RUN_CLOSE(t); return; }
  studio(t, s, RUN_CLOSE, t, 1);
}

// ============ 条目 bumper：柠檬黄百叶合拢 → 条目号 → 百叶拉开（1.0 s）============
const BUMPS = [
  { a: 6.5, n: '01', cn: '模型', en: 'MODELS', d: 'TUE 13 OCT 2026' },
  { a: 15.0, n: '02', cn: '市场', en: 'MARKETS', d: 'THU 15 OCT 2026' },
  { a: 28.5, n: '03', cn: '监管', en: 'POLICY', d: 'WED 14 OCT 2026' },
];
function bumper(t, B, prevFn, nextFn) {
  const u = t - B.a, NS = 6, sh = H / NS;
  (u < .5 ? prevFn : nextFn)(t);        // 下面的画面：前半是上一镜，后半是下一镜
  const cin = seg(u, .24, .4);
  for (let i = 0; i < NS; i++) {
    const kin = eio(seg(u, i * .03, .22 + i * .03)), kout = eio(seg(u, .7 + i * .03, .92 + i * .03));
    if (kin <= 0 || kout >= 1) continue;
    const x0 = lerp(W, 0, kin) - kout * W;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, i * sh, W, sh + 1); ctx.clip();
    ctx.fillStyle = i % 2 ? C.lemon : C.lemonL; ctx.fillRect(x0, i * sh, W, sh + 1);
    ctx.fillStyle = C.ink; ctx.fillRect(x0, i * sh, 10, sh + 1);
    if (cin > 0) { ctx.translate(x0, 0); bumperCard(u, B, cin); }   // 条目内容切成六条，跟着各自的百叶走
    ctx.restore();
  }
}
function bumperCard(u, B, cin) {
  const s = back(cin, 2.2);
  ctx.save(); ctx.translate(150, 700); ctx.scale(s, s); text(B.n, 0, 0, F.b8(520), C.ink, 'left', -6); ctx.restore();
  const nw = tw(B.n, F.b8(520), -6) + 190, k2 = eo(seg(u, .3, .44));
  ctx.globalAlpha = k2;
  text(B.cn, nw + (1 - k2) * 80, 470, F.sc9(150), C.ink, 'left', 6);
  text(B.en, nw + 6 + (1 - k2) * 120, 560, F.b8(80), C.ink, 'left', 10);
  ctx.fillStyle = C.ink; ctx.fillRect(nw + 6, 600, 520 * eo(seg(u, .34, .54)), 6);
  text(B.d, nw + 6, 660, F.mono(30), C.ink, 'left', 4);
  for (let i = 0; i < 3; i++) { const on = String(i + 1).padStart(2, '0') === B.n; ctx.fillStyle = on ? C.ink : 'rgba(18,20,23,.25)'; ctx.fillRect(nw + 6 + i * 74, 700, 62, 14); }
  ctx.globalAlpha = 1;
}

// ============ 定位小地图：东亚 → 朝鲜半岛，首尔点亮 ============
let AS = null, AP = null;
function buildAsia() { AP = []; for (const id in AS.countries) { const c = AS.countries[id], p = new Path2D(); for (const r of c.rings) { r.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath(); } AP.push({ kr: c.kr, p }); } }
function shotLocator(t) {
  ctx.fillStyle = '#0D0F12'; ctx.fillRect(0, 0, W, H);
  const [sx, sy] = AS.seoul, z = eio(seg(t, 15.9, 17.3));
  const S = lerp(.26, .92, z), O = [lerp(1060, 860, z), lerp(470, 500, z)], F0 = [lerp(260, sx, z), lerp(-60, sy, z)];
  const tf = (x, y) => [O[0] + (x - F0[0]) * S, O[1] + (y - F0[1]) * S];
  ctx.save(); ctx.setTransform(S, 0, 0, S, O[0] - F0[0] * S, O[1] - F0[1] * S);
  ctx.strokeStyle = 'rgba(244,241,232,.05)'; ctx.lineWidth = 1 / S;
  for (let x = -4000; x <= 4000; x += 250) { ctx.beginPath(); ctx.moveTo(x, -3000); ctx.lineTo(x, 3000); ctx.stroke(); }
  for (let y = -3000; y <= 3000; y += 250) { ctx.beginPath(); ctx.moveTo(-4000, y); ctx.lineTo(4000, y); ctx.stroke(); }
  const kk = seg(t, 16.0, 16.3);
  for (const c of AP) {
    ctx.fillStyle = c.kr ? (kk > 0 ? mixc('FFFFFF', 'F2CF1D', kk) : C.ink3) : C.ink3; ctx.fill(c.p);
    ctx.strokeStyle = c.kr && kk > 0 ? 'rgba(18,20,23,.9)' : 'rgba(150,156,166,.5)'; ctx.lineWidth = 1.1 / S; ctx.stroke(c.p);
  }
  ctx.restore();
  const D = tf(sx, sy), da = eo(seg(t, 16.12, 16.35));
  if (da > 0) {
    const rb = seg(t, 16.12, 16.7); if (rb < 1) { ctx.strokeStyle = `rgba(242,207,29,${1 - rb})`; ctx.lineWidth = 6 * (1 - rb) + 1; ctx.beginPath(); ctx.arc(D[0], D[1], 20 + rb * 260, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(D[0], D[1], 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(D[0], D[1], 7, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = da;
    const lx = D[0] - 40, ly = D[1] - 150, lw = 26 + tw('首尔', F.sc9(40)) + 14 + tw('SEOUL', F.b8(36), 3) + 22;
    ctx.strokeStyle = C.lemon; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(D[0], D[1] - 12); ctx.lineTo(D[0] - 20, ly + 64); ctx.stroke();
    ctx.fillStyle = 'rgba(18,20,23,.94)'; ctx.fillRect(lx - lw + 40, ly, lw, 64); ctx.fillStyle = C.lemon; ctx.fillRect(lx - lw + 40, ly, 6, 64);
    const w1 = text('首尔', lx - lw + 62, ly + 46, F.sc9(40), C.white, 'left', 0, 'seoul'); text('SEOUL', lx - lw + 62 + w1 + 14, ly + 45, F.b8(36), C.lemon, 'left', 3);
    ctx.globalAlpha = 1;
  }
  const ca = eo(seg(t, 16.55, 16.8));
  if (ca > 0) {
    const x = 150, y = 230; ctx.globalAlpha = ca;
    text('KOREA EXCHANGE · 15 OCT 2026', x, y, F.mono(22), C.gold, 'left', 3);
    ctx.save(); ctx.beginPath(); ctx.rect(0, y + 10, 900, 130); ctx.clip();
    text('KOSPI', x - 4, y + 120 + (1 - ca) * 120, F.b8(130), C.white, 'left', 4);
    ctx.restore();
    text('韩国综合股价指数', x, y + 176, F.sc9(40), C.white, 'left', 2);
    ctx.globalAlpha = 1;
  }
}

// ============ 引语卡：官方原话 + 出处 ============
// QUOTE 在核实后填入（见 FACTS.md）；引号先落，字逐行从下推入
let QUOTE = {
  a: 38.55, stamp: 42.1, ul: 40.85,
  lines: ['Our AI Office has started', 'enforcing these rules …'],
  cn: '欧盟 AI 办公室已经开始执行这些规则',
  who: 'HENNA VIRKKUNEN · EUROPEAN COMMISSION',
  src: 'SPEECH · INTERNATIONAL AI SUMMIT, DUBLIN · 14 OCT 2026',
};
function shotQuote(t) {
  studioBg(t);
  if (!QUOTE) return;
  const zq = lerp(1, 1.035, eio(seg(t, 38.5, 43.7)));
  ctx.save(); ctx.translate(900, 420); ctx.scale(zq, zq); ctx.translate(-900, -420);
  // 旁白说到 "enforcement" 时，柠檬黄下划线扫过第二行的 enforcing
  const ul = eio(seg(t, QUOTE.ul, QUOTE.ul + .35));
  if (ul > 0) { ctx.fillStyle = C.lemon; ctx.fillRect(370, 300 + 120 + 18, tw('enforcing', F.b8(112), 1) * ul, 10); }
  const a = QUOTE.a, x = 220;
  const qk = seg(t, a, a + .25);
  if (qk > 0) { const s = back(qk, 2.4); ctx.save(); ctx.translate(x - 40, 250); ctx.scale(s, s); text('“', -30, 150, F.b8(340), C.lemon, 'left'); ctx.restore(); }
  QUOTE.lines.forEach((L, i) => {
    const k = eo(seg(t, a + .2 + i * .18, a + .5 + i * .18)); if (k <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 190 + i * 120, W, 130); ctx.clip();
    text(L, x + 150, 300 + i * 120 + (1 - k) * 120, F.b8(112), C.white, 'left', 1, 'q' + i); ctx.restore();
  });
  const n = QUOTE.lines.length, ya = 300 + n * 120 + 10;
  const zk = eo(seg(t, a + .6, a + .9));
  ctx.globalAlpha = zk; text(QUOTE.cn, x + 150, ya + 20, F.sc9(44), C.lemon, 'left', 1, 'qcn');
  ctx.fillStyle = C.gold; ctx.fillRect(x + 150, ya + 60, 60 * zk, 4);
  text(QUOTE.who, x + 150, ya + 110, F.b8(34), C.paper, 'left', 2, 'qwho');
  text(QUOTE.src, x + 150, ya + 150, F.mono(20), C.grey2, 'left', 2, 'qsrc');
  ctx.globalAlpha = 1;
  if (QUOTE.stamp) {
    const sk = seg(t, QUOTE.stamp, QUOTE.stamp + .16);
    if (sk > 0) {
      const s = 1 + .9 * (1 - eo(sk)); ctx.save(); ctx.translate(1530, 640); ctx.rotate(-.1); ctx.scale(s, s); ctx.globalAlpha = clamp(sk * 3);
      ctx.fillStyle = 'rgba(18,20,23,.94)'; ctx.fillRect(-230, -54, 460, 108);
      ctx.strokeStyle = C.lemon; ctx.lineWidth = 4; ctx.strokeRect(-220, -44, 440, 88); ctx.lineWidth = 1.5; ctx.strokeRect(-212, -36, 424, 72);
      const w1 = tw('已开始执法', F.sc9(46)), w2 = tw('ENFORCING', F.b8(44), 3), st = -(w1 + 18 + w2) / 2;
      text('已开始执法', st, 16, F.sc9(46), C.lemon, 'left', 0); text('ENFORCING', st + w1 + 18, 15, F.b8(44), C.paper, 'left', 3);
      ctx.restore();
      const rr = seg(t, QUOTE.stamp + .05, QUOTE.stamp + .5); if (rr < 1) { ctx.strokeStyle = `rgba(242,207,29,${.8 * (1 - rr)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(1530, 640, 200 + rr * 160, 70 + rr * 60, -.1, 0, Math.PI * 2); ctx.stroke(); }
    }
  }
  ctx.restore();
}

// 落版
function shotEnd(t) {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1A1D22'); g.addColorStop(1, '#0E1013');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(244,241,232,.04)';
  for (let x = 40 - (t * 10) % 48; x < W; x += 48) for (let y = 24; y < H; y += 48) ctx.fillRect(x, y, 2, 2);
  ctx.fillStyle = C.lemon; ctx.beginPath(); ctx.moveTo(1260, 0); ctx.lineTo(1290, 0); ctx.lineTo(1150, 790); ctx.lineTo(1120, 790); ctx.fill();
  ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(1300, 0); ctx.lineTo(1306, 0); ctx.lineTo(1166, 790); ctx.lineTo(1160, 790); ctx.fill();
  const m = (a, b) => eo(seg(t, a, b));
  const r = (y, h, k, fn) => { if (k <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(0, y - h, 1120, h + 30); ctx.clip(); ctx.translate(0, (1 - k) * (h + 30)); fn(); ctx.restore(); };
  const x = 150;
  ctx.globalAlpha = m(39.1, 39.3); text('LEMO AI NEWS · WEEK 42 · 12–18 OCT 2026', x, 210, F.mono(24), C.gold, 'left', 3, 'e0'); ctx.globalAlpha = 1;
  r(350, 130, m(39.12, 39.42), () => text('本周 AI 三件事', x - 4, 350, F.sc9(120), C.white, 'left', 4, 'e1'));
  r(440, 80, m(39.25, 39.52), () => text('The Week in AI', x, 440, F.b6i(76), C.lemon, 'left', 2, 'e2'));
  const lk = eio(seg(t, 39.4, 39.7)); ctx.fillStyle = C.lemon; ctx.fillRect(x, 482, 880 * lk, 2);
  ctx.globalAlpha = m(39.55, 39.8); text('LEMO AI NEWS · 电视新闻包装 BROADCAST NEWS PACKAGE', x, 548, F.sc7(30), C.white, 'left', 1, 'e3'); ctx.globalAlpha = 1;
  ctx.globalAlpha = m(39.65, 39.9); text('LemoLab × Claude Opus 5.5', x, 604, F.b6(38), C.gold, 'left', 1.5, 'e4'); ctx.globalAlpha = 1;
  const sm = m(39.8, 40.1); ctx.globalAlpha = sm;
  ctx.fillStyle = C.line; ctx.fillRect(x, 830, 1620, 1);
  text('新闻来源：Google · Korea Herald · Bloomberg · Euronews', x, 868, F.sc7(21), C.grey, 'left', 0, 'e5');
  text('数据：韩国交易所 · 讲话原文：欧盟委员会', x, 900, F.sc7(21), C.grey, 'left', 0, 'e5b');
  text('配乐采样 VSCO 2 CE、VCSL（CC0）· 地图 Natural Earth（公有领域）', x, 932, F.sc7(21), C.grey, 'left', 0, 'e6');
  text('字体 Noto Sans SC、Barlow Condensed、IBM Plex Mono（OFL）', x, 964, F.sc7(21), C.grey, 'left', 0, 'e6b');
  text('配音 Kokoro（Apache 2.0）· 机房、晶圆背景为 AI 生成示意', x, 996, F.sc7(21), C.grey, 'left', 0, 'e7');
  ctx.globalAlpha = 1;
  // 台标
  const la = m(39.3, 39.6); ctx.globalAlpha = la;
  plate(1600, 360, .62, seg(t, 40.0, 40.45) || -1, seg(t, 39.3, 39.8));
  wordmark(1600, 520, 48, 'center', 'e8');
  ctx.globalAlpha = 1;
}

// ============ 合成 ============
function wipeBand(bx) { ctx.fillStyle = C.lemon; ctx.fillRect(bx - 84, 0, 84, H); ctx.fillStyle = C.ink; ctx.fillRect(bx, 0, 5, H); ctx.fillStyle = C.gold; ctx.fillRect(bx + 5, 0, 14, H); }
function wipe(t, a, b, oldFn, newFn) {
  const bx = lerp(-140, W + 140, eio(seg(t, a, b)));
  newFn(t);
  ctx.save(); ctx.beginPath(); ctx.rect(bx, 0, W, H); ctx.clip(); oldFn(t); ctx.restore();
  wipeBand(bx);
}
// 旧镜头函数里的时间是定稿版的绝对时间，这里按段平移
const TYPE = t => shotType(t - 1.5), PRICE = t => shotPrice(t - 1.5);
const KOSPI = t => shotKospi(t - 4.5), CHIPS = t => shotChips(t - 4.5);
const EUMAP = shotEU, END = t => shotEnd(t - 9.0);
const SCENES = [
  [1.5, shotStudioOpen], [7.5, TYPE], [10.5, PRICE], [16.0, shotLocator], [17.5, KOSPI], [24.5, CHIPS],
  [29.5, EUMAP], [38.5, shotQuote], [44.0, shotStudioClose], [48.0, END],
];
const SC_BUMP = [[BUMPS[0], shotStudioOpen, TYPE], [BUMPS[1], PRICE, shotLocator], [BUMPS[2], CHIPS, EUMAP]];
function scene(t) {
  if (t < 1.5) {
    if (t >= 1.2) wipe(t, 1.2, 1.5, shotSting, shotStudioOpen); else shotSting(t);
    stingLogo(t); return;
  }
  const b = SC_BUMP.find(([B]) => t >= B.a && t < B.a + 1);
  if (b) { bumper(t, b[0], b[1], b[2]); return; }
  if (t >= 43.7 && t < 44.0) { wipe(t, 43.7, 44.0, shotQuote, shotStudioClose); return; }
  if (t >= 47.7 && t < 48.0) {   // 斜面擦除进落版
    shotStudioClose(t);
    const k = eio(seg(t, 47.7, 48.0)); const x = W - k * (W + 340);
    ctx.save(); ctx.beginPath(); ctx.moveTo(x + 340, 0); ctx.lineTo(W + 340, 0); ctx.lineTo(W + 340, H); ctx.lineTo(x, H); ctx.closePath(); ctx.clip(); END(48.0); ctx.restore();
    ctx.fillStyle = C.lemon; ctx.beginPath(); ctx.moveTo(x + 340, 0); ctx.lineTo(x + 380, 0); ctx.lineTo(x + 40, H); ctx.lineTo(x, H); ctx.fill();
    return;
  }
  let fn = SCENES[0][1]; for (const [a, f] of SCENES) if (t >= a) fn = f;
  fn(t);
}
function render(t) {
  TX = []; t_ = t;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  scene(t);
  cornerTag(t); bug(t); strap(t); credit(t);
  if (t > 53.2) { ctx.fillStyle = `rgba(0,0,0,${seg(t, 53.2, 53.9)})`; ctx.fillRect(0, 0, W, H); }
}

// —— 事件（音效 / 旁白），events.mjs 导出给 mix.py ——
const sh = (d, L) => L.map(e => ({ ...e, t: Math.round((e.t + d) * 1000) / 1000 }));
const EV = [
  { t: .04, type: 'swish' }, { t: .4, type: 'stab' }, { t: .9, type: 'glint' }, { t: 1.2, type: 'whoosh' },
  { t: 1.5, type: 'lights' }, { t: 2.3, type: 'push' },
  ...sh(.1, [{ t: 1.6, type: 'tab' }, { t: 2.0, type: 'slide' }, { t: 2.6, type: 'slide' }, { t: 3.0, type: 'row' }, { t: 3.5, type: 'row' }, { t: 4.0, type: 'row' }, { t: 5.1, type: 'blip' }]),
  ...BUMPS.map(B => ({ t: B.a, type: 'bump' })),
  ...sh(1.5, [{ t: 6.2, type: 'slam' }, { t: 6.5, type: 'slam' }, { t: 7.0, type: 'slam' }, { t: 7.5, type: 'stamp' },
    ...Array.from({ length: 24 }, (_, i) => ({ t: 8.0 + i * (.6 / 24), type: 'key' })),
    { t: 9.0, type: 'card' }, { t: 9.2, type: 'flap' }, { t: 9.4, type: 'flap' }, { t: 9.9, type: 'flap' }, { t: 9.9, type: 'swap' }, { t: 10.1, type: 'flap' }, { t: 10.45, type: 'ding' }]),
  { t: 7.55, type: 'hit' }, { t: 16.15, type: 'pulse' }, { t: 16.55, type: 'slide' }, { t: 16.0, type: 'zoom' },
  { t: 17.2, type: 'market', dur: 7.3 },
  ...sh(4.5, [{ t: 13.05, type: 'draw' }, ...[1, 2, 3, 4, 5, 6].map(d => ({ t: 14.15 + (d - 1) * .3, type: 'drop', d })), { t: 16.5, type: 'boom' }, ...Array.from({ length: 10 }, (_, i) => ({ t: 16.6 + i * .04, type: 'roll' })), { t: 17.35, type: 'stamp' },
    { t: 20.0, type: 'card' }, { t: 20.05, type: 'swap' }, { t: 20.3, type: 'fall' }, { t: 20.8, type: 'fall' }, { t: 21.5, type: 'ding' }]),
  { t: 29.85, type: 'pulse' }, { t: 30.3, type: 'zoom' }, { t: 30.9, type: 'pop' }, { t: 31.6, type: 'zoom' },
  { t: 32.1, type: 'paper' }, { t: 33.0, type: 'paper' }, { t: 34.2, type: 'swap' }, { t: 34.65, type: 'mark' }, { t: 35.2, type: 'mark' }, { t: 36.1, type: 'ding' },
  { t: 38.55, type: 'swap' },
  { t: 38.5, type: 'card' }, { t: 38.55, type: 'quote' }, { t: 40.85, type: 'mark' }, { t: 42.1, type: 'stamp_big' },
  { t: 43.7, type: 'whoosh' }, ...sh(7.8, [{ t: 37.0, type: 'tick_ok', i: 0 }, { t: 37.5, type: 'tick_ok', i: 1 }, { t: 38.0, type: 'tick_ok', i: 2 }]), { t: 46.3, type: 'pull' },
  { t: 47.7, type: 'whoosh' }, { t: 48.0, type: 'end' },
];
const VO_AT = { v1: 1.6, v2: 7.6, v3: 16.4, v4: 24.6, v5: 29.6, v6: 34.2, v7: 38.7, v8: 44.1 };
for (const id in VO_AT) EV.push({ t: VO_AT[id], type: 'vo', id });

window.DUR = DUR; window.EV = EV; window.render = render; window.TEXTS = t => { render(t); return TX; };
(async () => {
  makeGrain();
  const names = ['datacenter', 'wafer'];
  const [imgs, eu, as] = await Promise.all([Promise.all(names.map(n => loadImg(`assets/plate_${n}.jpg`))), fetch('assets/europe.json').then(r => r.json()), fetch('assets/eastasia.json').then(r => r.json())]);
  names.forEach((n, i) => IM[n] = imgs[i]); EU = eu; AS = as;
  buildMap(); buildAsia();
  for (const c of MP) if (c.eu) EV.push({ t: Math.round((EUT.light + c.d / 3600 * .8) * 1000) / 1000, type: 'tick' });
  await Promise.all([F.sc9(40), F.sc7(40), F.b8(40), F.b6(40), F.b6i(40), F.mono(40)].map(f => document.fonts.load(f, '本周 Aa')));
  render(0); window.READY = true;
})();

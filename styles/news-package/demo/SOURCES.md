# SOURCES · Broadcast News Package demo

This film uses no third-party footage or photographs. Everything on screen is drawn in code, except two illustrative plates generated for the earlier cut. Facts and their sources, with quoted wording, are in [`FACTS.md`](FACTS.md).

## Data and documents (facts, not creative works)

| What | Where | Licence / status | Used for |
|---|---|---|---|
| KOSPI daily closes, 8 May – 20 Oct 2026 | Korea Exchange index data via Naver Finance chart API, https://api.stock.naver.com/chart/domestic/index/KOSPI?periodType=dayCandle (raw: `data/kospi_raw_naver_api.json`, `data/kospi_raw_naver_mobile.json`; table: `data/kospi_daily.csv`) | market data (facts); source credited on screen ("KRX DATA VIA NAVER") | the line chart, 15 Sep – 15 Oct (19 closes) |
| Gemini API changelog; Gemini latest-model page; blog.google "Gemini 4 Argon" | ai.google.dev, blog.google | quoted for facts only; no images or logos used | story ① |
| Korea Herald, Korea Times, Bloomberg (headline + summary) | see FACTS.md | quoted for facts only | story ② |
| Euronews (Luca Bertuzzi, 14 Oct 2026); European Commission Press Corner speech_26_2150 (14 Oct 2026) | see FACTS.md | quoted for facts; the quote card sets 9 words of the Commission's speech in type | story ③ |

## Picture

| Asset | Source | Licence | Notes |
|---|---|---|---|
| Country outlines (Europe, East Asia) | Natural Earth 1:50m Admin 0, via world-atlas 2.0.2 `countries-50m.json` (https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json), projected in `tools/prep.py` | public domain (Natural Earth); world-atlas package ISC | `assets/europe.json`, `assets/eastasia.json` |
| `gen/plate_datacenter.png`, `gen/plate_wafer.png` | Codex CLI image_gen, prompts in `tools/gen_plates.sh` (generated 2026-10-19 for the earlier cut, copied unchanged) | AI-generated; no text, logos, people or real places | graded duotone in `tools/prep.py`; tagged "ILLUSTRATION / 示意 · AI 生成画面" whenever on screen |
| `gen/plate_hall.png` | same | — | not used (a generated conference hall would read as the Dublin venue) |
| Studio set, desk, video wall, charts, maps, documents, quote card, stamps, LEMO plate | drawn in `main.js` | — | LEMO AI NEWS is LemoLab's own brand |

## Sound

| Asset | Source | Licence |
|---|---|---|
| Orchestral samples | VS Chamber Orchestra: Community Edition, Versilian Studios / Sam Gossner (github.com/sgossner/VSCO-2-CE) | CC0 1.0 |
| Percussion and glockenspiel samples | Versilian Community Sample Library (github.com/sgossner/VCSL) | CC0 1.0 |
| Foley | synthesised in code (`core/audio/sfx.py`) | — |
| Voice | Kokoro-82M, voice `af_heart`, via kokoro-onnx (`core/tts/tts.py`) | Apache 2.0 |

## Fonts

Noto Sans SC 900/700, Barlow Condensed 800/600/600 italic, IBM Plex Mono 500 — SIL Open Font License 1.1, subset from Google Fonts by `tools/fonts.sh`.

## Finding footage for your own film

`tools/footage.py` (copied from the library's trial kit) searches Wikimedia Commons, Internet Archive and NASA, downloads, and logs licence, author, page and the seconds used into `SOURCES.jsonl` / `SOURCES.md`. This demo did not need it; see STYLE.md §10.

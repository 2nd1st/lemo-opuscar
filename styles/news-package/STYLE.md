# Broadcast News Package — Style Prompt

> A television newsroom's on-air package, built entirely in code: a sting that becomes the channel bug, a virtual studio whose video wall the camera pushes through, a rundown of today's stories, numbered bumpers between them, a lower-third strap that never leaves the bottom of the frame, and full-frame graphics (split-flap price boards, a line breaking a threshold, locator maps, documents flying out of a city, quote cards, stamps) that carry the facts. The style is the **package system plus its cutting rules**, not a drawing style. 16:9, a clean frame: no burned-in subtitles, no news crawl.
> References (grammar only): evening network news openings (virtual set, video wall, headline menu), financial-channel market graphics, European news channels' explainer maps, the numbered item bumpers of a bulletin. Never copy a broadcaster's logo, set, fonts, colours, music or idents, and never name them in the film.

## 1. Essence, and what it is not

1. **One package system, used consistently.** Every graphic is built from the same few parts: a brand plate (parallelogram), a tab in the accent colour, a paper strap, ink cards with an accent top edge, mono datelines, stamps. Viewers read the system before they read the words.
2. **The bulletin's order.** Sting → studio → rundown ("today we have three stories") → numbered item → … → back to the rundown, ticked off → sign-off. Each item opens with its number and category.
3. **One fact per screen.** A full-frame graphic states one thing: the price, the break, the two stocks, the place, the two letters, the quote, the verdict.
4. **The strap holds the headline.** One lower-third strap is on screen from the first story to the recap and changes its words with a vertical flip; the picture above it is free for the graphic.
5. **Clean panel.** No crawl, no burned-in subtitles; subtitles ship as a separate `.srt`. The frame is the graphic, the strap, the bug and a source line.

Not **Caption News** (that is captions-first social video: huge slammed captions are the lead, no studio, no strap, no bumpers; here type is small and orderly and the graphics lead). Not **Data Storytelling** (one chart per beat, never a dashboard; the chart is an insert in a bulletin). Not a keynote: no centred title-and-bullets, no page turns.

## 2. Frame and layout (1920×1080)

| Zone | Position | Content |
|---|---|---|
| Content | x 96–1824, y 56–840 | the full-frame graphic; when a strap is up, nothing important below y 840 |
| Lower-third strap | tab x 96 y 856, 48 high; strap x 96 y 904, 1250×104, + 120 px ink end block | category tab (accent, ink text, Chinese + English), headline in Chinese 50 px + one English line 27 px |
| Source line | right-aligned at x 1836, y 950 / 978 | `SOURCE: …` mono 13 px + Chinese 16 px, 75 % opacity; English ≤ 36 characters or it slides under the strap's end block |
| Channel bug | top right, plate centre (1739, 86), 0.327 of the sting plate | the plate plus `AI NEWS` |
| Corner tag | top left x 96 y 56, 330×64 | `ILLUSTRATION / 示意 · AI 生成画面` on generated plates, `SCHEMATIC / 示意图` on schematic charts; flips in and out 0.2 s |

Content layers sit lower than a subtitled layout would put them (a 60–110 px downward shift) so the bottom strap does not leave an empty band above it. When you remove subtitles and the crawl, re-lay the page; never leave the space they used.

## 3. Package parts (specs)

| Part | Spec | Rules |
|---|---|---|
| Sting | 0–1.5 s | two accent slashes (0.04, 0.10 s) → the plate slams in with an overshoot, an impact ring and shake (0.16–0.42) → letters drop in one by one → wordmark and dateline open from the centre → a glint → the plate flies to the top right and **becomes the bug** while a vertical band wipes into the first shot. A hit within 0.4 s |
| Brand plate | parallelogram 520×180, accent gradient, ink and gold bars at the left, name in condensed 800 | the same object is the sting, the bug, the desk front and the end card |
| Virtual studio | 2D-drawn set: back wall with gold light fins, a lighting truss, a three-panel video wall (two side panels angled), a glossy floor with perspective lines and a reflection, an anchor desk in the foreground | the centre panel shows the next graphic (drawn to an off-screen canvas). Camera push: scale 1 → 1920/panel width, the desk on a steeper parallax (scale^1.9) so it drops out of frame; at full scale the panel *is* the frame and the cut is invisible. The reverse pull closes the bulletin |
| Rundown | left: date block (big numerals, month, week); right: three rows, 1024×140, number block in accent | rows flip in vertically on the beat (back ease) with a glint; at the close the same object returns and each row is ticked |
| Bumper | 1.0 s: six accent slats close in from the right (staggered 0.03 s), the item number in condensed 800 at 520 px slams, category Chinese 150 px + English, dateline, three progress pips; slats exit to the left | one per item, between items; the strap stays on top and changes its tab while the bumper covers the frame |
| Lower-third strap | see §2 | enters with the first story, flips (new words up from below, old up and out, 0.32 s; the tab flashes white when the category changes), leaves with a slide when the recap starts. A **profile** version (tab `人物 PROFILE`) names a speaker |
| Split-flap board | tiles 220×130, top and bottom halves clipped separately | old value and new value on the same board, so the change reads in one look; ×2 / +x % called out to the right |
| Threshold chart | line from the peak, the threshold as a dashed gold line | the line head advances one trading day per step; the last step crosses the threshold in accent with a shake and a ring; the readout panel slides in after; axes show only what the data supports |
| Bars | grow from a zero line downward for losses, values roll | a reference line at the shared threshold plus a badge |
| Locator map | Natural Earth countries, Lambert azimuthal equal-area centred on the region, a faint graticule | the country flashes white then accent; the city dot rings; a label with leader; the push in is one move (≈1.5 s) |
| Explainer map | the same projection, one long take | members light in order of distance from the city; the city label, the institution label with leader, a stamp; the camera pushes, then pans to make room |
| Documents | 380×490 paper, ink header | fly out of the city dot on an arc (0.5 s, scale 0.08 → 1, rotation settles); check boxes tick on the voice's key words |
| Quote card | studio background, a 400 px accent quotation mark lands first, lines push up one by one (0.18 s apart), then the Chinese gist, a gold rule, name, source and date | the official wording, in the language it was said; never paraphrase inside quotation marks |
| Stamps | accent fill or ink with a double accent frame, −6° to −10° | land from 1.9× in 0.16 s with an expanding ellipse; one per story at most |
| Transitions | vertical band wipe (accent 84 px + ink 5 px + gold 14 px edge, 0.3 s) between programme parts; hard cut + timpani inside a story; bumper between stories; slanted wipe into the end card; push/pull through the video wall in and out of the studio | nothing else: no dissolves, no 3D flips, no page turns |

## 4. Colour

| Role | Value | Use |
|---|---|---|
| ink | `#121417` | studio, panels, strap end block |
| ink2 / ink3 | `#1B1E23` / `#22262C` | cards, land on maps |
| accent (lemon) | `#F2CF1D` (light `#F8DE4A`, dark `#D8B30C`) | plate, tabs, band wipe, bumpers, bars, stamps, the line that breaks |
| gold | `#D4B064` | thresholds, datelines, source lines, light fins, badges |
| paper | `#F4F1E8` | strap, documents, the chart line |
| breaking | `#FE6B3D` | only for BREAKING and LIVE. A weekly round-up has neither, so it never appears |

Structure to keep when you change the brand: one accent + one gold-like secondary + paper + ink, and a reserved alarm colour. Ink text on the accent; on paper, English secondary lines in a dark olive (`#6E5A1E`) because gold is too weak there.

## 5. Type

- Chinese: Noto Sans SC 900 (headlines, strap) / 700 (labels).
- Latin: Barlow Condensed 800 (numbers, names, the plate), 600 (secondary lines, quotes), 600 italic (the end-card English title).
- Mono: IBM Plex Mono 500 for datelines, sources, axis labels, all caps with 1–4 px tracking.
- All OFL, subset from Google Fonts by `demo/tools/fonts.sh` (the character list is read from `main.js`; delete `fonts/*.woff2` after a text change). No handwriting faces in this style.
- Every label is bilingual on one line each (Chinese first, English smaller); never wrap.

## 6. Picture layer and grade

- When there is no footage, the picture layer is data graphics drawn in code plus, at most, a few **illustrative plates** (generated or stock), each tagged `ILLUSTRATION` for as long as it is on screen. They set a mood (a server room behind a model launch, a wafer behind chip stocks); they never stand in for the event, the place or the people.
- One grade for every plate: greyscale → auto black/white points (0.5 / 99.6 percentile) → γ 1.05 → 35 % S-curve → black 8, white 232 → duotone `#0E1013` → `#ECE7D8` (`tools/prep.py: grade()`), plus a left-dark ink gradient for type, a 50–55 % vignette and 7 % overlay grain cycling through six tiles. Graphics and the package are never grained.
- Real footage, if you have it, takes the same grade path; modern footage ≤ 1.5× scale, archive ≤ 2.5× after deblocking; crop out station logos.

## 7. Editing grammar

- **120 BPM grid**, beat 0 at the end of the sting (1.5 s). Every cut, bumper and wipe on a beat or half-beat.
- **Shot lengths**: sting 1.5 s; studio 1.5 s before the push lands; bumpers 1.0 s; story shots 1.5–7 s; one long take (10–12 s) as the bulletin's breath; a comparison stays until every item has been fully on screen ≥ 2.5 s.
- **A package action every 0.5–1 s** inside a shot (flip, count, stamp, tick, strap change, map light, line step). No frame flat for more than 1 s; a strong action within 0.5 s of every cut.
- **Date every story**: a weekly bulletin's items happen on different days; the date sits in the bumper, the eyebrow line, the readout or the document.
- **The order inside an item**: where (locator) → what (the number or the line) → who it hits (bars / names) → what the official said (document / quote) → the verdict stamp.

## 8. Sound palette

| Layer | What | Level |
|---|---|---|
| Anchor voice | one narrator (Kokoro `af_heart`, speed 1.0–1.12), one sentence per graphic, starting 0.1 s after the cut; HP 90 Hz, 3:1 compression | music ducked ≈ −7 dB and its 1.2–5 kHz band thinned under speech |
| News theme | 120 BPM, minor key: spiccato violins in root–fifth–octave eighths, pizzicato bass on the beat, horn pads, a low-passed 16th-note saw pulse, kick on 1 and 3, snare on 2 and 4 | full under studio and the first story |
| Section moods | markets: violins down an octave, tremolo, four-on-the-floor kick (heartbeat); policy: pizzicato and horns only | |
| Signature hits | sting tutti; a bumper signal (timpani + brass stab + two glockenspiel notes that rise with the item number); timpani on hard cuts; one bar of silence before the biggest break, then the heaviest hit of the film; a held drone after the verdict stamp | |
| Foley | whoosh on wipes, light clunks when the studio lights up, a long whoosh on the push, slat clicks on bumpers, flap clicks on split-flaps, stamp thump + clack, trading-room ticks under market charts, map clicks per lit country, a sonar ping on a city, paper on documents, click + glockenspiel on ticks | |
| Room | studio room tone, server-room hum under a tech plate, soft air under maps | very low |

Master −14 LUFS, true peak −1.2 dB (`core/render/mux.sh`). Samples: VSCO 2 CE and VCSL (CC0); foley synthesised (`core/audio/sfx.py`).

## 9. Native moves (and where they live in `demo/main.js`)

1. **Sting becomes the bug** — `shotSting()`, `stingLogo()`, `plate()`.
2. **Push through the video wall** — `studio(t, s, wallFn, wallT)`: the wall shows any shot function rendered off-screen (`renderTo()`); at scale `SFULL` the wall is the frame. `shotStudioOpen()` / `shotStudioClose()`.
3. **Rundown, then ticked off** — `rundown(t, close)`.
4. **Numbered bumper** — `bumper(t, B, prevFn, nextFn)`; the strap stays on top.
5. **Strap that never leaves** — `strap(t)` with one `STRAP` group, items flipping.
6. **Split-flap before/after** — `flipTile()`, `shotPrice()`.
7. **Breaking the threshold** — `shotKospi()`: one day per step, silence before the last step, the hit on the crossing.
8. **Locator, then the number** — `shotLocator()` on `assets/eastasia.json`.
9. **City sends the letters** — `shotEU()`, `euView()`, `doc()`: one world→screen function so labels and flying documents stay attached through push and pan.
10. **Quote card + verdict stamp** — `shotQuote()`.

## 10. Material

1. **Ask the user first** for their own material: a recorded anchor or a preferred voice, their logo and colours (the package is rebuilt around them), footage or photos of the event, their data (closing prices, tables), documents to show, music.
2. **Facts.** Every on-screen number and every sentence of the voice comes from an official or reliable source, recorded in `demo/FACTS.md` (claim, URL, quoted wording, any arithmetic). Prefer the primary source (the company's changelog, the exchange's data, the institution's press release) over reports about it; when only reports exist, say "据…报道 / reported by …" on screen.
3. **Data.** Draw charts from real series only; when you have just a few reported numbers, draw a *schematic* line, tag it `SCHEMATIC`, and label only what you know. Exchange closes: the exchange itself, the central bank's statistics portal, or a market-data CSV whose source you log.
4. **Footage and photos, when you want them** (judge each file on its own page, not the search result):
   - **Wikimedia Commons**: CC0, public domain or CC BY (credit author, title, licence on the end card and in `CREDITS`). Not used: CC BY-SA, "no known restrictions", unclear licences, YouTube re-uploads, colourised or "restored" versions.
   - **U.S. federal agencies** (NASA, NOAA, NARA, USGS…): public domain; check the page does not credit a contractor or third party.
   - **Internet Archive**: only items whose page states public domain, CC0 or CC BY; U.S. works published before 1931 are public domain.
   - **Library of Congress / national archives**: read each rights statement; "no known restrictions" is not enough.
   - **Institutions' audiovisual services** (for example the European Commission's): read their reuse terms per item; many require attribution and forbid implying endorsement.
   - **Maps**: Natural Earth (public domain), via `world-atlas` TopoJSON.
5. **Before downloading, tell the user** what you will fetch, from where and under which licence. The finder copied into this style, `demo/tools/footage.py` (`search commons|archive|nasa`, `fetch`, `used`, `md`), logs licence, author, page and the seconds used into `SOURCES.jsonl` and writes `SOURCES.md`. Keep `raw/` under ~1.5 GB.
6. **Generated plates** are allowed only as tagged illustrations behind graphics; never as an event, a place in the news, or a person. No generated anchor.
7. **Logos**: never use a company's logo for a company in the news; set its name in type.
8. **People**: public figures in the news can be named on a profile strap; no close-up or slow motion of private individuals.

## 11. Pitfalls

- **Leftover layout.** Removing subtitles or a crawl without moving the content down leaves a dead band above the strap.
- **Masked type peeking in.** A push-in title clipped by a mask shows its top edge before it moves if the travel distance doesn't clear the mask; start it fully below and don't draw at progress 0.
- **Words stronger than the source.** "Request for information" is not "investigation" or "penalty"; write "no fine, no case opened" or "for the first time" only if a source says so — and check the institution's own pages, which can contradict a report ("first requests" may have gone out months earlier).
- **Thresholds depend on the reference.** "Bear market" = −20 % from *which* high? Name it on the axis ("from September high"); from a different peak the claim can be false.
- **Attribute what only a report says.** When the official source does not name the companies, the graphic carries "据… 报道 / reported by …" and so does the voice.
- **A schematic posing as data.** Rolling counters on a close price flash values that never existed; set the close with a mask push instead. Don't label axes the data doesn't support.
- **Source lines under the strap.** Right-aligned mono 13 px: ≤ 36 characters.
- **Stamps over key words.** A stamp hit can mask the voice ("fines"); take the brass off the stamp and low-pass its clack.
- **Gold on paper** has too little contrast: use ink or dark olive.
- **Generated plates** carry stray corner marks: crop them in `prep.py`.
- **Short preview text.** Rundown rows and bumper titles are previews of the strap and the stories; `readcheck` flags them as short — they recur readably, so leave ornamental previews out of `TEXTS` or accept the flag.
- **Kokoro names.** "Lemo" is read as "Nemo/Limo": write `Lemmo` in the TTS text; "Gemini 4" → `Gemini Four`; "EU's AI" not "E.U.'s A.I.". Speech-to-text hears "Kospi" as "cost be"; put the expected text in the line's `asr` field.

## 12. Variation space

Decide per film: the channel's name, plate and accent colour; how many items (one lead with a long package, three equal items, a five-item round-up); which full-frame graphics each item needs; where the long take goes; the anchor's voice.

- **Three structures:** rundown → items → rundown ticked (round-up); one lead package with a correspondent two-box and a short "also today" grid; a countdown of items (election-night, sports results).
- **Three openings:** sting → studio push; cold open on the biggest graphic, then the sting; headline menu straight after the sting.
- **Three endings:** rundown ticked → pull back to the studio → end card; a "coming up next week" teaser card; the last stamp freezing into the end card.

---

How our demo was made (story, shots, score, end card, build): [DEMO.md](DEMO.md). Read it after your treatment exists.

# Engineering Briefing Board — Style Prompt

> One real whiteboard wall, filmed: window light on enamel, ghosts of erased marker, an aluminium frame and a tray. Cut-out photographs of real things land on it with weight; tags, magnets, a steel ruler and stamps are pinned to it; marker ink draws itself in three colours with fixed meanings. The camera never leaves the wall: it rides the lines from fact to fact, and only at the end pulls back to show the whole briefing at once.
> References (grammar only): explainers filmed on a map wall; the long pull-back over a wall covered in work; drafting conventions (plan above elevation, dimension lines, hatching). Never copy them or name them in the film.

## 1. Essence, and what it is not

1. **A physical board in a room**: enamel, window falloff, a sliding reflection, ghosts of earlier work, frame and tray.
2. **Real things on it**: cut-out photographs a few millimetres off the board, shadowed by one window, parallaxing.
3. **Ink that means something**: graphite for names and rules, blue for water and measurement, red only for the decision; rejected ideas erased to ghosts.
4. **One continuous wall**: no pages; the camera travels along lines, projections and leaders.
5. **The whole wall, once**: every shot is a crop of the final briefing, seen whole only in the last pull-back, as a poster.

Not **Whiteboard Explainer** (`whiteboard`: a visible hand drawing line art on a flat page): here the board is a filmed object and subjects are photographs. Not **Data Storytelling** (`dataviz`: flat charts): comparisons are dimension lines in real units beside real objects. Not **Isometric Infographic**: no 3D icons. Not a keynote: no headers, chapter numbers, centred bullets, "object left, number right", page turns.

## 2. Materials & rendering

- **Board (z 0)**: procedural enamel, wiped ghost strokes, smudges, a window falloff, a sliding diagonal reflection; the frame shadows a warm grey wall.
- **Ink (multiply)**: flat colour at about 90 %, lighter core, round caps; a wet-tip glint rides each stroke. Lettering: a marker font revealed glyph by glyph, with seeded per-glyph tilt, baseline and size jitter. Erasing leaves a blurred ghost (about 7 %) and a little haze.
- **Prints (z ≈ 6–14)**: photographs cut out at full resolution (BiRefNet; polygons for hulls), clean edges, one shared grade (lower saturation, a touch warmer, lifted blacks). Thin structure (stays, cables, hangers) is measured in the photo and redrawn as clean lines in one steel colour. Shadow = blurred silhouette along one light vector, softer the higher the object. **No frame upsamples a photo**: ≥ 1 source px per screen px at its largest, measured; cap the zoom or find a bigger source.
- **Secondary layer** (only where the camera never goes before the end): the photos as pinned prints, a source card, sums on sticky notes, a small sketch. Texture and proof for the final wall, lighter than the main line.
- **Props (z ≈ 8–26)**: magnetic tags, round magnets, a brushed-steel ruler, printed cards, a pitted rubber-stamp impression; the tray (z 70) is nearest the lens.
- **Camera**: perspective scale per height (parallax), optional depth of field, motion blur by averaging sub-frames over a 180° shutter; light grain in ffmpeg. Only subtitles are screen-space.

## 3. Colour logic

- Ground: the enamel and its light falloff; the wall around is neutral warm grey.
- Ink: graphite = names, rules, facts; blue = water and measurement (rivers, dimensions, projection lines, measured numbers); red = the decision (a rejection, the key word of a verdict, the one mark to notice); grey for drafting only (extension lines, ground hatching).
- Red is rare: two or three red marks per frame at most, never on a red object.
- Full colour belongs to the photographs; props stay neutral; a red magnet is a verdict.

## 4. Type & subtitles

- **Marker lettering**: a single-weight marker face, Latin and CJK in one family (ours: LXGW Marker Gothic, OFL, subset — re-run when words change). Content 100–160 board px; a verdict 230–400.
- **Printed labels** (tags, cards, stamps): a sturdy sans (Noto Sans SC 700/900); credit lines in a monospace (IBM Plex Mono). A tag holds one to three words.
- **Subtitles**: a frosted acrylic strip at the bottom centre with a blue marker tick; bilingual films stack primary over secondary (ours: Chinese 42 px over English 29 px). **Each language is one line**: `nowrap`, measured in the page against a 1,500 px safe width; a long line becomes two cues. Key content stays above the strip (bottom 14 %).
- **Reading time**: subtitles ≥ max(1.8 s, speech + 0.6 s); board text stays fully in frame for CJK ÷ 4.5 + other ÷ 15 + 1.5 s from the moment it appears, so the camera rests where words are written. In the final wall the smallest text meant to be read is ≥ 20 px on screen.

## 5. Motion quality

- 24 fps on ones; nothing is stepped.
- Camera: overlapping eased moves, velocity ∝ u^a (1−u)^b (a, b ≈ 1.5–4), so speed and acceleration never jump; b > a gives inertia. A hand-held breath (≤ 3 px) underneath; shake only on an impact.
- Weight: prints are lowered from the camera side, land, bounce and settle as the shadow tightens; two magnets clack on to pin them; tags swing; removed magnets pop toward the lens; struck things jolt and spring back. **The camera meets a landing close**, briefly, on a structural detail (a pylon top, an arch rib, hangers, a pier's foot), then pulls out to the judgement frame.
- Blurred in motion, sharp wherever words are read. No flat second: every 1–2 beats something lands, draws or swings, or the camera drifts; only designed silences go still.
- Ink draws at the speed of a hand; dimension lines draw from one witness line to the other and land with an arrowhead tap.
- Never: dissolves, scale-pops on text, bouncy UI easing, frictionless slides, text fading in by itself.

## 6. Camera grammar

| Move | What it expresses | Can serve |
|---|---|---|
| Ride a line (track with the pen or a dimension) | measuring; "how far does it go?" | a comparison of lengths; a route; a timeline |
| Tilt along projection lines | the same quantity in another view | plan → elevation; a total → its parts |
| Slow push-in, slight Dutch tilt | tension, an approaching problem | a collision; a deadline; an overrun |
| Pull back and sideways | stepping back to state a rule | a constraint; a turn in the argument |
| Whip with the line, overshoot, settle | a result that exceeds | a record; an outlier; a breakthrough |
| Rise along a leader line | from evidence to verdict | a conclusion; a recommendation |
| Staircase framing (each new item with the previous result) | comparison in sequence | rankings; tests; options |
| Judgement frame: the whole item, the limit it is tested against and the verdict, held ≥ 2.5 s | a test the viewer can check | pass / fail against a threshold; a budget against a cap |
| Long pull-back to the whole wall | scale; everything at once | the end of an argument; a summary |

Framing: like a film, not a slide — off-centre, cropped, close. The first frame holds a readable subject; the first strong action hits within 0.5 s. When items are tested against a limit, each gets a judgement frame — wider each time if the items grow — and the verdict lands only after the camera has settled. Before the final reveal, at most about 60 % of the board's width, never both side edges, and never the zone kept for the reveal. Transitions are moves (a line, a projection, a leader, a moving object); no cuts by default, no fades or zoom-to-fit.

## 7. Sound palette

- Room: an air-conditioning bed and traffic through the window, about 20 dB under the voice — audible, not a hiss; silences keep only this.
- The medium's foley: felt-tip squeaks scaled to stroke length, nib taps, magnet clacks (a pitch per magnet in a row), suction pops, print landings (board thump, paper slap, low-end weight), a ruler's ring, eraser felt, a stamp's thud.
- The subject's own sound arrives early as a J-cut.
- Music: a small rhythmic ensemble, walking to brisk — bass, a light kit, wooden percussion, low brass stabs for verdicts (or mallets); no piano-and-strings pad. Landings, stamps and arrows sit on the beat (eighths, sixteenths); divide the beat to accelerate.
- The first sound after a silence is a physical impact or the subject's sound. Voice about 8–10 dB over the music, ducked; −14 LUFS. Voice: calm, briefing-room confident.

## 8. Native moves

- **The whole-wall reveal.** Design the wall as a poster first (hierarchy, a reading path, filling the frame), then plan every shot as a crop of it; keep one zone (secondary layer, verdict, end card) for the reveal alone. *Fits:* a product roadmap; a case laid out as evidence; a household budget.
- **The subject passes through the answer.** The real thing moves through the chosen solution, its sound first; the camera pans with it and the pull-back starts from it. *Fits:* a parcel along the chosen route; a train over the new viaduct.
- **Ride the dimension line.** A quantity is drawn as a real length to one scale; the camera rides the tip and stops where the number stops. *Fits:* battery ranges of four cars; how high each tower crane lifts.
- **Projection lines.** Dashed lines carry an edge from one view to another so two drawings share a scale. *Fits:* a floor plan above a section; a trail map above its elevation profile.
- **Magnets as countable things.** Units clack on in rhythm, pop off when a rule removes them. *Fits:* a staffing plan; seats in a vote; servers cut by an optimisation.
- **Erase to a ghost.** A rejected idea is wiped but stays faintly visible. *Fits:* a first design under its revision; last year's plan under this year's.
- **The stamp.** A verdict lands with a thud and a jolt. *Fits:* approved / rejected options; passed / failed tests; a void clause.
- **The physical answer.** A real prop laid down as the solution. *Fits:* one cable instead of five; the single tool that spans every case.
- **Leader to the verdict.** An arrow from the deciding number to the conclusion, ridden by the camera. *Fits:* the metric that decides a hire; the cheapest option after all costs; the bottleneck in a process.

## 9. Pitfalls of the medium

- **Slide feel.** Headers, margins, centred layouts, "picture left, number right". Fix: write where things are, crop off-centre, one idea per frame.
- **Blur over empty board.** Fix: ride a line or a moving object so the move has content.
- **Text glimpsed in passing** fails the reading time. Fix: place words where the camera rests; frame each new item with the last result.
- **Photos that don't belong together.** Fix: one grade, one light vector, one viewpoint family (elevations together, plan views together).
- **Thin parts lost or stair-stepped** (cables, hangers). Fix: find them with a top-hat sky key, redraw clean lines at the measured positions; continue hangers lost against hills to the deck.
- **Upsampled photos** go soft in close-ups. Fix: full-resolution cuts, large sources, a per-frame check.
- **Weightless landings.** Fix: meet them close on a detail, contact shadow, bounce, pins and clacks.
- **Only close-ups.** The viewer never sees the whole object against the limit and the verdict passes unread. Fix: detail → judgement frame → hold → verdict → move on.
- **A sparse final wall.** Fix: fill the frame; a quiet secondary layer in the zone never visited; no empty middle.
- **Lettering in photos** (signs, gauges, hull names, logos). Fix: paint out, cut, or choose another photo.
- **The wall seen too early** spends the ending. Fix: measure every frame's visible share of the board before rendering.
- **Too small at the end.** Fix: size the hierarchy for the poster; small tags are texture.

## 10. Engine

- `demo/kit/board.js` — the renderer: `setScene`, `renderScene(canvas, t)`, `camAt(t)` (base + Σ eased moves + shakes + breath; `bease(u, a, b)`), elements `print`, `tag`, `magnet`, `ruler`, `card`, `stamp`, `ink` (`line`, `dim`, `write`, `hatch`, `ring`, `wake`; `erase` on any ink; `jolts` on any object), `shade` (passing window shadows), `sceneTexts(t)` for `readcheck.mjs`, `subCheck()` for one-line subtitles. Field reference: `demo/kit/README.md`.
- `demo/kit/batch.mjs` — renders scene JSONs (stills, thumbnails, cards) in one browser; a still `extends` a film's world with its own camera and time.
- `demo/kit/tools/` — cut-outs (`prep_object.py`, `sky_key.py`, `mirror_span.py`, `stretch_span.py`), thin-structure redraws (`redraw_stays.py`, `redraw_suspension.py`, `repair_hangers.py`), `clean_lettering.py`, `make_print.py`, `rebuild_objects.sh`, `fetch_fonts.py`. `demo/scenes/_gen_film.py`: a world as data. Checks in `demo/tools/`: `camcheck.mjs` (visible share, speed), `rescheck.mjs` (source px per screen px), `subcheck.mjs`, `cuecheck.py`, `rhythm_report.py`, `final_asr.py`.

A minimal world that is not ours (two parking options by walking distance; `node demo/kit/batch.mjs park.json`, after `fetch_fonts.py park.json` for new characters):

```json
{ "dur": 6, "t": 5.5, "board": { "w": 4000, "h": 2400 }, "hand": 0, "cam": { "x": 1500, "y": 1000, "z": 0.8, "moves": [] },
  "elements": [
    { "type": "tag", "text": "地下车库", "xy": [560, 800], "size": 60, "arrive": { "t": 0.2, "kind": "swing" } },
    { "type": "ink", "kind": "dim", "from": [700, 900], "to": [1300, 900], "color": "blue", "t": 0.6, "d": 0.6 },
    { "type": "ink", "kind": "write", "text": "120 米", "xy": [1360, 940], "size": 100, "color": "blue", "t": 1.2 },
    { "type": "stamp", "text": "首选", "xy": [1500, 700], "size": 110, "rot": -8, "t": 4.2 } ] }
```

## 11. Variation space

The agent decides per film: structure, which objects are photographed, plan vs elevation, the wall's reading path, opening, ending, camera path, pacing. Users may bring their own photos or generated images; they own those licences (list them in `CREDITS`).

- **Three structures:** one measurement that keeps growing until it breaks a limit; a before/after where the erased first plan stays as a ghost under the second; a checklist stamped item by item as the camera moves down the wall.
- **Three openings:** a stamp on a finished drawing, then back to see why; one number written large, then the line that measures it; a photo dropped onto an empty corner.
- **Three endings:** the wall revealed with the answer circled; back to the opening mark, now corrected; the last tag flipped from a question to an answer, then the pull-back.

---

How our demo was made (story, shots, score, end card, build): [DEMO.md](DEMO.md). Read it after your treatment exists.

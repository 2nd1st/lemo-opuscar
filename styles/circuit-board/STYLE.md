# Circuit Board — Style Prompt

> The subject is drawn as a printed circuit board seen from straight above: the world is copper under green solder mask, routes are traces, places are pads, words are white silkscreen, and what flows (power, water, signals, goods) is light running along the copper. The camera rides that light and jumps between the scale of a map and the scale of a single component.
> References (grammar only): real PCB design files and assembly drawings (layers, clearances, designators, detail callouts); macro photography of boards (shallow depth of field, gold sheen, soft key light); schematic and single-line diagrams (one symbol stands for one function). Draw your own boards: never copy a real board layout, a logo or a part marking.

## 1. Essence, and what it is not

- A top-down board in every frame: copper pour with clearances cut around everything, traces with 0/45/90° runs and mitred corners, gold pads and vias, white monoline silkscreen. Nothing is drawn in perspective.
- Information moves as light on copper. The way the light moves *is* the explanation: a pulse, a stream, a rocking dash, a pad that flashes.
- Two scales on one board: whole regions (a map, a supply chain, a city) are drawn in the same language as single components, and the camera passes between them without changing medium.
- Only real things are drawn. Every trace, pad and label stands for something in the subject; empty copper is filled with what boards really have (stitching vias, via fences, solder-mask mottling), never with decorative routing.
- Not the library's Engineering Briefing Board (a whiteboard on which real photos are pinned and written over in marker): here there are no photos and no handwriting; the subject itself becomes copper, pads and silkscreen, and information travels as light along the traces. Not a blueprint (no white-on-blue linework, no paper), not a sci-fi HUD (no glass, no floating panels, no glowing UI chrome), not a 3D circuit "city" (no buildings rising, no perspective).

## 2. Materials & rendering

Layers bottom-up, all in board space under one world → screen camera:
1. **Laminate (FR-4):** dark green, a glass-weave basket texture in two crossfaded octaves so its on-screen size stays bounded at every zoom. Bottom-layer copper may show through faintly.
2. **Copper pour:** fills the board; everything is a **clearance** punched out of it (channels, lakes, sea, keep-outs around parts and traces). Rendered twice: a lighter rim pass with the plain clearance, then the fill pass with the clearance grown by ~1.6 px, so every copper edge gets a bevelled rim. A soft mottling texture sits only on the pour (solder mask is never perfectly flat).
3. **Traces:** rim colour stroke + narrower fill stroke, round caps; a channel of bare laminate runs on both sides (the clearance). Parallel traces keep the pour out of the gap between them when they are a pair.
4. **Exposed metal:** ENIG-gold pads (rect, round, square pin-1) with a sheen band on the top third and a dark drill hole; vias are gold rings with dark bores; bare copper (salmon with a vertical gradient and brushed streaks) only for one heavy, special part. Fiducials and mounting holes at board corners.
5. **Silkscreen:** off-white monoline strokes with a pinhole texture punched out, slightly blurred (0.35 px). Outlines, designators, polarity marks, component symbols, labels.
6. **Light:** an additive layer (glow) with two blurs (≈24 px and ≈5 px) under a sharp copy. Current, water, lit pads all live here.
7. **Screen space (once per frame):** a soft warm key light drifting from the upper left, shallow depth of field (a blurred copy faded in at the top and bottom bands, stronger in macro shots, weak or off where text must be read), out-of-focus motes of light drifting with parallax in front of the board, a vignette, film grain at mux. A window's light (a soft parallelogram with a mullion shadow) may fall on the board when the whole board is on a desk.
Level of detail: textures crossfade between octaves; small features (vias, designators, rims) fade out before they go sub-pixel, so zooms never shimmer. Nested boards (a module inside a board) are separate boards composited into their footprint, so a continuous zoom can cross six or more orders of magnitude without precision loss.

## 3. Colour logic

- Ground: green solder mask in three values (dark laminate, mid pour, light rim/trace). The film is green; never recolour the mask per scene.
- Metal: gold for pads and vias, one bare-copper accent at most.
- Ink: one off-white for all silkscreen.
- Light carries meaning and is the only saturated colour: **amber** for energy/current (with a near-white core), **silver-cyan** for a second kind of flow (water, data, goods) when the story has two. A third flow gets a third light colour only if it must be told apart; red is reserved for a fault and appears at most once.
- Dark (bare laminate, sea, holes) for what is absent.
Example: laminate #05190F, pour #1C6A44, rim #4AA977, gold #D9B25B, silk #F2EEE1, current (255,190,84), water (170,214,226).

## 4. Type & subtitles

- All type is silkscreen in one **monoline stroke font routed like traces** (0/45/90° strokes, chamfered corners, round caps), drawn in code. Chinese uses the same rules: every hanzi hand-routed on a 0/45/90° grid with the same stroke width as the Latin line beside it. Use simplified characters only and proof every glyph at large size before use.
- Text is world-anchored and **plotted stroke by stroke**; it stays on the board and is still there when the camera pulls back.
- Roles: labels (a Chinese line above a smaller English line, same stroke width), board-native text in one language (designators, voltages, timestamps, km, values), micro texture (pinyin tags, notes, REV/sheet lines) which may fade below reading size.
- Reading: a label must be fully in frame and stay there for its reading time (≥ 1.5 s + characters at 4.5/s CJK, 15/s Latin). Never let text sit in the depth-of-field bands; never cut text at the frame edge in a held shot. Title caps ≥ 60 px at 1080p.
- With a voice, every line gets a subtitle in the bottom safe area: a dark translucent plate, Chinese over English (an open-licence sans, e.g. Noto Sans SC, subset to the characters used; never a system font), 34 px / 24 px at 1080p. The board then prints only the voice's key words and numbers, never whole sentences. Keep picture text above the subtitle band.

## 5. Motion quality

- 30 fps, everything on ones. `render(t)` depends on t only; motion blur from measured screen motion (180° shutter, sub-frames from 1 to ~20), never across a cut.
- Kinds of current, told apart only by how the light moves:
  - **AC / alternating:** short dashes rocking back and forth along the trace (a slowed mains frequency) over a faint energised line.
  - **DC / one-way:** a continuous lit stream behind a travelling head, with slow streaks inside and an afterglow that dims slowly behind the head.
  - **Step-down:** the trace gets thinner and the dashes smaller.
  - **Water / second flow:** several parallel streamlines of moving dashes at different speeds, faster in the middle, with short glints.
- Pads flash on arrival (a quick bright bloom, then a steady glow). Components "conduct": the symbol's internal edges glow while current passes.
- Silkscreen appears only by plotting; copper and pads never pop in. What never moves: the board itself (only the camera moves).

## 6. Camera grammar

Straight-down camera always (rotation about the view axis allowed, small). Moves:

| Move | What it expresses | Can serve |
|---|---|---|
| Ride the pulse (camera locked to a moving head, head on a third) | following one thing through a system | a delivery route; a signal path; a single order through a process |
| Rise while following (zoom out during the ride until both ends are in frame) | the whole length becomes visible | a distance; a supply chain end to end; a timeline |
| Crash zoom onto a pad | arrival, impact | a deadline met; a package delivered; a test result |
| Locked macro hold | reading, comparing, verdict | two numbers side by side; a spec; a rule |
| Whip along a trace | jump to the next station | the next stage; skipping ahead |
| Matched cut on a centred symbol (same symbol, same screen size, the world around it changes scale) | the same step repeated at every level | step-downs; repeated approvals; hand-offs |
| Plunge through a hole / via, reverse out of another hole | entering a smaller world | into a device; into a building; into a file |
| Continuous pull-out across nested boards | everything was one board | the big picture after the detail; the system behind one object |

Framing rules: the lit subject sits on a third or dead centre for symbols; at least two layers of detail around it (background copper/vias/routes, foreground motes or depth-of-field blur); the board edge appears only when the whole board is the subject. Transitions: motion-into-motion and matched cuts; no fades, no wipes, no page turns.

## 7. Sound palette

All synthesised: sine/saw tones, pulse waves, FM bells and glockenspiel, relay clicks (two-click transients), soft kicks and 16th ticks, filtered noise. Tune the drone to the mains hum (50 Hz ≈ G1; 60 Hz ≈ B♭1) so the hum belongs to the key. Rule the ear can follow: an **amplitude-gated tremolo tone = alternating**, a **steady tone = direct**; a component that converts one into the other is heard as the tremolo smoothing into the long tone. Arrivals are relay clicks or a filtered noise burst; a step-down is a relay one step lower each time; plotting silkscreen is a faint scratch of grains. Outside sounds (water, cicadas, traffic) only behind a low-pass, as if heard through a wall. Silence: drop the rhythm before a verdict, keep only long tones. With a voice, the voice leads: duck the bed so it sits 15–18 dB under the speech, effects a few dB. Mix around −16 LUFS before mastering, true peak under −3 dBTP, lean low end (high-pass ≈ 55 Hz).

### Voice-over and subtitles

When the film explains something, a voice tells it and the board shows it at the same moment: each spoken line has one picture action (a pad lights, a stream changes shape, a tag prints). Every line gets a subtitle in the bottom safe area, a Chinese line over an English line on a dark translucent plate, appearing and leaving with the voice; the board itself prints only the key words and numbers the voice says (a name, a value, a verdict), never whole sentences. Keep the voice on top: the bed sits 15–18 dB under it and rises in the gaps. Pick one calm, clear voice for the whole film; numbers and units are spoken in full.

## 8. Native moves

- **Flow becomes current.** A second flow (silver) enters a row of pads; each pad lights on a beat and amber leaves on its other side. *Fits content like:* raw material entering a factory and leaving as product; requests hitting servers and leaving as responses; donations becoming grants.
- **Pulse-path explainer.** Every stage of a process is a component on one trace; the way the light changes (rocking, streaming, thinning) tells what each stage does. *Fits content like:* a payment's clearing path; a parcel's sorting hubs; a message across a network.
- **The map is a board.** Geography re-routed octilinear as copper and channels; rivers, lakes and coasts are clearances with via fences; cities are test points; corridors are buses of parallel traces. *Fits content like:* a pipeline across countries; a migration route; the cables under an ocean.
- **Detail callout.** An assembly-drawing circle that shows another place of the same board (or another board) at a chosen scale next to the thing it is compared with. *Fits content like:* the same mechanism at two sizes; a lab prototype beside the plant; yesterday's version beside today's.
- **Nested boards.** A module footprint on a board is a complete board of its own; plunge into it, or pull out through every level in one move. *Fits content like:* a country → city → building → device; an organisation → team → person; a chip → core → transistor.
- **Matched step-down.** The same symbol held centred while the board around it changes scale on each cut. *Fits content like:* voltage levels; approval tiers; zoom levels of a map.
- **Timestamp tags.** Silk frames printing times at two stations, the second tag repeating the first digit-for-digit above its own. *Fits content like:* latency; a race between two routes; before and after.

## 9. Pitfalls of the medium

- **Flat pour.** A board that is all mid-green reads as an empty slide. Fill with real board texture: stitching vias that stay visible at map scale, fences along every clearance, mottling, micro silk, other unlit routes that exist in the subject.
- **Decorative routing.** Traces that mean nothing make viewers ask what they are. Draw only real routes; texture comes from vias and mask, not invented traces.
- **Lines crossing on one layer.** Two traces can't cross on the same copper: use a via to the bottom layer, or route around. A trace may cross a bare channel (a river, a street).
- **Overexposed light.** Wide traces with additive bloom turn into white bars. Cap glow widths and flash radii in pixels, keep the amber body and a thin core.
- **Text in the blur or under the frame edge.** Depth of field and the vignette eat the top and bottom bands: keep labels out of them, or turn the blur down in reading shots.
- **Too-fast holes.** A plunge into a hole under 0.6 s reads only as "darkness". Hold on the hole first, then plunge; come out of another hole the opposite way.
- **Precision.** Zooming a single coordinate system over many orders of magnitude breaks the canvas transform. Nest boards (each with moderate units) and convert cameras between levels in double precision.
- **Hanzi in a stroke font.** Automatic skeletons of fonts lose dots and strokes; route each character by hand and proof traditional/simplified forms (鹤 not 鶴, 换 not 換).

## 10. Engine

All in `demo/src/`:

- `render.js` — `Board`: draws one board (a world module) for a camera `{x,y,z,r}`: laminate, copper (two-pass rim), traces, pads, vias, silk, glow (`acDashes`, `dcStream`, `flow`, `penFlow`, flashes), `texts()` for reading checks.
- `levels.js` — nested boards: `makeLevels`, `toChild`/`toParent`, `baseOf`, `drawLevel` (composites each visible child board into its footprint).
- `font.js` + `hanzi.js` — the routed monoline font; `drawText(ctx, str, x, y, cap, {sw, progress})` plots by stroke length.
- `parts.js` — footprints: `bridge` (diamond rectifier), `xformer`, `reactor`, `capBank`, `chip`, `ecap`, `xfmr`, `ground`, `tag`.
- `geo.js` — `octi` (0/45/90° routing through waypoints), `offset` (parallel lanes), `measure/at/sub`.
- `post.js` — key light, depth of field, motes, window light, vignette.
- Minimal new use: a world module exporting `BOARD`, `TRACES`, `PADS`, `SILK`, `LABELS` (e.g. three warehouses as pads joined by a bus, one `xformer` as a sorting hub) and a scene with one `dcStream` is a complete film board.

## 11. Variation space

The agent decides the structure, the stations, the scales visited, the camera path, the pacing and which flows get which light. Range, far from the demo:
- Structures: a single packet's round trip and the time it took; three routes raced side by side on parallel buses; one board revealed component by component like an exploded view, ending on the whole.
- Openings: a via drilled through in macro, light rising out of it; a whole board on a desk, the camera diving to one pad; a single silk label plotting itself in the dark, then the copper lighting under it.
- Endings: the last pad lights and the board's power LED stays on; a pull-out to many identical boards in a rack; the title block of the board printing the answer.

---

How our demo was made (story, shots, score, end card, build): [DEMO.md](DEMO.md). Read it after your treatment exists.

# Chalkboard — Style Prompt

> A real classroom blackboard on which chalk writes itself, stroke by stroke in true stroke order, with no hand, no chalk stick and no eraser in sight. One idea is taught the way a teacher does it: write what people think, wipe it with one pass, write what is true in the same place.
> References (grammar only): a primary-school literacy lesson on a sliding double blackboard; the way a teacher underlines the parts of a character, circles one component and wipes a wrong line. Take the order of a lesson, not any teacher's handwriting.

Suits short lessons on one idea: where a word or a character comes from, a misconception set right, a worked problem. The length follows how many steps the lesson has.

## 1. Essence, and what it is not

- **A clean, freshly wiped board.** One even deep ink green with its own fine grain and very slow mottling. No history on the slate: no old swirls, no ghost lessons, no floating dust, no bokeh.
- **Writing that grows like a hand writes.** Strokes appear along their centre line in the correct stroke order, with pressure: pressed starts and corners, points that lift, 捺 feet that spread, hooks flicked off.
- **Three chalks at most.** White for structure, one accent chalk for the single part the lesson tracks, one pale chalk for a second hand (a pupil, a visitor).
- **A real object in a real room.** Wooden frame, a tray with sticks of chalk, painted tian-zi grids, sliding panels, a wall and a clock around it.
- **Few words, large letters.** The board holds keywords; the explanation is spoken.

Not Whiteboard Explainer: that style is a bright glossy board, coloured markers, floating marker props and magnets, ghost marks of old lessons, and a camera travelling across a knowledge map of many regions to explain how something works. Chalkboard is a dark matte slate with nothing floating in front of it, kept clean, one question per board, the camera facing it flat; it advances by writing a claim, wiping it and rewriting in place, and it lives in a classroom (panels that slide, grids painted on, a tray, a wall). Not a slide either: nothing is typeset, nothing fades in.

## 2. Materials & rendering

- Canvas 2D for everything visible; WebGL2 only for the post pass (camera motion blur, a light vignette, grade, dither).
- Each stroke is baked once into a board-space coverage sprite (coverage, arc length, lateral position). A partial stroke reveals pixels up to the current arc length with a round leading edge; the board's grain decides which grains take the chalk (deposit with a 2×2 supersample and a faint powder halo).
- Chalk edges are firm; loose powder only at the lift-off of a stroke (two to five grains). Never sugar the board.
- Writing strokes carry a width profile per stroke type (start bump, corner bumps, taper for 撇 / 提, foot for 捺, quick lift for hooks) and a pressure profile (heavier at both ends, lighter in the middle). Straight strokes bow slightly; horizontals rise 2–3° to the right; 横, 竖 and 折 enter with a short pressed tick from the upper left.
- Board, panels, frame, tray, clock and wall are baked once in world units; the slate grain is a periodic tile drawn in world space (soft-light) only when the camera is close.
- Erasing is a blurred destination-out band along one smooth path on a layer that holds only the strokes being wiped; it leaves a very thin, even haze. One wipe per film is plenty.
- A wet streak (a board just wiped with a damp cloth) is a soft mask with a wide blur at its drying edge, fading at top and bottom, that darkens the slate slightly; never a hard rim.
- Light: a gentle multiply falloff away from the windows and at most a faint warm window patch. Light never draws shapes across the writing in close shots.

## 3. Colour logic

- Ground: deep ink green slate, wood frame, warm white wall and a coloured dado if the room is seen.
- White chalk carries every structure: characters, lines, labels, arrows.
- The accent chalk (example: orange) is reserved for the one component the lesson tracks; it never decorates and never draws arrows or underlines that are not that component.
- A pale second chalk (example: yellow) marks another person's handwriting.
- No rainbow, no gradients in chalk, no glow. Painted grids are dull and thin so the chalk always wins.

## 4. Type & subtitles

- Chinese is hand-authored stroke data (centre lines + stroke type per stroke) drawn by the chalk engine, never a font's outline. Every character the topic needs is added to the data and checked against an OFL kai font behind it before shooting.
- English on the board is a single-line OFL handwriting font (EMS family) drawn by the same engine; symbols missing from the font (arrows, plus) are drawn as strokes.
- On the board: keywords only, one line of Chinese, the next line English, a size smaller.
- Sizes at 1080p: big characters 300–450 px; labels ≥ 55 px CJK and ≥ 30 px Latin cap height; small writing gets heavier chalk so no stroke is thinner than 3 px.
- Reading time: every block stays fully in frame ≥ CJK ÷ 4.5 + other ÷ 15 + 1.5 s, counted from the frame it is wholly visible (readcheck). A block is fully written before it is read.

### Voice and subtitles

- When the style tells a story it is narrated: one calm teacher's voice in short spoken sentences, said as the matching chalk appears; what the voice names is being written or shown at that moment.
- A quiet subtitle plate sits above the bottom safe area: the spoken line in Chinese and a free English translation, one line each, a plain kai face (an OFL subset) on a soft dark plate, in and out with the voice. Long lines are split at sentence ends into several cues.
- Nothing the viewer must read on the board sits behind the plate; frames held for the board's words are composed above it.
- Pauses between voice lines are short (0.25–0.4 s); one longer hold (about 1.5 s) is kept for the verdict. Board action (a panel sliding, a wipe) runs under the voice instead of waiting for it.

## 5. Motion quality

- 30 fps, continuous. Chalk speed: big characters ~0.1–0.3 s per stroke, labels ~0.04 s per stroke, with short air time between strokes; writing speeds up rather than making the voice wait.
- Camera eases in and out (cubic), never bounces except a whip landing.
- Things appear only by being written, wiped, revealed by a sliding panel or by drying. Nothing fades in.

## 6. Camera grammar

The camera always faces the board flat on (no perspective tilt).

| Move | What it expresses | Can serve |
|---|---|---|
| Close shot on the writing | attention on how a character or line is built | a component; a step of a proof; a spelling |
| Slow lateral pan along a line | time or sequence | a timeline; a derivation; a list of cases |
| Pull back to a fixed medium frame | the whole question at once | a comparison; a claim and its counter-claim |
| Same frame later | judgement | a correction; a before / after |
| Locked frame while a panel slides | a page turned in the room's own way | a new chapter; a hidden board |
| Whip with motion blur (≤ 0.5 s) | a jump to another part of the wall | a change of board |
| Cut on a line crossing a seam | a connection | cause and effect; the same part in two places |
| Wide shot of the whole wall | summary | the map of what was learnt |

Rules: the subject is never smaller than a third of the frame in close shots; text blocks are never cut by the frame edge while they are read; no empty board for more than half a second. Transitions are hard cuts, a sliding panel or a line across a seam; no dissolves or page flips.

## 7. Sound palette

- Voice first: it is the loudest element; music sits 15–18 dB under it and comes up only in the pauses.
- Foley: real chalk recordings cut into grains, one grain chain per stroke, level from stroke size; a light knock on landings; the accent chalk slightly softer and duller. A felt pass for the wipe, the low roll of a sliding panel ending on a stop, room tone very low; school sounds (a distant bell) only as punctuation.
- Music: sparse plucked strings (a guqin model or nylon guitar) with marimba and pizzicato bass; a plucked note can be "born" from something drawn. Silence while a question or a verdict is read.
- Mix: about −16 LUFS integrated before mastering, true peak ≤ −1.5 dBFS.

## 8. Native moves

- **Write, wipe, rewrite in place.** The wrong reading is written under its object, wiped with one pass, and the right one written in the same spot from the same camera position. *Fits content like:* a common misconception in physics; a misremembered date; a sum everybody gets wrong.
- **Tracked component in accent chalk.** One part keeps its colour and its height across several forms. *Fits content like:* a root through a word family; a variable through an equation's rearrangements; a gene through generations.
- **Sliding panel reveal.** The front panel slides away to show a clean back board, and can slide back to close the lesson. *Fits content like:* "but before that…"; the hidden proof; the answer kept back.
- **A line that sews two boards.** One accent line runs across the seam to join two places. *Fits content like:* the same constant in two formulas; a quote and its source; cause and effect.
- **Drying wet streak.** The freshly wiped board dries back and reveals what was left untouched. *Fits content like:* yesterday's question; a note left by a student; a reminder at the corner.
- **Second hand.** A different, childlike chalk colour and hand on the same board. *Fits content like:* a pupil's question; a visitor's comment; a wrong attempt.
- **Chalk as a measuring tool.** An accent object laid along a white line and ticked off, so a comparison is shown, not told. *Fits content like:* a unit's origin; a scale; how many of one thing fit another.

## 9. Pitfalls of the medium

- Dirty boards (old swirls, ghosts, floating dust) read as "messy", not "real". Keep the slate clean and let the grain carry the realism.
- Equal-width polylines look like a plotter and make characters misread. Use stroke-type width and pressure profiles.
- Character data that is structurally wrong is caught at once by native readers: check every character against a reference before shooting.
- Small writing at 1080p disappears with the same chalk width as large writing; give small text heavier chalk.
- Text written while the camera moves away fails reading time; hold the frame or keep the block in view.
- Accent colour spread over arrows and decorations stops meaning anything.
- A wet streak with a hard edge looks like a cut-out.
- Board-speak in the voice ("A plus B", component names with no meaning) is not understood: every component is said with what it means the first time it appears.

## 10. Engine

- `demo/js/chalk.js`: `Stroke`, `bake(stroke, R)`, `drawStroke(ctx, stroke, t)`: the chalk itself.
- `demo/js/hand.js`: `writeChar(ch, cx, cy, size, t, o)` (teacher or child hand), `writeLine(text, …)` (mixed Chinese and Latin), `writeLatin`, `loadSvgFont`.
- `demo/js/hz.js`: stroke data, `"type x,y x,y …"` in a 100-unit box; add every character a new topic needs here.
- `demo/js/r2d.js`: grain tile and deposit; `demo/js/stage.js`: slates, frame, tray, clock, painted grids.
- `demo/js/app.js`: frame compositor (layers, wipe, wet streak, light), subtitle plate and `TEXTS`.
- Minimal example: `writeChar('水', 800, 600, 400, 0)` after adding 水 to `hz.js`, then `bake` each stroke and draw with `drawStroke(ctx, s, t)`; open `index.html?lab=hz&chars=水` to check the proportions against the reference font.

## 11. Variation space

The agent decides the topic, the board layout, the number of panels, the tracked component, the hands, the camera path and the pacing.
- **Structures:** a proof built on one board line by line; three wrong answers wiped one after another before the right one; two boards in dialogue, question on one, answer on the other.
- **Openings:** a duster's last pass revealing a formula; a close-up of the tray as one chalk starts writing; the bell ringing over an empty, freshly wiped board.
- **Endings:** the whole wall with the lesson complete; a final underline under one word; the board half-wiped for the next class with one line kept.

---

How our demo was made (story, shots, score, end card, build): [DEMO.md](DEMO.md). Read it after your treatment exists.

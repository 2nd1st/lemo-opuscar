# Isometric Picture Book — Style Prompt

> A calm explainer of an everyday rule, set in one real place drawn in true isometric with flat colour: small faceless people seen from behind do the thing in order, while serif type lands on the ground, character by character, as if painted there. Whatever hides the action (a roof, a wall) is cut away or lifts off like a paper flap. The order of movement is the explanation.
> References (grammar only): isometric explainers about public manners (queues, platforms, crossings) and picture-book cutaways where a roof or a wall is lifted away to show the inside. Take the calm pacing, people as the diagram and type on the floor; never copy their characters, layouts, typefaces or music.

## 1. Essence, and what it is not

- **One real place, full bleed.** A platform, a gate, a cabin, a crossing, a counter: the ground runs off every edge of the frame. No floating board, no frame line, no vignette.
- **People are the diagram.** Slim figures seen from behind, no faces and no hands, move only when the rule says so. Who moves first, who waits, who sits is the information.
- **Type lies on the ground.** Each idea is one key word or number painted on the floor, big and small sizes, one accent character, landing one character at a time.
- **The cut-away.** Whatever stands between the camera and the action (a roof, a canopy, the top of a wall, a glass façade) is cut low or lifts off like a paper flap, so the camera always looks into the place from above.
- **Clean, always.** One place, one action, one phrase per beat. Large calm areas of ground around the type, people in tidy lines and rows, few props, every object instantly recognisable. A frame that needs a second look to find its subject is wrong.

Not **Isometric Infographic**: that style builds a model on a floating board over a dot lattice and labels it with sans-serif pins, icon statistics and inset bubbles to trace a process; here there is no board edge, no pins and no icons: the place is real and full bleed, the labels are serif words lying on its floor, and the explanation is people obeying a rule. Not **Low-poly Isometric Island**: no lighting, no faceted terrain, no shadows or glow; solids are flat three-tone paper colours and the ground is a printed plane. Not a cartoon (no expressions, no gags), not a slide (no headers, no centred titles, no cards).

## 2. Materials & rendering

- True isometric (axes at 30°), Canvas 2D, painter's sort. Every solid and every person is sorted by its **floor footprint** (x + y at floor level), never by the centre of its box: a seat back sorted by its centre height ends up drawn over the passenger sitting behind it.
- Solids are flat-shaded in **three tones per colour**: top lifted toward warm paper, +y face the base colour, +x face dropped toward a warm umber. Curved bodies (a fuselage, a column) are faceted and quantised to the same tones plus one in-between, so they read as round without gradients. No outlines on solids, no shadows, no textures.
- Ground surfaces carry only their functional markings (painted lanes, chevrons, lead-in lines, stop bars, seat squares) and a faint tile or slab grid.
- **Cut-aways** are part of the model: the near wall is cut low and the far wall keeps its windows; a lid is its own solid with a paper-coloured underside, hinged on the far edge so it opens away from the camera; glass is a pale tint with thin mullions and is cut to a parapet whenever it would stand between the camera and type or people.
- **People** are billboards anchored at their feet, about 1.6–1.8 m tall: a round hair-dark head with a sliver of skin at the ear, a two-tone torso, separate trouser legs, dark shoes, optional long hair or skirt, a rolling case. Seated people show only shoulders and the back of the head above a low seat back. Walking scissors the legs along the screen; arms counter-swing.
- Bodies obey space: people never pass through seats, walls or each other; a queue keeps about 0.75 m between feet; someone sitting down first steps back into the row's legroom, walks sideways to the seat and sits (never sinking into or floating above it); a lifted case travels up over the open bin and is lowered in, never into a wall or a seat.
- Everything is a function of time. A crowd that queues is simulated once at load (deterministic) and **sampled with interpolation**, so replaying it slowed down still moves every frame.

## 3. Colour logic

- A warm paper neutral for every ground (outdoor concrete a touch cooler, indoor carpet a touch warmer), one dark ink, **one accent reserved for the rule** (the key character, the "stand here" outline, arrows, a lit sign, the winning number, a stretch of floor that matters), one **subject hue** carried by the place itself (seats, livery bands, chairs in a paler tint, sign trim), one marking colour (lead-in lines, a tug, a baggage tractor). People wear four muted tops, so a filled room reads as an even four-colour weave.
- The accent never decorates; it appears only where the rule is.
- Shade toward warm umber and paper, never toward grey or violet: dirty shadows are the fastest way to lose this look.
- Example palette: paper #F1E8D8, concrete #EAE2D3, carpet #F2E5CE, ink #2A2E29, accent persimmon #D0573A, subject green #3D6B59 / #A7C2B2, marking ginger #E2AE3A; tops ochre, fog blue, grey violet, oat.

## 4. Type & subtitles

- Chinese: a serif (Noto Serif SC, 700 for keywords, 500 for particles); Latin and numerals: a book serif (Newsreader). Open-licence fonts only, subset to the characters used.
- **Floor type**: big ≈ 1.5 m on the ground, small ≈ 0.8 m; read along the up-right axis. One phrase per beat; one line where the frame is tight. One accent character or number per phrase, never a single thin stroke (一 in the accent reads as a line, not a character). Characters land ≈ 0.14 s apart: fade and scale 1.22 → 1, pale ghost → ink. A painted title or a pair of numbers may scale up to ×1.6.
- Type sits on clear ground: nothing stands on it, nothing raised stands in front of it (see §9), at least 5 % from every frame edge, and clear of the subtitle bar.
- Signs in the world (gate signs, group signs, screens) face the camera side of the room at the iso angle, never a flat card facing the lens.
- Reading time: every piece of world text stays fully in frame ≥ CJK/4.5 + Latin/15 + 1.5 s.

### Narration & subtitles

When the film tells something, a narrator says it and the picture shows it at the same moment: one line per action or shot, each line starting as its action starts. A calm, quick reader in the film's language; the floor carries only that line's key word or number, never the sentence. Subtitles: one cue per narration line on a pale bar in the lower safe area, one Chinese line above (≈ 34 px) and one English line below (≈ 25 px, a translation of the whole sentence), switched hard, never two cues on screen. Numbers the viewer must remember: at most three, each said with what it compares to, and held on screen ≥ 2.5 s.

## 5. Motion quality

- People move only when the rule says so, in order; the order is the point. Walk ≈ 1.5 m/s; nobody moves faster than about 3 m/s on screen, even in a time-lapse: when a process must be compressed, show it as places filling (people settling into their seats) rather than people zipping past.
- Everything eases; nothing pops. A beat = one floor phrase + one diagram mark (an outline traced, an arrow grown ahead of the walkers, a light run along a path) + one action.
- A rewind runs the same motion backwards, faster, with a counter running down.

## 6. Camera grammar

| Move | What it expresses | Can serve |
|---|---|---|
| slow drift and push (≈ 6–8 % zoom) | calm attention on one rule | a call, a waiting room, a hold to read |
| follow the head of a line | the order of things | a corridor, a boarding, a procession |
| rise to wide while a lid opens | revealing a space whole | an interior, a capacity, a grid of places |
| locked frame | judging, reading | a verdict, a comparison, the last frame |
| step back to frame one whole incident | cause and effect in one view | one person blocking, one door jamming |
| tilt down from outside to the people | arrival, cause → people | an opening, a change of place |
| scale jump (room → building → site) | the result in context | a verdict, an ending |

The angle never changes (iso is fixed); camera moves are translation and zoom. Every move is motivated by the action, and text and subject stay inside the frame at both ends of it. Transitions: a continuous move, a lid opening, a run back along the same path, or a cut on the beat at the same angle. No page turns, wipes, black or blank frames; a pull-out shows its next subject (a mark being drawn) within half a second.

## 7. Sound palette

Soft upright piano and vibraphone; a vibraphone note per landing character (keywords louder, the accent doubled on glockenspiel); pizzicato and shaker when people walk. Repeated actions become rhythm: a stuck queue is broken pizzicato stabs, an orderly one is one chord per group. Quiet place beds (hall air, cabin air, distant engines) and a sustained low string root overlap every cut so no scene change drops out; functional sounds of the place (a home-made chime, wheels on carpet and on metal, bin lids, a tug). A rewind plays the last second of music backwards. With narration, the music ducks about 16 dB under the voice and lifts between lines; mix ≈ −16 LUFS before mux, true peak under −1.5 dBFS.

## 8. Native moves

- **Floor type.** The key word lands on the ground beside the action. *Fits content like:* a hospital triage rule; a polling-station step; a library's quiet zone.
- **Domino stand-up.** The group called sits together and rises one by one from the near end into a painted lane. *Fits content like:* an exam hall emptying by row; a ferry deck released lane by lane; a classroom drill.
- **Lid off.** A roof flips open on its far hinge, paper side up, and glides away; the camera rises to see the whole inside. *Fits content like:* a bus at a depot; a lecture hall; a container being packed.
- **Order lighting.** Places light up one by one in the order they will be used, before anyone moves. *Fits content like:* seat assignments; a parking plan; a vaccination queue by number.
- **Order arrows.** A flat accent arrow grows ahead of the walkers and branches where each one turns. *Fits content like:* escalator lanes; recycling bins by type; a one-way museum route.
- **Weave fill.** Places fill in a pattern (every other, window first) so the room becomes a woven grid in four colours. *Fits content like:* a stadium by sections; a cinema with assigned seats; a car park by level.
- **Bars on the ground.** Two quantities painted as strips on the floor in proportion, the difference marked by a dashed bracket after a still hold. *Fits content like:* two queue times; two routes' lengths; before and after a change.
- **People as the sample.** The people of a study stand on the ground in the shape of the thing they tested. *Fits content like:* a 72-person boarding test; a class of 30 in their desk plan; a jury in their box.
- **Stand here.** An accent outline or a lit stretch of floor marks the spot that matters. *Fits content like:* where to wait for a lift; the jammed stretch of an aisle; the right queue at a counter.

## 9. Pitfalls of the medium

- Anything raised by h metres covers the ground h metres up-left of it on screen: a glass wall, a raised walkway, a nose cone or a wing hides type that is metres away. Keep type on the side of the place away from tall objects, or cut those objects down.
- A crowd folded into a serpentine reads as a solid block; one straight line reads as order. Numbers on the floor beside each person need spacing wide enough for the label (about 1 m).
- People walking toward the camera show a back view that looks wrong; route walks up-left, up-right or across.
- Seated people disappear behind high seat backs: keep backs low enough that shoulders show.
- Sorting boxes by their centre and people by their feet puts furniture over people (see §2).
- A simulated crowd sampled by rounding to frames steps on and off when replayed slowly; interpolate. Compressing a long process by moving people faster than ~6 m/s (0.2 m per frame) reads as teleporting.
- A camera move can drag a sign or a word across the frame edge, and background details (a far sign, a row of labels) can appear half-cut at the edge of another shot: anything meant to be read needs both ends of the move checked, and background text belongs only to its own shot.
- Check a crowd film frame by frame, not by eye: `demo/tools/motion_check.mjs` renders every frame at 30 fps and lists jumps, stop-start stepping and people standing closer than a body width, from positions the film reports through a one-line hook (documented in the tool).

## 10. Engine

- `demo/engine.js` (from iso-infographic): `Iso` with `P()`, queued `box/prism/cyl/bill` (use `bias` to sort solids by their floor footprint) and immediate `boxNow/prismNow/cylNow`.
- `demo/kit.js`: palette, warm three-tone `tri()`, `facet()` (flat-toned polygon by normal), `onPlane()` (draw in metres on a floor or wall plane), `phraseLayout()` / `floorType()` / `phraseBox()` (floor type and its reading box), `drawPerson()` (walk, case, lift), `drawSeated()`, `subtitles()` (two-line cues, hard switch).
- `demo/plane.js`: an extruded and lofted fuselage, the cut-away cabin (`cabinBack`, `cabinFront`), the hinged flap (`lid`, `lidMap`), wings, a rear-engined T-tail, a jet bridge and a tug.
- `demo/places.js`: apron markings, a gate with a glass wall whose height can drop to a parapet (`gateWindow`), painted lanes, group signs, chairs, a line of numbered squares, a baggage train.
- `demo/film.js`: a timeline built from narration line lengths, a deterministic queue simulation (blocking, stow, sit) sampled with interpolation, `seatIn()` and `stowState()` for sitting and stowing, shot functions, `texts()` for readcheck.
- `demo/tools/motion_check.mjs`: the crowd check above.
- Minimal example, not in the demo: a lift lobby with two painted lanes, `floorType()` with 先下后上 on the floor, people billboards stepping out of a box car before the waiting line steps in.

## 11. Variation space

The agent decides the place, its cut-aways, the cast size, the rules and their order, the narration, the camera path, the pacing and the palette within the colour logic.

- Structures: one rule shown right once; the same group doing it two ways and compared (rewind between); a day in one place as five small rules.
- Openings: the place empty, then people arrive; the title painted on the ground as the first person walks over it; a tilt down from the building to the room.
- Endings: the place empty again with the rule left on the floor; a scale jump out to the building; the last person stepping onto the outlined spot.

---

How our demo was made (story, shots, narration, score, end card, build): [DEMO.md](DEMO.md). Read it after your treatment exists.

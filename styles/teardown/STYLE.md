# Exploded Teardown — Style Prompt

> A real product, built from its own engineering files (CAD, PCB layout, bill of materials), lit like a studio packshot and taken apart in front of the camera: the layers lift on one axis, the camera travels between them, every part is named with the numbers its files contain, and it closes again into one object.
> References (grammar only): hardware-launch exploded films (layer stagger and orbit timing), repair-guide teardowns (the order in which a product is opened, the macro on the one part that matters), technical illustration and engineering drawing (leader lines, dimension lines with ticks and extension lines). Never copy their products, layouts, typefaces or music, and never name them in the film.

## 1. Essence, and what it is not

A frame reads as this style when:

- **the object is real and exact**: geometry, positions and counts come from the product's own files (STEP, KiCad, BOM, assembly guide). Nothing is eyeballed that a file can give;
- **it is shown apart**: layers float on one axis with even, readable gaps, each still oriented as it sits in the product;
- **it is photographed, not drawn**: physically based materials, a studio key light, a cool rim, an HDRI reflection, soft contact shadow on an invisible floor;
- **the numbers live on the object**: thin leader lines from a dot on the part, dimension lines with ticks drawn in the scene's own perspective, never a table beside it;
- **the camera never stops travelling**: one or a few continuous moves, orbit outside, macro inside.

It is not a glass product render (one object, material beauty, no disassembly), not a blueprint (line drawing on a grid, no light), not a keynote (slides, headline type, a stage), not an assembly manual (step numbers, arrows, hands).

## 2. Materials & rendering

- Real-time PBR (three.js `MeshPhysicalMaterial`) rendered at 2× and downsampled, with ambient occlusion, a light depth of field whose blur grows naturally as the camera comes close (one aperture value for wide and macro: the circle of confusion follows 1/focus − 1/z), a high-threshold bloom that only lights emitters and hot speculars, and a vignette.
- Each material keeps its physical character: textured plastics with soft sheen (roughness 0.55–0.7), lacquered or coated boards with a thin clearcoat, solder mask over copper that shows the traces as a raised, slightly lighter relief, exposed pads metallic, machined metals with a tight highlight, rubber fully matte.
- **Boards are painted from their layout files**: copper pours, every trace, via, pad and drill, silkscreen, on both sides, at 14–20 px per millimetre, with roughness, metalness and bump maps from the same drawing. Components stand at their footprint positions with their package sizes.
- Light: a warm key (about 5500 K) from above front, a cool rectangular rim from behind that follows the camera so edges always separate from the ground, a large soft top light, an HDRI at low intensity for reflections. A practical fill appears only where the camera goes inside the object.
- Background: a dark graphite seamless sweep (screen-space radial gradient), floor visible only as soft shadow.
- Effects anchored to the world (leaders, dimension lines, glows) are projected from 3D points every frame; only subtitles and title cards live in screen space.

## 3. Colour logic

- The product brings its own colours; the frame around it is neutral and dark, so the product is always the brightest, most saturated thing.
- Interface ink is one warm white at two strengths (names at full, specs at about 60 %), plus **one accent** reserved for measured things: dimension lines, label indices and one matching detail on the product itself.
- Values are ordered: ground darkest, product mid to light, labels lightest. Never put text on a busy, bright part without a dark backing.
- Example (our demo): ground #34363a → #0d0e10, ink #f1efe9, accent #ff6b3d.

## 4. Type & subtitles

- Names: a CJK sans at medium weight (Noto Sans SC 500, 28–32 px). Specs and numbers: a monospaced face (JetBrains Mono 15–22 px) so digits line up and read as measurement. English subtitle and title line: a neutral grotesque (Inter).
- Label structure is fixed: a two-digit index in the accent, the name, one spec line. Units always written (mm, MB, ×n for counts). A label carries at most one fact the voice does not say.
- Dimension text sits on a small dark plate, follows the line's angle and is never upside down.
- Subtitles: a centred strip at the bottom, Chinese line above, English below, one line each, a soft shadow and no box. Hold every cue ≥ max(1.8 s, speech + 0.6 s); every label stays fully in frame for CJK ÷ 4.5 + other ÷ 15 + 1.5 s.

## 5. Motion quality

- 24 fps on ones; everything is smooth and deterministic.
- **Separation**: smooth start, fast middle, long settle (ease-in-out cubed); layers leave top first, 0.15–0.2 s apart; repeated parts (keys, screws) fan out in a wave ordered by distance from a corner.
- **Closing**: bottom first, quicker (about 1 s per layer), the last layer lands with a real mechanical response (a key travels its stroke and returns; nothing bounces like rubber unless it is rubber).
- While held apart, layers may float a millimetre or two with offset phases; during macro shots they hold perfectly still.
- Labels draw in: anchor dot, leader growing along its length, then text sliding in 10 px. They leave with a short fade before the parts move again.
- Never moves: the floor, the light rig's relation to the camera, the label column's x position.

## 6. Camera grammar

| Move | What it expresses | Can serve |
|---|---|---|
| Continuous orbit while layers separate | the whole object, its order of assembly | a reveal; a structure overview; a count of parts |
| Grazing macro dolly across a surface | touch, material, finish | an opening; a texture; a premium detail |
| Dive between layers, looking up or down | being inside the product | a hidden component; the "how it works" part |
| Slow push on one component, still subject | the one part that matters | a chip, a sensor, a connector, a seal |
| Rise through the stack | moving from one subsystem to the next | a transition between two stops |
| Fast pull back to the whole | return, synthesis | the closing; a before/after |
| High three-quarter drift with dimensions | scale and precision | sizes, pitch, thickness |

- At key moments the subject fills at least a third of the frame height. Labels live in a column on the free side (shift the projection with a view offset rather than moving the object), subtitles in the bottom 12 %.
- Transitions are camera moves through the object itself. No cuts to black, no slide transitions, no split screens.
- The camera path is keyed in the product's own coordinates and interpolated without overshoot (monotone cubic), so a held macro really holds.

## 7. Sound palette

- Instruments: tuned mallets (marimba, vibraphone, bowed vibraphone, glockenspiel, glass), a round electric bass, a short synthetic kick, closed hi-hat and claves. Precise and dry outside the object; sustained and airy inside it.
- Foley is the material: hollow plastic clacks for keycaps or housings, a switch click with a low thock, dry taps for boards, inharmonic rings for small machined metal, a soft thud for the enclosure, airy swooshes for layers lifting and for camera dives, a fine pen hiss when a dimension line draws, a tiny tick per label.
- Every separation and every landing has its sound, panned to where the part is.
- Silence: at least two near-silences (room tone only) before the big separations or the turn back; the first sound after each is the most important hit around it.
- Mix: voice clearly on top (music about 10 dB under it while it speaks), music bus ducked, sub-bass kept lean (20–60 Hz well under the full band), loudness −14 LUFS.
- Voice: calm, close, unhurried, short sentences; numbers spoken as words, written as digits.

## 8. Native moves

- **The wave lift.** Repeated parts rise in a wave across the object. *Fits content like:* the cells of a battery pack; the tiles of a solar panel; the drawers of a modular shelf; the pixels of an LED wall.
- **Inside the gap.** The camera enters the space between two lifted layers and looks at the hidden face of a part. *Fits content like:* the back of a phone's logic board; the inside of a drone's arm; the underside of a camera sensor module.
- **The leader that lands on the part.** A macro label whose line ends on the component itself. *Fits content like:* a pressure sensor in a running shoe; the gasket in a waterproof case; the motor driver in a robot vacuum.
- **Dimensions drawn on the thing.** After closing, the real outline gets dimension lines in perspective. *Fits content like:* the thickness of a laptop lid; the footprint of a router; the bore of a valve.
- **One real keystroke.** A part performs its true mechanical motion once (a key press, a hinge, a latch) before or after the teardown. *Fits content like:* a camera shutter; a buckle; a folding phone's hinge.
- **Lights on inside.** Emitters inside the product switch on while it is apart. *Fits content like:* status LEDs; a backlit display; an indicator ring.

## 9. Pitfalls of the medium

- **Invented numbers.** A size that no file gives. Fix: measure it from the CAD and say "measured" in the facts file, or leave it out.
- **Mixed-up revisions.** Plates, cases and boards from different versions of a project. Fix: check hole positions and stack heights across the files (they must coincide), and pin the commit.
- **Panelised boards.** Layout files often contain a panel with breakaway tabs, not the board outline. Fix: take the outline from a plate or case file of the same revision, or flood-fill from a known interior point.
- **Zero-length edges.** Duplicate outline points give zero normals; shading turns into NaN and bloom spreads it into black squares. Fix: clean outlines and repair zero normals; scan every frame for black tiles that appear for one frame only.
- **Overshooting camera splines.** Catmull-Rom over unevenly spaced keys flies past a macro stop. Fix: monotone interpolation per component.
- **Labels too short for their text.** Macro stops last about three seconds. Fix: one fact per label, open the label before the camera settles, check with `readcheck`.
- **Over-bright light sweeps.** Area lights in millimetre scenes blow plastics to white. Fix: keep sweeps at a fraction of the key and the bloom threshold above the brightest diffuse surface.
- **Brand marks on parts.** Chip tops, connector shells and project logos can carry trademarks. Fix: plain package tops; drop logo footprints when reading the layout.
- **Crushed blacks.** Black plastics against a black ground disappear. Fix: lift them to a dark grey and let the rim light separate them.

## 10. Engine

All in `demo/src/` (three.js r170, the library's `core/three/post.js` and `core/lib.js`):

- `parts.js`: `keycapGeometry(w, d, h)` (lofted shell with a spherical dish and a stem), `switchGeometries()`, `loft(rings)`, `shapeFrom(outline, holes, circles)` (KiCad outline to extrusion), `inset`, `hexSpacer`, `screwGeometry`.
- `pcbtex.js`: `paintPCB(data, side, outline, box, ppm)` paints colour, roughness/metalness and bump maps from extracted layout data.
- `comps.js`: `buildBackParts(data, group, y, materials)` places package bodies at footprint positions and returns anchors.
- `overlay.js`: anchored labels (`label`), perspective dimension lines (`dimension`), subtitles, end card, the readcheck text registry, the subtitle width check.
- `main.js`: layers, explode and gap functions, the camera keys (orbit or eye/target, monotone), lights, `window.EV` for the mixer.
- `tools/extract_pcb.py`, `tools/kicad_geom.py`, `tools/sexp.py`: read any `.kicad_pcb` (outline loops, tracks, zones, pads, silkscreen, footprints). `tools/step2mesh.mjs`: STEP to mesh with occt-import-js.

Minimal example, not in the demo: read a plate file with `extract_pcb.py`, build `slab(shapeFrom(outline, cutouts), 1.5, …)` for a 1.5 mm aluminium plate, give it `MeshStandardMaterial({ metalness: 1, roughness: .35 })`, and orbit it with three `CAM` keys.

## 11. Variation space

Decided per film: which product and revision, which layers to separate and in what order, how many stops inside and which parts deserve them, the camera route, whether to open from the whole or from a detail, the product's palette and the accent, the voice.

- **Three structures**: a single orbit with two stops (structure first, one hero part); a "how it works" path that follows a signal or a flow through the layers (input → board → output); a comparison of two revisions taken apart side by side, held still before each difference is named.
- **Three openings**: a part performing its real motion in macro; the closed product turning in silence on the seamless; a single component floating alone before the rest of the product assembles around it.
- **Three endings**: the product closed with its dimensions drawn on it; the product closing while the camera pulls back to a top view that becomes a technical drawing; the product apart one last time, frozen, with every part labelled as a printable sheet.

---

How our demo was made (story, shots, score, end card, build): [DEMO.md](DEMO.md). Read it after your treatment exists.

# Printed Long Take — Style Prompt

> A three-dimensional world rendered as a scratchboard print, ink and paper with one red, crossed by one unbroken camera move. Depth, weather and light are all cut lines; the camera travels through the print instead of the print being turned page by page.
> References (grammar only): wood engraving and scratchboard illustration (tone made by the width of parallel cuts), Japanese shin-hanga landscapes (layered planes of mountain, forest, water), and the single-take tracking shot of documentary nature films (a move that never cuts). Take the cut line, the layering and the unbroken move; never copy a print, an illustrator's figures or a film's route.

## 1. Essence, and what it is not

- **Only ink, paper and one red.** Every value is either ink or paper; grey exists only as a density of lines. One red is reserved for one small subject. A warm yellow may appear for the sun, a lamp or one material, never as a second accent.
- **Tone is cut, not shaded.** Shadow sides of hills carry knife lines that run down the fall line; skies are parallel horizontal cuts whose width makes the light; snow is paper with a few drift strokes; water is ink with cut ripples.
- **Real depth, flat marks.** The scene is built in 3D (terrain, rivers, thousands of trees, buildings), but every surface is drawn with flat marks fixed in world space, so the layers slide past each other like a printed diorama.
- **At least three layers in every frame:** sky / a mountain or forest band / a middle ground of fields, water or snow / a foreground of branches, fences or posts. Ink and paper roughly half and half.
- **One continuous move** carries the story; cuts are rare and designed.

Not woodcut (flat printed blocks, a mostly static camera, one block per image). Not ukiyo-e (flat colour fields, no depth travel). Not a toon-shaded 3D game (no smooth shading, no gradients, no specular). Not a pencil sketch (no hatching that follows form loosely; every line is a knife cut with a blunt entry and a tapered exit).

## 2. Materials & rendering

- **Render model:** three.js scene at 2× supersampling, box-filtered down in a final print pass. Every material is a small shader that decides "ink or paper" per pixel; there is no lighting except one direction used to choose lit and shadow faces.
- **Faceted terrain:** mountains and volcanoes are low-poly cones with flat facets. Lit facets are paper with a few fine ink cuts near the terminator; shadow facets are ink with paper cuts running down the slope. Cut spacing is fixed in world units so lines never swim when the camera moves.
- **Sky in direction space:** a sphere that travels with the camera; cuts are rows of constant elevation, so they stay horizontal and never slide with translation. Night = sparse wavy wind cuts and square stab stars; day = dense parallel cuts, thicker near the horizon. Words in the sky are plates hung in the same direction space.
- **Billboard atlases drawn on canvas:** trees (pines, frosted deciduous trees), animals, steam. Cylindrical billboards for anything standing, spherical with a screen rotation for anything flying. Sample the atlas with a negative mip bias and alpha-test so thin shapes survive at distance.
- **Water** is a ribbon cut into the snow (the ground is discarded inside a river mask), with bank walls and a paper snow lip. Ripples are short cuts across the flow, faded to solid ink where they would turn grey with distance.
- **Print pass (screen space):** paper fibre, ink mottling in the darks, soft grey blotches near the top of the sheet, a two-frame flicker, a light vignette. Nothing else lives in screen space except transitions made of paper (a whiteout, a sheet being peeled).
- **Props with words** (plates, boards, notices) are canvases on meshes: carved letters in paper on an ink ground, or ink on a pasted paper label. They sit at a 3/4 angle with thickness, a snow cap or a rim.

## 3. Colour logic

- Two values carry everything: ink (a warm black) and paper (a warm off-white). Never pure black or pure white, never a third grey fill.
- **One red, reserved for one subject**, kept small (a crown, a lamp, a flag) and never smaller than about 3 px at 1080p; enlarge it a little rather than lose it.
- A warm yellow is allowed for light itself (sun disc, its road on water, warm cuts in a dawn sky, a lamp) and one material at most. It never fills a large area except that one material.
- Value order by depth: far mountains paper with ink shadow facets; forest bands solid ink; the middle ground paper; foreground ink silhouettes. Keep the subject on the opposite value of what lies behind it.
- Example palette: ink `#16171b`, paper `#ede5cd`, red `#c4332b`, yellow `#dfa443`.

## 4. Type & subtitles

- One serif typeface, bold (e.g. Noto Serif SC, OFL), subset to the characters used. Chinese and English each on their own line.
- **Type lives in the world:** carved into a board, cast on a plate, printed on a pasted notice, or cut as a plate of type into the sky. Words in the world carry only keywords and numbers; no centred title cards, no headers.
- Sizes at 1080p: at most three sizes per frame; nothing smaller than 28 px for Chinese or 22 px for Latin; every word at least 5% inside the frame. Left-aligned blocks, aligned by optical edge.
- Words appear the way the medium makes them: cut left to right with chips at the knife, pressed by a seal, revealed under a peeled sheet.
- Reading time: hold every piece ≥ max(1.8 s, characters ÷ 4.5 for CJK + characters ÷ 15 for Latin + 1.5 s); judged comparisons hold still ≥ 2.5 s before the verdict lands.

### Narration & subtitles

When the film tells a story with a narrator:

- **Speech and picture move together.** Each line is spoken while the shot shows what it names; the long take keeps going under the voice, and the silent stretches (a hold to read, a pass through a structure, a flock taking off) are left without words.
- **Words in the world carry only keywords and numbers** (a count on a board, a date on a seal). The sentence is in the voice and the subtitle, not on the props.
- **One subtitle bar per spoken line**, at the bottom inside the 5% safe area: one Chinese line above one English line, never wrapped, in the film's serif, paper letters on a translucent ink band. It appears with the line and leaves with it; keep the subject of each shot above it.
- A second-language version swaps only the voice: the same picture, the same bilingual bar, each line starting at the same moment, finished before the next one starts.

## 5. Motion quality

- The camera moves continuously and slowly; the world moves on ones. The print pass flickers on twos (12 fps), so the image breathes like a worn sheet.
- Easing: long monotone curves; the camera keeps momentum through key positions and decelerates into every hold. No bounce, no shake except one frame for an impact.
- Animals are flat silhouettes with three or four poses per action (sleep, wake, call, peck, walk, run, three wing frames, land, leap, bow). Wings cycle on fixed frames; never morph between poses.
- Steam, snow and splashes are paper marks: horizontal cut wisps, square stabs, short arcs.
- Mountains, horizon and sky texture never move; trees never sway.

## 6. Camera grammar

| Move | What it expresses | Can serve |
|---|---|---|
| High wide establishing frame, sinking and pushing | the whole place at once; the layers separate as it moves | a valley; a coastline; a city seen from its hills |
| Low glide over water or snow | speed, intimacy with the ground; foreground marks rush past | a river journey; a road; a migration |
| Hold on a prop with words, long lens | reading time inside the take | a sign; a plaque; a gauge; a date |
| Pass through a structure (bridge, gate, arch, tunnel) | a threshold, a change of time or light | night to day; outside to inside; then to now |
| Locked frame | a document, a comparison, a count | the same place in four years; before and after |
| Rise and pull back to the opening angle | the place again, changed | a return; a conclusion; an epilogue |
| Follow a flying or falling subject | the subject leads the camera to the next place | birds, a kite, a leaf, a paper plane |

Framing: the horizon sits on a third; the subject is never smaller than 1/20 of the frame height when it must be recognised; words stay inside the frame with a margin of 5% and never cross another object. Allowed transitions: through a structure, through steam or snow (under half a second of white paper), a match on a falling or rising subject, a sheet peeled from the corner, a seal. Forbidden: fades to black, cross-dissolves, slides, page flips, zoom cuts.

## 7. Sound palette

- Three layers. **The world:** the matter of the place (water under ice, frost cracking, wind in three weights, wings, steps on snow, small animal sounds). **The print:** knife through paper or wood, a block's thump, a sheet torn away, a seal pressed; used only on transitions and verdicts, never as a bed. **Music:** a small chamber group of real samples.
- Timbres that suit the medium: bowed vibraphone, harp, horn, low strings, pizzicato bass, xylophone, glockenspiel, timpani. Avoid synth pads and drum kits.
- A three-beat or slow pulse that can stop; silence before a verdict, then one heavy low stroke.
- A narrator, when there is one, sits on top: music ducks about 17 dB under speech and comes back up in the silent stretches; foley ducks about 7 dB.
- Animal calls are recordings with a CC0 or CC BY licence or are synthesised; never CC BY-NC.
- Mix: music sits under the world; the print sounds are the loudest events. Integrated −16 LUFS in the master, true peak under −3 dBTP (the final mux brings it to −14).

## 8. Native moves

- **The sky carved open.** The sky is cut from the horizon up, one row at a time, the newest row still running across; dawn as a carving, not a gradient. *Fits content like:* a factory's first shift; the first day after a war; a city's lights coming on in reverse at dawn.
- **One red waking.** In a field of ink and paper, the single red appears point by point (heads lifting, windows lighting, flags raised) across the frame. *Fits content like:* poppies opening on a hillside; lanterns along a river; the first lit windows of a rebuilt street.
- **Through the steam.** The take passes through a cloud of paper cuts that eats the frame for under half a second; the world on the other side is a different scale or place. *Fits content like:* a ship into fog and out at a harbour; a train through a tunnel's smoke; a balloon through cloud.
- **The same place printed again.** A locked frame of one place; the top sheet peels from the corner to show the next year's print beneath, with ink that has not quite taken. *Fits content like:* a coastline retreating; a forest replanted; a village growing into a town.
- **Words cut into the world.** A count or a date carved into a board, cast in a plate or stamped by a seal while the camera holds. *Fits content like:* a flood mark on a wall; a ship's name on the hull; a record on a mountain hut.
- **A plate of type in the sky.** The title or the sign-off is cut into the sky as an ink block with paper letters, part of the same direction-space sky. *Fits content like:* a title over a skyline; chapter names over a sea; a dedication over a valley.

## 9. Pitfalls of the medium

- **Close-ups expose the flat shading.** 3D props pushed close to the lens look like toys. Keep living subjects to mid shot as flat silhouettes; give close props real materials (carved wood, concrete formwork, cast iron).
- **Empty paper.** A field of snow without layers goes blank. Keep three layers in frame; add drift strokes, reed ticks, thickets, belts.
- **Grey sludge.** Fine cuts at distance average to grey; fade them to solid ink or paper with distance and use negative mip bias for thin sprites.
- **Sliding lines.** Any cut spaced in screen space swims as the camera moves; anchor cuts to world space (or direction space for the sky).
- **The road look.** A dark river with a pale bank lip and regular dashes reads as asphalt. Break the rhythm of bank marks and keep the lip narrow.
- **Small subjects vanish.** Real-scale animals disappear in a wide frame; draw distant ones up to 3× larger (a printmaker's scale), keep the red at its minimum size.
- **Camera through solids.** Clear trees and posts from the camera path before placing scenery; check every low pass frame by frame.
- **Too many greys from post.** Vignette and blotches darken the paper and make the print look dirty; keep them light.

## 10. Engine

- `demo/look.js`: every material. `carveMat(scale)` (faceted terrain cuts), `skyMat` (direction-space sky with `uFront` for carving, `uDense` for day, and `typePlate` for words in the sky), `groundMat(mask, rect)` (snow with a river cut out), `waterMat`, `bankMat`, `concreteMat`, `woodMat`, `billboardMat(tex, mode, opts)` (cylindrical or spherical, `fade` near the camera), `reflectMat`, `crownMat` (minimum-size red points).
- `demo/textures.js`: `pineAtlas`, `frostTreeAtlas` (drawn at 2×), `craneAtlas` with `POSE` and `HEAD` (silhouette poses and where the red sits), `mistAtlas`, `moonCanvas`, `sunCanvas`, `cut()` (the knife stroke used everywhere).
- `demo/world.js`: `buildWorld(scene, proj, clearPath)`, the river ribbon and mask, `volcano(cx, cz, h, r, seed, crater)`, belts and thickets, `Flock` (instanced birds with crowns and reflections, printmaker's scale by distance).
- `demo/props.js`: carved type on canvas (`carvedText`, `plateCanvas`, `boardCanvas`, `skyTypeCanvas`).
- `demo/props.js`, `demo/textures.js` and `demo/look.js` are all the drawing; `demo/scene.js` holds the subtitle bar (`SUBS`, `drawSub`) and the time warp that slows one stretch of the take (`WARP`).
- Minimal example, not in the demo: a lighthouse on a cliff at night: `volcano(0, -800, 120, 400, 7, .8)` for the headland, a white cylinder with `concreteMat`, one red lamp as a `crownMat` point, sea as `waterMat` on a wide ribbon, `skyMat` with `uFront` rising for dawn.

## 11. Variation space

The agent decides the place, the subject that gets the red, the route of the take, where the cuts fall, the words and where they are carved, the pacing and the score.

- **Three structures:** a river followed from source to sea in one take, with the dates carved on bridges; a street at night, one window lit per year, ending on the full street; a mountain hut's logbook, each page a different season of the same view.
- **Three openings:** a single red lamp in a black frame that turns out to be a ship far out at sea; a close cut of frost on a window that the camera passes through into the valley; a title cut into a night sky over a harbour.
- **Three endings:** the camera rises until the place becomes a printed map; a final seal pressed onto the scene itself; the sheet peeled away to show blank paper with the first line of the next story cut in.

---

How our demo was made (story, shots, score, end card, build): [DEMO.md](DEMO.md). Read it after your treatment exists.

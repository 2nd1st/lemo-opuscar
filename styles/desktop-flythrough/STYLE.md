# Desktop Flythrough 桌面穿梭 — Style Prompt

> App screens and tools lie on a sunlit desk as printed paper cards; small pixel characters, popped up into voxel toys, carry the work from card to card, while one unbroken camera flies after them, whips between stops and finally pulls back over the whole desk.
> References (grammar only): one-take desktop tours in software launch films (windows laid flat as places, a small helper as the guide); macro toy photography (low warm sun, long soft shadows); pixel-art sprites (the cast's look). Never copy their characters, layouts, icons or music.

## 1. Essence, and what it is not

- **The desk is the world.** A matte paper mat with a regular dot grid lies on a light wooden desk, lit by one low warm sun through a window. Everything sits on it and casts a long, soft shadow. A few everyday desk things (a pen, sticky notes, a mug, earbuds) sit around the edges as foreground and background layers.
- **Interfaces are paper cards.** Phones, tools and dashboards are rounded slabs a few millimetres thick with the interface printed on top. They are places: characters stand and hop on them, and parts of the interface rise out of them as small 3D objects.
- **The cast are pixel sprites made solid.** One bevelled cube per pixel, thicker inside than at the edge, eyes standing proud. They lie on a card as flat stickers and pop up into toys; they blink, wait on the beat, get squashed and spring back.
- **Every stop is busy.** At each station something small moves besides the main action: debris bursts, data cubes hop, a lamp blinks, marks vibrate.
- **One take.** No cuts. The camera glides, orbits, cranes and whips between stops; it closes on the whole desk.
- **Everything lands on the beat.** Hops, pops, ticks and slams sit on the 16th-note grid of one steady tempo, and every action has a sound.

Not a screen recording (no cursor, no glowing monitor, no real app chrome or logos); not a brick or clay toy film (pixel voxels on printed paper); not an isometric infographic (perspective camera, real light); not flat motion graphics (everything has thickness and a shadow).

## 2. Materials & rendering

- three.js, physically based, neutral tone mapping. Scale: a card is 0.3–0.7 units wide (1000 canvas px per unit); a character is 1/6–1/10 of a card's width; dots 0.03 apart.
- **Light**: one directional sun low from the back-left (about 20° up, so a toy's shadow is two or three times its height), a 4096 soft shadow map that follows the camera target and resizes with distance; a cool-sky / warm-ground hemisphere fill, so shadows read blue and lit faces warm; a faint room environment for highlights; exponential fog thinned as the camera pulls back.
- **Desk**: a dotted paper mat (a thin rounded slab whose size is a multiple of two dot spacings, so the printed dots line up with any 3D dots) on a procedural light-oak plane (planks, long soft grain). Soft window-light patches (blurred four-pane shapes, warm, additive, low opacity) lie under the cards. Props are plain primitives in matte or satin materials, placed so each close shot has something soft in front of or behind its subject.
- **Cards and screens**: a rounded slab plus a canvas texture on top with a faint deterministic grain. Print is flat: one ink, mono labels in spaced caps, bold numerals, thin rules; a card head carries two lines (English mono caps over the other language in bold). A phone is a card with a dark bezel and a whole interface: status bar, a header with a name, a few message bubbles, an input field and a send button. Redraw a canvas only when its state changes; quantise continuous changes.
- **Voxel cast**: instanced bevelled cubes per pixel; depth grows with distance from the silhouette; pure-black pixels are eyes, which protrude and blink (they take the colour of the pixel above). Rig: root (feet, yaw) → hinge (lying flat ↔ standing) → squash (scaled at the feet) → spin. State: `e` (0 flat sticker … 1 full toy), `hinge`, `sq`. The same picture at half resolution is the same character, smaller and chunkier.
- **Props**: the same voxel recipe (crosses, ticks, bells) or plain rounded primitives (bricks, presses, drawers, towers, tent cards, stamps). Data that rises out of a card is extruded from its printed shape, so it still reads from above.
- **Impact ring**: a thin accent-coloured ring spreads over the paper from an impact and fades in about a second.
- **Post, per frame**: 16–24 sub-frames with Halton sub-pixel jitter (anti-aliasing, and a little motion blur on fast moves) → depth of field on each sub-frame, behind the focus plane only → bloom on highlights only → grade (light vignette, slight warmth, a little contrast and saturation). Subtitles are DOM on top.

## 3. Colour logic

- **One light ground** (the mat) with a slightly darker dot, cool-tinted so the warm sun leaves it fresh; a warm wooden desk around it; cards in a near-white of the same temperature; **one dark ink** for print; **one accent reserved for what matters now**: the route, the current step's badge, the send button, the lit window, the key word.
- Two or three support hues for the cast and props, mid-saturated, never neon; one warm cast colour against the cool ground. **Red only for failure or trouble** (an error, a weak signal), **green only for success**; data in motion may take one bright support hue so it reads apart from the route.
- Judge the rendered frame: avoid grey on grey; keep the vignette light and the shadows tinted by the sky fill.
- Brand use: the brand colour becomes the accent; the brand's interface colours print on the cards; the ground stays light.

## 4. Type & subtitles

- **In the world, only keywords and numbers**: step badges (a camera-facing accent pill with a digit and one word), sizes, a name on a screen, a banner, a title card. Text meant to be read is framed above the subtitle area, held still for its reading time, and large enough at the angle it is seen: flat print reads from 55–70° down; a low camera reads a standing tent card.
- **Titles are objects on the desk**: an opening tent card beside the first stop; at the end a large paper card dropped into the empty middle of the desk.
- Every face on screen comes from the film's own font files (cards, pills, subtitles); the mono stack falls back to the film's CJK face, never to a system face.

### Voice-over and subtitles

- When the film explains something, a voice tells it: short spoken lines, one idea each; the picture shows what the voice is saying at that moment, and the words on cards are only the keywords of the line.
- **One subtitle cue per spoken line**, in a quiet bar at the bottom centre (a rounded ink box at about 72 % opacity, about 64 px above the frame edge): the spoken language on the first line (bold, about 40 px), a whole-sentence translation on the second (about 26 px). One language per line, never wrapped. The cue appears with the line and leaves with it.
- The camera keeps its subject about 110 px above centre (a fixed vertical view offset), so nothing that matters sits under the bar.
- A version voiced in another language starts each line on the same second, so picture, subtitles and timing do not change.

## 5. Motion quality

- 30 fps. One steady tempo (110–130 BPM); every action on the 16th grid, big moments on downbeats.
- **Hops**: an arc with squash and stretch (stretch about 14 % in the air, squash about 30 % for 0.2 s on landing, a small anticipation squash before take-off). Groups move follow-the-leader, each a 16th behind the one ahead, so they never close up.
- **Characters act**: they blink every couple of seconds, bounce on the beat while they wait, squint when they are squashed, lean towards what they look at.
- **Pop**: sticker → toy in 0.25–0.5 s (hinge up with overshoot, cells extrude from the centre, a small jump, squash on landing). **Reverse pop**: toy → sticker or print when it is stored, delivered or taped down.
- **Slam**: drops from above with ease-in, lands on a downbeat, squashes, jolts the card, sends out a ring.
- **UI comes alive in sequence**: digits, bars, ticks, typed characters appear on 16ths with an overshooting ease.
- Idle is a small bounce or a blink, never a dead hold of more than about 1.5 s. Paper and cards never move except for a jolt or a curtain-call hop.

## 6. Camera grammar

| Move | What it expresses | Can serve |
|---|---|---|
| Macro glide with a slow orbit (close, 20–45° down) | being there, small scale | a character at work; one detail of an interface; a title standing on the desk |
| Whip from card to card (0.3–0.5 s, banking into the turn) | the next step, cause → effect | a process moving on; a hand-off between tools |
| Rise to near top-down (55–70° down) | reading, one card as a whole | a screen, a counter, a table; any verdict |
| Ride along, low behind the subject | travel, momentum, pursuit | a route; a delivery; a download |
| Pull back over the desk | the whole system, scale | a recap; the route so far; many stations at once |
| Hold with a shake | impact | a press, a stamp, a ring |

- One take, no cuts, no dissolves. Targets are live subjects; between keys the target follows a Hermite path with live end points; drift is a breath, not a handheld wobble.
- At a key where a whip starts, the target rests first (or the camera stutters). A character's take-off is the natural start of a whip. A whip between far-apart stops arcs up mid-way so the stops in between stay in frame.
- Wide shots frame the stations to fill at least 70 % of the frame width. **The film closes on the whole desk**: every stop and the route in one frame, everything moving once, the title landing in the middle.

## 7. Sound palette

- **Score**: bright and warm, acoustic in feel: marimba (with vibraphone under long notes), plucked bass, a soft synthetic kick (a short sine sweep), claps, shaker, a quiet string pad. One key, diatonic chords, about one chord per bar. Under a voice the score is a light bed ducked about 16 dB while someone speaks; the full mallet theme plays where nobody speaks.
- **Foley**: every action has a sound. Pop: a marimba note from the current chord plus an upward sweep. Hop: a soft tick. Landing: a felt thump. Press or stamp: a low thump with a crumble. Typing: dry key clicks. Ding: two bell notes from the chord. Camera whip: a whoosh sized by the measured camera speed. Pitched foley takes its notes from the score's chord table and sits on the 16th grid.
- **Mix**: the voice leads (about −16 LUFS before delivery, −14 after); music 15–18 dB under the voice and lifted in the gaps; foley under the voice; true peak at or below −1.5 dBFS. The final chord holds to the last half-second.

## 8. Native moves

- **Sticker pop.** A flat pixel sticker on a card stands up and extrudes into a toy on a 16th. *Fits content like:* a new user, file or job appearing; a feature switched on; an order placed.
- **Reverse pop.** A toy lies back down into a sticker or a print. *Fits content like:* a photo delivered into a chat; a snapshot saved; a task archived.
- **Press.** A heavy plate drops on a toy; pixel debris bursts out and rolls away; the same character pops out at half resolution beside a counter that runs down. *Fits content like:* compression; a budget cut; a summary of a long report.
- **Drawer.** A slab of a stacked tower slides open, a toy hops in, it closes and one window lights; small data cubes hop into the windows. *Fits content like:* storing something in the cloud; a queue; an archive.
- **Messenger.** A small voxel object (a bell, an envelope) flies an arc between two cards leaving a dotted trail, taps the target twice, and a banner drops on its screen. *Fits content like:* a notification; a hand-off; an alert.
- **Data run.** A stream of small bright cubes runs along the route between two stations. *Fits content like:* a download; a sync; a payment going through.
- **Blurry, then sharp.** A picture on a screen card is printed blurred, then snaps sharp as the toy lands in it. *Fits content like:* loading; focus; a draft becoming final.
- **UI rises.** Part of the printed interface grows into 3D out of its printed shape. *Fits content like:* progress; a metric climbing; a step badge.
- **Curtain call.** The closing pull-back frames every stop; each hops once, left to right, the characters pop back up, and a title card drops into the middle. *Fits content like:* a recap; a team; a pipeline shown whole.

## 9. Pitfalls of the medium

- **Softness**: depth of field and motion blur easily turn a subject or its words to mush. Blur only what lies behind a focus plane set a little beyond the subject, lightly (≤ 5 px), never anything in front; let the shutter shrink with camera speed so a streak never exceeds about 8 px; draw card and screen canvases at 3–3.4× (pills at 3×) so print stays crisp when a card fills the frame; no CSS or canvas blur on anything meant to be read.
- **Flat print read at a low angle**: text on a card seen from 20° is unreadable. Rise to 55–70° to read a card; put text the low camera must read on a standing object.
- **A standing toy hides the row behind it**: place characters beside or behind the text being read, or off the card, and check every reading frame for overlap.
- **Text under the subtitle bar or cut at the frame edge**: keep the fixed vertical offset; show name plates and labels only in the shots that frame them whole; take camera-facing pills away before the camera moves on.
- **Screens that read as blank**: a phone card without a whole interface reads as an empty white slab in close-up.
- **Whips over bare paper**: a fast move between far-apart cards crosses empty desk; arc it up so the stops in between pass through frame.
- **Dead stations**: a stop where only the main action happens looks static; give it one or two small moving things that do not compete with what the voice says.
- **Bars and ticks seen from above**: upright 3D bars and standing checkmarks turn into blobs in a top-down view; extrude them along the card or lay them flat.
- **Interpenetration**: characters at the same depth overlap; followers move one 16th apart; a knocked-flat pile goes back to sticker thickness before it stacks; check props against card edges, gates and drawers.
- **Ripples as pegs**: lifted 3D dots read as pegs from above; use a flat expanding ring.
- **Slow renders**: canvas redraws on every sub-frame; redraw on state change only.
- **A score made of fragments**: write whole phrases and put the accents on top.

## 10. Engine

In `demo/` (three.js r170 + Canvas 2D; page contract `render(t)`, `DUR`, `EV`, `TEXTS`):

- `src/world.js`: renderer, sun, fog and the desk (`makeWorld({ mat: [w, h] })` lays a dotted mat on light oak); `card(world, canvas, w, h, thick)`, `dotPatch()`, `pill()` (camera-facing label), `rbox()`.
- `src/cards.js`: palette, canvas helpers (`canvas`, `txt`, `tag`, `cardBase` with a two-line head, `grain`, `dotTile`, `tick`, `cross`).
- `src/voxel.js`: `makeMonster(art, cell, name, depthK)` → `set({pos, yaw, e, hinge, sq, tiltX, tiltZ, scale, vis})`, `blink(on)`.
- `src/anim.js`: `hops`, `squash`, `pop`, `beatBounce`, eases.
- `src/camera.js`: `makeRig(ctx, camera, KEYS, SHAKES)`, the live-target rig with resting keys, banking, shakes and the vertical view offset; `src/shots.js` holds the demo's keys.
- `src/post.js`: sub-frame accumulation, back-only depth of field, bloom, grade. `src/main.js`: the page, the speed-capped shutter and `TEXTS` (subtitle-free reading boxes projected from the world).
- `src/captions.js`: subtitle cues from the voice clock (`src/vo.js`, written by `audio/vo_timeline.py`) and the sign-off; `?nosub=1` hides both for clean stills.
- `src/film.js`: the demo's cards, tower, props, cast and timeline.
- `audio/`: `vo_timeline.py` (lines on the clock), `compose.py` (score with the library sampler), `foley.py` (foley from events, pitched from the chord table, whooshes from `tools/camspeed.mjs`), `mix.py` (voice, ducked music, foley).

Minimal start: a to-do card and a calendar card; a ticket sticker pops on beat 1, blinks, hops to the calendar on beat 3 while the camera whips after it, and drops into a day as a printed tag.

## 11. Variation space

The agent decides for each film: which apps or tools the cards are and how they lie on the desk, the cast (a mascot drawn as pixel art), the route, the props at each stop, the palette within §3, the tempo within §5, the language of the voice.

- **Structures**: one item travels card to card and changes at each stop; the same job on two halves of the desk, slow against fast; one tiny detail that grows out to a desk of many cards.
- **Openings**: a terminal types a command and its cursor becomes a character; the camera falls onto the desk and lands on beat 1; a title tent stands beside the first card while the hero pops up.
- **Endings**: the curtain call over the whole desk; the cast reverse-pops into a saved record; the camera rises until the cards become part of the dot pattern.

---

How our demo was made (story, shots, voice, score, build): [DEMO.md](DEMO.md). Read it after your treatment exists.

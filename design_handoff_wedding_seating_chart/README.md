# Handoff: Wedding Reception Digital Seating Chart

## Overview
A mobile-first web app that wedding guests reach by scanning a QR code at the reception (held at **The Oakville Grill & Cellar**). A guest types their name, picks themselves from a live suggestion list, and is shown a warm welcome, their **table number**, a **floorplan of the dining room with their table highlighted**, and their **plated meal selection + any dietary note**. The aesthetic is elegant and high-class — deep teal-green / cream / gold with a serif display face — reflecting the wedding of **Asra & Nabeel** (logo monogram "A·N").

This is a single-screen app with two states: **Landing** (search) and **Result** (table reveal). It is intended for **mobile portrait browsers only**.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype showing the intended look, copy, and behavior. They are **not production code to ship directly**. The design was authored in a proprietary HTML component format ("DC" — note the `<x-dc>`, `<sc-if>`, `<sc-for>`, and `{{ }}` template syntax, plus the `./support.js` runtime). **Do not try to run or copy this format directly.**

Your task is to **recreate this design in the target codebase's environment** (React, Vue, Svelte, plain HTML/JS, SwiftUI, etc.) using its established patterns. If no codebase exists yet, **React + Vite (or Next.js) with plain CSS / CSS-modules** is a great fit — this is a tiny, static, read-only app with no backend required (guest data can be a bundled JSON file).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, motion, and copy are all specified below and in the prototype. Recreate the UI faithfully. The one piece that is **placeholder** is the **guest list** — the prototype generates 150 fake guests in code (`buildGuests()`); the couple will supply a real JSON file (see **State Management → Data**).

---

## Screens / Views

### 1. Landing (search)
**Purpose:** Guest finds themselves by name.

**Layout:** Full-viewport vertical flex column, center-aligned, `padding: 54px 30px 40px`, `text-align: center`. Top-to-bottom:
1. **Date eyebrow** — `Asra · Nabeel · 06.27.26`, uppercase, letter-spacing `.42em`, 11px, gold. `margin-bottom: 30px`.
2. **Monogram logo** — `assets/AN-monogram.png`, width **158px**, auto height, drop-shadow `0 6px 20px rgba(0,0,0,.18)`.
3. **Title** — "Find Your Seat", Cormorant Garamond, 33px, weight 500, `margin-top: 26px`.
4. **Subtitle** — "Enter your name and we'll guide you to your table for the evening.", Jost, 13.5px, weight 300, `max-width: 268px`, `margin-top: 11px`.
5. **Search field** (relative wrapper, `max-width: 330px`, `margin-top: 30px`):
   - **Input** — full width, `padding: 16px 20px`, `border-radius: 14px`, 1px themed border, themed translucent bg, 16px text, **center-aligned**, placeholder "Your name". `autocomplete/autocorrect/spellcheck` all off. Focus removes outline.
   - **Suggestion dropdown** (absolutely positioned, `top: calc(100% + 10px)`, full width, `border-radius: 14px`, themed bg + border, shadow `0 18px 40px rgba(0,0,0,.22)`, `z-index: 5`). Each **row**: flex space-between, `padding: 14px 18px`, 1px bottom divider between rows (none on last). Left = guest full name (Cormorant Garamond 19px, weight 500); right = "Table N" (Jost 11px, uppercase, letter-spacing `.12em`, gold). Active-press: `transform: scale(.985)`.
   - **No-match state** — when query ≥ 2 chars and zero matches, the dropdown instead shows centered text "No match yet — try your last name." (Jost 13px, weight 300).
6. **Spacer** (`flex: 1`) pushes footer down.
7. **Footer** — `— THE OAKVILLE GRILL & CELLAR —` with two 26px gold hairlines flanking the text (flex row, gap 10px, `opacity: .7`). Jost 10px, uppercase, letter-spacing `.34em`. `margin-top: 38px`.

### 2. Result (table reveal)
**Purpose:** Show the matched guest their seat.

**Layout:** Full-viewport vertical flex column, center-aligned, `padding: 42px 26px 36px`. Top-to-bottom:
1. **Monogram logo** — `assets/AN-monogram.png`, width **104px**, opacity .95, `margin-bottom: 18px`. *(Note: deliberately larger than an earlier 62px version for legibility — keep at 104px.)*
2. **"WELCOME" eyebrow** — Jost 11px, uppercase, letter-spacing `.34em`, gold.
3. **First name** — Cormorant Garamond, **38px**, weight 600, ink color, `margin-top: 7px`.
4. **Welcome message** — italic Cormorant Garamond, 16.5px, soft color, `max-width: 280px`, `margin-top: 12px`. Copy: "We're so glad you're here to celebrate with us. Your place is waiting."
5. **Table number block** (`margin-top: 26px`, centered column):
   - Eyebrow "YOU'RE SEATED AT" — Jost 10.5px, uppercase, letter-spacing `.42em`, gold.
   - **Big number** — Cormorant Garamond, **84px**, weight 600, gold, line-height .92.
   - Label "TABLE" — Jost 13px, uppercase, letter-spacing `.36em`, ink.
6. **Floorplan card** (see **Floorplan** section) — `max-width: 362px`, `margin-top: 28px`, themed cream bg, 1px gold-ish border, `border-radius: 18px`, `padding: 16px 14px 14px`, shadow `0 14px 36px rgba(0,0,0,.18)`. Header inside: hairline + "THE DINING ROOM" + hairline.
7. **Meal block** (`margin-top: 22px`, centered column, gap 10px):
   - Eyebrow "YOUR PLATED SELECTION" — Jost 9.5px, uppercase, letter-spacing `.34em`, gold.
   - Meal name — Cormorant Garamond 21px, weight 500, ink.
   - **Dietary pill** (only if guest has one) — Jost 10.5px, uppercase, letter-spacing `.18em`, themed gold-tint bg, `padding: 5px 13px`, `border-radius: 20px`.
8. **Spacer** (`flex: 1`, min 24px).
9. **"Not you? Search again" button** — transparent bg, 1px themed gold border, gold text, Jost 12px uppercase letter-spacing `.16em`, `padding: 13px 26px`, `border-radius: 30px`. Resets to Landing.

---

## Floorplan (SVG)
Recreate as an inline **SVG with `viewBox="0 0 792 436"`**, width 100%. It is a stylized top-down trace of the venue's real floorplan (`assets/floorplan-reference.png` included for reference). All strokes/fills use the theme's `planLine` / `planInk` / `planFillSoft` tokens.

**Static structure:**
- **Outer wall** — `rect x=12 y=28 w=768 h=392 rx=14`, no fill, 2px stroke.
- **"NORTH" label** — centered top (`x=410 y=46`), letter-spacing 5, opacity .5.
- **Veranda zone** (top-right) — dashed boundary lines (`x=300` vertical from y=40→322; horizontal y=118 from x=300→772), label "VERANDA · OUTDOORS" at (545,86), and **7 empty outline circles** (un-numbered veranda tables) at cx/cy: (332,64),(382,64),(432,64) and (560,62),(610,62),(660,62),(710,62), each r=13.
- **Bar** (center) — outer `rect x=312 y=150 w=84 h=152 rx=8` (filled soft + stroke) with inner `rect x=323 y=162 w=62 h=98` outline; "BAR" label at (354,290).
- **Stairs** — "STAIRS TO MAIN DINING" label at (398,330); `rect x=300 y=342 w=198 h=46` soft fill with 9 vertical step lines at x = 318,338,358,…,478 (y 344→386).
- **"ESTATE ROOM"** label bottom-right at (712,404).

**Guest tables** — two groups. Each renders an (initially invisible) gold **spotlight** ellipse/circle behind it, an (invisible) gold **ring**, the **table shape**, and the **number** centered. When a table is the guest's active table, the spotlight (opacity .16) and ring (opacity 1) appear, the shape fills gold, the number grows and flips to a light fill, and the shape/ring animate in (see Motion).

**Round tables** (`<circle>`, base r=19, active r=24; ring r=31; spotlight r=46). Number font Cormorant Garamond weight 600, base 17px / active 24px. Positions (table# → cx,cy):
```
16 → 138,80    12 → 246,78
10 → 461,139    7 → 566,137    4 → 666,140
 8 → 508,206    5 → 606,205    3 → 708,212
 9 → 459,267    6 → 558,274    2 → 663,270
```

**Long / rental tables** (`<rect rx=7>`). Number base 16px / active 22px. Geometry (table# → x,y,w,h):
```
15 → 60,150,30,152      (left banquet, vertical)
14 → 142,150,30,152     (left banquet, vertical)
11 → 248,150,30,152     (left banquet, vertical)
13 → 58,336,110,30      (bottom-left rental, horizontal)
 1 → 552,336,110,30     (bottom-right rental, horizontal)
```
For rect tables the ring is an ellipse `rx = w/2 + 10, ry = h/2 + 10`; spotlight ellipse `rx = w/2 + 26, ry = h/2 + 22`. Number is centered at the rect's center.

There are **16 numbered tables total (1–16)**. The 7 veranda circles are decorative/unassigned.

---

## Interactions & Behavior
- **As-you-type search:** on every input change, filter the guest list. Match if the query is a prefix/substring of **either first OR last name** (case-insensitive). Rank `startsWith` matches (rank 0) above `includes` matches (rank 1), then alphabetical by full name. Show the **top 6**. Suggestions appear at **≥ 1 char**; the no-match message appears at **≥ 2 chars** with zero results.
- **Select a guest:** tapping a suggestion row transitions to the Result screen for that guest and clears the query.
- **Back:** "Not you? Search again" returns to Landing, clears query and selection.
- **Navigation** is pure in-app state — no routing/URLs required (though a developer may add a route per state if desired).

## Motion
Two modes exist in the prototype, exposed as a `motion` prop: **`refined`** (default-feel: gentle) and **`delight`** (more playful). Implement both or pick `refined` if only one. Honor `prefers-reduced-motion` by disabling animations.

Keyframes (CSS):
- `scFadeUp` — opacity 0→1, translateY 14px→0.
- `scPop` — opacity 0→1, scale .62→1.06→1 (overshoot).
- `scRing` — scale .55→1.7, opacity .85→0 (expanding pulse ring).
- `scGlow` — opacity .3↔.8 loop (soft breathing).

**Refined mode:**
- `.sc-reveal` (screen container / name): `scFadeUp .7s cubic-bezier(.22,.61,.36,1) both`.
- `.sc-num` (table number block): `scFadeUp .8s` (.05s delay).
- Active table **ring**: `scGlow 2.6s ease-in-out infinite`.
- Active table **shape**: `scPop .6s` (.15s delay).

**Delight mode:**
- `.sc-reveal`: `scFadeUp .65s`.
- `.sc-num`: `scPop .85s` (.18s delay) — number pops in.
- Active table **ring**: `scRing 2.1s ease-out infinite` (.3s delay) — repeating expanding pulse.
- Active table **shape**: `scPop .7s` (.25s delay).
- Result sub-elements stagger in via `.sc-r1`–`.sc-r4`: `scFadeUp .6s` with delays .04s / .12s / .22s / .34s respectively (logo+eyebrow, message, floorplan card, meal+button).

All animated elements use `transform-box: fill-box; transform-origin: center` for SVG transforms.

## State Management
**State variables:**
- `screen`: `'landing' | 'result'`
- `query`: string (search box value)
- `selected`: the matched guest object (or null)

**Transitions:** `onInput` → set `query`; select suggestion → `screen='result'`, `selected=g`, `query=''`; back → `screen='landing'`, `selected=null`, `query=''`.

**Data:** The guest list is the only real data dependency. The prototype fabricates it; production should load a **bundled JSON file** (no backend/auth — this is public read-only data shown at the venue). Each guest object shape:
```json
{
  "first": "Olivia",
  "last": "Bennett",
  "name": "Olivia Bennett",
  "table": 7,
  "meal": "Filet & Wild Mushroom",
  "dietary": "Gluten-Free"   // or null
}
```
`name` can be derived as `first + ' ' + last`. `table` is an integer 1–16. `dietary` is null when none. ~150 guests expected. **Search and meal/dietary display are the only consumers of this data.**

## Design Tokens

The app ships **two themes**, selectable via a `theme` prop: **`cellar`** (deep teal-green, dramatic) and **`grove`** (airy cream). The prototype's current default is **`grove`**. Pick one as the production default (recommend confirming with the couple).

### Theme: `cellar` (deep)
| Token | Value |
|---|---|
| bg (page) | `linear-gradient(168deg,#1c453c 0%,#16352e 60%,#122c26 100%)` |
| ink (primary text) | `#f4eddc` |
| soft (secondary text) | `#bcccc0` |
| faint (placeholder) | `#7f9389` |
| gold (accent) | `#d4ad62` |
| input bg / border | `rgba(255,255,255,.06)` / `rgba(212,173,98,.4)` |
| suggest bg / border / row-divider | `#1f4a40` / `rgba(212,173,98,.22)` / `rgba(244,237,220,.08)` |
| map card bg / border | `#f7f1e3` / `rgba(212,173,98,.55)` |
| plan line / ink / soft-fill | `rgba(28,69,60,.3)` / `#1c453c` / `rgba(28,69,60,.08)` |
| inactive table fill / stroke / num | `rgba(28,69,60,.06)` / `rgba(28,69,60,.32)` / `rgba(28,69,60,.6)` |
| active table number fill | `#16352e` |
| dietary pill bg / text | `rgba(212,173,98,.16)` / `#e7c884` |
| back-button border | `rgba(212,173,98,.4)` |

### Theme: `grove` (airy)
| Token | Value |
|---|---|
| bg (page) | `linear-gradient(170deg,#f7f3e8 0%,#efe9d8 100%)` |
| ink | `#22463d` |
| soft | `#5d6f64` |
| faint | `#a7ad9f` |
| gold | `#b08a3e` |
| input bg / border | `rgba(255,255,255,.72)` / `rgba(34,70,61,.18)` |
| suggest bg / border / row-divider | `#fffdf7` / `rgba(34,70,61,.12)` / `rgba(34,70,61,.08)` |
| map card bg / border | `#fbf8f0` / `rgba(176,138,62,.4)` |
| plan line / ink / soft-fill | `rgba(34,70,61,.22)` / `#22463d` / `rgba(34,70,61,.07)` |
| inactive table fill / stroke / num | `rgba(34,70,61,.05)` / `rgba(34,70,61,.28)` / `rgba(34,70,61,.55)` |
| active table number fill | `#fbf8f0` |
| dietary pill bg / text | `rgba(176,138,62,.12)` / `#8a6a2c` |
| back-button border | `rgba(34,70,61,.22)` |

### Typography
- **Display / numerals:** Cormorant Garamond (Google Fonts) — weights 400/500/600/700, plus italic 400/500.
- **UI / labels:** Jost (Google Fonts) — weights 300/400/500/600.
- Import: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap`
- Recurring eyebrow pattern: Jost, uppercase, wide letter-spacing (.34em–.42em), gold.

### Radii & Shadows
- Radii: input/suggest `14px`; map card `18px`; dietary pill `20px`; back button `30px`; floorplan table rects `7px`.
- Shadows: suggest dropdown `0 18px 40px rgba(0,0,0,.22)`; map card `0 14px 36px rgba(0,0,0,.18)`; logo drop-shadow `0 6px 20px rgba(0,0,0,.18)`.

### Viewport
Designed at **390 × 844** (iPhone portrait). Layout is fluid within a phone column; the app should fill `100vh` with the page gradient and is **not** designed for desktop/landscape (acceptable to cap content width ~430px and center on larger screens).

## Assets
- `assets/AN-monogram.png` — the gold "A·N" wedding monogram (transparent PNG). Used on both screens. **Provided by the couple.**
- `assets/floorplan-reference.png` — photo/scan of the venue's real printed floorplan, included **only as a tracing reference** for the SVG. Do **not** display it in the app.

## Files
- `Seating Chart.dc.html` — the full design prototype (reference only; proprietary DC/HTML format — do not run/ship directly). All layout, copy, tokens, geometry, and motion live here.
- `assets/AN-monogram.png` — logo asset to ship.
- `assets/floorplan-reference.png` — reference image (do not ship).

## Open items for the couple / developer
1. **Real guest JSON** replaces the generated placeholder list (shape above).
2. **Confirm default theme** (`cellar` vs `grove`) and whether both should be selectable.
3. **Meal names & dietary values** in the prototype are placeholders — use the couple's real menu.
4. Date in the eyebrow (`06.27.26`) — confirm/replace.

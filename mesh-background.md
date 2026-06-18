# Mesh Background — Implementation Handoff

Scope: **only** the animated "mesh" background treatment, at its current intensity. Nothing about layout, content, or other background options.

## What it is

A full-bleed decorative layer behind the page content: three large soft radial-gradient glows that slowly **breathe** (scale + fade) in a 13s loop. It sits on top of the base solid background and below all content.

## Layer stacking

The page root is `position: relative` and keeps its **base background** (a solid diagonal gradient). The mesh is a separate absolutely-positioned layer; content sits above it.

```
root (position:relative; background: <base gradient>)
 ├─ mesh layer   → position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden
 └─ content      → position:relative; z-index:1
```

Base gradients (unchanged, for reference):
- Dark "cellar" theme: `linear-gradient(168deg,#1c453c 0%,#16352e 60%,#122c26 100%)`
- Light "grove" theme: `linear-gradient(170deg,#f7f3e8 0%,#efe9d8 100%)`

## Keyframes

```css
@keyframes scMesh {
  0%, 100% { opacity: .68; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.05); }
}
```

## The mesh element

A single element with three stacked radial-gradients. `inset:-12%` lets the scale animation grow past the viewport without revealing edges.

```css
.mesh {
  position: absolute;
  inset: -12%;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(46% 42% at 18% 20%, var(--glow-warm) 0%, transparent 66%),
    radial-gradient(52% 48% at 84% 26%, var(--glow-cool) 0%, transparent 68%),
    radial-gradient(58% 54% at 50% 92%, var(--glow-warm) 0%, transparent 66%);
  animation: scMesh 13s ease-in-out infinite;
}
```

## Glow colors (current intensity)

These are the "strong" values driving the current look. Two glow tones per theme — a warm gold and a cool tone:

| Theme  | `--glow-warm`            | `--glow-cool`            |
|--------|--------------------------|--------------------------|
| cellar | `rgba(212,173,98,.46)`   | `rgba(74,140,120,.66)`   |
| grove  | `rgba(176,138,62,.40)`   | `rgba(91,122,92,.42)`    |

## Minimal HTML

```html
<div class="root">
  <div class="mesh"></div>
  <div class="content"><!-- page content --></div>
</div>
```

```css
.root    { position: relative; min-height: 100vh; overflow: hidden;
           background: linear-gradient(168deg,#1c453c 0%,#16352e 60%,#122c26 100%);
           --glow-warm: rgba(212,173,98,.46); --glow-cool: rgba(74,140,120,.66); }
.content { position: relative; z-index: 1; }
```

## Notes
- Intensity is controlled entirely by the two glow alpha values and the `transparent` stop percentages (lower % = tighter, denser glow). The values above are the current, dialed-in level — don't change them unless asked.
- The animation is purely opacity + scale; the gradient positions are static. No JS required.
- `pointer-events:none` keeps the layer non-interactive. `overflow:hidden` on the root clips the `inset:-12%` overscan.

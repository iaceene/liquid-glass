---
name: nimbus-liquid-glass
description: Design and build React + TypeScript UI components in the "Nimbus UI" liquid-glass / Frutiger Aero water style — glass panels with a tiny WebGL water shader, spring-physics drops that stretch, pinch into droplets and land with ripples, CSS fallbacks, reduced-motion and full accessibility. Use this skill whenever the user wants a new component (button, tabs, select, dropdown, modal, dialog, tooltip, toast, slider, switch, checkbox, radio, progress, stepper, sidebar, menu, card, input, carousel, pagination, etc.) in liquid glass, glassmorphism, water, aqua, Frutiger Aero, "Nimbus", or "same style as the liquid navbar / accordion / toggle / checkout", even if they only say "make it like the other components". Also use it when integrating or extending any liquid-glass-*.tsx file in components/ui.
---

# Nimbus UI — Liquid Glass Component Skill

Nimbus UI is a family of self-contained React components that share one visual idea: **everything is glass with water in it**. A pool of water sits on a frosted-glass panel. When state changes, the water *moves like a liquid* — it stretches toward the new target, pinches into droplets on long jumps, and merges back with a ripple. Existing family members: `LiquidNavbar` ("Waterline"), `LiquidAccordion` ("Spillway"), `LiquidToggle` ("Surface Tension"), `LiquidCheckout` ("Tidepool" + `WaterCard`).

Your job: when asked for a new component, build it as a **new member of this family** — same anatomy, same physics, same tokens, same a11y bar — not a generic glassmorphism card.

Read `references/water-engine.md` before writing any shader or physics code. It contains the canonical fragment shader, `initGL`, and the `useWater` hook to copy from. Do not reinvent them.

---

## 1. Non-negotiable rules

1. **Dependencies: React only.** No framer-motion, three.js, GSAP, Radix, lucide inside the component. Icons are inline SVG. (The *demo* may use Tailwind; the component must not need it.)
2. **Self-contained styles.** CSS lives in one template-string constant, injected with `<style dangerouslySetInnerHTML={{ __html: CSS }} />`. Each component uses its own class prefix (`nf-`, `nt-`, `lc-`, `nv-`, `nc-` exist — pick a fresh 2-letter prefix, e.g. `ns-` for select) and a root class `nimbus-<name>`.
3. **File shape:** `"use client"` first line → header comment (name, "Nimbus UI · Liquid X — "Codename"", one-paragraph behavior description, "No dependencies besides React.") → types → constants → CSS → shader → state/physics → component → exports.
4. **Exports:** named export, plus `export { LiquidX as Component }` and `export default LiquidX`.
5. **File location:** `components/ui/liquid-glass-<name>.tsx` (kebab-case), plus a `demo.tsx` importing from `@/components/ui/liquid-glass-<name>`.
6. **Progressive enhancement:** WebGL water when available; a pure-CSS fallback (`data-gl="off"`) that still looks like glass + a soft pool when WebGL is missing or the context is lost.
7. **Reduced motion:** `prefers-reduced-motion` → physics snaps to target (no springs, no droplets, no ripples, no ambient waves), CSS animations/transitions disabled.
8. **Performance:** the rAF loop **sleeps** when off-screen, tab hidden, or settled (see §5). DPR capped at 1.75–2. Canvas covers only the component + `PAD` bleed.
9. **Accessibility is real:** semantic elements (`button`, `nav`, `form`, `role="switch"`, etc.), ARIA state, keyboard support, visible focus ring, decorative layers `aria-hidden`.
10. **Typography:** `ui-sans-serif, -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif`, `-webkit-font-smoothing: antialiased`, negative letter-spacing (`-.01em`), weights 500–650.

---

## 2. Anatomy (every component has these layers)

```
<root class="nimbus-x" data-tone="light|dark" data-gl="on|off" style="position:relative;isolation:isolate">
  <style/>                                  ← injected CSS
  <span class="nx-glass" aria-hidden/>      ← z-index:-2  frosted panel (backdrop-filter + rim shadows)
  <canvas class="nx-water" aria-hidden/>    ← z-index:-1  WebGL: drops, shadow, specular. left/top = -PAD
  <span class="nx-pool|nx-drop|nx-knob" aria-hidden/>  ← CSS fallback, display:none unless data-gl="off"
  …real, accessible content (z-index ≥ 1)…
</root>
```

- Root must create a stacking context (`isolation:isolate`) so the negative z-indexes stay inside it.
- The canvas is **transparent everywhere except the water** (shader returns `vec4(0.)` outside the panel + a few px of bleed). The glass panel is plain CSS, *not* shader — that keeps text crisp and `backdrop-filter` real.
- `PAD = 14` px of canvas bleed around the panel so shadows and ripples aren't clipped. Convert all pointer/layout coordinates with `+ PAD`.
- Never put text or interactive content in the canvas.

### Tokens (CSS custom properties on the root, redefined under `[data-tone="dark"]`)

| Token | Light | Dark |
|---|---|---|
| fg | `#0B132B` | `#F1F7FF` |
| fg-soft | `rgba(11,19,43,.6)` | `rgba(241,247,255,.66)` |
| faint | `rgba(11,19,43,.42)` | `rgba(241,247,255,.45)` |
| line | `rgba(11,19,43,.08–.1)` | `rgba(241,247,255,.09–.12)` |
| tint (glass bg) | `rgba(255,255,255,.14–.18)` | `rgba(10,18,40,.26–.32)` |
| rim (top highlight) | `rgba(255,255,255,.7–.8)` | `rgba(255,255,255,.3–.34)` |
| error | `#E5484D` | same |
| accent / focus | `#00A2FF` | same |
| water gradient | `#7EE8FF → #00A2FF` | `#2EB8FF → #0060CC` |
| demo background | `#DCEBF5` | `#0B132B` |

Name them `--x-fg`, `--x-soft`, `--x-line`, `--x-tint`, `--x-rim` with your component's letter.

### Glass panel recipe (copy, then adjust radius/blur)

```css
.nx-glass{position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--x-tint);
  -webkit-backdrop-filter:blur(12px) saturate(1.2) brightness(1.06);backdrop-filter:blur(12px) saturate(1.2) brightness(1.06);
  box-shadow:inset 0 1px 1px var(--x-rim),inset 0 0 0 1px rgba(255,255,255,.2),
             0 18px 44px -20px rgba(0,40,90,.5),0 2px 6px rgba(0,40,90,.08)}
/* dark: lower the outer shadow's blue → rgba(0,0,0,.7), inner ring .1 */
```

Recessed controls (inputs, toggle tracks) flip the shadow: `inset 0 2px 5px rgba(0,40,90,.16), inset 0 -1px 1px var(--x-rim)`.

### Glossy "drop" surfaces in pure CSS (buttons, icons, fallbacks)

```css
background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.75),rgba(255,255,255,0) 55%),rgba(255,255,255,.38);
box-shadow:inset 0 1px 1px rgba(255,255,255,.95),inset 0 -2px 6px rgba(0,162,255,.22),
           inset 0 0 0 1px rgba(255,255,255,.55),0 6px 16px -6px rgba(0,70,140,.45);
```

Radii: panels 28px, rows/inputs 14–20px, pills/buttons 999px, 3D cards `width*0.052`.

---

## 3. Choosing the water pattern

Decide *what the water does* in the new component, then pick the matching engine. Most components are one of these:

| Pattern | Use for | Source to copy | Key idea |
|---|---|---|---|
| **A. Pool follows a target rect** | accordion, tabs, segmented control, select/menu highlight, sidebar, radio group, stepper, list selection, input focus | Accordion (vertical), Checkout `useWater` (generic rects) | Two spring bodies (`a`, `b`: x,y,w,h). `getTarget()` returns the rect to occupy. Leader snaps fast (k≈210), tail lags (k≈60) → stretch. Gap > threshold → droplets. |
| **B. Capsule drop on a track** | toggle, switch, slider/range, rating, stepper thumb, scrubber, tab underline | Toggle, Navbar | Blobs are capsules `(x,y,halfLen,radius)` via `sdCap`; track has a `fill` x-position that follows the drop; drag past mid-point → neck breaks → snap. |
| **C. 3D glass slab with water level** | cards, tiles, widgets, pricing cards, profile cards, flip cards | `WaterCard` in Checkout | CSS 3D tilt from pointer (spring), flip via `rotateY`, shader draws a *level* surface that stays horizontal (slope = −tilt) and sloshes. |
| **D. Fill / progress** | progress bar, loader, upload, meter, button "processing", stepper completion | Checkout pay button (`setBlue`, `progRef`) | Drop box is the filled portion; `uBlue` switches water to saturated blue; success = gather into a round drop + check. |
| **E. Glass only + ripples** | modal, popover, tooltip, toast, input, tag, badge | Glass recipe + `ripple()` | No resident drop; pointer-down ripple, meniscus under cursor, drop *grows out of the trigger* on open (§4). |

Combine patterns when it fits (checkout = A + C + D). If none fits, invent the target function but keep the same engine.

---

## 4. Motion vocabulary (the family "feel")

Use these named behaviors; they are what makes a component read as Nimbus.

- **Stretch** — leader body springs to target, tail lags (`lagUntil` ≈ 70–140 ms with force factor 0.04–0.08).
- **Pinch / split** — when the gap between head and tail exceeds a threshold, spawn 2–4 satellite droplets (`sats`, radius 5–9 px, spring toward head, shrink when absorbed). Only once per move (`split` flag).
- **Land** — on settle (`moving && still`), push a ripple `{x,y,age:0,amp: split ? 1.1 : 0.6}`.
- **Squash** — `sy` spring (k 280, c 9) compresses/overshoots when the drop hits an end stop.
- **Meniscus** — pointer (mouse only) adds a smooth bump `uMouse` (strength eases with `dt*7`).
- **Tap wave** — every `pointerdown` pushes a ripple (amp ≈ 0.6–0.8).
- **Ambient** — faint travelling waves (`uAmb=1`), 0 under reduced motion.
- **Grow from icon** — when opening from "nothing", reset both bodies to the trigger icon's centre with w=h=0 so the pool grows out of the "+" drop.
- **Shake** — validation error: add velocity to head (`vx += 420; vw -= 160`).
- **Icon scenes** — small CSS keyframe "scenes" per icon on activation (`pop`, `drop`, `spin`, `plane`, `glow`, `wave`); restart by changing the element `key`.
- **Drip** — icon `translate/scale` squash-and-stretch keyframe (`nfDrip`).
- **Sound (optional prop `sound`)** — synthesized "plip": sine oscillator, freq `420–500 → 1500` exp-ramp over 70–80 ms, gain 0.0001→0.15 in 8 ms → 0.0001 by 160 ms. No audio files. Lazy `AudioContext` in a ref, wrapped in try/catch.
- **Haptics** — `navigator.vibrate?.(8–12)` on snap/success, try/catch.

Easings: overshoot `cubic-bezier(.3,1.6,.5,1)`; smooth open `cubic-bezier(.25,.9,.3,1)`; pool `cubic-bezier(.3,1.3,.4,1)`. Durations 0.25–0.6 s for CSS; physics does the rest.

Spring defaults (explicit Euler, `dt = min(frameDt, 1/30)`):
```
v += (k*(target - x) - c*v) * dt * f;  x += v * dt
lead: k 210–260, c 25–28   tail: k 60–72, c 13   height (lead): k 260, c 22
```

---

## 5. Engine contract (what every component implements)

State lives in **one `useRef(makeState())`** object, never in React state (React state is only for things that change DOM/ARIA: `current`, `gl: "on"|"off"`, phase, etc.).

```
draw()  – set uniforms, clear, drawArrays (or style the CSS fallback)
step(dt, now) – integrate springs, spawn/absorb droplets, advance ripples, ease mouse
loop()  – start rAF if not running; stop when: !visible || (reduce && !busy)
resize()/measure() – compute geometry, size canvas (W = w+2·PAD; H quantized to 96 px steps if height animates)
```

Setup effect (always the same):
1. `s.reduce = matchMedia("(prefers-reduced-motion: reduce)").matches`
2. `s.glc = initGL(canvas)`; if null → `setGl("off")`
3. `webglcontextlost` → `preventDefault`, `s.glc = null`, `setGl("off")`
4. `IntersectionObserver` → `s.visible`; `visibilitychange` → `s.visible`; call `loop()` when visible
5. `ResizeObserver` → `resize()`
6. Cleanup: remove listeners, `disconnect()`, `cancelAnimationFrame`, `s.raf = 0`

Controlled + uncontrolled: `const current = prop !== undefined ? prop : inner`; update `inner` only when uncontrolled; always call `onChange`. After drags/gestures call a `bump()` so a controlled parent that refuses the change re-syncs.

Layout-effect "follow the value": when the value/target changes, compute `T = target()`, choose `s.lead` = body closest to T, set `lagUntil`, `moving = true`, `split = false`, `loop()`.

---

## 6. Interaction & accessibility checklist

- Real elements: `button` for actions, `role="switch"` + `aria-checked` for toggles, `aria-expanded`/`aria-controls`/`role="region"`/`aria-labelledby` for disclosure, `role="radiogroup"/"radio"` with roving `tabIndex` for choice stacks, `<nav aria-label>` + `aria-current="page"`, `<form noValidate>` with `aria-invalid` and `aria-describedby` errors, `role="alert"` for errors, visually-hidden `role="status" aria-live="polite"` for async phases.
- Keyboard: Arrow keys move within groups (wrap), Home/End where it makes sense, Space/Enter activate, Esc closes overlays. `e.preventDefault()` on handled keys.
- Focus: `:focus-visible{outline:2px solid #00A2FF;outline-offset:2–3px}`; never remove it.
- Hidden content stays hidden from AT: collapsed panels use `visibility:hidden` with delayed transition (`transition:visibility 0s .5s`).
- Touch: `touch-action: pan-y` on horizontal drags, `-webkit-tap-highlight-color: transparent`, 44–58 px hit height, mouse-only meniscus (`pointerType === "mouse"`).
- Pointer capture for drags (`setPointerCapture`, try/catch), suppress the synthetic click after a drag.
- Forms: provide `name`/`value` hidden input where the native control would submit; use `autoComplete` tokens (`cc-number`, `cc-name`, `cc-exp`, `cc-csc`).
- Responsive: `max-width:100%`, container-width via `ResizeObserver`; layouts can switch mode by width (checkout: form ≥ 720 px, wallet stack below). Labels collapse to icon-only under 520 px (visually hidden, not removed).
- SSR-safe: touch `window`/`document`/`navigator` only inside effects or handlers.

---

## 7. Workflow for a new component

1. **Name it.** `Liquid<Name>` + a water codename ("Spillway", "Tidepool"…). Pick the CSS prefix and root class.
2. **Pick the pattern** from §3 and write one sentence: *"What does the water do when X happens?"* Put that sentence in the header comment.
3. **Define the API** (props): data (`items`, `value`/`defaultValue`/`onChange`), `tone`, `sound`, `className`, `style`, plus component-specific props. Keep every prop optional with good defaults; ship `DEFAULT_ITEMS` so `<LiquidX />` renders something sensible.
4. **Write `getTarget()`** — the single function that maps state → rect `{x,y,w,h,r}` in canvas coordinates (`PAD + rect − parentRect`). This is where 80% of the design lives.
5. **Copy the engine** from `references/water-engine.md` (shader + `initGL` + `useWater`). Only change uniforms if you need a new SDF; keep the compositing order.
6. **Write CSS** with tokens, glass panel, fallback elements, reduced-motion block, focus ring, mobile breakpoints.
7. **Wire interaction + ARIA** per §6.
8. **Write `demo.tsx`**: full-viewport centered stage on `#DCEBF5`, component, and a 12 px credit/caption line in `rgba(11,19,43,.5)`.
9. **Self-review** with §8.
10. **Reply format:** give the component file, the demo, and a short integration note (below).

### Integration note to include with every component

- Project must be shadcn-structured + Tailwind + TypeScript (`npx shadcn@latest init`). Default component path is `components/ui` — keep it, because shadcn's CLI, the `@/components/ui/...` alias in `components.json`, and every demo import depend on it.
- The component needs **no extra npm packages** and **no Tailwind classes** (styles are injected); Tailwind is only used in demos for layout if at all.
- Put the file at `components/ui/liquid-glass-<name>.tsx`, the demo at `app/<route>/page.tsx` or `demo.tsx`. Mark `"use client"` (Next.js App Router).
- Asset policy: no images required; icons are inline SVG. If an icon is missing, draw it as 24×24 stroke SVG (`strokeWidth 1.8`, round caps) or use `lucide-react` only in the demo.

---

## 8. Self-review checklist (do not skip)

- [ ] Starts with `"use client"`; header comment present; React-only imports.
- [ ] Root has `isolation:isolate`, `data-tone`, `data-gl`; layers z-indexed −2 / −1 / ≥1.
- [ ] Canvas is `aria-hidden`, `pointer-events:none`, offset `−PAD`, transparent outside the water.
- [ ] CSS fallback exists and is shown only when `data-gl="off"`.
- [ ] `initGL` null-checks shaders/program; `webglcontextlost` handled.
- [ ] rAF loop sleeps when off-screen/hidden/settled; all listeners/observers cleaned up.
- [ ] Reduced motion handled in both JS (snap, no ripples/droplets/ambient) and CSS.
- [ ] Light **and** dark tone verified (tokens, shader `uDark`, shadows).
- [ ] Controlled + uncontrolled both work; `onChange` fires once per real change.
- [ ] Keyboard, focus ring, ARIA state, live region (if async) all present.
- [ ] Works at 320 px width and with touch (no hover-only affordances).
- [ ] No `any` except where unavoidable (webkitAudioContext cast uses a typed `unknown` cast); no unused vars; strict-mode safe.
- [ ] Uniform arrays are fully populated every frame (`uBox`, `uSat`, `uRip`, `uBlob`); unused entries have `w = 0` / `z = 0`.
- [ ] Demo + integration note delivered.

---

## 9. Common mistakes to avoid

- Drawing the glass/backdrop in the shader (loses real blur, crisp text). Keep glass in CSS.
- Putting animation state in React state → re-render every frame. Use the ref state + imperative uniforms/styles.
- Forgetting `+ PAD` when converting DOM coords to canvas coords, so the drop appears offset.
- Resizing the canvas every frame while height animates (flicker). Quantize height to 96 px steps.
- Letting the rAF loop run forever; always return to idle.
- Forgetting the `flipped Y` convention in the shader: `p = vec2(gl_FragCoord.x, uRes.y*uDpr - gl_FragCoord.y)/uDpr`.
- Using non-constant loop bounds or too many uniform vectors (keep `uBox[2]`, `uSat[4]`, `uRip[6]`, `uBlob[6]`).
- Generic blue-gradient "glassmorphism" without lensing, specular, caustics or iridescence — that is not Nimbus.
- Adding third-party animation or UI libraries.

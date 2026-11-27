"use client"

/**
 * Nimbus UI · Liquid CommandMenu — "Depth Finder"
 * A spotlight command palette suspended in a liquid frosted glass chamber.
 * The active item glides with a buoyant fluid highlight, arrow navigation triggers
 * acoustic plips, WebGL water shaders stretch and pinch satellite droplets on transitions,
 * and ripples radiate outward on opening and selecting.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"
import { useLiquidContext } from "./liquid/provider"
import { playPlip } from "./liquid/engine"

export type CommandItem = {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  group?: string
  keywords?: string[]
  disabled?: boolean
  onSelect?: () => void
}

export type CommandGroup = {
  title: string
  items: CommandItem[]
}

export type LiquidCommandMenuProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  items?: CommandItem[]
  groups?: CommandGroup[]
  placeholder?: string
  emptyText?: string
  tone?: "light" | "dark"
  sound?: boolean
  triggerKey?: string // e.g. "k"
}

const CMD_CSS = `
.nimbus-cmd-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 100px 16px 32px 16px;
  background: rgba(0, 0, 0, 0.12);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  animation: cmdFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes cmdFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes cmdSlideIn {
  from { opacity: 0; transform: scale(0.96) translateY(-8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.nimbus-cmd-modal {
  --cm-tint: linear-gradient(135deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.08));
  --cm-fg: #0B132B;
  --cm-soft: rgba(11, 19, 43, 0.68);
  --cm-line: rgba(11, 19, 43, 0.08);
  --cm-rim: rgba(255, 255, 255, 0.6);
  --cm-rim-b: rgba(255, 255, 255, 0.15);
  --cm-border: rgba(255, 255, 255, 0.35);
  --cm-pool: linear-gradient(135deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.22));
  --cm-pool-border: rgba(255, 255, 255, 0.55);
  --cm-shadow: inset 0 1px 0 var(--cm-rim), inset 0 -1px 0 var(--cm-rim-b), 0 24px 60px -20px rgba(31, 38, 135, 0.22), 0 4px 16px rgba(31, 38, 135, 0.08);
  position: relative;
  width: 100%;
  max-width: 580px;
  max-height: 460px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 22px;
  background: var(--cm-tint);
  -webkit-backdrop-filter: blur(18px) saturate(180%) brightness(1.08);
  backdrop-filter: blur(18px) saturate(180%) brightness(1.08);
  border: 1px solid var(--cm-border);
  box-shadow: var(--cm-shadow);
  font-family: ui-sans-serif, -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
  color: var(--cm-fg);
  animation: cmdSlideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.nimbus-cmd-modal::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(100% 70% at 50% 0%, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 65%);
  z-index: 0;
}

.nimbus-cmd-modal[data-tone="dark"] {
  --cm-tint: linear-gradient(135deg, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.25));
  --cm-fg: #F1F7FF;
  --cm-soft: rgba(241, 247, 255, 0.68);
  --cm-line: rgba(241, 247, 255, 0.1);
  --cm-rim: rgba(255, 255, 255, 0.4);
  --cm-rim-b: rgba(0, 210, 255, 0.2);
  --cm-border: rgba(255, 255, 255, 0.22);
  --cm-pool: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.12));
  --cm-pool-border: rgba(89, 219, 255, 0.5);
  --cm-shadow: inset 0 1px 0 var(--cm-rim), inset 0 -1px 0 var(--cm-rim-b), 0 24px 60px -20px rgba(0, 0, 0, 0.8), 0 0 22px rgba(0, 210, 255, 0.18);
}

.nimbus-cmd-modal[data-tone="dark"]::before {
  background: radial-gradient(100% 70% at 50% 0%, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0) 65%);
}

.cmd-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--cm-line);
}

.cmd-search-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 15px;
  color: var(--cm-fg);
  outline: none;
  font-family: inherit;
}

.cmd-search-input::placeholder {
  color: var(--cm-soft);
}

.cmd-body {
  position: relative;
  z-index: 1;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.cmd-body::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

.cmd-water {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.nimbus-cmd-modal[data-gl="off"] .cmd-water {
  display: none;
}

.cmd-drop {
  display: none;
  position: absolute;
  left: 10px;
  right: 10px;
  border-radius: 12px;
  z-index: 0;
  pointer-events: none;
  background: var(--cm-pool);
  border: 1px solid var(--cm-pool-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 -1px 0 rgba(255, 255, 255, 0.2), 0 4px 14px rgba(0, 162, 255, 0.15);
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), height 0.18s ease;
}

.nimbus-cmd-modal[data-gl="off"] .cmd-drop {
  display: block;
}

.cmd-group-title {
  position: relative;
  z-index: 1;
  padding: 8px 12px 4px 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--cm-soft);
}

.cmd-item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--cm-fg);
  font-size: 13.5px;
  font-weight: 550;
  cursor: pointer;
  outline: none;
  transition: color 0.15s ease, transform 0.12s ease;
  user-select: none;
}

.nimbus-cmd-modal[data-gl="off"] .cmd-item:hover:not([disabled]),
.nimbus-cmd-modal[data-gl="off"] .cmd-item[data-active="true"] {
  background: var(--cm-pool);
  border-color: var(--cm-pool-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 -1px 0 rgba(255, 255, 255, 0.2), 0 4px 14px rgba(0, 162, 255, 0.15);
}

.cmd-item[data-active="true"] {
  color: var(--cm-fg);
  transform: translateX(2px);
}

.cmd-item[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}

.cmd-shortcut {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: var(--cm-soft);
}

.cmd-footer {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  border-top: 1px solid var(--cm-line);
  font-size: 11.5px;
  color: var(--cm-soft);
}

.cmd-badge {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.cmd-key {
  padding: 2px 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .nimbus-cmd-modal { animation: none !important; }
  .nimbus-cmd-backdrop { animation: none !important; }
  .cmd-item { transition: none !important; }
}
`

/* ---------- the water shader ---------- */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uPill;
uniform vec4 uBlob[6];uniform float uSy[6];uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float sdCap(vec2 p,vec4 B,float sy){vec2 pos=p-B.xy;pos.x/=sy;return sdRB(pos,vec2(B.z,B.w),10.);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float dropD(vec2 p){float d=1e4;for(int i=0;i<6;i++){if(uBlob[i].w>.5){d=smin(d,sdCap(p,uBlob[i],uSy[i]),13.);}}return d;}
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,14.);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*260.;w+=R.w*exp(-R.z*1.8)*sin(x*.28)*exp(-x*x/1000.);}}
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1000.);
 w+=uAmb*(sin(p.x*.05+uTime*1.2)*.45+sin(p.x*.13-uTime*.85+p.y*.2)*.25);return w;}
float H(vec2 p){float dp=pillD(p);return lens(dp,14.)*2.4+lens(dropD(p),11.)*7.5+waves(p)*smoothstep(0.,7.,-dp);}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 float dp=pillD(p);float dd=dropD(p);
 float h0=H(p);vec3 n=normalize(vec3(h0-H(p+vec2(1.,0.)),h0-H(p+vec2(0.,1.)),1.));
 vec3 V=vec3(0.,0.,1.);
 float spec=pow(max(dot(reflect(-normalize(vec3(-.45,-.8,.85)),n),V),0.),70.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.6,.75,.7)),n),V),0.),22.)*.3;
 float fres=clamp((1.-n.z)*4.,0.,1.);
 vec3 irid=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+fres*.85+p.x*.0028+uTime*.035));
 float pm=smoothstep(1.,-1.,dp);float dm=smoothstep(1.,-1.,dd)*smoothstep(1.,-2.,dp);
 float sh=smoothstep(9.,-9.,dropD(p-vec2(0.,5.)))*(1.-dm)*pm*(.11+.07*uDark);
 vec3 c=vec3(0.,.14,.36)*sh;float a=sh;
 float pa=clamp(pm*(fres*.5+spec*.9+spec2),0.,1.);
 c=mix(vec3(1.),irid,.5*fres)*pa+c*(1.-pa);a=pa+a*(1.-pa);
 float th=lens(dd,11.);
 float cs=caus((p+n.xy*th*18.)*.085,uTime*.9);
 vec3 tint=mix(vec3(.80,.95,1.),vec3(.55,.82,1.),uDark);
 float rim=dm*(1.-smoothstep(0.,8.,-dd));
 float cres=dm*smoothstep(.12,.55,dot(n.xy,normalize(vec2(.55,.85))))*smoothstep(0.,3.,-dd);
 float body=.5+.5*clamp(-n.y*3.,-1.,1.);
 float da=dm*(.26+.14*body)*(1.-.35*uDark);vec3 dc=mix(tint,vec3(1.),body*.6);
 float la=rim*.22;vec3 lc=mix(vec3(0.,.42,.78),vec3(.1,.55,.95),uDark);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.7+smoothstep(.6,1.,cs)*.28*th*dm,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.2+spec2*.5),0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,dd)*.4;dc=mix(vec3(1.),irid,.35)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 gl_FragColor=vec4(c,a);
}`

type Body = { y: number; v: number }
type Sat = { x: number; y: number; vx: number; vy: number; r: number; k: number }
type Rip = { x: number; y: number; age: number; amp: number }

function makeState() {
  return {
    a: { y: 0, v: 0 } as Body,
    b: { y: 0, v: 0 } as Body,
    sx: { s: 1, v: 0 },
    lead: 0 as 0 | 1,
    lagFrom: 0,
    sats: [] as Sat[],
    rips: [] as Rip[],
    t: { cx: 0, y: 0, qw: 0, qh: 16, r: 12 },
    mouse: { x: 0, y: 0, s: 0, on: false },
    moving: false,
    ready: false,
    w: 0,
    h: 0,
    visible: true,
    reduce: false,
    raf: 0,
    last: 0,
    time: 0,
    glc: null as null | { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> },
  }
}

function initGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) as WebGLRenderingContext | null
  if (!gl) return null
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = sh(gl.VERTEX_SHADER, VERT)
  const fs = sh(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const p = gl.createProgram()!
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null
  gl.useProgram(p)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(p, "a")
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const u: Record<string, WebGLUniformLocation | null> = {}
  for (const n of ["uRes", "uDpr", "uTime", "uPill", "uBlob", "uSy", "uRip", "uMouse", "uDark", "uAmb"]) u[n] = gl.getUniformLocation(p, n)
  return { gl, u }
}

export function LiquidCommandMenu({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  items,
  groups,
  placeholder = "Type a command or search...",
  emptyText = "No results found.",
  tone: propTone,
  sound: propSound,
  triggerKey = "k",
}: LiquidCommandMenuProps) {
  const ctx = useLiquidContext()
  const tone = propTone ?? (ctx ? (ctx.tone === "midnight" || ctx.tone === "dark" ? "dark" : "light") : "light")
  const sound = propSound ?? ctx?.sound ?? true

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen

  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [gl, setGl] = React.useState<"on" | "off">("on")

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const bodyRef = React.useRef<HTMLDivElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const dropRef = React.useRef<HTMLDivElement | null>(null)
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const st = React.useRef(makeState())
  const dark = tone === "dark" ? 1 : 0
  const darkRef = React.useRef(dark)
  darkRef.current = dark

  const setOpen = React.useCallback(
    (open: boolean) => {
      if (sound) playPlip(open ? 480 : 360, open ? 680 : 420)
      if (controlledOpen === undefined) setUncontrolledOpen(open)
      onOpenChange?.(open)
      if (open) setQuery("")
    },
    [controlledOpen, onOpenChange, sound]
  )

  // Global hotkey
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === triggerKey.toLowerCase()) {
        e.preventDefault()
        setOpen(!isOpen)
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, setOpen, triggerKey])

  // Focus on open
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Combine items & groups
  const allItems = React.useMemo(() => {
    const directItems = items ?? []
    const groupItems = (groups ?? []).flatMap((g) =>
      g.items.map((item) => ({ ...item, group: item.group ?? g.title }))
    )
    return [...directItems, ...groupItems]
  }, [items, groups])

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return allItems
    const q = query.toLowerCase()
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q))) ||
        (item.group && item.group.toLowerCase().includes(q))
    )
  }, [allItems, query])

  React.useEffect(() => {
    setActiveIndex(0)
    itemRefs.current = []
  }, [query])

  /* ---- Render drawing frame ---- */
  const draw = React.useCallback(() => {
    const s = st.current
    const T = s.t
    const sep = Math.abs(s.a.y - s.b.y)
    const thin = Math.min(sep / (2 * (s.t.qh + T.r) || 1), 1)

    if (s.glc) {
      const { gl: g, u } = s.glc
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight)
      g.uniform2f(u.uRes, s.w, s.h)
      g.uniform1f(u.uDpr, dpr)
      g.uniform1f(u.uTime, s.time)
      g.uniform4f(u.uPill, 4, 4, Math.max(10, s.w - 8), Math.max(10, s.h - 8))

      const blobs = new Float32Array(24)
      const sy = new Float32Array(6).fill(1)
      const head = s.lead === 0 ? s.a : s.b
      const tail = s.lead === 0 ? s.b : s.a

      blobs.set(
        [
          T.cx,
          head.y,
          T.qw * (1 - 0.15 * thin),
          T.qh * (1 - 0.25 * thin),
          T.cx,
          tail.y,
          T.qw * (1 - 0.35 * thin),
          T.qh * (1 - 0.45 * thin),
        ],
        0
      )
      sy[0] = sy[1] = s.sx.s
      s.sats.slice(0, 4).forEach((d, i) => blobs.set([d.x, d.y, d.r, d.r], 8 + i * 4))

      g.uniform4fv(u.uBlob, blobs)
      g.uniform1fv(u.uSy, sy)

      const rips = new Float32Array(24)
      s.rips.slice(-6).forEach((p, i) => rips.set([p.x, p.y, p.age, p.amp], i * 4))
      g.uniform4fv(u.uRip, rips)
      g.uniform3f(u.uMouse, s.mouse.x, s.mouse.y, s.mouse.s)
      g.uniform1f(u.uDark, darkRef.current)
      g.uniform1f(u.uAmb, s.reduce ? 0 : 1)
      g.clearColor(0, 0, 0, 0)
      g.clear(g.COLOR_BUFFER_BIT)
      g.drawArrays(g.TRIANGLES, 0, 3)
    } else if (dropRef.current) {
      const top = Math.min(s.a.y, s.b.y) - T.qh
      const height = sep + 2 * T.qh
      dropRef.current.style.height = `${height}px`
      dropRef.current.style.transform = `translateY(${top}px)`
    }
  }, [])

  /* ---- Physics Step ---- */
  const step = React.useCallback(
    (dt: number, now: number) => {
      const s = st.current
      const T = s.t
      s.time += dt

      const bodies = [s.a, s.b]
      let still = true

      if (s.reduce) {
        s.a.y = s.b.y = T.y
        s.a.v = s.b.v = 0
        s.sx.s = 1
        s.sats = []
      } else {
        bodies.forEach((B, i) => {
          const lead = i === s.lead
          const k = lead ? 230 : 80
          const c = lead ? 26 : 14
          const f = !lead && now < s.lagFrom ? 0.08 : 1
          B.v += (k * (T.y - B.y) - c * B.v) * dt * f
          B.y += B.v * dt

          const lo = 10 + T.qh
          const hi = Math.max(lo, s.h - 10 - T.qh)
          if (B.y < lo || B.y > hi) {
            s.sx.v -= Math.min(Math.abs(B.v), 900) * 0.0016
            B.y = Math.max(lo, Math.min(hi, B.y))
            B.v *= -0.25
          }
          if (Math.abs(T.y - B.y) > 0.3 || Math.abs(B.v) > 3) still = false
        })

        const L = bodies[s.lead]
        if (Math.abs(L.v) > 320 && Math.random() < 0.28 && s.sats.length < 4) {
          s.sats.push({
            x: T.cx + (Math.random() - 0.5) * T.qw * 0.6,
            y: L.y - Math.sign(L.v) * (T.qh + 4),
            vx: (Math.random() - 0.5) * 45,
            vy: -L.v * 0.22 + (Math.random() - 0.5) * 40,
            r: 3 + Math.random() * 2.5,
            k: 1,
          })
        }

        s.sats.forEach((d) => {
          d.x += d.vx * dt
          d.y += d.vy * dt
          d.vy += 80 * dt
          d.k -= dt * 2.2
          d.r *= Math.max(0, 1 - dt * 1.5)
        })
        s.sats = s.sats.filter((d) => d.k > 0 && d.r > 0.5)
        if (s.sats.length) still = false

        // Squish
        s.sx.v += (1 - s.sx.s) * 180 * dt - s.sx.v * 16 * dt
        s.sx.s += s.sx.v * dt
        if (Math.abs(1 - s.sx.s) > 0.01) still = false

        // Mouse waves decay
        if (!s.mouse.on && s.mouse.s > 0.001) {
          s.mouse.s *= Math.exp(-dt * 4)
          still = false
        }
      }

      // Ripples
      s.rips.forEach((p) => {
        p.age += dt * 1.4
        p.amp *= Math.exp(-dt * 2.5)
      })
      s.rips = s.rips.filter((p) => p.amp > 0.02 && p.age < 1.8)
      if (s.rips.length) still = false

      draw()

      if (!still || s.moving) {
        s.raf = requestAnimationFrame((n) => {
          const dtt = Math.min((n - (s.last || n)) / 1000, 0.033)
          s.last = n
          step(dtt || 0.016, n)
        })
      } else {
        s.raf = 0
        s.last = 0
      }
    },
    [draw]
  )

  const kick = React.useCallback(() => {
    const s = st.current
    if (!s.raf) {
      s.last = performance.now()
      s.raf = requestAnimationFrame((n) => {
        const dt = Math.min((n - s.last) / 1000, 0.033)
        s.last = n
        step(dt || 0.016, n)
      })
    }
  }, [step])

  // Update target coordinates from active item
  const updateTarget = React.useCallback(
    (index: number, immediate = false) => {
      const el = itemRefs.current[index]
      const container = bodyRef.current
      if (!el || !container) return
      const cRect = container.getBoundingClientRect()
      const iRect = el.getBoundingClientRect()

      const top = iRect.top - cRect.top + container.scrollTop
      const left = iRect.left - cRect.left
      const w = iRect.width
      const h = iRect.height

      const s = st.current
      const prevY = s.t.y
      const targetY = top + h / 2

      s.t = {
        cx: left + w / 2,
        y: targetY,
        qw: w / 2 - 2,
        qh: h / 2 - 2,
        r: 12,
      }

      if (immediate || !s.ready) {
        s.a.y = s.b.y = targetY
        s.a.v = s.b.v = 0
        s.ready = true
        draw()
      } else {
        const goingDown = targetY > prevY
        s.lead = goingDown ? 0 : 1
        s.lagFrom = performance.now() + 45
        kick()
      }
    },
    [draw, kick]
  )

  // Initialize WebGL & Size Observer
  React.useEffect(() => {
    if (!isOpen) return
    const container = bodyRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const glc = initGL(canvas)
    if (glc) {
      st.current.glc = glc
      setGl("on")
    } else {
      setGl("off")
    }

    const resize = () => {
      const w = container.clientWidth
      const h = Math.max(container.clientHeight, container.scrollHeight)
      st.current.w = w
      st.current.h = h
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      draw()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    // Initial ripple burst on open
    st.current.rips.push({
      x: container.clientWidth / 2,
      y: 60,
      age: 0,
      amp: 1.4,
    })
    kick()

    return () => {
      ro.disconnect()
      if (st.current.raf) cancelAnimationFrame(st.current.raf)
    }
  }, [isOpen, draw, kick])

  // Sync active index position
  React.useEffect(() => {
    if (!isOpen) return
    updateTarget(activeIndex)
  }, [isOpen, activeIndex, updateTarget])

  const triggerSelectionRipple = (idx: number) => {
    const el = itemRefs.current[idx]
    const container = bodyRef.current
    if (el && container) {
      const cRect = container.getBoundingClientRect()
      const iRect = el.getBoundingClientRect()
      const x = iRect.left - cRect.left + iRect.width / 2
      const y = iRect.top - cRect.top + container.scrollTop + iRect.height / 2
      st.current.rips.push({ x, y, age: 0, amp: 1.8 })
      kick()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (sound) playPlip(500, 600)
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (sound) playPlip(600, 500)
      setActiveIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = filteredItems[activeIndex]
      if (item && !item.disabled) {
        if (sound) playPlip(550, 850)
        triggerSelectionRipple(activeIndex)
        item.onSelect?.()
        setOpen(false)
      }
    }
  }

  if (!isOpen) return null

  // Group filtered items for rendering
  const groupedRender = filteredItems.reduce<Record<string, CommandItem[]>>((acc, item) => {
    const g = item.group ?? "Commands"
    if (!acc[g]) acc[g] = []
    acc[g].push(item)
    return acc
  }, {})

  let itemCounter = 0

  return (
    <div className="nimbus-cmd-backdrop" onClick={() => setOpen(false)}>
      <style dangerouslySetInnerHTML={{ __html: CMD_CSS }} />
      <div
        className="nimbus-cmd-modal"
        data-tone={tone}
        data-gl={gl}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="cmd-header">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.6 }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="cmd-search-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="cmd-key">ESC</span>
        </div>

        <div
          ref={bodyRef}
          className="cmd-body"
          onScroll={() => updateTarget(activeIndex, true)}
        >
          <canvas ref={canvasRef} className="cmd-water" aria-hidden="true" />
          <div ref={dropRef} className="cmd-drop" aria-hidden="true" />

          {filteredItems.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "var(--cm-soft)",
                fontSize: 13,
                position: "relative",
                zIndex: 1,
              }}
            >
              {emptyText}
            </div>
          ) : (
            Object.entries(groupedRender).map(([groupName, gItems]) => (
              <div key={groupName} style={{ display: "flex", flexDirection: "column", gap: 2, position: "relative", zIndex: 1 }}>
                <div className="cmd-group-title">{groupName}</div>
                {gItems.map((item) => {
                  const currentIdx = itemCounter++
                  const isActive = currentIdx === activeIndex
                  return (
                    <button
                      key={item.id}
                      ref={(el) => {
                        itemRefs.current[currentIdx] = el
                      }}
                      type="button"
                      className="cmd-item"
                      data-active={isActive}
                      disabled={item.disabled}
                      onClick={() => {
                        if (sound) playPlip(550, 850)
                        triggerSelectionRipple(currentIdx)
                        item.onSelect?.()
                        setOpen(false)
                      }}
                      onPointerEnter={() => setActiveIndex(currentIdx)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {item.icon && <span style={{ display: "inline-flex" }}>{item.icon}</span>}
                        <span>{item.label}</span>
                      </div>
                      {item.shortcut && <span className="cmd-shortcut">{item.shortcut}</span>}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="cmd-footer">
          <div className="cmd-badge">
            <span className="cmd-key">↑</span>
            <span className="cmd-key">↓</span>
            <span>Navigate</span>
          </div>
          <div className="cmd-badge">
            <span className="cmd-key">↵</span>
            <span>Select</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { LiquidCommandMenu as CommandMenu }
export { LiquidCommandMenu as Component }
export default LiquidCommandMenu

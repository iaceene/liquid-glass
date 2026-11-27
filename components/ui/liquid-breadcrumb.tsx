"use client"

/**
 * Nimbus UI · Liquid Breadcrumb — "Stepping Stones"
 * An organic chain of glass stepping stones linked by water drop chevrons.
 * Clicking or hovering a step moves a liquid water droplet with meniscus tension,
 * spring inertia, and micro-ripples across the glass path.
 * Raw WebGL shader with CSS fallback and sound synthesis. No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"
import { useLiquidContext } from "./liquid/provider"
import { playPlip } from "./liquid/engine"

export type LiquidBreadcrumbItem = {
  id?: string
  label: React.ReactNode
  href?: string
  icon?: React.ReactNode
  current?: boolean
  onClick?: () => void
}

export type LiquidBreadcrumbProps = React.HTMLAttributes<HTMLElement> & {
  items: LiquidBreadcrumbItem[]
  separator?: React.ReactNode
  tone?: "light" | "dark"
  sound?: boolean
  className?: string
  style?: React.CSSProperties
}

const PAD = 14

const BC_CSS = `
.nimbus-breadcrumb {
  --bc-tint: rgba(255, 255, 255, 0.18);
  --bc-fg: #0B132B;
  --bc-soft: rgba(11, 19, 43, 0.6);
  --bc-rim: rgba(255, 255, 255, 0.8);
  --bc-line: rgba(11, 19, 43, 0.1);
  --bc-accent: #00A2FF;
  position: relative;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  padding: 6px 14px;
  border-radius: 999px;
  isolation: isolate;
  font-family: ui-sans-serif, -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
  font-size: 13px;
  font-weight: 550;
  letter-spacing: -0.01em;
  color: var(--bc-fg);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.nimbus-breadcrumb[data-tone="dark"] {
  --bc-tint: rgba(10, 18, 40, 0.32);
  --bc-fg: #F1F7FF;
  --bc-soft: rgba(241, 247, 255, 0.6);
  --bc-rim: rgba(255, 255, 255, 0.25);
  --bc-line: rgba(241, 247, 255, 0.1);
  --bc-accent: #59DBFF;
}

.bc-glass {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -2;
  overflow: hidden;
  background: var(--bc-tint);
  -webkit-backdrop-filter: blur(12px) saturate(1.2) brightness(1.06);
  backdrop-filter: blur(12px) saturate(1.2) brightness(1.06);
  box-shadow: inset 0 1px 1px var(--bc-rim), inset 0 0 0 1px rgba(255, 255, 255, 0.2), 0 4px 16px rgba(0, 40, 90, 0.08);
}

.nimbus-breadcrumb[data-tone="dark"] .bc-glass {
  box-shadow: inset 0 1px 1px var(--bc-rim), inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 6px 20px rgba(0, 0, 0, 0.5);
}

.bc-water {
  position: absolute;
  left: ${-PAD}px;
  top: ${-PAD}px;
  z-index: -1;
  pointer-events: none;
}

.nimbus-breadcrumb[data-gl="off"] .bc-water {
  display: none;
}

.bc-drop {
  display: none;
  position: absolute;
  top: 4px;
  bottom: 4px;
  border-radius: 999px;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(120% 140% at 30% 0%, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0) 55%), rgba(255, 255, 255, 0.38);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -2px 6px rgba(0, 162, 255, 0.22), inset 0 0 0 1px rgba(255, 255, 255, 0.55), 0 6px 16px -6px rgba(0, 70, 140, 0.45);
}

.nimbus-breadcrumb[data-gl="off"] .bc-drop {
  display: block;
}

.bc-list {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  z-index: 1;
}

.bc-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.bc-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 0;
  padding: 3px 8px;
  border-radius: 999px;
  color: var(--bc-soft);
  text-decoration: none;
  cursor: pointer;
  outline: none;
  transition: all 0.15s ease;
}

.bc-link:hover {
  color: var(--bc-accent);
}

.bc-link:active {
  transform: scale(0.97);
}

.bc-link[data-current="true"] {
  color: var(--bc-fg);
  font-weight: 650;
}

.bc-sep {
  display: inline-flex;
  align-items: center;
  color: var(--bc-soft);
  opacity: 0.5;
  user-select: none;
}
`

/* ---------- the water shader ---------- */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uPill;
uniform vec4 uBlob[6];uniform float uSy[6];uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float sdCap(vec2 p,vec4 B,float sy){p-=B.xy;p.y/=sy;p.x=max(abs(p.x)-B.z,0.);return(length(p)-B.w)*min(1.,sy);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float dropD(vec2 p){float d=1e4;for(int i=0;i<6;i++){if(uBlob[i].w>.5){d=smin(d,sdCap(p,uBlob[i],uSy[i]),13.);}}return d;}
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,h.y);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*240.;w+=R.w*exp(-R.z*1.7)*sin(x*.3)*exp(-x*x/700.);}}
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1000.);
 w+=uAmb*(sin(p.x*.05+uTime*1.2)*.45+sin(p.x*.13-uTime*.85+p.y*.2)*.25);return w;}
float H(vec2 p){float dp=pillD(p);return lens(dp,uPill.w*.36)*2.4+lens(dropD(p),11.)*7.5+waves(p)*smoothstep(0.,7.,-dp);}
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

type Ripple = { x: number; y: number; age: number; amp: number }
type Sat = { x: number; y: number; vx: number; vy: number; r: number; k: number }

type State = {
  a: { x: number; v: number }
  b: { x: number; v: number }
  lead: number
  lagFrom: number
  t: { x: number; w: number; r: number; cy: number; q: number }
  sy: { s: number; v: number }
  rips: Ripple[]
  sats: Sat[]
  split: boolean
  moving: boolean
  ready: boolean
  w: number
  h: number
  q: number
  mouse: { x: number; y: number; s: number; on: boolean }
  time: number
  last: number
  raf: number
  glc: { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> } | null
  visible: boolean
  reduce: boolean
}

function makeState(): State {
  return {
    a: { x: 0, v: 0 },
    b: { x: 0, v: 0 },
    lead: 0,
    lagFrom: 0,
    t: { x: 0, w: 0, r: 14, cy: 0, q: 0 },
    sy: { s: 1, v: 0 },
    rips: [],
    sats: [],
    split: false,
    moving: false,
    ready: false,
    w: 0,
    h: 0,
    q: 0,
    mouse: { x: -1e3, y: -1e3, s: 0, on: false },
    time: 0,
    last: 0,
    raf: 0,
    glc: null,
    visible: true,
    reduce: false,
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

export const LiquidBreadcrumb = React.forwardRef<HTMLElement, LiquidBreadcrumbProps>(
  function LiquidBreadcrumb({ items, separator, tone: propTone, sound: propSound, className, style, ...props }, ref) {
    const ctx = useLiquidContext()
    const tone = propTone ?? (ctx ? (ctx.tone === "midnight" || ctx.tone === "dark" ? "dark" : "light") : "light")
    const sound = propSound ?? ctx?.sound ?? true

    const [activeIndex, setActiveIndex] = React.useState(() => {
      const idx = items.findIndex((i) => i.current)
      return idx >= 0 ? idx : Math.max(0, items.length - 1)
    })

    const navRef = React.useRef<HTMLElement | null>(null)
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const dropRef = React.useRef<HTMLSpanElement | null>(null)
    const itemRefs = React.useRef<(HTMLElement | null)[]>([])
    const st = React.useRef(makeState())
    const [gl, setGl] = React.useState<"on" | "off">("on")

    const dark = tone === "dark" ? 1 : 0
    const darkRef = React.useRef(dark)
    darkRef.current = dark

    const defaultSeparator = (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m9 18 6-6-6-6" />
      </svg>
    )

    const sepElement = separator ?? defaultSeparator

    const draw = React.useCallback(() => {
      const s = st.current
      const T = s.t
      const sep = Math.abs(s.a.x - s.b.x)
      const thin = Math.min(sep / (2 * (s.q + T.r) || 1), 1)
      const r = T.r * (1 - 0.3 * thin)
      if (s.glc) {
        const { gl: g, u } = s.glc
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight)
        g.uniform2f(u.uRes, s.w + PAD * 2, s.h + PAD * 2)
        g.uniform1f(u.uDpr, dpr)
        g.uniform1f(u.uTime, s.time)
        g.uniform4f(u.uPill, PAD, PAD, s.w, s.h)
        const blobs = new Float32Array(24)
        const sy = new Float32Array(6).fill(1)
        const head = s.lead === 0 ? s.a : s.b, tail = s.lead === 0 ? s.b : s.a
        blobs.set([head.x, T.cy, s.q * (1 - 0.25 * thin), r * (1 - 0.12 * thin), tail.x, T.cy, s.q * (1 - 0.8 * thin), r * (1 - 0.5 * thin)], 0)
        sy[0] = sy[1] = s.sy.s
        s.sats.slice(0, 4).forEach((d, i) => blobs.set([d.x, d.y, 0, d.r], 8 + i * 4))
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
        const left = Math.min(s.a.x, s.b.x) - s.q - r - PAD
        const width = sep + 2 * (s.q + r)
        dropRef.current.style.transform = `translate3d(${left}px,0,0)`
        dropRef.current.style.width = `${width}px`
      }
    }, [])

    const step = React.useCallback((dt: number, now: number) => {
      const s = st.current
      const T = s.t
      s.time += dt
      const bodies = [s.a, s.b]
      let still = true
      if (s.reduce) {
        s.a.x = s.b.x = T.x; s.a.v = s.b.v = 0; s.sy.s = 1; s.sats = []
      } else {
        bodies.forEach((B, i) => {
          const lead = i === s.lead
          const k = lead ? 220 : 75
          const c = lead ? 26 : 14
          const f = !lead && now < s.lagFrom ? 0.08 : 1
          B.v += (k * (T.x - B.x) - c * B.v) * dt * f
          B.x += B.v * dt
          const lo = PAD + 8 + s.q + T.r - 2, hi = PAD + s.w - 8 - s.q - T.r + 2
          if (B.x < lo || B.x > hi) {
            s.sy.v -= Math.min(Math.abs(B.v), 900) * 0.0016
            B.x = Math.max(lo, Math.min(hi, B.x))
            B.v *= -0.25
          }
          if (Math.abs(T.x - B.x) > 0.3 || Math.abs(B.v) > 3) still = false
        })
        const L = bodies[s.lead]
        const syT = 1 - 0.2 * Math.min(Math.abs(L.v) / 1400, 1)
        s.sy.v += (280 * (syT - s.sy.s) - 9 * s.sy.v) * dt
        s.sy.s += s.sy.v * dt
        if (Math.abs(s.sy.s - 1) > 0.002 || Math.abs(s.sy.v) > 0.02) still = false

        const sep = Math.abs(s.a.x - s.b.x)
        const r = T.r * (1 - 0.3 * Math.min(sep / (2 * (s.q + T.r) || 1), 1))
        if (!s.split && s.moving && sep - 2 * s.q - 2 * r > -4) {
          s.split = true
          const lo = bodies[1 - s.lead], hi = bodies[s.lead]
          ;[0.32, 0.52, 0.72].forEach((t, j) => {
            s.sats.push({
              x: lo.x + (hi.x - lo.x) * t + (Math.random() - 0.5) * 6,
              y: T.cy + (Math.random() - 0.5) * 6,
              vx: (lo.v + hi.v) * 0.45,
              vy: (Math.random() - 0.5) * 50,
              r: 4.5 + Math.random() * 2.5 - j * 0.4,
              k: 75 + Math.random() * 85,
            })
          })
        }
        s.sats = s.sats.filter((d) => {
          d.vx += (d.k * (T.x - d.x) - 9 * d.vx) * dt
          d.vy += (80 * (T.cy - d.y) - 7 * d.vy) * dt
          d.x += d.vx * dt
          d.y += d.vy * dt
          d.x = Math.max(PAD + 10 + d.r, Math.min(PAD + s.w - 10 - d.r, d.x))
          d.y = Math.max(PAD + 10 + d.r, Math.min(PAD + s.h - 10 - d.r, d.y))
          if (Math.abs(T.x - d.x) < s.q + T.r * 0.5) d.r -= dt * 26
          return d.r > 0.6
        })
        if (s.sats.length) still = false
      }
      if (s.moving && still) {
        s.moving = false
        if (s.split || !s.reduce) s.rips.push({ x: T.x, y: T.cy, age: 0, amp: s.split ? 1.2 : 0.7 })
      }
      s.rips.forEach((p) => (p.age += dt))
      s.rips = s.rips.filter((p) => p.age < 2.4)
      const target = s.mouse.on ? 1 : 0
      s.mouse.s += (target - s.mouse.s) * Math.min(1, dt * 7)
    }, [])

    const loop = React.useCallback(() => {
      const s = st.current
      if (s.raf) return
      s.last = performance.now()
      const tick = (now: number) => {
        const dt = Math.min((now - s.last) / 1000, 1 / 30)
        s.last = now
        step(dt, now)
        draw()
        const busy = s.moving || s.rips.length || s.sats.length || s.mouse.s > 0.01
        if (s.visible && (!s.reduce || busy)) s.raf = requestAnimationFrame(tick)
        else s.raf = 0
      }
      s.raf = requestAnimationFrame(tick)
    }, [draw, step])

    const measure = React.useCallback(() => {
      const nav = navRef.current
      const el = itemRefs.current[activeIndex]
      if (!nav || !el) return
      const s = st.current
      s.w = nav.offsetWidth
      s.h = nav.offsetHeight
      const navRect = nav.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const T = s.t
      T.r = elRect.height / 2
      s.q = Math.max(0, elRect.width / 2 - T.r)
      const nx = PAD + (elRect.left - navRect.left) + elRect.width / 2
      const ny = PAD + (elRect.top - navRect.top) + elRect.height / 2
      T.cy = ny
      if (!s.ready) {
        s.a.x = s.b.x = nx
        s.ready = true
      } else if (Math.abs(nx - T.x) > 0.5) {
        s.lead = Math.abs(nx - s.a.x) <= Math.abs(nx - s.b.x) ? 0 : 1
        s.lagFrom = performance.now() + 70
        s.moving = true
        s.split = false
      }
      T.x = nx
      const cv = canvasRef.current
      if (cv) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const W = s.w + PAD * 2, Hh = s.h + PAD * 2
        if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(Hh * dpr)) {
          cv.width = Math.round(W * dpr)
          cv.height = Math.round(Hh * dpr)
          cv.style.width = `${W}px`
          cv.style.height = `${Hh}px`
        }
      }
      loop()
    }, [activeIndex, loop])

    React.useEffect(() => {
      const s = st.current
      s.reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      const cv = canvasRef.current
      s.glc = cv ? initGL(cv) : null
      if (!s.glc) setGl("off")
      const lost = (e: Event) => { e.preventDefault(); s.glc = null; setGl("off") }
      cv?.addEventListener("webglcontextlost", lost)
      const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; if (s.visible) loop() })
      if (navRef.current) io.observe(navRef.current)
      const vis = () => { s.visible = document.visibilityState === "visible"; if (s.visible) loop() }
      document.addEventListener("visibilitychange", vis)
      return () => {
        cv?.removeEventListener("webglcontextlost", lost)
        io.disconnect()
        document.removeEventListener("visibilitychange", vis)
        cancelAnimationFrame(s.raf)
        s.raf = 0
      }
    }, [loop])

    React.useLayoutEffect(() => { measure() }, [measure, items.length])

    const handleClick = (item: LiquidBreadcrumbItem, idx: number) => {
      if (sound) playPlip(550, 750)
      setActiveIndex(idx)
      item.onClick?.()
    }

    return (
      <nav
        ref={(node) => {
          navRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node
        }}
        aria-label="Breadcrumb"
        className={["nimbus-breadcrumb", className].filter(Boolean).join(" ")}
        data-tone={tone}
        data-gl={gl}
        style={style}
        onPointerMove={(e) => {
          const r = navRef.current?.getBoundingClientRect()
          if (r) {
            st.current.mouse.x = e.clientX - r.left + PAD
            st.current.mouse.y = e.clientY - r.top + PAD
            st.current.mouse.on = true
            loop()
          }
        }}
        onPointerLeave={() => {
          st.current.mouse.on = false
          loop()
        }}
        {...props}
      >
        <style dangerouslySetInnerHTML={{ __html: BC_CSS }} />
        <div className="bc-glass" />
        <canvas ref={canvasRef} className="bc-water" aria-hidden="true" />
        <span ref={dropRef} className="bc-drop" aria-hidden="true" />

        <ol className="bc-list">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1
            const isCurrent = item.current ?? isLast
            return (
              <li key={item.id ?? idx} className="bc-item">
                {item.href ? (
                  <a
                    ref={(el) => { itemRefs.current[idx] = el }}
                    href={item.href}
                    className="bc-link"
                    data-current={isCurrent}
                    aria-current={isCurrent ? "page" : undefined}
                    onMouseEnter={() => { setActiveIndex(idx); loop() }}
                    onClick={() => handleClick(item, idx)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <button
                    ref={(el) => { itemRefs.current[idx] = el }}
                    type="button"
                    className="bc-link"
                    data-current={isCurrent}
                    aria-current={isCurrent ? "page" : undefined}
                    onMouseEnter={() => { setActiveIndex(idx); loop() }}
                    onClick={() => handleClick(item, idx)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                )}

                {!isLast && (
                  <span className="bc-sep" aria-hidden="true">
                    {sepElement}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
)

LiquidBreadcrumb.displayName = "LiquidBreadcrumb"

export { LiquidBreadcrumb as Breadcrumb }
export { LiquidBreadcrumb as Component }
export default LiquidBreadcrumb

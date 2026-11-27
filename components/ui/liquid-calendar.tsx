"use client"

/**
 * Nimbus UI · Liquid Calendar — "Tide Clock"
 * A date picker calendar sculpted in frosted glass. Selecting a date glides an active
 * WebGL water drop across the grid with spring physics, stretching during transitions,
 * generating pointer ripples on tap, and playing acoustic plips.
 * Uses the canonical Nimbus WebGL water shader with pure-CSS fallback.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"
import { useLiquidContext } from "./liquid/provider"

export type LiquidCalendarProps = {
  selected?: Date | null
  defaultSelected?: Date | null
  onSelect?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  tone?: "light" | "dark"
  sound?: boolean
  className?: string
  style?: React.CSSProperties
}

const PAD = 14

const CAL_CSS = `
.nimbus-calendar {
  --cl-tint: rgba(255, 255, 255, 0.18);
  --cl-fg: #0B132B;
  --cl-soft: rgba(11, 19, 43, 0.6);
  --cl-line: rgba(11, 19, 43, 0.08);
  --cl-rim: rgba(255, 255, 255, 0.8);
  position: relative;
  display: inline-flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 290px;
  padding: 18px;
  border-radius: 24px;
  isolation: isolate;
  user-select: none;
  font-family: ui-sans-serif, -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
  color: var(--cl-fg);
}

.nimbus-calendar[data-tone="dark"] {
  --cl-tint: rgba(10, 18, 40, 0.32);
  --cl-fg: #F1F7FF;
  --cl-soft: rgba(241, 247, 255, 0.6);
  --cl-line: rgba(241, 247, 255, 0.1);
  --cl-rim: rgba(255, 255, 255, 0.28);
}

.cl-glass {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -2;
  overflow: hidden;
  background: var(--cl-tint);
  -webkit-backdrop-filter: blur(14px) saturate(1.2) brightness(1.06);
  backdrop-filter: blur(14px) saturate(1.2) brightness(1.06);
  box-shadow: inset 0 1px 1px var(--cl-rim), inset 0 0 0 1px rgba(255, 255, 255, 0.18), 0 18px 44px -20px rgba(0, 40, 90, 0.35), 0 2px 6px rgba(0, 40, 90, 0.08);
  pointer-events: none;
}

.nimbus-calendar[data-tone="dark"] .cl-glass {
  box-shadow: inset 0 1px 1px var(--cl-rim), inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 18px 44px -20px rgba(0, 0, 0, 0.7);
}

.cl-water {
  position: absolute;
  left: ${-PAD}px;
  top: ${-PAD}px;
  z-index: -1;
  pointer-events: none;
}

.nimbus-calendar[data-gl="off"] .cl-water {
  display: none;
}

.cl-drop {
  display: none;
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(120% 140% at 30% 0%, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0) 55%), rgba(255, 255, 255, 0.38);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -2px 6px rgba(0, 162, 255, 0.22), inset 0 0 0 1px rgba(255, 255, 255, 0.55), 0 6px 16px -6px rgba(0, 70, 140, 0.45);
}

.nimbus-calendar[data-gl="off"] .cl-drop {
  display: block;
}

.cl-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.cl-title {
  font-size: 14.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.cl-nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: var(--cl-fg);
  cursor: pointer;
  outline: none;
  transition: all 0.15s ease;
}

.cl-nav-btn:hover {
  background: rgba(0, 162, 255, 0.15);
  color: #00A2FF;
  transform: scale(1.08);
}

.cl-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
}

.cl-weekday {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--cl-soft);
  padding: 4px 0 8px 0;
  letter-spacing: 0.05em;
}

.cl-day {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  margin: 0 auto;
  border-radius: 50%;
  border: 1px solid transparent;
  background: transparent;
  color: var(--cl-fg);
  font-size: 12.5px;
  font-weight: 550;
  cursor: pointer;
  outline: none;
  transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cl-day:hover:not([disabled]) {
  color: #00A2FF;
  transform: scale(1.1);
}

.cl-day:active:not([disabled]) {
  transform: scale(0.92);
}

.cl-day[data-selected="true"] {
  color: #0085FA;
  font-weight: 700;
}

.nimbus-calendar[data-tone="dark"] .cl-day[data-selected="true"] {
  color: #59DBFF;
}

.cl-day[data-today="true"]:not([data-selected="true"]) {
  border-color: rgba(0, 162, 255, 0.4);
}

.cl-day[data-outside="true"] {
  opacity: 0.28;
}

.cl-day[disabled] {
  opacity: 0.2;
  cursor: not-allowed;
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
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,22.);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*240.;w+=R.w*exp(-R.z*1.7)*sin(x*.3)*exp(-x*x/700.);}}
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1000.);
 w+=uAmb*(sin(p.x*.05+uTime*1.2)*.45+sin(p.x*.13-uTime*.85+p.y*.2)*.25);return w;}
float H(vec2 p){float dp=pillD(p);return lens(dp,16.)*2.4+lens(dropD(p),11.)*7.5+waves(p)*smoothstep(0.,7.,-dp);}
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

type Body = { x: number; y: number; vx: number; vy: number }
type Rip = { x: number; y: number; age: number; amp: number }

function makeState() {
  return {
    a: { x: 0, y: 0, vx: 0, vy: 0 } as Body,
    b: { x: 0, y: 0, vx: 0, vy: 0 } as Body,
    lead: 0 as 0 | 1,
    lagFrom: 0,
    rips: [] as Rip[],
    t: { x: 0, y: 0, r: 16 },
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

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export const LiquidCalendar = React.forwardRef<HTMLDivElement, LiquidCalendarProps>(
  function LiquidCalendar(
    {
      selected: controlledSelected,
      defaultSelected = null,
      onSelect,
      minDate,
      maxDate,
      tone: propTone,
      sound: propSound,
      className,
      style,
      ...props
    },
    ref
  ) {
    const ctx = useLiquidContext()
    const tone = propTone ?? (ctx ? (ctx.tone === "midnight" || ctx.tone === "dark" ? "dark" : "light") : "light")
    const sound = propSound ?? ctx?.sound ?? true

    const [uncontrolledSelected, setUncontrolledSelected] = React.useState<Date | null>(defaultSelected)
    const selectedDate = controlledSelected !== undefined ? controlledSelected : uncontrolledSelected
    const [viewDate, setViewDate] = React.useState<Date>(selectedDate ?? new Date())

    const currentYear = viewDate.getFullYear()
    const currentMonth = viewDate.getMonth()

    const navRef = React.useRef<HTMLDivElement | null>(null)
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const dropRef = React.useRef<HTMLSpanElement | null>(null)
    const activeDayRef = React.useRef<HTMLButtonElement | null>(null)
    const st = React.useRef(makeState())
    const [gl, setGl] = React.useState<"on" | "off">("on")

    const dark = tone === "dark" ? 1 : 0
    const darkRef = React.useRef(dark)
    darkRef.current = dark

    const playPlipAudio = React.useCallback((f0 = 500, f1 = 750) => {
      if (!sound) return
      try {
        const AC = window.AudioContext || (window as any).webkitAudioContext
        const aCtx = new AC()
        const t = aCtx.currentTime
        const o = aCtx.createOscillator()
        const g = aCtx.createGain()
        o.type = "sine"
        o.frequency.setValueAtTime(f0, t)
        o.frequency.exponentialRampToValueAtTime(f1, t + 0.07)
        g.gain.setValueAtTime(0.0001, t)
        g.gain.exponentialRampToValueAtTime(0.14, t + 0.008)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
        o.connect(g).connect(aCtx.destination)
        o.start(t)
        o.stop(t + 0.16)
      } catch {}
    }, [sound])

    const draw = React.useCallback(() => {
      const s = st.current
      const T = s.t
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
        blobs.set([head.x, head.y, 0, T.r, tail.x, tail.y, 0, T.r * 0.8], 0)
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
        dropRef.current.style.transform = `translate(${s.a.x - T.r - PAD}px, ${s.a.y - T.r - PAD}px)`
      }
    }, [])

    const step = React.useCallback((dt: number, now: number) => {
      const s = st.current
      const T = s.t
      s.time += dt
      const bodies = [s.a, s.b]
      let still = true
      if (s.reduce) {
        s.a.x = s.b.x = T.x; s.a.y = s.b.y = T.y
        s.a.vx = s.b.vx = s.a.vy = s.b.vy = 0
      } else {
        bodies.forEach((B, i) => {
          const lead = i === s.lead
          const k = lead ? 220 : 75
          const c = lead ? 26 : 14
          const f = !lead && now < s.lagFrom ? 0.08 : 1
          B.vx += (k * (T.x - B.x) - c * B.vx) * dt * f
          B.vy += (k * (T.y - B.y) - c * B.vy) * dt * f
          B.x += B.vx * dt
          B.y += B.vy * dt
          if (Math.abs(T.x - B.x) > 0.3 || Math.abs(T.y - B.y) > 0.3 || Math.abs(B.vx) > 3 || Math.abs(B.vy) > 3) still = false
        })
      }
      if (s.moving && still) {
        s.moving = false
        if (!s.reduce) s.rips.push({ x: T.x, y: T.y, age: 0, amp: 0.9 })
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
        const busy = s.moving || s.rips.length || s.mouse.s > 0.01
        if (s.visible && (!s.reduce || busy)) s.raf = requestAnimationFrame(tick)
        else s.raf = 0
      }
      s.raf = requestAnimationFrame(tick)
    }, [draw, step])

    const measure = React.useCallback(() => {
      const nav = navRef.current
      const el = activeDayRef.current
      if (!nav || !el) return
      const s = st.current
      s.w = nav.offsetWidth
      s.h = nav.offsetHeight
      const navRect = nav.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const T = s.t
      T.r = elRect.width / 2
      const nx = PAD + (elRect.left - navRect.left) + elRect.width / 2
      const ny = PAD + (elRect.top - navRect.top) + elRect.height / 2
      if (!s.ready) {
        s.a.x = s.b.x = nx
        s.a.y = s.b.y = ny
        s.ready = true
      } else if (Math.abs(nx - T.x) > 0.5 || Math.abs(ny - T.y) > 0.5) {
        const distA = Math.hypot(nx - s.a.x, ny - s.a.y)
        const distB = Math.hypot(nx - s.b.x, ny - s.b.y)
        s.lead = distA <= distB ? 0 : 1
        s.lagFrom = performance.now() + 65
        s.moving = true
      }
      T.x = nx
      T.y = ny
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
    }, [loop])

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

    React.useLayoutEffect(() => { measure() }, [measure, selectedDate, viewDate])

    const ripple = (x: number, y: number, amp: number) => {
      const s = st.current
      if (s.reduce) return
      s.rips.push({ x, y, age: 0, amp })
      loop()
    }

    const prevMonth = () => {
      playPlipAudio(400, 520)
      setViewDate(new Date(currentYear, currentMonth - 1, 1))
    }

    const nextMonth = () => {
      playPlipAudio(520, 640)
      setViewDate(new Date(currentYear, currentMonth + 1, 1))
    }

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const startDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()

    const days: { date: Date; isOutside: boolean }[] = []
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
        isOutside: true,
      })
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentYear, currentMonth, i),
        isOutside: false,
      })
    }
    const remaining = (7 - (days.length % 7)) % 7
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, i),
        isOutside: true,
      })
    }

    const today = new Date()
    const isSameDay = (d1: Date | null, d2: Date) =>
      Boolean(d1 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate())

    const handleSelectDay = (date: Date) => {
      playPlipAudio(580, 800)
      if (controlledSelected === undefined) setUncontrolledSelected(date)
      onSelect?.(date)
    }

    return (
      <div
        ref={(node) => {
          navRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={["nimbus-calendar", className].filter(Boolean).join(" ")}
        data-tone={tone}
        data-gl={gl}
        onPointerMove={(e) => {
          const r = navRef.current?.getBoundingClientRect()
          if (r) {
            st.current.mouse.x = e.clientX - r.left + PAD
            st.current.mouse.y = e.clientY - r.top + PAD
            st.current.mouse.on = true
            loop()
          }
        }}
        onPointerLeave={() => { st.current.mouse.on = false; loop() }}
        onPointerDown={(e) => {
          const r = navRef.current?.getBoundingClientRect()
          if (r) ripple(e.clientX - r.left + PAD, e.clientY - r.top + PAD, 0.8)
        }}
        style={style}
        {...props}
      >
        <style dangerouslySetInnerHTML={{ __html: CAL_CSS }} />
        <span className="cl-glass" aria-hidden="true" />
        <canvas className="cl-water" ref={canvasRef} aria-hidden="true" />
        <span className="cl-drop" ref={dropRef} aria-hidden="true" />

        <div className="cl-header">
          <div className="cl-title">
            {MONTHS[currentMonth]} {currentYear}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" className="cl-nav-btn" onClick={prevMonth} aria-label="Previous month">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button type="button" className="cl-nav-btn" onClick={nextMonth} aria-label="Next month">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="cl-grid">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="cl-weekday">
              {wd}
            </div>
          ))}

          {days.map(({ date, isOutside }, idx) => {
            const isSelected = isSameDay(selectedDate, date)
            const isCurrentDay = isSameDay(today, date)
            const isDisabled =
              Boolean(minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) ||
              Boolean(maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()))

            return (
              <button
                key={idx}
                ref={isSelected ? activeDayRef : undefined}
                type="button"
                className="cl-day"
                data-selected={isSelected}
                data-today={isCurrentDay}
                data-outside={isOutside}
                disabled={isDisabled}
                onClick={() => handleSelectDay(date)}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)

LiquidCalendar.displayName = "LiquidCalendar"

export { LiquidCalendar as Calendar }
export { LiquidCalendar as Component }
export default LiquidCalendar

"use client"

/**
 * Nimbus UI · Liquid Form — "Aqueduct"
 * A unified glass form panel embedded with responsive WebGL water. As the user
 * tabs or clicks between fields, an active fluid drop glides seamlessly across
 * inputs, stretching, pinching droplets on long hops, and settling with gentle ripples.
 * Invalid inputs physically agitate the water with ruby-tinted shake physics;
 * submitting flows the liquid into the action button, filling it with vibrant caustics
 * while processing, and coalescing into a surface-tension checkmark drop upon success.
 * Supports compound and declarative forms, client validation, sound plips, reduced motion,
 * and full accessible ARIA semantics. No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"
import { useLiquidContext } from "./liquid/provider"

/* ===================== Types & Interfaces ===================== */

export type LiquidFormTone = "light" | "dark"
export type LiquidFormPhase = "idle" | "processing" | "success" | "error"

export type LiquidFormFieldType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"

export type LiquidFormFieldOption = {
  label: string
  value: string
}

export type LiquidFormFieldConfig = {
  name: string
  label: string
  type?: LiquidFormFieldType
  placeholder?: string
  defaultValue?: string | boolean
  required?: boolean
  options?: LiquidFormFieldOption[]
  rows?: number
  colSpan?: 1 | 2
  autoComplete?: string
  helperText?: string
  validate?: (value: any, formValues: Record<string, any>) => string | undefined
}

export type LiquidFormProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  fields?: LiquidFormFieldConfig[]
  onSubmit?: (values: Record<string, any>) => Promise<unknown> | unknown
  onValidate?: (values: Record<string, any>) => Record<string, string> | undefined
  submitLabel?: string
  processingLabel?: string
  successLabel?: string
  tone?: LiquidFormTone
  sound?: boolean
  resetAfter?: number
  note?: string
  maxWidth?: number | string
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

/* ===================== Shader Engine (Pattern A/D) ===================== */

const PAD = 14
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uCard;uniform float uCardR;
uniform vec4 uBox[2];uniform float uBoxR[2];uniform vec4 uSat[4];uniform vec4 uRip[6];uniform vec3 uMouse;uniform vec3 uFront;
uniform float uDark;uniform float uAmb;uniform float uBlue;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float dropD(vec2 p){float d=1e4;
 for(int i=0;i<2;i++){vec4 B=uBox[i];if(B.z>.5){vec2 q=p;
  if(i==0){float f=exp(-pow(q.x-uFront.x,2.)/200.);q.x+=f*uFront.y*(sin(q.y*.2+uTime*7.)+.5*sin(q.y*.37-uTime*5.));}
  d=smin(d,sdRB(q-B.xy,B.zw,uBoxR[i]),12.);}}
 for(int i=0;i<4;i++){vec4 S=uSat[i];if(S.z>.5){d=smin(d,length(p-S.xy)-S.z,12.);}}
 return d;}
float cardD(vec2 p){vec2 h=uCard.zw*.5;return sdRB(p-uCard.xy-h,h,uCardR);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*240.;w+=R.w*exp(-R.z*1.7)*sin(x*.3)*exp(-x*x/700.);}}
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1400.);
 w+=uAmb*(sin(p.x*.04+p.y*.02+uTime*1.1)*.45+sin(p.x*.11-uTime*.8+p.y*.13)*.25);return w;}
float H(vec2 p){float dc=cardD(p);return lens(dc,18.)*2.4+lens(dropD(p),11.)*7.5+waves(p)*smoothstep(0.,9.,-dc);}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 float dp=cardD(p);if(dp>16.){gl_FragColor=vec4(0.);return;}
 float dd=dropD(p);
 float h0=H(p);vec3 n=normalize(vec3(h0-H(p+vec2(1.,0.)),h0-H(p+vec2(0.,1.)),1.));
 vec3 V=vec3(0.,0.,1.);
 float spec=pow(max(dot(reflect(-normalize(vec3(-.45,-.8,.85)),n),V),0.),70.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.6,.75,.7)),n),V),0.),22.)*.3;
 float fres=clamp((1.-n.z)*4.,0.,1.);
 vec3 irid=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+fres*.85+p.x*.0028+p.y*.0015+uTime*.035));
 float pm=smoothstep(1.,-1.,dp);float dm=smoothstep(1.,-1.,dd)*smoothstep(1.,-2.,dp);
 float sh=smoothstep(9.,-9.,dropD(p-vec2(0.,5.)))*(1.-dm)*pm*(.11+.07*uDark+.08*uBlue);
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
 vec3 bw=mix(vec3(.35,.86,1.),vec3(0.,.52,.98),clamp(.5-n.y*2.+th*.3,0.,1.));
 dc=mix(dc,bw,uBlue);da=mix(da,dm*.9,uBlue);
 float la=rim*.22;vec3 lc=mix(vec3(0.,.42,.78),vec3(.1,.55,.95),uDark);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.7+smoothstep(.6,1.,cs)*(.28+.25*uBlue)*th*dm,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.2+spec2*.5),0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,dd)*.4;dc=mix(vec3(1.),irid,.35)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 gl_FragColor=vec4(c,a);
}`

type Box = { x: number; y: number; w: number; h: number; vx: number; vy: number; vw: number; vh: number }
type Target = { x: number; y: number; w: number; h: number; r: number }
type Sat = { x: number; y: number; vx: number; vy: number; r: number; k: number }
type Rip = { x: number; y: number; age: number; amp: number }
type GLC = { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> }
const mkBox = (): Box => ({ x: 0, y: 0, w: 0, h: 0, vx: 0, vy: 0, vw: 0, vh: 0 })

function initGL(canvas: HTMLCanvasElement): GLC | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) as WebGLRenderingContext | null
  if (!gl) return null
  const sh = (t: number, src: string) => {
    const s = gl.createShader(t)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG), p = gl.createProgram()
  if (!vs || !fs || !p) return null
  gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null
  gl.useProgram(p)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(p, "a")
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const u: Record<string, WebGLUniformLocation | null> = {}
  for (const n of ["uRes", "uDpr", "uTime", "uCard", "uCardR", "uBox", "uBoxR", "uSat", "uRip", "uMouse", "uFront", "uDark", "uAmb", "uBlue"]) u[n] = gl.getUniformLocation(p, n)
  return { gl, u }
}

function useWater(
  panelRef: React.RefObject<HTMLElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  getTarget: () => Target | null,
  tone: "light" | "dark",
) {
  const st = React.useRef({
    a: mkBox(), b: mkBox(), lead: 0 as 0 | 1, lagUntil: 0, sats: [] as Sat[], rips: [] as Rip[],
    mouse: { x: 0, y: 0, s: 0, on: false }, blue: 0, blueT: 0, moving: false, split: false, ready: false,
    w: 0, h: 0, ch: 0, visible: true, reduce: false, raf: 0, last: 0, time: 0, glc: null as GLC | null,
  })
  const [gl, setGl] = React.useState(true)
  const targetRef = React.useRef(getTarget)
  targetRef.current = getTarget
  const darkRef = React.useRef(0)
  darkRef.current = tone === "dark" ? 1 : 0

  const draw = React.useCallback(() => {
    const s = st.current
    const g = s.glc
    if (!g) return
    const head = s.lead === 0 ? s.a : s.b, tail = s.lead === 0 ? s.b : s.a
    const gap = Math.hypot(head.x - tail.x, head.y - tail.y) - (Math.min(head.w, head.h) + Math.min(tail.w, tail.h))
    const thin = Math.max(0, Math.min(1, (gap + 40) / 60))
    const T = targetRef.current()
    const R0 = T?.r ?? 14
    const shape = (B: Box, k: number) => {
      const w = B.w * (1 - k * thin), h = B.h * (1 - k * 0.4 * thin)
      return { w, h, r: Math.max(0, Math.min(R0 + (Math.min(w, h) - R0) * thin, w, h)) }
    }
    const hs = shape(head, 0.25), ts = shape(tail, 0.55)
    const { gl: c, u } = g
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    c.viewport(0, 0, c.drawingBufferWidth, c.drawingBufferHeight)
    c.uniform2f(u.uRes, s.w + PAD * 2, s.ch)
    c.uniform1f(u.uDpr, dpr)
    c.uniform1f(u.uTime, s.time)
    c.uniform4f(u.uCard, PAD, PAD, s.w, s.h)
    c.uniform1f(u.uCardR, 28)
    const on = (B: { w: number; h: number }) => B.w > 1 && B.h > 1
    c.uniform4fv(u.uBox, new Float32Array([head.x, head.y, on(hs) ? hs.w : 0, hs.h, tail.x, tail.y, on(ts) ? ts.w : 0, ts.h]))
    c.uniform1fv(u.uBoxR, new Float32Array([hs.r, ts.r]))
    const sats = new Float32Array(16)
    s.sats.slice(0, 4).forEach((d, i) => sats.set([d.x, d.y, d.r, 0], i * 4))
    c.uniform4fv(u.uSat, sats)
    const rips = new Float32Array(24)
    s.rips.slice(-6).forEach((p, i) => rips.set([p.x, p.y, p.age, p.amp], i * 4))
    c.uniform4fv(u.uRip, rips)
    c.uniform3f(u.uMouse, s.mouse.x, s.mouse.y, s.mouse.s)
    c.uniform3f(u.uFront, head.x + head.w, s.reduce ? 0 : Math.min(Math.abs(head.vw) * 0.01, 3.5), 0)
    c.uniform1f(u.uDark, darkRef.current)
    c.uniform1f(u.uAmb, s.reduce ? 0 : 1)
    c.uniform1f(u.uBlue, s.blue)
    c.clearColor(0, 0, 0, 0)
    c.clear(c.COLOR_BUFFER_BIT)
    c.drawArrays(c.TRIANGLES, 0, 3)
  }, [])

  const step = React.useCallback((dt: number, now: number) => {
    const s = st.current
    s.time += dt
    const T = targetRef.current()
    let still = true
    s.blue += (s.blueT - s.blue) * Math.min(1, dt * 5)
    if (Math.abs(s.blueT - s.blue) > 0.01) still = false

    if (T) {
      if (!s.ready) { Object.assign(s.a, T); Object.assign(s.b, T); s.ready = true }
      const bodies = [s.a, s.b]
      if (s.reduce) {
        for (const B of bodies) Object.assign(B, { x: T.x, y: T.y, w: T.w, h: T.h, vx: 0, vy: 0, vw: 0, vh: 0 })
        s.sats = []
      } else {
        bodies.forEach((B, i) => {
          const lead = i === s.lead
          const k = lead ? 210 : 60, c = lead ? 25 : 13
          const f = !lead && now < s.lagUntil ? 0.04 : 1
          B.vx += (k * (T.x - B.x) - c * B.vx) * dt * f
          B.vy += (k * (T.y - B.y) - c * B.vy) * dt * f
          B.vw += (k * (T.w - B.w) - c * B.vw) * dt * f
          B.vh += (k * (T.h - B.h) - c * B.vh) * dt * f
          B.x += B.vx * dt; B.y += B.vy * dt; B.w = Math.max(0, B.w + B.vw * dt); B.h = Math.max(0, B.h + B.vh * dt)
          if (Math.abs(T.x - B.x) + Math.abs(T.y - B.y) + Math.abs(T.w - B.w) + Math.abs(T.h - B.h) > 0.6 || Math.abs(B.vx) + Math.abs(B.vy) + Math.abs(B.vw) > 4) still = false
        })
        const head = bodies[s.lead], tail = bodies[1 - s.lead]
        const dist = Math.hypot(head.x - tail.x, head.y - tail.y)
        if (!s.split && s.moving && dist > Math.min(head.w, head.h) + Math.min(tail.w, tail.h) + 6) {
          s.split = true
          ;[0.3, 0.55, 0.8].forEach((t, j) => s.sats.push({
            x: tail.x + (head.x - tail.x) * t + (Math.random() - 0.5) * 20,
            y: tail.y + (head.y - tail.y) * t + (Math.random() - 0.5) * 10,
            vx: (head.vx + tail.vx) * 0.3, vy: (head.vy + tail.vy) * 0.3, r: 7.5 - j * 1.2 + Math.random() * 1.5, k: 60 + Math.random() * 70,
          }))
        }
        s.sats = s.sats.filter((d) => {
          d.vx += (d.k * (head.x - d.x) - 9 * d.vx) * dt
          d.vy += (d.k * (head.y - d.y) - 9 * d.vy) * dt
          d.x += d.vx * dt; d.y += d.vy * dt
          if (Math.abs(head.x - d.x) < head.w * 0.8 && Math.abs(head.y - d.y) < head.h * 0.9) d.r -= dt * 30
          return d.r > 0.6
        })
        if (s.sats.length) still = false
      }
      if (s.moving && still) {
        s.moving = false
        if (!s.reduce) s.rips.push({ x: T.x, y: T.y, age: 0, amp: s.split ? 1 : 0.5 })
      }
    } else {
      // no target: shrink bodies smoothly
      s.a.w = Math.max(0, s.a.w - dt * 200)
      s.b.w = Math.max(0, s.b.w - dt * 200)
      if (s.a.w > 0 || s.b.w > 0) still = false
    }

    s.rips.forEach((p) => (p.age += dt))
    s.rips = s.rips.filter((p) => p.age < 2.4)
    s.mouse.s += ((s.mouse.on ? 1 : 0) - s.mouse.s) * Math.min(1, dt * 7)
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
      const busy = s.moving || s.rips.length > 0 || s.sats.length > 0 || s.mouse.s > 0.01 || Math.abs(s.blueT - s.blue) > 0.01
      if (s.visible && (!s.reduce || busy)) s.raf = requestAnimationFrame(tick)
      else s.raf = 0
    }
    s.raf = requestAnimationFrame(tick)
  }, [draw, step])

  const resize = React.useCallback(() => {
    const el = panelRef.current, cv = canvasRef.current
    if (!el) return
    const s = st.current
    s.w = el.offsetWidth
    s.h = el.offsetHeight
    if (cv) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const W = s.w + PAD * 2, Hc = Math.ceil((s.h + PAD * 2) / 96) * 96
      if (Hc !== s.ch || cv.width !== Math.round(W * dpr)) {
        s.ch = Hc
        cv.width = Math.round(W * dpr); cv.height = Math.round(Hc * dpr)
        cv.style.width = `${W}px`; cv.style.height = `${Hc}px`
      }
    }
    loop()
  }, [panelRef, canvasRef, loop])

  React.useEffect(() => {
    const s = st.current
    s.reduce = typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const cv = canvasRef.current
    s.glc = cv ? initGL(cv) : null
    if (!s.glc) setGl(false)
    const lost = (e: Event) => { e.preventDefault(); s.glc = null; setGl(false) }
    cv?.addEventListener("webglcontextlost", lost)
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; if (s.visible) loop() })
    const ro = new ResizeObserver(() => resize())
    if (panelRef.current) { io.observe(panelRef.current); ro.observe(panelRef.current) }
    resize()
    return () => { cv?.removeEventListener("webglcontextlost", lost); io.disconnect(); ro.disconnect(); cancelAnimationFrame(s.raf); s.raf = 0 }
  }, [canvasRef, panelRef, loop, resize])

  const flow = React.useCallback((lag = 90) => {
    const s = st.current
    const T = targetRef.current()
    if (T) s.lead = Math.hypot(T.x - s.a.x, T.y - s.a.y) <= Math.hypot(T.x - s.b.x, T.y - s.b.y) ? 0 : 1
    s.lagUntil = performance.now() + lag
    s.moving = true
    s.split = false
    loop()
  }, [loop])

  const ripple = React.useCallback((x: number, y: number, amp: number) => {
    const s = st.current
    if (s.reduce) return
    s.rips.push({ x, y, age: 0, amp })
    loop()
  }, [loop])

  const shake = React.useCallback(() => {
    const s = st.current
    if (s.reduce) return
    const head = s.lead === 0 ? s.a : s.b
    head.vx += 420; head.vw -= 160
    s.moving = true
    loop()
  }, [loop])

  const setBlue = React.useCallback((v: number) => { st.current.blueT = v; loop() }, [loop])
  const pointer = React.useCallback((x: number, y: number, on: boolean) => {
    const s = st.current
    s.mouse.x = x; s.mouse.y = y; s.mouse.on = on
    loop()
  }, [loop])

  return { gl, flow, ripple, shake, setBlue, pointer, loop }
}

/* ===================== Icons ===================== */

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path className="lf-check-path" d="m5.5 12.5 4.2 4.2L18.5 7.8" />
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)

/* ===================== Styles ===================== */

export const LF_CSS = `
.nimbus-form{
  --f-fg:#0B132B;
  --f-soft:rgba(11,19,43,.62);
  --f-faint:rgba(11,19,43,.4);
  --f-line:rgba(11,19,43,.1);
  --f-tint:rgba(255,255,255,.18);
  --f-rim:rgba(255,255,255,.75);
  --f-err:#E5484D;
  --f-accent:#00A2FF;
  position:relative;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;width:100%;isolation:isolate;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  color:var(--f-fg);-webkit-tap-highlight-color:transparent;
}
.nimbus-form[data-tone="dark"]{
  --f-fg:#F1F7FF;
  --f-soft:rgba(241,247,255,.66);
  --f-faint:rgba(241,247,255,.45);
  --f-line:rgba(241,247,255,.12);
  --f-tint:rgba(10,18,40,.32);
  --f-rim:rgba(255,255,255,.32);
}
.nimbus-form *{box-sizing:border-box}
.lf-panel{
  position:relative;isolation:isolate;width:100%;max-width:540px;padding:32px 28px 26px;border-radius:28px;
}
.lf-glass{
  position:absolute;inset:0;border-radius:inherit;z-index:-2;background:var(--f-tint);
  -webkit-backdrop-filter:blur(14px) saturate(1.2) brightness(1.06);backdrop-filter:blur(14px) saturate(1.2) brightness(1.06);
  box-shadow:inset 0 1px 1px var(--f-rim),inset 0 0 0 1px rgba(255,255,255,.2),0 22px 50px -24px rgba(0,40,90,.55),0 2px 6px rgba(0,40,90,.08);
}
.nimbus-form[data-tone="dark"] .lf-glass{
  box-shadow:inset 0 1px 1px var(--f-rim),inset 0 0 0 1px rgba(255,255,255,.1),0 22px 50px -24px rgba(0,0,0,.7);
}
.lf-water{position:absolute;left:${-PAD}px;top:${-PAD}px;z-index:-1;pointer-events:none}
.nimbus-form[data-gl="off"] .lf-water{display:none}

.lf-fallback{
  display:none;position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:-1;
}
.nimbus-form[data-gl="off"] .lf-fallback{
  display:block;background:radial-gradient(120% 140% at 50% 10%, rgba(255,255,255,.24), rgba(255,255,255,.04));
}

.lf-header{margin-bottom:22px;display:flex;flex-direction:column;gap:6px}
.lf-title{font-size:20px;font-weight:650;letter-spacing:-.02em;margin:0;color:var(--f-fg)}
.lf-desc{font-size:13.5px;font-weight:480;color:var(--f-soft);margin:0;line-height:1.45}

.lf-grid{
  display:grid;grid-template-columns:repeat(2,1fr);gap:14px 14px;
}
.lf-field{display:flex;flex-direction:column;gap:6px;min-width:0}
.lf-field[data-col="2"],.lf-field.lf-wide{grid-column:1/-1}
.lf-label{
  font-size:12.5px;font-weight:600;letter-spacing:.01em;color:var(--f-soft);display:flex;align-items:center;justify-content:space-between;
}
.lf-req{color:var(--f-accent);margin-left:3px}

.lf-box{
  position:relative;display:flex;align-items:center;border-radius:14px;
  box-shadow:inset 0 0 0 1px var(--f-line),inset 0 1px 2px rgba(0,40,90,.06);background:rgba(255,255,255,.12);
  transition:box-shadow .25s,border-color .25s;
}
.nimbus-form[data-tone="dark"] .lf-box{background:rgba(255,255,255,.04)}
.lf-box[data-invalid="true"]{box-shadow:inset 0 0 0 1.5px var(--f-err)}

.lf-input{
  all:unset;box-sizing:border-box;width:100%;height:46px;padding:0 14px;font-size:14.5px;font-weight:500;
  letter-spacing:.01em;color:var(--f-fg);caret-color:var(--f-accent);border-radius:14px;
}
.lf-input::placeholder{color:var(--f-faint);opacity:1}
.lf-input:focus-visible{outline:2px solid var(--f-accent);outline-offset:2px}

.lf-textarea{
  all:unset;box-sizing:border-box;width:100%;min-height:96px;padding:12px 14px;font-size:14.5px;font-weight:500;
  letter-spacing:.01em;color:var(--f-fg);caret-color:var(--f-accent);line-height:1.4;border-radius:14px;resize:vertical;
}
.lf-textarea::placeholder{color:var(--f-faint);opacity:1}
.lf-textarea:focus-visible{outline:2px solid var(--f-accent);outline-offset:2px}

.lf-select{
  box-sizing:border-box;width:100%;height:46px;padding:0 34px 0 14px;font-size:14.5px;font-weight:500;
  letter-spacing:.01em;color:var(--f-fg);background:transparent;border:none;border-radius:14px;appearance:none;
  cursor:pointer;
}
.lf-select:focus-visible{outline:2px solid var(--f-accent);outline-offset:2px}
.lf-select-arrow{
  position:absolute;right:14px;pointer-events:none;color:var(--f-soft);
}

.lf-check-row{
  display:flex;align-items:center;gap:10px;min-height:46px;padding:0 4px;cursor:pointer;
}
.lf-checkbox{
  appearance:none;-webkit-appearance:none;box-sizing:border-box;width:20px;height:20px;border-radius:6px;
  background:rgba(255,255,255,.14);box-shadow:inset 0 0 0 1px var(--f-line);cursor:pointer;display:grid;place-items:center;
  transition:all .2s;
}
.lf-checkbox:checked{
  background:var(--f-accent);box-shadow:inset 0 1px 1px rgba(255,255,255,.6),0 2px 6px rgba(0,162,255,.35);
}
.lf-checkbox:focus-visible{outline:2px solid var(--f-accent);outline-offset:2px}
.lf-check-label{font-size:13.5px;font-weight:520;color:var(--f-fg);user-select:none}

.lf-err{min-height:16px;margin-top:2px;font-size:12px;color:var(--f-err);font-weight:520}
.lf-help{min-height:16px;margin-top:2px;font-size:12px;color:var(--f-faint)}

.lf-actions{margin-top:10px;display:flex;flex-direction:column;gap:10px}
.lf-submit{
  position:relative;all:unset;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:8px;
  width:100%;height:50px;border-radius:999px;cursor:pointer;font-size:15.5px;font-weight:620;letter-spacing:-.01em;
  color:var(--f-fg);background-color:rgba(255,255,255,.2);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.9),inset 0 0 0 1px rgba(255,255,255,.5),inset 0 -2px 6px rgba(0,162,255,.14),0 8px 20px -10px rgba(0,70,140,.45);
  transition:color .35s,background-color .45s,box-shadow .45s;
}
.nimbus-form[data-tone="dark"] .lf-submit{
  background-color:rgba(255,255,255,.07);box-shadow:inset 0 1px 1px rgba(255,255,255,.35),inset 0 0 0 1px rgba(255,255,255,.14),0 8px 20px -10px rgba(0,0,0,.6);
}
.lf-submit:focus-visible{outline:2px solid var(--f-accent);outline-offset:3px}
.lf-submit[data-phase="processing"],.lf-submit[data-phase="success"]{color:#fff;cursor:default}
.nimbus-form .lf-submit[data-phase="success"]{background-color:transparent;box-shadow:none}

.lf-label-wrap{display:inline-flex;align-items:center;gap:8px;transition:opacity .25s,transform .35s}
.lf-dots{display:inline-flex;gap:3px}
.lf-dots i{width:4px;height:4px;border-radius:50%;background:currentColor;animation:lfDot 1s infinite}
.lf-dots i:nth-child(2){animation-delay:.15s}
.lf-dots i:nth-child(3){animation-delay:.3s}
@keyframes lfDot{0%,100%{opacity:.35;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}

.lf-check-path{stroke-dasharray:24;stroke-dashoffset:24;animation:lfDraw .5s .25s cubic-bezier(.3,0,.2,1) forwards}
@keyframes lfDraw{to{stroke-dashoffset:0}}

.lf-foot{display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;color:var(--f-faint);margin-top:4px}
.lf-live-status{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

@media (max-width:580px){
  .lf-grid{grid-template-columns:1fr}
  .lf-field[data-col="2"]{grid-column:1}
  .lf-panel{padding:24px 18px 20px}
}
@media (prefers-reduced-motion:reduce){
  .lf-submit,.lf-label-wrap{transition:none}
  .lf-check-path{animation:none;stroke-dashoffset:0}
  .lf-dots i{animation:none}
}
`

/* ===================== Component Implementation ===================== */

const DEFAULT_FIELDS: LiquidFormFieldConfig[] = [
  { name: "name", label: "Full Name", placeholder: "Alex Rivera", required: true, colSpan: 1 },
  { name: "email", label: "Email Address", type: "email", placeholder: "alex@example.com", required: true, colSpan: 1 },
  {
    name: "category",
    label: "Inquiry Type",
    type: "select",
    defaultValue: "design",
    options: [
      { label: "Design Systems", value: "design" },
      { label: "Product Engineering", value: "engineering" },
      { label: "General Feedback", value: "feedback" },
    ],
    colSpan: 2,
  },
  { name: "message", label: "Message", type: "textarea", placeholder: "Tell us about your project...", required: true, rows: 3, colSpan: 2 },
  { name: "updates", label: "Receive liquid glass updates", type: "checkbox", defaultValue: true, colSpan: 2 },
]

export function LiquidForm({
  title = "Get in Touch",
  description = "A responsive glass basin. Focus inputs to see the water glide.",
  fields = DEFAULT_FIELDS,
  onSubmit,
  onValidate,
  submitLabel = "Send Message",
  processingLabel = "Transmitting",
  successLabel = "Sent Successfully",
  tone: propTone,
  sound: propSound,
  resetAfter = 3200,
  note = "Nimbus UI · Encrypted liquid glass form",
  maxWidth = 540,
  className,
  style,
  children,
}: LiquidFormProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const submitRef = React.useRef<HTMLButtonElement>(null)
  const boxRefs = React.useRef<Record<string, HTMLElement | null>>({})
  const audio = React.useRef<AudioContext | null>(null)
  const uid = React.useId().replace(/:/g, "")
  const liquidCtx = useLiquidContext()
  const tone = propTone ?? (liquidCtx.tone === "dark" || liquidCtx.tone === "midnight" ? "dark" : "light")
  const sound = propSound ?? liquidCtx.sound

  const [formValues, setFormValues] = React.useState<Record<string, any>>(() => {
    const init: Record<string, any> = {}
    fields.forEach((f) => {
      init[f.name] = f.defaultValue !== undefined ? f.defaultValue : (f.type === "checkbox" ? false : "")
    })
    return init
  })

  const [activeField, setActiveField] = React.useState<string | null>(() => fields[0]?.name ?? null)
  const [phase, setPhase] = React.useState<LiquidFormPhase>("idle")
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [serverError, setServerError] = React.useState<string>("")
  const progRef = React.useRef({ p: 0, raf: 0 })
  const [, force] = React.useReducer((n: number) => n + 1, 0)

  const plip = (f0: number, f1: number) => {
    if (!sound) return
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = (audio.current ||= new AC())
      const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain()
      o.type = "sine"
      o.frequency.setValueAtTime(f0, t)
      o.frequency.exponentialRampToValueAtTime(f1, t + 0.08)
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.14, t + 0.008)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
      o.connect(g).connect(ctx.destination)
      o.start(t); o.stop(t + 0.2)
    } catch { /* audio optional */ }
  }

  const getTarget = React.useCallback((): Target | null => {
    const panel = panelRef.current
    if (!panel) return null
    const pr = panel.getBoundingClientRect()

    if (phase === "processing" || phase === "success") {
      const btn = submitRef.current
      if (!btn) return null
      const b = btn.getBoundingClientRect()
      const hh = b.height / 2
      if (phase === "success") {
        const rr = hh * 0.92
        return { x: PAD + b.left - pr.left + b.width / 2, y: PAD + b.top - pr.top + hh, w: rr, h: rr, r: rr }
      }
      const p = progRef.current.p
      const w = Math.max(hh, (b.width / 2) * p)
      return { x: PAD + b.left - pr.left + w, y: PAD + b.top - pr.top + hh, w, h: hh, r: hh }
    }

    if (activeField && boxRefs.current[activeField]) {
      const el = boxRefs.current[activeField]
      if (!el) return null
      const b = el.getBoundingClientRect()
      const h = b.height / 2 + 2
      return { x: PAD + b.left - pr.left + b.width / 2, y: PAD + b.top - pr.top + b.height / 2, w: b.width / 2 + 2, h, r: 14 }
    }

    return null
  }, [phase, activeField])

  const water = useWater(panelRef, canvasRef, getTarget, tone)

  React.useEffect(() => {
    water.flow(phase === "processing" ? 140 : 90)
  }, [activeField, phase, water])

  const runProgress = (to: number, ms: number, done?: () => void) => {
    const P = progRef.current
    cancelAnimationFrame(P.raf)
    const from = P.p, t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / ms)
      const e = 1 - Math.pow(1 - t, 3)
      P.p = from + (to - from) * e
      water.loop()
      if (t < 1) P.raf = requestAnimationFrame(tick)
      else { P.raf = 0; done?.() }
    }
    P.raf = requestAnimationFrame(tick)
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    fields.forEach((f) => {
      const val = formValues[f.name]
      if (f.required && (val === undefined || val === null || val === "" || (f.type === "checkbox" && !val))) {
        errs[f.name] = `${f.label} is required`
      } else if (f.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val))) {
        errs[f.name] = "Please enter a valid email address"
      }
      if (f.validate) {
        const custom = f.validate(val, formValues)
        if (custom) errs[f.name] = custom
      }
    })
    if (onValidate) {
      const customAll = onValidate(formValues)
      if (customAll) Object.assign(errs, customAll)
    }
    return errs
  }

  const resetTimer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => { window.clearTimeout(resetTimer.current); cancelAnimationFrame(progRef.current.raf) }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (phase === "processing" || phase === "success") return
    setServerError("")
    const validationErrors = validate()
    setErrors(validationErrors)

    const firstInvalid = Object.keys(validationErrors)[0]
    if (firstInvalid) {
      setActiveField(firstInvalid)
      const el = boxRefs.current[firstInvalid]
      el?.querySelector<HTMLElement>("input, textarea, select")?.focus()
      setTimeout(() => water.shake(), 50)
      plip(300, 220)
      return
    }

    progRef.current.p = 0
    setPhase("processing")
    water.setBlue(1)
    plip(420, 1300)
    runProgress(0.88, 1400)

    try {
      if (onSubmit) {
        await onSubmit(formValues)
      } else {
        await new Promise((r) => setTimeout(r, 600))
      }

      setPhase("success")
      plip(660, 1760)
      const b = submitRef.current?.getBoundingClientRect(), pr = panelRef.current?.getBoundingClientRect()
      if (b && pr) water.ripple(PAD + b.left - pr.left + b.width / 2, PAD + b.top - pr.top + b.height / 2, 1.5)
      try { navigator.vibrate?.(12) } catch { /* optional */ }

      runProgress(1, 260)

      if (resetAfter > 0) {
        resetTimer.current = window.setTimeout(() => {
          setPhase("idle")
          water.setBlue(0)
          progRef.current.p = 0
        }, resetAfter)
      }
    } catch (err) {
      setPhase("error")
      setServerError(err instanceof Error && err.message ? err.message : "Submission failed. Please try again.")
      water.setBlue(0)
      runProgress(0, 200, () => {
        setTimeout(() => water.shake(), 40)
      })
    }
    force()
  }

  const updateValue = (name: string, val: any) => {
    setFormValues((v) => ({ ...v, [name]: val }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }))
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return
    const pr = panelRef.current?.getBoundingClientRect()
    if (pr) water.pointer(e.clientX - pr.left + PAD, e.clientY - pr.top + PAD, true)
  }

  const submitLabelContent = phase === "processing" ? (
    <span className="lf-label-wrap">
      {processingLabel}
      <span className="lf-dots" aria-hidden="true"><i /><i /><i /></span>
    </span>
  ) : phase === "success" ? (
    <span className="lf-label-wrap">
      <CheckIcon />
      <span>{successLabel}</span>
    </span>
  ) : (
    <span className="lf-label-wrap">{submitLabel}</span>
  )

  return (
    <div
      ref={rootRef}
      className={["nimbus-form", className].filter(Boolean).join(" ")}
      data-tone={tone}
      data-gl={water.gl ? "on" : "off"}
      style={{ ...style }}
    >
      <style dangerouslySetInnerHTML={{ __html: LF_CSS }} />
      <span className="lf-live-status" role="status" aria-live="polite">
        {phase === "processing" ? processingLabel : phase === "success" ? successLabel : serverError}
      </span>

      <div
        ref={panelRef}
        className="lf-panel"
        style={{ maxWidth }}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => water.pointer(0, 0, false)}
        onPointerDown={(e) => {
          const pr = panelRef.current?.getBoundingClientRect()
          if (pr) water.ripple(e.clientX - pr.left + PAD, e.clientY - pr.top + PAD, 0.5)
        }}
      >
        <span className="lf-glass" aria-hidden="true" />
        <canvas className="lf-water" ref={canvasRef} aria-hidden="true" />
        <span className="lf-fallback" aria-hidden="true" />

        {(title || description) && (
          <div className="lf-header">
            {title && <h2 className="lf-title">{title}</h2>}
            {description && <p className="lf-desc">{description}</p>}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit}>
          {children || (
            <div className="lf-grid">
              {fields.map((f) => {
                const fieldId = `${uid}-${f.name}`
                const isInvalid = !!errors[f.name]
                return (
                  <div
                    key={f.name}
                    className={`lf-field${f.colSpan === 2 ? " lf-wide" : ""}`}
                    data-col={f.colSpan || 1}
                  >
                    {f.type !== "checkbox" && (
                      <label className="lf-label" htmlFor={fieldId}>
                        <span>{f.label}{f.required && <span className="lf-req" aria-hidden="true">*</span>}</span>
                      </label>
                    )}

                    <div
                      className="lf-box"
                      ref={(el) => { boxRefs.current[f.name] = el }}
                      data-invalid={isInvalid}
                    >
                      {f.type === "textarea" ? (
                        <textarea
                          id={fieldId}
                          name={f.name}
                          rows={f.rows || 3}
                          className="lf-textarea"
                          placeholder={f.placeholder}
                          value={formValues[f.name] ?? ""}
                          disabled={phase === "processing"}
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? `${fieldId}-err` : f.helperText ? `${fieldId}-help` : undefined}
                          onFocus={() => { setActiveField(f.name); plip(520, 680) }}
                          onChange={(e) => updateValue(f.name, e.target.value)}
                        />
                      ) : f.type === "select" ? (
                        <>
                          <select
                            id={fieldId}
                            name={f.name}
                            className="lf-select"
                            value={formValues[f.name] ?? ""}
                            disabled={phase === "processing"}
                            aria-invalid={isInvalid}
                            aria-describedby={isInvalid ? `${fieldId}-err` : f.helperText ? `${fieldId}-help` : undefined}
                            onFocus={() => { setActiveField(f.name); plip(520, 680) }}
                            onChange={(e) => updateValue(f.name, e.target.value)}
                          >
                            {f.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <span className="lf-select-arrow" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </span>
                        </>
                      ) : f.type === "checkbox" ? (
                        <label className="lf-check-row" htmlFor={fieldId}>
                          <input
                            type="checkbox"
                            id={fieldId}
                            name={f.name}
                            className="lf-checkbox"
                            checked={!!formValues[f.name]}
                            disabled={phase === "processing"}
                            aria-invalid={isInvalid}
                            onFocus={() => { setActiveField(f.name); plip(520, 680) }}
                            onChange={(e) => updateValue(f.name, e.target.checked)}
                          />
                          <span className="lf-check-label">{f.label}</span>
                        </label>
                      ) : (
                        <input
                          id={fieldId}
                          name={f.name}
                          type={f.type || "text"}
                          className="lf-input"
                          placeholder={f.placeholder}
                          value={formValues[f.name] ?? ""}
                          autoComplete={f.autoComplete}
                          disabled={phase === "processing"}
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? `${fieldId}-err` : f.helperText ? `${fieldId}-help` : undefined}
                          onFocus={() => { setActiveField(f.name); plip(520, 680) }}
                          onChange={(e) => updateValue(f.name, e.target.value)}
                        />
                      )}
                    </div>

                    {isInvalid && (
                      <span className="lf-err" id={`${fieldId}-err`} role="alert">
                        {errors[f.name]}
                      </span>
                    )}
                    {!isInvalid && f.helperText && (
                      <span className="lf-help" id={`${fieldId}-help`}>
                        {f.helperText}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="lf-actions">
            <button
              ref={submitRef}
              type="submit"
              className="lf-submit"
              data-phase={phase}
              aria-busy={phase === "processing"}
              disabled={phase === "processing"}
              onClick={handleSubmit}
              onFocus={() => setActiveField(null)}
            >
              {submitLabelContent}
            </button>
            {serverError && (
              <span className="lf-err" role="alert" style={{ textAlign: "center", display: "block" }}>
                {serverError}
              </span>
            )}
            {note && (
              <div className="lf-foot">
                <LockIcon />
                <span>{note}</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export { LiquidForm as Component }
export default LiquidForm

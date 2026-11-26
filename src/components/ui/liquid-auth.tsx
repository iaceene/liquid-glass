"use client"

/**
 * Nimbus UI · Liquid Auth — "Equilibrium"
 * A composite authentication panel combining Sign In and Sign Up in a single component.
 * Composes built-in Nimbus UI library components (LiquidButton, LiquidInput, LiquidCheckbox,
 * LiquidSeparator) for maximum reusability, abstraction, and design system cohesion.
 * Features:
 * - Fluid water focus droplet that travels with spring physics between input fields
 * - Fluid water filling and checkmark morphing into the checkout-style submit button
 * - 3D rotating credentials container that flips smoothly between Sign In and Sign Up
 * - Zero hover tilt / mouse perspective on the panel (steady and clean)
 * - First-class OAuth integrations (Google, GitHub, Apple) using LiquidButton
 * - Reusable LiquidInput fields with fluid error agitation and password toggle
 * - Reusable LiquidCheckbox for Remember Me and Terms agreements
 * - Light, Dark, and atmospheric theme tones
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"
import { LiquidButton } from "./liquid-button"
import { LiquidInput } from "./liquid-input"
import { LiquidCheckbox, type CheckboxTone } from "./liquid-checkbox"
import { LiquidSeparator } from "./liquid-separator"

export type AuthMode = "login" | "signup"
export type AuthTone = "light" | "dark" | "midnight" | "aurora" | "sunset" | "rose" | "emerald"
export type AuthPhase = "edit" | "processing" | "success" | "error"

export type AuthProvider = {
  id: "google" | "github" | "apple" | string
  name: string
  icon?: React.ReactNode
}

export type LoginCredentials = {
  email: string
  password: string
  remember?: boolean
}

export type SignUpData = {
  name: string
  email: string
  password: string
  agree?: boolean
}

export type LiquidAuthProps = {
  /** Initial or controlled mode */
  mode?: AuthMode
  defaultMode?: AuthMode
  onModeChange?: (mode: AuthMode) => void
  /** Atmospheric theme tone */
  tone?: AuthTone
  /** Callback on Sign In */
  onLogin?: (credentials: LoginCredentials) => Promise<unknown> | unknown
  /** Callback on Sign Up */
  onSignUp?: (data: SignUpData) => Promise<unknown> | unknown
  /** Callback on OAuth button click */
  onOAuth?: (providerId: string) => Promise<unknown> | unknown
  /** Callback when user clicks 'Forgot password?' */
  onForgotPassword?: () => void
  /** OAuth providers to display */
  providers?: AuthProvider[]
  /** Play soft synthesized water plip sound */
  sound?: boolean
  /** Title of the app or service */
  title?: string
  /** Subtitle note */
  subtitle?: string
  className?: string
  style?: React.CSSProperties
}

/* ===================== SVGs ===================== */

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.36-.58.67-.99 1.74-.86 2.77.99.08 2-.54 2.59-1.28z" />
  </svg>
)

const EyeIcon = ({ show }: { show: boolean }) =>
  show ? (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )

const DEFAULT_PROVIDERS: AuthProvider[] = [
  { id: "google", name: "Google", icon: <GoogleIcon /> },
  { id: "github", name: "GitHub", icon: <GitHubIcon /> },
  { id: "apple", name: "Apple", icon: <AppleIcon /> },
]

/* ===================== WATER SHADER ENGINE ===================== */

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
 /* blue water while paying/processing */
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
  for (const n of ["uRes", "uDpr", "uTime", "uCard", "uCardR", "uBox", "uBoxR", "uSat", "uRip", "uMouse", "uFront", "uDark", "uAmb", "uBlue"]) {
    u[n] = gl.getUniformLocation(p, n)
  }
  return { gl, u }
}

function useWater(
  panelRef: React.RefObject<HTMLElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  getTarget: () => Target | null,
  tone: string
) {
  const st = React.useRef({
    a: mkBox(),
    b: mkBox(),
    lead: 0 as 0 | 1,
    lagUntil: 0,
    sats: [] as Sat[],
    rips: [] as Rip[],
    mouse: { x: 0, y: 0, s: 0, on: false },
    blue: 0,
    blueT: 0,
    moving: false,
    split: false,
    ready: false,
    w: 0,
    h: 0,
    ch: 0,
    visible: true,
    reduce: false,
    raf: 0,
    last: 0,
    time: 0,
    glc: null as GLC | null,
  })
  const [gl, setGl] = React.useState(true)
  const targetRef = React.useRef(getTarget)
  targetRef.current = getTarget
  const darkRef = React.useRef(0)
  darkRef.current = tone === "light" ? 0 : 1

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
      if (!s.ready) {
        Object.assign(s.a, T)
        Object.assign(s.b, T)
        s.ready = true
      }
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
          B.x += B.vx * dt
          B.y += B.vy * dt
          B.w = Math.max(0, B.w + B.vw * dt)
          B.h = Math.max(0, B.h + B.vh * dt)
          if (Math.abs(T.x - B.x) + Math.abs(T.y - B.y) + Math.abs(T.w - B.w) + Math.abs(T.h - B.h) > 0.6 || Math.abs(B.vx) + Math.abs(B.vy) + Math.abs(B.vw) > 4) still = false
        })
        const head = bodies[s.lead], tail = bodies[1 - s.lead]
        const dist = Math.hypot(head.x - tail.x, head.y - tail.y)
        if (!s.split && s.moving && dist > Math.min(head.w, head.h) + Math.min(tail.w, tail.h) + 6) {
          s.split = true
          ;[0.3, 0.55, 0.8].forEach((t, j) =>
            s.sats.push({
              x: tail.x + (head.x - tail.x) * t + (Math.random() - 0.5) * 20,
              y: tail.y + (head.y - tail.y) * t + (Math.random() - 0.5) * 10,
              vx: (head.vx + tail.vx) * 0.3,
              vy: (head.vy + tail.vy) * 0.3,
              r: 7.5 - j * 1.2 + Math.random() * 1.5,
              k: 60 + Math.random() * 70,
            })
          )
        }
        s.sats = s.sats.filter((d) => {
          d.vx += (d.k * (head.x - d.x) - 9 * d.vx) * dt
          d.vy += (d.k * (head.y - d.y) - 9 * d.vy) * dt
          d.x += d.vx * dt
          d.y += d.vy * dt
          if (Math.abs(head.x - d.x) < head.w * 0.8 && Math.abs(head.y - d.y) < head.h * 0.9) d.r -= dt * 30
          return d.r > 0.6
        })
        if (s.sats.length) still = false
      }
      if (s.moving && still) {
        s.moving = false
        if (!s.reduce) s.rips.push({ x: T.x, y: T.y, age: 0, amp: s.split ? 1 : 0.5 })
      }
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
      const busy = s.moving || s.rips.length || s.sats.length || s.mouse.s > 0.01
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
        cv.width = Math.round(W * dpr)
        cv.height = Math.round(Hc * dpr)
        cv.style.width = `${W}px`
        cv.style.height = `${Hc}px`
      }
    }
    loop()
  }, [panelRef, canvasRef, loop])

  React.useEffect(() => {
    const s = st.current
    s.reduce = !!(typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    const cv = canvasRef.current
    s.glc = cv ? initGL(cv) : null
    if (!s.glc) setGl(false)
    const lost = (e: Event) => {
      e.preventDefault()
      s.glc = null
      setGl(false)
    }
    cv?.addEventListener("webglcontextlost", lost)
    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting
      if (s.visible) loop()
    })
    const ro = new ResizeObserver(() => resize())
    if (panelRef.current) {
      io.observe(panelRef.current)
      ro.observe(panelRef.current)
    }
    resize()
    return () => {
      cv?.removeEventListener("webglcontextlost", lost)
      io.disconnect()
      ro.disconnect()
      cancelAnimationFrame(s.raf)
      s.raf = 0
    }
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

  const ripple = React.useCallback((x: number, y: number, amp = 1.0) => {
    const s = st.current
    if (s.reduce) return
    s.rips.push({ x, y, age: 0, amp })
    loop()
  }, [loop])

  const shake = React.useCallback(() => {
    const s = st.current
    if (s.reduce) return
    const head = s.lead === 0 ? s.a : s.b
    head.vx += 420
    head.vw -= 160
    s.moving = true
    loop()
  }, [loop])

  const setBlue = React.useCallback((v: number) => {
    st.current.blueT = v
    loop()
  }, [loop])

  return { gl, flow, ripple, shake, setBlue, loop }
}

/* ===================== STYLES ===================== */

const LA_CSS = `
.nimbus-auth{--p-fg:#0B132B;--p-soft:rgba(11,19,43,.6);--p-faint:rgba(11,19,43,.42);--p-line:rgba(11,19,43,.1);
  --p-tint:rgba(255,255,255,.18);--p-rim:rgba(255,255,255,.72);--p-err:#E5484D;--p-accent:#00A2FF;
  position:relative;box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:100%;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  color:var(--p-fg);-webkit-tap-highlight-color:transparent}

.nimbus-auth[data-tone="dark"]{--p-fg:#F1F7FF;--p-soft:rgba(241,247,255,.66);--p-faint:rgba(241,247,255,.45);
  --p-line:rgba(241,247,255,.12);--p-tint:rgba(10,18,40,.3);--p-rim:rgba(255,255,255,.3)}
.nimbus-auth[data-tone="midnight"]{--p-fg:#FFFFFF;--p-soft:rgba(255,255,255,.68);--p-faint:rgba(255,255,255,.45);
  --p-line:rgba(255,255,255,.1);--p-tint:rgba(4,7,16,.65);--p-rim:rgba(0,210,255,.5);--p-accent:#00E5FF}
.nimbus-auth[data-tone="aurora"]{--p-fg:#F0FDF4;--p-soft:rgba(240,253,244,.72);--p-faint:rgba(240,253,244,.48);
  --p-line:rgba(52,211,153,.15);--p-tint:rgba(12,28,42,.6);--p-rim:rgba(52,211,153,.55);--p-accent:#10B981}
.nimbus-auth[data-tone="sunset"]{--p-fg:#FFFBEB;--p-soft:rgba(254,243,199,.75);--p-faint:rgba(254,243,199,.48);
  --p-line:rgba(251,191,36,.15);--p-tint:rgba(38,18,8,.6);--p-rim:rgba(251,191,36,.55);--p-accent:#F59E0B}
.nimbus-auth[data-tone="rose"]{--p-fg:#FFF1F2;--p-soft:rgba(255,228,230,.75);--p-faint:rgba(255,228,230,.48);
  --p-line:rgba(244,63,94,.15);--p-tint:rgba(40,12,28,.6);--p-rim:rgba(244,63,94,.55);--p-accent:#F43F5E}
.nimbus-auth[data-tone="emerald"]{--p-fg:#ECFDF5;--p-soft:rgba(209,250,229,.75);--p-faint:rgba(209,250,229,.48);
  --p-line:rgba(16,185,129,.15);--p-tint:rgba(6,32,24,.6);--p-rim:rgba(16,185,129,.55);--p-accent:#10B981}

.nimbus-auth *{box-sizing:border-box}

/* Clean Checkout-style panel */
.la-panel{position:relative;isolation:isolate;width:380px;max-width:100%;padding:26px 24px 22px;border-radius:28px}
.la-glass{position:absolute;inset:0;border-radius:inherit;z-index:-2;background:var(--p-tint);
  -webkit-backdrop-filter:blur(14px) saturate(1.2) brightness(1.06);backdrop-filter:blur(14px) saturate(1.2) brightness(1.06);
  box-shadow:inset 0 1px 1px var(--p-rim),inset 0 0 0 1px rgba(255,255,255,.2),0 22px 50px -24px rgba(0,40,90,.55),0 2px 6px rgba(0,40,90,.08)}
.nimbus-auth[data-tone="dark"] .la-glass,.nimbus-auth[data-tone="midnight"] .la-glass{
  box-shadow:inset 0 1px 1px var(--p-rim),inset 0 0 0 1px rgba(255,255,255,.1),0 22px 50px -24px rgba(0,0,0,.7)}

/* Water canvas on panel */
.la-water{position:absolute;left:-${PAD}px;top:-${PAD}px;z-index:-1;pointer-events:none}
.nimbus-auth[data-gl="off"] .la-water{display:none}

/* Header */
.la-head{display:flex;flex-direction:column;gap:4px;margin-bottom:18px}
.la-title{font-size:20px;font-weight:650;letter-spacing:-.02em;margin:0;line-height:1.2}
.la-sub{font-size:13px;font-weight:480;color:var(--p-soft);margin:0}

/* Mode Tabs */
.la-tabs{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:3px;margin-bottom:18px;border-radius:14px;
  background:rgba(255,255,255,.1);box-shadow:inset 0 0 0 1px var(--p-line)}
.nimbus-auth[data-tone="dark"] .la-tabs{background:rgba(255,255,255,.04)}
.la-tab{all:unset;padding:8px 12px;border-radius:11px;font-size:13px;font-weight:600;color:var(--p-soft);
  text-align:center;cursor:pointer;transition:color .2s,background .2s;user-select:none}
.la-tab[data-active="true"]{color:var(--p-fg);background:rgba(255,255,255,.2);box-shadow:0 1px 3px rgba(0,0,0,.08)}
.nimbus-auth[data-tone="dark"] .la-tab[data-active="true"]{background:rgba(255,255,255,.09)}
.la-tab:focus-visible{outline:2px solid var(--p-accent);outline-offset:-1px}

/* OAuth grid */
.la-oauth{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}
.la-oauth-btn{width:100%!important;height:40px!important;font-size:12.5px!important}

/* Divider with LiquidSeparator */
.la-div{position:relative;display:flex;align-items:center;justify-content:center;margin:16px 0}
.la-div-tag{position:absolute;z-index:1;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:550;
  color:var(--p-faint);background:var(--p-tint);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);
  box-shadow:inset 0 0 0 1px var(--p-line)}

/* 3D Rotating Credentials Container */
.la-flip-scene{position:relative;perspective:1200px;width:100%;transition:height .55s cubic-bezier(.25,1,.35,1)}
.la-flipper{position:relative;width:100%;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;
  transition:transform .65s cubic-bezier(.25,1.2,.35,1)}
.la-flipper[data-flipped="true"]{transform:rotateY(180deg)}

.la-face{width:100%;-webkit-backface-visibility:hidden;backface-visibility:hidden}
.la-front{position:relative}
.la-back{position:absolute;top:0;left:0;right:0;transform:rotateY(180deg)}
.la-flipper[data-flipped="true"] .la-front{pointer-events:none}
.la-flipper[data-flipped="false"] .la-back{pointer-events:none}

/* Form layout */
.la-form{display:flex;flex-direction:column;gap:12px}
.la-input-wrap{position:relative;width:100%}

.la-toggle{all:unset;cursor:pointer;color:var(--p-soft);display:grid;place-items:center;
  width:20px;height:20px;border-radius:4px;transition:color .2s}
.la-toggle:hover{color:var(--p-fg)}
.la-toggle:focus-visible{outline:2px solid var(--p-accent)}

/* Password strength */
.la-strength{display:flex;align-items:center;gap:6px;margin-top:2px}
.la-strength-bars{display:flex;gap:4px;flex:1}
.la-strength-bar{height:3px;border-radius:2px;flex:1;background:var(--p-line);transition:background .3s}
.la-strength-bar[data-lvl="1"]{background:#EF4444}
.la-strength-bar[data-lvl="2"]{background:#F59E0B}
.la-strength-bar[data-lvl="3"]{background:#10B981}
.la-strength-text{font-size:11px;font-weight:600;color:var(--p-faint);text-transform:capitalize}

/* Options / Checkbox */
.la-options{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;color:var(--p-soft);margin-top:2px}
.la-check-wrap{display:inline-flex;align-items:center;gap:8px;cursor:pointer;user-select:none}
.la-check-label{font-size:12.5px;color:var(--p-soft);cursor:pointer}
.la-link{all:unset;cursor:pointer;color:var(--p-accent);font-weight:600;transition:opacity .2s}
.la-link:hover{opacity:.8}
.la-link:focus-visible{outline:2px solid var(--p-accent);border-radius:3px}

/* Error banner */
.la-err{min-height:16px;font-size:12px;color:var(--p-err);margin-top:2px}

/* Submit Button */
.la-submit-btn{width:100%!important;margin-top:8px!important}

/* Footer */
.la-foot{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:16px;font-size:12px;color:var(--p-faint)}
.la-foot-link{all:unset;cursor:pointer;color:var(--p-accent);font-weight:600;transition:opacity .2s}
.la-foot-link:hover{opacity:.8}
.la-foot-link:focus-visible{outline:2px solid var(--p-accent);border-radius:3px}

@media (prefers-reduced-motion:reduce){
  .la-flip-scene{transition:none}
  .la-flipper{transition:none}
}
`

/* ===================== COMPONENT ===================== */

export function LiquidAuth({
  mode: controlledMode,
  defaultMode = "login",
  onModeChange,
  tone = "light",
  onLogin,
  onSignUp,
  onOAuth,
  onForgotPassword,
  providers = DEFAULT_PROVIDERS,
  sound = false,
  title,
  subtitle,
  className = "",
  style,
}: LiquidAuthProps) {
  const [internalMode, setInternalMode] = React.useState<AuthMode>(defaultMode)
  const isControlled = controlledMode !== undefined
  const currentMode = isControlled ? controlledMode : internalMode

  // Form states
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [name, setName] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [agree, setAgree] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [focus, setFocus] = React.useState<string>("email")

  // Feedback states
  const [phase, setPhase] = React.useState<AuthPhase>("edit")
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [serverError, setServerError] = React.useState("")

  // DOM Refs
  const panelRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const payRef = React.useRef<HTMLButtonElement>(null)
  const boxRefs = React.useRef<Record<string, HTMLElement | null>>({})
  const frontRef = React.useRef<HTMLDivElement>(null)
  const backRef = React.useRef<HTMLDivElement>(null)
  const progRef = React.useRef({ p: 0, raf: 0 })
  const uid = React.useId().replace(/:/g, "")

  // Dynamic height of credentials container
  const [frontH, setFrontH] = React.useState<number | undefined>(undefined)
  const [backH, setBackH] = React.useState<number | undefined>(undefined)

  React.useLayoutEffect(() => {
    if (frontRef.current) setFrontH(frontRef.current.offsetHeight)
    if (backRef.current) setBackH(backRef.current.offsetHeight)
  }, [errors, password, currentMode])

  // Where the water drop should flow
  const getTarget = React.useCallback((): Target | null => {
    const panel = panelRef.current
    if (!panel) return null
    const pr = panel.getBoundingClientRect()
    const rel = (el: Element | null, r: number | "pill", grow = 2): Target | null => {
      if (!el) return null
      const targetEl = el.querySelector(".ni-basin") || el
      const b = targetEl.getBoundingClientRect()
      if (b.width === 0 || b.height === 0) return null
      const h = b.height / 2 + grow
      return {
        x: PAD + b.left - pr.left + b.width / 2,
        y: PAD + b.top - pr.top + b.height / 2,
        w: b.width / 2 + grow,
        h,
        r: r === "pill" ? h : r,
      }
    }

    if (phase === "processing" || phase === "success") {
      const btn = payRef.current
      if (!btn) return null
      const b = btn.getBoundingClientRect()
      const hh = b.height / 2
      if (phase === "success") {
        const rr = hh * 0.92 // water gathers into one round droplet with checkmark
        return {
          x: PAD + b.left - pr.left + b.width / 2,
          y: PAD + b.top - pr.top + hh,
          w: rr,
          h: rr,
          r: rr,
        }
      }
      const p = progRef.current.p
      const w = Math.max(hh, (b.width / 2) * p)
      return {
        x: PAD + b.left - pr.left + w,
        y: PAD + b.top - pr.top + hh,
        w,
        h: hh,
        r: hh,
      }
    }

    const activeBox = boxRefs.current[focus] ?? (currentMode === "login" ? boxRefs.current.email : boxRefs.current.name)
    return rel(activeBox, 14, 2)
  }, [phase, focus, currentMode])

  const water = useWater(panelRef, canvasRef, getTarget, tone)

  // Fluid water drop follows focus / phase
  const prevKey = React.useRef("")
  React.useEffect(() => {
    const key = `${currentMode}:${phase}:${focus}`
    if (prevKey.current && prevKey.current !== key) {
      water.flow(phase === "processing" ? 140 : 90)
    }
    prevKey.current = key
  }, [currentMode, phase, focus, water])

  React.useEffect(() => {
    water.loop()
  }, [email, password, name, confirmPassword, errors, serverError, water])

  // Progress animation for liquid fill into submit button
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
      else {
        P.raf = 0
        done?.()
      }
    }
    P.raf = requestAnimationFrame(tick)
  }

  // Mode change handler with 3D rotation
  const setMode = (newMode: AuthMode) => {
    if (newMode === currentMode) return
    setServerError("")
    setErrors({})
    if (!isControlled) setInternalMode(newMode)
    onModeChange?.(newMode)
    const nextFocus = newMode === "login" ? "email" : "name"
    setFocus(nextFocus)
    setTimeout(() => water.flow(110), 80)
  }

  // Password strength
  const pwStrength = React.useMemo(() => {
    if (!password) return 0
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) s++
    return s
  }, [password])

  // Handle OAuth provider clicks using LiquidButton
  const handleOAuth = async (providerId: string, e: React.MouseEvent) => {
    e.preventDefault()
    setServerError("")
    try {
      await onOAuth?.(providerId)
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "OAuth failed")
      water.shake()
    }
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError("")
    const newErr: Record<string, string> = {}

    if (currentMode === "login") {
      if (!email.trim()) newErr.email = "Email is required"
      if (!password) newErr.password = "Password is required"
      if (Object.keys(newErr).length > 0) {
        setErrors(newErr)
        water.shake()
        return
      }
    } else {
      if (!name.trim()) newErr.name = "Name is required"
      if (!email.trim()) newErr.email = "Email is required"
      if (!password) newErr.password = "Password is required"
      if (password !== confirmPassword) newErr.confirmPassword = "Passwords do not match"
      if (!agree) newErr.agree = "You must agree to the terms"
      if (Object.keys(newErr).length > 0) {
        setErrors(newErr)
        water.shake()
        return
      }
    }

    setPhase("processing")
    water.setBlue(1)
    runProgress(1, 950)

    try {
      if (currentMode === "login") {
        await (onLogin ? onLogin({ email, password, remember }) : new Promise((r) => setTimeout(r, 1000)))
      } else {
        await (onSignUp ? onSignUp({ name, email, password, agree }) : new Promise((r) => setTimeout(r, 1000)))
      }
      setPhase("success")
      const btn = payRef.current
      if (btn && panelRef.current) {
        const b = btn.getBoundingClientRect()
        const pr = panelRef.current.getBoundingClientRect()
        water.ripple(PAD + b.left - pr.left + b.width / 2, PAD + b.top - pr.top + b.height / 2, 1.2)
      }
      setTimeout(() => {
        setPhase("edit")
        water.setBlue(0)
        progRef.current.p = 0
        water.flow(100)
      }, 2600)
    } catch (err: unknown) {
      setPhase("edit")
      water.setBlue(0)
      progRef.current.p = 0
      water.shake()
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    }
  }

  const busy = phase === "processing" || phase === "success"
  const currentSceneHeight = currentMode === "login" ? frontH : backH
  const componentTone = tone === "light" ? "light" : "dark"
  const checkboxTone: CheckboxTone =
    tone === "midnight" ? "midnight" : tone === "aurora" ? "aurora" : tone === "sunset" ? "sunset" : tone === "rose" ? "rose" : tone === "emerald" ? "emerald" : tone === "dark" ? "dark" : "light"

  return (
    <div
      className={`nimbus-auth ${className}`}
      data-tone={tone}
      data-gl={water.gl ? "on" : "off"}
      style={style}
    >
      <style dangerouslySetInnerHTML={{ __html: LA_CSS }} />

      <div ref={panelRef} className="la-panel">
        <span className="la-glass" aria-hidden="true" />
        <canvas className="la-water" ref={canvasRef} aria-hidden="true" />

        {/* Head */}
        <div className="la-head">
          <h3 className="la-title">{title ?? (currentMode === "login" ? "Welcome back" : "Create an account")}</h3>
          <p className="la-sub">{subtitle ?? (currentMode === "login" ? "Enter your credentials to access your account" : "Sign up in seconds to get started")}</p>
        </div>

        {/* Mode switcher tabs */}
        <div className="la-tabs" role="tablist" aria-label="Auth Mode">
          <button
            type="button"
            role="tab"
            aria-selected={currentMode === "login"}
            data-active={currentMode === "login"}
            className="la-tab"
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={currentMode === "signup"}
            data-active={currentMode === "signup"}
            className="la-tab"
            onClick={() => setMode("signup")}
          >
            Create account
          </button>
        </div>

        {/* OAuth Buttons Composed with LiquidButton */}
        {providers.length > 0 && (
          <div className="la-oauth">
            {providers.map((p) => (
              <LiquidButton
                key={p.id}
                type="button"
                variant="glass"
                shape="rounded"
                tone={componentTone}
                sound={sound}
                className="la-oauth-btn"
                aria-label={`Sign in with ${p.name}`}
                icon={p.icon}
                onClick={(e) => handleOAuth(p.id, e)}
              >
                {p.name}
              </LiquidButton>
            ))}
          </div>
        )}

        {/* Reusable LiquidSeparator Divider */}
        {providers.length > 0 && (
          <div className="la-div">
            <LiquidSeparator orientation="horizontal" tone={componentTone} />
            <span className="la-div-tag">or continue with email</span>
          </div>
        )}

        {/* 3D Rotating Credentials Container */}
        <div
          className="la-flip-scene"
          style={{ height: currentSceneHeight ? `${currentSceneHeight}px` : undefined }}
        >
          <div className="la-flipper" data-flipped={currentMode === "signup"}>
            {/* FRONT FACE: Sign In Credentials */}
            <div
              ref={frontRef}
              className="la-face la-front"
              aria-hidden={currentMode !== "login"}
            >
              <form className="la-form" noValidate onSubmit={handleSubmit}>
                <div
                  ref={(el) => {
                    boxRefs.current.email = el
                  }}
                  className="la-input-wrap"
                >
                  <LiquidInput
                    id={`${uid}-email`}
                    label="Email address"
                    type="email"
                    placeholder="alex@nimbus.glass"
                    value={email}
                    disabled={busy || currentMode !== "login"}
                    tone={componentTone}
                    sound={sound}
                    disableWater={true}
                    error={currentMode === "login" ? errors.email : undefined}
                    onFocus={() => {
                      setFocus("email")
                      water.flow(90)
                    }}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setErrors((x) => ({ ...x, email: "" }))
                    }}
                    autoComplete="email"
                  />
                </div>

                <div
                  ref={(el) => {
                    boxRefs.current.password = el
                  }}
                  className="la-input-wrap"
                >
                  <LiquidInput
                    id={`${uid}-password`}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    disabled={busy || currentMode !== "login"}
                    tone={componentTone}
                    sound={sound}
                    disableWater={true}
                    error={currentMode === "login" ? errors.password : undefined}
                    onFocus={() => {
                      setFocus("password")
                      water.flow(90)
                    }}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setErrors((x) => ({ ...x, password: "" }))
                    }}
                    autoComplete="current-password"
                    rightIcon={
                      <button
                        type="button"
                        className="la-toggle"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        <EyeIcon show={showPassword} />
                      </button>
                    }
                  />
                </div>

                <div className="la-options">
                  <label className="la-check-wrap">
                    <LiquidCheckbox
                      id={`${uid}-remember`}
                      checked={remember}
                      tone={checkboxTone}
                      sound={sound}
                      onCheckedChange={(checked) => setRemember(checked)}
                    />
                    <span className="la-check-label">Remember me</span>
                  </label>

                  {onForgotPassword && (
                    <button
                      type="button"
                      className="la-link"
                      onClick={onForgotPassword}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                {serverError && <div className="la-err" role="alert" style={{ textAlign: "center" }}>{serverError}</div>}

                <LiquidButton
                  ref={payRef}
                  type="submit"
                  variant="checkout"
                  shape="pill"
                  size="lg"
                  tone={componentTone}
                  sound={sound}
                  disableWater={true}
                  loading={phase === "processing"}
                  loadingText="Processing"
                  success={phase === "success"}
                  aria-label="Sign in to your account"
                  className="la-submit-btn"
                  disabled={busy}
                >
                  Sign in
                </LiquidButton>
              </form>
            </div>

            {/* BACK FACE: Sign Up Credentials */}
            <div
              ref={backRef}
              className="la-face la-back"
              aria-hidden={currentMode !== "signup"}
            >
              <form className="la-form" noValidate onSubmit={handleSubmit}>
                <div
                  ref={(el) => {
                    boxRefs.current.name = el
                  }}
                  className="la-input-wrap"
                >
                  <LiquidInput
                    id={`${uid}-name`}
                    label="Full name"
                    type="text"
                    placeholder="Alex Rivera"
                    value={name}
                    disabled={busy || currentMode !== "signup"}
                    tone={componentTone}
                    sound={sound}
                    disableWater={true}
                    error={currentMode === "signup" ? errors.name : undefined}
                    onFocus={() => {
                      setFocus("name")
                      water.flow(90)
                    }}
                    onChange={(e) => {
                      setName(e.target.value)
                      setErrors((x) => ({ ...x, name: "" }))
                    }}
                    autoComplete="name"
                  />
                </div>

                <div
                  ref={(el) => {
                    boxRefs.current["signup-email"] = el
                  }}
                  className="la-input-wrap"
                >
                  <LiquidInput
                    id={`${uid}-signup-email`}
                    label="Account email"
                    type="email"
                    placeholder="alex@nimbus.glass"
                    value={email}
                    disabled={busy || currentMode !== "signup"}
                    tone={componentTone}
                    sound={sound}
                    disableWater={true}
                    error={currentMode === "signup" ? errors.email : undefined}
                    onFocus={() => {
                      setFocus("signup-email")
                      water.flow(90)
                    }}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setErrors((x) => ({ ...x, email: "" }))
                    }}
                    autoComplete="email"
                  />
                </div>

                <div
                  ref={(el) => {
                    boxRefs.current["signup-password"] = el
                  }}
                  className="la-input-wrap"
                >
                  <LiquidInput
                    id={`${uid}-signup-password`}
                    label="Create password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    disabled={busy || currentMode !== "signup"}
                    tone={componentTone}
                    sound={sound}
                    disableWater={true}
                    error={currentMode === "signup" ? errors.password : undefined}
                    onFocus={() => {
                      setFocus("signup-password")
                      water.flow(90)
                    }}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setErrors((x) => ({ ...x, password: "" }))
                    }}
                    autoComplete="new-password"
                    rightIcon={
                      <button
                        type="button"
                        className="la-toggle"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        <EyeIcon show={showPassword} />
                      </button>
                    }
                  />

                  {password.length > 0 && (
                    <div className="la-strength" aria-live="polite">
                      <div className="la-strength-bars">
                        <span className="la-strength-bar" data-lvl={pwStrength >= 1 ? 1 : 0} />
                        <span className="la-strength-bar" data-lvl={pwStrength >= 2 ? 2 : 0} />
                        <span className="la-strength-bar" data-lvl={pwStrength >= 3 ? 3 : 0} />
                      </div>
                      <span className="la-strength-text">
                        {pwStrength === 0 ? "Weak" : pwStrength === 1 ? "Fair" : pwStrength === 2 ? "Good" : "Strong"}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  ref={(el) => {
                    boxRefs.current.confirm = el
                  }}
                  className="la-input-wrap"
                >
                  <LiquidInput
                    id={`${uid}-confirm`}
                    label="Confirm password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    disabled={busy || currentMode !== "signup"}
                    tone={componentTone}
                    sound={sound}
                    disableWater={true}
                    error={currentMode === "signup" ? errors.confirmPassword : undefined}
                    onFocus={() => {
                      setFocus("confirm")
                      water.flow(90)
                    }}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setErrors((x) => ({ ...x, confirmPassword: "" }))
                    }}
                    autoComplete="new-password"
                  />
                </div>

                <div className="la-options">
                  <label className="la-check-wrap">
                    <LiquidCheckbox
                      id={`${uid}-agree`}
                      checked={agree}
                      tone={checkboxTone}
                      sound={sound}
                      onCheckedChange={(checked) => setAgree(checked)}
                    />
                    <span className="la-check-label">I agree to terms & privacy</span>
                  </label>
                  {errors.agree && <span className="la-err">{errors.agree}</span>}
                </div>

                {serverError && <div className="la-err" role="alert" style={{ textAlign: "center" }}>{serverError}</div>}

                <LiquidButton
                  ref={payRef}
                  type="submit"
                  variant="checkout"
                  shape="pill"
                  size="lg"
                  tone={componentTone}
                  sound={sound}
                  disableWater={true}
                  loading={phase === "processing"}
                  loadingText="Processing"
                  success={phase === "success"}
                  aria-label="Create your account"
                  className="la-submit-btn"
                  disabled={busy}
                >
                  Create account
                </LiquidButton>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="la-foot">
          <span>{currentMode === "login" ? "Don't have an account?" : "Already have an account?"}</span>
          <button
            type="button"
            className="la-foot-link"
            onClick={() => setMode(currentMode === "login" ? "signup" : "login")}
          >
            {currentMode === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  )
}

export { LiquidAuth as AuthCard }
export default LiquidAuth

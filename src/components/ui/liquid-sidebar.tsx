"use client"

/**
 * Nimbus UI · Liquid Sidebar — "Aqueduct"
 * A vertical glass panel housing navigational channels. An active water pool glides
 * smoothly between menu items with spring physics (Euler integration), stretching on rapid
 * navigation, separating into satellite droplets on long jumps, and producing gentle ripples.
 * Provides both standalone config usage and shadcn-style composable subcomponents:
 * (SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarMenu, etc.)
 * Uses the canonical Nimbus WebGL water shader with pure-CSS fallback.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"
import { useLiquidContext } from "./liquid/provider"

export type LiquidSidebarItem = {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  href?: string
  disabled?: boolean
  onClick?: () => void
}

export type LiquidSidebarGroup = {
  title?: string
  items: LiquidSidebarItem[]
}

export type LiquidSidebarProps = React.HTMLAttributes<HTMLElement> & {
  groups?: LiquidSidebarGroup[]
  items?: LiquidSidebarItem[]
  activeId?: string
  defaultActiveId?: string
  onSelect?: (id: string, item: LiquidSidebarItem) => void
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  collapsible?: boolean
  tone?: "light" | "dark"
  sound?: boolean
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const PAD = 14

const SB_CSS = `
.nimbus-sidebar {
  --sb-tint: rgba(255, 255, 255, 0.16);
  --sb-fg: #0B132B;
  --sb-soft: rgba(11, 19, 43, 0.65);
  --sb-line: rgba(11, 19, 43, 0.08);
  --sb-rim: rgba(255, 255, 255, 0.75);
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  isolation: isolate;
  border-radius: 24px;
  padding: 16px 12px;
  user-select: none;
  font-family: ui-sans-serif, -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
  color: var(--sb-fg);
  transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease;
}

.nimbus-sidebar[data-tone="dark"] {
  --sb-tint: rgba(10, 18, 40, 0.32);
  --sb-fg: #F1F7FF;
  --sb-soft: rgba(241, 247, 255, 0.65);
  --sb-line: rgba(241, 247, 255, 0.1);
  --sb-rim: rgba(255, 255, 255, 0.28);
}

.sb-glass {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -2;
  overflow: hidden;
  background: var(--sb-tint);
  -webkit-backdrop-filter: blur(14px) saturate(1.2) brightness(1.06);
  backdrop-filter: blur(14px) saturate(1.2) brightness(1.06);
  box-shadow: inset 0 1px 1px var(--sb-rim), inset 0 0 0 1px rgba(255, 255, 255, 0.18), 0 18px 44px -20px rgba(0, 40, 90, 0.45), 0 2px 6px rgba(0, 40, 90, 0.08);
  pointer-events: none;
}

.nimbus-sidebar[data-tone="dark"] .sb-glass {
  box-shadow: inset 0 1px 1px var(--sb-rim), inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 18px 44px -20px rgba(0, 0, 0, 0.7);
}

.sb-water {
  position: absolute;
  left: ${-PAD}px;
  top: ${-PAD}px;
  z-index: -1;
  pointer-events: none;
}

.nimbus-sidebar[data-gl="off"] .sb-water {
  display: none;
}

.sb-drop {
  display: none;
  position: absolute;
  left: 12px;
  right: 12px;
  border-radius: 14px;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(120% 140% at 30% 0%, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0) 55%), rgba(255, 255, 255, 0.38);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -2px 6px rgba(0, 162, 255, 0.22), inset 0 0 0 1px rgba(255, 255, 255, 0.55), 0 6px 16px -6px rgba(0, 70, 140, 0.45);
}

.nimbus-sidebar[data-gl="off"] .sb-drop {
  display: block;
}

.sb-item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 14px;
  background: transparent;
  border: 0;
  color: var(--sb-fg);
  font-size: 13.5px;
  font-weight: 550;
  letter-spacing: -0.01em;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  outline: none;
  transition: transform 0.15s ease, color 0.15s ease;
}

.sb-item:hover:not([disabled]) {
  color: #00A2FF;
  transform: translateX(2px);
}

.sb-item[data-active="true"] {
  color: #0085FA;
  font-weight: 650;
}

.nimbus-sidebar[data-tone="dark"] .sb-item[data-active="true"] {
  color: #59DBFF;
}

.sb-item[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}

.sb-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sb-group-title {
  padding: 12px 14px 4px 14px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--sb-soft);
}

.sb-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  padding: 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--sb-soft);
  cursor: pointer;
  transition: all 0.15s ease;
}
.sb-collapse-btn:hover {
  background: rgba(0, 162, 255, 0.15);
  color: #00A2FF;
}

.sb-layout-container {
  display: flex;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
}

.sb-main-inset {
  flex: 1;
  padding: 24px;
  box-sizing: border-box;
  border-radius: 24px;
  margin-left: 16px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px -10px rgba(0, 40, 90, 0.1);
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
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,18.);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*240.;w+=R.w*exp(-R.z*1.7)*sin(x*.3)*exp(-x*x/700.);}}
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
    t: { cx: 0, y: 0, qw: 0, qh: 16, r: 16 },
    mouse: { x: 0, y: 0, s: 0, on: false },
    moving: false,
    split: false,
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

/* =========================================================================
 * Context for Composable shadcn-style subcomponents
 * ========================================================================= */

type SidebarContextType = {
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
  activeId: string
  setActiveId: (id: string) => void
  registerItem: (id: string, el: HTMLButtonElement | null) => void
  tone: "light" | "dark"
  sound: boolean
  playPlip: () => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider or LiquidSidebar")
  }
  return ctx
}

export type SidebarProviderProps = {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  tone?: "light" | "dark"
  sound?: boolean
  className?: string
  style?: React.CSSProperties
}

export function SidebarProvider({
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  children,
  tone = "light",
  sound = true,
  className,
  style,
}: SidebarProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const [activeId, setActiveId] = React.useState("")
  const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [controlledOpen, onOpenChange]
  )

  const toggleSidebar = React.useCallback(() => {
    setOpen(!open)
  }, [open, setOpen])

  const registerItem = React.useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) itemRefs.current.set(id, el)
    else itemRefs.current.delete(id)
  }, [])

  const playPlip = React.useCallback(() => {
    if (!sound) return
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      const aCtx = new AC()
      const t = aCtx.currentTime
      const o = aCtx.createOscillator()
      const g = aCtx.createGain()
      o.type = "sine"
      o.frequency.setValueAtTime(420 + Math.random() * 80, t)
      o.frequency.exponentialRampToValueAtTime(1400, t + 0.07)
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.14, t + 0.008)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
      o.connect(g).connect(aCtx.destination)
      o.start(t)
      o.stop(t + 0.16)
    } catch {}
  }, [sound])

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        toggleSidebar,
        activeId,
        setActiveId,
        registerItem,
        tone,
        sound,
        playPlip,
      }}
    >
      <div className={["sb-layout-container", className].filter(Boolean).join(" ")} style={style}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

/* =========================================================================
 * Main LiquidSidebar Component
 * ========================================================================= */

export const LiquidSidebar = React.forwardRef<HTMLElement, LiquidSidebarProps>(
  function LiquidSidebar(
    {
      groups,
      items,
      activeId: controlledActiveId,
      defaultActiveId,
      onSelect,
      collapsed: controlledCollapsed,
      onCollapsedChange,
      collapsible = true,
      tone: propTone,
      sound: propSound,
      header,
      footer,
      children,
      className,
      style,
      ...props
    },
    ref
  ) {
    const parentCtx = React.useContext(SidebarContext)
    const ctx = useLiquidContext()
    const tone = propTone ?? (parentCtx ? parentCtx.tone : ctx ? (ctx.tone === "midnight" || ctx.tone === "dark" ? "dark" : "light") : "light")
    const sound = propSound ?? (parentCtx ? parentCtx.sound : ctx?.sound ?? true)

    const normalizedGroups: LiquidSidebarGroup[] = React.useMemo(() => {
      if (groups && groups.length > 0) return groups
      if (items && items.length > 0) return [{ items }]
      return []
    }, [groups, items])

    const allItems = React.useMemo(() => normalizedGroups.flatMap((g) => g.items), [normalizedGroups])

    const [uncontrolledActiveId, setUncontrolledActiveId] = React.useState<string>(
      defaultActiveId ?? allItems[0]?.id ?? ""
    )
    const activeId =
      controlledActiveId !== undefined
        ? controlledActiveId
        : parentCtx?.activeId || uncontrolledActiveId

    const [uncontrolledCollapsed, setUncontrolledCollapsed] = React.useState(false)
    const collapsed =
      controlledCollapsed !== undefined
        ? controlledCollapsed
        : parentCtx
        ? !parentCtx.open
        : uncontrolledCollapsed

    const navRef = React.useRef<HTMLElement | null>(null)
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const dropRef = React.useRef<HTMLSpanElement | null>(null)
    const localItemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())
    const st = React.useRef(makeState())
    const [gl, setGl] = React.useState<"on" | "off">("on")

    const dark = tone === "dark" ? 1 : 0
    const darkRef = React.useRef(dark)
    darkRef.current = dark

    const playPlipAudio = React.useCallback(() => {
      if (!sound) return
      try {
        const AC = window.AudioContext || (window as any).webkitAudioContext
        const aCtx = new AC()
        const t = aCtx.currentTime
        const o = aCtx.createOscillator()
        const g = aCtx.createGain()
        o.type = "sine"
        o.frequency.setValueAtTime(420 + Math.random() * 80, t)
        o.frequency.exponentialRampToValueAtTime(1400, t + 0.07)
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
      const sep = Math.abs(s.a.y - s.b.y)
      const thin = Math.min(sep / (2 * (T.qh + T.r) || 1), 1)
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
        blobs.set([T.cx, head.y, T.qw, T.qh, T.cx, tail.y, T.qw * (1 - 0.2 * thin), T.qh * (1 - 0.2 * thin)], 0)
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
        const top = Math.min(s.a.y, s.b.y) - T.qh - PAD
        const height = sep + 2 * T.qh
        dropRef.current.style.top = `${top}px`
        dropRef.current.style.height = `${height}px`
      }
    }, [])

    const step = React.useCallback((dt: number, now: number) => {
      const s = st.current
      const T = s.t
      s.time += dt
      const bodies = [s.a, s.b]
      let still = true
      if (s.reduce) {
        s.a.y = s.b.y = T.y; s.a.v = s.b.v = 0; s.sx.s = 1; s.sats = []
      } else {
        bodies.forEach((B, i) => {
          const lead = i === s.lead
          const k = lead ? 220 : 75
          const c = lead ? 26 : 14
          const f = !lead && now < s.lagFrom ? 0.08 : 1
          B.v += (k * (T.y - B.y) - c * B.v) * dt * f
          B.y += B.v * dt
          const lo = PAD + 8 + T.qh + T.r - 2, hi = PAD + s.h - 8 - T.qh - T.r + 2
          if (B.y < lo || B.y > hi) {
            s.sx.v -= Math.min(Math.abs(B.v), 900) * 0.0016
            B.y = Math.max(lo, Math.min(hi, B.y))
            B.v *= -0.25
          }
          if (Math.abs(T.y - B.y) > 0.3 || Math.abs(B.v) > 3) still = false
        })
        const L = bodies[s.lead]
        const sxT = 1 - 0.2 * Math.min(Math.abs(L.v) / 1400, 1)
        s.sx.v += (280 * (sxT - s.sx.s) - 9 * s.sx.v) * dt
        s.sx.s += s.sx.v * dt
        if (Math.abs(s.sx.s - 1) > 0.002 || Math.abs(s.sx.v) > 0.02) still = false

        const sep = Math.abs(s.a.y - s.b.y)
        const r = T.r * (1 - 0.3 * Math.min(sep / (2 * (T.qh + T.r) || 1), 1))
        if (!s.split && s.moving && sep - 2 * T.qh - 2 * r > -4) {
          s.split = true
          const lo = bodies[1 - s.lead], hi = bodies[s.lead]
          ;[0.32, 0.52, 0.72].forEach((t, j) => {
            s.sats.push({
              x: T.cx + (Math.random() - 0.5) * 8,
              y: lo.y + (hi.y - lo.y) * t + (Math.random() - 0.5) * 6,
              vx: (Math.random() - 0.5) * 50,
              vy: (lo.v + hi.v) * 0.45,
              r: 4.5 + Math.random() * 2.5 - j * 0.4,
              k: 75 + Math.random() * 85,
            })
          })
        }
        s.sats = s.sats.filter((d) => {
          d.vx += (80 * (T.cx - d.x) - 7 * d.vx) * dt
          d.vy += (d.k * (T.y - d.y) - 9 * d.vy) * dt
          d.x += d.vx * dt
          d.y += d.vy * dt
          d.x = Math.max(PAD + 10 + d.r, Math.min(PAD + s.w - 10 - d.r, d.x))
          d.y = Math.max(PAD + 10 + d.r, Math.min(PAD + s.h - 10 - d.r, d.y))
          if (Math.abs(T.y - d.y) < T.qh + T.r * 0.5) d.r -= dt * 26
          return d.r > 0.6
        })
        if (s.sats.length) still = false
      }
      if (s.moving && still) {
        s.moving = false
        if (s.split || !s.reduce) s.rips.push({ x: T.cx, y: T.y, age: 0, amp: s.split ? 1.2 : 0.7 })
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
      const el = localItemRefs.current.get(activeId)
      if (!nav || !el) return
      const s = st.current
      s.w = nav.offsetWidth
      s.h = nav.offsetHeight
      const navRect = nav.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const T = s.t
      const r = 10
      T.r = r
      T.qw = Math.max(0, elRect.width / 2)
      T.qh = Math.max(0, elRect.height / 2)
      T.cx = PAD + (elRect.left - navRect.left) + elRect.width / 2
      const ny = PAD + (elRect.top - navRect.top) + elRect.height / 2
      if (!s.ready) {
        s.a.y = s.b.y = ny
        s.ready = true
      } else if (Math.abs(ny - T.y) > 0.5) {
        s.lead = Math.abs(ny - s.a.y) <= Math.abs(ny - s.b.y) ? 0 : 1
        s.lagFrom = performance.now() + 70
        s.moving = true
        s.split = false
      }
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
    }, [activeId, loop])

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

    React.useLayoutEffect(() => { measure() }, [measure, collapsed, allItems.length])

    const ripple = (x: number, y: number, amp: number) => {
      const s = st.current
      if (s.reduce) return
      s.rips.push({ x, y, age: 0, amp })
      loop()
    }

    const handleSelect = (item: LiquidSidebarItem) => {
      if (item.disabled) return
      playPlipAudio()
      if (parentCtx) parentCtx.setActiveId(item.id)
      if (controlledActiveId === undefined) setUncontrolledActiveId(item.id)
      onSelect?.(item.id, item)
      item.onClick?.()
    }

    const toggleCollapse = () => {
      playPlipAudio()
      const next = !collapsed
      if (parentCtx) parentCtx.setOpen(!next)
      if (controlledCollapsed === undefined) setUncontrolledCollapsed(next)
      onCollapsedChange?.(next)
    }

    return (
      <aside
        ref={(node) => {
          navRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node
        }}
        className={["nimbus-sidebar", className].filter(Boolean).join(" ")}
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
        style={{
          width: collapsed ? 74 : 260,
          ...style,
        }}
        {...props}
      >
        <style dangerouslySetInnerHTML={{ __html: SB_CSS }} />
        <span className="sb-glass" aria-hidden="true" />
        <canvas className="sb-water" ref={canvasRef} aria-hidden="true" />
        <span className="sb-drop" ref={dropRef} aria-hidden="true" />

        {header && (
          <div style={{ marginBottom: 12, padding: "0 6px" }}>
            {header}
          </div>
        )}

        {children ? (
          children
        ) : (
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {normalizedGroups.map((group, gIdx) => (
              <div key={group.title ?? gIdx} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {!collapsed && group.title && (
                  <div className="sb-group-title">{group.title}</div>
                )}
                {group.items.map((item) => {
                  const isActive = item.id === activeId
                  return (
                    <button
                      key={item.id}
                      ref={(el) => {
                        if (el) localItemRefs.current.set(item.id, el)
                        else localItemRefs.current.delete(item.id)
                      }}
                      type="button"
                      className="sb-item"
                      data-active={isActive}
                      disabled={item.disabled}
                      onClick={() => handleSelect(item)}
                      title={collapsed ? item.label : undefined}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.icon && <span className="sb-icon">{item.icon}</span>}
                      {!collapsed && <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
                      {!collapsed && item.badge && <span>{item.badge}</span>}
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>
        )}

        {collapsible && (
          <button
            type="button"
            className="sb-collapse-btn"
            onClick={toggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {collapsed ? (
                <path d="m9 18 6-6-6-6" />
              ) : (
                <path d="m15 18-6-6 6-6" />
              )}
            </svg>
          </button>
        )}

        {footer && (
          <div style={{ marginTop: 12, padding: "0 6px" }}>
            {footer}
          </div>
        )}
      </aside>
    )
  }
)

LiquidSidebar.displayName = "LiquidSidebar"

/* =========================================================================
 * Composable Subcomponents (shadcn API matching)
 * ========================================================================= */

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarHeader({ className, style, ...props }, ref) {
    return <div ref={ref} style={{ marginBottom: 12, padding: "0 6px", ...style }} className={className} {...props} />
  }
)
SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarFooter({ className, style, ...props }, ref) {
    return <div ref={ref} style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--sb-line)", ...style }} className={className} {...props} />
  }
)
SidebarFooter.displayName = "SidebarFooter"

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarContent({ className, style, ...props }, ref) {
    return <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, overflowY: "auto", ...style }} className={className} {...props} />
  }
)
SidebarContent.displayName = "SidebarContent"

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarGroup({ className, style, ...props }, ref) {
    return <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 2, ...style }} className={className} {...props} />
  }
)
SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarGroupLabel({ className, style, ...props }, ref) {
    return <div ref={ref} className={["sb-group-title", className].filter(Boolean).join(" ")} style={style} {...props} />
  }
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  function SidebarMenu({ className, style, ...props }, ref) {
    return <ul ref={ref} style={{ display: "flex", flexDirection: "column", gap: 2, listStyle: "none", margin: 0, padding: 0, ...style }} className={className} {...props} />
  }
)
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  function SidebarMenuItem({ className, style, ...props }, ref) {
    return <li ref={ref} style={{ position: "relative", ...style }} className={className} {...props} />
  }
)
SidebarMenuItem.displayName = "SidebarMenuItem"

export type SidebarMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean
  id?: string
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  function SidebarMenuButton({ isActive, id, onClick, className, children, ...props }, ref) {
    const parentCtx = React.useContext(SidebarContext)
    const active = isActive ?? (id && parentCtx ? parentCtx.activeId === id : false)

    return (
      <button
        ref={(el) => {
          if (id && parentCtx) parentCtx.registerItem(id, el)
          if (typeof ref === "function") ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
        }}
        type="button"
        className={["sb-item", className].filter(Boolean).join(" ")}
        data-active={active}
        onClick={(e) => {
          if (id && parentCtx) parentCtx.setActiveId(id)
          parentCtx?.playPlip()
          onClick?.(e)
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarInset({ className, style, ...props }, ref) {
    return <div ref={ref} className={["sb-main-inset", className].filter(Boolean).join(" ")} style={style} {...props} />
  }
)
SidebarInset.displayName = "SidebarInset"

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function SidebarTrigger({ onClick, className, ...props }, ref) {
    const { toggleSidebar, open } = useSidebar()
    return (
      <button
        ref={ref}
        type="button"
        className={["sb-collapse-btn", className].filter(Boolean).join(" ")}
        onClick={(e) => {
          toggleSidebar()
          onClick?.(e)
        }}
        aria-label="Toggle Sidebar"
        {...props}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 3v18" />
          {open ? <path d="m14 9-3 3 3 3" /> : <path d="m12 9 3 3-3 3" />}
        </svg>
      </button>
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

export { LiquidSidebar as Sidebar }
export { LiquidSidebar as Component }
export default LiquidSidebar

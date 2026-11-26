"use client"

/**
 * Nimbus UI · Liquid Button — "Droplet"
 * A button carved from frosted glass holding clear, responsive water. The cursor
 * draws a smooth surface tension meniscus, pressing squashes the drop with spring
 * tension, and every click sends a crisp ripple surging through the fluid chamber.
 * When loading, water swirls with vivid caustics; on success it settles with a
 * triumphant chime and checkmark. Includes progressive enhancement with CSS fallback,
 * reduced motion support, synthesized audio plip, and full accessibility.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"
import { useLiquidContext } from "./liquid/provider"

export type LiquidButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "glass"
  | "destructive"
  | "outline"
  | "ghost"
  | "checkout"
  | "pay"

export type LiquidButtonSize = "default" | "sm" | "lg" | "icon"
export type LiquidButtonShape = "pill" | "rounded"

export type LiquidButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Button style variant */
  variant?: LiquidButtonVariant
  /** Button size */
  size?: LiquidButtonSize
  /** Corner shape: "pill" (999px) or "rounded" (12-18px) */
  shape?: LiquidButtonShape
  /** "light" for bright backgrounds, "dark" for dark ones */
  tone?: "light" | "dark"
  /** Synthesized audio feedback on click */
  sound?: boolean
  /** Disable click ripple */
  disableRipple?: boolean
  /** Disable internal water canvas (useful when hosted in a unified liquid panel) */
  disableWater?: boolean
  /** Loading state with liquid vortex & spinner */
  loading?: boolean
  /** Text to display when loading */
  loadingText?: string
  /** Success state with checkmark */
  success?: boolean
  /** Optional icon before children */
  icon?: React.ReactNode
  /** Optional icon after children */
  rightIcon?: React.ReactNode
}

/* ---------- icons ---------- */
const I = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)

export const NimbusButtonIcons = {
  check: I(<path d="m5 12.5 4.5 4.5L19 7.5" />),
  spinner: (
    <svg className="nb-spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.5a9.5 9.5 0 1 0 9.5 9.5" opacity=".25" />
      <path d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5" />
    </svg>
  ),
  arrowRight: I(<><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>),
  drop: I(<path d="M12 2.8s6 6.4 6 10.7a6 6 0 0 1-12 0C6 9.2 12 2.8 12 2.8Z" />),
  sparkle: I(<path d="m12 3 2.8 5.8L21 12l-6.2 3.2L12 21l-2.8-5.8L3 12l6.2-3.2Z" />),
}

/* ---------- styles ---------- */
const NB_CSS = `
.nimbus-btn{
  --b-tint:rgba(255,255,255,.16);
  --b-fg:#0B132B;
  --b-soft:rgba(11,19,43,.64);
  --b-line:rgba(11,19,43,.08);
  --b-rim:rgba(255,255,255,.78);
  --b-shadow:rgba(0,40,90,.38);
  position:relative;display:inline-flex;align-items:center;justify-content:center;
  gap:8px;border-radius:999px;border:0;background:none;color:var(--b-fg);cursor:pointer;isolation:isolate;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;
  font-weight:600;letter-spacing:-.01em;vertical-align:middle;touch-action:manipulation;
  -webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;outline:none;
  transition:transform .2s cubic-bezier(.34,1.56,.64,1),opacity .2s ease,filter .2s ease;text-decoration:none;
}
.nimbus-btn[data-tone="dark"]{
  --b-tint:rgba(10,18,40,.32);
  --b-fg:#F1F7FF;
  --b-soft:rgba(241,247,255,.66);
  --b-line:rgba(241,247,255,.1);
  --b-rim:rgba(255,255,255,.32);
  --b-shadow:rgba(0,0,0,.7);
}

/* Sizes */
.nimbus-btn[data-size="sm"]{height:34px;padding:0 14px;font-size:13px;gap:6px}
.nimbus-btn[data-size="default"]{height:44px;padding:0 22px;font-size:14px;gap:8px}
.nimbus-btn[data-size="lg"]{height:52px;padding:0 28px;font-size:16px;gap:10px}
.nimbus-btn[data-size="icon"]{height:44px;width:44px;padding:0}

/* Shape */
.nimbus-btn[data-shape="rounded"]{border-radius:14px}
.nimbus-btn[data-shape="rounded"][data-size="sm"]{border-radius:10px}
.nimbus-btn[data-shape="rounded"][data-size="lg"]{border-radius:18px}

/* Variants */
.nimbus-btn[data-variant="primary"],
.nimbus-btn[data-variant="default"]{--b-fg:#FFFFFF}
.nimbus-btn[data-variant="destructive"]{--b-fg:#FFFFFF}
.nimbus-btn[data-variant="ghost"]{--b-tint:rgba(255,255,255,.04)}
.nimbus-btn[data-variant="ghost"]:hover{--b-tint:rgba(255,255,255,.14)}
.nimbus-btn[data-variant="outline"]{box-shadow:inset 0 0 0 1px var(--b-line)}

/* Checkout / Pay variant */
.nimbus-btn[data-variant="checkout"],
.nimbus-btn[data-variant="pay"]{
  --b-fg:#0B132B;
  height:52px;
  border-radius:999px;
  font-size:16px;
  font-weight:620;
  letter-spacing:-.01em;
  background-color:rgba(255,255,255,.2);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.9),inset 0 0 0 1px rgba(255,255,255,.5),inset 0 -2px 6px rgba(0,162,255,.14),0 8px 20px -10px rgba(0,70,140,.45);
  transition:color .35s,background-color .45s,box-shadow .45s,transform .2s cubic-bezier(.34,1.56,.64,1);
}
.nimbus-btn[data-variant="checkout"][data-tone="dark"],
.nimbus-btn[data-variant="pay"][data-tone="dark"]{
  --b-fg:#F1F7FF;
  background-color:rgba(255,255,255,.07);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.35),inset 0 0 0 1px rgba(255,255,255,.14),0 8px 20px -10px rgba(0,0,0,.6);
}
.nimbus-btn[data-variant="checkout"][data-loading="true"],
.nimbus-btn[data-variant="pay"][data-loading="true"]{
  color:#FFFFFF;
  opacity:1!important;
}
.nimbus-btn[data-variant="checkout"][data-success="true"],
.nimbus-btn[data-variant="pay"][data-success="true"]{
  color:#FFFFFF;
  background-color:transparent;
  box-shadow:none;
}
.nimbus-btn[data-variant="checkout"] .nb-drop,
.nimbus-btn[data-variant="pay"] .nb-drop{
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.8),rgba(255,255,255,0) 55%),linear-gradient(160deg,#2EB8FF,#0060CC);
}
.nb-pay-label{display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:opacity .25s,transform .35s}
.nb-dots{display:inline-flex;gap:3px;align-items:center}
.nb-dots i{width:4px;height:4px;border-radius:50%;background:currentColor;display:inline-block;animation:nbDot 1s infinite}
.nb-dots i:nth-child(2){animation-delay:.15s}
.nb-dots i:nth-child(3){animation-delay:.3s}
@keyframes nbDot{0%,100%{opacity:.35;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
.nb-check-anim{stroke-dasharray:24;stroke-dashoffset:24;animation:nbDraw .5s .15s cubic-bezier(.3,0,.2,1) forwards}
@keyframes nbDraw{to{stroke-dashoffset:0}}

/* States */
.nimbus-btn:focus-visible{outline:2px solid #00A2FF;outline-offset:3px}
.nimbus-btn:disabled,.nimbus-btn[data-loading="true"]{opacity:.55;cursor:not-allowed;transform:none!important}
.nimbus-btn:hover:not(:disabled){transform:translateY(-1.5px)}
.nimbus-btn:active:not(:disabled){transform:translateY(.5px) scale(.98)}

/* Glass panel */
.nb-glass{
  position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--b-tint);
  -webkit-backdrop-filter:blur(12px) saturate(1.2) brightness(1.06);backdrop-filter:blur(12px) saturate(1.2) brightness(1.06);
  box-shadow:inset 0 1px 1px var(--b-rim),inset 0 0 0 1px rgba(255,255,255,.2),0 12px 28px -10px var(--b-shadow),0 2px 5px rgba(0,40,90,.08);
  pointer-events:none;
}
.nimbus-btn[data-tone="dark"] .nb-glass{
  box-shadow:inset 0 1px 1px var(--b-rim),inset 0 0 0 1px rgba(255,255,255,.12),0 12px 28px -10px var(--b-shadow);
}

/* Water WebGL Canvas */
.nb-water{position:absolute;left:-14px;top:-14px;z-index:-1;pointer-events:none}
.nimbus-btn[data-gl="off"] .nb-water{display:none}

/* CSS Fallback Drop */
.nb-drop{
  display:none;position:absolute;inset:0;border-radius:inherit;z-index:-1;pointer-events:none;
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.75),rgba(255,255,255,0) 55%),rgba(255,255,255,.38);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.95),inset 0 -2px 6px rgba(0,162,255,.22),inset 0 0 0 1px rgba(255,255,255,.55),0 6px 16px -6px rgba(0,70,140,.45);
}
.nimbus-btn[data-gl="off"] .nb-drop{display:block}
.nimbus-btn[data-variant="primary"] .nb-drop,
.nimbus-btn[data-variant="default"] .nb-drop{
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.8),rgba(255,255,255,0) 55%),linear-gradient(160deg,#2EB8FF,#0060CC);
}
.nimbus-btn[data-variant="destructive"] .nb-drop{
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.8),rgba(255,255,255,0) 55%),linear-gradient(160deg,#FF6B8B,#E5484D);
}

/* Content */
.nb-content{
  position:relative;z-index:1;display:inline-flex;align-items:center;justify-content:center;
  gap:inherit;width:100%;pointer-events:none;
}
.nb-spin{animation:nbRotate .85s linear infinite}
@keyframes nbRotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

@media (prefers-reduced-motion: reduce){
  .nimbus-btn{transition:none!important;transform:none!important}
  .nb-spin{animation-duration:2s}
}
`

/* ---------- Shader Engine ---------- */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uCard;uniform float uCardR;
uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;uniform float uBlue;uniform vec3 uTint;uniform float uOk;uniform float uSquash;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float cardD(vec2 p){vec2 h=uCard.zw*.5;return sdRB(p-uCard.xy-h,h,uCardR);}
float dropD(vec2 p){
 vec2 h=uCard.zw*.5;vec2 q=p-uCard.xy-h;
 q.y/=max(uSquash,0.5);q.x*=max(uSquash,0.5);
 return sdRB(q,h,uCardR);
}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){
 float w=0.;
 for(int i=0;i<6;i++){
  vec4 R=uRip[i];
  if(R.w>0.){
   float x=length(p-R.xy)-R.z*240.;
   w+=R.w*exp(-R.z*1.7)*sin(x*.35)*exp(-x*x/700.);
  }
 }
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1400.);
 w+=uAmb*(sin(p.x*.04+p.y*.02+uTime*1.2)*.45+sin(p.x*.11-uTime*.85+p.y*.13)*.25);
 return w;
}
float H(vec2 p){
 float dc=cardD(p);float dd=dropD(p);
 return lens(dc,16.)*2.4+lens(dd,10.)*7.5+waves(p)*smoothstep(0.,8.,-dc);
}
float caus(vec2 p,float t){
 vec2 q=p;float c=0.;
 for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}
 return c/3.;
}
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
 float sh=smoothstep(9.,-9.,dd-vec2(0.,5.).y)*(1.-dm)*pm*(.11+.07*uDark+.08*uBlue);
 vec3 c=vec3(0.,.14,.36)*sh;float a=sh;
 float pa=clamp(pm*(fres*.5+spec*.9+spec2),0.,1.);
 c=mix(vec3(1.),irid,.5*fres)*pa+c*(1.-pa);a=pa+a*(1.-pa);
 float th=lens(dd,11.);
 float cs=caus((p+n.xy*th*18.)*.085,uTime*.9);
 vec3 tint=mix(uTint,mix(vec3(.80,.95,1.),vec3(.55,.82,1.),uDark),0.25);
 float rim=dm*(1.-smoothstep(0.,8.,-dd));
 float cres=dm*smoothstep(.12,.55,dot(n.xy,normalize(vec2(.55,.85))))*smoothstep(0.,3.,-dd);
 float body=.5+.5*clamp(-n.y*3.,-1.,1.);
 float da=dm*(.30+.18*body)*(1.-.35*uDark);vec3 dc=mix(tint,vec3(1.),body*.6);
 vec3 bw=mix(vec3(.35,.86,1.),vec3(0.,.52,.98),clamp(.5-n.y*2.+th*.3,0.,1.));
 dc=mix(dc,bw,uBlue);da=mix(da,dm*.9,uBlue);
 float la=rim*.24;vec3 lc=mix(vec3(0.,.42,.78),vec3(.1,.55,.95),uDark);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.7+smoothstep(.6,1.,cs)*(.28+.25*uBlue)*th*dm,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.2+spec2*.5),0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,dd)*.4;dc=mix(vec3(1.),irid,.35)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 c+=vec3(-.02,.08,.04)*uOk;
 gl_FragColor=vec4(c,a);
}`

const PAD = 14

type GLC = { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> }
type Rip = { x: number; y: number; age: number; amp: number }

function initGL(canvas: HTMLCanvasElement): GLC | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) as WebGLRenderingContext | null
  if (!gl) return null
  const sh = (t: number, src: string) => {
    const s = gl.createShader(t)
    if (!s) return null
    gl.shaderSource(s, src); gl.compileShader(s)
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
  for (const n of ["uRes", "uDpr", "uTime", "uCard", "uCardR", "uRip", "uMouse", "uDark", "uAmb", "uBlue", "uTint", "uOk", "uSquash"]) {
    u[n] = gl.getUniformLocation(p, n)
  }
  return { gl, u }
}

const VARIANT_TINTS: Record<LiquidButtonVariant, [number, number, number]> = {
  default: [0.0, 0.62, 1.0],
  primary: [0.0, 0.62, 1.0],
  secondary: [0.65, 0.78, 0.92],
  glass: [0.90, 0.95, 1.0],
  destructive: [1.0, 0.28, 0.38],
  outline: [0.75, 0.88, 1.0],
  ghost: [0.85, 0.92, 1.0],
  checkout: [0.0, 0.62, 1.0],
  pay: [0.0, 0.62, 1.0],
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  (
    {
      children,
      variant = "default",
      size = "default",
      shape = "pill",
      tone: propTone,
      sound: propSound,
      disableRipple = false,
      disableWater = false,
      loading = false,
      loadingText,
      success = false,
      icon,
      rightIcon,
      className,
      style,
      onClick,
      onPointerDown,
      onPointerUp,
      onPointerMove,
      onPointerLeave,
      disabled,
      ...buttonProps
    },
    forwardedRef
  ) => {
    const btnRef = React.useRef<HTMLButtonElement | null>(null)
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const audioRef = React.useRef<AudioContext | null>(null)
    const [gl, setGl] = React.useState(true)
    const liquidCtx = useLiquidContext()
    const tone = propTone ?? (liquidCtx.tone === "dark" || liquidCtx.tone === "midnight" ? "dark" : "light")
    const sound = propSound ?? liquidCtx.sound

    React.useImperativeHandle(forwardedRef, () => btnRef.current as HTMLButtonElement)

    const st = React.useRef({
      w: 0,
      h: 0,
      r: 999,
      rips: [] as Rip[],
      mouse: { x: 0, y: 0, s: 0, on: false },
      sy: 1.0,
      syT: 1.0,
      syV: 0,
      blue: loading ? 1 : 0,
      blueT: loading ? 1 : 0,
      ok: success ? 1 : 0,
      okT: success ? 1 : 0,
      visible: true,
      reduce: false,
      raf: 0,
      last: 0,
      time: 0,
      glc: null as GLC | null,
    })

    const plip = React.useCallback(
      (f0 = 460, f1 = 1500) => {
        if (!sound) return
        try {
          const AC =
            typeof window !== "undefined" &&
            (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)
          if (!AC) return
          const ctx = (audioRef.current ||= new AC())
          const t = ctx.currentTime
          const o = ctx.createOscillator(),
            g = ctx.createGain()
          o.type = "sine"
          o.frequency.setValueAtTime(f0, t)
          o.frequency.exponentialRampToValueAtTime(f1, t + 0.07)
          g.gain.setValueAtTime(0.0001, t)
          g.gain.exponentialRampToValueAtTime(0.14, t + 0.008)
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
          o.connect(g).connect(ctx.destination)
          o.start(t)
          o.stop(t + 0.18)
        } catch {
          /* audio optional */
        }
      },
      [sound]
    )

    const draw = React.useCallback(() => {
      const s = st.current,
        g = s.glc
      if (!g) return
      const { gl: c, u } = g
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const W = s.w + PAD * 2,
        H = s.h + PAD * 2
      c.viewport(0, 0, c.drawingBufferWidth, c.drawingBufferHeight)
      c.uniform2f(u.uRes, W, H)
      c.uniform1f(u.uDpr, dpr)
      c.uniform1f(u.uTime, s.time)
      c.uniform4f(u.uCard, PAD, PAD, s.w, s.h)
      c.uniform1f(u.uCardR, s.r)

      const rips = new Float32Array(24)
      s.rips.slice(-6).forEach((p, i) => rips.set([p.x, p.y, p.age, p.amp], i * 4))
      c.uniform4fv(u.uRip, rips)

      c.uniform3f(u.uMouse, s.mouse.x, s.mouse.y, s.mouse.s)
      c.uniform1f(u.uDark, tone === "dark" ? 1 : 0)
      c.uniform1f(u.uAmb, s.reduce ? 0 : 1)
      c.uniform1f(u.uBlue, s.blue)
      const tint = VARIANT_TINTS[variant] || VARIANT_TINTS.default
      c.uniform3f(u.uTint, tint[0], tint[1], tint[2])
      c.uniform1f(u.uOk, s.ok)
      c.uniform1f(u.uSquash, s.sy)

      c.clearColor(0, 0, 0, 0)
      c.clear(c.COLOR_BUFFER_BIT)
      c.drawArrays(c.TRIANGLES, 0, 3)
    }, [tone, variant])

    const step = React.useCallback((dt: number) => {
      const s = st.current
      s.time += dt

      // Squash spring
      if (s.reduce) {
        s.sy = s.syT
        s.syV = 0
      } else {
        s.syV += (280 * (s.syT - s.sy) - 18 * s.syV) * dt
        s.sy += s.syV * dt
      }

      // States transition
      s.blue += (s.blueT - s.blue) * Math.min(1, dt * 6)
      s.ok += (s.okT - s.ok) * Math.min(1, dt * 6)

      // Ripples
      s.rips.forEach((p) => (p.age += dt))
      s.rips = s.rips.filter((p) => p.age < 2.2)

      // Mouse meniscus ease
      s.mouse.s += ((s.mouse.on ? 1 : 0) - s.mouse.s) * Math.min(1, dt * 8)
    }, [])

    const loop = React.useCallback(() => {
      const s = st.current
      if (s.raf) return
      s.last = performance.now()
      const tick = (now: number) => {
        const dt = Math.min((now - s.last) / 1000, 1 / 30)
        s.last = now
        step(dt)
        draw()
        const busy =
          Math.abs(s.syT - s.sy) > 0.005 ||
          Math.abs(s.syV) > 0.01 ||
          s.rips.length > 0 ||
          s.mouse.s > 0.01 ||
          Math.abs(s.blueT - s.blue) > 0.01 ||
          Math.abs(s.okT - s.ok) > 0.01
        if (s.visible && (!s.reduce || busy)) {
          s.raf = requestAnimationFrame(tick)
        } else {
          s.raf = 0
        }
      }
      s.raf = requestAnimationFrame(tick)
    }, [draw, step])

    const resize = React.useCallback(() => {
      const el = btnRef.current,
        cv = canvasRef.current
      if (!el) return
      const s = st.current
      s.w = el.offsetWidth
      s.h = el.offsetHeight
      s.r = shape === "pill" ? s.h / 2 : size === "sm" ? 10 : size === "lg" ? 18 : 14
      if (cv) {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
        const W = s.w + PAD * 2,
          H = s.h + PAD * 2
        if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
          cv.width = Math.round(W * dpr)
          cv.height = Math.round(H * dpr)
          cv.style.width = `${W}px`
          cv.style.height = `${H}px`
        }
      }
      loop()
    }, [loop, shape, size])

    React.useEffect(() => {
      if (disableWater) {
        setGl(false)
        return
      }
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
      if (btnRef.current) {
        io.observe(btnRef.current)
        ro.observe(btnRef.current)
      }
      resize()
      return () => {
        cv?.removeEventListener("webglcontextlost", lost)
        io.disconnect()
        ro.disconnect()
        cancelAnimationFrame(s.raf)
        s.raf = 0
      }
    }, [loop, resize, disableWater])

    React.useEffect(() => {
      st.current.blueT = loading ? 1 : 0
      st.current.okT = success ? 1 : 0
      if (success) plip(520, 1760)
      loop()
    }, [loading, success, loop, plip])

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled || loading) return
      const el = btnRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const px = PAD + (e.clientX - rect.left)
        const py = PAD + (e.clientY - rect.top)
        st.current.syT = 0.86
        if (!disableRipple && !st.current.reduce) {
          st.current.rips.push({ x: px, y: py, age: 0, amp: 1.0 })
        }
        try {
          navigator.vibrate?.(10)
        } catch {
          /* optional */
        }
        plip()
        loop()
      }
      onPointerDown?.(e)
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
      st.current.syT = 1.0
      loop()
      onPointerUp?.(e)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.pointerType === "mouse") {
        const el = btnRef.current
        if (el) {
          const rect = el.getBoundingClientRect()
          st.current.mouse.x = PAD + (e.clientX - rect.left)
          st.current.mouse.y = PAD + (e.clientY - rect.top)
          st.current.mouse.on = true
          loop()
        }
      }
      onPointerMove?.(e)
    }

    const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
      st.current.syT = 1.0
      st.current.mouse.on = false
      loop()
      onPointerLeave?.(e)
    }

    const isPayVariant = variant === "checkout" || variant === "pay"

    return (
      <button
        ref={btnRef}
        type="button"
        className={`nimbus-btn ${className || ""}`}
        data-tone={tone}
        data-variant={variant}
        data-size={size}
        data-shape={shape}
        data-gl={gl && !disableWater ? "on" : "off"}
        data-disable-water={disableWater ? "true" : undefined}
        data-loading={loading ? "true" : undefined}
        data-success={success ? "true" : undefined}
        disabled={disabled || loading}
        aria-busy={loading ? "true" : undefined}
        aria-disabled={disabled || loading ? "true" : undefined}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={onClick}
        style={style}
        {...buttonProps}
      >
        <style dangerouslySetInnerHTML={{ __html: NB_CSS }} />
        <span className="nb-glass" aria-hidden="true" />
        {!disableWater && <canvas className="nb-water" ref={canvasRef} aria-hidden="true" />}
        {!disableWater && <span className="nb-drop" aria-hidden="true" />}
        <span className="nb-content">
          {loading ? (
            isPayVariant ? (
              <span className="nb-pay-label">
                <span>{loadingText || "Processing"}</span>
                <span className="nb-dots" aria-hidden="true"><i /><i /><i /></span>
              </span>
            ) : (
              <>
                {NimbusButtonIcons.spinner}
                {loadingText && <span>{loadingText}</span>}
              </>
            )
          ) : success ? (
            isPayVariant ? (
              <span className="nb-pay-label">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path className="nb-check-anim" d="m5.5 12.5 4.2 4.2L18.5 7.8" />
                </svg>
                {children && <span>{children}</span>}
              </span>
            ) : (
              <>
                {NimbusButtonIcons.check}
                {children && <span>{children}</span>}
              </>
            )
          ) : (
            <>
              {icon}
              {children && <span>{children}</span>}
              {rightIcon}
            </>
          )}
        </span>
      </button>
    )
  }
)

LiquidButton.displayName = "LiquidButton"

export type LiquidCheckoutButtonProps = Omit<LiquidButtonProps, "variant"> & {
  variant?: "checkout" | "pay"
}

export const LiquidCheckoutButton = React.forwardRef<HTMLButtonElement, LiquidCheckoutButtonProps>(
  function LiquidCheckoutButton({ variant = "checkout", shape = "pill", size = "lg", ...props }, ref) {
    return <LiquidButton ref={ref} variant={variant} shape={shape} size={size} {...props} />
  }
)

LiquidCheckoutButton.displayName = "LiquidCheckoutButton"

export { LiquidCheckoutButton as CheckoutButton }

/** alias for registries that import { Component } */
export { LiquidButton as Component }

export default LiquidButton

"use client"

/**
 * Nimbus UI · Liquid Tabs — "Streamway"
 * A pill of water. The active tab drop stretches toward the tab you pick, splits into
 * droplets on long jumps and merges back with a soft landing ripple. The cursor lifts a
 * living meniscus across the water, taps send waves along the glass pill, each tab icon
 * can play its own little animated scene, and panels surface with a liquid cross-dissolve.
 * Water is drawn by a tiny WebGL shader; without WebGL it falls back to a CSS drop.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type NimbusFx = "plane" | "drop" | "spin" | "glow" | "wave" | "pop" | "none"

export type LiquidTabItem = {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
  /** the animated scene the icon plays when activated */
  fx?: NimbusFx
  badge?: React.ReactNode
  content?: React.ReactNode
  disabled?: boolean
}

export type LiquidTabsProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  items?: LiquidTabItem[]
  children?: React.ReactNode
  orientation?: "horizontal" | "vertical"
  tone?: "light" | "dark"
  variant?: "default" | "emerald" | "amber" | "violet" | "rose" | "cyan"
  /** enable experimental SVG refraction filter */
  refract?: boolean
  /** compact icon-only mode on mobile */
  compact?: boolean
  /** synthesized water plip sound */
  sound?: boolean
  className?: string
  style?: React.CSSProperties
}

export type LiquidTabsListProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export type LiquidTabsTriggerProps = {
  value: string
  disabled?: boolean
  children?: React.ReactNode
  icon?: React.ReactNode
  fx?: NimbusFx
  badge?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export type LiquidTabsContentProps = {
  value: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/* ---------- built-in icons ---------- */
const I = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)
export const NimbusTabIcons = {
  overview: I(<><rect width="7" height="9" x="3" y="3" rx="1.5" /><rect width="7" height="5" x="14" y="3" rx="1.5" /><rect width="7" height="9" x="14" y="12" rx="1.5" /><rect width="7" height="5" x="3" y="16" rx="1.5" /></>),
  activity: I(<path d="M22 12h-4l-3 9L9 3l-3 9H2" />),
  settings: I(<><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>),
  code: I(<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>),
  sparkles: I(<><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" /></>),
  layers: I(<><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>),
  chart: I(<><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></>),
  bell: I(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>),
}

const PAD = 14

/* ---------- styles ---------- */
const NTB_CSS = `
.nimbus-tabs{--tb-tint:rgba(255,255,255,.14);--tb-fg:#0B132B;--tb-soft:rgba(11,19,43,.62);--tb-rim:rgba(255,255,255,.75);--tb-line:rgba(11,19,43,.08);
  position:relative;display:flex;flex-direction:column;gap:14px;width:100%;isolation:isolate;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.nimbus-tabs[data-tone="dark"]{--tb-tint:rgba(10,18,40,.28);--tb-fg:#F1F7FF;--tb-soft:rgba(241,247,255,.66);--tb-rim:rgba(255,255,255,.32);--tb-line:rgba(241,247,255,.1)}
.nimbus-tabs[data-orientation="vertical"]{flex-direction:row;align-items:flex-start}

.nimbus-tabs[data-variant="emerald"]{--tb-tint:rgba(16,185,129,.14);--tb-rim:rgba(167,243,208,.8)}
.nimbus-tabs[data-variant="amber"]{--tb-tint:rgba(245,158,11,.14);--tb-rim:rgba(254,243,199,.8)}
.nimbus-tabs[data-variant="violet"]{--tb-tint:rgba(139,92,246,.14);--tb-rim:rgba(237,233,254,.8)}
.nimbus-tabs[data-variant="rose"]{--tb-tint:rgba(244,63,94,.14);--tb-rim:rgba(255,228,230,.8)}
.nimbus-tabs[data-variant="cyan"]{--tb-tint:rgba(6,182,212,.14);--tb-rim:rgba(207,250,254,.8)}

.ntb-list{position:relative;display:inline-flex;align-items:center;padding:6px;gap:2px;border-radius:999px;isolation:isolate;user-select:none;-webkit-user-select:none;touch-action:pan-y}
.nimbus-tabs[data-orientation="vertical"] .ntb-list{flex-direction:column;border-radius:26px}

.ntb-glass{position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--tb-tint);
  -webkit-backdrop-filter:blur(12px) saturate(1.22) brightness(1.08);backdrop-filter:blur(12px) saturate(1.22) brightness(1.08);
  box-shadow:inset 0 1px 1px var(--tb-rim),inset 0 0 0 1px rgba(255,255,255,.2),0 14px 34px -14px rgba(0,40,90,.48),0 2px 6px rgba(0,40,90,.09)}
.nimbus-tabs[data-tone="dark"] .ntb-glass{box-shadow:inset 0 1px 1px var(--tb-rim),inset 0 0 0 1px rgba(255,255,255,.1),0 16px 36px -14px rgba(0,0,0,.75)}
.nimbus-tabs[data-refract="on"] .ntb-glass{-webkit-backdrop-filter:url(#nimbus-tabs-refract) blur(2px) saturate(1.2) brightness(1.08);backdrop-filter:url(#nimbus-tabs-refract) blur(2px) saturate(1.2) brightness(1.08)}

.ntb-water{position:absolute;left:${-PAD}px;top:${-PAD}px;z-index:-1;pointer-events:none}
.nimbus-tabs[data-gl="off"] .ntb-water{display:none}

.ntb-pool{display:none;position:absolute;top:6px;bottom:6px;left:0;border-radius:999px;z-index:-1;pointer-events:none;will-change:transform,width;
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.8),rgba(255,255,255,0) 55%),rgba(255,255,255,.45);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.95),inset 0 -2px 6px rgba(0,162,255,.24),inset 0 0 0 1px rgba(255,255,255,.6),0 6px 16px -6px rgba(0,70,140,.45)}
.nimbus-tabs[data-tone="dark"] .ntb-pool{background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),rgba(10,35,75,.6);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.6),inset 0 -2px 6px rgba(0,162,255,.35),inset 0 0 0 1px rgba(255,255,255,.25),0 6px 18px -4px rgba(0,0,0,.6)}
.nimbus-tabs[data-gl="off"] .ntb-pool{display:block}

.ntb-trigger{position:relative;z-index:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:40px;padding:0 18px;border:0;border-radius:999px;
  background:none;color:var(--tb-soft);font-family:inherit;font-size:14px;font-weight:520;line-height:1;letter-spacing:-.01em;cursor:pointer;outline:none;
  transition:color .25s ease,transform .15s ease}
.ntb-trigger:hover:not(:disabled){color:var(--tb-fg)}
.ntb-trigger[aria-selected="true"]{color:var(--tb-fg);font-weight:600}
.ntb-trigger:disabled{opacity:.4;cursor:not-allowed}
.ntb-trigger:focus-visible{outline:2px solid #00A2FF;outline-offset:2px}
.ntb-trigger:active:not(:disabled){transform:scale(.97)}

/* Animated icon scenes */
.ntb-ico{position:relative;display:inline-flex;align-items:center;justify-content:center;flex:none}
.ntb-ico svg{transition:transform .45s cubic-bezier(.3,1.6,.5,1)}
.ntb-trigger[aria-selected="true"] .ntb-ico svg{transform:translateY(-1px) scale(1.08)}

.ntb-ico[data-fx="pop"] svg{animation:ntbPop .5s cubic-bezier(.3,1.6,.5,1) both}
@keyframes ntbPop{0%{transform:scale(.72)}60%{transform:scale(1.22)}100%{transform:translateY(-1px) scale(1.08)}}

.ntb-ico[data-fx="plane"] svg{animation:ntbPlane 1.1s cubic-bezier(.55,0,.3,1) both}
@keyframes ntbPlane{0%{transform:none}15%{transform:translate(-2px,2px) rotate(6deg)}45%{transform:translate(52px,-22px) rotate(-22deg) scale(.88);opacity:0}46%{transform:translate(-50px,14px) rotate(-10deg) scale(.88);opacity:0}60%{opacity:1}80%{transform:translate(2px,-1px) rotate(2deg)}100%{transform:translateY(-1px) scale(1.08)}}
.ntb-ico[data-fx="plane"]::after{content:"";position:absolute;left:55%;top:48%;height:2px;width:38px;border-radius:2px;transform-origin:0 50%;
  background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.95));animation:ntbTrail 1.1s ease-out both;pointer-events:none}
@keyframes ntbTrail{0%,10%{opacity:0;transform:rotate(-20deg) scaleX(0)}32%{opacity:.9;transform:rotate(-20deg) scaleX(1)}55%,100%{opacity:0;transform:rotate(-20deg) translateX(24px) scaleX(.2)}}

.ntb-ico[data-fx="drop"] svg{animation:ntbDrop .95s cubic-bezier(.4,0,.3,1) both;transform-origin:50% 100%}
@keyframes ntbDrop{0%{transform:translateY(-1px)}26%{transform:translateY(-12px) scale(.88,1.12)}46%{transform:translateY(3px) scale(1.28,.7)}62%{transform:translateY(-3px) scale(.93,1.07)}80%{transform:translateY(0) scale(1.03,.97)}100%{transform:translateY(-1px) scale(1.08)}}
.ntb-ico[data-fx="drop"]::before,.ntb-ico[data-fx="drop"]::after{content:"";position:absolute;bottom:0;left:50%;width:3px;height:3px;margin-left:-1.5px;border-radius:50%;background:currentColor;opacity:0;pointer-events:none}
.ntb-ico[data-fx="drop"]::before{animation:ntbSplashL .95s ease-out both}
.ntb-ico[data-fx="drop"]::after{animation:ntbSplashR .95s ease-out both}
@keyframes ntbSplashL{0%,44%{opacity:0;transform:none}50%{opacity:.9;transform:translate(-4px,-5px)}75%,100%{opacity:0;transform:translate(-10px,1px) scale(.4)}}
@keyframes ntbSplashR{0%,44%{opacity:0;transform:none}50%{opacity:.9;transform:translate(4px,-6px)}75%,100%{opacity:0;transform:translate(11px,1px) scale(.4)}}

.ntb-ico[data-fx="spin"] svg{animation:ntbSpin 1s cubic-bezier(.2,.75,.25,1) both}
@keyframes ntbSpin{0%{transform:perspective(80px) rotateY(0)}100%{transform:perspective(80px) rotateY(360deg) translateY(-1px) scale(1.08)}}

.ntb-ico[data-fx="glow"] svg{animation:ntbHop .8s cubic-bezier(.3,1.4,.5,1) both;transform-origin:50% 100%}
@keyframes ntbHop{0%{transform:none}30%{transform:translateY(-4px) scale(1.04,.96)}55%{transform:translateY(0) scale(1.1,.9)}75%{transform:translateY(-2px) scale(.98,1.04)}100%{transform:translateY(-1px) scale(1.08)}}

.ntb-ico[data-fx="wave"] svg{animation:ntbWave .9s ease-in-out both;transform-origin:50% 92%}
@keyframes ntbWave{0%{transform:none}20%{transform:rotate(-14deg)}40%{transform:rotate(10deg)}60%{transform:rotate(-7deg)}80%{transform:rotate(3deg)}100%{transform:translateY(-1px) scale(1.08)}}

/* Badge pill inside tab */
.ntb-badge{display:inline-flex;align-items:center;justify-content:center;padding:2px 7px;border-radius:999px;font-size:11px;font-weight:650;line-height:1;
  background:rgba(255,255,255,.3);color:inherit;box-shadow:inset 0 1px 1px rgba(255,255,255,.8),0 1px 2px rgba(0,40,90,.15)}
.nimbus-tabs[data-tone="dark"] .ntb-badge{background:rgba(255,255,255,.15);box-shadow:inset 0 1px 1px rgba(255,255,255,.3)}

/* Content panel animation */
.ntb-content{position:relative;outline:none;padding:16px 6px;font-size:14px;color:var(--tb-fg);line-height:1.55;
  animation:ntbPanelEnter .28s cubic-bezier(.25,.9,.3,1) both}
.ntb-content[hidden]{display:none}
@keyframes ntbPanelEnter{from{opacity:0;transform:translateY(6px) scale(.995)}to{opacity:1;transform:translateY(0) scale(1)}}

/* Compact mobile support */
.nimbus-tabs[data-compact="true"] .ntb-trigger{padding:0 12px}
.nimbus-tabs[data-compact="true"] .ntb-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (max-width:540px){
  .nimbus-tabs:not([data-compact="false"]) .ntb-trigger{padding:0 12px}
  .nimbus-tabs:not([data-compact="false"]) .ntb-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
}

@media (prefers-reduced-motion:reduce){
  .ntb-pool{transition:none!important}
  .ntb-trigger{transition:none!important;transform:none!important}
  .ntb-ico svg,.ntb-ico::before,.ntb-ico::after{animation:none!important;transition:none!important}
  .ntb-content{animation:none!important}
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
}
`

type GLC = { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> }
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
  for (const n of ["uRes", "uDpr", "uTime", "uPill", "uBlob", "uSy", "uRip", "uMouse", "uDark", "uAmb"]) {
    u[n] = gl.getUniformLocation(p, n)
  }
  return { gl, u }
}

function supportsRefraction() {
  if (typeof window === "undefined" || typeof CSS === "undefined") return false
  const ua = navigator.userAgent
  return /Chrome\/|Chromium\/|Edg\//.test(ua) && !/Firefox\//.test(ua) && !!(CSS as unknown as { supports?: (prop: string, val: string) => boolean }).supports?.("backdrop-filter", "url(#a)")
}

/* ---------- sound ---------- */
let acInstance: AudioContext | null = null
function playPlip(sound?: boolean) {
  if (!sound) return
  try {
    const AC = typeof window !== "undefined" && (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)
    if (!AC) return
    if (!acInstance || acInstance.state === "closed") acInstance = new AC()
    const ctx = acInstance
    if (ctx.state === "suspended") void ctx.resume()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.07)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.16)
  } catch {
    // audio failure silent
  }
}

/* ---------- Context ---------- */
type TabsContextValue = {
  value: string
  setValue: (val: string) => void
  orientation: "horizontal" | "vertical"
  tone: "light" | "dark"
  compact?: boolean
  registerTrigger: (val: string, el: HTMLElement | null) => void
  activeFx: { val: string; key: number }
  triggerFx: (val: string) => void
}
const TabsContext = React.createContext<TabsContextValue | null>(null)

export const LiquidTabs = React.forwardRef<HTMLDivElement, LiquidTabsProps>(function LiquidTabs(
  {
    value: controlledValue,
    defaultValue,
    onValueChange,
    items,
    children,
    orientation = "horizontal",
    tone = "light",
    variant = "default",
    refract = false,
    compact = false,
    sound = true,
    className = "",
    style,
    ...props
  },
  ref
) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>(() => {
    if (defaultValue !== undefined) return defaultValue
    if (items && items.length > 0) return items[0].value
    return ""
  })
  const isControlled = controlledValue !== undefined
  const activeValue = isControlled ? controlledValue : uncontrolledValue

  const [activeFx, setActiveFx] = React.useState<{ val: string; key: number }>({ val: activeValue, key: 0 })
  const triggerFx = React.useCallback((val: string) => {
    setActiveFx((prev) => ({ val, key: prev.key + 1 }))
  }, [])

  const triggerMapRef = React.useRef<Map<string, HTMLElement>>(new Map())
  const registerTrigger = React.useCallback((val: string, el: HTMLElement | null) => {
    if (el) triggerMapRef.current.set(val, el)
    else triggerMapRef.current.delete(val)
  }, [])

  const handleValueChange = React.useCallback(
    (newVal: string) => {
      triggerFx(newVal)
      if (newVal === activeValue) return
      playPlip(sound)
      if (!isControlled) setUncontrolledValue(newVal)
      onValueChange?.(newVal)
    },
    [activeValue, isControlled, onValueChange, sound, triggerFx]
  )

  const [canRefract, setCanRefract] = React.useState(false)
  React.useEffect(() => {
    setCanRefract(supportsRefraction())
  }, [])
  const isRefracting = refract && canRefract

  const ctxValue = React.useMemo<TabsContextValue>(
    () => ({
      value: activeValue,
      setValue: handleValueChange,
      orientation,
      tone,
      compact,
      registerTrigger,
      activeFx,
      triggerFx,
    }),
    [activeValue, handleValueChange, orientation, tone, compact, registerTrigger, activeFx, triggerFx]
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NTB_CSS }} />
      {isRefracting && (
        <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
          <filter id="nimbus-tabs-refract">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      )}
      <TabsContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={`nimbus-tabs ${className}`}
          data-tone={tone}
          data-variant={variant}
          data-orientation={orientation}
          data-refract={isRefracting ? "on" : "off"}
          data-compact={compact ? "true" : "false"}
          style={style}
          {...props}
        >
          {items && items.length > 0 ? (
            <>
              <LiquidTabsList>
                {items.map((it) => (
                  <LiquidTabsTrigger
                    key={it.value}
                    value={it.value}
                    disabled={it.disabled}
                    icon={it.icon}
                    fx={it.fx}
                    badge={it.badge}
                  >
                    {it.label}
                  </LiquidTabsTrigger>
                ))}
              </LiquidTabsList>
              {items.map((it) =>
                it.content ? (
                  <LiquidTabsContent key={it.value} value={it.value}>
                    {it.content}
                  </LiquidTabsContent>
                ) : null
              )}
            </>
          ) : (
            children
          )}
        </div>
      </TabsContext.Provider>
    </>
  )
})

export const LiquidTabsList = React.forwardRef<HTMLDivElement, LiquidTabsListProps>(function LiquidTabsList(
  { children, className = "", style, ...props },
  forwardedRef
) {
  const ctx = React.useContext(TabsContext)
  const innerRef = React.useRef<HTMLDivElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const dropRef = React.useRef<HTMLSpanElement | null>(null)
  const [gl, setGl] = React.useState<"on" | "off">("on")

  React.useImperativeHandle(forwardedRef, () => innerRef.current!)

  const dark = ctx?.tone === "dark" ? 1 : 0
  const darkRef = React.useRef(dark)
  darkRef.current = dark

  const st = React.useRef({
    a: { x: 0, v: 0 },
    b: { x: 0, v: 0 },
    q: 0,
    lead: 0 as 0 | 1,
    lagFrom: 0,
    sy: { s: 1, v: 0 },
    sats: [] as Array<{ x: number; y: number; vx: number; vy: number; r: number; k: number }>,
    rips: [] as Array<{ x: number; y: number; age: number; amp: number }>,
    mouse: { x: 0, y: 0, s: 0, on: false },
    t: { x: 0, cy: 0, q: 0, r: 0 },
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
    glc: null as GLC | null,
  })

  const draw = React.useCallback(() => {
    const s = st.current
    const T = s.t
    const sep = Math.abs(s.a.x - s.b.x)
    const thin = Math.min(sep / (2 * (s.q + T.r) || 1), 1)
    const r = T.r * (1 - 0.3 * thin)

    if (s.glc) {
      const { gl: g, u } = s.glc
      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2)
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight)
      g.uniform2f(u.uRes, s.w + PAD * 2, s.h + PAD * 2)
      g.uniform1f(u.uDpr, dpr)
      g.uniform1f(u.uTime, s.time)
      g.uniform4f(u.uPill, PAD, PAD, s.w, s.h)

      const blobs = new Float32Array(24)
      const sy = new Float32Array(6).fill(1)
      const head = s.lead === 0 ? s.a : s.b, tail = s.lead === 0 ? s.b : s.a
      blobs.set([
        head.x, T.cy, s.q * (1 - 0.25 * thin), T.r * (1 - 0.12 * thin),
        tail.x, T.cy, s.q * (1 - 0.8 * thin), T.r * (1 - 0.5 * thin),
      ], 0)
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
      dropRef.current.style.width = `${width}px`
      dropRef.current.style.transform = `translateX(${left}px) scaleY(${s.sy.s})`
    }
  }, [])

  const step = React.useCallback((dt: number, now: number) => {
    const s = st.current
    const T = s.t
    s.time += dt
    s.q += (T.q - s.q) * Math.min(1, dt * 12)
    const bodies = [s.a, s.b]
    let still = true

    if (s.reduce) {
      s.a.x = s.b.x = T.x
      s.a.v = s.b.v = 0
      s.sy.s = 1
      s.sats = []
    } else {
      bodies.forEach((B, i) => {
        const lead = i === s.lead
        const k = lead ? 220 : 72
        const c = lead ? 25 : 13
        const f = !lead && now < s.lagFrom ? 0.08 : 1
        B.v += (k * (T.x - B.x) - c * B.v) * dt * f
        B.x += B.v * dt
        const lo = PAD + 6 + s.q + T.r - 3, hi = PAD + s.w - 6 - s.q - T.r + 3
        if (B.x < lo || B.x > hi) {
          s.sy.v -= Math.min(Math.abs(B.v), 900) * 0.0016
          B.x = Math.max(lo, Math.min(hi, B.x))
          B.v *= -0.25
        }
        if (Math.abs(T.x - B.x) > 0.3 || Math.abs(B.v) > 3) still = false
      })

      const L = bodies[s.lead]
      const syT = 1 - 0.2 * Math.min(Math.abs(L.v) / 1500, 1)
      s.sy.v += (280 * (syT - s.sy.s) - 9 * s.sy.v) * dt
      s.sy.s += s.sy.v * dt
      if (Math.abs(s.sy.s - 1) > 0.002 || Math.abs(s.sy.v) > 0.02) still = false

      // Break neck: spawn droplets between head and tail
      const sep = Math.abs(s.a.x - s.b.x)
      const r = T.r * (1 - 0.3 * Math.min(sep / (2 * (T.q + T.r) || 1), 1))
      if (!s.split && s.moving && sep - 2 * T.q - 2 * r > -6) {
        s.split = true
        const lo = bodies[1 - s.lead], hi = bodies[s.lead]
        ;[0.3, 0.5, 0.72].forEach((t, j) => {
          s.sats.push({
            x: lo.x + (hi.x - lo.x) * t + (Math.random() - 0.5) * 6,
            y: T.cy + (Math.random() - 0.5) * 10,
            vx: (lo.v + hi.v) * 0.45,
            vy: (Math.random() - 0.5) * 60,
            r: 5 + Math.random() * 3 - j * 0.5,
            k: 70 + Math.random() * 90,
          })
        })
      }
      s.sats = s.sats.filter((d) => {
        d.vx += (d.k * (T.x - d.x) - 9 * d.vx) * dt
        d.vy += (90 * (T.cy - d.y) - 7 * d.vy) * dt
        d.x += d.vx * dt
        d.y += d.vy * dt
        d.x = Math.max(PAD + 8 + d.r, Math.min(PAD + s.w - 8 - d.r, d.x))
        d.y = Math.max(T.cy - T.r + d.r, Math.min(T.cy + T.r - d.r, d.y))
        if (Math.abs(T.x - d.x) < T.q + T.r * 0.5) d.r -= dt * 26
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
    const list = innerRef.current
    if (!list || !ctx) return
    const activeEl = list.querySelector<HTMLElement>(`[role="tab"][data-value="${ctx.value}"]`)
    if (!activeEl) return
    const s = st.current
    s.w = list.offsetWidth
    s.h = list.offsetHeight
    const T = s.t
    T.r = activeEl.offsetHeight / 2
    T.q = Math.max(0, activeEl.offsetWidth / 2 - T.r)
    T.cy = PAD + activeEl.offsetTop + activeEl.offsetHeight / 2
    const nx = PAD + activeEl.offsetLeft + activeEl.offsetWidth / 2

    if (!s.ready) {
      s.a.x = s.b.x = nx
      s.q = T.q
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
      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2)
      const W = s.w + PAD * 2, Hh = s.h + PAD * 2
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(Hh * dpr)) {
        cv.width = Math.round(W * dpr)
        cv.height = Math.round(Hh * dpr)
        cv.style.width = `${W}px`
        cv.style.height = `${Hh}px`
      }
    }
    loop()
  }, [ctx, loop])

  React.useEffect(() => {
    const s = st.current
    s.reduce = typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const cv = canvasRef.current
    s.glc = cv ? initGL(cv) : null
    if (!s.glc) setGl("off")
    const lost = (e: Event) => {
      e.preventDefault()
      s.glc = null
      setGl("off")
    }
    cv?.addEventListener("webglcontextlost", lost)
    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting
      if (s.visible) loop()
    })
    if (innerRef.current) io.observe(innerRef.current)
    const vis = () => {
      s.visible = document.visibilityState === "visible"
      if (s.visible) loop()
    }
    document.addEventListener("visibilitychange", vis)
    return () => {
      cv?.removeEventListener("webglcontextlost", lost)
      io.disconnect()
      document.removeEventListener("visibilitychange", vis)
      cancelAnimationFrame(s.raf)
      s.raf = 0
    }
  }, [loop])

  React.useLayoutEffect(() => {
    measure()
  }, [measure, ctx?.value, ctx?.compact])

  const measureRef = React.useRef(measure)
  measureRef.current = measure
  React.useEffect(() => {
    let lastW = -1
    const ro = new ResizeObserver(() => {
      const w = innerRef.current?.offsetWidth ?? 0
      if (w !== lastW) {
        lastW = w
        st.current.ready = false
        measureRef.current()
      }
    })
    if (innerRef.current) ro.observe(innerRef.current)
    return () => ro.disconnect()
  }, [])

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return
    const rect = innerRef.current?.getBoundingClientRect()
    if (!rect) return
    const s = st.current
    s.mouse.x = e.clientX - rect.left + PAD
    s.mouse.y = e.clientY - rect.top + PAD
    s.mouse.on = true
    loop()
  }

  const handlePointerLeave = () => {
    const s = st.current
    s.mouse.on = false
    loop()
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = innerRef.current?.getBoundingClientRect()
    if (!rect) return
    const s = st.current
    if (s.reduce) return
    s.rips.push({ x: e.clientX - rect.left + PAD, y: e.clientY - rect.top + PAD, age: 0, amp: 0.75 })
    loop()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const list = innerRef.current
    if (!list || !ctx) return
    const triggers = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'))
    if (!triggers.length) return
    const activeIndex = triggers.findIndex((el) => el.getAttribute("data-value") === ctx.value)

    let nextIndex = -1
    const isHoriz = ctx.orientation === "horizontal"
    if ((isHoriz && e.key === "ArrowRight") || (!isHoriz && e.key === "ArrowDown")) {
      e.preventDefault()
      nextIndex = (activeIndex + 1) % triggers.length
    } else if ((isHoriz && e.key === "ArrowLeft") || (!isHoriz && e.key === "ArrowUp")) {
      e.preventDefault()
      nextIndex = (activeIndex - 1 + triggers.length) % triggers.length
    } else if (e.key === "Home") {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === "End") {
      e.preventDefault()
      nextIndex = triggers.length - 1
    }

    if (nextIndex >= 0) {
      const targetEl = triggers[nextIndex]
      const targetVal = targetEl.getAttribute("data-value")
      if (targetVal) {
        ctx.setValue(targetVal)
        targetEl.focus()
      }
    }
  }

  return (
    <div
      ref={innerRef}
      role="tablist"
      aria-orientation={ctx?.orientation || "horizontal"}
      className={`ntb-list ${className}`}
      data-gl={gl}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      style={style}
      {...props}
    >
      <span className="ntb-glass" aria-hidden="true" />
      <canvas ref={canvasRef} className="ntb-water" aria-hidden="true" />
      <span ref={dropRef} className="ntb-pool" aria-hidden="true" />
      {children}
    </div>
  )
})

export const LiquidTabsTrigger = React.forwardRef<HTMLButtonElement, LiquidTabsTriggerProps>(function LiquidTabsTrigger(
  { value, disabled, children, icon, fx = "pop", badge, className = "", style, ...props },
  forwardedRef
) {
  const ctx = React.useContext(TabsContext)
  const isSelected = ctx?.value === value
  const fxActive = ctx?.activeFx.val === value ? ctx.activeFx.key : 0

  const handleRef = React.useCallback(
    (el: HTMLButtonElement | null) => {
      ctx?.registerTrigger(value, el)
      if (typeof forwardedRef === "function") forwardedRef(el)
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = el
    },
    [ctx, forwardedRef, value]
  )

  const handleClick = () => {
    ctx?.setValue(value)
  }

  return (
    <button
      ref={handleRef}
      role="tab"
      type="button"
      id={`tab-${value}`}
      aria-selected={isSelected}
      aria-controls={`panel-${value}`}
      data-value={value}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      className={`ntb-trigger ${className}`}
      onClick={handleClick}
      style={style}
      {...props}
    >
      {icon && (
        <span
          key={fxActive}
          className="ntb-ico"
          data-fx={isSelected ? fx : "none"}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="ntb-label">{children}</span>
      {badge && <span className="ntb-badge">{badge}</span>}
    </button>
  )
})

export const LiquidTabsContent = React.forwardRef<HTMLDivElement, LiquidTabsContentProps>(function LiquidTabsContent(
  { value, children, className = "", style, ...props },
  ref
) {
  const ctx = React.useContext(TabsContext)
  const isSelected = ctx?.value === value

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      hidden={!isSelected}
      className={`ntb-content ${className}`}
      style={style}
      {...props}
    >
      {isSelected ? children : null}
    </div>
  )
})

export {
  LiquidTabs as Tabs,
  LiquidTabsList as TabsList,
  LiquidTabsTrigger as TabsTrigger,
  LiquidTabsContent as TabsContent,
  LiquidTabs as Component,
}
export default LiquidTabs

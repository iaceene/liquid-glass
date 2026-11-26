"use client"

/**
 * Nimbus UI · Liquid Textarea — "Reservoir"
 * A deep recessed glass basin filled with responsive water. Focusing condenses a luminous
 * pool; typing sends gentle micro-ripples across the fluid surface; validation errors
 * physically shake the water with a ruby warning flash; and the WebGL canvas adapts
 * with height-quantized geometry to prevent flicker.
 * Water is drawn by a tiny WebGL shader (paused off-screen); without WebGL it falls
 * back to a soft recessed CSS pool. No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"
import { useLiquidContext } from "./liquid/provider"

export type LiquidTextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
  /** Field label */
  label?: React.ReactNode
  /** Descriptive helper text beneath the basin */
  helperText?: React.ReactNode
  /** Error message (triggers invalid state and water agitation) */
  error?: React.ReactNode
  /** "light" for bright backgrounds, "dark" for dark ones */
  tone?: "light" | "dark"
  /** Size scale */
  size?: "sm" | "default" | "lg"
  /** Synthesized audio plip on interactions */
  sound?: boolean
  /** Show live character counter */
  showCount?: boolean
  /** Custom container class */
  containerClassName?: string
  /** Custom container style */
  containerStyle?: React.CSSProperties
}

export type LiquidTextareaHandle = {
  focus: () => void
  blur: () => void
  shake: () => void
  textarea: HTMLTextAreaElement | null
}

const PAD = 14

/* ---------- styles ---------- */
const NA_CSS = `
.nimbus-textarea-field{
  --a-tint:rgba(255,255,255,.16);
  --a-fg:#0B132B;
  --a-soft:rgba(11,19,43,.64);
  --a-line:rgba(11,19,43,.09);
  --a-rim:rgba(255,255,255,.78);
  --a-err:#E5484D;
  --a-accent:#00A2FF;
  position:relative;display:flex;flex-direction:column;gap:6px;width:100%;isolation:isolate;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased;
}
.nimbus-textarea-field[data-tone="dark"]{
  --a-tint:rgba(10,18,40,.32);
  --a-fg:#F1F7FF;
  --a-soft:rgba(241,247,255,.66);
  --a-line:rgba(241,247,255,.12);
  --a-rim:rgba(255,255,255,.32);
}
.na-label{
  font-size:13px;font-weight:600;letter-spacing:-.01em;color:var(--a-fg);display:flex;align-items:center;gap:6px;user-select:none;
}
.na-basin{
  position:relative;display:flex;flex-direction:column;width:100%;border-radius:16px;isolation:isolate;
  box-sizing:border-box;transition:transform .2s cubic-bezier(.34,1.56,.64,1);
  padding:12px 14px;min-height:96px;
}
.nimbus-textarea-field[data-size="sm"] .na-basin{min-height:80px;padding:8px 12px;border-radius:12px}
.nimbus-textarea-field[data-size="lg"] .na-basin{min-height:128px;padding:14px 16px;border-radius:18px}

/* Glass panel - Recessed per skill §2 */
.na-glass{
  position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--a-tint);
  -webkit-backdrop-filter:blur(12px) saturate(1.2) brightness(1.06);backdrop-filter:blur(12px) saturate(1.2) brightness(1.06);
  box-shadow:inset 0 2px 6px rgba(0,40,90,.16),inset 0 -1px 1px var(--a-rim),inset 0 0 0 1px rgba(255,255,255,.24),0 1px 0 rgba(255,255,255,.45),0 8px 24px -10px rgba(0,40,90,.25);
  pointer-events:none;transition:box-shadow .2s ease;
}
.nimbus-textarea-field[data-tone="dark"] .na-glass{
  box-shadow:inset 0 2px 6px rgba(0,0,0,.35),inset 0 -1px 1px var(--a-rim),inset 0 0 0 1px rgba(255,255,255,.12),0 8px 24px -10px rgba(0,0,0,.5);
}
.nimbus-textarea-field[data-focus="true"] .na-glass{
  box-shadow:inset 0 2px 5px rgba(0,40,90,.12),inset 0 -1px 1px var(--a-rim),inset 0 0 0 1.5px var(--a-accent),0 0 0 3px rgba(0,162,255,.2),0 10px 24px -10px rgba(0,70,140,.35);
}
.nimbus-textarea-field[data-invalid="true"] .na-glass{
  box-shadow:inset 0 2px 5px rgba(180,20,30,.2),inset 0 -1px 1px var(--a-rim),inset 0 0 0 1.5px var(--a-err),0 0 0 3px rgba(229,72,77,.2);
}

/* Water canvas */
.na-water{position:absolute;left:-14px;top:-14px;z-index:-1;pointer-events:none}
.nimbus-textarea-field[data-gl="off"] .na-water{display:none}

/* Fallback CSS Pool */
.na-pool{
  display:none;position:absolute;inset:2px;border-radius:inherit;z-index:-1;pointer-events:none;
  background:radial-gradient(120% 90% at 30% 0%,rgba(255,255,255,.45),rgba(255,255,255,0) 55%),rgba(255,255,255,.18);
  box-shadow:inset 0 1px 2px rgba(255,255,255,.6),inset 0 -1px 3px rgba(0,162,255,.15);
  opacity:0;transition:opacity .25s ease;
}
.nimbus-textarea-field[data-gl="off"] .na-pool{display:block}
.nimbus-textarea-field[data-gl="off"][data-focus="true"] .na-pool{opacity:1}

/* Native textarea */
.na-native{
  position:relative;z-index:1;width:100%;height:100%;min-height:inherit;border:0;background:none;padding:0;margin:0;
  color:var(--a-fg);font-family:inherit;font-size:14px;font-weight:500;letter-spacing:-.01em;outline:none;
  resize:vertical;line-height:1.5;
}
.nimbus-textarea-field[data-size="sm"] .na-native{font-size:13px}
.nimbus-textarea-field[data-size="lg"] .na-native{font-size:15px}
.na-native::placeholder{color:var(--a-soft);opacity:.85}
.na-native:disabled{cursor:not-allowed;opacity:.5}

/* Footer / Counter */
.na-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%}
.na-err{font-size:12px;font-weight:500;color:var(--a-err);line-height:1.3;animation:naErrFade .2s ease}
.na-help{font-size:12px;font-weight:400;color:var(--a-soft);line-height:1.3}
.na-count{font-size:11px;font-weight:500;color:var(--a-soft);margin-left:auto;letter-spacing:0}
@keyframes naErrFade{from{opacity:0;transform:translateY(-2px)}to{opacity:1;transform:translateY(0)}}
@keyframes naShake{
  0%,100%{transform:translateX(0)}
  20%,60%{transform:translateX(-6px)}
  40%,80%{transform:translateX(6px)}
}
.nimbus-textarea-field[data-shaking="true"] .na-basin{
  animation:naShake .35s cubic-bezier(.36,.07,.19,.97) both;
}

@media (prefers-reduced-motion: reduce){
  .na-basin,.nimbus-textarea-field[data-shaking="true"] .na-basin{animation:none!important;transition:none!important}
}
`

/* ---------- Shader Engine ---------- */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uCard;uniform float uCardR;
uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;uniform float uFocus;uniform float uErr;uniform float uShake;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float cardD(vec2 p){vec2 h=uCard.zw*.5;return sdRB(p-uCard.xy-h,h,uCardR);}
float dropD(vec2 p){
 vec2 h=uCard.zw*.5;vec2 c=uCard.xy+h;
 vec2 q=p-c;
 q.x+=uShake*sin(p.y*.15+uTime*12.)*2.5;
 return sdRB(q,h-vec2(1.5),uCardR);
}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){
 float w=0.;
 for(int i=0;i<6;i++){
  vec4 R=uRip[i];
  if(R.w>0.){
   float x=length(p-R.xy)-R.z*240.;
   w+=R.w*exp(-R.z*1.8)*sin(x*.3)*exp(-x*x/700.);
  }
 }
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.2*exp(-dot(m,m)/1600.);
 w+=uAmb*(sin(p.x*.03+p.y*.02+uTime*1.1)*.4+sin(p.x*.08-uTime*.75+p.y*.09)*.2);
 return w;
}
float H(vec2 p){
 float dc=cardD(p);float dd=dropD(p);
 return lens(dc,16.)*2.2+lens(dd,10.)*6.5*uFocus+waves(p)*smoothstep(0.,8.,-dc);
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
 vec3 irid=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+fres*.85+p.x*.002+uTime*.035));
 float pm=smoothstep(1.,-1.,dp);float dm=smoothstep(1.,-1.,dd)*smoothstep(1.,-2.,dp);
 float sh=smoothstep(9.,-9.,dd-vec2(0.,5.).y)*(1.-dm)*pm*(.09+.06*uDark);
 vec3 c=vec3(0.,.14,.36)*sh;float a=sh;
 float pa=clamp(pm*(fres*.4+spec*.8+spec2),0.,1.);
 c=mix(vec3(1.),irid,.45*fres)*pa+c*(1.-pa);a=pa+a*(1.-pa);
 float th=lens(dd,11.);
 float cs=caus((p+n.xy*th*18.)*.085,uTime*.9);
 vec3 normalWater=mix(vec3(.80,.95,1.),vec3(.55,.82,1.),uDark);
 vec3 errWater=mix(vec3(1.,.42,.48),vec3(.85,.15,.22),uDark);
 vec3 tint=mix(normalWater,errWater,uErr);
 float rim=dm*(1.-smoothstep(0.,8.,-dd));
 float cres=dm*smoothstep(.12,.55,dot(n.xy,normalize(vec2(.55,.85))))*smoothstep(0.,3.,-dd);
 float body=.5+.5*clamp(-n.y*3.,-1.,1.);
 float da=dm*(.22+.12*body)*(1.-.35*uDark)*uFocus;vec3 dc=mix(tint,vec3(1.),body*.6);
 vec3 bw=mix(vec3(.35,.86,1.),vec3(0.,.52,.98),clamp(.5-n.y*2.+th*.3,0.,1.));
 dc=mix(dc,bw,uFocus*.6);
 float la=rim*.2;vec3 lc=mix(vec3(0.,.42,.78),vec3(.1,.55,.95),uDark);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.6+smoothstep(.6,1.,cs)*.24*th*dm*uFocus,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.1+spec2*.4)*uFocus,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,dd)*.35*uFocus;dc=mix(vec3(1.),irid,.35)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 gl_FragColor=vec4(c,a);
}`

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
  for (const n of ["uRes", "uDpr", "uTime", "uCard", "uCardR", "uRip", "uMouse", "uDark", "uAmb", "uFocus", "uErr", "uShake"]) {
    u[n] = gl.getUniformLocation(p, n)
  }
  return { gl, u }
}

export const LiquidTextarea = React.forwardRef<LiquidTextareaHandle, LiquidTextareaProps>(
  (
    {
      label,
      helperText,
      error,
      tone: propTone,
      size = "default",
      sound: propSound,
      showCount = false,
      maxLength,
      id,
      value,
      defaultValue,
      disabled,
      className,
      style,
      containerClassName,
      containerStyle,
      onFocus,
      onBlur,
      onChange,
      onKeyDown,
      onPointerDown,
      onPointerMove,
      onPointerLeave,
      ...nativeProps
    },
    forwardedRef
  ) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId
    const liquidCtx = useLiquidContext()
    const tone = propTone ?? (liquidCtx.tone === "dark" || liquidCtx.tone === "midnight" ? "dark" : "light")
    const sound = propSound ?? liquidCtx.sound
    const [focused, setFocused] = React.useState(false)
    const [shaking, setShaking] = React.useState(false)
    const [innerValue, setInnerValue] = React.useState(defaultValue || "")
    const [gl, setGl] = React.useState(true)

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
    const basinRef = React.useRef<HTMLDivElement | null>(null)
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const audioRef = React.useRef<AudioContext | null>(null)

    const currentValue = value !== undefined ? String(value) : String(innerValue)
    const charCount = currentValue.length
    const isInvalid = !!error

    const st = React.useRef({
      w: 0,
      h: 0,
      ch: 0,
      r: 16,
      rips: [] as Rip[],
      mouse: { x: 0, y: 0, s: 0, on: false },
      focus: 0,
      focusT: 0,
      err: isInvalid ? 1 : 0,
      errT: isInvalid ? 1 : 0,
      shake: 0,
      visible: true,
      reduce: false,
      raf: 0,
      last: 0,
      time: 0,
      glc: null as GLC | null,
    })

    const plip = React.useCallback(
      (f0 = 480, f1 = 1100) => {
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
          g.gain.exponentialRampToValueAtTime(0.12, t + 0.008)
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
          o.connect(g).connect(ctx.destination)
          o.start(t)
          o.stop(t + 0.16)
        } catch {
          /* optional */
        }
      },
      [sound]
    )

    const triggerShake = React.useCallback(() => {
      setShaking(true)
      st.current.shake = 1.0
      st.current.err = 1.0
      if (!st.current.reduce) {
        st.current.rips.push({
          x: PAD + st.current.w * 0.5,
          y: PAD + st.current.h * 0.5,
          age: 0,
          amp: 1.2,
        })
      }
      plip(320, 180)
      setTimeout(() => setShaking(false), 380)
    }, [plip])

    React.useImperativeHandle(forwardedRef, () => ({
      focus: () => textareaRef.current?.focus(),
      blur: () => textareaRef.current?.blur(),
      shake: triggerShake,
      get textarea() {
        return textareaRef.current
      },
    }))

    const draw = React.useCallback(() => {
      const s = st.current,
        g = s.glc
      if (!g) return
      const { gl: c, u } = g
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const W = s.w + PAD * 2,
        Hc = s.ch || s.h + PAD * 2
      c.viewport(0, 0, c.drawingBufferWidth, c.drawingBufferHeight)
      c.uniform2f(u.uRes, W, Hc)
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
      c.uniform1f(u.uFocus, s.focus)
      c.uniform1f(u.uErr, s.err)
      c.uniform1f(u.uShake, s.shake)

      c.clearColor(0, 0, 0, 0)
      c.clear(c.COLOR_BUFFER_BIT)
      c.drawArrays(c.TRIANGLES, 0, 3)
    }, [tone])

    const step = React.useCallback((dt: number) => {
      const s = st.current
      s.time += dt

      // Focus transition
      s.focus += (s.focusT - s.focus) * Math.min(1, dt * 7)
      s.err += (s.errT - s.err) * Math.min(1, dt * 6)
      s.shake += (0 - s.shake) * Math.min(1, dt * 5)

      // Ripples
      s.rips.forEach((p) => (p.age += dt))
      s.rips = s.rips.filter((p) => p.age < 2.0)

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
          Math.abs(s.focusT - s.focus) > 0.005 ||
          Math.abs(s.errT - s.err) > 0.005 ||
          s.shake > 0.01 ||
          s.rips.length > 0 ||
          s.mouse.s > 0.01
        if (s.visible && (!s.reduce || busy)) {
          s.raf = requestAnimationFrame(tick)
        } else {
          s.raf = 0
        }
      }
      s.raf = requestAnimationFrame(tick)
    }, [draw, step])

    const resize = React.useCallback(() => {
      const el = basinRef.current,
        cv = canvasRef.current
      if (!el) return
      const s = st.current
      s.w = el.offsetWidth
      s.h = el.offsetHeight
      s.r = size === "sm" ? 12 : size === "lg" ? 18 : 16
      if (cv) {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
        const W = s.w + PAD * 2,
          Hc = Math.ceil((s.h + PAD * 2) / 96) * 96 // quantize height to prevent flicker
        if (Hc !== s.ch || cv.width !== Math.round(W * dpr)) {
          s.ch = Hc
          cv.width = Math.round(W * dpr)
          cv.height = Math.round(Hc * dpr)
          cv.style.width = `${W}px`
          cv.style.height = `${Hc}px`
        }
      }
      loop()
    }, [loop, size])

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
      if (basinRef.current) {
        io.observe(basinRef.current)
        ro.observe(basinRef.current)
      }
      resize()
      return () => {
        cv?.removeEventListener("webglcontextlost", lost)
        io.disconnect()
        ro.disconnect()
        cancelAnimationFrame(s.raf)
        s.raf = 0
      }
    }, [loop, resize])

    React.useEffect(() => {
      st.current.focusT = focused ? 1.0 : 0.0
      loop()
    }, [focused, loop])

    React.useEffect(() => {
      st.current.errT = isInvalid ? 1.0 : 0.0
      if (isInvalid) triggerShake()
      loop()
    }, [isInvalid, loop, triggerShake])

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(true)
      plip(500, 800)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(false)
      onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) setInnerValue(e.target.value)
      if (!st.current.reduce) {
        st.current.rips.push({
          x: PAD + Math.min(st.current.w, 40 + (e.target.value.length % 50) * 6),
          y: PAD + 40,
          age: 0,
          amp: 0.45,
        })
        loop()
      }
      onChange?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(e)
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLTextAreaElement>) => {
      const el = basinRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const px = PAD + (e.clientX - rect.left)
        const py = PAD + (e.clientY - rect.top)
        if (!st.current.reduce) {
          st.current.rips.push({ x: px, y: py, age: 0, amp: 0.7 })
        }
        loop()
      }
      onPointerDown?.(e)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLTextAreaElement>) => {
      if (e.pointerType === "mouse") {
        const el = basinRef.current
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

    const handlePointerLeave = (e: React.PointerEvent<HTMLTextAreaElement>) => {
      st.current.mouse.on = false
      loop()
      onPointerLeave?.(e)
    }

    return (
      <div
        className={`nimbus-textarea-field ${containerClassName || ""}`}
        data-tone={tone}
        data-gl={gl ? "on" : "off"}
        data-focus={focused ? "true" : "false"}
        data-invalid={isInvalid ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        data-shaking={shaking ? "true" : undefined}
        data-size={size}
        style={containerStyle}
      >
        <style dangerouslySetInnerHTML={{ __html: NA_CSS }} />
        {label && (
          <label className="na-label" htmlFor={textareaId}>
            {label}
          </label>
        )}
        <div className="na-basin" ref={basinRef}>
          <span className="na-glass" aria-hidden="true" />
          <canvas className="na-water" ref={canvasRef} aria-hidden="true" />
          <span className="na-pool" aria-hidden="true" />
          <textarea
            ref={textareaRef}
            id={textareaId}
            className={`na-native ${className || ""}`}
            value={value !== undefined ? value : innerValue}
            maxLength={maxLength}
            disabled={disabled}
            aria-invalid={isInvalid ? "true" : undefined}
            aria-describedby={error ? `${textareaId}-err` : helperText ? `${textareaId}-help` : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={style}
            {...nativeProps}
          />
        </div>
        <div className="na-foot">
          {error && (
            <span className="na-err" id={`${textareaId}-err`} role="alert">
              {error}
            </span>
          )}
          {!error && helperText && (
            <span className="na-help" id={`${textareaId}-help`}>
              {helperText}
            </span>
          )}
          {showCount && (
            <span className="na-count">
              {charCount}
              {maxLength ? ` / ${maxLength}` : ""}
            </span>
          )}
        </div>
      </div>
    )
  }
)

LiquidTextarea.displayName = "LiquidTextarea"

/** alias for registries that import { Component } */
export { LiquidTextarea as Component }

export default LiquidTextarea

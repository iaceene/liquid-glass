"use client"

/**
 * Nimbus UI · Liquid Card — "Tidepool Slab"
 * A 3D slab of frosted glass with responsive water inside. Features optional cursor-driven
 * 3D tilt with inertia, real-time water sloshing with level simulation, caustics,
 * iridescent sheen, and rich composite slots (Header, Title, Description, Content, Footer).
 * Water is drawn by a tiny WebGL shader (paused off-screen); without WebGL it falls
 * back to a soft glossy CSS glass panel. No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type LiquidCardTheme = "sky" | "glass" | "deep" | "ruby"

export type LiquidCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** "light" for bright backgrounds, "dark" for dark ones */
  tone?: "light" | "dark"
  /** Colorway theme for the water */
  theme?: LiquidCardTheme
  /** Enable 3D tilt interaction tracking the cursor */
  tilt?: boolean
  /** Water fill level from 0 to 1 (default 0.38) */
  waterLevel?: number
  /** Whether to render active WebGL water */
  water?: boolean
  /** Enable ambient water sloshing drift */
  ambient?: boolean
}

const PAD = 14

export const CARD_PALETTES: Record<
  LiquidCardTheme,
  { a: [number, number, number]; b: [number, number, number]; w: [number, number, number]; fg: string; soft: string; rim: string }
> = {
  sky: {
    a: [0.2, 0.62, 1.0],
    b: [0.0, 0.3, 0.82],
    w: [0.5, 0.92, 1.0],
    fg: "#FFFFFF",
    soft: "rgba(255,255,255,.72)",
    rim: "rgba(255,255,255,.8)",
  },
  glass: {
    a: [0.93, 0.97, 1.0],
    b: [0.72, 0.87, 0.99],
    w: [0.2, 0.74, 1.0],
    fg: "#0B132B",
    soft: "rgba(11,19,43,.64)",
    rim: "rgba(255,255,255,.85)",
  },
  deep: {
    a: [0.09, 0.15, 0.32],
    b: [0.02, 0.04, 0.12],
    w: [0.0, 0.6, 1.0],
    fg: "#F1F7FF",
    soft: "rgba(241,247,255,.66)",
    rim: "rgba(255,255,255,.35)",
  },
  ruby: {
    a: [0.85, 0.22, 0.35],
    b: [0.45, 0.05, 0.15],
    w: [1.0, 0.45, 0.58],
    fg: "#FFFFFF",
    soft: "rgba(255,255,255,.74)",
    rim: "rgba(255,255,255,.85)",
  },
}

/* ---------- styles ---------- */
const NC_CARD_CSS = `
.nimbus-card-scene{
  position:relative;display:block;perspective:1100px;isolation:isolate;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased;
}
.nimbus-card{
  position:relative;display:flex;flex-direction:column;border-radius:24px;isolation:isolate;
  box-sizing:border-box;color:var(--c-fg);transform-style:preserve-3d;
  transition:box-shadow .3s ease;outline:none;
}
.nimbus-card-scene[data-tone="dark"] .nimbus-card{--c-rim:rgba(255,255,255,.24)}

/* Glass panel */
.nc-glass{
  position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;
  background:var(--c-tint, rgba(255,255,255,.16));
  -webkit-backdrop-filter:blur(14px) saturate(1.2) brightness(1.06);backdrop-filter:blur(14px) saturate(1.2) brightness(1.06);
  box-shadow:inset 0 1px 1px var(--c-rim, rgba(255,255,255,.8)),inset 0 0 0 1px rgba(255,255,255,.2),
             0 18px 44px -20px rgba(0,40,90,.4),0 2px 6px rgba(0,40,90,.08);
  pointer-events:none;
}
.nimbus-card-scene[data-tone="dark"] .nc-glass{
  background:var(--c-tint, rgba(10,18,40,.32));
  box-shadow:inset 0 1px 1px var(--c-rim, rgba(255,255,255,.3)),inset 0 0 0 1px rgba(255,255,255,.12),
             0 18px 44px -20px rgba(0,0,0,.7);
}

/* Water canvas */
.nc-water{position:absolute;left:-14px;top:-14px;z-index:-1;pointer-events:none}
.nimbus-card-scene[data-gl="off"] .nc-water{display:none}

/* Fallback CSS Panel */
.nc-fallback{
  display:none;position:absolute;inset:0;border-radius:inherit;z-index:-1;pointer-events:none;overflow:hidden;
  background:linear-gradient(160deg,rgba(255,255,255,.25),rgba(255,255,255,.08));
}
.nimbus-card-scene[data-gl="off"] .nc-fallback{display:block}

/* Card Slots */
.nc-header{display:flex;flex-direction:column;gap:4px;padding:22px 24px 12px;position:relative;z-index:1}
.nc-title{font-size:18px;font-weight:650;letter-spacing:-.015em;line-height:1.25;color:inherit;margin:0}
.nc-desc{font-size:13px;font-weight:450;line-height:1.4;color:var(--c-soft);margin:0}
.nc-content{padding:12px 24px;position:relative;z-index:1;flex:1 1 auto}
.nc-footer{display:flex;align-items:center;gap:12px;padding:12px 24px 22px;position:relative;z-index:1}

@media (prefers-reduced-motion: reduce){
  .nimbus-card{transform:none!important;transition:none!important}
}
`

/* ---------- Shader Engine ---------- */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec2 uTilt;uniform float uLevel;uniform float uSlope;uniform float uWave;
uniform vec3 uA;uniform vec3 uB;uniform vec3 uW;uniform float uR;uniform vec4 uRip[4];
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
float surfY(float x){
 float rip=0.;for(int i=0;i<4;i++){vec4 R=uRip[i];if(R.w>0.){float dx=abs(x-R.x)-R.z*240.;rip+=R.w*exp(-R.z*1.8)*sin(dx*.13)*exp(-dx*dx/700.);}}
 return uRes.y*(1.-uLevel)+uSlope*(x-uRes.x*.5)+uWave*sin(x*.045+uTime*2.6)+(.9+uWave*.25)*sin(x*.11-uTime*1.7)+rip*4.;
}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 vec2 c=uRes*.5;float d=sdRB(p-c,c-.5,uR);float m=smoothstep(.8,-.8,d);
 if(m<=0.){gl_FragColor=vec4(0.);return;}
 vec2 uv=p/uRes;
 vec3 col=mix(uA,uB,clamp(uv.y*.75+uv.x*.4,0.,1.));
 vec2 lp=vec2(.22-uTilt.x*.3,.15-uTilt.y*.3);vec2 q=(uv-lp)*vec2(1.5,2.3);
 col+=.16*exp(-dot(q,q)*2.5);
 float s=surfY(p.x);float sd=p.y-s;float under=smoothstep(-.8,.8,sd);float depth=clamp(sd/uRes.y,0.,1.);
 vec3 wc=mix(uW,uW*vec3(.35,.6,.85),depth*1.3);
 float cs=caus(p*.042+vec2(uSlope*3.,uTime*.05),uTime*.9);
 wc+=vec3(.8,.96,1.)*smoothstep(.55,1.,cs)*.38*(1.-depth*.7);
 col=mix(col,mix(col,wc,.74),under);
 col+=vec3(1.)*(exp(-pow(sd+1.,2.)/2.)*.75+exp(-pow(sd-3.5,2.)/12.)*.14);
 float ang=dot(uv-.5,normalize(vec2(1.,.55)))+uTilt.x*.32-uTilt.y*.22;
 vec3 irid=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+ang*1.7+uTime*.03));
 float sheen=exp(-pow((ang-.06)/.07,2.))*.2+exp(-pow((ang+.3)/.025,2.))*.1;
 col+=mix(vec3(1.),irid,.5)*sheen;
 float rim=smoothstep(-7.,0.,d);
 col=mix(col,mix(vec3(1.),irid,.65),rim*.16);
 col+=smoothstep(-1.6,0.,d)*.35*(.35+.65*(1.-uv.y));
 gl_FragColor=vec4(col*m,m);
}`

type CardGLC = { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> }
type CardRip = { x: number; y: number; age: number; amp: number }

function initCardGL(canvas: HTMLCanvasElement): CardGLC | null {
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
  for (const n of ["uRes", "uDpr", "uTime", "uTilt", "uLevel", "uSlope", "uWave", "uA", "uB", "uW", "uR", "uRip"]) {
    u[n] = gl.getUniformLocation(p, n)
  }
  return { gl, u }
}

export const LiquidCard = React.forwardRef<HTMLDivElement, LiquidCardProps>(
  (
    {
      children,
      tone = "light",
      theme = "glass",
      tilt = true,
      waterLevel = 0.38,
      water = true,
      ambient = true,
      className,
      style,
      onPointerMove,
      onPointerLeave,
      onPointerDown,
      ...divProps
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null)
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const [gl, setGl] = React.useState(true)

    React.useImperativeHandle(ref, () => cardRef.current as HTMLDivElement)

    const palette = CARD_PALETTES[theme] || CARD_PALETTES.glass

    const st = React.useRef({
      w: 0,
      h: 0,
      tx: 0,
      ty: 0,
      txT: 0,
      tyT: 0,
      slope: 0,
      rips: [] as CardRip[],
      visible: true,
      reduce: false,
      raf: 0,
      last: 0,
      time: 0,
      glc: null as CardGLC | null,
    })

    const draw = React.useCallback(() => {
      const s = st.current,
        g = s.glc
      if (!g || !water) return
      const { gl: c, u } = g
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const W = s.w + PAD * 2,
        H = s.h + PAD * 2
      c.viewport(0, 0, c.drawingBufferWidth, c.drawingBufferHeight)
      c.uniform2f(u.uRes, W, H)
      c.uniform1f(u.uDpr, dpr)
      c.uniform1f(u.uTime, s.time)
      c.uniform2f(u.uTilt, s.tx, s.ty)
      c.uniform1f(u.uLevel, waterLevel)
      c.uniform1f(u.uSlope, s.slope)
      c.uniform1f(u.uWave, ambient && !s.reduce ? 1.0 : 0.0)
      c.uniform3fv(u.uA, new Float32Array(palette.a))
      c.uniform3fv(u.uB, new Float32Array(palette.b))
      c.uniform3fv(u.uW, new Float32Array(palette.w))
      c.uniform1f(u.uR, 24)

      const rips = new Float32Array(16)
      s.rips.slice(-4).forEach((p, i) => rips.set([p.x, p.y, p.age, p.amp], i * 4))
      c.uniform4fv(u.uRip, rips)

      c.clearColor(0, 0, 0, 0)
      c.clear(c.COLOR_BUFFER_BIT)
      c.drawArrays(c.TRIANGLES, 0, 3)
    }, [ambient, palette, water, waterLevel])

    const step = React.useCallback((dt: number) => {
      const s = st.current
      s.time += dt

      if (s.reduce) {
        s.tx = 0
        s.ty = 0
        s.slope = 0
      } else {
        // Tilt springs
        s.tx += (s.txT - s.tx) * Math.min(1, dt * 8)
        s.ty += (s.tyT - s.ty) * Math.min(1, dt * 8)
        const slopeTarget = -s.tx * 0.08
        s.slope += (slopeTarget - s.slope) * Math.min(1, dt * 5)
      }

      s.rips.forEach((p) => (p.age += dt))
      s.rips = s.rips.filter((p) => p.age < 2.0)
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
        if (cardRef.current && tilt && !s.reduce) {
          cardRef.current.style.transform = `rotateX(${-s.ty * 11}deg) rotateY(${s.tx * 14}deg) rotateZ(${s.tx * 1.5}deg)`
        }
        const busy =
          Math.abs(s.txT - s.tx) > 0.005 ||
          Math.abs(s.tyT - s.ty) > 0.005 ||
          Math.abs(s.slope) > 0.005 ||
          s.rips.length > 0
        if (s.visible && (!s.reduce || busy)) {
          s.raf = requestAnimationFrame(tick)
        } else {
          s.raf = 0
        }
      }
      s.raf = requestAnimationFrame(tick)
    }, [draw, step, tilt])

    const resize = React.useCallback(() => {
      const el = cardRef.current,
        cv = canvasRef.current
      if (!el) return
      const s = st.current
      s.w = el.offsetWidth
      s.h = el.offsetHeight
      if (cv && water) {
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
    }, [loop, water])

    React.useEffect(() => {
      const s = st.current
      s.reduce = !!(typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
      const cv = canvasRef.current
      if (water && cv) {
        s.glc = initCardGL(cv)
        if (!s.glc) setGl(false)
      } else {
        setGl(false)
      }
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
      if (cardRef.current) {
        io.observe(cardRef.current)
        ro.observe(cardRef.current)
      }
      resize()
      return () => {
        cv?.removeEventListener("webglcontextlost", lost)
        io.disconnect()
        ro.disconnect()
        cancelAnimationFrame(s.raf)
        s.raf = 0
      }
    }, [loop, resize, water])

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (tilt && e.pointerType === "mouse") {
        const el = cardRef.current
        if (el) {
          const rect = el.getBoundingClientRect()
          const px = (e.clientX - rect.left) / rect.width
          const py = (e.clientY - rect.top) / rect.height
          st.current.txT = (px - 0.5) * 2
          st.current.tyT = (py - 0.5) * 2
          loop()
        }
      }
      onPointerMove?.(e)
    }

    const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
      if (tilt) {
        st.current.txT = 0
        st.current.tyT = 0
        loop()
      }
      onPointerLeave?.(e)
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      const el = cardRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const px = PAD + (e.clientX - rect.left)
        const py = PAD + (e.clientY - rect.top)
        if (!st.current.reduce) {
          st.current.rips.push({ x: px, y: py, age: 0, amp: 1.0 })
        }
        loop()
      }
      onPointerDown?.(e)
    }

    return (
      <div className="nimbus-card-scene" data-tone={tone} data-gl={gl && water ? "on" : "off"}>
        <style dangerouslySetInnerHTML={{ __html: NC_CARD_CSS }} />
        <div
          ref={cardRef}
          className={`nimbus-card ${className || ""}`}
          style={
            {
              "--c-fg": palette.fg,
              "--c-soft": palette.soft,
              "--c-rim": palette.rim,
              ...style,
            } as React.CSSProperties
          }
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          {...divProps}
        >
          <span className="nc-glass" aria-hidden="true" />
          {water && <canvas className="nc-water" ref={canvasRef} aria-hidden="true" />}
          <span className="nc-fallback" aria-hidden="true" />
          {children}
        </div>
      </div>
    )
  }
)

LiquidCard.displayName = "LiquidCard"

export const LiquidCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`nc-header ${className || ""}`} {...props}>
      {children}
    </div>
  )
)
LiquidCardHeader.displayName = "LiquidCardHeader"

export const LiquidCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={`nc-title ${className || ""}`} {...props}>
      {children}
    </h3>
  )
)
LiquidCardTitle.displayName = "LiquidCardTitle"

export const LiquidCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={`nc-desc ${className || ""}`} {...props}>
      {children}
    </p>
  )
)
LiquidCardDescription.displayName = "LiquidCardDescription"

export const LiquidCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`nc-content ${className || ""}`} {...props}>
      {children}
    </div>
  )
)
LiquidCardContent.displayName = "LiquidCardContent"

export const LiquidCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`nc-footer ${className || ""}`} {...props}>
      {children}
    </div>
  )
)
LiquidCardFooter.displayName = "LiquidCardFooter"

/** alias for registries that import { Component } */
export { LiquidCard as Component }

export default LiquidCard

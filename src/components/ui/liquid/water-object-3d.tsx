"use client"

/**
 * Nimbus UI · WaterObject3D
 * 3D glass slab with cursor tilt, idle harmonic float, spring flip, and internal sloshing water.
 */

import * as React from "react"
import { type LiquidTone, SPRING_PRESETS } from "./tokens"

export type WaterObject3DHandle = {
  splash: (x?: number, amp?: number) => void
  flip: (flipped?: boolean) => void
}

export type WaterObject3DProps = {
  tone?: LiquidTone
  width?: number
  aspectRatio?: number
  flipped?: boolean
  level?: number // 0..1
  bubbles?: boolean
  interactive?: boolean
  frontContent?: React.ReactNode
  backContent?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

const CARD_VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`
const CARD_FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec2 uTilt;uniform float uLevel;uniform float uSlope;uniform float uWave;
uniform vec3 uA;uniform vec3 uB;uniform vec3 uW;uniform float uR;uniform float uBub;uniform float uOk;uniform vec4 uRip[4];
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float surfY(float x){
 float rip=0.;for(int i=0;i<4;i++){vec4 R=uRip[i];if(R.w>0.){float dx=abs(x-R.x)-R.z*240.;rip+=R.w*exp(-R.z*1.8)*sin(dx*.13)*exp(-dx*dx/700.);}}
 return uRes.y*(1.-uLevel)+uSlope*(x-uRes.x*.5)+uWave*sin(x*.045+uTime*2.6)+(.9+uWave*.25)*sin(x*.11-uTime*1.7)+rip*4.;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 vec2 c=uRes*.5;float d=sdRB(p-c,c-.5,uR);float m=smoothstep(.8,-.8,d);
 if(m<=0.){gl_FragColor=vec4(0.);return;}
 vec2 uv=p/uRes;
 vec3 col=mix(uA,uB,clamp(uv.y*.75+uv.x*.4,0.,1.));
 vec2 lp=vec2(.22-uTilt.x*.3,.15-uTilt.y*.3);vec2 q=(uv-lp)*vec2(1.5,2.3);
 col+=.16*exp(-dot(q,q)*2.5);
 float s=surfY(p.x);
 float sd=p.y-s;
 float under=smoothstep(-.8,.8,sd);
 float depth=clamp(sd/uRes.y,0.,1.);
 vec3 wc=mix(uW,uW*vec3(.35,.6,.85),depth*1.3);
 float cs=caus(p*.042+vec2(uSlope*3.,uTime*.05),uTime*.9);
 wc+=vec3(.8,.96,1.)*smoothstep(.55,1.,cs)*.38*(1.-depth*.7);
 float bub=0.;
 for(int i=0;i<7;i++){float fi=float(i);float bx=uRes.x*(.1+.8*hash(vec2(fi,3.1)));float sp=30.+40.*hash(vec2(fi,7.7));
  float by=uRes.y-mod(uTime*sp+hash(vec2(fi,1.3))*uRes.y,uRes.y*1.2);float br=1.2+2.2*hash(vec2(fi,9.1));
  vec2 bp=p-vec2(bx+sin(uTime*2.+fi)*3.,by);float bd=length(bp)-br;
  bub+=(smoothstep(.8,-.8,bd)*.25+smoothstep(.8,0.,abs(bd))*.5)*step(s+br,by);}
 wc+=vec3(1.)*bub*uBub;
 col=mix(col,mix(col,wc,.74),under);
 col+=vec3(1.)*(exp(-pow(sd+1.,2.)/2.)*.75+exp(-pow(sd-3.5,2.)/12.)*.14);
 col=mix(col,col+vec3(-.02,.06,.03),uOk);
 float ang=dot(uv-.5,normalize(vec2(1.,.55)))+uTilt.x*.32-uTilt.y*.22;
 vec3 irid=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+ang*1.7+uTime*.03));
 float sheen=exp(-pow((ang-.06)/.07,2.))*.2+exp(-pow((ang+.3)/.025,2.))*.1;
 col+=mix(vec3(1.),irid,.5)*sheen;
 float rim=smoothstep(-7.,0.,d);
 col=mix(col,mix(vec3(1.),irid,.65),rim*.16);
 col+=smoothstep(-1.6,0.,d)*.35*(.35+.65*(1.-uv.y));
 col+=(hash(p+fract(uTime))-.5)*.014;
 gl_FragColor=vec4(col*m,m);
}`

const THEMES = {
  light: { a: [0.2, 0.62, 1], b: [0.0, 0.3, 0.82], w: [0.5, 0.92, 1], fg: "#FFFFFF", soft: "rgba(255,255,255,.72)", back: "linear-gradient(160deg,#2E9BFF,#0050CC)" },
  dark: { a: [0.09, 0.15, 0.32], b: [0.02, 0.04, 0.12], w: [0.0, 0.6, 1], fg: "#F1F7FF", soft: "rgba(241,247,255,.66)", back: "linear-gradient(160deg,#16244A,#050A1C)" },
  midnight: { a: [0.02, 0.06, 0.18], b: [0.0, 0.02, 0.08], w: [0.0, 0.8, 1], fg: "#FFFFFF", soft: "rgba(255,255,255,.75)", back: "linear-gradient(160deg,#0B1B3D,#02050E)" },
}

export const WATER_3D_CSS = `
.w3d-scene{position:relative;perspective:1100px;flex:none;-webkit-tap-highlight-color:transparent;box-sizing:border-box}
.w3d-shadow{position:absolute;left:8%;right:8%;bottom:-6%;height:30%;border-radius:50%;background:radial-gradient(closest-side,rgba(0,40,100,.42),rgba(0,40,100,0));filter:blur(14px);z-index:0;pointer-events:none}
.w3d-card{position:relative;width:100%;height:100%;transform-style:preserve-3d;will-change:transform;z-index:1}
.w3d-face{position:absolute;inset:0;border-radius:var(--w3d-r);overflow:hidden;-webkit-backface-visibility:hidden;backface-visibility:hidden;color:var(--w3d-fg)}
.w3d-front{box-shadow:inset 0 0 0 1px rgba(255,255,255,.28)}
.w3d-edge{position:absolute;inset:0;border-radius:var(--w3d-r);transform:translateZ(-2.5px);background:rgba(160,200,235,.9);box-shadow:0 0 0 .6px rgba(255,255,255,.6)}
.w3d-water{position:absolute;inset:0;display:block}
.w3d-fallback{display:none;position:absolute;inset:0}
.w3d-fallback>span{position:absolute;left:0;right:0;bottom:0;transition:height .6s ease}
.w3d-scene[data-gl="off"] .w3d-water{display:none}
.w3d-scene[data-gl="off"] .w3d-fallback{display:block}
.w3d-back{transform:translateZ(-5px) rotateY(180deg);background:var(--w3d-back);box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)}
`

export const WaterObject3D = React.forwardRef<WaterObject3DHandle, WaterObject3DProps>(function WaterObject3D(
  {
    tone = "light",
    width = 360,
    aspectRatio = 1.586,
    flipped = false,
    level = 0.45,
    bubbles = false,
    interactive = true,
    frontContent,
    backContent,
    className,
    style,
    children,
  },
  ref
) {
  const T = THEMES[tone === "midnight" ? "midnight" : tone === "dark" ? "dark" : "light"]
  const W = width,
    H = Math.round(width / aspectRatio),
    R = Math.round(width * 0.052)
  const sceneRef = React.useRef<HTMLDivElement>(null)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const shadowRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [gl, setGl] = React.useState(true)
  const [isFlipped, setIsFlipped] = React.useState(flipped)

  React.useEffect(() => {
    setIsFlipped(flipped)
  }, [flipped])

  const st = React.useRef({
    tilt: { x: 0, y: 0, vx: 0, vy: 0 },
    aim: { x: 0, y: 0, on: false },
    flip: { a: flipped ? 180 : 0, v: 0 },
    slope: { s: 0, v: 0 },
    lvl: { l: level, v: 0 },
    ok: 0,
    rips: [] as { x: number; age: number; amp: number }[],
    time: 0,
    last: 0,
    raf: 0,
    visible: true,
    reduce: false,
    glc: null as { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> } | null,
  })

  const draw = React.useCallback(() => {
    const s = st.current
    const tx = s.tilt.x,
      ty = s.tilt.y
    if (cardRef.current) {
      const roll = tx * 2.2
      cardRef.current.style.transform = `rotateX(${(-ty * 13).toFixed(3)}deg) rotateY(${(tx * 17 + s.flip.a).toFixed(3)}deg) rotateZ(${roll.toFixed(3)}deg)`
    }
    if (shadowRef.current) {
      shadowRef.current.style.transform = `translate(${(tx * 14).toFixed(2)}px, ${(18 + ty * 8).toFixed(2)}px) scale(${(0.92 - Math.abs(ty) * 0.04).toFixed(3)})`
    }
    const g = s.glc
    if (!g) return
    const { gl: c, u } = g
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2)
    c.viewport(0, 0, c.drawingBufferWidth, c.drawingBufferHeight)
    c.uniform2f(u.uRes, W, H)
    c.uniform1f(u.uDpr, dpr)
    c.uniform1f(u.uTime, s.time)
    c.uniform2f(u.uTilt, tx, ty)
    c.uniform1f(u.uLevel, s.lvl.l)
    c.uniform1f(u.uSlope, s.slope.s)
    c.uniform1f(u.uWave, s.reduce ? 0 : Math.min(1.2 + Math.abs(s.slope.v) * 6 + Math.abs(s.lvl.v) * 30, 6))
    c.uniform3fv(u.uA, T.a)
    c.uniform3fv(u.uB, T.b)
    c.uniform3fv(u.uW, T.w)
    c.uniform1f(u.uR, R)
    c.uniform1f(u.uBub, bubbles && !s.reduce ? 1 : 0)
    c.uniform1f(u.uOk, s.ok)
    const rips = new Float32Array(16)
    s.rips.slice(-4).forEach((r, i) => rips.set([r.x, 0, r.age, r.amp], i * 4))
    c.uniform4fv(u.uRip, rips)
    c.clearColor(0, 0, 0, 0)
    c.clear(c.COLOR_BUFFER_BIT)
    c.drawArrays(c.TRIANGLES, 0, 3)
  }, [W, H, R, bubbles, T])

  const step = React.useCallback(
    (dt: number) => {
      const s = st.current
      s.time += dt
      const ax = s.aim.on ? s.aim.x : s.reduce ? 0 : Math.sin(s.time * 0.7) * 0.18
      const ay = s.aim.on ? s.aim.y : s.reduce ? 0 : Math.sin(s.time * 0.53 + 1) * 0.12
      if (s.reduce) {
        s.tilt.x = ax
        s.tilt.y = ay
      } else {
        s.tilt.vx += (SPRING_PRESETS.tilt.k * (ax - s.tilt.x) - SPRING_PRESETS.tilt.c * s.tilt.vx) * dt
        s.tilt.vy += (SPRING_PRESETS.tilt.k * (ay - s.tilt.y) - SPRING_PRESETS.tilt.c * s.tilt.vy) * dt
        s.tilt.x += s.tilt.vx * dt
        s.tilt.y += s.tilt.vy * dt
      }

      const fa = isFlipped ? 180 : 0
      if (s.reduce) s.flip.a = fa
      else {
        const before = s.flip.a
        s.flip.v += (SPRING_PRESETS.flip.k * (fa - s.flip.a) - SPRING_PRESETS.flip.c * s.flip.v) * dt
        s.flip.a += s.flip.v * dt
        if (Math.abs(fa - before) > 1) s.slope.v += (s.flip.v > 0 ? 1 : -1) * dt * 1.4
      }

      const slopeT = -s.tilt.x * 0.075
      if (s.reduce) s.slope.s = slopeT
      else {
        s.slope.v += (SPRING_PRESETS.waterSlope.k * (slopeT - s.slope.s) - SPRING_PRESETS.waterSlope.c * s.slope.v) * dt
        s.slope.s += s.slope.v * dt
      }
      s.slope.s = Math.max(-0.35, Math.min(0.35, s.slope.s))

      if (s.reduce) s.lvl.l = level
      else {
        s.lvl.v += (SPRING_PRESETS.waterLevel.k * (level - s.lvl.l) - SPRING_PRESETS.waterLevel.c * s.lvl.v) * dt
        s.lvl.l += s.lvl.v * dt
      }

      s.rips.forEach((r) => (r.age += dt))
      s.rips = s.rips.filter((r) => r.age < 2)
    },
    [level, isFlipped]
  )

  const loop = React.useCallback(() => {
    const s = st.current
    if (s.raf) return
    s.last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - s.last) / 1000, 1 / 30)
      s.last = now
      step(dt)
      draw()
      const settling = Math.abs(s.flip.v) > 0.5 || Math.abs(s.lvl.v) > 0.002 || s.rips.length > 0 || s.aim.on
      if (s.visible && (!s.reduce || settling)) s.raf = requestAnimationFrame(tick)
      else s.raf = 0
    }
    s.raf = requestAnimationFrame(tick)
  }, [draw, step])

  React.useImperativeHandle(
    ref,
    () => ({
      splash: (x, amp = 1) => {
        const s = st.current
        if (s.reduce) return
        s.rips.push({ x: x ?? W / 2, age: 0, amp })
        s.lvl.v += 0.25 * amp
        loop()
      },
      flip: (f) => {
        setIsFlipped((v) => (f !== undefined ? f : !v))
        loop()
      },
    }),
    [W, loop]
  )

  React.useEffect(() => {
    const s = st.current
    s.reduce = typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const cv = canvasRef.current
    if (cv) {
      const gl = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) as WebGLRenderingContext | null
      if (gl) {
        const sh = (t: number, src: string) => {
          const s = gl.createShader(t)
          if (!s) return null
          gl.shaderSource(s, src)
          gl.compileShader(s)
          return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
        }
        const vs = sh(gl.VERTEX_SHADER, CARD_VERT),
          fs = sh(gl.FRAGMENT_SHADER, CARD_FRAG),
          p = gl.createProgram()
        if (vs && fs && p) {
          gl.attachShader(p, vs)
          gl.attachShader(p, fs)
          gl.linkProgram(p)
          if (gl.getProgramParameter(p, gl.LINK_STATUS)) {
            gl.useProgram(p)
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
            const loc = gl.getAttribLocation(p, "a")
            gl.enableVertexAttribArray(loc)
            gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
            const u: Record<string, WebGLUniformLocation | null> = {}
            for (const n of ["uRes", "uDpr", "uTime", "uTilt", "uLevel", "uSlope", "uWave", "uA", "uB", "uW", "uR", "uBub", "uOk", "uRip"]) {
              u[n] = gl.getUniformLocation(p, n)
            }
            s.glc = { gl, u }
          }
        }
      }
    }
    if (!s.glc) setGl(false)

    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting
      if (s.visible) loop()
    })
    if (sceneRef.current) io.observe(sceneRef.current)
    return () => {
      io.disconnect()
      cancelAnimationFrame(s.raf)
      s.raf = 0
    }
  }, [loop])

  React.useLayoutEffect(() => {
    const cv = canvasRef.current
    if (cv) {
      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2)
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      cv.style.width = `${W}px`
      cv.style.height = `${H}px`
    }
    draw()
    loop()
  }, [W, H, draw, loop])

  return (
    <div
      ref={sceneRef}
      className={["w3d-scene", className].filter(Boolean).join(" ")}
      data-tone={tone}
      data-gl={gl ? "on" : "off"}
      style={{
        width: W,
        height: H,
        ["--w3d-fg" as string]: T.fg,
        ["--w3d-soft" as string]: T.soft,
        ["--w3d-back" as string]: T.back,
        ["--w3d-r" as string]: `${R}px`,
        ...style,
      }}
      onPointerMove={(e) => {
        if (!interactive || e.pointerType === "touch") return
        const r = sceneRef.current?.getBoundingClientRect()
        if (!r) return
        st.current.aim.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2))
        st.current.aim.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2))
        st.current.aim.on = true
        loop()
      }}
      onPointerLeave={() => {
        st.current.aim.on = false
        loop()
      }}
      onPointerDown={(e) => {
        const r = sceneRef.current?.getBoundingClientRect()
        if (r && interactive) {
          st.current.rips.push({ x: e.clientX - r.left, age: 0, amp: 0.8 })
          loop()
        }
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: WATER_3D_CSS }} />
      <div className="w3d-shadow" ref={shadowRef} aria-hidden="true" />
      <div className="w3d-card" ref={cardRef}>
        <div className="w3d-edge" aria-hidden="true" />
        <div className="w3d-face w3d-front">
          <canvas className="w3d-water" ref={canvasRef} aria-hidden="true" />
          <div
            className="w3d-fallback"
            aria-hidden="true"
            style={{
              background: `linear-gradient(160deg, rgb(${T.a.map((v) => Math.round(v * 255)).join(",")}), rgb(${T.b.map((v) => Math.round(v * 255)).join(",")}))`,
            }}
          >
            <span style={{ height: `${Math.round(level * 100)}%`, background: `rgba(${T.w.map((v) => Math.round(v * 255)).join(",")},.55)` }} />
          </div>
          {frontContent || children}
        </div>
        <div className="w3d-face w3d-back" aria-hidden="true">
          {backContent}
        </div>
      </div>
    </div>
  )
})

export { WaterObject3D as Component }
export default WaterObject3D

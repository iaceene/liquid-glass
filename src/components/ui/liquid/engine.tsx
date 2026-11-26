"use client"

/**
 * Nimbus UI · Liquid Water Engine
 * Canonical WebGL shader, harmonic spring physics, context pooling, and gesture coordination.
 */

import * as React from "react"
import { SPRING_PRESETS, type LiquidTone } from "./tokens"

export const PAD = 14

/* ===================== Shader Sources ===================== */

export const VERT_SHADER = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`

export const FRAG_SHADER = `precision highp float;
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

/* ===================== Types ===================== */

export type Box = { x: number; y: number; w: number; h: number; vx: number; vy: number; vw: number; vh: number }
export type TargetRect = { x: number; y: number; w: number; h: number; r: number }
export type Satellite = { x: number; y: number; vx: number; vy: number; r: number; k: number }
export type WaterRipple = { x: number; y: number; age: number; amp: number }
export type WebGLContextBundle = { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> }

export const mkBox = (): Box => ({ x: 0, y: 0, w: 0, h: 0, vx: 0, vy: 0, vw: 0, vh: 0 })

/* ===================== WebGL Context Pool Manager ===================== */

const MAX_ACTIVE_CONTEXTS = 8
class WebGLContextPool {
  private activeCount = 0
  private registered = new Set<HTMLCanvasElement>()

  canAcquire(): boolean {
    return this.activeCount < MAX_ACTIVE_CONTEXTS
  }

  acquire(canvas: HTMLCanvasElement): WebGLContextBundle | null {
    if (!this.canAcquire() && !this.registered.has(canvas)) return null
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) as WebGLRenderingContext | null
    if (!gl) return null

    const sh = (t: number, src: string) => {
      const s = gl.createShader(t)
      if (!s) return null
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
    }
    const vs = sh(gl.VERTEX_SHADER, VERT_SHADER), fs = sh(gl.FRAGMENT_SHADER, FRAG_SHADER), p = gl.createProgram()
    if (!vs || !fs || !p) return null
    gl.attachShader(p, vs)
    gl.attachShader(p, fs)
    gl.linkProgram(p)
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

    if (!this.registered.has(canvas)) {
      this.registered.add(canvas)
      this.activeCount++
    }
    return { gl, u }
  }

  release(canvas: HTMLCanvasElement) {
    if (this.registered.has(canvas)) {
      this.registered.delete(canvas)
      this.activeCount = Math.max(0, this.activeCount - 1)
    }
  }
}

export const contextPool = new WebGLContextPool()

/* ===================== Audio Synthesizer ===================== */

let globalAudioCtx: AudioContext | null = null

export function playPlip(f0 = 460, f1 = 1400, gainMax = 0.14) {
  if (typeof window === "undefined") return
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = (globalAudioCtx ||= new AC())
    if (ctx.state === "suspended") ctx.resume()
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(f0, t)
    osc.frequency.exponentialRampToValueAtTime(f1, t + 0.08)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(gainMax, t + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.2)
  } catch {
    /* audio autoplay policy or unsupported */
  }
}

/* ===================== useWater Hook ===================== */

export type UseWaterOptions = {
  intensity?: number
  sound?: boolean
  panelRadius?: number
}

export function useWater(
  panelRef: React.RefObject<HTMLElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  getTarget: () => TargetRect | null,
  tone: LiquidTone = "light",
  options: UseWaterOptions = {}
) {
  const { panelRadius = 28 } = options
  const st = React.useRef({
    a: mkBox(),
    b: mkBox(),
    lead: 0 as 0 | 1,
    lagUntil: 0,
    sats: [] as Satellite[],
    rips: [] as WaterRipple[],
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
    glc: null as WebGLContextBundle | null,
  })

  const [gl, setGl] = React.useState(true)
  const targetRef = React.useRef(getTarget)
  targetRef.current = getTarget
  const darkRef = React.useRef(0)
  darkRef.current = tone === "dark" || tone === "midnight" ? 1 : 0

  const draw = React.useCallback(() => {
    const s = st.current
    const g = s.glc
    if (!g) return
    const head = s.lead === 0 ? s.a : s.b
    const tail = s.lead === 0 ? s.b : s.a
    const gap = Math.hypot(head.x - tail.x, head.y - tail.y) - (Math.min(head.w, head.h) + Math.min(tail.w, tail.h))
    const thin = Math.max(0, Math.min(1, (gap + 40) / 60))
    const T = targetRef.current()
    const R0 = T?.r ?? 14
    const shape = (B: Box, k: number) => {
      const w = B.w * (1 - k * thin)
      const h = B.h * (1 - k * 0.4 * thin)
      return { w, h, r: Math.max(0, Math.min(R0 + (Math.min(w, h) - R0) * thin, w, h)) }
    }
    const hs = shape(head, 0.25)
    const ts = shape(tail, 0.55)
    const { gl: c, u } = g
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1.75)
    c.viewport(0, 0, c.drawingBufferWidth, c.drawingBufferHeight)
    c.uniform2f(u.uRes, s.w + PAD * 2, s.ch)
    c.uniform1f(u.uDpr, dpr)
    c.uniform1f(u.uTime, s.time)
    c.uniform4f(u.uCard, PAD, PAD, s.w, s.h)
    c.uniform1f(u.uCardR, panelRadius)
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
  }, [panelRadius])

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
          const k = lead ? SPRING_PRESETS.leader.k : SPRING_PRESETS.tail.k
          const c = lead ? SPRING_PRESETS.leader.c : SPRING_PRESETS.tail.c
          const f = !lead && now < s.lagUntil ? 0.04 : 1
          B.vx += (k * (T.x - B.x) - c * B.vx) * dt * f
          B.vy += (k * (T.y - B.y) - c * B.vy) * dt * f
          B.vw += (k * (T.w - B.w) - c * B.vw) * dt * f
          B.vh += (k * (T.h - B.h) - c * B.vh) * dt * f
          B.x += B.vx * dt
          B.y += B.vy * dt
          B.w = Math.max(0, B.w + B.vw * dt)
          B.h = Math.max(0, B.h + B.vh * dt)
          if (
            Math.abs(T.x - B.x) + Math.abs(T.y - B.y) + Math.abs(T.w - B.w) + Math.abs(T.h - B.h) > 0.6 ||
            Math.abs(B.vx) + Math.abs(B.vy) + Math.abs(B.vw) > 4
          )
            still = false
        })

        const head = bodies[s.lead]
        const tail = bodies[1 - s.lead]
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
    } else {
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
    const el = panelRef.current,
      cv = canvasRef.current
    if (!el) return
    const s = st.current
    s.w = el.offsetWidth
    s.h = el.offsetHeight
    if (cv) {
      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1.75)
      const W = s.w + PAD * 2,
        Hc = Math.ceil((s.h + PAD * 2) / 96) * 96
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
    s.reduce = typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const cv = canvasRef.current
    s.glc = cv ? contextPool.acquire(cv) : null
    if (!s.glc) setGl(false)

    const lost = (e: Event) => {
      e.preventDefault()
      if (cv) contextPool.release(cv)
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
      if (cv) {
        cv.removeEventListener("webglcontextlost", lost)
        contextPool.release(cv)
      }
      io.disconnect()
      ro.disconnect()
      cancelAnimationFrame(s.raf)
      s.raf = 0
    }
  }, [canvasRef, panelRef, loop, resize])

  const flow = React.useCallback(
    (lag = SPRING_PRESETS.tail.lagMs) => {
      const s = st.current
      const T = targetRef.current()
      if (T) s.lead = Math.hypot(T.x - s.a.x, T.y - s.a.y) <= Math.hypot(T.x - s.b.x, T.y - s.b.y) ? 0 : 1
      s.lagUntil = performance.now() + lag
      s.moving = true
      s.split = false
      loop()
    },
    [loop]
  )

  const ripple = React.useCallback(
    (x: number, y: number, amp = 0.8) => {
      const s = st.current
      if (s.reduce) return
      s.rips.push({ x, y, age: 0, amp })
      loop()
    },
    [loop]
  )

  const shake = React.useCallback(() => {
    const s = st.current
    if (s.reduce) return
    const head = s.lead === 0 ? s.a : s.b
    head.vx += 420
    head.vw -= 160
    s.moving = true
    loop()
  }, [loop])

  const setBlue = React.useCallback(
    (v: number) => {
      st.current.blueT = v
      loop()
    },
    [loop]
  )

  const pointer = React.useCallback(
    (x: number, y: number, on: boolean) => {
      const s = st.current
      s.mouse.x = x
      s.mouse.y = y
      s.mouse.on = on
      loop()
    },
    [loop]
  )

  const splash = React.useCallback(
    (x?: number, amp = 1) => {
      const s = st.current
      if (s.reduce) return
      s.rips.push({ x: x ?? s.w / 2 + PAD, y: s.h / 2 + PAD, age: 0, amp })
      loop()
    },
    [loop]
  )

  return { gl, flow, ripple, shake, setBlue, pointer, loop, splash }
}

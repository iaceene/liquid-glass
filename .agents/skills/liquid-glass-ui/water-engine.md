# Nimbus water engine — canonical code to copy

Contents
1. Coordinate & uniform contract
2. Fragment shader (Pattern A/D: pool of morphing boxes)
3. `initGL`
4. `useWater` hook (generic, target-driven)
5. Pattern B variant: capsule drops on a track
6. Pattern C notes: 3D water card
7. Fallback CSS pool
8. Sound plip

---

## 1. Coordinate & uniform contract

- Shader space = **CSS pixels of the canvas**, origin top-left, canvas = component size + `PAD` (14) on every side.
- `vec2 p = vec2(gl_FragCoord.x, uRes.y*uDpr - gl_FragCoord.y)/uDpr;`
- `uRes` = canvas CSS size (w+2PAD, h+2PAD), `uDpr` = `min(devicePixelRatio, 1.75)`.
- `uCard` = `(PAD, PAD, w, h)` — the glass panel rect inside the canvas. `uCardR` = its radius (28).
- `uBox[2]` = `(cx, cy, halfW, halfH)` for head (index 0) and tail (index 1); `halfW <= 1` means "off". `uBoxR[2]` = corner radii.
- `uSat[4]` = `(x, y, r, 0)` satellite droplets; `r <= .5` means "off".
- `uRip[6]` = `(x, y, age, amp)`; `amp == 0` means "off".
- `uMouse` = `(x, y, strength)`. `uFront` = `(frontCoord, wobbleAmp, bodyIndexOrAxis)` leading-edge wobble.
- `uDark` 0/1, `uAmb` 0/1 (ambient waves), `uBlue` 0..1 (saturated "processing" water).
- Always `gl.useProgram` once, one full-screen triangle `[-1,-1, 3,-1, -1,3]`, `premultipliedAlpha: true`, output `vec4(color, alpha)` already premultiplied-compatible (colors composited with `c = dc + c*(1.-da)`).

Compositing order inside `main()` (keep it): **panel shadow → glass rim sheen → drop body tint → rim line → caustics + crescent highlight → specular → iridescent edge**.

---

## 2. Fragment shader (pool variant)

For a *vertical* pool (accordion) the wobble in `dropD` runs on `q.y`; for a *horizontal* fill (checkout/button) it runs on `q.x`. Choose the axis that matches the direction of travel.

```glsl
precision highp float;
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
}
```

How the look is built (so you can adapt it): the "height field" `H` = lensed panel edge + lensed drop + ripples/meniscus/ambient waves. Normals come from finite differences of `H`. Everything else (fresnel, two speculars, iridescent hue shift, caustics, crescent highlight, rim line, soft drop shadow) derives from the normal and the signed distances `dd` (drop) and `dp` (panel).

---

## 3. `initGL`

```ts
type GLC = { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> }

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
  for (const n of ["uRes","uDpr","uTime","uCard","uCardR","uBox","uBoxR","uSat","uRip","uMouse","uFront","uDark","uAmb","uBlue"]) u[n] = gl.getUniformLocation(p, n)
  return { gl, u }
}
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`
```

---

## 4. `useWater` hook (generic: you provide `getTarget`)

```ts
const PAD = 14
type Box = { x:number;y:number;w:number;h:number;vx:number;vy:number;vw:number;vh:number }
type Target = { x:number;y:number;w:number;h:number;r:number }          // x,y = centre; w,h = HALF extents
type Sat = { x:number;y:number;vx:number;vy:number;r:number;k:number }
type Rip = { x:number;y:number;age:number;amp:number }
const mkBox = (): Box => ({ x:0,y:0,w:0,h:0,vx:0,vy:0,vw:0,vh:0 })

function useWater(
  panelRef: React.RefObject<HTMLElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  getTarget: () => Target | null,
  tone: "light" | "dark",
) {
  const st = React.useRef({
    a: mkBox(), b: mkBox(), lead: 0 as 0|1, lagUntil: 0, sats: [] as Sat[], rips: [] as Rip[],
    mouse: { x:0, y:0, s:0, on:false }, blue: 0, blueT: 0, moving: false, split: false, ready: false,
    w: 0, h: 0, ch: 0, visible: true, reduce: false, raf: 0, last: 0, time: 0, glc: null as GLC | null,
  })
  const [gl, setGl] = React.useState(true)
  const targetRef = React.useRef(getTarget); targetRef.current = getTarget
  const darkRef = React.useRef(0); darkRef.current = tone === "dark" ? 1 : 0

  const draw = React.useCallback(() => {
    const s = st.current, g = s.glc; if (!g) return
    const head = s.lead === 0 ? s.a : s.b, tail = s.lead === 0 ? s.b : s.a
    // "thin": when head and tail are far apart the neck thins and the corner radius rounds
    const gap = Math.hypot(head.x-tail.x, head.y-tail.y) - (Math.min(head.w,head.h) + Math.min(tail.w,tail.h))
    const thin = Math.max(0, Math.min(1, (gap + 40) / 60))
    const R0 = targetRef.current()?.r ?? 14
    const shape = (B: Box, k: number) => {
      const w = B.w*(1-k*thin), h = B.h*(1-k*0.4*thin)
      return { w, h, r: Math.max(0, Math.min(R0 + (Math.min(w,h)-R0)*thin, w, h)) }
    }
    const hs = shape(head, 0.25), ts = shape(tail, 0.55)
    const { gl: c, u } = g
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    c.viewport(0, 0, c.drawingBufferWidth, c.drawingBufferHeight)
    c.uniform2f(u.uRes, s.w + PAD*2, s.ch); c.uniform1f(u.uDpr, dpr); c.uniform1f(u.uTime, s.time)
    c.uniform4f(u.uCard, PAD, PAD, s.w, s.h); c.uniform1f(u.uCardR, 28)
    const on = (B:{w:number;h:number}) => B.w > 1 && B.h > 1
    c.uniform4fv(u.uBox, new Float32Array([head.x,head.y,on(hs)?hs.w:0,hs.h, tail.x,tail.y,on(ts)?ts.w:0,ts.h]))
    c.uniform1fv(u.uBoxR, new Float32Array([hs.r, ts.r]))
    const sats = new Float32Array(16); s.sats.slice(0,4).forEach((d,i)=>sats.set([d.x,d.y,d.r,0],i*4)); c.uniform4fv(u.uSat, sats)
    const rips = new Float32Array(24); s.rips.slice(-6).forEach((p,i)=>rips.set([p.x,p.y,p.age,p.amp],i*4)); c.uniform4fv(u.uRip, rips)
    c.uniform3f(u.uMouse, s.mouse.x, s.mouse.y, s.mouse.s)
    c.uniform3f(u.uFront, head.x + head.w, s.reduce ? 0 : Math.min(Math.abs(head.vw)*0.01, 3.5), 0)
    c.uniform1f(u.uDark, darkRef.current); c.uniform1f(u.uAmb, s.reduce ? 0 : 1); c.uniform1f(u.uBlue, s.blue)
    c.clearColor(0,0,0,0); c.clear(c.COLOR_BUFFER_BIT); c.drawArrays(c.TRIANGLES, 0, 3)
  }, [])

  const step = React.useCallback((dt: number, now: number) => {
    const s = st.current; s.time += dt
    const T = targetRef.current(); let still = true
    s.blue += (s.blueT - s.blue) * Math.min(1, dt*5); if (Math.abs(s.blueT - s.blue) > 0.01) still = false
    if (T) {
      if (!s.ready) { Object.assign(s.a, T); Object.assign(s.b, T); s.ready = true }
      const bodies = [s.a, s.b]
      if (s.reduce) {
        for (const B of bodies) Object.assign(B, { x:T.x,y:T.y,w:T.w,h:T.h,vx:0,vy:0,vw:0,vh:0 }); s.sats = []
      } else {
        bodies.forEach((B, i) => {
          const lead = i === s.lead, k = lead ? 210 : 60, c = lead ? 25 : 13
          const f = !lead && now < s.lagUntil ? 0.04 : 1
          B.vx += (k*(T.x-B.x) - c*B.vx)*dt*f; B.vy += (k*(T.y-B.y) - c*B.vy)*dt*f
          B.vw += (k*(T.w-B.w) - c*B.vw)*dt*f; B.vh += (k*(T.h-B.h) - c*B.vh)*dt*f
          B.x += B.vx*dt; B.y += B.vy*dt; B.w = Math.max(0, B.w + B.vw*dt); B.h = Math.max(0, B.h + B.vh*dt)
          if (Math.abs(T.x-B.x)+Math.abs(T.y-B.y)+Math.abs(T.w-B.w)+Math.abs(T.h-B.h) > 0.6 || Math.abs(B.vx)+Math.abs(B.vy)+Math.abs(B.vw) > 4) still = false
        })
        const head = bodies[s.lead], tail = bodies[1 - s.lead]
        const dist = Math.hypot(head.x-tail.x, head.y-tail.y)
        if (!s.split && s.moving && dist > Math.min(head.w,head.h) + Math.min(tail.w,tail.h) + 6) {
          s.split = true
          ;[0.3, 0.55, 0.8].forEach((t, j) => s.sats.push({
            x: tail.x + (head.x-tail.x)*t + (Math.random()-.5)*20, y: tail.y + (head.y-tail.y)*t + (Math.random()-.5)*10,
            vx: (head.vx+tail.vx)*.3, vy: (head.vy+tail.vy)*.3, r: 7.5 - j*1.2 + Math.random()*1.5, k: 60 + Math.random()*70 }))
        }
        s.sats = s.sats.filter((d) => {
          d.vx += (d.k*(head.x-d.x) - 9*d.vx)*dt; d.vy += (d.k*(head.y-d.y) - 9*d.vy)*dt
          d.x += d.vx*dt; d.y += d.vy*dt
          if (Math.abs(head.x-d.x) < head.w*.8 && Math.abs(head.y-d.y) < head.h*.9) d.r -= dt*30   // absorbed
          return d.r > 0.6
        })
        if (s.sats.length) still = false
      }
      if (s.moving && still) { s.moving = false; if (!s.reduce) s.rips.push({ x:T.x, y:T.y, age:0, amp: s.split ? 1 : 0.5 }) }
    }
    s.rips.forEach((p) => (p.age += dt)); s.rips = s.rips.filter((p) => p.age < 2.4)
    s.mouse.s += ((s.mouse.on ? 1 : 0) - s.mouse.s) * Math.min(1, dt*7)
  }, [])

  const loop = React.useCallback(() => {
    const s = st.current; if (s.raf) return
    s.last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - s.last)/1000, 1/30); s.last = now
      step(dt, now); draw()
      const busy = s.moving || s.rips.length || s.sats.length || s.mouse.s > 0.01
      if (s.visible && (!s.reduce || busy)) s.raf = requestAnimationFrame(tick); else s.raf = 0
    }
    s.raf = requestAnimationFrame(tick)
  }, [draw, step])

  const resize = React.useCallback(() => {
    const el = panelRef.current, cv = canvasRef.current; if (!el) return
    const s = st.current; s.w = el.offsetWidth; s.h = el.offsetHeight
    if (cv) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const W = s.w + PAD*2, Hc = Math.ceil((s.h + PAD*2)/96)*96          // quantize height
      if (Hc !== s.ch || cv.width !== Math.round(W*dpr)) {
        s.ch = Hc; cv.width = Math.round(W*dpr); cv.height = Math.round(Hc*dpr)
        cv.style.width = `${W}px`; cv.style.height = `${Hc}px`
      }
    }
    loop()
  }, [panelRef, canvasRef, loop])

  React.useEffect(() => {                       // setup / teardown (see SKILL.md §5)
    const s = st.current
    s.reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const cv = canvasRef.current
    s.glc = cv ? initGL(cv) : null; if (!s.glc) setGl(false)
    const lost = (e: Event) => { e.preventDefault(); s.glc = null; setGl(false) }
    cv?.addEventListener("webglcontextlost", lost)
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; if (s.visible) loop() })
    const ro = new ResizeObserver(() => resize())
    if (panelRef.current) { io.observe(panelRef.current); ro.observe(panelRef.current) }
    resize()
    return () => { cv?.removeEventListener("webglcontextlost", lost); io.disconnect(); ro.disconnect(); cancelAnimationFrame(s.raf); s.raf = 0 }
  }, [canvasRef, panelRef, loop, resize])

  /** call whenever the target moved: stretch over there */
  const flow = React.useCallback((lag = 90) => {
    const s = st.current, T = targetRef.current()
    if (T) s.lead = Math.hypot(T.x-s.a.x, T.y-s.a.y) <= Math.hypot(T.x-s.b.x, T.y-s.b.y) ? 0 : 1
    s.lagUntil = performance.now() + lag; s.moving = true; s.split = false; loop()
  }, [loop])
  const ripple  = React.useCallback((x:number,y:number,amp:number) => { const s = st.current; if (s.reduce) return; s.rips.push({x,y,age:0,amp}); loop() }, [loop])
  const shake   = React.useCallback(() => { const s = st.current; if (s.reduce) return; const h = s.lead===0?s.a:s.b; h.vx += 420; h.vw -= 160; s.moving = true; loop() }, [loop])
  const setBlue = React.useCallback((v:number) => { st.current.blueT = v; loop() }, [loop])
  const pointer = React.useCallback((x:number,y:number,on:boolean) => { const s = st.current; s.mouse.x=x; s.mouse.y=y; s.mouse.on=on; loop() }, [loop])

  return { gl, flow, ripple, shake, setBlue, pointer, loop }
}
```

Typical usage in a component:

```tsx
const getTarget = React.useCallback((): Target | null => {
  const panel = panelRef.current, el = activeRef.current
  if (!panel || !el) return null
  const pr = panel.getBoundingClientRect(), b = el.getBoundingClientRect()
  return { x: PAD + b.left - pr.left + b.width/2, y: PAD + b.top - pr.top + b.height/2, w: b.width/2, h: b.height/2, r: 14 }
}, [/* state that changes the target */])
const water = useWater(panelRef, canvasRef, getTarget, tone)
React.useEffect(() => { if (prevKey !== key) water.flow() }, [key])          // follow state changes
// root: data-gl={water.gl ? "on" : "off"}
// panel events: onPointerMove (mouse only) → water.pointer(x+PAD, y+PAD, true); onPointerLeave → pointer(0,0,false); onPointerDown → water.ripple(x+PAD,y+PAD,.6)
```

---

## 5. Pattern B variant — capsule drops on a track

Replace `dropD` / add `sdCap`; blobs are `(cx, cy, halfLen, radius)`, `radius <= .5` = off. Squash with `uSy[i]`.

```glsl
uniform vec4 uBlob[6];uniform float uSy[6];uniform float uK;     // uK ≈ 10 (blend)
float sdCap(vec2 p,vec4 B,float sy){p-=B.xy;p.y/=sy;p.x=max(abs(p.x)-B.z,0.);return(length(p)-B.w)*min(1.,sy);}
float dropD(vec2 p){float d=1e4;for(int i=0;i<6;i++){if(uBlob[i].w>.5){d=smin(d,sdCap(p,uBlob[i],uSy[i]),uK);}}return d;}
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,h.y);}
// track water: float fillD(vec2 p){ float w=(sin(p.y*.3+uTime*5.)+.6*sin(p.y*.17-uTime*3.3))*uFill.y;
//   float f=smin(p.x-uFill.x-w, dropD(p)+3.+(1.-uFill.z)*60., 9.); return max(pillD(p)+2., f); }
```

Scale trick used by the toggle so the same constants work at any size: `S = r/21`; divide all positions by `S` before sending uniforms and in `p = ... /uDpr/uS`.

Geometry for a track of height `h`: `w = 2.1h`, `pad = .1h`, `r = h/2 - pad`, `PAD = .45h`, `xOff = PAD+pad+r`, `xOn = PAD+w-pad-r`, `cy = PAD+h/2`.

Drag logic essentials: pointer down stores `grab = x - head.x`; after 4 px movement `moved = true`, head target = clamped pointer; tail target = `home + (hT-home)*.06` (surface tension); when normalized position crosses `0.68` (off→on) or `0.32` (on→off) call `commit(next)` and push a ripple at the destination; `suppressClick` prevents the click that follows a drag.

---

## 6. Pattern C notes — 3D water card (`WaterCard`)

- Wrapper `.nc-scene{perspective:1100px}` → `.nc-card{transform-style:preserve-3d}` with `.nc-edge` at `translateZ(-2.5px)` (glass thickness) and front/back faces `backface-visibility:hidden`; back is `translateZ(-5px) rotateY(180deg)`.
- Springs: tilt `k 60, c 11` toward pointer (or a gentle idle sine drift); flip `k 150, c 17` toward 0/180°; slope `k 26, c 1.6` toward `-tilt.x*0.075`; level `k 14, c 5`.
- Transform each frame: `rotateX(-ty*13deg) rotateY(tx*17deg + flip) rotateZ(tx*2.2deg)`; soft elliptical shadow translates opposite the tilt.
- Shader draws: gradient body, light spot following tilt, a **water surface** `surfY(x)` (level + slope*(x-cx) + sine waves + ripples) with caustics, bubbles (optional), iridescent sheen band, rim light, film grain. `uOk` tints toward green on success.
- Use `live={false}` for stacked, non-front cards so only one canvas animates.

---

## 7. Fallback CSS pool (when `data-gl="off"`)

```css
.nx-pool{display:none;position:absolute;left:8px;right:8px;top:0;border-radius:20px;z-index:-1;pointer-events:none;
  transition:transform .5s cubic-bezier(.3,1.3,.4,1),height .5s cubic-bezier(.25,.9,.3,1),opacity .3s;
  background:radial-gradient(120% 90% at 30% 0%,rgba(255,255,255,.7),rgba(255,255,255,0) 55%),rgba(255,255,255,.34);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.95),inset 0 -2px 8px rgba(0,162,255,.2),inset 0 0 0 1px rgba(255,255,255,.55),0 8px 20px -10px rgba(0,70,140,.45)}
.nimbus-x[data-gl="off"] .nx-pool{display:block}
.nimbus-x[data-gl="off"] .nx-water{display:none}
```
In `draw()` when there is no GL context, position the fallback imperatively from the same target (`style.transform`, `style.height/width`, `opacity`).

Optional Chromium-only refraction on the glass: SVG `feTurbulence` + `feDisplacementMap` filter referenced by `backdrop-filter:url(#id) blur(2px) …`, enabled via `data-refract="on"` after a UA + `CSS.supports("backdrop-filter","url(#a)")` check (see navbar).

---

## 8. Sound plip

```ts
const plip = (f0 = 420 + Math.random()*80, f1 = 1500) => {
  if (!sound) return
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = (audio.current ||= new AC()); const t = ctx.currentTime
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.type = "sine"; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + 0.07)
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.15, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.18)
  } catch { /* audio is optional */ }
}
```
Rising pitch = open/on/success; falling (`620 → 380`) = off/close; low flat (`300 → 220`) = error.

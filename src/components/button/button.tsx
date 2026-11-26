'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'nimbus-button relative isolate inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium select-none transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:hover:translate-y-0 disabled:active:scale-100',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),inset_0_-1px_1px_rgba(0,0,0,0.15),0_8px_20px_-6px_rgba(0,35,80,0.35)] backdrop-blur-md border border-white/20 dark:border-white/10',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/85 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_16px_-6px_rgba(0,35,80,0.18)] backdrop-blur-md border border-white/25 dark:border-white/10',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_8px_20px_-6px_rgba(225,29,72,0.35)] backdrop-blur-md border border-white/20',
        outline:
          'border border-input bg-background/60 text-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_4px_14px_-6px_rgba(0,35,80,0.15)]',
        glass:
          'bg-white/15 dark:bg-white/10 text-foreground hover:bg-white/25 dark:hover:bg-white/20 backdrop-blur-md border border-white/30 dark:border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.65),0_8px_24px_-8px_rgba(0,35,80,0.3)]',
        ghost:
          'hover:bg-accent hover:text-accent-foreground backdrop-blur-sm shadow-none border border-transparent',
        link: 'text-primary underline-offset-4 hover:underline rounded-none shadow-none hover:translate-y-0 active:scale-100',
      },
      size: {
        default: 'h-10 px-5 text-sm gap-2',
        sm: 'h-9 px-3.5 text-xs gap-1.5',
        lg: 'h-11 px-8 text-base gap-2.5',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/* ---------- Water Shader Engine ---------- */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uPill;
uniform vec4 uBlob[6];uniform float uSy[6];uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;uniform vec3 uTint;
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
float H(vec2 p){float dp=pillD(p);float dd=dropD(p);float d=min(dp,dd);return lens(dp,uPill.w*.36)*2.4+lens(d,11.)*7.5+waves(p)*smoothstep(0.,7.,-dp);}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 float dp=pillD(p);float dd=dropD(p);
 float d=min(dp,dd);
 float h0=H(p);vec3 n=normalize(vec3(h0-H(p+vec2(1.,0.)),h0-H(p+vec2(0.,1.)),1.));
 vec3 V=vec3(0.,0.,1.);
 float spec=pow(max(dot(reflect(-normalize(vec3(-.45,-.8,.85)),n),V),0.),70.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.6,.75,.7)),n),V),0.),22.)*.3;
 float fres=clamp((1.-n.z)*4.,0.,1.);
 vec3 irid=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+fres*.85+p.x*.0028+uTime*.035));
 float pm=smoothstep(1.,-1.,dp);
 float dm=smoothstep(1.,-1.,d);
 float sh=smoothstep(9.,-9.,d-vec2(0.,5.).y)*(1.-dm)*pm*(.11+.07*uDark);
 vec3 c=vec3(0.,.14,.36)*sh;float a=sh;
 float pa=clamp(pm*(fres*.5+spec*.9+spec2),0.,1.);
 c=mix(vec3(1.),irid,.5*fres)*pa+c*(1.-pa);a=pa+a*(1.-pa);
 float th=lens(d,11.);
 float cs=caus((p+n.xy*th*18.)*.085,uTime*.9);
 vec3 tint=mix(uTint,vec3(.55,.82,1.),uDark*.35);
 float rim=dm*(1.-smoothstep(0.,8.,-d));
 float cres=dm*smoothstep(.12,.55,dot(n.xy,normalize(vec2(.55,.85))))*smoothstep(0.,3.,-d);
 float body=.5+.5*clamp(-n.y*3.,-1.,1.);
 float da=dm*(.32+.18*body)*(1.-.35*uDark);vec3 dc=mix(tint,vec3(1.),body*.6);
 float la=rim*.28;vec3 lc=mix(vec3(0.,.42,.78),vec3(.1,.55,.95),uDark);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.7+smoothstep(.6,1.,cs)*.28*th*dm,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.2+spec2*.5),0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,d)*.4;dc=mix(vec3(1.),irid,.35)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 gl_FragColor=vec4(c,a);
}`;

const PAD = 14;

type Rip = { x: number; y: number; age: number; amp: number };

function initGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', {
    premultipliedAlpha: true,
    alpha: true,
    antialias: false,
  }) as WebGLRenderingContext | null;
  if (!gl) return null;

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };

  const vs = sh(gl.VERTEX_SHADER, VERT);
  const fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;

  gl.useProgram(p);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  const loc = gl.getAttribLocation(p, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u: Record<string, WebGLUniformLocation | null> = {};
  for (const n of [
    'uRes',
    'uDpr',
    'uTime',
    'uPill',
    'uBlob',
    'uSy',
    'uRip',
    'uMouse',
    'uDark',
    'uAmb',
    'uTint',
  ]) {
    u[n] = gl.getUniformLocation(p, n);
  }
  return { gl, u };
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If true, shows a loading spinner and disables interactions.
   */
  loading?: boolean;
  /**
   * Optional custom loading label or icon.
   */
  loadingText?: React.ReactNode;
  /**
   * Visual tone override: light, dark, or inherit from theme.
   */
  tone?: 'light' | 'dark' | 'system';
  /**
   * If true, disables the tactile press ripple animation.
   */
  disableRipple?: boolean;
  /**
   * Soft synthesized "plip" water drop sound on tap.
   */
  sound?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      loading = false,
      loadingText,
      tone,
      disableRipple = false,
      sound = false,
      disabled,
      children,
      type = 'button',
      onClick,
      onPointerDown,
      onPointerMove,
      onPointerLeave,
      ...props
    },
    ref
  ) => {
    const btnRef = React.useRef<HTMLButtonElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const audio = React.useRef<AudioContext | null>(null);

    const [gl, setGl] = React.useState<'on' | 'off'>('on');
    const [cssRipples, setCssRipples] = React.useState<Ripple[]>([]);

    const state = React.useRef({
      w: 0,
      h: 0,
      time: 0,
      last: 0,
      raf: 0,
      visible: true,
      reduce: false,
      mouse: { x: 0, y: 0, s: 0, on: false },
      sy: { s: 1, v: 0 },
      rips: [] as Rip[],
      glc: null as ReturnType<typeof initGL>,
    });

    const isLink = variant === 'link';
    const isDisabled = disabled || loading;

    // React ref merging
    React.useImperativeHandle(ref, () => btnRef.current as HTMLButtonElement);

    // Audio synthesizer: soft "plip" water pop
    const plip = React.useCallback(() => {
      if (!sound) return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = (audio.current ||= new AudioCtx());
        const t = ctx.currentTime;
        const o = ctx.createOscillator();
        const gn = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(520, t);
        o.frequency.exponentialRampToValueAtTime(1400, t + 0.07);
        gn.gain.setValueAtTime(0.0001, t);
        gn.gain.exponentialRampToValueAtTime(0.12, t + 0.008);
        gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
        o.connect(gn).connect(ctx.destination);
        o.start(t);
        o.stop(t + 0.16);
      } catch {
        /* audio optional */
      }
    }, [sound]);

    // Color tint per variant
    const getTint = React.useCallback(() => {
      switch (variant) {
        case 'destructive':
          return [0.95, 0.2, 0.3];
        case 'glass':
          return [0.85, 0.95, 1.0];
        case 'secondary':
          return [0.75, 0.88, 0.98];
        case 'outline':
          return [0.8, 0.92, 1.0];
        default:
          return [0.8, 0.95, 1.0];
      }
    }, [variant]);

    // Draw frame
    const draw = React.useCallback(() => {
      const s = state.current;
      if (!s.glc || isLink || s.w <= 0 || s.h <= 0) return;
      const { gl: g, u } = s.glc;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
      g.uniform2f(u.uRes, s.w + PAD * 2, s.h + PAD * 2);
      g.uniform1f(u.uDpr, dpr);
      g.uniform1f(u.uTime, s.time);
      g.uniform4f(u.uPill, PAD, PAD, s.w, s.h);

      const r = s.h / 2;
      const cx = PAD + s.w / 2;
      const cy = PAD + s.h / 2;
      const q = Math.max(0, s.w / 2 - r);

      const blobs = new Float32Array(24);
      blobs.set([cx, cy, q, r], 0);

      const sy = new Float32Array(6).fill(1);
      sy[0] = s.sy.s;

      const rips = new Float32Array(24);
      s.rips.slice(-6).forEach((p, i) => rips.set([p.x, p.y, p.age, p.amp], i * 4));

      g.uniform4fv(u.uBlob, blobs);
      g.uniform1fv(u.uSy, sy);
      g.uniform4fv(u.uRip, rips);
      g.uniform3f(u.uMouse, s.mouse.x, s.mouse.y, s.mouse.s);
      g.uniform1f(u.uDark, tone === 'dark' ? 1 : 0);
      g.uniform1f(u.uAmb, s.reduce ? 0 : 1);
      const [tr, tg, tb] = getTint();
      g.uniform3f(u.uTint, tr, tg, tb);

      g.clearColor(0, 0, 0, 0);
      g.clear(g.COLOR_BUFFER_BIT);
      g.drawArrays(g.TRIANGLES, 0, 3);
    }, [isLink, tone, getTint]);

    // Physics step
    const step = React.useCallback((dt: number) => {
      const s = state.current;
      s.time += dt;

      // Spring squash/stretch
      s.sy.v += (280 * (1 - s.sy.s) - 16 * s.sy.v) * dt;
      s.sy.s += s.sy.v * dt;

      // Age ripples
      s.rips.forEach((p) => (p.age += dt));
      s.rips = s.rips.filter((p) => p.age < 2.5);

      // Smooth mouse presence
      s.mouse.s += ((s.mouse.on ? 1 : 0) - s.mouse.s) * Math.min(1, dt * 8);
    }, []);

    // Animation loop
    const loop = React.useCallback(() => {
      const s = state.current;
      if (s.raf) return;
      s.last = performance.now();

      const tick = (now: number) => {
        const dt = Math.min((now - s.last) / 1000, 1 / 30);
        s.last = now;
        step(dt);
        draw();

        const active =
          s.rips.length > 0 ||
          s.mouse.s > 0.01 ||
          Math.abs(s.sy.s - 1) > 0.005 ||
          Math.abs(s.sy.v) > 0.02;

        if (s.visible && (!s.reduce || active)) {
          s.raf = requestAnimationFrame(tick);
        } else {
          s.raf = 0;
        }
      };

      s.raf = requestAnimationFrame(tick);
    }, [draw, step]);

    // Measure full outer button dimensions (including padding)
    const measure = React.useCallback(() => {
      const btn = btnRef.current;
      if (!btn) return;
      const s = state.current;
      const w = btn.offsetWidth || btn.getBoundingClientRect().width;
      const h = btn.offsetHeight || btn.getBoundingClientRect().height;
      if (w > 0 && h > 0) {
        s.w = Math.round(w);
        s.h = Math.round(h);
        const cv = canvasRef.current;
        if (cv) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const W = s.w + PAD * 2;
          const H = s.h + PAD * 2;
          if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
            cv.width = Math.round(W * dpr);
            cv.height = Math.round(H * dpr);
            cv.style.width = `${W}px`;
            cv.style.height = `${H}px`;
            cv.style.left = `${-PAD}px`;
            cv.style.top = `${-PAD}px`;
          }
        }
        draw();
        loop();
      }
    }, [draw, loop]);

    // Setup WebGL and observers
    React.useEffect(() => {
      if (isLink) return;
      const s = state.current;
      s.reduce = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      const cv = canvasRef.current;
      s.glc = cv ? initGL(cv) : null;
      if (!s.glc) setGl('off');

      const lost = (e: Event) => {
        e.preventDefault();
        s.glc = null;
        setGl('off');
      };
      cv?.addEventListener('webglcontextlost', lost);

      const io = new IntersectionObserver(([entry]) => {
        s.visible = entry.isIntersecting;
        if (s.visible) loop();
      });
      if (btnRef.current) io.observe(btnRef.current);

      const ro = new ResizeObserver(() => {
        measure();
      });
      if (btnRef.current) ro.observe(btnRef.current);

      return () => {
        cv?.removeEventListener('webglcontextlost', lost);
        io.disconnect();
        ro.disconnect();
        cancelAnimationFrame(s.raf);
        s.raf = 0;
      };
    }, [isLink, measure, loop]);

    // Layout effect to measure immediately on layout / prop changes
    React.useLayoutEffect(() => {
      measure();
    });

    // Pointer events: wave generation & meniscus
    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (isDisabled) return;

      const button = btnRef.current;
      const rect = button?.getBoundingClientRect?.() ?? {
        left: 0,
        top: 0,
        width: 40,
        height: 40,
      };

      const clientX = typeof e.clientX === 'number' ? e.clientX : 0;
      const clientY = typeof e.clientY === 'number' ? e.clientY : 0;
      const x = clientX - (rect.left || 0);
      const y = clientY - (rect.top || 0);

      // Trigger WebGL water wave & squash
      const s = state.current;
      if (!s.reduce) {
        s.sy.v -= 2.2;
        s.rips.push({
          x: x + PAD,
          y: y + PAD,
          age: 0,
          amp: 1.25,
        });
        loop();
      }

      // Play soft synthesized plip water pop
      plip();

      // Fallback CSS ripple
      if (!disableRipple) {
        const rippleSize = Math.max(rect.width || 40, rect.height || 40) * 2;
        const newRipple: Ripple = {
          x: Number.isFinite(x) ? x : 0,
          y: Number.isFinite(y) ? y : 0,
          size: Number.isFinite(rippleSize) && rippleSize > 0 ? rippleSize : 80,
          id: Date.now() + Math.random(),
        };
        setCssRipples((prev) => [...prev.slice(-3), newRipple]);
      }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(e);
      if (isDisabled || isLink) return;
      const s = state.current;
      const rect = btnRef.current?.getBoundingClientRect();
      if (rect) {
        s.mouse.x = e.clientX - rect.left + PAD;
        s.mouse.y = e.clientY - rect.top + PAD;
        s.mouse.on = true;
        loop();
      }
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      const s = state.current;
      s.mouse.on = false;
      loop();
    };

    return (
      <button
        ref={btnRef}
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        data-liquid-tone={tone && tone !== 'system' ? tone : undefined}
        data-gl={gl}
        onClick={onClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        aria-busy={loading ? 'true' : undefined}
        aria-disabled={isDisabled ? 'true' : undefined}
        {...props}
      >
        {/* WebGL Water Simulation Canvas */}
        {!isLink && (
          <canvas
            ref={canvasRef}
            className="absolute pointer-events-none z-0 nt-water"
            style={{
              display: gl === 'off' ? 'none' : 'block',
            }}
            aria-hidden="true"
          />
        )}

        {/* Upper specular meniscus highlight */}
        {!isLink && (
          <span
            className="absolute inset-x-0 top-0 h-[48%] rounded-t-full bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none opacity-80 z-[1]"
            aria-hidden="true"
          />
        )}

        {/* Fallback CSS press ripple */}
        {!isLink &&
          cssRipples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none animate-liquid-ripple bg-white/40 dark:bg-white/20 z-[1]"
              style={{
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                width: ripple.size,
                height: ripple.size,
              }}
              onAnimationEnd={() =>
                setCssRipples((prev) => prev.filter((r) => r.id !== ripple.id))
              }
              aria-hidden="true"
            />
          ))}

        {/* Button Content */}
        <span className="relative z-10 inline-flex items-center justify-center">
          {loading ? (
            <>
              <Loader2
                className={cn(
                  'animate-spin',
                  size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
                  (loadingText || children) && size !== 'icon' ? 'mr-2' : ''
                )}
                aria-hidden="true"
              />
              {loadingText ?? children}
            </>
          ) : (
            children
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

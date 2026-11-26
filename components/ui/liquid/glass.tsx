"use client"

/**
 * Nimbus UI · GlassPanel
 * Frosted glass container with real backdrop blur, specular rim reflections, and soft colored shadows.
 */

import * as React from "react"
import { type LiquidTone, LIQUID_TOKENS_CSS } from "./tokens"
import { useWater, type TargetRect } from "./engine"

export type GlassPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: LiquidTone
  radius?: number
  recessed?: boolean
  water?: boolean
  getTarget?: () => TargetRect | null
  interactive?: boolean
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export const GLASS_CSS = `
${LIQUID_TOKENS_CSS}

.liquid-glass-panel {
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  border-radius: var(--lg-radius, 28px);
  color: var(--p-fg);
  -webkit-tap-highlight-color: transparent;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.lg-backdrop {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -2;
  background: var(--p-tint);
  -webkit-backdrop-filter: blur(14px) saturate(1.2) brightness(1.06);
  backdrop-filter: blur(14px) saturate(1.2) brightness(1.06);
  box-shadow: var(--p-shadow);
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: none;
}

.liquid-glass-panel[data-recessed="true"] .lg-backdrop {
  box-shadow: var(--p-shadow-recessed);
  border: 1px solid var(--p-line);
}

.lg-water-canvas {
  position: absolute;
  left: -14px;
  top: -14px;
  z-index: -1;
  pointer-events: none;
}

.liquid-glass-panel[data-gl="off"] .lg-water-canvas {
  display: none;
}

.lg-fallback-pool {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -1;
  pointer-events: none;
}

.liquid-glass-panel[data-gl="off"] .lg-fallback-pool {
  display: block;
  background: radial-gradient(120% 140% at 50% 10%, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.04));
}
`

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
  {
    tone = "light",
    radius = 28,
    recessed = false,
    water = false,
    getTarget,
    interactive = true,
    className,
    style,
    children,
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    ...props
  },
  ref
) {
  const innerRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const defaultGetTarget = React.useCallback((): TargetRect | null => {
    const el = innerRef.current
    if (!el) return null
    return {
      x: 14 + el.offsetWidth / 2,
      y: 14 + el.offsetHeight / 2,
      w: el.offsetWidth / 2,
      h: el.offsetHeight / 2,
      r: radius,
    }
  }, [radius])

  const waterEngine = useWater(innerRef, canvasRef, getTarget || defaultGetTarget, tone, {
    panelRadius: radius,
  })

  return (
    <div
      ref={innerRef}
      className={["liquid-glass-panel", className].filter(Boolean).join(" ")}
      data-tone={tone}
      data-recessed={recessed ? "true" : "false"}
      data-gl={water ? (waterEngine.gl ? "on" : "off") : "off"}
      style={{ ["--lg-radius" as string]: `${radius}px`, ...style }}
      onPointerMove={(e) => {
        if (water && interactive && e.pointerType === "mouse") {
          const r = innerRef.current?.getBoundingClientRect()
          if (r) waterEngine.pointer(e.clientX - r.left + 14, e.clientY - r.top + 14, true)
        }
        onPointerMove?.(e)
      }}
      onPointerLeave={(e) => {
        if (water) waterEngine.pointer(0, 0, false)
        onPointerLeave?.(e)
      }}
      onPointerDown={(e) => {
        if (water && interactive) {
          const r = innerRef.current?.getBoundingClientRect()
          if (r) waterEngine.ripple(e.clientX - r.left + 14, e.clientY - r.top + 14, 0.8)
        }
        onPointerDown?.(e)
      }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: GLASS_CSS }} />
      <span className="lg-backdrop" aria-hidden="true" />
      {water && (
        <>
          <canvas ref={canvasRef} className="lg-water-canvas" aria-hidden="true" />
          <span className="lg-fallback-pool" aria-hidden="true" />
        </>
      )}
      {children}
    </div>
  )
})

export { GlassPanel as Component }
export default GlassPanel

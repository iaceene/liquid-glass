"use client"

/**
 * Nimbus UI · Liquid Separator — "Waterline"
 * A shimmering fluid meniscus line carved from frosted glass. Supports horizontal
 * and vertical orientations with refractive caustic light gradient.
 * Semantic role="separator" with aria-orientation.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type LiquidSeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Line orientation */
  orientation?: "horizontal" | "vertical"
  /** Tone: "light" or "dark" */
  tone?: "light" | "dark"
  /** When true, omits accessible separator role */
  decorative?: boolean
  /** Enable dynamic light caustics shimmer */
  shimmer?: boolean
}

/* ---------- styles ---------- */
const NSP_CSS = `
.nimbus-separator{
  --sp-line:rgba(11,19,43,.09);
  --sp-rim:rgba(255,255,255,.75);
  --sp-water:rgba(0,162,255,.35);
  position:relative;flex-shrink:0;border:0;isolation:isolate;
}
.nimbus-separator[data-tone="dark"]{
  --sp-line:rgba(241,247,255,.1);
  --sp-rim:rgba(255,255,255,.25);
  --sp-water:rgba(46,184,255,.3);
}

.nimbus-separator[data-orientation="horizontal"]{
  width:100%;height:1px;margin:8px 0;
  background:linear-gradient(90deg,transparent,var(--sp-line) 15%,var(--sp-water) 50%,var(--sp-line) 85%,transparent);
  box-shadow:0 1px 0 var(--sp-rim);
}
.nimbus-separator[data-orientation="vertical"]{
  height:100%;min-height:20px;width:1px;margin:0 8px;
  background:linear-gradient(180deg,transparent,var(--sp-line) 15%,var(--sp-water) 50%,var(--sp-line) 85%,transparent);
  box-shadow:1px 0 0 var(--sp-rim);
}

/* Shimmer animation */
.nimbus-separator[data-shimmer="true"][data-orientation="horizontal"]{
  background-size:200% 100%;
  animation:nspShimmerH 4s linear infinite;
}
.nimbus-separator[data-shimmer="true"][data-orientation="vertical"]{
  background-size:100% 200%;
  animation:nspShimmerV 4s linear infinite;
}

@keyframes nspShimmerH{
  0%{background-position:100% 0}
  100%{background-position:-100% 0}
}
@keyframes nspShimmerV{
  0%{background-position:0 100%}
  100%{background-position:0 -100%}
}

@media (prefers-reduced-motion: reduce){
  .nimbus-separator{animation:none!important}
}
`

export const LiquidSeparator = React.forwardRef<HTMLDivElement, LiquidSeparatorProps>(
  (
    {
      orientation = "horizontal",
      tone = "light",
      decorative = false,
      shimmer = false,
      className,
      style,
      ...divProps
    },
    ref
  ) => {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: NSP_CSS }} />
        <div
          ref={ref}
          role={decorative ? "none" : "separator"}
          aria-orientation={decorative ? undefined : orientation}
          className={`nimbus-separator ${className || ""}`}
          data-orientation={orientation}
          data-tone={tone}
          data-shimmer={shimmer ? "true" : undefined}
          style={style}
          {...divProps}
        />
      </>
    )
  }
)

LiquidSeparator.displayName = "LiquidSeparator"

/** alias for registries that import { Component } */
export { LiquidSeparator as Component }

export default LiquidSeparator

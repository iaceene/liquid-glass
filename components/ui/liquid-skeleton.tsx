"use client"

/**
 * Nimbus UI · Liquid Skeleton — "Shimmer Current"
 * An undulating fluid caustic shimmer running across a frosted glass placeholder.
 * Supports text, circular (avatar), and rounded rectangular variants with reduced-motion support.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type LiquidSkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Shape profile */
  variant?: "text" | "circular" | "rectangular"
  /** Water tone */
  tone?: "light" | "dark"
  /** Explicit width */
  width?: string | number
  /** Explicit height */
  height?: string | number
}

/* ---------- styles ---------- */
const NSK_CSS = `
.nimbus-skeleton{
  --sk-base:rgba(255,255,255,.2);
  --sk-rim:rgba(255,255,255,.6);
  --sk-shimmer:rgba(0,162,255,.16);
  --sk-highlight:rgba(255,255,255,.45);
  position:relative;overflow:hidden;isolation:isolate;
  background:var(--sk-base);
  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  box-shadow:inset 0 1px 1px var(--sk-rim),0 2px 6px rgba(0,40,90,.06);
}
.nimbus-skeleton[data-tone="dark"]{
  --sk-base:rgba(10,18,40,.35);
  --sk-rim:rgba(255,255,255,.15);
  --sk-shimmer:rgba(46,184,255,.14);
  --sk-highlight:rgba(255,255,255,.18);
  box-shadow:inset 0 1px 1px var(--sk-rim),0 2px 6px rgba(0,0,0,.35);
}

.nimbus-skeleton[data-variant="text"]{
  height:14px;width:100%;border-radius:6px;margin:3px 0;
}
.nimbus-skeleton[data-variant="circular"]{
  border-radius:999px;width:40px;height:40px;flex-shrink:0;
}
.nimbus-skeleton[data-variant="rectangular"]{
  border-radius:14px;width:100%;height:100%;min-height:48px;
}

/* Shimmer wave */
.nimbus-skeleton::after{
  content:"";position:absolute;inset:0;
  background:linear-gradient(90deg,transparent,var(--sk-shimmer) 30%,var(--sk-highlight) 50%,var(--sk-shimmer) 70%,transparent);
  transform:translateX(-100%);
  animation:nskWave 1.8s cubic-bezier(.4,0,.2,1) infinite;
}

@keyframes nskWave{
  0%{transform:translateX(-100%)}
  100%{transform:translateX(100%)}
}

@media (prefers-reduced-motion: reduce){
  .nimbus-skeleton::after{animation:none!important;opacity:0!important}
}
`

export const LiquidSkeleton = React.forwardRef<HTMLDivElement, LiquidSkeletonProps>(
  (
    {
      variant = "text",
      tone = "light",
      width,
      height,
      className,
      style,
      ...divProps
    },
    ref
  ) => {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: NSK_CSS }} />
        <div
          ref={ref}
          aria-hidden="true"
          className={`nimbus-skeleton ${className || ""}`}
          data-variant={variant}
          data-tone={tone}
          style={{
            width,
            height,
            ...style,
          }}
          {...divProps}
        />
      </>
    )
  }
)

LiquidSkeleton.displayName = "LiquidSkeleton"

/** alias for registries that import { Component } */
export { LiquidSkeleton as Component }

export default LiquidSkeleton

"use client"

/**
 * Nimbus UI · Liquid Badge — "Dewdrop Tag"
 * A glossy water drop tag with refractive glass sheen and optional status bead.
 * Features interactive ripple feedback on tap, light and dark water tones, multiple
 * colorway variants, and accessible styling.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type LiquidBadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "glass"

export type LiquidBadgeSize = "sm" | "default" | "lg"

export type LiquidBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Water tone: "light" for bright surfaces, "dark" for deep ones */
  tone?: "light" | "dark"
  /** Visual variant palette */
  variant?: LiquidBadgeVariant
  /** Badge size */
  size?: LiquidBadgeSize
  /** Show live water droplet bead */
  dot?: boolean
  /** Whether badge responds to pointer hover/press */
  interactive?: boolean
  /** Optional icon before text */
  icon?: React.ReactNode
}

/* ---------- styles ---------- */
const NBDG_CSS = `
.nimbus-badge{
  --bd-tint:rgba(255,255,255,.2);
  --bd-fg:#0B132B;
  --bd-rim:rgba(255,255,255,.8);
  --bd-line:rgba(11,19,43,.1);
  --bd-dot:#00A2FF;
  --bd-shadow:rgba(0,40,90,.16);
  position:relative;display:inline-flex;align-items:center;justify-content:center;
  gap:5px;border-radius:999px;border:0;color:var(--bd-fg);isolation:isolate;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;
  font-weight:600;letter-spacing:-.01em;vertical-align:middle;user-select:none;
  -webkit-font-smoothing:antialiased;transition:transform .18s cubic-bezier(.34,1.56,.64,1),box-shadow .18s ease;
}
.nimbus-badge[data-tone="dark"]{
  --bd-tint:rgba(10,18,40,.36);
  --bd-fg:#F1F7FF;
  --bd-rim:rgba(255,255,255,.3);
  --bd-line:rgba(241,247,255,.12);
  --bd-dot:#2EB8FF;
  --bd-shadow:rgba(0,0,0,.5);
}

/* Sizes */
.nimbus-badge[data-size="sm"]{height:22px;padding:0 8px;font-size:11px;gap:4px}
.nimbus-badge[data-size="default"]{height:26px;padding:0 10px;font-size:12px;gap:5px}
.nimbus-badge[data-size="lg"]{height:30px;padding:0 12px;font-size:13px;gap:6px}

/* Variants */
.nimbus-badge[data-variant="primary"],
.nimbus-badge[data-variant="default"]{
  --bd-fg:#FFFFFF;
  --bd-dot:#FFFFFF;
}
.nimbus-badge[data-variant="destructive"]{
  --bd-fg:#FFFFFF;
  --bd-dot:#FFFFFF;
}
.nimbus-badge[data-variant="outline"]{
  box-shadow:inset 0 0 0 1px var(--bd-line);
}

/* Glass & Glossy Drop Layer */
.nbd-glass{
  position:absolute;inset:0;border-radius:inherit;z-index:-1;overflow:hidden;
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.7),rgba(255,255,255,0) 55%),var(--bd-tint);
  -webkit-backdrop-filter:blur(8px) saturate(1.2);backdrop-filter:blur(8px) saturate(1.2);
  box-shadow:inset 0 1px 1px var(--bd-rim),inset 0 -1px 3px rgba(0,162,255,.18),0 3px 8px -3px var(--bd-shadow);
  pointer-events:none;
}
.nimbus-badge[data-variant="primary"] .nbd-glass,
.nimbus-badge[data-variant="default"] .nbd-glass{
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.6),rgba(255,255,255,0) 55%),linear-gradient(160deg,#2EB8FF,#0060CC);
}
.nimbus-badge[data-variant="destructive"] .nbd-glass{
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.6),rgba(255,255,255,0) 55%),linear-gradient(160deg,#FF6B8B,#E5484D);
}

/* Status bead */
.nbd-dot{
  width:6px;height:6px;border-radius:999px;background:var(--bd-dot);
  box-shadow:0 0 5px var(--bd-dot);flex-shrink:0;
}
.nimbus-badge[data-size="sm"] .nbd-dot{width:5px;height:5px}

/* Interactive */
.nimbus-badge[data-interactive="true"]{cursor:pointer}
.nimbus-badge[data-interactive="true"]:hover{transform:translateY(-1px) scale(1.02)}
.nimbus-badge[data-interactive="true"]:active{transform:translateY(.5px) scale(.97)}

@media (prefers-reduced-motion: reduce){
  .nimbus-badge{transition:none!important;transform:none!important}
}
`

export const LiquidBadge = React.forwardRef<HTMLSpanElement, LiquidBadgeProps>(
  (
    {
      children,
      tone = "light",
      variant = "default",
      size = "default",
      dot = false,
      interactive = false,
      icon,
      className,
      style,
      ...badgeProps
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={`nimbus-badge ${className || ""}`}
        data-tone={tone}
        data-variant={variant}
        data-size={size}
        data-interactive={interactive ? "true" : undefined}
        style={style}
        {...badgeProps}
      >
        <style dangerouslySetInnerHTML={{ __html: NBDG_CSS }} />
        <span className="nbd-glass" aria-hidden="true" />
        {dot && <span className="nbd-dot" aria-hidden="true" />}
        {icon && <span className="nbd-icon">{icon}</span>}
        <span>{children}</span>
      </span>
    )
  }
)

LiquidBadge.displayName = "LiquidBadge"

/** alias for registries that import { Component } */
export { LiquidBadge as Component }

export default LiquidBadge

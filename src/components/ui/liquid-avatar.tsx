"use client"

/**
 * Nimbus UI · Liquid Avatar — "Bubble Lens"
 * A circular refractive glass lens with water tension rim, fallbacks with liquid initials
 * or user silhouette, image error detection, and optional live status water bead.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type LiquidAvatarSize = "sm" | "default" | "lg" | "xl"
export type LiquidAvatarStatus = "online" | "busy" | "away" | "offline"

export type LiquidAvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Image URL */
  src?: string
  /** Accessible alt text */
  alt?: string
  /** Fallback initials or node */
  fallback?: React.ReactNode
  /** "light" for bright surfaces, "dark" for deep ones */
  tone?: "light" | "dark"
  /** Size variant */
  size?: LiquidAvatarSize
  /** Online/offline status indicator */
  status?: LiquidAvatarStatus
  /** Extra luminous rim ring */
  ring?: boolean
}

/* ---------- styles ---------- */
const NAV_AV_CSS = `
.nimbus-avatar{
  --av-rim:rgba(255,255,255,.85);
  --av-tint:rgba(255,255,255,.2);
  --av-shadow:rgba(0,40,90,.25);
  position:relative;display:inline-flex;align-items:center;justify-content:center;
  border-radius:999px;isolation:isolate;flex-shrink:0;user-select:none;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;
  font-weight:650;letter-spacing:-.02em;vertical-align:middle;
  transition:transform .2s cubic-bezier(.34,1.56,.64,1);
}
.nimbus-avatar[data-tone="dark"]{
  --av-rim:rgba(255,255,255,.35);
  --av-tint:rgba(10,18,40,.38);
  --av-shadow:rgba(0,0,0,.6);
}

/* Sizes */
.nimbus-avatar[data-size="sm"]{width:32px;height:32px;font-size:12px}
.nimbus-avatar[data-size="default"]{width:42px;height:42px;font-size:15px}
.nimbus-avatar[data-size="lg"]{width:56px;height:56px;font-size:19px}
.nimbus-avatar[data-size="xl"]{width:72px;height:72px;font-size:24px}

/* Glass lens */
.nav-lens{
  position:absolute;inset:0;border-radius:inherit;z-index:2;pointer-events:none;
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.6),rgba(255,255,255,0) 60%);
  box-shadow:inset 0 1.5px 2px var(--av-rim),inset 0 -1.5px 4px rgba(0,162,255,.25),0 6px 16px -6px var(--av-shadow);
}
.nimbus-avatar[data-ring="true"] .nav-lens{
  box-shadow:inset 0 1.5px 2px var(--av-rim),inset 0 -1.5px 4px rgba(0,162,255,.35),0 0 0 2px rgba(0,162,255,.4),0 8px 20px -6px var(--av-shadow);
}

/* Image */
.nav-img{
  position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;object-fit:cover;z-index:0;
}

/* Fallback */
.nav-fallback{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  border-radius:inherit;z-index:1;background:linear-gradient(160deg,#2EB8FF,#0050CC);
  color:#FFFFFF;text-transform:uppercase;overflow:hidden;
}
.nimbus-avatar[data-tone="dark"] .nav-fallback{
  background:linear-gradient(160deg,#183260,#081226);color:#F1F7FF;
}

/* Status bead */
.nav-status{
  position:absolute;right:0;bottom:0;border-radius:999px;z-index:3;
  box-shadow:0 0 0 2px #FFFFFF,0 2px 4px rgba(0,0,0,.2);
}
.nimbus-avatar[data-tone="dark"] .nav-status{
  box-shadow:0 0 0 2px #0B132B,0 2px 4px rgba(0,0,0,.5);
}
.nimbus-avatar[data-size="sm"] .nav-status{width:8px;height:8px}
.nimbus-avatar[data-size="default"] .nav-status{width:11px;height:11px}
.nimbus-avatar[data-size="lg"] .nav-status{width:14px;height:14px}
.nimbus-avatar[data-size="xl"] .nav-status{width:17px;height:17px}

.nav-status[data-state="online"]{background:#10B981;box-shadow:0 0 0 2px #FFF,0 0 8px #10B981}
.nav-status[data-state="busy"]{background:#EF4444}
.nav-status[data-state="away"]{background:#F59E0B}
.nav-status[data-state="offline"]{background:#94A3B8}

.nimbus-avatar:hover{transform:scale(1.04)}
`

export const LiquidAvatar = React.forwardRef<HTMLDivElement, LiquidAvatarProps>(
  (
    {
      src,
      alt = "Avatar",
      fallback,
      tone = "light",
      size = "default",
      status,
      ring = false,
      className,
      style,
      ...divProps
    },
    ref
  ) => {
    const [imgErr, setImgErr] = React.useState(false)
    const showImg = !!src && !imgErr

    return (
      <div
        ref={ref}
        className={`nimbus-avatar ${className || ""}`}
        data-tone={tone}
        data-size={size}
        data-ring={ring ? "true" : undefined}
        style={style}
        {...divProps}
      >
        <style dangerouslySetInnerHTML={{ __html: NAV_AV_CSS }} />
        <span className="nav-lens" aria-hidden="true" />
        {showImg && (
          <img
            src={src}
            alt={alt}
            className="nav-img"
            onError={() => setImgErr(true)}
          />
        )}
        {!showImg && (
          <span className="nav-fallback" aria-label={alt}>
            {fallback || (
              <svg viewBox="0 0 24 24" width="55%" height="55%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </span>
        )}
        {status && (
          <span
            className="nav-status"
            data-state={status}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    )
  }
)

LiquidAvatar.displayName = "LiquidAvatar"

/** alias for registries that import { Component } */
export { LiquidAvatar as Component }

export default LiquidAvatar

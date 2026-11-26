"use client"

/**
 * Nimbus UI · Liquid Tooltip — "Dewdrop"
 * A light glass bead hovering gently above or beside the trigger element with a liquid
 * refraction sheen and droplet pointer. Smoothly fades and expands on hover or focus.
 * Respects reduced motion, ESC key, delays, and accessible tooltip ARIA attributes.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type TooltipSide = "top" | "bottom" | "left" | "right"
export type TooltipTone = "light" | "dark" | "midnight" | "aurora" | "sunset" | "rose" | "emerald"

export type LiquidTooltipProps = {
  content: React.ReactNode
  children: React.ReactElement
  side?: TooltipSide
  delayDuration?: number
  tone?: TooltipTone
  className?: string
  style?: React.CSSProperties
}

/* ---------- styles ---------- */
const NTT_CSS = `
.nimbus-tooltip-root{position:relative;display:inline-block}

.nimbus-tooltip{--tt-tint:rgba(255,255,255,.32);--tt-fg:#0B132B;--tt-rim:rgba(255,255,255,.9);
  position:absolute;z-index:9999;padding:6px 12px;border-radius:12px;isolation:isolate;pointer-events:none;white-space:nowrap;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  font-size:12px;font-weight:550;letter-spacing:-.01em;color:var(--tt-fg);line-height:1.3;
  animation:nttPop .2s cubic-bezier(.34,1.56,.64,1) both}
.nimbus-tooltip[data-tone="dark"]{--tt-tint:rgba(12,22,48,.5);--tt-fg:#F1F7FF;--tt-rim:rgba(255,255,255,.36)}
.nimbus-tooltip[data-tone="midnight"]{--tt-tint:rgba(4,7,16,.75);--tt-fg:#FFFFFF;--tt-rim:rgba(0,210,255,.55)}
.nimbus-tooltip[data-tone="aurora"]{--tt-tint:rgba(12,28,42,.68);--tt-fg:#F0FDF4;--tt-rim:rgba(52,211,153,.6)}
.nimbus-tooltip[data-tone="sunset"]{--tt-tint:rgba(38,18,8,.65);--tt-fg:#FFFBEB;--tt-rim:rgba(251,191,36,.6)}
.nimbus-tooltip[data-tone="rose"]{--tt-tint:rgba(40,12,28,.65);--tt-fg:#FFF1F2;--tt-rim:rgba(244,63,94,.6)}
.nimbus-tooltip[data-tone="emerald"]{--tt-tint:rgba(6,32,24,.65);--tt-fg:#ECFDF5;--tt-rim:rgba(16,185,129,.6)}

.ntt-glass{position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--tt-tint);
  -webkit-backdrop-filter:blur(14px) saturate(1.25) brightness(1.08);backdrop-filter:blur(14px) saturate(1.25) brightness(1.08);
  box-shadow:inset 0 1px 1px var(--tt-rim),inset 0 0 0 1px rgba(255,255,255,.35),0 10px 24px -8px rgba(0,40,90,.45),0 2px 5px rgba(0,40,90,.1)}
.nimbus-tooltip[data-tone="dark"] .ntt-glass{box-shadow:inset 0 1px 1px var(--tt-rim),inset 0 0 0 1px rgba(255,255,255,.18),0 12px 28px -8px rgba(0,0,0,.7)}
.nimbus-tooltip[data-tone="midnight"] .ntt-glass{box-shadow:inset 0 1px 1px var(--tt-rim),inset 0 0 0 1px rgba(0,210,255,.25),0 12px 28px -8px rgba(0,0,0,.85),0 0 8px rgba(0,210,255,.15)}
.nimbus-tooltip[data-tone="aurora"] .ntt-glass{box-shadow:inset 0 1px 1px var(--tt-rim),inset 0 0 0 1px rgba(52,211,153,.25),0 12px 28px -8px rgba(0,0,0,.75)}
.nimbus-tooltip[data-tone="sunset"] .ntt-glass{box-shadow:inset 0 1px 1px var(--tt-rim),inset 0 0 0 1px rgba(251,191,36,.25),0 12px 28px -8px rgba(0,0,0,.75)}
.nimbus-tooltip[data-tone="rose"] .ntt-glass{box-shadow:inset 0 1px 1px var(--tt-rim),inset 0 0 0 1px rgba(244,63,94,.25),0 12px 28px -8px rgba(0,0,0,.75)}
.nimbus-tooltip[data-tone="emerald"] .ntt-glass{box-shadow:inset 0 1px 1px var(--tt-rim),inset 0 0 0 1px rgba(16,185,129,.25),0 12px 28px -8px rgba(0,0,0,.75)}

.ntt-sheen{position:absolute;inset:0;border-radius:inherit;z-index:-1;pointer-events:none;
  background:radial-gradient(120% 120% at 30% 0%,rgba(255,255,255,.45),rgba(255,255,255,0) 60%)}

.ntt-arrow{position:absolute;width:8px;height:8px;transform:rotate(45deg);background:inherit;border-radius:2px;z-index:-2;
  box-shadow:inset 0 1px 1px var(--tt-rim)}
.nimbus-tooltip[data-side="top"] .ntt-arrow{bottom:-4px;left:50%;margin-left:-4px;border-right:1px solid rgba(255,255,255,.2);border-bottom:1px solid rgba(255,255,255,.2)}
.nimbus-tooltip[data-side="bottom"] .ntt-arrow{top:-4px;left:50%;margin-left:-4px;border-left:1px solid rgba(255,255,255,.3);border-top:1px solid rgba(255,255,255,.3)}
.nimbus-tooltip[data-side="left"] .ntt-arrow{right:-4px;top:50%;margin-top:-4px;border-top:1px solid rgba(255,255,255,.2);border-right:1px solid rgba(255,255,255,.2)}
.nimbus-tooltip[data-side="right"] .ntt-arrow{left:-4px;top:50%;margin-top:-4px;border-bottom:1px solid rgba(255,255,255,.2);border-left:1px solid rgba(255,255,255,.2)}

.nimbus-tooltip[data-side="top"]{bottom:calc(100% + 8px);left:50%;transform:translateX(-50%)}
.nimbus-tooltip[data-side="bottom"]{top:calc(100% + 8px);left:50%;transform:translateX(-50%)}
.nimbus-tooltip[data-side="left"]{right:calc(100% + 8px);top:50%;transform:translateY(-50%)}
.nimbus-tooltip[data-side="right"]{left:calc(100% + 8px);top:50%;transform:translateY(-50%)}

@keyframes nttPop{from{opacity:0;transform:scale(.88) var(--tt-shift, translateY(0))}to{opacity:1;transform:scale(1) var(--tt-shift, translateY(0))}}

@media (prefers-reduced-motion:reduce){
  .nimbus-tooltip{animation:none!important}
}
`

export function LiquidTooltip({
  content,
  children,
  side = "top",
  delayDuration = 180,
  tone = "light",
  className = "",
  style,
}: LiquidTooltipProps) {
  const [open, setOpen] = React.useState(false)
  const timerRef = React.useRef<number | null>(null)
  const tooltipId = React.useId()

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setOpen(true), delayDuration)
  }

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpen(false)
  }

  const handleFocus = () => setOpen(true)
  const handleBlur = () => setOpen(false)

  // Escape key dismisses
  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  const trigger = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouseEnter()
      children.props.onMouseEnter?.(e)
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouseLeave()
      children.props.onMouseLeave?.(e)
    },
    onFocus: (e: React.FocusEvent) => {
      handleFocus()
      children.props.onFocus?.(e)
    },
    onBlur: (e: React.FocusEvent) => {
      handleBlur()
      children.props.onBlur?.(e)
    },
    "aria-describedby": open ? tooltipId : undefined,
  })

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NTT_CSS }} />
      <span className="nimbus-tooltip-root">
        {trigger}
        {open && (
          <div
            id={tooltipId}
            role="tooltip"
            data-side={side}
            data-tone={tone}
            className={`nimbus-tooltip ${className}`}
            style={style}
          >
            <span className="ntt-glass" aria-hidden="true" />
            <span className="ntt-sheen" aria-hidden="true" />
            <span className="ntt-arrow" aria-hidden="true" />
            {content}
          </div>
        )}
      </span>
    </>
  )
}

export { LiquidTooltip as Tooltip, LiquidTooltip as Component }
export default LiquidTooltip

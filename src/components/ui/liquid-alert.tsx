"use client"

/**
 * Nimbus UI · Liquid Alert — "Surface Beacon"
 * A glass callout banner with a living status droplet indicator that pulses and ripples,
 * conveying essential information with fluid elegance.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type AlertVariant = "default" | "info" | "success" | "warning" | "destructive"
export type AlertTone = "light" | "dark" | "midnight" | "aurora" | "sunset" | "rose" | "emerald"

export type LiquidAlertProps = {
  variant?: AlertVariant
  tone?: AlertTone
  icon?: React.ReactNode
  title?: React.ReactNode
  children?: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
  style?: React.CSSProperties
}

export type LiquidAlertTitleProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export type LiquidAlertDescriptionProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/* ---------- styles ---------- */
const NAL_CSS = `
.nimbus-alert{--al-tint:rgba(255,255,255,.18);--al-fg:#0B132B;--al-soft:rgba(11,19,43,.64);--al-rim:rgba(255,255,255,.8);--al-dot:#00A2FF;
  position:relative;display:flex;align-items:flex-start;gap:12px;box-sizing:border-box;width:100%;padding:14px 18px;
  border-radius:20px;isolation:isolate;font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;color:var(--al-fg);line-height:1.45}
.nimbus-alert[data-tone="dark"]{--al-tint:rgba(10,18,40,.38);--al-fg:#F1F7FF;--al-soft:rgba(241,247,255,.66);--al-rim:rgba(255,255,255,.32)}
.nimbus-alert[data-tone="midnight"]{--al-tint:rgba(4,7,16,.65);--al-fg:#FFFFFF;--al-soft:rgba(255,255,255,.68);--al-rim:rgba(0,210,255,.5)}
.nimbus-alert[data-tone="aurora"]{--al-tint:rgba(12,28,42,.6);--al-fg:#F0FDF4;--al-soft:rgba(240,253,244,.72);--al-rim:rgba(52,211,153,.55)}
.nimbus-alert[data-tone="sunset"]{--al-tint:rgba(38,18,8,.6);--al-fg:#FFFBEB;--al-soft:rgba(254,243,199,.75);--al-rim:rgba(251,191,36,.55)}
.nimbus-alert[data-tone="rose"]{--al-tint:rgba(40,12,28,.6);--al-fg:#FFF1F2;--al-soft:rgba(255,228,230,.75);--al-rim:rgba(244,63,94,.55)}
.nimbus-alert[data-tone="emerald"]{--al-tint:rgba(6,32,24,.6);--al-fg:#ECFDF5;--al-soft:rgba(209,250,229,.75);--al-rim:rgba(16,185,129,.55)}

.nimbus-alert[data-variant="info"]{--al-dot:#00A2FF}
.nimbus-alert[data-variant="success"]{--al-dot:#10B981}
.nimbus-alert[data-variant="warning"]{--al-dot:#F59E0B}
.nimbus-alert[data-variant="destructive"]{--al-dot:#EF4444}

.nal-glass{position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--al-tint);
  -webkit-backdrop-filter:blur(14px) saturate(1.2) brightness(1.06);backdrop-filter:blur(14px) saturate(1.2) brightness(1.06);
  box-shadow:inset 0 1px 1px var(--al-rim),inset 0 0 0 1px rgba(255,255,255,.2),0 12px 28px -10px rgba(0,40,90,.35),0 2px 6px rgba(0,40,90,.06)}
.nimbus-alert[data-tone="dark"] .nal-glass{box-shadow:inset 0 1px 1px var(--al-rim),inset 0 0 0 1px rgba(255,255,255,.12),0 14px 32px -10px rgba(0,0,0,.6)}
.nimbus-alert[data-tone="midnight"] .nal-glass{box-shadow:inset 0 1px 1px var(--al-rim),inset 0 0 0 1px rgba(0,210,255,.2),0 16px 36px -10px rgba(0,0,0,.85),0 0 12px rgba(0,210,255,.12)}
.nimbus-alert[data-tone="aurora"] .nal-glass{box-shadow:inset 0 1px 1px var(--al-rim),inset 0 0 0 1px rgba(52,211,153,.2),0 14px 32px -10px rgba(0,0,0,.7)}
.nimbus-alert[data-tone="sunset"] .nal-glass{box-shadow:inset 0 1px 1px var(--al-rim),inset 0 0 0 1px rgba(245,158,11,.2),0 14px 32px -10px rgba(0,0,0,.7)}
.nimbus-alert[data-tone="rose"] .nal-glass{box-shadow:inset 0 1px 1px var(--al-rim),inset 0 0 0 1px rgba(244,63,94,.2),0 14px 32px -10px rgba(0,0,0,.7)}
.nimbus-alert[data-tone="emerald"] .nal-glass{box-shadow:inset 0 1px 1px var(--al-rim),inset 0 0 0 1px rgba(16,185,129,.2),0 14px 32px -10px rgba(0,0,0,.7)}

.nal-icon{position:relative;flex:none;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;
  color:var(--al-dot);border-radius:50%;background:radial-gradient(circle at 35% 35%,rgba(255,255,255,.6),transparent 65%),rgba(0,162,255,.15);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.8),0 2px 8px -2px var(--al-dot)}
.nal-icon svg{width:15px;height:15px}

.nal-content{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.nal-title{margin:0;font-size:14px;font-weight:650;letter-spacing:-.01em;color:var(--al-fg)}
.nal-description{margin:0;font-size:13px;color:var(--al-soft);line-height:1.45}

.nal-dismiss{position:relative;flex:none;width:22px;height:22px;border:0;border-radius:50%;padding:0;background:none;
  display:inline-flex;align-items:center;justify-content:center;color:var(--al-soft);cursor:pointer;outline:none;
  transition:color .15s ease,transform .15s ease}
.nal-dismiss:hover{color:var(--al-fg);transform:scale(1.1)}
.nal-dismiss:focus-visible{outline:2px solid #00A2FF}
`

export function LiquidAlert({
  variant = "default",
  tone = "light",
  icon,
  title,
  children,
  dismissible = false,
  onDismiss,
  className = "",
  style,
  ...props
}: LiquidAlertProps) {
  const [dismissed, setDismissed] = React.useState(false)

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  const defaultIcon =
    variant === "success" ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ) : variant === "warning" ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ) : variant === "destructive" ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NAL_CSS }} />
      <div
        role="alert"
        data-variant={variant}
        data-tone={tone}
        className={`nimbus-alert ${className}`}
        style={style}
        {...props}
      >
        <span className="nal-glass" aria-hidden="true" />
        <div className="nal-icon" aria-hidden="true">
          {icon || defaultIcon}
        </div>
        <div className="nal-content">
          {title && <h5 className="nal-title">{title}</h5>}
          {children && <div className="nal-description">{children}</div>}
        </div>
        {dismissible && (
          <button
            type="button"
            className="nal-dismiss"
            aria-label="Dismiss alert"
            onClick={handleDismiss}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </>
  )
}

export function LiquidAlertTitle({ children, className = "", style, ...props }: LiquidAlertTitleProps) {
  return (
    <h5 className={`nal-title ${className}`} style={style} {...props}>
      {children}
    </h5>
  )
}

export function LiquidAlertDescription({ children, className = "", style, ...props }: LiquidAlertDescriptionProps) {
  return (
    <div className={`nal-description ${className}`} style={style} {...props}>
      {children}
    </div>
  )
}

export {
  LiquidAlert as Alert,
  LiquidAlertTitle as AlertTitle,
  LiquidAlertDescription as AlertDescription,
  LiquidAlert as Component,
}
export default LiquidAlert

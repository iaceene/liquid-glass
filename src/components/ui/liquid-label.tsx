"use client"

/**
 * Nimbus UI · Liquid Label — "Condensation"
 * A delicate typography component with liquid-glass accents. Supports required
 * water bead indicators, optional descriptions, interactive hover dewdrop highlights,
 * tone theming, and full accessibility.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type LiquidLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  /** "light" for bright backgrounds, "dark" for dark ones */
  tone?: "light" | "dark"
  /** Show liquid required indicator bead */
  required?: boolean
  /** Show optional badge text */
  optional?: boolean
  /** Subtitle or description beneath the label */
  description?: React.ReactNode
  /** Additional pill badge */
  badge?: React.ReactNode
  /** Size scale */
  size?: "sm" | "default" | "lg"
}

/* ---------- styles ---------- */
const NL_CSS = `
.nimbus-label{
  --l-fg:#0B132B;
  --l-soft:rgba(11,19,43,.62);
  --l-bead:#00A2FF;
  --l-bead-rim:rgba(255,255,255,.9);
  --l-badge-bg:rgba(0,162,255,.1);
  --l-badge-fg:#0077CC;
  display:inline-flex;flex-direction:column;gap:3px;user-select:none;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;cursor:pointer;
}
.nimbus-label[data-tone="dark"]{
  --l-fg:#F1F7FF;
  --l-soft:rgba(241,247,255,.64);
  --l-bead:#2EB8FF;
  --l-bead-rim:rgba(255,255,255,.6);
  --l-badge-bg:rgba(0,162,255,.18);
  --l-badge-fg:#66CCFF;
}
.nimbus-label[data-disabled="true"]{cursor:not-allowed;opacity:.5}

.nl-row{display:inline-flex;align-items:center;gap:6px;width:100%}

/* Typography sizes */
.nimbus-label[data-size="sm"] .nl-text{font-size:12px;font-weight:600}
.nimbus-label[data-size="default"] .nl-text{font-size:13px;font-weight:600}
.nimbus-label[data-size="lg"] .nl-text{font-size:15px;font-weight:650}

.nl-text{
  color:var(--l-fg);letter-spacing:-.01em;line-height:1.3;
  transition:color .15s ease;display:inline-flex;align-items:center;gap:6px;
}

/* Required water bead */
.nl-bead{
  display:inline-block;width:6px;height:6px;border-radius:999px;
  background:radial-gradient(circle at 35% 35%,#FFFFFF,var(--l-bead) 65%);
  box-shadow:inset 0 1px 1px var(--l-bead-rim),0 1px 3px rgba(0,162,255,.45);
  flex-shrink:0;vertical-align:middle;
}

/* Optional text & badge */
.nl-opt{
  font-size:11px;font-weight:500;color:var(--l-soft);letter-spacing:0;
}
.nl-badge{
  font-size:10px;font-weight:600;padding:1px 6px;border-radius:999px;
  background:var(--l-badge-bg);color:var(--l-badge-fg);
  border:1px solid rgba(0,162,255,.2);line-height:1.2;
}

/* Description */
.nl-desc{
  font-size:12px;font-weight:400;color:var(--l-soft);line-height:1.35;
}
`

export const LiquidLabel = React.forwardRef<HTMLLabelElement, LiquidLabelProps>(
  (
    {
      children,
      tone = "light",
      size = "default",
      required = false,
      optional = false,
      description,
      badge,
      className,
      style,
      ...labelProps
    },
    ref
  ) => {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: NL_CSS }} />
        <label
          ref={ref}
          className={`nimbus-label ${className || ""}`}
          data-tone={tone}
          data-size={size}
          style={style}
          {...labelProps}
        >
          <span className="nl-row">
            <span className="nl-text">
              {children}
              {required && <span className="nl-bead" aria-hidden="true" title="Required" />}
            </span>
            {optional && !required && <span className="nl-opt">(optional)</span>}
            {badge && <span className="nl-badge">{badge}</span>}
          </span>
          {description && <span className="nl-desc">{description}</span>}
        </label>
      </>
    )
  }
)

LiquidLabel.displayName = "LiquidLabel"

/** alias for registries that import { Component } */
export { LiquidLabel as Component }

export default LiquidLabel

"use client"

/**
 * Nimbus UI · Liquid Checkbox — "Water Droplet Check"
 * A glass reservoir checkbox. When clicked, water fills the basin with a meniscus ripple,
 * revealing an iridescent checkmark droplet. Tap wave, space bar toggling, sound plip,
 * form submission support, and full ARIA checkbox role.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type CheckboxTone = "light" | "dark" | "midnight" | "aurora" | "sunset" | "rose" | "emerald"

export type LiquidCheckboxProps = {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string
  id?: string
  tone?: CheckboxTone
  size?: "sm" | "md" | "lg"
  sound?: boolean
  className?: string
  style?: React.CSSProperties
}

/* ---------- sound ---------- */
let acInstance: AudioContext | null = null
function playPlip(sound?: boolean) {
  if (!sound) return
  try {
    const AC = typeof window !== "undefined" && (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)
    if (!AC) return
    if (!acInstance || acInstance.state === "closed") acInstance = new AC()
    const ctx = acInstance
    if (ctx.state === "suspended") void ctx.resume()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(480, now)
    osc.frequency.exponentialRampToValueAtTime(1250, now + 0.06)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.14)
  } catch {
    // silent
  }
}

/* ---------- styles ---------- */
const NCB_CSS = `
.nimbus-checkbox{--cb-tint:rgba(255,255,255,.18);--cb-rim:rgba(255,255,255,.8);--cb-fg:#0B132B;--cb-size:20px;
  position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;
  width:var(--cb-size);height:var(--cb-size);padding:0;margin:0;border:0;border-radius:6px;background:none;
  cursor:pointer;isolation:isolate;vertical-align:middle;touch-action:manipulation;-webkit-tap-highlight-color:transparent;
  user-select:none;-webkit-user-select:none;outline:none;transition:transform .12s ease}
.nimbus-checkbox[data-tone="dark"]{--cb-tint:rgba(10,18,40,.38);--cb-rim:rgba(255,255,255,.32);--cb-fg:#F1F7FF}
.nimbus-checkbox[data-tone="midnight"]{--cb-tint:rgba(4,7,16,.65);--cb-rim:rgba(0,210,255,.5);--cb-fg:#FFFFFF}
.nimbus-checkbox[data-tone="aurora"]{--cb-tint:rgba(12,28,42,.6);--cb-rim:rgba(52,211,153,.55);--cb-fg:#F0FDF4}
.nimbus-checkbox[data-tone="sunset"]{--cb-tint:rgba(38,18,8,.6);--cb-rim:rgba(251,191,36,.55);--cb-fg:#FFFBEB}
.nimbus-checkbox[data-tone="rose"]{--cb-tint:rgba(40,12,28,.6);--cb-rim:rgba(244,63,94,.55);--cb-fg:#FFF1F2}
.nimbus-checkbox[data-tone="emerald"]{--cb-tint:rgba(6,32,24,.6);--cb-rim:rgba(16,185,129,.55);--cb-fg:#ECFDF5}

.nimbus-checkbox[data-size="sm"]{--cb-size:16px;border-radius:5px}
.nimbus-checkbox[data-size="lg"]{--cb-size:24px;border-radius:8px}

.nimbus-checkbox:focus-visible{outline:2px solid #00A2FF;outline-offset:2px}
.nimbus-checkbox:disabled{opacity:.45;cursor:not-allowed}
.nimbus-checkbox:active:not(:disabled){transform:scale(.92)}

.ncb-glass{position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--cb-tint);
  -webkit-backdrop-filter:blur(10px) saturate(1.2) brightness(1.06);backdrop-filter:blur(10px) saturate(1.2) brightness(1.06);
  box-shadow:inset 0 1px 3px rgba(0,40,90,.16),inset 0 -1px 1px var(--cb-rim),inset 0 0 0 1px rgba(255,255,255,.24),0 2px 6px -1px rgba(0,40,90,.25)}
.nimbus-checkbox[data-tone="dark"] .ncb-glass{box-shadow:inset 0 1px 4px rgba(0,0,0,.45),inset 0 -1px 1px var(--cb-rim),inset 0 0 0 1px rgba(255,255,255,.14),0 2px 6px -1px rgba(0,0,0,.6)}
.nimbus-checkbox[data-tone="midnight"] .ncb-glass{box-shadow:inset 0 1px 4px rgba(0,0,0,.7),inset 0 -1px 1px var(--cb-rim),inset 0 0 0 1px rgba(0,210,255,.2),0 0 8px rgba(0,210,255,.15)}
.nimbus-checkbox[data-tone="aurora"] .ncb-glass{box-shadow:inset 0 1px 4px rgba(0,0,0,.6),inset 0 -1px 1px var(--cb-rim),inset 0 0 0 1px rgba(52,211,153,.2),0 0 8px rgba(52,211,153,.15)}
.nimbus-checkbox[data-tone="sunset"] .ncb-glass{box-shadow:inset 0 1px 4px rgba(0,0,0,.6),inset 0 -1px 1px var(--cb-rim),inset 0 0 0 1px rgba(245,158,11,.2),0 0 8px rgba(245,158,11,.15)}
.nimbus-checkbox[data-tone="rose"] .ncb-glass{box-shadow:inset 0 1px 4px rgba(0,0,0,.6),inset 0 -1px 1px var(--cb-rim),inset 0 0 0 1px rgba(244,63,94,.2),0 0 8px rgba(244,63,94,.15)}
.nimbus-checkbox[data-tone="emerald"] .ncb-glass{box-shadow:inset 0 1px 4px rgba(0,0,0,.6),inset 0 -1px 1px var(--cb-rim),inset 0 0 0 1px rgba(16,185,129,.2),0 0 8px rgba(16,185,129,.15)}

.ncb-water{position:absolute;inset:0;border-radius:inherit;z-index:-1;opacity:0;transform:scale(.6);
  background:linear-gradient(135deg,#00A2FF,#0066CC);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.75),inset 0 -2px 4px rgba(0,40,90,.3),0 2px 8px rgba(0,162,255,.45);
  transition:all .22s cubic-bezier(.34,1.5,.64,1)}
.nimbus-checkbox[data-tone="aurora"] .ncb-water{background:linear-gradient(135deg,#10B981,#6366F1)}
.nimbus-checkbox[data-tone="sunset"] .ncb-water{background:linear-gradient(135deg,#F59E0B,#EF4444)}
.nimbus-checkbox[data-tone="rose"] .ncb-water{background:linear-gradient(135deg,#F43F5E,#8B5CF6)}
.nimbus-checkbox[data-tone="emerald"] .ncb-water{background:linear-gradient(135deg,#10B981,#059669)}
.nimbus-checkbox[data-state="checked"] .ncb-water{opacity:1;transform:scale(1)}

.ncb-check{position:relative;z-index:1;display:inline-flex;align-items:center;justify-content:center;width:75%;height:75%;
  color:#FFFFFF;opacity:0;transform:scale(.5) rotate(-8deg);transition:all .22s cubic-bezier(.34,1.6,.64,1)}
.nimbus-checkbox[data-state="checked"] .ncb-check{opacity:1;transform:scale(1) rotate(0)}

@media (prefers-reduced-motion:reduce){
  .nimbus-checkbox,.ncb-water,.ncb-check{transition:none!important;transform:none!important}
}
`

export const LiquidCheckbox = React.forwardRef<HTMLButtonElement, LiquidCheckboxProps>(function LiquidCheckbox(
  {
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    required = false,
    name,
    value = "on",
    id,
    tone = "light",
    size = "md",
    sound = false,
    className = "",
    style,
    ...props
  },
  forwardedRef
) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const isChecked = isControlled ? !!controlledChecked : uncontrolledChecked

  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  React.useImperativeHandle(forwardedRef, () => buttonRef.current!)

  const toggle = React.useCallback(() => {
    if (disabled) return
    playPlip(sound)
    const next = !isChecked
    if (!isControlled) setUncontrolledChecked(next)
    onCheckedChange?.(next)
  }, [disabled, isChecked, isControlled, onCheckedChange, sound])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault()
      toggle()
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NCB_CSS }} />
      <button
        ref={buttonRef}
        type="button"
        role="checkbox"
        id={id}
        aria-checked={isChecked}
        aria-required={required}
        disabled={disabled}
        data-state={isChecked ? "checked" : "unchecked"}
        data-tone={tone}
        data-size={size}
        className={`nimbus-checkbox ${className}`}
        style={style}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span className="ncb-glass" aria-hidden="true" />
        <span className="ncb-water" aria-hidden="true" />
        <span className="ncb-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      </button>
      {name && (
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={isChecked}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }}
          onChange={() => {}}
        />
      )}
    </>
  )
})

export { LiquidCheckbox as Checkbox }
export default LiquidCheckbox

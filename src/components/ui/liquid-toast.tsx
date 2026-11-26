"use client"

/**
 * Nimbus UI · Liquid Toast & Toaster — "Wavelet"
 * A luminous glass toast notification system with liquid physics, entry and exit animations,
 * multiple rich visual tones (light, dark, midnight, aurora, sunset, rose, emerald),
 * living status droplet icon, action buttons, close controls, and an imperative
 * `toast()` / `useToast()` manager with a floating `LiquidToaster` viewport.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type ToastVariant = "default" | "success" | "warning" | "error" | "info"
export type ToastTone = "light" | "dark" | "midnight" | "aurora" | "sunset" | "rose" | "emerald"
export type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"

export type ToastData = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: ToastVariant
  duration?: number
  tone?: ToastTone
  onDismiss?: () => void
}

export type LiquidToastProps = {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: ToastVariant
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  duration?: number
  tone?: ToastTone
  className?: string
  style?: React.CSSProperties
  onDismiss?: () => void
}

export type LiquidToasterProps = {
  position?: ToastPosition
  tone?: ToastTone
  className?: string
  style?: React.CSSProperties
}

/* ---------- sound ---------- */
let acInstance: AudioContext | null = null
function playPlip(sound = true) {
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
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.exponentialRampToValueAtTime(1300, now + 0.08)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.18)
  } catch {
    // silent
  }
}

/* ---------- styles ---------- */
const NTO_CSS = `
.nimbus-toaster{position:fixed;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;padding:16px;box-sizing:border-box}
.nimbus-toaster[data-position="top-left"]{top:0;left:0}
.nimbus-toaster[data-position="top-center"]{top:0;left:50%;transform:translateX(-50%);align-items:center}
.nimbus-toaster[data-position="top-right"]{top:0;right:0;align-items:flex-end}
.nimbus-toaster[data-position="bottom-left"]{bottom:0;left:0}
.nimbus-toaster[data-position="bottom-center"]{bottom:0;left:50%;transform:translateX(-50%);align-items:center}
.nimbus-toaster[data-position="bottom-right"]{bottom:0;right:0;align-items:flex-end}

.nimbus-toast{--to-tint:rgba(255,255,255,.24);--to-fg:#0B132B;--to-soft:rgba(11,19,43,.64);--to-rim:rgba(255,255,255,.85);--to-accent:#00A2FF;
  position:relative;display:flex;align-items:flex-start;gap:12px;box-sizing:border-box;width:100%;max-width:380px;padding:14px 16px 16px;
  border-radius:20px;isolation:isolate;overflow:hidden;pointer-events:auto;user-select:none;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  color:var(--to-fg);transition:transform .2s ease,opacity .2s ease;
  animation:ntoPopIn .3s cubic-bezier(.34,1.5,.64,1) both}

/* Theme / Tone Variants */
.nimbus-toast[data-tone="light"]{--to-tint:rgba(255,255,255,.24);--to-fg:#0B132B;--to-soft:rgba(11,19,43,.64);--to-rim:rgba(255,255,255,.85)}
.nimbus-toast[data-tone="dark"]{--to-tint:rgba(10,18,40,.42);--to-fg:#F1F7FF;--to-soft:rgba(241,247,255,.66);--to-rim:rgba(255,255,255,.32)}
.nimbus-toast[data-tone="midnight"]{--to-tint:rgba(4,7,16,.68);--to-fg:#FFFFFF;--to-soft:rgba(255,255,255,.68);--to-rim:rgba(0,210,255,.5)}
.nimbus-toast[data-tone="aurora"]{--to-tint:rgba(12,28,42,.62);--to-fg:#F0FDF4;--to-soft:rgba(240,253,244,.72);--to-rim:rgba(52,211,153,.58)}
.nimbus-toast[data-tone="sunset"]{--to-tint:rgba(38,18,8,.6);--to-fg:#FFFBEB;--to-soft:rgba(254,243,199,.75);--to-rim:rgba(251,191,36,.55)}
.nimbus-toast[data-tone="rose"]{--to-tint:rgba(40,12,28,.6);--to-fg:#FFF1F2;--to-soft:rgba(255,228,230,.75);--to-rim:rgba(244,63,94,.55)}
.nimbus-toast[data-tone="emerald"]{--to-tint:rgba(6,32,24,.62);--to-fg:#ECFDF5;--to-soft:rgba(209,250,229,.75);--to-rim:rgba(16,185,129,.55)}

/* Status Accents */
.nimbus-toast[data-variant="success"]{--to-accent:#10B981}
.nimbus-toast[data-variant="warning"]{--to-accent:#F59E0B}
.nimbus-toast[data-variant="error"]{--to-accent:#EF4444}
.nimbus-toast[data-variant="info"]{--to-accent:#00A2FF}

.nimbus-toast[data-state="closing"]{animation:ntoPopOut .24s cubic-bezier(.25,.9,.3,1) forwards}

.nto-glass{position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--to-tint);
  -webkit-backdrop-filter:blur(18px) saturate(1.22) brightness(1.06);backdrop-filter:blur(18px) saturate(1.22) brightness(1.06);
  box-shadow:inset 0 1px 1px var(--to-rim),inset 0 0 0 1px rgba(255,255,255,.24),0 18px 40px -12px rgba(0,40,90,.55),0 3px 8px rgba(0,40,90,.1)}
.nimbus-toast[data-tone="dark"] .nto-glass{box-shadow:inset 0 1px 1px var(--to-rim),inset 0 0 0 1px rgba(255,255,255,.14),0 20px 48px -12px rgba(0,0,0,.85)}
.nimbus-toast[data-tone="midnight"] .nto-glass{box-shadow:inset 0 1px 1px var(--to-rim),inset 0 0 0 1px rgba(0,210,255,.2),0 22px 50px -12px rgba(0,0,0,.92),0 0 14px rgba(0,210,255,.12)}
.nimbus-toast[data-tone="aurora"] .nto-glass{box-shadow:inset 0 1px 1px var(--to-rim),inset 0 0 0 1px rgba(52,211,153,.2),0 20px 48px -12px rgba(0,0,0,.85)}
.nimbus-toast[data-tone="sunset"] .nto-glass{box-shadow:inset 0 1px 1px var(--to-rim),inset 0 0 0 1px rgba(245,158,11,.2),0 20px 48px -12px rgba(0,0,0,.85)}
.nimbus-toast[data-tone="rose"] .nto-glass{box-shadow:inset 0 1px 1px var(--to-rim),inset 0 0 0 1px rgba(244,63,94,.2),0 20px 48px -12px rgba(0,0,0,.85)}
.nimbus-toast[data-tone="emerald"] .nto-glass{box-shadow:inset 0 1px 1px var(--to-rim),inset 0 0 0 1px rgba(16,185,129,.2),0 20px 48px -12px rgba(0,0,0,.85)}

.nto-sheen{position:absolute;inset:0;border-radius:inherit;z-index:-1;pointer-events:none;
  background:radial-gradient(120% 80% at 30% 0%,rgba(255,255,255,.4),rgba(255,255,255,0) 65%)}
.nimbus-toast[data-tone="midnight"] .nto-sheen{background:radial-gradient(120% 80% at 30% 0%,rgba(0,210,255,.28),rgba(255,255,255,0) 65%)}
.nimbus-toast[data-tone="aurora"] .nto-sheen{background:radial-gradient(120% 80% at 30% 0%,rgba(52,211,153,.3),rgba(139,92,246,.2) 65%)}
.nimbus-toast[data-tone="sunset"] .nto-sheen{background:radial-gradient(120% 80% at 30% 0%,rgba(245,158,11,.32),rgba(239,68,68,.12) 65%)}
.nimbus-toast[data-tone="rose"] .nto-sheen{background:radial-gradient(120% 80% at 30% 0%,rgba(244,63,94,.32),rgba(255,255,255,0) 65%)}
.nimbus-toast[data-tone="emerald"] .nto-sheen{background:radial-gradient(120% 80% at 30% 0%,rgba(16,185,129,.32),rgba(255,255,255,0) 65%)}

.nto-icon{position:relative;flex:none;width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;
  background:var(--to-accent);color:#FFFFFF;box-shadow:inset 0 1px 1px rgba(255,255,255,.6),0 3px 10px -2px var(--to-accent);
  animation:ntoIconPop .4s cubic-bezier(.34,1.6,.64,1) both}
.nto-icon svg{width:15px;height:15px}

.nto-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.nto-title{font-size:14px;font-weight:650;letter-spacing:-.01em;line-height:1.25}
.nto-description{font-size:12.5px;color:var(--to-soft);line-height:1.42}
.nto-action{margin-top:8px}

.nto-close{position:relative;flex:none;width:24px;height:24px;border:0;border-radius:50%;padding:0;
  display:inline-flex;align-items:center;justify-content:center;color:var(--to-soft);cursor:pointer;outline:none;
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.6),rgba(255,255,255,0) 55%),rgba(255,255,255,.25);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.8),inset 0 -1px 2px rgba(0,162,255,.2),0 2px 6px -1px rgba(0,40,90,.2);
  transition:all .18s cubic-bezier(.25,.9,.3,1)}
.nto-close:hover{color:var(--to-fg);transform:scale(1.1)}
.nto-close:active{transform:scale(.92)}
.nto-close:focus-visible{outline:2px solid #00A2FF}

@keyframes ntoPopIn{from{opacity:0;transform:translateY(16px) scale(.92)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes ntoPopOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(-8px) scale(.94)}}
@keyframes ntoIconPop{0%{transform:scale(.6)}70%{transform:scale(1.18)}100%{transform:scale(1)}}

@media (prefers-reduced-motion:reduce){
  .nimbus-toast{animation:none!important;transition:none!important}
  .nto-icon{animation:none!important}
  .nto-close{transition:none!important;transform:none!important}
}
`

/* ---------- Imperative Toast State Store ---------- */
type ToastListener = () => void
class ToastManager {
  private toasts: ToastData[] = []
  private listeners: Set<ToastListener> = new Set()

  subscribe(listener: ToastListener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify() {
    this.listeners.forEach((fn) => fn())
  }

  getToasts() {
    return this.toasts
  }

  add(data: Omit<ToastData, "id"> & { id?: string }) {
    playPlip(true)
    const id = data.id || `toast-${Math.random().toString(36).substring(2, 9)}`
    const toastItem: ToastData = { ...data, id }
    this.toasts = [toastItem, ...this.toasts]
    this.notify()
    return id
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id)
    this.notify()
  }

  clear() {
    this.toasts = []
    this.notify()
  }
}

const manager = new ToastManager()

export function toast(options: Omit<ToastData, "id"> | string) {
  if (typeof options === "string") {
    return manager.add({ title: options })
  }
  return manager.add(options)
}

toast.success = (title: React.ReactNode, options?: Partial<ToastData>) =>
  manager.add({ title, variant: "success", ...options })

toast.error = (title: React.ReactNode, options?: Partial<ToastData>) =>
  manager.add({ title, variant: "error", ...options })

toast.warning = (title: React.ReactNode, options?: Partial<ToastData>) =>
  manager.add({ title, variant: "warning", ...options })

toast.info = (title: React.ReactNode, options?: Partial<ToastData>) =>
  manager.add({ title, variant: "info", ...options })

toast.dismiss = (id: string) => manager.dismiss(id)
toast.clear = () => manager.clear()

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastData[]>(() => manager.getToasts())

  React.useEffect(() => {
    const unsubscribe = manager.subscribe(() => {
      setToasts([...manager.getToasts()])
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return {
    toasts,
    toast,
    dismiss: (id: string) => manager.dismiss(id),
    clear: () => manager.clear(),
  }
}

/* ---------- Component: LiquidToaster Viewport ---------- */
export function LiquidToaster({
  position = "bottom-right",
  tone = "light",
  className = "",
  style,
}: LiquidToasterProps) {
  const { toasts, dismiss } = useToast()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NTO_CSS }} />
      <div
        className={`nimbus-toaster ${className}`}
        data-position={position}
        data-tone={tone}
        style={style}
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <LiquidToast
            key={t.id}
            id={t.id}
            title={t.title}
            description={t.description}
            action={t.action}
            variant={t.variant}
            duration={t.duration}
            tone={t.tone || tone}
            onDismiss={() => {
              t.onDismiss?.()
              dismiss(t.id)
            }}
          />
        ))}
      </div>
    </>
  )
}

/* ---------- Component: Individual LiquidToast ---------- */
export function LiquidToast({
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
  variant = "default",
  title,
  description,
  action,
  duration = 5000,
  tone = "light",
  className = "",
  style,
  onDismiss,
}: LiquidToastProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  const [isClosing, setIsClosing] = React.useState(false)

  const triggerDismiss = React.useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      if (!isControlled) setUncontrolledOpen(false)
      onOpenChange?.(false)
      onDismiss?.()
    }, 240)
  }, [isControlled, onDismiss, onOpenChange])

  // Timer auto-dismiss without progress bar polling
  React.useEffect(() => {
    if (!isOpen || duration <= 0 || isClosing) return
    const timer = setTimeout(() => {
      triggerDismiss()
    }, duration)
    return () => clearTimeout(timer)
  }, [isOpen, duration, isClosing, triggerDismiss])

  if (!isOpen) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NTO_CSS }} />
      <div
        role="status"
        aria-live="polite"
        data-variant={variant}
        data-tone={tone}
        data-state={isClosing ? "closing" : "open"}
        className={`nimbus-toast ${className}`}
        style={style}
      >
        <span className="nto-glass" aria-hidden="true" />
        <span className="nto-sheen" aria-hidden="true" />
        <div className="nto-icon" aria-hidden="true">
          {variant === "success" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : variant === "warning" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4M12 17h.01" />
            </svg>
          ) : variant === "error" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          )}
        </div>
        <div className="nto-body">
          {title && <div className="nto-title">{title}</div>}
          {description && <div className="nto-description">{description}</div>}
          {action && <div className="nto-action">{action}</div>}
        </div>
        <button
          type="button"
          className="nto-close"
          aria-label="Dismiss toast"
          onClick={triggerDismiss}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </>
  )
}

export {
  LiquidToast as Toast,
  LiquidToaster as Toaster,
  LiquidToast as Component,
}
export default LiquidToast

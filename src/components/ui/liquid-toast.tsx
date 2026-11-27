"use client"

/**
 * Nimbus UI · Liquid Toast & Toaster — "Wavelet"
 * A luminous glass toast notification system carved from frosted crystal glass
 * surrounded by an active liquid water border. A fluid bead of light continuously orbits
 * along the perimeter rim, leaving a luminous wave trail.
 * The interior is clean, translucent refractive glass with high-contrast typography,
 * specular sheen, audio plip feedback, action button slots, full ARIA attributes,
 * and an imperative `toast()` / `useToast()` manager with `LiquidToaster`.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"
import { useLiquidContext } from "./liquid/provider"

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
  sound?: boolean
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
  sound?: boolean
  className?: string
  style?: React.CSSProperties
  onDismiss?: () => void
}

export type LiquidToasterProps = {
  position?: ToastPosition
  tone?: ToastTone
  sound?: boolean
  className?: string
  style?: React.CSSProperties
}

/* ---------- sound synthesis ---------- */
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
    osc.frequency.setValueAtTime(460, now)
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.14, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.18)
  } catch {}
}

/* ---------- styles ---------- */
const NTO_CSS = `
.nimbus-toaster {
  position: fixed;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
  padding: 20px;
  box-sizing: border-box;
}
.nimbus-toaster[data-position="top-left"] { top: 0; left: 0; }
.nimbus-toaster[data-position="top-center"] { top: 0; left: 50%; transform: translateX(-50%); align-items: center; }
.nimbus-toaster[data-position="top-right"] { top: 0; right: 0; align-items: flex-end; }
.nimbus-toaster[data-position="bottom-left"] { bottom: 0; left: 0; }
.nimbus-toaster[data-position="bottom-center"] { bottom: 0; left: 50%; transform: translateX(-50%); align-items: center; }
.nimbus-toaster[data-position="bottom-right"] { bottom: 0; right: 0; align-items: flex-end; }

.nimbus-toast {
  --to-tint: linear-gradient(135deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.08));
  --to-fg: #0B132B;
  --to-soft: rgba(11, 19, 43, 0.68);
  --to-rim: rgba(255, 255, 255, 0.6);
  --to-rim-b: rgba(255, 255, 255, 0.15);
  --to-border: rgba(255, 255, 255, 0.35);
  --to-shadow: inset 0 1px 0 var(--to-rim), inset 0 -1px 0 var(--to-rim-b), 0 12px 40px rgba(31, 38, 135, 0.18);
  --to-accent: #00A2FF;
  --to-accent-soft: rgba(0, 162, 255, 0.2);
  --to-accent-glow: rgba(0, 162, 255, 0.35);

  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-sizing: border-box;
  width: 360px;
  max-width: calc(100vw - 32px);
  padding: 14px 16px;
  border-radius: 20px;
  isolation: isolate;
  pointer-events: auto;
  user-select: none;
  font-family: ui-sans-serif, -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: var(--to-fg);
  animation: ntoPopIn 0.3s cubic-bezier(0.34, 1.5, 0.64, 1) both;
  cursor: default;
}

.nimbus-toast[data-tone="dark"],
.nimbus-toast[data-tone="midnight"] {
  --to-tint: linear-gradient(135deg, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.25));
  --to-fg: #F1F7FF;
  --to-soft: rgba(241, 247, 255, 0.68);
  --to-rim: rgba(255, 255, 255, 0.4);
  --to-rim-b: rgba(0, 210, 255, 0.2);
  --to-border: rgba(255, 255, 255, 0.22);
  --to-shadow: inset 0 1px 0 var(--to-rim), inset 0 -1px 0 var(--to-rim-b), 0 16px 44px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 210, 255, 0.18);
  --to-accent: #00E5FF;
  --to-accent-soft: rgba(0, 229, 255, 0.25);
  --to-accent-glow: rgba(0, 229, 255, 0.55);
}

.nimbus-toast[data-tone="aurora"] {
  --to-tint: linear-gradient(135deg, rgba(12, 28, 42, 0.5), rgba(6, 32, 24, 0.3));
  --to-fg: #F0FDF4;
  --to-soft: rgba(240, 253, 244, 0.75);
  --to-rim: rgba(52, 211, 153, 0.55);
  --to-rim-b: rgba(52, 211, 153, 0.2);
  --to-border: rgba(52, 211, 153, 0.3);
  --to-shadow: inset 0 1px 0 var(--to-rim), inset 0 -1px 0 var(--to-rim-b), 0 16px 44px rgba(0, 0, 0, 0.7), 0 0 20px rgba(52, 211, 153, 0.18);
  --to-accent: #34D399;
  --to-accent-soft: rgba(52, 211, 153, 0.25);
  --to-accent-glow: rgba(52, 211, 153, 0.45);
}

.nimbus-toast[data-tone="sunset"] {
  --to-tint: linear-gradient(135deg, rgba(38, 18, 8, 0.5), rgba(30, 10, 12, 0.3));
  --to-fg: #FFFBEB;
  --to-soft: rgba(254, 243, 199, 0.78);
  --to-rim: rgba(251, 191, 36, 0.55);
  --to-rim-b: rgba(251, 191, 36, 0.2);
  --to-border: rgba(251, 191, 36, 0.3);
  --to-shadow: inset 0 1px 0 var(--to-rim), inset 0 -1px 0 var(--to-rim-b), 0 16px 44px rgba(0, 0, 0, 0.7), 0 0 20px rgba(251, 191, 36, 0.18);
  --to-accent: #FBBF24;
  --to-accent-soft: rgba(251, 191, 36, 0.25);
  --to-accent-glow: rgba(251, 191, 36, 0.45);
}

.nimbus-toast[data-tone="rose"] {
  --to-tint: linear-gradient(135deg, rgba(40, 12, 28, 0.5), rgba(28, 8, 20, 0.3));
  --to-fg: #FFF1F2;
  --to-soft: rgba(255, 228, 230, 0.78);
  --to-rim: rgba(244, 63, 94, 0.55);
  --to-rim-b: rgba(244, 63, 94, 0.2);
  --to-border: rgba(244, 63, 94, 0.3);
  --to-shadow: inset 0 1px 0 var(--to-rim), inset 0 -1px 0 var(--to-rim-b), 0 16px 44px rgba(0, 0, 0, 0.7), 0 0 20px rgba(244, 63, 94, 0.18);
  --to-accent: #F43F5E;
  --to-accent-soft: rgba(244, 63, 94, 0.25);
  --to-accent-glow: rgba(244, 63, 94, 0.45);
}

.nimbus-toast[data-tone="emerald"] {
  --to-tint: linear-gradient(135deg, rgba(6, 32, 24, 0.5), rgba(4, 24, 18, 0.3));
  --to-fg: #ECFDF5;
  --to-soft: rgba(209, 250, 229, 0.78);
  --to-rim: rgba(16, 185, 129, 0.55);
  --to-rim-b: rgba(16, 185, 129, 0.2);
  --to-border: rgba(16, 185, 129, 0.3);
  --to-shadow: inset 0 1px 0 var(--to-rim), inset 0 -1px 0 var(--to-rim-b), 0 16px 44px rgba(0, 0, 0, 0.7), 0 0 20px rgba(16, 185, 129, 0.18);
  --to-accent: #10B981;
  --to-accent-soft: rgba(16, 185, 129, 0.25);
  --to-accent-glow: rgba(16, 185, 129, 0.45);
}

.nimbus-toast[data-variant="success"] {
  --to-accent: #10B981;
  --to-accent-soft: rgba(16, 185, 129, 0.2);
  --to-accent-glow: rgba(16, 185, 129, 0.4);
}
.nimbus-toast[data-variant="warning"] {
  --to-accent: #F59E0B;
  --to-accent-soft: rgba(245, 158, 11, 0.2);
  --to-accent-glow: rgba(245, 158, 11, 0.4);
}
.nimbus-toast[data-variant="error"] {
  --to-accent: #EF4444;
  --to-accent-soft: rgba(239, 68, 68, 0.2);
  --to-accent-glow: rgba(239, 68, 68, 0.4);
}
.nimbus-toast[data-variant="info"] {
  --to-accent: #00A2FF;
  --to-accent-soft: rgba(0, 162, 255, 0.2);
  --to-accent-glow: rgba(0, 162, 255, 0.4);
}

.nimbus-toast[data-state="closing"] {
  animation: ntoPopOut 0.24s cubic-bezier(0.25, 0.9, 0.3, 1) forwards;
}

/* Glass panel body */
.nto-glass {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -2;
  overflow: hidden;
  background: var(--to-tint);
  -webkit-backdrop-filter: blur(18px) saturate(180%) brightness(1.08);
  backdrop-filter: blur(18px) saturate(180%) brightness(1.08);
  border: 1px solid var(--to-border);
  box-shadow: var(--to-shadow);
}

.nto-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(100% 70% at 50% 0%, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 65%);
}

.nimbus-toast[data-tone="dark"] .nto-glass::before,
.nimbus-toast[data-tone="midnight"] .nto-glass::before {
  background: radial-gradient(100% 70% at 50% 0%, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0) 65%);
}

/* Liquid animated border — constrained strictly to the border path */
.nto-liquid-border {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  pointer-events: none;
  z-index: 0;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  overflow: hidden;
}

.nto-border-stream {
  position: absolute;
  inset: -60%;
  width: 220%;
  height: 220%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    transparent 45deg,
    var(--to-accent-soft) 95deg,
    var(--to-accent) 150deg,
    #FFFFFF 176deg,
    #FFFFFF 184deg,
    var(--to-accent) 210deg,
    var(--to-accent-soft) 265deg,
    transparent 315deg,
    transparent 360deg
  );
  animation: ntoBorderSpin 3.6s linear infinite;
}

.nimbus-toast:hover .nto-border-stream {
  animation-duration: 2s;
}

@keyframes ntoBorderSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.nto-border-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: -1;
  box-shadow: 0 0 16px -2px var(--to-accent-glow);
  opacity: 0.75;
  animation: ntoBorderPulse 3.2s ease-in-out infinite alternate;
}

@keyframes ntoBorderPulse {
  0% { opacity: 0.55; box-shadow: 0 0 10px -2px var(--to-accent-glow); }
  100% { opacity: 0.95; box-shadow: 0 0 20px 0px var(--to-accent-glow); }
}

.nto-icon {
  position: relative;
  z-index: 1;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--to-accent);
  color: #FFFFFF;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.7), 0 3px 10px -2px var(--to-accent);
  animation: ntoIconPop 0.4s cubic-bezier(0.34, 1.6, 0.64, 1) both;
}
.nto-icon svg {
  width: 15px;
  height: 15px;
}

.nto-body {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nto-title {
  font-size: 13.5px;
  font-weight: 650;
  letter-spacing: -0.01em;
  color: var(--to-fg);
  line-height: 1.35;
}

.nto-description {
  font-size: 12.5px;
  color: var(--to-soft);
  line-height: 1.4;
  word-break: break-word;
}

.nto-action {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nto-close {
  position: relative;
  z-index: 1;
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--to-soft);
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
}
.nto-close:hover {
  color: var(--to-fg);
  background: rgba(255, 255, 255, 0.18);
}

@keyframes ntoPopIn {
  from { opacity: 0; transform: translateY(-10px) scale(0.94); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes ntoPopOut {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-8px) scale(0.92); }
}

@keyframes ntoIconPop {
  0% { transform: scale(0.6); }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .nimbus-toast, .nto-icon, .nto-border-stream, .nto-border-glow {
    animation: none !important;
  }
}
`

/* ---------- Global Toast State for Imperative API ---------- */
type ToastSubscriber = () => void
class ToastManager {
  private toasts: ToastData[] = []
  private listeners: Set<ToastSubscriber> = new Set()

  subscribe(fn: ToastSubscriber) {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  notify() {
    this.listeners.forEach((fn) => fn())
  }

  getToasts() {
    return this.toasts
  }

  add(data: Omit<ToastData, "id"> & { id?: string }) {
    const id = data.id || Math.random().toString(36).slice(2, 9)
    const toastItem: ToastData = { ...data, id }
    this.toasts = [toastItem, ...this.toasts].slice(0, 5)
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

export const toastManager = new ToastManager()

export interface ToastFn {
  (titleOrOptions: React.ReactNode | (Omit<ToastData, "id">), options?: Omit<ToastData, "id" | "title">): string
  success: (title: React.ReactNode, options?: Omit<ToastData, "id" | "title" | "variant">) => string
  error: (title: React.ReactNode, options?: Omit<ToastData, "id" | "title" | "variant">) => string
  warning: (title: React.ReactNode, options?: Omit<ToastData, "id" | "title" | "variant">) => string
  info: (title: React.ReactNode, options?: Omit<ToastData, "id" | "title" | "variant">) => string
  dismiss: (id: string) => void
  clear: () => void
}

export const toast: ToastFn = Object.assign(
  (titleOrOptions: React.ReactNode | (Omit<ToastData, "id">), options?: Omit<ToastData, "id" | "title">) => {
    if (
      typeof titleOrOptions === "object" &&
      titleOrOptions !== null &&
      !React.isValidElement(titleOrOptions) &&
      ("title" in titleOrOptions || "description" in titleOrOptions)
    ) {
      return toastManager.add(titleOrOptions as Omit<ToastData, "id">)
    }
    return toastManager.add({ title: titleOrOptions as React.ReactNode, ...options })
  },
  {
    success: (title: React.ReactNode, options?: Omit<ToastData, "id" | "title" | "variant">) =>
      toastManager.add({ title, variant: "success", ...options }),
    error: (title: React.ReactNode, options?: Omit<ToastData, "id" | "title" | "variant">) =>
      toastManager.add({ title, variant: "error", ...options }),
    warning: (title: React.ReactNode, options?: Omit<ToastData, "id" | "title" | "variant">) =>
      toastManager.add({ title, variant: "warning", ...options }),
    info: (title: React.ReactNode, options?: Omit<ToastData, "id" | "title" | "variant">) =>
      toastManager.add({ title, variant: "info", ...options }),
    dismiss: (id: string) => toastManager.dismiss(id),
    clear: () => toastManager.clear(),
  }
)

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastData[]>([])

  React.useEffect(() => {
    setToasts(toastManager.getToasts())
    return toastManager.subscribe(() => {
      setToasts([...toastManager.getToasts()])
    })
  }, [])

  return {
    toasts,
    toast,
    dismiss: (id: string) => toastManager.dismiss(id),
    clear: () => toastManager.clear(),
  }
}

/* ---------- Component: LiquidToaster Viewport ---------- */
export function LiquidToaster({
  position = "bottom-right",
  tone: propTone,
  sound: propSound,
  className = "",
  style,
}: LiquidToasterProps) {
  const ctx = useLiquidContext()
  const tone = propTone ?? ctx?.tone ?? "light"
  const sound = propSound ?? ctx?.sound ?? true

  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NTO_CSS }} />
      <div
        className={`nimbus-toaster ${className}`}
        data-position={position}
        style={style}
      >
        {toasts.map((item) => (
          <LiquidToast
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            action={item.action}
            variant={item.variant}
            duration={item.duration}
            tone={item.tone ?? (tone as ToastTone)}
            sound={item.sound ?? sound}
            onDismiss={() => {
              item.onDismiss?.()
              dismiss(item.id)
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
  tone: propTone,
  sound: propSound,
  className = "",
  style,
  onDismiss,
}: LiquidToastProps) {
  const ctx = useLiquidContext()
  const tone = propTone ?? (ctx ? (ctx.tone === "midnight" || ctx.tone === "dark" ? "dark" : "light") : "light")
  const sound = propSound ?? ctx?.sound ?? true

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  const [isClosing, setIsClosing] = React.useState(false)
  const toastRef = React.useRef<HTMLDivElement | null>(null)

  const triggerDismiss = React.useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      if (!isControlled) setUncontrolledOpen(false)
      onOpenChange?.(false)
      onDismiss?.()
    }, 240)
  }, [isControlled, onDismiss, onOpenChange])

  // Timer auto-dismiss without progress bar
  React.useEffect(() => {
    if (!isOpen || duration <= 0 || isClosing) return
    const timer = setTimeout(() => {
      triggerDismiss()
    }, duration)
    return () => clearTimeout(timer)
  }, [isOpen, duration, isClosing, triggerDismiss])

  // Sound on mount
  React.useEffect(() => {
    if (isOpen && sound) {
      playPlip(true)
    }
  }, [isOpen, sound])

  if (!isOpen) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NTO_CSS }} />
      <div
        ref={toastRef}
        role="status"
        aria-live="polite"
        data-variant={variant}
        data-tone={tone}
        data-state={isClosing ? "closing" : "open"}
        className={`nimbus-toast ${className}`}
        style={style}
        onClick={() => {
          if (sound) playPlip(true)
        }}
      >
        <span className="nto-glass" aria-hidden="true" />
        <div className="nto-liquid-border" aria-hidden="true">
          <div className="nto-border-stream" />
        </div>
        <div className="nto-border-glow" aria-hidden="true" />

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
          onClick={(e) => {
            e.stopPropagation()
            triggerDismiss()
          }}
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

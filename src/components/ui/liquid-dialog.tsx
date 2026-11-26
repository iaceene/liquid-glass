"use client"

/**
 * Nimbus UI · Liquid Dialog — "Glass Chamber"
 * A modal chamber cast from liquid glass. When opened, it emerges with a soft water
 * expansion and refraction ripple. Features focus trapping, escape key dismissal,
 * click-outside dismiss, animated backdrop blur, and accessible ARIA dialog roles.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type DialogTone = "light" | "dark" | "midnight" | "aurora" | "sunset" | "rose" | "emerald"

export type LiquidDialogProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  tone?: DialogTone
}

export type LiquidDialogTriggerProps = {
  children?: React.ReactNode
  asChild?: boolean
  className?: string
  style?: React.CSSProperties
}

export type LiquidDialogContentProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onEscapeKeyDown?: (e: KeyboardEvent) => void
  onPointerDownOutside?: (e: PointerEvent) => void
  showCloseButton?: boolean
}

export type LiquidDialogHeaderProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export type LiquidDialogTitleProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  id?: string
}

export type LiquidDialogDescriptionProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  id?: string
}

export type LiquidDialogFooterProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export type LiquidDialogCloseProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  asChild?: boolean
}

/* ---------- styles ---------- */
const NDG_CSS = `
.nimbus-dialog-overlay{position:fixed;inset:0;z-index:9998;background:rgba(0,12,30,.38);
  -webkit-backdrop-filter:blur(6px) saturate(1.2);backdrop-filter:blur(6px) saturate(1.2);
  display:flex;align-items:center;justify-content:center;padding:16px;
  animation:ndgFadeIn .22s cubic-bezier(.25,.9,.3,1) both}
.nimbus-dialog-overlay[data-state="closing"]{animation:ndgFadeOut .18s cubic-bezier(.25,.9,.3,1) forwards}

.nimbus-dialog{--dg-tint:rgba(255,255,255,.2);--dg-fg:#0B132B;--dg-soft:rgba(11,19,43,.64);--dg-rim:rgba(255,255,255,.8);--dg-line:rgba(11,19,43,.1);
  position:relative;width:100%;max-width:520px;padding:24px 28px;border-radius:28px;isolation:isolate;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  animation:ndgScaleUp .28s cubic-bezier(.34,1.45,.64,1) both;color:var(--dg-fg)}
.nimbus-dialog[data-tone="dark"]{--dg-tint:rgba(10,18,40,.42);--dg-fg:#F1F7FF;--dg-soft:rgba(241,247,255,.66);--dg-rim:rgba(255,255,255,.34);--dg-line:rgba(241,247,255,.12)}
.nimbus-dialog[data-tone="midnight"]{--dg-tint:rgba(4,7,16,.72);--dg-fg:#FFFFFF;--dg-soft:rgba(255,255,255,.68);--dg-rim:rgba(0,210,255,.55);--dg-line:rgba(0,210,255,.15)}
.nimbus-dialog[data-tone="aurora"]{--dg-tint:rgba(12,28,42,.65);--dg-fg:#F0FDF4;--dg-soft:rgba(240,253,244,.72);--dg-rim:rgba(52,211,153,.58);--dg-line:rgba(52,211,153,.15)}
.nimbus-dialog[data-tone="sunset"]{--dg-tint:rgba(38,18,8,.65);--dg-fg:#FFFBEB;--dg-soft:rgba(254,243,199,.75);--dg-rim:rgba(251,191,36,.55);--dg-line:rgba(251,191,36,.15)}
.nimbus-dialog[data-tone="rose"]{--dg-tint:rgba(40,12,28,.65);--dg-fg:#FFF1F2;--dg-soft:rgba(255,228,230,.75);--dg-rim:rgba(244,63,94,.55);--dg-line:rgba(244,63,94,.15)}
.nimbus-dialog[data-tone="emerald"]{--dg-tint:rgba(6,32,24,.65);--dg-fg:#ECFDF5;--dg-soft:rgba(209,250,229,.75);--dg-rim:rgba(16,185,129,.55);--dg-line:rgba(16,185,129,.15)}

.nimbus-dialog[data-state="closing"]{animation:ndgScaleDown .18s cubic-bezier(.25,.9,.3,1) forwards}

.ndg-glass{position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--dg-tint);
  -webkit-backdrop-filter:blur(18px) saturate(1.25) brightness(1.08);backdrop-filter:blur(18px) saturate(1.25) brightness(1.08);
  box-shadow:inset 0 1px 1px var(--dg-rim),inset 0 0 0 1px rgba(255,255,255,.24),0 28px 56px -18px rgba(0,40,90,.65),0 4px 12px rgba(0,40,90,.12)}
.nimbus-dialog[data-tone="dark"] .ndg-glass{box-shadow:inset 0 1px 1px var(--dg-rim),inset 0 0 0 1px rgba(255,255,255,.14),0 28px 64px -18px rgba(0,0,0,.85)}
.nimbus-dialog[data-tone="midnight"] .ndg-glass{box-shadow:inset 0 1px 1px var(--dg-rim),inset 0 0 0 1px rgba(0,210,255,.25),0 32px 70px -18px rgba(0,0,0,.95),0 0 16px rgba(0,210,255,.12)}
.nimbus-dialog[data-tone="aurora"] .ndg-glass{box-shadow:inset 0 1px 1px var(--dg-rim),inset 0 0 0 1px rgba(52,211,153,.2),0 28px 64px -18px rgba(0,0,0,.85)}
.nimbus-dialog[data-tone="sunset"] .ndg-glass{box-shadow:inset 0 1px 1px var(--dg-rim),inset 0 0 0 1px rgba(245,158,11,.2),0 28px 64px -18px rgba(0,0,0,.85)}
.nimbus-dialog[data-tone="rose"] .ndg-glass{box-shadow:inset 0 1px 1px var(--dg-rim),inset 0 0 0 1px rgba(244,63,94,.2),0 28px 64px -18px rgba(0,0,0,.85)}
.nimbus-dialog[data-tone="emerald"] .ndg-glass{box-shadow:inset 0 1px 1px var(--dg-rim),inset 0 0 0 1px rgba(16,185,129,.2),0 28px 64px -18px rgba(0,0,0,.85)}

.ndg-sheen{position:absolute;inset:0;border-radius:inherit;z-index:-1;pointer-events:none;
  background:radial-gradient(100% 70% at 50% 0%,rgba(255,255,255,.35),rgba(255,255,255,0) 65%)}
.nimbus-dialog[data-tone="dark"] .ndg-sheen{background:radial-gradient(100% 70% at 50% 0%,rgba(255,255,255,.15),rgba(255,255,255,0) 65%)}

.ndg-close{position:absolute;top:18px;right:18px;width:32px;height:32px;border:0;border-radius:999px;padding:0;
  display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:var(--dg-soft);outline:none;
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.7),rgba(255,255,255,0) 55%),rgba(255,255,255,.3);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.9),inset 0 -1px 3px rgba(0,162,255,.2),0 4px 10px -3px rgba(0,50,110,.3);
  transition:all .18s cubic-bezier(.25,.9,.3,1)}
.ndg-close:hover{color:var(--dg-fg);transform:scale(1.08)}
.ndg-close:active{transform:scale(.95)}
.ndg-close:focus-visible{outline:2px solid #00A2FF;outline-offset:2px}

.ndg-header{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
.ndg-title{margin:0;font-size:20px;font-weight:650;letter-spacing:-.02em;color:var(--dg-fg)}
.ndg-description{margin:0;font-size:14px;color:var(--dg-soft);line-height:1.45}
.ndg-footer{display:flex;align-items:center;justify-content:flex-end;gap:10px;margin-top:24px}

@keyframes ndgFadeIn{from{opacity:0}to{opacity:1}}
@keyframes ndgFadeOut{from{opacity:1}to{opacity:0}}
@keyframes ndgScaleUp{from{opacity:0;transform:scale(.92) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes ndgScaleDown{from{opacity:1;transform:scale(1) translateY(0)}to{opacity:0;transform:scale(.94) translateY(6px)}}

@media (prefers-reduced-motion:reduce){
  .nimbus-dialog-overlay,.nimbus-dialog{animation:none!important}
  .ndg-close{transition:none!important;transform:none!important}
}
`

/* ---------- Dialog Context ---------- */
type DialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  tone: DialogTone
  titleId: string
  descId: string
}
const DialogContext = React.createContext<DialogContextValue | null>(null)

export function LiquidDialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  tone = "light",
}: LiquidDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const titleId = React.useId()
  const descId = React.useId()

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(newOpen)
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  const ctxValue = React.useMemo<DialogContextValue>(
    () => ({ open, setOpen, tone, titleId, descId }),
    [open, setOpen, tone, titleId, descId]
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NDG_CSS }} />
      <DialogContext.Provider value={ctxValue}>{children}</DialogContext.Provider>
    </>
  )
}

export function LiquidDialogTrigger({ children, asChild, className = "", style, ...props }: LiquidDialogTriggerProps) {
  const ctx = React.useContext(DialogContext)
  const handleClick = (e: React.MouseEvent) => {
    ctx?.setOpen(true)
    const childProps = (children as React.ReactElement)?.props
    childProps?.onClick?.(e)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      "aria-haspopup": "dialog",
      "aria-expanded": ctx?.open,
    })
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={handleClick}
      aria-haspopup="dialog"
      aria-expanded={ctx?.open}
      {...props}
    >
      {children}
    </button>
  )
}

export const LiquidDialogContent = React.forwardRef<HTMLDivElement, LiquidDialogContentProps>(function LiquidDialogContent(
  { children, className = "", style, onEscapeKeyDown, onPointerDownOutside, showCloseButton = true, ...props },
  forwardedRef
) {
  const ctx = React.useContext(DialogContext)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  React.useImperativeHandle(forwardedRef, () => contentRef.current!)

  // Handle escape key
  React.useEffect(() => {
    if (!ctx?.open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscapeKeyDown?.(e)
        if (!e.defaultPrevented) {
          ctx.setOpen(false)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [ctx, onEscapeKeyDown])

  // Focus trap: focus first focusable child on open
  React.useEffect(() => {
    if (!ctx?.open || !contentRef.current) return
    const el = contentRef.current
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length > 0) {
      focusable[0].focus()
    }
  }, [ctx?.open])

  if (!ctx?.open) return null

  const handleOverlayPointerDown = (e: React.PointerEvent) => {
    if (e.target === e.currentTarget) {
      onPointerDownOutside?.(e.nativeEvent)
      if (!e.defaultPrevented) {
        ctx.setOpen(false)
      }
    }
  }

  return (
    <div
      className="nimbus-dialog-overlay"
      onPointerDown={handleOverlayPointerDown}
      role="presentation"
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ctx.titleId}
        aria-describedby={ctx.descId}
        data-tone={ctx.tone}
        className={`nimbus-dialog ${className}`}
        style={style}
        {...props}
      >
        <span className="ndg-glass" aria-hidden="true" />
        <span className="ndg-sheen" aria-hidden="true" />
        {showCloseButton && (
          <button
            type="button"
            className="ndg-close"
            aria-label="Close dialog"
            onClick={() => ctx.setOpen(false)}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  )
})

export function LiquidDialogHeader({ children, className = "", style, ...props }: LiquidDialogHeaderProps) {
  return (
    <div className={`ndg-header ${className}`} style={style} {...props}>
      {children}
    </div>
  )
}

export function LiquidDialogTitle({ children, className = "", style, id, ...props }: LiquidDialogTitleProps) {
  const ctx = React.useContext(DialogContext)
  return (
    <h2 id={id || ctx?.titleId} className={`ndg-title ${className}`} style={style} {...props}>
      {children}
    </h2>
  )
}

export function LiquidDialogDescription({ children, className = "", style, id, ...props }: LiquidDialogDescriptionProps) {
  const ctx = React.useContext(DialogContext)
  return (
    <p id={id || ctx?.descId} className={`ndg-description ${className}`} style={style} {...props}>
      {children}
    </p>
  )
}

export function LiquidDialogFooter({ children, className = "", style, ...props }: LiquidDialogFooterProps) {
  return (
    <div className={`ndg-footer ${className}`} style={style} {...props}>
      {children}
    </div>
  )
}

export function LiquidDialogClose({ children, className = "", style, asChild, ...props }: LiquidDialogCloseProps) {
  const ctx = React.useContext(DialogContext)
  const handleClick = () => ctx?.setOpen(false)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: handleClick,
    })
  }

  return (
    <button type="button" className={className} style={style} onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

export {
  LiquidDialog as Dialog,
  LiquidDialogTrigger as DialogTrigger,
  LiquidDialogContent as DialogContent,
  LiquidDialogHeader as DialogHeader,
  LiquidDialogTitle as DialogTitle,
  LiquidDialogDescription as DialogDescription,
  LiquidDialogFooter as DialogFooter,
  LiquidDialogClose as DialogClose,
}
export default LiquidDialog

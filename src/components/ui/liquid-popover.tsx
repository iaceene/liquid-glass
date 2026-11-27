"use client"

/**
 * Nimbus UI · Liquid Popover — "Tidal Pearl"
 * An anchored glass reservoir that surfaces floating content beside a trigger.
 * Portalled directly into document.body with fixed viewport anchoring, boundary detection,
 * specular sheen, directional pointer support, outside-click detection,
 * and smooth opening physics with full keyboard accessibility.
 * No dependencies besides React and ReactDOM.
 * by guglielmogiannattasio.it
 */

import * as React from "react"
import * as ReactDOM from "react-dom"

export type PopoverSide = "top" | "bottom" | "left" | "right"
export type PopoverAlign = "start" | "center" | "end"

export type PopoverTone = "light" | "dark" | "midnight" | "aurora" | "sunset" | "rose" | "emerald"

export type LiquidPopoverProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  tone?: PopoverTone
}

export type LiquidPopoverTriggerProps = {
  children?: React.ReactNode
  asChild?: boolean
  className?: string
  style?: React.CSSProperties
}

export type LiquidPopoverContentProps = {
  children?: React.ReactNode
  side?: PopoverSide
  align?: PopoverAlign
  sideOffset?: number
  className?: string
  style?: React.CSSProperties
  onEscapeKeyDown?: (e: KeyboardEvent) => void
  onPointerDownOutside?: (e: PointerEvent) => void
}

export type LiquidPopoverCloseProps = {
  children?: React.ReactNode
  asChild?: boolean
  className?: string
  style?: React.CSSProperties
}

/* ---------- styles ---------- */
const NPO_CSS = `
.nimbus-popover-anchor{display:inline-block}

.nimbus-popover{
  --po-tint:linear-gradient(135deg, rgba(255,255,255,.28), rgba(255,255,255,.08));
  --po-fg:#0B132B;
  --po-soft:rgba(11,19,43,.68);
  --po-rim:rgba(255,255,255,.6);
  --po-rim-b:rgba(255,255,255,.15);
  --po-border:rgba(255,255,255,.35);
  --po-shadow:inset 0 1px 0 var(--po-rim), inset 0 -1px 0 var(--po-rim-b), 0 12px 40px rgba(31,38,135,.18);
  position:fixed;
  z-index:99999;
  box-sizing:border-box;
  width:280px;
  padding:16px;
  border-radius:20px;
  isolation:isolate;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  font-size:14px;
  color:var(--po-fg);
  line-height:1.45;
  outline:none;
  animation:npoDropIn .22s cubic-bezier(.34,1.4,.64,1) both;
}

.nimbus-popover[data-tone="dark"],
.nimbus-popover[data-tone="midnight"]{
  --po-tint:linear-gradient(135deg, rgba(15,23,42,.45), rgba(15,23,42,.25));
  --po-fg:#F1F7FF;
  --po-soft:rgba(241,247,255,.68);
  --po-rim:rgba(255,255,255,.4);
  --po-rim-b:rgba(0,210,255,.2);
  --po-border:rgba(255,255,255,.22);
  --po-shadow:inset 0 1px 0 var(--po-rim), inset 0 -1px 0 var(--po-rim-b), 0 16px 44px rgba(0,0,0,.7), 0 0 20px rgba(0,210,255,.18);
}

.nimbus-popover[data-tone="aurora"]{
  --po-tint:linear-gradient(135deg, rgba(12,28,42,.5), rgba(6,32,24,.3));
  --po-fg:#F0FDF4;
  --po-soft:rgba(240,253,244,.75);
  --po-rim:rgba(52,211,153,.55);
  --po-rim-b:rgba(52,211,153,.2);
  --po-border:rgba(52,211,153,.3);
  --po-shadow:inset 0 1px 0 var(--po-rim), inset 0 -1px 0 var(--po-rim-b), 0 16px 44px rgba(0,0,0,.7), 0 0 20px rgba(52,211,153,.18);
}

.nimbus-popover[data-tone="sunset"]{
  --po-tint:linear-gradient(135deg, rgba(38,18,8,.5), rgba(30,10,12,.3));
  --po-fg:#FFFBEB;
  --po-soft:rgba(254,243,199,.78);
  --po-rim:rgba(251,191,36,.55);
  --po-rim-b:rgba(251,191,36,.2);
  --po-border:rgba(251,191,36,.3);
  --po-shadow:inset 0 1px 0 var(--po-rim), inset 0 -1px 0 var(--po-rim-b), 0 16px 44px rgba(0,0,0,.7), 0 0 20px rgba(251,191,36,.18);
}

.nimbus-popover[data-tone="rose"]{
  --po-tint:linear-gradient(135deg, rgba(40,12,28,.5), rgba(28,8,20,.3));
  --po-fg:#FFF1F2;
  --po-soft:rgba(255,228,230,.78);
  --po-rim:rgba(244,63,94,.55);
  --po-rim-b:rgba(244,63,94,.2);
  --po-border:rgba(244,63,94,.3);
  --po-shadow:inset 0 1px 0 var(--po-rim), inset 0 -1px 0 var(--po-rim-b), 0 16px 44px rgba(0,0,0,.7), 0 0 20px rgba(244,63,94,.18);
}

.nimbus-popover[data-tone="emerald"]{
  --po-tint:linear-gradient(135deg, rgba(6,32,24,.5), rgba(4,24,18,.3));
  --po-fg:#ECFDF5;
  --po-soft:rgba(209,250,229,.78);
  --po-rim:rgba(16,185,129,.55);
  --po-rim-b:rgba(16,185,129,.2);
  --po-border:rgba(16,185,129,.3);
  --po-shadow:inset 0 1px 0 var(--po-rim), inset 0 -1px 0 var(--po-rim-b), 0 16px 44px rgba(0,0,0,.7), 0 0 20px rgba(16,185,129,.18);
}

.npo-glass{
  position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;
  background:var(--po-tint);
  -webkit-backdrop-filter:blur(18px) saturate(180%) brightness(1.08);
  backdrop-filter:blur(18px) saturate(180%) brightness(1.08);
  border:1px solid var(--po-border);
  box-shadow:var(--po-shadow);
}

.npo-glass::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  pointer-events:none;
  background:radial-gradient(100% 70% at 50% 0%, rgba(255,255,255,.4), rgba(255,255,255,0) 65%);
}

.nimbus-popover[data-tone="dark"] .npo-glass::before,
.nimbus-popover[data-tone="midnight"] .npo-glass::before{
  background:radial-gradient(100% 70% at 50% 0%, rgba(255,255,255,.22), rgba(255,255,255,0) 65%);
}

@keyframes npoDropIn{from{opacity:0;transform:scale(.94) translateY(-4px)}to{opacity:1;transform:scale(1) translateY(0)}}

@media (prefers-reduced-motion:reduce){
  .nimbus-popover{animation:none!important}
}
`

type PopoverContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  tone: PopoverTone
  triggerRef: React.MutableRefObject<HTMLElement | null>
  contentRef: React.MutableRefObject<HTMLDivElement | null>
}
const PopoverContext = React.createContext<PopoverContextValue | null>(null)

export function LiquidPopover({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  tone = "light",
}: LiquidPopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const triggerRef = React.useRef<HTMLElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement | null>(null)

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(newOpen)
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  const ctxValue = React.useMemo<PopoverContextValue>(
    () => ({ open, setOpen, tone, triggerRef, contentRef }),
    [open, setOpen, tone]
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NPO_CSS }} />
      <PopoverContext.Provider value={ctxValue}>
        <div className="nimbus-popover-anchor">{children}</div>
      </PopoverContext.Provider>
    </>
  )
}

export function LiquidPopoverTrigger({ children, asChild, className = "", style, ...props }: LiquidPopoverTriggerProps) {
  const ctx = React.useContext(PopoverContext)
  const handleClick = (e: React.MouseEvent) => {
    ctx?.setOpen(!ctx.open)
    const childProps = (children as React.ReactElement)?.props
    childProps?.onClick?.(e)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: ctx?.triggerRef,
      onClick: handleClick,
      "aria-haspopup": "dialog",
      "aria-expanded": ctx?.open,
    })
  }

  return (
    <button
      ref={ctx?.triggerRef as React.RefObject<HTMLButtonElement>}
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

export const LiquidPopoverContent = React.forwardRef<HTMLDivElement, LiquidPopoverContentProps>(function LiquidPopoverContent(
  {
    children,
    side = "bottom",
    align = "center",
    sideOffset = 12,
    className = "",
    style,
    onEscapeKeyDown,
    onPointerDownOutside,
    ...props
  },
  forwardedRef
) {
  const ctx = React.useContext(PopoverContext)
  const innerRef = React.useRef<HTMLDivElement | null>(null)
  const [coords, setCoords] = React.useState<{ top: number; left: number } | null>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useImperativeHandle(forwardedRef, () => innerRef.current!)
  React.useEffect(() => {
    if (ctx) ctx.contentRef.current = innerRef.current
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate anchored fixed coordinates with viewport flipping
  const updatePosition = React.useCallback(() => {
    if (!ctx?.triggerRef.current) return
    const triggerRect = ctx.triggerRef.current.getBoundingClientRect()
    const contentWidth = innerRef.current ? innerRef.current.offsetWidth : 280
    const contentHeight = innerRef.current ? innerRef.current.offsetHeight : 150
    const gap = sideOffset ?? 12
    const vw = window.innerWidth
    const vh = window.innerHeight

    let resolvedSide = side
    // Flip side if leaving viewport
    if (resolvedSide === "bottom" && triggerRect.bottom + gap + contentHeight > vh) {
      if (triggerRect.top - gap - contentHeight >= 0) resolvedSide = "top"
    } else if (resolvedSide === "top" && triggerRect.top - gap - contentHeight < 0) {
      if (triggerRect.bottom + gap + contentHeight <= vh) resolvedSide = "bottom"
    }

    let top = 0
    let left = 0

    if (resolvedSide === "bottom") {
      top = triggerRect.bottom + gap
      if (align === "start") left = triggerRect.left
      else if (align === "end") left = triggerRect.right - contentWidth
      else left = triggerRect.left + (triggerRect.width - contentWidth) / 2
    } else if (resolvedSide === "top") {
      top = triggerRect.top - gap - contentHeight
      if (align === "start") left = triggerRect.left
      else if (align === "end") left = triggerRect.right - contentWidth
      else left = triggerRect.left + (triggerRect.width - contentWidth) / 2
    } else if (resolvedSide === "left") {
      left = triggerRect.left - gap - contentWidth
      if (align === "start") top = triggerRect.top
      else if (align === "end") top = triggerRect.bottom - contentHeight
      else top = triggerRect.top + (triggerRect.height - contentHeight) / 2
    } else if (resolvedSide === "right") {
      left = triggerRect.right + gap
      if (align === "start") top = triggerRect.top
      else if (align === "end") top = triggerRect.bottom - contentHeight
      else top = triggerRect.top + (triggerRect.height - contentHeight) / 2
    }

    // Keep within viewport boundaries
    left = Math.max(12, Math.min(vw - contentWidth - 12, left))
    top = Math.max(12, Math.min(vh - contentHeight - 12, top))

    setCoords({ top, left })
  }, [align, ctx?.triggerRef, side, sideOffset])

  React.useLayoutEffect(() => {
    if (!ctx?.open) return
    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [ctx?.open, updatePosition])

  // Dismiss on click outside or Escape
  React.useEffect(() => {
    if (!ctx?.open) return

    const handlePointerDown = (e: PointerEvent) => {
      const content = innerRef.current
      const trigger = ctx.triggerRef.current
      const target = e.target as Node | null
      if (content && !content.contains(target) && trigger && !trigger.contains(target)) {
        onPointerDownOutside?.(e)
        if (!e.defaultPrevented) ctx.setOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscapeKeyDown?.(e)
        if (!e.defaultPrevented) ctx.setOpen(false)
      }
    }

    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [ctx, onEscapeKeyDown, onPointerDownOutside])

  if (!ctx?.open) return null

  const popoverElement = (
    <div
      ref={innerRef}
      role="dialog"
      tabIndex={-1}
      data-side={side}
      data-align={align}
      data-tone={ctx.tone}
      className={`nimbus-popover ${className}`}
      style={{
        ...style,
        ...(coords ? { top: `${coords.top}px`, left: `${coords.left}px` } : { visibility: "hidden" as const }),
      }}
      {...props}
    >
      <span className="npo-glass" aria-hidden="true" />
      {children}
    </div>
  )

  if (mounted && typeof document !== "undefined") {
    return ReactDOM.createPortal(popoverElement, document.body)
  }

  return popoverElement
})

export function LiquidPopoverClose({ children, asChild, className = "", style, ...props }: LiquidPopoverCloseProps) {
  const ctx = React.useContext(PopoverContext)
  const handleClick = (e: React.MouseEvent) => {
    ctx?.setOpen(false)
    const childProps = (children as React.ReactElement)?.props
    childProps?.onClick?.(e)
  }

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
  LiquidPopover as Popover,
  LiquidPopoverTrigger as PopoverTrigger,
  LiquidPopoverContent as PopoverContent,
  LiquidPopoverClose as PopoverClose,
  LiquidPopover as Component,
}
export default LiquidPopover

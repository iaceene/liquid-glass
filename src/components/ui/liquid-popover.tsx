"use client"

/**
 * Nimbus UI · Liquid Popover — "Tidal Pearl"
 * An anchored glass reservoir that surfaces floating content beside a trigger.
 * Features refraction sheen, directional pointer arrow, outside-click detection,
 * and smooth opening physics with full keyboard accessibility.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

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
.nimbus-popover-anchor{position:relative;display:inline-block}

.nimbus-popover{--po-tint:rgba(255,255,255,.24);--po-fg:#0B132B;--po-soft:rgba(11,19,43,.64);--po-rim:rgba(255,255,255,.8);--po-line:rgba(11,19,43,.1);
  position:absolute;z-index:9990;box-sizing:border-box;width:280px;padding:16px;border-radius:20px;isolation:isolate;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  font-size:14px;color:var(--po-fg);line-height:1.45;outline:none;
  animation:npoDropIn .22s cubic-bezier(.34,1.4,.64,1) both}
.nimbus-popover[data-tone="dark"]{--po-tint:rgba(10,18,40,.4);--po-fg:#F1F7FF;--po-soft:rgba(241,247,255,.66);--po-rim:rgba(255,255,255,.32);--po-line:rgba(241,247,255,.12)}
.nimbus-popover[data-tone="midnight"]{--po-tint:rgba(4,7,16,.68);--po-fg:#FFFFFF;--po-soft:rgba(255,255,255,.68);--po-rim:rgba(0,210,255,.5);--po-line:rgba(0,210,255,.15)}
.nimbus-popover[data-tone="aurora"]{--po-tint:rgba(12,28,42,.62);--po-fg:#F0FDF4;--po-soft:rgba(240,253,244,.72);--po-rim:rgba(52,211,153,.58);--po-line:rgba(52,211,153,.15)}
.nimbus-popover[data-tone="sunset"]{--po-tint:rgba(38,18,8,.6);--po-fg:#FFFBEB;--po-soft:rgba(254,243,199,.75);--po-rim:rgba(251,191,36,.55);--po-line:rgba(251,191,36,.15)}
.nimbus-popover[data-tone="rose"]{--po-tint:rgba(40,12,28,.6);--po-fg:#FFF1F2;--po-soft:rgba(255,228,230,.75);--po-rim:rgba(244,63,94,.55);--po-line:rgba(244,63,94,.15)}
.nimbus-popover[data-tone="emerald"]{--po-tint:rgba(6,32,24,.6);--po-fg:#ECFDF5;--po-soft:rgba(209,250,229,.75);--po-rim:rgba(16,185,129,.55);--po-line:rgba(16,185,129,.15)}

.npo-glass{position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--po-tint);
  -webkit-backdrop-filter:blur(16px) saturate(1.2) brightness(1.06);backdrop-filter:blur(16px) saturate(1.2) brightness(1.06);
  box-shadow:inset 0 1px 1px var(--po-rim),inset 0 0 0 1px rgba(255,255,255,.22),0 20px 44px -14px rgba(0,40,90,.55),0 3px 8px rgba(0,40,90,.1)}
.nimbus-popover[data-tone="dark"] .npo-glass{box-shadow:inset 0 1px 1px var(--po-rim),inset 0 0 0 1px rgba(255,255,255,.12),0 22px 50px -14px rgba(0,0,0,.8)}
.nimbus-popover[data-tone="midnight"] .npo-glass{box-shadow:inset 0 1px 1px var(--po-rim),inset 0 0 0 1px rgba(0,210,255,.2),0 24px 54px -14px rgba(0,0,0,.92),0 0 14px rgba(0,210,255,.12)}
.nimbus-popover[data-tone="aurora"] .npo-glass{box-shadow:inset 0 1px 1px var(--po-rim),inset 0 0 0 1px rgba(52,211,153,.2),0 22px 50px -14px rgba(0,0,0,.85)}
.nimbus-popover[data-tone="sunset"] .npo-glass{box-shadow:inset 0 1px 1px var(--po-rim),inset 0 0 0 1px rgba(245,158,11,.2),0 22px 50px -14px rgba(0,0,0,.85)}
.nimbus-popover[data-tone="rose"] .npo-glass{box-shadow:inset 0 1px 1px var(--po-rim),inset 0 0 0 1px rgba(244,63,94,.2),0 22px 50px -14px rgba(0,0,0,.85)}
.nimbus-popover[data-tone="emerald"] .npo-glass{box-shadow:inset 0 1px 1px var(--po-rim),inset 0 0 0 1px rgba(16,185,129,.2),0 22px 50px -14px rgba(0,0,0,.85)}

.npo-sheen{position:absolute;inset:0;border-radius:inherit;z-index:-1;pointer-events:none;
  background:radial-gradient(100% 70% at 50% 0%,rgba(255,255,255,.3),rgba(255,255,255,0) 65%)}
.nimbus-popover[data-tone="dark"] .npo-sheen{background:radial-gradient(100% 70% at 50% 0%,rgba(255,255,255,.12),rgba(255,255,255,0) 65%)}

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
    sideOffset = 8,
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

  React.useImperativeHandle(forwardedRef, () => innerRef.current!)
  React.useEffect(() => {
    if (ctx) ctx.contentRef.current = innerRef.current
  })

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

  // Positioning style
  const placementStyle: React.CSSProperties = { ...style }
  if (side === "bottom") {
    placementStyle.top = `calc(100% + ${sideOffset}px)`
    if (align === "center") {
      placementStyle.left = "50%"
      placementStyle.transform = "translateX(-50%)"
    } else if (align === "start") {
      placementStyle.left = "0"
    } else {
      placementStyle.right = "0"
    }
  } else if (side === "top") {
    placementStyle.bottom = `calc(100% + ${sideOffset}px)`
    if (align === "center") {
      placementStyle.left = "50%"
      placementStyle.transform = "translateX(-50%)"
    } else if (align === "start") {
      placementStyle.left = "0"
    } else {
      placementStyle.right = "0"
    }
  } else if (side === "left") {
    placementStyle.right = `calc(100% + ${sideOffset}px)`
    placementStyle.top = align === "center" ? "50%" : align === "start" ? "0" : "auto"
    if (align === "center") placementStyle.transform = "translateY(-50%)"
  } else if (side === "right") {
    placementStyle.left = `calc(100% + ${sideOffset}px)`
    placementStyle.top = align === "center" ? "50%" : align === "start" ? "0" : "auto"
    if (align === "center") placementStyle.transform = "translateY(-50%)"
  }

  return (
    <div
      ref={innerRef}
      role="dialog"
      tabIndex={-1}
      data-side={side}
      data-align={align}
      data-tone={ctx.tone}
      className={`nimbus-popover ${className}`}
      style={placementStyle}
      {...props}
    >
      <span className="npo-glass" aria-hidden="true" />
      <span className="npo-sheen" aria-hidden="true" />
      {children}
    </div>
  )
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
}
export default LiquidPopover

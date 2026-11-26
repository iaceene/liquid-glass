"use client"

/**
 * Nimbus UI · Liquid Dropdown Menu — "Cascading Pool"
 * A floating glass cascading menu. Active item is embraced by a fluid water pool that
 * glides across items with spring physics. Supports arrow keys navigation, enter/space
 * selection, shortcuts, separators, checkbox/radio items, and escape dismissal.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"

export type DropdownMenuTone = "light" | "dark" | "midnight" | "aurora" | "sunset" | "rose" | "emerald"

export type LiquidDropdownMenuProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  tone?: DropdownMenuTone
}

export type LiquidDropdownMenuTriggerProps = {
  children?: React.ReactNode
  asChild?: boolean
  className?: string
  style?: React.CSSProperties
}

export type LiquidDropdownMenuContentProps = {
  children?: React.ReactNode
  align?: "start" | "center" | "end"
  sideOffset?: number
  className?: string
  style?: React.CSSProperties
  onEscapeKeyDown?: (e: KeyboardEvent) => void
  onPointerDownOutside?: (e: PointerEvent) => void
}

export type LiquidDropdownMenuItemProps = {
  children?: React.ReactNode
  disabled?: boolean
  onSelect?: () => void
  icon?: React.ReactNode
  shortcut?: string
  className?: string
  style?: React.CSSProperties
  id?: string
}

export type LiquidDropdownMenuSeparatorProps = {
  className?: string
  style?: React.CSSProperties
}

export type LiquidDropdownMenuLabelProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/* ---------- styles ---------- */
const NDM_CSS = `
.nimbus-dropdown-root{position:relative;display:inline-block}

.nimbus-dropdown-content{--dm-tint:rgba(255,255,255,.24);--dm-fg:#0B132B;--dm-soft:rgba(11,19,43,.62);--dm-rim:rgba(255,255,255,.8);--dm-line:rgba(11,19,43,.08);
  position:absolute;z-index:9990;box-sizing:border-box;min-width:180px;padding:6px;border-radius:18px;isolation:isolate;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  font-size:13px;color:var(--dm-fg);line-height:1.3;outline:none;
  animation:ndmCascade .22s cubic-bezier(.34,1.4,.64,1) both}
.nimbus-dropdown-content[data-tone="dark"]{--dm-tint:rgba(10,18,40,.4);--dm-fg:#F1F7FF;--dm-soft:rgba(241,247,255,.66);--dm-rim:rgba(255,255,255,.32);--dm-line:rgba(241,247,255,.1)}
.nimbus-dropdown-content[data-tone="midnight"]{--dm-tint:rgba(4,7,16,.68);--dm-fg:#FFFFFF;--dm-soft:rgba(255,255,255,.68);--dm-rim:rgba(0,210,255,.5);--dm-line:rgba(0,210,255,.15)}
.nimbus-dropdown-content[data-tone="aurora"]{--dm-tint:rgba(12,28,42,.62);--dm-fg:#F0FDF4;--dm-soft:rgba(240,253,244,.72);--dm-rim:rgba(52,211,153,.58);--dm-line:rgba(52,211,153,.15)}
.nimbus-dropdown-content[data-tone="sunset"]{--dm-tint:rgba(38,18,8,.6);--dm-fg:#FFFBEB;--dm-soft:rgba(254,243,199,.75);--dm-rim:rgba(251,191,36,.55);--dm-line:rgba(251,191,36,.15)}
.nimbus-dropdown-content[data-tone="rose"]{--dm-tint:rgba(40,12,28,.6);--dm-fg:#FFF1F2;--dm-soft:rgba(255,228,230,.75);--dm-rim:rgba(244,63,94,.55);--dm-line:rgba(244,63,94,.15)}
.nimbus-dropdown-content[data-tone="emerald"]{--dm-tint:rgba(6,32,24,.6);--dm-fg:#ECFDF5;--dm-soft:rgba(209,250,229,.75);--dm-rim:rgba(16,185,129,.55);--dm-line:rgba(16,185,129,.15)}

.ndm-glass{position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--dm-tint);
  -webkit-backdrop-filter:blur(16px) saturate(1.2) brightness(1.06);backdrop-filter:blur(16px) saturate(1.2) brightness(1.06);
  box-shadow:inset 0 1px 1px var(--dm-rim),inset 0 0 0 1px rgba(255,255,255,.22),0 18px 40px -12px rgba(0,40,90,.5),0 2px 6px rgba(0,40,90,.08)}
.nimbus-dropdown-content[data-tone="dark"] .ndm-glass{box-shadow:inset 0 1px 1px var(--dm-rim),inset 0 0 0 1px rgba(255,255,255,.12),0 20px 48px -12px rgba(0,0,0,.8)}
.nimbus-dropdown-content[data-tone="midnight"] .ndm-glass{box-shadow:inset 0 1px 1px var(--dm-rim),inset 0 0 0 1px rgba(0,210,255,.2),0 22px 50px -12px rgba(0,0,0,.92),0 0 12px rgba(0,210,255,.12)}
.nimbus-dropdown-content[data-tone="aurora"] .ndm-glass{box-shadow:inset 0 1px 1px var(--dm-rim),inset 0 0 0 1px rgba(52,211,153,.2),0 20px 48px -12px rgba(0,0,0,.85)}
.nimbus-dropdown-content[data-tone="sunset"] .ndm-glass{box-shadow:inset 0 1px 1px var(--dm-rim),inset 0 0 0 1px rgba(245,158,11,.2),0 20px 48px -12px rgba(0,0,0,.85)}
.nimbus-dropdown-content[data-tone="rose"] .ndm-glass{box-shadow:inset 0 1px 1px var(--dm-rim),inset 0 0 0 1px rgba(244,63,94,.2),0 20px 48px -12px rgba(0,0,0,.85)}
.nimbus-dropdown-content[data-tone="emerald"] .ndm-glass{box-shadow:inset 0 1px 1px var(--dm-rim),inset 0 0 0 1px rgba(16,185,129,.2),0 20px 48px -12px rgba(0,0,0,.85)}

.ndm-highlight{position:absolute;border-radius:12px;z-index:-1;pointer-events:none;transition:all .18s cubic-bezier(.25,.9,.3,1);
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.8),rgba(255,255,255,0) 55%),rgba(255,255,255,.45);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.95),inset 0 -2px 6px rgba(0,162,255,.2),inset 0 0 0 1px rgba(255,255,255,.55),0 4px 12px -4px rgba(0,70,140,.4)}
.nimbus-dropdown-content[data-tone="dark"] .ndm-highlight{background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.35),rgba(255,255,255,0) 55%),rgba(10,35,75,.6);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.5),inset 0 -2px 6px rgba(0,162,255,.3),inset 0 0 0 1px rgba(255,255,255,.2),0 4px 14px -4px rgba(0,0,0,.6)}

.ndm-item{position:relative;z-index:1;display:flex;align-items:center;gap:8px;height:32px;padding:0 10px;border-radius:12px;
  cursor:pointer;user-select:none;-webkit-user-select:none;outline:none;font-size:13px;font-weight:520;color:var(--dm-fg);
  transition:color .15s ease}
.ndm-item:hover:not([data-disabled="true"]),.ndm-item[data-focused="true"]{color:var(--dm-fg)}
.ndm-item[data-disabled="true"]{opacity:.4;cursor:not-allowed}
.ndm-item-icon{display:inline-flex;align-items:center;justify-content:center;color:var(--dm-soft)}
.ndm-item-label{flex:1}
.ndm-item-shortcut{margin-left:auto;font-size:11px;color:var(--dm-soft);letter-spacing:.02em}

.ndm-separator{height:1px;margin:5px 0;background:var(--dm-line);border:0}
.ndm-label{padding:4px 10px 2px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--dm-soft)}

@keyframes ndmCascade{from{opacity:0;transform:scale(.92) translateY(-6px)}to{opacity:1;transform:scale(1) translateY(0)}}

@media (prefers-reduced-motion:reduce){
  .nimbus-dropdown-content{animation:none!important}
  .ndm-highlight{transition:none!important}
}
`

type DropdownContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  tone: DropdownMenuTone
  triggerRef: React.RefObject<HTMLElement | null>
}
const DropdownContext = React.createContext<DropdownContextValue | null>(null)

export function LiquidDropdownMenu({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  tone = "light",
}: LiquidDropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const triggerRef = React.useRef<HTMLElement | null>(null)

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(newOpen)
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  const ctxValue = React.useMemo<DropdownContextValue>(
    () => ({ open, setOpen, tone, triggerRef }),
    [open, setOpen, tone]
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NDM_CSS }} />
      <DropdownContext.Provider value={ctxValue}>
        <div className="nimbus-dropdown-root">{children}</div>
      </DropdownContext.Provider>
    </>
  )
}

export function LiquidDropdownMenuTrigger({
  children,
  asChild,
  className = "",
  style,
  ...props
}: LiquidDropdownMenuTriggerProps) {
  const ctx = React.useContext(DropdownContext)
  const handleClick = (e: React.MouseEvent) => {
    ctx?.setOpen(!ctx.open)
    const childProps = (children as React.ReactElement)?.props
    childProps?.onClick?.(e)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: ctx?.triggerRef,
      onClick: handleClick,
      "aria-haspopup": "menu",
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
      aria-haspopup="menu"
      aria-expanded={ctx?.open}
      {...props}
    >
      {children}
    </button>
  )
}

export const LiquidDropdownMenuContent = React.forwardRef<HTMLDivElement, LiquidDropdownMenuContentProps>(
  function LiquidDropdownMenuContent(
    {
      children,
      align = "start",
      sideOffset = 6,
      className = "",
      style,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...props
    },
    forwardedRef
  ) {
    const ctx = React.useContext(DropdownContext)
    const innerRef = React.useRef<HTMLDivElement | null>(null)
    const highlightRef = React.useRef<HTMLSpanElement | null>(null)
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1)

    React.useImperativeHandle(forwardedRef, () => innerRef.current!)

    // Outside click & escape listeners
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

    // Update highlight rect based on hovered/focused item
    const updateHighlight = React.useCallback((itemEl: HTMLElement | null) => {
      const hl = highlightRef.current
      const container = innerRef.current
      if (!hl || !container) return
      if (!itemEl) {
        hl.style.opacity = "0"
        return
      }
      const cr = container.getBoundingClientRect()
      const ir = itemEl.getBoundingClientRect()
      hl.style.opacity = "1"
      hl.style.left = `${ir.left - cr.left}px`
      hl.style.top = `${ir.top - cr.top}px`
      hl.style.width = `${ir.width}px`
      hl.style.height = `${ir.height}px`
    }, [])

    // Keyboard roving focus
    const handleKeyDown = (e: React.KeyboardEvent) => {
      const menu = innerRef.current
      if (!menu) return
      const items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([data-disabled="true"])'))
      if (!items.length) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        const next = (focusedIndex + 1) % items.length
        setFocusedIndex(next)
        items[next].focus()
        updateHighlight(items[next])
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prev = (focusedIndex - 1 + items.length) % items.length
        setFocusedIndex(prev)
        items[prev].focus()
        updateHighlight(items[prev])
      } else if (e.key === "Home") {
        e.preventDefault()
        setFocusedIndex(0)
        items[0].focus()
        updateHighlight(items[0])
      } else if (e.key === "End") {
        e.preventDefault()
        const last = items.length - 1
        setFocusedIndex(last)
        items[last].focus()
        updateHighlight(items[last])
      }
    }

    if (!ctx?.open) return null

    const alignStyle: React.CSSProperties = { ...style, top: `calc(100% + ${sideOffset}px)` }
    if (align === "start") alignStyle.left = "0"
    else if (align === "end") alignStyle.right = "0"
    else {
      alignStyle.left = "50%"
      alignStyle.transform = "translateX(-50%)"
    }

    return (
      <div
        ref={innerRef}
        role="menu"
        tabIndex={-1}
        data-tone={ctx.tone}
        className={`nimbus-dropdown-content ${className}`}
        style={alignStyle}
        onKeyDown={handleKeyDown}
        onPointerLeave={() => updateHighlight(null)}
        {...props}
      >
        <span className="ndm-glass" aria-hidden="true" />
        <span ref={highlightRef} className="ndm-highlight" aria-hidden="true" style={{ opacity: 0 }} />
        {children}
      </div>
    )
  }
)

export function LiquidDropdownMenuItem({
  children,
  disabled = false,
  onSelect,
  icon,
  shortcut,
  className = "",
  style,
  id,
  ...props
}: LiquidDropdownMenuItemProps) {
  const ctx = React.useContext(DropdownContext)

  const handleClick = () => {
    if (disabled) return
    onSelect?.()
    ctx?.setOpen(false)
  }

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    const container = e.currentTarget.parentElement
    const hl = container?.querySelector<HTMLElement>(".ndm-highlight")
    if (hl && container) {
      const cr = container.getBoundingClientRect()
      const ir = e.currentTarget.getBoundingClientRect()
      hl.style.opacity = "1"
      hl.style.left = `${ir.left - cr.left}px`
      hl.style.top = `${ir.top - cr.top}px`
      hl.style.width = `${ir.width}px`
      hl.style.height = `${ir.height}px`
    }
  }

  return (
    <div
      role="menuitem"
      id={id}
      tabIndex={disabled ? -1 : 0}
      data-disabled={disabled}
      className={`ndm-item ${className}`}
      style={style}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      {...props}
    >
      {icon && <span className="ndm-item-icon" aria-hidden="true">{icon}</span>}
      <span className="ndm-item-label">{children}</span>
      {shortcut && <span className="ndm-item-shortcut">{shortcut}</span>}
    </div>
  )
}

export function LiquidDropdownMenuSeparator({ className = "", style, ...props }: LiquidDropdownMenuSeparatorProps) {
  return <div role="separator" className={`ndm-separator ${className}`} style={style} {...props} />
}

export function LiquidDropdownMenuLabel({ children, className = "", style, ...props }: LiquidDropdownMenuLabelProps) {
  return <div className={`ndm-label ${className}`} style={style} {...props}>{children}</div>
}

export {
  LiquidDropdownMenu as DropdownMenu,
  LiquidDropdownMenuTrigger as DropdownMenuTrigger,
  LiquidDropdownMenuContent as DropdownMenuContent,
  LiquidDropdownMenuItem as DropdownMenuItem,
  LiquidDropdownMenuSeparator as DropdownMenuSeparator,
  LiquidDropdownMenuLabel as DropdownMenuLabel,
}
export default LiquidDropdownMenu

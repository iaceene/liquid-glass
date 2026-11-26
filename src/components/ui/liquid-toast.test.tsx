import { render, screen, fireEvent, act } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { LiquidToast, LiquidToaster, toast } from "./liquid-toast"

describe("LiquidToast component", () => {
  it("renders with custom theme tones and without progress bar", () => {
    const { container } = render(
      <LiquidToast
        tone="midnight"
        title="Midnight Toast"
        description="Dark theme test"
      />
    )

    const toastEl = screen.getByRole("status")
    expect(toastEl).toHaveAttribute("data-tone", "midnight")
    expect(container.querySelector(".nto-timer")).toBeNull()
    expect(container.querySelector(".nto-timer-bar")).toBeNull()
  })

  it("handles dismiss action button and exit state", () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(
      <LiquidToast
        title="Notice"
        onDismiss={onDismiss}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Dismiss toast" }))
    expect(screen.getByRole("status")).toHaveAttribute("data-state", "closing")

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(onDismiss).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it("triggers toast imperatively and renders inside LiquidToaster", () => {
    render(<LiquidToaster />)

    act(() => {
      toast.success("Imperative Wave", { description: "Triggered from button!" })
    })

    expect(screen.getByText("Imperative Wave")).toBeInTheDocument()
    expect(screen.getByText("Triggered from button!")).toBeInTheDocument()
  })
})

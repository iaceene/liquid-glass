import { render, screen, fireEvent, act } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { LiquidTooltip } from "./liquid-tooltip"

describe("LiquidTooltip component", () => {
  it("shows tooltip on hover after delay and hides on unhover", () => {
    vi.useFakeTimers()
    render(
      <LiquidTooltip content="Help info" delayDuration={100}>
        <button type="button">Action</button>
      </LiquidTooltip>
    )

    const trigger = screen.getByRole("button", { name: "Action" })
    fireEvent.mouseEnter(trigger)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(screen.getByRole("tooltip")).toHaveTextContent("Help info")

    fireEvent.mouseLeave(trigger)
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it("shows tooltip on focus and hides on blur", () => {
    render(
      <LiquidTooltip content="Focus description">
        <button type="button">Interactive</button>
      </LiquidTooltip>
    )

    const trigger = screen.getByRole("button", { name: "Interactive" })
    fireEvent.focus(trigger)
    expect(screen.getByRole("tooltip")).toHaveTextContent("Focus description")

    fireEvent.blur(trigger)
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })
})

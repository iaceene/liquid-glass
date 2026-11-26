import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { LiquidCheckbox } from "./liquid-checkbox"

describe("LiquidCheckbox component", () => {
  it("toggles state and triggers onCheckedChange on click", () => {
    const onCheckedChange = vi.fn()
    render(<LiquidCheckbox onCheckedChange={onCheckedChange} />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("aria-checked", "false")

    fireEvent.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(checkbox).toHaveAttribute("aria-checked", "true")

    fireEvent.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledWith(false)
    expect(checkbox).toHaveAttribute("aria-checked", "false")
  })

  it("toggles on Space key press", () => {
    const onCheckedChange = vi.fn()
    render(<LiquidCheckbox onCheckedChange={onCheckedChange} />)

    const checkbox = screen.getByRole("checkbox")
    fireEvent.keyDown(checkbox, { key: " " })
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it("does not toggle when disabled", () => {
    const onCheckedChange = vi.fn()
    render(<LiquidCheckbox disabled onCheckedChange={onCheckedChange} />)

    const checkbox = screen.getByRole("checkbox")
    fireEvent.click(checkbox)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})

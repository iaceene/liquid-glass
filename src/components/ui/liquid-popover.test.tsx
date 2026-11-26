import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import {
  LiquidPopover,
  LiquidPopoverTrigger,
  LiquidPopoverContent,
  LiquidPopoverClose,
} from "./liquid-popover"

describe("LiquidPopover component", () => {
  it("toggles popover on trigger click", () => {
    render(
      <LiquidPopover>
        <LiquidPopoverTrigger>Open Reservoir</LiquidPopoverTrigger>
        <LiquidPopoverContent>
          <div>Popover body details</div>
          <LiquidPopoverClose>Done</LiquidPopoverClose>
        </LiquidPopoverContent>
      </LiquidPopover>
    )

    expect(screen.queryByText("Popover body details")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Open Reservoir" }))
    expect(screen.getByText("Popover body details")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Done" }))
    expect(screen.queryByText("Popover body details")).not.toBeInTheDocument()
  })

  it("closes popover on Escape key", () => {
    const onOpenChange = vi.fn()
    render(
      <LiquidPopover defaultOpen onOpenChange={onOpenChange}>
        <LiquidPopoverContent>
          <div>Escape Popover</div>
        </LiquidPopoverContent>
      </LiquidPopover>
    )

    expect(screen.getByText("Escape Popover")).toBeInTheDocument()
    fireEvent.keyDown(window, { key: "Escape" })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

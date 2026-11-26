import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import {
  LiquidDialog,
  LiquidDialogTrigger,
  LiquidDialogContent,
  LiquidDialogHeader,
  LiquidDialogTitle,
  LiquidDialogDescription,
  LiquidDialogClose,
} from "./liquid-dialog"

describe("LiquidDialog component", () => {
  it("opens on trigger click and displays content", () => {
    render(
      <LiquidDialog>
        <LiquidDialogTrigger>Open Chamber</LiquidDialogTrigger>
        <LiquidDialogContent>
          <LiquidDialogHeader>
            <LiquidDialogTitle>Liquid Chamber</LiquidDialogTitle>
            <LiquidDialogDescription>Modal description</LiquidDialogDescription>
          </LiquidDialogHeader>
          <div>Modal body text</div>
          <LiquidDialogClose>Close</LiquidDialogClose>
        </LiquidDialogContent>
      </LiquidDialog>
    )

    expect(screen.queryByText("Modal body text")).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Open Chamber" }))

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Liquid Chamber")).toBeInTheDocument()
    expect(screen.getByText("Modal body text")).toBeInTheDocument()
  })

  it("closes when close button is clicked", () => {
    const onOpenChange = vi.fn()
    render(
      <LiquidDialog defaultOpen onOpenChange={onOpenChange}>
        <LiquidDialogContent>
          <LiquidDialogTitle>Active Dialog</LiquidDialogTitle>
          <LiquidDialogClose>Dismiss</LiquidDialogClose>
        </LiquidDialogContent>
      </LiquidDialog>
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("closes on Escape key press", () => {
    const onOpenChange = vi.fn()
    render(
      <LiquidDialog defaultOpen onOpenChange={onOpenChange}>
        <LiquidDialogContent>
          <LiquidDialogTitle>Escape Test</LiquidDialogTitle>
        </LiquidDialogContent>
      </LiquidDialog>
    )

    fireEvent.keyDown(window, { key: "Escape" })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

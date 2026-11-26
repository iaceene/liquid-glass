import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { LiquidAlert, LiquidAlertTitle, LiquidAlertDescription } from "./liquid-alert"

describe("LiquidAlert component", () => {
  it("renders alert with title and description", () => {
    render(
      <LiquidAlert variant="info" title="System Status">
        All liquid modules operational.
      </LiquidAlert>
    )

    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText("System Status")).toBeInTheDocument()
    expect(screen.getByText("All liquid modules operational.")).toBeInTheDocument()
  })

  it("renders subcomponents LiquidAlertTitle and LiquidAlertDescription", () => {
    render(
      <LiquidAlert variant="success">
        <LiquidAlertTitle>Subcomponent Title</LiquidAlertTitle>
        <LiquidAlertDescription>Subcomponent Description</LiquidAlertDescription>
      </LiquidAlert>
    )

    expect(screen.getByText("Subcomponent Title")).toBeInTheDocument()
    expect(screen.getByText("Subcomponent Description")).toBeInTheDocument()
  })

  it("dismisses when dismiss button is clicked", () => {
    const onDismiss = vi.fn()
    render(
      <LiquidAlert dismissible onDismiss={onDismiss} title="Dismissible Alert">
        Dismissible content.
      </LiquidAlert>
    )

    fireEvent.click(screen.getByRole("button", { name: "Dismiss alert" }))
    expect(onDismiss).toHaveBeenCalled()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})

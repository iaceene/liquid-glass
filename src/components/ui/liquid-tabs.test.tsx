import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import {
  LiquidTabs,
  LiquidTabsList,
  LiquidTabsTrigger,
  LiquidTabsContent,
  NimbusTabIcons,
} from "./liquid-tabs"

describe("LiquidTabs component", () => {
  it("renders with items array, icons, badges and switches tabs", () => {
    const onValueChange = vi.fn()
    render(
      <LiquidTabs
        defaultValue="account"
        onValueChange={onValueChange}
        items={[
          {
            value: "account",
            label: "Account",
            icon: NimbusTabIcons.overview,
            fx: "glow",
            badge: "3",
            content: "Account details here",
          },
          {
            value: "password",
            label: "Password",
            icon: NimbusTabIcons.settings,
            fx: "pop",
            content: "Change password here",
          },
        ]}
      />
    )

    expect(screen.getByRole("tab", { name: /Account/i })).toHaveAttribute("aria-selected", "true")
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /Password/i })).toHaveAttribute("aria-selected", "false")
    expect(screen.getByText("Account details here")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("tab", { name: /Password/i }))
    expect(onValueChange).toHaveBeenCalledWith("password")
  })

  it("renders compound tabs API and handles keyboard arrows", () => {
    render(
      <LiquidTabs defaultValue="tab1">
        <LiquidTabsList>
          <LiquidTabsTrigger value="tab1">Tab 1</LiquidTabsTrigger>
          <LiquidTabsTrigger value="tab2">Tab 2</LiquidTabsTrigger>
        </LiquidTabsList>
        <LiquidTabsContent value="tab1">Panel 1</LiquidTabsContent>
        <LiquidTabsContent value="tab2">Panel 2</LiquidTabsContent>
      </LiquidTabs>
    )

    const list = screen.getByRole("tablist")
    const tab1 = screen.getByRole("tab", { name: "Tab 1" })
    const tab2 = screen.getByRole("tab", { name: "Tab 2" })

    expect(tab1).toHaveAttribute("aria-selected", "true")
    expect(screen.getByText("Panel 1")).toBeInTheDocument()

    // Test ArrowRight key navigation
    fireEvent.keyDown(list, { key: "ArrowRight" })
    expect(tab2).toHaveAttribute("aria-selected", "true")
  })
})

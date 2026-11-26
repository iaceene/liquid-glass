import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import {
  LiquidDropdownMenu,
  LiquidDropdownMenuTrigger,
  LiquidDropdownMenuContent,
  LiquidDropdownMenuItem,
  LiquidDropdownMenuSeparator,
  LiquidDropdownMenuLabel,
} from "./liquid-dropdown-menu"

describe("LiquidDropdownMenu component", () => {
  it("opens menu on trigger click and fires item select", () => {
    const onSelect = vi.fn()
    render(
      <LiquidDropdownMenu>
        <LiquidDropdownMenuTrigger>Menu</LiquidDropdownMenuTrigger>
        <LiquidDropdownMenuContent>
          <LiquidDropdownMenuLabel>Actions</LiquidDropdownMenuLabel>
          <LiquidDropdownMenuItem onSelect={onSelect}>Edit</LiquidDropdownMenuItem>
          <LiquidDropdownMenuSeparator />
          <LiquidDropdownMenuItem disabled>Delete</LiquidDropdownMenuItem>
        </LiquidDropdownMenuContent>
      </LiquidDropdownMenu>
    )

    expect(screen.queryByRole("menu")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Menu" }))
    expect(screen.getByRole("menu")).toBeInTheDocument()

    fireEvent.click(screen.getByText("Edit"))
    expect(onSelect).toHaveBeenCalled()
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  it("navigates items with arrow keys", () => {
    render(
      <LiquidDropdownMenu defaultOpen>
        <LiquidDropdownMenuContent>
          <LiquidDropdownMenuItem id="item1">Item 1</LiquidDropdownMenuItem>
          <LiquidDropdownMenuItem id="item2">Item 2</LiquidDropdownMenuItem>
        </LiquidDropdownMenuContent>
      </LiquidDropdownMenu>
    )

    const menu = screen.getByRole("menu")
    fireEvent.keyDown(menu, { key: "ArrowDown" })
    expect(screen.getByRole("menuitem", { name: "Item 1" })).toHaveFocus()
    fireEvent.keyDown(menu, { key: "ArrowDown" })
    expect(screen.getByRole("menuitem", { name: "Item 2" })).toHaveFocus()
  })
})

import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LiquidAuth } from "./liquid-auth"

describe("LiquidAuth component", () => {
  it("renders in login mode by default with OAuth providers", () => {
    render(<LiquidAuth />)
    expect(screen.getByRole("tab", { name: /^sign in$/i })).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tab", { name: /^create account$/i })).toHaveAttribute("aria-selected", "false")
    expect(screen.getByRole("button", { name: /sign in with google/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in with github/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in with apple/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in to your account/i })).toBeInTheDocument()
  })

  it("switches to signup mode when tab is clicked", () => {
    render(<LiquidAuth />)
    const signUpTab = screen.getByRole("tab", { name: /^create account$/i })
    fireEvent.click(signUpTab)
    expect(signUpTab).toHaveAttribute("aria-selected", "true")
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /create your account/i })).toBeInTheDocument()
  })

  it("triggers onOAuth callback when OAuth provider is clicked", async () => {
    const handleOAuth = vi.fn()
    render(<LiquidAuth onOAuth={handleOAuth} />)
    const googleBtn = screen.getByRole("button", { name: /sign in with google/i })
    fireEvent.click(googleBtn)
    expect(handleOAuth).toHaveBeenCalledWith("google")
  })

  it("toggles password visibility", () => {
    render(<LiquidAuth />)
    const pwInput = screen.getByLabelText(/^password$/i)
    expect(pwInput).toHaveAttribute("type", "password")
    const toggleBtn = screen.getAllByLabelText(/show password/i)[0]
    fireEvent.click(toggleBtn)
    expect(pwInput).toHaveAttribute("type", "text")
    fireEvent.click(screen.getAllByLabelText(/hide password/i)[0])
    expect(pwInput).toHaveAttribute("type", "password")
  })

  it("validates empty submission in login mode", () => {
    render(<LiquidAuth />)
    const submitBtn = screen.getByRole("button", { name: /sign in to your account/i })
    fireEvent.click(submitBtn)
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })

  it("successfully submits login form and transitions phase", async () => {
    const handleLogin = vi.fn().mockResolvedValue(undefined)
    render(<LiquidAuth onLogin={handleLogin} />)
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "test@nimbus.glass" } })
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "secret123" } })
    const submitBtn = screen.getByRole("button", { name: /sign in to your account/i })
    fireEvent.click(submitBtn)
    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith({
        email: "test@nimbus.glass",
        password: "secret123",
        remember: true,
      })
    })
  })

  it("applies dark tone attribute accurately", () => {
    const { container } = render(<LiquidAuth tone="dark" />)
    expect(container.firstChild).toHaveAttribute("data-tone", "dark")
  })

  it("tracks focus on input fields and uses checkout variant button with canvas water", () => {
    const { container } = render(<LiquidAuth />)
    const emailInput = screen.getByLabelText(/email address/i)
    fireEvent.focus(emailInput)
    const submitBtn = screen.getByRole("button", { name: /sign in to your account/i })
    expect(submitBtn).toHaveAttribute("data-variant", "checkout")
    expect(container.querySelector("canvas.la-water")).toBeInTheDocument()
  })
})

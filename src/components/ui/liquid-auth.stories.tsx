import type { Meta, StoryObj } from "@storybook/react-vite"
import { LiquidAuth } from "./liquid-auth"

const meta: Meta<typeof LiquidAuth> = {
  title: "Components/LiquidAuth",
  component: LiquidAuth,
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof LiquidAuth>

export const Default: Story = {
  render: () => (
    <div style={{ padding: "48px 16px", minHeight: 600, display: "flex", alignItems: "center", justifyContent: "center", background: "#DCEBF5" }}>
      <LiquidAuth
        onLogin={async (creds) => {
          await new Promise((r) => setTimeout(r, 1200))
          console.log("Logged in:", creds)
        }}
        onSignUp={async (data) => {
          await new Promise((r) => setTimeout(r, 1200))
          console.log("Signed up:", data)
        }}
        onOAuth={async (provider) => {
          await new Promise((r) => setTimeout(r, 800))
          console.log("OAuth with:", provider)
        }}
        onForgotPassword={() => alert("Forgot password clicked!")}
      />
    </div>
  ),
}

export const SignUpMode: Story = {
  render: () => (
    <div style={{ padding: "48px 16px", minHeight: 600, display: "flex", alignItems: "center", justifyContent: "center", background: "#DCEBF5" }}>
      <LiquidAuth defaultMode="signup" />
    </div>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <div style={{ padding: "48px 16px", minHeight: 600, display: "flex", alignItems: "center", justifyContent: "center", background: "#0B132B" }}>
      <LiquidAuth
        tone="dark"
        onLogin={async (creds) => {
          await new Promise((r) => setTimeout(r, 1000))
          console.log("Dark login:", creds)
        }}
      />
    </div>
  ),
}

export const MidnightOnyx: Story = {
  render: () => (
    <div style={{ padding: "48px 16px", minHeight: 600, display: "flex", alignItems: "center", justifyContent: "center", background: "#040710" }}>
      <LiquidAuth
        tone="midnight"
        onLogin={async (creds) => {
          await new Promise((r) => setTimeout(r, 1000))
          console.log("Midnight login:", creds)
        }}
      />
    </div>
  ),
}

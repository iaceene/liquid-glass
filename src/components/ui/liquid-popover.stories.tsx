import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  LiquidPopover,
  LiquidPopoverTrigger,
  LiquidPopoverContent,
  LiquidPopoverClose,
} from "./liquid-popover"
import { LiquidButton } from "./liquid-button"

const meta: Meta<typeof LiquidPopover> = {
  title: "Components/LiquidPopover",
  component: LiquidPopover,
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof LiquidPopover>

export const Default: Story = {
  render: () => (
    <LiquidPopover>
      <LiquidPopoverTrigger asChild>
        <LiquidButton variant="primary">Water Quality Stats</LiquidButton>
      </LiquidPopoverTrigger>
      <LiquidPopoverContent side="bottom" align="start">
        <h4 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 650 }}>Reservoir Status</h4>
        <p style={{ margin: "0 0 12px 0", fontSize: 13, opacity: 0.8 }}>
          Turbidity: 0.12 NTU · Salinity: 0.04% · Temperature: 18.4°C
        </p>
        <LiquidPopoverClose asChild>
          <LiquidButton size="sm" variant="ghost">Close</LiquidButton>
        </LiquidPopoverClose>
      </LiquidPopoverContent>
    </LiquidPopover>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <div style={{ padding: 48, background: "#0B132B", borderRadius: 24 }}>
      <LiquidPopover tone="dark">
        <LiquidPopoverTrigger asChild>
          <LiquidButton variant="secondary">Dark Mode Stats</LiquidButton>
        </LiquidPopoverTrigger>
        <LiquidPopoverContent side="bottom" align="start">
          <h4 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 650, color: "#F1F7FF" }}>Oceanic Depth</h4>
          <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "rgba(241,247,255,0.75)" }}>
            Current Depth: 450m · Luminescence: 88% · Ambient Pressure: 4.5 MPa
          </p>
          <LiquidPopoverClose asChild>
            <LiquidButton size="sm" variant="ghost">Dismiss</LiquidButton>
          </LiquidPopoverClose>
        </LiquidPopoverContent>
      </LiquidPopover>
    </div>
  ),
}

export const MidnightOnyx: Story = {
  render: () => (
    <div style={{ padding: 48, background: "#040710", borderRadius: 24 }}>
      <LiquidPopover tone="midnight">
        <LiquidPopoverTrigger asChild>
          <LiquidButton variant="glass">Midnight Abyss Info</LiquidButton>
        </LiquidPopoverTrigger>
        <LiquidPopoverContent side="bottom" align="start">
          <h4 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 650, color: "#FFFFFF" }}>Abyss Reservoir</h4>
          <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
            Cyan refraction active. Zero surface contamination.
          </p>
          <LiquidPopoverClose asChild>
            <LiquidButton size="sm" variant="ghost">Done</LiquidButton>
          </LiquidPopoverClose>
        </LiquidPopoverContent>
      </LiquidPopover>
    </div>
  ),
}

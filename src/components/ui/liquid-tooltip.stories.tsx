import type { Meta, StoryObj } from "@storybook/react-vite"
import { LiquidTooltip } from "./liquid-tooltip"
import { LiquidButton } from "./liquid-button"

const meta: Meta<typeof LiquidTooltip> = {
  title: "Components/LiquidTooltip",
  component: LiquidTooltip,
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof LiquidTooltip>

export const Default: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, padding: 48 }}>
      <LiquidTooltip content="Surface meniscus tooltip" side="top">
        <LiquidButton variant="secondary">Hover me (Top)</LiquidButton>
      </LiquidTooltip>
      <LiquidTooltip content="Subsurface information" side="bottom">
        <LiquidButton variant="secondary">Hover me (Bottom)</LiquidButton>
      </LiquidTooltip>
    </div>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, padding: 48, background: "#0B132B", borderRadius: 24 }}>
      <LiquidTooltip tone="dark" content="Dark oceanic dewdrop" side="top">
        <LiquidButton variant="secondary">Dark Tooltip</LiquidButton>
      </LiquidTooltip>
      <LiquidTooltip tone="midnight" content="Midnight abyss cyan bead" side="bottom">
        <LiquidButton variant="glass">Midnight Tooltip</LiquidButton>
      </LiquidTooltip>
      <LiquidTooltip tone="aurora" content="Aurora emerald luminescence" side="top">
        <LiquidButton variant="ghost">Aurora Tooltip</LiquidButton>
      </LiquidTooltip>
    </div>
  ),
}

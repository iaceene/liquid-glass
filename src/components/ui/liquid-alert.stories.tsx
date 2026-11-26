import type { Meta, StoryObj } from "@storybook/react-vite"
import { LiquidAlert, LiquidAlertTitle, LiquidAlertDescription } from "./liquid-alert"

const meta: Meta<typeof LiquidAlert> = {
  title: 'Feedback/LiquidAlert',
  component: LiquidAlert,
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof LiquidAlert>

export const Default: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 440 }}>
      <LiquidAlert variant="info" title="Water Level Normal" dismissible>
        The reservoir maintains standard equilibrium.
      </LiquidAlert>
      <LiquidAlert variant="success" title="Distillation Complete">
        Pure liquid condensed into chamber without contaminants.
      </LiquidAlert>
      <LiquidAlert variant="warning" title="Turbidity Warning">
        Elevated suspended particles detected.
      </LiquidAlert>
      <LiquidAlert variant="destructive" title="Surface Breach">
        Integrity compromised along the outer rim.
      </LiquidAlert>
    </div>
  ),
}

export const DarkModeAndThemes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 440, padding: 32, background: "#0B132B", borderRadius: 28 }}>
      <LiquidAlert tone="dark" variant="info" title="Dark Oceanic Alert" dismissible>
        Standard navy dark tone with luminous frosted highlights.
      </LiquidAlert>
      <LiquidAlert tone="midnight" variant="success">
        <LiquidAlertTitle>Midnight Abyss Active</LiquidAlertTitle>
        <LiquidAlertDescription>
          Onyx dark theme with electric cyan rim sheen.
        </LiquidAlertDescription>
      </LiquidAlert>
      <LiquidAlert tone="aurora" variant="success" title="Aurora Borealis Alert">
        Northern lights emerald-violet glow across the glass beacon.
      </LiquidAlert>
      <LiquidAlert tone="sunset" variant="warning" title="Amber Sunset Warning">
        Thermal limits near maximum dissipation threshold.
      </LiquidAlert>
      <LiquidAlert tone="rose" variant="destructive" title="Quartz Rose Breach">
        Critical perimeter warning in blush quartz glass.
      </LiquidAlert>
    </div>
  ),
}

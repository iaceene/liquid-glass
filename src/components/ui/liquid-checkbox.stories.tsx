import type { Meta, StoryObj } from "@storybook/react-vite"
import { LiquidCheckbox } from "./liquid-checkbox"

const meta: Meta<typeof LiquidCheckbox> = {
  title: 'Forms & Inputs/LiquidCheckbox',
  component: LiquidCheckbox,
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof LiquidCheckbox>

export const Default: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <LiquidCheckbox defaultChecked sound />
        <span>Enable surface tension sound</span>
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <LiquidCheckbox />
        <span>Refraction caustics</span>
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <LiquidCheckbox disabled defaultChecked />
        <span>Locked state</span>
      </label>
    </div>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: 32, background: "#0B132B", borderRadius: 24, color: "#F1F7FF" }}>
      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 650 }}>Dark Mode Checkboxes</h4>
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <LiquidCheckbox tone="dark" defaultChecked sound />
        <span>Classic Dark Mode Basin</span>
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <LiquidCheckbox tone="midnight" defaultChecked sound />
        <span>Midnight Abyss Onyx Checkbox</span>
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <LiquidCheckbox tone="aurora" defaultChecked sound />
        <span>Aurora Borealis Emerald Checkbox</span>
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <LiquidCheckbox tone="sunset" defaultChecked sound />
        <span>Amber Sunset Honey Checkbox</span>
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <LiquidCheckbox tone="rose" defaultChecked sound />
        <span>Quartz Rose Blush Checkbox</span>
      </label>
    </div>
  ),
}

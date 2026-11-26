import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  LiquidDialog,
  LiquidDialogTrigger,
  LiquidDialogContent,
  LiquidDialogHeader,
  LiquidDialogTitle,
  LiquidDialogDescription,
  LiquidDialogFooter,
  LiquidDialogClose,
} from "./liquid-dialog"
import { LiquidButton } from "./liquid-button"

const meta: Meta<typeof LiquidDialog> = {
  title: 'Overlays/LiquidDialog',
  component: LiquidDialog,
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof LiquidDialog>

export const Default: Story = {
  render: () => (
    <LiquidDialog>
      <LiquidDialogTrigger asChild>
        <LiquidButton variant="primary">Open Chamber</LiquidButton>
      </LiquidDialogTrigger>
      <LiquidDialogContent>
        <LiquidDialogHeader>
          <LiquidDialogTitle>Glass Chamber</LiquidDialogTitle>
          <LiquidDialogDescription>
            A tranquil floating modal cast from frosted glass and liquid surface tension.
          </LiquidDialogDescription>
        </LiquidDialogHeader>
        <p style={{ margin: "16px 0", fontSize: 14 }}>
          This dialog automatically manages focus, traps tab events, and dismisses smoothly on escape or outside clicks.
        </p>
        <LiquidDialogFooter>
          <LiquidDialogClose asChild>
            <LiquidButton variant="ghost">Cancel</LiquidButton>
          </LiquidDialogClose>
          <LiquidButton variant="primary">Confirm</LiquidButton>
        </LiquidDialogFooter>
      </LiquidDialogContent>
    </LiquidDialog>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <div style={{ padding: 48, background: "#0B132B", borderRadius: 24 }}>
      <LiquidDialog tone="dark">
        <LiquidDialogTrigger asChild>
          <LiquidButton variant="secondary">Open Dark Chamber</LiquidButton>
        </LiquidDialogTrigger>
        <LiquidDialogContent>
          <LiquidDialogHeader>
            <LiquidDialogTitle>Obsidian Chamber</LiquidDialogTitle>
            <LiquidDialogDescription>
              Deep oceanic dark mode with bioluminescent azure water reflections.
            </LiquidDialogDescription>
          </LiquidDialogHeader>
          <p style={{ margin: "16px 0", fontSize: 14, color: "#F1F7FF", opacity: 0.85 }}>
            Subsurface caustics and night rim sheen engineered for high-contrast dark environments.
          </p>
          <LiquidDialogFooter>
            <LiquidDialogClose asChild>
              <LiquidButton variant="ghost">Dismiss</LiquidButton>
            </LiquidDialogClose>
            <LiquidButton variant="primary">Accept</LiquidButton>
          </LiquidDialogFooter>
        </LiquidDialogContent>
      </LiquidDialog>
    </div>
  ),
}

export const MidnightOnyx: Story = {
  render: () => (
    <div style={{ padding: 48, background: "#040710", borderRadius: 24 }}>
      <LiquidDialog tone="midnight">
        <LiquidDialogTrigger asChild>
          <LiquidButton variant="glass">Open Midnight Abyss</LiquidButton>
        </LiquidDialogTrigger>
        <LiquidDialogContent>
          <LiquidDialogHeader>
            <LiquidDialogTitle>Abyss Chamber</LiquidDialogTitle>
            <LiquidDialogDescription>
              Ultra-deep onyx glass with electric cyan rim specular reflection.
            </LiquidDialogDescription>
          </LiquidDialogHeader>
          <p style={{ margin: "16px 0", fontSize: 14, color: "#FFFFFF", opacity: 0.85 }}>
            Optimal for immersive dark dashboards and neon Frutiger Aero aesthetic themes.
          </p>
          <LiquidDialogFooter>
            <LiquidDialogClose asChild>
              <LiquidButton variant="ghost">Close</LiquidButton>
            </LiquidDialogClose>
            <LiquidButton variant="primary">Proceed</LiquidButton>
          </LiquidDialogFooter>
        </LiquidDialogContent>
      </LiquidDialog>
    </div>
  ),
}

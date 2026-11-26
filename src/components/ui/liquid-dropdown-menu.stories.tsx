import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  LiquidDropdownMenu,
  LiquidDropdownMenuTrigger,
  LiquidDropdownMenuContent,
  LiquidDropdownMenuItem,
  LiquidDropdownMenuSeparator,
  LiquidDropdownMenuLabel,
} from "./liquid-dropdown-menu"
import { LiquidButton } from "./liquid-button"

const meta: Meta<typeof LiquidDropdownMenu> = {
  title: 'Overlays/LiquidDropdownMenu',
  component: LiquidDropdownMenu,
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof LiquidDropdownMenu>

export const Default: Story = {
  render: () => (
    <div style={{ padding: 48 }}>
      <LiquidDropdownMenu>
        <LiquidDropdownMenuTrigger asChild>
          <LiquidButton variant="primary">Cascading Actions</LiquidButton>
        </LiquidDropdownMenuTrigger>
        <LiquidDropdownMenuContent align="start">
          <LiquidDropdownMenuLabel>Water Control</LiquidDropdownMenuLabel>
          <LiquidDropdownMenuItem shortcut="⌘S">Save State</LiquidDropdownMenuItem>
          <LiquidDropdownMenuItem shortcut="⌘D">Duplicate Drop</LiquidDropdownMenuItem>
          <LiquidDropdownMenuSeparator />
          <LiquidDropdownMenuItem shortcut="⌘R">Reset Level</LiquidDropdownMenuItem>
        </LiquidDropdownMenuContent>
      </LiquidDropdownMenu>
    </div>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <div style={{ padding: 48, background: "#0B132B", borderRadius: 24 }}>
      <LiquidDropdownMenu tone="dark">
        <LiquidDropdownMenuTrigger asChild>
          <LiquidButton variant="secondary">Dark Menu (Navy)</LiquidButton>
        </LiquidDropdownMenuTrigger>
        <LiquidDropdownMenuContent align="start">
          <LiquidDropdownMenuLabel>Subsurface Controls</LiquidDropdownMenuLabel>
          <LiquidDropdownMenuItem shortcut="⌘K">Search Waves</LiquidDropdownMenuItem>
          <LiquidDropdownMenuItem shortcut="⌘P">Profile Drop</LiquidDropdownMenuItem>
          <LiquidDropdownMenuSeparator />
          <LiquidDropdownMenuItem disabled>Locked Depth</LiquidDropdownMenuItem>
        </LiquidDropdownMenuContent>
      </LiquidDropdownMenu>
    </div>
  ),
}

export const MidnightOnyx: Story = {
  render: () => (
    <div style={{ padding: 48, background: "#040710", borderRadius: 24 }}>
      <LiquidDropdownMenu tone="midnight">
        <LiquidDropdownMenuTrigger asChild>
          <LiquidButton variant="glass">Midnight Abyss Menu</LiquidButton>
        </LiquidDropdownMenuTrigger>
        <LiquidDropdownMenuContent align="start">
          <LiquidDropdownMenuLabel>Abyss Chamber</LiquidDropdownMenuLabel>
          <LiquidDropdownMenuItem shortcut="⌘E">Electric Pulse</LiquidDropdownMenuItem>
          <LiquidDropdownMenuItem shortcut="⌘A">Aurora Beam</LiquidDropdownMenuItem>
          <LiquidDropdownMenuSeparator />
          <LiquidDropdownMenuItem shortcut="⌘Q">Purge Reservoir</LiquidDropdownMenuItem>
        </LiquidDropdownMenuContent>
      </LiquidDropdownMenu>
    </div>
  ),
}

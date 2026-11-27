import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { LiquidCommandMenu } from './liquid-command-menu'
import { LiquidButton } from './liquid-button'

const sampleGroups = [
  {
    title: 'Actions',
    items: [
      { id: '1', label: 'Create New Stream', shortcut: '⌘N' },
      { id: '2', label: 'Flush Water Buffer', shortcut: '⌘B' },
      { id: '3', label: 'Purge Telemetry', shortcut: '⌘P' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { id: '4', label: 'Go to Tidepool Dashboard', shortcut: 'G D' },
      { id: '5', label: 'Go to Settings', shortcut: 'G S' },
      { id: '6', label: 'Open Wave Analyzer', shortcut: 'G W' },
    ],
  },
]

const meta: Meta<typeof LiquidCommandMenu> = {
  title: 'Overlays & Dialogs/LiquidCommandMenu',
  component: LiquidCommandMenu,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Shading tone for light or dark surfaces',
    },
    sound: {
      control: 'boolean',
      description: 'Synthesized navigation audio feedback',
    },
  },
}

export default meta
type Story = StoryObj<typeof LiquidCommandMenu>

export const Interactive: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false)
    return (
      <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <LiquidButton variant="primary" onClick={() => setOpen(true)}>
          Open Command Menu (or press ⌘K)
        </LiquidButton>
        <span style={{ fontSize: 13, opacity: 0.7 }}>
          Press <b>⌘K</b> or click the button above to launch.
        </span>
        <LiquidCommandMenu {...args} open={open} onOpenChange={setOpen} groups={sampleGroups} />
      </div>
    )
  },
}

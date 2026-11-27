import type { Meta, StoryObj } from '@storybook/react-vite'
import { LiquidBreadcrumb } from './liquid-breadcrumb'

const meta: Meta<typeof LiquidBreadcrumb> = {
  title: 'Navigation/LiquidBreadcrumb',
  component: LiquidBreadcrumb,
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
type Story = StoryObj<typeof LiquidBreadcrumb>

export const Default: Story = {
  args: {
    items: [
      { label: 'Workspaces', href: '#' },
      { label: 'Nimbus UI', href: '#' },
      { label: 'Tidepool', current: true },
    ],
  },
}

export const LongTrail: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Infrastructure', href: '#' },
      { label: 'Clusters', href: '#' },
      { label: 'us-east-1', href: '#' },
      { label: 'Relay-42', current: true },
    ],
  },
}

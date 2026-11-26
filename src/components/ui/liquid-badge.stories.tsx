import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidBadge } from './liquid-badge';

const meta: Meta<typeof LiquidBadge> = {
  title: 'Data Display/LiquidBadge',
  component: LiquidBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'destructive', 'outline', 'glass'],
      description: 'Visual palette',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Badge scale',
    },
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Tone theme',
    },
    dot: {
      control: 'boolean',
      description: 'Show live water bead',
    },
    interactive: {
      control: 'boolean',
      description: 'Hover and tap responsiveness',
    },
  },
  args: {
    children: 'Active Drop',
    variant: 'default',
    size: 'default',
    tone: 'light',
    dot: true,
  },
};

export default meta;
type Story = StoryObj<typeof LiquidBadge>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-[140px] w-full items-center justify-center p-8 bg-[#DCEBF5] rounded-2xl">
      <LiquidBadge {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center justify-center p-8 bg-[#DCEBF5] rounded-2xl">
      <LiquidBadge variant="default" dot>Default</LiquidBadge>
      <LiquidBadge variant="primary" dot>Primary</LiquidBadge>
      <LiquidBadge variant="secondary">Secondary</LiquidBadge>
      <LiquidBadge variant="glass" dot>Glass Bead</LiquidBadge>
      <LiquidBadge variant="destructive" dot>Destructive</LiquidBadge>
      <LiquidBadge variant="outline">Outline</LiquidBadge>
    </div>
  ),
};

export const DarkTone: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center justify-center p-8 bg-[#0B132B] rounded-2xl text-white">
      <LiquidBadge tone="dark" variant="default" dot>Dark Cyan</LiquidBadge>
      <LiquidBadge tone="dark" variant="glass" dot>Dark Glass</LiquidBadge>
      <LiquidBadge tone="dark" variant="secondary">Dark Secondary</LiquidBadge>
      <LiquidBadge tone="dark" variant="destructive" dot>Dark Ruby</LiquidBadge>
      <LiquidBadge tone="dark" variant="outline">Dark Outline</LiquidBadge>
    </div>
  ),
};

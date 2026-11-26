import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidAvatar } from './liquid-avatar';

const meta: Meta<typeof LiquidAvatar> = {
  title: 'Data Display/LiquidAvatar',
  component: LiquidAvatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'Avatar scale',
    },
    status: {
      control: 'select',
      options: ['online', 'busy', 'away', 'offline'],
      description: 'Live status bead',
    },
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Tone theme',
    },
    ring: {
      control: 'boolean',
      description: 'Extra luminous rim ring',
    },
  },
  args: {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    alt: 'Alex Rivera',
    size: 'default',
    status: 'online',
    ring: true,
  },
};

export default meta;
type Story = StoryObj<typeof LiquidAvatar>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-[160px] w-full items-center justify-center p-8 bg-[#DCEBF5] rounded-2xl">
      <LiquidAvatar {...args} />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 justify-center p-8 bg-[#DCEBF5] rounded-2xl">
      <LiquidAvatar size="sm" fallback="SM" status="offline" />
      <LiquidAvatar size="default" fallback="DF" status="away" />
      <LiquidAvatar size="lg" fallback="LG" status="busy" ring />
      <LiquidAvatar size="xl" fallback="XL" status="online" ring />
    </div>
  ),
};

export const FallbackSilhouette: Story = {
  render: () => (
    <div className="flex items-center gap-4 justify-center p-8 bg-[#DCEBF5] rounded-2xl">
      <LiquidAvatar size="default" status="online" />
      <LiquidAvatar size="lg" status="busy" ring />
    </div>
  ),
};

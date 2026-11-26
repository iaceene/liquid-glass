import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidSeparator } from './liquid-separator';

const meta: Meta<typeof LiquidSeparator> = {
  title: 'Data Display/LiquidSeparator',
  component: LiquidSeparator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Meniscus line direction',
    },
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Tone theme',
    },
    shimmer: {
      control: 'boolean',
      description: 'Active light refraction shimmer animation',
    },
  },
  args: {
    orientation: 'horizontal',
    tone: 'light',
    shimmer: true,
  },
};

export default meta;
type Story = StoryObj<typeof LiquidSeparator>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 w-full max-w-md p-8 bg-[#DCEBF5] mx-auto rounded-2xl">
      <div className="text-sm font-semibold text-slate-800">Upper Fluid Chamber</div>
      <LiquidSeparator {...args} />
      <div className="text-sm font-semibold text-slate-800">Lower Fluid Chamber</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center h-12 p-6 bg-[#DCEBF5] max-w-sm mx-auto rounded-2xl">
      <span className="text-sm font-medium">Left Vessel</span>
      <LiquidSeparator orientation="vertical" shimmer />
      <span className="text-sm font-medium">Right Vessel</span>
    </div>
  ),
};

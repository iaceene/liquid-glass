import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidNavbar } from './liquid-glass-navbar';
import { Home, Compass, Plane, CloudRain, User } from 'lucide-react';

const meta: Meta<typeof LiquidNavbar> = {
  title: 'Navigation/LiquidNavbar',
  component: LiquidNavbar,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Visual water tone: "light" for bright backgrounds, "dark" for dark backgrounds',
    },
    compact: {
      control: 'boolean',
      description: 'Compact mode showing icons only',
    },
    sound: {
      control: 'boolean',
      description: 'Synthesized audio feedback on tap',
    },
  },
  args: {
    tone: 'light',
    compact: false,
    sound: false,
  },
};

export default meta;
type Story = StoryObj<typeof LiquidNavbar>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-[220px] w-full items-center justify-center p-8 bg-[#DCEBF5] rounded-xl">
      <LiquidNavbar {...args} />
    </div>
  ),
};

export const DarkTone: Story = {
  args: {
    tone: 'dark',
  },
  render: (args) => (
    <div className="flex min-h-[220px] w-full items-center justify-center p-8 bg-[#0B132B] rounded-xl">
      <LiquidNavbar {...args} />
    </div>
  ),
};

export const Compact: Story = {
  args: {
    compact: true,
  },
  render: (args) => (
    <div className="flex min-h-[220px] w-full items-center justify-center p-8 bg-[#DCEBF5] rounded-xl">
      <LiquidNavbar {...args} />
    </div>
  ),
};

export const WithLucideIcons: Story = {
  args: {
    items: [
      { label: 'Home', icon: <Home className="h-4 w-4" />, fx: 'glow' },
      { label: 'Explore', icon: <Compass className="h-4 w-4" />, fx: 'spin' },
      { label: 'Travel', icon: <Plane className="h-4 w-4" />, fx: 'plane' },
      { label: 'Rain', icon: <CloudRain className="h-4 w-4" />, fx: 'drop' },
      { label: 'Account', icon: <User className="h-4 w-4" />, fx: 'wave' },
    ],
  },
  render: (args) => (
    <div className="flex min-h-[220px] w-full items-center justify-center p-8 bg-[#E5EEF8] rounded-xl">
      <LiquidNavbar {...args} />
    </div>
  ),
};

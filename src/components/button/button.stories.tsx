import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Plus, ArrowRight, Droplets, Volume2 } from 'lucide-react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
      description: 'Liquid glass visual treatment variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon'],
      description: 'The capsule size preset',
    },
    tone: {
      control: 'select',
      options: ['system', 'light', 'dark'],
      description: 'Tone theme override for glass styling',
    },
    sound: {
      control: 'boolean',
      description: 'Soft synthesized "plip" water drop sound on click',
    },
    disableRipple: {
      control: 'boolean',
      description: 'Disables the tactile press ripple animation',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables button interactions and applies muted surface styles',
    },
    loading: {
      control: 'boolean',
      description: 'Shows smooth spinner and disables interaction',
    },
    loadingText: {
      control: 'text',
      description: 'Optional text replacement while in loading state',
    },
    children: {
      control: 'text',
      description: 'Content rendered inside the button capsule',
    },
    onClick: { action: 'clicked' },
  },
  args: {
    variant: 'default',
    size: 'default',
    children: 'Liquid Button',
    disabled: false,
    loading: false,
    sound: true,
    disableRipple: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Liquid Button (Tap for Plip & Wave)',
    variant: 'default',
    sound: true,
  },
};

export const LiquidWaterlineDemo: Story = {
  render: () => (
    <div className="p-12 rounded-3xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex flex-col items-center justify-center gap-6 text-center">
      <div className="text-white text-sm font-medium tracking-wide opacity-90 flex items-center gap-2">
        <Droplets className="h-4 w-4" />
        Interactive WebGL Liquid Water Button (Hover & Click)
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button size="lg" variant="glass" sound className="text-white">
          <Volume2 className="mr-2 h-5 w-5 text-sky-200" />
          Click to Send Waves & Plip
        </Button>
        <Button size="lg" variant="default" sound>
          Primary Water Pill
        </Button>
      </div>
    </div>
  ),
};

export const PureLiquidGlass: Story = {
  args: {
    children: 'Pure Liquid Glass',
    variant: 'glass',
    sound: true,
  },
  render: (args) => (
    <div className="p-10 rounded-3xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center">
      <Button {...args}>
        <Droplets className="mr-2 h-4 w-4 text-sky-200" />
        Pure Liquid Glass
      </Button>
    </div>
  ),
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Frosted Glass',
    variant: 'secondary',
    sound: true,
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive Ruby Water',
    variant: 'destructive',
    sound: true,
  },
};

export const Outline: Story = {
  args: {
    children: 'Crystal Outline',
    variant: 'outline',
    sound: true,
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Action',
    variant: 'ghost',
    sound: true,
  },
};

export const Link: Story = {
  args: {
    children: 'Liquid Link',
    variant: 'link',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm" sound>Small Capsule</Button>
      <Button size="default" sound>Standard Capsule</Button>
      <Button size="lg" sound>Large Capsule</Button>
      <Button size="icon" sound aria-label="Add item">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const DarkSurfaceShowcase: Story = {
  render: () => (
    <div className="p-10 rounded-3xl bg-slate-950 flex flex-col gap-6">
      <div className="text-white text-sm font-medium tracking-wide opacity-80">
        Dark Surface Ambient Water
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="default" tone="dark" sound>Primary</Button>
        <Button variant="glass" tone="dark" sound className="text-white">Glass</Button>
        <Button variant="secondary" tone="dark" sound>Secondary</Button>
        <Button variant="outline" tone="dark" sound className="text-white">Outline</Button>
        <Button variant="destructive" tone="dark" sound>Destructive</Button>
      </div>
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <Mail className="mr-2 h-4 w-4" />
      Login with Email
    </Button>
  ),
};

export const WithTrailingIcon: Story = {
  render: (args) => (
    <Button {...args}>
      Explore Waterline
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  ),
};

export const Loading: Story = {
  args: {
    children: 'Please wait',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Capsule',
    disabled: true,
  },
};

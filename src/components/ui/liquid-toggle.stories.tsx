import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidToggle, NimbusToggleIcons } from './liquid-toggle';

const meta: Meta<typeof LiquidToggle> = {
  title: 'Forms & Inputs/LiquidToggle',
  component: LiquidToggle,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controlled toggle state',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial state when uncontrolled',
    },
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Water shader tone (light for light background, dark for dark)',
    },
    size: {
      control: { type: 'range', min: 24, max: 72, step: 2 },
      description: 'Track height in pixels (width is 2.1x)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables user interaction',
    },
    sound: {
      control: 'boolean',
      description: 'Synthesized plip audio on snap',
    },
    label: {
      control: 'text',
      description: 'Accessible ARIA switch label',
    },
    onCheckedChange: { action: 'checkedChange' },
  },
  args: {
    size: 40,
    tone: 'light',
    disabled: false,
    sound: false,
    label: 'Toggle switch',
  },
};

export default meta;
type Story = StoryObj<typeof LiquidToggle>;

export const Default: Story = {
  args: {
    defaultChecked: false,
  },
  render: (args) => (
    <div className="p-8 rounded-3xl bg-slate-100 flex items-center justify-center">
      <LiquidToggle {...args} />
    </div>
  ),
};

export const WithSunMoonIcons: Story = {
  args: {
    size: 58,
    disabled: true,
    sound: true
  },

  render: () => (
    <div className="p-10 rounded-3xl bg-gradient-to-tr from-sky-100 via-white to-blue-100 flex flex-col items-center gap-4">
      <div className="text-sm font-medium text-slate-700">Day / Night Liquid Mode</div>
      <LiquidToggle
        size={46}
        icons={{ off: NimbusToggleIcons.sun, on: NimbusToggleIcons.moon }}
        sound
        label="Theme toggle"
      />
    </div>
  )
};

export const DarkTone: Story = {
  args: {
    sound: true
  },

  render: () => (
    <div className="p-10 rounded-3xl bg-slate-950 flex flex-col items-center gap-4">
      <div className="text-sm font-medium text-slate-300">Dark Tone Water Surface</div>
      <LiquidToggle
        tone="dark"
        size={44}
        icons={{ off: NimbusToggleIcons.close, on: NimbusToggleIcons.check }}
        defaultChecked
        label="Dark tone toggle"
      />
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div className="p-8 rounded-3xl bg-slate-100 flex items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-slate-500">28px</span>
        <LiquidToggle size={28} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-slate-500">40px (Default)</span>
        <LiquidToggle size={40} defaultChecked />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-slate-500">54px (Large)</span>
        <LiquidToggle
          size={54}
          icons={{ off: NimbusToggleIcons.sun, on: NimbusToggleIcons.moon }}
        />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="p-8 rounded-3xl bg-slate-100 flex items-center justify-center gap-6">
      <LiquidToggle size={40} disabled defaultChecked={false} />
      <LiquidToggle size={40} disabled defaultChecked={true} />
    </div>
  ),
};

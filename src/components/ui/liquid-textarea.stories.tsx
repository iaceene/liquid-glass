import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidTextarea } from './liquid-textarea';

const meta: Meta<typeof LiquidTextarea> = {
  title: 'Forms & Inputs/LiquidTextarea',
  component: LiquidTextarea,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Basin size scale',
    },
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Tone for light or dark backgrounds',
    },
    showCount: {
      control: 'boolean',
      description: 'Display live character counter',
    },
    sound: {
      control: 'boolean',
      description: 'Synthesized audio feedback',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the textarea',
    },
  },
  args: {
    placeholder: 'Write your thoughts into the liquid reservoir...',
    label: 'Fluid Feedback',
    helperText: 'Your words ripple across the fluid chamber',
    size: 'default',
    tone: 'light',
    sound: true,
    showCount: true,
    maxLength: 280,
  },
};

export default meta;
type Story = StoryObj<typeof LiquidTextarea>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-[260px] w-full max-w-lg items-center justify-center p-8 bg-[#DCEBF5] mx-auto rounded-3xl">
      <LiquidTextarea {...args} />
    </div>
  ),
};

export const InvalidState: Story = {
  render: () => (
    <div className="flex min-h-[260px] w-full max-w-lg items-center justify-center p-8 bg-[#DCEBF5] mx-auto rounded-3xl">
      <LiquidTextarea
        label="Bug Report"
        defaultValue="Everything is broken."
        error="Please provide detailed steps to reproduce the issue."
        maxLength={300}
        showCount
      />
    </div>
  ),
};

export const DarkTone: Story = {
  render: () => (
    <div className="flex min-h-[260px] w-full max-w-lg items-center justify-center p-8 bg-[#0B132B] mx-auto rounded-3xl text-white">
      <LiquidTextarea
        tone="dark"
        label="Deep Reservoir Query"
        placeholder="Inspect underwater telemetry..."
        helperText="Encrypted water transmission"
        maxLength={500}
        showCount
      />
    </div>
  ),
};

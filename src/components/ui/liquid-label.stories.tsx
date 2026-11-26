import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidLabel } from './liquid-label';

const meta: Meta<typeof LiquidLabel> = {
  title: 'Components/LiquidLabel',
  component: LiquidLabel,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Typography size scale',
    },
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Color tone for bright or dark backgrounds',
    },
    required: {
      control: 'boolean',
      description: 'Show glowing fluid required bead',
    },
    optional: {
      control: 'boolean',
      description: 'Show (optional) indicator text',
    },
  },
  args: {
    children: 'Email Address',
    size: 'default',
    tone: 'light',
    required: true,
  },
};

export default meta;
type Story = StoryObj<typeof LiquidLabel>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-[140px] w-full items-center justify-center p-8 bg-[#DCEBF5] rounded-2xl">
      <LiquidLabel {...args} />
    </div>
  ),
};

export const WithDescriptionAndBadge: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-sm p-8 bg-[#DCEBF5] rounded-2xl">
      <LiquidLabel
        required
        badge="Encrypted"
        description="Used strictly for authentication and account recovery"
      >
        Security Key
      </LiquidLabel>
      <LiquidLabel
        optional
        description="Public display nickname visible to community members"
      >
        Handle
      </LiquidLabel>
    </div>
  ),
};

export const DarkTone: Story = {
  render: () => (
    <div className="flex min-h-[140px] w-full items-center justify-center p-8 bg-[#0B132B] rounded-2xl text-white">
      <LiquidLabel tone="dark" required badge="Deep Pool">
        Fluid Chamber Identity
      </LiquidLabel>
    </div>
  ),
};

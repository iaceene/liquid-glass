import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidInput, NimbusInputIcons } from './liquid-input';

const meta: Meta<typeof LiquidInput> = {
  title: 'Forms & Inputs/LiquidInput',
  component: LiquidInput,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Input size scale',
    },
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Water tone for light or dark surfaces',
    },
    clearable: {
      control: 'boolean',
      description: 'Enable one-click clear button',
    },
    sound: {
      control: 'boolean',
      description: 'Synthesized audio feedback',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input field',
    },
  },
  args: {
    placeholder: 'Enter text here...',
    size: 'default',
    tone: 'light',
    sound: true,
    clearable: true,
  },
};

export default meta;
type Story = StoryObj<typeof LiquidInput>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-[220px] w-full max-w-md items-center justify-center p-8 bg-[#DCEBF5] mx-auto rounded-3xl">
      <LiquidInput {...args} />
    </div>
  ),
};

export const WithLabelAndHelper: Story = {
  render: () => (
    <div className="flex min-h-[220px] w-full max-w-md items-center justify-center p-8 bg-[#DCEBF5] mx-auto rounded-3xl">
      <LiquidInput
        label="Account Name"
        placeholder="alex.rivera"
        icon={NimbusInputIcons.mail}
        helperText="Your unique handle on the fluid network"
        clearable
      />
    </div>
  ),
};

export const PasswordWithToggle: Story = {
  render: () => (
    <div className="flex min-h-[220px] w-full max-w-md items-center justify-center p-8 bg-[#DCEBF5] mx-auto rounded-3xl">
      <LiquidInput
        label="Password"
        type="password"
        placeholder="••••••••••••"
        icon={NimbusInputIcons.lock}
        helperText="Click the eye icon to reveal"
      />
    </div>
  ),
};

export const InvalidState: Story = {
  render: () => (
    <div className="flex min-h-[220px] w-full max-w-md items-center justify-center p-8 bg-[#DCEBF5] mx-auto rounded-3xl">
      <LiquidInput
        label="Work Email"
        defaultValue="invalid-email-address"
        error="Please provide a valid corporate email format"
        icon={NimbusInputIcons.mail}
      />
    </div>
  ),
};

export const DarkTone: Story = {
  render: () => (
    <div className="flex min-h-[220px] w-full max-w-md items-center justify-center p-8 bg-[#0B132B] mx-auto rounded-3xl text-white">
      <LiquidInput
        tone="dark"
        label="Search Deep Archive"
        placeholder="Query liquid knowledge base..."
        icon={NimbusInputIcons.search}
        clearable
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md items-center justify-center p-8 bg-[#DCEBF5] mx-auto rounded-3xl">
      <LiquidInput size="sm" placeholder="Small basin (36px)" icon={NimbusInputIcons.search} clearable />
      <LiquidInput size="default" placeholder="Default basin (44px)" icon={NimbusInputIcons.search} clearable />
      <LiquidInput size="lg" placeholder="Large basin (52px)" icon={NimbusInputIcons.search} clearable />
    </div>
  ),
};

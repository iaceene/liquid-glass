import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { LiquidButton, NimbusButtonIcons } from './liquid-button';

const meta: Meta<typeof LiquidButton> = {
  title: 'Components/LiquidButton',
  component: LiquidButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'glass', 'destructive', 'outline', 'ghost', 'checkout', 'pay'],
      description: 'Nimbus visual variant and water tint',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Physical size and touch target',
    },
    shape: {
      control: 'select',
      options: ['pill', 'rounded'],
      description: 'Corner radius profile',
    },
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Water tone for light or dark surfaces',
    },
    sound: {
      control: 'boolean',
      description: 'Synthesized audio plip feedback',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with animated water vortex',
    },
    loadingText: {
      control: 'text',
      description: 'Label shown while loading',
    },
    success: {
      control: 'boolean',
      description: 'Success state with checkmark',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interactions',
    },
  },
  args: {
    variant: 'default',
    size: 'default',
    shape: 'pill',
    tone: 'light',
    sound: true,
    children: 'Liquid Button',
  },
};

export default meta;
type Story = StoryObj<typeof LiquidButton>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-[220px] w-full items-center justify-center p-8 bg-[#DCEBF5]">
      <LiquidButton {...args} icon={NimbusButtonIcons.drop}>
        Liquid Droplet
      </LiquidButton>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-center justify-center p-10 bg-[#DCEBF5] rounded-3xl">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <LiquidButton variant="default" icon={NimbusButtonIcons.drop}>
          Default Water
        </LiquidButton>
        <LiquidButton variant="glass" icon={NimbusButtonIcons.sparkle}>
          Glass Crystal
        </LiquidButton>
        <LiquidButton variant="secondary">
          Secondary
        </LiquidButton>
        <LiquidButton variant="destructive">
          Destructive
        </LiquidButton>
        <LiquidButton variant="outline" rightIcon={NimbusButtonIcons.arrowRight}>
          Outline
        </LiquidButton>
        <LiquidButton variant="ghost">
          Ghost Pill
        </LiquidButton>
      </div>
    </div>
  ),
};

export const DarkTone: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-center justify-center p-10 bg-[#0B132B] rounded-3xl text-white">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <LiquidButton tone="dark" variant="default" icon={NimbusButtonIcons.drop}>
          Dark Primary
        </LiquidButton>
        <LiquidButton tone="dark" variant="glass" icon={NimbusButtonIcons.sparkle}>
          Dark Glass
        </LiquidButton>
        <LiquidButton tone="dark" variant="secondary">
          Dark Secondary
        </LiquidButton>
        <LiquidButton tone="dark" variant="destructive">
          Dark Destructive
        </LiquidButton>
        <LiquidButton tone="dark" variant="outline" rightIcon={NimbusButtonIcons.arrowRight}>
          Dark Outline
        </LiquidButton>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center justify-center p-8 bg-[#DCEBF5]">
      <LiquidButton size="sm">Small Drop</LiquidButton>
      <LiquidButton size="default">Default Drop</LiquidButton>
      <LiquidButton size="lg">Large Chamber</LiquidButton>
      <LiquidButton size="icon" aria-label="Water Drop">
        {NimbusButtonIcons.drop}
      </LiquidButton>
    </div>
  ),
};

export const CheckoutVariant: Story = {
  render: function CheckoutExample() {
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2400);
      }, 1400);
    };

    return (
      <div className="flex flex-col gap-6 items-center justify-center p-12 bg-gradient-to-b from-[#EEF7FF] to-[#D5E8F8]">
        <div className="flex gap-4">
          <LiquidButton
            variant="checkout"
            loading={loading}
            loadingText="Processing"
            success={success}
            onClick={handleClick}
          >
            Sign in
          </LiquidButton>
          <LiquidButton
            variant="pay"
            loading={loading}
            loadingText="Authorizing"
            success={success}
            onClick={handleClick}
          >
            Pay $42.00
          </LiquidButton>
        </div>
        <div className="flex gap-4 p-6 rounded-2xl bg-[#091124]">
          <LiquidButton
            variant="checkout"
            tone="dark"
            loading={loading}
            loadingText="Processing"
            success={success}
            onClick={handleClick}
          >
            Sign in (Dark)
          </LiquidButton>
        </div>
      </div>
    );
  },
};

export const InteractiveLifecycle: Story = {
  render: function LifecycleExample() {
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2400);
      }, 1400);
    };

    return (
      <div className="flex flex-col gap-4 items-center justify-center p-12 bg-[#DCEBF5]">
        <LiquidButton
          variant="primary"
          size="lg"
          loading={loading}
          loadingText="Condensing..."
          success={success}
          onClick={handleClick}
          rightIcon={NimbusButtonIcons.arrowRight}
        >
          Confirm Transaction
        </LiquidButton>
        <span className="text-xs text-slate-500 font-medium">Click to test loading swirl and success chime</span>
      </div>
    );
  },
};

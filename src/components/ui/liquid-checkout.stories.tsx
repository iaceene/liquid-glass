import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidCheckout, type LiquidWalletCard } from './liquid-checkout';

const DEMO_CARDS: LiquidWalletCard[] = [
  {
    id: 'c1',
    label: 'Primary Debit',
    theme: 'sky',
    brand: 'visa',
    last4: '4242',
    holder: 'ALEX RIVERA',
    expiry: '12/28',
  },
  {
    id: 'c2',
    label: 'Travel Platinum',
    theme: 'glass',
    brand: 'mastercard',
    last4: '8812',
    holder: 'ALEX RIVERA',
    expiry: '09/27',
  },
  {
    id: 'c3',
    label: 'Liquid Black',
    theme: 'deep',
    brand: 'amex',
    last4: '1004',
    holder: 'ALEX RIVERA',
    expiry: '04/29',
  },
];

const meta: Meta<typeof LiquidCheckout> = {
  title: 'Components/LiquidCheckout',
  component: LiquidCheckout,
  tags: ['autodocs'],
  argTypes: {
    amount: {
      control: 'number',
      description: 'Checkout total amount',
    },
    currency: {
      control: 'text',
      description: 'Currency code (e.g. USD, EUR, GBP)',
    },
    merchant: {
      control: 'text',
      description: 'Merchant or brand name',
    },
    layout: {
      control: 'select',
      options: ['auto', 'form', 'wallet'],
      description: 'Layout mode',
    },
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Theme tone (light or dark glass)',
    },
    sound: {
      control: 'boolean',
      description: 'Synthesized audio feedback',
    },
  },
  args: {
    amount: 84,
    currency: 'USD',
    merchant: 'Nimbus Studio',
    layout: 'form',
    tone: 'light',
    sound: true,
  },
};

export default meta;
type Story = StoryObj<typeof LiquidCheckout>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-[640px] w-full items-center justify-center p-8 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      <LiquidCheckout {...args} />
    </div>
  ),
};

export const DarkTone: Story = {
  args: {
    tone: 'dark',
    amount: 149,
    merchant: 'Deep Ocean Labs',
  },
  render: (args) => (
    <div className="flex min-h-[640px] w-full items-center justify-center p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      <LiquidCheckout {...args} />
    </div>
  ),
};

export const WalletMode: Story = {
  args: {
    layout: 'wallet',
    cards: DEMO_CARDS,
    amount: 230,
    merchant: 'Atelier Glass',
  },
  render: (args) => (
    <div className="flex min-h-[680px] w-full items-center justify-center p-8 bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-200">
      <LiquidCheckout {...args} />
    </div>
  ),
};

export const CustomPaymentHook: Story = {
  args: {
    amount: 52,
    merchant: 'Refraction Co.',
    onPay: async (details) => {
      console.log('Processing payment with details:', details);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { success: true, transactionId: 'tx_123456789' };
    },
  },
  render: (args) => (
    <div className="flex min-h-[640px] w-full items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-slate-100">
      <LiquidCheckout {...args} />
    </div>
  ),
};

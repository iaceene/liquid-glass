import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidAccordion } from './liquid-accordion';

const FAQ_ITEMS = [
  {
    question: "What is Liquid Glass UI?",
    answer: "A cohesive component library designed around physical light refraction, caustics, and fluid surface dynamics.",
  },
  {
    question: "How does the Spillway accordion work?",
    answer: "Opening an item pours water vertically into that section. When jumping between items, the pool stretches, pinches into droplets, and settles with ripples.",
  },
  {
    question: "Does it work without WebGL?",
    answer: "Yes, without WebGL it gracefully falls back to a clean, performant CSS glass surface.",
  },
  {
    question: "Is it keyboard and screen-reader accessible?",
    answer: "Full WAI-ARIA accordion pattern: proper heading tags, aria-expanded, aria-controls, ArrowUp/ArrowDown, Home, End, and reduced-motion support.",
  },
];

const meta: Meta<typeof LiquidAccordion> = {
  title: 'Data Display/LiquidAccordion',
  component: LiquidAccordion,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Water tone theme',
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether the active item can be closed',
    },
    sound: {
      control: 'boolean',
      description: 'Synthesized water plip on item open',
    },
    defaultOpen: {
      control: 'number',
      description: 'Initial open index (null = all closed)',
    },
    headingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6],
      description: 'Semantic heading level',
    },
    onOpenChange: { action: 'openChange' },
  },
  args: {
    items: FAQ_ITEMS,
    defaultOpen: 0,
    tone: 'light',
    sound: true,
    collapsible: true,
  },
};

export default meta;
type Story = StoryObj<typeof LiquidAccordion>;

export const Default: Story = {
  render: (args) => (
    <div className="p-8 rounded-3xl bg-slate-100 flex items-center justify-center">
      <LiquidAccordion {...args} />
    </div>
  ),
};

export const DarkTone: Story = {
  render: () => (
    <div className="p-10 rounded-3xl bg-slate-950 flex flex-col items-center gap-4">
      <div className="text-white text-sm font-medium tracking-wide opacity-80">
        Dark Tone Water Spillway
      </div>
      <LiquidAccordion items={FAQ_ITEMS} tone="dark" defaultOpen={1} sound />
    </div>
  ),
};

export const AllClosedInitially: Story = {
  render: () => (
    <div className="p-8 rounded-3xl bg-slate-100 flex items-center justify-center">
      <LiquidAccordion items={FAQ_ITEMS} defaultOpen={null} sound />
    </div>
  ),
};

export const NonCollapsible: Story = {
  render: () => (
    <div className="p-8 rounded-3xl bg-slate-100 flex items-center justify-center">
      <LiquidAccordion items={FAQ_ITEMS} collapsible={false} defaultOpen={0} sound />
    </div>
  ),
};

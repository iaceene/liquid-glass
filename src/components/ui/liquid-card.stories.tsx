import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  LiquidCard,
  LiquidCardHeader,
  LiquidCardTitle,
  LiquidCardDescription,
  LiquidCardContent,
  LiquidCardFooter,
} from './liquid-card';
import { LiquidButton } from './liquid-button';

const meta: Meta<typeof LiquidCard> = {
  title: 'Components/LiquidCard',
  component: LiquidCard,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['glass', 'sky', 'deep', 'ruby'],
      description: 'Water slab palette',
    },
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Tone theme',
    },
    tilt: {
      control: 'boolean',
      description: 'Cursor-driven 3D tilt with inertia',
    },
    waterLevel: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Water pool level inside the slab',
    },
    ambient: {
      control: 'boolean',
      description: 'Idle ambient waves',
    },
  },
  args: {
    theme: 'glass',
    tone: 'light',
    tilt: true,
    waterLevel: 0.38,
    ambient: true,
  },
};

export default meta;
type Story = StoryObj<typeof LiquidCard>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-[440px] w-full items-center justify-center p-10 bg-[#DCEBF5]">
      <LiquidCard {...args} className="w-[360px]">
        <LiquidCardHeader>
          <LiquidCardTitle>Refractive Studio</LiquidCardTitle>
          <LiquidCardDescription>Physical fluid light refraction on glass</LiquidCardDescription>
        </LiquidCardHeader>
        <LiquidCardContent>
          <p className="text-sm leading-relaxed opacity-85">
            Tilt your cursor across this card to watch the water level stay horizontal and slosh against the frosted glass walls.
          </p>
        </LiquidCardContent>
        <LiquidCardFooter>
          <LiquidButton size="sm" variant="primary">
            Explore Pool
          </LiquidButton>
        </LiquidCardFooter>
      </LiquidCard>
    </div>
  ),
};

export const SkyTheme: Story = {
  render: () => (
    <div className="flex min-h-[440px] w-full items-center justify-center p-10 bg-gradient-to-br from-blue-100 to-indigo-200">
      <LiquidCard theme="sky" tilt className="w-[360px]">
        <LiquidCardHeader>
          <LiquidCardTitle>Atmospheric Water</LiquidCardTitle>
          <LiquidCardDescription>High altitude azure caustics</LiquidCardDescription>
        </LiquidCardHeader>
        <LiquidCardContent>
          <p className="text-sm leading-relaxed opacity-90">
            Simulating saturated ocean blue refraction and surface tension waves.
          </p>
        </LiquidCardContent>
        <LiquidCardFooter>
          <LiquidButton size="sm" variant="glass">
            Launch
          </LiquidButton>
        </LiquidCardFooter>
      </LiquidCard>
    </div>
  ),
};

export const DeepDarkTheme: Story = {
  args: {
    waterLevel: 0.95
  },

  render: () => (
    <div className="flex min-h-[440px] w-full items-center justify-center p-10 bg-[#060D1A]">
      <LiquidCard tone="dark" theme="deep" tilt className="w-[360px]">
        <LiquidCardHeader>
          <LiquidCardTitle>Abyssal Trench</LiquidCardTitle>
          <LiquidCardDescription>Deep trench water dynamics</LiquidCardDescription>
        </LiquidCardHeader>
        <LiquidCardContent>
          <p className="text-sm leading-relaxed opacity-80">
            Phosphorescent rim lighting with deep navy liquid tint.
          </p>
        </LiquidCardContent>
        <LiquidCardFooter>
          <LiquidButton tone="dark" size="sm" variant="default">
            Submerge
          </LiquidButton>
        </LiquidCardFooter>
      </LiquidCard>
    </div>
  )
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidSkeleton } from './liquid-skeleton';

const meta: Meta<typeof LiquidSkeleton> = {
  title: 'Components/LiquidSkeleton',
  component: LiquidSkeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular'],
      description: 'Skeleton shape',
    },
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Tone theme',
    },
  },
  args: {
    variant: 'text',
    tone: 'light',
  },
};

export default meta;
type Story = StoryObj<typeof LiquidSkeleton>;

export const CardPlaceholder: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-xs p-6 bg-[#DCEBF5] mx-auto rounded-3xl">
      <div className="flex items-center gap-3">
        <LiquidSkeleton variant="circular" width={44} height={44} />
        <div className="flex flex-col gap-2 flex-1">
          <LiquidSkeleton variant="text" width="70%" />
          <LiquidSkeleton variant="text" width="40%" />
        </div>
      </div>
      <LiquidSkeleton variant="rectangular" height={120} />
      <LiquidSkeleton variant="text" />
      <LiquidSkeleton variant="text" width="85%" />
    </div>
  ),
};

export const DarkTone: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-xs p-6 bg-[#0B132B] mx-auto rounded-3xl">
      <div className="flex items-center gap-3">
        <LiquidSkeleton tone="dark" variant="circular" width={44} height={44} />
        <div className="flex flex-col gap-2 flex-1">
          <LiquidSkeleton tone="dark" variant="text" width="60%" />
          <LiquidSkeleton tone="dark" variant="text" width="35%" />
        </div>
      </div>
      <LiquidSkeleton tone="dark" variant="rectangular" height={100} />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { LiquidCalendar } from './liquid-calendar'

const meta: Meta<typeof LiquidCalendar> = {
  title: 'Forms & Inputs/LiquidCalendar',
  component: LiquidCalendar,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Shading tone for light or dark surfaces',
    },
    sound: {
      control: 'boolean',
      description: 'Synthesized navigation audio feedback',
    },
  },
}

export default meta
type Story = StoryObj<typeof LiquidCalendar>

export const Interactive: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState<Date | null>(new Date())
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <LiquidCalendar {...args} selected={selected} onSelect={setSelected} />
        {selected && (
          <span style={{ fontSize: 13, opacity: 0.8 }}>
            Selected: <b>{selected.toDateString()}</b>
          </span>
        )}
      </div>
    )
  },
}

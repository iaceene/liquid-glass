import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { LiquidPagination } from './liquid-pagination'

const meta: Meta<typeof LiquidPagination> = {
  title: 'Navigation/LiquidPagination',
  component: LiquidPagination,
  tags: ['autodocs'],
  argTypes: {
    totalPages: {
      control: 'number',
      description: 'Total number of pages',
    },
    siblingCount: {
      control: 'number',
      description: 'Number of siblings to show on each side of active page',
    },
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
type Story = StoryObj<typeof LiquidPagination>

export const Interactive: Story = {
  render: (args) => {
    const [page, setPage] = React.useState(1)
    return <LiquidPagination {...args} totalPages={10} page={page} onPageChange={setPage} />
  },
}

export const ManyPages: Story = {
  args: {
    page: 1000
  },

  render: (args) => {
    const [page, setPage] = React.useState(8)
    return <LiquidPagination {...args} totalPages={24} page={page} onPageChange={setPage} />
  }
}

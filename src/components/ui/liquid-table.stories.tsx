import type { Meta, StoryObj } from '@storybook/react-vite'
import { LiquidDataTable, type DataTableColumn } from './liquid-table'

type NodeRecord = {
  id: string
  name: string
  region: string
  latency: string
  throughput: string
  status: string
}

const sampleData: NodeRecord[] = [
  { id: '1', name: 'Alpha Tidepool', region: 'us-east-1', latency: '12ms', throughput: '4.2 GB/s', status: 'Healthy' },
  { id: '2', name: 'Beta Spillway', region: 'eu-west-1', latency: '34ms', throughput: '2.8 GB/s', status: 'Healthy' },
  { id: '3', name: 'Gamma Aqueduct', region: 'ap-southeast-1', latency: '82ms', throughput: '1.4 GB/s', status: 'Degraded' },
  { id: '4', name: 'Delta Stream', region: 'us-west-2', latency: '18ms', throughput: '5.1 GB/s', status: 'Healthy' },
  { id: '5', name: 'Epsilon Reservoir', region: 'sa-east-1', latency: '110ms', throughput: '800 MB/s', status: 'Offline' },
  { id: '6', name: 'Zeta Conduit', region: 'ap-northeast-1', latency: '95ms', throughput: '1.9 GB/s', status: 'Healthy' },
  { id: '7', name: 'Eta Cascade', region: 'eu-central-1', latency: '26ms', throughput: '3.6 GB/s', status: 'Healthy' },
]

const columns: DataTableColumn<NodeRecord>[] = [
  { key: 'name', header: 'Node Name', sortable: true },
  { key: 'region', header: 'Region', sortable: true },
  { key: 'latency', header: 'Latency', sortable: true },
  { key: 'throughput', header: 'Throughput', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (item: NodeRecord) => (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontWeight: 600,
          color: item.status === 'Healthy' ? '#18B26B' : item.status === 'Degraded' ? '#F5A623' : '#E5484D',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'currentColor',
          }}
        />
        {item.status}
      </span>
    ),
  },
]

const meta: Meta<typeof LiquidDataTable<NodeRecord>> = {
  title: 'Data & Display/LiquidDataTable',
  component: LiquidDataTable as any,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Shading tone for light or dark surfaces',
    },
    searchable: {
      control: 'boolean',
      description: 'Enable live filtering search bar',
    },
    selectable: {
      control: 'boolean',
      description: 'Enable row selection checkboxes',
    },
    pageSize: {
      control: 'number',
      description: 'Items per page',
    },
  },
}

export default meta
type Story = StoryObj<typeof LiquidDataTable>

export const Default: Story = {
  render: (args) => {
    const { searchKey: _sk, ...rest } = args as Record<string, unknown>
    return (
      <div style={{ maxWidth: 780, width: '100%' }}>
        <LiquidDataTable<NodeRecord>
          {...(rest as any)}
          data={sampleData}
          columns={columns}
          pageSize={4}
          selectable={true}
        />
      </div>
    )
  },
}

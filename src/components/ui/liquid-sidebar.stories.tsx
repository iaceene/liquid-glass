import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SidebarProvider,
  LiquidSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  type LiquidSidebarItem,
} from './liquid-sidebar'

const Icons = {
  home: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
}

const sampleItems: LiquidSidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Icons.home },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: Icons.inbox,
    badge: (
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          padding: '2px 7px',
          borderRadius: 999,
          background: 'rgba(0,162,255,0.25)',
          color: '#00A2FF',
        }}
      >
        12
      </span>
    ),
  },
  { id: 'analytics', label: 'Analytics', icon: Icons.analytics },
  { id: 'database', label: 'Databases', icon: Icons.database },
  { id: 'settings', label: 'Settings', icon: Icons.settings },
]

const sampleGroups = [
  {
    title: 'Platform',
    items: [
      { id: 'overview', label: 'Overview', icon: Icons.home },
      { id: 'relays', label: 'Relay Nodes', icon: Icons.database },
      { id: 'metrics', label: 'Metrics', icon: Icons.analytics },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { id: 'security', label: 'Security & Auth', icon: Icons.user },
      { id: 'preferences', label: 'Preferences', icon: Icons.settings },
    ],
  },
]

const meta: Meta<typeof LiquidSidebar> = {
  title: 'Navigation/LiquidSidebar',
  component: LiquidSidebar,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Shading tone for light or dark surfaces',
    },
    collapsible: {
      control: 'boolean',
      description: 'Allows toggling collapsed state',
    },
    sound: {
      control: 'boolean',
      description: 'Synthesized navigation audio feedback',
    },
  },
}

export default meta
type Story = StoryObj<typeof LiquidSidebar>

/**
 * Full Realistic App Layout with SidebarProvider, Inset Content, Trigger and User profile
 */
export const FullAppSidebar: Story = {
  render: (args) => {
    return (
      <div style={{ width: '100%', maxWidth: 1080, minHeight: 640 }}>
        <SidebarProvider defaultOpen={true} tone={args.tone}>
          <LiquidSidebar
            {...args}
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px' }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #59DBFF 0%, #0085FA 100%)',
                    boxShadow: '0 0 12px rgba(0, 162, 255, 0.6)',
                  }}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>Acme Cloud</div>
                  <div style={{ fontSize: 11, opacity: 0.65 }}>Enterprise Cluster</div>
                </div>
              </div>
            }
            footer={
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px' }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  IA
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    iaceene
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.6 }}>dev@iaceene.com</div>
                </div>
              </div>
            }
            groups={sampleGroups}
          />

          <SidebarInset>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <SidebarTrigger />
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Cluster Dashboard</h1>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: 'rgba(24, 178, 107, 0.15)',
                  color: '#18B26B',
                  border: '1px solid rgba(24, 178, 107, 0.3)',
                }}
              >
                ● 14 Nodes Online
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                marginBottom: 24,
              }}
            >
              {[
                { title: 'Total Ingress', val: '42.8 TB' },
                { title: 'Avg Latency', val: '14.2 ms' },
                { title: 'Droplet Yield', val: '99.98%' },
              ].map((card, i) => (
                <div
                  key={i}
                  style={{
                    padding: 18,
                    borderRadius: 18,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.18)',
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 4 }}>{card.title}</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{card.val}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13.5, lineHeight: 1.6, opacity: 0.85, margin: 0 }}>
              The Liquid Sidebar uses harmonic Euler spring physics, WebGL water shaders, and tactile acoustic cues.
              Click items on the left to watch the fluid bead stretch and break into droplets on long transitions!
            </p>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  },
}

export const ComposableHierarchy: Story = {
  render: (args) => (
    <div style={{ height: 480 }}>
      <LiquidSidebar {...args}>
        <SidebarHeader>
          <div style={{ fontSize: 13, fontWeight: 700, padding: '4px 10px' }}>Custom Composable</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Actions</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton id="home">
                  {Icons.home} <span>Home Portal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton id="database">
                  {Icons.database} <span>Databases</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Preferences</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton id="settings">
                  {Icons.settings} <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton id="profile">
            {Icons.user} <span>Operator Profile</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </LiquidSidebar>
    </div>
  ),
}

export const CollapsedIconOnly: Story = {
  render: (args) => (
    <div style={{ height: 420 }}>
      <LiquidSidebar {...args} items={sampleItems} collapsed={true} />
    </div>
  ),
}

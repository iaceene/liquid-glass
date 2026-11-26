import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  LiquidTabs,
  LiquidTabsList,
  LiquidTabsTrigger,
  LiquidTabsContent,
  NimbusTabIcons,
} from "./liquid-tabs"

const meta: Meta<typeof LiquidTabs> = {
  title: "Components/LiquidTabs",
  component: LiquidTabs,
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof LiquidTabs>

export const InteractiveArt: Story = {
  render: () => (
    <div style={{ width: 560, padding: 32 }}>
      <LiquidTabs
        defaultValue="overview"
        items={[
          {
            value: "overview",
            label: "Overview",
            icon: NimbusTabIcons.overview,
            fx: "glow",
            badge: "Live",
            content: (
              <div style={{ padding: 20, background: "rgba(255,255,255,0.4)", borderRadius: 16, backdropFilter: "blur(10px)" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 650 }}>Surface Metrics</h4>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.8, lineHeight: 1.5 }}>
                  Water purity index at 99.8%. Meniscus tension holds optimal curvature. Hover over the tabs or tap to see the icon play its custom scene!
                </p>
              </div>
            ),
          },
          {
            value: "activity",
            label: "Activity",
            icon: NimbusTabIcons.activity,
            fx: "wave",
            badge: "12",
            content: (
              <div style={{ padding: 20, background: "rgba(255,255,255,0.4)", borderRadius: 16, backdropFilter: "blur(10px)" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 650 }}>Liquid Activity Stream</h4>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.8, lineHeight: 1.5 }}>
                  3 satellite droplets spawned during the previous transition and reabsorbed into the leader pool with a soft landing ripple.
                </p>
              </div>
            ),
          },
          {
            value: "code",
            label: "Code",
            icon: NimbusTabIcons.code,
            fx: "spin",
            content: (
              <div style={{ padding: 20, background: "rgba(255,255,255,0.4)", borderRadius: 16, backdropFilter: "blur(10px)" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 650 }}>Shader Pipeline</h4>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.8, lineHeight: 1.5 }}>
                  GLSL fragment shader evaluating finite difference normal vectors with double specular reflection and iridescent fresnel.
                </p>
              </div>
            ),
          },
          {
            value: "settings",
            label: "Settings",
            icon: NimbusTabIcons.settings,
            fx: "pop",
            content: (
              <div style={{ padding: 20, background: "rgba(255,255,255,0.4)", borderRadius: 16, backdropFilter: "blur(10px)" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 650 }}>Tension Configuration</h4>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.8, lineHeight: 1.5 }}>
                  Configure spring constants (k=220, c=25), satellite threshold, and synthesized audio frequencies.
                </p>
              </div>
            ),
          },
        ]}
      />
    </div>
  ),
}

export const DarkToneArt: Story = {
  render: () => (
    <div style={{ width: 560, padding: 32, background: "#0B132B", borderRadius: 28 }}>
      <LiquidTabs
        tone="dark"
        defaultValue="overview"
        items={[
          {
            value: "overview",
            label: "Overview",
            icon: NimbusTabIcons.overview,
            fx: "glow",
            content: (
              <div style={{ padding: 20, background: "rgba(10,18,40,0.4)", borderRadius: 16, color: "#F1F7FF" }}>
                Deep oceanic dark mode with bioluminescent azure caustics and night rim reflections.
              </div>
            ),
          },
          {
            value: "sparkles",
            label: "Magic",
            icon: NimbusTabIcons.sparkles,
            fx: "drop",
            badge: "Pro",
            content: (
              <div style={{ padding: 20, background: "rgba(10,18,40,0.4)", borderRadius: 16, color: "#F1F7FF" }}>
                Icon leaps and squashes, splashing water droplets on both sides when activated!
              </div>
            ),
          },
          {
            value: "layers",
            label: "Layers",
            icon: NimbusTabIcons.layers,
            fx: "plane",
            content: (
              <div style={{ padding: 20, background: "rgba(10,18,40,0.4)", borderRadius: 16, color: "#F1F7FF" }}>
                3D looping flight path with vapor condensation trail across the glass surface.
              </div>
            ),
          },
        ]}
      />
    </div>
  ),
}

export const CompoundAPI: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <LiquidTabs defaultValue="design">
        <LiquidTabsList>
          <LiquidTabsTrigger value="design" icon={NimbusTabIcons.sparkles} fx="drop">
            Design
          </LiquidTabsTrigger>
          <LiquidTabsTrigger value="code" icon={NimbusTabIcons.code} fx="spin" badge="TS">
            Code
          </LiquidTabsTrigger>
          <LiquidTabsTrigger value="deploy" icon={NimbusTabIcons.bell} fx="wave">
            Alerts
          </LiquidTabsTrigger>
        </LiquidTabsList>
        <LiquidTabsContent value="design">Figma canvas vector liquid tokens</LiquidTabsContent>
        <LiquidTabsContent value="code">Self-contained React TypeScript components</LiquidTabsContent>
        <LiquidTabsContent value="deploy">Zero external runtime animation dependencies</LiquidTabsContent>
      </LiquidTabs>
    </div>
  ),
}

import type { Meta, StoryObj } from "@storybook/react-vite"
import { LiquidToast, LiquidToaster, toast, type ToastTone } from "./liquid-toast"
import { LiquidButton } from "./liquid-button"

const meta: Meta<typeof LiquidToast> = {
  title: 'Feedback/LiquidToast',
  component: LiquidToast,
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof LiquidToast>

export const InteractiveTriggersAndThemes: Story = {
  render: () => {
    return (
      <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 650 }}>Liquid Toast Trigger & Theme Console</h3>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.75, textAlign: "center", maxWidth: 500 }}>
          Click any button to trigger live liquid notifications in different dark/colored theme tones with smooth entry/exit animations:
        </p>

        {/* Theme Triggers */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {(["midnight", "aurora", "sunset", "rose", "emerald", "dark", "light"] as ToastTone[]).map((theme) => (
            <LiquidButton
              key={theme}
              variant={theme === "light" ? "glass" : "secondary"}
              onClick={() =>
                toast({
                  title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
                  description: `Rendered in the ${theme} glass tone without progress bar clutter.`,
                  tone: theme,
                  duration: 4000,
                })
              }
            >
              Trigger {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </LiquidButton>
          ))}
        </div>

        {/* Status Triggers */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          <LiquidButton
            variant="primary"
            onClick={() =>
              toast.success("Payment Received", {
                description: "1.25 ETH transferred into pool vault.",
                tone: "midnight",
                duration: 4000,
              })
            }
          >
            Success (Midnight)
          </LiquidButton>

          <LiquidButton
            variant="secondary"
            onClick={() =>
              toast.warning("High Temperature Warning", {
                description: "Ambient chamber thermal limits near dissipation threshold.",
                tone: "sunset",
                duration: 4500,
              })
            }
          >
            Warning (Sunset)
          </LiquidButton>

          <LiquidButton
            variant="destructive"
            onClick={() =>
              toast.error("Surface Breach", {
                description: "Chamber pressure exceeded safety threshold.",
                tone: "rose",
                duration: 4500,
              })
            }
          >
            Error (Rose)
          </LiquidButton>

          <LiquidButton
            variant="ghost"
            onClick={() => toast.clear()}
          >
            Clear All
          </LiquidButton>
        </div>

        {/* Floating Toaster Viewport */}
        <LiquidToaster position="bottom-right" />
      </div>
    )
  },
}

export const AllThemesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 380 }}>
      <LiquidToast
        tone="midnight"
        variant="info"
        title="Midnight Onyx"
        description="Deep abyss glass with electric cyan rim sheen."
        duration={0}
      />
      <LiquidToast
        tone="aurora"
        variant="success"
        title="Aurora Borealis"
        description="Northern lights emerald-violet bioluminescence."
        duration={0}
      />
      <LiquidToast
        tone="sunset"
        variant="warning"
        title="Amber Sunset"
        description="Warm golden honey glass with sunburst highlights."
        duration={0}
      />
      <LiquidToast
        tone="rose"
        variant="error"
        title="Quartz Rose"
        description="Translucent quartz blush glass with rose gold rim."
        duration={0}
      />
      <LiquidToast
        tone="emerald"
        variant="success"
        title="Aquatic Emerald"
        description="Deep lagoon seafoam glass with mint glow."
        duration={0}
      />
      <LiquidToast
        tone="dark"
        variant="info"
        title="Classic Dark"
        description="Navy obsidian glass with frosty white typography."
        duration={0}
      />
      <LiquidToast
        tone="light"
        variant="default"
        title="Daylight Crystal"
        description="Clear daylight glass with sunlit highlights."
        duration={0}
      />
    </div>
  ),
}

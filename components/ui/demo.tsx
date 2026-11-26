"use client"

import * as React from "react"
import {
  LiquidProvider,
  GlassPanel,
  WaterObject3D,
  LiquidBarChart,
  LiquidGauge,
  LiquidProgress,
  LiquidValueCounter,
  // Buttons
  LiquidButton,
  LiquidCheckoutButton,
  // Forms & Inputs
  LiquidInput,
  LiquidTextarea,
  LiquidCheckbox,
  LiquidSwitch,
  NimbusInputIcons,
  // Navigation
  LiquidNavbar,
  NimbusIcons,
  LiquidTabs,
  // Overlays
  LiquidDialog,
  LiquidDialogTrigger,
  LiquidDialogContent,
  LiquidDialogHeader,
  LiquidDialogTitle,
  LiquidDialogDescription,
  LiquidDialogFooter,
  LiquidDialogClose,
  LiquidDropdownMenu,
  LiquidDropdownMenuTrigger,
  LiquidDropdownMenuContent,
  LiquidDropdownMenuItem,
  LiquidDropdownMenuSeparator,
  LiquidDropdownMenuLabel,
  LiquidPopover,
  LiquidPopoverTrigger,
  LiquidPopoverContent,
  LiquidTooltip,
  // Data Display
  LiquidCard,
  LiquidCardHeader,
  LiquidCardTitle,
  LiquidCardDescription,
  LiquidCardContent,
  LiquidAccordion,
  LiquidBadge,
  LiquidAvatar,
  LiquidSeparator,
  // Feedback
  LiquidAlert,
  LiquidAlertTitle,
  LiquidAlertDescription,
  LiquidToaster,
  toast,
  type LiquidTone,
} from "./index"

/* =========================================================================
 * Master Showcase Sub-components
 * ========================================================================= */

function ControlsToolbar({
  tone,
  setTone,
  sound,
  setSound,
  reducedMotion,
  setReducedMotion,
  intensity,
  setIntensity,
}: {
  tone: LiquidTone
  setTone: (t: LiquidTone) => void
  sound: boolean
  setSound: (s: boolean) => void
  reducedMotion: boolean
  setReducedMotion: (r: boolean) => void
  intensity: number
  setIntensity: (i: number) => void
}) {
  return (
    <header
      style={{
        position: "sticky",
        top: 16,
        zIndex: 50,
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto 32px auto",
      }}
    >
      <GlassPanel
        tone={tone}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "14px 24px",
          borderRadius: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#00A2FF",
              boxShadow: "0 0 12px #00A2FF",
            }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>
              Nimbus UI · Liquid Showcase
            </div>
            <div style={{ fontSize: 11, opacity: 0.65, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Unified Water Shader & Tactile Physics
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
          {/* Tone Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ opacity: 0.7 }}>Tone:</span>
            {(["light", "dark", "midnight"] as LiquidTone[]).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: tone === t ? "1px solid rgba(0,162,255,0.8)" : "1px solid rgba(255,255,255,0.15)",
                  background: tone === t ? "rgba(0,162,255,0.2)" : "transparent",
                  color: "inherit",
                  transition: "all 0.15s ease",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <LiquidSeparator orientation="vertical" style={{ height: 20 }} />

          {/* Sound Toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
            <LiquidCheckbox checked={sound} onCheckedChange={(c) => setSound(Boolean(c))} size="sm" />
            <span>Sound</span>
          </label>

          {/* Reduced Motion Toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
            <LiquidCheckbox checked={reducedMotion} onCheckedChange={(c) => setReducedMotion(Boolean(c))} size="sm" />
            <span>Reduced Motion</span>
          </label>

          <LiquidSeparator orientation="vertical" style={{ height: 20 }} />

          {/* Intensity Slider */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <span style={{ opacity: 0.7 }}>Wave:</span>
            <input
              type="range"
              min={0.2}
              max={2.0}
              step={0.1}
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              style={{ width: 70, accentColor: "#00A2FF", cursor: "pointer" }}
            />
            <span style={{ fontSize: 11, fontVariantNumeric: "tabular-nums" }}>{intensity.toFixed(1)}x</span>
          </div>
        </div>
      </GlassPanel>
    </header>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ margin: "40px 0 18px 0" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 4px 0" }}>{title}</h2>
      <p style={{ fontSize: 13, opacity: 0.65, margin: 0 }}>{subtitle}</p>
    </div>
  )
}

export function Demo() {
  const [tone, setTone] = React.useState<LiquidTone>("light")
  const [sound, setSound] = React.useState(true)
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [intensity, setIntensity] = React.useState(1.0)

  // Interactive component states
  const [btnLoading, setBtnLoading] = React.useState(false)
  const [btnSuccess, setBtnSuccess] = React.useState(false)
  const [checkoutPaying, setCheckoutPaying] = React.useState(false)
  const [checkoutPaid, setCheckoutPaid] = React.useState(false)
  const [switchVal, setSwitchVal] = React.useState(true)
  const [checkboxVal, setCheckboxVal] = React.useState(true)
  const [gaugeVal, setGaugeVal] = React.useState(74)
  const [inputVal, setInputVal] = React.useState("nimbus@example.com")
  const [navIdx, setNavIdx] = React.useState(0)

  const bgGradient =
    tone === "light"
      ? "linear-gradient(135deg, #d8e8f5 0%, #c4ddf2 50%, #b2d2ed 100%)"
      : tone === "midnight"
      ? "linear-gradient(135deg, #020612 0%, #061126 50%, #020817 100%)"
      : "linear-gradient(135deg, #091326 0%, #0e1e38 50%, #081021 100%)"

  const textColor = tone === "light" ? "#0B132B" : "#F1F7FF"
  const cardTone = tone === "light" ? "light" : "dark"

  const handleSimulatePayment = () => {
    setCheckoutPaying(true)
    setTimeout(() => {
      setCheckoutPaying(false)
      setCheckoutPaid(true)
      toast({
        title: "Payment Approved",
        description: "Your liquid transaction completed with zero slippage.",
        variant: "success",
      })
      setTimeout(() => setCheckoutPaid(false), 3000)
    }, 2200)
  }

  const handleSimulateBtn = () => {
    setBtnLoading(true)
    setTimeout(() => {
      setBtnLoading(false)
      setBtnSuccess(true)
      setTimeout(() => setBtnSuccess(false), 2000)
    }, 1800)
  }

  return (
    <LiquidProvider tone={tone} sound={sound} reducedMotion={reducedMotion} intensity={intensity}>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: bgGradient,
          color: textColor,
          fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          padding: "32px 20px 80px 20px",
          boxSizing: "border-box",
          transition: "background 0.3s ease, color 0.3s ease",
        }}
      >
        <ControlsToolbar
          tone={tone}
          setTone={setTone}
          sound={sound}
          setSound={setSound}
          reducedMotion={reducedMotion}
          setReducedMotion={setReducedMotion}
          intensity={intensity}
          setIntensity={setIntensity}
        />

        <main style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
          {/* =========================================================================
           * 1. Action Buttons
           * ========================================================================= */}
          <section>
            <SectionHeading
              title="1. Tactile Action Buttons"
              subtitle="Pill glass aesthetics, spring squish (0.98), pointer ripples, and dynamic liquid states."
            />
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
              <LiquidButton variant="primary" onClick={() => toast({ title: "Primary Clicked" })}>
                Primary Water
              </LiquidButton>
              <LiquidButton variant="secondary">Secondary Frosted</LiquidButton>
              <LiquidButton variant="ghost">Ghost Water</LiquidButton>
              <LiquidButton variant="destructive">Destructive Rim</LiquidButton>
              <LiquidButton variant="glass" size="sm">
                Small Glass
              </LiquidButton>
              <LiquidButton
                variant="primary"
                loading={btnLoading}
                success={btnSuccess}
                onClick={handleSimulateBtn}
              >
                {btnLoading ? "Processing Drop..." : btnSuccess ? "Confirmed!" : "Click to Pour"}
              </LiquidButton>
              <LiquidCheckoutButton
                loading={checkoutPaying}
                success={checkoutPaid}
                onClick={handleSimulatePayment}
              >
                Complete Order ($48.00)
              </LiquidCheckoutButton>
            </div>
          </section>

          {/* =========================================================================
           * 2. Forms & Inputs
           * ========================================================================= */}
          <section>
            <SectionHeading
              title="2. Responsive Form Controls"
              subtitle="14px radius inputs with specular caustics, following focus drop, and spring switches."
            />
            <GlassPanel tone={tone} style={{ padding: 24, borderRadius: 24 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 24,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>
                    Email Address
                  </label>
                  <LiquidInput
                    type="email"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    icon={NimbusInputIcons.mail}
                    placeholder="Enter email..."
                    tone={cardTone}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                      <LiquidCheckbox
                        checked={checkboxVal}
                        onCheckedChange={(c) => setCheckboxVal(Boolean(c))}
                        tone={cardTone}
                      />
                      <span>Water Checkbox</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                      <LiquidSwitch
                        checked={switchVal}
                        onCheckedChange={setSwitchVal}
                        tone={cardTone}
                      />
                      <span>Sloshing Switch</span>
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>
                    Message Note
                  </label>
                  <LiquidTextarea
                    placeholder="Type feedback here..."
                    tone={cardTone}
                    rows={3}
                  />
                </div>
              </div>
            </GlassPanel>
          </section>

          {/* =========================================================================
           * 3. Navigation
           * ========================================================================= */}
          <section>
            <SectionHeading
              title="3. Organic Navigation"
              subtitle="Fluid indicator pills with trailing droplet physics and harmonic spring momentum."
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
              <LiquidNavbar
                tone={cardTone}
                defaultActive={navIdx}
                onChange={(idx) => setNavIdx(idx)}
                items={[
                  { label: "Dashboard", icon: NimbusIcons.home, fx: "glow" },
                  { label: "Network", icon: NimbusIcons.globe, fx: "spin" },
                  { label: "Deployments", icon: NimbusIcons.plane, fx: "plane" },
                  { label: "Metrics", icon: NimbusIcons.drop, fx: "drop" },
                  { label: "Account", icon: NimbusIcons.user, fx: "wave" },
                ]}
              />

              <div style={{ width: "100%", maxWidth: 640 }}>
                <LiquidTabs
                  defaultValue="overview"
                  tone={cardTone}
                  items={[
                    {
                      value: "overview",
                      label: "Overview",
                      content: (
                        <div style={{ padding: "16px 0", fontSize: 13, opacity: 0.8 }}>
                          System status is optimal. All 8 WebGL context slots in pool are stabilized.
                        </div>
                      ),
                    },
                    {
                      value: "analytics",
                      label: "Analytics",
                      content: (
                        <div style={{ padding: "16px 0", fontSize: 13, opacity: 0.8 }}>
                          Real-time droplet throughput is up 42% with semi-implicit Euler integration.
                        </div>
                      ),
                    },
                    {
                      value: "settings",
                      label: "Settings",
                      content: (
                        <div style={{ padding: "16px 0", fontSize: 13, opacity: 0.8 }}>
                          Adjust caustics dispersion, wave dampening, and acoustic plip frequencies.
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </section>

          {/* =========================================================================
           * 4. Overlays & Dialogs
           * ========================================================================= */}
          <section>
            <SectionHeading
              title="4. Glass Overlays & Modals"
              subtitle="Frost backdrops (blur 14px saturate 1.2), soft water shadows, and spring entrances."
            />
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
              {/* Dialog */}
              <LiquidDialog tone={cardTone}>
                <LiquidDialogTrigger asChild>
                  <LiquidButton variant="secondary">Open Liquid Dialog</LiquidButton>
                </LiquidDialogTrigger>
                <LiquidDialogContent>
                  <LiquidDialogHeader>
                    <LiquidDialogTitle>Nimbus Liquid Dialog</LiquidDialogTitle>
                    <LiquidDialogDescription>
                      This dialog is rendered within a high-index frost slab with specular highlights and an acoustic entry sound.
                    </LiquidDialogDescription>
                  </LiquidDialogHeader>
                  <div style={{ margin: "16px 0", fontSize: 13, opacity: 0.85 }}>
                    Feel free to interact with any nested elements. Everything is enclosed in glassmorphic tokens.
                  </div>
                  <LiquidDialogFooter>
                    <LiquidDialogClose asChild>
                      <LiquidButton variant="ghost">Dismiss</LiquidButton>
                    </LiquidDialogClose>
                    <LiquidDialogClose asChild>
                      <LiquidButton variant="primary">Confirm Action</LiquidButton>
                    </LiquidDialogClose>
                  </LiquidDialogFooter>
                </LiquidDialogContent>
              </LiquidDialog>

              {/* Dropdown Menu */}
              <LiquidDropdownMenu tone={cardTone}>
                <LiquidDropdownMenuTrigger asChild>
                  <LiquidButton variant="secondary">Actions Menu ▾</LiquidButton>
                </LiquidDropdownMenuTrigger>
                <LiquidDropdownMenuContent>
                  <LiquidDropdownMenuLabel>Quick Shortcuts</LiquidDropdownMenuLabel>
                  <LiquidDropdownMenuItem onSelect={() => toast({ title: "Export Started" })}>
                    Export Telemetry
                  </LiquidDropdownMenuItem>
                  <LiquidDropdownMenuItem onSelect={() => toast({ title: "Synced to Cloud" })}>
                    Sync Water State
                  </LiquidDropdownMenuItem>
                  <LiquidDropdownMenuSeparator />
                  <LiquidDropdownMenuItem onSelect={() => toast({ title: "Settings Opened" })}>
                    Preferences
                  </LiquidDropdownMenuItem>
                </LiquidDropdownMenuContent>
              </LiquidDropdownMenu>

              {/* Popover */}
              <LiquidPopover tone={cardTone}>
                <LiquidPopoverTrigger asChild>
                  <LiquidButton variant="ghost">Info Popover</LiquidButton>
                </LiquidPopoverTrigger>
                <LiquidPopoverContent style={{ width: 260 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Dynamic Water Drop</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>
                    Popovers inherit global tone parameters automatically from LiquidProvider.
                  </div>
                </LiquidPopoverContent>
              </LiquidPopover>

              {/* Tooltip */}
              <LiquidTooltip content="Tactile Frutiger Aero water hover" tone={cardTone}>
                <LiquidButton variant="ghost" size="sm">Hover For Tooltip</LiquidButton>
              </LiquidTooltip>
            </div>
          </section>

          {/* =========================================================================
           * 5. Visualization Primitives
           * ========================================================================= */}
          <section>
            <SectionHeading
              title="5. Liquid Visualization Primitives"
              subtitle="Live wave progress, radial water gauges, interactive bars, and tabular numeral counters."
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 20,
              }}
            >
              <GlassPanel tone={tone} style={{ padding: 20, borderRadius: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.7 }}>
                  Radial Sloshing Gauge
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <LiquidGauge value={gaugeVal} size={110} tone={tone} />
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                  <LiquidButton size="sm" variant="ghost" onClick={() => setGaugeVal((v) => Math.max(0, v - 10))}>-10</LiquidButton>
                  <LiquidButton size="sm" variant="ghost" onClick={() => setGaugeVal((v) => Math.min(100, v + 10))}>+10</LiquidButton>
                </div>
              </GlassPanel>

              <GlassPanel tone={tone} style={{ padding: 20, borderRadius: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.7 }}>
                  Wave Sloshing Progress
                </div>
                <div style={{ marginTop: 12 }}>
                  <LiquidProgress value={gaugeVal} tone={tone} />
                </div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                  Fill volume: <LiquidValueCounter value={gaugeVal} decimals={0} suffix="%" />
                </div>
              </GlassPanel>

              <GlassPanel tone={tone} style={{ padding: 20, borderRadius: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.7 }}>
                  Liquid Bar Metric
                </div>
                <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LiquidBarChart
                    data={[
                      { label: "Mon", value: 35 },
                      { label: "Tue", value: 65 },
                      { label: "Wed", value: 88 },
                      { label: "Thu", value: 48 },
                      { label: "Fri", value: 92 },
                    ]}
                    height={100}
                    tone={tone}
                  />
                </div>
              </GlassPanel>
            </div>
          </section>

          {/* =========================================================================
           * 6. 3D Water Object
           * ========================================================================= */}
          <section>
            <SectionHeading
              title="6. 3D Sloshing Water Slab"
              subtitle="CSS 3D perspective with cursor tilt, idle floating hover, and internal water level."
            />
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <WaterObject3D
                tone={tone}
                level={0.55}
                style={{
                  width: 320,
                  height: 190,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>Tidepool Node</span>
                  <LiquidBadge variant="primary">3D Water</LiquidBadge>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", opacity: 0.65, letterSpacing: "0.05em" }}>Balance</div>
                  <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>
                    <LiquidValueCounter value={12480.5} prefix="$" decimals={2} />
                  </div>
                </div>
              </WaterObject3D>
            </div>
          </section>

          {/* =========================================================================
           * 7. Data Display & Status
           * ========================================================================= */}
          <section>
            <SectionHeading
              title="7. Data Display & Badges"
              subtitle="Frosted cards, fluid accordions, soft pill badges, and water pulse skeletons."
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              <LiquidCard tone={cardTone}>
                <LiquidCardHeader>
                  <LiquidCardTitle>Glassmorphic Card</LiquidCardTitle>
                  <LiquidCardDescription>Specular rim highlight with 20% alpha border</LiquidCardDescription>
                </LiquidCardHeader>
                <LiquidCardContent>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <LiquidAvatar fallback="NB" size="default" status="online" tone={cardTone} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Nimbus Operator</div>
                      <div style={{ fontSize: 12, opacity: 0.65 }}>Connected to Pool</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <LiquidBadge variant="default">Liquid</LiquidBadge>
                    <LiquidBadge variant="primary">Shader v2</LiquidBadge>
                    <LiquidBadge variant="secondary">Stabilized</LiquidBadge>
                    <LiquidBadge variant="glass">Dynamic</LiquidBadge>
                  </div>
                </LiquidCardContent>
              </LiquidCard>

              <GlassPanel tone={tone} style={{ padding: 20, borderRadius: 24 }}>
                <LiquidAccordion
                  tone={cardTone}
                  items={[
                    {
                      id: "acc-1",
                      question: "How does the shared WebGL pool work?",
                      answer:
                        "Instead of 30 isolated WebGL canvases crashing the browser with context loss, the central contextPool caps active contexts to 8 and recycles canvas instances smoothly.",
                    },
                    {
                      id: "acc-2",
                      question: "Can I use it with Tailwind CSS?",
                      answer:
                        "Yes! All components support standard className props, alongside standard CSS properties and automatic dark/light tone styling.",
                    },
                  ]}
                />
              </GlassPanel>
            </div>
          </section>

          {/* =========================================================================
           * 8. Feedback & Alerts
           * ========================================================================= */}
          <section>
            <SectionHeading
              title="8. Tactile Feedback & Toasts"
              subtitle="Iridescent alerts, acoustic triggers, and floating notifications."
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <LiquidAlert variant="default" tone={cardTone}>
                <LiquidAlertTitle>Liquid Glass Active</LiquidAlertTitle>
                <LiquidAlertDescription>
                  WebGL shaders, tactile spring Euler integrations, and acoustic feedback are running harmoniously.
                </LiquidAlertDescription>
              </LiquidAlert>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <LiquidButton
                  size="sm"
                  variant="secondary"
                  onClick={() => toast({ title: "Info", description: "Telemetry batch sent.", variant: "default" })}
                >
                  Trigger Info Toast
                </LiquidButton>
                <LiquidButton
                  size="sm"
                  variant="primary"
                  onClick={() => toast({ title: "Success", description: "Water state settled.", variant: "success" })}
                >
                  Trigger Success Toast
                </LiquidButton>
                <LiquidButton
                  size="sm"
                  variant="destructive"
                  onClick={() => toast({ title: "Warning", description: "Surface turbulence high.", variant: "warning" })}
                >
                  Trigger Warning Toast
                </LiquidButton>
              </div>
            </div>
          </section>
        </main>

        <footer style={{ maxWidth: 1100, margin: "60px auto 0 auto", textAlign: "center", opacity: 0.65, fontSize: 12 }}>
          Nimbus UI · Liquid Glass Design System · Crafted with React, WebGL & Spring Physics
        </footer>

        {/* Global Toast Container */}
        <LiquidToaster tone={cardTone} />
      </div>
    </LiquidProvider>
  )
}

export { Demo as Component }
export default Demo

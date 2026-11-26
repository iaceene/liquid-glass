import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  GlassPanel,
  WaterObject3D,
  LiquidProvider,
  useLiquidContext,
  LiquidProgress,
  LiquidValueCounter,
  LiquidBarChart,
  LiquidGauge,
  LiquidChart,
  LIQUID_COLORS,
  SPRING_PRESETS,
} from "./index"

describe("Liquid Core Primitives (Pass 2)", () => {
  it("exports valid tokens and spring presets", () => {
    expect(LIQUID_COLORS.accent).toBe("#00A2FF")
    expect(LIQUID_COLORS.ink).toBe("#0B132B")
    expect(SPRING_PRESETS.leader.k).toBe(210)
    expect(SPRING_PRESETS.tail.k).toBe(60)
  })

  it("renders GlassPanel with correct tone and recessed states", () => {
    const { container, rerender } = render(
      <GlassPanel tone="light" radius={28}>
        <span>Inside Glass</span>
      </GlassPanel>
    )

    const panel = container.querySelector(".liquid-glass-panel")
    expect(panel).toBeInTheDocument()
    expect(panel).toHaveAttribute("data-tone", "light")
    expect(panel).toHaveAttribute("data-recessed", "false")
    expect(screen.getByText("Inside Glass")).toBeInTheDocument()

    rerender(
      <GlassPanel tone="dark" recessed={true}>
        <span>Inside Dark Glass</span>
      </GlassPanel>
    )
    expect(panel).toHaveAttribute("data-tone", "dark")
    expect(panel).toHaveAttribute("data-recessed", "true")
  })

  it("renders WaterObject3D with front and back contents", () => {
    const { container } = render(
      <WaterObject3D
        width={300}
        frontContent={<div>Card Front</div>}
        backContent={<div>Card Back</div>}
      />
    )

    expect(screen.getByText("Card Front")).toBeInTheDocument()
    expect(screen.getByText("Card Back")).toBeInTheDocument()
    expect(container.querySelector(".w3d-scene")).toBeInTheDocument()
    expect(container.querySelector(".w3d-water")).toBeInTheDocument()
  })

  it("provides global configuration via LiquidProvider and useLiquidContext", () => {
    function ConsumerComponent() {
      const { tone, sound, setTone, setSound } = useLiquidContext()
      return (
        <div>
          <span data-testid="tone-val">{tone}</span>
          <span data-testid="sound-val">{sound ? "on" : "off"}</span>
          <button onClick={() => setTone("dark")}>Set Dark</button>
          <button onClick={() => setSound(true)}>Enable Sound</button>
        </div>
      )
    }

    render(
      <LiquidProvider tone="light" sound={false}>
        <ConsumerComponent />
      </LiquidProvider>
    )

    expect(screen.getByTestId("tone-val")).toHaveTextContent("light")
    expect(screen.getByTestId("sound-val")).toHaveTextContent("off")

    fireEvent.click(screen.getByRole("button", { name: /set dark/i }))
    expect(screen.getByTestId("tone-val")).toHaveTextContent("dark")

    fireEvent.click(screen.getByRole("button", { name: /enable sound/i }))
    expect(screen.getByTestId("sound-val")).toHaveTextContent("on")
  })

  it("renders visualization primitives accurately", () => {
    render(
      <div>
        <LiquidValueCounter value={100} prefix="$" suffix=" USD" />
        <LiquidProgress value={75} label="Buffer Capacity" />
        <LiquidBarChart
          data={[
            { label: "Mon", value: 40 },
            { label: "Tue", value: 80 },
          ]}
        />
        <LiquidGauge value={68} title="Water Level" />
        <LiquidChart title="System Telemetry" description="Core reservoir stats">
          <div>Telemetry Content</div>
        </LiquidChart>
      </div>
    )

    expect(screen.getByText(/buffer capacity/i)).toBeInTheDocument()
    expect(screen.getByText("Mon")).toBeInTheDocument()
    expect(screen.getByText("Tue")).toBeInTheDocument()
    expect(screen.getByText("Water Level")).toBeInTheDocument()
    expect(screen.getByText("System Telemetry")).toBeInTheDocument()
    expect(screen.getByText("Telemetry Content")).toBeInTheDocument()
  })
})

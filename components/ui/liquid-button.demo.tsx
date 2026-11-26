"use client"

import * as React from "react"
import { LiquidButton, NimbusButtonIcons } from "@/components/ui/liquid-button"

export default function ButtonDemo() {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [tone, setTone] = React.useState<"light" | "dark">("light")

  const handlePay = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2400)
    }, 1200)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: "32px 16px",
        background: tone === "light" ? "#DCEBF5" : "#0B132B",
        transition: "background 0.3s ease",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          type="button"
          onClick={() => setTone((t) => (t === "light" ? "dark" : "light"))}
          style={{
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid rgba(11,19,43,.15)",
            background: "rgba(255,255,255,.2)",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
            color: tone === "light" ? "#0B132B" : "#F1F7FF",
          }}
        >
          Toggle Tone: {tone}
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", alignItems: "center", maxWidth: 640 }}>
        <LiquidButton tone={tone} variant="default" icon={NimbusButtonIcons.drop}>
          Default Water
        </LiquidButton>

        <LiquidButton tone={tone} variant="glass" icon={NimbusButtonIcons.sparkle}>
          Glass Pill
        </LiquidButton>

        <LiquidButton tone={tone} variant="secondary">
          Secondary
        </LiquidButton>

        <LiquidButton tone={tone} variant="destructive">
          Destructive
        </LiquidButton>

        <LiquidButton tone={tone} variant="outline" rightIcon={NimbusButtonIcons.arrowRight}>
          Outline
        </LiquidButton>

        <LiquidButton tone={tone} variant="ghost">
          Ghost Drop
        </LiquidButton>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <LiquidButton
          tone={tone}
          variant="primary"
          loading={loading}
          loadingText="Pumping Water..."
          success={success}
          onClick={handlePay}
          rightIcon={NimbusButtonIcons.arrowRight}
        >
          Pay & Plip
        </LiquidButton>

        <LiquidButton tone={tone} size="sm" variant="glass">
          Small
        </LiquidButton>

        <LiquidButton tone={tone} size="lg" variant="default">
          Large Drop
        </LiquidButton>

        <LiquidButton tone={tone} size="icon" variant="glass" aria-label="Water droplet">
          {NimbusButtonIcons.drop}
        </LiquidButton>
      </div>

      <span
        style={{
          font: "500 12px/1 ui-sans-serif, -apple-system, 'Segoe UI', system-ui, sans-serif",
          color: tone === "light" ? "rgba(11,19,43,.5)" : "rgba(241,247,255,.5)",
        }}
      >
        by{" "}
        <a
          href="https://guglielmogiannattasio.it"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: tone === "light" ? "rgba(11,19,43,.7)" : "rgba(241,247,255,.7)" }}
        >
          guglielmogiannattasio.it
        </a>
      </span>
    </div>
  )
}

"use client"

import * as React from "react"
import { LiquidInput, NimbusInputIcons, type LiquidInputHandle } from "@/components/ui/liquid-input"
import { LiquidButton } from "@/components/ui/liquid-button"

export default function InputDemo() {
  const [tone, setTone] = React.useState<"light" | "dark">("light")
  const [email, setEmail] = React.useState("")
  const [emailErr, setEmailErr] = React.useState("")
  const emailRef = React.useRef<LiquidInputHandle | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes("@")) {
      setEmailErr("Please enter a valid email address with @")
      emailRef.current?.shake()
    } else {
      setEmailErr("")
      alert(`Submitted email: ${email}`)
    }
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

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <LiquidInput
          ref={emailRef}
          tone={tone}
          label="Email Address"
          placeholder="alex@nimbus.design"
          icon={NimbusInputIcons.mail}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailErr) setEmailErr("")
          }}
          error={emailErr}
          clearable
          sound
        />

        <LiquidInput
          tone={tone}
          label="Password"
          type="password"
          placeholder="Enter secret key..."
          icon={NimbusInputIcons.lock}
          helperText="Water will shield your password characters"
          sound
        />

        <LiquidInput
          tone={tone}
          size="sm"
          placeholder="Search components..."
          icon={NimbusInputIcons.search}
          clearable
        />

        <LiquidButton tone={tone} variant="primary" type="submit">
          Submit Form
        </LiquidButton>
      </form>

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

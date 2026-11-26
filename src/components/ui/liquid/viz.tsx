"use client"

/**
 * Nimbus UI · Liquid Visualization Primitives
 * Liquid-filled charts, sloshing gauges, fluid conduits, and animated value counters.
 */

import * as React from "react"
import { GlassPanel } from "./glass"
import { type LiquidTone } from "./tokens"
import { playPlip } from "./engine"

/* ===================== LiquidValueCounter ===================== */

export type LiquidValueCounterProps = {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export function LiquidValueCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1000,
  className,
  style,
}: LiquidValueCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    let startTimestamp: number | null = null
    const startVal = displayValue
    const endVal = value

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(startVal + (endVal - startVal) * eased)
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return (
    <span
      className={["liquid-counter", className].filter(Boolean).join(" ")}
      style={{ fontVariantNumeric: "tabular-nums", ...style }}
    >
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* ===================== LiquidProgress ===================== */

export type LiquidProgressProps = {
  value?: number // 0..100
  tone?: LiquidTone
  label?: string
  height?: number
  showValue?: boolean
  className?: string
  style?: React.CSSProperties
}

export function LiquidProgress({
  value = 50,
  tone = "light",
  label,
  height = 20,
  showValue = true,
  className,
  style,
}: LiquidProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div
      className={["liquid-progress-container", className].filter(Boolean).join(" ")}
      data-tone={tone}
      style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", ...style }}
    >
      {(label || showValue) && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "var(--p-soft)" }}>
          {label && <span>{label}</span>}
          {showValue && <LiquidValueCounter value={clamped} suffix="%" />}
        </div>
      )}
      <div
        className="liquid-progress-track"
        style={{
          position: "relative",
          width: "100%",
          height,
          borderRadius: 999,
          background: "rgba(255, 255, 255, 0.12)",
          boxShadow: "inset 0 1px 3px rgba(0, 40, 90, 0.18), inset 0 0 0 1px var(--p-line)",
          overflow: "hidden",
        }}
      >
        <div
          className="liquid-progress-fill"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${clamped}%`,
            borderRadius: 999,
            background: "linear-gradient(90deg, #59DBFF 0%, #0085FA 100%)",
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 0 12px rgba(0, 162, 255, 0.4)",
            transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
    </div>
  )
}

/* ===================== LiquidBarChart ===================== */

export type LiquidBarDataPoint = {
  label: string
  value: number
  color?: string
}

export type LiquidBarChartProps = {
  data: LiquidBarDataPoint[]
  maxValue?: number
  tone?: LiquidTone
  height?: number
  className?: string
  style?: React.CSSProperties
}

export function LiquidBarChart({
  data,
  maxValue,
  tone = "light",
  height = 180,
  className,
  style,
}: LiquidBarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1)
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null)

  return (
    <div
      className={["liquid-bar-chart", className].filter(Boolean).join(" ")}
      data-tone={tone}
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 12,
        height,
        padding: "16px 8px 8px",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {data.map((d, i) => {
        const pct = Math.min(100, Math.round((d.value / max) * 100))
        const isHovered = hoveredIdx === i

        return (
          <div
            key={d.label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              height: "100%",
              justifyContent: "flex-end",
              cursor: "pointer",
            }}
            onPointerEnter={() => {
              setHoveredIdx(i)
              playPlip(500, 750)
            }}
            onPointerLeave={() => setHoveredIdx(null)}
          >
            {isHovered && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 650,
                  color: "var(--p-fg)",
                  background: "var(--p-tint)",
                  padding: "2px 6px",
                  borderRadius: 6,
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 6px rgba(0, 40, 90, 0.14)",
                  animation: "lfDraw 0.2s ease forwards",
                }}
              >
                {d.value}
              </span>
            )}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 42,
                height: `${pct}%`,
                borderRadius: "10px 10px 4px 4px",
                background: d.color ?? "linear-gradient(180deg, #59DBFF 0%, #0085FA 100%)",
                boxShadow: isHovered
                  ? "inset 0 1px 1px rgba(255, 255, 255, 0.95), 0 0 16px rgba(0, 162, 255, 0.6)"
                  : "inset 0 1px 1px rgba(255, 255, 255, 0.7), 0 4px 12px rgba(0, 40, 90, 0.15)",
                transform: isHovered ? "scaleY(1.04)" : "scaleY(1)",
                transformOrigin: "bottom",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: isHovered ? "var(--p-fg)" : "var(--p-soft)",
                letterSpacing: "-0.01em",
              }}
            >
              {d.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ===================== LiquidGauge ===================== */

export type LiquidGaugeProps = {
  value: number // 0..100
  title?: string
  tone?: LiquidTone
  size?: number
  className?: string
  style?: React.CSSProperties
}

export function LiquidGauge({
  value,
  title = "Water Reserve",
  tone = "light",
  size = 180,
  className,
  style,
}: LiquidGaugeProps) {
  const pct = Math.max(0, Math.min(100, value))
  const radius = size * 0.4
  const stroke = size * 0.08
  const circ = 2 * Math.PI * radius
  const strokeDashoffset = circ - (circ * (pct * 0.75)) / 100

  return (
    <div
      className={["liquid-gauge", className].filter(Boolean).join(" ")}
      data-tone={tone}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(135deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={stroke}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#lg-gauge-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
        <defs>
          <linearGradient id="lg-gauge-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#59DBFF" />
            <stop offset="100%" stopColor="#0085FA" />
          </linearGradient>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: size * 0.18, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--p-fg)" }}>
          <LiquidValueCounter value={pct} suffix="%" />
        </span>
        {title && (
          <span style={{ fontSize: size * 0.075, fontWeight: 600, color: "var(--p-soft)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {title}
          </span>
        )}
      </div>
    </div>
  )
}

/* ===================== LiquidChart Wrapper ===================== */

export type LiquidChartProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  tone?: LiquidTone
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function LiquidChart({
  title,
  description,
  tone = "light",
  children,
  className,
  style,
}: LiquidChartProps) {
  return (
    <GlassPanel
      tone={tone}
      radius={24}
      className={["liquid-chart-card", className].filter(Boolean).join(" ")}
      style={{ padding: "24px 22px 20px", display: "flex", flexDirection: "column", gap: 16, width: "100%", ...style }}
    >
      {(title || description) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {title && <h3 style={{ margin: 0, fontSize: 17, fontWeight: 650, letterSpacing: "-0.015em" }}>{title}</h3>}
          {description && <p style={{ margin: 0, fontSize: 13, color: "var(--p-soft)" }}>{description}</p>}
        </div>
      )}
      {children}
    </GlassPanel>
  )
}

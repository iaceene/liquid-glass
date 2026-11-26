"use client"

/**
 * Nimbus UI · LiquidProvider
 * Global atmospheric context orchestrating sound effects, tone themes, reduced-motion, and fluid intensity.
 */

import * as React from "react"
import { type LiquidTone } from "./tokens"
import { playPlip as corePlayPlip } from "./engine"

export type LiquidContextValue = {
  tone: LiquidTone
  setTone: (tone: LiquidTone) => void
  sound: boolean
  setSound: (sound: boolean) => void
  reducedMotion: boolean
  intensity: number
  playPlip: (f0?: number, f1?: number) => void
}

const LiquidContext = React.createContext<LiquidContextValue | undefined>(undefined)

export type LiquidProviderProps = {
  tone?: LiquidTone
  sound?: boolean
  reducedMotion?: "auto" | boolean
  intensity?: number
  children: React.ReactNode
}

export function LiquidProvider({
  tone: initialTone = "light",
  sound: initialSound = false,
  reducedMotion = "auto",
  intensity = 1,
  children,
}: LiquidProviderProps) {
  const [tone, setTone] = React.useState<LiquidTone>(initialTone)
  const [sound, setSound] = React.useState<boolean>(initialSound)

  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    if (reducedMotion === "auto") {
      const mq = typeof window !== "undefined" ? window.matchMedia?.("(prefers-reduced-motion: reduce)") : null
      setPrefersReducedMotion(!!mq?.matches)
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
      mq?.addEventListener("change", handler)
      return () => mq?.removeEventListener("change", handler)
    } else {
      setPrefersReducedMotion(!!reducedMotion)
      return undefined
    }
  }, [reducedMotion])

  const playPlip = React.useCallback(
    (f0 = 460, f1 = 1400) => {
      if (sound) {
        corePlayPlip(f0, f1)
      }
    },
    [sound]
  )

  const value = React.useMemo<LiquidContextValue>(
    () => ({
      tone,
      setTone,
      sound,
      setSound,
      reducedMotion: prefersReducedMotion,
      intensity: Math.max(0, Math.min(1, intensity)),
      playPlip,
    }),
    [tone, sound, prefersReducedMotion, intensity, playPlip]
  )

  return (
    <LiquidContext.Provider value={value}>
      <div data-tone={tone} style={{ display: "contents" }}>
        {children}
      </div>
    </LiquidContext.Provider>
  )
}

export function useLiquidContext(): LiquidContextValue {
  const ctx = React.useContext(LiquidContext)
  if (!ctx) {
    return {
      tone: "light",
      setTone: () => {},
      sound: false,
      setSound: () => {},
      reducedMotion: false,
      intensity: 1,
      playPlip: () => {},
    }
  }
  return ctx
}

export { LiquidProvider as Component }
export default LiquidProvider

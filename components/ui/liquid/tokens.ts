"use client"

/**
 * Nimbus UI · Liquid Design Tokens
 * Master atmospheric tokens, color palettes, spring presets, and CSS variables.
 */

export type LiquidTone = "light" | "dark" | "midnight" | "aurora" | "sunset" | "rose" | "emerald"

export const LIQUID_COLORS = {
  ink: "#0B132B",
  accent: "#00A2FF",
  waterStart: "#59DBFF",
  waterEnd: "#0085FA",
  error: "#E5484D",
  success: "#18B26B",
  warning: "#F5A623",
  white: "#FFFFFF",
} as const

export const SPRING_PRESETS = {
  leader: { k: 210, c: 25 },
  tail: { k: 60, c: 13, lagMs: 110 },
  verticalLead: { k: 260, c: 22 },
  tilt: { k: 60, c: 11 },
  flip: { k: 150, c: 17 },
  waterLevel: { k: 14, c: 5 },
  waterSlope: { k: 26, c: 1.6 },
  snapOvershoot: { k: 280, c: 18 },
} as const

export const LIQUID_TOKENS_CSS = `
:root, [data-tone="light"] {
  --p-fg: #0B132B;
  --p-soft: rgba(11, 19, 43, 0.62);
  --p-faint: rgba(11, 19, 43, 0.42);
  --p-line: rgba(11, 19, 43, 0.1);
  --p-tint: rgba(255, 255, 255, 0.18);
  --p-rim: rgba(255, 255, 255, 0.76);
  --p-err: #E5484D;
  --p-accent: #00A2FF;
  --p-success: #18B26B;
  --p-shadow: 0 22px 50px -24px rgba(0, 40, 90, 0.55), 0 2px 6px rgba(0, 40, 90, 0.08);
  --p-shadow-recessed: inset 0 2px 5px rgba(0, 40, 90, 0.16), inset 0 -1px 1px var(--p-rim);
  --p-water-a: 0.2, 0.62, 1.0;
  --p-water-b: 0.0, 0.3, 0.82;
  --p-water-w: 0.5, 0.92, 1.0;
}

[data-tone="dark"] {
  --p-fg: #F1F7FF;
  --p-soft: rgba(241, 247, 255, 0.66);
  --p-faint: rgba(241, 247, 255, 0.45);
  --p-line: rgba(241, 247, 255, 0.12);
  --p-tint: rgba(10, 18, 40, 0.32);
  --p-rim: rgba(255, 255, 255, 0.32);
  --p-err: #E5484D;
  --p-accent: #00A2FF;
  --p-success: #18B26B;
  --p-shadow: 0 22px 50px -24px rgba(0, 0, 0, 0.72), 0 2px 6px rgba(0, 0, 0, 0.15);
  --p-shadow-recessed: inset 0 2px 5px rgba(0, 0, 0, 0.35), inset 0 -1px 1px var(--p-rim);
  --p-water-a: 0.09, 0.15, 0.32;
  --p-water-b: 0.02, 0.04, 0.12;
  --p-water-w: 0.0, 0.6, 1.0;
}

[data-tone="midnight"] {
  --p-fg: #FFFFFF;
  --p-soft: rgba(255, 255, 255, 0.7);
  --p-faint: rgba(255, 255, 255, 0.45);
  --p-line: rgba(0, 200, 255, 0.18);
  --p-tint: rgba(4, 7, 16, 0.68);
  --p-rim: rgba(100, 220, 255, 0.55);
  --p-err: #FF4554;
  --p-accent: #00D5FF;
  --p-success: #00F090;
  --p-shadow: 0 24px 60px -20px rgba(0, 140, 255, 0.35), 0 0 1px 1px rgba(0, 200, 255, 0.2);
  --p-shadow-recessed: inset 0 2px 6px rgba(0, 0, 0, 0.6), inset 0 -1px 1px var(--p-rim);
  --p-water-a: 0.02, 0.06, 0.18;
  --p-water-b: 0.0, 0.02, 0.08;
  --p-water-w: 0.0, 0.8, 1.0;
}
`

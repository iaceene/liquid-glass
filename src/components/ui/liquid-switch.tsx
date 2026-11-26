"use client"

/**
 * Nimbus UI · Liquid Switch — "Surface Tension Switch"
 * A toggle switch crafted from liquid glass and surface tension.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import { LiquidToggle, type LiquidToggleProps } from "./liquid-toggle"

export type LiquidSwitchProps = LiquidToggleProps

export function LiquidSwitch(props: LiquidSwitchProps) {
  return <LiquidToggle {...props} />
}

export { LiquidSwitch as Switch }
export default LiquidSwitch

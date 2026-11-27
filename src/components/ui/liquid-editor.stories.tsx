import type { Meta, StoryObj } from "@storybook/react-vite"
import { LiquidEditor, type EditorFile } from "./liquid-editor"

const multiFiles: EditorFile[] = [
  {
    name: "LiquidButton.tsx",
    language: "tsx",
    content: `import * as React from "react"

export function LiquidButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      className="px-6 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-lg text-white font-medium hover:scale-105 active:scale-95 transition-all"
      onClick={onClick}
    >
      {children}
    </button>
  )
}`,
  },
  {
    name: "water.frag",
    language: "glsl",
    content: `precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec4 uRipple;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float wave = sin(uv.x * 24.0 + uTime * 3.0) * cos(uv.y * 18.0 - uTime * 2.0);
  vec3 waterColor = mix(vec3(0.0, 0.63, 1.0), vec3(0.05, 0.95, 0.8), wave * 0.5 + 0.5);
  gl_FragColor = vec4(waterColor, 0.85);
}`,
  },
  {
    name: "globals.css",
    language: "css",
    content: `:root {
  --glass-tint: rgba(255, 255, 255, 0.28);
  --glass-blur: 18px;
  --glass-sat: 180%;
}

.liquid-chamber {
  background: var(--glass-tint);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  border-radius: 24px;
}`,
  },
]

const meta: Meta<typeof LiquidEditor> = {
  title: "Editor/LiquidEditor",
  component: LiquidEditor,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["light", "dark", "midnight"],
      description: "Visual surface tone for frosted crystal vs obsidian abyss",
    },
    language: {
      control: "select",
      options: ["tsx", "typescript", "javascript", "css", "glsl", "json", "html"],
      description: "Code syntax grammar mode",
    },
    sound: {
      control: "boolean",
      description: "Synthesized acoustic typing plips",
    },
    readOnly: {
      control: "boolean",
      description: "Lock editor to viewer mode",
    },
    showLineNumbers: {
      control: "boolean",
      description: "Display code line numbers in gutter",
    },
  },
}

export default meta
type Story = StoryObj<typeof LiquidEditor>

export const Interactive: Story = {
  render: (args) => {
    return (
      <div style={{ maxWidth: 840, margin: "0 auto", width: "100%" }}>
        <LiquidEditor {...args} />
      </div>
    )
  },
}

export const MidnightAbyss: Story = {
  args: {
    tone: "midnight",
    filename: "AbyssCore.tsx",
  },
  render: (args) => {
    return (
      <div style={{ maxWidth: 840, margin: "0 auto", width: "100%", padding: 24, background: "#050B14", borderRadius: 28 }}>
        <LiquidEditor {...args} />
      </div>
    )
  },
}

export const MultiFileProject: Story = {
  render: (args) => {
    return (
      <div style={{ maxWidth: 840, margin: "0 auto", width: "100%" }}>
        <LiquidEditor {...args} files={multiFiles} />
      </div>
    )
  },
}

export const ReadOnlySnippet: Story = {
  args: {
    readOnly: true,
    filename: "QuickSnippet.ts",
    defaultValue: `// Read-only snippet mode
export const CONFIG = {
  tidepool: "active",
  dropletsMax: 256,
  refraction: true,
  plipAudio: true,
} as const;`,
  },
  render: (args) => {
    return (
      <div style={{ maxWidth: 840, margin: "0 auto", width: "100%" }}>
        <LiquidEditor {...args} />
      </div>
    )
  },
}

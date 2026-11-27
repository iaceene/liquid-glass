"use client"

/**
 * Nimbus UI · Liquid Editor — "Crystalline Code Chamber"
 * A luminous glass code and text editor forged in frosted crystal glass.
 * Features an orbiting liquid perimeter water stream, real-time syntax coloring,
 * interactive multi-file tabs, line numbers gutter with active line tracking,
 * tab indentation handling, copy-to-clipboard feedback, language selector,
 * acoustic typing plips, and status metrics.
 * No external syntax or editor dependencies.
 * by guglielmogiannattasio.it
 */

import * as React from "react"
import { useLiquidContext } from "./liquid/provider"
import { playPlip } from "./liquid/engine"

export type EditorLanguage = "typescript" | "javascript" | "tsx" | "jsx" | "css" | "html" | "json" | "glsl"
export type EditorTone = "light" | "dark" | "midnight"

export type EditorFile = {
  name: string
  content: string
  language?: EditorLanguage
}

export type LiquidEditorProps = {
  value?: string
  defaultValue?: string
  onChange?: (val: string) => void
  language?: EditorLanguage
  filename?: string
  files?: EditorFile[]
  activeFileIndex?: number
  onFileChange?: (index: number, file: EditorFile) => void
  tone?: EditorTone
  sound?: boolean
  readOnly?: boolean
  showLineNumbers?: boolean
  showGutter?: boolean
  showToolbar?: boolean
  showFooter?: boolean
  title?: React.ReactNode
  height?: number | string
  className?: string
  style?: React.CSSProperties
  onRun?: (code: string) => void
}

/* ---------- Editor Styles ---------- */
const NE_CSS = `
.nimbus-editor {
  --ne-tint: linear-gradient(135deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.1));
  --ne-fg: #0B132B;
  --ne-soft: rgba(11, 19, 43, 0.65);
  --ne-line: rgba(11, 19, 43, 0.08);
  --ne-rim: rgba(255, 255, 255, 0.7);
  --ne-rim-b: rgba(255, 255, 255, 0.2);
  --ne-border: rgba(255, 255, 255, 0.38);
  --ne-shadow: inset 0 1px 0 var(--ne-rim), inset 0 -1px 0 var(--ne-rim-b), 0 24px 60px -20px rgba(31, 38, 135, 0.22), 0 4px 16px rgba(31, 38, 135, 0.08);
  --ne-accent: #00A2FF;
  --ne-accent-soft: rgba(0, 162, 255, 0.2);
  --ne-accent-glow: rgba(0, 162, 255, 0.4);
  --ne-gutter-bg: rgba(255, 255, 255, 0.12);
  --ne-gutter-fg: rgba(11, 19, 43, 0.45);
  --ne-active-line: rgba(0, 162, 255, 0.08);
  --ne-caret: #0077EE;

  /* Syntax Highlighting Light */
  --syn-kwd: #7928CA;
  --syn-str: #D97706;
  --syn-num: #D946EF;
  --syn-fn: #0284C7;
  --syn-typ: #0D9488;
  --syn-com: #94A3B8;
  --syn-tag: #0369A1;

  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  isolation: isolate;
  background: var(--ne-tint);
  -webkit-backdrop-filter: blur(18px) saturate(180%) brightness(1.08);
  backdrop-filter: blur(18px) saturate(180%) brightness(1.08);
  border: 1px solid var(--ne-border);
  box-shadow: var(--ne-shadow);
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  color: var(--ne-fg);
  box-sizing: border-box;
}

.nimbus-editor::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(100% 70% at 50% 0%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 65%);
  z-index: 0;
}

.nimbus-editor[data-tone="dark"],
.nimbus-editor[data-tone="midnight"] {
  --ne-tint: linear-gradient(135deg, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.28));
  --ne-fg: #F1F7FF;
  --ne-soft: rgba(241, 247, 255, 0.68);
  --ne-line: rgba(241, 247, 255, 0.1);
  --ne-rim: rgba(255, 255, 255, 0.4);
  --ne-rim-b: rgba(0, 210, 255, 0.2);
  --ne-border: rgba(255, 255, 255, 0.22);
  --ne-shadow: inset 0 1px 0 var(--ne-rim), inset 0 -1px 0 var(--ne-rim-b), 0 24px 64px -20px rgba(0, 0, 0, 0.8), 0 0 22px rgba(0, 210, 255, 0.18);
  --ne-accent: #00E5FF;
  --ne-accent-soft: rgba(0, 229, 255, 0.25);
  --ne-accent-glow: rgba(0, 229, 255, 0.55);
  --ne-gutter-bg: rgba(0, 0, 0, 0.2);
  --ne-gutter-fg: rgba(241, 247, 255, 0.4);
  --ne-active-line: rgba(0, 210, 255, 0.12);
  --ne-caret: #00E5FF;

  /* Syntax Highlighting Dark */
  --syn-kwd: #C084FC;
  --syn-str: #FDE047;
  --syn-num: #F472B6;
  --syn-fn: #38BDF8;
  --syn-typ: #2DD4BF;
  --syn-com: #64748B;
  --syn-tag: #67E8F9;
}

.nimbus-editor[data-tone="dark"]::before,
.nimbus-editor[data-tone="midnight"]::before {
  background: radial-gradient(100% 70% at 50% 0%, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0) 65%);
}

/* Liquid animated perimeter border */
.ne-liquid-border {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  pointer-events: none;
  z-index: 1;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  overflow: hidden;
}

.ne-border-stream {
  position: absolute;
  inset: -60%;
  width: 220%;
  height: 220%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    transparent 45deg,
    var(--ne-accent-soft) 95deg,
    var(--ne-accent) 150deg,
    #FFFFFF 176deg,
    #FFFFFF 184deg,
    var(--ne-accent) 210deg,
    var(--ne-accent-soft) 265deg,
    transparent 315deg,
    transparent 360deg
  );
  animation: neBorderSpin 4s linear infinite;
}

.nimbus-editor:hover .ne-border-stream {
  animation-duration: 2.2s;
}

@keyframes neBorderSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ne-border-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
  box-shadow: 0 0 18px -2px var(--ne-accent-glow);
  opacity: 0.75;
  animation: neBorderPulse 3.2s ease-in-out infinite alternate;
}

@keyframes neBorderPulse {
  0% { opacity: 0.55; box-shadow: 0 0 12px -2px var(--ne-accent-glow); }
  100% { opacity: 0.95; box-shadow: 0 0 22px 0px var(--ne-accent-glow); }
}

/* Header & Tab bar */
.ne-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--ne-line);
  user-select: none;
  gap: 12px;
}

.ne-window-dots {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
}

.ne-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.7), 0 1px 3px rgba(0, 0, 0, 0.15);
}
.ne-dot-close { background: #FF5F56; }
.ne-dot-min { background: #FFBD2E; }
.ne-dot-max { background: #27C93F; }

.ne-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}
.ne-tabs::-webkit-scrollbar { display: none; }

.ne-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 550;
  color: var(--ne-soft);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.ne-tab:hover {
  color: var(--ne-fg);
  background: rgba(255, 255, 255, 0.12);
}
.ne-tab[data-active="true"] {
  color: var(--ne-fg);
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 2px 8px rgba(0, 162, 255, 0.15);
}

.ne-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
}

.ne-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: var(--ne-fg);
  cursor: pointer;
  transition: all 0.15s ease;
}
.ne-btn:hover {
  background: rgba(255, 255, 255, 0.26);
  border-color: rgba(255, 255, 255, 0.45);
  transform: translateY(-1px);
}
.ne-btn:active {
  transform: translateY(0);
}

.ne-badge {
  font-size: 11px;
  font-weight: 650;
  padding: 3px 7px;
  border-radius: 6px;
  background: rgba(0, 162, 255, 0.15);
  border: 1px solid rgba(0, 162, 255, 0.3);
  color: var(--ne-accent);
}

/* Editor Body & Scroll Area */
.ne-body {
  position: relative;
  z-index: 2;
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 480px;
  min-height: 240px;
  font-size: 13px;
  line-height: 21px;
}

.ne-gutter {
  display: flex;
  flex-direction: column;
  padding: 12px 10px 12px 14px;
  background: var(--ne-gutter-bg);
  color: var(--ne-gutter-fg);
  border-right: 1px solid var(--ne-line);
  user-select: none;
  text-align: right;
  flex: none;
  min-width: 44px;
}

.ne-line-number {
  height: 21px;
  transition: color 0.15s ease;
}
.ne-line-number[data-active="true"] {
  color: var(--ne-accent);
  font-weight: 700;
}

.ne-code-pane {
  position: relative;
  flex: 1;
  min-width: 0;
  padding: 12px 16px;
  overflow-x: auto;
}

.ne-textarea {
  position: absolute;
  top: 12px;
  left: 16px;
  right: 16px;
  bottom: 12px;
  width: calc(100% - 32px);
  height: calc(100% - 24px);
  background: transparent;
  color: transparent;
  caret-color: var(--ne-caret);
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  white-space: pre;
  tab-size: 2;
  overflow: hidden;
  z-index: 2;
  padding: 0;
  margin: 0;
}

.ne-pre {
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  white-space: pre;
  tab-size: 2;
  pointer-events: none;
  color: var(--ne-fg);
}

.ne-active-row-highlight {
  position: absolute;
  left: 0;
  right: 0;
  height: 21px;
  background: var(--ne-active-line);
  pointer-events: none;
  z-index: 0;
  transition: top 0.1s ease;
}

/* Syntax Token Colors */
.syn-kwd { color: var(--syn-kwd); font-weight: 600; }
.syn-str { color: var(--syn-str); }
.syn-num { color: var(--syn-num); }
.syn-fn  { color: var(--syn-fn); font-weight: 600; }
.syn-typ { color: var(--syn-typ); font-weight: 600; }
.syn-com { color: var(--syn-com); font-style: italic; opacity: 0.85; }
.syn-tag { color: var(--syn-tag); font-weight: 600; }

/* Status Footer */
.ne-footer {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  border-top: 1px solid var(--ne-line);
  font-size: 11px;
  color: var(--ne-soft);
  user-select: none;
}

.ne-status-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (prefers-reduced-motion: reduce) {
  .ne-border-stream, .ne-border-glow {
    animation: none !important;
  }
}
`

/* ---------- Lightweight Syntax Highlighting Parser ---------- */
function highlightCode(code: string): React.ReactNode[] {
  const lines = code.split("\n")
  return lines.map((line, idx) => {
    // Escape HTML & highlight tokens
    const tokens = tokenizeLine(line)
    return (
      <span key={idx} style={{ display: "block", minHeight: 21 }}>
        {tokens}
      </span>
    )
  })
}

function tokenizeLine(line: string): React.ReactNode[] {
  if (!line) return [" "]
  // Match comments, strings, keywords, numbers, JSX tags
  const regex = /(\/\/[^\n]*)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)|(\b(?:import|export|from|default|const|let|var|function|return|if|else|for|while|switch|case|break|try|catch|finally|throw|class|extends|interface|type|as|async|await|new|this|typeof|instanceof)\b)|(\b[A-Z][a-zA-Z0-9_]*\b)|(\b\d+(?:\.\d+)?\b)|(<\/?[a-zA-Z0-9_.-]+|\/?>)|(\b[a-zA-Z_][a-zA-Z0-9_]*(?=\())/g

  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.substring(lastIndex, match.index))
    }
    const [full, comment, str, kwd, typ, num, tag, fn] = match
    const key = `${match.index}-${full}`

    if (comment) {
      nodes.push(<span key={key} className="syn-com">{comment}</span>)
    } else if (str) {
      nodes.push(<span key={key} className="syn-str">{str}</span>)
    } else if (kwd) {
      nodes.push(<span key={key} className="syn-kwd">{kwd}</span>)
    } else if (typ) {
      nodes.push(<span key={key} className="syn-typ">{typ}</span>)
    } else if (num) {
      nodes.push(<span key={key} className="syn-num">{num}</span>)
    } else if (tag) {
      nodes.push(<span key={key} className="syn-tag">{tag}</span>)
    } else if (fn) {
      nodes.push(<span key={key} className="syn-fn">{fn}</span>)
    } else {
      nodes.push(full)
    }
    lastIndex = regex.lastIndex
  }

  if (lastIndex < line.length) {
    nodes.push(line.substring(lastIndex))
  }

  return nodes
}

/* ---------- Default Sample Code ---------- */
const DEFAULT_SAMPLE_CODE = `import * as React from "react"
import { LiquidButton } from "./liquid-button"

export function App() {
  const [drops, setDrops] = React.useState(42)

  const handleSpawn = () => {
    setDrops((d) => d + 1)
  }

  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <h1 className="text-xl font-bold">Liquid Chamber</h1>
      <p className="opacity-80">Droplets active: {drops}</p>
      <LiquidButton variant="primary" onClick={handleSpawn}>
        Spawn Droplet
      </LiquidButton>
    </div>
  )
}
`

/* ---------- Component: LiquidEditor ---------- */
export function LiquidEditor({
  value,
  defaultValue = DEFAULT_SAMPLE_CODE,
  onChange,
  language = "tsx",
  filename = "App.tsx",
  files,
  activeFileIndex: propActiveIndex,
  onFileChange,
  tone: propTone,
  sound: propSound,
  readOnly = false,
  showLineNumbers = true,
  showToolbar = true,
  showFooter = true,
  title,
  height,
  className = "",
  style,
  onRun,
}: LiquidEditorProps) {
  const ctx = useLiquidContext()
  const tone = propTone ?? (ctx ? (ctx.tone === "midnight" || ctx.tone === "dark" ? "dark" : "light") : "light")
  const sound = propSound ?? ctx?.sound ?? true

  const [activeFile, setActiveFile] = React.useState(propActiveIndex ?? 0)
  const isMultiFile = Array.isArray(files) && files.length > 0

  const currentFile = isMultiFile ? files[activeFile] || files[0] : null
  const currentFilename = currentFile ? currentFile.name : filename
  const currentLanguage = currentFile?.language || language

  const [innerCode, setInnerCode] = React.useState(currentFile ? currentFile.content : (value ?? defaultValue))
  const code = value !== undefined ? value : innerCode

  const [activeLine, setActiveLine] = React.useState(0)
  const [cursorCol, setCursorCol] = React.useState(0)
  const [copied, setCopied] = React.useState(false)

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const preRef = React.useRef<HTMLPreElement | null>(null)

  // Sync when files change
  React.useEffect(() => {
    if (isMultiFile && files[activeFile]) {
      setInnerCode(files[activeFile].content)
    }
  }, [activeFile, isMultiFile, files])

  const lines = React.useMemo(() => code.split("\n"), [code])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    if (value === undefined) setInnerCode(val)
    onChange?.(val)
    updateCursor(e.target)
  }

  const updateCursor = (el: HTMLTextAreaElement) => {
    const pos = el.selectionStart
    const textBefore = el.value.substring(0, pos)
    const lineIndex = textBefore.split("\n").length - 1
    const lastNewline = textBefore.lastIndexOf("\n")
    const colIndex = lastNewline === -1 ? pos : pos - lastNewline - 1
    setActiveLine(lineIndex)
    setCursorCol(colIndex)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (sound && e.key.length === 1) {
      playPlip(720 + Math.random() * 120, 1150 + Math.random() * 150)
    }

    if (e.key === "Tab" && !readOnly) {
      e.preventDefault()
      const el = e.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      const next = code.substring(0, start) + "  " + code.substring(end)
      if (value === undefined) setInnerCode(next)
      onChange?.(next)
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2
        updateCursor(el)
      })
    }
  }

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      if (sound) playPlip(600, 900)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleFormat = () => {
    // Gentle indentation format
    try {
      const formatted = code
        .split("\n")
        .map((l) => l.trimEnd())
        .join("\n")
      if (value === undefined) setInnerCode(formatted)
      onChange?.(formatted)
      if (sound) playPlip(500, 800)
    } catch {}
  }

  return (
    <div
      className={`nimbus-editor ${className}`}
      data-tone={tone}
      style={{ ...style, height }}
    >
      <style dangerouslySetInnerHTML={{ __html: NE_CSS }} />

      <div className="ne-liquid-border" aria-hidden="true">
        <div className="ne-border-stream" />
      </div>
      <div className="ne-border-glow" aria-hidden="true" />

      {/* Header Bar */}
      {showToolbar && (
        <div className="ne-header">
          <div className="ne-window-dots" aria-hidden="true">
            <span className="ne-dot ne-dot-close" />
            <span className="ne-dot ne-dot-min" />
            <span className="ne-dot ne-dot-max" />
          </div>

          <div className="ne-tabs">
            {isMultiFile ? (
              files.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  className="ne-tab"
                  data-active={i === activeFile}
                  onClick={() => {
                    setActiveFile(i)
                    onFileChange?.(i, f)
                    if (sound) playPlip(450, 700)
                  }}
                >
                  <span>{f.name}</span>
                </button>
              ))
            ) : (
              <div className="ne-tab" data-active="true">
                <span>{title || currentFilename}</span>
              </div>
            )}
          </div>

          <div className="ne-actions">
            <span className="ne-badge">{currentLanguage.toUpperCase()}</span>
            {!readOnly && (
              <button
                type="button"
                className="ne-btn"
                title="Format Code"
                onClick={handleFormat}
              >
                <span>✦ Format</span>
              </button>
            )}
            <button
              type="button"
              className="ne-btn"
              title="Copy to clipboard"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
            {onRun && (
              <button
                type="button"
                className="ne-btn"
                style={{ background: "rgba(0, 162, 255, 0.25)", borderColor: "rgba(0, 162, 255, 0.5)" }}
                onClick={() => onRun(code)}
              >
                <span>▶ Run</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Editor Main Body */}
      <div className="ne-body">
        {showLineNumbers && (
          <div className="ne-gutter" aria-hidden="true">
            {lines.map((_, i) => (
              <span
                key={i}
                className="ne-line-number"
                data-active={i === activeLine}
              >
                {i + 1}
              </span>
            ))}
          </div>
        )}

        <div className="ne-code-pane">
          <div
            className="ne-active-row-highlight"
            style={{ top: 12 + activeLine * 21 }}
            aria-hidden="true"
          />

          <textarea
            ref={textareaRef}
            className="ne-textarea"
            value={code}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onKeyUp={(e) => updateCursor(e.currentTarget)}
            onClick={(e) => updateCursor(e.currentTarget)}
            aria-label="Code editor"
          />

          <pre ref={preRef} className="ne-pre" aria-hidden="true">
            {highlightCode(code)}
          </pre>
        </div>
      </div>

      {/* Status Footer */}
      {showFooter && (
        <div className="ne-footer">
          <div className="ne-status-group">
            <span>Ln {activeLine + 1}, Col {cursorCol + 1}</span>
            <span>Spaces: 2</span>
            <span>UTF-8</span>
          </div>
          <div className="ne-status-group">
            <span>{lines.length} lines</span>
            <span>{code.length} chars</span>
          </div>
        </div>
      )}
    </div>
  )
}

export { LiquidEditor as Editor }
export { LiquidEditor as Component }
export default LiquidEditor

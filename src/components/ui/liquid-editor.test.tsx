import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { LiquidEditor } from "./liquid-editor"

describe("LiquidEditor component", () => {
  it("renders code editor with sample code and line numbers", () => {
    const sample = `const a = 1;
const b = 2;`
    const { container } = render(<LiquidEditor defaultValue={sample} />)
    const textarea = screen.getByLabelText("Code editor")
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveValue(sample)
    const gutter = container.querySelector(".ne-gutter")
    expect(gutter).toBeInTheDocument()
    expect(gutter).toHaveTextContent("1")
    expect(gutter).toHaveTextContent("2")
  })

  it("handles text change and calls onChange", () => {
    const onChange = vi.fn()
    render(<LiquidEditor defaultValue="hello" onChange={onChange} />)
    const textarea = screen.getByLabelText("Code editor")
    fireEvent.change(textarea, { target: { value: "hello world" } })
    expect(onChange).toHaveBeenCalledWith("hello world")
  })

  it("handles copy button click", () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    })
    render(<LiquidEditor defaultValue="export const test = true" />)
    const copyBtn = screen.getByRole("button", { name: /copy/i })
    fireEvent.click(copyBtn)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("export const test = true")
  })

  it("switches multi-file tabs", () => {
    const files = [
      { name: "index.ts", content: "console.log('index');" },
      { name: "styles.css", content: "body { margin: 0; }" },
    ]
    render(<LiquidEditor files={files} />)
    expect(screen.getByText("index.ts")).toBeInTheDocument()
    expect(screen.getByText("styles.css")).toBeInTheDocument()

    // Click styles.css
    fireEvent.click(screen.getByText("styles.css"))
    const textarea = screen.getByLabelText("Code editor")
    expect(textarea).toHaveValue("body { margin: 0; }")
  })

  it("supports tone attribute and readonly mode", () => {
    const { container } = render(<LiquidEditor tone="midnight" readOnly defaultValue="const secret = 42;" />)
    const editor = container.querySelector(".nimbus-editor")
    expect(editor).toHaveAttribute("data-tone", "midnight")
    const textarea = screen.getByLabelText("Code editor")
    expect(textarea).toHaveAttribute("readonly")
  })
})

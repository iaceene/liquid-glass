import { LiquidForm } from "@/components/ui/liquid-glass-form"

export default function FormDemo() {
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
        padding: "48px 16px",
        boxSizing: "border-box",
        overflowX: "hidden",
        background: "#DCEBF5",
      }}
    >
      <LiquidForm
        title="Get in Touch"
        description="A responsive glass basin. Focus inputs to see the water glide."
        tone="light"
        sound={true}
        onSubmit={async (values) => {
          await new Promise((resolve) => setTimeout(resolve, 1500))
          console.log("Form submitted:", values)
        }}
      />
      <span
        style={{
          font: "500 12px/1 ui-sans-serif, -apple-system, 'Segoe UI', system-ui, sans-serif",
          color: "rgba(11,19,43,.5)",
        }}
      >
        Nimbus UI · by{" "}
        <a
          href="https://guglielmogiannattasio.it"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "rgba(11,19,43,.7)" }}
        >
          guglielmogiannattasio.it
        </a>
      </span>
    </div>
  )
}

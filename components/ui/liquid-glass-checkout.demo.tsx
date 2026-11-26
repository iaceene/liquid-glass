import { LiquidCheckout } from "@/components/ui/liquid-glass-checkout"

export default function Demo() {
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
      <LiquidCheckout amount={42} currency="EUR" merchant="Nimbus Store" tone="light" />
      <span
        style={{
          font: "500 12px/1 ui-sans-serif, -apple-system, 'Segoe UI', system-ui, sans-serif",
          color: "rgba(11,19,43,.5)",
        }}
      >
        Nimbus UI · by{" "}
        <a href="https://guglielmogiannattasio.it" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(11,19,43,.7)" }}>
          guglielmogiannattasio.it
        </a>
      </span>
    </div>
  )
}

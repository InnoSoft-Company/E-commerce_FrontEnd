import { Product } from "@/src/data/products";

export default function Info({ product }: { product: Product }) {
  return (
    <>
      <p style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: "#d97706", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ width: "20px", height: "2px", background: "#f59e0b", display: "inline-block", borderRadius: "2px" }} />
        {product.category}
      </p>

      <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, color: "#0f172a", lineHeight: 1.05, marginBottom: "16px" }}>
        {product.name}
      </h1>

      <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "2.4rem", fontWeight: 800, color: "#0f172a", marginBottom: "20px" }}>
        {product.price.toLocaleString("en-US")} LE
      </p>

      <div style={{ borderTop: "2px solid #f1e4b8", paddingTop: "20px", marginBottom: "20px" }}>
        <p style={{ fontSize: "16px", color: "#334155", fontWeight: 400, lineHeight: 1.75 }}>{product.description}</p>
      </div>
    </>
  );
}

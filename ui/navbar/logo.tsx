import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "2px" }}>
      <span style={{
        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)",
        fontSize: "24px",
        fontWeight: 800,
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        color: "#0f172a",
        lineHeight: 1,
      }}>
        BLANKO
      </span>
      <span style={{
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.35em",
        textTransform: "uppercase",
        color: "#f59e0b",
        lineHeight: 1,
      }}>
        Fashion House
      </span>
    </Link>
  );
}

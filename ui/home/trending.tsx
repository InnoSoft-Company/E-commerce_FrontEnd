import { ProductCard } from "@/ui/components/ProductCard";
import { Product } from "@/src/data/products";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Trending({ trending }: { trending: Product[] }) {
  return (
    <>
      <section style={{ background: "#fffbeb", padding: "72px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="section-header">
            <div>
              <p className="section-tag" style={{ marginBottom: 10, color: "#d97706" }}>الأكثر طلبًا</p>
              <h2 style={{ color: "#0f172a", margin: "0 0 8px", fontSize: "clamp(1.6rem,4vw,2.6rem)" }}>الرائج الآن</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <TrendingUp size={16} style={{ color: "#f59e0b" }} strokeWidth={2.5} />
                <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>الأكثر مبيعًا هذا الأسبوع</p>
              </div>
            </div>
            <Link
              href="/shop"
              style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0f172a", textDecoration: "none", borderBottom: "2px solid #f59e0b", paddingBottom: 3, flexShrink: 0 }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#d97706"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#0f172a"; }}
            >
              عرض الكل <ArrowRight size={14} />
            </Link>
          </div>

          <div className="products-grid-4">
            {trending.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <style>{`
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .products-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media(max-width:1024px){ .products-grid-4 { grid-template-columns: repeat(3, 1fr); gap: 18px; } }
        @media(max-width:700px) { .products-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 14px; } }
        @media(max-width:360px) { .products-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
      `}</style>
    </>
  );
}

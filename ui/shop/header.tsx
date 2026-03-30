"use client";
import { SlidersHorizontal } from "lucide-react";

const cats = ["", "Women", "Men", "Kids", "Accessories"];
const catAr: Record<string, string> = { "": "الكل", Women: "نساء", Men: "رجال", Kids: "أطفال", Accessories: "إكسسوارات" };

export default function ShopHeader({ selectedCategory, setSelectedCategory, sorted, showFilters, setShowFilters, sortBy, setSortBy }: any) {
  return (
    <>
      <div style={{ background: "#1e293b", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "32px 0 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <p className="section-tag" style={{ marginBottom: 8 }}>تشكيلتنا الكاملة</p>
            <h1 style={{ color: "#ffffff", margin: "0 0 5px", fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>المتجر</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", margin: 0 }}>
              <span style={{ fontWeight: 800, color: "#f59e0b" }}>{sorted.length}</span> منتج متاح
            </p>
          </div>

          {/* Filters row */}
          <div className="shop-header-row">
            {/* Category pills */}
            <div className="shop-cats">
              {cats.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "8px 18px", fontSize: 12, fontWeight: 800,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    border: "2px solid", borderRadius: 50, cursor: "pointer", transition: "all 0.22s",
                    background: selectedCategory === cat ? "#f59e0b" : "rgba(255,255,255,0.07)",
                    color: selectedCategory === cat ? "#0f172a" : "rgba(255,255,255,0.52)",
                    borderColor: selectedCategory === cat ? "#f59e0b" : "rgba(255,255,255,0.12)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {catAr[cat] ?? cat}
                </button>
              ))}
            </div>

            {/* Sort + filter button */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ padding: "9px 14px", fontSize: 13, fontWeight: 600, color: "#ffffff", background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.14)", borderRadius: 8, cursor: "pointer", outline: "none" }}
              >
                <option value="newest" style={{ background: "#1e293b" }}>الأحدث أولًا</option>
                <option value="price-low" style={{ background: "#1e293b" }}>السعر: من الأقل</option>
                <option value="price-high" style={{ background: "#1e293b" }}>السعر: من الأعلى</option>
                <option value="popularity" style={{ background: "#1e293b" }}>الأكثر شعبية</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="shop-filter-btn"
                style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "9px 16px",
                  fontSize: 12, fontWeight: 800,
                  color: showFilters ? "#0f172a" : "#ffffff",
                  background: showFilters ? "#f59e0b" : "rgba(255,255,255,0.08)",
                  border: "1.5px solid", borderColor: showFilters ? "#f59e0b" : "rgba(255,255,255,0.14)",
                  borderRadius: 8, cursor: "pointer",
                }}
              >
                <SlidersHorizontal size={14} /> الفلاتر
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .shop-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .shop-cats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        /* على ديسكتوب إخفاء زر الفلاتر */
        @media(min-width:769px){
          .shop-filter-btn { display: none !important; }
        }
        @media(max-width:480px){
          .shop-cats { gap: 6px; }
          .shop-cats button { padding: 7px 13px; font-size: 11px; }
        }
      `}</style>
    </>
  );
}

export default function ShopSidebar({ showFilters, clear, priceRange, setPriceRange, allSizes, selectedSize, setSelectedSize }: {
  showFilters: boolean;
  clear: () => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  allSizes: string[];
  selectedSize: string;
  setSelectedSize: (s: string) => void;
}) {
  return (
    <>
      <div className="sidebar-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ color: "#ffffff", fontSize: "1.05rem", margin: 0, fontFamily: "var(--font-cormorant,Georgia,serif)" }}>الفلاتر</h3>
          <button
            onClick={clear}
            style={{ fontSize: 12, fontWeight: 800, color: "#f59e0b", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.12em", padding: "4px 8px" }}
          >
            مسح الكل
          </button>
        </div>

        {/* Price range */}
        <div style={{ marginBottom: 26 }}>
          <h4 style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.42)", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 14, marginTop: 0 }}>
            نطاق السعر
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {([[0, 100], [100, 200], [200, 300], [300, 500]] as [number, number][]).map(([min, max]) => (
              <label key={`${min}-${max}`} style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }}>
                <input
                  type="radio" name="price"
                  checked={priceRange[0] === min && priceRange[1] === max}
                  onChange={() => setPriceRange([min, max])}
                  style={{ accentColor: "#f59e0b", width: 15, height: 15 }}
                />
                <span className="simple-numbers" style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.62)" }}>
                  {min} — {max === 500 ? "500+" : max} LE
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.42)", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 14, marginTop: 0 }}>
            المقاس
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {allSizes.map(size => {
              const displaySize = typeof size === 'string' ? size.trim() : String(size);
              return (
                <button
                  key={displaySize}
                  onClick={() => setSelectedSize(selectedSize === displaySize ? "" : displaySize)}
                  style={{
                    width: 46, height: 46,
                    fontSize: 12, fontWeight: 800,
                    border: "2px solid", borderRadius: 10, cursor: "pointer", transition: "all 0.22s",
                    background: selectedSize === displaySize ? "#f59e0b" : "rgba(255,255,255,0.07)",
                    color: selectedSize === displaySize ? "#0f172a" : "rgba(255,255,255,0.52)",
                    borderColor: selectedSize === displaySize ? "#f59e0b" : "rgba(255,255,255,0.14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                  title={displaySize}
                >
                  {displaySize}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .sidebar-inner {
          position: sticky;
          top: 100px;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 22px;
        }
        @media(max-width:768px){
          .sidebar-inner {
            position: static;
            border-radius: 10px;
            padding: 18px 16px;
          }
        }
      `}</style>
    </>
  );
}

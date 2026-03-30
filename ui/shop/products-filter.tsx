import { ProductCard } from "@/ui/components/ProductCard";
import { Package, Loader2 } from "lucide-react";

export default function ProductsFilter({ sorted, clear, loading = false }: {
  sorted: any[];
  clear: () => void;
  loading?: boolean;
}) {
  if (loading) return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"80px 20px" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
        <Loader2 size={32} style={{ color:"rgba(245,158,11,0.6)", animation:"spin 1s linear infinite" }} />
        <p style={{ color:"rgba(255,255,255,0.38)", fontSize:14 }}>جارٍ تحميل المنتجات...</p>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );

  return (
    <div style={{ flex:1, minWidth:0 }}>
      {sorted.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 20px" }}>
          <Package size={52} style={{ color:"rgba(255,255,255,0.1)", margin:"0 auto 14px", display:"block" }} strokeWidth={1} />
          <h3 style={{ color:"#ffffff", marginBottom:8 }}>لا توجد منتجات</h3>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.38)", marginBottom:22 }}>جربي تغيير الفلاتر</p>
          <button onClick={clear} style={{ padding:"11px 26px", background:"transparent", border:"2px solid #f59e0b", color:"#f59e0b", fontSize:12, fontWeight:700, borderRadius:50, cursor:"pointer" }}>
            مسح الفلاتر
          </button>
        </div>
      ) : (
        <>
          <div className="shop-grid">
            {sorted.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <style>{`
            .shop-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
            @media(max-width:1024px){ .shop-grid{ grid-template-columns:repeat(2,1fr); gap:18px; } }
            @media(max-width:480px){ .shop-grid{ grid-template-columns:repeat(2,1fr); gap:12px; } }
          `}</style>
        </>
      )}
    </div>
  );
}

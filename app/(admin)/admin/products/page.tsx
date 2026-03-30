"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Search, Loader2, RefreshCw } from "lucide-react";
import { productsApi, type Product } from "@/src/lib/api";
import { normalizeImageUrl } from "@/src/utils/image";

const catAr: Record<string,string> = { Women:"نساء", Men:"رجال", Kids:"أطفال", Accessories:"إكسسوارات" };

export default function AdminProducts() {
  const [products,   setProducts]  = useState<Product[]>([]);
  const [loading,    setLoading]   = useState(true);
  const [search,     setSearch]    = useState("");
  const [catFilter,  setCatFilter] = useState("all");

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params: Record<string,string> = { sort:"newest" };
    if (search) params.search = search;
    if (catFilter !== "all") params.category = catFilter;
    productsApi.list(params)
      .then(res => setProducts(Array.isArray(res)?res:(res as any).results??[]))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, [search, catFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`حذف "${name}"؟`)) return;
    try {
      await productsApi.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch { alert("فشل الحذف"); }
  };

  const stats = [
    { l:"الكل",   v:products.length,                              c:"#f59e0b" },
    { l:"متوفر",  v:products.filter(p=>p.in_stock).length,       c:"#34d399" },
    { l:"نفذ",    v:products.filter(p=>!p.in_stock).length,      c:"#f87171" },
    { l:"مميز",   v:products.filter(p=>p.featured).length,       c:"#c084fc" },
  ];

  return (
    <>
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:12 }}>
          <div>
            <p className="section-tag" style={{ marginBottom:8 }}>إدارة المنتجات</p>
            <h2 style={{ color:"#ffffff", margin:"0 0 4px", fontSize:"clamp(1.4rem,3vw,2rem)" }}>المنتجات</h2>
            <p style={{ color:"rgba(255,255,255,0.38)", fontSize:13, margin:0 }}>{products.length} منتج</p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={fetchProducts}
              style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 16px", background:"rgba(255,255,255,0.07)", border:"1.5px solid rgba(255,255,255,0.12)", borderRadius:50, color:"rgba(255,255,255,0.55)", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.color="#f59e0b";(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(245,158,11,0.3)"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.55)";(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,0.12)"}}>
              <RefreshCw size={13} strokeWidth={2}/> تحديث
            </button>
            <Link href="/admin/products/add" className="btn-admin">
              <Plus size={15} strokeWidth={2.5}/> إضافة منتج
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="products-stats-grid">
          {stats.map(s => (
            <div key={s.l} className="admin-card" style={{ textAlign:"center", padding:"16px 12px", cursor:"default" }}>
              <p style={{ fontSize:"1.6rem", fontWeight:800, color:s.c, margin:0, lineHeight:1 }}>{s.v}</p>
              <p style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.42)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"6px 0 0" }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="products-filter-row">
          <div style={{ position:"relative", flex:1, minWidth:180 }}>
            <Search size={14} style={{ position:"absolute", right:15, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.28)" }}/>
            <input type="text" placeholder="ابحث عن منتج..." value={search} onChange={e=>setSearch(e.target.value)}
              className="input-field" style={{ paddingRight:42, fontSize:13 }}/>
          </div>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            {["all","Women","Men","Kids","Accessories"].map(c => (
              <button key={c} onClick={()=>setCatFilter(c)}
                style={{ padding:"8px 14px", fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", border:"1.5px solid", borderRadius:50, cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap",
                  fontFamily:"var(--font-tajawal,sans-serif)",
                  background: catFilter===c?"#f59e0b":"transparent",
                  color:      catFilter===c?"#0f172a":"rgba(255,255,255,0.48)",
                  borderColor:catFilter===c?"#f59e0b":"rgba(255,255,255,0.14)" }}>
                {c==="all"?"الكل":catAr[c]??c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="admin-card" style={{ padding:0, overflow:"hidden" }}>
          {loading ? (
            <div style={{ padding:48, display:"flex", justifyContent:"center" }}>
              <Loader2 size={26} style={{ color:"rgba(245,158,11,0.6)", animation:"spin 1s linear infinite" }}/>
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:540 }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)" }}>
                    {["المنتج","التصنيف","السعر","الحالة","التسميات","الإجراءات"].map(h => (
                      <th key={h} style={{ padding:"12px 16px", textAlign:"right", fontSize:10, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id} className="admin-table-row" style={{ borderBottom:i<products.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
                      <td style={{ padding:"12px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <div style={{ position:"relative", width:42, height:52, borderRadius:8, overflow:"hidden", flexShrink:0, background:"rgba(255,255,255,0.07)" }}>
                            {p.image && <Image fill src={normalizeImageUrl(p.image)} alt={p.name} sizes="64px" style={{ objectFit:"cover" }}/>}
                          </div>
                          <div>
                            <p style={{ fontSize:13, fontWeight:700, color:"#ffffff", margin:0, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</p>
                            <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:"2px 0 0" }}>#{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"12px 16px", fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.55)" }}>
                        {catAr[p.category_name]??p.category_name}
                      </td>
                      <td style={{ padding:"12px 16px", fontSize:14, fontWeight:800, color:"#f59e0b" }}>
                        LE {parseFloat(p.price as any).toFixed(2)}
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", padding:"4px 11px", borderRadius:50,
                          background: p.in_stock?"rgba(52,211,153,0.12)":"rgba(248,113,113,0.12)",
                          color:      p.in_stock?"#34d399":"#f87171" }}>
                          {p.in_stock?"✓ متوفر":"✗ نفذ"}
                        </span>
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                          {p.featured && <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 9px", borderRadius:50, background:"rgba(245,158,11,0.14)", color:"#f59e0b" }}>مميز</span>}
                          {p.trending && <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 9px", borderRadius:50, background:"rgba(96,165,250,0.14)", color:"#60a5fa" }}>رائج</span>}
                        </div>
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        <div style={{ display:"flex", gap:7 }}>
                          <Link href={`/admin/products/edit/${p.id}`}
                            style={{ width:32, height:32, borderRadius:8, background:"rgba(245,158,11,0.1)", border:"1.5px solid rgba(245,158,11,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#f59e0b", textDecoration:"none", transition:"all 0.2s" }}
                            onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background="rgba(245,158,11,0.22)"}}
                            onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background="rgba(245,158,11,0.1)"}}>
                            <Edit size={13} strokeWidth={2}/>
                          </Link>
                          <button onClick={()=>handleDelete(p.id, p.name)}
                            style={{ width:32, height:32, borderRadius:8, background:"rgba(239,68,68,0.1)", border:"1.5px solid rgba(239,68,68,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#f87171", cursor:"pointer", transition:"all 0.2s" }}
                            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(239,68,68,0.22)"}}
                            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(239,68,68,0.1)"}}>
                            <Trash2 size={13} strokeWidth={2}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length===0 && !loading && (
                    <tr><td colSpan={6} style={{ padding:"48px 20px", textAlign:"center", color:"rgba(255,255,255,0.28)", fontSize:14 }}>لا توجد منتجات</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .products-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:18px; }
        .products-filter-row { display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; align-items:center; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:900px){ .products-stats-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:480px){ .products-filter-row { flex-direction:column; align-items:stretch; } }
      `}</style>
    </>
  );
}

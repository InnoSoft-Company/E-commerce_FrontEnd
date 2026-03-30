"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, Loader2, RefreshCw, Eye } from "lucide-react";
import { ordersApi, type Order } from "@/src/lib/api";
import Link from "next/link";

const STATUS_OPTIONS = ["processing","shipping","delivered","cancelled"] as const;
const statusLabel: Record<string,string> = { processing:"قيد المعالجة", shipping:"في الطريق", delivered:"تم التسليم", cancelled:"ملغي" };
const SC: Record<string,{bg:string;text:string}> = {
  delivered: { bg:"rgba(52,211,153,0.12)", text:"#34d399" },
  shipping:  { bg:"rgba(251,191,36,0.12)", text:"#fbbf24" },
  processing:{ bg:"rgba(96,165,250,0.12)", text:"#60a5fa" },
  cancelled: { bg:"rgba(248,113,113,0.12)",text:"#f87171" },
};

export default function AdminOrders() {
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [filterStatus, setFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<number|null>(null);
  const [updating,  setUpdating]  = useState<number|null>(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params: Record<string,string> = {};
    if (search) params.search = search;
    if (filterStatus !== "all") params.status = filterStatus;
    ordersApi.adminList(params)
      .then(res => setOrders(Array.isArray(res) ? res : (res as any).results ?? []))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, [search, filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id); setEditingId(null);
    try {
      const updated = await ordersApi.updateStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      // Signal dashboard to refresh stats
      localStorage.setItem("last_order_update", Date.now().toString());
      localStorage.setItem("orders_updated", "true");
    } catch { alert("فشل تحديث الحالة"); }
    finally  { setUpdating(null); }
  };

  const stats = [
    { label:"مكتملة",       val:orders.filter(o=>o.status==="delivered").length,  c:"#34d399" },
    { label:"في الطريق",    val:orders.filter(o=>o.status==="shipping").length,   c:"#fbbf24" },
    { label:"قيد المعالجة", val:orders.filter(o=>o.status==="processing").length, c:"#60a5fa" },
    { label:"ملغي",         val:orders.filter(o=>o.status==="cancelled").length,  c:"#f87171" },
  ];

  return (
    <>
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:12 }}>
          <div>
            <p className="section-tag" style={{ marginBottom:8 }}>الإدارة</p>
            <h2 style={{ color:"#ffffff", margin:"0 0 4px", fontSize:"clamp(1.4rem,3vw,2rem)" }}>الطلبات</h2>
            <p style={{ color:"rgba(255,255,255,0.38)", fontSize:13, margin:0 }}>{orders.length} طلب</p>
          </div>
          <button onClick={fetchOrders} style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 18px", background:"rgba(255,255,255,0.07)", border:"1.5px solid rgba(255,255,255,0.12)", borderRadius:50, color:"rgba(255,255,255,0.55)", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.color="#f59e0b";(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(245,158,11,0.3)"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.55)";(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,0.12)"}}>
            <RefreshCw size={13} strokeWidth={2}/> تحديث
          </button>
        </div>

        {/* Stats */}
        <div className="orders-admin-stats">
          {stats.map(s => (
            <div key={s.label} className="admin-card" style={{ textAlign:"center", padding:"16px 12px", cursor:"pointer" }}
              onClick={()=>setFilter(filterStatus===s.label.toLowerCase()?"all":Object.entries(statusLabel).find(([,v])=>v===s.label)?.[0]??"all")}>
              <p style={{ fontSize:"1.6rem", fontWeight:800, color:s.c, margin:0, lineHeight:1 }}>{s.val}</p>
              <p style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"6px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="orders-filter-row">
          <div style={{ position:"relative", flex:1, minWidth:180 }}>
            <Search size={14} style={{ position:"absolute", right:15, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.28)" }}/>
            <input type="text" placeholder="ابحث بالاسم أو رقم الهاتف..." value={search}
              onChange={e=>setSearch(e.target.value)}
              className="input-field" style={{ paddingRight:42, fontSize:13 }}/>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {["all", ...STATUS_OPTIONS].map(st => (
              <button key={st} onClick={()=>setFilter(st)}
                style={{ padding:"8px 14px", fontSize:11, fontWeight:700, letterSpacing:"0.08em", border:"1.5px solid", borderRadius:50, cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap",
                  fontFamily:"var(--font-tajawal,sans-serif)",
                  background:  filterStatus===st ? "#f59e0b" : "transparent",
                  color:       filterStatus===st ? "#0f172a" : "rgba(255,255,255,0.5)",
                  borderColor: filterStatus===st ? "#f59e0b" : "rgba(255,255,255,0.15)" }}>
                {st==="all"?"الكل":statusLabel[st]}
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
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)" }}>
                    {["رقم الطلب","العميل","التاريخ","القطع","الإجمالي","الحالة","التفاصيل","تعديل الحالة"].map(h => (
                      <th key={h} style={{ padding:"12px 16px", textAlign:"right", fontSize:10, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id} className="admin-table-row" style={{ borderBottom:i<orders.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
                      <td style={{ padding:"12px 16px", fontSize:13, fontWeight:700, color:"#f59e0b", whiteSpace:"nowrap" }}>
                        #{String(o.id).padStart(4,"0")}
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        <p style={{ fontSize:13, fontWeight:700, color:"#ffffff", margin:0 }}>{o.customer_name}</p>
                        <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:"2px 0 0" }}>{o.phone}</p>
                      </td>
                      <td style={{ padding:"12px 16px", fontSize:12, color:"rgba(255,255,255,0.4)", whiteSpace:"nowrap" }}>
                        {new Date(o.created_at).toLocaleDateString("ar-EG")}
                      </td>
                      <td style={{ padding:"12px 16px", fontSize:13, color:"rgba(255,255,255,0.6)", textAlign:"center" }}>
                        {o.items?.length ?? "–"}
                      </td>
                      <td style={{ padding:"12px 16px", fontSize:14, fontWeight:800, color:"#ffffff", whiteSpace:"nowrap" }}>
                        {parseFloat(o.total).toFixed(2)} LE
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", padding:"4px 11px", borderRadius:50, background:SC[o.status]?.bg, color:SC[o.status]?.text, whiteSpace:"nowrap" }}>
                          {o.status_display}
                        </span>
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        <Link href={`/admin/orders/${o.id}`}
                          style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, background:"rgba(59,130,246,0.12)", border:"1.5px solid rgba(59,130,246,0.2)", color:"#3b82f6", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s", fontFamily:"var(--font-tajawal,sans-serif)", textDecoration:"none" }}
                          onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background="rgba(59,130,246,0.18)";el.style.color="#2563eb"}}
                          onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background="rgba(59,130,246,0.12)";el.style.color="#3b82f6"}}>
                          <Eye size={12}/> تفاصيل
                        </Link>
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        {updating === o.id ? (
                          <Loader2 size={16} style={{ color:"#f59e0b", animation:"spin 1s linear infinite" }}/>
                        ) : (
                          <div style={{ position:"relative" }}>
                            <button onClick={()=>setEditingId(editingId===o.id?null:o.id)}
                              style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, background:"rgba(255,255,255,0.07)", border:"1.5px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.55)", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s", fontFamily:"var(--font-tajawal,sans-serif)" }}
                              onMouseEnter={e=>{const el=e.currentTarget as HTMLButtonElement;el.style.background="rgba(245,158,11,0.12)";el.style.color="#f59e0b"}}
                              onMouseLeave={e=>{const el=e.currentTarget as HTMLButtonElement;el.style.background="rgba(255,255,255,0.07)";el.style.color="rgba(255,255,255,0.55)"}}>
                              تغيير <ChevronDown size={12}/>
                            </button>
                            {editingId === o.id && (
                              <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:"#1e293b", border:"1.5px solid rgba(245,158,11,0.3)", borderRadius:10, overflow:"hidden", zIndex:50, minWidth:150, boxShadow:"0 12px 40px rgba(0,0,0,0.45)" }}>
                                {STATUS_OPTIONS.map(st => (
                                  <button key={st} onClick={()=>updateStatus(o.id, st)}
                                    style={{ display:"block", width:"100%", padding:"10px 14px", textAlign:"right", fontSize:12, fontWeight:600, color:o.status===st?"#f59e0b":"rgba(255,255,255,0.62)", background:o.status===st?"rgba(245,158,11,0.1)":"transparent", border:"none", cursor:"pointer", transition:"all 0.18s", fontFamily:"var(--font-tajawal,sans-serif)" }}
                                    onMouseEnter={e=>{if(o.status!==st)(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.06)"}}
                                    onMouseLeave={e=>{if(o.status!==st)(e.currentTarget as HTMLButtonElement).style.background="transparent"}}>
                                    {statusLabel[st]}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {orders.length===0 && !loading && (
                    <tr><td colSpan={7} style={{ padding:"48px 20px", textAlign:"center", color:"rgba(255,255,255,0.28)", fontSize:14 }}>لا توجد طلبات</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .orders-admin-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:18px; }
        .orders-filter-row  { display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; align-items:center; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:900px){ .orders-admin-stats { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:480px){ .orders-filter-row { flex-direction:column; align-items:stretch; } }
      `}</style>
    </>
  );
}

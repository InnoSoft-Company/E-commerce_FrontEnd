"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Truck, Clock, ShoppingBag, Eye, ChevronLeft, XCircle, Loader2 } from "lucide-react";
import { ordersApi, type Order } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

const statusConfig: Record<string, { color:string; bg:string; border:string; Icon:any }> = {
  delivered:  { color:"#34d399", bg:"rgba(52,211,153,0.1)",  border:"rgba(52,211,153,0.25)",  Icon:Check    },
  shipping:   { color:"#fbbf24", bg:"rgba(251,191,36,0.1)",  border:"rgba(251,191,36,0.25)",  Icon:Truck    },
  processing: { color:"#60a5fa", bg:"rgba(96,165,250,0.1)",  border:"rgba(96,165,250,0.25)",  Icon:Clock    },
  cancelled:  { color:"#f87171", bg:"rgba(248,113,113,0.1)", border:"rgba(248,113,113,0.25)", Icon:XCircle  },
};

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router  = useRouter();
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push("/login"); return; }
    ordersApi.myOrders()
      .then(data => setOrders(Array.isArray(data) ? data : (data as any).results ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading]);

  if (loading || authLoading) return (
    <div style={{ background:"#0f172a", minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Loader2 size={32} style={{ color:"rgba(245,158,11,0.6)", animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const stats = [
    { v: orders.filter(o=>o.status==="delivered").length,  l:"مكتملة",     c:"#34d399" },
    { v: orders.filter(o=>o.status==="shipping").length,   l:"في الطريق",  c:"#fbbf24" },
    { v: orders.filter(o=>o.status==="processing").length, l:"معلقة",      c:"#60a5fa" },
  ];

  return (
    <>
      <div style={{ background:"#0f172a", minHeight:"calc(100vh - 112px)", paddingBottom:60 }}>
        {/* Header */}
        <div style={{ background:"#1e293b", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth:860, margin:"0 auto", padding:"36px 24px 28px" }}>
            <p className="section-tag" style={{ marginBottom:10 }}>حسابي</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12 }}>
              <div>
                <h1 style={{ color:"#ffffff", margin:"0 0 4px", fontSize:"clamp(1.7rem,4vw,2.6rem)", fontWeight:700 }}>طلباتي</h1>
                <p style={{ fontSize:14, color:"rgba(255,255,255,0.42)", margin:0 }}>{orders.length} طلبات</p>
              </div>
              <div className="orders-stats">
                {stats.map(s => (
                  <div key={s.l} style={{ textAlign:"center", padding:"10px 16px", background:"rgba(255,255,255,0.05)", borderRadius:10 }}>
                    <p style={{ fontSize:"1.3rem", fontWeight:800, color:s.c, margin:0, lineHeight:1 }}>{s.v}</p>
                    <p style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.35)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"4px 0 0" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div style={{ maxWidth:860, margin:"0 auto", padding:"26px 24px", display:"flex", flexDirection:"column", gap:12 }}>
          {orders.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px" }}>
              <ShoppingBag size={48} style={{ color:"rgba(255,255,255,0.1)", margin:"0 auto 14px", display:"block" }} strokeWidth={1} />
              <h3 style={{ color:"rgba(255,255,255,0.5)", fontWeight:500, marginBottom:20 }}>لا توجد طلبات بعد</h3>
              <Link href="/shop" className="btn-gold" style={{ fontSize:12 }}>تسوقي الآن</Link>
            </div>
          ) : (
            orders.map(order => {
              const s = statusConfig[order.status] ?? statusConfig.processing;
              const date = new Date(order.created_at).toLocaleDateString("ar-EG", { year:"numeric", month:"long", day:"numeric" });
              return (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:38, height:38, borderRadius:10, background:s.bg, border:`1.5px solid ${s.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <s.Icon size={16} style={{ color:s.color }} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p style={{ fontSize:14, fontWeight:800, color:"#f59e0b", margin:0 }}>#{String(order.id).padStart(4,"0")}</p>
                        <p style={{ fontSize:12, color:"rgba(255,255,255,0.38)", margin:0 }}>{date}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                      <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", padding:"4px 12px", borderRadius:50, background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
                        {order.status_display}
                      </span>
                      <p style={{ fontSize:16, fontWeight:800, color:"#ffffff", margin:0 }}>${parseFloat(order.total).toFixed(2)}</p>
                      <ChevronLeft size={15} style={{ color:"rgba(255,255,255,0.22)" }} />
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"12px 16px", display:"flex", flexDirection:"column", gap:7 }}>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                          <div style={{ width:6, height:6, borderRadius:"50%", background:"#f59e0b", flexShrink:0 }} />
                          <span style={{ fontSize:13, color:"rgba(255,255,255,0.68)", fontWeight:500 }}>{item.name}</span>
                          <span style={{ fontSize:11, color:"rgba(255,255,255,0.26)", background:"rgba(255,255,255,0.05)", padding:"2px 8px", borderRadius:4 }}>
                            {item.size} · {item.color}
                          </span>
                        </div>
                        <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.5)", flexShrink:0 }}>${parseFloat(item.price as any).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"9px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.26)" }}>{order.items?.length} {order.items?.length===1?"منتج":"منتجات"}</span>
                    <button style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, color:"#f59e0b", background:"none", border:"none", cursor:"pointer" }}>
                      <Eye size={13}/> تفاصيل الطلب
                    </button>
                  </div>
                </div>
              );
            })
          )}
          <div style={{ textAlign:"center", paddingTop:10 }}>
            <Link href="/shop" style={{ display:"inline-flex", alignItems:"center", gap:7, fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.35)", textDecoration:"none", letterSpacing:"0.12em", textTransform:"uppercase", padding:"10px 22px", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:50, transition:"all 0.22s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.color="#f59e0b";(e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(245,158,11,0.3)"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.35)";(e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,255,255,0.1)"}}>
              <ShoppingBag size={13}/> تسوقي الآن
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .orders-stats { display:flex; gap:8px; }
        .order-card { background:#1e293b; border:1.5px solid rgba(255,255,255,0.07); border-radius:14px; overflow:hidden; transition:border-color 0.25s,box-shadow 0.25s; }
        .order-card:hover { border-color:rgba(245,158,11,0.22); box-shadow:0 6px 28px rgba(15,23,42,0.28); }
        .order-card-header { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; flex-wrap:wrap; gap:10px; }
        @media(max-width:560px){ .orders-stats { display:none; } }
      `}</style>
    </>
  );
}

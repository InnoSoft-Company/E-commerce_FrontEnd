"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, ArrowRight, Plus, Tag, Ticket, Loader2, Truck } from "lucide-react";
import { ordersApi, type DashboardStats, type Order } from "@/src/lib/api";

const SC: Record<string,{bg:string;text:string}> = {
  delivered:  { bg:"rgba(52,211,153,0.12)",  text:"#34d399" },
  shipping:   { bg:"rgba(251,191,36,0.12)",  text:"#fbbf24" },
  processing: { bg:"rgba(96,165,250,0.12)",  text:"#60a5fa" },
  cancelled:  { bg:"rgba(248,113,113,0.12)", text:"#f87171" },
};
const statusLabel: Record<string,string> = { delivered:"تم التسليم", shipping:"في الطريق", processing:"قيد المعالجة", cancelled:"ملغي" };

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<DashboardStats|null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    ordersApi.dashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
    
    // Set up listener for order status changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "orders_updated" && e.newValue) {
        fetchStats();
        localStorage.removeItem("orders_updated");
      }
    };
    
    // Also listen for visibility change to refresh when tab comes back into focus
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const lastUpdate = localStorage.getItem("last_order_update");
        if (lastUpdate && Date.now() - parseInt(lastUpdate) < 5000) {
          fetchStats();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const statCards = stats ? [
    { label:"الإيرادات",  value:`${parseFloat(stats.total_revenue).toLocaleString()} LE`, change:"+12.5%", icon:DollarSign, color:"#f59e0b",  bg:"rgba(245,158,11,0.12)"  },
    { label:"الطلبات",    value:stats.total_orders.toLocaleString(),                    change:"+8.2%",  icon:ShoppingBag,color:"#60a5fa",  bg:"rgba(96,165,250,0.12)"  },
    { label:"المنتجات",   value:stats.total_products.toLocaleString(),                  change:"+3.1%",  icon:Package,    color:"#34d399",  bg:"rgba(52,211,153,0.12)"  },
    { label:"العملاء",    value:stats.total_users.toLocaleString(),                     change:"+15.3%", icon:Users,      color:"#c084fc",  bg:"rgba(192,132,252,0.12)" },
  ] : [];

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300 }}>
      <Loader2 size={28} style={{ color:"rgba(245,158,11,0.6)", animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <div>
        <div style={{ marginBottom:22 }}>
          <p className="section-tag" style={{ marginBottom:8 }}>نظرة عامة</p>
          <h2 style={{ color:"#ffffff", margin:"0 0 4px", fontSize:"clamp(1.4rem,3vw,2rem)" }}>لوحة التحكم</h2>
          <p style={{ color:"rgba(255,255,255,0.38)", fontSize:13, margin:0 }}>آخر تحديث: الآن</p>
        </div>

        {/* Stats */}
        <div className="admin-stats-grid">
          {statCards.map(s => (
            <div key={s.label} className="admin-card" style={{ cursor:"default", padding:"20px 22px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <s.icon size={18} style={{ color:s.color }} strokeWidth={2}/>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:"#34d399", display:"flex", alignItems:"center", gap:3 }}>
                  <TrendingUp size={11} strokeWidth={2.5}/> {s.change}
                </span>
              </div>
              <p style={{ fontSize:"1.7rem", fontWeight:800, color:"#ffffff", lineHeight:1, margin:"0 0 5px" }}>{s.value}</p>
              <p style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em", textTransform:"uppercase", margin:0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="admin-main-grid">
          {/* Recent orders */}
          <div className="admin-card" style={{ padding:"20px 0", overflow:"hidden" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, padding:"0 20px" }}>
              <h3 style={{ color:"#ffffff", fontSize:"1.1rem", fontWeight:700, margin:0 }}>الطلبات الأخيرة</h3>
              <Link href="/admin/orders" style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, color:"#f59e0b", textDecoration:"none", letterSpacing:"0.1em", textTransform:"uppercase" }}>
                عرض الكل <ArrowRight size={12}/>
              </Link>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:400 }}>
                <tbody>
                  {(stats?.recent_orders ?? []).map((o, i) => (
                    <tr key={o.id} className="admin-table-row" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding:"12px 20px", fontSize:13, fontWeight:700, color:"#f59e0b", whiteSpace:"nowrap" }}>#{String(o.id).padStart(4,"0")}</td>
                      <td style={{ padding:"12px 14px", fontSize:13, fontWeight:600, color:"#ffffff" }}>{o.customer_name}</td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:"rgba(255,255,255,0.38)", whiteSpace:"nowrap" }}>
                        {new Date(o.created_at).toLocaleDateString("ar-EG")}
                      </td>
                      <td style={{ padding:"12px 14px", fontSize:14, fontWeight:800, color:"#ffffff", whiteSpace:"nowrap" }}>${parseFloat(o.total).toFixed(2)}</td>
                      <td style={{ padding:"12px 20px", textAlign:"left" }}>
                        <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", padding:"3px 10px", borderRadius:50, background:SC[o.status]?.bg, color:SC[o.status]?.text, whiteSpace:"nowrap" }}>
                          {statusLabel[o.status] ?? o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick actions */}
          <div className="admin-card" style={{ padding:"20px" }}>
            <h3 style={{ color:"#ffffff", fontSize:"1.1rem", fontWeight:700, marginBottom:16, marginTop:0 }}>إجراءات سريعة</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { href:"/admin/products/add", l:"إضافة منتج جديد", icon:Plus },
                { href:"/admin/orders",       l:"إدارة الطلبات",   icon:ShoppingBag, badge: (stats?.by_status?.processing ?? 0) + (stats?.by_status?.shipping ?? 0) },
                { href:"/admin/shipping-zones", l:"إدارة الشحن",   icon:Truck },
                { href:"/admin/categories",   l:"التصنيفات",       icon:Tag },
                { href:"/admin/coupons",      l:"الكوبونات",       icon:Ticket },
              ].map(a => (
                <Link key={a.href} href={a.href}
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 14px", borderRadius:10, border:"1.5px solid rgba(255,255,255,0.07)", fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.55)", textDecoration:"none", transition:"all 0.2s", position:"relative" }}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background="rgba(245,158,11,0.08)";el.style.borderColor="rgba(245,158,11,0.25)";el.style.color="#fcd34d"}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background="transparent";el.style.borderColor="rgba(255,255,255,0.07)";el.style.color="rgba(255,255,255,0.55)"}}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, position:"relative" }}>
                    <a.icon size={15} strokeWidth={2}/>
                    {(a.badge ?? 0) > 0 && (
                      <span style={{ position:"absolute", top:"-3px", right:"-8px", background:"#ef4444", color:"#fff", borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", fontWeight:"800", animation:"pulse 2s infinite" }}>
                        {(a.badge ?? 0) > 99 ? "99+" : (a.badge ?? 0)}
                      </span>
                    )}
                    {a.l}
                  </div>
                  <ArrowRight size={13}/>
                </Link>
              ))}
            </div>
            {stats && (
              <div style={{ marginTop:18, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.07)", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { v:stats.by_status.delivered, l:"مكتمل" },
                  { v:stats.by_status.processing+stats.by_status.shipping, l:"معلق" },
                ].map(s => (
                  <div key={s.l} style={{ textAlign:"center", padding:"12px 8px", background:"rgba(255,255,255,0.04)", borderRadius:10 }}>
                    <p style={{ fontSize:"1.4rem", fontWeight:800, color:"#f59e0b", margin:0, lineHeight:1 }}>{s.v}</p>
                    <p style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", margin:"5px 0 0" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .admin-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px; }
        .admin-main-grid  { display:grid; grid-template-columns:2fr 1fr; gap:16px; }
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse  { 0%{opacity:1} 50%{opacity:0.7} 100%{opacity:1} }
        @media(max-width:1100px){ .admin-stats-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:900px) { .admin-main-grid  { grid-template-columns:1fr; } }
        @media(max-width:520px) { .admin-stats-grid { gap:10px; } }
      `}</style>
    </>
  );
}

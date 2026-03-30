"use client";
import { useState, useEffect } from "react";
import { Search, Mail, Loader2 } from "lucide-react";
import { adminApi, type AdminUser } from "@/src/lib/api";

const avatarColors = ["#f59e0b","#60a5fa","#34d399","#f87171","#c084fc"];

export default function AdminUsers() {
  const [users,   setUsers]   = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    adminApi.users(search)
      .then(setUsers)
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, [search]);

  const total_spent = users.reduce((a,u) => a + parseFloat(u.total_spent||"0"), 0);
  const total_orders= users.reduce((a,u) => a + (u.order_count||0), 0);

  return (
    <>
      <div>
        <div style={{ marginBottom:22 }}>
          <p className="section-tag" style={{ marginBottom:8 }}>إدارة</p>
          <h2 style={{ color:"#ffffff", margin:"0 0 4px", fontSize:"clamp(1.4rem,3vw,2rem)" }}>العملاء</h2>
          <p style={{ color:"rgba(255,255,255,0.38)", fontSize:13, margin:0 }}>{users.length} عميل مسجل</p>
        </div>

        <div className="admin-stats-grid3">
          {[
            { label:"إجمالي العملاء", value:users.length },
            { label:"إجمالي الطلبات", value:total_orders },
            { label:"إجمالي الإنفاق", value:"$"+total_spent.toFixed(0) },
          ].map(s => (
            <div key={s.label} className="admin-card" style={{ textAlign:"center", padding:18, cursor:"default" }}>
              <p style={{ fontSize:"1.7rem", fontWeight:800, color:"#f59e0b", margin:0, lineHeight:1 }}>{s.value}</p>
              <p style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.42)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"7px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ position:"relative", marginBottom:16 }}>
          <Search size={15} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)" }}/>
          <input type="text" placeholder="ابحث بالاسم أو البريد..." value={search} onChange={e=>setSearch(e.target.value)}
            className="input-field" style={{ paddingRight:44, fontSize:13 }}/>
        </div>

        <div className="admin-card" style={{ padding:0, overflow:"hidden" }}>
          {loading ? (
            <div style={{ padding:40, display:"flex", justifyContent:"center" }}>
              <Loader2 size={24} style={{ color:"rgba(245,158,11,0.6)", animation:"spin 1s linear infinite" }}/>
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:520 }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)" }}>
                    {["العميل","البريد الإلكتروني","الطلبات","إجمالي الإنفاق","عضو منذ",""].map(h => (
                      <th key={h} style={{ padding:"12px 16px", textAlign:"right", fontSize:10, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.38)", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} className="admin-table-row" style={{ borderBottom:i<users.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
                      <td style={{ padding:"13px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:"50%", background:avatarColors[i%5], display:"flex", alignItems:"center", justifyContent:"center", color:"#0f172a", fontSize:13, fontWeight:800, flexShrink:0 }}>
                            {(u.first_name||u.username||"?")[0].toUpperCase()}
                          </div>
                          <span style={{ fontSize:13, fontWeight:700, color:"#ffffff" }}>{u.first_name?`${u.first_name} ${u.last_name}`:u.username}</span>
                        </div>
                      </td>
                      <td style={{ padding:"13px 16px", fontSize:12, color:"rgba(255,255,255,0.45)" }}>{u.email}</td>
                      <td style={{ padding:"13px 16px", fontSize:14, fontWeight:700, color:"#fbbf24", textAlign:"center" }}>{u.order_count}</td>
                      <td style={{ padding:"13px 16px", fontSize:14, fontWeight:800, color:"#ffffff" }}>${parseFloat(u.total_spent||"0").toFixed(2)}</td>
                      <td style={{ padding:"13px 16px", fontSize:12, color:"rgba(255,255,255,0.42)" }}>{u.date_joined}</td>
                      <td style={{ padding:"13px 16px" }}>
                        <a href={`mailto:${u.email}`}
                          style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:50, background:"rgba(245,158,11,0.1)", border:"1.5px solid rgba(245,158,11,0.2)", color:"#f59e0b", fontSize:11, fontWeight:700, textDecoration:"none", transition:"all 0.2s" }}
                          onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background="rgba(245,158,11,0.22)"}}
                          onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background="rgba(245,158,11,0.1)"}}>
                          <Mail size={12} strokeWidth={2}/> تواصل
                        </a>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6} style={{ padding:"40px 20px", textAlign:"center", color:"rgba(255,255,255,0.35)", fontSize:14 }}>لا يوجد عملاء</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-stats-grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:18px; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:700px){ .admin-stats-grid3 { grid-template-columns:1fr 1fr; } }
      `}</style>
    </>
  );
}

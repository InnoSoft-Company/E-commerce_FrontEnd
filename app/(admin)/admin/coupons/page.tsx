"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Ticket, Copy, Check, Loader2 } from "lucide-react";
import { couponsApi, type Coupon } from "@/src/lib/api";

export default function AdminCoupons() {
  const [coupons,  setCoupons]  = useState<Coupon[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showAdd,  setShowAdd]  = useState(false);
  const [copied,   setCopied]   = useState<number|null>(null);
  const [saving,   setSaving]   = useState(false);
  const [form, setForm] = useState({ code:"", discount:"", discount_type:"percent", max_uses:"100", expiry:"" });

  useEffect(() => {
    couponsApi.list()
      .then(data => setCoupons(Array.isArray(data)?data:(data as any).results??[]))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  const copyCode = (id:number, code:string) => {
    navigator.clipboard.writeText(code).catch(()=>{});
    setCopied(id); setTimeout(()=>setCopied(null), 1800);
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      const updated = await couponsApi.update(coupon.id, { active: !coupon.active });
      setCoupons(prev => prev.map(c => c.id===coupon.id ? updated : c));
    } catch {}
  };

  const deleteCoupon = async (id:number) => {
    if (!confirm("حذف هذا الكوبون؟")) return;
    try { await couponsApi.delete(id); setCoupons(prev=>prev.filter(c=>c.id!==id)); } catch {}
  };

  const addCoupon = async () => {
    if (!form.code||!form.discount) return;
    setSaving(true);
    try {
      const c = await couponsApi.create({
        code: form.code.toUpperCase(),
        discount: form.discount as any,
        discount_type: form.discount_type as "percent"|"fixed",
        max_uses: Number(form.max_uses)||100,
        active: true,
        expiry: form.expiry || null,
      });
      setCoupons(prev=>[c,...prev]);
      setForm({ code:"", discount:"", discount_type:"percent", max_uses:"100", expiry:"" });
      setShowAdd(false);
    } catch { alert("حدث خطأ عند الإضافة"); }
    finally { setSaving(false); }
  };

  const L = ({c}:{c:string}) => (
    <label style={{ display:"block", fontSize:10, fontWeight:800, letterSpacing:"0.22em", textTransform:"uppercase" as const, color:"rgba(255,255,255,0.42)", marginBottom:8 }}>{c}</label>
  );

  return (
    <>
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:12 }}>
          <div>
            <p className="section-tag" style={{ marginBottom:8 }}>إدارة</p>
            <h2 style={{ color:"#ffffff", margin:"0 0 4px", fontSize:"clamp(1.4rem,3vw,2rem)" }}>الكوبونات</h2>
            <p style={{ color:"rgba(255,255,255,0.38)", fontSize:13, margin:0 }}>{coupons.length} كوبون</p>
          </div>
          <button onClick={()=>setShowAdd(!showAdd)} className="btn-admin"><Plus size={15} strokeWidth={2.5}/> كوبون جديد</button>
        </div>

        {showAdd && (
          <div className="admin-card animate-fade-in" style={{ marginBottom:18 }}>
            <h3 style={{ color:"#ffffff", fontSize:"1.05rem", fontWeight:700, marginBottom:16, marginTop:0 }}>إضافة كوبون جديد</h3>
            <div className="coupons-form-grid">
              <div><L c="كود الكوبون"/><input type="text" placeholder="مثال: BLANKO20" value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} className="input-field" style={{fontSize:13}}/></div>
              <div><L c="قيمة الخصم"/><input type="number" placeholder="20" value={form.discount} onChange={e=>setForm({...form,discount:e.target.value})} className="input-field" style={{fontSize:13}}/></div>
              <div><L c="نوع الخصم"/>
                <select value={form.discount_type} onChange={e=>setForm({...form,discount_type:e.target.value})} className="input-field" style={{fontSize:13}}>
                  <option value="percent">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت ($)</option>
                </select>
              </div>
              <div><L c="الحد الأقصى"/><input type="number" placeholder="100" value={form.max_uses} onChange={e=>setForm({...form,max_uses:e.target.value})} className="input-field" style={{fontSize:13}}/></div>
              <div><L c="تاريخ الانتهاء"/><input type="date" value={form.expiry} onChange={e=>setForm({...form,expiry:e.target.value})} className="input-field" style={{fontSize:13}}/></div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:16, flexWrap:"wrap" }}>
              <button onClick={addCoupon} disabled={saving} className="btn-admin">
                {saving?<><Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/> جارٍ الحفظ...</>:"حفظ الكوبون"}
              </button>
              <button onClick={()=>setShowAdd(false)} className="btn-admin-ghost">إلغاء</button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", padding:60 }}>
            <Loader2 size={28} style={{ color:"rgba(245,158,11,0.6)", animation:"spin 1s linear infinite" }}/>
          </div>
        ) : (
          <div className="coupons-grid">
            {coupons.map(c => (
              <div key={c.id} className="admin-card" style={{ padding:"18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:c.active?"rgba(245,158,11,0.15)":"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Ticket size={14} style={{ color:c.active?"#f59e0b":"rgba(255,255,255,0.3)" }} strokeWidth={2}/>
                    </div>
                    <div>
                      <p style={{ fontSize:14, fontWeight:800, color:c.active?"#f59e0b":"rgba(255,255,255,0.3)", margin:0, letterSpacing:"0.06em" }}>{c.code}</p>
                      <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", margin:0 }}>{c.discount_type==="percent"?`خصم ${c.discount}%`:`خصم $${c.discount}`}</p>
                    </div>
                  </div>
                  <button onClick={()=>toggleActive(c)} style={{ width:40, height:22, borderRadius:50, border:"none", cursor:"pointer", position:"relative", transition:"background 0.3s", background:c.active?"#f59e0b":"rgba(255,255,255,0.15)", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:3, width:16, height:16, borderRadius:"50%", background:"#ffffff", transition:"all 0.3s", right:c.active?"4px":"auto", left:c.active?"auto":"4px" }}/>
                  </button>
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.38)" }}>الاستخدام</span>
                    <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.55)" }}>{c.uses} / {c.max_uses}</span>
                  </div>
                  <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:"100%", background:c.uses/c.max_uses>0.8?"#f87171":"#f59e0b", borderRadius:2, width:`${Math.min((c.uses/c.max_uses)*100,100)}%`, transition:"width 0.5s" }}/>
                  </div>
                </div>
                {c.expiry && <p style={{ fontSize:11, color:"rgba(255,255,255,0.25)", marginBottom:12 }}>ينتهي: {new Date(c.expiry).toLocaleDateString("ar-EG")}</p>}
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>copyCode(c.id, c.code)}
                    style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"7px 0", borderRadius:8, background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.52)", fontSize:11, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(245,158,11,0.08)";(e.currentTarget as HTMLButtonElement).style.color="#f59e0b"}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.05)";(e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.52)"}}>
                    {copied===c.id?<><Check size={12}/> تم النسخ</>:<><Copy size={12}/> نسخ</>}
                  </button>
                  <button onClick={()=>deleteCoupon(c.id)}
                    style={{ width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:8, background:"rgba(239,68,68,0.08)", border:"1.5px solid rgba(239,68,68,0.18)", color:"#f87171", cursor:"pointer", transition:"all 0.2s" }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(239,68,68,0.18)"}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(239,68,68,0.08)"}}>
                    <Trash2 size={13} strokeWidth={2}/>
                  </button>
                </div>
              </div>
            ))}
            {coupons.length===0 && (
              <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"40px 20px", color:"rgba(255,255,255,0.3)", fontSize:14 }}>
                لا توجد كوبونات بعد
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .coupons-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .coupons-form-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px 18px; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:900px){ .coupons-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:600px){ .coupons-form-grid { grid-template-columns:1fr 1fr; } }
        @media(max-width:480px){ .coupons-grid { grid-template-columns:1fr; } .coupons-form-grid { grid-template-columns:1fr; } }
      `}</style>
    </>
  );
}

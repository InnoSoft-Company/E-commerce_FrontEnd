"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Tag, Loader2, Check } from "lucide-react";
import { categoriesApi, type Category } from "@/src/lib/api";

const catIcons: Record<string,string> = { Women:"👗", Men:"👔", Kids:"🧒", Accessories:"👜" };
const catColors = ["#f59e0b","#60a5fa","#34d399","#c084fc"];

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showAdd,    setShowAdd]    = useState(false);
  const [editingId,  setEditingId]  = useState<number|null>(null);
  const [newCat,     setNewCat]     = useState({ name:"", name_ar:"", slug:"" });
  const [editName,   setEditName]   = useState("");
  const [saving,     setSaving]     = useState(false);

  useEffect(() => {
    categoriesApi.list()
      .then(data => setCategories(Array.isArray(data)?data:(data as any).results??[]))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  const addCategory = async () => {
    if (!newCat.name) return;
    setSaving(true);
    try {
      const slug = newCat.slug || newCat.name.toLowerCase().replace(/\s+/g,"-");
      const c = await categoriesApi.create({ name:newCat.name, name_ar:newCat.name_ar, slug });
      setCategories(prev=>[...prev, c]);
      setNewCat({ name:"", name_ar:"", slug:"" });
      setShowAdd(false);
    } catch (err:any) {
      alert(Object.values(err?.data??{}).flat().join(" ")||"حدث خطأ");
    } finally { setSaving(false); }
  };

  const saveEdit = async (id:number) => {
    setSaving(true);
    try {
      const updated = await categoriesApi.update(id, { name:editName });
      setCategories(prev=>prev.map(c=>c.id===id?{...c,name:updated.name}:c));
      setEditingId(null);
    } catch { alert("حدث خطأ"); }
    finally { setSaving(false); }
  };

  const deleteCategory = async (id:number, name:string) => {
    if (!confirm(`حذف تصنيف "${name}"؟`)) return;
    try {
      await categoriesApi.delete(id);
      setCategories(prev=>prev.filter(c=>c.id!==id));
    } catch { alert("لا يمكن حذف التصنيف — قد يحتوي على منتجات"); }
  };

  return (
    <>
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:12 }}>
          <div>
            <p className="section-tag" style={{ marginBottom:8 }}>إدارة</p>
            <h2 style={{ color:"#ffffff", margin:"0 0 4px", fontSize:"clamp(1.4rem,3vw,2rem)" }}>التصنيفات</h2>
            <p style={{ color:"rgba(255,255,255,0.38)", fontSize:13, margin:0 }}>{categories.length} تصنيف</p>
          </div>
          <button onClick={()=>setShowAdd(!showAdd)} className="btn-admin">
            <Plus size={15} strokeWidth={2.5}/> إضافة تصنيف
          </button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="admin-card animate-fade-in" style={{ marginBottom:18 }}>
            <h3 style={{ color:"#ffffff", fontSize:"1.05rem", fontWeight:700, marginBottom:16, marginTop:0 }}>تصنيف جديد</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:16 }}>
              {[
                { k:"name", l:"الاسم بالإنجليزية", p:"Women" },
                { k:"name_ar", l:"الاسم بالعربية", p:"نساء" },
                { k:"slug", l:"الـ Slug (اختياري)", p:"women" },
              ].map(f => (
                <div key={f.k}>
                  <label style={{ display:"block", fontSize:10, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase" as const, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>{f.l}</label>
                  <input type="text" placeholder={f.p} value={newCat[f.k as keyof typeof newCat]}
                    onChange={e=>setNewCat({...newCat,[f.k]:e.target.value})}
                    className="input-field" style={{fontSize:13}}/>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button onClick={addCategory} disabled={saving} className="btn-admin">
                {saving?<><Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/> جارٍ الإضافة...</>:"حفظ التصنيف"}
              </button>
              <button onClick={()=>setShowAdd(false)} className="btn-admin-ghost">إلغاء</button>
            </div>
          </div>
        )}

        {/* Categories grid */}
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", padding:60 }}>
            <Loader2 size={26} style={{ color:"rgba(245,158,11,0.6)", animation:"spin 1s linear infinite" }}/>
          </div>
        ) : (
          <div className="cats-admin-grid">
            {categories.map((cat, i) => (
              <div key={cat.id} className="admin-card" style={{ cursor:"default" }}>
                <div style={{ width:48, height:48, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:16,
                  background:`rgba(${i===0?"245,158,11":i===1?"96,165,250":i===2?"52,211,153":"192,132,252"},0.14)` }}>
                  {catIcons[cat.name] ?? <Tag size={20} style={{ color:catColors[i%4] }}/>}
                </div>

                {editingId === cat.id ? (
                  <div style={{ marginBottom:12 }}>
                    <input type="text" value={editName} onChange={e=>setEditName(e.target.value)}
                      className="input-field" style={{fontSize:13, marginBottom:8}}
                      onKeyDown={e=>e.key==="Enter"&&saveEdit(cat.id)}/>
                    <div style={{ display:"flex", gap:7 }}>
                      <button onClick={()=>saveEdit(cat.id)} disabled={saving} className="btn-admin" style={{padding:"7px 14px", fontSize:12}}>
                        {saving?<Loader2 size={12} style={{animation:"spin 1s linear infinite"}}/>:<Check size={12}/>} حفظ
                      </button>
                      <button onClick={()=>setEditingId(null)} className="btn-admin-ghost" style={{padding:"7px 14px", fontSize:12}}>إلغاء</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 style={{ color:"#ffffff", fontSize:"1.2rem", fontWeight:700, margin:"0 0 3px" }}>{cat.name_ar||cat.name}</h3>
                    <p style={{ fontSize:14, color:catColors[i%4], fontWeight:700, margin:"0 0 4px" }}>{cat.name}</p>
                    <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", margin:"0 0 16px" }}>{cat.count} منتج</p>
                    <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:2, marginBottom:18, overflow:"hidden" }}>
                      <div style={{ height:"100%", background:catColors[i%4], borderRadius:2, width:`${Math.min((cat.count/20)*100,100)}%`, transition:"width 0.5s" }}/>
                    </div>
                  </>
                )}

                {editingId !== cat.id && (
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>{ setEditingId(cat.id); setEditName(cat.name); }}
                      style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"8px 12px", borderRadius:50, background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.55)", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
                      onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(245,158,11,0.12)";(e.currentTarget as HTMLButtonElement).style.color="#f59e0b"}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.06)";(e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.55)"}}>
                      <Edit size={12}/> تعديل
                    </button>
                    <button onClick={()=>deleteCategory(cat.id, cat.name)}
                      style={{ width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:50, background:"rgba(239,68,68,0.08)", border:"1.5px solid rgba(239,68,68,0.18)", color:"#f87171", cursor:"pointer", transition:"all 0.2s" }}
                      onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(239,68,68,0.2)"}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(239,68,68,0.08)"}}>
                      <Trash2 size={13} strokeWidth={2}/>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .cats-admin-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:1000px){ .cats-admin-grid { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:700px) { .cats-admin-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:400px) { .cats-admin-grid { grid-template-columns:1fr; } }
      `}</style>
    </>
  );
}

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save, Loader2, AlertCircle, X, Image as ImageIcon } from "lucide-react";
import { productsApi } from "@/src/lib/api";

const catOptions = [
  { value:"Women", label:"نساء" }, { value:"Men", label:"رجال" },
  { value:"Kids", label:"أطفال" }, { value:"Accessories", label:"إكسسوارات" },
];

export default function AdminAddProduct() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");
  const [form, setForm] = useState({
    name:"", price:"", category:"Women", image: null as File | null,
    description:"", sizes:[] as string[], colors:[] as string[],
    images: [] as File[],
    in_stock:true, featured:false, trending:false,
  });
  
  const [previews, setPreviews] = useState({
    image: null as string | null,
    images: [] as string[],
  });

  const toggle = (key:"sizes"|"colors", val:string) =>
    setForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(v=>v!==val) : [...f[key], val] }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({...form, image: file});
      const reader = new FileReader();
      reader.onload = (e) => setPreviews({...previews, image: e.target?.result as string});
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setForm({...form, images: [...form.images, ...files]});
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(p => ({...p, images: [...p.images, e.target?.result as string]}));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (idx: number) => {
    setForm({...form, images: form.images.filter((_, i) => i !== idx)});
    setPreviews({...previews, images: previews.images.filter((_, i) => i !== idx)});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { setError("اسم المنتج والسعر مطلوبان"); return; }
    if (!form.image) { setError("الصورة الرئيسية مطلوبة"); return; }
    if (form.sizes.length === 0)   { setError("اختر مقاساً واحداً على الأقل"); return; }
    if (form.colors.length === 0)  { setError("اختر لوناً واحداً على الأقل");  return; }
    setSaving(true); setError("");
    try {
      // تنظيف البيانات: تأكد أن sizes و colors هي arrays من strings نقية
      const safeSizes = form.sizes.filter(s => typeof s === "string" && s.length > 0);
      const safeColors = form.colors.filter(c => typeof c === "string" && c.length > 0);
      
      await productsApi.create({
        name:        form.name.trim(),
        price:       String(parseFloat(form.price)),
        category:    form.category.trim(),
        image:       form.image,
        images:      form.images,
        description: form.description.trim(),
        sizes:       safeSizes,
        colors:      safeColors,
        in_stock:    form.in_stock,
        featured:    form.featured,
        trending:    form.trending,
      });
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Product creation error:", err?.data || err);
      const msg = Object.values(err?.data ?? {}).flat().join(" ") || "حدث خطأ عند الإضافة";
      setError(String(msg));
    } finally { setSaving(false); }
  };

  const L = ({ c }: { c: string }) => (
    <label style={{ display:"block", fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase" as const, color:"rgba(255,255,255,0.42)", marginBottom:10 }}>{c}</label>
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
        <Link href="/admin/products"
          style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.42)", textDecoration:"none", transition:"color 0.2s" }}
          onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.color="#f59e0b"}}
          onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.42)"}}>
          ← المنتجات
        </Link>
        <span style={{ color:"rgba(255,255,255,0.18)" }}>|</span>
        <p className="section-tag" style={{ margin:0 }}>إضافة منتج جديد</p>
      </div>
      <h2 style={{ color:"#ffffff", margin:"0 0 24px", fontSize:"clamp(1.4rem,3vw,2rem)" }}>منتج جديد</h2>

      {error && (
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, marginBottom:20 }}>
          <AlertCircle size={15} style={{ color:"#f87171", flexShrink:0 }}/>
          <p style={{ fontSize:13, color:"#f87171", margin:0 }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="add-product-grid">
          {/* Main info */}
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div className="admin-card">
              <h3 style={{ color:"#ffffff", fontSize:"1.1rem", fontWeight:700, margin:"0 0 20px" }}>المعلومات الأساسية</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                <div>
                  <L c="اسم المنتج"/>
                  <input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                    placeholder="اكتب اسم المنتج" className="input-field" style={{fontSize:13}}/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <L c="السعر (ج.م)"/>
                    <input type="number" required step="0.01" min="0" value={form.price}
                      onChange={e=>setForm({...form,price:e.target.value})} placeholder="0.00" className="input-field" style={{fontSize:13}}/>
                  </div>
                  <div>
                    <L c="التصنيف"/>
                    <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                      className="input-field" style={{fontSize:13}}>
                      {catOptions.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Primary Image Upload */}
                <div>
                  <L c="الصورة الرئيسية"/>
                  <div style={{ position:"relative", marginBottom:12 }}>
                    <input type="file" accept="image/*" onChange={handleImageChange}
                      style={{ display:"none" }} id="img-input" name="primary-image"/>
                    <label htmlFor="img-input"
                      style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"20px", border:"2px dashed rgba(255,255,255,0.2)",
                        borderRadius:10, cursor:"pointer", transition:"all 0.2s", background:"rgba(255,255,255,0.05)",
                        fontSize:13, color:"rgba(255,255,255,0.6)" }}>
                      <ImageIcon size={18}/>
                      اختر صورة من الجهاز
                    </label>
                  </div>
                  {previews.image && (
                    <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", width:"100%", height:120, borderRadius:10, overflow:"hidden", background:"rgba(0,0,0,0.3)" }}>
                      <img src={previews.image} alt="preview" style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain" }}/>
                    </div>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <L c="صور إضافية (معرض)"/>
                  <div style={{ position:"relative", marginBottom:12 }}>
                    <input type="file" accept="image/*" multiple onChange={handleGalleryChange}
                      style={{ display:"none" }} id="gallery-input" name="gallery-images"/>
                    <label htmlFor="gallery-input"
                      style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"20px", border:"2px dashed rgba(255,255,255,0.2)",
                        borderRadius:10, cursor:"pointer", transition:"all 0.2s", background:"rgba(255,255,255,0.05)",
                        fontSize:13, color:"rgba(255,255,255,0.6)" }}>
                      <ImageIcon size={18}/>
                      أضف صوراً من الجهاز (عديدة)
                    </label>
                  </div>
                  {previews.images.length > 0 && (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(80px, 1fr))", gap:10 }}>
                      {previews.images.map((preview, idx) => (
                        <div key={idx} style={{ position:"relative", width:"100%", paddingBottom:"100%", borderRadius:8, overflow:"hidden", background:"rgba(0,0,0,0.3)" }}>
                          <img src={preview} alt={`gallery-${idx}`}
                            style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover" }}/>
                          <button type="button" onClick={()=>removeGalleryImage(idx)}
                            style={{ position:"absolute", top:4, right:4, width:20, height:20, borderRadius:"50%", background:"rgba(255,0,0,0.8)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:12 }}>
                            <X size={14}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <L c="الوصف"/>
                  <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                    rows={4} placeholder="وصف المنتج..." className="input-field" style={{resize:"none",fontSize:13}}/>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h3 style={{ color:"#ffffff", fontSize:"1.1rem", fontWeight:700, margin:"0 0 20px" }}>المتغيرات</h3>
              <div style={{ marginBottom:20 }}>
                <L c="المقاسات"/>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {["XS","S","M","L","XL","XXL","2Y","4Y","6Y","8Y","Free"].map(s => (
                    <button type="button" key={s} onClick={()=>toggle("sizes",s)}
                      style={{ padding:"8px 14px", fontSize:12, fontWeight:700, borderRadius:9, cursor:"pointer", transition:"all 0.22s",
                        background:  form.sizes.includes(s)?"#f59e0b":"rgba(255,255,255,0.07)",
                        color:       form.sizes.includes(s)?"#0f172a":"rgba(255,255,255,0.5)",
                        border:`1.5px solid ${form.sizes.includes(s)?"#f59e0b":"rgba(255,255,255,0.12)"}` }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <L c="الألوان"/>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {["Black","White","Navy","Beige","Pink","Blue","Gray","Brown","Green","Red"].map(c => (
                    <button type="button" key={c} onClick={()=>toggle("colors",c)}
                      style={{ padding:"8px 14px", fontSize:12, fontWeight:700, borderRadius:50, cursor:"pointer", transition:"all 0.22s",
                        background:  form.colors.includes(c)?"#f59e0b":"rgba(255,255,255,0.07)",
                        color:       form.colors.includes(c)?"#0f172a":"rgba(255,255,255,0.5)",
                        border:`1.5px solid ${form.colors.includes(c)?"#f59e0b":"rgba(255,255,255,0.12)"}` }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div className="admin-card">
              <h3 style={{ color:"#ffffff", fontSize:"1.1rem", fontWeight:700, margin:"0 0 20px" }}>حالة المنتج</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[
                  { k:"in_stock",  l:"متوفر في المخزون",   desc:"يظهر للشراء" },
                  { k:"featured",  l:"منتج مميز",           desc:"يظهر في القسم المميز" },
                  { k:"trending",  l:"رائج",                desc:"يظهر في قسم الرائج" },
                ].map(f => (
                  <div key={f.k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:"#ffffff", margin:0 }}>{f.l}</p>
                      <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:"2px 0 0" }}>{f.desc}</p>
                    </div>
                    <button type="button" onClick={()=>setForm({...form,[f.k]:!form[f.k as keyof typeof form]})}
                      style={{ width:44, height:24, borderRadius:50, border:"none", cursor:"pointer", position:"relative", transition:"background 0.3s", flexShrink:0,
                        background: form[f.k as keyof typeof form] ? "#f59e0b" : "rgba(255,255,255,0.15)" }}>
                      <div style={{ position:"absolute", top:3, width:18, height:18, borderRadius:"50%", background:"#ffffff", transition:"all 0.3s",
                        right: form[f.k as keyof typeof form] ? "4px" : "auto",
                        left:  form[f.k as keyof typeof form] ? "auto" : "4px" }}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-admin"
              style={{ width:"100%", justifyContent:"center", fontSize:13, padding:"14px 24px" }}>
              {saving ? <><Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/> جارٍ الحفظ...</> : <><Save size={15} strokeWidth={2}/> حفظ المنتج</>}
            </button>
            <Link href="/admin/products" className="btn-admin-ghost" style={{ textAlign:"center", justifyContent:"center", display:"flex" }}>
              إلغاء
            </Link>
          </div>
        </div>
      </form>

      <style>{`
        .add-product-grid { display:grid; grid-template-columns:2fr 1fr; gap:20px; align-items:flex-start; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:900px){ .add-product-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}

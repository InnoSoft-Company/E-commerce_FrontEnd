"use client";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Save, Loader2, AlertCircle, Package } from "lucide-react";
import { productsApi, type Product } from "@/src/lib/api";

interface ApiError {
  data?: Record<string, string[] | string>;
  status?: number;
}

const catOptions = [
  { value: 1, label: "نساء" }, { value: 2, label: "رجال" },
  { value: 3, label: "أطفال" }, { value: 4, label: "إكسسوارات" },
];

export default function AdminEditProduct() {
  const { id }  = useParams<{id:string}>();
  const router  = useRouter();
  const [product,  setProduct]  = useState<Product|null>(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [saved,    setSaved]    = useState(false);
  const [form, setForm] = useState({
    name:"", price:"", category: 1, image: undefined as File | string | undefined,
    description:"", sizes:[] as string[], colors:[] as string[],
    in_stock:true, featured:false, trending:false,
  });
  const [previews, setPreviews] = useState({
    image: null as string | null,
  });

  useEffect(() => {
    productsApi.get(Number(id))
      .then(p => {
        // تنظيف البيانات: تحويل sizes و colors إلى arrays حقيقية من strings
        const cleanArray = (arr: unknown): string[] => {
          if (!Array.isArray(arr)) return [];
          
          const result: string[] = [];
          
          const flatten = (item: unknown) => {
            if (typeof item === "string") {
              // إذا كانت JSON string، حولها لقيمة حقيقية
              if (item.startsWith("[")) {
                try {
                  const parsed = JSON.parse(item);
                  if (Array.isArray(parsed)) {
                    parsed.forEach(flatten);
                    return;
                  }
                } catch {}
              }
              // أضف القيمة النقية
              if (item.trim().length > 0) result.push(item);
            } else if (Array.isArray(item)) {
              item.forEach(flatten);
            }
          };
          
          arr.forEach(flatten);
          return result;
        };

        setProduct(p);
        setForm({
          name: p.name, price: String(parseFloat(String(p.price))),
          category: typeof p.category === 'number' ? p.category : 1,
          image: p.image, description: p.description,
          sizes: cleanArray(p.sizes),
          colors: cleanArray(p.colors),
          in_stock: p.in_stock, featured: p.featured, trending: p.trending,
        });
        // Set preview for current image
        setPreviews({
          image: p.image
        });
      })
      .catch(()=>setError("لم يتم العثور على المنتج"))
      .finally(()=>setLoading(false));
  }, [id]);

  const toggle = (key:"sizes"|"colors", val:string) =>
    setForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(v=>v!==val) : [...f[key], val] }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({...form, image: file});
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews({...previews, image: event.target?.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      // تأكد أن المقاسات والألوان Array من strings فقط
      const safeSizes = Array.isArray(form.sizes) ? form.sizes.filter(s => typeof s === "string") : [];
      const safeColors = Array.isArray(form.colors) ? form.colors.filter(c => typeof c === "string") : [];
      
      const payload = {
        name: form.name.trim(), 
        price: String(parseFloat(form.price)),
        category: form.category,
        image: form.image || undefined,
        description: form.description.trim(),
        sizes: safeSizes,
        colors: safeColors,
        in_stock: form.in_stock, 
        featured: form.featured, 
        trending: form.trending,
      };
      
      console.log("Submitting product update:", payload);
      
      await productsApi.update(Number(id), payload);
      setSaved(true); setTimeout(()=>{ setSaved(false); router.push("/admin/products"); }, 1200);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error("Product update error:", apiError?.data || apiError);
      const errorMsg = apiError?.data?.non_field_errors?.[0] as string || 
                       Object.values(apiError?.data||{})
                         .flat()
                         .filter(e => typeof e === 'string')
                         .join(" ") || 
                       "حدث خطأ في الحفظ";
      setError(errorMsg);
    } finally { setSaving(false); }
  };

  const L = ({c}:{c:string}) => (
    <label style={{ display:"block", fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase" as const, color:"rgba(255,255,255,0.42)", marginBottom:10 }}>{c}</label>
  );

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", padding:60 }}>
      <Loader2 size={26} style={{ color:"rgba(245,158,11,0.6)", animation:"spin 1s linear infinite" }}/>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!product) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 0", textAlign:"center" }}>
      <Package size={52} style={{ color:"rgba(255,255,255,0.1)", marginBottom:18 }} strokeWidth={1}/>
      <h3 style={{ color:"#ffffff", marginBottom:16 }}>المنتج غير موجود</h3>
      <Link href="/admin/products" className="btn-admin">العودة</Link>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
        <Link href="/admin/products" style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.42)", textDecoration:"none" }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>)=>{(e.currentTarget as HTMLAnchorElement).style.color="#f59e0b"}}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>)=>{(e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.42)"}}>
          ← المنتجات
        </Link>
        <span style={{ color:"rgba(255,255,255,0.18)" }}>|</span>
        <p className="section-tag" style={{margin:0}}>تعديل المنتج</p>
      </div>
      <h2 style={{ color:"#ffffff", margin:"0 0 22px", fontSize:"clamp(1.4rem,3vw,2rem)" }}>تعديل: {product.name}</h2>

      {error && (
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, marginBottom:18 }}>
          <AlertCircle size={14} style={{ color:"#f87171", flexShrink:0 }}/>
          <p style={{ fontSize:13, color:"#f87171", margin:0 }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="edit-product-grid">
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div className="admin-card">
              <h3 style={{ color:"#ffffff", fontSize:"1.1rem", fontWeight:700, margin:"0 0 20px" }}>المعلومات الأساسية</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div><L c="اسم المنتج"/><input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" style={{fontSize:13}}/></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div><L c="السعر ($)"/><input type="number" step="0.01" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="input-field" style={{fontSize:13}}/></div>
                  <div><L c="التصنيف"/>
                    <select value={String(form.category)} onChange={e=>setForm({...form,category:parseInt(e.target.value, 10)})} className="input-field" style={{fontSize:13}}>
                      {catOptions.map(c=><option key={c.value} value={String(c.value)}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <L c="الصورة الرئيسية"/>
                  <div style={{ display:"flex", gap:16, flexWrap:"wrap", alignItems:"flex-start" }}>
                    <div style={{ flex:1, minWidth:150 }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        id="image-upload"
                        style={{display:"none"}}
                      />
                      <label htmlFor="image-upload" style={{
                        display:"block", padding:"12px 16px", borderRadius:9, 
                        background:"rgba(245,158,11,0.1)", border:"1.5px dashed #f59e0b",
                        color:"#f59e0b", textAlign:"center", cursor:"pointer", fontWeight:600, fontSize:13,
                        transition:"all 0.2s"
                      }} onMouseEnter={(e: React.MouseEvent<HTMLLabelElement>)=>{e.currentTarget.style.background="rgba(245,158,11,0.15)"}}
                         onMouseLeave={(e: React.MouseEvent<HTMLLabelElement>)=>{e.currentTarget.style.background="rgba(245,158,11,0.1)"}}> 
                        📁 اختر صورة جديدة
                      </label>
                    </div>
                    {previews.image && (
                      <div style={{ width:120, height:120, borderRadius:9, overflow:"hidden", border:"1px solid rgba(255,255,255,0.1)" }}>
                        <Image 
                          src={previews.image} 
                          alt="معاينة الصورة"
                          width={120}
                          height={120}
                          style={{width:"100%", height:"100%", objectFit:"cover"}}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div><L c="الوصف"/><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} className="input-field" style={{resize:"none",fontSize:13}}/></div>
              </div>
            </div>
            <div className="admin-card">
              <h3 style={{ color:"#ffffff", fontSize:"1.1rem", fontWeight:700, margin:"0 0 18px" }}>المتغيرات</h3>
              <div style={{ marginBottom:18 }}>
                <L c="المقاسات"/>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                  {["XS","S","M","L","XL","XXL","2Y","4Y","6Y","8Y","Free"].map(s => (
                    <button type="button" key={s} onClick={()=>toggle("sizes",s)}
                      style={{ padding:"7px 13px", fontSize:12, fontWeight:700, borderRadius:9, cursor:"pointer", transition:"all 0.2s",
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
                <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                  {["Black","White","Navy","Beige","Pink","Blue","Gray","Brown","Green","Red"].map(c => (
                    <button type="button" key={c} onClick={()=>toggle("colors",c)}
                      style={{ padding:"7px 13px", fontSize:12, fontWeight:700, borderRadius:50, cursor:"pointer", transition:"all 0.2s",
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
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div className="admin-card">
              <h3 style={{ color:"#ffffff", fontSize:"1.1rem", fontWeight:700, margin:"0 0 18px" }}>حالة المنتج</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[
                  { k:"in_stock", l:"متوفر في المخزون", desc:"يظهر للشراء" },
                  { k:"featured", l:"منتج مميز",         desc:"يظهر في القسم المميز" },
                  { k:"trending", l:"رائج",              desc:"يظهر في قسم الرائج" },
                ].map(f => (
                  <div key={f.k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:"#ffffff", margin:0 }}>{f.l}</p>
                      <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:"2px 0 0" }}>{f.desc}</p>
                    </div>
                    <button type="button" onClick={()=>setForm({...form,[f.k]:!form[f.k as keyof typeof form]})}
                      style={{ width:44, height:24, borderRadius:50, border:"none", cursor:"pointer", position:"relative", transition:"background 0.3s", flexShrink:0,
                        background:form[f.k as keyof typeof form]?"#f59e0b":"rgba(255,255,255,0.15)" }}>
                      <div style={{ position:"absolute", top:3, width:18, height:18, borderRadius:"50%", background:"#ffffff", transition:"all 0.3s",
                        right:form[f.k as keyof typeof form]?"4px":"auto", left:form[f.k as keyof typeof form]?"auto":"4px" }}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-admin" style={{ width:"100%", justifyContent:"center", fontSize:13, padding:"14px 24px" }}>
              {saving ? <><Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/> جارٍ الحفظ...</> :
               saved  ? "✓ تم الحفظ!" :
               <><Save size={14}/> حفظ التغييرات</>}
            </button>
            <Link href="/admin/products" className="btn-admin-ghost" style={{ textAlign:"center", justifyContent:"center", display:"flex" }}>إلغاء</Link>
          </div>
        </div>
      </form>

      <style>{`
        .edit-product-grid { display:grid; grid-template-columns:2fr 1fr; gap:20px; align-items:flex-start; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:900px){ .edit-product-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}

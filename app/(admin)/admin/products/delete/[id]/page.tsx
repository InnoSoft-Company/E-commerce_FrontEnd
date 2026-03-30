"use client";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Trash2, AlertTriangle, Package, Loader2 } from "lucide-react";
import { productsApi, type Product } from "@/src/lib/api";
import { normalizeImageUrl } from "@/src/utils/image";

export default function AdminDeleteProduct() {
  const { id }  = useParams<{id:string}>();
  const router  = useRouter();
  const [product,  setProduct]  = useState<Product|null>(null);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    productsApi.get(Number(id))
      .then(setProduct)
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productsApi.delete(Number(id));
      router.push("/admin/products");
    } catch { alert("فشل الحذف"); setDeleting(false); }
  };

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
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
        <Link href="/admin/products" style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.42)", textDecoration:"none" }}
          onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.color="#f59e0b"}}
          onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.42)"}}>
          ← المنتجات
        </Link>
        <span style={{ color:"rgba(255,255,255,0.18)" }}>|</span>
        <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:"#f87171" }}>حذف منتج</span>
      </div>

      <div style={{ maxWidth:520, margin:"0 auto" }}>
        {/* Warning card */}
        <div style={{ background:"rgba(239,68,68,0.07)", border:"1.5px solid rgba(239,68,68,0.22)", borderRadius:16, overflow:"hidden" }}>
          <div style={{ padding:"24px 28px", borderBottom:"1px solid rgba(239,68,68,0.15)", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"rgba(239,68,68,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <AlertTriangle size={20} style={{ color:"#f87171" }} strokeWidth={2}/>
            </div>
            <div>
              <h2 style={{ color:"#ffffff", fontSize:"1.15rem", fontWeight:700, margin:"0 0 3px" }}>تأكيد الحذف</h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", margin:0 }}>هذا الإجراء لا يمكن التراجع عنه</p>
            </div>
          </div>

          {/* Product preview */}
          <div style={{ padding:"20px 28px", display:"flex", gap:16, alignItems:"center" }}>
            <div style={{ position:"relative", width:72, height:90, borderRadius:10, overflow:"hidden", flexShrink:0, background:"rgba(255,255,255,0.07)" }}>
              {product.image && <Image fill src={normalizeImageUrl(product.image)} alt={product.name} sizes="64px" style={{ objectFit:"cover" }}/>}
            </div>
            <div>
              <p style={{ fontSize:16, fontWeight:700, color:"#ffffff", margin:"0 0 5px" }}>{product.name}</p>
              <p style={{ fontSize:14, fontWeight:700, color:"#f59e0b", margin:"0 0 5px" }}>
                ${parseFloat(product.price as any).toFixed(2)}
              </p>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.38)", margin:0 }}>{product.category_name}</p>
            </div>
          </div>

          <div style={{ padding:"18px 28px", background:"rgba(0,0,0,0.15)", borderTop:"1px solid rgba(239,68,68,0.12)" }}>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:"0 0 18px", lineHeight:1.7 }}>
              سيتم حذف هذا المنتج نهائيًا من قاعدة البيانات. لن تتمكن من استرجاعه لاحقًا.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <Link href="/admin/products" className="btn-admin-ghost" style={{ flex:1, justifyContent:"center" }}>
                إلغاء
              </Link>
              <button onClick={handleDelete} disabled={deleting}
                style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"13px 20px", background:"#ef4444", border:"none", borderRadius:50, color:"#ffffff", fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.2s", opacity:deleting?0.7:1, fontFamily:"var(--font-tajawal,sans-serif)" }}
                onMouseEnter={e=>{if(!deleting)(e.currentTarget as HTMLButtonElement).style.background="#dc2626"}}
                onMouseLeave={e=>{if(!deleting)(e.currentTarget as HTMLButtonElement).style.background="#ef4444"}}>
                {deleting ? <><Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/> جارٍ الحذف...</> : <><Trash2 size={14} strokeWidth={2}/> تأكيد الحذف</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Package, RotateCcw, Shield } from "lucide-react";
import { productsApi, type Product as ApiProduct } from "@/src/lib/api";
import { products as staticProducts } from "@/src/data/products";
import { useCart } from "@/src/context/CartContext";
import { useWishlist } from "@/src/context/WishlistContext";
import { ProductCard } from "@/ui/components/ProductCard";
import Images from "@/ui/product/images";
import Info from "@/ui/product/info";
import QuantityAdd from "@/ui/product/quantity-add";
import { useAuth } from "@/src/context/AuthContext";

const colorHex: Record<string,string> = {
  // الألوان الأساسية
  White:"#ffffff", Black:"#000000", Gray:"#808080", Beige:"#f5f5dc",
  
  // الأحمر والوردي
  Red:"#ff0000", Pink:"#ff69b4", Coral:"#ff7f50", Salmon:"#fa8072",
  Crimson:"#dc143c", Magenta:"#ff00ff",
  
  // الأزرق
  Blue:"#0066ff", Navy:"#2c5aa0", Indigo:"#4b0082", Cyan:"#00ffff",
  LightBlue:"#add8e6", SkyBlue:"#87ceeb", RoyalBlue:"#4169e1",
  
  // الأخضر
  Green:"#228b22", LimeGreen:"#32cd32", SeaGreen:"#2e8b57",
  DarkGreen:"#006400", OliveGreen:"#556b2f", Mint:"#98ff98",
  
  // الأصفر والبرتقالي
  Yellow:"#ffff00", Gold:"#ffd700", Orange:"#ff8c00",
  DarkOrange:"#ff6347", Olive:"#808000",
  
  // البني
  Brown:"#8b4513", Tan:"#d2b48c", Camel:"#c19a6b",
  Chocolate:"#7b3f00", Maroon:"#800000",
  
  // الأرجواني
  Purple:"#800080", Plum:"#dda0dd", Orchid:"#da70d6",
  Lavender:"#e6e6fa", Violet:"#ee82ee",
  
  // الألوان الحيادية
  Cream:"#fffdd0", Ivory:"#fffff0", Khaki:"#f0e68c",
  Linen:"#faf0e6", WhiteSmoke:"#f5f5f5",
};

function toLocal(p: ApiProduct) {
  return { ...p, price: parseFloat(p.price as any), inStock: p.in_stock };
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?next=" + encodeURIComponent(`/product/${id}`));
    }
  }, [authLoading, isAuthenticated, id, router]);

  const [product, setProduct]     = useState<any>(fixProduct(staticProducts.find(p => p.id === Number(id))));
  const [related,  setRelated]    = useState<any[]>([]);
  const [loading,  setLoading]    = useState(true);
  const [selectedSize,  setSelectedSize]  = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [imgIdx, setImgIdx]       = useState(0);
  const [qty,    setQty]          = useState(1);
  const [added,  setAdded]        = useState(false);

  // معالجة القيم الغير طبيعية في الألوان والمقاسات
  function fixArray(arr: any): string[] {
    if (!arr) return [];
    if (typeof arr === 'string') {
      // Handle string representations of arrays
      if (arr.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(arr);
          if (Array.isArray(parsed)) return parsed.filter(item => typeof item === 'string' && item.trim());
        } catch {}
      }
      // Handle comma-separated strings
      if (arr.includes(',')) {
        return arr.split(',').map(item => item.trim()).filter(item => item);
      }
      // Handle single string
      return [arr.trim()];
    }
    if (Array.isArray(arr)) {
      return arr.flatMap((item) => {
        if (typeof item === "string" && item.trim().startsWith("[")) {
          try {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed)) return parsed.filter(i => typeof i === 'string' && i.trim());
          } catch {}
        }
        return typeof item === 'string' ? [item.trim()] : [];
      }).filter(item => item);
    }
    return [];
  }
  function fixProduct(p: any) {
    if (!p) return p;
    const fixed = {
      ...p,
      sizes: fixArray(p.sizes),
      colors: fixArray(p.colors),
    };
    console.log("Product data:", p);
    console.log("Fixed sizes:", fixed.sizes);
    console.log("Fixed colors:", fixed.colors);
    return fixed;
  }

  useEffect(() => {
    productsApi.get(Number(id))
      .then(p => {
        const local = fixProduct(toLocal(p));
        setProduct(local);
        setSelectedColor(local.colors?.[0] ?? "");
        // related
        return productsApi.list({ category: p.category_name, sort:"newest" });
      })
      .then(res => {
        const items = (res.results ?? res as any).map(toLocal).map(fixProduct).filter((p: any) => p.id !== Number(id)).slice(0,4);
        setRelated(items);
      })
      .catch(() => {
        // fallback to static
        const p = staticProducts.find(p => p.id === Number(id));
        if (p) { const fixed = fixProduct(p); setProduct(fixed); setSelectedColor(fixed.colors[0]); }
        setRelated(staticProducts.filter(p => p.id !== Number(id)).map(fixProduct).slice(0,4));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading && !product) return (
    <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#ffffff" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:40, height:40, border:"3px solid #f59e0b", borderTop:"3px solid transparent", borderRadius:"50%", margin:"0 auto 16px", animation:"spin 1s linear infinite" }} />
        <p style={{ color:"#64748b", fontSize:14 }}>جارٍ تحميل المنتج...</p>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight:"60vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px", background:"#ffffff" }}>
      <Package size={60} style={{ color:"#e2e8f0", marginBottom:20 }} strokeWidth={1} />
      <h1 style={{ fontSize:"2rem", fontWeight:800, color:"#0f172a", marginBottom:12 }}>المنتج غير موجود</h1>
      <Link href="/shop" className="btn-ghost" style={{ fontSize:13 }}>العودة إلى المتجر</Link>
    </div>
  );

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) { alert("الرجاء اختيار المقاس واللون"); return; }
    await addToCart(product.id, product.name, product.price, product.image, selectedSize, selectedColor, qty);
    setAdded(true); setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = async () => {
    if (!selectedSize || !selectedColor) { alert("الرجاء اختيار المقاس واللون"); return; }
    await addToCart(product.id, product.name, product.price, product.image, selectedSize, selectedColor, qty);
    router.push("/checkout");
  };

  return (
    <div style={{ background:"#ffffff", minHeight:"100vh" }}>
      {/* Breadcrumb */}
      <div style={{ background:"#f8fafc", borderBottom:"1px solid #f1f5f9", padding:"13px 0" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
          {[{href:"/",l:"الرئيسية"},{href:"/shop",l:"المتجر"},{href:`/shop?category=${product.category_name??product.category}`,l:product.category_name??product.category},{href:"#",l:product.name}]
            .map((b,i,arr) => (
              <span key={b.href} style={{ display:"flex", alignItems:"center", gap:7 }}>
                {i < arr.length-1 ? (
                  <><Link href={b.href} style={{ fontSize:13, fontWeight:600, color:"#64748b", textDecoration:"none" }}>{b.l}</Link>
                  <span style={{ color:"#cbd5e1", fontSize:12 }}>/</span></>
                ) : (
                  <span style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>{b.l}</span>
                )}
              </span>
            ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"40px 24px" }}>
        <div className="product-detail-grid">
          {/* Images */}
          <Images product={product} imgIdx={imgIdx} setImgIdx={setImgIdx} />

          {/* Info */}
          <div>
            <Info product={product} />

            {/* Sizes */}
            <div style={{ marginBottom:22 }}>
              <p style={{ fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase", color:"#64748b", marginBottom:12 }}>
                المقاس — <span style={{ color:"#d97706" }}>{selectedSize || "اختر مقاسًا"}</span>
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {(product.sizes ?? []).map((s: string) => (
                  <button key={s} onClick={() => setSelectedSize(selectedSize===s?"":s)}
                    style={{ width:48, height:48, fontSize:13, fontWeight:700, border:"2px solid", borderRadius:10, cursor:"pointer", transition:"all 0.2s",
                      background:  selectedSize===s ? "#0f172a" : "#ffffff",
                      color:       selectedSize===s ? "#ffffff" : "#0f172a",
                      borderColor: selectedSize===s ? "#0f172a" : "#e2e8f0",
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div style={{ marginBottom:26 }}>
              <p style={{ fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase", color:"#64748b", marginBottom:12 }}>
                اللون — <span style={{ color:"#d97706" }}>{selectedColor || "اختر لونًا"}</span>
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                {(product.colors ?? []).map((c: string) => (
                  <button key={c} onClick={() => setSelectedColor(c)} title={c}
                    style={{ width:32, height:32, borderRadius:"50%", border:"3px solid", cursor:"pointer", transition:"all 0.2s",
                      background:  colorHex[c] ?? "#f59e0b",
                      borderColor: selectedColor===c ? "#0f172a" : "#e2e8f0",
                      outline:     selectedColor===c ? "3px solid rgba(15,23,42,0.2)" : "none",
                      transform:   selectedColor===c ? "scale(1.15)" : "scale(1)",
                    }} />
                ))}
              </div>
            </div>

            <QuantityAdd
              qty={qty} setQty={setQty}
              handleAddToCart={handleAddToCart} handleBuyNow={handleBuyNow}
              product={product as any} inWishlist={inWishlist}
              addToWishlist={addToWishlist} removeFromWishlist={removeFromWishlist}
              added={added}
            />

            {/* Guarantees */}
            <div style={{ marginTop:28, display:"flex", flexDirection:"column", gap:10, padding:"20px", background:"#f8fafc", borderRadius:12, border:"1px solid #f1f5f9" }}>
              {[
                { Icon:RotateCcw, l:"إرجاع مجاني خلال 30 يومًا" },
                { Icon:Shield,    l:"ضمان جودة المنتج" },
              ].map(({ Icon, l }) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <Icon size={15} style={{ color:"#d97706", flexShrink:0 }} strokeWidth={2} />
                  <span style={{ fontSize:13, color:"#64748b", fontWeight:500 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ background:"#f8fafc", padding:"60px 0" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
            <p className="section-tag" style={{ marginBottom:10, color:"#d97706" }}>قد يعجبك أيضًا</p>
            <h2 style={{ color:"#0f172a", margin:"0 0 36px", fontSize:"clamp(1.5rem,3vw,2.2rem)" }}>منتجات مشابهة</h2>
            <div className="products-grid-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .product-detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:flex-start; }
        .products-grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
        @media(max-width:900px){ .product-detail-grid { grid-template-columns:1fr; gap:32px; } }
        @media(max-width:1024px){ .products-grid-4 { grid-template-columns:repeat(3,1fr); gap:18px; } }
        @media(max-width:700px) { .products-grid-4 { grid-template-columns:repeat(2,1fr); gap:14px; } }
      `}</style>
    </div>
  );
}

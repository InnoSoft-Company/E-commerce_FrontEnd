"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, X, ArrowRight, Loader2 } from "lucide-react";
import { useWishlist } from "@/src/context/WishlistContext";
import { useCart } from "@/src/context/CartContext";
import { normalizeImageUrl } from "@/src/utils/image";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  if (loading) return (
    <div style={{ background:"#f8fafc", minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Loader2 size={28} style={{ color:"rgba(245,158,11,0.6)", animation:"spin 1s linear infinite" }}/>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <div style={{ background:"#f8fafc", minHeight:"100vh" }}>
        {/* Header */}
        <div style={{ background:"#ffffff", borderBottom:"1px solid #f1f5f9", padding:"32px 0" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
            <p className="section-tag" style={{ marginBottom:8, color:"#d97706" }}>العناصر المحفوظة</p>
            <h1 style={{ fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700, color:"#0f172a", margin:"0 0 4px" }}>
              قائمتي المفضلة
            </h1>
            <p style={{ fontSize:14, color:"#64748b", margin:0 }}>
              {wishlist.length} {wishlist.length===1?"عنصر":"عناصر"} محفوظة
            </p>
          </div>
        </div>

        <div style={{ maxWidth:1280, margin:"0 auto", padding:"36px 24px" }}>
          {wishlist.length === 0 ? (
            /* Empty state */
            <div style={{ textAlign:"center", padding:"60px 20px" }}>
              <div style={{ width:72, height:72, border:"1.5px solid #e2e8f0", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 22px", background:"#ffffff" }}>
                <Heart style={{ color:"#94a3b8" }} strokeWidth={1.5} size={28}/>
              </div>
              <h2 style={{ fontSize:"1.6rem", fontWeight:700, color:"#0f172a", marginBottom:10 }}>لا يوجد عناصر محفوظة بعد</h2>
              <p style={{ fontSize:14, color:"#64748b", marginBottom:28, maxWidth:300, margin:"0 auto 28px", lineHeight:1.7 }}>
                احفظي القطع التي تحبينها لتتمكني من مشاهدتها لاحقًا.
              </p>
              <Link href="/shop" className="btn-gold" style={{ fontSize:13 }}>
                استكشفي المجموعة <ArrowRight size={15}/>
              </Link>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map(item => (
                <div key={item.id} className="wishlist-card group">
                  {/* Image */}
                  <div style={{ position:"relative", aspectRatio:"3/4", overflow:"hidden", borderRadius:12, background:"#f1f5f9", marginBottom:12 }}>
                    <Image fill src={normalizeImageUrl(item.image)} alt={item.name} style={{ objectFit:"cover", transition:"transform 0.6s ease" }} className="wishlist-img"/>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="wishlist-remove"
                      title="إزالة من المفضلة"
                    >
                      <X size={14} strokeWidth={2}/>
                    </button>

                    {/* Add to cart overlay */}
                    <button
                      onClick={() => addToCart(item.id, item.name, item.price, item.image, "M", "Black")}
                      className="wishlist-cart-btn"
                    >
                      <ShoppingCart size={15} strokeWidth={2}/> أضف إلى السلة
                    </button>
                  </div>

                  {/* Info */}
                  <Link href={`/product/${item.id}`} style={{ textDecoration:"none" }}>
                    <h3 style={{ fontSize:14, fontWeight:600, color:"#0f172a", margin:"0 0 5px", transition:"color 0.2s", lineHeight:1.4 }} className="wishlist-name">
                      {item.name}
                    </h3>
                    <p style={{ fontSize:15, fontWeight:800, color:"#0f172a", margin:0 }}>
                      ${item.price.toFixed(2)}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .wishlist-card { position: relative; }
        .wishlist-card:hover .wishlist-img { transform: scale(1.05); }
        .wishlist-card:hover .wishlist-name { color: #d97706; }

        .wishlist-remove {
          position: absolute; top: 10px; right: 10px;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.95); border: 1.5px solid #e2e8f0;
          border-radius: 50%; cursor: pointer; color: #64748b;
          opacity: 0; transition: all 0.25s;
        }
        .wishlist-card:hover .wishlist-remove { opacity: 1; }
        .wishlist-remove:hover { background: #fef2f2; border-color: #fca5a5; color: #ef4444; }

        .wishlist-cart-btn {
          position: absolute; bottom: 0; left: 0; right: 0;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 16px;
          background: #0f172a; color: #fcd34d;
          font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          border: none; cursor: pointer; border-radius: 0 0 12px 12px;
          transform: translateY(100%); transition: transform 0.3s;
          font-family: var(--font-tajawal, sans-serif);
        }
        .wishlist-card:hover .wishlist-cart-btn { transform: translateY(0); }
        .wishlist-cart-btn:hover { background: #f59e0b; color: #0f172a; }

        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        @media(max-width:1024px){ .wishlist-grid { grid-template-columns: repeat(3,1fr); gap:20px; } }
        @media(max-width:700px) { .wishlist-grid { grid-template-columns: repeat(2,1fr); gap:16px; } }
        @media(max-width:380px) { .wishlist-grid { grid-template-columns: repeat(2,1fr); gap:12px; } }
      `}</style>
    </>
  );
}

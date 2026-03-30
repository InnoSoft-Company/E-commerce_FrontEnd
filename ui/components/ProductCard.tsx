"use client";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Eye, Zap } from "lucide-react";
import { Product } from "@/src/data/products";
import { useWishlist } from "@/src/context/WishlistContext";
import { useCart } from "@/src/context/CartContext";
import { normalizeImageUrl } from "@/src/utils/image";

const colorHex: Record<string, string> = {
  // الألوان الأساسية
  White: "#ffffff", Black: "#000000", Gray: "#808080", Beige: "#f5f5dc",
  
  // الأحمر والوردي
  Red: "#ff0000", Pink: "#ff69b4", Coral: "#ff7f50", Salmon: "#fa8072",
  Crimson: "#dc143c", Magenta: "#ff00ff", 
  
  // الأزرق
  Blue: "#0066ff", Navy: "#2c5aa0", Indigo: "#4b0082", Cyan: "#00ffff",
  LightBlue: "#add8e6", SkyBlue: "#87ceeb", RoyalBlue: "#4169e1",
  
  // الأخضر
  Green: "#228b22", LimeGreen: "#32cd32", SeaGreen: "#2e8b57", 
  DarkGreen: "#006400", OliveGreen: "#556b2f", Mint: "#98ff98",
  
  // الأصفر والبرتقالي
  Yellow: "#ffff00", Gold: "#ffd700", Orange: "#ff8c00", 
  DarkOrange: "#ff6347", Olive: "#808000",
  
  // البني
  Brown: "#8b4513", Tan: "#d2b48c", Camel: "#c19a6b", 
  Chocolate: "#7b3f00", Maroon: "#800000",
  
  // الأرجواني
  Purple: "#800080", Plum: "#dda0dd", Orchid: "#da70d6",
  Lavender: "#e6e6fa", Violet: "#ee82ee",
  
  // الألوان الحيادية
  Cream: "#fffdd0", Ivory: "#fffff0", Khaki: "#f0e68c",
  Linen: "#faf0e6", WhiteSmoke: "#f5f5f5",
};

// دالة لتحويل أي قيمة إلى مصفوفة
function ensureArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value.split(",").map((s: string) => s.trim()).filter((s: string) => s);
    }
  }
  return [];
}

export function ProductCard({ product }: { product: Product }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();
  const inWishlist = isInWishlist(product.id);

  // Navigate to product page
  const goToProduct = () => router.push(`/product/${product.id}`);

  const stopAndRun = (e: React.MouseEvent, fn: () => void) => {
    e.preventDefault(); e.stopPropagation(); fn();
  };

  return (
    <>
      {/* Use div instead of Link to avoid nested <a> */}
      <div className="pc-card group" onClick={goToProduct} style={{ textDecoration: "none", display: "block", cursor: "pointer" }}>

        {/* Image wrapper */}
        <div className="pc-img-wrap">
          <img src={normalizeImageUrl(product.image)} alt={product.name} className="pc-img" />

          {/* Badges */}
          <div className="pc-badges">
            {product.featured && <span className="pc-badge pc-badge--dark">مميز</span>}
            {product.trending  && <span className="pc-badge pc-badge--new">رائج 🔥</span>}
            {!product.inStock  && <span className="pc-badge pc-badge--out">نفذ</span>}
          </div>

          {/* Action icons — all are buttons/divs, NO nested <a> */}
          <div className="pc-actions">
            <button
              onClick={e => stopAndRun(e, () =>
                inWishlist ? removeFromWishlist(product.id) : addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image })
              )}
              className={`pc-action-btn${inWishlist ? " active" : ""}`} title="المفضلة"
            >
              <Heart size={15} strokeWidth={2} fill={inWishlist ? "currentColor" : "none"} />
            </button>

            {product.inStock && (
              <button
                onClick={e => stopAndRun(e, () => addToCart(product.id, product.name, product.price, product.image, product.sizes[0] || "", product.colors[0] || ""))}
                className="pc-action-btn" title="أضف للسلة"
              >
                <ShoppingCart size={15} strokeWidth={2} />
              </button>
            )}

            {/* Eye button — navigates to product (no nested link) */}
            <button
              onClick={e => stopAndRun(e, goToProduct)}
              className="pc-action-btn" title="عرض المنتج"
            >
              <Eye size={15} strokeWidth={2} />
            </button>
          </div>

          {/* Quick Add */}
          {product.inStock && (
            <button
              onClick={e => stopAndRun(e, () => addToCart(product.id, product.name, product.price, product.image, product.sizes[0] || "", ensureArray(product.colors)[0] || ""))}
              className="pc-quick-add"
            >
              <Zap size={14} fill="currentColor" /> أضف للسلة فورًا
            </button>
          )}
        </div>

        {/* Info */}
        <div className="pc-info">
          <p className="pc-cat">{product.category}</p>
          <h3 className="pc-name">{product.name}</h3>

          <div className="pc-row">
            <p className="pc-price">{product.price.toLocaleString("en-US")} LE</p>
          </div>

          {/* Color swatches */}
          <div className="pc-swatches">
            {ensureArray(product.colors).slice(0, 5).map(c => (
              <div key={c} title={c} className="pc-swatch" style={{ background: colorHex[c] ?? "#c9a96e" }} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .pc-card { border-radius:12px; overflow:hidden; transition:box-shadow 0.3s; }
        .pc-card:hover { box-shadow:0 12px 40px rgba(15,23,42,0.13); }

        .pc-img-wrap { position:relative; aspect-ratio:3/4; overflow:hidden; background:#f1f5f9; border-radius:12px; }
        .pc-img { width:100%; height:100%; object-fit:cover; transition:transform 0.6s ease; display:block; }
        .pc-card:hover .pc-img { transform:scale(1.06); }

        .pc-badges { position:absolute; top:10px; left:10px; z-index:10; display:flex; flex-direction:column; gap:5px; }
        .pc-badge { display:inline-flex; align-items:center; padding:4px 10px; border-radius:50px; font-size:10px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; }
        .pc-badge--dark { background:#0f172a; color:#fcd34d; }
        .pc-badge--new  { background:#f59e0b; color:#0f172a; }
        .pc-badge--out  { background:#64748b; color:#ffffff; }

        .pc-actions { position:absolute; top:10px; right:10px; z-index:10; display:flex; flex-direction:column; gap:6px; opacity:0; transform:translateX(8px); transition:all 0.3s; }
        .pc-card:hover .pc-actions { opacity:1; transform:translateX(0); }
        .pc-action-btn { width:36px; height:36px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.96); border:1.5px solid #e2e8f0; border-radius:50%; cursor:pointer; color:#0f172a; transition:all 0.2s; }
        .pc-action-btn:hover, .pc-action-btn.active { background:#f59e0b; border-color:#f59e0b; color:#0f172a; }

        .pc-quick-add { position:absolute; bottom:0; left:0; right:0; display:flex; align-items:center; justify-content:center; gap:7px; padding:13px 16px; background:#0f172a; color:#fcd34d; font-size:12px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; border:none; cursor:pointer; transform:translateY(100%); transition:transform 0.3s; font-family:var(--font-tajawal,sans-serif); }
        .pc-card:hover .pc-quick-add { transform:translateY(0); }
        .pc-quick-add:hover { background:#f59e0b; color:#0f172a; }

        .pc-info { padding:12px 4px 8px; }
        .pc-cat { font-size:10px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:#d97706; margin:0 0 5px; }
        .pc-name { font-size:15px; font-weight:700; color:#0f172a; margin:0; line-height:1.4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .pc-row { display:flex; align-items:center; justify-content:space-between; margin-top:10px; }
        .pc-price { font-size:1.05rem; font-weight:800; color:#0f172a; margin:0; }
        .pc-rating { display:flex; align-items:center; gap:4px; }
        .pc-stars  { color:#f59e0b; font-size:13px; font-weight:800; }
        .pc-reviews{ color:#94a3b8; font-size:12px; }

        .pc-swatches { display:flex; gap:6px; margin-top:10px; }
        .pc-swatch { width:16px; height:16px; border-radius:50%; border:2px solid #e2e8f0; outline:1.5px solid rgba(0,0,0,0.06); transition:transform 0.2s; cursor:pointer; }
        .pc-swatch:hover { transform:scale(1.3); }

        @media(max-width:480px){
          .pc-name { font-size:13px; }
          .pc-price { font-size:0.95rem; }
          .pc-action-btn { width:32px; height:32px; }
          .pc-quick-add { font-size:11px; padding:11px 12px; }
        }
      `}</style>
    </>
  );
}

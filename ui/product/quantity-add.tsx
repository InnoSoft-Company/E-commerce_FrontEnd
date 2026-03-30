import { Product } from "@/src/data/products";
import { ArrowRight, Check, Heart, Minus, Plus, ShoppingCart } from "lucide-react";

export default function QuantityAdd({
  qty, setQty, handleAddToCart, handleBuyNow, product, inWishlist, addToWishlist, removeFromWishlist, added,
}: {
  qty: number;
  setQty: (q: number) => void;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
  product: Product;
  inWishlist: boolean;
  addToWishlist: (item: { id: number; name: string; price: number; image: string }) => void;
  removeFromWishlist: (id: number) => void;
  added: boolean;
}) {
  return (
    <>
      <div className="qa-wrap">
        {/* Quantity stepper */}
        <div className="qa-stepper">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="qa-step-btn"
          >
            <Minus size={14} strokeWidth={1.5} />
          </button>
          <span className="qa-qty">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="qa-step-btn">
            <Plus size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`btn-primary qa-cart-btn${!product.inStock ? " disabled" : ""}${added ? " added" : ""}`}
        >
          {added ? (
            <><Check size={16} />تمت الإضافة</>
          ) : product.inStock ? (
            <><ShoppingCart size={16} />أضف إلى السلة</>
          ) : (
            "غير متوفر"
          )}
        </button>

        {/* Wishlist */}
        <button
          onClick={() =>
            inWishlist
              ? removeFromWishlist(product.id)
              : addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image })
          }
          className={`qa-wish-btn${inWishlist ? " active" : ""}`}
        >
          <Heart size={16} strokeWidth={1.5} className={inWishlist ? "fill-current" : ""} />
        </button>
      </div>

      {/* Buy Now */}
      <div style={{ display: "flex", width: "100%", marginTop: 12 }}>
        <button
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className={`btn-ghost qa-buy-btn${!product.inStock ? " disabled" : ""}`}
        >
          شراء الآن <ArrowRight size={16} />
        </button>
      </div>

      <style>{`
        .qa-wrap {
          display: flex;
          gap: 10px;
          align-items: stretch;
          flex-wrap: wrap;
        }

        /* Stepper */
        .qa-stepper {
          display: flex;
          align-items: center;
          border: 1.5px solid rgba(0,0,0,0.1);
          flex-shrink: 0;
        }
        .qa-step-btn {
          width: 42px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer;
          color: #8a8a7a; transition: background 0.18s;
        }
        .qa-step-btn:hover { background: #f0ece4; }
        .qa-qty {
          width: 38px; text-align: center;
          font-size: 14px; font-weight: 600; color: #1a1a18;
        }

        /* Cart button */
        .qa-cart-btn {
          flex: 1;
          min-width: 140px;
          justify-content: center;
        }
        .qa-cart-btn.disabled { opacity: 0.4; cursor: not-allowed; }
        .qa-cart-btn.added { background: #2d6a3f !important; border-color: #2d6a3f !important; }

        /* Wishlist button */
        .qa-wish-btn {
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid rgba(0,0,0,0.1);
          background: transparent; cursor: pointer;
          color: #8a8a7a; transition: all 0.2s; flex-shrink: 0;
        }
        .qa-wish-btn:hover { border-color: #1a1a18; color: #1a1a18; }
        .qa-wish-btn.active { background: #1a1a18; border-color: #1a1a18; color: #faf9f6; }

        /* Buy now */
        .qa-buy-btn {
          flex: 1;
          justify-content: center;
        }
        .qa-buy-btn.disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── Mobile ── */
        @media(max-width:480px){
          .qa-wrap { gap: 8px; }
          .qa-stepper { flex-shrink: 0; }
          .qa-cart-btn { min-width: 0; font-size: 13px; }
          .qa-step-btn { width: 38px; }
          .qa-wish-btn { width: 44px; height: 44px; }
        }
      `}</style>
    </>
  );
}

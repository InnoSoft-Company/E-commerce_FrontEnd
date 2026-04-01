"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, X } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import Image from "next/image";
import { normalizeImageUrl } from "@/src/utils/image";
import { useState, useCallback, useMemo } from "react";

interface CouponResponse {
  code: string;
  discount: number;
  discount_type: 'fixed' | 'percentage';
  active?: boolean;
  expiry?: string;
}

interface AppliedCoupon {
  code: string;
  discount: number;
  type: 'fixed' | 'percentage';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Memoize price calculations
  const { subtotal, discountAmount, total } = useMemo(() => {
    const sub = getCartTotal();
    const discount = appliedCoupon ? 
      (appliedCoupon.type === 'percentage' ? (sub * appliedCoupon.discount) / 100 : appliedCoupon.discount) 
      : 0;
    const tot = Math.max(0, sub - discount);
    return { subtotal: sub, discountAmount: discount, total: tot };
  }, [getCartTotal, appliedCoupon]);

  const applyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setCouponError("يرجى إدخال كود الخصم");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const token = localStorage.getItem("blanko_access");
      
      let coupons: CouponResponse[] = [];
      try {
        const res = await fetch(`${API_URL}/coupons/`, {
          headers: { 
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          },
        });
        if (res.ok) {
          const data = await res.json();
          const couponList: CouponResponse[] = Array.isArray(data) ? data : (data.results || []);
          coupons = couponList.filter((coupon) => {
            const isActive = coupon.active !== false;
            const notExpired = !coupon.expiry || new Date(coupon.expiry) > new Date();
            return isActive && notExpired;
          });
        }
      } catch (err) {
        console.error('Failed to fetch coupons from API:', err);
      }

      const normalizedCode = couponCode.toUpperCase().trim();
      const coupon = coupons.find((c) => c.code.toUpperCase() === normalizedCode);
      
      if (coupon) {
        const couponData: AppliedCoupon = { 
          code: coupon.code, 
          discount: Number(coupon.discount), 
          type: coupon.discount_type === 'percentage' ? 'percentage' : 'fixed' 
        };
        setAppliedCoupon(couponData);
        localStorage.setItem('blanko_applied_coupon', JSON.stringify(couponData));
        localStorage.setItem('blanko_user_applied_coupon', 'true');
        setCouponCode("");
        setCouponError("");
      } else {
        setCouponError("كود الخصم غير صالح");
      }
    } catch (error) {
      console.error('Coupon error:', error); 
      setCouponError("حدث خطأ ما. يرجى المحاولة مرة أخرى");
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [couponCode]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError("");
    localStorage.removeItem('blanko_applied_coupon');
    localStorage.removeItem('blanko_user_applied_coupon');
  }, []);

  if (cart.length === 0) return (
    <div className="cart-page" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
      <div style={{ width: 72, height: 72, border: "1.5px solid #e2e8f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, background: "#f8fafc" }}>
        <ShoppingBag style={{ color: "#94a3b8" }} strokeWidth={1.5} size={28} />
      </div>
      <p className="section-tag" style={{ justifyContent: "center", marginBottom: 12 }}>سلة التسوق</p>
      <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>لا يوجد شيء هنا بعد</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32, maxWidth: 280, lineHeight: 1.7 }}>
        اكتشف تشكيلاتنا المختارة واعثر على أسلوبك المثالي.
      </p>
      <Link href="/shop" className="btn-gold">
        استكشف المتجر <ArrowRight size={16} />
      </Link>
    </div>
  );

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <p className="section-tag" style={{ marginBottom: 8 }}>تشكيلتك</p>
          <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
            سلة التسوق
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            {cart.length} منتج{cart.length !== 1 ? "ات" : ""}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <div className="cart-layout">

          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {cart.map((item, i) => (
              <div
                key={`${item.id}-${item.size}-${item.color}-${i}`}
                className="cart-item group"
              >
                {/* Product image */}
                <Link href={`/product/${item.product_id}`} style={{ flexShrink: 0, textDecoration: "none" }}>
                  <div style={{ position: "relative", width: 88, height: 108, borderRadius: 10, overflow: "hidden", background: "#f1f5f9" }}>
                    <Image fill src={normalizeImageUrl(item.image)} alt={item.name} style={{ objectFit: "cover" }} />
                  </div>
                </Link>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <Link href={`/product/${item.product_id}`}
                      style={{ fontWeight: 600, fontSize: 15, color: "#0f172a", textDecoration: "none", transition: "color 0.2s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "80%" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#d97706"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#0f172a"; }}
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", transition: "color 0.2s", padding: "2px 4px", flexShrink: 0 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#cbd5e1"; }}
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
                    {[item.size, item.color].map(v => (
                      <span key={v} style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "#f1f5f9", color: "#64748b", padding: "4px 10px", borderRadius: 20 }}>
                        {v}
                      </span>
                    ))}
                  </div>

                  {/* Qty + Price */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                    {/* Stepper */}
                    <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#64748b", transition: "background 0.18s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                      >
                        <Minus size={13} strokeWidth={1.5} />
                      </button>
                      <span className="simple-numbers" style={{ width: 36, textAlign: "center", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#64748b", transition: "background 0.18s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                      >
                        <Plus size={13} strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Price */}
                    <p className="price simple-numbers" style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      {(item.price * item.quantity).toLocaleString("en-US")} LE
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div>
            <div className="cart-summary-box">
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: "0 0 22px" }}>
                معلومات الطلب
              </h2>

              {/* Coupon */}
              {!appliedCoupon ? (
                <div>
                  {/* Debug info - remove in production */}
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>
                    الكوبونات يتم تحميلها من قاعدة البيانات
                  </div>
                  
                  <div style={{ display: "flex", marginBottom: 22, border: "1.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, padding: "0 14px" }}>
                      <Tag size={14} style={{ color: "#94a3b8" }} strokeWidth={1.5} />
                      <input
                        type="text" 
                        placeholder="كود الخصم"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                        style={{ flex: 1, padding: "12px 0", background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#0f172a", fontFamily: "var(--font-cairo, sans-serif)" }}
                      />
                    </div>
                    <button 
                      onClick={applyCoupon}
                      disabled={isApplyingCoupon}
                      style={{ 
                        background: isApplyingCoupon ? "#64748b" : "#0f172a", 
                        color: "#ffffff", 
                        padding: "0 18px", 
                        fontSize: 11, 
                        fontWeight: 700, 
                        letterSpacing: "0.12em", 
                        textTransform: "uppercase", 
                        border: "none", 
                        cursor: isApplyingCoupon ? "not-allowed" : "pointer", 
                        transition: "background 0.2s", 
                        fontFamily: "var(--font-cairo, sans-serif)" 
                      }}
                      onMouseEnter={e => { if (!isApplyingCoupon) (e.currentTarget as HTMLButtonElement).style.background = "#1e293b" }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#0f172a" }}
                    >
                      {isApplyingCoupon ? "جاري التطبيق..." : "استخدم"}
                    </button>
                  </div>
                  {couponError && (
                    <p style={{ fontSize: 12, color: "#ef4444", marginTop: 8, marginBottom: 16 }}>
                      {couponError}
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: 22 }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    padding: "12px 14px", 
                    background: "#dcfce7", 
                    border: "1.5px solid #bbf7d0", 
                    borderRadius: 10 
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Tag size={14} style={{ color: "#16a34a" }} strokeWidth={1.5} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", margin: 0 }}>
                          {appliedCoupon.code}
                        </p>
                        <p style={{ fontSize: 11, color: "#15803d", margin: 0 }}>
                          {appliedCoupon.type === 'percentage' 
                            ? `خصم ${appliedCoupon.discount}%` 
                            : `خصم ${appliedCoupon.discount.toLocaleString("en-US")} LE`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        cursor: "pointer", 
                        color: "#dc2626", 
                        padding: "4px", 
                        borderRadius: "4px",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2" }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none" }}
                    >
                      <X size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              )}

              {/* Totals */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                {[
                  { l: "الإجمالي الجزئي", v: `${subtotal.toLocaleString("en-US")} LE`, special: false },
                  ...(discountAmount > 0 ? [{ 
                    l: "الخصم", 
                    v: `-${discountAmount.toLocaleString("en-US")} LE`, 
                    special: false 
                  }] : [])
                ].map(({ l, v, special }) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "#64748b", fontWeight: 400 }}>{l}</span>
                    <span className="simple-numbers" style={{ fontSize: 14, fontWeight: 700, color: l === "الخصم" ? "#dc2626" : (special ? "#16a34a" : "#0f172a") }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{ borderTop: "2px solid #f1f5f9", paddingTop: 16, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>الإجمالي</span>
                <span className="price simple-numbers" style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a" }}>
                  {total.toLocaleString("en-US")} LE
                </span>
              </div>

              {/* Buttons */}
              <Link href="/checkout" className="btn-gold" style={{ width: "100%", display: "flex", marginBottom: 10 }}>
                أكمل عملية الشراء <ArrowRight size={16} />
              </Link>
              <Link href="/shop" className="btn-ghost" style={{ width: "100%", display: "flex" }}>
                استمر في التسوق
              </Link>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
          align-items: flex-start;
        }
        @media(max-width:900px){
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary-box { position: static !important; }
        }
        @media(max-width:480px){
          .cart-item { flex-direction: column; }
          .cart-item > a { width: 100% !important; }
          .cart-item > a > div { width: 100% !important; height: 200px !important; }
        }
      `}</style>
    </div>
  );
}

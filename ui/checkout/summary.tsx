
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { normalizeImageUrl } from "@/src/utils/image";

export default function Summary({ cart, subtotal, shippingFee, total, discount = 0, appliedCoupon }: {
  cart: { name: string; size: string; color: string; price: number; quantity: number; image: string }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  discount?: number;
  appliedCoupon?: {code: string, discount: number, type: 'fixed' | 'percentage'} | null;
}) {
  return (
    <>
      <div className="summary-box">
        <h3 style={{ fontFamily: "var(--font-cormorant,Georgia,serif)", fontSize: "1.35rem", fontWeight: 800, color: "#ffffff", margin: "0 0 20px" }}>
          ملخص الطلب
        </h3>

        {/* Cart items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20, maxHeight: 240, overflowY: "auto" }}>
          {cart.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ position: "relative", width: 50, height: 62, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.08)" }}>
                <Image fill src={normalizeImageUrl(item.image)} alt={item.name} style={{ objectFit: "cover" }}  sizes="(max-width:768px) 100vw, 50vw"/>
                <span style={{ position: "absolute", top: -4, right: -4, width: 19, height: 19, borderRadius: "50%", background: "#f59e0b", color: "#0f172a", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.quantity}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", margin: 0 }}>{item.size} · {item.color}</p>
              </div>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#fcd34d", flexShrink: 0 }}>
                {(item.price * item.quantity).toLocaleString("en-US")} LE
              </p>
            </div>
          ))}
        </div>

        {/* Applied Coupon */}
        {appliedCoupon && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            padding: "10px 12px", 
            background: "rgba(34,197,94,0.1)", 
            border: "1px solid rgba(34,197,94,0.2)", 
            borderRadius: 8, 
            marginBottom: 16 
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e" }}>كوبون:</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>{appliedCoupon.code}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>
                ({appliedCoupon.type === 'percentage' ? `-${appliedCoupon.discount}%` : `-${appliedCoupon.discount} LE`})
              </span>
            </div>
          </div>
        )}

        {/* Totals */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 11 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", fontWeight: 400 }}>الإجمالي الجزئي</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{subtotal.toLocaleString("en-US")} LE</span>
          </div>
          {shippingFee > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", fontWeight: 400 }}>الشحن</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: shippingFee === 0 ? "#34d399" : "rgba(255,255,255,0.6)" }}>{shippingFee === 0 ? "مجاني" : `${shippingFee.toLocaleString("en-US")} LE`}</span>
            </div>
          )}
          {discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", fontWeight: 400 }}>الخصم</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>-{discount.toLocaleString("en-US")} LE</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 13, borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 3 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#ffffff" }}>الإجمالي الكلي</span>
            <span style={{ fontFamily: "var(--font-cormorant,Georgia,serif)", fontSize: "1.55rem", fontWeight: 800, color: "#f59e0b" }}>
              {(subtotal + shippingFee - discount).toLocaleString("en-US")} LE
            </span>
          </div>
        </div>

        {/* Trust badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "11px 14px", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.14)", borderRadius: 10 }}>
          <ShieldCheck size={15} style={{ color: "#34d399", flexShrink: 0 }} strokeWidth={2} />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
            دفع آمن ومشفر بالكامل. بياناتك محمية.
          </p>
        </div>
      </div>

      <style>{`
        .summary-box {
          background: #1e293b;
          border: 1.5px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 26px;
          position: sticky;
          top: 100px;
        }
        @media(max-width:900px){
          .summary-box {
            position: static;
            order: -1; /* يظهر فوق فورم الدفع على التاب/موبايل */
          }
        }
        @media(max-width:480px){
          .summary-box { padding: 20px 16px; border-radius: 12px; }
        }
      `}</style>
    </>
  );
}

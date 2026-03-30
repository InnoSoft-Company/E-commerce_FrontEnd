"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import Summary from "@/ui/checkout/summary";
import Shipping from "@/ui/checkout/shipping";
import ConfirmOrder from "@/ui/checkout/confirm-order";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState<1|2>(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shipping, setShipping] = useState({ firstName:"", lastName:"", email:"", phone:"", address:"", city:"", zip:"" });
  
  // Coupon state - get from localStorage or initialize empty
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number, type: 'fixed' | 'percentage'} | null>(null);
  const [shippingFee, setShippingFee] = useState(0);

  // Load coupon from localStorage on mount
  useEffect(() => {
    const savedCoupon = localStorage.getItem('blanko_applied_coupon');
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch {
        localStorage.removeItem('blanko_applied_coupon');
      }
    }
  }, []);

  const subtotal = getCartTotal();
  const discountAmount = appliedCoupon ? 
    (appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.discount) / 100 : appliedCoupon.discount) 
    : 0;
  const total = Math.max(0, subtotal + shippingFee - discountAmount);

  if (cart.length === 0 && !orderPlaced) return (
    <div style={{ background:"#0f172a", minHeight:"calc(100vh - 112px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 24px", textAlign:"center" }}>
      <ShoppingBag size={64} style={{ color:"rgba(255,255,255,0.1)", marginBottom:24 }} strokeWidth={1} />
      <h2 style={{ color:"#ffffff", margin:"0 0 14px" }}>سلتك فارغة</h2>
      <p style={{ color:"rgba(255,255,255,0.45)", fontSize:15, marginBottom:28 }}>أضفي منتجات أولًا قبل المتابعة للدفع</p>
      <Link href="/shop" className="btn-gold" style={{ fontSize:13 }}>تسوقي الآن</Link>
    </div>
  );

  return (
    <div style={{ background:"#0f172a", minHeight:"calc(100vh - 112px)" }}>
      {/* Top bar */}
      <div style={{ background:"#1e293b", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"18px 0" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <Link href="/" style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:22, fontWeight:800, color:"#ffffff", textDecoration:"none", letterSpacing:"0.3em", textTransform:"uppercase" }}>
            BLANKO
          </Link>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            {[{n:1,l:"معلومات الشحن"},{n:2,l:"تأكيد الطلب"}].map((s,i)=>(
              <div key={s.n} style={{ display:"flex", alignItems:"center", gap:8 }}>
                {i>0 && <div style={{ width:40, height:1.5, background: step>=s.n?"#f59e0b":"rgba(255,255,255,0.15)", borderRadius:1 }} />}
                <div style={{ display:"flex", alignItems:"center", gap:8, opacity: step>=s.n?1:0.4 }}>
                  <div style={{
                    width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                    background: step>s.n?"#34d399" : step===s.n?"#f59e0b":"rgba(255,255,255,0.1)",
                    fontSize:11, fontWeight:800, color: step>=s.n?"#0f172a":"rgba(255,255,255,0.4)",
                    transition:"all 0.3s",
                  }}>
                    {step>s.n ? <Check size={13} strokeWidth={3} /> : s.n}
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color: step>=s.n?"#ffffff":"rgba(255,255,255,0.35)", letterSpacing:"0.1em", whiteSpace:"nowrap" }}>{s.l}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:28, alignItems:"flex-start" }}>
          {/* Form area */}
          <div style={{ background:"#1e293b", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:18, padding:"36px 32px" }}>
            <Shipping
              shipping={shipping}
              setShipping={setShipping}
              inputCls=""
              setStep={setStep}
              setOrderPlaced={setOrderPlaced}
              setShippingFee={setShippingFee}
            />
          </div>

          {/* Summary */}
          <Summary cart={cart} subtotal={subtotal} shippingFee={shippingFee} total={total} discount={discountAmount} appliedCoupon={appliedCoupon} />
        </div>
      </div>

      {orderPlaced && (
        <ConfirmOrder cart={cart} name={`${shipping.firstName} ${shipping.lastName}`} phone={shipping.phone} city={shipping.city} />
      )}
    </div>
  );
}

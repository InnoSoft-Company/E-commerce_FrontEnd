"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import { ordersApi, couponsApi, type CreateOrderPayload } from "@/src/lib/api";
import { normalizeImageUrl } from "@/src/utils/image";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Smartphone,
  Building2,
  Hash,
  Tag,
  X,
  MessageCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

// ── رقم الواتساب بتاع المحل ─────────────────────────────────────────────────
const STORE_WA = process.env.NEXT_PUBLIC_WA_NUMBER ?? "201000000000";

// ── PayBump API — غيّري الـ URL ده بالـ API الحقيقي من شركة PayBump ──────────
// لما تاخدي الـ API key من PayBump، حطيه في .env.local:
// NEXT_PUBLIC_PAYBUMP_API_URL=https://api.paybump.io/v1/payment
// NEXT_PUBLIC_PAYBUMP_API_KEY=your_key_here
const PAYBUMP_API_URL = process.env.NEXT_PUBLIC_PAYBUMP_API_URL ?? "https://api.paybump.io/v1/payment";
const PAYBUMP_API_KEY = process.env.NEXT_PUBLIC_PAYBUMP_API_KEY ?? "YOUR_PAYBUMP_KEY";

// ── بيانات طرق الدفع الأونلاين — الأدمين يعدّل هنا ──────────────────────────
const ONLINE_ACCOUNTS = {
  vodafone: { number: "010XXXXXXXX",        label: "رقم Vodafone Cash" },
  instapay: { number: "blanko@instapay",    label: "معرّف InstaPay"   },
  bank:     { number: "1234567890123456",   label: "رقم الحساب البنكي", bankName: "بنك مصر", accountName: "Blanko Fashion House" },
};

type OnlineMethod = "vodafone" | "instapay" | "bank" | "paybump" | "";

interface Props {
  setStep: (s: 2) => void;
  setOrderPlaced: (p: boolean) => void;
  shippingName?:     string;
  shippingPhone?:    string;
  shippingCity?:     string;
  shippingData?:     Record<string, string>;
  shippingFeeOverride?: number; // قيمة الشحن جاية من الـ select في shipping.tsx
}

export default function PaymentMethod({
  setStep,
  setOrderPlaced,
  shippingName     = "",
  shippingPhone    = "",
  shippingCity     = "",
  shippingData     = {},
  shippingFeeOverride,
}: Props) {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const [mode,         setMode]         = useState<"deposit" | "online" | "">("");
  const [onlineMethod, setOnlineMethod] = useState<OnlineMethod>("");
  // خانة الرقم الذي سيتم التحويل منه (يكتبه اليوزر)
  const [senderNumber, setSenderNumber] = useState("");
  const [couponCode,   setCouponCode]   = useState("");
  const [couponMsg,    setCouponMsg]    = useState<{ valid: boolean; text: string; amount?: string } | null>(null);
  const [checking,     setChecking]     = useState(false);
  const [placing,      setPlacing]      = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number, type: 'fixed' | 'percentage'} | null>(null);

  // Load coupon from localStorage on mount - ONLY if explicitly applied by user
  useEffect(() => {
    const savedCoupon = localStorage.getItem('blanko_applied_coupon');
    if (savedCoupon) {
      try {
        const coupon = JSON.parse(savedCoupon);
        // Strict validation: only apply if it has valid structure AND positive discount
        if (coupon && 
            coupon.code && 
            typeof coupon.discount === 'number' && 
            coupon.discount > 0 && 
            (coupon.type === 'fixed' || coupon.type === 'percentage')) {
          setAppliedCoupon(coupon);
          setCouponCode(coupon.code);
        } else {
          // Remove invalid or zero-discount coupons
          localStorage.removeItem('blanko_applied_coupon');
        }
      } catch {
        // Remove corrupted coupon data
        localStorage.removeItem('blanko_applied_coupon');
      }
    }
  }, []);

  const subtotal    = getCartTotal();
  const shippingFee = shippingFeeOverride ?? 80;
  
  // Calculate discount correctly for both fixed and percentage
  const discount    = appliedCoupon ? 
    (appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.discount) / 100 : appliedCoupon.discount) 
    : 0;
  const total       = Math.max(0, subtotal + shippingFee - discount); // Ensure total doesn't go negative

  // Function to clear coupon
  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMsg(null);
    localStorage.removeItem('blanko_applied_coupon');
  };

  // Debug: Clear any existing coupon on mount if user didn't explicitly apply one
  useEffect(() => {
    // Check if user came from cart page without applying coupon
    const hasExplicitCoupon = localStorage.getItem('blanko_user_applied_coupon');
    if (!hasExplicitCoupon) {
      // Clear any auto-saved coupon
      localStorage.removeItem('blanko_applied_coupon');
      setAppliedCoupon(null);
      setCouponCode("");
    }
    // Clear the flag after checking
    localStorage.removeItem('blanko_user_applied_coupon');
  }, []);

  // ── Coupon validation ────────────────────────────────────────────────────
  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    setChecking(true);
    setCouponMsg(null);
    try {
      const res = await couponsApi.validate(couponCode.trim().toUpperCase(), subtotal);
      if (res.valid) {
        // Apply the coupon
        const couponData: {code: string, discount: number, type: 'fixed' | 'percentage'} = {
          code: couponCode.trim().toUpperCase(),
          discount: Number(res.discount),
          type: res.discount_type === 'percent' ? 'percentage' as const : 'fixed' as const
        };
        setAppliedCoupon(couponData);
        localStorage.setItem('blanko_applied_coupon', JSON.stringify(couponData));
        // Set flag that user explicitly applied this coupon
        localStorage.setItem('blanko_user_applied_coupon', 'true');
        
        setCouponMsg({
          valid: true,
          text: `✓ خصم ${res.discount_type === "percent" ? res.discount + "%" : res.discount + "LE"}`,
          amount: res.discount_amount,
        });
      } else {
        setCouponMsg({ valid: false, text: res.error ?? "كود غير صحيح" });
      }
    } catch {
      setCouponMsg({ valid: false, text: "كود غير صحيح" });
    } finally {
      setChecking(false);
    }
  };

  // ── Place order ──────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!mode || (mode === "online" && !onlineMethod)) return;
    setPlacing(true);
    try {
      const payload: CreateOrderPayload = {
        first_name:     shippingData.firstName ?? shippingName.split(" ")[0]  ?? "",
        last_name:      shippingData.lastName  ?? shippingName.split(" ").slice(1).join(" ") ?? "",
        email:          shippingData.email     ?? "",
        phone:          shippingData.phone     ?? shippingPhone,
        address:        shippingData.address   ?? "",
        city:           shippingData.city      ?? shippingCity,
        zip_code:       shippingData.zip       ?? "",
        payment_method: mode === "deposit" ? "deposit" : (onlineMethod as string),
        coupon_code:    appliedCoupon ? appliedCoupon.code : "",
        shipping_fee:   shippingFee,
        items: cart.map(item => ({
          product_id: item.id,
          name:       item.name,
          price:      item.price,
          quantity:   item.quantity,
          size:       item.size,
          color:      item.color,
          image:      normalizeImageUrl(item.image),
        })),
      };

      const order = await ordersApi.create(payload);

      // ── Deposit → فتح واتساب تلقائياً ───────────────────────────────
      if (mode === "deposit") {
        const productsList = cart.map(item => 
          `• ${item.name} (${item.size} · ${item.color}) × ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} LE`
        ).join('\n');
        
        const msg =
          `طلب جديد من متجر BLANKO 🛍️\n` +
          `رقم الطلب: #${String(order.id).padStart(4, "0")}\n` +
          `الاسم: ${payload.first_name} ${payload.last_name}\n` +
          `الموبايل: ${payload.phone}\n` +
          `المحافظة: ${payload.city}\n` +
          `العنوان: ${payload.address}\n\n` +
          `📦 المنتجات:\n${productsList}\n\n` +
          `${appliedCoupon ? `كوبون خصم: ${appliedCoupon.code}\n` : ""}` +
          `رسوم الشحن: ${shippingFee.toLocaleString("en-US")} LE\n` +
          `الإجمالي: ${total.toLocaleString("en-US")} LE`;
        window.open(`https://wa.me/${STORE_WA}?text=${encodeURIComponent(msg)}`, "_blank");
      }

      // ── Online payment methods → Send to WhatsApp with payment details ─────────
      if (mode === "online") {
        const productsList = cart.map(item => 
          `• ${item.name} (${item.size} · ${item.color}) × ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} LE`
        ).join('\n');
        
        let paymentDetails = "";
        if (onlineMethod === "vodafone") {
          paymentDetails = `طريقة الدفع: Vodafone Cash\nرقم التحويل: ${ONLINE_ACCOUNTS.vodafone.number}\nرقم المرسل: ${senderNumber}`;
        } else if (onlineMethod === "instapay") {
          paymentDetails = `طريقة الدفع: InstaPay\nمعرّف التحويل: ${ONLINE_ACCOUNTS.instapay.number}\nحساب المرسل: ${senderNumber}`;
        } else if (onlineMethod === "bank") {
          paymentDetails = `طريقة الدفع: تحويل بنكي\nالبنك: ${ONLINE_ACCOUNTS.bank.bankName}\nرقم الحساب: ${ONLINE_ACCOUNTS.bank.number}\nاسم الحساب: ${ONLINE_ACCOUNTS.bank.accountName}\nالحساب المرسل: ${senderNumber}`;
        }

        const msg =
          `طلب جديد من متجر BLANKO 🛍️\n` +
          `رقم الطلب: #${String(order.id).padStart(4, "0")}\n` +
          `الاسم: ${payload.first_name} ${payload.last_name}\n` +
          `الموبايل: ${payload.phone}\n` +
          `المحافظة: ${payload.city}\n` +
          `العنوان: ${payload.address}\n\n` +
          `📦 المنتجات:\n${productsList}\n\n` +
          `${appliedCoupon ? `كوبون خصم: ${appliedCoupon.code}\n` : ""}` +
          `رسوم الشحن: ${shippingFee.toLocaleString("ar-EG")} LE\n` +
          `الإجمالي: ${total.toLocaleString("ar-EG")} LE\n\n` +
          paymentDetails;
        window.open(`https://wa.me/${STORE_WA}?text=${encodeURIComponent(msg)}`, "_blank");
      }

      clearCart();
      setOrderPlaced(true);
      setStep(2);
    } catch {
      alert("حدث خطأ أثناء إتمام الطلب. تأكد من تشغيل الـ backend.");
    } finally {
      setPlacing(false);
    }
  };

  const canConfirm = mode && (mode === "deposit" || onlineMethod);

  // ── helpers ─────────────────────────────────────────────────────────────
  const dP: React.CSSProperties = { margin: "0 0 6px", color: "rgba(255,255,255,0.52)", fontSize: 13 };
  const dV: React.CSSProperties = { margin: "0 0 5px", color: "#fcd34d", fontSize: 17, fontWeight: 800, letterSpacing: "0.06em" };
  const dS: React.CSSProperties = { margin: 0, color: "rgba(255,255,255,0.38)", fontSize: 12 };

  // ── خانة رقم المُرسِل — تظهر لكل طريقة أونلاين ─────────────────────────
  const SenderInput = ({ placeholder }: { placeholder: string }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    
    return (
      <div style={{ marginTop: 14 }}>
        <p style={{ ...dP, marginBottom: 6 }}>رقمك / حسابك اللي هتتحول منه:</p>
        <div 
          style={{ position: "relative", cursor: "text" }}
          onClick={() => {
            // Focus input when clicking anywhere in the container
            if (inputRef.current) {
              inputRef.current.focus();
              const len = inputRef.current.value.length;
              inputRef.current.setSelectionRange(len, len);
            }
          }}
        >
          <Hash size={13} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
          <input
            ref={inputRef}
            type="text"
            value={senderNumber}
            onChange={e => setSenderNumber(e.target.value)}
            placeholder={placeholder}
            className="input-field"
            style={{ 
              paddingRight: 36, 
              fontSize: 13,
              cursor: "text",
              width: "100%",
              padding: "12px 16px 12px 16px",
              outline: "none",
              transition: "all 0.2s ease",
              backgroundColor: "transparent"
            }}
            autoFocus={false}
            onFocus={e => {
              e.target.style.borderColor = "rgba(245,158,11,0.5)";
              e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.1)";
            }}
            onBlur={e => {
              e.target.style.borderColor = "rgba(255,255,255,0.2)";
              e.target.style.boxShadow = "none";
            }}
            onClick={e => {
              e.stopPropagation();
              // Ensure input is focused and cursor is at the end
              e.currentTarget.focus();
              const len = e.currentTarget.value.length;
              e.currentTarget.setSelectionRange(len, len);
            }}
          />
        </div>
      </div>
    );
  };

  // ── Online method options ────────────────────────────────────────────────
  const onlineOptions = [
    {
      id: "vodafone" as OnlineMethod,
      Icon: Smartphone,
      label: "Vodafone Cash",
      color: "#e40000",
      details: (
        <>
          <p style={dP}>حوّل المبلغ إلى رقم Vodafone Cash:</p>
          <p style={dV}>{ONLINE_ACCOUNTS.vodafone.number}</p>
          <p style={dS}>بعد التحويل أرسل صورة الإيصال على الواتساب.</p>
          <SenderInput placeholder="رقم موبايلك على فودافون كاش" />
        </>
      ),
    },
    {
      id: "instapay" as OnlineMethod,
      Icon: CreditCard,
      label: "InstaPay",
      color: "#7c3aed",
      details: (
        <>
          <p style={dP}>حوّل عبر InstaPay إلى:</p>
          <p style={dV}>{ONLINE_ACCOUNTS.instapay.number}</p>
          <p style={dS}>سيتم مراجعة الدفع وتأكيد طلبك.</p>
          <SenderInput placeholder="معرّف InstaPay بتاعك" />
        </>
      ),
    },
    {
      id: "bank" as OnlineMethod,
      Icon: Building2,
      label: "تحويل بنكي",
      color: "#0ea5e9",
      details: (
        <>
          <p style={dP}>البنك: {ONLINE_ACCOUNTS.bank.bankName}</p>
          <p style={dV}>{ONLINE_ACCOUNTS.bank.number}</p>
          <p style={{ ...dS, marginBottom: 4 }}>اسم الحساب: {ONLINE_ACCOUNTS.bank.accountName}</p>
          <p style={dS}>أرسل صورة التحويل على الواتساب لتأكيد الطلب.</p>
          <SenderInput placeholder="رقم حسابك البنكي أو اسمك" />
        </>
      ),
    },
  ];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      <h3
        style={{
          fontFamily: "var(--font-cormorant,Georgia,serif)",
          fontSize: "1.4rem",
          fontWeight: 800,
          color: "#ffffff",
          marginBottom: 22,
        }}
      >
        طريقة الدفع
      </h3>

      {/* ── اختيار deposit / online ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {/* Deposit */}
        <button
          type="button"
          onClick={() => { setMode("deposit"); setOnlineMethod(""); }}
          style={{
            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10,
            padding: "16px 18px", border: "2px solid", borderRadius: 14,
            cursor: "pointer", transition: "all 0.22s", textAlign: "right",
            background:   mode === "deposit" ? "rgba(37,211,102,0.12)" : "rgba(255,255,255,0.05)",
            borderColor:  mode === "deposit" ? "#25D366"               : "rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: 36, height: 36, borderRadius: 9, display: "flex",
              alignItems: "center", justifyContent: "center",
              background: mode === "deposit" ? "rgba(37,211,102,0.2)" : "rgba(255,255,255,0.07)",
            }}
          >
            <MessageCircle size={17} style={{ color: "#25D366" }} strokeWidth={2} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 2px", color: mode === "deposit" ? "#ffffff" : "rgba(255,255,255,0.55)" }}>
              الدفع عند الاستلام
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: 1.4 }}>عبر واتساب المحل</p>
          </div>
        </button>

        {/* Online */}
        <button
          type="button"
          onClick={() => setMode("online")}
          style={{
            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10,
            padding: "16px 18px", border: "2px solid", borderRadius: 14,
            cursor: "pointer", transition: "all 0.22s", textAlign: "right",
            background:  mode === "online" ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.05)",
            borderColor: mode === "online" ? "#f59e0b"               : "rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: 36, height: 36, borderRadius: 9, display: "flex",
              alignItems: "center", justifyContent: "center",
              background: mode === "online" ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.07)",
            }}
          >
            <Smartphone size={17} style={{ color: "#f59e0b" }} strokeWidth={2} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 2px", color: mode === "online" ? "#ffffff" : "rgba(255,255,255,0.55)" }}>
              الدفع الأونلاين
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: 1.4 }}>Vodafone · InstaPay · بنك</p>
          </div>
        </button>
      </div>

      {/* ── Deposit info ────────────────────────────────────────────────── */}
      {mode === "deposit" && (
        <div
          style={{
            padding: "16px 20px",
            background: "rgba(37,211,102,0.07)",
            border: "1.5px solid rgba(37,211,102,0.2)",
            borderRadius: 12,
            marginBottom: 22,
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <MessageCircle size={16} style={{ color: "#25D366", flexShrink: 0, marginTop: 2 }} strokeWidth={2} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", margin: "0 0 5px" }}>
                واتساب المحل: {STORE_WA}
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.7 }}>
                بعد تأكيد الطلب هيتفتح واتساب تلقائياً للتواصل مع المحل وترتيب التسليم والدفع.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Online accordion ─────────────────────────────────────────────── */}
      {mode === "online" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {onlineOptions.map(opt => (
            <div
              key={opt.id}
              style={{
                border: "1.5px solid",
                borderRadius: 12,
                overflow: "hidden",
                transition: "border-color 0.2s",
                borderColor: onlineMethod === opt.id ? opt.color : "rgba(255,255,255,0.1)",
              }}
            >
              <button
                type="button"
                onClick={() => { 
                  setOnlineMethod(onlineMethod === opt.id ? "" : opt.id); 
                  setSenderNumber(""); 
                }}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  justifyContent: "space-between", padding: "13px 16px",
                  background: onlineMethod === opt.id ? `${opt.color}18` : "rgba(255,255,255,0.04)",
                  cursor: "pointer", border: "none",
                  outline: "none",
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <opt.Icon size={16} style={{ color: opt.color }} strokeWidth={2} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: onlineMethod === opt.id ? "#ffffff" : "rgba(255,255,255,0.55)" }}>
                    {opt.label}
                  </span>
                </div>
                {onlineMethod === opt.id
                  ? <ChevronUp size={15} style={{ color: "rgba(255,255,255,0.35)" }} />
                  : <ChevronDown size={15} style={{ color: "rgba(255,255,255,0.28)" }} />}
              </button>

              {onlineMethod === opt.id && (
                <div
                  style={{
                    padding: "14px 16px",
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(0,0,0,0.15)",
                  }}
                >
                  {opt.details}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── كوبون الخصم ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 22 }}>
        <p
          style={{
            fontSize: 11, fontWeight: 800, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 10,
          }}
        >
          كوبون الخصم (اختياري)
        </p>
        {appliedCoupon ? (
          // Show applied coupon with clear button
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px", background: "rgba(34,197,94,0.1)", border: "1.5px solid rgba(34,197,94,0.3)",
            borderRadius: 12, marginBottom: 8
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Tag size={16} style={{ color: "#22c55e" }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", margin: 0 }}>
                  {appliedCoupon.code}
                </p>
                <p style={{ fontSize: 11, color: "#16a34a", margin: 0 }}>
                  {appliedCoupon.type === 'percentage' 
                    ? `خصم ${appliedCoupon.discount}%` 
                    : `خصم ${appliedCoupon.discount.toLocaleString("en-US")} LE`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearCoupon}
              style={{
                background: "none", border: "none", color: "#ef4444", cursor: "pointer",
                padding: "4px", borderRadius: "4px", transition: "background 0.2s"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none" }}
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        ) : (
          // Show coupon input
          <>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                placeholder="أدخل الكود هنا"
                className="input-field"
                style={{ flex: 1, fontSize: 13 }}
              />
              <button
                type="button"
                onClick={validateCoupon}
                disabled={checking}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "0 18px",
                  background: "rgba(245,158,11,0.15)", border: "1.5px solid rgba(245,158,11,0.3)",
                  borderRadius: 12, color: "#fcd34d", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", flexShrink: 0,
                }}
              >
                {checking ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Tag size={14} />}
                تطبيق
              </button>
            </div>
            {couponMsg && (
              <p style={{ fontSize: 12, marginTop: 7, color: couponMsg.valid ? "#34d399" : "#f87171", fontWeight: 600 }}>
                {couponMsg.text}
              </p>
            )}
          </>
        )}
      </div>

      {/* ── ملخص الأسعار ─────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "14px 18px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          marginBottom: 20,
          fontSize: 13,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, color: "rgba(255,255,255,0.55)" }}>
          <span>المنتجات</span><span>{subtotal.toLocaleString("en-US")} LE</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, color: "rgba(255,255,255,0.55)" }}>
          <span>رسوم الشحن</span>
          <span style={{ color: shippingFee === 0 ? "#34d399" : "rgba(255,255,255,0.55)" }}>
            {shippingFee === 0 ? "مجاني 🎉" : `${shippingFee.toLocaleString("en-US")} LE`}
          </span>
        </div>
        {discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, color: "#34d399" }}>
            <span>خصم الكوبون</span><span>- {discount.toLocaleString("en-US")} LE</span>
          </div>
        )}
        <div
          style={{
            display: "flex", justifyContent: "space-between", paddingTop: 10,
            borderTop: "1px solid rgba(255,255,255,0.1)", fontWeight: 800,
            fontSize: 15, color: "#fcd34d",
          }}
        >
          <span>الإجمالي</span><span>{total.toLocaleString("en-US")} LE</span>
        </div>
      </div>

      {/* ── زر التأكيد ───────────────────────────────────────────────────── */}
      <button
        type="button"
        disabled={!canConfirm || placing}
        onClick={handleConfirm}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 10, padding: "15px",
          borderRadius: 50, fontSize: 13, fontWeight: 800,
          letterSpacing: "0.14em", textTransform: "uppercase", border: "none",
          cursor: canConfirm && !placing ? "pointer" : "not-allowed",
          transition: "all 0.25s",
          background:   canConfirm && !placing ? "linear-gradient(90deg,#f59e0b,#d97706)" : "rgba(255,255,255,0.1)",
          color:        canConfirm && !placing ? "#0f172a" : "rgba(255,255,255,0.28)",
          boxShadow:    canConfirm && !placing ? "0 6px 24px rgba(245,158,11,0.35)" : "none",
        }}
      >
        {placing ? (
          <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> جارٍ إتمام الطلب...</>
        ) : mode === "deposit" ? (
          <><MessageCircle size={15} /> تأكيد والتواصل عبر واتساب</>
        ) : (
          <><ArrowRight size={15} /> تأكيد الطلب — {total.toLocaleString("en-US")} LE</>
        )}
      </button>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

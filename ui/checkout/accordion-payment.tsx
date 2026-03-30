"use client";
import { CreditCard, ChevronDown, ChevronUp, Smartphone, Building2, MessageCircle } from "lucide-react";

// ── رقم الواتساب بتاع المحل ──
const STORE_WA = "201000000000";

export default function AccordionPayment({
  payMethod,
  setPayMethod,
  card,
  setCard,
  placeOrder,
  setStep,
  placing,
  total,
  inputCls,
  shippingName = "",
  shippingPhone = "",
  shippingCity = "",
}: {
  payMethod: "card" | "vodafone" | "instapay" | "bank" | "deposit" | "";
  setPayMethod: (method: "card" | "vodafone" | "instapay" | "bank" | "deposit" | "") => void;
  card: { number: string; expiry: string; cvv: string; name: string };
  setCard: (card: { number: string; expiry: string; cvv: string; name: string }) => void;
  placeOrder: () => void;
  setStep: (step: 1) => void;
  placing: boolean;
  total: number;
  inputCls: string;
  shippingName?: string;
  shippingPhone?: string;
  shippingCity?: string;
}) {
  const toggle = (m: typeof payMethod) => setPayMethod(payMethod === m ? "" : m);

  const handlePlaceOrder = () => {
    if (payMethod === "deposit") {
      const msg = `مرحباً، أريد إتمام طلبي والدفع عند الاستلام.\n\nالاسم: ${shippingName}\nالموبايل: ${shippingPhone}\nالمحافظة: ${shippingCity}\nالإجمالي: ${total.toLocaleString("en-US")} LE`;
      window.open(`https://wa.me/${STORE_WA}?text=${encodeURIComponent(msg)}`, "_blank");
    }
    placeOrder();
  };

  const rowStyle = (active: boolean): React.CSSProperties => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    background: active ? "rgba(245,158,11,0.08)" : "transparent",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
    textAlign: "right",
  });

  const detailBox: React.CSSProperties = {
    padding: "16px 20px",
    borderTop: "1px solid rgba(0,0,0,0.07)",
    background: "#faf8f2",
    animation: "accFade 0.2s ease",
  };

  const fieldLabel: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#8a8a7a",
    marginBottom: 8,
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <CreditCard size={20} style={{ color: "#0f172a" }} strokeWidth={1.5} />
        <h2 style={{ fontFamily: "var(--font-cormorant,Georgia,serif)", fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
          طريقة الدفع
        </h2>
      </div>

      {/* ─────────────────── قسم الدفع عند الاستلام ─────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.26em", textTransform: "uppercase", color: "#8a8a7a", marginBottom: 10, marginTop: 0 }}>
          دفع عند الاستلام
        </p>

        <div style={{ border: "1.5px solid", borderRadius: 2, overflow: "hidden", borderColor: payMethod === "deposit" ? "#25D366" : "rgba(0,0,0,0.1)", transition: "border-color 0.2s" }}>
          <button onClick={() => toggle("deposit")} style={{ ...rowStyle(payMethod === "deposit") }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MessageCircle size={17} style={{ color: "#25D366" }} strokeWidth={1.5} />
              <span style={{ fontSize: 14, fontWeight: payMethod === "deposit" ? 700 : 400, color: "#1a1a18" }}>
                الدفع عند الاستلام (واتساب)
              </span>
            </div>
            {payMethod === "deposit" ? <ChevronUp size={16} style={{ color: "#8a8a7a" }} /> : <ChevronDown size={16} style={{ color: "#8a8a7a" }} />}
          </button>
          {payMethod === "deposit" && (
            <div style={detailBox}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <MessageCircle size={16} style={{ color: "#25D366", flexShrink: 0, marginTop: 2 }} strokeWidth={1.5} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1a18", margin: "0 0 5px" }}>التواصل عبر واتساب</p>
                  <p style={{ fontSize: 13, color: "#8a8a7a", margin: 0, lineHeight: 1.7 }}>
                    بعد الضغط على "إتمام الطلب" سيتم فتح واتساب للتواصل مع المحل وترتيب الدفع والتسليم.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────── قسم الدفع الأونلاين ─────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.26em", textTransform: "uppercase", color: "#8a8a7a", marginBottom: 10, marginTop: 16 }}>
          دفع أونلاين
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

          {/* Vodafone Cash */}
          <div style={{ border: "1.5px solid", borderRadius: 2, overflow: "hidden", borderColor: payMethod === "vodafone" ? "#e40000" : "rgba(0,0,0,0.1)", transition: "border-color 0.2s" }}>
            <button onClick={() => toggle("vodafone")} style={{ ...rowStyle(payMethod === "vodafone") }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Smartphone size={17} style={{ color: "#e40000" }} strokeWidth={1.5} />
                <span style={{ fontSize: 14, fontWeight: payMethod === "vodafone" ? 700 : 400, color: "#1a1a18" }}>Vodafone Cash</span>
              </div>
              {payMethod === "vodafone" ? <ChevronUp size={16} style={{ color: "#8a8a7a" }} /> : <ChevronDown size={16} style={{ color: "#8a8a7a" }} />}
            </button>
            {payMethod === "vodafone" && (
              <div style={detailBox}>
                <p style={{ fontSize: 13, color: "#8a8a7a", margin: "0 0 8px" }}>حوّل المبلغ إلى رقم Vodafone Cash:</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#1a1a18", margin: "0 0 6px", letterSpacing: "0.06em" }}>010XXXXXXXX</p>
                <p style={{ fontSize: 12, color: "#8a8a7a", margin: 0 }}>بعد التحويل أرسل صورة الإيصال على الواتساب لتأكيد طلبك.</p>
              </div>
            )}
          </div>

          {/* InstaPay */}
          <div style={{ border: "1.5px solid", borderRadius: 2, overflow: "hidden", borderColor: payMethod === "instapay" ? "#7c3aed" : "rgba(0,0,0,0.1)", transition: "border-color 0.2s" }}>
            <button onClick={() => toggle("instapay")} style={{ ...rowStyle(payMethod === "instapay") }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Smartphone size={17} style={{ color: "#7c3aed" }} strokeWidth={1.5} />
                <span style={{ fontSize: 14, fontWeight: payMethod === "instapay" ? 700 : 400, color: "#1a1a18" }}>InstaPay</span>
              </div>
              {payMethod === "instapay" ? <ChevronUp size={16} style={{ color: "#8a8a7a" }} /> : <ChevronDown size={16} style={{ color: "#8a8a7a" }} />}
            </button>
            {payMethod === "instapay" && (
              <div style={detailBox}>
                <p style={{ fontSize: 13, color: "#8a8a7a", margin: "0 0 8px" }}>حوّل عبر InstaPay إلى:</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#1a1a18", margin: "0 0 6px" }}>blanko@instapay</p>
                <p style={{ fontSize: 12, color: "#8a8a7a", margin: 0 }}>بعد التحويل سيتم مراجعة الدفع وتأكيد الطلب.</p>
              </div>
            )}
          </div>

          {/* Bank Transfer */}
          <div style={{ border: "1.5px solid", borderRadius: 2, overflow: "hidden", borderColor: payMethod === "bank" ? "#0ea5e9" : "rgba(0,0,0,0.1)", transition: "border-color 0.2s" }}>
            <button onClick={() => toggle("bank")} style={{ ...rowStyle(payMethod === "bank") }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Building2 size={17} style={{ color: "#0ea5e9" }} strokeWidth={1.5} />
                <span style={{ fontSize: 14, fontWeight: payMethod === "bank" ? 700 : 400, color: "#1a1a18" }}>تحويل بنكي</span>
              </div>
              {payMethod === "bank" ? <ChevronUp size={16} style={{ color: "#8a8a7a" }} /> : <ChevronDown size={16} style={{ color: "#8a8a7a" }} />}
            </button>
            {payMethod === "bank" && (
              <div style={detailBox}>
                <p style={{ fontSize: 13, color: "#8a8a7a", margin: "0 0 6px" }}>البنك: بنك مصر</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#1a1a18", margin: "0 0 6px", letterSpacing: "0.04em" }}>1234567890123456</p>
                <p style={{ fontSize: 13, color: "#8a8a7a", margin: "0 0 6px" }}>اسم الحساب: Blanko Fashion House</p>
                <p style={{ fontSize: 12, color: "#8a8a7a", margin: 0 }}>أرسل صورة التحويل على الواتساب لتأكيد الطلب.</p>
              </div>
            )}
          </div>

          {/* Credit Card */}
          <div style={{ border: "1.5px solid", borderRadius: 2, overflow: "hidden", borderColor: payMethod === "card" ? "#f59e0b" : "rgba(0,0,0,0.1)", transition: "border-color 0.2s" }}>
            <button onClick={() => toggle("card")} style={{ ...rowStyle(payMethod === "card") }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CreditCard size={17} style={{ color: "#f59e0b" }} strokeWidth={1.5} />
                <span style={{ fontSize: 14, fontWeight: payMethod === "card" ? 700 : 400, color: "#1a1a18" }}>
                  بطاقة بنكية (Visa / Mastercard)
                </span>
              </div>
              {payMethod === "card" ? <ChevronUp size={16} style={{ color: "#8a8a7a" }} /> : <ChevronDown size={16} style={{ color: "#8a8a7a" }} />}
            </button>
            {payMethod === "card" && (
              <div style={{ ...detailBox, display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={fieldLabel}>اسم صاحب البطاقة</label>
                  <input value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} placeholder="الاسم كما يظهر على البطاقة" className={inputCls} />
                </div>
                <div>
                  <label style={fieldLabel}>رقم البطاقة</label>
                  <input value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} placeholder="0000 0000 0000 0000" maxLength={19} className={inputCls} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={fieldLabel}>تاريخ الانتهاء</label>
                    <input value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} placeholder="MM/YY" maxLength={7} className={inputCls} />
                  </div>
                  <div>
                    <label style={fieldLabel}>رمز CVV</label>
                    <input value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} placeholder="123" maxLength={4} className={inputCls} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Buttons ─── */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => setStep(1)}
          style={{ padding: "14px 24px", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", background: "transparent", border: "1.5px solid rgba(0,0,0,0.15)", borderRadius: 2, cursor: "pointer", color: "#1a1a18", transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f7f4ee"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          عودة
        </button>

        <button
          onClick={handlePlaceOrder}
          disabled={placing || !payMethod || (payMethod === "card" && (!card.name || !card.number || !card.expiry || !card.cvv))}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            padding: "14px 24px", fontSize: 13, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
            background: placing || !payMethod ? "#e2e8f0" : "#0f172a",
            color: placing || !payMethod ? "#94a3b8" : "#ffffff",
            border: "none", borderRadius: 2, cursor: placing || !payMethod ? "not-allowed" : "pointer",
            transition: "all 0.25s",
          }}
          onMouseEnter={e => { if (!placing && payMethod) (e.currentTarget as HTMLButtonElement).style.background = "#1e293b"; }}
          onMouseLeave={e => { if (!placing && payMethod) (e.currentTarget as HTMLButtonElement).style.background = "#0f172a"; }}
        >
          {payMethod === "deposit" ? <MessageCircle size={16} strokeWidth={2} /> : null}
          {placing ? "جاري إتمام الطلب…" : `إتمام الطلب · ${total.toLocaleString("en-US")} LE`}
        </button>
      </div>

      <style>{`
        @keyframes accFade { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        @media(max-width:480px){
          .acc-grid { grid-template-columns:1fr !important; }
        }
      `}</style>
    </>
  );
}

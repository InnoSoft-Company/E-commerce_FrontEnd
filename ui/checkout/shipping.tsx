"use client";
import { useState, useEffect } from "react";
import { Truck, User, Mail, Phone, MapPin, Package } from "lucide-react";
import PaymentMethod from "./payment-method";
import { fetchShippingZones, getShippingFee, enabledZones, type ShippingZone } from "@/src/data/shippingZones";

export default function Shipping({
  shipping,
  setShipping,
  inputCls,
  setStep,
  setOrderPlaced,
  setShippingFee,
}: {
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
  };
  setShipping: (s: any) => void;
  inputCls: string;
  setStep: (step: 2) => void;
  setOrderPlaced: (p: boolean) => void;
  setShippingFee: (fee: number) => void;
}) {
  const [zones, setZones] = useState<ShippingZone[]>(enabledZones);

  // جيب الـ zones من الـ backend
  useEffect(() => {
    fetchShippingZones().then(setZones);
  }, []);

  const shippingFee = shipping.city ? getShippingFee(shipping.city, zones) : 0;

  // Update parent component when shipping fee changes
  useEffect(() => {
    setShippingFee(shippingFee);
  }, [shippingFee, setShippingFee]);

  const L = ({ c }: { c: string }) => (
    <label style={{
      display: "block", fontSize: 11, fontWeight: 800,
      letterSpacing: "0.24em", textTransform: "uppercase" as const,
      color: "rgba(255,255,255,0.45)", marginBottom: 10,
    }}>
      {c}
    </label>
  );

  const iconStyle = {
    position: "absolute" as const,
    right: 15, top: "50%", transform: "translateY(-50%)",
    color: "rgba(255,255,255,0.28)", pointerEvents: "none" as const,
  };

  return (
    <>
      {/* ── Header ─── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "rgba(245,158,11,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Truck size={18} style={{ color: "#f59e0b" }} strokeWidth={2} />
        </div>
        <h2 style={{
          fontFamily: "var(--font-cormorant,Georgia,serif)", fontSize: "1.6rem",
          fontWeight: 800, color: "#ffffff", margin: 0,
        }}>
          معلومات الشحن
        </h2>
      </div>

      {/* ── Fields ─── */}
      <div className="shipping-grid" style={{ marginBottom: 36 }}>

        <div>
          <L c="الاسم الأول" />
          <div style={{ position: "relative" }}>
            <User size={14} style={iconStyle} />
            <input type="text" value={shipping.firstName}
              onChange={e => setShipping({ ...shipping, firstName: e.target.value })}
              placeholder="الاسم الأول" className="input-field" style={{ paddingRight: 42 }} />
          </div>
        </div>

        <div>
          <L c="اسم العائلة" />
          <div style={{ position: "relative" }}>
            <User size={14} style={iconStyle} />
            <input type="text" value={shipping.lastName}
              onChange={e => setShipping({ ...shipping, lastName: e.target.value })}
              placeholder="اسم العائلة" className="input-field" style={{ paddingRight: 42 }} />
          </div>
        </div>

        <div style={{ gridColumn: "span 2" }}>
          <L c="البريد الإلكتروني" />
          <div style={{ position: "relative" }}>
            <Mail size={14} style={iconStyle} />
            <input type="email" value={shipping.email}
              onChange={e => setShipping({ ...shipping, email: e.target.value })}
              placeholder="البريد الإلكتروني (اختياري)" className="input-field" style={{ paddingRight: 42 }} />
          </div>
        </div>

        <div style={{ gridColumn: "span 2" }}>
          <L c="رقم الهاتف" />
          <div style={{ position: "relative" }}>
            <Phone size={14} style={iconStyle} />
            <input type="tel" value={shipping.phone}
              onChange={e => setShipping({ ...shipping, phone: e.target.value })}
              placeholder="رقم الهاتف" className="input-field" style={{ paddingRight: 42 }} />
          </div>
        </div>

        <div style={{ gridColumn: "span 2" }}>
          <L c="العنوان بالتفصيل" />
          <div style={{ position: "relative" }}>
            <MapPin size={14} style={iconStyle} />
            <input type="text" value={shipping.address}
              onChange={e => setShipping({ ...shipping, address: e.target.value })}
              placeholder="الشارع، الحي، رقم المبنى..." className="input-field" style={{ paddingRight: 42 }} />
          </div>
        </div>

        {/* ── المحافظة — select يجيب من الـ backend ── */}
        <div style={{ gridColumn: "span 2" }}>
          <L c="المحافظة" />
          <div style={{ position: "relative" }}>
            <MapPin size={14} style={iconStyle} />
            <select
              value={shipping.city}
              onChange={e => setShipping({ ...shipping, city: e.target.value })}
              className="input-field"
              style={{ paddingRight: 42, appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}
            >
              <option value="" disabled>اختر المحافظة...</option>
              {zones.map(zone => (
                <option key={zone.governorate} value={zone.governorate}>
                  {zone.governorate} — {zone.fee} ج.م
                </option>
              ))}
            </select>
            <div style={{
              position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)",
              pointerEvents: "none", color: "rgba(255,255,255,0.4)", fontSize: 10,
            }}>▾</div>
          </div>

          {/* بادج سعر الشحن */}
          {shipping.city && (
            <div style={{
              marginTop: 10, display: "inline-flex", alignItems: "center", gap: 7,
              padding: "6px 14px", borderRadius: 20,
              background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)",
            }}>
              <Package size={13} style={{ color: "#f59e0b" }} strokeWidth={2} />
              <span style={{ fontSize: 12, color: "#fcd34d", fontWeight: 700 }}>
                رسوم الشحن إلى {shipping.city}: <span style={{ fontSize: 14 }}>{shippingFee} ج.م</span>
              </span>
            </div>
          )}
        </div>

        <div>
          <L c="الرمز البريدي" />
          <div style={{ position: "relative" }}>
            <MapPin size={14} style={iconStyle} />
            <input type="text" value={shipping.zip}
              onChange={e => setShipping({ ...shipping, zip: e.target.value })}
              placeholder="الرمز البريدي (اختياري)" className="input-field" style={{ paddingRight: 42 }} />
          </div>
        </div>

      </div>

      {/* ── Payment ─── */}
      <PaymentMethod
        setStep={setStep}
        setOrderPlaced={setOrderPlaced}
        shippingName={`${shipping.firstName} ${shipping.lastName}`.trim()}
        shippingPhone={shipping.phone}
        shippingCity={shipping.city}
        shippingFeeOverride={shippingFee}
      />

      <style>{`
        .shipping-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 20px; }
        .input-field option { background: #1e293b; color: #ffffff; }
        @media(max-width:480px){
          .shipping-grid { grid-template-columns: 1fr !important; }
          .shipping-grid > div { grid-column: span 1 !important; }
        }
      `}</style>
    </>
  );
}

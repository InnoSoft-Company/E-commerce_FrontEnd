"use client";
import { useState, useEffect } from "react";
import { Save, Check, Store, Truck, MessageCircle, CreditCard, Loader2 } from "lucide-react";
import { adminApi } from "@/src/lib/api";

const DEFAULT: Record<string,string> = {
  store_name:"Blanko Fashion House", store_email:"info@blanko.com",
  store_phone:"+20 100 000 0000",    store_address:"القاهرة، مصر",
  wa_number:"201000000000",          free_shipping_min:"100",
  shipping_fee:"10",                 tax_rate:"10",
  vodafone_num:"010XXXXXXXX",        instapay_id:"blanko@instapay",
  bank_account:"1234567890123456",   bank_name:"بنك مصر",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string,string>>(DEFAULT);
  const [saved,    setSaved]    = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    adminApi.getSettings()
      .then(data => setSettings({ ...DEFAULT, ...data }))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      setSaved(true); setTimeout(()=>setSaved(false), 2500);
    } catch { alert("حدث خطأ عند الحفظ"); }
    finally  { setSaving(false); }
  };

  const F = ({ label, field, type="text", placeholder="" }: { label:string; field:string; type?:string; placeholder?:string }) => (
    <div>
      <label style={{ display:"block", fontSize:10, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase" as const, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>{label}</label>
      <input type={type} value={settings[field]??""} placeholder={placeholder}
        onChange={e=>setSettings({...settings,[field]:e.target.value})}
        className="input-field" style={{ fontSize:13 }}/>
    </div>
  );

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", padding:60 }}>
      <Loader2 size={28} style={{ color:"rgba(245,158,11,0.6)", animation:"spin 1s linear infinite" }}/>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:22 }}>
        <p className="section-tag" style={{ marginBottom:8 }}>الإدارة</p>
        <h2 style={{ color:"#ffffff", margin:"0 0 4px", fontSize:"clamp(1.4rem,3vw,2rem)" }}>إعدادات المتجر</h2>
        <p style={{ color:"rgba(255,255,255,0.38)", fontSize:13, margin:0 }}>تحكم في كل إعدادات المتجر</p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {/* Store info */}
        <div className="admin-card">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:34, height:34, borderRadius:8, background:"rgba(245,158,11,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}><Store size={16} style={{ color:"#f59e0b" }} strokeWidth={2}/></div>
            <h3 style={{ color:"#ffffff", fontSize:"1rem", fontWeight:700, margin:0 }}>معلومات المتجر</h3>
          </div>
          <div className="settings-grid">
            <F label="اسم المتجر"        field="store_name"/>
            <F label="البريد الإلكتروني" field="store_email" type="email"/>
            <F label="رقم الهاتف"        field="store_phone"/>
            <F label="العنوان"            field="store_address"/>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="admin-card">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:34, height:34, borderRadius:8, background:"rgba(37,211,102,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}><MessageCircle size={16} style={{ color:"#25D366" }} strokeWidth={2}/></div>
            <h3 style={{ color:"#ffffff", fontSize:"1rem", fontWeight:700, margin:0 }}>واتساب</h3>
          </div>
          <div className="settings-grid">
            <F label="رقم واتساب المتجر (بدون +)" field="wa_number" placeholder="201000000000"/>
          </div>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.28)", marginTop:10 }}>💡 هذا الرقم يُستخدم لطلبات الدفع عند الاستلام</p>
        </div>

        {/* Shipping */}
        <div className="admin-card">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:34, height:34, borderRadius:8, background:"rgba(96,165,250,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}><Truck size={16} style={{ color:"#60a5fa" }} strokeWidth={2}/></div>
            <h3 style={{ color:"#ffffff", fontSize:"1rem", fontWeight:700, margin:0 }}>الشحن والضرائب</h3>
          </div>
          <div className="settings-grid">
            <F label="الحد الأدنى للشحن المجاني ($)" field="free_shipping_min" type="number"/>
            <F label="رسوم الشحن ($)"                 field="shipping_fee"      type="number"/>
            <F label="نسبة الضريبة (%)"               field="tax_rate"          type="number"/>
          </div>
        </div>

        {/* Payment */}
        <div className="admin-card">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:34, height:34, borderRadius:8, background:"rgba(192,132,252,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}><CreditCard size={16} style={{ color:"#c084fc" }} strokeWidth={2}/></div>
            <h3 style={{ color:"#ffffff", fontSize:"1rem", fontWeight:700, margin:0 }}>بيانات الدفع الأونلاين</h3>
          </div>
          <div className="settings-grid">
            <F label="رقم Vodafone Cash" field="vodafone_num"  placeholder="010XXXXXXXX"/>
            <F label="معرف InstaPay"     field="instapay_id"   placeholder="blanko@instapay"/>
            <F label="رقم الحساب البنكي" field="bank_account"  placeholder="16 رقم"/>
            <F label="اسم البنك"         field="bank_name"/>
          </div>
        </div>
      </div>

      <div style={{ marginTop:22, display:"flex", justifyContent:"flex-end" }}>
        <button onClick={handleSave} disabled={saving} className="btn-admin" style={{ fontSize:13, padding:"13px 32px" }}>
          {saving ? <><Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/> جارٍ الحفظ...</> :
           saved  ? <><Check size={14}/> تم الحفظ!</>   :
                    <><Save size={14}/> حفظ الإعدادات</>}
        </button>
      </div>

      <style>{`
        .settings-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px 18px; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:560px){ .settings-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}

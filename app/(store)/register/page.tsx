"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, Phone, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm]       = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("كلمتا المرور غير متطابقتين"); return; }
    if (form.password.length < 6)       { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    setLoading(true); setError("");
    try {
      const nameParts = form.name.trim().split(" ");
      await register({
        username:   form.email,  // use email as username so login works directly
        email:      form.email,
        first_name: nameParts[0] || "",
        last_name:  nameParts.slice(1).join(" ") || "",
        phone:      form.phone,
        password:   form.password,
        password2:  form.confirm,
      });
      router.push("/");
    } catch (err: any) {
      const d = err?.data || {};
      const msg = d.email?.[0] || d.username?.[0] || d.password?.[0] || d.non_field_errors?.[0] || "حدث خطأ، حاول مجدداً";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const L = ({ c }: { c: string }) => (
    <label style={{ display:"block", fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase" as const, color:"rgba(255,255,255,0.45)", marginBottom:10 }}>{c}</label>
  );

  const fields = [
    { k:"name",  l:"الاسم الكامل",      t:"text",  p:"اسمك الكامل",        Icon:User  },
    { k:"email", l:"البريد الإلكتروني", t:"email", p:"example@blanko.com", Icon:Mail  },
    { k:"phone", l:"رقم الهاتف",        t:"tel",   p:"+20 100 000 0000",   Icon:Phone },
  ];

  return (
    <div className="reg-wrap">
      {/* Image */}
      <div className="reg-img-side">
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=85"
          alt="" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(15,23,42,0.82) 0%,rgba(15,23,42,0.4) 100%)" }} />
        <div style={{ position:"absolute", bottom:56, right:48 }}>
          <p className="section-tag" style={{ marginBottom:14, color:"#f59e0b" }}>انضمي إلينا</p>
          <h2 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"3rem", fontWeight:800, color:"#ffffff", lineHeight:1.05 }}>
            ابدئي رحلة<br />أسلوبك.
          </h2>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.48)", marginTop:14, lineHeight:1.75 }}>
            انضمي لأكثر من 50,000 عميل يثقون في بلانكو.
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 36px", background:"#0f172a" }}>
        <div style={{ width:"100%", maxWidth:440 }}>
          <div style={{ marginBottom:32 }}>
            <p className="section-tag" style={{ marginBottom:12 }}>حساب جديد</p>
            <h1 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"2.4rem", fontWeight:800, color:"#ffffff", margin:"0 0 10px", lineHeight:1 }}>إنشاء حساب</h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)" }}>
              لديك حساب بالفعل؟{" "}
              <Link href="/login" style={{ color:"#f59e0b", fontWeight:700, textDecoration:"none" }}>تسجيل الدخول</Link>
            </p>
          </div>

          {error && (
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, marginBottom:20 }}>
              <AlertCircle size={15} style={{ color:"#f87171", flexShrink:0 }} />
              <p style={{ fontSize:13, color:"#f87171", margin:0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {fields.map(f => (
              <div key={f.k}>
                <L c={f.l} />
                <div style={{ position:"relative" }}>
                  <f.Icon size={14} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.28)" }} />
                  <input type={f.t} required value={form[f.k as keyof typeof form]}
                    onChange={e=>setForm({...form,[f.k]:e.target.value})}
                    placeholder={f.p} className="input-field" style={{ paddingRight:44 }} />
                </div>
              </div>
            ))}

            <div>
              <L c="كلمة المرور" />
              <div style={{ position:"relative" }}>
                <Lock size={14} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.28)" }} />
                <input type={showPwd?"text":"password"} required value={form.password}
                  onChange={e=>setForm({...form,password:e.target.value})}
                  placeholder="6 أحرف على الأقل" className="input-field" style={{ paddingRight:44 }} />
                <button type="button" onClick={()=>setShowPwd(!showPwd)}
                  style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.35)" }}>
                  {showPwd?<EyeOff size={14}/>:<Eye size={14}/>}
                </button>
              </div>
            </div>

            <div>
              <L c="تأكيد كلمة المرور" />
              <div style={{ position:"relative" }}>
                <Lock size={14} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.28)" }} />
                <input type="password" required value={form.confirm}
                  onChange={e=>setForm({...form,confirm:e.target.value})}
                  placeholder="أعد كتابة كلمة المرور" className="input-field" style={{ paddingRight:44 }} />
              </div>
            </div>

            <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)", lineHeight:1.7 }}>
              بإنشاء حساب، فإنك توافق على{" "}
              <Link href="/privacy" style={{ color:"#f59e0b", textDecoration:"none" }}>الشروط والأحكام</Link>
            </p>

            <button type="submit" disabled={loading} className="btn-gold" style={{ justifyContent:"center", opacity:loading?0.7:1, fontSize:13, marginTop:4 }}>
              {loading ? "جارٍ الإنشاء..." : <><span>إنشاء الحساب</span><ArrowRight size={16}/></>}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .reg-wrap { min-height:calc(100vh - 112px); display:grid; grid-template-columns:1fr 1fr; }
        .reg-img-side { position:relative; overflow:hidden; }
        @media(max-width:900px){ .reg-wrap { grid-template-columns:1fr; } .reg-img-side { display:none; } }
      `}</style>
    </div>
  );
}

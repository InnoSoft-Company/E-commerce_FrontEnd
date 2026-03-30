"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Eye, EyeOff, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const isAdmin = await login(form.email, form.password);
      router.push(isAdmin ? "/admin" : "/");
    } catch (err: any) {
      const msg = err?.data?.detail || err?.data?.non_field_errors?.[0] || "بيانات الدخول غير صحيحة";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const L = ({ c }: { c: string }) => (
    <label style={{ display:"block", fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase" as const, color:"rgba(255,255,255,0.5)", marginBottom:10 }}>{c}</label>
  );

  return (
    <div className="login-wrap">
      {/* Image side */}
      <div className="login-img-side">
        <Image fill src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=85" alt="" style={{ objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(15,23,42,0.88) 0%,rgba(15,23,42,0.45) 100%)" }} />
        <div style={{ position:"absolute", bottom:56, left:48, right:48 }}>
          <p className="section-tag" style={{ marginBottom:14, color:"#f59e0b" }}>مرحبًا بعودتك</p>
          <h2 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"3rem", fontWeight:800, color:"#ffffff", lineHeight:1.05 }}>
            أسلوبك،<br />قصتك.
          </h2>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", marginTop:14, lineHeight:1.75 }}>
            سجّلي دخولك واستمتعي بتجربة تسوق استثنائية مع بلانكو.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 36px", background:"#0f172a" }}>
        <div style={{ width:"100%", maxWidth:420 }}>
          <div style={{ marginBottom:36 }}>
            <p className="section-tag" style={{ marginBottom:12 }}>تسجيل الدخول</p>
            <h1 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"2.6rem", fontWeight:800, color:"#ffffff", margin:"0 0 10px", lineHeight:1 }}>أهلًا بك</h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)" }}>
              لا تملك حسابًا؟{" "}
              <Link href="/register" style={{ color:"#f59e0b", fontWeight:700, textDecoration:"none" }}>أنشئ حسابًا جديدًا</Link>
            </p>
          </div>

          {error && (
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, marginBottom:22 }}>
              <AlertCircle size={15} style={{ color:"#f87171", flexShrink:0 }} />
              <p style={{ fontSize:13, color:"#f87171", margin:0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div>
              <L c="البريد الإلكتروني" />
              <div style={{ position:"relative" }}>
                <Mail size={15} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)" }} />
                <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                  placeholder="example@blanko.com" className="input-field" style={{ paddingRight:44 }} />
              </div>
            </div>
            <div>
              <L c="كلمة المرور" />
              <div style={{ position:"relative" }}>
                <Lock size={15} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)" }} />
                <input type={showPwd?"text":"password"} required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                  placeholder="••••••••" className="input-field" style={{ paddingRight:44 }} />
                <button type="button" onClick={()=>setShowPwd(!showPwd)}
                  style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.38)" }}>
                  {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{ justifyContent:"center", opacity:loading?0.7:1, fontSize:13, marginTop:4 }}>
              {loading ? "جارٍ تسجيل الدخول..." : <><span>تسجيل الدخول</span><ArrowRight size={16}/></>}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .login-wrap { min-height:calc(100vh - 110px); display:grid; grid-template-columns:1fr 1fr; }
        .login-img-side { position:relative; overflow:hidden; }
        @media(max-width:900px){ .login-wrap { grid-template-columns:1fr; } .login-img-side { display:none; } }
      `}</style>
    </div>
  );
}

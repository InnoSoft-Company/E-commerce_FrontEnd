"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { Package, Heart, Check, User, Mail, Phone, MapPin, Camera, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "",
    phone: "", address: "", city: "", country: "مصر",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated]);

  // Populate form from user
  useEffect(() => {
    if (user) setForm({
      first_name: user.first_name || "",
      last_name:  user.last_name  || "",
      email:      user.email      || "",
      phone:      user.phone      || "",
      address:    user.address    || "",
      city:       user.city       || "",
      country:    user.country    || "مصر",
    });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      await updateUser(form);
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError("حدث خطأ عند الحفظ. حاول مجدداً.");
    } finally { setSaving(false); }
  };

  if (authLoading || !user) return (
    <div style={{ background:"#0f172a", minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Loader2 size={28} style={{ color:"rgba(245,158,11,0.6)", animation:"spin 1s linear infinite" }}/>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const initials = [form.first_name, form.last_name].filter(Boolean).map(s=>s[0]).join("").toUpperCase() || user.username?.[0]?.toUpperCase() || "م";
  const fullName = [form.first_name, form.last_name].filter(Boolean).join(" ") || user.username;

  const L = ({ c }: { c: string }) => (
    <label style={{ display:"block", fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase" as const, color:"rgba(255,255,255,0.45)", marginBottom:10 }}>{c}</label>
  );

  return (
    <>
      <div style={{ background:"#0f172a", minHeight:"calc(100vh - 112px)", paddingBottom:60 }}>

        {/* Header */}
        <div style={{ background:"#1e293b", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"36px 24px 0" }}>
            <p className="section-tag" style={{ marginBottom:10 }}>الحساب</p>
            <h1 style={{ color:"#ffffff", margin:"0", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700 }}>ملفي الشخصي</h1>
            <div style={{ display:"flex", marginTop:22 }}>
              <div style={{ padding:"12px 22px", fontSize:13, fontWeight:700, letterSpacing:"0.08em", color:"#f59e0b", borderBottom:"2.5px solid #f59e0b" }}>
                المعلومات الشخصية
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
          <div className="profile-layout">

            {/* Sidebar */}
            <div style={{ background:"#1e293b", border:"1.5px solid rgba(255,255,255,0.07)", borderRadius:18, overflow:"hidden", alignSelf:"flex-start" }}>
              <div style={{ height:3, background:"linear-gradient(90deg,#f59e0b,#fcd34d,#d97706)" }}/>
              <div style={{ padding:"28px 22px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
                {/* Avatar */}
                <div style={{ position:"relative", marginBottom:16 }}>
                  <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:"#0f172a", boxShadow:"0 8px 24px rgba(245,158,11,0.38)" }}>
                    {initials}
                  </div>
                  <div style={{ position:"absolute", bottom:-2, right:-2, width:26, height:26, borderRadius:"50%", background:"#0f172a", border:"2px solid #f59e0b", display:"flex", alignItems:"center", justifyContent:"center", color:"#f59e0b", cursor:"pointer" }}>
                    <Camera size={12} strokeWidth={2}/>
                  </div>
                </div>
                <p style={{ fontSize:16, fontWeight:700, color:"#ffffff", margin:"0 0 3px" }}>{fullName}</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", margin:"0 0 20px" }}>{form.email || user.email}</p>

                {/* Stats */}
                <div style={{ width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                  {[{ v:"–", l:"الطلبات" }, { v:"–", l:"المفضلة" }].map(s => (
                    <div key={s.l} style={{ background:"rgba(255,255,255,0.05)", borderRadius:10, padding:"12px 8px", textAlign:"center" }}>
                      <p style={{ fontSize:"1.4rem", fontWeight:800, color:"#f59e0b", margin:0, lineHeight:1 }}>{s.v}</p>
                      <p style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.32)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"5px 0 0" }}>{s.l}</p>
                    </div>
                  ))}
                </div>

                {/* Quick links */}
                <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:8 }}>
                  {[
                    { href:"/orders",   Icon:Package, l:"طلباتي" },
                    { href:"/wishlist", Icon:Heart,   l:"المفضلة" },
                  ].map(({ href, Icon, l }) => (
                    <Link key={href} href={href}
                      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 14px", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.07)", borderRadius:10, textDecoration:"none", transition:"all 0.22s" }}
                      onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background="rgba(245,158,11,0.1)";el.style.borderColor="rgba(245,158,11,0.22)"}}
                      onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background="rgba(255,255,255,0.05)";el.style.borderColor="rgba(255,255,255,0.07)"}}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Icon size={14} style={{ color:"rgba(255,255,255,0.45)" }} strokeWidth={2}/>
                        <span style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.6)" }}>{l}</span>
                      </div>
                      <ArrowRight size={12} style={{ color:"rgba(255,255,255,0.25)" }}/>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ background:"#1e293b", border:"1.5px solid rgba(255,255,255,0.07)", borderRadius:18, overflow:"hidden" }}>
              <div style={{ height:3, background:"linear-gradient(90deg,#f59e0b,#fcd34d,transparent)" }}/>
              <div style={{ padding:"30px 26px" }}>
                {error && (
                  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 16px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, marginBottom:22 }}>
                    <AlertCircle size={14} style={{ color:"#f87171", flexShrink:0 }}/>
                    <p style={{ fontSize:13, color:"#f87171", margin:0 }}>{error}</p>
                  </div>
                )}
                <form onSubmit={handleSave}>
                  <h3 style={{ color:"#ffffff", fontSize:"1.25rem", fontWeight:700, margin:"0 0 24px" }}>المعلومات الشخصية</h3>
                  <div className="profile-form-grid">
                    {[
                      { k:"first_name", l:"الاسم الأول",          Icon:User,   full:false },
                      { k:"last_name",  l:"اسم العائلة",           Icon:User,   full:false },
                      { k:"email",      l:"البريد الإلكتروني",     Icon:Mail,   full:false },
                      { k:"phone",      l:"رقم الهاتف",            Icon:Phone,  full:false },
                      { k:"city",       l:"المدينة",               Icon:MapPin, full:false },
                      { k:"country",    l:"البلد",                 Icon:MapPin, full:false },
                      { k:"address",    l:"العنوان بالتفصيل",      Icon:MapPin, full:true  },
                    ].map(f => (
                      <div key={f.k} style={{ gridColumn: f.full?"span 2":"auto" }} className={f.full?"full-col":""}>
                        <L c={f.l}/>
                        <div style={{ position:"relative" }}>
                          <f.Icon size={13} style={{ position:"absolute", right:15, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.25)" }}/>
                          <input type={f.k==="email"?"email":"text"} value={form[f.k as keyof typeof form]}
                            onChange={e=>setForm({...form,[f.k]:e.target.value})}
                            className="input-field" style={{ paddingRight:40 }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="submit" disabled={saving} className="btn-gold" style={{ fontSize:13, marginTop:24 }}>
                    {saving ? <><Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/> جارٍ الحفظ...</> :
                     saved  ? <><Check size={14}/> تم الحفظ!</>   : "حفظ التغييرات"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-layout { display:grid; grid-template-columns:260px 1fr; gap:22px; align-items:flex-start; }
        .profile-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px 20px; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:900px){ .profile-layout { grid-template-columns:1fr; } }
        @media(max-width:560px){ .profile-form-grid { grid-template-columns:1fr; } .full-col { grid-column:span 1 !important; } }
      `}</style>
    </>
  );
}

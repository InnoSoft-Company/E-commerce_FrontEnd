"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Zap, Award, Target, Eye, Sparkles, ArrowRight, Users, Star, Package, MessageCircle } from "lucide-react";

// const stats = [
//   { value: "٥٠٠+", label: "منتج فاخر" },
//   { value: "٥٠ألف", label: "عميل سعيد" },
//   { value: "٤.٩★", label: "تقييم متوسط" },
//   { value: "٢٠٢٢", label: "سنة التأسيس" },
// ];

const values = [
  {
    Icon: Target,
    title: "مهمتنا",
    desc: "توفير أزياء عالية الجودة تجمع بين الأناقة والراحة، مع تجربة تسوق سلسة تفوق التوقعات في كل خطوة.",
    color: "#f59e0b",
  },
  {
    Icon: Eye,
    title: "رؤيتنا",
    desc: "أن نكون الوجهة الأولى للأزياء الراقية في المنطقة، حيث يشعر كل عميل بأنه استثنائي وقيّم حقاً.",
    color: "#60a5fa",
  },
  {
    Icon: Heart,
    title: "قيمنا",
    desc: "الجودة قبل الكمية، احترام عملائنا، الابتكار المستمر، والمسؤولية تجاه المجتمع والبيئة دائماً.",
    color: "#34d399",
  },
];

const whyUs = [
  { Icon: Package, title: "جودة مضمونة",     desc: "كل قطعة تمر بمعايير صارمة للجودة قبل وصولها إليك." },
  { Icon: Zap,     title: "توصيل سريع",      desc: "نوصل طلبك خلال 24–48 ساعة في أنحاء الجمهورية." },
  { Icon: Heart,   title: "خدمة استثنائية",  desc: "فريقنا متاح 7 أيام لمساعدتك بكل ترحيب واهتمام." },
  { Icon: Award,   title: "تصاميم عصرية",    desc: "نتابع أحدث الاتجاهات العالمية ونختار ما يناسبك." },
];

const team = [
  { name: "نور الهدى", role: "المدير الإبداعي",  init: "ن", color: "#f59e0b" },
  { name: "أحمد سمير", role: "مدير العمليات",    init: "أ", color: "#60a5fa" },
  { name: "دينا مصطفى", role: "مديرة خدمة العملاء", init: "د", color: "#34d399" },
];

export default function AboutPage() {
  return (
    <>
      <div style={{ background: "#ffffff", color: "#0f172a", minHeight: "100vh" }}>

        {/* ── Hero ── */}
        <section className="about-hero">
          <Image fill src="/images/site-banner.jpg" alt="BLANKO" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.65) 55%, rgba(15,23,42,0.3) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(245,158,11,0.18), transparent 60%)" }} />

          <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%", textAlign: "center" }}>
            <div className="about-hero-badge animate-slide-right">
              <Sparkles size={13} style={{ color: "#fcd34d" }} />
              <span>منذ 2022 — قصة أناقة مستمرة</span>
            </div>
            <h1 className="about-hero-h1 animate-fade-up delay-100">
              قصتنا
            </h1>
            <p className="about-hero-sub animate-fade-up delay-200">
              أكثر من مجرد تجربة تسوق — رحلة أناقة حقيقية مع BLANKO
            </p>

            {/* Stats */}
            {/* <div className="about-stats animate-fade-up delay-300">
              {stats.map(s => (
                <div key={s.label} className="about-stat">
                  <p className="about-stat-val">{s.value}</p>
                  <p className="about-stat-lbl">{s.label}</p>
                </div>
              ))}
            </div> */}
          </div>
        </section>

        {/* ── Story section ── */}
        <section className="about-section">
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <div className="about-2col">
              {/* Image */}
              <div className="about-img-wrap">
                <div className="about-img-inner">
                  <Image fill sizes="(max-width:900px) 100vw, 50vw" src="/images/blanko.jpeg" alt="BLANKO" style={{ objectFit: "cover", transition: "transform 0.7s ease" }} className="about-img-hover" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(245,158,11,0.15), transparent)", opacity: 0, transition: "opacity 0.5s" }} className="about-img-overlay" />
                </div>
                <div className="about-img-badge">
                  ✓ تصاميم فاخرة
                </div>
                {/* Decorative ring */}
                <div style={{ position: "absolute", top: -16, right: -16, width: 120, height: 120, borderRadius: "50%", border: "2px dashed rgba(245,158,11,0.3)", pointerEvents: "none" }} />
              </div>

              {/* Text */}
              <div>
                <p className="section-tag" style={{ marginBottom: 16 }}>من نحن</p>
                <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginBottom: 24 }}>
                  BLANKO — حيث يلتقي الأسلوب بالجودة
                </h2>
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.9, marginBottom: 18 }}>
                  منذ تأسيسنا، آمنا أن الملابس ليست مجرد مظهر خارجي — بل هي تعبير عن هويتك وشخصيتك. في BLANKO، نختار كل قطعة بدقة واهتمام لضمان أنك تحصل على أفضل ما يمكن.
                </p>
                <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.9, marginBottom: 32 }}>
                  نحرص على توفير تجربة تسوق سلسة وممتعة، مع خدمة عملاء استثنائية تجعلك تشعر بالقيمة والاهتمام في كل خطوة.
                </p>
                <Link href="/shop" className="btn-gold" style={{ display: "inline-flex" }}>
                  استكشف المجموعة <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section style={{ background: "#f8fafc", padding: "72px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <p className="section-tag" style={{ justifyContent: "center", marginBottom: 14 }}>ما يحركنا</p>
              <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                رؤيتنا وقيمنا
              </h2>
            </div>
            <div className="about-values-grid">
              {values.map(v => (
                <div key={v.title} className="about-value-card"
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = v.color;
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 56px ${v.color}22`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: `${v.color}18`, marginBottom: 20 }}>
                    <v.Icon size={26} style={{ color: v.color }} strokeWidth={1.8} />
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>{v.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, margin: 0 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why us — dark section ── */}
        <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "72px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <p className="section-tag" style={{ justifyContent: "center", marginBottom: 14 }}>لماذا BLANKO</p>
              <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                ما يميزنا عن الآخرين
              </h2>
            </div>
            <div className="about-why-grid">
              {whyUs.map((item, i) => (
                <div key={item.title} className="about-why-card"
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,158,11,0.4)";
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(245,158,11,0.07)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, flexShrink: 0 }}>
                    <item.Icon size={22} style={{ color: "#f59e0b" }} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffffff", marginBottom: 8 }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section style={{ padding: "72px 0", background: "#ffffff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p className="section-tag" style={{ justifyContent: "center", marginBottom: 14 }}>فريقنا</p>
              <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                الأشخاص خلف BLANKO
              </h2>
            </div>
            <div className="about-team-grid">
              {team.map(m => (
                <div key={m.name} className="about-team-card">
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${m.color}, ${m.color}bb)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 auto 16px", boxShadow: `0 8px 24px ${m.color}44` }}>
                    {m.init}
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: 4, textAlign: "center" }}>{m.name}</h3>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center", margin: 0 }}>{m.role}</p>
                  <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 14 }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#f59e0b" style={{ color: "#f59e0b" }} strokeWidth={1} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", padding: "72px 24px", textAlign: "center", borderTop: "4px solid #f59e0b" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <p className="section-tag" style={{ justifyContent: "center", marginBottom: 16 }}>ابدأي الآن</p>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>
              جاهزة تبدأي رحلتك معنا؟
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", marginBottom: 36, lineHeight: 1.8, maxWidth: 480, margin: "0 auto 36px" }}>
              اكتشفي مجموعتنا الحصرية واستمتعي بتجربة تسوق فريدة لم تختبريها من قبل.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/shop" className="btn-gold">
                استكشفي المتجر <ArrowRight size={16} />
              </Link>
              <a href="https://wa.me/201000000000" target="_blank" rel="noopener" className="btn-ghost" style={{ display: "inline-flex" }}>
                <MessageCircle size={16} /> تواصلي معنا
              </a>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        /* Hero */
        .about-hero {
          position: relative;
          height: 520px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .about-hero-badge {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 8px 20px; border-radius: 100px;
          border: 1.5px solid rgba(245,158,11,0.4);
          background: rgba(245,158,11,0.1);
          backdrop-filter: blur(8px);
          margin-bottom: 20px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #fcd34d;
        }
        .about-hero-h1 {
          font-size: clamp(3rem, 9vw, 6rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          margin: 0 0 16px;
          background: linear-gradient(90deg, #ffffff 0%, #fcd34d 50%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .about-hero-sub {
          font-size: clamp(14px, 2vw, 18px);
          color: rgba(255,255,255,0.72);
          max-width: 500px;
          margin: 0 auto 36px;
          line-height: 1.75;
        }
        .about-stats {
          display: flex;
          gap: 32px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .about-stat-val {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          color: #fcd34d;
          line-height: 1;
          margin: 0;
        }
        .about-stat-lbl {
          font-size: 11px;
          color: rgba(255,255,255,0.42);
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin: 5px 0 0;
        }

        /* Story section */
        .about-section { padding: 72px 0; background: #ffffff; }
        .about-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .about-img-wrap { position: relative; }
        .about-img-inner {
          position: relative;
          height: 420px;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(15,23,42,0.18);
        }
        .about-img-inner:hover .about-img-hover { transform: scale(1.04); }
        .about-img-inner:hover .about-img-overlay { opacity: 1 !important; }
        .about-img-badge {
          position: absolute;
          bottom: 16px; left: 16px;
          background: #f59e0b; color: #0f172a;
          padding: 10px 22px; border-radius: 50px;
          font-size: 13px; font-weight: 800;
          box-shadow: 0 8px 28px rgba(245,158,11,0.4);
        }

        /* Values */
        .about-values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .about-value-card {
          background: #ffffff;
          padding: 32px 28px;
          border-radius: 16px;
          border: 2px solid #e2e8f0;
          transition: all 0.35s;
        }

        /* Why */
        .about-why-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .about-why-card {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          padding: 24px;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          transition: all 0.3s;
        }

        /* Team */
        .about-team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 800px;
          margin: 0 auto;
        }
        .about-team-card {
          background: #f8fafc;
          border: 2px solid #f1f5f9;
          border-radius: 16px;
          padding: 28px 20px;
          transition: all 0.3s;
        }
        .about-team-card:hover {
          border-color: #f59e0b;
          box-shadow: 0 12px 40px rgba(245,158,11,0.12);
          transform: translateY(-4px);
        }

        /* ── Responsive ── */
        @media(max-width:820px){
          .about-hero { height: 420px; }
          .about-2col { grid-template-columns: 1fr; gap: 36px; }
          .about-img-inner { height: 300px; }
          .about-values-grid { grid-template-columns: 1fr 1fr; }
          .about-why-grid { grid-template-columns: 1fr 1fr; }
          .about-team-grid { grid-template-columns: 1fr 1fr 1fr; }
        }
        @media(max-width:560px){
          .about-hero { height: 360px; }
          .about-stats { gap: 20px; }
          .about-values-grid { grid-template-columns: 1fr; }
          .about-why-grid { grid-template-columns: 1fr; }
          .about-team-grid { grid-template-columns: 1fr; max-width: 280px; }
          .about-value-card { padding: 24px 20px; }
          .about-why-card { padding: 18px; }
        }
      `}</style>
    </>
  );
}

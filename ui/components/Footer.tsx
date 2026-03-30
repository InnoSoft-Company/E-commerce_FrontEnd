"use client";
import Link from "next/link";
import { Instagram, Youtube, MapPin, Phone, MessageCircle } from "lucide-react";

export function Footer() {
  const wa = "https://wa.me/201000000000";

  return (
    <>
      <footer style={{ background: "#0f172a" }}>

        {/* WhatsApp CTA */}
        <div style={{ background: "#1e293b", borderBottom: "1px solid rgba(245,158,11,0.12)", padding: "24px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div className="footer-wa-row">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MessageCircle size={20} style={{ color: "#ffffff" }} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#ffffff", margin: "0 0 3px" }}>تواصلي معنا عبر واتساب</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>نرد خلال دقائق · من 9 صباحًا حتى 12 منتصف الليل</p>
                </div>
              </div>
              <a
                href={wa} target="_blank" rel="noopener"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "#25D366", color: "#ffffff", fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", borderRadius: 50, transition: "all 0.25s", flexShrink: 0 }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(37,211,102,0.4)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ""; (e.currentTarget as HTMLAnchorElement).style.boxShadow = ""; }}
              >
                <MessageCircle size={15} strokeWidth={2} /> ابدئي المحادثة
              </a>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 24px 36px" }}>
          <div className="footer-grid">

            {/* Brand */}
            <div className="footer-brand">
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: "var(--font-cormorant,Georgia,serif)", fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", letterSpacing: "0.35em", textTransform: "uppercase" }}>BLANKO</div>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.38em", textTransform: "uppercase", color: "#f59e0b", marginTop: 3 }}>Fashion House</div>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.8, marginBottom: 20, maxWidth: 230 }}>
                أزياء راقية للشخص المميز. مصنوعة بعناية، تُرتدى بثقة في كل مناسبة.
              </p>
              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                {[
                  { Icon: Instagram, href: "#", green: false },
                  { Icon: Youtube, href: "#", green: false },
                  { Icon: MessageCircle, href: wa, green: true },
                ].map(({ Icon, href, green }, i) => (
                  <a key={i} href={href} target={href !== "#" ? "_blank" : undefined} rel="noopener"
                    style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: green ? "#25D366" : "rgba(255,255,255,0.07)", border: green ? "none" : "1.5px solid rgba(255,255,255,0.1)", color: "#ffffff", textDecoration: "none", transition: "all 0.25s" }}
                    onMouseEnter={e => { if (!green) { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(245,158,11,0.15)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(245,158,11,0.4)"; } (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { if (!green) { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)"; } (e.currentTarget as HTMLAnchorElement).style.transform = ""; }}
                  >
                    <Icon size={14} strokeWidth={2} />
                  </a>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[{ Icon: MapPin, text: "القاهرة، مصر" }, { Icon: Phone, text: "+20 100 000 0000" }].map(({ Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                    <Icon size={12} style={{ flexShrink: 0, color: "rgba(245,158,11,0.6)" }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: "التشكيلات", items: [["نساء", "/shop?category=Women"], ["رجال", "/shop?category=Men"], ["أطفال", "/shop?category=Kids"], ["إكسسوارات", "/shop?category=Accessories"], ["كل المنتجات", "/shop"]] },
              { title: "حسابي", items: [["ملفي الشخصي", "/profile"], ["طلباتي", "/orders"], ["المفضلة", "/wishlist"], ["تسجيل الدخول", "/login"], ["إنشاء حساب", "/register"]] },
              { title: "مساعدة", items: [["الشحن والإرجاع", "#"], ["دليل المقاسات", "#"], ["الأسئلة الشائعة", "#"], ["سياسة الخصوصية", "/privacy"], ["تواصل معنا", "/contact-us"]] },
            ].map(section => (
              <div key={section.title}>
                <h4 style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.32em", textTransform: "uppercase", color: "#f59e0b", marginBottom: 18, marginTop: 0 }}>
                  {section.title}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                  {section.items.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href}
                        style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", textDecoration: "none", fontWeight: 400, display: "inline-block", transition: "all 0.2s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; (e.currentTarget as HTMLAnchorElement).style.paddingRight = "4px"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.38)"; (e.currentTarget as HTMLAnchorElement).style.paddingRight = "0"; }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "16px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }} className="footer-bottom">
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0 }}>
              © 2026 Blanko Fashion House. جميع الحقوق محفوظة.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {["Visa", "Mastercard", "Fawry", "Vodafone Cash"].map(m => (
                <span key={m} style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)", fontWeight: 700 }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        /* WA row */
        .footer-wa-row { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; }

        /* Main grid */
        .footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px 28px; }

        /* Bottom bar */
        .footer-bottom { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; }

        /* ── Tablet ── */
        @media(max-width:900px){
          .footer-grid { grid-template-columns:1fr 1fr; gap:32px 24px; }
          .footer-brand { grid-column:span 2; }
        }

        /* ── Mobile ── */
        @media(max-width:600px){
          .footer-grid { grid-template-columns:1fr 1fr; gap:28px 20px; }
          .footer-brand { grid-column:span 2; }
          .footer-wa-row { flex-direction:column; align-items:flex-start; }
          .footer-bottom { flex-direction:column; align-items:flex-start; gap:12px; }
        }

        @media(max-width:380px){
          .footer-grid { grid-template-columns:1fr; gap:24px; }
          .footer-brand { grid-column:span 1; }
        }
      `}</style>
    </>
  );
}

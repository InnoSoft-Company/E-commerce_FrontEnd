import { ArrowRight, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PromoSplit() {
  return (
    <>
      <section className="promo-section">

        {/* Text side */}
        <div className="promo-text-side">
          {/* Dot pattern */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle, #f59e0b 1.5px, transparent 0)", backgroundSize: "28px 28px" }} />
          {/* Glow */}
          <div style={{ position: "absolute", top: "50%", left: "40%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.18), transparent 70%)", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <Tag size={15} style={{ color: "#fcd34d" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#fcd34d" }}>
                عرض محدود
              </span>
            </div>

            <h2 className="promo-h2">
              خصومات<br />الربيع
            </h2>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 10 }}>
              <span className="promo-pct">50%</span>
              <span style={{ fontSize: 18, color: "rgba(255,255,255,0.42)", fontWeight: 400, marginBottom: 6 }}>خصم</span>
            </div>

            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 36 }}>
              على تشكيلة مختارة · لفترة محدودة فقط
            </p>

            <Link href="/shop" className="btn-gold" style={{ display: "inline-flex", fontSize: 13 }}>
              تسوق العروض الآن <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Image side */}
        <div className="promo-img-side group">
          <Image fill sizes="(max-width:820px) 100vw, 50vw" src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=85" alt="خصومات الربيع"
            style={{ objectFit: "cover", transition: "transform 0.75s ease, filter 0.5s ease" }}
            className="group-hover:scale-105 group-hover:brightness-90" />

          {/* Sale badge */}
          <div style={{ position: "absolute", top: 28, right: 28 }}>
            <div className="promo-badge animate-pulse-gold">
              <span className="promo-badge-pct">50%</span>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>خصم</span>
            </div>
          </div>

          {/* Bottom tag */}
          <div className="promo-tag group-hover:opacity-100 group-hover:translate-y-0">
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0f172a", margin: 0 }}>
              تسوق الآن →
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .promo-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 520px;
        }

        .promo-text-side {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 72px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .promo-h2 {
          font-family: var(--font-cormorant, Georgia, serif);
          font-size: clamp(2.4rem, 4.5vw, 5rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 14px;
        }

        .promo-pct {
          font-family: var(--font-cormorant, Georgia, serif);
          font-size: clamp(3rem, 5.5vw, 6rem);
          font-weight: 900;
          color: #f59e0b;
          line-height: 1;
        }

        .promo-img-side {
          position: relative;
          min-height: 360px;
          overflow: hidden;
        }

        .promo-badge {
          width: 90px; height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 60%, #d97706 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          color: #0f172a;
          box-shadow: 0 8px 32px rgba(245,158,11,0.55);
        }

        .promo-badge-pct {
          font-family: var(--font-cormorant, Georgia, serif);
          font-size: 1.6rem; font-weight: 900; line-height: 1;
        }

        .promo-tag {
          position: absolute;
          bottom: 28px; left: 28px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          padding: 11px 18px;
          border-radius: 6px;
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.35s ease;
        }

        /* ── Tablet ── */
        @media(max-width:820px){
          .promo-section { grid-template-columns: 1fr; }
          .promo-text-side { padding: 52px 36px; order: 2; }
          .promo-img-side { min-height: 300px; order: 1; }
          .promo-badge { width: 76px; height: 76px; top: 20px; right: 20px; }
          .promo-badge-pct { font-size: 1.3rem; }
        }

        /* ── Mobile ── */
        @media(max-width:480px){
          .promo-text-side { padding: 40px 24px; }
          .promo-img-side { min-height: 240px; }
          .promo-h2 { font-size: 2.2rem; }
          .promo-pct { font-size: 2.8rem; }
        }
      `}</style>
    </>
  );
}

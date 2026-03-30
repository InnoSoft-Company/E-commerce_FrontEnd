import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <section className="hero-section">
        <Image fill src="/images/site-banner.jpg" alt="بلانكو" priority style={{ objectFit: "cover", objectPosition: "center top" }}  sizes="(max-width:768px) 100vw, 50vw"/>

        {/* Overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(15,23,42,0.93) 0%, rgba(15,23,42,0.62) 50%, rgba(15,23,42,0.18) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, rgba(245,158,11,0.14), transparent)" }} />

        {/* Floating orb */}
        <div className="hero-orb animate-float" />

        {/* Content */}
        <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%" }}>
            <div className="hero-inner">

              {/* Badge */}
              <div className="hero-badge animate-slide-right delay-100">
                <Sparkles size={13} style={{ color: "#fcd34d" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: "#fcd34d" }}>
                  تشكيلة ربيع وصيف 2026
                </span>
              </div>

              {/* Headline */}
              <h1 className="hero-h1 animate-fade-up delay-200 sparkle-text">
                تألّق بأسلوبك <span style={{ fontWeight: 300, fontStyle: "italic" }}>الخاص</span>
              </h1>

              <p className="hero-sub animate-fade-up delay-300">
                تشكيلة أزياء فاخرة مختارة بعناية — قطع تجمع بين الأناقة والراحة لتناسب كل مناسبة في حياتك.
              </p>

              <div className="hero-btns animate-fade-up delay-400">
                <Link href="/shop" className="btn-gold">
                  استكشفي المجموعة <ArrowRight size={16} />
                </Link>
                <Link href="/shop?category=Women" className="btn-outline-white">
                  تشكيلة النساء
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator — hidden on mobile */}
        <div className="hero-scroll-ind">
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", writingMode: "vertical-rl" }}>
            اكتشف المزيد
          </span>
          <div style={{ width: 1.5, height: 40, background: "linear-gradient(to bottom, rgba(245,158,11,0.6), transparent)" }} />
        </div>
      </section>

      <style>{`
        .hero-section {
          position: relative;
          height: calc(100vh - 110px);
          min-height: 560px;
          overflow: hidden;
        }

        .hero-orb {
          position: absolute;
          top: 15%; left: 55%;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.12), transparent 65%);
          pointer-events: none;
        }

        .hero-inner {
          max-width: 660px;
          padding-bottom: 60px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 8px 22px;
          border-radius: 100px;
          border: 1.5px solid rgba(245,158,11,0.4);
          background: rgba(245,158,11,0.1);
          backdrop-filter: blur(8px);
          margin-bottom: 24px;
        }

        .hero-h1 {
          font-family: var(--font-cormorant, Georgia, serif);
          font-size: clamp(2.4rem, 8vw, 7rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 24px;
          text-shadow: 0 4px 40px rgba(0,0,0,0.3);
          background: linear-gradient(90deg, #ffffff 0%, #fcd34d 50%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
          /* إزالة nowrap عشان متكسرش على موبايل */
          white-space: normal;
          word-break: keep-all;
        }

        .hero-sub {
          font-size: clamp(14px, 2.2vw, 18px);
          color: rgba(255,255,255,0.72);
          font-weight: 400;
          line-height: 1.75;
          margin: 0 auto 36px;
          max-width: 460px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .hero-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
          margin-bottom: 0;
        }

        .hero-scroll-ind {
          position: absolute;
          bottom: 24px; right: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        /* ── Tablet ── */
        @media(max-width:768px){
          .hero-section { height: auto; min-height: 92svh; padding: 80px 0 48px; }
          .hero-inner { padding-bottom: 20px; }
          .hero-orb { display: none; }
          .hero-scroll-ind { display: none; }
        }

        /* ── Mobile ── */
        @media(max-width:480px){
          .hero-section { min-height: 90svh; padding: 60px 0 40px; }
          .hero-badge { padding: 6px 16px; }
          .hero-btns { flex-direction: column; align-items: center; }
          .hero-btns a, .hero-btns button { width: 100%; max-width: 280px; justify-content: center; }
        }
      `}</style>
    </>
  );
}

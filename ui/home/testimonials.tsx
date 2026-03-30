import { Star } from "lucide-react";

const reviews = [
  { name: "سارة م.", role: "مصممة أزياء", review: "جودة رائعة بشكل مذهل. كل قطعة تشعر وكأنها مختارة بعناية — الحرفية في أفضل حالاتها وبالتأكيد سأعود للتسوق مرة أخرى.", init: "س" },
  { name: "أحمد خ.", role: "مهندس معماري", review: "وجدت علامتي المفضلة في الملابس. الجودة والأسلوب والسعر كلهم يتحدثون عن نفسهم. أنصح الجميع.", init: "أ" },
  { name: "منى ع.", role: "مديرة إبداعية", review: "BLANKO تفهم معنى الأناقة الحقيقية. أساسيات راقية لكل مناسبة، الشحن سريع والتغليف فخم جدًا.", init: "م" },
];

export default function Testimonials() {
  return (
    <>
      <section style={{ padding: "80px 0", background: "#ffffff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="section-tag" style={{ justifyContent: "center", marginBottom: 14 }}>آراء عملائنا</p>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>
              ماذا يقولون عنّا
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>أكثر من 50,000 عميل يثقون بنا</p>
          </div>

          <div className="test-grid">
            {reviews.map((r, i) => (
              <div key={i} className="test-card"
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "#0f172a"; el.style.borderColor = "#0f172a";
                  el.style.transform = "translateY(-6px)"; el.style.boxShadow = "0 20px 56px rgba(15,23,42,0.2)";
                  el.querySelector<HTMLElement>(".test-text")!.style.color = "rgba(255,255,255,0.72)";
                  el.querySelector<HTMLElement>(".test-name")!.style.color = "#ffffff";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "#f8fafc"; el.style.borderColor = "#f1f5f9";
                  el.style.transform = "translateY(0)"; el.style.boxShadow = "none";
                  el.querySelector<HTMLElement>(".test-text")!.style.color = "#334155";
                  el.querySelector<HTMLElement>(".test-name")!.style.color = "#0f172a";
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} style={{ color: "#f59e0b" }} fill="#f59e0b" strokeWidth={1} />
                  ))}
                </div>

                <p className="test-text" style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 24, fontStyle: "italic", color: "#334155", transition: "color 0.4s" }}>
                  "{r.review}"
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #d97706)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", fontSize: 15, fontWeight: 800, flexShrink: 0 }}>
                    {r.init}
                  </div>
                  <div>
                    <p className="test-name" style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 2px", transition: "color 0.4s" }}>{r.name}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>{r.role}</p>
                  </div>
                </div>

                {/* Amber bottom bar */}
                <div className="test-bar" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .test-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .test-card {
          background: #f8fafc;
          padding: 32px;
          border-radius: 14px;
          border: 2px solid #f1f5f9;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        .test-bar {
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 4px;
          background: linear-gradient(90deg, #f59e0b, #d97706);
          border-radius: 0 0 14px 0;
          transition: width 0.5s ease;
        }
        .test-card:hover .test-bar { width: 100%; }

        @media(max-width:900px){
          .test-grid { grid-template-columns: 1fr 1fr; gap:20px; }
        }
        @media(max-width:560px){
          .test-grid { grid-template-columns: 1fr; gap:16px; }
          .test-card { padding: 24px 20px; }
        }
      `}</style>
    </>
  );
}

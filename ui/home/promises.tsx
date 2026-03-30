export default function Promises() {
  const items = [
    { icon: "✦", title: "جودة ممتازة",   desc: "أفضل الخامات وحرفية استثنائية" },
    { icon: "↩", title: "إرجاع مجاني",   desc: "إرجاع مجاني خلال 30 يومًا" },
    { icon: "🔒", title: "دفع آمن 100%", desc: "بياناتك محمية بأعلى معايير الأمان" },
    { icon: "⚡", title: "توصيل سريع",   desc: "توصيل خلال 24-48 ساعة" },
  ];

  return (
    <>
      <section style={{ padding: "52px 0", background: "#1e293b", borderTop: "1px solid rgba(245,158,11,0.12)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="promises-grid">
            {items.map(item => (
              <div
                key={item.title}
                className="promise-card"
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,158,11,0.3)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                }}
              >
                <div style={{ fontSize: 26, lineHeight: 1, flexShrink: 0, filter: "drop-shadow(0 0 10px rgba(245,158,11,0.5))" }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#ffffff", margin: "0 0 5px" }}>{item.title}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .promises-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .promise-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 22px;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          transition: all 0.3s;
        }
        @media(max-width:900px){
          .promises-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
        }
        @media(max-width:480px){
          .promises-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .promise-card { padding: 16px 14px; gap: 12px; }
          .promise-card > div:first-child { font-size: 22px; }
        }
        @media(max-width:340px){
          .promises-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

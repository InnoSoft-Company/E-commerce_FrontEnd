import { categories } from "@/src/data/products";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const catImgs: Record<string,string> = {
  Women:"https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=700&q=85",
  Men:  "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=700&q=85",
  Kids: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=700&q=85",
  Accessories:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=85",
};
const catAr:  Record<string,string> = { Women:"نساء", Men:"رجال", Kids:"أطفال", Accessories:"إكسسوارات" };
const catDesc:Record<string,string> = { Women:"أناقة لكل مناسبة", Men:"أسلوب عصري جريء", Kids:"مرح وألوان", Accessories:"اللمسة الأخيرة" };

export default function Categories() {
  return (
    <section style={{ background:"#0f172a", padding:"80px 0" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <p className="section-tag" style={{ justifyContent:"center", marginBottom:14, color:"#f59e0b" }}>استكشفي</p>
          <h2 style={{ color:"#ffffff", margin:0 }}>تسوقي حسب الفئة</h2>
          <p style={{ color:"rgba(255,255,255,0.4)", marginTop:12, fontSize:15 }}>اختاري الفئة المناسبة لكِ</p>
        </div>
        <div className="cats-grid">
          {categories.map(cat=>(
            <Link key={cat.id} href={`/shop?category=${cat.name}`}
              style={{ position:"relative", display:"block", aspectRatio:"3/4", overflow:"hidden", textDecoration:"none", borderRadius:14 }}
              className="cat-link">
              <Image width={400} height={550} src={catImgs[cat.name]??catImgs.Women} alt={cat.name}
                style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.75s ease, filter 0.5s ease" }}
                className="cat-img" />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.2) 60%, transparent 100%)" }} />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:22 }}>
                <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.28em", textTransform:"uppercase", color:"#fcd34d", margin:"0 0 6px" }}>
                  {cat.count} قطعة
                </p>
                <h3 style={{ fontSize:"1.5rem", fontWeight:800, color:"#ffffff", margin:"0 0 4px", fontFamily:"var(--font-cormorant,Georgia,serif)" }}>
                  {catAr[cat.name]??cat.name}
                </h3>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:"0 0 10px" }}>{catDesc[cat.name]}</p>
                <div className="cat-cta" style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fcd34d", opacity:0, transition:"all 0.35s" }}>
                  تسوقي الآن <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .cats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .cat-link:hover .cat-img { transform:scale(1.1); filter:brightness(0.8); }
        .cat-link:hover .cat-cta { opacity:1 !important; transform:translateY(0); }
        @media(max-width:768px){ .cats-grid{ grid-template-columns:repeat(2,1fr); gap:12px; } }
        @media(max-width:400px){ .cats-grid{ grid-template-columns:1fr 1fr; gap:10px; } }
      `}</style>
    </section>
  );
}

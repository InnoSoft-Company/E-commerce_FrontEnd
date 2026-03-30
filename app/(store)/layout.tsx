import { Footer } from "@/ui/components/Footer";
import { Navbar } from "@/ui/components/Navbar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
      - display:flex + flexDirection:column عشان الـ footer يبقى في الآخر
      - background:#ffffff للمحتوى
      - margin:0 و padding:0 على الـ body ده موجود في globals
      - الـ Navbar عنده position:sticky top:0 فمش محتاج أي padding هنا
    */
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#ffffff",
      margin: 0,
      padding: 0,
    }}>
      <Navbar />
      <main style={{ flex: 1, background: "#ffffff", margin: 0, padding: 0 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react"
import Link from "next/link"

export default function Icons({
  searchOpen, setSearchOpen, getCartCount, isAuthenticated, logout, setMobileOpen, mobileOpen
}: {
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  getCartCount: () => number;
  isAuthenticated: boolean;
  logout: () => void;
  setMobileOpen: (v: boolean) => void;
  mobileOpen: boolean;
}) {
  const btnStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "40px", height: "40px", background: "transparent",
    border: "none", cursor: "pointer", color: "#475569",
    transition: "color 0.2s",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <button onClick={() => setSearchOpen(!searchOpen)} style={btnStyle}
        onMouseEnter={e => (e.currentTarget.style.color = "#0f172a")}
        onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
        <Search style={{ width: "20px", height: "20px" }} strokeWidth={1.5} />
      </button>

      <Link href="/wishlist" style={{ ...btnStyle, textDecoration: "none" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#0f172a")}
        onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
        <Heart style={{ width: "20px", height: "20px" }} strokeWidth={1.5} />
      </Link>

      <Link href="/cart" style={{ ...btnStyle, position: "relative", textDecoration: "none" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#0f172a")}
        onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
        <ShoppingCart style={{ width: "20px", height: "20px" }} strokeWidth={1.5} />
        {getCartCount() > 0 && (
          <span style={{
            position: "absolute", top: "4px", right: "4px",
            background: "#f59e0b", color: "#0f172a",
            fontSize: "9px", fontWeight: 800,
            width: "16px", height: "16px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {getCartCount()}
          </span>
        )}
      </Link>

      {isAuthenticated ? (
        <div style={{ position: "relative" }} className="group">
          <button style={btnStyle}
            onMouseEnter={e => (e.currentTarget.style.color = "#0f172a")}
            onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
            <User style={{ width: "20px", height: "20px" }} strokeWidth={1.5} />
          </button>
          <div style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)",
            width: "200px", background: "#ffffff",
            border: "2px solid #f1e4b8", boxShadow: "0 16px 48px rgba(15,23,42,0.15)",
            opacity: 0, visibility: "hidden", transition: "all 0.2s",
            zIndex: 100,
          }} className="group-hover:opacity-100 group-hover:visible"
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.visibility = "visible"; }}
          >
            <div style={{ height: "3px", background: "linear-gradient(90deg, #f59e0b, #d97706)" }} />
            {[
              { href: "/profile", label: "ملفي الشخصي" },
              { href: "/orders", label: "طلباتي" },
              { href: "/wishlist", label: "المفضلة" },
              { href: "/admin", label: "لوحة التحكم" },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{
                display: "block", padding: "12px 16px",
                fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "#475569", textDecoration: "none",
                transition: "all 0.15s", borderBottom: "1px solid #f8f4eb",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#0f172a"; (e.currentTarget as HTMLElement).style.backgroundColor = "#fffbf0"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                {item.label}
              </Link>
            ))}
            <button onClick={logout} style={{
              display: "block", width: "100%", textAlign: "right",
              padding: "12px 16px", fontSize: "12px", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#ef4444", background: "none", border: "none", cursor: "pointer",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fef2f2")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      ) : (
        <Link href="/login" style={{ ...btnStyle, textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#0f172a")}
          onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
          <User style={{ width: "20px", height: "20px" }} strokeWidth={1.5} />
        </Link>
      )}

      <button className="md:hidden" style={btnStyle} onClick={() => setMobileOpen(!mobileOpen)}
        onMouseEnter={e => (e.currentTarget.style.color = "#0f172a")}
        onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
        {mobileOpen ? <X style={{ width: "22px", height: "22px" }} strokeWidth={1.5} /> : <Menu style={{ width: "22px", height: "22px" }} strokeWidth={1.5} />}
      </button>
    </div>
  );
}

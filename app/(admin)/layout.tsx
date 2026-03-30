"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, LogOut, ExternalLink, Menu, X, Bell } from "lucide-react";

const navItems = [
  { href: "/admin",            icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/admin/products",   icon: Package,         label: "المنتجات" },
  { href: "/admin/orders",     icon: ShoppingCart,    label: "الطلبات" },
  { href: "/admin/users",      icon: Users,           label: "العملاء" },
  { href: "/admin/categories", icon: Tag,             label: "التصنيفات" },
];

function Sidebar({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0f172a", borderRight: "1px solid rgba(245,158,11,0.12)" }}>
      <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "var(--font-cormorant,Georgia,serif)", fontSize: 20, fontWeight: 800, color: "#ffffff", letterSpacing: "0.3em", textTransform: "uppercase" }}>BLANKO</div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.32em", textTransform: "uppercase", color: "#f59e0b", marginTop: 2 }}>لوحة التحكم</div>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      <div style={{ height: 2, background: "linear-gradient(90deg,#f59e0b,#fcd34d,transparent)", flexShrink: 0 }} />

      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 14px", fontSize: 13, fontWeight: 700, textDecoration: "none", borderRadius: 12, transition: "all 0.22s", background: active ? "linear-gradient(135deg,#f59e0b,#d97706)" : "transparent", color: active ? "#0f172a" : "rgba(255,255,255,0.52)" }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.52)"; } }}
            >
              <item.icon size={17} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 13, padding: "11px 14px", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.38)", textDecoration: "none", borderRadius: 10, transition: "all 0.22s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.38)"; }}>
          <ExternalLink size={16} strokeWidth={2} /> عرض المتجر
        </Link>
        <button onClick={() => { logout(); router.push("/login"); }}
          style={{ display: "flex", alignItems: "center", gap: 13, padding: "11px 14px", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.38)", background: "none", border: "none", cursor: "pointer", borderRadius: 10, transition: "all 0.22s", width: "100%", textAlign: "right" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.38)"; }}>
          <LogOut size={16} strokeWidth={2} /> تسجيل الخروج
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (!isAdmin) { router.push("/"); }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) return null;

  const currentLabel = navItems.find(n => n.href === pathname || (n.href !== "/admin" && pathname.startsWith(n.href)))?.label ?? "لوحة التحكم";

  return (
    <>
      <div style={{ display: "flex", height: "100vh", background: "#0f172a", overflow: "hidden" }}>
        {/* Desktop sidebar */}
        <aside className="admin-sidebar-desktop">
          <Sidebar pathname={pathname} />
        </aside>

        {/* Mobile overlay */}
        {sideOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }} className="admin-sidebar-mobile-overlay">
            <div style={{ width: 240, flexShrink: 0 }}>
              <Sidebar pathname={pathname} onClose={() => setSideOpen(false)} />
            </div>
            <div style={{ flex: 1, background: "rgba(0,0,0,0.65)" }} onClick={() => setSideOpen(false)} />
          </div>
        )}

        {/* Main area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          {/* Topbar */}
          <header style={{ background: "#1e293b", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button className="admin-hamburger" onClick={() => setSideOpen(true)} style={{ background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer", width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Menu size={20} />
              </button>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", margin: 0 }}>لوحة التحكم</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1 }}>{currentLabel}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.55)", position: "relative" }}>
                <Bell size={16} strokeWidth={2} />
                <span style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: "50%", background: "#f59e0b" }} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 12px", background: "rgba(245,158,11,0.1)", border: "1.5px solid rgba(245,158,11,0.22)", borderRadius: 50 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", fontSize: 12, fontWeight: 800 }}>أ</div>
                <span className="admin-user-label" style={{ fontSize: 13, fontWeight: 700, color: "#fcd34d" }}>المدير</span>
              </div>
            </div>
          </header>

          <main style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
            {children}
          </main>
        </div>
      </div>

      <style>{`
        .admin-sidebar-desktop {
          width: 230px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .admin-hamburger { display: none !important; }
        .admin-sidebar-mobile-overlay { display: flex !important; }

        @media(min-width: 1024px){
          .admin-hamburger { display: none !important; }
          .admin-sidebar-mobile-overlay { display: none !important; }
        }
        @media(max-width: 1023px){
          .admin-sidebar-desktop { display: none !important; }
          .admin-hamburger { display: flex !important; }
        }
        @media(max-width: 480px){
          .admin-user-label { display: none; }
          main { padding: 16px 12px !important; }
        }
      `}</style>
    </>
  );
}

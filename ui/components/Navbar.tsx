"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";

export function Navbar() {
  const { getCartCount } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth() as any;
  const [mobile,   setMobile]   = useState(false);
  const [search,   setSearch]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => { setMobile(false); setSearch(false); setUserOpen(false); }, [pathname]);
  useEffect(() => {
    if (!userOpen) return;
    const close = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest(".nav-user-wrap")) setUserOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [userOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Announcement */}
      <div className="nav-announce">
        <p>✦ شحن مجاني على الطلبات فوق 7,500 ج.م ✦ عروض الموسم — خصم حتى 50%</p>
      </div>

      <nav className={`nav-bar${scrolled ? " scrolled" : ""}`}>
        <div style={{ height:3, background:"linear-gradient(90deg,#f59e0b,#fcd34d 40%,#d97706 80%,transparent)" }} />

        <div className="nav-container">
          <div className="nav-inner">

            {/* Logo */}
            <Link href="/" className="nav-logo" style={{ textDecoration:"none" }}>
              <span className="nav-logo-main">BLANKO</span>
              <span className="nav-logo-sub">Fashion House</span>
            </Link>

            {/* Desktop Nav links */}
            <div className="nav-links">
              {[{href:"/",l:"الرئيسية"},{href:"/shop",l:"المتجر"},{href:"/about-us",l:"من نحن"},{href:"/contact-us",l:"تواصل معنا"}].map(({href,l}) => (
                <Link key={href} href={href} className={`nav-link${isActive(href)?" active":""}`}>{l}</Link>
              ))}
            </div>

            {/* Icons */}
            <div className="nav-icons">
              <button onClick={()=>setSearch(!search)} className="nav-icon-btn" aria-label="بحث">
                <Search size={19} strokeWidth={2}/>
              </button>
              <Link href="/wishlist" className="nav-icon-btn" style={{textDecoration:"none"}} aria-label="المفضلة">
                <Heart size={19} strokeWidth={2}/>
              </Link>
              <Link href="/cart" className="nav-icon-btn" style={{textDecoration:"none",position:"relative"}} aria-label="السلة">
                <ShoppingCart size={19} strokeWidth={2}/>
                {getCartCount()>0 && <span className="nav-cart-badge">{getCartCount()}</span>}
              </Link>

              {/* User dropdown */}
              <div className="nav-user-wrap" style={{position:"relative"}}>
                <button onClick={()=>setUserOpen(!userOpen)} className={`nav-icon-btn${isAuthenticated?" authenticated":""}`} aria-label="الحساب">
                  <User size={18} strokeWidth={2}/>
                </button>
                {userOpen && (
                  <div className="nav-dropdown animate-fade-in">
                    <div style={{height:3,background:"linear-gradient(90deg,#f59e0b,#d97706)"}}/>
                    {isAuthenticated ? (
                      <>
                        {[{href:"/profile",l:"ملفي الشخصي"},{href:"/orders",l:"طلباتي"},{href:"/wishlist",l:"المفضلة"},...(isAdmin?[{href:"/admin",l:"⚙ لوحة التحكم"}]:[])].map(item=>(
                          <Link key={item.href} href={item.href} className="nav-dropdown-link">{item.l}</Link>
                        ))}
                        <button onClick={logout} className="nav-dropdown-logout">تسجيل الخروج</button>
                      </>
                    ) : (
                      <>
                        <Link href="/login"    className="nav-dropdown-link">تسجيل الدخول</Link>
                        <Link href="/register" className="nav-dropdown-link" style={{color:"#d97706"}}>إنشاء حساب</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Hamburger */}
              <button className="nav-hamburger" onClick={()=>setMobile(!mobile)} aria-label="القائمة">
                {mobile ? <X size={22} strokeWidth={2}/> : <Menu size={22} strokeWidth={2}/>}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {search && (
            <div className="nav-search-bar animate-fade-in">
              <div style={{position:"relative",maxWidth:560,margin:"0 auto"}}>
                <Search style={{position:"absolute",right:18,top:"50%",transform:"translateY(-50%)",color:"#94a3b8"}} size={17}/>
                <input autoFocus type="text" placeholder="ابحثي عن منتجاتك..." className="nav-search-input"/>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu — REVEAL (slide down, not popup) */}
        <div className={`nav-mobile-menu${mobile?" open":""}`}>
          <div className="nav-mobile-inner">
            {[{href:"/",l:"الرئيسية"},{href:"/shop",l:"المتجر"},{href:"/about-us",l:"من نحن"},{href:"/contact-us",l:"تواصل معنا"}].map(({href,l}) => (
              <Link key={href} href={href} className={`nav-mobile-link${isActive(href)?" active":""}`}>{l}</Link>
            ))}

            {isAuthenticated ? (
              <div className="nav-mobile-section">
                {[{href:"/profile",l:"ملفي الشخصي"},{href:"/orders",l:"طلباتي"},{href:"/wishlist",l:"المفضلة"},...(isAdmin?[{href:"/admin",l:"⚙ لوحة التحكم"}]:[])].map(item=>(
                  <Link key={item.href} href={item.href} className="nav-mobile-link">{item.l}</Link>
                ))}
                <button onClick={logout} className="nav-mobile-logout">تسجيل الخروج</button>
              </div>
            ) : (
              <div className="nav-mobile-auth">
                <Link href="/login"    className="nav-mobile-btn-outline">تسجيل الدخول</Link>
                <Link href="/register" className="nav-mobile-btn-gold">إنشاء حساب</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        /* ── Announcement ── */
        .nav-announce { background:#0f172a; padding:8px 16px; text-align:center; }
        .nav-announce p { color:#fcd34d; font-size:11px; font-weight:700; letter-spacing:0.14em; margin:0; }

        /* ── Nav bar ── */
        .nav-bar { background:#ffffff; position:sticky; top:0; z-index:100; border-bottom:2px solid #f1f5f9; transition:all 0.3s; }
        .nav-bar.scrolled { border-bottom:none; box-shadow:0 4px 32px rgba(15,23,42,0.08); }

        .nav-container { max-width:1280px; margin:0 auto; padding:0 24px; }
        .nav-inner { display:flex; align-items:center; justify-content:space-between; height:64px; }

        /* Logo */
        .nav-logo { display:flex; flex-direction:column; line-height:1; }
        .nav-logo-main { font-family:var(--font-cormorant,Georgia,serif); font-size:24px; font-weight:800; color:#0f172a; letter-spacing:0.32em; text-transform:uppercase; }
        .nav-logo-sub  { font-size:9px; font-weight:800; letter-spacing:0.38em; color:#d97706; text-transform:uppercase; margin-top:2px; }

        /* Desktop nav links */
        .nav-links { display:flex; align-items:center; gap:32px; }
        .nav-link { font-size:13px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; padding:6px 0 5px; transition:color 0.2s; color:#0f172a; border-bottom:2.5px solid transparent; }
        .nav-link:hover { color:#d97706; }
        .nav-link.active { color:#d97706; border-bottom-color:#f59e0b; }

        /* Icon buttons */
        .nav-icons { display:flex; align-items:center; gap:2px; }
        .nav-icon-btn { width:42px; height:42px; display:flex; align-items:center; justify-content:center; background:none; border:none; cursor:pointer; border-radius:10px; color:#0f172a; transition:all 0.2s; }
        .nav-icon-btn:hover { background:#fffbeb; color:#d97706; }
        .nav-icon-btn.authenticated { background:#0f172a; color:#ffffff; }
        .nav-icon-btn.authenticated:hover { background:#1e293b; }
        .nav-cart-badge { position:absolute; top:6px; right:6px; width:17px; height:17px; border-radius:50%; background:#f59e0b; color:#0f172a; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center; }

        /* Dropdown */
        .nav-dropdown { position:absolute; left:0; top:calc(100% + 10px); background:#ffffff; border:2px solid #f1f5f9; border-radius:14px; box-shadow:0 20px 60px rgba(15,23,42,0.13); min-width:210px; overflow:hidden; z-index:300; }
        .nav-dropdown-link { display:block; padding:13px 20px; font-size:13px; font-weight:700; color:#0f172a; text-decoration:none; border-bottom:1px solid #f8fafc; transition:all 0.18s; }
        .nav-dropdown-link:hover { background:#fffbeb; color:#d97706; }
        .nav-dropdown-logout { display:block; width:100%; text-align:right; padding:13px 20px; font-size:13px; font-weight:700; color:#ef4444; background:none; border:none; cursor:pointer; font-family:var(--font-tajawal,sans-serif); }
        .nav-dropdown-logout:hover { background:#fef2f2; }

        /* Search */
        .nav-search-bar { border-top:2px solid #f1f5f9; padding:14px 0; }
        .nav-search-input { width:100%; padding:13px 50px 13px 18px; border:2.5px solid #e2e8f0; border-radius:50px; font-size:14px; color:#0f172a; background:#f8fafc; outline:none; transition:all 0.2s; font-family:var(--font-tajawal,sans-serif); }
        .nav-search-input:focus { border-color:#f59e0b; box-shadow:0 0 0 4px rgba(245,158,11,0.1); }

        /* ── Mobile Hamburger ── */
        .nav-hamburger { display:none; width:42px; height:42px; align-items:center; justify-content:center; background:none; border:none; cursor:pointer; color:#0f172a; }

        /* ── Mobile Menu — REVEAL (slide down) ── */
        .nav-mobile-menu {
          background:#ffffff;
          border-top:1px solid #f1f5f9;
          overflow:hidden;
          /* Slide down animation */
          max-height:0;
          opacity:0;
          transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.28s ease;
        }
        .nav-mobile-menu.open {
          max-height:600px;
          opacity:1;
        }
        .nav-mobile-inner { padding:12px 24px 20px; }
        .nav-mobile-link { display:block; padding:13px 0; font-size:15px; font-weight:600; color:#0f172a; text-decoration:none; border-bottom:1px solid #f8fafc; transition:color 0.2s; }
        .nav-mobile-link:hover, .nav-mobile-link.active { color:#d97706; }

        .nav-mobile-section { border-top:1px solid #f1f5f9; padding-top:10px; margin-top:4px; }
        .nav-mobile-logout { display:block; width:100%; text-align:right; padding:13px 0; font-size:15px; font-weight:600; color:#ef4444; background:none; border:none; cursor:pointer; border-top:1px solid #f8fafc; font-family:var(--font-tajawal,sans-serif); }

        .nav-mobile-auth { display:flex; gap:10px; margin-top:16px; border-top:1px solid #f1f5f9; padding-top:16px; }
        .nav-mobile-btn-outline { flex:1; text-align:center; padding:11px 0; font-size:13px; font-weight:700; color:#0f172a; border:2px solid #e2e8f0; border-radius:50px; text-decoration:none; }
        .nav-mobile-btn-gold    { flex:1; text-align:center; padding:11px 0; font-size:13px; font-weight:700; color:#0f172a; background:#f59e0b; border:2px solid #f59e0b; border-radius:50px; text-decoration:none; }

        /* ── Breakpoints ── */
        @media(max-width:768px){
          .nav-links { display:none; }
          .nav-hamburger { display:flex; }
        }
        @media(max-width:480px){
          .nav-announce p { font-size:10px; letter-spacing:0.08em; }
          .nav-inner { height:58px; }
          .nav-logo-main { font-size:20px; }
          .nav-container { padding:0 16px; }
        }
      `}</style>
    </>
  );
}

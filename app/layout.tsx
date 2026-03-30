import type { Metadata } from "next";
import { Cormorant_Garamond, Tajawal } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/src/context/WishlistContext";
import { AuthProvider } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";

// Cormorant — للنصوص الإنجليزية الكبيرة (BLANKO, headings)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Tajawal — أفخم فونت عربي على Google Fonts، مثالي للموضة والفاشون
// خط نظيف وعصري مع شخصية عربية قوية
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BLANKO — بلانكو للأزياء",
  description: "أزياء راقية للشخص المميز.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" className={`${cormorant.variable} ${tajawal.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

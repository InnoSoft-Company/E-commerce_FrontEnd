import { Product } from "@/src/data/products";
import Link from "next/link";

export default function Breadcrumb({ product }: { product: Product }) {
    return (
        <div className="bg-white border-b" style={{ borderColor:"rgba(26,26,24,0.10)" }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
                <nav className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-[#8a8a7a]">
                    <Link href="/" className="hover:text-[#1a1a18] transition-colors">الرئيسية</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-[#1a1a18] transition-colors">المتجر</Link>
                    <span>/</span>
                    <Link href={`/shop?category=${product.category}`} className="hover:text-[#1a1a18] transition-colors">{product.category}</Link>
                    <span>/</span>
                    <span className="text-[#1a1a18] truncate max-w-37.5">{product.name}</span>
                </nav>
            </div>
        </div>
    );
};
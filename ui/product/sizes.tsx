import { Product } from "@/src/data/products";
import { Ruler } from "lucide-react";

// دالة لتحويل أي قيمة إلى مصفوفة
function ensureArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value.split(",").map((s: string) => s.trim()).filter((s: string) => s);
    }
  }
  return [];
}

export default function     Sizes({
    product,
    selectedSize,
    setSelectedSize
}:{product:Product, selectedSize:string, setSelectedSize:(size:string)=>void
}) {
    return (
        <div className="mb-8">
            <div className="flex justify-between mb-3">
                <label className="text-[0.62rem] tracking-[0.22em] uppercase text-[#1a1a18]">المقاس</label>
                <button className="flex items-center gap-1 text-xs text-[#8a8a7a] hover:text-[#1a1a18] transition-colors">
                    <Ruler className="w-3 h-3" strokeWidth={1.5} /> دليل المقاسات
                </button>
            </div>
            <div className="flex flex-wrap gap-3">
                {ensureArray(product.sizes).map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                        className={`h-12 w-14 text-base font-semibold border rounded-lg transition-all flex items-center justify-center relative shadow-sm
                            ${selectedSize===s ? "bg-[#1a1a18] text-[#faf9f6] border-[#1a1a18] scale-105 ring-2 ring-[#1a1a18]" : "border-black/10 text-[#8a8a7a] hover:border-[#1a1a18] hover:text-[#1a1a18] bg-white"}
                        `}>
                        {s}
                        {selectedSize===s && (
                          <span className="absolute right-1 top-1 bg-white rounded-full p-0.5">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 10.5L9 14.5L15 7.5" stroke="#1a1a18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </span>
                        )}
                    </button>
                ))} 
            </div>
        </div>
    );
};
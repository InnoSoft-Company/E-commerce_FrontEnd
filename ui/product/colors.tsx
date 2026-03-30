import { Product } from "@/src/data/products";

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

export default function Colors({
    product,
    selectedColor,
    setSelectedColor,
    colorHex
}:{product:Product, selectedColor:string, setSelectedColor:(color:string)=>void, colorHex:Record<string, string>
}) {
    return (
        <div className="mb-5">
            <div className="flex justify-between mb-3">
                <label className="text-[0.62rem] tracking-[0.22em] uppercase text-[#1a1a18]">اللون</label>
                {selectedColor && <span className="text-xs text-[#8a8a7a]">{selectedColor}</span>}
            </div>
                        <div className="flex gap-3">
                                {ensureArray(product.colors).map(c => (
                                    <button key={c} onClick={() => setSelectedColor(c)} title={c}
                                        className="w-12 h-12 rounded-full border-2 flex items-center justify-center relative transition-all shadow-sm"
                                        style={{
                                                backgroundColor: colorHex[c] ?? "#c9a96e",
                                                borderColor: selectedColor===c ? "#1a1a18" : "#e5e5e5",
                                                boxShadow: selectedColor===c ? "0 0 0 4px #faf9f6, 0 0 0 6px #1a1a18" : "none",
                                                transform: selectedColor===c ? "scale(1.13)" : "scale(1)",
                                        }}>
                                        {selectedColor===c && (
                                            <span className="absolute right-1 bottom-1 bg-white rounded-full p-0.5">
                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 10.5L9 14.5L15 7.5" stroke="#1a1a18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            </span>
                                        )}
                                    </button>
                                ))}
                        </div>
        </div>
    );
};
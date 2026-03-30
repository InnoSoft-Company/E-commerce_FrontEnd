"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ShopHeader from "@/ui/shop/header";
import ShopSidebar from "@/ui/shop/sidebar";
import ProductsFilter from "@/ui/shop/products-filter";
import { productsApi, type Product as ApiProduct } from "@/src/lib/api";
import { products as staticProducts } from "@/src/data/products";

// Map API → local shape
function toLocal(p: ApiProduct) {
  return { ...p, price: parseFloat(p.price as any), inStock: p.in_stock };
}

export default function ShopContent() {
  const searchParams      = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedSize,     setSelectedSize]      = useState("");
  const [priceRange,       setPriceRange]        = useState<[number,number]>([0,500]);
  const [sortBy,           setSortBy]            = useState("newest");
  const [showFilters,      setShowFilters]        = useState(false);
  const [products,         setProducts]          = useState<any[]>(staticProducts);
  const [loading,          setLoading]           = useState(true);

  // Fetch from API
  useEffect(() => {
    setLoading(true);
    const params: Record<string,string> = { sort: sortBy };
    if (selectedCategory) params.category = selectedCategory;
    if (priceRange[0] > 0)   params.min_price = String(priceRange[0]);
    if (priceRange[1] < 500) params.max_price = String(priceRange[1]);

    productsApi.list(params)
      .then(res => {
        const items = res.results ?? res as any;
        if (Array.isArray(items) && items.length) setProducts(items.map(toLocal));
        else setProducts(staticProducts as any);
      })
      .catch(() => setProducts(staticProducts as any))
      .finally(() => setLoading(false));
  }, [selectedCategory, priceRange, sortBy]);

  // Client-side size filter (API doesn't support it natively)
  const sorted = products.filter(p => {
    if (!selectedSize) return true;
    
    const sizes = p.sizes ?? [];
    if (Array.isArray(sizes)) {
      return sizes.some(size => {
        if (typeof size === 'string') {
          // Handle string representations of arrays
          if (size.trim().startsWith('[')) {
            try {
              const parsed = JSON.parse(size);
              if (Array.isArray(parsed)) return parsed.includes(selectedSize);
            } catch {}
          }
          // Handle comma-separated strings
          if (size.includes(',')) {
            return size.split(',').map(s => s.trim()).includes(selectedSize);
          }
          return size.trim() === selectedSize;
        }
        return false;
      });
    }
    return false;
  });

  // Fix sizes data - handle arrays and strings properly
  const allSizes = Array.from(new Set(
    products.flatMap((p: any) => {
      const sizes = p.sizes ?? [];
      if (Array.isArray(sizes)) {
        return sizes.flatMap(size => {
          if (typeof size === 'string') {
            // Handle string representations of arrays
            if (size.trim().startsWith('[')) {
              try {
                const parsed = JSON.parse(size);
                if (Array.isArray(parsed)) return parsed;
              } catch {}
            }
            // Handle comma-separated strings
            if (size.includes(',')) {
              return size.split(',').map(s => s.trim());
            }
            return [size.trim()];
          }
          return [];
        });
      }
      return [];
    })
  )).filter(size => size && size.trim());
  const clear = () => { setSelectedCategory(""); setSelectedSize(""); setPriceRange([0,500]); };

  return (
    <div style={{ background:"#0f172a", minHeight:"100vh" }}>
      <ShopHeader
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        sorted={sorted} showFilters={showFilters} setShowFilters={setShowFilters}
        sortBy={sortBy} setSortBy={setSortBy}
      />
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"40px 24px" }}>
        <div className="shop-layout">
          <div className={`shop-sidebar ${showFilters ? "show" : ""}`}>
            <ShopSidebar showFilters={showFilters} clear={clear} priceRange={priceRange}
              setPriceRange={setPriceRange} allSizes={allSizes as string[]}
              selectedSize={selectedSize} setSelectedSize={setSelectedSize} />
          </div>
          <ProductsFilter sorted={sorted} clear={clear} loading={loading} />
        </div>
      </div>
      <style>{`
        .shop-layout { display:flex; gap:36px; align-items:flex-start; }
        .shop-sidebar { width:240px; flex-shrink:0; }
        @media(max-width:768px){
          .shop-layout { flex-direction:column; gap:20px; }
          .shop-sidebar { width:100%; display:none; }
          .shop-sidebar.show { display:block; }
        }
      `}</style>
    </div>
  );
}

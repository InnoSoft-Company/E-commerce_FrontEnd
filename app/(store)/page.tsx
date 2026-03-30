"use client";
import { useEffect, useState } from "react";
import Hero from "@/ui/home/hero";
import Categories from "@/ui/home/categories";
import Featured from "@/ui/home/featured";
import PromoSplit from "@/ui/home/promo-split";
import Trending from "@/ui/home/trending";
import Testimonials from "@/ui/home/testimonials";
import Promises from "@/ui/home/promises";
import { productsApi, type Product } from "@/src/lib/api";
// Fallback: static data if API is down
import { products as staticProducts } from "@/src/data/products";

// Map API product → local shape
function toLocal(p: Product) {
  return {
    ...p,
    price:   parseFloat(p.price as any),
    inStock: p.in_stock,
  };
}

export default function HomePage() {
  const [featured, setFeatured] = useState(staticProducts.filter(p => p.featured));
  const [trending, setTrending] = useState(staticProducts.filter(p => p.trending));

  useEffect(() => {
    productsApi.list({ featured:"true" })
      .then(res => { if (res.results?.length) setFeatured(res.results.map(toLocal) as any); })
      .catch(() => {});
    productsApi.list({ trending:"true" })
      .then(res => { if (res.results?.length) setTrending(res.results.map(toLocal) as any); })
      .catch(() => {});
  }, []);

  return (
    <div>
      <Hero />
      <Promises />
      <Categories />
      <Featured featured={featured as any} />
      <PromoSplit />
      <Trending trending={trending as any} />
      <Testimonials />
    </div>
  );
}

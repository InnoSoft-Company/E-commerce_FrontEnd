import { Suspense } from "react";
import ShopContent from "@/ui/shop/all-content";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight:"100vh", background:"#0f172a" }} />}>
      <ShopContent />
    </Suspense>
  );
}

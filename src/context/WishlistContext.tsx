"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { wishlistApi } from "@/src/lib/api";
import { useAuth } from "./AuthContext";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  isInWishlist: (id: number) => boolean;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading]   = useState(false);

  // Sync with backend when logged in
  useEffect(() => {
    if (!isAuthenticated) { setWishlist([]); return; }
    setLoading(true);
    wishlistApi.list()
      .then(items => setWishlist(items.map(i => ({
        id: i.product.id,
        name: i.product.name,
        price: parseFloat(i.product.price),
        image: i.product.image,
      }))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const isInWishlist = (id: number) => wishlist.some(w => w.id === id);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist(prev => prev.find(w => w.id === item.id) ? prev : [...prev, item]);
    if (isAuthenticated) wishlistApi.add(item.id).catch(() => {});
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
    if (isAuthenticated) wishlistApi.remove(id).catch(() => {});
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, addToWishlist, removeFromWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}

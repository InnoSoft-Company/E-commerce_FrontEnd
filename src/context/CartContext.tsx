"use client";
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
  line_total: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: number, name: string, price: number, image: string, size: string, color: string, qty?: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastToken, setLastToken] = useState<string | null>(null);

  // تحميل السلة من الـ server
  const loadCart = useCallback(async () => {
    try {
      const token = localStorage.getItem("blanko_access");
      if (!token) {
        setCart([]);
        return;
      }

      setLoading(true);
      const res = await fetch(`${API_URL}/cart/total/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Flatten the nested structure from API to flat items for components
        const items = (data.items || []).map((item: any) => ({
          id: item.id,
          product_id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          line_total: item.line_total,
        }));
        setCart(items);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // تحميل السلة عند دخول المستخدم أو تغيير الـ authentication
  useEffect(() => {
    const token = localStorage.getItem("blanko_access");
    
    // إذا تغيّر الـ token (دخول/خروج)، أعد تحميل السلة
    if (token !== lastToken) {
      setLastToken(token);
      loadCart();
    }

    // استمع إلى تغييرات localStorage من نوافذ أخرى
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "blanko_access") {
        loadCart();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [lastToken, loadCart]);

  const addToCart = async (productId: number, name: string, price: number, image: string, size: string, color: string, qty = 1) => {
    try {
      const token = localStorage.getItem("blanko_access");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: qty,
          size,
          color,
        }),
      });

      if (res.ok) {
        await loadCart(); // تحديث السلة من الـ server
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      const token = localStorage.getItem("blanko_access");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/cart/${cartItemId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await loadCart(); // تحديث السلة من الـ server
      }
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const updateQuantity = async (cartItemId: number, qty: number) => {
    try {
      if (qty <= 0) {
        await removeFromCart(cartItemId);
        return;
      }

      const token = localStorage.getItem("blanko_access");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/cart/${cartItemId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: qty }),
      });

      if (res.ok) {
        await loadCart(); // تحديث السلة من الـ server
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("blanko_access");
      if (!token) throw new Error("Not authenticated");

      await fetch(`${API_URL}/cart/clear/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const getCartTotal = () => cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
  const getCartCount = () => cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

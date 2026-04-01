/**
 * BLANKO — API client
 * Base URL: http://localhost:8000/api
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://midoghanam.pythonanywhere.com/api";

// ── helpers ─────────────────────────────────────
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("blanko_access");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, data: err };
  }
  if (res.status === 204) return null as unknown as T;
  return res.json();
}

async function requestFormData<T>(
  path: string,
  formData: FormData,
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {};
  
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, data: err };
  }
  
  if (res.status === 204) return null as unknown as T;
  return res.json();
}

async function requestFormDataPatch<T>(
  path: string,
  formData: FormData,
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {};
  
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers,
    body: formData,
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, data: err };
  }
  
  if (res.status === 204) return null as unknown as T;
  return res.json();
}

// ── Auth ─────────────────────────────────────────
export const authApi = {
  register: (data: { username: string; email: string; password: string; password2: string; first_name?: string; phone?: string }) =>
    request<{ user: User; tokens: Tokens }>("/auth/register/", { method: "POST", body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    request<{ access: string; refresh: string }>("/auth/login/", {
      method: "POST",
      // Django JWT uses username field; we store email as username during register
      // but also try email directly via the custom backend
      body: JSON.stringify({ username: email, password }),
    }),

  refresh: (refresh: string) =>
    request<{ access: string }>("/auth/refresh/", { method: "POST", body: JSON.stringify({ refresh }) }),

  logout: (refresh: string) =>
    request("/auth/logout/", { method: "POST", body: JSON.stringify({ refresh }) }, true),

  me: () => request<User>("/auth/me/", {}, true),

  updateProfile: (data: Partial<User>) =>
    request<User>("/auth/me/update/", { method: "PUT", body: JSON.stringify(data) }, true),
};

// ── Product Types ──────────────────────────────
export interface ProductCreateData {
  name: string;
  price: string | number;
  category: number;
  description?: string;
  image?: File | string;
  images?: (File | string)[];
  in_stock?: boolean;
  featured?: boolean;
  trending?: boolean;
  sizes?: string[];
  colors?: string[];
}

export type ProductUpdateData = Partial<ProductCreateData>;

// ── Products ─────────────────────────────────────
export const productsApi = {
  list: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<PaginatedResponse<Product>>(`/products/${qs ? "?" + qs : ""}`);
  },
  get: (id: number) => request<Product>(`/products/${id}/`),
  create: (data: ProductCreateData) => {
    // Use FormData for File uploads (images)
    const formData = new FormData();
    
    // Text fields
    formData.append("name", data.name);
    formData.append("price", String(data.price));
    formData.append("category", String(data.category));
    formData.append("description", data.description || "");
    
    // Primary image - must be File in FormData so it goes to request.FILES
    if (data.image instanceof File) {
      formData.append("image", data.image);
    } else if (typeof data.image === "string" && data.image.trim()) {
      // If it's a URL string, still send it
      formData.append("image", data.image);
    }
    
    // Gallery images - only include File objects
    if (Array.isArray(data.images) && data.images.length > 0) {
      data.images.forEach((img: File | string) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });
    }
    
    // Boolean flags - send as "true"/"false" strings
    formData.append("in_stock", String(data.in_stock ?? false));
    formData.append("featured", String(data.featured ?? false));
    formData.append("trending", String(data.trending ?? false));
    
    // Sizes and colors - send as JSON strings
    // Filter out empty strings first
    const cleanSizes = (Array.isArray(data.sizes) ? data.sizes : [])
      .filter((s: string) => typeof s === "string" && s.trim().length > 0)
      .map((s: string) => s.trim());
    
    const cleanColors = (Array.isArray(data.colors) ? data.colors : [])
      .filter((c: string) => typeof c === "string" && c.trim().length > 0)
      .map((c: string) => c.trim());
    
    formData.append("sizes", JSON.stringify(cleanSizes));
    formData.append("colors", JSON.stringify(cleanColors));
    
    console.log("FormData being sent for CREATE");
    console.log("sizes:", cleanSizes);
    console.log("colors:", cleanColors);
    console.log("image:", data.image ? (data.image instanceof File ? "File object" : "URL string") : "none");
    
    return requestFormData<Product>("/products/", formData, true);
  },
  update: (id: number, data: ProductUpdateData) => {
    const formData = new FormData();
    
    if (data.name) formData.append("name", data.name);
    if (data.price) formData.append("price", String(data.price));
    if (data.category !== undefined) formData.append("category", String(data.category));
    if (data.description !== undefined) formData.append("description", data.description);
    
    // Primary image - must be File in FormData
    if (data.image) {
      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else if (typeof data.image === "string" && data.image.trim()) {
        formData.append("image", data.image);
      }
    }
    
    // Gallery images
    if (Array.isArray(data.images) && data.images.length > 0) {
      data.images.forEach((img: File | string) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });
    }
    
    if (data.in_stock !== undefined) formData.append("in_stock", String(data.in_stock));
    if (data.featured !== undefined) formData.append("featured", String(data.featured));
    if (data.trending !== undefined) formData.append("trending", String(data.trending));
    
    // Sizes and colors
    const cleanSizes = (Array.isArray(data.sizes) ? data.sizes : [])
      .filter((s: string) => typeof s === "string" && s.trim().length > 0)
      .map((s: string) => s.trim());
    
    const cleanColors = (Array.isArray(data.colors) ? data.colors : [])
      .filter((c: string) => typeof c === "string" && c.trim().length > 0)
      .map((c: string) => c.trim());
    
    formData.append("sizes", JSON.stringify(cleanSizes));
    formData.append("colors", JSON.stringify(cleanColors));
    
    console.log("FormData being sent for UPDATE", { sizes: cleanSizes, colors: cleanColors });
    
    return requestFormDataPatch<Product>(`/products/${id}/`, formData, true);
  },
  delete: (id: number) =>
    request(`/products/${id}/`, { method: "DELETE" }, true),
};

// ── Categories ────────────────────────────────────
export const categoriesApi = {
  list: () => request<Category[]>("/categories/"),
  create: (data: Partial<Category>) =>
    request<Category>("/categories/", { method: "POST", body: JSON.stringify(data) }, true),
  update: (id: number, data: Partial<Category>) =>
    request<Category>(`/categories/${id}/`, { method: "PATCH", body: JSON.stringify(data) }, true),
  delete: (id: number) =>
    request(`/categories/${id}/`, { method: "DELETE" }, true),
};

// ── Orders ────────────────────────────────────────
export const ordersApi = {
  create: (data: CreateOrderPayload) =>
    request<Order>("/orders/", { method: "POST", body: JSON.stringify(data) }),
  myOrders: () => request<Order[]>("/orders/", {}, true),
  adminList: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<PaginatedResponse<Order>>(`/orders/${qs ? "?" + qs : ""}`, {}, true);
  },
  getById: (id: number) =>
    request<Order>(`/orders/${id}/`, {}, true),
  updateStatus: (id: number, status: string) =>
    request<Order>(`/orders/${id}/update_status/`, { method: "PATCH", body: JSON.stringify({ status }) }, true),
  dashboardStats: () => request<DashboardStats>("/orders/dashboard_stats/", {}, true),
};

// ── Coupons ───────────────────────────────────────
export const couponsApi = {
  validate: (code: string, subtotal: number) =>
    request<CouponValidation>("/coupons/validate/", {
      method: "POST", body: JSON.stringify({ code, subtotal }),
    }),
  list: () => request<Coupon[]>("/coupons/", {}, true),
  create: (data: Partial<Coupon>) =>
    request<Coupon>("/coupons/", { method: "POST", body: JSON.stringify(data) }, true),
  update: (id: number, data: Partial<Coupon>) =>
    request<Coupon>(`/coupons/${id}/`, { method: "PATCH", body: JSON.stringify(data) }, true),
  delete: (id: number) =>
    request(`/coupons/${id}/`, { method: "DELETE" }, true),
};

// ── Wishlist ──────────────────────────────────────
export const wishlistApi = {
  list: () => request<WishlistItem[]>("/wishlist/", {}, true),
  add: (product_id: number) =>
    request<WishlistItem>("/wishlist/add/", { method: "POST", body: JSON.stringify({ product_id }) }, true),
  remove: (product_id: number) =>
    request(`/wishlist/remove/${product_id}/`, { method: "DELETE" }, true),
};

// ── Admin ─────────────────────────────────────────
export const adminApi = {
  users: (search = "") =>
    request<AdminUser[]>(`/admin/users/${search ? "?search=" + search : ""}`, {}, true),
  getSettings: () => request<Record<string, string>>("/admin/settings/", {}, true),
  updateSettings: (data: Record<string, string>) =>
    request("/admin/settings/update/", { method: "POST", body: JSON.stringify(data) }, true),
};

// ── Token helpers ─────────────────────────────────
export const tokenHelper = {
  save: (access: string, refresh: string) => {
    localStorage.setItem("blanko_access", access);
    localStorage.setItem("blanko_refresh", refresh);
  },
  clear: () => {
    localStorage.removeItem("blanko_access");
    localStorage.removeItem("blanko_refresh");
  },
  getAccess:  () => localStorage.getItem("blanko_access"),
  getRefresh: () => localStorage.getItem("blanko_refresh"),
};

// ── Shipping Zones ────────────────────────────────
export const shippingZonesApi = {
  list: () => request<ShippingZoneData[]>("/shipping-zones/"),
  create: (data: Partial<ShippingZoneData>) =>
    request<ShippingZoneData>("/shipping-zones/", { method: "POST", body: JSON.stringify(data) }, true),
  update: (id: number, data: Partial<ShippingZoneData>) =>
    request<ShippingZoneData>(`/shipping-zones/${id}/`, { method: "PATCH", body: JSON.stringify(data) }, true),
  delete: (id: number) =>
    request(`/shipping-zones/${id}/`, { method: "DELETE" }, true),
};

// ── Types ─────────────────────────────────────────
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  is_admin: boolean;
  is_staff: boolean;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface Product {
  id: number;
  name: string;
  price: string | number;
  category: number;
  category_name: string;
  image: string;
  images: string[];
  description: string;
  sizes: string | string[];
  colors: string | string[];
  rating: number;
  reviews: number;
  in_stock: boolean;
  inStock: boolean;
  featured: boolean;
  trending: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  image: string | null;
  count: number;
}

export interface Order {
  id: number;
  customer_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  subtotal: string;
  shipping_fee: string;
  tax: string;
  total: string;
  discount_amount: string;
  status: string;
  status_display: string;
  payment_method: string;
  payment_display: string;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  size: string;
  color: string;
  image: string;
  line_total: number;
}

export interface CreateOrderPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip_code?: string;
  payment_method: string;
  coupon_code?: string;
  shipping_fee?: number;
  items: {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image?: string;
  }[];
}

export interface Coupon {
  id: number;
  code: string;
  discount: string;
  discount_type: "percent" | "fixed";
  uses: number;
  max_uses: number;
  active: boolean;
  expiry: string | null;
}

export interface CouponValidation {
  valid: boolean;
  code?: string;
  discount_type?: string;
  discount?: string;
  discount_amount?: string;
  error?: string;
}

export interface WishlistItem {
  id: number;
  product: Product;
  added_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DashboardStats {
  total_revenue: string;
  total_orders: number;
  total_products: number;
  total_users: number;
  by_status: Record<string, number>;
  recent_orders: Order[];
}

export interface AdminUser extends User {
  order_count: number;
  total_spent: string;
  date_joined: string;
}

export interface ShippingZoneData {
  id: number;
  governorate: string;
  fee: string;
  enabled: boolean;
  order: number;
}

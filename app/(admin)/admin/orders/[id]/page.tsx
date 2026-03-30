"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Package, User, Phone, MapPin, CreditCard, Tag, Loader2, ArrowLeft } from "lucide-react";
import { ordersApi, type Order } from "@/src/lib/api";
import { normalizeImageUrl } from "@/src/utils/image";
import Image from "next/image";
import Link from "next/link";

const statusLabel: Record<string,string> = { 
  processing:"قيد المعالجة", 
  shipping:"في الطريق", 
  delivered:"تم التسليم", 
  cancelled:"ملغي" 
};

const statusColors: Record<string,string> = {
  processing: "#60a5fa",
  shipping: "#fbbf24", 
  delivered: "#34d399",
  cancelled: "#f87171"
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await ordersApi.getById(parseInt(orderId));
        setOrder(orderData);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
        <Loader2 size={32} style={{ color: "#f59e0b", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "#ffffff", marginBottom: "16px" }}>الطلب غير موجود</h2>
        <Link href="/admin/orders" className="btn-gold">
          العودة للطلبات
        </Link>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const shippingFee = parseFloat(order.shipping_fee?.toString() || "0");
  const discount = parseFloat(order.discount_amount?.toString() || "0");
  const total = parseFloat(order.total?.toString() || "0");

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link 
            href="/admin/orders"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              padding: "8px 16px", 
              borderRadius: "8px", 
              background: "rgba(255,255,255,0.1)", 
              color: "#ffffff", 
              textDecoration: "none",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
          >
            <ArrowLeft size={16} />
            العودة
          </Link>
          <div>
            <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: "700", margin: 0 }}>
              تفاصيل الطلب #{String(order.id).padStart(4, "0")}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>
              {new Date(order.created_at).toLocaleDateString("ar-EG", { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        <div style={{
          padding: "8px 16px",
          borderRadius: "20px",
          background: `${statusColors[order.status]}20`,
          color: statusColors[order.status],
          fontSize: "12px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.1em"
        }}>
          {statusLabel[order.status] || order.status}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "24px" }}>
        {/* Customer & Order Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Customer Information */}
          <div className="admin-card">
            <h2 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={18} />
              معلومات العميل
            </h2>
            <div style={{ display: "grid", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <User size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
                <div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: "0 0 2px" }}>الاسم</p>
                  <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                    {order.customer_name}
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Phone size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
                <div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: "0 0 2px" }}>رقم الهاتف</p>
                  <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                    {order.phone}
                  </p>
                </div>
              </div>

              {order.email && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <CreditCard size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: "0 0 2px" }}>البريد الإلكتروني</p>
                    <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                      {order.email}
                    </p>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <MapPin size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
                <div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: "0 0 2px" }}>العنوان</p>
                  <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                    {order.address}, {order.city}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Package size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
                <div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: "0 0 2px" }}>طريقة الدفع</p>
                  <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                    {order.payment_method === "deposit" ? "الدفع عند الاستلام" : 
                     order.payment_method === "vodafone" ? "Vodafone Cash" :
                     order.payment_method === "instapay" ? "InstaPay" :
                     order.payment_method === "bank" ? "تحويل بنكي" : order.payment_method}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="admin-card">
            <h2 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Package size={18} />
              المنتجات ({items.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {items.map((item, index) => (
                <div key={index} style={{ 
                  display: "flex", 
                  gap: "16px", 
                  padding: "16px", 
                  background: "rgba(255,255,255,0.03)", 
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <div style={{ position: "relative", width: "80px", height: "100px", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                    <Image 
                      fill 
                      src={normalizeImageUrl(item.image)} 
                      alt={item.name} 
                      style={{ objectFit: "cover" }}
                      sizes="80px"
                    />
                    <div style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#f59e0b",
                      color: "#0f172a",
                      fontSize: "11px",
                      fontWeight: "800",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {item.quantity}
                    </div>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: "#ffffff", fontSize: "16px", fontWeight: "700", margin: "0 0 8px" }}>
                      {item.name}
                    </h3>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ 
                        fontSize: "11px", 
                        fontWeight: "600", 
                        padding: "4px 8px", 
                        borderRadius: "12px", 
                        background: "rgba(255,255,255,0.1)", 
                        color: "rgba(255,255,255,0.8)" 
                      }}>
                        {item.size}
                      </span>
                      <span style={{ 
                        fontSize: "11px", 
                        fontWeight: "600", 
                        padding: "4px 8px", 
                        borderRadius: "12px", 
                        background: "rgba(255,255,255,0.1)", 
                        color: "rgba(255,255,255,0.8)" 
                      }}>
                        {item.color}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                        {item.price} LE × {item.quantity}
                      </span>
                      <span style={{ color: "#f59e0b", fontSize: "16px", fontWeight: "700" }}>
                        {(parseFloat(item.price) * item.quantity).toFixed(2)} LE
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="admin-card">
            <h2 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>
              ملخص الطلب
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>الإجمالي الجزئي</span>
                <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600" }}>
                  {subtotal.toFixed(2)} LE
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>رسوم الشحن</span>
                <span style={{ color: shippingFee === 0 ? "#34d399" : "#ffffff", fontSize: "14px", fontWeight: "600" }}>
                  {shippingFee === 0 ? "مجاني" : `${shippingFee.toFixed(2)} LE`}
                </span>
              </div>

              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Tag size={14} style={{ color: "#34d399" }} />
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                      خصم الكوبون
                    </span>
                  </div>
                  <span style={{ color: "#34d399", fontSize: "14px", fontWeight: "600" }}>
                    {discount > 0 ? `-${discount.toFixed(2)} LE` : "مطبق"}
                  </span>
                </div>
              )}

              <div style={{ 
                borderTop: "1px solid rgba(255,255,255,0.1)", 
                paddingTop: "16px", 
                marginTop: "8px",
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center" 
              }}>
                <span style={{ color: "#ffffff", fontSize: "16px", fontWeight: "700" }}>الإجمالي</span>
                <span style={{ color: "#f59e0b", fontSize: "20px", fontWeight: "800" }}>
                  {total.toFixed(2)} LE
                </span>
              </div>
            </div>
          </div>

          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${order.phone}?text=${encodeURIComponent(
              `مرحباً ${order.customer_name}!\n\n` +
              `طلبك رقم #${String(order.id).padStart(4, "0")} تم استلامه بنجاح\n` +
              `الإجمالي: ${total.toFixed(2)} LE\n` +
              `الحالة: ${statusLabel[order.status] || order.status}\n\n` +
              `شكراً لتسوقك مع BLANKO! 🛍️`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "8px",
              textDecoration: "none",
              textAlign: "center"
            }}
          >
            <ArrowRight size={16} />
            تواصل مع العميل عبر واتساب
          </a>
        </div>
      </div>
    </div>
  );
}

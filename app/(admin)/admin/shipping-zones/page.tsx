"use client";
import { useState, useEffect } from "react";
import { shippingZonesApi, type ShippingZoneData } from "@/src/lib/api";
import { Plus, Edit2, Trash2, X, Check, Loader2 } from "lucide-react";

export default function AdminShippingZones() {
  const [zones, setZones] = useState<ShippingZoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ governorate: "", fee: "", enabled: true });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load zones
  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      setLoading(true);
      const data = await shippingZonesApi.list();
      setZones(data);
      setError("");
    } catch (err) {
      setError("فشل تحميل المحافظات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.governorate.trim() || !formData.fee.trim()) {
      setError("جميع الحقول مطلوبة");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await shippingZonesApi.update(editingId, {
          governorate: formData.governorate,
          fee: formData.fee,
          enabled: formData.enabled,
        });
        setSuccess("تم تحديث المحافظة بنجاح");
      } else {
        await shippingZonesApi.create({
          governorate: formData.governorate,
          fee: formData.fee,
          enabled: formData.enabled,
        });
        setSuccess("تم إضافة المحافظة بنجاح");
      }
      setFormData({ governorate: "", fee: "", enabled: true });
      setEditingId(null);
      setShowForm(false);
      await loadZones();
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err?.data?.governorate?.[0] || err?.data?.fee?.[0] || "حدث خطأ");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (zone: ShippingZoneData) => {
    setEditingId(zone.id);
    setFormData({
      governorate: zone.governorate,
      fee: zone.fee,
      enabled: zone.enabled,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه المحافظة؟")) return;
    try {
      await shippingZonesApi.delete(id);
      setSuccess("تم حذف المحافظة بنجاح");
      await loadZones();
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("فشل حذف المحافظة");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ governorate: "", fee: "", enabled: true });
    setError("");
  };

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <p className="section-tag" style={{ marginBottom: 8 }}>إدارة الشحن</p>
        <h2 style={{ color: "#ffffff", margin: "0 0 4px", fontSize: "clamp(1.4rem,3vw,2rem)" }}>المحافظات وأسعار الشحن</h2>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, margin: 0 }}>إدارة مناطق وأسعار الشحن المتاحة</p>
      </div>

      {/* Messages */}
      {error && (
        <div style={{ padding: "10px 16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#fca5a5" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: "10px 16px", background: "rgba(34, 197, 94, 0.1)", border: "1px solid #22c55e", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#86efac" }}>
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="admin-card" style={{ padding: 20, marginBottom: 16 }}>
          <h3 style={{ color: "#ffffff", fontSize: "1rem", fontWeight: 700, marginBottom: 16, marginTop: 0 }}>
            {editingId ? "تعديل المحافظة" : "إضافة محافظة جديدة"}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                اسم المحافظة *
              </label>
              <input
                type="text"
                value={formData.governorate}
                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                placeholder="مثال: القاهرة"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  color: "#ffffff",
                  fontSize: 13,
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                سعر الشحن (ج.م) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                placeholder="مثال: 50.00"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  color: "#ffffff",
                  fontSize: 13,
                  fontFamily: "inherit",
                }}
              />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                style={{ cursor: "pointer" }}
              />
              متاح للطلب
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "8px 16px",
                  background: submitting ? "#666" : "#f59e0b",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: submitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {submitting ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={14} />}
                {submitting ? "جاري..." : "حفظ"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <X size={14} /> إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Zones List */}
      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <h3 style={{ color: "#ffffff", fontSize: "1rem", fontWeight: 700, margin: 0 }}>قائمة المحافظات ({zones.length})</h3>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: "6px 14px",
                background: "#f59e0b",
                color: "#ffffff",
                border: "none",
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Plus size={14} /> إضافة محافظة
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
            <Loader2 size={24} style={{ marginBottom: 12, animation: "spin 1s linear infinite" }} />
            جاري التحميل...
          </div>
        ) : zones.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
            لا توجد محافظات
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    المحافظة
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    سعر الشحن
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    الحالة
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#ffffff" }}>
                      {zone.governorate}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#ffffff" }}>
                      {zone.fee} ج.م
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "3px 10px",
                          borderRadius: 50,
                          background: zone.enabled ? "rgba(52, 211, 153, 0.12)" : "rgba(107, 114, 128, 0.12)",
                          color: zone.enabled ? "#34d399" : "#9ca3af",
                        }}
                      >
                        {zone.enabled ? "متاح" : "معطل"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                        <button
                          onClick={() => handleEdit(zone)}
                          style={{
                            padding: "4px 8px",
                            background: "#60a5fa",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          <Edit2 size={12} /> تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(zone.id)}
                          style={{
                            padding: "4px 8px",
                            background: "#ef4444",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          <Trash2 size={12} /> حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

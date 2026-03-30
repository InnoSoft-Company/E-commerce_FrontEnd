"use client";
import { useState, useEffect } from "react";
import {
  Truck, Plus, Pencil, Trash2, Save, X,
  ToggleLeft, ToggleRight, Loader2, Package,
  CheckCircle, AlertCircle, GripVertical,
} from "lucide-react";
import { shippingZonesApi, type ShippingZoneData } from "@/src/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ZoneRow extends ShippingZoneData {
  _editing?: boolean;
  _dirty?:   boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ShippingZonesAdmin() {
  const [zones,   setZones]   = useState<ZoneRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState<number | "new" | null>(null);
  const [toast,   setToast]   = useState<{ msg: string; ok: boolean } | null>(null);

  // New zone form state
  const [showAdd,   setShowAdd]   = useState(false);
  const [newZone,   setNewZone]   = useState({ governorate: "", fee: "", enabled: true });
  const [addErr,    setAddErr]    = useState("");

  // ── Load zones ─────────────────────────────────────────────────────────────
  useEffect(() => {
    shippingZonesApi
      .list()
      .then(data =>
        setZones(
          [...data].sort((a, b) => a.order - b.order || a.governorate.localeCompare(b.governorate, "ar"))
        )
      )
      .catch(() => showToast("تعذّر تحميل مناطق الشحن", false))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Toggle enabled ──────────────────────────────────────────────────────────
  const toggleEnabled = async (zone: ZoneRow) => {
    const updated = { ...zone, enabled: !zone.enabled };
    setZones(z => z.map(r => (r.id === zone.id ? updated : r)));
    try {
      await shippingZonesApi.update(zone.id, { enabled: updated.enabled });
      showToast(`${zone.governorate}: ${updated.enabled ? "تم التفعيل" : "تم الإيقاف"}`, true);
    } catch {
      setZones(z => z.map(r => (r.id === zone.id ? zone : r))); // revert
      showToast("حدث خطأ", false);
    }
  };

  // ── Inline edit fee ─────────────────────────────────────────────────────────
  const startEdit = (id: number) =>
    setZones(z => z.map(r => ({ ...r, _editing: r.id === id })));

  const cancelEdit = (id: number) =>
    setZones(z => z.map(r => (r.id === id ? { ...r, _editing: false, _dirty: false } : r)));

  const changeFee = (id: number, val: string) =>
    setZones(z => z.map(r => (r.id === id ? { ...r, fee: val, _dirty: true } : r)));

  const saveFee = async (zone: ZoneRow) => {
    const fee = parseFloat(zone.fee);
    if (isNaN(fee) || fee < 0) return;
    setSaving(zone.id);
    try {
      const updated = await shippingZonesApi.update(zone.id, { fee: zone.fee });
      setZones(z =>
        z.map(r => (r.id === zone.id ? { ...updated, _editing: false } : r))
      );
      showToast(`✓ تم تحديث سعر شحن ${zone.governorate}`, true);
    } catch {
      showToast("تعذّر الحفظ", false);
    } finally {
      setSaving(null);
    }
  };

  // ── Delete zone ─────────────────────────────────────────────────────────────
  const deleteZone = async (zone: ZoneRow) => {
    if (!confirm(`هل تريد حذف ${zone.governorate}؟`)) return;
    setSaving(zone.id);
    try {
      await shippingZonesApi.delete(zone.id);
      setZones(z => z.filter(r => r.id !== zone.id));
      showToast(`تم حذف ${zone.governorate}`, true);
    } catch {
      showToast("تعذّر الحذف", false);
    } finally {
      setSaving(null);
    }
  };

  // ── Add new zone ────────────────────────────────────────────────────────────
  const addZone = async () => {
    setAddErr("");
    if (!newZone.governorate.trim()) { setAddErr("اكتب اسم المحافظة"); return; }
    const fee = parseFloat(newZone.fee);
    if (isNaN(fee) || fee < 0) { setAddErr("اكتب سعر شحن صحيح"); return; }
    setSaving("new");
    try {
      const created = await shippingZonesApi.create({
        governorate: newZone.governorate.trim(),
        fee:         String(fee),
        enabled:     newZone.enabled,
        order:       zones.length,
      } as any);
      setZones(z => [...z, created]);
      setNewZone({ governorate: "", fee: "", enabled: true });
      setShowAdd(false);
      showToast(`✓ تمت إضافة ${created.governorate}`, true);
    } catch {
      setAddErr("تعذّرت الإضافة — تأكد أن المحافظة غير موجودة مسبقاً");
    } finally {
      setSaving(null);
    }
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1.5px solid rgba(0,0,0,0.08)",
    borderRadius: 4,
    padding: "20px 24px",
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 16,
    transition: "box-shadow 0.18s",
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px 12px",
    border: "1.5px solid rgba(0,0,0,0.15)",
    borderRadius: 4,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
  };

  const btnStyle = (color: string, bg: string): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 14px", borderRadius: 4, border: "none",
    fontSize: 12, fontWeight: 700, cursor: "pointer",
    color, background: bg, transition: "opacity 0.15s",
  });

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", direction: "rtl" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, display: "flex", alignItems: "center", gap: 10,
          padding: "12px 22px", borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          background: toast.ok ? "#065f46" : "#7f1d1d",
          color: "#fff", fontSize: 14, fontWeight: 600, minWidth: 260,
        }}>
          {toast.ok
            ? <CheckCircle size={16} strokeWidth={2} />
            : <AlertCircle size={16} strokeWidth={2} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: "rgba(245,158,11,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Truck size={20} style={{ color: "#d97706" }} strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              إدارة الشحن
            </h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: "2px 0 0" }}>
              {zones.length} محافظة · {zones.filter(z => z.enabled).length} مفعّلة
            </p>
          </div>
        </div>

        <button
          onClick={() => { setShowAdd(!showAdd); setAddErr(""); }}
          style={btnStyle("#fff", "#0f172a")}
        >
          {showAdd ? <X size={14} /> : <Plus size={14} />}
          {showAdd ? "إلغاء" : "إضافة محافظة"}
        </button>
      </div>

      {/* Add new zone form */}
      {showAdd && (
        <div style={{
          background: "#f8fafc", border: "1.5px solid #cbd5e1", borderRadius: 6,
          padding: "20px 24px", marginBottom: 20,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>
            إضافة محافظة جديدة
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: 12, alignItems: "end" }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#64748b", display: "block", marginBottom: 6 }}>
                اسم المحافظة
              </label>
              <input
                value={newZone.governorate}
                onChange={e => setNewZone(n => ({ ...n, governorate: e.target.value }))}
                placeholder="مثال: القاهرة"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#64748b", display: "block", marginBottom: 6 }}>
                سعر الشحن (ج.م)
              </label>
              <input
                type="number"
                min="0"
                value={newZone.fee}
                onChange={e => setNewZone(n => ({ ...n, fee: e.target.value }))}
                placeholder="80"
                style={inputStyle}
              />
            </div>
            <button
              onClick={() => setNewZone(n => ({ ...n, enabled: !n.enabled }))}
              style={{ ...btnStyle(newZone.enabled ? "#fff" : "#64748b", newZone.enabled ? "#059669" : "#e2e8f0"), padding: "8px 12px", height: 40, marginTop: 22 }}
            >
              {newZone.enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              {newZone.enabled ? "مفعّل" : "موقوف"}
            </button>
            <button
              onClick={addZone}
              disabled={saving === "new"}
              style={{ ...btnStyle("#fff", "#d97706"), padding: "8px 16px", height: 40, marginTop: 22 }}
            >
              {saving === "new" ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Plus size={14} />}
              إضافة
            </button>
          </div>
          {addErr && (
            <p style={{ fontSize: 12, color: "#dc2626", marginTop: 8, fontWeight: 600 }}>{addErr}</p>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
          <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
          <p style={{ marginTop: 12 }}>جارٍ التحميل...</p>
        </div>
      )}

      {/* Zone list */}
      {!loading && zones.map(zone => (
        <div
          key={zone.id}
          style={{
            ...cardStyle,
            boxShadow: zone._editing ? "0 0 0 2px #f59e0b" : "none",
            opacity: saving === zone.id ? 0.7 : 1,
          }}
        >
          {/* Drag handle (visual only) */}
          <GripVertical size={16} style={{ color: "#cbd5e1", flexShrink: 0, cursor: "grab" }} />

          {/* Governorate name */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              {zone.governorate}
            </p>
          </div>

          {/* Fee — editable inline */}
          <div style={{ width: 160, flexShrink: 0 }}>
            {zone._editing ? (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="number"
                  min="0"
                  value={zone.fee}
                  onChange={e => changeFee(zone.id, e.target.value)}
                  style={{ ...inputStyle, width: 90, paddingLeft: 8, paddingRight: 8 }}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === "Enter") saveFee(zone);
                    if (e.key === "Escape") cancelEdit(zone.id);
                  }}
                />
                <span style={{ fontSize: 12, color: "#64748b" }}>ج.م</span>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Package size={14} style={{ color: "#d97706" }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#d97706" }}>
                  {parseFloat(zone.fee).toFixed(0)} ج.م
                </span>
              </div>
            )}
          </div>

          {/* Enabled toggle */}
          <button
            onClick={() => toggleEnabled(zone)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
              background: zone.enabled ? "rgba(5,150,105,0.1)" : "rgba(100,116,139,0.1)",
              color: zone.enabled ? "#059669" : "#94a3b8",
              transition: "all 0.18s",
            }}
          >
            {zone.enabled
              ? <ToggleRight size={16} strokeWidth={2} />
              : <ToggleLeft size={16} strokeWidth={2} />}
            {zone.enabled ? "مفعّل" : "موقوف"}
          </button>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {zone._editing ? (
              <>
                <button
                  onClick={() => saveFee(zone)}
                  disabled={saving === zone.id}
                  style={btnStyle("#fff", "#059669")}
                  title="حفظ"
                >
                  {saving === zone.id
                    ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                    : <Save size={14} />}
                </button>
                <button onClick={() => cancelEdit(zone.id)} style={btnStyle("#64748b", "#e2e8f0")} title="إلغاء">
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => startEdit(zone.id)} style={btnStyle("#0f172a", "#f1f5f9")} title="تعديل السعر">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deleteZone(zone)}
                  disabled={saving === zone.id}
                  style={btnStyle("#dc2626", "#fee2e2")}
                  title="حذف"
                >
                  {saving === zone.id
                    ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                    : <Trash2 size={14} />}
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {!loading && zones.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
          <Truck size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p>لا توجد مناطق شحن بعد. اضغط "إضافة محافظة" للبدء.</p>
        </div>
      )}

      {/* Summary row */}
      {!loading && zones.length > 0 && (
        <div style={{
          marginTop: 20, padding: "14px 20px", background: "#f8fafc",
          border: "1px solid #e2e8f0", borderRadius: 6,
          display: "flex", gap: 32, flexWrap: "wrap",
        }}>
          {[
            { label: "إجمالي المحافظات", val: zones.length },
            { label: "مفعّلة",           val: zones.filter(z => z.enabled).length, color: "#059669" },
            { label: "موقوفة",           val: zones.filter(z => !z.enabled).length, color: "#94a3b8" },
            { label: "أقل سعر شحن",      val: Math.min(...zones.map(z => parseFloat(z.fee))) + " ج.م" },
            { label: "أعلى سعر شحن",     val: Math.max(...zones.map(z => parseFloat(z.fee))) + " ج.م" },
          ].map(item => (
            <div key={item.label}>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 3px", fontWeight: 600, letterSpacing: "0.1em" }}>
                {item.label}
              </p>
              <p style={{ fontSize: 18, fontWeight: 800, color: (item as any).color ?? "#0f172a", margin: 0 }}>
                {item.val}
              </p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.5 }
      `}</style>
    </div>
  );
}

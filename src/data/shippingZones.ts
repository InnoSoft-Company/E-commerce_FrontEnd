/**
 * BLANKO — Shipping Zones
 * ─────────────────────────────────────────────────────────────────────────────
 * الـ zones دي بتيجي من الـ backend عن طريق /api/shipping-zones/
 * الأدمين بيتحكم فيها من Django Admin مباشرةً.
 *
 * الـ static array دي fallback لو الـ backend مش شغال.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface ShippingZone {
  id?:         number;
  governorate: string;
  fee:         number;
  enabled:     boolean;
  order?:      number;
}

// ── Static fallback ──────────────────────────────────────────────────────────
export const SHIPPING_ZONES_FALLBACK: ShippingZone[] = [
  { governorate: "القاهرة",       fee: 50,  enabled: true },
  { governorate: "الجيزة",        fee: 60,  enabled: true },
  { governorate: "الإسكندرية",    fee: 70,  enabled: true },
  { governorate: "القليوبية",     fee: 65,  enabled: true },
  { governorate: "الغربية",       fee: 75,  enabled: true },
  { governorate: "المنوفية",      fee: 75,  enabled: true },
  { governorate: "الدقهلية",      fee: 80,  enabled: true },
  { governorate: "الشرقية",       fee: 80,  enabled: true },
  { governorate: "البحيرة",       fee: 80,  enabled: true },
  { governorate: "الفيوم",        fee: 80,  enabled: true },
  { governorate: "بني سويف",      fee: 80,  enabled: true },
  { governorate: "المنيا",        fee: 85,  enabled: true },
  { governorate: "أسيوط",         fee: 85,  enabled: true },
  { governorate: "سوهاج",         fee: 90,  enabled: true },
  { governorate: "قنا",           fee: 90,  enabled: true },
  { governorate: "الأقصر",        fee: 95,  enabled: true },
  { governorate: "أسوان",         fee: 95,  enabled: true },
  { governorate: "كفر الشيخ",     fee: 80,  enabled: true },
  { governorate: "دمياط",         fee: 80,  enabled: true },
  { governorate: "بورسعيد",       fee: 85,  enabled: true },
  { governorate: "الإسماعيلية",   fee: 80,  enabled: true },
  { governorate: "السويس",        fee: 85,  enabled: true },
  { governorate: "مطروح",         fee: 100, enabled: true },
  { governorate: "البحر الأحمر",  fee: 100, enabled: true },
  { governorate: "الوادي الجديد", fee: 100, enabled: true },
  { governorate: "شمال سيناء",    fee: 100, enabled: true },
  { governorate: "جنوب سيناء",    fee: 100, enabled: true },
];

/** Fetch zones from backend. Falls back to static list on error. */
export async function fetchShippingZones(): Promise<ShippingZone[]> {
  try {
    const res = await fetch(`${BASE}/shipping-zones/`, { cache: "no-store" });
    if (!res.ok) throw new Error("API error");
    const data: { governorate: string; fee: string; enabled: boolean; id: number; order: number }[] = await res.json();
    return data
      .filter(z => z.enabled)
      .map(z => ({ ...z, fee: parseFloat(z.fee) }));
  } catch {
    return SHIPPING_ZONES_FALLBACK.filter(z => z.enabled);
  }
}

/** Sync fallback lookup (used inside components that already have zones loaded). */
export function getShippingFee(governorate: string, zones: ShippingZone[] = SHIPPING_ZONES_FALLBACK): number {
  const zone = zones.find(z => z.governorate === governorate);
  return zone?.fee ?? 80;
}

/** Only enabled fallback zones — used as default until API resolves. */
export const enabledZones = SHIPPING_ZONES_FALLBACK.filter(z => z.enabled);

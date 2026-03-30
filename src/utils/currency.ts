/**
 * تنسيق السعر بالجنيه المصري
 * الأسعار في قاعدة البيانات بالجنيه المصري مباشرةً — لا يوجد تحويل
 */

export function formatPrice(price: number | string): string {
  const val = Math.round(parseFloat(String(price)));
  return val.toLocaleString("ar-EG") + " ج.م";
}

export function formatPriceRaw(price: number | string): string {
  return Math.round(parseFloat(String(price))).toLocaleString("ar-EG");
}

/** للتوافق مع الكود القديم — لا يحول، يرجع نفس الرقم */
export function toEGP(price: number | string): number {
  return Math.round(parseFloat(String(price)));
}

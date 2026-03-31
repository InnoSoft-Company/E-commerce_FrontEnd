/**
 * Normalize image URL for Next.js Image component
 * - Handles absolute URLs (http:/https://)
 * - Handles paths starting with /
 * - Converts relative paths to full URLs pointing to backend media folder
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  // Already an absolute URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Already a path starting with /
  if (url.startsWith("/")) {
    return url;
  }

  // Relative path - convert to backend media URL
  return `https://midoghanam.pythonanywhere.com/media/${url}`;
}

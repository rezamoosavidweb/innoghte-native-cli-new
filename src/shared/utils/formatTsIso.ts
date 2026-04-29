/**
 * Formats ISO date strings for display using the app's locale conventions.
 */
export function formatTsIso(iso: string, locale: string): string {
  try {
    const ms = Date.parse(iso);
    return new Date(ms).toLocaleString(locale === 'fa' ? 'fa-IR' : undefined);
  } catch {
    return iso;
  }
}

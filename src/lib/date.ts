/**
 * Shared date formatting utilities for consistent id-ID locale output.
 * Use these instead of inline toLocaleDateString calls throughout the app.
 */

const LOCALE = "id-ID";

/**
 * "12 Juli 2025"  — short date, no time.
 * Handles string | Date | null | undefined; returns "—" for invalid input.
 */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(LOCALE);
}

/**
 * "Jumat, 12 Juli 2025" — full weekday + date (used in document headers).
 */
export function formatDateFull(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(LOCALE, { dateStyle: "full" });
}

/**
 * "12 Jul 2025" — compact form (e.g. dashboard tiles, manager cards).
 */
export function formatDateShort(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(LOCALE, { day: "numeric", month: "short", year: "numeric" });
}

/**
 * "12 Juli 2025" — long month name, no weekday.
 */
export function formatDateLong(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(LOCALE, { year: "numeric", month: "long", day: "numeric" });
}

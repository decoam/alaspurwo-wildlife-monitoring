export function formatDate(dateInput: string | Date | number | undefined | null): string {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID");
}

export function formatDateFull(dateInput: string | Date | number | undefined | null): string {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", { dateStyle: "full" });
}

export function formatDateLong(dateInput: string | Date | number | undefined | null): string {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
}

export function formatDateShort(dateInput: string | Date | number | undefined | null): string {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

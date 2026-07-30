import { type Locale } from "date-fns/locale";

const formatDateWithOptions = (
  dateInput: string | Date | number | undefined | null,
  options: Intl.DateTimeFormatOptions,
  locale: Locale | string = "id-ID"
): string => {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(locale as string, options).format(date);
};

export function formatDate(
  dateInput: string | Date | number | undefined | null
): string {
  return formatDateWithOptions(dateInput, {});
}

export function formatDateFull(
  dateInput: string | Date | number | undefined | null
): string {
  return formatDateWithOptions(dateInput, { dateStyle: "full" });
}

export function formatDateLong(
  dateInput: string | Date | number | undefined | null
): string {
  return formatDateWithOptions(dateInput, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(
  dateInput: string | Date | number | undefined | null
): string {
  return formatDateWithOptions(dateInput, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

import { Currencies } from "@/lib/currencies";

export function DateToUTCDate(date: Date | undefined): string {
  if (!date || isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  ).toISOString();
}

export function GetFormatterForCurrency(currency: string) {
  const locale = Currencies.find((c) => c.value === currency)?.locale;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}
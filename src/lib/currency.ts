import Storage from "expo-sqlite/kv-store";

import { CURRENCY_KEY } from "@/constants/storage-keys";
import { DEFAULT_CURRENCY_CODE } from "@/lib/forms/item-form-schema";
import { formatCurrency } from "@/lib/money-format";

/** Curated ISO 4217 codes for the Settings picker (alphabetical). */
const CURATED_CURRENCY_CODES = [
  "AED",
  "AMD",
  "ARS",
  "AUD",
  "AZN",
  "BDT",
  "BGN",
  "BHD",
  "BRL",
  "CAD",
  "CHF",
  "CLP",
  "CNY",
  "COP",
  "CZK",
  "DKK",
  "DZD",
  "EGP",
  "EUR",
  "GBP",
  "GEL",
  "GHS",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JOD",
  "JPY",
  "KES",
  "KRW",
  "KWD",
  "KZT",
  "LKR",
  "MAD",
  "MMK",
  "MXN",
  "MYR",
  "NGN",
  "NOK",
  "NPR",
  "NZD",
  "OMR",
  "PEN",
  "PHP",
  "PKR",
  "PLN",
  "QAR",
  "RON",
  "RSD",
  "RUB",
  "SAR",
  "SEK",
  "SGD",
  "THB",
  "TND",
  "TRY",
  "TWD",
  "UAH",
  "USD",
  "UYU",
  "UZS",
  "VND",
  "ZAR",
] as const;

function buildCurrencyLabel(code: string): string {
  const formatted = formatCurrency(0, code);
  const symbol = formatted.replace(/[\d.,\s\u00a0-]/g, "") || code;
  return `${code} (${symbol})`;
}

export const CURRENCY_OPTIONS = CURATED_CURRENCY_CODES.map((code) => ({
  value: code,
  label: buildCurrencyLabel(code),
}));

export function getCurrencyOptionLabel(code: string): string {
  return CURRENCY_OPTIONS.find((option) => option.value === code)?.label ?? code;
}

export const SUPPORTED_CURRENCY_CODES = new Set<string>(CURATED_CURRENCY_CODES);

export function isSupportedCurrencyCode(code: string): boolean {
  return SUPPORTED_CURRENCY_CODES.has(code);
}

/** Non-reactive kv-store read. Prefer `useSettings()` in React components. */
export function getCurrencyCode(): string {
  return Storage.getItemSync(CURRENCY_KEY) ?? DEFAULT_CURRENCY_CODE;
}

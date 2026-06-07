import Storage from "expo-sqlite/kv-store";

import { CURRENCY_KEY } from "@/constants/storage-keys";
import { DEFAULT_CURRENCY_CODE } from "@/lib/forms/item-form-schema";

/** Common currencies for the Settings picker. */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "CA$",
  AUD: "A$",
  JPY: "¥",
  KRW: "₩",
  CHF: "CHF",
  NZD: "NZ$",
  SGD: "S$",
};

export const CURRENCY_OPTIONS = Object.entries(CURRENCY_SYMBOLS).map(
  ([code, symbol]) => ({
    value: code,
    label: `${code} (${symbol})`,
  })
);

/** Non-reactive kv-store read. Prefer `useSettings()` in React components. */
export function getCurrencyCode(): string {
  return Storage.getItemSync(CURRENCY_KEY) ?? DEFAULT_CURRENCY_CODE;
}

import Storage from "expo-sqlite/kv-store";

import { CURRENCY_KEY } from "@/constants/storage-keys";
import { DEFAULT_CURRENCY_CODE } from "@/lib/forms/item-form-schema";

export function getCurrencyCode(): string {
  return Storage.getItemSync(CURRENCY_KEY) ?? DEFAULT_CURRENCY_CODE;
}

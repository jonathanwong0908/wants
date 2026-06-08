import Storage from "expo-sqlite/kv-store";

import { IS_PRO_KEY } from "@/constants/storage-keys";

export function readIsPro(): boolean {
  return Storage.getItemSync(IS_PRO_KEY) === "true";
}

/** Stub until PurchasesProvider mirrors RevenueCat entitlement to kv-store. */
export function useIsPro(): boolean {
  return readIsPro();
}

import Storage from "expo-sqlite/kv-store";

import { IS_PRO_KEY, PRO_PLAN_KEY } from "@/constants/storage-keys";

/** Non-reactive kv-store read. Prefer `useIsPro()` / `usePurchases()` in React components. */
export function readIsPro(): boolean {
  return Storage.getItemSync(IS_PRO_KEY) === "true";
}

export function writeIsPro(value: boolean): void {
  if (value) {
    Storage.setItemSync(IS_PRO_KEY, "true");
  } else {
    Storage.removeItemSync(IS_PRO_KEY);
    Storage.removeItemSync(PRO_PLAN_KEY);
  }
}

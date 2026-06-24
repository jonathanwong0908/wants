import { usePurchases } from "@/contexts/purchases-context";

export { readIsPro, readProPlan } from "@/lib/pro-status";

/** Thin selector over PurchasesProvider. */
export function useIsPro(): boolean {
  return usePurchases().isPro;
}

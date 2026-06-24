import { usePro } from "@/contexts/pro-context";

export { readIsPro } from "@/lib/pro-status";

/** Thin selector over ProProvider (placeholder for PurchasesProvider). */
export function useIsPro(): boolean {
  return usePro().isPro;
}

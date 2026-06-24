import Storage from "expo-sqlite/kv-store";

import { IS_PRO_KEY, PRO_PLAN_KEY } from "@/constants/storage-keys";
import type { PaywallPlanId } from "@/lib/paywall-placeholder-offerings";

const PRO_PLAN_IDS: PaywallPlanId[] = ["monthly", "annual", "lifetime"];

function isPaywallPlanId(value: string): value is PaywallPlanId {
  return PRO_PLAN_IDS.includes(value as PaywallPlanId);
}

/** Non-reactive kv-store read. Prefer `useIsPro()` / `usePro()` in React components. */
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

/** Non-reactive kv-store read. Prefer `usePro().proPlan` in React components. */
export function readProPlan(): PaywallPlanId | null {
  const value = Storage.getItemSync(PRO_PLAN_KEY);
  if (!value || !isPaywallPlanId(value)) {
    return null;
  }
  return value;
}

export function writeProPlan(planId: PaywallPlanId | null): void {
  if (planId) {
    Storage.setItemSync(PRO_PLAN_KEY, planId);
  } else {
    Storage.removeItemSync(PRO_PLAN_KEY);
  }
}

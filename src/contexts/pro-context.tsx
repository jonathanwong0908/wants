import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Alert } from "react-native";

import {
  readIsPro,
  readProPlan,
  writeIsPro,
  writeProPlan,
} from "@/lib/pro-status";
import type { PaywallPlanId } from "@/lib/paywall-placeholder-offerings";

export type ProContextValue = {
  isPro: boolean;
  proPlan: PaywallPlanId | null;
  loading: false;
  purchasePlaceholder: (planId: PaywallPlanId) => Promise<void>;
  restorePlaceholder: () => Promise<void>;
  resetPlaceholder: () => void;
  refresh: () => void;
};

const ProContext = createContext<ProContextValue | null>(null);

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(() => readIsPro());
  const [proPlan, setProPlan] = useState(() => readProPlan());

  const refresh = useCallback(() => {
    setIsPro(readIsPro());
    setProPlan(readProPlan());
  }, []);

  const purchasePlaceholder = useCallback(async (planId: PaywallPlanId) => {
    writeIsPro(true);
    writeProPlan(planId);
    setIsPro(true);
    setProPlan(planId);
  }, []);

  const restorePlaceholder = useCallback(async () => {
    refresh();

    if (readIsPro()) {
      Alert.alert("Restore purchases", "Wants Pro is active.");
    } else {
      Alert.alert("Restore purchases", "No purchases to restore.");
    }
  }, [refresh]);

  const resetPlaceholder = useCallback(() => {
    writeIsPro(false);
    setIsPro(false);
    setProPlan(null);
  }, []);

  const value = useMemo<ProContextValue>(
    () => ({
      isPro,
      proPlan,
      loading: false,
      purchasePlaceholder,
      restorePlaceholder,
      resetPlaceholder,
      refresh,
    }),
    [
      isPro,
      proPlan,
      purchasePlaceholder,
      restorePlaceholder,
      resetPlaceholder,
      refresh,
    ]
  );

  return <ProContext.Provider value={value}>{children}</ProContext.Provider>;
}

export function usePro(): ProContextValue {
  const ctx = useContext(ProContext);
  if (!ctx) {
    throw new Error("usePro must be used within ProProvider");
  }
  return ctx;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Alert, AppState, type AppStateStatus } from "react-native";
import Purchases, {
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
} from "react-native-purchases";

import {
  configurePurchases,
  describeOfferingsState,
  getActiveOffering,
  getCustomerInfo,
  getOfferings,
  isPurchaseCancelledError,
  purchasePackage,
  restorePurchases,
  syncProStatusFromCustomerInfo,
} from "@/lib/purchases";
import type { PaywallPlanId } from "@/lib/paywall-placeholder-offerings";
import {
  readIsPro,
  readProPlan,
  writeIsPro,
  writeProPlan,
} from "@/lib/pro-status";

export type PurchasesContextValue = {
  isPro: boolean;
  proPlan: PaywallPlanId | null;
  offerings: PurchasesOfferings | null;
  loading: boolean;
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<void>;
  refresh: () => Promise<void>;
  resetDevPro: () => void;
  setDevProOverride: (on: boolean, planId?: PaywallPlanId) => void;
};

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

function applyCustomerInfoToState(
  customerInfo: CustomerInfo,
  setIsPro: (value: boolean) => void,
  setProPlan: (value: PaywallPlanId | null) => void
): void {
  const { isPro, proPlan } = syncProStatusFromCustomerInfo(customerInfo);
  setIsPro(isPro);
  setProPlan(proPlan);
}

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(() => readIsPro());
  const [proPlan, setProPlan] = useState(() => readProPlan());
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [loading, setLoading] = useState(true);
  const devProOverrideRef = useRef<boolean | null>(null);

  const shouldApplyRemoteUpdate = useCallback(() => {
    return !__DEV__ || devProOverrideRef.current === null;
  }, []);

  const applyRemoteCustomerInfo = useCallback(
    (customerInfo: CustomerInfo) => {
      if (!shouldApplyRemoteUpdate()) {
        return;
      }
      applyCustomerInfoToState(customerInfo, setIsPro, setProPlan);
    },
    [shouldApplyRemoteUpdate]
  );

  const refresh = useCallback(async () => {
    const [customerInfo, nextOfferings] = await Promise.all([
      getCustomerInfo(),
      getOfferings(),
    ]);
    setOfferings(nextOfferings);
    applyRemoteCustomerInfo(customerInfo);
  }, [applyRemoteCustomerInfo]);

  useEffect(() => {
    let cancelled = false;

    const listener = (customerInfo: CustomerInfo) => {
      applyRemoteCustomerInfo(customerInfo);
    };

    async function initializePurchases() {
      try {
        configurePurchases();
        const [customerInfo, nextOfferings] = await Promise.all([
          getCustomerInfo(),
          getOfferings(),
        ]);
        if (cancelled) return;
        setOfferings(nextOfferings);
        applyRemoteCustomerInfo(customerInfo);
        if (__DEV__ && !getActiveOffering(nextOfferings)) {
          console.warn(
            "RevenueCat offerings loaded but no packages found:",
            describeOfferingsState(nextOfferings)
          );
        }
        Purchases.addCustomerInfoUpdateListener(listener);
      } catch (error) {
        console.warn("RevenueCat initialization failed:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializePurchases();

    return () => {
      cancelled = true;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [applyRemoteCustomerInfo]);

  useEffect(() => {
    function handleAppStateChange(nextState: AppStateStatus) {
      if (nextState !== "active") return;
      void refresh().catch((error) => {
        console.warn("RevenueCat foreground refresh failed:", error);
      });
    }

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [refresh]);

  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      const customerInfo = await purchasePackage(pkg);
      devProOverrideRef.current = null;
      applyCustomerInfoToState(customerInfo, setIsPro, setProPlan);
      return true;
    } catch (error) {
      if (isPurchaseCancelledError(error)) {
        return false;
      }
      throw error;
    }
  }, []);

  const restore = useCallback(async () => {
    try {
      const customerInfo = await restorePurchases();
      devProOverrideRef.current = null;
      applyCustomerInfoToState(customerInfo, setIsPro, setProPlan);

      if (readIsPro()) {
        Alert.alert("Restore purchases", "Wants Pro is active.");
      } else {
        Alert.alert("Restore purchases", "No purchases to restore.");
      }
    } catch (error) {
      console.warn("Restore purchases failed:", error);
      Alert.alert("Restore purchases", "Could not restore purchases. Try again.");
    }
  }, []);

  const resetDevPro = useCallback(() => {
    if (!__DEV__) return;

    devProOverrideRef.current = null;
    writeIsPro(false);
    writeProPlan(null);
    setIsPro(false);
    setProPlan(null);

    void refresh().catch((error) => {
      console.warn("RevenueCat refresh after dev reset failed:", error);
    });
  }, [refresh]);

  const setDevProOverride = useCallback(
    (on: boolean, planId?: PaywallPlanId) => {
      if (!__DEV__) return;

      const plan = on ? (planId ?? readProPlan() ?? "annual") : null;
      devProOverrideRef.current = on;
      writeIsPro(on);
      writeProPlan(plan);
      setIsPro(on);
      setProPlan(plan);
    },
    []
  );

  const value = useMemo<PurchasesContextValue>(
    () => ({
      isPro,
      proPlan,
      offerings,
      loading,
      purchase,
      restore,
      refresh,
      resetDevPro,
      setDevProOverride,
    }),
    [
      isPro,
      proPlan,
      offerings,
      loading,
      purchase,
      restore,
      refresh,
      resetDevPro,
      setDevProOverride,
    ]
  );

  return (
    <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>
  );
}

export function usePurchases(): PurchasesContextValue {
  const ctx = useContext(PurchasesContext);
  if (!ctx) {
    throw new Error("usePurchases must be used within PurchasesProvider");
  }
  return ctx;
}

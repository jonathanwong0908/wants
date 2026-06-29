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
import { readIsPro, writeIsPro } from "@/lib/pro-status";

export type PurchasesContextValue = {
  isPro: boolean;
  offerings: PurchasesOfferings | null;
  loading: boolean;
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<void>;
  refresh: () => Promise<void>;
  resetDevPro: () => void;
  setDevProOverride: (on: boolean) => void;
};

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

function applyCustomerInfoToState(
  customerInfo: CustomerInfo,
  setIsPro: (value: boolean) => void
): void {
  const { isPro } = syncProStatusFromCustomerInfo(customerInfo);
  setIsPro(isPro);
}

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(() => readIsPro());
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
      applyCustomerInfoToState(customerInfo, setIsPro);
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
      applyCustomerInfoToState(customerInfo, setIsPro);
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
      applyCustomerInfoToState(customerInfo, setIsPro);

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
    setIsPro(false);

    void refresh().catch((error) => {
      console.warn("RevenueCat refresh after dev reset failed:", error);
    });
  }, [refresh]);

  const setDevProOverride = useCallback((on: boolean) => {
    if (!__DEV__) return;

    devProOverrideRef.current = on;
    writeIsPro(on);
    setIsPro(on);
  }, []);

  const value = useMemo<PurchasesContextValue>(
    () => ({
      isPro,
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

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Alert } from "react-native";

import { readIsPro, writeIsPro } from "@/lib/pro-status";

export type ProContextValue = {
  isPro: boolean;
  loading: false;
  purchasePlaceholder: () => Promise<void>;
  restorePlaceholder: () => Promise<void>;
  refresh: () => void;
};

const ProContext = createContext<ProContextValue | null>(null);

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(() => readIsPro());

  const refresh = useCallback(() => {
    setIsPro(readIsPro());
  }, []);

  const purchasePlaceholder = useCallback(async () => {
    writeIsPro(true);
    setIsPro(true);
  }, []);

  const restorePlaceholder = useCallback(async () => {
    refresh();

    if (readIsPro()) {
      Alert.alert("Restore purchases", "Wants Pro is active.");
    } else {
      Alert.alert("Restore purchases", "No purchases to restore.");
    }
  }, [refresh]);

  const value = useMemo<ProContextValue>(
    () => ({
      isPro,
      loading: false,
      purchasePlaceholder,
      restorePlaceholder,
      refresh,
    }),
    [isPro, purchasePlaceholder, restorePlaceholder, refresh]
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

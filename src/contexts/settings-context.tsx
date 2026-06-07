import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAppReady } from "@/contexts/app-ready-context";
import {
  detectDeviceCurrencyCode,
  hasStoredCurrencyCode,
  readCurrencyCode,
  readDefaultDelayHours,
  readSettingsFromStorage,
  seedInitialSettingsIfNeeded,
  writeCurrencyCode,
  writeDefaultDelayHours,
} from "@/lib/settings";

export type SettingsValue = {
  currencyCode: string;
  defaultDelayHours: number;
  setCurrencyCode: (code: string) => void;
  setDefaultDelayHours: (hours: number) => void;
};

const SettingsContext = createContext<SettingsValue | null>(null);

function loadSettingsForOnboardingState(onboardingComplete: boolean): {
  currencyCode: string;
  defaultDelayHours: number;
} {
  if (onboardingComplete) {
    seedInitialSettingsIfNeeded();
    return readSettingsFromStorage();
  }

  return {
    currencyCode: hasStoredCurrencyCode()
      ? readCurrencyCode()
      : detectDeviceCurrencyCode(),
    defaultDelayHours: readDefaultDelayHours(),
  };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { onboardingComplete } = useAppReady();
  const [settings, setSettings] = useState(() =>
    loadSettingsForOnboardingState(onboardingComplete)
  );

  useEffect(() => {
    if (!onboardingComplete) return;
    seedInitialSettingsIfNeeded();
    setSettings(readSettingsFromStorage());
  }, [onboardingComplete]);

  const setCurrencyCode = useCallback((code: string) => {
    writeCurrencyCode(code);
    setSettings((prev) => ({ ...prev, currencyCode: code }));
  }, []);

  const setDefaultDelayHours = useCallback((hours: number) => {
    writeDefaultDelayHours(hours);
    setSettings((prev) => ({ ...prev, defaultDelayHours: hours }));
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        currencyCode: settings.currencyCode,
        defaultDelayHours: settings.defaultDelayHours,
        setCurrencyCode,
        setDefaultDelayHours,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}

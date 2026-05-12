import { createContext, useContext, type ReactNode } from "react";

export type AppReadyValue = {
  onboardingComplete: boolean;
};

const AppReadyContext = createContext<AppReadyValue | null>(null);

export function AppReadyProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: AppReadyValue;
}) {
  return <AppReadyContext.Provider value={value}>{children}</AppReadyContext.Provider>;
}

export function useAppReady() {
  const ctx = useContext(AppReadyContext);
  if (!ctx) {
    throw new Error("useAppReady must be used within AppReadyProvider");
  }
  return ctx;
}

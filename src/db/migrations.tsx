import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SplashScreen from "expo-splash-screen";
import Storage from "expo-sqlite/kv-store";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

import { SplashScreenController } from "@/components/splash-screen-controller";
import { AppReadyProvider } from "@/contexts/app-ready-context";
import { PurchasesProvider } from "@/contexts/purchases-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { ONBOARDING_COMPLETE_KEY } from "@/constants/storage-keys";
import { useAppFonts } from "@/lib/fonts/load-app-fonts";

import migrations from "../../drizzle/migrations.js";
import { db } from "./client";

// Keep the native splash visible until migrations finish and theme is ready (see SplashScreenController).
SplashScreen.preventAutoHideAsync().catch((reason) => {
  console.warn(reason);
});

type AppReadyGateProps = {
  children: ReactNode;
};

function readOnboardingComplete(): boolean {
  return Storage.getItemSync(ONBOARDING_COMPLETE_KEY) === "true";
}

function AppReadyWithOnboarding({ children }: { children: ReactNode }) {
  const [onboardingComplete, setOnboardingState] = useState(readOnboardingComplete);

  const setOnboardingComplete = useCallback((complete: boolean) => {
    if (complete) {
      Storage.setItemSync(ONBOARDING_COMPLETE_KEY, "true");
    } else {
      Storage.removeItemSync(ONBOARDING_COMPLETE_KEY);
    }
    setOnboardingState(complete);
  }, []);

  return (
    <AppReadyProvider value={{ onboardingComplete, setOnboardingComplete }}>
      <SettingsProvider>
        <PurchasesProvider>
          <ThemeProvider>
            <SplashScreenController />
            {children}
          </ThemeProvider>
        </PurchasesProvider>
      </SettingsProvider>
    </AppReadyProvider>
  );
}

export function AppReadyGate({ children }: AppReadyGateProps) {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!error) return;
    SplashScreen.hideAsync().catch((reason) => {
      console.warn(reason);
    });
  }, [error]);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return null;
  }

  return <AppReadyWithFonts>{children}</AppReadyWithFonts>;
}

function AppReadyWithFonts({ children }: { children: ReactNode }) {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return <AppReadyWithOnboarding>{children}</AppReadyWithOnboarding>;
}

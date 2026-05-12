import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SplashScreen from "expo-splash-screen";
import Storage from "expo-sqlite/kv-store";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Text, View } from "react-native";

import { AppReadyProvider } from "@/contexts/app-ready-context";
import { ONBOARDING_COMPLETE_KEY } from "@/constants/storage-keys";

import migrations from "../../drizzle/migrations.js";
import { db } from "./client";

// Keep the native splash visible until migrations finish and onboarding flag is read (see hideAsync below).
SplashScreen.preventAutoHideAsync().catch((reason) => {
  console.warn(reason);
});

type AppReadyGateProps = {
  children: ReactNode;
};

function readOnboardingComplete(): boolean {
  return Storage.getItemSync(ONBOARDING_COMPLETE_KEY) === "true";
}

export function AppReadyGate({ children }: AppReadyGateProps) {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!success && !error) return;
    SplashScreen.hideAsync().catch((reason) => {
      console.warn(reason);
    });
  }, [success, error]);

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

  const onboardingComplete = readOnboardingComplete();

  return (
    <AppReadyProvider value={{ onboardingComplete }}>{children}</AppReadyProvider>
  );
}

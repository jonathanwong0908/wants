import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SplashScreen from "expo-splash-screen";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Text, View } from "react-native";

import migrations from "../../drizzle/migrations.js";
import { db } from "./client";

// Keep the native splash visible until migrations finish (see SplashScreen.hideAsync below).
SplashScreen.preventAutoHideAsync().catch((reason) => {
  console.warn(reason);
});

type DatabaseMigrationsGateProps = {
  children: ReactNode;
};

export function DatabaseMigrationsGate({ children }: DatabaseMigrationsGateProps) {
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

  return <>{children}</>;
}

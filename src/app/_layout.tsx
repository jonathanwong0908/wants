import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppReadyGate } from "@/db/migrations";
import { PortalHost } from "@rn-primitives/portal";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppReadyGate>
        <Stack screenOptions={{ headerShown: false }} />
        <PortalHost name="root" />
      </AppReadyGate>
    </SafeAreaProvider>
  );
}

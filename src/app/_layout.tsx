import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppReadyGate } from "@/db/migrations";
import { PortalHost } from "@rn-primitives/portal";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppReadyGate>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen
            name="settings"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen name="all-wants" />
          <Stack.Screen
            name="add-want"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="want/[id]"
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack>
        <PortalHost />
      </AppReadyGate>
    </SafeAreaProvider>
  );
}

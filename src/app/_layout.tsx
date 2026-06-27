import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { NotificationBootstrap } from "@/components/notification-bootstrap";
import { ThemeRoot } from "@/components/theme-root";
import { AppReadyGate } from "@/db/migrations";
import "@/lib/notifications";
import { bootstrapThemeColorScheme } from "@/lib/themes/bootstrap";
import { PortalHost } from "@rn-primitives/portal";
import "../global.css";

bootstrapThemeColorScheme();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
      <AppReadyGate>
        <NotificationBootstrap />
        <ThemeRoot>
          <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen
            name="settings"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="paywall"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen name="all-wants" />
          <Stack.Screen name="total-saved" />
          <Stack.Screen
            name="add-want"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="want/[id]"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="edit-want/[id]"
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack>
        </ThemeRoot>
        <PortalHost />
      </AppReadyGate>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

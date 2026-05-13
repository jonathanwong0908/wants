import { Stack } from "expo-router";

import { AppReadyGate } from "@/db/migrations";
import { PortalHost } from "@rn-primitives/portal";
import "../global.css";

export default function RootLayout() {
  return (
    <AppReadyGate>
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost name="root" />
    </AppReadyGate>
  );
}

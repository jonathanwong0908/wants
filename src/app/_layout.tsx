import { Stack } from "expo-router";

import { AppReadyGate } from "@/db/migrations";

import "../global.css";

export default function RootLayout() {
  return (
    <AppReadyGate>
      <Stack screenOptions={{ headerShown: false }} />
    </AppReadyGate>
  );
}

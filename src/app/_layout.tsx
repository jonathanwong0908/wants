import { Slot } from "expo-router";

import { DatabaseMigrationsGate } from "@/db/migrations";

import "../global.css";

export default function RootLayout() {
  return (
    <DatabaseMigrationsGate>
      <Slot />
    </DatabaseMigrationsGate>
  );
}

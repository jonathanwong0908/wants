import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import React from "react";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { DatabaseMigrationsGate } from "@/db/migrations";

import "../global.css";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <DatabaseMigrationsGate>
        <AnimatedSplashOverlay />
        <AppTabs />
      </DatabaseMigrationsGate>
    </ThemeProvider>
  );
}

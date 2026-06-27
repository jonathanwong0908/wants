import * as SplashScreen from "expo-splash-screen";
import { useLayoutEffect, useRef } from "react";

import { useTheme } from "@/contexts/theme-context";

export function SplashScreenController() {
  const { resolvedColorScheme } = useTheme();
  const hiddenRef = useRef(false);

  useLayoutEffect(() => {
    if (hiddenRef.current) return;
    hiddenRef.current = true;
    SplashScreen.hideAsync().catch((reason) => {
      console.warn(reason);
    });
  }, [resolvedColorScheme]);

  return null;
}

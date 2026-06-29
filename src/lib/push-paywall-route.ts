import { router } from "expo-router";

import type { ThemeId } from "@/lib/themes/types";

/**
 * Typed-route shim for paywall until Expo regenerates `.expo/types/router.d.ts`.
 */
export function pushPaywallRoute(options?: {
  previewThemeId?: ThemeId;
}): void {
  router.push({
    pathname: "/paywall",
    params: options?.previewThemeId
      ? { previewTheme: options.previewThemeId }
      : {},
  } as never);
}

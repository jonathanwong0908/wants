import { router } from "expo-router";

/**
 * Typed-route shim for settings sub-routes until Expo regenerates `.expo/types/router.d.ts`.
 */
export type SettingsHref =
  | "/settings/notifications"
  | "/settings/theme"
  | "/settings/account"
  | "/settings/subscription"
  | "/settings/data"
  | "/settings/about";

export function pushSettingsRoute(href: SettingsHref): void {
  router.push(href as never);
}

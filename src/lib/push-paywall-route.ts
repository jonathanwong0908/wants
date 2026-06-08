import { router } from "expo-router";

/**
 * Typed-route shim for paywall until Expo regenerates `.expo/types/router.d.ts`.
 */
export function pushPaywallRoute(): void {
  router.push("/paywall" as never);
}

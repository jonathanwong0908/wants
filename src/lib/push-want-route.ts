import { router } from "expo-router";

/**
 * Typed shim for `/want/[id]` until Expo regenerates `.expo/types/router.d.ts`.
 */
export function pushWantRoute(id: number): void {
  router.push({
    pathname: "/want/[id]",
    params: { id: String(id) },
  } as never);
}

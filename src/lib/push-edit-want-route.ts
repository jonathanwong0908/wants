import { router } from "expo-router";

/**
 * Typed shim for `/edit-want/[id]` until Expo regenerates `.expo/types/router.d.ts`.
 */
export function pushEditWantRoute(id: number): void {
  router.push({
    pathname: "/edit-want/[id]",
    params: { id: String(id) },
  } as never);
}

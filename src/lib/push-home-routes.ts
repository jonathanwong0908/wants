import { router } from "expo-router";

/**
 * expo-router merges strict `Href` typings from `.expo/types/router.d.ts`, which Expo regenerates locally
 * when you run `expo start` (`.expo/` is gitignored). This helper avoids `pnpm exec tsc` failures until typings refresh.
 *
 * Prefer removing this shim once `@expo/router` includes `/settings`, `/all-wants`, and `/add-want` in `ExpoRouter.__routes`.
 */
export type HomeAreaHref = "/settings" | "/all-wants" | "/add-want";

export function pushHomeAreaRoute(href: HomeAreaHref): void {
  router.push(href as never);
}

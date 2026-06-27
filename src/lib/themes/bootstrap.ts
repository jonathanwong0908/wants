import * as SystemUI from "expo-system-ui";
import { colorScheme } from "nativewind";

import { THEME } from "@/lib/theme";
import {
  readResolvedColorSchemeForThemeId,
  readThemeId,
} from "@/lib/themes/storage";
import type { ResolvedColorScheme } from "@/lib/themes/types";

export function bootstrapThemeColorScheme(): ResolvedColorScheme {
  const resolved = readResolvedColorSchemeForThemeId(readThemeId());
  colorScheme.set(resolved);
  void SystemUI.setBackgroundColorAsync(THEME[resolved].background);
  return resolved;
}

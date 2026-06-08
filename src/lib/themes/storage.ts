import { Appearance } from "react-native";
import Storage from "expo-sqlite/kv-store";

import { THEME_ID_KEY } from "@/constants/storage-keys";
import {
  getThemeDefinition,
  isRegisteredThemeId,
} from "@/lib/themes/registry";
import type { ResolvedColorScheme, ThemeId } from "@/lib/themes/types";

export function detectDeviceThemeId(): ThemeId {
  const scheme = Appearance.getColorScheme();
  return scheme === "dark" ? "dark" : "light";
}

export function readThemeId(): ThemeId {
  const raw = Storage.getItemSync(THEME_ID_KEY);
  if (raw != null && isRegisteredThemeId(raw)) {
    return raw;
  }

  return detectDeviceThemeId();
}

export function writeThemeId(id: ThemeId): void {
  if (!isRegisteredThemeId(id)) {
    throw new Error(`Unknown theme id: ${id}`);
  }

  Storage.setItemSync(THEME_ID_KEY, id);
}

export function hasStoredThemeId(): boolean {
  const raw = Storage.getItemSync(THEME_ID_KEY);
  return raw != null && isRegisteredThemeId(raw);
}

export function seedInitialThemeIfNeeded(): void {
  if (!hasStoredThemeId()) {
    writeThemeId(detectDeviceThemeId());
  }
}

export function readResolvedColorSchemeForThemeId(
  themeId: ThemeId
): ResolvedColorScheme {
  const definition = getThemeDefinition(themeId);
  return definition?.colorScheme ?? "light";
}

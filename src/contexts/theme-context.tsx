import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "nativewind";

import { useAppReady } from "@/contexts/app-ready-context";
import { seedInitialSettingsIfNeeded } from "@/lib/settings";
import { getThemeDefinition } from "@/lib/themes/registry";
import {
  readResolvedColorSchemeForThemeId,
  readThemeId,
  writeThemeId as persistThemeId,
} from "@/lib/themes/storage";
import type {
  ResolvedColorScheme,
  ThemeDefinition,
  ThemeDisplayFonts,
  ThemeId,
  ThemeMetaFonts,
} from "@/lib/themes/types";

export type ThemeContextValue = {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  previewThemeId: ThemeId | null;
  setPreviewThemeId: (id: ThemeId | null) => void;
  resolvedColorScheme: ResolvedColorScheme;
  activeTheme: ThemeDefinition;
  themeStyle: ThemeDefinition["themeStyle"];
  metaFonts?: ThemeMetaFonts;
  monoAllText?: boolean;
  displayFonts?: ThemeDisplayFonts;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function loadThemeIdForOnboardingState(onboardingComplete: boolean): ThemeId {
  if (onboardingComplete) {
    seedInitialSettingsIfNeeded();
    return readThemeId();
  }

  return readThemeId();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { onboardingComplete } = useAppReady();
  const { setColorScheme } = useColorScheme();
  const [themeId, setThemeIdState] = useState<ThemeId>(() =>
    loadThemeIdForOnboardingState(onboardingComplete)
  );
  const [previewThemeId, setPreviewThemeIdState] = useState<ThemeId | null>(
    null
  );

  useEffect(() => {
    if (!onboardingComplete) return;
    seedInitialSettingsIfNeeded();
    setThemeIdState(readThemeId());
  }, [onboardingComplete]);

  const effectiveThemeId = previewThemeId ?? themeId;
  const resolvedColorScheme =
    readResolvedColorSchemeForThemeId(effectiveThemeId);
  const activeTheme =
    getThemeDefinition(effectiveThemeId) ?? getThemeDefinition("light")!;

  useLayoutEffect(() => {
    setColorScheme(resolvedColorScheme);
  }, [resolvedColorScheme, setColorScheme]);

  const setThemeId = useCallback(
    (id: ThemeId) => {
      persistThemeId(id);
      setThemeIdState(id);
    },
    []
  );

  const setPreviewThemeId = useCallback((id: ThemeId | null) => {
    setPreviewThemeIdState(id);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeId,
      setThemeId,
      previewThemeId,
      setPreviewThemeId,
      resolvedColorScheme,
      activeTheme,
      themeStyle: activeTheme.themeStyle,
      metaFonts: activeTheme.metaFonts,
      monoAllText: activeTheme.monoAllText,
      displayFonts: activeTheme.displayFonts,
    }),
    [
      themeId,
      setThemeId,
      previewThemeId,
      setPreviewThemeId,
      resolvedColorScheme,
      activeTheme,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

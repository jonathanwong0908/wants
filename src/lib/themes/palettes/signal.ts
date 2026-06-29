import { vars } from "nativewind";

import {
  DISPLAY_FONT_BOLD,
  DISPLAY_FONT_EXTRABOLD,
  DISPLAY_FONT_SEMIBOLD,
} from "@/lib/fonts/load-app-fonts";
import type { ThemeDefinition, ThemePalette } from "@/lib/themes/types";

/** HSL components (no hsl() wrapper) — single source for CSS vars and JS palette. */
const SIGNAL_HSL = {
  background: "0 0% 4%",
  foreground: "0 0% 98%",
  card: "0 0% 8%",
  cardForeground: "0 0% 98%",
  popover: "0 0% 8%",
  popoverForeground: "0 0% 98%",
  primary: "22 95% 53%",
  primaryForeground: "0 0% 100%",
  secondary: "0 0% 14%",
  secondaryForeground: "0 0% 98%",
  muted: "0 0% 12%",
  mutedForeground: "0 0% 55%",
  accent: "22 95% 53%",
  accentForeground: "0 0% 100%",
  fab: "22 95% 53%",
  fabForeground: "0 0% 100%",
  destructive: "0 72% 45%",
  destructiveForeground: "0 0% 98%",
  border: "0 0% 18%",
  input: "0 0% 18%",
  ring: "22 95% 53%",
  chart1: "22 95% 53%",
  chart2: "0 0% 98%",
  chart3: "0 0% 45%",
  chart4: "22 70% 40%",
  chart5: "22 80% 65%",
} as const;

const CSS_VAR_KEYS: Record<keyof typeof SIGNAL_HSL, string> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  fab: "--fab",
  fabForeground: "--fab-foreground",
  destructive: "--destructive",
  destructiveForeground: "--destructive-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
  chart1: "--chart-1",
  chart2: "--chart-2",
  chart3: "--chart-3",
  chart4: "--chart-4",
  chart5: "--chart-5",
};

function buildCssVars(hsl: typeof SIGNAL_HSL): Record<string, string> {
  const cssVars: Record<string, string> = { "--radius": "0" };
  for (const [key, value] of Object.entries(hsl)) {
    cssVars[CSS_VAR_KEYS[key as keyof typeof SIGNAL_HSL]] = value;
  }
  return cssVars;
}

function buildPalette(hsl: typeof SIGNAL_HSL): ThemePalette {
  const palette = {} as ThemePalette;
  for (const [key, value] of Object.entries(hsl)) {
    (palette as Record<string, string>)[key] = `hsl(${value})`;
  }
  palette.radius = "0";
  return palette;
}

export const SIGNAL_CSS_VARS = buildCssVars(SIGNAL_HSL);
export const signalThemeStyle = vars(SIGNAL_CSS_VARS);
export const signalPalette = buildPalette(SIGNAL_HSL);

export const signalThemeDefinition: ThemeDefinition = {
  id: "signal",
  name: "Signal",
  tier: "pro",
  colorScheme: "dark",
  themeStyle: signalThemeStyle,
  palette: signalPalette,
  displayFonts: {
    semibold: DISPLAY_FONT_SEMIBOLD,
    bold: DISPLAY_FONT_BOLD,
    extrabold: DISPLAY_FONT_EXTRABOLD,
  },
};

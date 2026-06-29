import { vars } from "nativewind";

import {
  META_FONT_BOLD,
  META_FONT_MEDIUM,
} from "@/lib/fonts/load-app-fonts";
import type { ThemeDefinition, ThemePalette } from "@/lib/themes/types";

/** HSL components (no hsl() wrapper) — single source for CSS vars and JS palette. */
const OPERATIONAL_HSL = {
  background: "210 72% 81%",
  foreground: "220 100% 3%",
  card: "210 55% 88%",
  cardForeground: "220 100% 3%",
  popover: "210 55% 88%",
  popoverForeground: "220 100% 3%",
  primary: "224 100% 50%",
  primaryForeground: "0 0% 100%",
  secondary: "220 35% 35%",
  secondaryForeground: "0 0% 100%",
  muted: "210 45% 75%",
  mutedForeground: "220 40% 25%",
  accent: "210 45% 75%",
  accentForeground: "220 100% 3%",
  fab: "224 100% 50%",
  fabForeground: "0 0% 100%",
  destructive: "0 72% 45%",
  destructiveForeground: "0 0% 100%",
  border: "220 60% 20%",
  input: "220 60% 20%",
  ring: "224 100% 50%",
  chart1: "224 100% 50%",
  chart2: "220 100% 3%",
  chart3: "220 40% 25%",
  chart4: "210 55% 65%",
  chart5: "220 35% 35%",
} as const;

const CSS_VAR_KEYS: Record<keyof typeof OPERATIONAL_HSL, string> = {
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

function buildCssVars(hsl: typeof OPERATIONAL_HSL): Record<string, string> {
  const cssVars: Record<string, string> = { "--radius": "0" };
  for (const [key, value] of Object.entries(hsl)) {
    cssVars[CSS_VAR_KEYS[key as keyof typeof OPERATIONAL_HSL]] = value;
  }
  return cssVars;
}

function buildPalette(hsl: typeof OPERATIONAL_HSL): ThemePalette {
  const palette = {} as ThemePalette;
  for (const [key, value] of Object.entries(hsl)) {
    (palette as Record<string, string>)[key] = `hsl(${value})`;
  }
  palette.radius = "0";
  return palette;
}

export const OPERATIONAL_CSS_VARS = buildCssVars(OPERATIONAL_HSL);
export const operationalThemeStyle = vars(OPERATIONAL_CSS_VARS);
export const operationalPalette = buildPalette(OPERATIONAL_HSL);

export const operationalThemeDefinition: ThemeDefinition = {
  id: "operational",
  name: "Operational",
  tier: "pro",
  colorScheme: "light",
  themeStyle: operationalThemeStyle,
  palette: operationalPalette,
  metaFonts: {
    medium: META_FONT_MEDIUM,
    bold: META_FONT_BOLD,
  },
  monoAllText: true,
};

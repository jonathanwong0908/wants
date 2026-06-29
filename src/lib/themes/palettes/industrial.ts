import { vars } from "nativewind";

import type { ThemeDefinition, ThemePalette } from "@/lib/themes/types";

/** HSL components (no hsl() wrapper) — single source for CSS vars and JS palette. */
const INDUSTRIAL_HSL = {
  background: "43 37% 96%",
  foreground: "0 0% 10%",
  card: "45 21% 93%",
  cardForeground: "0 0% 10%",
  popover: "45 21% 93%",
  popoverForeground: "0 0% 10%",
  primary: "0 0% 10%",
  primaryForeground: "43 37% 96%",
  secondary: "0 0% 48%",
  secondaryForeground: "43 37% 96%",
  muted: "40 15% 92%",
  mutedForeground: "0 0% 48%",
  accent: "40 15% 92%",
  accentForeground: "0 0% 10%",
  fab: "224 87% 62%",
  fabForeground: "0 0% 100%",
  destructive: "0 72% 45%",
  destructiveForeground: "43 37% 96%",
  border: "0 0% 10%",
  input: "0 0% 10%",
  ring: "224 87% 62%",
  chart1: "224 87% 62%",
  chart2: "0 0% 10%",
  chart3: "0 0% 48%",
  chart4: "224 60% 75%",
  chart5: "43 20% 70%",
} as const;

const CSS_VAR_KEYS: Record<keyof typeof INDUSTRIAL_HSL, string> = {
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

function buildCssVars(hsl: typeof INDUSTRIAL_HSL): Record<string, string> {
  const cssVars: Record<string, string> = { "--radius": "0" };
  for (const [key, value] of Object.entries(hsl)) {
    cssVars[CSS_VAR_KEYS[key as keyof typeof INDUSTRIAL_HSL]] = value;
  }
  return cssVars;
}

function buildPalette(hsl: typeof INDUSTRIAL_HSL): ThemePalette {
  const palette = {} as ThemePalette;
  for (const [key, value] of Object.entries(hsl)) {
    (palette as Record<string, string>)[key] = `hsl(${value})`;
  }
  palette.radius = "0";
  return palette;
}

export const INDUSTRIAL_CSS_VARS = buildCssVars(INDUSTRIAL_HSL);
export const industrialThemeStyle = vars(INDUSTRIAL_CSS_VARS);
export const industrialPalette = buildPalette(INDUSTRIAL_HSL);

export const industrialThemeDefinition: ThemeDefinition = {
  id: "industrial",
  name: "Industrial",
  tier: "pro",
  colorScheme: "light",
  themeStyle: industrialThemeStyle,
  palette: industrialPalette,
};

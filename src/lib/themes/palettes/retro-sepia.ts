import { vars } from "nativewind";

import type { ThemeDefinition, ThemePalette } from "@/lib/themes/types";

/** HSL components (no hsl() wrapper) — single source for CSS vars and JS palette. */
const RETRO_SEPIA_HSL = {
  background: "35 30% 94%",
  foreground: "25 35% 18%",
  card: "35 25% 90%",
  cardForeground: "25 35% 18%",
  popover: "35 25% 90%",
  popoverForeground: "25 35% 18%",
  primary: "20 45% 32%",
  primaryForeground: "35 30% 94%",
  secondary: "35 18% 86%",
  secondaryForeground: "25 35% 18%",
  muted: "35 18% 86%",
  mutedForeground: "25 15% 42%",
  accent: "25 55% 48%",
  accentForeground: "35 30% 94%",
  destructive: "8 55% 42%",
  destructiveForeground: "35 30% 94%",
  border: "30 20% 78%",
  input: "30 20% 78%",
  ring: "20 45% 32%",
  chart1: "25 55% 48%",
  chart2: "20 45% 32%",
  chart3: "35 30% 55%",
  chart4: "30 50% 65%",
  chart5: "15 60% 45%",
} as const;

const CSS_VAR_KEYS: Record<keyof typeof RETRO_SEPIA_HSL, string> = {
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

function buildCssVars(
  hsl: typeof RETRO_SEPIA_HSL
): Record<string, string> {
  const vars: Record<string, string> = { "--radius": "0.625rem" };
  for (const [key, value] of Object.entries(hsl)) {
    vars[CSS_VAR_KEYS[key as keyof typeof RETRO_SEPIA_HSL]] = value;
  }
  return vars;
}

function buildPalette(hsl: typeof RETRO_SEPIA_HSL): ThemePalette {
  const palette = {} as ThemePalette;
  for (const [key, value] of Object.entries(hsl)) {
    (palette as Record<string, string>)[key] = `hsl(${value})`;
  }
  palette.radius = "0.625rem";
  return palette;
}

export const RETRO_SEPIA_CSS_VARS = buildCssVars(RETRO_SEPIA_HSL);
export const retroSepiaThemeStyle = vars(RETRO_SEPIA_CSS_VARS);
export const retroSepiaPalette = buildPalette(RETRO_SEPIA_HSL);

export const retroSepiaThemeDefinition: ThemeDefinition = {
  id: "retro-sepia",
  name: "Sepia",
  tier: "pro",
  colorScheme: "light",
  themeStyle: retroSepiaThemeStyle,
  palette: retroSepiaPalette,
  devOnly: true,
};

import type { StyleProp, ViewStyle } from "react-native";

import type { THEME } from "@/lib/theme";

export type ThemeTier = "free" | "pro";

export type ThemeMetaFonts = {
  medium: string;
  bold: string;
};

export type ThemeDisplayFonts = {
  semibold: string;
  bold: string;
  extrabold: string;
};

export type ResolvedColorScheme = "light" | "dark";

/** Free themes use built-in ids; pro palettes extend this union as they are added. */
export type ThemeId = "light" | "dark" | (string & {});

/** JS-native color tokens for Lucide icons and other non-Tailwind consumers. */
export type ThemePalette = (typeof THEME)["light"];

export type ThemeDefinition = {
  id: ThemeId;
  name: string;
  tier: ThemeTier;
  colorScheme: ResolvedColorScheme;
  /** NativeWind vars override for premium palettes; omitted for default Light/Dark. */
  themeStyle?: StyleProp<ViewStyle>;
  /** Full hsl() palette when themeStyle overrides CSS vars; omitted for Light/Dark. */
  palette?: ThemePalette;
  /** Optional monospace faces for small and metadata text, or all UI text when monoAllText is set. */
  metaFonts?: ThemeMetaFonts;
  /** When true, metaFonts apply to all text sizes (not just small/metadata). */
  monoAllText?: boolean;
  /** Optional sans-serif faces for large titles and headings. */
  displayFonts?: ThemeDisplayFonts;
};

import type { StyleProp, ViewStyle } from "react-native";

export type ThemeTier = "free" | "pro";

export type ResolvedColorScheme = "light" | "dark";

/** Free themes use built-in ids; pro palettes extend this union as they are added. */
export type ThemeId = "light" | "dark" | (string & {});

export type ThemeDefinition = {
  id: ThemeId;
  name: string;
  tier: ThemeTier;
  colorScheme: ResolvedColorScheme;
  /** NativeWind vars override for premium palettes; omitted for default Light/Dark. */
  themeStyle?: StyleProp<ViewStyle>;
};

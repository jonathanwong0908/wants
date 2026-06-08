import { useTheme } from "@/contexts/theme-context";
import { THEME } from "@/lib/theme";

export function useThemePalette() {
  const { resolvedColorScheme } = useTheme();
  return THEME[resolvedColorScheme];
}

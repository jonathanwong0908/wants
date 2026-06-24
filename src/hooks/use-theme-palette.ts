import { useTheme } from "@/contexts/theme-context";
import { THEME } from "@/lib/theme";

export function useThemePalette() {
  const { resolvedColorScheme, activeTheme } = useTheme();
  return activeTheme.palette ?? THEME[resolvedColorScheme];
}

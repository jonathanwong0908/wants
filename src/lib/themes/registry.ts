import { industrialThemeDefinition } from "@/lib/themes/palettes/industrial";
import { retroSepiaThemeDefinition } from "@/lib/themes/palettes/retro-sepia";
import { signalThemeDefinition } from "@/lib/themes/palettes/signal";
import type { ThemeDefinition, ThemeId } from "@/lib/themes/types";

export const THEME_REGISTRY: ThemeDefinition[] = [
  {
    id: "light",
    name: "Light",
    tier: "free",
    colorScheme: "light",
  },
  {
    id: "dark",
    name: "Dark",
    tier: "free",
    colorScheme: "dark",
  },
  retroSepiaThemeDefinition,
  industrialThemeDefinition,
  signalThemeDefinition,
];

const THEME_BY_ID = new Map<ThemeId, ThemeDefinition>(
  THEME_REGISTRY.map((theme) => [theme.id, theme])
);

export function getThemeDefinition(id: ThemeId): ThemeDefinition | undefined {
  return THEME_BY_ID.get(id);
}

export function isRegisteredThemeId(id: string): id is ThemeId {
  return THEME_BY_ID.has(id);
}

export function getThemeDisplayName(id: ThemeId): string {
  return getThemeDefinition(id)?.name ?? id;
}

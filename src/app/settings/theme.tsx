import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SettingsScreenShell } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { useIsPro } from "@/hooks/use-is-pro";
import { useThemePalette } from "@/hooks/use-theme-palette";
import { pushPaywallRoute } from "@/lib/push-paywall-route";
import { THEME_REGISTRY } from "@/lib/themes/registry";
import type { ThemeDefinition } from "@/lib/themes/types";
import { Separator } from "@rn-primitives/dropdown-menu";
import { Check, Lock } from "lucide-react-native";
import { View } from "react-native";

function ThemeOptionRow({
  theme,
  selected,
  locked,
  onPress,
}: {
  theme: ThemeDefinition;
  selected: boolean;
  locked: boolean;
  onPress: () => void;
}) {
  const palette = useThemePalette();

  return (
    <FieldContainerItem onPress={onPress} showChevron={false}>
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-base text-foreground">{theme.name}</Text>
        <View className="flex-row items-center gap-2">
          {locked ? (
            <Lock size={16} color={palette.mutedForeground} strokeWidth={1.5} />
          ) : null}
          {selected ? (
            <Check size={18} color={palette.foreground} strokeWidth={2} />
          ) : null}
        </View>
      </View>
    </FieldContainerItem>
  );
}

export default function SettingsThemeScreen() {
  const { themeId, setThemeId } = useTheme();
  const isPro = useIsPro();

  function handleSelectTheme(theme: ThemeDefinition) {
    const locked = theme.tier === "pro" && !isPro;
    if (locked) {
      pushPaywallRoute({ previewThemeId: theme.id });
      return;
    }

    setThemeId(theme.id);
  }

  return (
    <SettingsScreenShell title="Theme">
      <View className="mt-4">
        <FieldContainer>
          {THEME_REGISTRY.map((theme, index) => (
            <View key={theme.id}>
              {index > 0 ? <Separator /> : null}
              <ThemeOptionRow
                theme={theme}
                selected={themeId === theme.id}
                locked={theme.tier === "pro" && !isPro}
                onPress={() => handleSelectTheme(theme)}
              />
            </View>
          ))}
        </FieldContainer>
      </View>
    </SettingsScreenShell>
  );
}

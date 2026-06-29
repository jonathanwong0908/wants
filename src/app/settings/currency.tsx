import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SettingsScreenHeader } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";
import { useSettings } from "@/contexts/settings-context";
import { useThemePalette } from "@/hooks/use-theme-palette";
import { CURRENCY_OPTIONS } from "@/lib/currency";
import { LegendList } from "@legendapp/list/react-native";
import { Separator } from "@rn-primitives/dropdown-menu";
import { router } from "expo-router";
import { Check } from "lucide-react-native";
import { useCallback } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CURRENCY_ROW_HEIGHT = 48;

type CurrencyOption = (typeof CURRENCY_OPTIONS)[number];

function CurrencyOptionRow({
  option,
  selected,
  onPress,
}: {
  option: CurrencyOption;
  selected: boolean;
  onPress: () => void;
}) {
  const palette = useThemePalette();

  return (
    <FieldContainerItem onPress={onPress} showChevron={false}>
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-base text-foreground">{option.label}</Text>
        {selected ? (
          <Check size={18} color={palette.foreground} strokeWidth={2} />
        ) : null}
      </View>
    </FieldContainerItem>
  );
}

export default function SettingsCurrencyScreen() {
  const { currencyCode, setCurrencyCode } = useSettings();

  const handleSelect = useCallback(
    (code: string) => {
      setCurrencyCode(code);
      router.back();
    },
    [setCurrencyCode]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: CurrencyOption; index: number }) => (
      <View>
        {index > 0 ? <Separator /> : null}
        <CurrencyOptionRow
          option={item}
          selected={currencyCode === item.value}
          onPress={() => handleSelect(item.value)}
        />
      </View>
    ),
    [currencyCode, handleSelect]
  );

  const keyExtractor = useCallback((item: CurrencyOption) => item.value, []);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <SettingsScreenHeader title="Currency" variant="sub" />
      <View className="flex-1 px-4 pt-4">
        <FieldContainer className="flex-1">
          <LegendList
            className="flex-1"
            data={CURRENCY_OPTIONS}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={CURRENCY_ROW_HEIGHT}
            extraData={currencyCode}
            recycleItems
            contentContainerStyle={{ paddingBottom: 16 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </FieldContainer>
      </View>
    </SafeAreaView>
  );
}

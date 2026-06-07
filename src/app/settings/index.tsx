import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SelectDropdown } from "@/components/common/select-dropdown";
import { SettingsScreenHeader } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";
import { CURRENCY_OPTIONS, getCurrencyCode } from "@/lib/currency";
import {
  DEFAULT_DELAY_HOURS,
  DELAY_OPTIONS,
} from "@/lib/forms/item-form-schema";
import { pushSettingsRoute } from "@/lib/push-settings-routes";
import { Separator } from "@rn-primitives/dropdown-menu";
import { PortalHost, useModalPortalRoot } from "@rn-primitives/portal";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SETTINGS_PORTAL_HOST = "settings-portal";

export default function SettingsIndexScreen() {
  const insets = useSafeAreaInsets();
  const { sideOffset, ref, onLayout, style } = useModalPortalRoot();
  const dropdownInsets = {
    top: insets.top,
    bottom: insets.bottom + Math.abs(sideOffset),
    left: 16,
    right: 16,
  };

  const [defaultDelayHours, setDefaultDelayHours] = useState(
    String(DEFAULT_DELAY_HOURS)
  );
  const [currencyCode, setCurrencyCode] = useState(getCurrencyCode());

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View ref={ref} onLayout={onLayout} style={style} className="flex-1">
        <SettingsScreenHeader title="Settings" variant="modal" />
        <ScrollView
          className="flex-1 px-4 pt-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FieldContainer>
            <FieldContainerItem>
              <View className="flex-row items-center justify-between gap-2">
                <Text className="text-muted-foreground/50">Default delay</Text>
                <SelectDropdown
                  options={DELAY_OPTIONS}
                  value={defaultDelayHours}
                  onChange={setDefaultDelayHours}
                  portalHost={SETTINGS_PORTAL_HOST}
                  sideOffset={sideOffset}
                  insets={dropdownInsets}
                />
              </View>
            </FieldContainerItem>
            <Separator />
            <FieldContainerItem>
              <View className="flex-row items-center justify-between gap-2">
                <Text className="text-muted-foreground/50">Currency</Text>
                <SelectDropdown
                  options={CURRENCY_OPTIONS}
                  value={currencyCode}
                  onChange={setCurrencyCode}
                  portalHost={SETTINGS_PORTAL_HOST}
                  sideOffset={sideOffset}
                  insets={dropdownInsets}
                />
              </View>
            </FieldContainerItem>
            <Separator />
            <FieldContainerItem
              onPress={() => pushSettingsRoute("/settings/notifications")}
            >
              <Text className="text-base text-foreground">Notifications</Text>
            </FieldContainerItem>
            <Separator />
            <FieldContainerItem
              onPress={() => pushSettingsRoute("/settings/account")}
            >
              <Text className="text-base text-foreground">Account</Text>
            </FieldContainerItem>
            <Separator />
            <FieldContainerItem
              onPress={() => pushSettingsRoute("/settings/data")}
            >
              <Text className="text-base text-foreground">Clear all data</Text>
            </FieldContainerItem>
            <Separator />
            <FieldContainerItem
              onPress={() => pushSettingsRoute("/settings/about")}
            >
              <Text className="text-base text-foreground">About</Text>
            </FieldContainerItem>
          </FieldContainer>

          <View className="h-8" />
        </ScrollView>
        <PortalHost name={SETTINGS_PORTAL_HOST} />
      </View>
    </SafeAreaView>
  );
}

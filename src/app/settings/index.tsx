import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SelectDropdown } from "@/components/common/select-dropdown";
import { SettingsScreenHeader } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";
import { useSettings } from "@/contexts/settings-context";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import { CURRENCY_OPTIONS } from "@/lib/currency";
import { DELAY_OPTIONS } from "@/lib/forms/item-form-schema";
import { pushSettingsRoute } from "@/lib/push-settings-routes";
import { Separator } from "@rn-primitives/dropdown-menu";
import { PortalHost, useModalPortalRoot } from "@rn-primitives/portal";
import { Linking, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SETTINGS_PORTAL_HOST = "settings-portal";

function formatPermissionStatus(
  status: ReturnType<typeof useNotificationPermission>["status"]
): string {
  switch (status) {
    case "granted":
      return "Granted";
    case "denied":
      return "Denied";
    case "undetermined":
      return "Not determined";
    default:
      return "Unknown";
  }
}

export default function SettingsIndexScreen() {
  const insets = useSafeAreaInsets();
  const { sideOffset, ref, onLayout, style } = useModalPortalRoot();
  const dropdownInsets = {
    top: insets.top,
    bottom: insets.bottom + Math.abs(sideOffset),
    left: 16,
    right: 16,
  };
  const { status } = useNotificationPermission();

  const {
    currencyCode,
    defaultDelayHours,
    setCurrencyCode,
    setDefaultDelayHours,
  } = useSettings();

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
                <Text>Default delay</Text>
                <SelectDropdown
                  options={DELAY_OPTIONS}
                  value={String(defaultDelayHours)}
                  onChange={(value) => setDefaultDelayHours(Number(value))}
                  portalHost={SETTINGS_PORTAL_HOST}
                  sideOffset={sideOffset}
                  insets={dropdownInsets}
                />
              </View>
            </FieldContainerItem>
            <Separator />
            <FieldContainerItem>
              <View className="flex-row items-center justify-between gap-2">
                <Text>Currency</Text>
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
            <FieldContainerItem onPress={() => void Linking.openSettings()}>
              <View className="flex-row items-center justify-between gap-2">
                <Text>Notifications</Text>
                <Text className="text-base text-foreground">
                  {formatPermissionStatus(status)}
                </Text>
              </View>
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
              <Text className="text-base text-foreground">Data</Text>
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

import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SelectDropdown } from "@/components/common/select-dropdown";
import { SettingsScreenHeader } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";
import { usePurchases } from "@/contexts/purchases-context";
import { useSettings } from "@/contexts/settings-context";
import { useTheme } from "@/contexts/theme-context";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import { getCurrencyOptionLabel } from "@/lib/currency";
import { DELAY_OPTIONS } from "@/lib/forms/item-form-schema";
import { pushSettingsRoute } from "@/lib/push-settings-routes";
import { getSubscriptionHubLabel } from "@/lib/subscription-status";
import { getThemeDisplayName } from "@/lib/themes/registry";
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
  const { isPro, proPlan } = usePurchases();

  const {
    currencyCode,
    defaultDelayHours,
    setDefaultDelayHours,
  } = useSettings();
  const { themeId } = useTheme();

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
            <FieldContainerItem
              onPress={() => pushSettingsRoute("/settings/currency")}
            >
              <View className="flex-row items-center justify-between gap-2">
                <Text>Currency</Text>
                <Text className="text-base text-foreground">
                  {getCurrencyOptionLabel(currencyCode)}
                </Text>
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
              onPress={() => pushSettingsRoute("/settings/theme")}
            >
              <View className="flex-row items-center justify-between gap-2">
                <Text>Theme</Text>
                <Text className="text-base text-foreground">
                  {getThemeDisplayName(themeId)}
                </Text>
              </View>
            </FieldContainerItem>
            <Separator />
            <FieldContainerItem
              onPress={() => pushSettingsRoute("/settings/subscription")}
            >
              <View className="flex-row items-center justify-between gap-2">
                <Text>Subscription</Text>
                <Text className="text-base text-foreground">
                  {getSubscriptionHubLabel(isPro, proPlan)}
                </Text>
              </View>
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

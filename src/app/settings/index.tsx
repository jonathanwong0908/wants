import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SelectDropdown } from "@/components/common/select-dropdown";
import { SettingsScreenHeader } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";
import { CustomDelayPicker } from "@/components/wants/custom-delay-picker";
import { usePurchases } from "@/contexts/purchases-context";
import { useSettings } from "@/contexts/settings-context";
import { useTheme } from "@/contexts/theme-context";
import { useIsPro } from "@/hooks/use-is-pro";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import { getCurrencyOptionLabel } from "@/lib/currency";
import { CUSTOM_DELAY_OPTION_VALUE } from "@/lib/forms/item-form-schema";
import { pushPaywallRoute } from "@/lib/push-paywall-route";
import { pushSettingsRoute } from "@/lib/push-settings-routes";
import { getEffectiveDefaultDelayHours } from "@/lib/settings";
import { getSubscriptionHubLabel } from "@/lib/subscription-status";
import { getThemeDisplayName } from "@/lib/themes/registry";
import { getDelayOptionsForValue } from "@/lib/want-format";
import { Separator } from "@rn-primitives/dropdown-menu";
import { PortalHost, useModalPortalRoot } from "@rn-primitives/portal";
import { Linking, ScrollView, View } from "react-native";
import { useMemo, useState } from "react";
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
  const { isPro } = usePurchases();
  const isProUser = useIsPro();
  const [customPickerVisible, setCustomPickerVisible] = useState(false);

  const { currencyCode, defaultDelayHours, setDefaultDelayHours } =
    useSettings();
  const { themeId } = useTheme();

  const effectiveDefaultDelayHours = getEffectiveDefaultDelayHours(
    isProUser,
    defaultDelayHours
  );
  const defaultDelayOptions = useMemo(
    () => getDelayOptionsForValue(effectiveDefaultDelayHours, true),
    [effectiveDefaultDelayHours]
  );

  function handleDefaultDelayChange(value: string) {
    if (value === CUSTOM_DELAY_OPTION_VALUE) {
      if (!isProUser) {
        pushPaywallRoute();
        return;
      }

      setCustomPickerVisible(true);
      return;
    }

    setDefaultDelayHours(Number(value));
  }

  function handleCustomDefaultDelayConfirm(hours: number) {
    setDefaultDelayHours(hours);
    setCustomPickerVisible(false);
  }

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
                  options={defaultDelayOptions}
                  value={String(effectiveDefaultDelayHours)}
                  onChange={handleDefaultDelayChange}
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
                  {getSubscriptionHubLabel(isPro)}
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

        <CustomDelayPicker
          visible={customPickerVisible}
          initialDelayHours={effectiveDefaultDelayHours}
          onConfirm={handleCustomDefaultDelayConfirm}
          onCancel={() => setCustomPickerVisible(false)}
          showDecideOnPreview={false}
        />
      </View>
    </SafeAreaView>
  );
}

import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SettingsScreenShell } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";
import { usePurchases } from "@/contexts/purchases-context";
import { useIsPro } from "@/hooks/use-is-pro";
import { isProduction } from "@/lib/env";
import { pushPaywallRoute } from "@/lib/push-paywall-route";
import { getSubscriptionStatusTitle } from "@/lib/subscription-status";
import { Separator } from "@rn-primitives/dropdown-menu";
import { View } from "react-native";

export default function SettingsSubscriptionScreen() {
  const isPro = useIsPro();
  const { resetDevPro, restore } = usePurchases();

  const statusTitle = getSubscriptionStatusTitle(isPro);

  return (
    <SettingsScreenShell title="Purchase">
      <View className="mt-4 gap-4">
        <View className="gap-1">
          <Text className="text-base font-medium text-foreground">
            {statusTitle}
          </Text>
        </View>

        <FieldContainer>
          {!isPro ? (
            <>
              <FieldContainerItem onPress={() => pushPaywallRoute()}>
                <Text className="text-base text-foreground">
                  Upgrade to Pro
                </Text>
              </FieldContainerItem>
              <Separator />
            </>
          ) : null}
          <FieldContainerItem
            onPress={() => void restore()}
            showChevron={false}
          >
            <Text className="text-base text-foreground">Restore purchases</Text>
          </FieldContainerItem>
        </FieldContainer>

        {!isProduction ? (
          <FieldContainer>
            <FieldContainerItem
              onPress={resetDevPro}
              showChevron={false}
            >
              <Text className="text-base text-destructive">
                Reset purchase (dev)
              </Text>
            </FieldContainerItem>
          </FieldContainer>
        ) : null}
      </View>
    </SettingsScreenShell>
  );
}

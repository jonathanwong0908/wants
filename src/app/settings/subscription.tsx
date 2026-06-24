import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SettingsScreenShell } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";
import { usePro } from "@/contexts/pro-context";
import { useIsPro } from "@/hooks/use-is-pro";
import { pushPaywallRoute } from "@/lib/push-paywall-route";
import { getPaywallPlan } from "@/lib/paywall-placeholder-offerings";
import { isProduction } from "@/lib/env";
import { Alert, View } from "react-native";

function getProStatusTitle(
  proPlan: ReturnType<typeof usePro>["proPlan"]
): string {
  switch (proPlan) {
    case "lifetime":
      return "Lifetime Pro — no renewal";
    case "monthly":
      return "Wants Pro — active";
    case "annual":
      return "Wants Pro — active";
    default:
      return "Wants Pro — active";
  }
}

function getProStatusDetail(
  proPlan: ReturnType<typeof usePro>["proPlan"]
): string | null {
  switch (proPlan) {
    case "monthly":
      return "Renews monthly";
    case "annual":
      return "Renews annually";
    case "lifetime":
      return null;
    default:
      return null;
  }
}

function handleManageSubscriptionPlaceholder(): void {
  Alert.alert(
    "Manage subscription",
    "Subscription management will open in the App Store when RevenueCat is connected."
  );
}

export default function SettingsSubscriptionScreen() {
  const isPro = useIsPro();
  const { proPlan, resetPlaceholder } = usePro();

  const statusTitle = isPro ? getProStatusTitle(proPlan) : "Free plan";
  const statusDetail = isPro ? getProStatusDetail(proPlan) : null;
  const showManageSubscription =
    isPro && (proPlan === "monthly" || proPlan === "annual");

  const showActions =
    !isPro || showManageSubscription;

  return (
    <SettingsScreenShell title="Subscription">
      <View className="mt-4 gap-4">
        <View className="gap-1">
          <Text className="text-base font-medium text-foreground">
            {statusTitle}
          </Text>
          {statusDetail ? (
            <Text variant="muted">{statusDetail}</Text>
          ) : null}
          {isPro && proPlan ? (
            <Text variant="muted">
              Plan: {getPaywallPlan(proPlan).title}
            </Text>
          ) : null}
        </View>

        {showActions ? (
          <FieldContainer>
            {!isPro ? (
              <FieldContainerItem onPress={() => pushPaywallRoute()}>
                <Text className="text-base text-foreground">
                  Upgrade to Pro
                </Text>
              </FieldContainerItem>
            ) : null}
            {showManageSubscription ? (
              <FieldContainerItem
                onPress={handleManageSubscriptionPlaceholder}
                showChevron={false}
              >
                <Text className="text-base text-foreground">
                  Manage subscription
                </Text>
              </FieldContainerItem>
            ) : null}
          </FieldContainer>
        ) : null}

        {!isProduction ? (
          <FieldContainer>
            <FieldContainerItem
              onPress={resetPlaceholder}
              showChevron={false}
            >
              <Text className="text-base text-destructive">
                Reset subscription (dev)
              </Text>
            </FieldContainerItem>
          </FieldContainer>
        ) : null}
      </View>
    </SettingsScreenShell>
  );
}

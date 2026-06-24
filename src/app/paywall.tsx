import { SettingsScreenHeader } from "@/components/settings/settings-screen-shell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from "@/constants/legal-links";
import { usePro } from "@/contexts/pro-context";
import { openLegalLink } from "@/lib/open-legal-link";
import {
  DEFAULT_PLAN_ID,
  PAYWALL_PLANS,
  type PaywallPlan,
  type PaywallPlanId,
} from "@/lib/paywall-placeholder-offerings";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function PaywallLegalFooter() {
  return (
    <Text variant="muted" className="text-xs leading-4 text-center">
      Lifetime is a one-time purchase. Subscriptions auto-renew unless cancelled
      at least 24 hours before renewal. Manage in Apple ID settings.{" "}
      <Text
        className="text-xs text-primary underline"
        onPress={() => void openLegalLink(PRIVACY_POLICY_URL)}
      >
        Privacy Policy
      </Text>{" "}
      and{" "}
      <Text
        className="text-xs text-primary underline"
        onPress={() => void openLegalLink(TERMS_OF_USE_URL)}
      >
        Terms of Use
      </Text>
      .
    </Text>
  );
}

function PlanDetails({ plan }: { plan: PaywallPlan }) {
  return (
    <>
      <View className="flex-row items-start">
        <Text variant="muted" className="text-3xl font-bold leading-none">
          $
        </Text>
        <Text className="text-5xl font-bold leading-none text-foreground">
          {plan.priceAmount}
        </Text>
      </View>
      <Text variant="muted" className="mt-1 text-sm leading-5">
        {plan.priceDescription}
      </Text>
      {plan.subtitle ? (
        <Text className="mt-1 text-sm font-medium text-primary">
          {plan.subtitle}
        </Text>
      ) : null}
    </>
  );
}

export default function PaywallScreen() {
  const router = useRouter();
  const { purchasePlaceholder } = usePro();
  const [selectedPlanId, setSelectedPlanId] =
    useState<PaywallPlanId>(DEFAULT_PLAN_ID);
  const [purchasing, setPurchasing] = useState(false);

  const selectedPlan =
    PAYWALL_PLANS.find((plan) => plan.id === selectedPlanId) ??
    PAYWALL_PLANS[0];

  async function handlePurchase() {
    setPurchasing(true);
    try {
      await purchasePlaceholder(selectedPlanId);
      router.back();
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <SettingsScreenHeader title="" variant="modal" />
      <View className="flex-1 justify-between px-4 pb-2">
        <View>
          <Text className="pt-2 text-2xl font-bold text-foreground">
            Upgrade to Pro
          </Text>
          <Text variant="muted" className="mt-2 leading-5">
            Wants is free with one active want at a time. Pro unlocks unlimited
            items, custom delays, and premium themes. Choose a monthly, annual,
            or lifetime plan to unlock the full experience.
          </Text>
          <View className="mt-4 gap-6">
            <Tabs
              value={selectedPlanId}
              onValueChange={(value) =>
                setSelectedPlanId(value as PaywallPlanId)
              }
            >
              <TabsList className="w-full">
                {PAYWALL_PLANS.map((plan) => (
                  <TabsTrigger key={plan.id} value={plan.id} className="flex-1">
                    <Text className="text-sm font-medium">{plan.tabLabel}</Text>
                  </TabsTrigger>
                ))}
              </TabsList>

              {PAYWALL_PLANS.map((plan) => (
                <TabsContent key={plan.id} value={plan.id}>
                  <View className="mt-4 items-start">
                    <PlanDetails plan={plan} />
                  </View>
                </TabsContent>
              ))}
            </Tabs>

            <View className="items-start gap-2">
              <Button
                size="lg"
                className="self-start rounded-2xl px-8"
                disabled={purchasing}
                onPress={() => void handlePurchase()}
              >
                <Text className="text-base font-semibold">
                  {selectedPlan.ctaLabel}
                </Text>
              </Button>
            </View>
          </View>
        </View>

        <PaywallLegalFooter />
      </View>
    </SafeAreaView>
  );
}

import { SettingsScreenHeader } from "@/components/settings/settings-screen-shell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from "@/constants/legal-links";
import { usePurchases } from "@/contexts/purchases-context";
import { openLegalLink } from "@/lib/open-legal-link";
import {
  buildPaywallPlans,
  getPaywallPlanDisplay,
  type PaywallPlanDisplay,
} from "@/lib/paywall-offerings";
import {
  DEFAULT_PLAN_ID,
  type PaywallPlanId,
} from "@/lib/paywall-placeholder-offerings";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, View } from "react-native";
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

function PlanDetails({
  plan,
  loading,
}: {
  plan: PaywallPlanDisplay;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Text variant="muted" className="text-sm leading-5">
        Loading prices…
      </Text>
    );
  }

  if (!plan.priceString) {
    return (
      <Text variant="muted" className="text-sm leading-5">
        Price unavailable
      </Text>
    );
  }

  return (
    <>
      <Text className="text-5xl font-bold leading-none text-foreground tracking-tighter">
        {plan.priceString}
      </Text>
      {plan.priceDescription ? (
        <Text variant="muted" className="mt-1 text-sm leading-5">
          {plan.priceDescription}
        </Text>
      ) : null}
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
  const { offerings, loading, purchase } = usePurchases();
  const [selectedPlanId, setSelectedPlanId] =
    useState<PaywallPlanId>(DEFAULT_PLAN_ID);
  const [purchasing, setPurchasing] = useState(false);

  const plans = useMemo(() => buildPaywallPlans(offerings), [offerings]);
  const selectedPlan = getPaywallPlanDisplay(plans, selectedPlanId);
  const ctaDisabled = purchasing || loading || !selectedPlan.pkg;

  async function handlePurchase() {
    if (!selectedPlan.pkg) {
      return;
    }

    setPurchasing(true);
    try {
      const success = await purchase(selectedPlan.pkg);
      if (success) {
        router.back();
      }
    } catch {
      Alert.alert("Purchase failed", "Try again.");
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <SettingsScreenHeader title="" variant="modal" />
      <View className="flex-1 justify-between px-4 pb-2">
        <View>
          <Text className="pt-4 text-2xl font-bold text-foreground">
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
                {plans.map((plan) => (
                  <TabsTrigger key={plan.id} value={plan.id} className="flex-1">
                    <Text className="text-sm font-medium">{plan.tabLabel}</Text>
                  </TabsTrigger>
                ))}
              </TabsList>

              {plans.map((plan) => (
                <TabsContent key={plan.id} value={plan.id}>
                  <View className="mt-4 items-start">
                    <PlanDetails plan={plan} loading={loading} />
                  </View>
                </TabsContent>
              ))}
            </Tabs>

            <View className="items-start gap-2">
              <Button
                size="lg"
                className="self-start rounded-2xl px-8"
                disabled={ctaDisabled}
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

import { PaywallLegalFooter } from "@/components/legal/legal-links";
import { SettingsScreenHeader } from "@/components/settings/settings-screen-shell";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { usePurchases } from "@/contexts/purchases-context";
import { buildProOffering } from "@/lib/paywall-offerings";
import {
  PAYWALL_BODY,
  PAYWALL_CTA_LABEL,
  PAYWALL_HEADLINE,
} from "@/lib/paywall-placeholder-offerings";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaywallScreen() {
  const router = useRouter();
  const { offerings, loading, purchase } = usePurchases();
  const [purchasing, setPurchasing] = useState(false);

  const offering = useMemo(() => buildProOffering(offerings), [offerings]);
  const ctaDisabled = purchasing || loading || !offering.pkg;

  async function handlePurchase() {
    if (!offering.pkg) {
      return;
    }

    setPurchasing(true);
    try {
      const success = await purchase(offering.pkg);
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
            {PAYWALL_HEADLINE}
          </Text>
          <Text variant="muted" className="mt-2 leading-5">
            {PAYWALL_BODY}
          </Text>
          <View className="mt-6 items-start">
            {loading ? (
              <Text variant="muted" className="text-sm leading-5">
                Loading prices…
              </Text>
            ) : offering.priceString ? (
              <>
                <Text className="text-5xl font-bold leading-none text-foreground tracking-tighter">
                  {offering.priceString}
                </Text>
                {offering.priceDescription ? (
                  <Text variant="muted" className="mt-1 text-sm leading-5">
                    {offering.priceDescription}
                  </Text>
                ) : null}
              </>
            ) : (
              <Text variant="muted" className="text-sm leading-5">
                Price unavailable
              </Text>
            )}
          </View>
          <View className="mt-6 items-start">
            <Button
              size="lg"
              className="self-start rounded-2xl px-8"
              disabled={ctaDisabled}
              onPress={() => void handlePurchase()}
            >
              <Text className="text-base font-semibold">
                {PAYWALL_CTA_LABEL}
              </Text>
            </Button>
          </View>
        </View>

        <PaywallLegalFooter />
      </View>
    </SafeAreaView>
  );
}

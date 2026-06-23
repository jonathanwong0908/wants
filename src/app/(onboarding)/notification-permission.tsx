import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { OnboardingInfoRow } from "@/components/onboarding/onboarding-info-row";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { OnboardingStackedList } from "@/components/onboarding/onboarding-stacked-list";
import { useAppReady } from "@/contexts/app-ready-context";
import { formatCurrency } from "@/lib/money-format";
import { cn } from "@/lib/utils";
import { Image } from "expo-image";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Bell } from "lucide-react-native";
import { Alert } from "react-native";

const APP_ICON = require("@/assets/images/ios-icon.png");

const PLACEHOLDER_NOTIFICATION_ITEMS = [
  {
    id: 1,
    name: "Wireless headphones",
    price: 299,
    currency: "USD",
    delayHours: 72,
    notifyAt: new Date(),
  },
  {
    id: 2,
    name: "Coffee maker",
    price: 89,
    currency: "USD",
    delayHours: 24,
    notifyAt: new Date(),
  },
  {
    id: 3,
    name: "Bookshelf",
    price: 180,
    currency: "USD",
    delayHours: 168,
    notifyAt: new Date(),
  },
] as const;

function getPlaceholderNotificationTitle(itemName: string) {
  return `Still want ${itemName}?`;
}

function getPlaceholderNotificationBody(price: number, currency: string) {
  return `You added this ${formatCurrency(price, currency)}.`;
}

/**
 * PRD S4 — Notification permission. Marks onboarding complete on allow or deny.
 */
export default function NotificationPermissionScreen() {
  const { setOnboardingComplete } = useAppReady();

  async function handleAllowNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();
    setOnboardingComplete(true);

    if (status !== "granted") {
      Alert.alert("Notifications", "You can enable this in Settings later.", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
      return;
    }

    router.replace("/");
  }

  return (
    <OnboardingScreen
      ctaLabel="Allow notifications"
      onCtaPress={handleAllowNotifications}
      contentClassName="gap-12"
    >
      <OnboardingHeader
        icon={Bell}
        title="Get notified"
        description="We ping you when your wait is up so you don't have to remember anything."
      />
      <OnboardingStackedList
        items={PLACEHOLDER_NOTIFICATION_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={(item, _index, itemClassName) => (
          <OnboardingInfoRow
            title={getPlaceholderNotificationTitle(item.name)}
            description={getPlaceholderNotificationBody(
              item.price,
              item.currency
            )}
            className={cn("gap-1.5 border border-border", itemClassName)}
            leadingClassName="overflow-hidden bg-transparent rounded-2xl border border-border"
            descriptionClassName="leading-5"
            leading={
              <Image
                source={APP_ICON}
                style={{ width: 48, height: 48 }}
                contentFit="cover"
                accessibilityLabel="Wants"
              />
            }
          />
        )}
      />
    </OnboardingScreen>
  );
}

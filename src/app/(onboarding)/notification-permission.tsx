import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAppReady } from "@/contexts/app-ready-context";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView className="flex-1 bg-background px-4 gap-6">
      <View className="flex-1">
        <View className="justify-end flex-1 gap-2">
          <Text className="text-3xl font-bold tracking-tighter leading-8">
            We ping you when your wait is up so you don&apos;t have to remember
            anything.
          </Text>
        </View>
      </View>

      <Button className="w-full" size="lg" onPress={handleAllowNotifications}>
        <Text>Allow notifications</Text>
      </Button>
    </SafeAreaView>
  );
}

import { SettingsScreenShell } from "@/components/settings/settings-screen-shell";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { clearAllItems } from "@/db/mutations/clear-all-data";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

export default function SettingsDataScreen() {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);

  async function performClear() {
    setIsClearing(true);
    try {
      await clearAllItems();
      router.dismissAll();
    } catch (error) {
      Alert.alert(
        "Could not clear data",
        "Something went wrong. Please try again."
      );
      console.error("clearAllItems failed:", error);
    } finally {
      setIsClearing(false);
    }
  }

  function handleClearPress() {
    Alert.alert(
      "Clear all data?",
      "All logged wants and past decisions will be permanently deleted. This can't be undone. Your currency and default delay settings will be kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear all data",
          style: "destructive",
          onPress: () => void performClear(),
        },
      ]
    );
  }

  return (
    <SettingsScreenShell title="Data">
      <Text variant="muted" className="mt-4 leading-6">
        Remove all logged wants and decision history from this device. Your
        currency and default delay settings will not change.
      </Text>

      <View className="mt-6">
        <Button
          size="lg"
          variant="destructive"
          className="w-full rounded-2xl text-base font-medium"
          disabled={isClearing}
          onPress={handleClearPress}
        >
          <Text className="text-base font-medium">Clear all data</Text>
        </Button>
      </View>
    </SettingsScreenShell>
  );
}

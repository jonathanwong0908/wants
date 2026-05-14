import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Onboarding social proof — leads toward PRD S2 (“How it works”).
 * Wire Continue to the S2 route when that screen is implemented.
 */
export default function OnboardingSocialProofScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <View className="flex-1 justify-center">
        <Text className="text-center text-2xl font-semibold leading-8 text-foreground">
          Around 65% of impulse spenders regret a spur-of-the-moment purchase.
        </Text>
        <Text variant="muted" className="mt-8 text-center leading-6">
          Wants gives you a pause — log what you want, wait, then decide with a clear head.
        </Text>
        <Text variant="muted" className="mt-10 text-center text-xs">
          Up next: how Wants works
        </Text>
      </View>

      <Button
        className="w-full"
        size="lg"
        onPress={() => {
          Alert.alert(
            "Next step",
            "How it works will appear in the next onboarding update.",
            [{ text: "OK" }]
          );
        }}>
        <Text>Continue</Text>
      </Button>
    </SafeAreaView>
  );
}

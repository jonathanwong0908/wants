import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Onboarding social proof (PRD S2) → How it works (S3). */
export default function OnboardingSocialProofScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-4 gap-6">
      <View className="flex-1">
        <View className="justify-end flex-1 gap-2">
          <Text className="text-3xl font-bold tracking-tighter leading-8">
            Around 65% of impulse spenders regret a spur-of-the-moment purchase.
          </Text>
          <Text variant="muted" className="text-lg leading-6">
            Wants gives you a pause — log what you want, wait, then decide with
            a clear head.
          </Text>
        </View>
      </View>

      <Button
        className="w-full"
        size="lg"
        onPress={() => {
          router.push("/how-it-works");
        }}
      >
        <Text>Continue</Text>
      </Button>
    </SafeAreaView>
  );
}

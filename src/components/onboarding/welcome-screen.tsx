import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** PRD S1 — shared by `/` (first launch) and `/welcome` (deep link). */
export function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <View className="flex-1 justify-center">
        <Text variant="h1" className="text-center">
          Wants
        </Text>
        <Text variant="lead" className="mt-4 text-center text-foreground">
          Wait before you buy.
        </Text>
        <Text variant="muted" className="mt-6 text-center leading-6">
          Log what you want. Wait. See if you still need it.
        </Text>
      </View>

      <Button
        className="w-full"
        size="lg"
        onPress={() => {
          router.push("/social-proof");
        }}>
        <Text>Get started</Text>
      </Button>
    </SafeAreaView>
  );
}

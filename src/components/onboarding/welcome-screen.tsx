import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** PRD S1 — shared by `/` (first launch) and `/welcome` (deep link). */
export function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-4 gap-6">
      <View className="flex-1 ">
        <View className="justify-end flex-1 tracking-tighter">
          <Text className="text-3xl font-bold ">Wants</Text>
          <Text variant="muted" className="text-lg">
            Is it a need or a want?
          </Text>
        </View>
      </View>

      <Button
        className="w-full"
        size="lg"
        onPress={() => {
          router.push("/social-proof");
        }}
      >
        <Text>Get started</Text>
      </Button>
    </SafeAreaView>
  );
}

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function OnboardingWelcomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg text-neutral-800">Onboarding (placeholder)</Text>
      <Button
        variant="outline"
        onPress={() => {
          console.log("Button pressed");
        }}
      >
        <Text>Button</Text>
      </Button>
    </View>
  );
}

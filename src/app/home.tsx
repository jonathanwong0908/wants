import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAppReady } from "@/contexts/app-ready-context";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { setOnboardingComplete } = useAppReady();

  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-semibold text-foreground">Home</Text>
        <Text variant="muted" className="mt-2 text-center">
          Post-onboarding shell (PRD S5).
        </Text>
      </View>

      {__DEV__ ? (
        <Button
          variant="outline"
          className="mb-4 w-full"
          onPress={() => {
            setOnboardingComplete(false);
            router.replace("/");
          }}>
          <Text>Reset onboarding (dev)</Text>
        </Button>
      ) : null}
    </SafeAreaView>
  );
}

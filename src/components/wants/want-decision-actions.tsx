import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

type WantDecisionActionsProps = {
  isReady: boolean;
};

export function WantDecisionActions({ isReady }: WantDecisionActionsProps) {
  return (
    <View className="flex-row gap-3">
      <Button
        variant="destructive"
        size="lg"
        className="flex-1 rounded-2xl"
        disabled={!isReady}
        accessibilityLabel="Yeah, I'll buy it"
        onPress={() => {}}
      >
        <Text className="text-base font-medium">Buy it</Text>
      </Button>
      <Button
        variant="default"
        size="lg"
        className="flex-1 rounded-2xl"
        accessibilityLabel="Nope, I moved on"
        onPress={() => {}}
      >
        <Text className="text-base font-medium">Moved on</Text>
      </Button>
    </View>
  );
}

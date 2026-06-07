import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

type WantDecisionActionsProps = {
  onBuyPress: () => void;
  onMovedOn: () => void;
  isSkipping?: boolean;
  isBuying?: boolean;
};

export function WantDecisionActions({
  onBuyPress,
  onMovedOn,
  isSkipping = false,
  isBuying = false,
}: WantDecisionActionsProps) {
  const isBusy = isSkipping || isBuying;

  return (
    <View className="flex-row gap-3">
      <Button
        variant="destructive"
        size="lg"
        className="flex-1 rounded-2xl"
        disabled={isBusy}
        accessibilityLabel="Yeah, I'll buy it"
        onPress={onBuyPress}
      >
        <Text className="text-base font-medium">Buy it</Text>
      </Button>
      <Button
        variant="default"
        size="lg"
        className="flex-1 rounded-2xl"
        disabled={isBusy}
        accessibilityLabel="Nope, I moved on"
        onPress={onMovedOn}
      >
        <Text className="text-base font-medium">Moved on</Text>
      </Button>
    </View>
  );
}

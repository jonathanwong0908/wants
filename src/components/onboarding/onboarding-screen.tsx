import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type OnboardingScreenProps = {
  children: React.ReactNode;
  ctaLabel: string;
  onCtaPress: () => void;
  ctaDisabled?: boolean;
  contentClassName?: string;
  centered?: boolean;
  footnote?: string;
};

export function OnboardingScreen({
  children,
  ctaLabel,
  onCtaPress,
  ctaDisabled = false,
  contentClassName,
  centered = false,
  footnote,
}: OnboardingScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background px-4 gap-6 pt-16">
      <View className="flex-1">
        <View
          className={cn(
            "flex-1 tracking-tighter",
            contentClassName ?? "gap-6",
            centered && "items-center justify-center"
          )}
        >
          {children}
        </View>
      </View>

      <View className="gap-3">
        {footnote ? (
          <Text variant="muted" className="text-center text-xs leading-5 px-2">
            {footnote}
          </Text>
        ) : null}
        <Button
          className="w-full"
          size="lg"
          onPress={onCtaPress}
          disabled={ctaDisabled}
        >
          <Text>{ctaLabel}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

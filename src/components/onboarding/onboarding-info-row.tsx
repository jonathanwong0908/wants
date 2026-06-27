import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { View } from "react-native";

type OnboardingInfoRowProps = {
  title: string;
  description: string;
  leading: React.ReactNode;
  className?: string;
  leadingClassName?: string;
  descriptionClassName?: string;
};

export function OnboardingInfoRow({
  title,
  description,
  leading,
  className,
  leadingClassName,
  descriptionClassName,
}: OnboardingInfoRowProps) {
  return (
    <View
      className={cn(
        "flex-row items-center gap-2.5 bg-muted rounded-2xl pr-4 pl-3 py-3",
        className
      )}
    >
      <View
        className={cn(
          "h-12 w-12 items-center justify-center bg-card rounded-full",
          leadingClassName
        )}
      >
        {leading}
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold">{title}</Text>
        <Text
          variant="muted"
          className={cn("text-sm leading-6", descriptionClassName)}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

import { cn } from "@/lib/utils";
import { View } from "react-native";

const STACKED_ITEM_WIDTH_CLASSES = [
  "w-full",
  "w-[95%] self-center",
  "w-[90%] self-center",
] as const;

const STACKED_ITEM_MARGIN_CLASSES = ["mt-0", "-mt-1", "-mt-2"] as const;

const STACKED_ITEM_Z_INDEX_CLASSES = ["z-30", "z-20", "z-10"] as const;

const STACKED_ITEM_OPACITY_CLASSES = [
  "opacity-100",
  "opacity-75",
  "opacity-50",
] as const;

export function getOnboardingStackedItemClassName(index: number) {
  return cn(
    STACKED_ITEM_WIDTH_CLASSES[index] ??
      STACKED_ITEM_WIDTH_CLASSES[STACKED_ITEM_WIDTH_CLASSES.length - 1],
    STACKED_ITEM_MARGIN_CLASSES[index] ??
      STACKED_ITEM_MARGIN_CLASSES[STACKED_ITEM_MARGIN_CLASSES.length - 1],
    STACKED_ITEM_Z_INDEX_CLASSES[index] ??
      STACKED_ITEM_Z_INDEX_CLASSES[STACKED_ITEM_Z_INDEX_CLASSES.length - 1],
    STACKED_ITEM_OPACITY_CLASSES[index] ??
      STACKED_ITEM_OPACITY_CLASSES[STACKED_ITEM_OPACITY_CLASSES.length - 1]
  );
}

type OnboardingStackedListProps<T> = {
  items: readonly T[];
  keyExtractor: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number, itemClassName: string) => React.ReactNode;
  className?: string;
};

export function OnboardingStackedList<T>({
  items,
  keyExtractor,
  renderItem,
  className,
}: OnboardingStackedListProps<T>) {
  return (
    <View className={cn("flex-1", className)}>
      {items.map((item, index) => (
        <View key={keyExtractor(item, index)}>
          {renderItem(item, index, getOnboardingStackedItemClassName(index))}
        </View>
      ))}
    </View>
  );
}

import { ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function FieldContainer({ children, className }: Props) {
  return (
    <View
      className={cn(
        "min-h-12 justify-center overflow-hidden rounded-2xl border border-border bg-input shadow-md shadow-black/5",
        className
      )}
    >
      {children}
    </View>
  );
}

type FieldContainerItemProps = {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
};

export function FieldContainerItem({
  children,
  className,
  onPress,
}: FieldContainerItemProps) {
  const Comp = onPress ? Pressable : View;

  return (
    <Comp
      className={cn(
        "h-12 flex-row items-center justify-between gap-2 px-4 py-1",
        onPress && "active:bg-primary/5",
        className
      )}
      onPress={onPress}
    >
      <View className="flex-1">{children}</View>
      {onPress && (
        <ChevronRight size={16} color="#9CA3AF" />
      )}
    </Comp>
  );
}

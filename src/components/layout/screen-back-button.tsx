import { NavigationBackIcon } from "@/components/layout/navigation-back-icon";
import { Button } from "@/components/ui/button";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import { useColorScheme } from "react-native";

type ScreenBackButtonProps = {
  variant?: "modal" | "stack";
  onPress?: () => void;
  accessibilityLabel?: string;
  className?: string;
};

export function ScreenBackButton({
  variant = "stack",
  onPress,
  accessibilityLabel,
  className,
}: ScreenBackButtonProps) {
  const router = useRouter();
  const palette = THEME[useColorScheme() === "dark" ? "dark" : "light"];
  const isModal = variant === "modal";

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(className)}
      onPress={onPress ?? (() => router.back())}
      accessibilityLabel={
        accessibilityLabel ?? (isModal ? "Close" : "Back")
      }
    >
      {isModal ? (
        <ChevronDown
          size={24}
          color={palette.foreground}
          strokeWidth={1.5}
        />
      ) : (
        <NavigationBackIcon color={palette.foreground} />
      )}
    </Button>
  );
}

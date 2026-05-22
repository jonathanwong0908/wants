import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

type NavigationBackIconProps = {
  color: string;
  size?: number;
};

export function NavigationBackIcon({ color, size = 22 }: NavigationBackIconProps) {
  return <HugeiconsIcon icon={ArrowLeft01Icon} size={size} color={color} strokeWidth={1.5} />;
}

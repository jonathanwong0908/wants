import { ArrowLeft } from "lucide-react-native";

type NavigationBackIconProps = {
  color: string;
  size?: number;
};

export function NavigationBackIcon({ color, size = 22 }: NavigationBackIconProps) {
  return <ArrowLeft size={size} color={color} strokeWidth={1.5} />;
}

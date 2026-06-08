import { useTheme } from "@/contexts/theme-context";
import { View, type ViewProps } from "react-native";

type Props = ViewProps & {
  children: React.ReactNode;
};

export function ThemeRoot({ children, style, ...props }: Props) {
  const { themeStyle } = useTheme();

  if (themeStyle == null) {
    return (
      <View className="flex-1 bg-background" style={style} {...props}>
        {children}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={[themeStyle, style]} {...props}>
      {children}
    </View>
  );
}

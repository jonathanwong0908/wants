import { useTheme } from "@/contexts/theme-context";
import { vars } from "nativewind";
import { View, type ViewProps } from "react-native";

/** Keep CSS vars on ThemeRoot from first paint so NativeWind never upgrades/remounts the navigator wrapper. */
const DEFAULT_THEME_STYLE = vars({});

type Props = ViewProps & {
  children: React.ReactNode;
};

export function ThemeRoot({ children, style, ...props }: Props) {
  const { themeStyle } = useTheme();

  return (
    <View
      className="flex-1 bg-background"
      style={[themeStyle ?? DEFAULT_THEME_STYLE, style]}
      {...props}
    >
      {children}
    </View>
  );
}

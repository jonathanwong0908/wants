import { useThemePalette } from "@/hooks/use-theme-palette";
import { View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

function Dot({
  index,
  activeIndex,
  activeColor,
  inactiveColor,
}: {
  index: number;
  activeIndex: SharedValue<number>;
  activeColor: string;
  inactiveColor: string;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = withTiming(
      activeIndex.get() === index ? activeColor : inactiveColor,
      { duration: 200 }
    );
    return { backgroundColor };
  });

  return <Animated.View className="h-2 w-2 rounded-full" style={animatedStyle} />;
}

/** Pagination dots driven by a Reanimated shared carousel index (see PRD S3). */
export function OnboardingDots({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: SharedValue<number>;
}) {
  const palette = useThemePalette();

  return (
    <View className="flex-row items-center justify-center gap-2 py-2">
      {Array.from({ length: count }, (_, index) => (
        <Dot
          key={index}
          index={index}
          activeIndex={activeIndex}
          activeColor={palette.primary}
          inactiveColor={palette.border}
        />
      ))}
    </View>
  );
}

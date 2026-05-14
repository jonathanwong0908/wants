import { View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

/** Light-theme tokens aligned with `src/global.css` (primary / muted indicator). */
const DOT_ACTIVE = "hsl(0, 0%, 9%)";
const DOT_INACTIVE = "hsl(0, 0%, 75%)";

function Dot({
  index,
  activeIndex,
}: {
  index: number;
  activeIndex: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = withTiming(
      activeIndex.get() === index ? DOT_ACTIVE : DOT_INACTIVE,
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
  return (
    <View className="flex-row items-center justify-center gap-2 py-2">
      {Array.from({ length: count }, (_, index) => (
        <Dot key={index} index={index} activeIndex={activeIndex} />
      ))}
    </View>
  );
}

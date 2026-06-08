import { OnboardingDots } from "@/components/onboarding/onboarding-dots";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type Step = {
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    title: "Log it",
    description: "Add the item and a waiting period.",
  },
  {
    title: "We remind you",
    description: "After the delay, we send a notification.",
  },
  {
    title: "Decide",
    description:
      "Still want it? Buy guilt-free. Changed your mind? Watch your savings grow.",
  },
];

function StepPage({ step, width }: { step: Step; width: number }) {
  return (
    <View style={{ width }} className="flex-1 justify-center px-1">
      <View className="items-center">
        {/* Stacked card depth — top cards are decorative (alma-style), no extra deps */}
        <View
          className="absolute w-[88%] self-center rounded-[28px] bg-muted"
          style={[styles.stackCard, { top: 56, height: 220, opacity: 0.55 }]}
        />
        <View
          className="absolute w-[92%] self-center rounded-[30px] border border-border bg-card"
          style={[styles.stackCard, { top: 32, height: 240, opacity: 0.85 }]}
        />
        <View
          className="w-[96%] rounded-[32px] border border-border bg-card px-8 py-10 shadow-sm shadow-black/5"
          style={styles.stackCard}
        >
          <Text variant="h3" className="text-center">
            {step.title}
          </Text>
          <Text variant="muted" className="mt-5 text-center leading-6">
            {step.description}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function HowItWorksScreen() {
  const { width } = useWindowDimensions();
  const listRef = useRef<Animated.FlatList<Step> | null>(null);
  const [uiIndex, setUiIndex] = useState(0);
  const activeIndex = useSharedValue(0);
  const lastIndex = STEPS.length - 1;

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        const offsetX = event.contentOffset.x;
        activeIndex.set(Math.floor(offsetX / width + 0.5));
      },
    },
    [width]
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const next = Math.round(x / width);
      setUiIndex(Math.min(Math.max(next, 0), lastIndex));
    },
    [width, lastIndex]
  );

  const goNextOrFinish = useCallback(() => {
    if (uiIndex < lastIndex) {
      const next = uiIndex + 1;
      listRef.current?.scrollToIndex({
        index: next,
        animated: true,
      });
      setUiIndex(next);
      activeIndex.set(next);
      return;
    }
    router.push("/notification-permission");
  }, [activeIndex, lastIndex, uiIndex]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <Animated.FlatList
          ref={listRef}
          data={STEPS}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => <StepPage step={item} width={width} />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onMomentumScrollEnd}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          initialNumToRender={STEPS.length}
          windowSize={3}
        />
      </View>

      <View className="px-4 gap-4">
        <OnboardingDots count={STEPS.length} activeIndex={activeIndex} />
        <Button className="w-full" size="lg" onPress={goNextOrFinish}>
          <Text>{uiIndex < lastIndex ? "Next" : "Continue"}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stackCard: {
    borderCurve: "continuous",
  },
});

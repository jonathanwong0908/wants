import { useEffect, useMemo, useRef } from "react";
import { Animated, View } from "react-native";

const ITEM_HEIGHT = 64;
const PICKER_HEIGHT = ITEM_HEIGHT * 3;

export type PickerItem = { label: string; key: string; index: string };

const Item = ({
  opacity,
  item,
}: {
  opacity: Animated.AnimatedInterpolation<string | number>;
  item: PickerItem;
}) => {
  return (
    <View
      className="w-full items-center justify-center"
      style={{
        height: ITEM_HEIGHT,
      }}
    >
      <Animated.Text
        className="font-semibold tracking-tighter"
        style={{ opacity, fontSize: ITEM_HEIGHT / 2 }}
      >
        {item.label}
      </Animated.Text>
    </View>
  );
};

type CustomPickerProps = {
  data: PickerItem[];
  value: string | undefined;
  onChange?: (item: PickerItem) => void;
  scrollEnabled?: boolean;
};

const CustomPicker = ({
  data,
  value,
  onChange,
  scrollEnabled = true,
}: CustomPickerProps) => {
  const flatListRef = useRef<Animated.FlatList<PickerItem>>(null);

  const safeInitialIndex = useMemo(() => {
    const initialIndex = data.findIndex((item) => item.index === value);
    return initialIndex >= 0 ? initialIndex : 0;
  }, [value, data]);

  const animatedValueRef = useRef<Animated.Value | null>(null);
  if (animatedValueRef.current === null) {
    animatedValueRef.current = new Animated.Value(
      safeInitialIndex * ITEM_HEIGHT
    );
  }
  const animatedValue = animatedValueRef.current;

  const lastIndexRef = useRef(safeInitialIndex);

  useEffect(() => {
    if (!onChange) {
      return;
    }

    const listenerId = animatedValue.addListener(({ value: y }) => {
      const yClamped = Math.max(
        Math.min(y, ITEM_HEIGHT * (data.length - 1)),
        0
      );
      const i = Math.floor(yClamped / ITEM_HEIGHT);
      if (i !== lastIndexRef.current && data[i]) {
        lastIndexRef.current = i;
        onChange(data[i]);
      }
    });

    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [data, onChange, animatedValue]);

  return (
    <Animated.FlatList
      ref={flatListRef}
      scrollEnabled={scrollEnabled}
      data={data}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: animatedValue } } }],
        {
          useNativeDriver: true,
        }
      )}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      keyExtractor={(item) => item.key}
      style={{ height: PICKER_HEIGHT, flexGrow: 0, width: "100%" }}
      contentContainerStyle={{
        paddingVertical: PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2,
      }}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      renderItem={({ item, index }) => {
        const opacity = Animated.divide(animatedValue, ITEM_HEIGHT).interpolate(
          {
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.15, 1, 0.15],
          }
        );
        return <Item opacity={opacity} item={item} />;
      }}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      initialScrollIndex={safeInitialIndex}
    />
  );
};

export function Picker(props: CustomPickerProps) {
  return (
    <View className="relative w-full flex-row">
      <CustomPicker {...props} />
      <View
        className="absolute left-0 -z-10 w-full rounded-2xl bg-secondary"
        style={{ height: ITEM_HEIGHT, top: ITEM_HEIGHT }}
      />
    </View>
  );
}

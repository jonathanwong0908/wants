import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import type { ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ItemFormScrollView(props: ScrollViewProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <KeyboardAwareScrollView
      extraKeyboardSpace={-bottom}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...props}
    />
  );
}

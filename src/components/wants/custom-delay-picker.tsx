import { Picker } from "@/components/common/picker";
import { ScreenBackButton } from "@/components/layout/screen-back-button";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { formatNotifyAtDateTime } from "@/lib/date-format";
import {
  computeNotifyAt,
  delayHoursFromDays,
  initialCustomPickerDays,
  MAX_CUSTOM_DAYS,
} from "@/lib/forms/item-form-schema";
import { formatDelayHours } from "@/lib/want-format";
import { useEffect, useMemo, useState } from "react";
import { Modal, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DAY_OPTIONS = Array.from(
  { length: MAX_CUSTOM_DAYS },
  (_, index) => index + 1
);

type CustomDelayPickerProps = {
  visible: boolean;
  initialDelayHours: number;
  onConfirm: (delayHours: number) => void;
  onCancel: () => void;
  showDecideOnPreview?: boolean;
};

export function CustomDelayPicker({
  visible,
  initialDelayHours,
  onConfirm,
  onCancel,
  showDecideOnPreview = true,
}: CustomDelayPickerProps) {
  const initialDays = useMemo(
    () => initialCustomPickerDays(initialDelayHours),
    [initialDelayHours]
  );
  const [days, setDays] = useState(initialDays);

  const pickerData = useMemo(
    () =>
      DAY_OPTIONS.map((day) => ({
        key: String(day),
        index: String(day),
        label: formatDelayHours(delayHoursFromDays(day)),
      })),
    []
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDays(initialCustomPickerDays(initialDelayHours));
  }, [visible, initialDelayHours]);

  const computedHours = delayHoursFromDays(days);

  function handleConfirm() {
    onConfirm(computedHours);
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
      onRequestClose={onCancel}
    >
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
        <View className="flex-row items-center justify-between px-5 py-5">
          <View className="flex-1 flex-row items-center gap-2">
            <ScreenBackButton
              variant="modal"
              onPress={onCancel}
              accessibilityLabel="Cancel custom delay"
              className="mr-1"
            />
            <Text className="text-xl font-bold text-foreground">
              Custom delay
            </Text>
          </View>
          <Button onPress={handleConfirm} className="rounded-full">
            <Text className="text-base font-medium">Save</Text>
          </Button>
        </View>

        <View className="px-5 pt-2">
          <View className="mt-4">
            {visible ? (
              <Picker
                key={initialDelayHours}
                data={pickerData}
                value={String(initialCustomPickerDays(initialDelayHours))}
                onChange={(item) => setDays(Number(item.index))}
              />
            ) : null}
          </View>

          {showDecideOnPreview ? (
            <View className="mt-6 rounded-xl bg-muted/40 px-4 py-4">
              <Text variant="metaStrong">Decide on</Text>
              <Text className="mt-1 text-lg font-semibold text-foreground">
                {formatNotifyAtDateTime(
                  computeNotifyAt(new Date(), computedHours)
                )}
              </Text>
              <Text variant="muted" className="mt-1 text-sm">
                {formatDelayHours(computedHours)} from now
              </Text>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
